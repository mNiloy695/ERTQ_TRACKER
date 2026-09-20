# Scientific Methodology & Principles

This document outlines the core scientific principles, distinction between seismic hazard and risk, scientific positioning, and guidelines for artificial intelligence integration in **SeismoAtlas**.

---

## 1. Core Scientific Principles

### 1.1 Hazard vs. Risk Distinction

A fundamental pillar of SeismoAtlas is maintaining a strict scientific distinction between **Seismic Hazard** and **Seismic Risk**.

#### Seismic Hazard
Seismic Hazard addresses the physical question:
> **“How likely is potentially damaging ground motion at a specific geographic location during a defined time window?”**

Hazard metrics include:
- Peak Ground Acceleration (PGA)
- Spectral Acceleration (SA at $T = 0.2\text{s}, 1.0\text{s}$)
- Probability of Exceedance over a time horizon ($t = 50\text{ years}$)
- Hazard Curves (Ground motion intensity vs. annual rate of exceedance)

#### Seismic Risk
Seismic Risk addresses the socio-economic question:
> **“What loss or consequences could occur to human populations, buildings, and infrastructure if that ground motion occurs?”**

Seismic Risk is defined by the classical formulation:

$$\text{Risk} = \text{Hazard} \times \text{Exposure} \times \text{Vulnerability}$$

```text
       ┌────────────────────────┐
       │     Seismic Hazard     │
       │ (Ground Shaking Prob)  │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │    Built Exposure      │
       │ (Buildings/Population) │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │ Structural Vulnerability│
       │   (Fragility Curves)   │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │      Seismic Risk      │
       │  (Loss & Casualties)   │
       └────────────────────────┘
```

---

## 2. Scientific Positioning

SeismoAtlas positions itself strictly as an **educational and analytical platform** for authoritative seismic data.

1. **Deterministic Predictions Excluded**: The physical processes governing earthquake nucleation remain non-deterministic with present technology. The platform explicitly disclaims any deterministic earthquake prediction capabilities.
2. **Probabilistic Statements Only**: All future seismic projections are expressed as statistical probabilities ($P(M \ge m \text{ in } \Delta t)$) calculated from documented seismic source models, Gutenberg-Richter recurrence parameters ($\log_{10} N = a - b M$), and Fault slip rates.
3. **Model Dependence**: Every probability calculation depends directly on input datasets, fault geometries, and Ground Motion Models (GMMs). No single metric is absolute.

---

## 3. Future AI Layer Standards

When AI features (Large Language Models or natural language query interfaces) are added to SeismoAtlas, they act strictly as an **Explanation Layer** rather than a scientific prediction engine.

### Allowed AI Operations
- **Explaining Complex Concepts**: Translating technical terms (e.g., "Peak Ground Acceleration", "Return Period", "Moment Magnitude") into accessible language.
- **Synthesizing Authoritative Datasets**: Summarizing documented regional seismicity and fault mechanisms based on peer-reviewed citations.
- **Interactive Chart Explanations**: Helping users interpret hazard curves, magnitude-frequency distributions, and site-amplification graphs.

### Prohibited AI Operations
- **Generating Autonomous Predictions**: AI models must never generate estimated earthquake dates, magnitudes, or exact locations.
- **Synthesizing Undocumented Probabilities**: AI models must never calculate "custom" probability numbers outside established OpenQuake engine workflows or peer-reviewed literature.
