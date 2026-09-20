# Infrastructure & Security Specification

This document outlines the containerized deployment setup, cloud scaling architecture, worker node isolation, and security controls for **SeismoAtlas**.

---

## 1. Local Development Infrastructure

The entire platform stack runs locally via standard Docker Compose:

```yaml
version: '3.8'

services:
  db:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: seismoatlas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secretpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.api
    command: uv run python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  celery_worker:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.worker
    command: uv run celery -A config worker -l info
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### 1.1 Multi-Stage Dockerfile with `uv` (`Dockerfile.api`)

```dockerfile
# Use ghcr.io/astral-sh/uv for ultra-fast multi-stage builds
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

WORKDIR /app

# Enable bytecode compilation and uv link copying
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Copy dependency definition lockfiles
COPY pyproject.toml uv.lock ./

# Install project dependencies into frozen environment
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# Final lightweight runtime image
FROM python:3.11-slim-bookworm

WORKDIR /app
ENV PATH="/app/.venv/bin:$PATH"

# Copy installed virtual environment from builder stage
COPY --from=builder /app/.venv /app/.venv
COPY . /app

EXPOSE 8000

CMD ["uv", "run", "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 2. Production Cloud Scaling Architecture

In production, heavy OpenQuake scientific calculations are completely decoupled from light API request servers to ensure high availability.

```text
               Cloudflare CDN / WAF
                        │
                        ▼
           Load Balancer (Nginx / ALB)
                        │
        ┌───────────────┴───────────────┐
        │                               │
  Web Frontend Nodes             API Gateway Nodes
 (Next.js SSR Cluster)        (Django Gunicorn Cluster)
        │                               │
        ├───────────────┬───────────────┤
        ▼               ▼               ▼
 PostgreSQL + PostGIS Redis Cache    Cloudflare R2 Object Storage
(Managed Cluster w/   & Queue         (Hazard Map Tiles
 Read Replicas)                       & HDF5 Calculation Artifacts)
                        │
                        ▼
            Isolated Compute Pool
        (Celery + OpenQuake Engine Workers)
```

---

## 3. Security Architecture & Controls

1. **API Rate Limiting**: Global rate limit of $100\text{ requests/min}$ per IP address on public endpoints to prevent scraper abuse and Denial of Service.
2. **SSRF Protection**: Strict whitelist for all outbound network calls made by ingestion workers. External dataset URLs must be registered in the dataset catalog.
3. **Database Least Privilege**: Web API containers connect using restricted database credentials with `SELECT`, `INSERT`, `UPDATE` permissions, unable to alter schema geometries or drop tables.
4. **Isolated Worker Environment**: OpenQuake computation workers run in restricted containers with cgroup memory limits to prevent out-of-memory host crashes during heavy matrix operations.
5. **Public vs. Protected Endpoints**: Catalog search and hazard maps are publicly readable. Custom OpenQuake calculation triggers and dataset management require JWT-authenticated administrative privileges.
