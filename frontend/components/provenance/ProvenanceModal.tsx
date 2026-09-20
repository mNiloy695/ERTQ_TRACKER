import React from 'react';
import { ScientificBasis } from '@/types/earthquake';

interface ModalProps {
  provenance: ScientificBasis;
  onClose: () => void;
}

export const ProvenanceModal: React.FC<ModalProps> = ({ provenance, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-blue-600">ⓘ</span> Scientific Basis & Provenance
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="font-medium text-gray-500">Source Agency:</span>
            <span className="font-semibold text-gray-900">{provenance.source_agency}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="font-medium text-gray-500">External Event ID:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-800">
              {provenance.external_event_id}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="font-medium text-gray-500">Catalog Version:</span>
            <span className="font-semibold text-gray-900">{provenance.catalog_version}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="font-medium text-gray-500">License Standard:</span>
            <span className="text-green-700 font-medium">{provenance.license}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-500">Authoritative Source Link:</span>
          <a
            href={provenance.provenance_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
          >
            View on USGS ANSS ↗
          </a>
        </div>
      </div>
    </div>
  );
};
