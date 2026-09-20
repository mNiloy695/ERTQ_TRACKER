# API Specification & Response Contracts

This document specifies the REST API endpoints, standard JSON/GeoJSON response envelopes, error structures, and Redis caching strategy for **SeismoAtlas**.

---

## 1. REST API Endpoint Registry

| Endpoint | Method | Description | Cache TTL |
| :--- | :--- | :--- | :--- |
| `/api/v1/earthquakes` | `GET` | Bounding box spatial search & multi-parameter filtered catalog list. | 5 mins |
| `/api/v1/earthquakes/{id}` | `GET` | Detailed metadata for a single earthquake event. | 24 hrs |
| `/api/v1/locations/search` | `GET` | Geocoding search (city, country, coordinates). | 1 hr |
| `/api/v1/locations/{id}` | `GET` | Location intelligence summary (seismicity stats, tectonic context). | 1 hr |
| `/api/v1/locations/{id}/earthquakes` | `GET` | Historical events within radius $R$ of location. | 15 mins |
| `/api/v1/locations/{id}/statistics` | `GET` | Magnitude distributions & temporal frequency charts. | 1 hr |
| `/api/v1/tectonics/plates` | `GET` | GeoJSON polygons for global tectonic plate boundaries. | 30 days |
| `/api/v1/tectonics/faults` | `GET` | GeoJSON linestrings for active seismic fault lines. | 30 days |
| `/api/v1/hazard/models` | `GET` | List available PSHA hazard models and version metadata. | 24 hrs |
| `/api/v1/hazard/maps` | `GET` | Fetch hazard map tile layers (PGA for 475y return period). | 7 days |
| `/api/v1/hazard/curves` | `GET` | Fetch hazard curve data points for location coordinates. | 24 hrs |
| `/api/v1/calculations` | `POST` | Trigger asynchronous OpenQuake hazard job (Auth required). | None |
| `/api/v1/calculations/{id}` | `GET` | Fetch status or results of background calculation job. | 1 hr |

---

## 2. Standard API Envelopes

### 2.1 Standard Data Response Envelope

```json
{
  "data": {
    "id": "70d24c04-9442-4b2e-a579-d1bfbf542c3d",
    "external_id": "us7000m123",
    "magnitude": 6.2,
    "magnitude_type": "Mw",
    "depth_km": 18.0,
    "origin_time": "2026-09-15T14:32:10Z",
    "location_name": "Mymensingh, Bangladesh",
    "coordinates": {
      "latitude": 24.120000,
      "longitude": 90.450000
    }
  },
  "meta": {
    "source": "USGS_COMCAT",
    "dataset_version": "2026-09-20",
    "execution_time_ms": 42
  },
  "errors": []
}
```

### 2.2 Scientific Calculation Response Envelope

```json
{
  "data": {
    "pga_value": 0.23,
    "unit": "g",
    "intensity_measure_type": "PGA",
    "annual_rate_of_exceedance": 0.002105
  },
  "scientific_context": {
    "model_name": "GEM South Asia PSHA Model",
    "model_version": "v2023.1",
    "time_window_years": 50,
    "probability_of_exceedance": 0.10,
    "return_period_years": 475
  },
  "provenance": {
    "dataset_snapshot": "USGS-ANSS-2026-09-20",
    "calculation_id": "HZ-2026-0920-0042",
    "config_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

---

## 3. Caching Strategy

Redis caches API responses to prevent database stress from high map zoom/pan query rates:

```text
Cache Key Pattern:
seismoatlas:cache:earthquakes:bbox:{min_lon}:{min_lat}:{max_lon}:{max_lat}:mag:{min_mag}:zoom:{zoom_level}
```

- **Cache Invalidation**: Caches automatically invalidate on model updates or historical catalog batch re-ingestion.
- **Model Version Guard**: Cache keys include model version strings to prevent stale scientific outputs.
