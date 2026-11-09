"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  img: string;
  href: string;
}

const categories: CategoryItem[] = [
  {
    id: "01",
    name: "Strength & Gym Equipment",
    desc: "Dumbbells, barbells, kettlebells, and heavy-duty benches.",
    img: "/Gym-Equipment.jpg",
    href: "/products?category=gym",
  },
  {
    id: "02",
    name: "Sports & Agility Essentials",
    desc: "Cones, hurdles, speed ladders, and team sports accessories.",
    img: "/Agility-tools.jpg",
    href: "/products?category=agility",
  },
  {
    id: "03",
    name: "Yoga & Wellness Gear",
    desc: "High-density mats, resistance bands, rollers, and blocks.",
    img: "/Yoga-wellness.jpg",
    href: "/products?category=yoga",
  },
  {
    id: "04",
    name: "Sports Accessories",
    desc: "Gym gloves, wrist wraps, gym shakers, and training bags.",
    img: "/Sports-Acessories.jpg",
    href: "/products?category=training",
  },
  {
    id: "05",
    name: "Training Equipment",
    desc: "Jump ropes, resistance tubes, grip trainers, and speed cones.",
    img: "/Training-Equipment.jpg",
    href: "/products?category=training",
  },
  {
    id: "06",
    name: "Fitness Essentials",
    desc: "Core sliders, ab wheels, recovery rollers, and bodyweight gear.",
    img: "/Fitness-Essentials.jpg",
    href: "/products?category=gym",
  },
];

export default function AboutCategorySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Update visible cards on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3); // Desktop: 3 cards
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(1); // Mobile: 1 card
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, categories.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Clamp index if visible cards change
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Auto-slide effect every 3.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Swipe handlers for mobile touch
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide(); // swipe left -> next
    } else if (distance < -50) {
      prevSlide(); // swipe right -> prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header */}
      <div className="mb-8 xl:mb-10">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-5 h-[2px] bg-orange-500" />
          <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
            Comprehensive Lineup
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-stone-900 tracking-tight">
          What You&apos;ll Find at M.art
        </h2>
      </div>

      {/* Slider Carousel Viewport */}
      <div className="overflow-hidden rounded-3xl p-1 -m-1">
        <div
          suppressHydrationWarning
          className="flex transition-transform duration-600 ease-out"
          style={{
            transform: currentIndex === 0 ? "translateX(0%)" : `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              suppressHydrationWarning
              className="shrink-0 px-2 sm:px-3 xl:px-4"
              style={{ width: `${100 / visibleCards}%` }}
            >
              <Link
                href={cat.href}
                className="group block relative rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/70 transition-all duration-300 transform hover:-translate-y-1.5 h-full flex flex-col justify-between"
              >
                {/* Image Container with Natural 16:11 Aspect Ratio */}
                <div className="relative w-full aspect-[16/11] overflow-hidden bg-stone-100">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  {/* Gentle gradient overlay so image remains bright and clean */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 pointer-events-none" />

                  {/* Floating Frosted Glass Category Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-bold text-orange-400 uppercase tracking-wider shadow-sm">
                    Category {cat.id}
                  </div>
                </div>

                {/* Card Description & Action Link */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-snug group-hover:text-orange-600 transition-colors mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-stone-500 font-medium leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 border-t border-stone-100 mt-auto">
                    <span className="text-xs sm:text-[13px] font-bold text-stone-700 group-hover:text-orange-600 transition-colors">
                      Explore Collection
                    </span>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white px-2.5 py-1 rounded-full transition-all">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? "w-8 sm:w-9 bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm shadow-orange-500/30"
                : "w-2 sm:w-2.5 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
