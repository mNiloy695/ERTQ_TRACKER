import React from "react";
import Link from "next/link";
import { CitySearch } from "../features/location-intelligence/components/CitySearch";
import { Activity, MapPin, BarChart3, ShieldCheck, Compass, ArrowRight, Layers, Database } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Glow */}
      <div className="absolute top-12 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute top-64 right-10 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-[100px]" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 backdrop-blur-md mb-6 shadow-sm">
          <Activity className="h-4 w-4" /> Open-Science Seismic & PSHA Intelligence Engine
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 sm:text-6xl max-w-4xl mx-auto leading-[1.15]">
          Explore Global Earthquakes, Tectonic Faults & <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">PSHA Curves</span>
        </h1>

        <p className="mt-6 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PostGIS-powered spatial earthquake filtering, vector mapping, probabilistic ground motion hazard calculations, and open data provenance tracking.
        </p>

        {/* City Search Bar */}
        <div className="mt-10 flex justify-center">
          <CitySearch />
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/map">
            <Button size="lg" className="gap-2 shadow-amber-500/20">
              <Compass className="h-5 w-5" /> Launch Interactive Map
            </Button>
          </Link>
          <Link href="/hazard">
            <Button variant="secondary" size="lg" className="gap-2">
              <BarChart3 className="h-5 w-5 text-amber-400" /> PSHA Hazard Viewer
            </Button>
          </Link>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="w-full border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-md py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4">
            <div className="text-3xl font-extrabold text-amber-400 font-mono">150,000+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Catalog Events</div>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">1,240</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Active Fault Traces</div>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4">
            <div className="text-3xl font-extrabold text-sky-400 font-mono">0.05° Grid</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">PSHA Resolution</div>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4">
            <div className="text-3xl font-extrabold text-purple-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Reproducible Basis</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">Architected for Seismic Research & Structural Engineering</h2>
          <p className="text-xs text-slate-400 mt-2">Built on PostGIS, Django REST Framework, and MapLibre GL JS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-amber-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Interactive Bounding Box Map</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dynamically queries earthquake epicenters as you pan and zoom across the map canvas using spatial PostGIS index bounding boxes.
            </p>
            <Link href="/map" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mt-4 hover:underline">
              Explore Map <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-amber-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-5">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">PSHA Hazard Curves</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Compute and visualize ground motion exceedance probabilities (475-year and 2,475-year return periods) with site velocity (V<sub>s30</sub>) controls.
            </p>
            <Link href="/hazard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 mt-4 hover:underline">
              Compute Curves <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-amber-500/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Scientific Provenance</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Every data record features immutable SHA-256 configuration hashes, catalog model citations, and direct reference links.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Database className="h-4 w-4" /> Cloudflare R2 Backed
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
