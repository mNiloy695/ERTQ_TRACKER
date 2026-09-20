import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-gray-900">
            SEISMO<span className="text-blue-600">ATLAS</span>
          </span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
            PROD
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/map" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Global Map
          </Link>
          <Link href="/earthquakes" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Catalog Explorer
          </Link>
          <Link href="/hazard" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Hazard Curves
          </Link>
          <Link href="/docs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Documentation
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/map"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Launch Map
          </Link>
        </div>
      </div>
    </header>
  );
};
