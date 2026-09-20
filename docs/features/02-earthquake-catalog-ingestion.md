# Feature Specification: FEAT-02 — Earthquake Catalog Ingestion & Deduplication

**Feature ID:** FEAT-02  
**Status:** `PENDING`  
**Target Component:** `services/earthquake-ingestion`, `apps/earthquakes`  
**Primary User Persona:** Data Engineers, System Operators, Seismologists  

---

## 1. Feature Goal & Scope

Automate real-time and historical earthquake data ingestion from authoritative catalogs (USGS ANSS ComCat), preserve un-transformed raw API payloads for scientific auditability, and execute multi-network spatial-temporal deduplication to link regional network reports to canonical events.

---

## 2. Ingestion Validation Rules

| Attribute | Constraint / Rule | Action on Violation |
| :--- | :--- | :--- |
| `origin_time` | Valid UTC ISO-8601 string; cannot be in the future ($t \le t_{\text{now}} + 5\text{ mins}$) | Reject payload to Dead-Letter Queue |
| `latitude` | $-90.0 \le \text{lat} \le 90.0$ | Log schema error; skip record |
| `longitude` | $-180.0 \le \text{lon} \le 180.0$ | Log schema error; skip record |
| `depth_km` | $0.0 \le \text{depth} \le 700.0\text{ km}$ | Default missing depth to `0.0 km` with `depth_uncertain` flag |
| `magnitude` | $-1.0 \le M \le 10.0$ (Allows micro-earthquakes down to $-1.0$) | Reject payload if null or NaN |
| `external_id` | Non-empty string (e.g. `us7000m123`) | Enforce unique constraint; update if timestamp newer |

---

## 3. Deduplication Algorithm & Edge Cases

### Deduplication Matching Criteria
Two event records $A$ and $B$ match as identical physical earthquakes if:

$$\Delta t = |t_A - t_B| \le 16 \text{ seconds}$$

$$\Delta d = \text{ST\_DistanceSphere}(p_A, p_B) \le 50 \text{ km}$$

$$\Delta M = |M_A - M_B| \le 0.8$$

$$\Delta z = |z_A - z_B| \le 30 \text{ km}$$

### Edge Cases
1. **Network Parameter Revision**:
   - *Scenario*: USGS updates event magnitude from $Mw 6.1$ to $Mw 6.3$ 3 hours after initial report.
   - *Handling*: Ingestion pipeline updates canonical event fields, preserves previous version in `earthquake_source_records`, and bumps `catalog_version`.
2. **Missing Hypocentral Depth**:
   - *Scenario*: Regional seismic network reports epicenter but leaves depth null.
   - *Handling*: Pipeline stores record with `depth_km = 0.0` and sets `is_depth_estimated = True`.
3. **Network Outage / Rate Limit**:
   - *Scenario*: USGS API returns `429 Too Many Requests` or `503 Service Unavailable`.
   - *Handling*: Celery task retries with exponential backoff ($2^n$ seconds, max 5 attempts). Fires alert if outage $> 1\text{ hour}$.

---

## 4. Failure Modes & Fallback

- **Malformed JSON Payload**: Stored in `raw_payload_failures` table for manual review.
- **Worker Crash During Processing**: Transaction rollback (`@transaction.atomic`) prevents partial/corrupt database states.

---

## 5. Definition of Done Checklist

- [ ] [ ] Celery ingestion worker runs on automated 5-minute schedule.
- [ ] [ ] Deduplication matching passes candidate tests for multi-network events.
- [ ] [ ] Raw JSON payloads are safely archived in Cloudflare R2 / PostgreSQL raw table.
- [ ] [ ] Ingestion freshness metrics report to Prometheus.
