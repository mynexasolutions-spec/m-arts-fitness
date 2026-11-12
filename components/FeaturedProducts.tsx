"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  ChevronDownIcon,
} from "./Icons";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
}

const FEATURED_ORDER = [
  "wooden-dumbbells",
  "training-cones",
  "skipping-rope",
  "yoga-mat",
  "sports-training-ball",
  "hex-dumbbells-5kg",
  "agility-ladder-pro",
];

const products: Product[] = [
  {
    id: "wooden-dumbbells",
    name: "Wooden Dumbbells",
    image: "/wooden-dumbells.jpg",
    category: "gym",
    badge: "Best Seller",
    rating: 4.8,
    reviewsCount: 120,
    price: 499,
    originalPrice: 899,
  },
  {
    id: "training-cones",
    name: "Training Cones Set",
    image: "/Training-cones.jpg",
    category: "training",
    badge: "33% OFF",
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
    badge: "25% OFF",
    rating: 4.8,
    reviewsCount: 145,
    price: 749,
    originalPrice: 999,
  },
  {
    id: "hex-dumbbells-5kg",
    name: "Rubber Hex Dumbbells",
    image: "/Gym-Equipment.jpg",
    category: "gym",
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 210,
    price: 1499,
    originalPrice: 2199,
  },
  {
    id: "agility-ladder-pro",
    name: "Speed Agility Ladder",
    image: "/Agility-tools.jpg",
    category: "training",
    badge: "35% OFF",
    rating: 4.7,
    reviewsCount: 88,
    price: 649,
    originalPrice: 999,
  },
  {
    id: "foam-roller-pro",
    name: "High Density Foam Roller",
    image: "/Yoga-wellness.jpg",
    category: "yoga",
    badge: "Top Rated",
    rating: 4.8,
    reviewsCount: 110,
    price: 599,
    originalPrice: 899,
  },
  {
    id: "sports-water-bottle",
    name: "Insulated Sports Shaker",
    image: "/Sports-Acessories.jpg",
    category: "training",
    badge: "Popular",
    rating: 4.6,
    reviewsCount: 85,
    price: 349,
    originalPrice: 499,
  },
  {
    id: "sports-training-ball",
    name: "Multi-Sport Training Ball",
    image: "/Sports-gear.jpg",
    category: "training",
    badge: "25% OFF",
    rating: 4.7,
    reviewsCount: 92,
    price: 549,
    originalPrice: 799,
  },
];

const filterTabs = [
  { id: "all", label: "All Items" },
  { id: "gym", label: "Gym Equipment" },
  { id: "training", label: "Training Gear" },
  { id: "yoga", label: "Yoga & Fitness" },
];

export default function FeaturedProducts() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [activeTab, setActiveTab] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist, getProductCartCount } =
    useStore();

  useEffect(() => {
    async function loadFeatured() {
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
            products.forEach((p) => {
              if (!adminIds.has(p.id) && !deletedIds.includes(p.id)) {
                deletedIds.push(p.id);
              }
            });
            setProductList(parsed.filter((p: any) => !deletedIds.includes(p.id)));
          }
        }
      } catch (e) {
        console.warn("Could not load local admin products:", e);
      }

      // 2. Database Mode: Check Supabase if connected
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (!error && data && data.length > 0) {
          const orderMap = new Map(FEATURED_ORDER.map((id, index) => [id, index]));
          const sorted = [...(data as Product[])]
            .filter((p) => !deletedIds.includes(p.id))
            .sort((a, b) => {
              const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
              const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
              return indexA - indexB;
            });
          setProductList(sorted);
        }
      } catch (e) {
        // Fallback silently to static / localStorage
      }
    }
    loadFeatured();
  }, []);

  // Responsive visible cards listener: 4 on Laptop & Widescreen, 3 on Tablet, 2 on Mobile
  useEffect(() => {
    const updateVisibleCards = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth >= 1024) {
        setVisibleCards(4); // 4 spacious cards in a row on laptop & widescreen
      } else if (window.innerWidth >= 768) {
        setVisibleCards(3); // 3 cards on tablets
      } else {
        setVisibleCards(2); // 2 cards side by side on mobile
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Touch Swipe Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filteredProducts =
    activeTab === "all"
      ? productList
      : productList.filter((p) => p.category === activeTab);

  const maxIndex = Math.max(0, filteredProducts.length - visibleCards);

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Clamp index if visibleCards changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = useCallback(() => {
    if (maxIndex > 0) {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    if (maxIndex > 0) {
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  }, [maxIndex]);

  // Autoplay Timer (Advances smoothly every 3.5 seconds when not hovered/touched)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [handleNext, isPaused, maxIndex]);

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  // Helper renderer for a single Product Card (Flush Edge-to-Edge Canvas with Zero Top/Side Padding)
  const renderProductCard = (item: Product) => (
    <div
      key={item.id}
      className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/80 hover:border-orange-500/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(249,115,22,0.12)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-full"
    >
      <div>
        {/* Top Media Canvas - Flush Edge-to-Edge with top & sides (Zero padding) */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-stone-50 via-stone-100/70 to-stone-50 flex items-center justify-center overflow-hidden group-hover:from-orange-50/50 group-hover:to-amber-50/30 transition-colors duration-300">
          {/* Floating Badges */}
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            {item.badge === "Best Seller" ? (
              <span className="bg-stone-900/90 backdrop-blur-xs text-amber-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide shadow-xs flex items-center gap-1">
                <span>★</span>
                <span className="text-white">Best Seller</span>
              </span>
            ) : (
              <span className="bg-orange-600/95 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide shadow-xs">
                {item.badge}
              </span>
            )}
          </div>

          {/* Floating Wishlist Heart */}
          <div className="absolute top-2 right-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(item.id);
              }}
              aria-label={
                isInWishlist(item.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                isInWishlist(item.id)
                  ? "text-orange-500 border-orange-200 bg-white shadow-xs"
                  : "text-stone-400 border-stone-200/80 bg-white/90 backdrop-blur-xs hover:text-orange-500 hover:border-orange-200 hover:bg-white"
              }`}
            >
              <HeartIcon
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  isInWishlist(item.id)
                    ? "fill-orange-500 text-orange-500"
                    : ""
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
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 18vw"
              className="object-contain p-2 sm:p-2.5 group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          </Link>
        </div>

        {/* Content Details Area */}
        <div className="p-2.5 sm:p-3 pb-1 flex flex-col">
          <Link href={`/products/${item.id}`}>
            <h3 className="font-bold text-stone-900 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs mt-1 mb-1.5">
            <div className="flex items-center text-amber-500">
              <StarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500" />
            </div>
            <span className="font-extrabold text-stone-900 text-[11px] sm:text-xs">
              {item.rating}
            </span>
            <span className="text-stone-400 text-[10px] sm:text-[11px] font-medium">
              ({item.reviewsCount})
            </span>
          </div>

          {/* Price & Savings */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-sm sm:text-base font-extrabold text-stone-950">
              ₹{item.price}
            </span>
            <span className="text-[11px] sm:text-xs text-stone-400 line-through">
              ₹{item.originalPrice}
            </span>
            {item.originalPrice > item.price && (
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                Save ₹{item.originalPrice - item.price}
              </span>
            )}
          </div>

          <div className="text-[9px] sm:text-[10px] font-medium text-emerald-600 mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="truncate">In Stock • Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Add to Cart Button (Compact & Brand Orange) */}
      <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(item.id, 1, undefined, false);
          }}
          className={`w-full py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
            getProductCartCount(item.id) > 0
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20"
          }`}
        >
          <ShoppingCartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span>
            {getProductCartCount(item.id) > 0
              ? `Added (${getProductCartCount(item.id)})`
              : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <section
      id="products"
      className="relative pb-16 md:pb-20 bg-gradient-to-b from-stone-50/50 via-white to-white"
    >
      {/* Edge-to-Edge Divider Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-7 sm:mb-8 md:mb-9" />

      <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="w-5 h-[2px] bg-orange-500 rounded-full" />
              <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-orange-600 uppercase">
                Customer Favorites
              </span>
              <span className="w-5 h-[2px] bg-orange-500 rounded-full" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm lg:text-base font-medium mt-1 leading-relaxed">
              Our best-selling sports &amp; fitness essentials, loved by fitness enthusiasts.
            </p>
          </div>

          {/* Action View All Link (No arrows!) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white font-bold text-xs sm:text-sm border border-orange-200/90 hover:border-orange-500 transition-all duration-300 shadow-xs"
            >
              <span>View All</span>
            </Link>
          </div>
        </div>

        {/* 1. MOBILE: Compact Category Dropdown Selector (< sm) */}
        <div className="sm:hidden mb-4">
          <div className="relative w-full">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full appearance-none bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 pr-9 transition-all cursor-pointer"
            >
              {filterTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  Category: {tab.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 2. DESKTOP: Interactive Filter Pills (>= sm) */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5 mb-6 sm:mb-8 pb-1">
          {filterTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-102"
                  : "bg-white border border-stone-200/90 text-stone-700 hover:border-orange-400 hover:text-orange-600 shadow-2xs"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* RESPONSIVE AUTO-CAROUSEL TRACK (Mobile to Desktop)         */}
        {/* ========================================================= */}
        {filteredProducts.length > 0 ? (
          <div
            className="relative w-full overflow-hidden py-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              suppressHydrationWarning
              className="flex transition-transform duration-500 ease-out -mx-1.5 sm:-mx-2 md:-mx-2.5"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleCards)
                }%)`,
              }}
            >
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  style={{ width: `${100 / visibleCards}%` }}
                  className="shrink-0 px-1.5 sm:px-2 md:px-2.5 flex flex-col"
                >
                  {renderProductCard(item)}
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {maxIndex > 0 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPaused(true);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? "w-6 sm:w-7 bg-orange-500 shadow-xs"
                        : "w-1.5 sm:w-2 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 text-sm">
            No products found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
