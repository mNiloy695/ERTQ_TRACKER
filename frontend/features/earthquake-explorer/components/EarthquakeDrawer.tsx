"use client";

import React from "react";
import { Drawer } from "../../../components/ui/Drawer";
import { useMapStore } from "../../../stores/useMapStore";
import { Earthquake } from "../../../types/earthquake";
import { Badge } from "../../../components/ui/Badge";
import { ScientificBasisBadge } from "../../../components/provenance/ScientificBasisBadge";
import { MapPin, Clock, ArrowDown, Globe, Compass } from "lucide-react";

interface EarthquakeDrawerProps {
  earthquakes?: Earthquake[];
}

export const EarthquakeDrawer: React.FC<EarthquakeDrawerProps> = ({ earthquakes = [] }) => {
  const { selectedEarthquakeId, setSelectedEarthquakeId } = useMapStore();

  const selectedEvent = earthquakes.find((eq) => eq.id === selectedEarthquakeId);
  const eventTimeStr = selectedEvent?.event_time || selectedEvent?.origin_time || new Date().toISOString();

  return (
    <Drawer
      isOpen={!!selectedEarthquakeId}
      onClose={() => setSelectedEarthquakeId(null)}
      title="Earthquake Details"
    >
      {selectedEvent ? (
        <div className="space-y-5 text-sm">
          {/* Main Magnitude Header */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Magnitude</div>
              <div className="text-3xl font-extrabold text-slate-100 flex items-baseline gap-2 mt-0.5">
                M<sub>w</sub> {selectedEvent.magnitude}
              </div>
            </div>
            <Badge variant="magnitude" magnitude={selectedEvent.magnitude} className="px-3 py-1.5 text-sm">
              {selectedEvent.magnitude >= 7.0
                ? "Major Earthquake"
                : selectedEvent.magnitude >= 5.5
                ? "Moderate Earthquake"
                : "Minor Seismicity"}
            </Badge>
          </div>

          {/* Location & Time */}
          <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
            <div className="flex items-start gap-2 text-slate-200">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{selectedEvent.location_description || selectedEvent.location_name || "Epicentral Region"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Event Time (UTC): {new Date(eventTimeStr).toUTCString()}</span>
            </div>
          </div>

          {/* Focal Depth & Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <ArrowDown className="h-3.5 w-3.5 text-sky-400" /> Focal Depth
              </div>
              <div className="text-base font-bold text-slate-100">{selectedEvent.depth_km} km</div>
              <span className="text-[11px] text-slate-500">
                {selectedEvent.depth_km <= 70 ? "Shallow Crustal" : selectedEvent.depth_km <= 300 ? "Intermediate" : "Deep Focus"}
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Compass className="h-3.5 w-3.5 text-emerald-400" /> Epicenter
              </div>
              <div className="text-xs font-mono font-bold text-slate-200">
                {selectedEvent.latitude.toFixed(4)}°N
              </div>
              <div className="text-xs font-mono text-slate-400">
                {selectedEvent.longitude.toFixed(4)}°E
              </div>
            </div>
          </div>

          {/* Tectonic Context */}
          {selectedEvent.tectonic_context && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Globe className="h-4 w-4 text-purple-400" /> Tectonic Setting
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedEvent.tectonic_context}
              </p>
            </div>
          )}

          {/* Provenance Basis Badge */}
          <div className="border-t border-slate-800/80 pt-4">
            <div className="text-xs font-medium text-slate-400 mb-2">Scientific Data Provenance</div>
            <ScientificBasisBadge
              configHash={selectedEvent.config_hash || "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
              modelName={selectedEvent.source_record?.catalog_name || selectedEvent.source || "USGS Global Earthquake Catalog"}
              citationUrl="https://earthquake.usgs.gov/earthquakes/search/"
            />
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-slate-500">
          No event details found.
        </div>
      )}
    </Drawer>
  );
};
