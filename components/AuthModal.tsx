"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { XIcon, UserIcon } from "./Icons";

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

        // If email not confirmed, auto-confirm on the fly and retry!
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
    >
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 transition-transform transform scale-100">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="M.art Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                M.art
              </h3>
              <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                Sports &amp; Fitness
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Log In / Sign Up */}
        <div className="px-6 pt-3">
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                tab === "login"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-900"
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
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                tab === "signup"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-1">
            <h4 className="text-lg font-bold text-neutral-900">
              {tab === "login" ? "Welcome Back!" : "Create Your M.art Account"}
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              {tab === "login"
                ? "Sign in to access your orders, wishlist, and discounts."
                : "Join M.art for exclusive member discounts and quick checkout."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2 font-medium">
              <span>{successMessage}</span>
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-neutral-900 font-medium"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-neutral-900 font-medium"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
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
                  className="text-[11px] font-semibold text-orange-600 hover:underline cursor-pointer"
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
                className="w-full pl-4 pr-12 py-2.5 text-sm rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-neutral-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : tab === "login" ? (
              "Sign In to M.art"
            ) : (
              "Create Account"
            )}
          </button>

          {/* Bottom Switch Note */}
          <div className="text-center pt-2">
            {tab === "login" ? (
              <p className="text-xs text-stone-500">
                New to M.art?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("signup");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

