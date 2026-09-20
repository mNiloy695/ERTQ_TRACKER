# Feature Specification: FEAT-07 — Scientific Data Provenance

**Feature ID:** FEAT-07  
**Status:** `PENDING`  
**Target Component:** `frontend/components/provenance`, `apps/provenance`  
**Primary User Persona:** Researchers, Journalists, System Auditors  

---

## 1. Feature Goal & Scope

Deliver 100% transparent scientific provenance for every metric displayed across the platform via interactive **Scientific Basis** badges (`ⓘ`), exposing underlying datasets, model identifiers, `config_hash` checksums, and citation links.

---

## 2. Provenance Audit Schema

Every calculation response includes an immutable provenance block:

```json
{
  "scientific_basis": {
    "data_source_code": "USGS_ANSS_COMCAT",
    "dataset_snapshot_version": "2026-09-20T00:00:00Z",
    "model_name": "GEM South Asia PSHA Model",
    "model_version": "v2023.1",
    "calculation_id": "HZ-2026-0920-0042",
    "config_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "git_commit_sha": "a1b2c3d4e5f67890123456789abcdef012345678",
    "license": "CC-BY-4.0"
  }
}
```

---

## 3. Edge Cases & Boundary Handling

1. **Deprecated Model Version**:
   - *Scenario*: User views historical calculation run with model version `v2021.1` (now superseded by `v2023.1`).
   - *Handling*: Display "Superseded Model Version" tag in Provenance Modal pointing to updated version comparison view.
2. **Third-Party Data License Restrictions**:
   - *Scenario*: High-resolution fault dataset requires scientific citation or commercial usage restriction.
   - *Handling*: Provenance modal displays mandatory license badge (`CC-BY-4.0` / `Academic Only`) with link to original publication.

---

## 4. Definition of Done Checklist

- [ ] [ ] `ScientificBasisBadge` component renders on every location and hazard view.
- [ ] [ ] Provenance modal displays full `config_hash` and `calculation_id`.
- [ ] [ ] Clicking source citation opens authoritative dataset URI in new browser tab.
