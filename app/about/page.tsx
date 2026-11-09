import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustStrip from "@/components/TrustStrip";
import AboutCategorySlider from "@/components/AboutCategorySlider";
import {
  AwardIcon,
  ShieldCheckIcon,
  TagIcon,
  TruckIcon,
  HeartIcon,
  QuoteIcon,
  StarIcon,
  FlameIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us | M.art Sports & Fitness",
  description:
    "Learn about M.art's story, mission, and commitment to providing durable, premium gym and sports gear for every fitness goal.",
};

export default function AboutPage() {
  const stats = [
    {
      value: "15,000+",
      label: "Active Athletes",
      detail: "Gym lovers & athletes across India",
      icon: FlameIcon,
    },
    {
      value: "500+",
      label: "Premium Gear",
      detail: "Commercial-grade items in stock",
      icon: TagIcon,
    },
    {
      value: "4.9 ★",
      label: "Customer Rating",
      detail: "From 8,500+ verified buyer reviews",
      icon: StarIcon,
    },
    {
      value: "Pan-India",
      label: "Express Delivery",
      detail: "Fast, safe doorstep transit nationwide",
      icon: TruckIcon,
    },
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: "Commercial-Grade Durability",
      description:
        "Every dumbbell, mat, bench, and accessory undergoes rigorous stress testing to ensure long-lasting performance.",
    },
    {
      icon: TagIcon,
      title: "Fair & Honest Pricing",
      description:
        "We eliminate middlemen and luxury brand markups so you get authentic, heavy-duty gear at fair and honest prices.",
    },
    {
      icon: AwardIcon,
      title: "Ergonomics & Safety First",
      description:
        "Designed with athlete ergonomics in mind — from anti-slip knurled grips to joint-friendly shock absorption.",
    },
    {
      icon: TruckIcon,
      title: "Reliable Support & Fast Shipping",
      description:
        "Our team assists you before, during, and after your purchase. Fast shipping with robust, impact-proof packaging.",
    },
  ];

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      {/* 1. Announcement Bar & Navigation */}
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* 2. HERO HEADER SECTION                                    */}
        {/* ========================================================= */}
        <section className="relative w-full bg-[#0d0d0d] text-white py-20 sm:py-24 lg:py-28 xl:py-32 overflow-hidden border-b border-stone-800">
          {/* Background Image with Transparent Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/about-hero-bg.jpg"
              alt="M.art Modern Athletic Training Facility Background"
              fill
              priority
              className="object-cover object-center opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/40 to-[#0d0d0d]/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(13,13,13,0.65)_100%)]" />
          </div>

          <div className="relative z-10 max-w-[1400px] xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
            {/* Breadcrumb */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-stone-400">/</span>
              <span className="text-white">About Us</span>
            </div>

            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-orange-500" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-orange-400 uppercase">
                Our Story &amp; Purpose
              </span>
              <span className="w-6 h-[2px] bg-orange-500" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.18] max-w-5xl mx-auto mb-6">
              Built for Passion. <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(249,115,22,0.38)]">
                Engineered for Performance
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg xl:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-normal">
              At <strong className="text-white font-semibold">M.art</strong>, we believe fitness isn&apos;t a privilege — it&apos;s a lifelong journey. We provide the tools you need to build strength, elevate stamina, and conquer your goals.
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. OUR STORY SECTION (Compact Balanced Proportions)       */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-stone-200">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
              {/* Left Column: Compact High-Definition Workout Photo */}
              <div className="lg:col-span-5 xl:col-span-5">
                <div className="relative w-full h-[320px] sm:h-[390px] lg:h-[450px] xl:h-[480px] rounded-3xl overflow-hidden border border-stone-200 shadow-xl shadow-stone-900/5 group">
                  <Image
                    src="/Fitness-lifestyle-16-9.jpg"
                    alt="M.art Fitness Lifestyle"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Clean subtle bottom gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Clean Bottom Mini Pill Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white shadow-lg w-fit">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide">
                      Tested by Athletes &amp; Coaches
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Proportional Story Copy */}
              <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center lg:pl-2">
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-[2px] bg-orange-500" />
                  <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                    Who We Are
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-extrabold text-stone-900 tracking-tight leading-[1.2] mb-4 sm:mb-5">
                  Making World-Class Fitness Gear Accessible to Every Indian Household.
                </h2>

                <div className="space-y-3.5 text-stone-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    M.art was founded with a singular ambition: <strong className="text-stone-900 font-semibold">to solve the dilemma between overpriced imported fitness brands and cheap, fragile equipment</strong> that breaks down in weeks.
                  </p>
                  <p>
                    Whether you are outfitting a garage gym, commercial studio, preparing for sports competitions, or starting morning yoga — you deserve equipment that is safe, sturdy, and built to endure.
                  </p>
                </div>

                {/* Our Promise Highlight Strip */}
                <div className="mt-5 p-4 rounded-2xl bg-[#fff8f3] border border-orange-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheckIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 mb-0.5">
                      Our Promise
                    </h4>
                    <p className="text-xs sm:text-[13px] text-stone-600 font-medium leading-relaxed">
                      Heavy-duty materials, joint-friendly ergonomics, and gear rigorously tested for tough workouts.
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 sm:mt-7 grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/45 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-center whitespace-nowrap"
                  >
                    <span>Browse Catalog</span>
                  </Link>
                  <Link
                    href="/#categories"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-stone-300 hover:border-orange-500 hover:bg-orange-50/60 hover:text-orange-600 text-stone-800 font-semibold text-xs sm:text-sm shadow-xs transition-all text-center whitespace-nowrap active:scale-95"
                  >
                    <span>Explore Categories</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. MISSION & VISION DUAL CARDS                            */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#fffaf7] border-b border-stone-200">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-5 h-[2px] bg-orange-500" />
                <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                  Our Core Purpose
                </span>
                <span className="w-5 h-[2px] bg-orange-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-stone-900 tracking-tight">
                Our Mission &amp; Vision
              </h2>
              <p className="text-stone-600 text-sm sm:text-base xl:text-lg mt-2">
                The compass guiding every decision, product release, and customer interaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 xl:gap-10">
              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 xl:p-14 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-400/80 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                {/* Top brand accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
                      <AwardIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70">
                      Foundational Purpose
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-stone-900 mb-3 xl:mb-4 group-hover:text-orange-600 transition-colors">
                    Our Mission
                  </h3>

                  <p className="text-stone-600 text-sm sm:text-base xl:text-lg leading-relaxed mb-6 font-normal">
                    To democratize access to elite sports and fitness equipment. We are on a mission to eliminate cost barriers and quality compromises, ensuring that everyone — from home workout beginners to competitive athletes — gets reliable tools to push their limits safely.
                  </p>
                </div>

                <ul className="space-y-3.5 text-stone-700 text-xs sm:text-sm xl:text-base font-semibold pt-6 border-t border-stone-100">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>Unmatched product durability &amp; safety testing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>Direct manufacturer pricing with no hidden markups</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>Speedy pan-India dispatch and attentive customer care</span>
                  </li>
                </ul>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 xl:p-14 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-400/80 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                {/* Top brand accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
                      <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/70">
                      The Road Ahead
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-stone-900 mb-3 xl:mb-4 group-hover:text-orange-600 transition-colors">
                    Our Vision
                  </h3>

                  <p className="text-stone-600 text-sm sm:text-base xl:text-lg leading-relaxed mb-6 font-normal">
                    To become India&apos;s most trusted sports and fitness companion. We envision a healthier society where daily physical activity, active lifestyle, and sports are embraced with enthusiasm and backed by gear that never lets you down.
                  </p>
                </div>

                <ul className="space-y-3.5 text-stone-700 text-xs sm:text-sm xl:text-base font-semibold pt-6 border-t border-stone-100">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>Inspiring an active lifestyle across all generations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>Expanding eco-conscious and ergonomic product innovations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>Building a nationwide community of dedicated fitness enthusiasts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. STATS STRIP (Athletic Impact Metric Cards)             */}
        {/* ========================================================= */}
        <section className="relative py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-[#13110f] via-[#1a1714] to-[#12100e] text-white border-y border-stone-800/80 overflow-hidden">
          {/* Subtle Ambient Brand Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.08)_0%,_transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

          <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className="group relative p-6 sm:p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 flex flex-col items-center text-center shadow-lg shadow-black/30 hover:shadow-orange-500/10 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Top corner ambient hover glow */}
                    <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
                    
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-md shadow-orange-500/10">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Stat Number with Brand Gradient */}
                    <div className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-none bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent mb-2 whitespace-nowrap drop-shadow-[0_2px_14px_rgba(249,115,22,0.3)]">
                      {stat.value}
                    </div>

                    {/* Stat Label & Details */}
                    <div className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                      {stat.label}
                    </div>
                    <p className="text-xs sm:text-[13px] text-stone-400 font-medium leading-relaxed max-w-[220px]">
                      {stat.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. OUR CORE VALUES                                        */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-white border-b border-stone-200">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            <div className="text-center max-w-3xl mx-auto mb-14 xl:mb-18">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-5 h-[2px] bg-orange-500" />
                <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                  What Drives Us
                </span>
                <span className="w-5 h-[2px] bg-orange-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-stone-900 tracking-tight">
                Our Core Pillars
              </h2>
              <p className="text-stone-600 text-sm sm:text-base xl:text-lg mt-2">
                The standards we refuse to compromise on when crafting and selecting fitness equipment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 xl:p-8 2xl:p-9 rounded-3xl bg-stone-50 border border-stone-200/90 hover:bg-white hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-900 text-orange-500 flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>
                      <h3 className="text-base sm:text-lg xl:text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {val.title}
                      </h3>
                      <p className="text-xs sm:text-sm xl:text-[15px] text-stone-600 leading-relaxed font-normal">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. WHAT WE OFFER (INTERACTIVE AUTO-SLIDE CAROUSEL)         */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-[#faf8f6] border-b border-stone-200">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            <AboutCategorySlider />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. PHILOSOPHY / STATEMENT BANNER (Punchy Athletic Power)   */}
        {/* ========================================================= */}
        <section className="py-20 sm:py-24 lg:py-28 xl:py-32 bg-[#0e0d0c] text-white relative overflow-hidden border-t border-b border-stone-800/90">
          {/* Subtle Ambient Radial Warm Glow in Center */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.1)_0%,_transparent_65%)] pointer-events-none" />

          <div className="relative z-10 max-w-[850px] xl:max-w-[1100px] mx-auto px-5 sm:px-8 xl:px-12 text-center">
            {/* Top Philosophy Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-[11px] sm:text-xs xl:text-sm font-bold tracking-widest uppercase mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              The M.art Philosophy
            </div>

            {/* 2-Line Punchy Athletic Power Statement */}
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight uppercase leading-[1.18] text-white mb-4 sm:mb-6">
              We Don&apos;t Just Sell Gear. <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(249,115,22,0.35)]">
                We Equip Everyday Discipline.
              </span>
            </h2>

            {/* Subtext Reassurance */}
            <p className="text-stone-400 text-xs sm:text-sm md:text-base xl:text-lg max-w-2xl mx-auto leading-relaxed font-normal mb-8">
              Fitness is not an elite luxury — it is a daily habit of self-respect. Built for athletes, beginners, and dreamers at every level.
            </p>

            {/* Slogan Micro Strip */}
            <div className="inline-flex items-center justify-center gap-2 sm:gap-3 xl:gap-4 text-[11px] sm:text-xs xl:text-sm font-semibold text-stone-500 tracking-wider uppercase">
              <span>Stay Fit</span>
              <span className="text-orange-500">•</span>
              <span>Play Better</span>
              <span className="text-orange-500">•</span>
              <span>Live Healthier</span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 9. RUNNING TEXT MARQUEE BANNER (Right to Left)            */}
        {/* ========================================================= */}
        <section className="relative py-8 sm:py-10 lg:py-12 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white overflow-hidden shadow-inner border-y border-orange-400/30 select-none">
          {/* Subtle Ambient Highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_75%)] pointer-events-none" />

          {/* Marquee Track moving from Right to Left */}
          <div className="flex overflow-hidden whitespace-nowrap">
            <div className="animate-marquee flex items-center shrink-0">
              {[
                "BUILT FOR PASSION",
                "ENGINEERED FOR PERFORMANCE",
                "COMMERCIAL GRADE GEAR",
                "100% GENUINE M.ART QUALITY",
                "STAY FIT • PLAY BETTER • LIVE HEALTHIER",
                "PAN-INDIA FAST DELIVERY",
                "EQUIP EVERYDAY DISCIPLINE",
                "UNLEASH YOUR ATHLETIC POTENTIAL",
              ].map((phrase, i) => (
                <div key={i} className="inline-flex items-center gap-6 sm:gap-10 mx-4 sm:mx-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                    {phrase}
                  </span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/80 shadow-xs" />
                </div>
              ))}
            </div>

            {/* Seamless duplicate loop track */}
            <div aria-hidden="true" className="animate-marquee flex items-center shrink-0">
              {[
                "BUILT FOR PASSION",
                "ENGINEERED FOR PERFORMANCE",
                "COMMERCIAL GRADE GEAR",
                "100% GENUINE M.ART QUALITY",
                "STAY FIT • PLAY BETTER • LIVE HEALTHIER",
                "PAN-INDIA FAST DELIVERY",
                "EQUIP EVERYDAY DISCIPLINE",
                "UNLEASH YOUR ATHLETIC POTENTIAL",
              ].map((phrase, i) => (
                <div key={`dup-${i}`} className="inline-flex items-center gap-6 sm:gap-10 mx-4 sm:mx-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                    {phrase}
                  </span>
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/80 shadow-xs" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Reassurance Trust Strip */}
        <TrustStrip />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
