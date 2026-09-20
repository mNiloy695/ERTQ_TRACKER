# Feature Specification: FEAT-05 — Probabilistic Hazard Curves (PSHA)

**Feature ID:** FEAT-05  
**Status:** `PENDING`  
**Target Component:** `frontend/features/hazard-analysis`, `apps/hazard`, `apps/scientific`  
**Primary User Persona:** Structural Engineers, Seismologists, Risk Analysts  

---

## 1. Feature Goal & Scope

Integrate the OpenQuake Engine to compute and display Probabilistic Seismic Hazard Analysis (PSHA) hazard curves (Ground Motion vs. Annual Rate of Exceedance), uniform hazard spectra, and hazard maps for Peak Ground Acceleration (PGA) and Spectral Acceleration ($SA$) across standard return periods ($475\text{ yrs}$, $2475\text{ yrs}$).

---

## 2. Input Validation Rules

| Parameter | Type | Required | Constraints | Error Handling |
| :--- | :--- | :--- | :--- | :--- |
| `location_id` / `coords` | `UUID` / `lat,lon` | Yes | Valid SRID 4326 point | `INVALID_LOCATION` |
| `imt` | `enum` | Yes | `PGA`, `SA(0.2s)`, `SA(1.0s)`, `SA(2.0s)` | `UNSUPPORTED_IMT` |
| `vs30_m_s` | `float` | No | $100.0 \le V_{s30} \le 3000.0\text{ m/s}$ (Default: $760\text{ m/s}$) | Clamp to $[100, 3000]$ |
| `model_version_id` | `UUID` | Yes | Must exist in `hazard_model_versions` registry | `MODEL_VERSION_NOT_FOUND` |

---

## 3. Mathematical & Data Integrity Rules

1. **Hazard Curve Monotonicity**:
   - As ground motion intensity $x$ increases, annual rate of exceedance $\lambda(x)$ must strictly decrease ($\frac{d\lambda}{dx} < 0$).
2. **Poisson Probability Calculation**:
   - Probability of exceedance $P$ over time window $t = 50\text{ years}$:

$$P = 1 - e^{-\lambda t}$$

3. **Return Period Definition**:

$$T_R = \frac{1}{\lambda}$$

---

## 4. Edge Cases & Boundary Handling

1. **Extreme Ground Motion Outputs ($PGA > 2.0g$)**:
   - *Scenario*: Calculation in extreme near-fault subduction zone yields PGA $> 2.0g$.
   - *Handling*: Display high-hazard warning badge, verify Ground Motion Model (GMM) truncation setting ($3\sigma$), and log for scientific review.
2. **Missing Local Site Velocity ($V_{s30}$)**:
   - *Scenario*: User requests point where global Vs30 grid has missing data.
   - *Handling*: Fall back to default Firm Rock reference site ($V_{s30} = 760\text{ m/s}$) with explicit site condition disclaimer badge.
3. **OpenQuake Compute Job Timeout**:
   - *Scenario*: Heavy PSHA grid job exceeds $60\text{ seconds}$.
   - *Handling*: Django API responds with `HTTP 202 Accepted` + `calculation_id` and pushes job to asynchronous Celery worker pool.

---

## 5. Definition of Done Checklist

- [ ] [ ] PSHA hazard curve rendering matches official OpenQuake Engine benchmark outputs within $< 1\%$ tolerance.
- [ ] [ ] Interactive chart allows toggling return periods ($475\text{ yrs} = 10\%$ in $50\text{ yrs}$, $2475\text{ yrs} = 2\%$ in $50\text{ yrs}$).
- [ ] [ ] Provenance badge displays `model_version_id` and `config_hash` for every curve.
