"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "../../stores/useMapStore";
import { useFilterStore } from "../../stores/useFilterStore";
import { Earthquake } from "../../types/earthquake";
import { Layers, Eye, EyeOff, Maximize2 } from "lucide-react";

interface MapCanvasProps {
  earthquakes?: Earthquake[];
  isLoading?: boolean;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ earthquakes = [], isLoading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  
  const { setSelectedEarthquakeId, layers, toggleLayer } = useMapStore();
  const { setBbox } = useFilterStore();

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: [
          {
            id: "carto-dark-layer",
            type: "raster",
            source: "carto-dark",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [90.3563, 23.6850], // Default center Bangladesh / South Asia regional context
      zoom: 5,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    map.on("moveend", () => {
      const bounds = map.getBounds();
      setBbox([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]);
    });

    map.on("load", () => {
      // Set initial bbox
      const bounds = map.getBounds();
      setBbox([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [setBbox]);

  // Update earthquakes GeoJSON layer on map
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: earthquakes.map((eq) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [eq.longitude, eq.latitude],
        },
        properties: {
          id: eq.id,
          magnitude: eq.magnitude,
          depth: eq.depth_km,
          time: eq.event_time,
          location: eq.location_description,
        },
      })),
    };

    if (map.getSource("earthquakes")) {
      (map.getSource("earthquakes") as maplibregl.GeoJSONSource).setData(geojson);
    } else if (map.isStyleLoaded()) {
      map.addSource("earthquakes", {
        type: "geojson",
        data: geojson,
      });

      // Heatmap Layer
      map.addLayer({
        id: "earthquakes-heat",
        type: "heatmap",
        source: "earthquakes",
        layout: {
          visibility: layers.hazardMaps ? "visible" : "none",
        },
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "magnitude"], 3, 0, 8, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          "heatmap-opacity": 0.65,
        },
      });

      // Earthquake Points Layer
      map.addLayer({
        id: "earthquakes-point",
        type: "circle",
        source: "earthquakes",
        layout: {
          visibility: layers.earthquakes ? "visible" : "none",
        },
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "magnitude"],
            3, 4,
            5, 8,
            7, 16,
            9, 28,
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "magnitude"],
            3.0, "#34d399",
            4.5, "#facc15",
            6.0, "#fb923c",
            7.0, "#f43f5e",
            8.0, "#a855f7",
          ],
          "circle-opacity": 0.85,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#0f172a",
        },
      });

      // Hover / Cursor effect
      map.on("mouseenter", "earthquakes-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "earthquakes-point", () => {
        map.getCanvas().style.cursor = "";
      });

      // Click event
      map.on("click", "earthquakes-point", (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          if (props && props.id) {
            setSelectedEarthquakeId(props.id);
          }
        }
      });
    }
  }, [earthquakes, layers, setSelectedEarthquakeId]);

  // Update layer visibility dynamically
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer("earthquakes-point")) {
      map.setLayoutProperty("earthquakes-point", "visibility", layers.earthquakes ? "visible" : "none");
    }
    if (map.getLayer("earthquakes-heat")) {
      map.setLayoutProperty("earthquakes-heat", "visibility", layers.hazardMaps ? "visible" : "none");
    }
  }, [layers]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
      <div ref={mapContainer} className="h-full w-full" />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-amber-400 backdrop-blur-md shadow-lg">
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          Fetching spatial seismic features...
        </div>
      )}

      {/* Layer Toggle Floating Widget */}
      <div className="absolute top-4 right-14 z-10">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur-md hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Layers className="h-4 w-4 text-amber-400" />
          Layers
        </button>

        {showLayerMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl space-y-2 text-xs text-slate-300">
            <div className="font-semibold text-slate-100 border-b border-slate-800 pb-1 text-[11px] uppercase tracking-wider">
              Map Layers
            </div>
            <button
              onClick={() => toggleLayer("earthquakes")}
              className="flex w-full items-center justify-between py-1 hover:text-slate-100"
            >
              <span>Seismic Epicenters</span>
              {layers.earthquakes ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5 text-slate-600" />}
            </button>
            <button
              onClick={() => toggleLayer("hazardMaps")}
              className="flex w-full items-center justify-between py-1 hover:text-slate-100"
            >
              <span>Seismicity Heatmap</span>
              {layers.hazardMaps ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5 text-slate-600" />}
            </button>
            <button
              onClick={() => toggleLayer("faults")}
              className="flex w-full items-center justify-between py-1 hover:text-slate-100"
            >
              <span>Tectonic Faults</span>
              {layers.faults ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5 text-slate-600" />}
            </button>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-4 z-10 rounded-xl border border-slate-800 bg-slate-900/90 p-3 backdrop-blur-md text-[11px] text-slate-300 shadow-xl hidden sm:block">
        <div className="font-bold text-slate-200 mb-2">Magnitude Scale (M<sub>w</sub>)</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> &lt;4.0</div>
          <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" /> 4.0-5.5</div>
          <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-400 inline-block" /> 5.5-6.5</div>
          <div className="flex items-center gap-1"><span className="h-3.5 w-3.5 rounded-full bg-rose-500 inline-block" /> 6.5-7.5</div>
          <div className="flex items-center gap-1"><span className="h-4 w-4 rounded-full bg-purple-500 inline-block" /> &gt;7.5</div>
        </div>
      </div>
    </div>
  );
};
