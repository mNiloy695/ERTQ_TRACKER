"use client";

import React from "react";
import { MapCanvas } from "../../components/map/MapCanvas";
import { useEarthquakesBbox } from "../../features/earthquake-explorer/hooks/useEarthquakesBbox";
import { EarthquakeDrawer } from "../../features/earthquake-explorer/components/EarthquakeDrawer";
import { useFilterStore } from "../../stores/useFilterStore";
import { Filter, Sliders, Calendar, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function MapPage() {
  const {
    minMagnitude,
    setMinMagnitude,
    maxMagnitude,
    setMaxMagnitude,
    depthRange,
    setDepthRange,
    resetFilters,
  } = useFilterStore();

  const { data: earthquakes, isLoading, isRefetching, refetch } = useEarthquakesBbox();

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-950">
      {/* Left Filter Sidebar */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
              <Filter className="h-4 w-4 text-amber-400" /> Filter Seismicity
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] font-medium text-slate-400 hover:text-amber-400 transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Magnitude Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Min Magnitude (M<sub>w</sub>)</span>
              <span className="font-mono font-bold text-amber-400">≥ {minMagnitude.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Depth Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-medium">Max Depth (km)</span>
              <span className="font-mono font-bold text-sky-400">≤ {depthRange[1]} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="700"
              step="10"
              value={depthRange[1]}
              onChange={(e) => setDepthRange([depthRange[0], parseInt(e.target.value)])}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Results Metric */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Events in Bounding Box</span>
              <button
                onClick={() => refetch()}
                className="text-slate-400 hover:text-slate-100 transition-colors"
                title="Refresh Map Query"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin text-amber-400" : ""}`} />
              </button>
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-100">
              {earthquakes?.length || 0} <span className="text-xs font-normal text-slate-500">records</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 pt-4 text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> PostGIS Spatial Index Active
        </div>
      </aside>

      {/* Main Map Viewport */}
      <main className="relative flex-1 h-full w-full p-3">
        <MapCanvas earthquakes={earthquakes} isLoading={isLoading || isRefetching} />
        <EarthquakeDrawer earthquakes={earthquakes} />
      </main>
    </div>
  );
}
