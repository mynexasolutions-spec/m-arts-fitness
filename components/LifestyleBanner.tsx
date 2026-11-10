import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LifestyleBanner() {
  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE VIEW (< sm): Clean White Card Split + 4:5 Photo */}
      {/* ========================================================= */}
      <section className="sm:hidden w-full bg-white text-neutral-900 pt-3 pb-8 px-4 border-b border-stone-200/80">
        <div className="max-w-md mx-auto">
          {/* Top: 100% Crisp 4:5 Athlete Action Photo */}
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-stone-200/90 mb-4 bg-stone-900">
            <Image
              src="/Lifestyle-mobile-4-5.jpg"
              alt="Fitness is a Lifestyle - Athlete Workout"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Subtle corner badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-black/75 backdrop-blur-md text-orange-400 border border-orange-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
                Action • Training
              </span>
            </div>
          </div>

          {/* Bottom: Clean White Content Area - Symmetrically Centered */}
          <div className="px-1 text-center flex flex-col items-center">
            {/* Subtitle tag */}
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
              <span className="text-[11px] font-bold tracking-widest text-orange-600 uppercase">
                Train • Play • Stay Fit
              </span>
              <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
            </div>

            {/* Title on White */}
            <h2 className="text-[26px] xs:text-[28px] font-black tracking-tight text-neutral-900 leading-[1.12] mb-2">
              Fitness is a <br />
              <span className="text-orange-600 font-black">Lifestyle</span>
            </h2>

            {/* Subtext */}
            <p className="text-[13px] text-stone-600 font-medium mb-5 leading-relaxed max-w-sm mx-auto">
              Find Everything You Need at M.art Sports &amp; Fitness
            </p>

            {/* Full-width Touch-Friendly Button */}
            <Link
              href="/products"
              className="w-full inline-flex items-center justify-center gap-2.5 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 active:from-orange-600 active:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all mb-4"
            >
              <span>Explore Store</span>
            </Link>

            {/* Micro Trust Bullets Card */}
            <div className="w-full flex items-center justify-center gap-4 sm:gap-6 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px] font-semibold text-stone-700">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>100% Genuine Gear</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span>Express Shipping India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TABLET & DESKTOP VIEW (>= sm): Edge-to-Edge 21:9 Banner*/}
      {/* ========================================================= */}
      <section className="hidden sm:flex relative w-full bg-[#0d0d0d] overflow-hidden text-white py-12 sm:py-14 md:py-16 lg:py-20 min-h-[440px] md:min-h-[500px] lg:min-h-[580px] xl:min-h-[660px] 2xl:min-h-[720px] lg:aspect-[21/9] max-h-[780px] items-center border-b border-stone-800/60">
        {/* Background Image of Athlete with Battle Ropes - Cinematic 21:9 Ultrawide */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Lifestyle-desktop-21-9.jpg"
            alt="Fitness is a Lifestyle"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center] lg:object-[68%_center] xl:object-[66%_center] brightness-90"
          />
          {/* Dark Left Scrim for Crisp Text Legibility without blocking the athlete */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 md:via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Widescreen-locked Inner Content Container */}
        <div className="relative z-10 w-full max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
          <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl">
            {/* Subtitle tag */}
            <div className="inline-flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <span className="w-5 sm:w-6 h-[2px] bg-orange-500 rounded-full" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-orange-400 uppercase">
                Train • Play • Stay Fit
              </span>
            </div>

            {/* Title - Sleek, Sharp Bold Sans-Serif */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] mb-3 sm:mb-4">
              Fitness is a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 font-black">
                Lifestyle
              </span>
            </h2>

            {/* Subtext - Clear, Readable & High Contrast */}
            <p className="text-sm sm:text-base md:text-lg text-stone-200 font-medium mb-6 sm:mb-7 max-w-lg leading-relaxed">
              Find Everything You Need at M.art Sports &amp; Fitness
            </p>

            {/* Button & Perks */}
            <div>
              <Link
                href="/products"
                className="inline-flex items-center px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Explore Store</span>
              </Link>

              {/* Micro Trust Bullets */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-5 sm:gap-6 text-xs sm:text-[13px] text-stone-300 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>100% Genuine Gear</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Express Shipping India-Wide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
