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
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ChevronDownIcon,
} from "@/components/Icons";

const INQUIRY_TYPES = [
  "Bulk / Wholesale Order",
  "Product Inquiry",
  "Gym / Academy Setup",
  "General Support",
];

const CONTACT_INFO = {
  phoneDisplay: "+91 80776 46203",
  phoneTel: "tel:+918077646203",
  whatsappUrl:
    "https://wa.me/918077646203?text=Hi%20M.art%2C%20I%20have%20an%20inquiry%20regarding%20sports%20%26%20fitness%20gear.",
  email: "multipleart786@gmail.com",
  emailMailto: "mailto:multipleart786@gmail.com",
  address: "4138, Mohsin Bagh, Zaidi Farm, Meerut, Uttar Pradesh - 250002",
  instagram:
    "https://www.instagram.com/m.art.sports.and.fitness?cplk=MXIyaHhjOTJsZ2xkaw%3D%3D&utm_source=qr",
  facebook: "https://www.facebook.com/share/14pE7e2essx/?mibextid=wwXIfr",
  youtube: "https://youtube.com/@mohdshoaib1513?si=fxzA9WhiFlI8s7ve",
};

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.7C8.02 10.92 8.91 12.09 9.03 12.26C9.15 12.42 10.77 14.93 13.25 16C13.84 16.26 14.3 16.41 14.66 16.53C15.25 16.71 15.79 16.69 16.22 16.62C16.7 16.55 17.7 16.02 17.91 15.43C18.12 14.84 18.12 14.34 18.06 14.23C18 14.12 17.83 14.06 17.57 13.93C17.32 13.8 16.09 13.19 15.86 13.11C15.63 13.02 15.47 12.98 15.3 13.23C15.14 13.48 14.66 14.06 14.51 14.23C14.37 14.4 14.22 14.42 13.97 14.29C13.72 14.17 12.91 13.9 11.95 13.04C11.2 12.37 10.7 11.54 10.55 11.29C10.4 11.04 10.53 10.91 10.66 10.78C10.77 10.67 10.91 10.49 11.04 10.34C11.17 10.19 11.21 10.08 11.3 9.91C11.38 9.74 11.34 9.6 11.28 9.48C11.21 9.35 10.73 8.17 10.53 7.68C10.33 7.2 10.13 7.27 9.97 7.26C9.83 7.26 9.68 7.34 9.53 7.34Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

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
          <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-500">
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
          <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-8 sm:py-12">
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

        {/* Main 2-Column Section */}
        <section className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN (5 Cols): Editorial Showcase + Factory Info   */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 space-y-6">

              {/* 1. MOBILE SPLIT VIEW (< lg) */}
              <div className="lg:hidden space-y-4">
                {/* Clean Photo Banner (Unblocked) */}
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-900">
                  <Image
                    src="/contact-showcase.jpg"
                    alt="M.art Sports & Fitness Elite Training"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      Factory Direct • Meerut
                    </span>
                  </div>
                </div>

                {/* Clean Text Card Below Image (White card with clean typography) */}
                <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-3">
                  <div className="inline-block bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                    Built For Champions
                  </div>
                  <h3 className="text-xl font-black text-stone-950 tracking-tight leading-snug">
                    Engineered for Power. Crafted for Endurance.
                  </h3>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    Trusted by athletes, commercial gym owners, and coaches across India. Premium commercial dumbbells, agility gear, and wellness accessories shipped straight from our factory.
                  </p>
                  <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] font-bold text-stone-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-500 font-black">✓</span>
                      <span>100% Genuine Materials</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-500 font-black">✓</span>
                      <span>Direct Factory Pricing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. DESKTOP VIEW (>= lg): Editorial Brand Showcase */}
              <div className="hidden lg:flex relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-md bg-stone-900 min-h-[500px] xl:min-h-[560px] flex-col justify-between p-8 group">
                <Image
                  src="/contact-showcase.jpg"
                  alt="M.art Sports & Fitness Elite Training"
                  fill
                  priority
                  sizes="42vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-stone-950/20 pointer-events-none" />

                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    M.art Factory Direct • Meerut Hub
                  </span>
                </div>

                <div className="relative z-10 space-y-3 pt-24">
                  <div className="inline-block bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                    Built For Champions
                  </div>
                  <h3 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                    Engineered for Power. Crafted for Endurance.
                  </h3>
                  <p className="text-xs xl:text-sm text-stone-200 font-medium leading-relaxed drop-shadow-xs">
                    Trusted by athletes, commercial gym owners, and coaches across India. Premium commercial dumbbells, agility gear, and wellness accessories shipped straight from our factory.
                  </p>
                  <div className="pt-2 border-t border-white/15 grid grid-cols-2 gap-2 text-xs font-bold text-white/90">
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

              {/* 3. DESKTOP CONTACT & SOCIALS HUB (>= lg) */}
              <div className="hidden lg:block bg-white rounded-3xl border border-stone-200/90 p-6 xl:p-7 shadow-xs space-y-5">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
                    Direct Reach &amp; Factory Hub
                  </span>
                  <h4 className="text-lg font-black text-stone-950">
                    Connect With Our Meerut Headquarters
                  </h4>
                </div>

                <div className="space-y-4 text-xs xl:text-sm">
                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#fff9f5] border border-orange-100">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <PhoneIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                        Call &amp; WhatsApp Direct
                      </p>
                      <a
                        href={CONTACT_INFO.phoneTel}
                        className="font-extrabold text-stone-900 hover:text-orange-600 text-sm block"
                      >
                        {CONTACT_INFO.phoneDisplay}
                      </a>
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={CONTACT_INFO.phoneTel}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          <PhoneIcon className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <a
                          href={CONTACT_INFO.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-colors"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                      <MailIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                        Factory Email Support
                      </p>
                      <a
                        href={CONTACT_INFO.emailMailto}
                        className="font-extrabold text-stone-900 hover:text-orange-600 truncate block"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                        Manufacturing Unit &amp; Office
                      </p>
                      <p className="font-semibold text-stone-800 leading-snug mt-0.5">
                        {CONTACT_INFO.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600">
                    Follow Our Manufacturing &amp; Work:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={CONTACT_INFO.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={CONTACT_INFO.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-[#1877F2] hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={CONTACT_INFO.youtube}
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
                      {/* Inquiry Type: Mobile Dropdown + Desktop Pills */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-2">
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
                        <div className="hidden sm:flex flex-wrap gap-2">
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

              {/* 4. MOBILE CONTACT & SOCIALS CARD (< lg) */}
              <div className="lg:hidden bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block mb-0.5">
                    Need Instant Answers?
                  </span>
                  <h4 className="text-base font-black text-stone-950">
                    Connect With Our Meerut Factory
                  </h4>
                </div>

                {/* 1-Tap Buttons: Call & WhatsApp */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={CONTACT_INFO.phoneTel}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-2xs transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call Factory</span>
                  </a>
                  <a
                    href={CONTACT_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs transition-colors"
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
                      href={CONTACT_INFO.emailMailto}
                      className="font-bold text-stone-900 truncate hover:text-orange-600"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-2.5 text-stone-700">
                    <MapPinIcon className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-stone-600">
                      {CONTACT_INFO.address}
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
                      href={CONTACT_INFO.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={CONTACT_INFO.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-[#1877F2] hover:text-white hover:border-transparent text-stone-700 flex items-center justify-center transition-all shadow-2xs"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={CONTACT_INFO.youtube}
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

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}
