"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, AlertCircle, Info, X, ExternalLink } from "lucide-react";

export interface BrandToastProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "success" | "error" | "info";
  duration?: number; // in milliseconds
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function BrandToast({
  isOpen,
  onClose,
  title = "Changes Saved Successfully!",
  message = "All updates have been saved and are now live.",
  type = "success",
  duration = 4000,
  action,
}: BrandToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const startTime = Date.now();
    const interval = 25; // update every 25ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(timer);
        onClose();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] sm:w-full transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#101623]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/70 p-4">
        {/* Subtle glowing ambient gradient */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start gap-3.5">
          {/* Logo container with status indicator badge */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white border border-white/40 flex items-center justify-center p-1.5 shadow-lg shadow-black/30 group">
              <Image
                src="/logo.png"
                alt="M.art Logo"
                width={38}
                height={38}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Status Badge */}
            {type === "success" && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-[#101623]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            {type === "error" && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-[#101623]">
                <AlertCircle className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            {type === "info" && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md border-2 border-[#101623]">
                <Info className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                M.art Admin
              </span>
              <span className="text-stone-600 text-xs">•</span>
              <span className="text-[11px] text-stone-400 font-medium">Just now</span>
            </div>

            <h4 className="text-sm font-bold text-white tracking-tight mt-0.5 truncate">
              {title}
            </h4>

            <p className="text-xs text-stone-300 mt-1 leading-relaxed line-clamp-2">
              {message}
            </p>

            {/* Optional Action Button */}
            {action && (
              <div className="mt-2.5">
                {action.href ? (
                  <Link
                    href={action.href}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 hover:text-white text-xs font-bold transition-all"
                  >
                    <span>{action.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={action.onClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>{action.label}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Progress Timer Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.06]">
          <div
            className={`h-full transition-all duration-75 ease-linear ${
              type === "error"
                ? "bg-rose-500"
                : type === "info"
                ? "bg-blue-500"
                : "bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
