# Feature Specification: FEAT-06 — Seismic Threshold Probabilities

**Feature ID:** FEAT-06  
**Status:** `PENDING`  
**Target Component:** `frontend/features/hazard-analysis`, `apps/hazard`  
**Primary User Persona:** General Public, Policy Makers, Journalists  

---

## 1. Feature Goal & Scope

Display scientifically defensible statistical probabilities of exceeding magnitude thresholds ($M \ge 6.0$, $M \ge 7.0$) over standard time windows ($10$, $30$, $50\text{ years}$) while strictly prohibiting any false or non-scientific deterministic earthquake prediction claims.

---

## 2. Input Validation Rules

| Parameter | Type | Required | Constraints | Error Handling |
| :--- | :--- | :--- | :--- | :--- |
| `magnitude_threshold` | `float` | Yes | $4.5 \le m \le 9.0$ | `INVALID_MAGNITUDE_THRESHOLD` |
| `time_window_years` | `integer` | Yes | $1 \le t \le 100\text{ years}$ | `INVALID_TIME_WINDOW` |
| `region_id` | `UUID` / `slug` | Yes | Valid region in `tectonic_regions` | `REGION_NOT_FOUND` |

---

## 3. Communication & Safety Copy Standards

> [!CAUTION]
> **Strict Content Guardrails**
> The application layer must enforce strict UI copy guidelines to prevent public panic and disclaim prediction abilities.

| ❌ PROHIBITED UI COPY | ✅ ALLOWED SCIENTIFIC COPY |
| :--- | :--- |
| "An earthquake will occur in 2027." | "Statistical probability estimated over a 30-year time window." |
| "Dhaka is overdue for a magnitude 7 earthquake." | "Recurrence rate estimated at $1 / \lambda = X\text{ years}$ under Model Y." |
| "Our AI predicts seismic activity." | "Probabilities calculated from documented fault slip rates and historical catalogs." |

---

## 4. Multi-Model Range Disambiguation

When multiple authoritative hazard models exist for a region (e.g. Model A vs. Model B):

```text
Model A (GEM South Asia v2023.1):  18% Probability (M ≥ 6.5 in 30 yrs)
Model B (Regional Active Fault Model): 24% Probability (M ≥ 6.5 in 30 yrs)

Displayed Range: 18% – 24% (Model Dependent)
```

Never collapse distinct scientific models into a single un-attributed average number without documenting the underlying assumptions.

---

## 5. Definition of Done Checklist

- [ ] [ ] Probability calculations enforce Poissonian formula $P = 1 - e^{-\lambda t}$.
- [ ] [ ] UI text passes safety copy linting tests with zero prediction claims.
- [ ] [ ] Multi-model probability ranges display confidence intervals and source links.
