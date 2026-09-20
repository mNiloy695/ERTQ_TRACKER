# Next.js Frontend Architecture Specification

This document details the frontend application architecture for **SeismoAtlas**, built using **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, **MapLibre GL JS**, **TanStack Query**, **Zustand**, and **Apache ECharts**.

---

## 1. Directory & Feature Package Layout

The frontend application follows a **Modular Feature-Based Architecture** to ensure scalable component isolation, type safety, and clean separation of UI components, server state, client state, and API services.

```text
frontend/
├── app/                         # NEXT.JS APP ROUTER (Pages & Layouts)
│   ├── layout.tsx               # Root layout (Providers, Navbar, Footer)
│   ├── page.tsx                 # Landing page
│   ├── map/
│   │   └── page.tsx             # Interactive World Earthquake Map
│   ├── earthquakes/
│   │   ├── page.tsx             # Earthquake catalog explorer
│   │   └── [id]/
│   │       └── page.tsx         # Detailed earthquake event page
│   ├── locations/
│   │   └── [slug]/
│   │       └── page.tsx         # Location intelligence summary
│   ├── hazard/
│   │   └── page.tsx             # Probabilistic hazard curves & maps
│   └── compare/
│       └── page.tsx             # Location hazard comparison tool
│
├── components/                  # SHARED COMMON UI COMPONENTS
│   ├── ui/                      # Atomic Base UI (Button, Modal, Card, Badge, Input, Drawer)
│   ├── map/                     # Shared Map Canvas, Controls, Legend, LayerToggles
│   ├── charts/                  # Reusable ECharts wrappers (HazardCurveChart, MagFreqChart)
│   ├── provenance/              # ScientificBasisBadge, ProvenanceModal components
│   └── layout/                  # Navbar, Sidebar, Footer, PageHeader
│
├── features/                    # DOMAIN FEATURE MODULES
│   ├── earthquake-explorer/     # Map filters, event drawer, bounding box query hooks
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── location-intelligence/   # City search, local seismicity timeline, fault proximity
│   ├── hazard-analysis/         # OpenQuake hazard curve calculation viewer & return period selector
│   └── tectonic-analysis/       # Plate boundary overlay & regional fault descriptions
│
├── lib/                         # CENTRALIZED FRONTEND UTILITIES & CLIENTS
│   ├── api/                     # Centralized Axios/Fetch API Client & Interceptors
│   ├── geo/                     # MapLibre helpers, bbox utilities, coordinate formatters
│   ├── constants/               # API endpoints, map style URLs, default viewport settings
│   └── utils/                   # ClassName merger (clsx/tailwind-merge), date formatters
│
├── hooks/                       # GLOBAL REUSABLE HOOKS
│   ├── useDebounce.ts           # Input & map move debouncer
│   └── useMediaQuery.ts         # Responsive design breakpoints
│
├── stores/                      # CENTRALIZED CLIENT STATE (Zustand)
│   ├── useMapStore.ts           # Active map viewport, zoom, active layers
│   ├── useFilterStore.ts        # Magnitude, depth, time filters
│   └── useUIStore.ts            # Active drawer, sidebar open state, theme
│
├── types/                       # SHARED TYPES & API CONTRACTS
│   ├── api.ts                   # Standard API Envelope & Error types
│   ├── earthquake.ts            # Earthquake event & GeoJSON types
│   ├── hazard.ts                # PSHA, return period & ground motion types
│   └── location.ts              # Location summary & tectonic context types
│
├── public/                      # Static assets, map basemap icons, favicons
└── package.json
```

---

## 2. Centralized State Architecture

SeismoAtlas categorizes frontend state into three distinct layers:

```text
 ┌─────────────────────────────────────────────────────────┐
 │ 1. Server State (TanStack Query / React Query)          │
 │    Fetches, caches, invalidates, and retries REST API   │
 │    queries for earthquakes, hazard curves, & locations. │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 2. Client State (Zustand)                               │
 │    Manages active map layer visibility, active drawers, │
 │    UI theme, and transient filter selections.          │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 3. URL State (Next.js SearchParams / Nuqs)              │
 │    Synchronizes map bounding box, zoom level, and       │
 │    magnitude filters into shareable URL query strings.  │
 └─────────────────────────────────────────────────────────┘
```

### 2.1 Centralized API Client (`lib/api/client.ts`)

All HTTP requests pass through a centralized API client with uniform response envelope unwrapping and global error handling:

```typescript
// lib/api/client.ts
export interface ApiEnvelope<T> {
  data: T;
  meta: {
    page?: number;
    page_size?: number;
    total_records?: number;
    execution_time_ms?: number;
    source?: string;
  };
  errors: Array<{ field?: string; message: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiEnvelope<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || `API Request Failed: ${response.statusText}`);
  }

  return response.json();
}
```

---

### 2.2 Client State Store (`stores/useMapStore.ts`)

Zustand manages ephemeral UI states such as map layer visibility:

```typescript
// stores/useMapStore.ts
import { create } from 'zustand';

interface MapState {
  activeLayers: {
    earthquakes: boolean;
    faults: boolean;
    plateBoundaries: boolean;
    hazardMap: boolean;
  };
  selectedEarthquakeId: string | null;
  toggleLayer: (layer: keyof MapState['activeLayers']) => void;
  setSelectedEarthquakeId: (id: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLayers: {
    earthquakes: true,
    faults: true,
    plateBoundaries: false,
    hazardMap: false,
  },
  selectedEarthquakeId: null,
  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layer]: !state.activeLayers[layer],
      },
    })),
  setSelectedEarthquakeId: (id) => set({ selectedEarthquakeId: id }),
}));
```

---

## 3. Vector Map Architecture (MapLibre GL JS)

The core map view dynamically queries PostGIS spatially based on the active browser viewport bounding box:

```typescript
// features/earthquake-explorer/hooks/useEarthquakesBbox.ts
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api/client';
import { Earthquake } from '@/types/earthquake';

interface BboxParams {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
  minMagnitude?: number;
}

export function useEarthquakesBbox(params: BboxParams) {
  const queryString = new URLSearchParams({
    min_lon: params.minLon.toString(),
    min_lat: params.minLat.toString(),
    max_lon: params.maxLon.toString(),
    max_lat: params.maxLat.toString(),
    ...(params.minMagnitude && { min_magnitude: params.minMagnitude.toString() }),
  }).toString();

  return useQuery({
    queryKey: ['earthquakes', 'bbox', queryString],
    queryFn: () => fetchApi<Earthquake[]>(`/earthquakes?${queryString}`),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!params.minLon,
  });
}
```

---

## 4. Data Provenance UI Component

Every displayed scientific metric renders a **Scientific Basis** badge (`components/provenance/ScientificBasisBadge.tsx`):

```tsx
// components/provenance/ScientificBasisBadge.tsx
import React, { useState } from 'react';
import { ProvenanceModal } from './ProvenanceModal';

interface ProvenanceProps {
  source: string;
  modelName: string;
  modelVersion: string;
  timeWindowYears: number;
  probabilityOfExceedance?: number;
}

export const ScientificBasisBadge: React.FC<ProvenanceProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
      >
        <span>ⓘ Scientific Basis</span>
      </button>
      {isOpen && <ProvenanceModal {...props} onClose={() => setIsOpen(false)} />}
    </>
  );
};
```
