# Data Pipeline & Catalog Ingestion

This document describes the ETL ingestion architecture, raw payload preservation rules, and multi-network spatial-temporal deduplication algorithms for **SeismoAtlas**.

---

## 1. ETL Ingestion Architecture

SeismoAtlas ingests seismic catalog data from authoritative external APIs (primarily USGS ANSS ComCat).

```text
External API (USGS ComCat / Regional Network)
                    │
                    ▼
          Raw Response Ingestion
                    │
                    ▼
            Schema Validation
                    │
                    ▼
          Data Normalization
                    │
                    ▼
     Multi-Network Deduplication Engine
                    │
                    ▼
         PostgreSQL + PostGIS Persistence
                    │
                    ▼
          Redis API Cache Update
```

---

## 2. Ingestion Rules & Provenance Retention

Every ingested event record preserves its original source parameters to guarantee full scientific traceability:

- **Original Source Metadata**: Source agency code (`us`, `nc`, `ci`, `ak`, etc.), external event ID, raw timestamp, raw epicenter coordinates, raw depth, raw magnitude, and magnitude type ($M_w$, $M_l$, $M_s$).
- **Immutable Raw Payloads**: Store full un-transformed JSON payloads in Cloudflare R2 object storage or raw payload tables (`earthquake_raw_payloads`) for audit and re-ingestion.
- **No Lossy Overwrites**: Transformations never mutate original network attributes. Refinements create updated catalog snapshot records tied to a specific `catalog_version`.

---

## 3. Spatial-Temporal Deduplication Algorithm

Different regional and global seismic networks often report the same physical earthquake with slight variations in hypocenter location, depth, magnitude, and origin time.

> [!CAUTION]
> **Deduplication Rule**
> Never deduplicate earthquake records solely by origin timestamp. Seismic networks may exhibit timing offsets or location uncertainties.

### Candidate Matching Heuristic

Two event records $A$ and $B$ are flagged as potential duplicates if they satisfy all four proximity thresholds:

$$\Delta t = |t_A - t_B| \le 16 \text{ seconds}$$

$$\Delta d = \text{ST\_DistanceSphere}(p_A, p_B) \le 50 \text{ km}$$

$$\Delta M = |M_A - M_B| \le 0.8 \text{ magnitude units}$$

$$\Delta z = |z_A - z_B| \le 30 \text{ km}$$

```text
               Canonical Event Entity (SeismoAtlas Unified ID)
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
  USGS Record                 EMSC Record                 Regional Network
(Canonical Primary)        (Contributing Secondary)      (Contributing Local)
```

### Preference Hierarchy
1. Primary Authoritative National Agency (if local to event epicenter).
2. USGS ANSS ComCat (Global standard baseline).
3. Regional Seismological Centers (EMSC, ISC).
