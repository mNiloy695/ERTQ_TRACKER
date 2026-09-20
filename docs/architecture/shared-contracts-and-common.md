# Shared Contracts & Monorepo Infrastructure Specification

This document details the shared contracts, centralized data envelopes, `uv` Python workspace setup, and type definitions shared across the **Frontend (Next.js)** and **Backend (Django REST Framework)** for **SeismoAtlas**.

---

## 1. Shared Monorepo Architecture

To guarantee consistency between the frontend client and backend API, all API contracts, GeoJSON formats, and error codes are synchronized through shared contract specifications.

```text
seismoatlas/
│
├── apps/
│   ├── web/                     # Next.js Frontend Application
│   └── api/                     # Django REST API Application
│
├── packages/
│   ├── api-contracts/           # Shared OpenAPI / TypeScript Schema Contracts
│   ├── geo-utils/               # Shared GeoJSON & Bounding Box Utilities
│   └── python-shared/           # Shared Python domain logic & math packages
│
├── pyproject.toml               # Root uv Python Workspace definition
└── package.json                 # Root pnpm Workspace definition
```

---

## 2. Root Python Workspace Setup with `uv` (`pyproject.toml`)

SeismoAtlas manages multi-package Python workspaces (backend API, scientific workers, shared utilities) using `uv` workspace configuration:

```toml
# pyproject.toml (Monorepo Root)
[tool.uv.workspace]
members = [
    "apps/api",
    "apps/scientific-worker",
    "services/earthquake-ingestion",
    "packages/python-shared",
]

[project]
name = "seismoatlas-monorepo"
version = "0.1.0"
requires-python = ">=3.11"
```

---

## 3. Synchronized API Response Envelopes

Every REST API endpoint returned by Django DRF matches the TypeScript response interfaces consumed by Next.js.

### 3.1 Django DRF Renderer Envelope (Python)
```python
# core/renderers/envelope.py
{
    "data": [...],
    "meta": {
        "page": 1,
        "page_size": 50,
        "total_pages": 10,
        "total_records": 500,
        "source": "USGS_COMCAT"
    },
    "errors": []
}
```

### 3.2 Next.js TypeScript Response Envelope (TypeScript)
```typescript
// types/api.ts
export interface ApiMeta {
  page?: number;
  page_size?: number;
  total_pages?: number;
  total_records?: number;
  execution_time_ms?: number;
  source?: string;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
  errors: ApiError[];
}
```

---

## 4. Shared Error Code Enums

Custom error codes are synchronized between backend DRF exceptions and frontend alert handling:

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `INVALID_SPATIAL_BBOX` | `400 Bad Request` | Coordinates exceed global bounds (Longitude $-180^\circ$ to $+180^\circ$, Latitude $-90^\circ$ to $+90^\circ$). |
| `MODEL_VERSION_NOT_FOUND` | `404 Not Found` | Requested hazard model version tag does not exist in registry. |
| `OPENQUAKE_WORKER_TIMEOUT` | `504 Gateway Timeout` | Background scientific compute run exceeded maximum allowed runtime threshold. |
| `RATE_LIMIT_EXCEEDED` | `429 Too Many Requests` | Client exceeded $100\text{ requests/min}$ rate limit. |
| `UNAUTHORIZED_CALCULATION` | `403 Forbidden` | User role lacks permission to dispatch custom PSHA calculation jobs. |

---

## 5. GeoJSON Standard Compliance (RFC 7946)

All spatial endpoints export standard WGS 84 (SRID 4326) GeoJSON FeatureCollections:

```json
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [90.45, 24.12, 18.0]
      },
      "properties": {
        "id": "70d24c04-9442-4b2e-a579-d1bfbf542c3d",
        "magnitude": 6.2,
        "magnitude_type": "Mw",
        "origin_time": "2026-09-15T14:32:10Z",
        "location_name": "Mymensingh, Bangladesh"
      }
    }
  ]
}
```
