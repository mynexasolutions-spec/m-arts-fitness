import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  sub: string;
  count: string;
  image: string;
  href: string;
}

const categories: CategoryItem[] = [
  {
    id: "gym-eq",
    name: "Gym Equipment",
    sub: "Dumbbells & Weights",
    count: "6+ Items",
    image: "https://ik.imagekit.io/2adr187f7j/categories/category-gym-equipment.png",
    href: "/products?category=gym",
  },
  {
    id: "sports-acc",
    name: "Sports Accessories",
    sub: "Cones & Markers",
    count: "4+ Items",
    image: "https://ik.imagekit.io/2adr187f7j/categories/category-sports-accessories.png",
    href: "/products?category=accessories",
  },
  {
    id: "training-eq",
    name: "Training Equipment",
    sub: "Speed & Cardio Ropes",
    count: "5+ Items",
    image: "https://ik.imagekit.io/2adr187f7j/categories/category-training-equipment.png",
    href: "/products?category=training",
  },
  {
    id: "fitness-ess",
    name: "Fitness Essentials",
    sub: "Premium Yoga Mats",
    count: "8+ Items",
    image: "https://ik.imagekit.io/2adr187f7j/categories/category-fitness-essentials.png",
    href: "/products?category=yoga",
  },
  {
    id: "sports-gear",
    name: "Sports Gear",
    sub: "Balls & Essentials",
    count: "10+ Items",
    image: "https://ik.imagekit.io/2adr187f7j/categories/category-sports-gear.png",
    href: "/products?category=sports",
  },
  {
    id: "agility-tools",
    name: "Agility Tools",
    sub: "Speed Ladders & Drills",
    count: "4+ Items",
    image: "https://ik.imagekit.io/2adr187f7j/categories/category-agility-tools.png",
    href: "/products?category=agility",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="relative pt-14 md:pt-20 pb-16 md:pb-20 bg-gradient-to-b from-stone-50 via-white to-stone-50/60 border-b border-stone-200/60 overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full"
      />

      <div className="relative max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-[2px] bg-orange-500 rounded-full" />
            <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-orange-600 uppercase">
              Explore Our Range
            </span>
            <span className="w-5 h-[2px] bg-orange-500 rounded-full" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2.5 font-medium leading-relaxed max-w-lg mx-auto">
            Everything you need for fitness, sports and an active lifestyle.
          </p>
        </div>

        {/* Categories Grid - 6 Elevated Studio Cards with Roomy Responsive Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-5 xl:gap-5.5 2xl:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 hover:border-orange-500/60 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(249,115,22,0.12)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center justify-between"
            >
              {/* Equipment Canvas - Flush Edge-to-Edge with top & sides (Zero Padding) */}
              <div className="relative w-full aspect-square bg-stone-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, (max-width: 1536px) 16vw, 260px"
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Category Info & Interactive Pill (Full Title Display without Truncation) */}
              <div className="w-full p-3.5 sm:p-4 pt-3 sm:pt-3.5 flex flex-col items-center flex-1 justify-between">
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-xs sm:text-[13.5px] xl:text-[14.5px] font-extrabold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug min-h-[2.5rem] flex items-center justify-center text-center px-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-1 text-center">
                    {cat.sub}
                  </p>
                </div>

                {/* Arrowless Sleek Interactive Pill */}
                <span className="mt-3 inline-flex items-center text-[10px] sm:text-[11px] font-bold text-orange-600 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white px-3.5 py-1 rounded-full transition-all duration-300">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
