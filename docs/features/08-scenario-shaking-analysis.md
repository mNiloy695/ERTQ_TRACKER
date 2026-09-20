# Feature Specification: FEAT-08 — Scenario Shaking Analysis

**Feature ID:** FEAT-08  
**Status:** `PENDING`  
**Target Component:** `frontend/features/hazard-analysis`, `apps/hazard`, `apps/scientific`  
**Primary User Persona:** Emergency Planners, Seismologists, Risk Analysts  

---

## 1. Feature Goal & Scope

Allow users to define or select deterministic earthquake rupture scenarios (e.g. $M_w 7.5$ event on the Dauki Fault) and visualize resulting ground shaking fields (PGA, Modified Mercalli Intensity - MMI) across affected regions.

---

## 2. Input Validation Rules

| Parameter | Type | Required | Constraints | Error Handling |
| :--- | :--- | :--- | :--- | :--- |
| `scenario_magnitude` | `float` | Yes | $5.0 \le M_w \le 9.5$ | `INVALID_SCENARIO_MAGNITUDE` |
| `fault_id` / `geometry` | `UUID` / `GeoJSON` | Yes | Valid line segment or fault entity | `FAULT_NOT_FOUND` |
| `hypocenter_depth_km` | `float` | Yes | $2.0 \le \text{depth} \le 100.0\text{ km}$ | `INVALID_HYPOCENTER_DEPTH` |
| `strike` / `dip` / `rake` | `float` | Yes | $0 \le \text{strike} \le 360^\circ$, $0 < \text{dip} \le 90^\circ$, $-180 \le \text{rake} \le 180^\circ$ | `INVALID_FOCAL_MECHANISM` |

---

## 3. Edge Cases & Boundary Handling

1. **Rupture Length Exceeds Fault Polygon**:
   - *Scenario*: User requests $M_w 8.5$ scenario on a short $20\text{ km}$ local fault segment.
   - *Handling*: Scaling relationship validator warns user that $M_w 8.5$ requires $\sim 300\text{ km}$ surface rupture length (Wells & Coppersmith scaling).
2. **Deterministic Shaking Disclaimer**:
   - *Scenario*: Users interpreting scenario as a real forecast.
   - *Handling*: Display explicit warning badge: `"Scenario Simulation: Synthetic model for emergency planning purposes only."`

---

## 4. Definition of Done Checklist

- [ ] [ ] Scenario calculator generates ground shaking contours (MMI VI to IX) across spatial grid.
- [ ] [ ] OpenQuake Scenario Hazard worker executes and stores outputs in Cloudflare R2.
- [ ] [ ] Interactive legend translates PGA ($g$) to intuitive MMI shaking descriptions (Moderate, Strong, Violent).
