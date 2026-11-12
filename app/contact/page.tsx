"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import ContactFaqSection from "@/components/ContactFaqSection";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import {
  ShieldCheckIcon,
  TruckIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ChevronDownIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
} from "@/components/Icons";
import {
  StoreCustomizations,
  DEFAULT_STORE_CUSTOMIZATIONS,
  getStoredStoreCustomizations,
} from "@/data/storeSettings";

const INQUIRY_TYPES = [
  "Bulk / Wholesale Order",
  "Product Inquiry",
  "Gym / Academy Setup",
  "General Support",
];

export default function ContactPage() {
  const [storeData, setStoreData] = useState<StoreCustomizations>(
    DEFAULT_STORE_CUSTOMIZATIONS
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedLead, setSubmittedLead] = useState<{
    leadId: string;
    name: string;
    phone: string;
    inquiryType: string;
  } | null>(null);

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
  const whatsappUrl = `https://wa.me/${storeData.whatsappNumber}?text=${encodeURIComponent(
    storeData.whatsappDefaultMessage
  )}`;
  const emailMailto = `mailto:${storeData.email}`;

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (min 2 characters)";
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (city.trim().length < 2) {
      newErrors.city = "Please enter your city or location";
    }
    if (message.trim().length < 8) {
      newErrors.message =
        "Please share a few details about your requirement (min 8 characters)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErr = document.querySelector("[data-lead-error='true']");
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    const randomId = Math.floor(10000 + Math.random() * 90000);
    setSubmittedLead({
      leadId: `LEAD-${randomId}`,
      name: fullName.trim(),
      phone: phone.trim(),
      inquiryType,
    });

    // Sync to inquiries API
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        city: city.trim(),
        inquiryType,
        message: message.trim(),
      }),
    }).catch((err) => console.warn("Could not sync inquiry to API:", err));

    setFullName("");
    setPhone("");
    setEmail("");
    setCity("");
    setMessage("");
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* Top Breadcrumb Bar */}
        <div className="bg-white border-b border-stone-200/80">
          <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-3.5 sm:py-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-600">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-orange-600 transition-colors">
                Home
              </Link>
              <span className="text-stone-300">/</span>
              <span className="text-stone-950 font-extrabold">Contact Us</span>
            </div>
            <span className="hidden sm:inline text-stone-500 font-medium">
              {storeData.brandTagline}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#fff5eb] via-[#fffaf5] to-[#faf8f5] border-b border-orange-100/80">
          <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-10 sm:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3.5 shadow-2xs">
                {storeData.heroBadge}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight leading-tight">
                {storeData.heroTitle}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-stone-900 font-medium mt-3 leading-relaxed max-w-2xl mx-auto">
                {storeData.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Main 2-Column Section */}
        <section className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN (5 Cols): Clean Photo Showcase + Factory Hub   */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 space-y-6">

              {/* 1. MOBILE PHOTO BANNER (< lg) */}
              <div className="lg:hidden relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-900">
                <Image
                  src="/contact-showcase.jpg"
                  alt="M.art Sports & Fitness Elite Training"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* 2. DESKTOP VIEW (>= lg): Clean Editorial Photo Showcase */}
              <div className="hidden lg:block relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-md bg-stone-900 min-h-[480px] xl:min-h-[540px] group">
                <Image
                  src="/contact-showcase.jpg"
                  alt="M.art Sports & Fitness Elite Training"
                  fill
                  priority
                  sizes="42vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* 3. DESKTOP CONTACT & SOCIALS HUB (>= lg) */}
              <div className="hidden lg:block bg-white rounded-3xl border border-stone-200/90 p-6 xl:p-8 shadow-xs space-y-5">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                    Direct Reach &amp; Factory Hub
                  </span>
                  <h4 className="text-lg xl:text-xl font-black text-stone-950">
                    Connect With Our Meerut Headquarters
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#fff9f5] border border-orange-100">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <PhoneIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                        Call &amp; WhatsApp Direct
                      </p>
                      <a
                        href={phoneTelLink}
                        className="font-black text-stone-950 hover:text-orange-600 text-base xl:text-lg block mt-0.5 transition-colors"
                      >
                        {storeData.phoneDisplay}
                      </a>
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <a
                          href={phoneTelLink}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors"
                        >
                          <PhoneIcon className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                      <MailIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                        Factory Email Support
                      </p>
                      <a
                        href={emailMailto}
                        className="font-extrabold text-stone-950 hover:text-orange-600 text-sm xl:text-base truncate block mt-0.5 transition-colors"
                      >
                        {storeData.email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-4.5 h-4.5 text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                        Manufacturing Unit &amp; Office
                      </p>
                      <p className="font-semibold text-stone-900 leading-snug mt-1 text-xs sm:text-sm">
                        {storeData.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-3.5 border-t border-stone-200/80 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-stone-700">
                    Follow Our Manufacturing &amp; Work:
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={storeData.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={storeData.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-[#1877F2] hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={storeData.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="w-9 h-9 rounded-full border border-stone-200 bg-white hover:bg-[#FF0000] hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <YouTubeIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN (7 Cols): Customer & Bulk Leads Form         */}
            {/* ========================================================= */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-xs">
                {submittedLead ? (
                  <div className="py-8 sm:py-12 text-center max-w-md mx-auto">
                    <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-emerald-100/80 animate-ping [animation-duration:1.8s] [animation-iteration-count:2]" />
                      <div className="relative w-16 h-16 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                    </div>

                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-3.5 py-1 rounded-full mb-2">
                      Inquiry Registered • {submittedLead.leadId}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                      Thank You, {submittedLead.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium mt-2 leading-relaxed">
                      We have received your{" "}
                      <span className="font-bold text-stone-900">
                        {submittedLead.inquiryType}
                      </span>{" "}
                      request. Our Meerut team will call or WhatsApp you on{" "}
                      <span className="font-bold text-orange-600">
                        +91 {submittedLead.phone}
                      </span>{" "}
                      shortly.
                    </p>

                    <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSubmittedLead(null)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                      <Link
                        href="/products"
                        className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-300 hover:border-stone-900 text-stone-800 text-xs sm:text-sm font-bold transition-all"
                      >
                        Explore Gear
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 pb-4 border-b border-stone-200/80">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                        Quick Callback &amp; Quotation Request
                      </span>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-950">
                        Send Us Your Requirement
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-stone-900 font-medium mt-1.5 leading-relaxed">
                        Fill in your details below for bulk wholesale pricing, custom gym orders, or product support.
                      </p>
                    </div>

                    <form noValidate onSubmit={handleLeadSubmit} className="space-y-4 sm:space-y-5">
                      {/* Inquiry Type: Mobile Dropdown + Desktop Pills */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-2">
                          Select Inquiry Type:
                        </label>
                        
                        {/* 1. Mobile Dropdown (< sm) */}
                        <div className="relative sm:hidden">
                          <select
                            value={inquiryType}
                            onChange={(e) => setInquiryType(e.target.value)}
                            className="w-full appearance-none px-4 py-3 rounded-xl border border-orange-200/90 bg-[#fff9f5] text-xs font-bold text-stone-900 focus:outline-none focus:border-orange-500 pr-10 shadow-2xs"
                          >
                            {INQUIRY_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <ChevronDownIcon className="w-4 h-4 text-orange-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* 2. Desktop & Tablet Pills (>= sm) */}
                        <div className="hidden sm:flex flex-wrap gap-2.5">
                          {INQUIRY_TYPES.map((type) => {
                            const active = inquiryType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setInquiryType(type)}
                                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                                  active
                                    ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                                    : "bg-[#fff9f5] text-stone-800 border-orange-200/80 hover:border-orange-400"
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                        {/* Full Name */}
                        <div data-lead-error={Boolean(errors.fullName)}>
                          <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              clearFieldError("fullName");
                            }}
                            placeholder="e.g., Mohd Shoaib"
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm sm:text-base font-medium text-stone-950 placeholder:text-stone-400 focus:outline-none ${
                              errors.fullName
                                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                                : "border-stone-300 focus:border-orange-500"
                            }`}
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-xs font-bold text-red-600">
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        {/* Mobile Number */}
                        <div data-lead-error={Boolean(errors.phone)}>
                          <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                            Mobile / WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            value={phone}
                            onChange={(e) => {
                              const digits = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setPhone(digits);
                              clearFieldError("phone");
                            }}
                            placeholder="10-digit mobile number"
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm sm:text-base font-medium text-stone-950 placeholder:text-stone-400 focus:outline-none ${
                              errors.phone
                                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                                : "border-stone-300 focus:border-orange-500"
                            }`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-xs font-bold text-red-600">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div data-lead-error={Boolean(errors.email)}>
                          <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearFieldError("email");
                            }}
                            placeholder="yourname@gmail.com"
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm sm:text-base font-medium text-stone-950 placeholder:text-stone-400 focus:outline-none ${
                              errors.email
                                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                                : "border-stone-300 focus:border-orange-500"
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs font-bold text-red-600">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* City */}
                        <div data-lead-error={Boolean(errors.city)}>
                          <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                            City / Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                              clearFieldError("city");
                            }}
                            placeholder="e.g., Meerut, Delhi, Mumbai"
                            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm sm:text-base font-medium text-stone-950 placeholder:text-stone-400 focus:outline-none ${
                              errors.city
                                ? "border-red-500 focus:border-red-500 bg-red-50/30"
                                : "border-stone-300 focus:border-orange-500"
                            }`}
                          />
                          {errors.city && (
                            <p className="mt-1 text-xs font-bold text-red-600">
                              {errors.city}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Requirement / Message */}
                      <div data-lead-error={Boolean(errors.message)}>
                        <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-1.5">
                          Your Requirement / Message *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            clearFieldError("message");
                          }}
                          placeholder="Tell us which products, quantities, or custom weights you are looking for..."
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-sm sm:text-base font-medium text-stone-950 placeholder:text-stone-400 focus:outline-none resize-none ${
                            errors.message
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs font-bold text-red-600">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Submit Inquiry &amp; Request Callback
                      </button>

                      <div className="pt-3.5 grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-stone-600">
                        <div className="flex items-center gap-2">
                          <ShieldCheckIcon className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                          <span>Direct Factory Wholesale Rates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TruckIcon className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                          <span>Fast Pan-India Dispatch from Meerut</span>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>

              {/* 3-Step Ordering & Inquiry Guide Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 xl:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-5 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-0.5">
                      Simple &amp; Transparent Process
                    </span>
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-stone-950">
                      How Our Ordering Process Works
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/80 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Direct Meerut Factory Supply
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#fff9f5] to-white border border-orange-100/90 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                          01
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                          Step 1
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-stone-950 mb-1.5">
                        {storeData.step1Title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                        {storeData.step1Desc}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#fff9f5] to-white border border-orange-100/90 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                          02
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                          Step 2
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-stone-950 mb-1.5">
                        {storeData.step2Title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                        {storeData.step2Desc}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#fff9f5] to-white border border-orange-100/90 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                          03
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                          Step 3
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-stone-950 mb-1.5">
                        {storeData.step3Title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                        {storeData.step3Desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-500 font-black">✓</span>
                    <span>{storeData.trust1}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-500 font-black">✓</span>
                    <span>{storeData.trust2}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-500 font-black">✓</span>
                    <span>{storeData.trust4}</span>
                  </div>
                </div>
              </div>

              {/* Live Brand Proof & Factory Track Record Stats */}
              <div className="bg-[#141210] rounded-2xl sm:rounded-3xl border border-stone-800 p-5 sm:p-7 xl:p-8 shadow-md text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-stone-800/80">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500 block mb-0.5">
                      Production Volume &amp; Footprint
                    </span>
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-white">
                      Factory Scale &amp; Proof Points
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Manufacturer Numbers
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-500 tracking-tight">
                      {storeData.stat1Value || "50,000+"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-1 leading-snug">
                      {storeData.stat1Label || "Dumbbells & Weight Plates Manufactured"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-500 tracking-tight">
                      {storeData.stat2Value || "2,500+"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-1 leading-snug">
                      {storeData.stat2Label || "Commercial Gyms & Academies Fitted"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-500 tracking-tight">
                      {storeData.stat3Value || "10+ Years"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-1 leading-snug">
                      {storeData.stat3Label || "Meerut Foundry & Crafting Legacy"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-500 tracking-tight">
                      {storeData.stat4Value || "Pan-India"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-1 leading-snug">
                      {storeData.stat4Label || "Express Doorstep Cargo Dispatch"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. MOBILE CONTACT & SOCIALS CARD (< lg) */}
              <div className="lg:hidden bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-0.5">
                    Need Instant Answers?
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-stone-950">
                    Connect With Our Meerut Factory
                  </h4>
                </div>

                {/* 1-Tap Buttons: Call & WhatsApp */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={phoneTelLink}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-2xs transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call Factory</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-2xs transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Contact info rows */}
                <div className="pt-2 border-t border-stone-100 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 text-stone-700">
                    <MailIcon className="w-4 h-4 text-orange-500 shrink-0" />
                    <a
                      href={emailMailto}
                      className="font-bold text-stone-900 truncate hover:text-orange-600"
                    >
                      {storeData.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 text-stone-700">
                    <MapPinIcon className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-stone-600">
                      {storeData.address}
                    </span>
                  </div>
                </div>

                {/* Social media links */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-600">
                    Follow Our Channels:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={storeData.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={storeData.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-[#1877F2] hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={storeData.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-[#FF0000] hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <YouTubeIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Global Store FAQs Section */}
        <ContactFaqSection />

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}
