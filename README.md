# SeismoAtlas — Global Earthquake Hazard & Risk Intelligence Platform

SeismoAtlas is a global, map-first platform for exploring earthquake history, tectonic context, probabilistic seismic hazard (PSHA), and seismic risk.

---

## 📚 Documentation Suite

Full architectural specifications, scientific methodologies, API definitions, and roadmap documents are organized in the [`docs/`](docs/README.md) directory:

👉 **[SeismoAtlas Documentation Hub & Architecture Specification](docs/README.md)**

### Quick Links by Domain

- 📐 **[System Architecture](docs/architecture/system-architecture.md)**
- 🐍 **[Django Backend Architecture](docs/architecture/django-backend-architecture.md)**
- ⚛️ **[Next.js Frontend Architecture](docs/architecture/frontend-architecture.md)**
- 📦 **[Shared Contracts & uv Workspaces](docs/architecture/shared-contracts-and-common.md)**
- 🗄️ **[Data Storage & PostGIS Schemas](docs/architecture/data-storage-and-indexing.md)**
- 🎯 **[Product Specification & Scope](docs/product/product-spec-and-scope.md)**
- 🎨 **[UX Wireframes & User Flows](docs/product/user-experience-and-flows.md)**
- 🔬 **[Scientific Methodology](docs/scientific/scientific-methodology.md)**
- 🌋 **[Hazard & Risk Modeling](docs/scientific/hazard-and-risk-modeling.md)**
- 🧪 **[Validation & Reproducibility](docs/scientific/validation-and-reproducibility.md)**
- 🔄 **[ETL Data Pipeline & Deduplication](docs/data/pipeline-and-ingestion.md)**
- 📚 **[Data Sources & Provenance](docs/data/data-sources-and-provenance.md)**
- 🔌 **[API Specification](docs/api/api-specification.md)**
- 🐳 **[Infrastructure & Security](docs/operations/infrastructure-and-security.md)**
- 🚀 **[CI/CD & Observability](docs/operations/ci-cd-and-observability.md)**
- 📅 **[Roadmap & Delivery](docs/roadmap/milestones-and-delivery.md)**

---

## 🚀 Getting Started

### Backend Setup (`uv`)

```bash
cd backend
uv venv
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
