# Feature Specification: FEAT-09 — Seismic Risk & Loss Estimation

**Feature ID:** FEAT-09  
**Status:** `PENDING`  
**Target Component:** `frontend/features/risk-analysis`, `apps/risk`, `apps/scientific`  
**Primary User Persona:** Disaster Risk Managers, Insurance Analysts, Urban Planners  

---

## 1. Feature Goal & Scope

Combine hazard ground motion fields with spatial exposure grids (population & building inventory) and physical vulnerability functions to estimate Expected Annual Loss (EAL), damaged building distributions, and affected population stats ($Risk = Hazard \times Exposure \times Vulnerability$).

---

## 2. Input Validation & Schema Constraints

| Attribute | Type | Validation Constraint |
| :--- | :--- | :--- |
| `building_taxonomy` | `string` | Must conform to GEM Building Taxonomy (e.g. `CR/LFIN/H:2` - Concrete Reinforced) |
| `exposure_grid_resolution` | `enum` | `1km`, `5km`, `10km` spatial resolution |
| `vulnerability_model_id` | `UUID` | Must exist in `vulnerability_models` registry |

---

## 3. Edge Cases & Boundary Handling

1. **Missing Local Building Exposure Grids**:
   - *Scenario*: Calculation requested in region with unmapped exposure data.
   - *Handling*: Fall back to global population density grids (LandScan / WorldPop) and display exposure uncertainty indicator.
2. **Individual Building Privacy Controls**:
   - *Scenario*: Risk calculations aggregated over spatial grids.
   - *Handling*: Never output or store individual building safety certifications or private property damage numbers. Aggregations strictly maintained at spatial grid level.

---

## 4. Definition of Done Checklist

- [ ] [ ] OpenQuake Risk worker calculates Expected Annual Loss (EAL) in target currency.
- [ ] [ ] Risk maps render exposed population grids by shaking intensity zone.
- [ ] [ ] Fragility curves (Slight, Moderate, Extensive, Complete Damage) linked to provenance citations.
