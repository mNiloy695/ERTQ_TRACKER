# System Architecture & Technical Specification

This document details the high-level system architecture, monorepo repository layout, technology stack decisions, and subsystem communication mechanics for **SeismoAtlas**.

---

## 1. High-Level Subsystem Architecture

SeismoAtlas is structured as a decoupled web application backed by an asynchronous geospatial and scientific data platform.

```text
                        WEB CLIENT
                    Next.js + TypeScript
                           │
                    MapLibre / Map UI
                           │
                       CDN / WAF
                           │
                     Django REST API
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     PostgreSQL          Redis          Cloudflare R2 (Object Storage)
      + PostGIS                              │
        │                                    │
        └───────────── Data Platform ────────┘
                           │
                    Celery Workers
                           │
             ┌─────────────┼─────────────┐
             │             │             │
        USGS ingestion  Data ETL    Hazard jobs
             │             │             │
             └─────────────┼─────────────┘
                           │
                      OpenQuake
                           │
                   Scientific outputs
```

---

## 2. Technology Stack Matrix

| Layer | Primary Technology | Purpose & Usage |
| :--- | :--- | :--- |
| **Frontend** | Next.js, React, TypeScript | SSR/SSG web framework, typed frontend application logic. |
| **Mapping UI** | MapLibre GL JS | High-performance vector map rendering, clustering, & layer controls. |
| **Styling** | Tailwind CSS | Modern layout composition and component styling. |
| **State & Fetching** | TanStack Query | API state management, client-side caching, and query retries. |
| **Visualization** | Apache ECharts / Plotly | Scientific chart rendering (hazard curves, magnitude distributions). |
| **Backend API** | Python, Django, DRF | Core business logic, authentication, ORM, REST API endpoints. |
| **Task Queue** | Celery + Redis | Asynchronous background processing, ingestion schedules, compute jobs. |
| **Database** | PostgreSQL + PostGIS | Relational database with native spatial indexing (GiST) and GIS extensions. |
| **Scientific Compute** | OpenQuake Engine | Classical/Event-based PSHA calculation framework (Global Earthquake Model). |
| **Data Processing** | NumPy, SciPy, pandas, GeoPandas | Ingestion transformation, numerical analysis, spatial calculations. |
| **Data Formats** | GeoJSON, Parquet, CSV, OpenQuake XML | Standardized data interchange and compressed archival formats. |
| **Infrastructure** | Docker, Cloud VPS / Managed DB | Containerized application deployment, Cloudflare R2 object storage (S3-compatible). |

---

## 3. Monorepo Repository Structure

The project is organized as a monorepo to ensure clean separation of concerns while keeping shared contracts and utilities in a single codebase.

```text
seismoatlas/
│
├── apps/
│   ├── web/                     # Next.js frontend application
│   ├── api/                     # Django REST API application
│   └── scientific-worker/       # Celery worker wrapper for OpenQuake calculations
│
├── services/
│   ├── earthquake-ingestion/    # USGS ComCat & secondary network fetchers
│   ├── hazard-engine/           # OpenQuake calculation task runner
│   └── data-processing/         # ETL & spatial deduplication pipelines
│
├── packages/
│   ├── api-contracts/           # Shared API type definitions & schema validators
│   ├── geo-utils/               # Spatial helper functions and projection transforms
│   └── scientific-utils/        # Probability & magnitude distribution calculators
│
├── datasets/
│   └── metadata/                # Source catalog licenses, model version metadata
│
├── scientific/
│   ├── models/                  # GEM and regional seismic hazard models
│   ├── configurations/          # OpenQuake engine configuration files
│   ├── validation/              # Ground truth calculation reference sets
│   └── notebooks/               # Jupyter research & validation notebooks
│
├── infrastructure/
│   ├── docker/                  # Dockerfiles & docker-compose configurations
│   ├── terraform/               # Cloud infrastructure provisioning definitions
│   └── monitoring/              # Grafana dashboards & Prometheus alerts
│
├── docs/                        # Project documentation suite
└── README.md                    # Repository root overview
```

---

## 4. Subsystem Interactions & Boundaries

1. **Client to API**: Frontend applications consume data exclusively via HTTPS JSON/GeoJSON REST endpoints.
2. **API to Data Store**: The Django REST API queries PostgreSQL/PostGIS for transactional and spatial data. Dynamic endpoints query Redis for cached responses.
3. **API to Asynchronous Workers**: The API dispatches long-running tasks (catalog ingestion, OpenQuake hazard runs) via Redis to Celery workers.
4. **Compute Isolation**: OpenQuake compute jobs execute on isolated scientific worker nodes with strict resource boundaries to prevent starving normal API request handling.
5. **Storage of Artifacts**: Heavy calculation outputs (hazard maps, scenario outputs) are stored in Cloudflare R2 Object Storage, with metadata references saved in PostGIS.
