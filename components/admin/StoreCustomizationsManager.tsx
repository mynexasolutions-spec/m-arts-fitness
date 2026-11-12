"use client";

import React, { useState, useEffect } from "react";
import {
  StoreCustomizations,
  DEFAULT_STORE_CUSTOMIZATIONS,
  getStoredStoreCustomizations,
  saveStoredStoreCustomizations,
  resetStoredStoreCustomizations,
  fetchStoreCustomizations,
} from "@/data/storeSettings";
import {
  Building2,
  Phone,
  BarChart3,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Tag,
  Loader2,
  Eye,
} from "lucide-react";

type SubTab = "contact" | "stats" | "trust" | "steps" | "slogans";

export default function StoreCustomizationsManager() {
  const [data, setData] = useState<StoreCustomizations>(
    DEFAULT_STORE_CUSTOMIZATIONS
  );
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("contact");
  const [savedNotice, setSavedNotice] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Initial read from local cache for instant render
    const loaded = getStoredStoreCustomizations();
    setData(loaded);

    // 2. Fetch live data from server API
    fetchStoreCustomizations().then((liveData) => {
      setData(liveData);
    });
  }, []);

  const handleChange = (field: keyof StoreCustomizations, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      saveStoredStoreCustomizations(data);
      // Wait for server save
      const res = await fetch("/api/customizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData && resData.success && resData.customizations) {
        setData(resData.customizations);
      }
      setSavedNotice(true);
      setHasChanges(false);
      setTimeout(() => setSavedNotice(false), 3500);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to restore factory default store information? Any unsaved edits will be lost."
      )
    ) {
      const defaults = resetStoredStoreCustomizations();
      setData(defaults);
      setHasChanges(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  const tabs: { id: SubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "contact", label: "Contact Hub", icon: Phone },
    { id: "stats", label: "Stats & Counters", icon: BarChart3 },
    { id: "trust", label: "Trust Badges", icon: ShieldCheck },
    { id: "steps", label: "Order Steps", icon: RotateCw },
    { id: "slogans", label: "Hero & Slogans", icon: Tag },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Store Facts &amp; Customizations
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Active
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Edit factory contact numbers, Meerut workshop address, live stats,
              trust badges, and wholesale process steps. Changes sync to the server and apply instantly
              across the whole website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-[#1A2234] text-stone-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to initial M.art defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave()}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Saving All..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All store customizations saved to server! Storefront (About, Contact, Footer) updated live.
            </span>
          </div>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white flex items-center gap-1 text-[11px]"
          >
            Preview About Page <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Navigation Switch Tabs */}
      <div className="bg-[#0e1626] border border-white/[0.08] p-1.5 rounded-2xl shadow-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50"
                    : "text-stone-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-white" : "text-stone-400"
                  }`}
                />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab 1: Factory & Contact Hub */}
      {activeSubTab === "contact" && (
        <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400" />
              Factory Direct Contact &amp; Location Hub
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Changes made here automatically update the TopBar, Contact Us page, and Website Footer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone Display */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Display Phone Number
              </label>
              <input
                type="text"
                value={data.phoneDisplay}
                onChange={(e) => handleChange("phoneDisplay", e.target.value)}
                placeholder="+91 80776 46203"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Visual phone format shown to users on web pages.
              </p>
            </div>

            {/* Tel Raw */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Dialer Tel Link (e.g. +918077646203)
              </label>
              <input
                type="text"
                value={data.phoneTel}
                onChange={(e) => handleChange("phoneTel", e.target.value)}
                placeholder="+918077646203"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Raw number for phone call links when clicked.
              </p>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                WhatsApp Phone (Country Code without +, e.g. 918077646203)
              </label>
              <input
                type="text"
                value={data.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                placeholder="918077646203"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Official Support Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="multipleart786@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Factory Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Meerut Factory &amp; Workshop Physical Address
              </label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="4138, Mohsin Bagh, Zaidi Farm, Meerut, Uttar Pradesh - 250002"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Operating Hours */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Workshop Operating &amp; Dispatch Hours
              </label>
              <input
                type="text"
                value={data.operatingHours}
                onChange={(e) => handleChange("operatingHours", e.target.value)}
                placeholder="Mon – Sat: 9:00 AM – 8:00 PM (Sunday Closed / By Appointment)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Socials */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={data.instagramUrl}
                onChange={(e) => handleChange("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={data.facebookUrl}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={data.youtubeUrl}
                onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Dedicated Sub-Tab Save Action */}
          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-stone-400">
              Updates TopBar, Contact page, and Footer across all devices.
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Contact Info"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Factory Numbers & Stats */}
      {activeSubTab === "stats" && (
        <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                Live Brand Statistics &amp; Factory Proof Points
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Social proof numbers displayed live across the <strong>About Us</strong> and <strong>Contact Us</strong> pages. Edit any metric below and click Save.
              </p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Storefront Live Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stat 1 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/10 space-y-3.5 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Stat Metric 1 (Volume)
                </span>
                <span className="text-[10px] font-bold text-stone-400 bg-white/5 px-2 py-0.5 rounded-full">
                  Editable
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Counter / Value (e.g. 50,000+)
                  </label>
                  <input
                    type="text"
                    value={data.stat1Value}
                    onChange={(e) => handleChange("stat1Value", e.target.value)}
                    placeholder="50,000+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-extrabold text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Metric Description Label
                  </label>
                  <input
                    type="text"
                    value={data.stat1Label}
                    onChange={(e) => handleChange("stat1Label", e.target.value)}
                    placeholder="Dumbbells & Weight Plates Manufactured"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs">
                <Eye className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-400 text-[11px]">Preview:</span>
                <span className="font-extrabold text-orange-400">{data.stat1Value || "0"}</span>
                <span className="text-stone-300 truncate text-[11px]">— {data.stat1Label || "Label"}</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/10 space-y-3.5 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Stat Metric 2 (Clients)
                </span>
                <span className="text-[10px] font-bold text-stone-400 bg-white/5 px-2 py-0.5 rounded-full">
                  Editable
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Counter / Value (e.g. 2,500+)
                  </label>
                  <input
                    type="text"
                    value={data.stat2Value}
                    onChange={(e) => handleChange("stat2Value", e.target.value)}
                    placeholder="2,500+"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-extrabold text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Metric Description Label
                  </label>
                  <input
                    type="text"
                    value={data.stat2Label}
                    onChange={(e) => handleChange("stat2Label", e.target.value)}
                    placeholder="Commercial Gyms & Academies Fitted"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs">
                <Eye className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-400 text-[11px]">Preview:</span>
                <span className="font-extrabold text-orange-400">{data.stat2Value || "0"}</span>
                <span className="text-stone-300 truncate text-[11px]">— {data.stat2Label || "Label"}</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/10 space-y-3.5 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Stat Metric 3 (Heritage)
                </span>
                <span className="text-[10px] font-bold text-stone-400 bg-white/5 px-2 py-0.5 rounded-full">
                  Editable
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Counter / Value (e.g. 10+ Years)
                  </label>
                  <input
                    type="text"
                    value={data.stat3Value}
                    onChange={(e) => handleChange("stat3Value", e.target.value)}
                    placeholder="10+ Years"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-extrabold text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Metric Description Label
                  </label>
                  <input
                    type="text"
                    value={data.stat3Label}
                    onChange={(e) => handleChange("stat3Label", e.target.value)}
                    placeholder="Meerut Foundry & Crafting Legacy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs">
                <Eye className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-400 text-[11px]">Preview:</span>
                <span className="font-extrabold text-orange-400">{data.stat3Value || "0"}</span>
                <span className="text-stone-300 truncate text-[11px]">— {data.stat3Label || "Label"}</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/10 space-y-3.5 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Stat Metric 4 (Dispatch)
                </span>
                <span className="text-[10px] font-bold text-stone-400 bg-white/5 px-2 py-0.5 rounded-full">
                  Editable
                </span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Counter / Value (e.g. Pan-India)
                  </label>
                  <input
                    type="text"
                    value={data.stat4Value}
                    onChange={(e) => handleChange("stat4Value", e.target.value)}
                    placeholder="Pan-India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-extrabold text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    Metric Description Label
                  </label>
                  <input
                    type="text"
                    value={data.stat4Label}
                    onChange={(e) => handleChange("stat4Label", e.target.value)}
                    placeholder="Express Doorstep Cargo Dispatch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/15 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs">
                <Eye className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-400 text-[11px]">Preview:</span>
                <span className="font-extrabold text-orange-400">{data.stat4Value || "0"}</span>
                <span className="text-stone-300 truncate text-[11px]">— {data.stat4Label || "Label"}</span>
              </div>
            </div>
          </div>

          {/* Dedicated Sub-Tab Save Action */}
          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-stone-400">
              Immediately syncs to the About Us and Contact Us pages.
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? "Saving..." : "Save Stats & Counters"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Trust Badges */}
      {activeSubTab === "trust" && (
        <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              Store Trust Points &amp; Value Badges
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Key assurances displayed on checkout, contact form footer, and trust strips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Trust Point 1
              </label>
              <input
                type="text"
                value={data.trust1}
                onChange={(e) => handleChange("trust1", e.target.value)}
                placeholder="Direct Factory Wholesale Pricing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Trust Point 2
              </label>
              <input
                type="text"
                value={data.trust2}
                onChange={(e) => handleChange("trust2", e.target.value)}
                placeholder="100% Genuine Casting Materials"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Trust Point 3
              </label>
              <input
                type="text"
                value={data.trust3}
                onChange={(e) => handleChange("trust3", e.target.value)}
                placeholder="Custom Gym Logo & Weight Branding"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Trust Point 4
              </label>
              <input
                type="text"
                value={data.trust4}
                onChange={(e) => handleChange("trust4", e.target.value)}
                placeholder="Official GST Tax Invoicing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Dedicated Sub-Tab Save Action */}
          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-stone-400">
              Updates trust assurances and badges store-wide.
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Trust Badges"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: 3-Step Ordering Guide */}
      {activeSubTab === "steps" && (
        <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-orange-400" />
              3-Step Ordering Guide (Wholesale &amp; Retail Process)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Explains how inquiries turn into quotations and dispatched shipments.
            </p>
          </div>

          <div className="space-y-5">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  Step 1 Configuration
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={data.step1Title}
                  onChange={(e) => handleChange("step1Title", e.target.value)}
                  placeholder="Share Requirement"
                  className="px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/10 text-xs sm:text-sm text-white font-bold focus:border-orange-500"
                />
                <input
                  type="text"
                  value={data.step1Desc}
                  onChange={(e) => handleChange("step1Desc", e.target.value)}
                  placeholder="Description..."
                  className="md:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/10 text-xs sm:text-sm text-stone-200 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  Step 2 Configuration
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={data.step2Title}
                  onChange={(e) => handleChange("step2Title", e.target.value)}
                  placeholder="WhatsApp & Call Quote"
                  className="px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/10 text-xs sm:text-sm text-white font-bold focus:border-orange-500"
                />
                <input
                  type="text"
                  value={data.step2Desc}
                  onChange={(e) => handleChange("step2Desc", e.target.value)}
                  placeholder="Description..."
                  className="md:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/10 text-xs sm:text-sm text-stone-200 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  Step 3 Configuration
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={data.step3Title}
                  onChange={(e) => handleChange("step3Title", e.target.value)}
                  placeholder="Pan-India Dispatch"
                  className="px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/10 text-xs sm:text-sm text-white font-bold focus:border-orange-500"
                />
                <input
                  type="text"
                  value={data.step3Desc}
                  onChange={(e) => handleChange("step3Desc", e.target.value)}
                  placeholder="Description..."
                  className="md:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#141B29] border border-white/10 text-xs sm:text-sm text-stone-200 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Dedicated Sub-Tab Save Action */}
          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-stone-400">
              Updates the 3-step wholesale guide on the contact page.
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Order Guide"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Slogans & Page Titles */}
      {activeSubTab === "slogans" && (
        <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-400" />
              Brand Slogans &amp; Page Titles
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Top bar breadcrumb subtitles, hero headers, and contact lead descriptions.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Brand Slogan (Shown in Breadcrumb bar)
              </label>
              <input
                type="text"
                value={data.brandTagline}
                onChange={(e) => handleChange("brandTagline", e.target.value)}
                placeholder="Direct Manufacturer & Fitness Gear Supplier • Meerut"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Hero Badge Pill
                </label>
                <input
                  type="text"
                  value={data.heroBadge}
                  onChange={(e) => handleChange("heroBadge", e.target.value)}
                  placeholder="Get In Touch With M.art"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={data.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  placeholder="Contact Us & Bulk Order Inquiries"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Hero Subtitle Paragraph
              </label>
              <textarea
                rows={3}
                value={data.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                placeholder="Description..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Dedicated Sub-Tab Save Action */}
          <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-stone-400">
              Updates brand slogans, headers, and hero subtitles.
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Slogans & Titles"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Save Trigger if changes exist */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50 bg-orange-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-400 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-extrabold">You have unsaved changes!</span>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave()}
            className="px-4 py-1.5 bg-white text-orange-600 rounded-xl text-xs font-black shadow-md cursor-pointer hover:bg-stone-100 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Now"}
          </button>
        </div>
      )}
    </div>
  );
}
