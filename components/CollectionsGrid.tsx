"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";


const collections = [
  {
    id: "home-gym",
    title: "Home Gym Essentials",
    subtitle: "Build your gym at home",
    image: "/GymEssentials.jpg",
    badge: "Most Popular",
    href: "/products?category=gym",
  },
  {
    id: "yoga-wellness",
    title: "Yoga & Wellness",
    subtitle: "Balance your body & mind",
    image: "/Yoga-wellness.jpg",
    badge: "Mind & Body",
    href: "/products?category=yoga",
  },
  {
    id: "sports-collection",
    title: "Sports Collection",
    subtitle: "Gear for every game",
    image: "/Sports-collection.jpg",
    badge: "All Sports",
    href: "/products?category=sports",
  },
];

export default function CollectionsGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < collections.length - 1 ? prev + 1 : 0));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : collections.length - 1));
  }, []);

  // Autoplay Timer (Every 3.8s)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  // Touch Gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 40) {
      handleNext(); // swipe left -> next slide
    } else if (diff < -40) {
      handlePrev(); // swipe right -> prev slide
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="pt-2 sm:pt-4 pb-14 md:pb-20 bg-[#fffaf7]">
      <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
        {/* ========================================================= */}
        {/* 1. MOBILE VIEW: Interactive Auto-Slider Banner (< md)     */}
        {/* ========================================================= */}
        <div
          className="md:hidden relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider Container */}
          <div
            className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-md border border-stone-200/60 bg-stone-900"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Sliding Track */}
            <div
              suppressHydrationWarning
              className="flex h-full transition-transform duration-500 ease-out"
              style={{
                transform: currentIndex === 0 ? "translateX(0%)" : `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {collections.map((col) => (
                <div key={col.id} className="relative w-full h-full shrink-0">
                  <Link href={col.href} className="block relative w-full h-full group">
                    {/* Background Image */}
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dark Vignette / Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-black/75 backdrop-blur-md text-orange-400 border border-orange-500/40 text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                        {col.badge}
                      </span>
                    </div>

                    {/* Text & Action Content */}
                    <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-10">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors drop-shadow-md">
                            {col.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-200 mt-1 font-medium">
                            {col.subtitle}
                          </p>
                        </div>

                        {/* Shop Now Badge */}
                        <span className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/35 shrink-0 group-hover:scale-105 active:scale-95 transition-transform">
                          Shop
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {collections.map((col, idx) => (
              <button
                type="button"
                key={col.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to ${col.title}`}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? "w-6 bg-orange-500 shadow-xs"
                    : "w-1.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP VIEW: Full 3-Card Grid (>= md)                 */}
        {/* ========================================================= */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-7 xl:gap-9">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={col.href}
              className="group relative h-60 sm:h-64 xl:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-500/15 transition-all duration-300 block transform hover:-translate-y-1.5 border border-stone-200/50"
            >
              {/* Background Image */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-500"
              />
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors drop-shadow-md">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 mt-1.5 font-medium">
                    {col.subtitle}
                  </p>
                </div>

                <div>
                  <span className="px-3.5 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/30 transition-all group-hover:scale-105">
                    Shop
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
