"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, MailIcon, MapPinIcon, ChevronDownIcon } from "./Icons";
import {
  StoreCustomizations,
  DEFAULT_STORE_CUSTOMIZATIONS,
  getStoredStoreCustomizations,
} from "@/data/storeSettings";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<StoreCustomizations>(
    DEFAULT_STORE_CUSTOMIZATIONS
  );

  useEffect(() => {
    const syncStore = () => {
      setStoreData(getStoredStoreCustomizations());
    };
    syncStore();
    window.addEventListener("mart_customizations_updated", syncStore);
    window.addEventListener("storage", syncStore);
    return () => {
      window.removeEventListener("mart_customizations_updated", syncStore);
      window.removeEventListener("storage", syncStore);
    };
  }, []);

  const phoneTelLink = `tel:${storeData.phoneTel || storeData.phoneDisplay.replace(/\s+/g, "")}`;
  const emailMailto = `mailto:${storeData.email}`;

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-[#121110] text-[#a8a29e] pt-12 sm:pt-16 pb-10 border-t border-[#292524]">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        
        {/* ========================================================= */}
        {/* 1. MOBILE VIEW (< lg): Brand Stacked on Top + Accordion   */}
        {/* ========================================================= */}
        <div className="lg:hidden mb-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-3.5 mb-3 group">
              <div className="relative w-14 h-14 overflow-hidden rounded-2xl bg-white p-1.5 border border-stone-700/80 shrink-0 shadow-lg">
                <Image
                  src="/logo.jpg"
                  alt="M.art Sports & Fitness"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-white leading-tight">
                  M.art
                </span>
                <span className="text-xs font-bold tracking-wider text-orange-500 uppercase mt-0.5">
                  Sports &amp; Fitness
                </span>
              </div>
            </Link>

            <p className="text-stone-300 text-xs sm:text-sm font-normal mb-4 tracking-wide max-w-md">
              Stay Fit • Play Better • Live Healthier
            </p>

            {/* Social Media Links (Instagram, Facebook, YouTube) */}
            <div className="flex items-center gap-2.5 text-stone-300">
              <a
                href={storeData.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href={storeData.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a
                href={storeData.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Mobile Accordion */}
          <div className="divide-y divide-[#292524] border-t border-b border-[#292524]">
            {/* Accordion 1: Quick Links */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("quick-links")}
                className="w-full py-4 flex items-center justify-between text-left text-white font-bold text-xs sm:text-sm tracking-wider uppercase group"
              >
                <span className="group-hover:text-orange-400 transition-colors">Quick Links</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${
                    openSection === "quick-links" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "quick-links" && (
                <ul className="pb-4 pt-1 space-y-3 pl-1">
                  <li><Link href="/" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Home</Link></li>
                  <li><Link href="/about" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">About Us</Link></li>
                  <li><Link href="/products" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Shop Gear</Link></li>
                  <li><Link href="/products" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Categories</Link></li>
                  <li><Link href="/contact" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Contact</Link></li>
                </ul>
              )}
            </div>

            {/* Accordion 2: Our Categories */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("categories")}
                className="w-full py-4 flex items-center justify-between text-left text-white font-bold text-xs sm:text-sm tracking-wider uppercase group"
              >
                <span className="group-hover:text-orange-400 transition-colors">Our Categories</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${
                    openSection === "categories" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "categories" && (
                <ul className="pb-4 pt-1 space-y-3 pl-1">
                  <li><Link href="/products?category=gym" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Gym Equipment</Link></li>
                  <li><Link href="/products?category=training" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Training Gear</Link></li>
                  <li><Link href="/products?category=yoga" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Yoga &amp; Wellness</Link></li>
                  <li><Link href="/products?category=agility" className="text-xs sm:text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors block">Agility Tools</Link></li>
                </ul>
              )}
            </div>

            {/* Accordion 3: Get In Touch */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("contact")}
                className="w-full py-4 flex items-center justify-between text-left text-white font-bold text-xs sm:text-sm tracking-wider uppercase group"
              >
                <span className="group-hover:text-orange-400 transition-colors">Get In Touch</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-orange-500 transition-transform duration-300 ${
                    openSection === "contact" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "contact" && (
                <ul className="pb-4 pt-1 space-y-3.5 pl-1">
                  <li>
                    <a href="tel:+918077646203" className="flex items-center gap-3 text-stone-200 hover:text-orange-400 transition-colors">
                      <PhoneIcon className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">+91 80776 46203</span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:multipleart786@gmail.com" className="flex items-center gap-3 text-stone-200 hover:text-orange-400 transition-colors">
                      <MailIcon className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">multipleart786@gmail.com</span>
                    </a>
                  </li>
                  <li className="flex items-start gap-3 text-stone-200">
                    <MapPinIcon className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium">4138, Mohsin Bagh, Zaidi Farm, Meerut</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP & WIDESCREEN VIEW (>= lg): Single Horizontal Row */}
        {/* Logo & Brand on Left, Quick Links, Categories, Contact on Right */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 pb-14 border-b border-[#292524] items-start">
          
          {/* Col 1: Brand Information (Logo, Tagline, Social Icons) */}
          <div className="lg:col-span-4 xl:col-span-4">
            <Link href="/" className="inline-flex items-center gap-4 mb-4 group">
              <div className="relative w-16 h-16 xl:w-20 xl:h-20 overflow-hidden rounded-2xl bg-white p-1.5 border border-stone-700/80 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.jpg"
                  alt="M.art Sports & Fitness"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl xl:text-3xl tracking-tight text-white leading-tight group-hover:text-orange-400 transition-colors">
                  M.art
                </span>
                <span className="text-xs xl:text-[13px] font-bold tracking-wider text-orange-500 uppercase mt-0.5">
                  Sports &amp; Fitness
                </span>
              </div>
            </Link>

            <p className="text-stone-300 text-sm font-normal mb-6 tracking-wide max-w-sm">
              Stay Fit • Play Better • Live Healthier
            </p>

            {/* Social Media Links (Instagram, Facebook, YouTube) */}
            <div className="flex items-center gap-3 text-stone-300">
              <a
                href={storeData.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href={storeData.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a
                href={storeData.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-stone-700 bg-stone-900/60 flex items-center justify-center hover:text-orange-500 hover:border-orange-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (Directly to the Right of Brand) */}
          <div className="lg:col-span-2 xl:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">About Us</Link></li>
              <li><Link href="/products" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Shop Gear</Link></li>
              <li><Link href="/products" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Categories</Link></li>
              <li><Link href="/contact" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Our Categories */}
          <div className="lg:col-span-3 xl:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Our Categories
            </h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=gym" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Gym Equipment</Link></li>
              <li><Link href="/products?category=training" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Training Gear</Link></li>
              <li><Link href="/products?category=yoga" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Yoga &amp; Wellness</Link></li>
              <li><Link href="/products?category=agility" className="text-sm text-stone-300 hover:text-orange-400 font-medium transition-colors">Agility Tools</Link></li>
            </ul>
          </div>

          {/* Col 4: Get In Touch */}
          <div className="lg:col-span-3 xl:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={phoneTelLink} className="text-sm text-stone-200 font-medium hover:text-orange-400 transition-colors">
                  {storeData.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="w-4 h-4 text-orange-500 shrink-0" />
                <a href={emailMailto} className="text-sm text-stone-200 font-medium hover:text-orange-400 transition-colors">
                  {storeData.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-stone-200">
                <MapPinIcon className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-sm text-stone-200 font-medium">{storeData.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-[13px] text-stone-400 text-center sm:text-left">
          <div>
            © 2026 M.art Sports &amp; Fitness. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="#privacy" className="hover:text-stone-200 transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-stone-200 transition-colors">Terms &amp; Conditions</Link>
            <Link href="#refund" className="hover:text-stone-200 transition-colors">Refund Policy</Link>
            <Link href="/admin" className="text-stone-500 hover:text-orange-400 font-semibold transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
