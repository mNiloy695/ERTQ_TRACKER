# Feature Specification: FEAT-01 — Global Earthquake Map Explorer

**Feature ID:** FEAT-01  
**Status:** `PENDING`  
**Target Component:** `frontend/features/earthquake-explorer`, `apps/earthquakes`  
**Primary User Persona:** Public Users, Journalists, Researchers, Analysts  

---

## 1. Feature Goal & Scope

Provide an interactive, high-performance global map visualization allowing users to explore historical and recent earthquake epicenters scaled by magnitude, filtered by depth, magnitude, time horizon, and geographic bounding box.

---

## 2. Input Validation Rules

| Parameter | Type | Required | Validation Constraints | Error Response |
| :--- | :--- | :--- | :--- | :--- |
| `min_lon` | `float` | No | $-180.0 \le \text{min\_lon} \le 180.0$ | `INVALID_SPATIAL_BBOX` |
| `min_lat` | `float` | No | $-90.0 \le \text{min\_lat} \le 90.0$ | `INVALID_SPATIAL_BBOX` |
| `max_lon` | `float` | No | $-180.0 \le \text{max\_lon} \le 180.0$ | `INVALID_SPATIAL_BBOX` |
| `max_lat` | `float` | No | $-90.0 \le \text{max\_lat} \le 90.0$ | `INVALID_SPATIAL_BBOX` |
| `min_magnitude` | `float` | No | $0.0 \le \text{min\_magnitude} \le 10.0$ | `INVALID_MAGNITUDE` |
| `max_depth` | `float` | No | $0.0 \le \text{max\_depth} \le 700.0\text{ km}$ | `INVALID_DEPTH` |
| `start_time` | `ISO-8601`| No | Valid UTC timestamp string | `INVALID_TIMESTAMP` |
| `end_time` | `ISO-8601`| No | $\text{start\_time} \le \text{end\_time}$ | `INVALID_TIMESTAMP_RANGE` |

---

## 3. Edge Cases & Boundary Handling

1. **Anti-Meridian Crossing (180th Meridian / International Date Line)**:
   - *Scenario*: Bounding box spans across longitude $180^\circ$ (e.g., Fiji/Tonga region, $\text{min\_lon} = 170^\circ$, $\text{max\_lon} = -170^\circ$).
   - *Handling*: Django service splits spatial query into two polygons: $[170^\circ, 180^\circ]$ and $[-180^\circ, -170^\circ]$ combined via `ST_Union` or `OR` filters to prevent empty queries.
2. **Extreme Low Zoom Levels ($Zoom < 3$)**:
   - *Scenario*: Querying millions of global events at world scale.
   - *Handling*: Return aggregated clusters or enforce `min_magnitude >= 4.5` threshold to prevent browser freeze.
3. **Empty Bounding Box Results**:
   - *Scenario*: Search area contains zero historical earthquakes.
   - *Handling*: API returns `data: []` with `meta.total_records: 0`. Frontend displays empty-state indicator without error toasts.
4. **Invalid Coordinates (Out of Range)**:
   - *Scenario*: Client passes `min_lat=120.0`.
   - *Handling*: DRF query parameter serializer catches boundary error before SQL execution and returns HTTP 400 with `INVALID_SPATIAL_BBOX`.

---

## 4. Failure Modes & Fallback Mechanisms

- **PostGIS Query Timeout**: If spatial query exceeds $2.0\text{ seconds}$, return cached Redis result with `meta.source = 'cache_fallback'`.
- **API Disconnected / Offline**: Frontend displays an offline banner with retained client-side Zustand events.

---

## 5. Definition of Done Checklist

- [ ] [ ] `EarthquakeQueryParamsSerializer` validates coordinate bounds.
- [ ] [ ] PostGIS GiST index handles spatial bounding box queries under $200\text{ ms}$.
- [ ] [ ] MapLibre GL renders clusters at low zoom and individual markers at high zoom.
- [ ] [ ] Anti-meridian crossing unit tests pass cleanly.
