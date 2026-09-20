# Feature Specification: FEAT-04 — Tectonic Context & Plate Boundaries

**Feature ID:** FEAT-04  
**Status:** `PENDING`  
**Target Component:** `frontend/features/tectonic-analysis`, `apps/tectonics`  
**Primary User Persona:** Seismologists, Educators, Public Users  

---

## 1. Feature Goal & Scope

Visualize tectonic plate boundaries (convergent, divergent, transform), active fault linestrings, regional plate motion velocity vectors, and deliver accessible scientific descriptions explaining why a selected geographic area experiences seismic activity.

---

## 2. Input Validation & Data Constraints

| Attribute | Type | Constraint / Validation |
| :--- | :--- | :--- |
| `plate_boundary_type` | `enum` | Must be one of `convergent`, `divergent`, `transform`, `subduction_zone` |
| `slip_rate_mm_yr` | `float` | $0.0 \le \text{slip\_rate} \le 200.0\text{ mm/yr}$ |
| `fault_geometry` | `GeoJSON LineString/MultiLineString` | Valid SRID 4326 geometries; no self-intersecting loops |

---

## 3. Edge Cases & Boundary Handling

1. **Intraplate Regions (Far from Plate Boundaries)**:
   - *Scenario*: User explores intraplate area (e.g. New Madrid Seismic Zone, Missouri USA).
   - *Handling*: System displays distance to nearest plate margin (e.g., $1200\text{ km}$ to Caribbean Plate) and explains intraplate stress reactivation mechanisms.
2. **Complex Subduction Zone Interfaces**:
   - *Scenario*: Overlapping 3D slab geometry (e.g. Cascadia or Sunda Megathrust).
   - *Handling*: Map interface renders slab depth contours ($20\text{km}, 50\text{km}, 100\text{km}$) with interactive depth legend.
3. **Unmapped / Blind Thrust Faults**:
   - *Scenario*: Historical earthquake occurs on an unmapped blind fault.
   - *Handling*: Display "Regional Unmapped Crustal Faulting" note with source dataset citation badge.

---

## 4. Failure Modes & Fallback

- **Fault Vector Tile Failure**: Fall back to simplified GeoJSON line layer for active fault rendering.

---

## 5. Definition of Done Checklist

- [ ] [ ] Tectonic plate boundaries render with color-coded motion types (red = convergent, blue = divergent, yellow = transform).
- [ ] [ ] Fault proximity API calculates distance to nearest active fault segment in kilometers.
- [ ] [ ] Citation metadata linked for all plate motion velocity vectors.
