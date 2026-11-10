"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { XIcon } from "./Icons";

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(authModalTab);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync tab with context whenever modal opens or tab changes
  useEffect(() => {
    setTab(authModalTab);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authModalTab, authModalOpen]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeAuthModal();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (tab === "login") {
        let { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        // If email not confirmed, auto-confirm on the fly and retry
        if (
          error &&
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          try {
            await fetch("/api/auth/confirm-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: email.trim() }),
            });

            // Retry sign in
            const retryRes = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
            error = retryRes.error;
          } catch (confirmErr) {
            console.warn("Auto-confirm attempt error:", confirmErr);
          }
        }

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage("Logged in successfully!");
          setTimeout(() => {
            closeAuthModal();
          }, 800);
        }
      } else {
        // Sign Up with auto-confirmation (No verification email required)
        if (!fullName.trim()) {
          setErrorMessage("Please enter your full name.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            fullName: fullName.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          setErrorMessage(data.error || "Failed to create account.");
        } else {
          // Immediately sign in the user
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (!signInErr) {
            setSuccessMessage("Account created! Logging you in...");
            setTimeout(() => {
              closeAuthModal();
            }, 800);
          } else {
            // Fallback to login tab
            setTab("login");
            setPassword("");
            setSuccessMessage(
              "Account created successfully! Please sign in below."
            );
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Dialog Card - Unified Responsive Dimensions & Premium Dark Aesthetic */}
      <div className="relative w-full max-w-md md:max-w-3xl lg:max-w-4xl max-h-[92dvh] md:h-[580px] bg-[#121214] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 border border-stone-800/90 overflow-hidden z-10 flex flex-col md:flex-row transition-all duration-300">
        
        {/* Left Visual Column (Visible on Tablets, Laptops & Widescreen) */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative flex-col justify-between p-6 lg:p-8 text-white bg-stone-950 overflow-hidden select-none border-r border-stone-800/80">
          {/* Background Image */}
          <Image
            src="/GymEssentials.jpg"
            alt="M.art Fitness Motivation"
            fill
            priority
            sizes="(max-width: 1024px) 45vw, 500px"
            className="object-cover object-center scale-105"
          />
          {/* Dark Gradient Overlay for high contrast & premium look */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-stone-950/80 to-stone-950/55" />
          <div className="absolute inset-0 bg-orange-600/10 mix-blend-overlay" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-xl p-1.5 shadow-md border border-stone-200/20 shrink-0">
              <Image
                src="/logo.png"
                alt="M.art Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white block leading-none">
                M.art
              </span>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                Sports &amp; Fitness
              </span>
            </div>
          </div>

          {/* Middle Value Proposition */}
          <div className="relative z-10 my-auto py-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[10px] font-bold uppercase tracking-wider mb-2.5">
              <span>★ Athlete Member Club</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight leading-tight mb-2">
              Power Your Peak Performance.
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed mb-4">
              Access certified sports gear, save your wishlist, and get exclusive member-only pricing delivered directly to your doorstep.
            </p>

            {/* Checklist */}
            <div className="space-y-2 text-xs text-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <span className="font-medium">100% Authentic athletic equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <span className="font-medium">Fast, trackable shipping all across India</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <span className="font-medium">Exclusive member deals &amp; instant checkout</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Stat */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
            <span>10,000+ Active Athletes</span>
            <span className="text-amber-400 font-bold">★★★★★ 4.9/5 Rating</span>
          </div>
        </div>

        {/* Right Form Column - Zero Scroll on Desktop, Clean Responsive Scroll on Mobile */}
        <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-between overflow-y-auto md:overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-h-[92dvh] md:max-h-none md:h-full bg-[#141416] p-5 sm:p-6 lg:p-7 text-stone-100">
          
          <div className="flex flex-col flex-1">
            {/* Top Header Bar */}
            <div className="flex items-center justify-between mb-3">
              {/* Mobile-only logo banner */}
              <div className="flex md:hidden items-center gap-2.5">
                <div className="relative w-8 h-8 bg-white rounded-lg p-1 shadow-sm shrink-0">
                  <Image
                    src="/logo.png"
                    alt="M.art Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight leading-tight">
                    M.art
                  </h3>
                  <p className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">
                    Sports &amp; Fitness
                  </p>
                </div>
              </div>

              {/* Desktop header label */}
              <div className="hidden md:block">
                <span className="text-[11px] font-bold text-orange-500 tracking-wider uppercase">
                  M.art Account
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeAuthModal}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer ml-auto"
                aria-label="Close modal"
              >
                <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Tab Switcher: Log In / Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-stone-900/90 border border-stone-800 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  tab === "login"
                    ? "bg-stone-800 text-white shadow-xs border border-stone-700/60"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  tab === "signup"
                    ? "bg-stone-800 text-white shadow-xs border border-stone-700/60"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Title & Description */}
            <div className="text-left mb-3">
              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {tab === "login" ? "Welcome Back!" : "Create an Account"}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                {tab === "login"
                  ? "Sign in to access your orders, wishlist, and fast checkout."
                  : "Join M.art for exclusive member deals and fast delivery."}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-2.5 mb-2.5 bg-red-950/60 border border-red-800/80 text-red-200 text-xs rounded-xl flex items-start gap-2">
                <span className="font-bold shrink-0">Error:</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="p-2.5 mb-2.5 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs rounded-xl flex items-start gap-2 font-medium">
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between">
              <div className="space-y-2.5 sm:space-y-3">
                {/* Full Name (Sign Up only) */}
                {tab === "signup" && (
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-700/80 bg-stone-900/90 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all text-white font-medium placeholder:text-stone-500"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-700/80 bg-stone-900/90 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all text-white font-medium placeholder:text-stone-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-stone-300">
                      Password
                    </label>
                    {tab === "login" && (
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            "To reset your password, contact support or request a password reset email."
                          )
                        }
                        className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={tab === "signup" ? "At least 6 characters" : "••••••••"}
                      className="w-full pl-3.5 pr-12 py-2 text-sm rounded-xl border border-stone-700/80 bg-stone-900/90 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition-all text-white font-medium placeholder:text-stone-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-2.5 px-4 text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-600/25 transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : tab === "login" ? (
                  "Sign In to M.art"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch Note */}
          <div className="text-center pt-3 border-t border-stone-800/80 mt-3">
            {tab === "login" ? (
              <p className="text-xs text-stone-400">
                New to M.art?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("signup");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

