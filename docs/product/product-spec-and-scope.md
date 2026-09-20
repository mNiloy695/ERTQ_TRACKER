# Product Specification & Scope

This document defines the core product vision, primary goals, explicit non-goals, and detailed feature requirements for the MVP release of **SeismoAtlas**.

---

## 1. Executive Summary

**SeismoAtlas** is a global, map-first platform for exploring earthquake history, tectonic context, probabilistic seismic hazard, and seismic risk.

The core question the platform answers for users is:

> **“How and why is this place exposed to earthquake hazard, what has happened there before, and what does the scientific evidence say about future probability?”**

### Scientific Positioning & Terminology

- **Earthquake History**: Observed and cataloged physical seismic events.
- **Hazard**: Probability that specified ground motion (e.g., Peak Ground Acceleration) will be exceeded during a defined period.
- **Risk**: Expected financial or social consequences after combining hazard with exposure and vulnerability.
- **Forecast / Probability**: Model-based statistical statements over a time window.
- **Prediction**: Exact time + location + magnitude statement (explicitly outside platform scope).

---

## 2. Product Goals & Non-Goals

### 2.1 Primary Product Goals

1. Provide a global interactive earthquake map.
2. Display historical earthquakes with magnitude, depth, origin time, and location.
3. Explain the regional tectonic setting of a selected area.
4. Identify relevant seismic sources and fault systems using authoritative datasets.
5. Provide scientifically sourced hazard information.
6. Display probability and return-period information with stated time windows.
7. Translate technical seismic concepts into intuitive visual explanations for non-specialists.
8. Preserve source attribution and model/version metadata for all metrics.
9. Build an architecture capable of running OpenQuake-based calculations.
10. Maintain a fully reproducible scientific data pipeline.

### 2.2 Non-Goals for MVP

- **No Exact Earthquake Prediction**: The platform will never issue statements claiming a specific earthquake will occur on a specific date.
- **No "Overdue" Claims**: Avoid non-scientific statements claiming an earthquake is "due" or "overdue".
- **No Emergency Advice**: The product does not supply medical, evacuation, or real-time disaster response instructions.
- **No Structural Certification**: Does not issue building code or structural safety certifications.
- **No Black-Box ML Predictions**: Unvalidated machine-learning predictions are strictly excluded.
- **No Naked Numbers**: Never present a standalone probability figure without associated model, time window, and source metadata.

---

## 3. MVP Feature Specifications

### Feature 1 — Interactive Global Map
- Global vector map rendering.
- Interactive earthquake markers scaled by magnitude.
- Multi-parameter filtering: Magnitude ($M \ge X$), Depth range ($0 - 700\text{ km}$), Time range, Spatial Bounding Box.
- High-performance map clustering for dense historical datasets.

### Feature 2 — Earthquake Detail View
- Displays complete event parameters: Magnitude ($M_w$), Depth ($\text{km}$), Origin Time (UTC), Epicentral coordinates, Geographic region.
- Source catalog metadata (e.g., USGS ComCat event ID).
- Secondary products (moment tensors, shake maps, focal mechanisms) where available.

### Feature 3 — Location Search & Intelligence
- Geocoding search supporting cities, countries, and coordinate pairs (e.g., Dhaka, Tokyo, Kathmandu, San Francisco, Istanbul).
- Returns local historical seismicity summary, nearest historical epicenters, regional fault proximity, and tectonic setting overview.

### Feature 4 — Historical Seismicity Timeline
- Interactive timeline chart allowing users to explore historical earthquake clustering across decades.

### Feature 5 — Statistical Magnitude & Depth Charts
- Visual distributions detailing:
  - Earthquakes by magnitude band.
  - Frequency distribution per year.
  - Depth profile distribution (shallow, intermediate, deep).
  - Magnitude-frequency relationships (Gutenberg-Richter plots).

### Feature 6 — Tectonic Context Layer
- Visual overlay showing tectonic plate boundaries, fault lines, and regional subduction/transform zones.
- Plain-language text summaries explaining regional plate movements and seismic mechanisms.

### Feature 7 — Authoritative Hazard Overlay
- Integration of authoritative global hazard maps (e.g., GEM Global Seismic Hazard Map).
- Visualizes Peak Ground Acceleration (PGA) for standard return periods ($10\%$ probability of exceedance in $50\text{ years}$).

### Feature 8 — Scientific Transparency & Provenance
- Every displayed hazard metric includes a **Scientific Basis** badge detailing:
  - Source Agency
  - Dataset Name & Version
  - Hazard Model & Version
  - Reference Period & Units
  - Uncertainty boundaries and limitations.
