"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { ALL_PRODUCTS, ProductDetailItem } from "@/data/products";
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  TruckIcon,
} from "@/components/Icons";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isInWishlist } = useStore();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Filter products matching IDs in the wishlist
  const wishlistedProducts = ALL_PRODUCTS.filter((p) =>
    wishlist.includes(p.id)
  );

  const handleAddToCart = (id: string) => {
    addToCart(id, 1, undefined, false);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-[#faf8f6] text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Strip */}
        <section className="bg-[#0e0d0c] text-white py-10 sm:py-12 border-b border-stone-800">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-3">
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-orange-400">My Wishlist</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
                  <span className="text-[11px] font-extrabold tracking-widest text-orange-400 uppercase">
                    Saved Products
                  </span>
                  <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  My Wishlist
                </h1>
              </div>

              {wishlistedProducts.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-stone-300">
                    {wishlistedProducts.length}{" "}
                    {wishlistedProducts.length === 1 ? "Product" : "Products"} Saved
                  </span>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                  >
                    <span>Browse Catalog</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Wishlist Items Grid */}
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-8 sm:py-12">
          {wishlistedProducts.length === 0 ? (
            /* Empty Wishlist View */
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-14 border border-stone-200/90 shadow-sm text-center">
              <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-orange-200/80">
                <HeartIcon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Your Wishlist is Empty
              </h2>
              <p className="text-stone-500 text-sm mt-2 mb-8 leading-relaxed max-w-md mx-auto">
                Explore our collection of dumbbells, cones, mats, and accessories. Click the heart icon on any product to save it here!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Discover Products</span>
              </Link>
            </div>
          ) : (
            /* Filled Wishlist Grid */
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-6">
                {wishlistedProducts.map((product: ProductDetailItem) => {
                  const isAdded = !!addedItems[product.id];
                  return (
                    <div
                      key={product.id}
                      className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-400/80 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image Canvas */}
                      <div className="relative w-full aspect-square bg-[#f7f5f3] overflow-hidden">
                        <Link href={`/products/${product.id}`} className="block w-full h-full">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                          {product.badge && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-xs">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Remove from Wishlist Button */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label="Remove from Wishlist"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-500 hover:text-red-500 flex items-center justify-center transition-all shadow-xs cursor-pointer z-10"
                          title="Remove from Wishlist"
                        >
                          <span className="text-xs font-bold">✕</span>
                        </button>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                        <div>
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            {product.categoryLabel}
                          </span>
                          <Link
                            href={`/products/${product.id}`}
                            className="font-extrabold text-sm sm:text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-2 block"
                          >
                            {product.name}
                          </Link>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                              <StarIcon className="w-3.5 h-3.5" />
                              {product.rating}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span>({product.reviewsCount} reviews)</span>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-lg font-black text-stone-950">
                              ₹{product.price}
                            </span>
                            <span className="text-xs text-stone-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              Save ₹{product.originalPrice - product.price}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-stone-100 flex items-center gap-2 mt-auto">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product.id)}
                            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 active:scale-95"
                            }`}
                          >
                            <ShoppingCartIcon className="w-3.5 h-3.5" />
                            <span>{isAdded ? "Added to Cart ✓" : "Add to Cart"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Back to Products CTA */}
              <div className="mt-10 pt-6 border-t border-stone-200/80 flex items-center justify-between">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  <span>Continue Exploring Store</span>
                </Link>

                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-800 hover:text-orange-600"
                >
                  <span>Go to Cart</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}

