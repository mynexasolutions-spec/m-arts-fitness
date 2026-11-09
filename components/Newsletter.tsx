"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MailIcon } from "./Icons";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE VIEW (< sm): Photo Upar + Clean White Form Niche */}
      {/* ========================================================= */}
      <section className="sm:hidden w-full bg-white text-neutral-900 pt-3 pb-8 px-4 border-t border-stone-200/80">
        <div className="max-w-md mx-auto text-center flex flex-col items-center">
          {/* Top: 100% Crisp 4:3 Sunset Runner Photo (Zero text blocking sunset or runner) */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-stone-200/90 mb-5 bg-stone-900">
            <Image
              src="/Stay-Updated-4-3.jpg"
              alt="M.art Fitness - Sunset Runner"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Subtle top-corner pill badge */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="bg-black/75 backdrop-blur-md text-orange-400 border border-orange-500/40 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                Community • Motivation
              </span>
            </div>
          </div>

          {/* Bottom: Clean White Content & Subscription Form */}
          <div className="w-full px-1">
            {/* Centered Symmetrical Micro-Tag */}
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="w-4 h-[2px] bg-orange-500" />
              <span className="text-[11px] font-bold tracking-widest text-orange-600 uppercase">
                Newsletter &amp; Drops
              </span>
              <span className="w-4 h-[2px] bg-orange-500" />
            </div>

            {/* Dynamic Headline */}
            <h3 className="text-[24px] xs:text-[26px] font-extrabold text-neutral-900 tracking-tight leading-tight mb-2">
              Stay Ahead of the Game <br />
              <span className="text-orange-600 italic font-black">Join the M.art Community</span>
            </h3>

            {/* Short Crisp Subtext */}
            <p className="text-[13px] text-stone-600 font-medium mb-5 max-w-sm mx-auto leading-relaxed">
              Get early access to exclusive offers, new gear &amp; fitness training tips.
            </p>

            {/* Form */}
            {submitted ? (
              <div className="text-emerald-700 text-xs font-bold bg-emerald-50 py-3 px-5 rounded-xl border border-emerald-200 shadow-2xs">
                ✓ Thank you for subscribing! We&apos;ll be in touch soon.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2.5 w-full max-w-sm mx-auto"
              >
                <input
                  type="email"
                  required
                  autoComplete="email"
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs font-medium"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 active:from-orange-600 active:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TABLET & DESKTOP VIEW (>= sm): Widescreen 16:9 Banner  */}
      {/* ========================================================= */}
      <section className="hidden sm:flex relative w-full bg-black overflow-hidden text-white py-14 sm:py-16 md:py-20 items-center border-t border-stone-200/40">
        {/* Background Image: 16:9 Widescreen Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Stay-Updated.jpg"
            alt="Stay Updated"
            fill
            className="object-cover object-[75%_center] md:object-[82%_center] brightness-80"
          />
          {/* Dark Gradient Overlay for text readability on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 md:via-black/70 to-transparent" />
        </div>

        {/* Content Container aligned with 1600px grid */}
        <div className="relative z-10 w-full max-w-[1520px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <MailIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Stay Updated with M.art Sports &amp; Fitness
              </h3>
            </div>

            <p className="text-sm md:text-base text-stone-200 mb-6 font-normal">
              Get the latest exclusive offers, new arrivals and fitness tips directly in your inbox!
            </p>

            {/* Desktop Form */}
            {submitted ? (
              <div className="text-emerald-400 text-sm font-semibold bg-black/60 backdrop-blur-xs py-2.5 px-5 rounded-full inline-block border border-emerald-500/30">
                ✓ Thank you for subscribing! We&apos;ll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-row items-center gap-2.5 max-w-lg"
              >
                <input
                  type="email"
                  required
                  autoComplete="email"
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-5 py-3 rounded-full bg-white text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md font-medium"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/30 transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
