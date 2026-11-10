import React from "react";
import { AwardIcon, TagIcon, GridIcon, HeadphonesIcon } from "./Icons";

export default function WhyChooseUs() {
  const features = [
    {
      icon: AwardIcon,
      title: "Premium Quality",
      description: "Durable & performance-tested products.",
    },
    {
      icon: TagIcon,
      title: "Best Prices",
      description: "Top brands at pocket-friendly rates.",
    },
    {
      icon: GridIcon,
      title: "Wide Range",
      description: "From gym gear to sports essentials.",
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "We're always here to help you.",
    },
  ];

  return (
    <section className="pt-16 md:pt-20 pb-6 md:pb-8 bg-[#fffaf7]">
      <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-6 h-[2px] bg-orange-500" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Why Choose M.art?
            </h2>
            <span className="w-6 h-[2px] bg-orange-500" />
          </div>
          <p className="text-stone-700 text-sm sm:text-base mt-2 font-medium">
            More than just a store — we&apos;re your fitness partner.
          </p>
        </div>

        {/* 4 Feature Cards: 2x2 Grid on Mobile (<lg), 4 Columns on Desktop (>=lg) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 xl:gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-center border border-stone-200/80 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-400 transition-all duration-300 flex flex-col items-center justify-start transform hover:-translate-y-1.5"
              >
                {/* Matte Black Badge with Glowing Orange Icon (Gymshark/Under Armour Style) */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-stone-900 border border-stone-800 text-orange-500 flex items-center justify-center shadow-md shadow-stone-950/20 mb-3.5 sm:mb-5 group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                  {feat.title}
                </h3>
                <p className="text-[11px] sm:text-xs lg:text-[13px] text-stone-600 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
