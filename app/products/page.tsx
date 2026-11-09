import React, { Suspense } from "react";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import ProductsCatalog from "@/components/ProductsCatalog";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shop All Gear | M.art Sports & Fitness",
  description:
    "Browse M.art's complete collection of commercial-grade gym equipment, dumbbells, yoga mats, agility tools, and sports gear with fast pan-India delivery.",
};

export default function ProductsPage() {
  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      {/* 1. Announcement Bar */}
      <TopBar />

      {/* 2. Main Navigation */}
      <Navbar />

      {/* 3. Main Products Listing Catalog */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-sm font-semibold">
              Loading M.art Catalog...
            </div>
          }
        >
          <ProductsCatalog />
        </Suspense>

        {/* 4. Pre-Footer Reassurance Strip */}
        <TrustStrip />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
