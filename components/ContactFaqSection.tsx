"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FAQItem, DEFAULT_FAQS, getStoredFAQs } from "@/data/faqs";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function ContactFaqSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [openId, setOpenId] = useState<string | null>("faq-1"); // Open 1st by default
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const syncFaqs = useCallback(() => {
    const loaded = getStoredFAQs();
    setFaqs(loaded);
  }, []);

  useEffect(() => {
    syncFaqs();
    const handleUpdate = () => syncFaqs();
    window.addEventListener("mart_faqs_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("mart_faqs_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncFaqs]);

  const activeFaqs = faqs.filter((f) => f.isActive);

  // Extract unique categories from active FAQs
  const categories = ["All", ...Array.from(new Set(activeFaqs.map((f) => f.category)))];

  // Filter based on search & category
  const filtered = activeFaqs.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (activeFaqs.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 border-t border-stone-200/80">
      <div className="max-w-[1360px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-3.5 shadow-2xs">
            <HelpCircle className="w-4 h-4" /> Quick Answers
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-900 text-sm sm:text-base lg:text-lg mt-3 leading-relaxed font-medium">
            Have questions about shipping, genuine gear authenticity, returns, or bulk gym fitouts? Find instant answers below.
          </p>

          {/* Search Box */}
          <div className="relative mt-7 max-w-lg mx-auto">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. delivery, return, bulk gym..."
              className="w-full pl-11 sm:pl-12 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-sm sm:text-base text-stone-950 placeholder:text-stone-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 shadow-xs transition-all font-semibold"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mb-9 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-102"
                    : "bg-white text-stone-900 hover:text-orange-600 border border-stone-300 hover:border-orange-400 shadow-2xs"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5 max-w-4xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white border border-stone-200 rounded-2xl text-stone-900 text-sm sm:text-base font-semibold">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Try another keyword or chat with us below.
            </div>
          ) : (
            filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-orange-500/50 shadow-md ring-1 ring-orange-500/10"
                      : "border-stone-200/90 hover:border-stone-300 shadow-2xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-sm sm:text-base lg:text-[17px] font-black text-stone-950 tracking-tight">
                        {item.question}
                      </span>
                    </div>

                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-orange-500 text-white rotate-180"
                          : "bg-stone-100 text-stone-800"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                  </button>

                  {/* Accordion Content with smooth expand */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2.5 text-sm sm:text-base text-stone-950 font-medium leading-relaxed border-t border-stone-100 animate-fade-in pl-11 sm:pl-12">
                      {item.answer}
                      {item.category && (
                        <div className="mt-3">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full inline-block">
                            {item.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Support Banner */}
        <div className="mt-12 sm:mt-14 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 shrink-0">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-black text-stone-950">
                Still have a question?
              </h3>
              <p className="text-xs sm:text-sm text-stone-900 font-medium mt-1">
                Our sports gear experts are available Mon &ndash; Sat, 9:00 AM &ndash; 8:00 PM.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/918077759885"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
