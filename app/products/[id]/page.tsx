import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import ProductDetailView from "@/components/ProductDetailView";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import { ALL_PRODUCTS, fetchProductById, fetchProducts } from "@/data/products";

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <title>{`${product.name} – ${product.tagline} | M.art Sports & Fitness`}</title>
      <meta name="description" content={product.shortDescription} />
      <ProductDetailView product={product} />
    </>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-6 xl:col-span-5 aspect-square rounded-3xl bg-stone-100 border border-stone-200/70" />
        <div className="lg:col-span-6 xl:col-span-7 space-y-4 py-2">
          <div className="h-6 w-36 bg-stone-100 rounded-full" />
          <div className="h-10 w-3/4 bg-stone-100 rounded-xl" />
          <div className="h-8 w-56 bg-orange-100/70 rounded-full" />
          <div className="h-24 w-full bg-stone-100 rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-24 bg-stone-100 rounded-2xl" />
            <div className="h-24 bg-stone-100 rounded-2xl" />
            <div className="h-24 bg-stone-100 rounded-2xl" />
            <div className="h-24 bg-stone-100 rounded-2xl" />
          </div>
          <div className="h-14 w-full bg-stone-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      {/* 1. Announcement Bar */}
      <TopBar />

      {/* 2. Header & Navigation */}
      <Navbar />

      {/* 3. Main Product Description & A+ Infographic Layout (URL data wrapped in Suspense for Instant Navigation) */}
      <main className="flex-1">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetailsContent params={params} />
        </Suspense>

        {/* 4. Pre-Footer Reassurance Strip */}
        <TrustStrip />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
