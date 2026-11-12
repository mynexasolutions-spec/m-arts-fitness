"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  SearchIcon,
  ChevronDownIcon,
  XIcon,
  ShieldCheckIcon,
  TruckIcon,
  TagIcon,
} from "./Icons";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/lib/supabase";

export interface ProductItem {
  id: string;
  name: string;
  image: string;
  category: string;
  categoryLabel: string;
  badge: string;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
}

export const PRODUCT_ORDER = [
  "wooden-dumbbells",
  "training-cones",
  "skipping-rope",
  "yoga-mat",
  "sports-training-ball",
  "hex-dumbbells-5kg",
  "agility-ladder-pro",
];

export const ALL_PRODUCTS: ProductItem[] = [
  {
    id: "wooden-dumbbells",
    name: "Wooden Dumbbells",
    image: "/wooden-dumbells.jpg",
    category: "gym",
    categoryLabel: "Gym Equipment",
    badge: "Best Seller",
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 120,
    price: 499,
    originalPrice: 899,
  },
  {
    id: "training-cones",
    name: "Training Cones Set",
    image: "/Training-cones.jpg",
    category: "agility",
    categoryLabel: "Agility Tools",
    badge: "33% OFF",
    isBestSeller: true,
    rating: 4.7,
    reviewsCount: 95,
    price: 799,
    originalPrice: 1199,
  },
  {
    id: "skipping-rope",
    name: "Pro Skipping Rope",
    image: "/Skipping-rope.jpg",
    category: "training",
    categoryLabel: "Training Gear",
    badge: "20% OFF",
    rating: 4.6,
    reviewsCount: 72,
    price: 399,
    originalPrice: 499,
  },
  {
    id: "yoga-mat",
    name: "Premium Yoga Mat",
    image: "/Yoga-mat.jpg",
    category: "yoga",
    categoryLabel: "Yoga & Wellness",
    badge: "Best Seller",
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 145,
    price: 749,
    originalPrice: 999,
  },
  {
    id: "sports-training-ball",
    name: "Multi-Sport Training Ball",
    image: "/Sports-gear.jpg",
    category: "training",
    categoryLabel: "Training Gear",
    badge: "25% OFF",
    rating: 4.7,
    reviewsCount: 92,
    price: 549,
    originalPrice: 799,
  },
  {
    id: "hex-dumbbells-5kg",
    name: "Rubber Hex Dumbbells",
    image: "/Gym-Equipment.jpg",
    category: "gym",
    categoryLabel: "Gym Equipment",
    badge: "Best Seller",
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 210,
    price: 1499,
    originalPrice: 2199,
  },
  {
    id: "agility-ladder-pro",
    name: "Speed Agility Ladder",
    image: "/Agility-tools.jpg",
    category: "agility",
    categoryLabel: "Agility Tools",
    badge: "35% OFF",
    rating: 4.7,
    reviewsCount: 88,
    price: 649,
    originalPrice: 999,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "gym", label: "Gym Equipment" },
  { id: "training", label: "Training Gear" },
  { id: "yoga", label: "Yoga & Wellness" },
  { id: "agility", label: "Agility Tools" },
];

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { id: "above-2000", label: "Above ₹2,000", min: 2000, max: Infinity },
];

const RATING_FILTERS = [
  { id: 0, label: "All Ratings" },
  { id: 4.8, label: "4.8★ & above" },
  { id: 4.6, label: "4.6★ & above" },
  { id: 4.5, label: "4.5★ & above" },
];

export default function ProductsCatalog() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<{
    categories: boolean;
    price: boolean;
    rating: boolean;
    offers: boolean;
  }>({
    categories: true,
    price: true,
    rating: false,
    offers: false,
  });

  const toggleFilterSection = (
    section: "categories" | "price" | "rating" | "offers"
  ) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { addToCart, toggleWishlist, isInWishlist, getProductCartCount } =
    useStore();

  const [productsList, setProductsList] = useState<ProductItem[]>(ALL_PRODUCTS);

  useEffect(() => {
    async function loadProducts() {
      let deletedIds: string[] = [];

      // 1. Static Mode: Check local storage first for admin edits & deletions
      try {
        const deletedRaw = localStorage.getItem("mart_deleted_products");
        if (deletedRaw) {
          deletedIds = JSON.parse(deletedRaw);
        }

        const stored = localStorage.getItem("mart_admin_products");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const adminIds = new Set(parsed.map((p: any) => p.id));
            ALL_PRODUCTS.forEach((p) => {
              if (!adminIds.has(p.id) && !deletedIds.includes(p.id)) {
                deletedIds.push(p.id);
              }
            });
            setProductsList(parsed.filter((p: any) => !deletedIds.includes(p.id)));
          }
        }
      } catch (e) {
        console.warn("Could not load local admin products:", e);
      }

      // 2. Database Mode: Check Supabase if connected, respecting deletions
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (!error && data && data.length > 0) {
          const orderMap = new Map(PRODUCT_ORDER.map((id, index) => [id, index]));
          const sorted = [...(data as ProductItem[])]
            .filter((p) => !deletedIds.includes(p.id))
            .sort((a, b) => {
              const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
              const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
              return indexA - indexB;
            });
          setProductsList(sorted);
        }
      } catch (e) {
        // Fallback silently to static / localStorage
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync URL ?category= and ?search= params if navigated via links
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam && CATEGORIES.some((c) => c.id === catParam)) {
      setSelectedCategory(catParam);
      setOpenSections((prev) => ({ ...prev, categories: true }));
    } else if (!catParam) {
      setSelectedCategory("all");
    }

    const searchParam = searchParams.get("search") || searchParams.get("q");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Lock body scroll only when mobile filter drawer is active
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [mobileFiltersOpen]);

  const handleAddToCart = (id: string) => {
    addToCart(id, 1, undefined, false);
  };

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: productsList.length };
    for (const item of productsList) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [productsList]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    const priceObj =
      PRICE_RANGES.find((r) => r.id === selectedPriceRange) || PRICE_RANGES[0];

    const list = productsList.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (item.price < priceObj.min || item.price > priceObj.max) {
        return false;
      }
      if (minRating > 0 && item.rating < minRating) {
        return false;
      }
      if (bestSellersOnly && !item.isBestSeller) {
        return false;
      }
      if (
        searchQuery.trim() !== "" &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "discount") {
      list.sort((a, b) => {
        const discA = (a.originalPrice - a.price) / a.originalPrice;
        const discB = (b.originalPrice - b.price) / b.originalPrice;
        return discB - discA;
      });
    }

    return list;
  }, [
    selectedCategory,
    selectedPriceRange,
    minRating,
    bestSellersOnly,
    searchQuery,
    sortBy,
    productsList,
  ]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedPriceRange !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (bestSellersOnly ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setMinRating(0);
    setBestSellersOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  // Shared Sidebar Filter Controls (Used in Desktop Left Sidebar & Mobile Slide-over Drawer)
  const renderFilterSections = () => (
    <div className="space-y-5">
      {/* 1. Categories Filter */}
      <div>
        <button
          type="button"
          onClick={() => toggleFilterSection("categories")}
          aria-expanded={openSections.categories}
          className="w-full text-xs font-extrabold uppercase tracking-wider text-stone-900 hover:text-orange-600 flex items-center justify-between py-1 cursor-pointer transition-colors"
        >
          <span>Categories</span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.categories
                ? "rotate-180 text-orange-600"
                : "text-stone-400"
            }`}
          />
        </button>

        {openSections.categories && (
          <div className="space-y-1 mt-3">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs xl:text-[13px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-orange-500 text-white font-bold shadow-xs"
                      : "text-stone-700 hover:bg-orange-50/70 hover:text-orange-600"
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {categoryCounts[cat.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-stone-200/80" />

      {/* 2. Price Range Filter */}
      <div>
        <button
          type="button"
          onClick={() => toggleFilterSection("price")}
          aria-expanded={openSections.price}
          className="w-full text-xs font-extrabold uppercase tracking-wider text-stone-900 hover:text-orange-600 flex items-center justify-between py-1 cursor-pointer transition-colors"
        >
          <span>Price Range</span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.price
                ? "rotate-180 text-orange-600"
                : "text-stone-400"
            }`}
          />
        </button>

        {openSections.price && (
          <div className="space-y-1.5 mt-3">
            {PRICE_RANGES.map((range) => {
              const isSelected = selectedPriceRange === range.id;
              return (
                <label
                  key={range.id}
                  onClick={() => setSelectedPriceRange(range.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs xl:text-[13px] transition-colors ${
                    isSelected
                      ? "text-orange-600 font-bold bg-orange-50/60"
                      : "text-stone-700 hover:text-stone-950 font-medium"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-orange-500 bg-orange-500"
                        : "border-stone-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span>{range.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-stone-200/80" />

      {/* 3. Customer Ratings */}
      <div>
        <button
          type="button"
          onClick={() => toggleFilterSection("rating")}
          aria-expanded={openSections.rating}
          className="w-full text-xs font-extrabold uppercase tracking-wider text-stone-900 hover:text-orange-600 flex items-center justify-between py-1 cursor-pointer transition-colors"
        >
          <span>Customer Rating</span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.rating
                ? "rotate-180 text-orange-600"
                : "text-stone-400"
            }`}
          />
        </button>

        {openSections.rating && (
          <div className="space-y-1.5 mt-3">
            {RATING_FILTERS.map((rf) => {
              const isSelected = minRating === rf.id;
              return (
                <button
                  key={rf.id}
                  type="button"
                  onClick={() => setMinRating(rf.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-orange-50/80 text-orange-600 font-bold"
                      : "text-stone-700 hover:bg-stone-100 font-medium"
                  }`}
                >
                  <span className="text-amber-500 flex items-center">
                    <StarIcon className="w-3.5 h-3.5" />
                  </span>
                  <span>{rf.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-stone-200/80" />

      {/* 4. Special Highlights Toggle */}
      <div>
        <button
          type="button"
          onClick={() => toggleFilterSection("offers")}
          aria-expanded={openSections.offers}
          className="w-full text-xs font-extrabold uppercase tracking-wider text-stone-900 hover:text-orange-600 flex items-center justify-between py-1 cursor-pointer transition-colors"
        >
          <span>Special Offers</span>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              openSections.offers
                ? "rotate-180 text-orange-600"
                : "text-stone-400"
            }`}
          />
        </button>

        {openSections.offers && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setBestSellersOnly((prev) => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                bestSellersOnly
                  ? "border-orange-500 bg-stone-950 text-white shadow-xs"
                  : "border-stone-200 bg-stone-50 text-stone-800 hover:border-orange-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">★</span>
                <span>Best Sellers Only</span>
              </span>
              <span
                className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                  bestSellersOnly
                    ? "bg-orange-500 text-white"
                    : "border border-stone-300 bg-white"
                }`}
              >
                {bestSellersOnly ? "✓" : ""}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Clear All Filters Button */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:border-orange-500 text-stone-700 hover:text-orange-600 text-xs font-bold transition-all cursor-pointer"
        >
          Reset All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-sm font-semibold">
        Loading M.art Catalog...
      </div>
    );
  }

  return (
    <>
      {/* ========================================================= */}
      {/* 1. COMPACT ATHLETIC STORE HEADER BANNER                   */}
      {/* ========================================================= */}
      <section className="relative w-full bg-[#0d0d0d] text-white py-10 sm:py-14 lg:py-16 overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero-16-9.jpg"
            alt="M.art Sports & Fitness Store"
            fill
            priority
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
        </div>

        <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Breadcrumb */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-orange-400 mb-3">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span className="text-stone-500">/</span>
                <span className="text-white">Shop All Gear</span>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-[2px] bg-orange-500" />
                <span className="text-[11px] font-bold tracking-widest text-orange-400 uppercase">
                  M.art Official Catalog
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight">
                Shop Sports &{" "}
                <span className="text-orange-500 italic font-black">
                  Fitness Gear
                </span>
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm lg:text-base mt-1.5 max-w-xl font-normal">
                Commercial-grade gym equipment, training accessories, and yoga essentials engineered for everyday performance.
              </p>
            </div>

            {/* Reassurance Badges on Banner */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <ShieldCheckIcon className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs font-semibold text-stone-200">
                  100% Genuine
                </span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <TruckIcon className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs font-semibold text-stone-200">
                  Pan-India Fast Dispatch
                </span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <TagIcon className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs font-semibold text-stone-200">
                  Factory Direct Prices
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. E-COMMERCE PRO CATALOG (Sidebar + 2-Col Mobile / 4-Col Laptop & Desktop) */}
      {/* ========================================================= */}
      <section className="py-6 sm:py-10 lg:py-12 bg-gradient-to-b from-[#fffaf7]/70 via-white to-white min-h-[70vh]">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
          {/* Quick Category Pills Bar (Mobile & Tablet < lg) */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-stone-200/80">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-orange-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Top Toolbar: Search, Filter Button (Mobile), Active Chips, Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            {/* Left: Search Input + Results Count */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  autoComplete="off"
                  suppressHydrationWarning
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dumbbells, cones, yoga mat..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 placeholder:text-stone-400 font-medium transition-all"
                />
                <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div
                suppressHydrationWarning
                className="hidden md:block text-xs sm:text-sm text-stone-600 font-medium whitespace-nowrap"
              >
                Showing{" "}
                <strong className="font-extrabold text-stone-900">
                  {filteredProducts.length}
                </strong>{" "}
                of {productsList.length} items
              </div>
            </div>

            {/* Right: Mobile Filter Trigger & Sort By Selector */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              {/* Mobile & Tablet Filter Drawer Button */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:border-orange-500 text-stone-800 text-xs font-bold shadow-2xs cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h18M7 12h10m-7 8h4"
                  />
                </svg>
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products by"
                  className="appearance-none bg-stone-50 hover:bg-white border border-stone-200/90 rounded-xl pl-3 pr-8 py-2 text-xs sm:text-[13px] font-bold text-stone-800 focus:outline-none focus:border-orange-500 cursor-pointer transition-colors"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <ChevronDownIcon className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Pills Row */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">
                Active Filters:
              </span>
              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <span>
                    {CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                  </span>
                  <span>✕</span>
                </button>
              )}
              {selectedPriceRange !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange("all")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <span>
                    {
                      PRICE_RANGES.find((r) => r.id === selectedPriceRange)
                        ?.label
                    }
                  </span>
                  <span>✕</span>
                </button>
              )}
              {minRating > 0 && (
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <span>{minRating}★ & above</span>
                  <span>✕</span>
                </button>
              )}
              {bestSellersOnly && (
                <button
                  type="button"
                  onClick={() => setBestSellersOnly(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <span>Best Sellers Only</span>
                  <span>✕</span>
                </button>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-stone-500 hover:text-orange-600 underline ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* MAIN LAYOUT: Left Sidebar (Desktop) + Product Grid        */}
          {/* ========================================================= */}
          <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-7">
            {/* LEFT FILTER SIDEBAR (Visible on Laptop & Desktop >= lg) */}
            <aside className="hidden lg:block w-[220px] xl:w-[250px] shrink-0 bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs sticky top-28">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200/80">
                <span className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Filter Products
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
              {renderFilterSections()}
            </aside>

            {/* RIGHT PRODUCT GRID:
                - Mobile (< lg): Strictly 2 Cards per Row (grid-cols-2)
                - Laptop & Desktop (>= lg): Strictly 4 Cards per Row (lg:grid-cols-4) */}
            <div className="flex-1 w-full">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-4 xl:gap-5">
                  {filteredProducts.map((item) => {
                    const countInCart = getProductCartCount(item.id);
                    const wishlisted = isInWishlist(item.id);
                    const discountPercent = Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) *
                        100
                    );

                    return (
                      <div
                        key={item.id}
                        className="group bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-400 transition-all duration-300 shadow-xs"
                      >
                        {/* Top Media Canvas (Exact FeaturedProducts Inspiration) */}
                        <div className="relative w-full aspect-square bg-[#f6f6f6] overflow-hidden">
                          {/* Floating Badges */}
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none">
                            {item.badge === "Best Seller" ? (
                              <span className="bg-stone-950/90 backdrop-blur-xs text-amber-400 text-[9px] xs:text-[10px] sm:text-[11px] font-bold px-1.5 xs:px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-wide shadow-sm flex items-center gap-0.5 sm:gap-1">
                                <span>★</span>
                                <span className="text-white">Best Seller</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[9px] xs:text-[10px] sm:text-[11px] font-bold px-1.5 xs:px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-wide shadow-sm">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {/* Floating Wishlist Heart */}
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(item.id)}
                              aria-label="Add to wishlist"
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                                wishlisted
                                  ? "text-orange-500 border-orange-200 bg-white"
                                  : "text-stone-400 border-stone-200/80 bg-white/90 backdrop-blur-xs hover:text-orange-500 hover:border-orange-200 hover:bg-white"
                              }`}
                            >
                              <HeartIcon
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                  wishlisted ? "fill-orange-500" : ""
                                }`}
                              />
                            </button>
                          </div>

                          {/* Product Image Link */}
                          <Link
                            href={`/products/${item.id}`}
                            className="block relative w-full h-full"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        </div>

                        {/* Content Details Area */}
                        <div className="p-2.5 xs:p-3 sm:p-4 xl:p-4.5 flex flex-col justify-between flex-1 bg-white border-t border-stone-100">
                          <div>
                            {/* Category Micro-Label */}
                            <div className="text-[9px] xs:text-[10px] font-bold uppercase tracking-wider text-orange-600/90 mb-0.5 truncate">
                              {item.categoryLabel}
                            </div>

                            {/* Product Name Link */}
                            <Link href={`/products/${item.id}`}>
                              <h3 className="font-bold text-stone-900 text-xs xs:text-sm sm:text-[14px] xl:text-[15px] leading-snug mb-1 sm:mb-1.5 group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </h3>
                            </Link>

                            {/* Rating */}
                            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] xs:text-xs mb-1.5 sm:mb-2">
                              <div className="flex items-center text-amber-500">
                                <StarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </div>
                              <span className="font-bold text-stone-900">
                                {item.rating}
                              </span>
                              <span className="text-stone-400 text-[10px] sm:text-[11px] font-medium">
                                ({item.reviewsCount})
                              </span>
                            </div>

                            {/* Price & Savings */}
                            <div className="flex items-baseline flex-wrap gap-1.5 mb-0.5 sm:mb-1">
                              <span className="text-sm xs:text-base sm:text-lg xl:text-xl font-extrabold text-stone-950">
                                ₹{item.price}
                              </span>
                              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                                ₹{item.originalPrice}
                              </span>
                              {discountPercent > 0 && (
                                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md hidden xs:inline-block">
                                  Save {discountPercent}%
                                </span>
                              )}
                            </div>

                            <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-emerald-600 mb-2.5 sm:mb-3 flex items-center gap-0.5 sm:gap-1">
                              <span>✓</span>
                              <span className="truncate">
                                In Stock • Fast Delivery
                              </span>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item.id)}
                            className={`w-full py-1.5 xs:py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-full font-bold text-[11px] xs:text-xs sm:text-[13px] flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                              countInCart > 0
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
                            }`}
                          >
                            <ShoppingCartIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {countInCart > 0
                                ? `Added (${countInCart})`
                                : "Add to Cart"}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Filter State */
                <div className="bg-white rounded-2xl border border-stone-200/90 p-10 sm:p-16 text-center my-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                    <SearchIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mb-1">
                    No matching gear found
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto mb-5">
                    Try adjusting your price range, category filter, or search keywords to see more products.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Show All Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MOBILE SLIDE-OVER FILTER DRAWER (< lg)                 */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          mobileFiltersOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileFiltersOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileFiltersOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Slide-Over Panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-out ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
            <div>
              <h3 className="font-extrabold text-base text-stone-900">
                Filter Gear
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                {filteredProducts.length} products available
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/60"
              aria-label="Close filters"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {renderFilterSections()}
          </div>

          <div className="p-4 border-t border-stone-200 bg-white flex items-center gap-2.5">
            <button
              type="button"
              onClick={resetAllFilters}
              className="w-1/3 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-2/3 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-sm"
            >
              Show {filteredProducts.length} Items
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
