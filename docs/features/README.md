# SeismoAtlas — Feature Specifications Index

This directory contains granular, industry-standard technical specifications for all planned platform features. Each document explicitly defines the **Feature Goal**, **Validation Rules**, **Edge Cases**, **Data Integrity Rules**, **Failure Modes**, and **Definition of Done**.

---

## Feature Specifications Index

| Feature ID | Feature Name | Status | Primary Focus |
| :--- | :--- | :--- | :--- |
| **FEAT-01** | [Global Earthquake Map Explorer](file:///home/salah-uddin/EarthQuick/docs/features/01-earthquake-explorer-map.md) | `PENDING` | MapLibre GL vector map, bounding box spatial querying, clustering, multi-attribute filters. |
| **FEAT-02** | [Earthquake Catalog Ingestion & Deduplication](file:///home/salah-uddin/EarthQuick/docs/features/02-earthquake-catalog-ingestion.md) | `PENDING` | USGS ComCat ETL sync worker, raw payload preservation, spatial-temporal candidate matching. |
| **FEAT-03** | [Location Intelligence & Search](file:///home/salah-uddin/EarthQuick/docs/features/03-location-intelligence.md) | `PENDING` | City/country geocoding, local seismicity statistics, historical timeline graphs. |
| **FEAT-04** | [Tectonic Context & Plate Boundaries](file:///home/salah-uddin/EarthQuick/docs/features/04-tectonic-context.md) | `PENDING` | Tectonic plate polygon layers, active fault lines, regional subduction/transform descriptions. |
| **FEAT-05** | [Probabilistic Hazard Curves (PSHA)](file:///home/salah-uddin/EarthQuick/docs/features/05-probabilistic-hazard-curves.md) | `PENDING` | OpenQuake classical PSHA integration, PGA ground motion, return period calculation ($T_R$). |
| **FEAT-06** | [Seismic Threshold Probabilities](file:///home/salah-uddin/EarthQuick/docs/features/06-seismic-threshold-probabilities.md) | `PENDING` | 30-year future seismic probability modeling ($P(M \ge m)$) avoiding false deterministic predictions. |
| **FEAT-07** | [Scientific Data Provenance](file:///home/salah-uddin/EarthQuick/docs/features/07-scientific-data-provenance.md) | `PENDING` | Scientific basis badges, model audit hashes (`config_hash`), dataset lineage transparency. |
| **FEAT-08** | [Scenario Shaking Analysis](file:///home/salah-uddin/EarthQuick/docs/features/08-scenario-shaking-analysis.md) | `PENDING` | Deterministic fault rupture scenarios, ground motion shaking maps across affected regions. |
| **FEAT-09** | [Seismic Risk & Loss Estimation](file:///home/salah-uddin/EarthQuick/docs/features/09-seismic-risk-loss-estimation.md) | `PENDING` | Built exposure grids, building fragility functions, Expected Annual Loss (EAL) calculations. |
| **FEAT-10** | [Data Export & Scientific Citations](file:///home/salah-uddin/EarthQuick/docs/features/10-export-and-citations.md) | `PENDING` | GeoJSON / CSV catalog exports, BibTeX citations, scientific report PDF generation. |

---

## Status Standard

- **`PENDING`**: Feature specification complete; pending implementation and verification.
- **`IN_PROGRESS`**: Active development in progress.
- **`COMPLETED`**: Code implemented, tests passing, verified in production.
