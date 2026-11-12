"use client";

import React, { useState, useEffect } from "react";
import {
  AnnouncementItem,
  AnnouncementsConfig,
  DEFAULT_ANNOUNCEMENTS_CONFIG,
  getStoredAnnouncementsConfig,
  saveStoredAnnouncementsConfig,
} from "@/data/announcements";
import {
  Megaphone,
  Plus,
  Trash2,
  Check,
  Smartphone,
  Laptop,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Tag,
  Award,
  Star,
  ExternalLink,
  Copy,
  Clock,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Sparkles,
} from "lucide-react";

export default function AnnouncementsManager() {
  const [config, setConfig] = useState<AnnouncementsConfig>(DEFAULT_ANNOUNCEMENTS_CONFIG);
  const [savedNotice, setSavedNotice] = useState(false);
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load stored config on mount
  useEffect(() => {
    const loaded = getStoredAnnouncementsConfig();
    setConfig(loaded);
  }, []);

  // Save changes
  const handleSave = (newConfig?: AnnouncementsConfig) => {
    const target = newConfig || config;
    setConfig(target);
    saveStoredAnnouncementsConfig(target);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Toggle master status
  const toggleMaster = () => {
    const updated: AnnouncementsConfig = {
      ...config,
      isEnabled: !config.isEnabled,
    };
    handleSave(updated);
  };

  // Toggle trust badges on desktop
  const toggleTrustBadges = () => {
    const updated: AnnouncementsConfig = {
      ...config,
      desktopShowTrustBadges: !config.desktopShowTrustBadges,
    };
    handleSave(updated);
  };

  // Change speed
  const handleSpeedChange = (speed: number) => {
    const updated: AnnouncementsConfig = {
      ...config,
      autoplaySpeedSeconds: speed,
    };
    handleSave(updated);
  };

  // Toggle individual item active state
  const toggleItemActive = (id: string) => {
    const updatedItems = config.items.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    const updated: AnnouncementsConfig = { ...config, items: updatedItems };
    handleSave(updated);
  };

  // Move item up
  const moveItemUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...config.items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    handleSave({ ...config, items: newItems });
  };

  // Move item down
  const moveItemDown = (index: number) => {
    if (index === config.items.length - 1) return;
    const newItems = [...config.items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    handleSave({ ...config, items: newItems });
  };

  // Delete item
  const deleteItem = (id: string) => {
    if (config.items.length <= 1) {
      alert("At least one announcement item must remain.");
      return;
    }
    const updatedItems = config.items.filter((item) => item.id !== id);
    handleSave({ ...config, items: updatedItems });
  };

  // Open modal to add
  const openAddModal = () => {
    setEditingItem({
      id: `ann-${Date.now()}`,
      icon: "truck",
      text: "",
      badge: "NEW",
      linkUrl: "/products",
      couponCode: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal to edit
  const openEditModal = (item: AnnouncementItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  // Save modal edit
  const saveModalItem = () => {
    if (!editingItem || !editingItem.text.trim()) {
      alert("Please enter announcement text.");
      return;
    }

    const exists = config.items.some((i) => i.id === editingItem.id);
    let updatedItems: AnnouncementItem[];
    if (exists) {
      updatedItems = config.items.map((i) =>
        i.id === editingItem.id ? editingItem : i
      );
    } else {
      updatedItems = [...config.items, editingItem];
    }

    handleSave({ ...config, items: updatedItems });
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm("Reset all announcements to default settings?")) {
      handleSave(DEFAULT_ANNOUNCEMENTS_CONFIG);
    }
  };

  const activeItems = config.items.filter((i) => i.isActive);

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* TOP HEADER & ACTION BAR                                        */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141B29] border border-white/[0.08] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Storefront TopBar &amp; Announcements
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Responsive strategy: <strong className="text-stone-200">Laptop Clean Bar</strong> &bull; <strong className="text-orange-400">Mobile Auto-Swiping</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in">
              <Check className="w-4 h-4" /> Changes Applied Live!
            </span>
          )}

          <button
            type="button"
            onClick={toggleMaster}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              config.isEnabled
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.isEnabled ? "bg-emerald-400" : "bg-red-400"}`} />
            {config.isEnabled ? "TopBar: Active" : "TopBar: Disabled"}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LIVE PREVIEW SECTION (DESKTOP & MOBILE)                        */}
      {/* ============================================================== */}
      <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" /> Live Interactive Preview
          </h3>
          <div className="flex items-center gap-1 bg-[#182030] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setPreviewTab("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewTab === "desktop"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Laptop Clean Bar
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                previewTab === "mobile"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile Fade Carousel
            </button>
          </div>
        </div>

        {/* Desktop Preview Box */}
        {previewTab === "desktop" && (
          <div className="border border-white/10 rounded-xl overflow-hidden bg-black/60 shadow-inner">
            <div className="bg-stone-900/80 px-4 py-2 border-b border-white/[0.06] flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-mono">Desktop Viewport (&ge; 768px) &bull; Clean Static / Rotating Bar</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Distraction-Free
              </span>
            </div>
            <div className="bg-[#141211] text-[#d6d3d1] text-xs font-medium px-6 py-2.5 flex items-center justify-between border-b border-white/[0.08]">
              {/* Left Side */}
              <div className="flex items-center gap-2.5 truncate">
                <Truck className="text-orange-500 w-4 h-4 shrink-0" />
                {activeItems[0]?.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {activeItems[0].badge}
                  </span>
                )}
                <span className="text-stone-200 truncate">
                  {activeItems[0]?.text || "No active announcement"}
                </span>
                {activeItems[0]?.couponCode && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/10 text-orange-300">
                    Code: {activeItems[0].couponCode}
                  </span>
                )}
              </div>

              {/* Right Side */}
              {config.desktopShowTrustBadges && (
                <div className="flex items-center gap-4 text-xs text-stone-400 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="text-orange-500 w-3.5 h-3.5" />
                    <span>100% Genuine Gear</span>
                  </div>
                  <span className="text-stone-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="text-orange-500 w-3.5 h-3.5" />
                    <span>7-Day Returns</span>
                  </div>
                  <span className="text-stone-700">|</span>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="text-orange-500 w-3.5 h-3.5" />
                    <span>Secure COD</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Preview Box */}
        {previewTab === "mobile" && (
          <div className="max-w-xs mx-auto border border-white/10 rounded-2xl overflow-hidden bg-black/60 shadow-2xl p-2">
            <div className="bg-stone-900 px-3 py-1.5 rounded-t-xl border-b border-white/[0.06] flex items-center justify-between text-[10px] text-stone-400">
              <span className="font-mono">Mobile View (Snap Slide Carousel)</span>
              <span className="text-orange-400 font-bold">{config.autoplaySpeedSeconds}s Snap</span>
            </div>
            <div className="bg-[#141211] text-[#d6d3d1] text-[11px] font-medium h-8 px-3 flex items-center justify-center relative overflow-hidden rounded-b-xl border-b border-white/[0.08]">
              <div className="flex items-center justify-center flex-nowrap gap-1.5 text-center whitespace-nowrap overflow-hidden">
                <Flame className="text-orange-500 w-3.5 h-3.5 shrink-0 inline-block" />
                {activeItems[0]?.badge && (
                  <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
                    {activeItems[0].badge}
                  </span>
                )}
                <span className="text-stone-200 text-[11px] font-medium truncate">
                  {activeItems[0]?.text || "Your sports offer goes here"}
                </span>
                {activeItems[0]?.couponCode && (
                  <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-white/10 text-orange-400 shrink-0">
                    {activeItems[0].couponCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* GENERAL CONFIGURATION (SPEED & BADGES)                         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speed Card */}
        <div className="bg-[#141B29] border border-white/[0.08] p-5 rounded-2xl shadow-xl space-y-3">
          <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-400" /> Mobile Auto-Swipe Speed
          </label>
          <div className="flex items-center gap-2">
            {[2.5, 3.5, 5, 6].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleSpeedChange(sec)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  config.autoplaySpeedSeconds === sec
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-[#182030] text-stone-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {sec}s {sec === 3.5 ? "(Optimal)" : ""}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-500">
            Speed with which the mobile top bar smoothly slides to the next announcement item.
          </p>
        </div>

        {/* Laptop Badges Toggle Card */}
        <div className="bg-[#141B29] border border-white/[0.08] p-5 rounded-2xl shadow-xl space-y-3">
          <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-orange-400" /> Laptop Trust Badges
          </label>
          <button
            type="button"
            onClick={toggleTrustBadges}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              config.desktopShowTrustBadges
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-stone-800 text-stone-400 border border-stone-700"
            }`}
          >
            <span>Show Trust Points on Right Side (100% Genuine &bull; 7-Day &bull; COD)</span>
            <span className="font-extrabold">{config.desktopShowTrustBadges ? "ENABLED" : "HIDDEN"}</span>
          </button>
          <p className="text-[11px] text-stone-500">
            Display genuine verified gear, returns &amp; COD trust icons on wide desktop screens.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ANNOUNCEMENT ITEMS LIST                                        */}
      {/* ============================================================== */}
      <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Announcement Slides ({config.items.length})
            </h3>
            <p className="text-xs text-stone-400">
              Each item will rotate smoothly on mobile and cycle into the desktop clean bar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-stone-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>
        </div>

        {/* Items Table / Cards */}
        <div className="space-y-2.5">
          {config.items.map((item, idx) => (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                item.isActive
                  ? "bg-[#182030] border-white/[0.08]"
                  : "bg-stone-900/40 border-stone-800 opacity-60"
              }`}
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Order buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItemUp(idx)}
                    className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === config.items.length - 1}
                    onClick={() => moveItemDown(idx)}
                    className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  {item.icon === "truck" && <Truck className="w-4 h-4" />}
                  {item.icon === "shield" && <ShieldCheck className="w-4 h-4" />}
                  {item.icon === "rotate" && <RotateCcw className="w-4 h-4" />}
                  {item.icon === "card" && <CreditCard className="w-4 h-4" />}
                  {item.icon === "flame" && <Flame className="w-4 h-4" />}
                  {item.icon === "tag" && <Tag className="w-4 h-4" />}
                  {item.icon === "award" && <Award className="w-4 h-4" />}
                  {item.icon === "star" && <Star className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-white truncate">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                    {item.couponCode && (
                      <span className="font-mono text-orange-400 flex items-center gap-1 bg-orange-500/10 px-1.5 py-0.5 rounded">
                        <Copy className="w-3 h-3" /> {item.couponCode}
                      </span>
                    )}
                    {item.linkUrl && (
                      <span className="flex items-center gap-1 hover:text-stone-300">
                        <ExternalLink className="w-3 h-3" /> {item.linkUrl}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-2 mt-3 sm:mt-0 justify-end">
                <button
                  type="button"
                  onClick={() => toggleItemActive(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    item.isActive
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-stone-800 text-stone-500 hover:bg-stone-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Paused"}
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-stone-300 hover:text-white transition-all cursor-pointer"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT ANNOUNCEMENT                                 */}
      {/* ============================================================== */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#141B29] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-orange-400" />
              {config.items.some((i) => i.id === editingItem.id) ? "Edit Announcement" : "Add Announcement"}
            </h3>

            {/* Announcement Text */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Announcement Message *
              </label>
              <input
                type="text"
                value={editingItem.text}
                onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                placeholder="e.g. Free Delivery on Orders Above ₹999"
                className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Badge & Icon Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Highlight Badge (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.badge || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="e.g. OFFER, SALE, VERIFIED"
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Icon
                </label>
                <select
                  value={editingItem.icon}
                  onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value as any })}
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="truck">🚚 Truck / Delivery</option>
                  <option value="flame">🔥 Flame / Hot Offer</option>
                  <option value="shield">🛡️ Shield / Genuine</option>
                  <option value="rotate">🔄 Rotate / Returns</option>
                  <option value="card">💳 Card / Secure Pay</option>
                  <option value="tag">🏷️ Tag / Discount</option>
                  <option value="award">🏆 Award / Sports Pro</option>
                  <option value="star">⭐ Star / Rating</option>
                </select>
              </div>
            </div>

            {/* Coupon Code & Link URL */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.couponCode || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, couponCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. WELCOME10"
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.linkUrl || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, linkUrl: e.target.value })}
                  placeholder="e.g. /products or /sale"
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-stone-400 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveModalItem}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
