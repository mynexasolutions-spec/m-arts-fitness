"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  CreditCardIcon,
  FlameIcon,
  TagIcon,
  AwardIcon,
  StarIcon,
} from "./Icons";
import {
  AnnouncementItem,
  AnnouncementsConfig,
  DEFAULT_ANNOUNCEMENTS_CONFIG,
  getStoredAnnouncementsConfig,
} from "@/data/announcements";

// Icon mapper helper
function renderAnnouncementIcon(iconName: AnnouncementItem["icon"], className = "w-3.5 h-3.5") {
  switch (iconName) {
    case "truck":
      return <TruckIcon className={`${className} text-orange-500 shrink-0`} />;
    case "shield":
      return <ShieldCheckIcon className={`${className} text-orange-500 shrink-0`} />;
    case "rotate":
      return <RotateCcwIcon className={`${className} text-orange-500 shrink-0`} />;
    case "card":
      return <CreditCardIcon className={`${className} text-orange-500 shrink-0`} />;
    case "flame":
      return <FlameIcon className={`${className} text-orange-500 shrink-0`} />;
    case "tag":
      return <TagIcon className={`${className} text-orange-500 shrink-0`} />;
    case "award":
      return <AwardIcon className={`${className} text-orange-500 shrink-0`} />;
    case "star":
      return <StarIcon className={`${className} text-orange-500 shrink-0`} />;
    default:
      return <TruckIcon className={`${className} text-orange-500 shrink-0`} />;
  }
}

export default function TopBar() {
  const [config, setConfig] = useState<AnnouncementsConfig>(DEFAULT_ANNOUNCEMENTS_CONFIG);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Touch gesture state for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync state from storage
  const syncConfig = useCallback(() => {
    const loaded = getStoredAnnouncementsConfig();
    setConfig(loaded);
  }, []);

  useEffect(() => {
    setMounted(true);
    syncConfig();

    const handleUpdate = () => syncConfig();
    window.addEventListener("mart_announcements_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("mart_announcements_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncConfig]);

  const activeItems = config.items.filter((item) => item.isActive);
  const totalSlides = activeItems.length;

  const handleNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setFadeState("out");
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
      setFadeState("in");
    }, 240);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setFadeState("out");
    setTimeout(() => {
      setIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
      setFadeState("in");
    }, 240);
  }, [totalSlides]);

  // Autoplay timer: Every 3.5 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const speedMs = Math.max(2500, (config.autoplaySpeedSeconds || 3.5) * 1000);
    const interval = setInterval(() => {
      handleNext();
    }, speedMs);

    return () => clearInterval(interval);
  }, [handleNext, isPaused, totalSlides, config.autoplaySpeedSeconds]);

  // Touch swipe listeners for Mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold 40px
    if (diff > 40) {
      handleNext(); // swipe left -> next slide
    } else if (diff < -40) {
      handlePrev(); // swipe right -> prev slide
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  // If disabled or no active items
  if (mounted && (!config.isEnabled || totalSlides === 0)) {
    return null;
  }

  // Current active item
  const currentItem = activeItems[index % (totalSlides || 1)] || activeItems[0];
  const isCopied = copiedCode === currentItem?.couponCode;

  return (
    <div
      className="bg-[#141211] text-[#d6d3d1] text-[11px] sm:text-xs font-medium border-b border-white/[0.08] w-full select-none relative z-40 transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        
        {/* ============================================================== */}
        {/* 📱 MOBILE VIEW: 1-Line Luxury Fade Transition (< md)           */}
        {/* ============================================================== */}
        <div
          className="md:hidden relative flex items-center justify-center h-8 overflow-hidden select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {currentItem && (
            <div
              className={`flex items-center justify-center flex-nowrap gap-1.5 px-3 text-center w-full whitespace-nowrap transition-all duration-250 ease-out ${
                fadeState === "in"
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-1 scale-95"
              }`}
            >
              {renderAnnouncementIcon(currentItem.icon, "w-3.5 h-3.5 shrink-0")}

              {currentItem.badge && (
                <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
                  {currentItem.badge}
                </span>
              )}

              {currentItem.linkUrl && !currentItem.couponCode ? (
                <Link
                  href={currentItem.linkUrl}
                  className="text-[11px] font-medium text-stone-200 tracking-tight hover:text-orange-400 transition-colors"
                >
                  {currentItem.text}
                </Link>
              ) : (
                <span className="text-[11px] font-medium text-stone-200 tracking-tight">
                  {currentItem.text}
                </span>
              )}

              {currentItem.couponCode && (
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(e, currentItem.couponCode!)}
                  className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-white/10 active:bg-orange-500 active:text-white text-orange-400 transition-colors shrink-0 cursor-pointer"
                >
                  {isCopied ? "Copied!" : itemCodePill(currentItem.couponCode)}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 💻 LAPTOP / DESKTOP VIEW: Clean Bar (>= md)                    */}
        {/* ============================================================== */}
        <div className="hidden md:flex items-center justify-between py-2 text-stone-300">
          
          {/* Left side: Clean highlighted offer / rotating deal */}
          <div className="flex items-center gap-2.5 min-w-0">
            {renderAnnouncementIcon(currentItem?.icon || "truck", "w-4 h-4")}
            
            {currentItem?.badge && (
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {currentItem.badge}
              </span>
            )}

            <div className="flex items-center gap-2 text-xs truncate">
              {currentItem?.linkUrl && !currentItem.couponCode ? (
                <Link
                  href={currentItem.linkUrl}
                  className="font-medium text-stone-200 hover:text-orange-400 transition-colors truncate"
                >
                  {currentItem.text}
                </Link>
              ) : (
                <span className="font-medium text-stone-200 truncate">
                  {currentItem?.text}
                </span>
              )}

              {currentItem?.couponCode && (
                <button
                  type="button"
                  onClick={(e) => handleCopyCode(e, currentItem.couponCode!)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/10 hover:bg-orange-500 hover:text-white text-orange-300 transition-all cursor-pointer"
                  title="Click to copy coupon code"
                >
                  <span>{isCopied ? "Copied!" : `Code: ${currentItem.couponCode}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right side: Clean Trust Points */}
          {config.desktopShowTrustBadges && (
            <div className="flex items-center gap-5 text-stone-300 text-xs shrink-0">
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ShieldCheckIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
                <span className="font-medium text-stone-300">100% Genuine Gear</span>
              </div>
              <span className="text-stone-700">|</span>
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <RotateCcwIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
                <span className="font-medium text-stone-300">7-Day Returns</span>
              </div>
              <span className="text-stone-700">|</span>
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <CreditCardIcon className="text-orange-500 w-3.5 h-3.5 shrink-0" />
                <span className="font-medium text-stone-300">Secure COD Available</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function itemCodePill(code: string) {
  return code;
}
