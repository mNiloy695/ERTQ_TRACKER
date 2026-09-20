# CI/CD & Observability Specification

This document details the continuous integration/continuous deployment (CI/CD) pipelines, telemetry monitoring, logging standards, and operational alert thresholds for **SeismoAtlas**.

---

## 1. CI/CD Deployment Pipeline

SeismoAtlas utilizes GitHub Actions for automated linting, testing, security scanning, container building, and deployment.

```text
Pull Request Submitted
          │
          ▼
   Linting & Formatting Check (Ruff, ESLint)
          │
          ▼
   Type Checking (TypeScript tsc, Python mypy)
          │
          ▼
   Unit & Spatial Query Tests (pytest-postgis, Jest)
          │
          ▼
   Scientific Regression Test Suite
          │
          ▼
   Docker Container Build & Vulnerability Scan (Trivy)
          │
          ▼
   Staging Deployment & Smoke Testing
          │
          ▼
   Production Deployment (Blue-Green / Rolling Update)
```

---

## 2. Observability & Telemetry Stack

SeismoAtlas implements OpenTelemetry-compatible tracing, Prometheus metrics collection, and Grafana dashboard monitoring across four key domains:

```text
┌─────────────────────────┐   ┌─────────────────────────┐
│     Product Metrics     │   │      Data Metrics       │
│  - Search Success Rate  │   │  - Ingestion Freshness  │
│  - Map Latency (p95)    │   │  - Duplicate Event Rate │
└─────────────────────────┘   └─────────────────────────┘
┌─────────────────────────┐   ┌─────────────────────────┐
│   Engineering Metrics   │   │   Scientific Metrics    │
│  - API Response Latency │   │  - Reproducibility Pass │
│  - Celery Queue Depth   │   │  - Provenance Coverage  │
└─────────────────────────┘   └─────────────────────────┘
```

---

## 3. Operational Alert Thresholds

Automated PagerDuty / Slack alerts fire when system parameters cross critical thresholds:

| Alert Name | Condition / Threshold | Severity | Immediate Action |
| :--- | :--- | :--- | :--- |
| **Ingestion Stalled** | `usgs_ingestion_last_sync_seconds > 3600` | High | Check USGS API connectivity & Celery worker logs. |
| **Celery Backlog** | `celery_queue_depth > 500` | Warning | Scale Celery ingestion worker pool. |
| **OpenQuake Worker Down** | `openquake_worker_up == 0` | Critical | Restart OpenQuake scientific compute container node. |
| **High API Error Rate** | `http_requests_5xx_rate > 1%` | Critical | Inspect Django application log traces for unhandled exceptions. |
| **Database Storage Low** | `postgres_disk_free_bytes < 15%` | High | Expand persistent disk volume on PostgreSQL node. |
