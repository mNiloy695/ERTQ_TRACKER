"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { fetchApi } from "../../../lib/api/client";
import { LocationProfile } from "../../../types/location";
import { useRouter } from "next/navigation";

export const CitySearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetchApi<LocationProfile[]>(`/api/v1/locations/search/?q=${encodeURIComponent(query)}`);
        setResults(response.data || []);
        setIsOpen(true);
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/locations/${slug}`);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location (e.g. Dhaka, Chittagong, Sylhet, Tokyo)..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 shadow-xl backdrop-blur-md transition-all focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-amber-400" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
          {results.map((item) => {
            const countryName = typeof item.country === "object" && item.country !== null ? item.country.name : item.country || "Global";
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.slug)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-slate-800/80 text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-100">{item.name}</div>
                    <div className="text-[11px] text-slate-400">{countryName} · {item.seismic_zone || "Zone 2"}</div>
                  </div>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                  PGA {item.pga_475yr || 0.2}g
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
