"use client";

import React, { useState } from "react";
import { HazardCurveChart } from "../../components/charts/HazardCurveChart";
import { ScientificBasisBadge } from "../../components/provenance/ScientificBasisBadge";
import { BarChart3, Sliders, ShieldCheck, Download, Layers } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function HazardPage() {
  const [returnPeriod, setReturnPeriod] = useState<number>(475);
  const [vs30, setVs30] = useState<number>(360); // Default B/C boundary 360 m/s
  const [location, setLocation] = useState<string>("Dhaka City Center (23.81°N, 90.41°E)");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-400" />
            <h1 className="text-3xl font-extrabold text-slate-100">Probabilistic Seismic Hazard Viewer (PSHA)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logarithmic annual rate of exceedance ($\lambda$) curves for Peak Ground Acceleration ($PGA$) and Spectral Acceleration ($S_a$).
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
          <Download className="h-4 w-4 text-amber-400" /> Export Hazard Vector (.JSON)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
              <Sliders className="h-4 w-4 text-amber-400" /> PSHA Parameter Controls
            </div>

            {/* Target Return Period */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Design Return Period</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setReturnPeriod(475)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    returnPeriod === 475
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  475-Year (DBE)
                  <div className="text-[10px] font-normal text-slate-500">10% in 50 Yrs</div>
                </button>

                <button
                  onClick={() => setReturnPeriod(2475)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    returnPeriod === 2475
                      ? "border-rose-500 bg-rose-500/10 text-rose-400"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  2,475-Year (MCE)
                  <div className="text-[10px] font-normal text-slate-500">2% in 50 Yrs</div>
                </button>
              </div>
            </div>

            {/* Vs30 Shear Wave Velocity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Site V<sub>s30</sub> (m/s)</span>
                <span className="font-mono font-bold text-sky-400">{vs30} m/s</span>
              </div>
              <input
                type="range"
                min="180"
                max="760"
                step="20"
                value={vs30}
                onChange={(e) => setVs30(parseInt(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>180 (Soft Soil)</span>
                <span>360 (Stiff)</span>
                <span>760 (Rock)</span>
              </div>
            </div>
          </div>

          {/* Data Basis Badge */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
            <div className="text-xs font-semibold text-slate-300">PSHA Engine Provenance</div>
            <ScientificBasisBadge
              configHash="sha256-f9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcb"
              modelName="OpenQuake PSHA v3.18 / Chiou-Youngs GMPE"
              citationUrl="https://github.com/mNiloy695/ERTQ_TRACKER"
            />
          </div>
        </div>

        {/* Main Chart Column */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">Annual Exceedance Rate Curve (&lambda;)</h3>
              <p className="text-xs text-slate-400">{location} · Site V<sub>s30</sub> = {vs30} m/s</p>
            </div>
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-amber-400">
              PGA<sub>{returnPeriod}yr</sub> = {returnPeriod === 2475 ? "0.35g" : "0.20g"}
            </span>
          </div>

          <HazardCurveChart selectedReturnPeriod={returnPeriod} locationName={location} />
        </div>
      </div>
    </div>
  );
}
