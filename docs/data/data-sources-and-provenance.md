# Data Sources & Scientific Provenance

This document specifies the authoritative data source hierarchy, catalog schemas, metadata tracking, and licensing policies for **SeismoAtlas**.

---

## 1. Authoritative Data Source Hierarchy

To maintain scientific integrity, SeismoAtlas prioritizes data sources according to a strict hierarchy:

1. **National Geological & Seismological Agencies**: Local authoritative networks (e.g., JMA Japan, USGS USA, GNS Science NZ) for events within their sovereign geographic jurisdictions.
2. **USGS ANSS Comprehensive Earthquake Catalog (ComCat)**: Global primary baseline catalog for historic and global seismicity.
3. **Global Earthquake Model (GEM) Foundation**: Authoritative global probabilistic hazard models, fault databases, and strain rate models.
4. **Peer-Reviewed Scientific Literature**: Published fault slip-rate models, paleoseismic studies, and regional hazard maps.
5. **Open Geographic & Elevation Datasets**: OpenStreetMap, SRTM elevation, GEBCO bathymetry, and Vs30 site condition grids.

---

## 2. External Data Source Specifications

### 2.1 USGS ComCat (ANSS)
- **API Endpoint**: `https://earthquake.usgs.gov/fdsnws/event/1/`
- **Data Provided**: Hypocenters, magnitudes ($M_w, M_l, M_s, M_b$), moment tensors, focal mechanisms, ShakeMaps, DYFI intensity responses.
- **License**: Public Domain (US Government Work).

### 2.2 OpenQuake / GEM Datasets
- **Repository**: `https://github.com/gem/`
- **Data Provided**: Global hazard maps, active fault databases, earthquake recurrence models, vulnerability functions.
- **License**: CC-BY-SA 4.0 / Open Source.

---

## 3. Data Provenance Metadata Schema

Every dataset ingested into SeismoAtlas is tracked in the `data_sources` and `dataset_versions` registry tables:

```sql
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,       -- e.g., 'USGS_COMCAT'
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    url VARCHAR(512),
    license VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataset_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_source_id UUID REFERENCES data_sources(id),
    version_tag VARCHAR(50) NOT NULL,        -- e.g., '2026-09-20'
    description TEXT,
    ingested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    record_count BIGINT DEFAULT 0
);
```
