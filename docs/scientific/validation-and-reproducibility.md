# Scientific Validation & Reproducibility

This document defines the 4-layer validation framework, reproducibility standards, parameter auditing, and regression test suites for **SeismoAtlas**.

---

## 1. The 4-Layer Validation Framework

To ensure all scientific outputs are defensible, reliable, and consistent, SeismoAtlas enforces four continuous validation layers:

```text
┌─────────────────────────────────────────────────────────┐
│ 1. Data Validation Layer                                │
│    Coordinate bounds, magnitude ranges, hypocenter      │
│    depths, UTC timestamps, duplicate detection.         │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Model Validation Layer                               │
│    Fault geometry sanity, recurrence parameter bounds,  │
│    Ground Motion Model (GMM) applicability range.       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Numerical Validation Layer                           │
│    Cross-verification against official OpenQuake outputs│
│    and benchmark reference calculations.                │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Geographic Validation Layer                          │
│    Targeted verification across global test regions:    │
│    Japan, California, Nepal, Indonesia, Türkiye, BD.   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Scientific Reproducibility Specification

Every calculation executed by the platform generates an immutable provenance record containing exact model hashes and parameters.

### Calculation Provenance Schema

```json
{
  "calculation_id": "HZ-2026-0920-0042",
  "engine_version": "OpenQuake 3.19.0",
  "model_identifier": "GEM-GLOBAL-PSHA-2023",
  "dataset_snapshot_version": "USGS-ANSS-2026-09-20T00:00:00Z",
  "intensity_measure_type": "PGA",
  "site_condition_vs30_m_s": 760,
  "time_horizon_years": 50,
  "probability_of_exceedance": 0.10,
  "configuration_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "input_parameters_hash": "8f4e5124a2d3c0e305d620ec6799805d9e5f5f7259160d7362f6b7d27e80d859",
  "git_commit_sha": "a1b2c3d4e5f67890123456789abcdef012345678",
  "created_at": "2026-09-20T18:50:00Z"
}
```

---

## 3. Regression & Auditability Policies

1. **Model Version Locking**: Changes to underlying scientific models (e.g., updating from GEM v2022 to v2023) do not overwrite historical calculation results. Previous results remain tagged with their original `model_version`.
2. **Deterministic Re-runs**: Given a specific `configuration_hash` and `input_parameters_hash`, the scientific worker must produce an identical output within numerical tolerances ($< 10^{-6}$).
3. **Automated Scientific Regression Suite**: Every CI/CD pipeline execution runs reference calculation scripts against baseline benchmark locations (e.g., San Francisco PGA $10\%$ in $50\text{ yrs} = 0.45g \pm 0.02g$). Tests fail if output deviates beyond acceptable tolerances.
