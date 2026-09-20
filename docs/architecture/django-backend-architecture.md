# Centralized Django Backend Architecture Specification

This document details the centralized architecture for the **Django REST Framework** backend of **SeismoAtlas**. 

To maintain clean separation of concerns, DRY (Don't Repeat Yourself) principles, and consistent design across all domain applications (`earthquakes`, `locations`, `hazard`, `scientific`, etc.), all shared infrastructure—including base models, role-based access control (RBAC), standardized pagination, base service layers, exception handling, custom renderers, and utilities—is centralized within a dedicated `core/` package.

---

## 1. Directory & Package Layout

```text
backend/
├── config/                      # Project Configuration & Settings
│   ├── settings/
│   │   ├── base.py              # Shared settings
│   │   ├── local.py             # Development settings
│   │   └── production.py        # Production settings (SSL, CORS, Celery, DB pool)
│   ├── urls.py                  # Global URL routing
│   ├── wsgi.py
│   ├── asgi.py
│   └── celery.py                # Celery app initialization
│
├── core/                        # CENTRALIZED CORE INFRASTRUCTURE
│   ├── models/                  # Base models & mixins (UUID, Timestamp, Audit)
│   ├── permissions/             # Role-Based Access Control (RBAC) & Custom DRF Permissions
│   ├── pagination/              # Standardized API & GeoJSON Pagination classes
│   ├── services/                # Base Business Logic & Query Service primitives
│   ├── exceptions/              # Centralized Exception Handler & API Error Envelopes
│   ├── renderers/               # Standardized API Response Envelope Renderers
│   ├── middleware/              # Request ID tracking, SSRF guard, audit logs
│   └── utils/                   # Spatial, hashing, datetime & validation helpers
│
├── apps/                        # DOMAIN-SPECIFIC APPLICATIONS (Thin Views, Service-Driven)
│   ├── authentication/          # User Accounts, Roles, JWT Token handling
│   ├── earthquakes/             # Earthquake catalog, detail views, spatial search
│   ├── locations/               # Location search, city profiles, spatial queries
│   ├── tectonics/               # Plates, faults, seismic source layers
│   ├── hazard/                  # PSHA models, hazard maps, curves, PGA datasets
│   ├── scientific/              # OpenQuake calculation job runner & tracking
│   ├── datasets/                # Catalog dataset versioning & metadata
│   └── provenance/              # Source citations & scientific metadata
│
├── workers/                     # Celery Background Worker Tasks
│   ├── ingestion_tasks.py
│   └── scientific_tasks.py
│
└── tests/                       # Global & Integration Test Suites
```

---

## 2. Centralized Core Components (`core/`)

### 2.1 Centralized Base Models (`core/models/`)

All domain models inherit from standard abstract base classes to guarantee consistent ID formatting, timestamps, soft-deletions, and audit trails.

```python
# core/models/base.py
import uuid
from django.db import models

class UUIDModel(models.Model):
    """Abstract model using UUID v4 as primary key."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True

class TimeStampedModel(UUIDModel):
    """Abstract model providing automatic timestamp tracking."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class AuditModel(TimeStampedModel):
    """Abstract model tracking creator and modifier user references."""
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created'
    )
    updated_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated'
    )

    class Meta:
        abstract = True
```

---

### 2.2 Centralized Role-Based Access Control (RBAC) & Permissions (`core/permissions/`)

System access is governed by centralized Role definitions and fine-grained DRF permission classes.

#### Role Definition Enum
- **`PUBLIC`**: Read-only access to historical earthquakes, hazard maps, and location pages.
- **`ANALYST`**: Access to advanced query APIs, data export endpoints, and comparison tools.
- **`RESEARCHER`**: Authorized to dispatch custom OpenQuake hazard calculations.
- **`ADMIN`**: Full administrative access to dataset ingestion, model registry, and worker pools.

```python
# core/permissions/rbac.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class RoleBasedPermission(BasePermission):
    """
    Centralized DRF permission class evaluating user roles against view requirements.
    """
    allowed_roles = []

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.role == 'ADMIN':
            return True
        return request.user.role in getattr(view, 'required_roles', self.allowed_roles)

class IsScientificResearcherOrReadOnly(RoleBasedPermission):
    allowed_roles = ['RESEARCHER', 'ADMIN']

class IsAdminUserOnly(RoleBasedPermission):
    allowed_roles = ['ADMIN']
```

---

### 2.3 Centralized Standard Pagination (`core/pagination/`)

To guarantee identical API paginated responses across all domain resources, pagination is standardized in `core/pagination/`.

#### Standard Envelope Pagination
```python
# core/pagination/standard.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardEnvelopePagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 500

    def get_paginated_response(self, data):
        return Response({
            "data": data,
            "meta": {
                "page": self.page.number,
                "page_size": self.get_page_size(self.request),
                "total_pages": self.page.paginator.num_pages,
                "total_records": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link()
            },
            "errors": []
        })
```

#### GeoJSON FeatureCollection Pagination
```python
# core/pagination/geojson.py
from rest_framework_gis.pagination import GeoJsonPagination

class StandardGeoJSONPagination(GeoJsonPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000
```

---

### 2.4 Centralized Service Pattern (`core/services/`)

Views in SeismoAtlas remain thin and declarative. All business logic, transaction handling (`@transaction.atomic`), and spatial query filtering reside within centralized Service classes.

```python
# core/services/base.py
import logging
from django.db import transaction

logger = logging.getLogger(__name__)

class BaseService:
    """Abstract base service for transactional business logic operations."""
    
    @classmethod
    def execute_in_transaction(cls, func, *args, **kwargs):
        with transaction.atomic():
            return func(*args, **kwargs)

class BaseQueryService:
    """Abstract base query service for standardized spatial & temporal filtering."""
    model = None

    @classmethod
    def get_queryset(cls):
        if cls.model is None:
            raise NotImplementedError("Service must define a 'model' attribute.")
        return cls.model.objects.all()
```

---

### 2.5 Centralized Exception Handling & Renderers (`core/exceptions/`, `core/renderers/`)

#### Global Exception Handler
Converts unhandled exceptions, Django validation errors, and DRF HTTP errors into a predictable JSON array structure:

```python
# core/exceptions/handler.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        formatted_errors = []
        if isinstance(response.data, dict):
            for key, value in response.data.items():
                detail = value[0] if isinstance(value, list) else value
                formatted_errors.append({"field": key, "message": str(detail)})
        elif isinstance(response.data, list):
            for item in response.data:
                formatted_errors.append({"message": str(item)})
        else:
            formatted_errors.append({"message": str(response.data)})

        response.data = {
            "data": None,
            "meta": {},
            "errors": formatted_errors
        }
    else:
        logger.error(f"Unhandled Server Error: {exc}", exc_info=True)
        response = Response({
            "data": None,
            "meta": {},
            "errors": [{"message": "An internal server error occurred."}]
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
```

#### Standard Response Renderer
```python
# core/renderers/envelope.py
from rest_framework.renderers import JSONRenderer

class StandardEnvelopeJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is not None and not isinstance(data, dict) or ("data" not in data and "errors" not in data):
            data = {
                "data": data,
                "meta": {},
                "errors": []
            }
        return super().render(data, accepted_media_type, renderer_context)
```

---

### 2.6 Centralized Utilities (`core/utils/`)

Provides reusable spatial, hashing, and date utilities:

```python
# core/utils/geo.py
from django.contrib.gis.geos import Polygon

def build_bbox_polygon(min_lon: float, min_lat: float, max_lon: float, max_lat: float) -> Polygon:
    """Builds a PostGIS 4326 SRID Polygon from bounding box parameters."""
    return Polygon.from_bbox((min_lon, min_lat, max_lon, max_lat))

# core/utils/hashing.py
import hashlib
import json

def calculate_config_hash(config_dict: dict) -> str:
    """Generates a SHA-256 hash string for model calculation configuration dicts."""
    encoded = json.dumps(config_dict, sort_keys=True).encode('utf-8')
    return hashlib.sha256(encoded).hexdigest()
```

---

## 4. Modular Folder-Wise Domain App Pattern

To prevent Django apps from degenerating into single bloated files (`models.py`, `views.py`, `serializers.py`), every domain application in SeismoAtlas follows a **modular package structure**.

### 4.1 Folder & File Hierarchy (`apps/earthquakes/`)

```text
apps/earthquakes/
├── __init__.py
├── apps.py                      # Django AppConfig definition
├── admin.py                     # Django Admin registrations
├── urls.py                      # DRF Router & Endpoint mappings
│
├── models/                      # MODELS PACKAGE
│   ├── __init__.py              # Re-exports all models for easy imports
│   ├── earthquake.py            # Primary Canonical Earthquake model (inherits TimeStampedModel)
│   ├── source_record.py         # Contributing network records (USGS, EMSC, JMA)
│   └── payload.py               # Immutable raw JSON payload archive metadata
│
├── serializers/                 # SERIALIZERS PACKAGE
│   ├── __init__.py              # Re-exports serializers
│   ├── list.py                  # Lightweight list serializer for map rendering
│   ├── detail.py                # Full event detail serializer with provenance
│   └── query_params.py          # Bounding Box & query validation serializer
│
├── views/                       # VIEWS PACKAGE
│   ├── __init__.py              # Re-exports ViewSets
│   ├── list.py                  # ViewSet handling map bounding box queries & filtering
│   ├── detail.py                # ViewSet handling single event details & products
│   └── statistics.py            # ViewSet for magnitude/depth distribution charts
│
├── services/                    # SERVICES PACKAGE (Business Logic & Transactions)
│   ├── __init__.py              # Re-exports Services
│   ├── query.py                 # PostGIS spatial bounding box & temporal query service
│   ├── deduplication.py         # Multi-network spatial-temporal deduplication engine
│   └── export.py                # GeoJSON & CSV payload builder
│
├── selectors/                   # SELECTORS PACKAGE (Read-Only Aggregations)
│   ├── __init__.py
│   └── statistics_selector.py   # Database aggregations for magnitude/depth charts
│
├── filters/                     # FILTERS PACKAGE
│   ├── __init__.py
│   └── earthquake_filter.py     # Custom django-filter spatial FilterSet
│
└── tests/                       # TESTS PACKAGE
    ├── __init__.py
    ├── test_models.py
    ├── test_views.py
    ├── test_services.py
    └── test_serializers.py
```

---

### 4.2 Code Implementation Standard by File

#### 1. Models Package (`apps/earthquakes/models/`)

```python
# apps/earthquakes/models/__init__.py
from .earthquake import Earthquake
from .source_record import EarthquakeSourceRecord
from .payload import RawPayloadArchive

__all__ = ['Earthquake', 'EarthquakeSourceRecord', 'RawPayloadArchive']
```

```python
# apps/earthquakes/models/earthquake.py
from django.contrib.gis.db import models
from core.models.base import TimeStampedModel

class Earthquake(TimeStampedModel):
    external_id = models.CharField(max_length=255, unique=True, db_index=True)
    origin_time = models.DateTimeField(db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    depth_km = models.DecimalField(max_digits=6, decimal_places=2, db_index=True)
    magnitude = models.DecimalField(max_digits=3, decimal_places=1, db_index=True)
    magnitude_type = models.CharField(max_length=10)
    location_name = models.CharField(max_length=255, blank=True)
    region = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=100, db_index=True)
    catalog_version = models.CharField(max_length=50)
    geom = models.PointField(srid=4326, spatial_index=True)

    class Meta:
        db_table = 'earthquakes'
        ordering = ['-origin_time']
```

---

#### 2. Serializers Package (`apps/earthquakes/serializers/`)

```python
# apps/earthquakes/serializers/__init__.py
from .list import EarthquakeListSerializer
from .detail import EarthquakeDetailSerializer
from .query_params import EarthquakeQueryParamsSerializer

__all__ = [
    'EarthquakeListSerializer',
    'EarthquakeDetailSerializer',
    'EarthquakeQueryParamsSerializer'
]
```

```python
# apps/earthquakes/serializers/list.py
from rest_framework import serializers
from apps.earthquakes.models import Earthquake

class EarthquakeListSerializer(serializers.ModelSerializer):
    """Lightweight serializer optimized for fast map marker & list rendering."""
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    magnitude = serializers.FloatField()
    depth_km = serializers.FloatField()

    class Meta:
        model = Earthquake
        fields = [
            'id',
            'external_id',
            'origin_time',
            'latitude',
            'longitude',
            'depth_km',
            'magnitude',
            'magnitude_type',
            'location_name',
            'source'
        ]
```

---

#### 3. Services Package (`apps/earthquakes/services/`)

```python
# apps/earthquakes/services/__init__.py
from .query import EarthquakeQueryService

__all__ = ['EarthquakeQueryService']
```

```python
# apps/earthquakes/services/query.py
from core.services.base import BaseQueryService
from core.utils.geo import build_bbox_polygon
from apps.earthquakes.models import Earthquake

class EarthquakeQueryService(BaseQueryService):
    model = Earthquake

    @classmethod
    def filter_by_bbox_and_params(cls, params: dict):
        qs = cls.get_queryset()

        # Bounding box spatial filter
        if all(k in params for k in ('min_lon', 'min_lat', 'max_lon', 'max_lat')):
            bbox = build_bbox_polygon(
                float(params['min_lon']),
                float(params['min_lat']),
                float(params['max_lon']),
                float(params['max_lat'])
            )
            qs = qs.filter(geom__within=bbox)

        # Attribute filters
        if 'min_magnitude' in params:
            qs = qs.filter(magnitude__gte=float(params['min_magnitude']))
        if 'max_depth' in params:
            qs = qs.filter(depth_km__lte=float(params['max_depth']))
        if 'start_time' in params:
            qs = qs.filter(origin_time__gte=params['start_time'])
        if 'end_time' in params:
            qs = qs.filter(origin_time__lte=params['end_time'])

        return qs
```

---

#### 4. Views Package (`apps/earthquakes/views/`)

```python
# apps/earthquakes/views/__init__.py
from .list import EarthquakeListViewSet
from .detail import EarthquakeDetailViewSet

__all__ = ['EarthquakeListViewSet', 'EarthquakeDetailViewSet']
```

```python
# apps/earthquakes/views/list.py
from rest_framework import viewsets
from core.permissions.rbac import RoleBasedPermission
from core.pagination.standard import StandardEnvelopePagination
from apps.earthquakes.serializers import EarthquakeListSerializer, EarthquakeQueryParamsSerializer
from apps.earthquakes.services import EarthquakeQueryService

class EarthquakeListViewSet(viewsets.ReadOnlyModelViewSet):
    """Handles global earthquake catalog listing and spatial bounding box queries."""
    serializer_class = EarthquakeListSerializer
    permission_classes = [RoleBasedPermission]
    pagination_class = StandardEnvelopePagination

    def get_queryset(self):
        query_serializer = EarthquakeQueryParamsSerializer(data=self.request.query_params)
        query_serializer.is_valid(raise_exception=True)
        return EarthquakeQueryService.filter_by_bbox_and_params(query_serializer.validated_data)
```

---

#### 5. App Router Setup (`apps/earthquakes/urls.py`)

```python
# apps/earthquakes/urls.py
from rest_framework.routers import DefaultRouter
from apps.earthquakes.views import EarthquakeListViewSet, EarthquakeDetailViewSet

router = DefaultRouter()
router.register(r'earthquakes', EarthquakeListViewSet, basename='earthquake-list')

urlpatterns = router.urls
```

---

## 5. Python Project & Dependency Management with `uv`

All Python dependencies, virtual environment setups, tool execution, and lockfiles for SeismoAtlas are managed using **`uv`** (Astral's high-performance Rust-based Python package manager).

### 5.1 Backend `pyproject.toml` Configuration

```toml
[project]
name = "seismoatlas-backend"
version = "0.1.0"
description = "SeismoAtlas Scientific Earthquake Hazard & Risk Intelligence API"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "django>=4.2,<5.0",
    "djangorestframework>=3.14",
    "djangorestframework-gis>=1.0",
    "django-cors-headers>=4.2",
    "django-filter>=23.2",
    "psycopg[binary]>=3.1",
    "celery>=5.3",
    "redis>=5.0",
    "requests>=2.31",
    "numpy>=1.24",
    "scipy>=1.10",
    "pandas>=2.0",
    "geopandas>=0.13",
    "boto3>=1.28", # Used for S3/Cloudflare R2 storage compatibility
]

[project.optional-dependencies]
scientific = [
    "openquake.engine>=3.19",
]

[tool.uv]
dev-dependencies = [
    "pytest>=7.4",
    "pytest-django>=4.5",
    "pytest-cov>=4.1",
    "ruff>=0.1",
    "mypy>=1.5",
    "django-stubs>=4.2",
    "djangorestframework-stubs>=3.14",
]

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "UP", "B", "C4"]

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings.local"
python_files = ["test_*.py", "*_test.py"]
```

---

### 5.2 Common `uv` Workflow Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Setup Virtual Environment** | `uv venv` | Creates an isolated virtual environment (`.venv`). |
| **Sync Dependencies** | `uv sync` | Fast deterministic installation of all packages from `uv.lock`. |
| **Add New Dependency** | `uv add <package>` | Installs `<package>` and updates `pyproject.toml` + `uv.lock`. |
| **Add Dev Dependency** | `uv add --dev <package>` | Installs development tools (e.g. `pytest`, `ruff`). |
| **Run Dev Server** | `uv run python manage.py runserver` | Executes Django development server inside virtualenv. |
| **Run Database Migrations** | `uv run python manage.py migrate` | Runs Django PostGIS schema migrations. |
| **Run Linting** | `uv run ruff check .` | Fast Python code linting. |
| **Run Test Suite** | `uv run pytest` | Executes pytest test suite with Django integration. |


