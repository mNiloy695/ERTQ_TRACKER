import React from "react";
import { CitySearch } from "../../features/location-intelligence/components/CitySearch";
import { MapPin, Building2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LocationsOverviewPage() {
  const featuredLocations = [
    { name: "Dhaka", slug: "dhaka", zone: "Zone 2 (PGA 0.20g)", pga: 0.2, country: "Bangladesh" },
    { name: "Chittagong", slug: "chittagong", zone: "Zone 3 (PGA 0.28g)", pga: 0.28, country: "Bangladesh" },
    { name: "Sylhet", slug: "sylhet", zone: "Zone 4 (PGA 0.36g)", pga: 0.36, country: "Bangladesh" },
    { name: "Tokyo", slug: "tokyo", zone: "High Hazard (PGA 0.45g)", pga: 0.45, country: "Japan" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 mb-4">
          <Building2 className="h-3.5 w-3.5" /> Urban & Regional Seismicity Profiles
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 sm:text-4xl">Location Intelligence Explorer</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Search any city or regional centroid to inspect seismic zoning parameters, design ground motions, historical catalog statistics, and nearby tectonic fault traces.
        </p>

        <div className="mt-8 flex justify-center">
          <CitySearch />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {featuredLocations.map((loc) => (
          <Link
            key={loc.slug}
            href={`/locations/${loc.slug}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-amber-500/50 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold">
                <MapPin className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                {loc.name}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{loc.country}</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div>Seismic Rating: <span className="text-slate-200 font-medium">{loc.zone}</span></div>
              <div>Peak Ground Accel: <span className="text-amber-400 font-mono font-bold">{loc.pga}g</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
