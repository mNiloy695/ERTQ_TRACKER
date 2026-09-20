import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex max-w-full pl-10">
      <div className="w-screen max-w-md border-l border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          {title && <h3 className="text-lg font-bold text-slate-100">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
