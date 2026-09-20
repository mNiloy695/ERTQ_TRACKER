# Seismic Hazard & Risk Modeling

This document details the scientific calculation frameworks, OpenQuake engine integration architecture, Probabilistic Seismic Hazard Analysis (PSHA), scenario modeling, and risk pipelines for **SeismoAtlas**.

---

## 1. OpenQuake Engine Integration

Rather than implementing custom ground-motion attenuation or hazard calculation routines from scratch, SeismoAtlas integrates the open-source **OpenQuake Engine** (developed by the Global Earthquake Model - GEM Foundation).

```text
┌─────────────────────────────────────────────────────────┐
│                    Django REST API                      │
└────────────────────────────┬────────────────────────────┘
                             │ Calculation Request
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Celery Job Queue                     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                OpenQuake Scientific Worker              │
│  - Classical PSHA                                       │
│  - Event-Based PSHA                                     │
│  - Scenario Shaking & Damage                            │
└────────────────────────────┬────────────────────────────┘
                             │ Results Artifacts (HDF5/XML)
                             ▼
┌─────────────────────────────────────────────────────────┐
│       Cloudflare R2 Object Storage & PostGIS Metadata   │
└─────────────────────────────────────────────────────────┘
```

### Supported OpenQuake Workflows

1. **Classical PSHA**: Calculates hazard curves, hazard maps, and uniform hazard spectra for a specified spatial grid over fixed time horizons (e.g., $10\%$ exceedance in $50\text{ years}$, equivalent to a $475\text{-year}$ return period).
2. **Event-Based PSHA**: Generates stochastic event sets (SES) and synthetic earthquake catalogs to evaluate hazard and risk distributions.
3. **Scenario Hazard**: Models specific fault rupture scenarios (e.g., $M_w 7.5$ event on the Dauki Fault) to compute deterministic ground motion maps across affected regions.

---

## 2. Probabilistic Seismic Hazard (PSHA) Details

### 2.1 Hazard Curves

A hazard curve plots the ground motion intensity measure (e.g., PGA in $g$) on the horizontal axis against the annual rate of exceedance ($\lambda$) on the vertical axis.

```text
Ground Motion Intensity (PGA in g)
     ▲
 1.0 ┼               /
     │              /
 0.5 ┼             /
     │            /
 0.1 ┼───────────/
     └───────────┴──────────────────────►
       10⁻⁴    10⁻³    10⁻²    10⁻¹
         Annual Rate of Exceedance (λ)
```

### 2.2 Return Period Formulation

Return period ($T_R$) is calculated as the inverse of the annual rate of exceedance:

$$T_R = \frac{1}{\lambda}$$

> [!WARNING]
> **Important Scientific Labeling**
> Return period is a statistical metric representing average long-term recurrence rates. It is **not** a deterministic timer or countdown to the next earthquake.

### 2.3 Probability of Exceedance over Time Horizon

The probability $P$ of exceeding a specified ground motion threshold over a time window $t$ (e.g., $t = 50\text{ years}$) assuming a Poissonian process is:

$$P(t) = 1 - e^{-\lambda t}$$

For a $475\text{-year}$ return period ($\lambda = 1/475 \approx 0.002105$ per year) over $t = 50\text{ years}$:

$$P(50) = 1 - e^{-0.002105 \times 50} \approx 1 - e^{-0.10526} \approx 0.10 \text{ (10\%)}$$

---

## 3. "Next Earthquake" Feature Implementation

To fulfill user interest regarding future earthquakes without compromising scientific integrity, SeismoAtlas implements **Seismic Threshold Probabilities** instead of deterministic predictions.

### ❌ Incorrect Implementation (Prohibited)
```text
Next Earthquake Prediction:
Date: October 14, 2027
Location: Dhaka, Bangladesh
Magnitude: 6.8 Mw
```

### ✅ Correct Implementation (Implemented)
```text
Future Seismic Probability (30-Year Horizon)

Region: Greater Dhaka Basin
Selected Model: GEM South Asia PSHA Model v2023.1
Magnitude Threshold: M ≥ 6.0
Time Window: 30 Years (2026 - 2056)

Estimated Probability of Occurrence: 18% - 24% (Model Dependent)

Interpretation:
This is a statistical estimate calculated from documented fault slip rates 
and historical seismicity. It does not predict a specific earthquake date.
```

---

## 4. Phase 3 — Risk Analysis Pipeline

In Phase 3, SeismoAtlas combines PSHA ground motion fields with spatial exposure datasets and building fragility functions:

```text
 Hazard (Ground Motion Field) 
             +
 Exposure (Building Inventory & Population Grid)
             +
 Vulnerability (Damage State & Fragility Curves)
             =
 Seismic Risk (Expected Annual Loss / Damage Distribution)
```

Key outputs include:
- **Expected Annual Loss (EAL)** in local currency.
- **Loss Exceedance Curves** (PML - Probable Maximum Loss).
- **Exposed Population Statistics** per shaking intensity zone (MMI VI to IX).
