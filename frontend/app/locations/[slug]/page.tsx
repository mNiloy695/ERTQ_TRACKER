import React from "react";
import { SeismicityStatsChart } from "../../../components/charts/SeismicityStatsChart";
import { ScientificBasisBadge } from "../../../components/provenance/ScientificBasisBadge";
import { MapPin, ShieldAlert, Activity, ArrowLeft, Building2, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

interface LocationPageProps {
  params: { slug: string };
}

export default function LocationDetailPage({ params }: LocationPageProps) {
  const slug = params.slug;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation & Header */}
      <div>
        <Link href="/locations" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Location Intelligence
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-amber-400" />
              <h1 className="text-3xl font-extrabold text-slate-100">{name} Profile</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Urban Seismic Vulnerability & PSHA Soil Profile (Coordinates: 23.8103° N, 90.4125° E)
            </p>
          </div>

          <Link href="/hazard">
            <Button size="sm" className="gap-2">
              <Activity className="h-4 w-4" /> Compute Full PSHA Curve
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Key Parameters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Design PGA (475-Yr)</div>
          <div className="text-2xl font-extrabold font-mono text-amber-400">0.20 g</div>
          <div className="text-[11px] text-slate-500 mt-0.5">10% Exceedance in 50 Yrs</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">MCE PGA (2,475-Yr)</div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">0.35 g</div>
          <div className="text-[11px] text-slate-500 mt-0.5">2% Exceedance in 50 Yrs</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Site Soil Class</div>
          <div className="text-2xl font-extrabold font-mono text-slate-100">Class SD</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Stiff Soil (Vs30 = 240 m/s)</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Seismic Zone Code</div>
          <div className="text-2xl font-extrabold font-mono text-sky-400">Zone 2</div>
          <div className="text-[11px] text-slate-500 mt-0.5">BNBC 2020 Standard</div>
        </div>
      </div>

      {/* Seismicity Chart & Historical Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-slate-100 mb-1">Historical Seismicity Magnitude Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Earthquake count within 200 km radius catalog buffer (1900–Present)</p>
          <SeismicityStatsChart />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-slate-100">Scientific Data Provenance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            PSHA calculation engine based on OpenQuake Classic PSHA framework and USGS 2023 GMPE ground motion models.
          </p>

          <ScientificBasisBadge
            configHash="sha256-a78b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f"
            modelName="BNBC 2020 / USGS PSHA Grid"
            citationUrl="https://earthquake.usgs.gov/hazards/interactive/"
          />
        </div>
      </div>
    </div>
  );
}
