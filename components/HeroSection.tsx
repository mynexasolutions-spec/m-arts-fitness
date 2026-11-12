"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GridIcon,
  ShieldCheckIcon,
  TagIcon,
  AwardIcon,
  TruckIcon,
  ArrowRightIcon,
} from "./Icons";
import { HeroSlide, DEFAULT_HERO_SLIDES, getActiveHeroSlides } from "@/data/heroSlides";

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch active slides dynamically from database (with instant fallback)
  useEffect(() => {
    let isMounted = true;
    async function loadSlides() {
      try {
        const dynamicSlides = await getActiveHeroSlides();
        if (isMounted && dynamicSlides && dynamicSlides.length > 0) {
          setSlides(dynamicSlides);
        }
      } catch (err) {
        console.warn("[HeroSection] Using default fallback slides:", err);
      }
    }
    loadSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || slides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE VIEW (< sm): Compact Athletic Poster (9:16)     */}
      {/* ========================================================= */}
      <section className="sm:hidden relative w-full h-[475px] xs:h-[505px] bg-[#0d0d0d] overflow-hidden text-white flex flex-col justify-between border-b border-stone-800/80">
        {/* Background Images: Smooth Crossfade Slider */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id || slide.mobile_image || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.mobile_image}
                alt={slide.alt_text || "M.art Sports & Fitness Equipment"}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />
            </div>
          ))}
          {/* Top gradient for crystal clear text readability */}
          <div className="absolute inset-0 z-2 bg-gradient-to-b from-black/90 via-black/55 to-transparent h-[65%]" />
          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 z-2 h-16 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Content Container - Clean Header & CTA at Top */}
        <div className="relative z-10 px-4 pt-6 xs:pt-7 flex flex-col items-center text-center">
          {/* Subtitle tag */}
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] xs:text-[11px] font-bold tracking-widest text-orange-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>{activeSlide.badge_text || "Fitness • Sports • Wellness"}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-[28px] xs:text-[32px] font-black tracking-tight text-white leading-[1.12] mb-2.5 drop-shadow-md">
            {activeSlide.title || "Gear Up for a"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 font-black">
              {activeSlide.title_gradient || "Healthier You"}
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-[12px] text-stone-200 font-medium leading-relaxed max-w-xs mx-auto drop-shadow-sm mb-4">
            {activeSlide.subtitle ||
              "Premium Sports & Fitness Equipment for Every Age and Every Goal"}
          </p>

          {/* Shop Now CTA right below subtext */}
          <Link
            href={activeSlide.cta_link || "/products"}
            className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-amber-500/10 hover:from-orange-500/35 hover:to-amber-500/20 backdrop-blur-xl border border-orange-400/40 hover:border-orange-400/70 text-white font-bold text-xs xs:text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.3)] active:scale-95 transition-all text-center tracking-wide group"
          >
            <span>{activeSlide.cta_text || "Shop Now"}</span>
            <ArrowRightIcon className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bottom Slide Indicators (Dots only, leaving image completely clean) */}
        <div className="relative z-10 px-4 pb-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-6 bg-orange-500"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TABLET & DESKTOP VIEW (>= sm): Widescreen Banner (16:9)*/}
      {/* ========================================================= */}
      <section className="hidden sm:block relative w-full bg-[#0d0d0d] overflow-hidden text-white border-b border-stone-200/50">
        {/* Background Images: Smooth Crossfade Slider */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id || slide.desktop_image || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.desktop_image}
                alt={slide.alt_text || "M.art Sports & Fitness Equipment"}
                fill
                priority={index === 0}
                className={`object-cover brightness-90 ${slide.object_position || "object-center"}`}
              />
            </div>
          ))}

          {/* Overlays for enhanced text readability */}
          <div className="absolute inset-0 z-2 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1520px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-12 md:py-14 lg:py-16 xl:py-20 flex flex-col justify-between min-h-[530px] md:min-h-[560px] lg:min-h-[580px] xl:min-h-[660px] 2xl:min-h-[720px]">
          <div className="max-w-3xl my-auto">
            {/* Subtitle tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-widest text-orange-400 uppercase mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>{activeSlide.badge_text || "Fitness • Sports • Wellness"}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[58px] xl:text-[66px] font-black tracking-tight leading-[1.08] mb-5 text-white drop-shadow-sm">
              {activeSlide.title || "Gear Up for a"} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 font-black">
                {activeSlide.title_gradient || "Healthier You"}
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base lg:text-lg text-stone-200 max-w-xl font-normal mb-8 leading-relaxed">
              {activeSlide.subtitle ||
                "Premium Sports & Fitness Equipment for Every Age and Every Goal"}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href={activeSlide.cta_link || "/products"}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-amber-500/10 hover:from-orange-500/35 hover:to-amber-500/20 backdrop-blur-xl border border-orange-400/40 hover:border-orange-400/70 text-white font-bold text-sm sm:text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_12px_28px_rgba(249,115,22,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group"
              >
                <span>{activeSlide.cta_text || "Shop Now"}</span>
                <ArrowRightIcon className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#categories"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-stone-400/50 hover:border-orange-500 bg-black/40 hover:bg-orange-500/15 backdrop-blur-xs text-white font-bold text-sm sm:text-base transition-all active:scale-95"
              >
                <GridIcon className="w-4 h-4 text-orange-400" />
                <span>Explore Categories</span>
              </Link>
            </div>

            {/* Desktop Trust Badges Row */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/15">
              <div className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)] group-hover:scale-110 transition-transform">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-white/95 tracking-wide whitespace-nowrap">
                  High Quality
                </span>
              </div>

              <div className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)] group-hover:scale-110 transition-transform">
                  <TagIcon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-white/95 tracking-wide whitespace-nowrap">
                  Affordable Prices
                </span>
              </div>

              <div className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)] group-hover:scale-110 transition-transform">
                  <AwardIcon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-white/95 tracking-wide whitespace-nowrap">
                  Trusted by Athletes
                </span>
              </div>

              <div className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.25)] group-hover:scale-110 transition-transform">
                  <TruckIcon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-white/95 tracking-wide whitespace-nowrap">
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Slide Indicator Bars */}
          <div className="flex items-center gap-2 pt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Switch to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentSlide
                    ? "w-10 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
