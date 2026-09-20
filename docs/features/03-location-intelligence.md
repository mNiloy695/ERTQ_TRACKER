# Feature Specification: FEAT-03 — Location Intelligence & Search

**Feature ID:** FEAT-03  
**Status:** `PENDING`  
**Target Component:** `frontend/features/location-intelligence`, `apps/locations`  
**Primary User Persona:** General Public, Urban Planners, Researchers  

---

## 1. Feature Goal & Scope

Enable users to search any global city, country, or coordinate pair and instantly receive a location intelligence profile detailing nearby historical earthquakes, magnitude distributions, epicentral distance breakdowns, and regional tectonic context.

---

## 2. Input Validation Rules

| Parameter | Type | Required | Constraints | Error Handling |
| :--- | :--- | :--- | :--- | :--- |
| `q` | `string` | Yes (or `lat`/`lon`) | $2 \le \text{length}(q) \le 100$ chars; sanitized text | Return empty search list if $< 2$ chars |
| `latitude` | `float` | No | $-90.0 \le \text{lat} \le 90.0$ | `INVALID_COORDINATES` |
| `longitude` | `float` | No | $-180.0 \le \text{lon} \le 180.0$ | `INVALID_COORDINATES` |
| `radius_km` | `float` | No | $10.0 \le \text{radius} \le 1000.0\text{ km}$ (Default: $300\text{ km}$) | Clamp value to $[10, 1000]$ |

---

## 3. Edge Cases & Boundary Handling

1. **Ambiguous City Names**:
   - *Scenario*: User searches "San Jose" (Matches San Jose, CA USA; San Jose, Costa Rica; San Jose, Philippines).
   - *Handling*: Geocoding service returns disambiguation dropdown showing country/administrative division badges.
2. **Ocean / Remote Island Search**:
   - *Scenario*: User clicks epicenter in mid-Atlantic Ocean $1500\text{ km}$ from nearest coast.
   - *Handling*: System displays exact coordinates, nearest landmass distance, and ocean basin tectonic setting without crashing city lookup.
3. **Locations with Zero Historical Seismicity**:
   - *Scenario*: User searches a stable craton area (e.g., Brasilia, Brazil) with no events $M \ge 4.0$ in historical record.
   - *Handling*: Display low intraplate historical seismicity badge and explain stable cratons without returning broken UI charts.

---

## 4. Failure Modes & Fallback

- **Geocoding API Unavailable**: Fall back to PostGIS local `locations` table spatial lookup.
- **Null Site Condition ($V_{s30}$)**: Display default regional site class (e.g. $V_{s30} = 760\text{ m/s}$, Rock) with provenance disclaimer tag.

---

## 5. Definition of Done Checklist

- [ ] [ ] Location search endpoint `/api/v1/locations/search` returns fuzzy matched cities under $100\text{ ms}$.
- [ ] [ ] Historical seismicity statistics compute nearby event count, max magnitude, and depth distribution.
- [ ] [ ] Disambiguation support works for duplicate city names.
