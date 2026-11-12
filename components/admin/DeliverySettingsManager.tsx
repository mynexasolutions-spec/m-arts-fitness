"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  RotateCcw,
  Save,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import {
  DeliverySettings,
  DEFAULT_DELIVERY_SETTINGS,
  getStoredDeliverySettings,
  saveStoredDeliverySettings,
  resetStoredDeliverySettings,
} from "@/data/deliverySettings";

export default function DeliverySettingsManager() {
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS);
  const [savedNotice, setSavedNotice] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSettings(getStoredDeliverySettings());
    const onUpdate = () => setSettings(getStoredDeliverySettings());
    window.addEventListener("mart_delivery_settings_updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("mart_delivery_settings_updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const handleChange = <K extends keyof DeliverySettings>(
    key: K,
    val: DeliverySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveStoredDeliverySettings(settings);
    setHasChanges(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4500);
  };

  const handleReset = () => {
    if (
      confirm(
        "Reset delivery settings back to default M.art rates (₹999 Free Delivery, ₹49 Standard Fee)?"
      )
    ) {
      const def = resetStoredDeliverySettings();
      setSettings(def);
      setHasChanges(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3500);
    }
  };

  const threshold = Number(settings.freeShippingThreshold) || 0;
  const fee = Number(settings.standardDeliveryFee) || 0;

  return (
    <div className="space-y-6 w-full">
      {/* Top Header Card */}
      <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Delivery &amp; Logistics Configuration
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                Live Sync Active
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-xl leading-relaxed">
              Configure free shipping threshold, standard delivery charges, and dispatch hub details.
              Changes apply instantly to the Cart Drawer and Checkout calculation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-[#1A2234] text-stone-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to default ₹999 / ₹49 rates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-white text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
              hasChanges
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30 animate-pulse"
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Saved Success Notification */}
      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Delivery &amp; shipping rules saved successfully! Cart Drawer and Checkout page are updated live.
            </span>
          </div>
          <a
            href="/checkout"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white flex items-center gap-1 text-[11px] shrink-0"
          >
            Preview Checkout <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Form: Fields (7 cols) */}
        <div className="md:col-span-7 bg-[#141B29] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <PackageCheck className="w-4 h-4 text-orange-400" />
            Shipping Rates &amp; Free Delivery
          </h3>

          {/* Field 1: Free Delivery Threshold */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5 flex items-center justify-between">
              <span>Free Delivery Threshold (₹)</span>
              <span className="text-[11px] text-orange-400 font-semibold">Min order for ₹0 shipping</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  handleChange("freeShippingThreshold", Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-[#1A2234] border border-white/10 focus:border-orange-500 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                placeholder="999"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed">
              Orders at or above this amount qualify for automatic <strong>FREE Delivery</strong> at checkout and in the cart progress bar.
            </p>
          </div>

          {/* Field 2: Standard Delivery Fee */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5 flex items-center justify-between">
              <span>Standard Delivery Fee (₹)</span>
              <span className="text-[11px] text-stone-400 font-semibold">Applied below threshold</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.standardDeliveryFee}
                onChange={(e) =>
                  handleChange("standardDeliveryFee", Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full bg-[#1A2234] border border-white/10 focus:border-orange-500 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                placeholder="49"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed">
              Flat delivery charge added to order total when cart value is less than ₹{threshold}.
            </p>
          </div>

          {/* Field 3: Estimated Delivery Days */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Estimated Delivery Timeline</span>
            </label>
            <input
              type="text"
              value={settings.estimatedDeliveryDays}
              onChange={(e) => handleChange("estimatedDeliveryDays", e.target.value)}
              className="w-full bg-[#1A2234] border border-white/10 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
              placeholder="e.g. 3-5 Business Days"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Shown to customers on the checkout and tracking confirmation screen.
            </p>
          </div>

          {/* Field 4: Dispatch Hub Location */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Dispatch Hub Location (Factory Address)</span>
            </label>
            <textarea
              rows={2}
              value={settings.dispatchHubLocation}
              onChange={(e) => handleChange("dispatchHubLocation", e.target.value)}
              className="w-full bg-[#1A2234] border border-white/10 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors resize-none"
              placeholder="Enter Meerut manufacturing and cargo dispatch center address"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Printed on shipping invoices and dispatch notes.
            </p>
          </div>
        </div>

        {/* Right Preview & Live Impact (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Live Customer Preview Card */}
          <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Live Customer Preview
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">
                Active Logic
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Scenario 1: Order Below Threshold */}
              <div className="p-3.5 rounded-xl bg-[#1A2234] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between font-bold text-stone-300">
                  <span>Cart: ₹{Math.max(1, Math.round(threshold * 0.6))} (Under ₹{threshold})</span>
                  <span className="text-orange-400 font-black">+₹{fee} Fee</span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Customer Pays Delivery:</span>
                  <strong className="text-white">₹{fee}</strong>
                </div>
                <div className="text-[10px] text-stone-500 bg-black/20 p-2 rounded-lg">
                  Cart alert: &ldquo;Add ₹{threshold - Math.round(threshold * 0.6)} more for FREE Delivery&rdquo;
                </div>
              </div>

              {/* Scenario 2: Order At or Above Threshold */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-300">
                  <span>Cart: ₹{threshold}+ (Eligible)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-black text-[10px]">
                    FREE DELIVERY
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200/90 flex items-center justify-between">
                  <span>Customer Pays Delivery:</span>
                  <strong className="text-emerald-400">₹0 (FREE)</strong>
                </div>
                <div className="text-[10px] text-emerald-300/80 bg-emerald-950/30 p-2 rounded-lg">
                  Cart alert: &ldquo;🎉 Yay! You unlocked FREE Fast Delivery!&rdquo;
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] space-y-2 text-[11px] text-stone-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dispatch:</strong> {settings.dispatchHubLocation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>
                  <strong>Timeline:</strong> {settings.estimatedDeliveryDays}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#0e1626] border border-white/[0.08] rounded-2xl p-4 text-xs text-stone-400 space-y-2">
            <span className="font-bold text-white block">Where is this used?</span>
            <ul className="space-y-1.5 text-[11px] list-disc list-inside text-stone-300">
              <li>Cart Drawer progress bar &amp; payable total calculation</li>
              <li>Checkout order summary &amp; final payment amount</li>
              <li>Homepage Trust Strip banner (&ldquo;Free Delivery on ₹{threshold}+&rdquo;)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
