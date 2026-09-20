import React from "react";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Providers } from "./providers";

export const metadata = {
  title: "SeismoAtlas — Open Science Seismic Catalog & PSHA Intelligence",
  description: "Interactive seismic catalog analysis, spatial bounding box queries, fault mapping, and probabilistic seismic hazard curves.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
