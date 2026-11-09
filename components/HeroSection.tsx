import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GridIcon,
  ShieldCheckIcon,
  TagIcon,
  AwardIcon,
  TruckIcon,
} from "./Icons";

export default function HeroSection() {
  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE VIEW (< sm): Compact Athletic Poster (Idea 2)   */}
      {/* ========================================================= */}
      <section className="sm:hidden relative w-full h-[475px] xs:h-[505px] bg-[#0d0d0d] overflow-hidden text-white flex flex-col justify-between border-b border-stone-800/80">
        {/* Background Image: 9:16 Portrait Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero-mobile-9-16.jpg"
            alt="M.art Premium Fitness Equipment"
            fill
            priority
            className="object-cover object-bottom"
          />
          {/* Top gradient for crystal clear text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-transparent h-[65%]" />
          {/* Subtle bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content Container - Clean Header at Top */}
        <div className="relative z-10 px-4 pt-6 xs:pt-7 flex flex-col items-center text-center">
          {/* Subtitle tag */}
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] xs:text-[11px] font-bold tracking-widest text-orange-400 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>Fitness • Sports • Wellness</span>
          </div>

          {/* Main Title */}
          <h1 className="text-[28px] xs:text-[32px] font-black tracking-tight text-white leading-[1.12] mb-2.5 drop-shadow-md">
            Gear Up for a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 font-black">
              Healthier You
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-[12px] text-stone-200 font-medium leading-relaxed max-w-xs mx-auto drop-shadow-sm">
            Premium Sports &amp; Fitness Equipment for Every Age and Every Goal
          </p>
        </div>

        {/* Bottom Thumb Zone: Style 1 - Clean Gradient CTA */}
        <div className="relative z-10 px-4 pb-4 flex flex-col items-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs xs:text-sm shadow-lg shadow-orange-500/30 active:scale-95 transition-all text-center tracking-wide"
          >
            <span>Shop Now</span>
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TABLET & DESKTOP VIEW (>= sm): Widescreen Hero Banner  */}
      {/* ========================================================= */}
      <section className="hidden sm:block relative w-full bg-[#0d0d0d] overflow-hidden text-white border-b border-stone-200/50">
        {/* Background Image: 16:9 Widescreen */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero-16-9.jpg"
            alt="Sports & Fitness Equipment"
            fill
            priority
            className="object-cover object-[84%_6%] md:object-[85%_6%] lg:object-[86%_6%] xl:object-[86%_5%] 2xl:object-[86%_4%] brightness-90"
          />
          {/* Overlays for enhanced text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1520px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-12 md:py-14 lg:py-16 xl:py-20 flex flex-col justify-between min-h-[530px] md:min-h-[560px] lg:min-h-[580px] xl:min-h-[660px] 2xl:min-h-[720px]">
          <div className="max-w-3xl my-auto">
            {/* Subtitle tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-widest text-orange-400 uppercase mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Fitness • Sports • Wellness</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[58px] xl:text-[66px] font-black tracking-tight leading-[1.08] mb-5 text-white drop-shadow-sm">
              Gear Up for a <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 font-black">
                Healthier You
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base lg:text-lg text-stone-200 max-w-xl font-normal mb-8 leading-relaxed">
              Premium Sports &amp; Fitness Equipment for Every Age and Every Goal
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/45 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Shop Now</span>
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
        </div>
      </section>
    </>
  );
}
