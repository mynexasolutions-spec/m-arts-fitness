"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  CreditCardIcon,
} from "./Icons";

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: TruckIcon,
    text: "Free Delivery on Orders Above ₹999",
    highlight: "Free Shipping",
  },
  {
    id: 2,
    icon: ShieldCheckIcon,
    text: "100% Genuine Sports & Fitness Gear",
    highlight: "Verified",
  },
  {
    id: 3,
    icon: RotateCcwIcon,
    text: "Easy & Hassle-Free 7-Day Returns",
    highlight: "Guaranteed",
  },
  {
    id: 4,
    icon: CreditCardIcon,
    text: "Safe & Secure Payments + COD Available",
    highlight: "100% Secure",
  },
];

export default function TopBar() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Touch gesture state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Create an extended list for seamless infinite right-to-left slide
  const slides = [...ANNOUNCEMENTS, ANNOUNCEMENTS[0]];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    if (index === 0) {
      // Jump to duplicate at end without animation, then slide to last item
      setIsTransitioning(false);
      setIndex(ANNOUNCEMENTS.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setIndex(ANNOUNCEMENTS.length - 1);
        });
      });
    } else {
      setIndex((prev) => prev - 1);
    }
  }, [index]);

  // Seamless loop reset when sliding past the last item
  useEffect(() => {
    if (index === ANNOUNCEMENTS.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 500); // matches transition duration
      return () => clearTimeout(timer);
    }
  }, [index]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  // Touch swipe listeners
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

    // Minimum swipe threshold 40px
    if (diff > 40) {
      handleNext(); // swipe left -> show next
    } else if (diff < -40) {
      handlePrev(); // swipe right -> show prev
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="bg-[#181615] text-[#d6d3d1] text-[11px] sm:text-xs font-medium border-b border-[#292524] w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* MOBILE VIEW: Smooth Horizontal Slider (< md) */}
        <div className="md:hidden relative flex items-center h-8.5 overflow-hidden">
          {/* Sliding Track */}
          <div
            className="w-full h-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              suppressHydrationWarning
              className={`flex h-full items-center ${
                isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
              }`}
              style={{
                transform: index === 0 ? "translateX(0%)" : `translateX(-${index * 100}%)`,
              }}
            >
              {slides.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="w-full shrink-0 flex items-center justify-center gap-1.5 px-3 text-center"
                  >
                    <IconComponent className="text-orange-500 w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-stone-200 tracking-tight">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW: Full Wide Grid (>= md) */}
        <div className="hidden md:flex items-center justify-between py-2 text-stone-300">
          <div className="flex items-center gap-2">
            <TruckIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-stone-100">
              Free Delivery on Orders Above ₹999
            </span>
          </div>

          <div className="flex items-center gap-6 text-stone-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheckIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
              <span>100% Genuine Products</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcwIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
              <span>Easy 7-Day Returns</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCardIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
              <span>Secure Payments & COD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
