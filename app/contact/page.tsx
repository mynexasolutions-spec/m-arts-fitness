"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import {
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/Icons";

const INQUIRY_TYPES = [
  "Bulk / Wholesale Order",
  "Product Inquiry",
  "Gym / Academy Setup",
  "General Support",
];

export default function ContactPage() {
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
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-orange-600">
                Home
              </Link>
              <span>/</span>
              <span className="text-stone-900 font-extrabold">Contact Us</span>
            </div>
            <span className="hidden sm:inline text-stone-400 font-medium">
              Direct Manufacturer &amp; Fitness Gear Supplier • Meerut
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#fff5eb] via-[#fffaf5] to-[#faf8f5] border-b border-orange-100/80">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-8 sm:py-12">
            <div className="max-w-2xl">
              <span className="inline-block bg-orange-500 text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 shadow-2xs">
                Get In Touch With M.art
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight leading-tight">
                Contact Us &amp; Bulk Order Inquiries
              </h1>
              <p className="text-xs sm:text-base text-stone-600 font-medium mt-2.5 leading-relaxed">
                Have a question about our gym dumbbells, yoga mats, skipping ropes, or looking for wholesale factory pricing for your gym or academy? Reach out to our Meerut team directly.
              </p>
            </div>
          </div>
        </section>

        {/* Main 2-Column Section (Widescreen 1600px Locked) */}
        <section className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
            {/* ========================================================= */}
            {/* LEFT COLUMN (5 Cols): Editorial Brand Image Showcase      */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-md bg-stone-900 min-h-[520px] sm:min-h-[620px] lg:min-h-[690px] h-full flex flex-col justify-between p-6 sm:p-8 group">
              {/* Background Image */}
              <Image
                src="/contact-showcase.jpg"
                alt="M.art Sports & Fitness Elite Training"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Dark Scrim for High Contrast Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-stone-950/20 pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  M.art Factory Direct • Meerut Hub
                </span>
              </div>

              {/* Bottom Text Overlay */}
              <div className="relative z-10 space-y-3 pt-32">
                <div className="inline-block bg-orange-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                  Built For Champions
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                  Engineered for Power. Crafted for Endurance.
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 font-medium leading-relaxed drop-shadow-xs">
                  Trusted by athletes, commercial gym owners, and coaches across India. Premium commercial dumbbells, agility gear, and wellness accessories shipped straight from our factory.
                </p>

                {/* Features Check Strip */}
                <div className="pt-2 border-t border-white/15 grid grid-cols-2 gap-2 text-[11px] font-bold text-white/90">
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-400">✓</span>
                    <span>100% Genuine Materials</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-orange-400">✓</span>
                    <span>Direct Factory Pricing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN (7 Cols): Customer & Bulk Leads Form          */}
            {/* ========================================================= */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-xs">
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
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                      Quick Callback &amp; Quotation Request
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-stone-950">
                      Send Us Your Requirement
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                      Fill in your details below for bulk wholesale pricing, custom gym orders, or product support.
                    </p>
                  </div>

                  <form noValidate onSubmit={handleLeadSubmit} className="space-y-4">
                    {/* Inquiry Type Pills */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-2">
                        Select Inquiry Type:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INQUIRY_TYPES.map((type) => {
                          const active = inquiryType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setInquiryType(type)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                active
                                  ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                                  : "bg-[#fff9f5] text-stone-700 border-orange-200/80 hover:border-orange-400"
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div data-lead-error={Boolean(errors.fullName)}>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                            errors.fullName
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-[11px] font-bold text-red-600">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div data-lead-error={Boolean(errors.phone)}>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-[11px] font-bold text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div data-lead-error={Boolean(errors.email)}>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                            errors.email
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-[11px] font-bold text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div data-lead-error={Boolean(errors.city)}>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                            errors.city
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-[11px] font-bold text-red-600">
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Requirement / Message */}
                    <div data-lead-error={Boolean(errors.message)}>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none resize-none ${
                          errors.message
                            ? "border-red-500 focus:border-red-500 bg-red-50/30"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-[11px] font-bold text-red-600">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.99]"
                    >
                      Submit Inquiry &amp; Request Callback
                    </button>

                    <div className="pt-3 grid grid-cols-2 gap-3 text-[11px] font-semibold text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheckIcon className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>Direct Factory Wholesale Rates</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TruckIcon className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>Fast Pan-India Dispatch from Meerut</span>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}
