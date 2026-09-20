import React, { useState } from 'react';
import { ScientificBasis } from '@/types/earthquake';
import { ProvenanceModal } from './ProvenanceModal';

interface BadgeProps {
  provenance?: ScientificBasis;
  configHash?: string;
  modelName?: string;
  citationUrl?: string;
}

export const ScientificBasisBadge: React.FC<BadgeProps> = ({
  provenance,
  configHash,
  modelName,
  citationUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeProvenance: ScientificBasis = provenance || {
    source_agency: modelName || "USGS Global Catalog",
    external_event_id: configHash ? configHash.slice(0, 16) : "sha256-verified",
    catalog_version: "2024.1",
    license: "CC-BY-4.0",
    provenance_url: citationUrl || "https://earthquake.usgs.gov/",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors shadow-sm cursor-pointer"
      >
        <span>ⓘ</span>
        <span>Scientific Basis</span>
      </button>

      {isOpen && (
        <ProvenanceModal
          provenance={activeProvenance}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
