import { create } from 'zustand';

interface BboxObj {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

interface FilterState {
  minMagnitude: number;
  maxMagnitude: number;
  maxDepthKm: number;
  depthRange: [number, number];
  bbox: [number, number, number, number] | null;
  minLon: number | null;
  minLat: number | null;
  maxLon: number | null;
  maxLat: number | null;
  setMinMagnitude: (mag: number) => void;
  setMaxMagnitude: (mag: number) => void;
  setMaxDepthKm: (depth: number) => void;
  setDepthRange: (range: [number, number]) => void;
  setBbox: (bbox: [number, number, number, number] | BboxObj) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  minMagnitude: 4.0,
  maxMagnitude: 10.0,
  maxDepthKm: 700,
  depthRange: [0, 700],
  bbox: null,
  minLon: null,
  minLat: null,
  maxLon: null,
  maxLat: null,
  setMinMagnitude: (minMagnitude) => set({ minMagnitude }),
  setMaxMagnitude: (maxMagnitude) => set({ maxMagnitude }),
  setMaxDepthKm: (maxDepthKm) => set({ maxDepthKm, depthRange: [0, maxDepthKm] }),
  setDepthRange: (depthRange) => set({ depthRange, maxDepthKm: depthRange[1] }),
  setBbox: (bbox) => {
    if (Array.isArray(bbox)) {
      set({
        bbox,
        minLon: bbox[0],
        minLat: bbox[1],
        maxLon: bbox[2],
        maxLat: bbox[3],
      });
    } else {
      set({
        bbox: [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat],
        minLon: bbox.minLon,
        minLat: bbox.minLat,
        maxLon: bbox.maxLon,
        maxLat: bbox.maxLat,
      });
    }
  },
  resetFilters: () =>
    set({
      minMagnitude: 4.0,
      maxMagnitude: 10.0,
      maxDepthKm: 700,
      depthRange: [0, 700],
      bbox: null,
      minLon: null,
      minLat: null,
      maxLon: null,
      maxLat: null,
    }),
}));
