"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { QuoteIcon, StarIcon } from "./Icons";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "New Delhi",
    role: "CrossFit Athlete",
    quote:
      "Excellent build quality and rock-solid packaging. The wooden dumbbells have an amazing grip for daily home workouts!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 2,
    name: "Priya Verma",
    location: "Bengaluru",
    role: "Yoga Instructor",
    quote:
      "Best sports store in India! The 6mm premium yoga mat has exceptional cushioning, durability and non-slip texture.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 3,
    name: "Aman Singh",
    location: "Mumbai",
    role: "Fitness Enthusiast",
    quote:
      "Genuine fitness gear at honest prices. The ball-bearing skipping rope is ultra-smooth, lightweight and built to last.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 4,
    name: "Sneha Patel",
    location: "Ahmedabad",
    role: "Athletic Coach",
    quote:
      "The training cones and speed ladder transformed our academy's daily drills. Super durable materials and vibrant colors!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    location: "Chandigarh",
    role: "Home Gym Builder",
    quote:
      "Ordered the hex dumbbells and skipping rope. Fast shipping, great customer service, and the weights feel 100% commercial-grade.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 6,
    name: "Ananya Iyer",
    location: "Chennai",
    role: "Pilates Trainer",
    quote:
      "The yoga mat and foam roller set are phenomenal. Non-slip even during hot workouts. Highly recommend M.art to all athletes!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 7,
    name: "Rohan Das",
    location: "Kolkata",
    role: "Club Footballer",
    quote:
      "Outstanding gear! Bought the agility hurdle and ball set for our weekend matches. Tough, weatherproof and high quality.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: 8,
    name: "Kavita Reddy",
    location: "Hyderabad",
    role: "Marathon Runner",
    quote:
      "Seamless checkout, lightning-fast delivery to Hyderabad, and the fitness accessories are 100% authentic and robust.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&h=160&q=80",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive visible cards listener
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3); // Desktop: 3 cards in a row
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2); // Tablet: 2 cards in a row
      } else {
        setVisibleCards(1); // Mobile: 1 card
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCards);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Clamp index if visibleCards changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Autoplay Timer (Advances every 3.5 seconds when not hovered)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3500);

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
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="pt-14 md:pt-20 pb-16 md:pb-20 bg-gradient-to-b from-stone-50/50 via-white to-stone-50/60 border-b border-stone-200/50 overflow-hidden">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-orange-500 rounded-full" />
            <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-orange-600 uppercase">
              Customer Reviews
            </span>
            <span className="w-5 h-[2px] bg-orange-500 rounded-full" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm lg:text-base mt-2 font-medium leading-relaxed">
            Real experiences from fitness enthusiasts across India.
          </p>
        </div>

        {/* Automatic Carousel Track in a Single Row */}
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
            className="flex transition-transform duration-600 ease-in-out -mx-2.5 sm:-mx-3"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="shrink-0 px-2.5 sm:px-3 flex flex-col"
                style={{ width: `${100 / visibleCards}%` }}
              >
                <div className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6.5 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(249,115,22,0.12)] hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1">
                  <div>
                    {/* Top Row: 5 Stars & Verified Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    </div>

                    {/* Quote text */}
                    <p className="text-xs sm:text-[13px] lg:text-sm text-stone-700 font-medium leading-relaxed mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-200/80 shadow-xs shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-orange-600 transition-colors leading-tight">
                          {t.name}
                        </h4>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {t.location} • {t.role}
                        </span>
                      </div>
                    </div>
                    <QuoteIcon className="w-5 h-5 text-orange-400/40 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-7 bg-orange-500 shadow-xs"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
