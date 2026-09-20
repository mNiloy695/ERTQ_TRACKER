import { create } from 'zustand';

export interface ActiveLayers {
  earthquakes: boolean;
  faults: boolean;
  plateBoundaries: boolean;
  hazardMap: boolean;
  hazardMaps?: boolean;
}

interface MapState {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  activeLayers: ActiveLayers;
  layers: ActiveLayers;
  selectedEarthquakeId: string | null;
  setViewport: (viewport: { latitude: number; longitude: number; zoom: number }) => void;
  toggleLayer: (layer: keyof ActiveLayers | "hazardMaps") => void;
  setSelectedEarthquakeId: (id: string | null) => void;
}

const defaultLayers: ActiveLayers = {
  earthquakes: true,
  faults: true,
  plateBoundaries: true,
  hazardMap: false,
  hazardMaps: false,
};

export const useMapStore = create<MapState>((set) => ({
  viewport: {
    latitude: 23.8103,
    longitude: 90.4125,
    zoom: 4,
  },
  activeLayers: defaultLayers,
  layers: defaultLayers,
  selectedEarthquakeId: null,
  setViewport: (viewport) => set({ viewport }),
  toggleLayer: (layerKey) =>
    set((state) => {
      const targetKey = layerKey === "hazardMaps" ? "hazardMap" : layerKey;
      const updatedValue = !state.activeLayers[targetKey];
      const updatedLayers = {
        ...state.activeLayers,
        [targetKey]: updatedValue,
        hazardMaps: targetKey === "hazardMap" ? updatedValue : state.activeLayers.hazardMap,
      };
      return {
        activeLayers: updatedLayers,
        layers: updatedLayers,
      };
    }),
  setSelectedEarthquakeId: (id) => set({ selectedEarthquakeId: id }),
}));
