import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Database, GitBranch, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 backdrop-blur-md py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-slate-100 tracking-tight">SeismoAtlas</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open-science seismic catalog aggregation, tectonic feature mapping, and probabilistic seismic hazard assessment (PSHA) intelligence platform.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">System & Specs</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                API Health: Operational
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Database className="h-3.5 w-3.5 text-slate-500" />
                Storage: Cloudflare R2
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                Backend: Python UV + DRF
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Documentation & API</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/api/v1/schema/swagger-ui/" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1">
                  OpenAPI / Swagger Specs <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <a href="https://github.com/mNiloy695/ERTQ_TRACKER" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1">
                  GitHub Repository <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/hazard" className="hover:text-amber-400 transition-colors">
                  PSHA Methodology
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Open Science Basis</h4>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                <ShieldCheck className="h-4 w-4" /> Reproducible Provenance
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Every calculation artifact is checksummed with SHA-256 and linked to open catalog sources (USGS, EMSC, ISC).
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SeismoAtlas Platform. Distributed under MIT Open Science License.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>v1.0.0-beta</span>
            <span>·</span>
            <span>PostGIS Spatial Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
