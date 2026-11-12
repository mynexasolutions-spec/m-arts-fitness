"use client";

import React, { useState, useEffect } from "react";
import {
  StoreCustomizations,
  DEFAULT_STORE_CUSTOMIZATIONS,
  getStoredStoreCustomizations,
  fetchStoreCustomizations,
} from "@/data/storeSettings";
import {
  FlameIcon,
  AwardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/Icons";

export default function AboutStatsStrip() {
  const [storeData, setStoreData] = useState<StoreCustomizations>(
    DEFAULT_STORE_CUSTOMIZATIONS
  );

  useEffect(() => {
    // 1. Initial read from local cache
    setStoreData(getStoredStoreCustomizations());

    // 2. Fetch live data from server API
    fetchStoreCustomizations().then((data) => {
      setStoreData(data);
    });

    // 3. Reactive event listeners for real-time updates
    const onUpdate = () => {
      setStoreData(getStoredStoreCustomizations());
    };
    window.addEventListener("mart_customizations_updated", onUpdate);
    window.addEventListener("storage", onUpdate);

    return () => {
      window.removeEventListener("mart_customizations_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const stats = [
    {
      value: storeData.stat1Value || "50,000+",
      label: storeData.stat1Label || "Dumbbells & Weight Plates Manufactured",
      detail: "Direct from our Meerut foundry unit",
      icon: FlameIcon,
    },
    {
      value: storeData.stat2Value || "2,500+",
      label: storeData.stat2Label || "Commercial Gyms & Academies Fitted",
      detail: "Supplied with commercial-grade fitness gear",
      icon: AwardIcon,
    },
    {
      value: storeData.stat3Value || "10+ Years",
      label: storeData.stat3Label || "Meerut Foundry & Crafting Legacy",
      detail: "Cast iron molding & craftsmanship",
      icon: ShieldCheckIcon,
    },
    {
      value: storeData.stat4Value || "Pan-India",
      label: storeData.stat4Label || "Express Doorstep Cargo Dispatch",
      detail: "Safe door-to-door freight transit nationwide",
      icon: TruckIcon,
    },
  ];

  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-[#13110f] via-[#1a1714] to-[#12100e] text-white border-y border-stone-800/80 overflow-hidden">
      {/* Subtle Ambient Brand Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 flex flex-col items-center text-center shadow-lg shadow-black/30 hover:shadow-orange-500/10 hover:-translate-y-1 overflow-hidden"
              >
                {/* Top corner ambient hover glow */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-md shadow-orange-500/10">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Stat Number with Brand Gradient */}
                <div className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-none bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent mb-2 whitespace-nowrap drop-shadow-[0_2px_14px_rgba(249,115,22,0.3)]">
                  {stat.value}
                </div>

                {/* Stat Label & Details */}
                <div className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                  {stat.label}
                </div>
                <p className="text-xs sm:text-[13px] text-stone-400 font-medium leading-relaxed max-w-[220px]">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
