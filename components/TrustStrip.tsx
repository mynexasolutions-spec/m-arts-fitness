"use client";

import React, { useState, useEffect } from "react";
import { TruckIcon, ShieldCheckIcon, RotateCcwIcon, CreditCardIcon } from "./Icons";
import { getStoredDeliverySettings } from "@/data/deliverySettings";

export default function TrustStrip() {
  const [threshold, setThreshold] = useState(999);

  useEffect(() => {
    setThreshold(getStoredDeliverySettings().freeShippingThreshold);
    const onUpdate = () => {
      setThreshold(getStoredDeliverySettings().freeShippingThreshold);
    };
    window.addEventListener("mart_delivery_settings_updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("mart_delivery_settings_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const items = [
    {
      icon: TruckIcon,
      title: "Free Delivery",
      subtitle: `On all orders above ₹${threshold}`,
    },
    {
      icon: ShieldCheckIcon,
      title: "100% Genuine Gear",
      subtitle: "Authentic & certified products",
    },
    {
      icon: RotateCcwIcon,
      title: "7-Day Easy Returns",
      subtitle: "Hassle-free replacement policy",
    },
    {
      icon: CreditCardIcon,
      title: "Secure Payments",
      subtitle: "100% encrypted UPI & cards",
    },
  ];

  return (
    <section className="w-full bg-[#181615] border-t border-stone-800 border-b border-stone-900/60 py-6 sm:py-8 md:py-10 shadow-inner">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* 2x2 Grid on Mobile (< lg), 4 Columns on Desktop (>= lg) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-0 items-stretch sm:items-center">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 justify-start lg:justify-center p-3 sm:p-2 lg:px-6 rounded-xl bg-[#201d1b]/60 sm:bg-transparent border border-stone-800/80 sm:border-0 lg:border-r lg:border-stone-800/80 last:border-r-0 group transition-all"
              >
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-200">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left w-full">
                  <div className="text-xs sm:text-[14px] font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-stone-400 font-medium mt-0.5 leading-snug">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
