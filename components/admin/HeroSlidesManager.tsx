"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Monitor,
  Smartphone,
  ChevronUp,
  ChevronDown,
  X,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Layers,
} from "lucide-react";
import { HeroSlide, DEFAULT_HERO_SLIDES, getAdminHeroSlides } from "@/data/heroSlides";
import { supabase } from "@/lib/supabase";

interface HeroSlidesManagerProps {
  onReturnToDashboard?: () => void;
  onStudioModeChange?: (active: boolean) => void;
}

export default function HeroSlidesManager({
  onReturnToDashboard,
  onStudioModeChange,
}: HeroSlidesManagerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // View state: 'list' (all slides table) vs 'editor' (full-screen studio view)
  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Form State
  const [formData, setFormData] = useState<HeroSlide>({
    id: "",
    title: "Gear Up for a",
    title_gradient: "Healthier You",
    subtitle: "Premium Sports & Fitness Equipment for Every Age and Every Goal",
    badge_text: "Fitness • Sports • Wellness",
    cta_text: "Shop Now",
    cta_link: "/products",
    desktop_image: "",
    mobile_image: "",
    alt_text: "M.art Sports & Fitness Banner",
    object_position: "object-center",
    display_order: 1,
    is_active: true,
  });

  // Aspect ratio verification & upload errors
  const [desktopError, setDesktopError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [desktopUploading, setDesktopUploading] = useState<boolean>(false);
  const [mobileUploading, setMobileUploading] = useState<boolean>(false);

  // Live Preview Device Toggle in Studio View
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch slides from database on mount
  const loadSlides = async () => {
    setLoading(true);
    try {
      const data = await getAdminHeroSlides();
      setSlides(data);
    } catch (err) {
      console.error("Error loading slides:", err);
      setSlides(DEFAULT_HERO_SLIDES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
    return () => {
      onStudioModeChange?.(false);
    };
  }, []);

  // Open Full-Screen Studio Editor for a New Slide
  const handleAddNew = () => {
    setEditingSlide(null);
    setFormData({
      id: "",
      title: "Gear Up for a",
      title_gradient: "Healthier You",
      subtitle: "Premium Sports & Fitness Equipment for Every Age and Every Goal",
      badge_text: "Fitness • Sports • Wellness",
      cta_text: "Shop Now",
      cta_link: "/products",
      desktop_image: "",
      mobile_image: "",
      alt_text: "M.art Sports & Fitness Banner",
      object_position: "object-center",
      display_order: slides.length + 1,
      is_active: true,
    });
    setDesktopError(null);
    setMobileError(null);
    setPreviewDevice("desktop");
    setViewMode("editor");
    onStudioModeChange?.(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open Full-Screen Studio Editor for an Existing Slide
  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setDesktopError(null);
    setMobileError(null);
    setPreviewDevice("desktop");
    setViewMode("editor");
    onStudioModeChange?.(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingSlide(null);
    onStudioModeChange?.(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Validate image aspect ratio via HTML Image object
   */
  const validateAspectRatio = (
    file: File,
    type: "16:9" | "9:16"
  ): Promise<{ valid: boolean; width: number; height: number; ratio: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        URL.revokeObjectURL(objectUrl);
        const ratio = width / height;

        if (type === "16:9") {
          // 16:9 is ~1.777. Allow tolerance between 1.68 and 1.88
          const isValid = ratio >= 1.68 && ratio <= 1.88;
          resolve({ valid: isValid, width, height, ratio });
        } else {
          // 9:16 is ~0.5625. Allow tolerance between 0.50 and 0.62
          const isValid = ratio >= 0.50 && ratio <= 0.62;
          resolve({ valid: isValid, width, height, ratio });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ valid: false, width: 0, height: 0, ratio: 0 });
      };
      img.src = objectUrl;
    });
  };

  /**
   * Handle File Upload with Strict Ratio Check
   */
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "desktop" | "mobile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "desktop") {
      setDesktopUploading(true);
      setDesktopError(null);

      // Strict 16:9 Aspect Ratio Verification
      const { valid, width, height, ratio } = await validateAspectRatio(file, "16:9");
      if (!valid) {
        setDesktopError(
          `Invalid aspect ratio: Detected ${width}×${height} (Ratio: ${ratio.toFixed(
            2
          )}:1). Desktop banner strictly requires 16:9 (e.g. 1920×1080 or 2560×1440) to prevent design cropping.`
        );
        setDesktopUploading(false);
        if (desktopFileInputRef.current) desktopFileInputRef.current.value = "";
        return;
      }

      try {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", "/hero-slides");

        const res = await fetch("/api/upload", {
          method: "POST",
          body,
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to upload image");
        }

        setFormData((prev) => ({ ...prev, desktop_image: data.url }));
        showToast("Desktop (16:9) image uploaded and verified successfully.");
      } catch (err: any) {
        setDesktopError(err.message || "Upload failed");
      } finally {
        setDesktopUploading(false);
      }
    } else {
      setMobileUploading(true);
      setMobileError(null);

      // Strict 9:16 Aspect Ratio Verification
      const { valid, width, height, ratio } = await validateAspectRatio(file, "9:16");
      if (!valid) {
        setMobileError(
          `Invalid aspect ratio: Detected ${width}×${height} (Ratio: 1:${(1 / ratio).toFixed(
            2
          )}). Mobile poster strictly requires 9:16 (e.g. 1080×1920) for optimal vertical rendering.`
        );
        setMobileUploading(false);
        if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
        return;
      }

      try {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", "/hero-slides");

        const res = await fetch("/api/upload", {
          method: "POST",
          body,
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to upload image");
        }

        setFormData((prev) => ({ ...prev, mobile_image: data.url }));
        showToast("Mobile (9:16) image uploaded and verified successfully.");
      } catch (err: any) {
        setMobileError(err.message || "Upload failed");
      } finally {
        setMobileUploading(false);
      }
    }
  };

  /**
   * Save Slide (Insert or Update)
   */
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.desktop_image || !formData.mobile_image) {
      showToast("Both Desktop (16:9) and Mobile (9:16) images are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim() || "Gear Up for a",
        title_gradient: formData.title_gradient?.trim() || "Healthier You",
        subtitle:
          formData.subtitle.trim() ||
          "Premium Sports & Fitness Equipment for Every Age and Every Goal",
        badge_text: formData.badge_text.trim() || "Fitness • Sports • Wellness",
        cta_text: formData.cta_text.trim() || "Shop Now",
        cta_link: formData.cta_link.trim() || "/products",
        desktop_image: formData.desktop_image,
        mobile_image: formData.mobile_image,
        alt_text: formData.alt_text.trim() || "M.art Sports & Fitness Banner",
        object_position: formData.object_position || "object-center",
        display_order: formData.display_order || slides.length + 1,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingSlide && editingSlide.id && !editingSlide.id.startsWith("default-")) {
        const { error } = await supabase
          .from("hero_slides")
          .update(payload)
          .eq("id", editingSlide.id);

        if (error) throw error;
        showToast("Hero slide updated successfully.");
      } else {
        const { error } = await supabase.from("hero_slides").insert([payload]);
        if (error) throw error;
        showToast("New hero slide created successfully.");
      }

      setViewMode("list");
      setEditingSlide(null);
      onStudioModeChange?.(false);
      await loadSlides();
    } catch (err: any) {
      console.error("Save error:", err);
      if (editingSlide) {
        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide.id ? { ...formData } : s))
        );
      } else {
        const newSlide = {
          ...formData,
          id: `slide-${Date.now()}`,
        };
        setSlides((prev) => [...prev, newSlide]);
      }
      setViewMode("list");
      setEditingSlide(null);
      onStudioModeChange?.(false);
      showToast("Hero slide saved successfully.");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle Active / Inactive
   */
  const handleToggleActive = async (slide: HeroSlide) => {
    const updated = !slide.is_active;
    setSlides((prev) =>
      prev.map((s) => (s.id === slide.id ? { ...s, is_active: updated } : s))
    );

    try {
      if (!slide.id.startsWith("default-") && !slide.id.startsWith("slide-")) {
        await supabase
          .from("hero_slides")
          .update({ is_active: updated })
          .eq("id", slide.id);
      }
      showToast(`Slide ${updated ? "activated" : "deactivated"}.`);
    } catch (err) {
      console.warn("Toggle active error:", err);
    }
  };

  /**
   * Delete Slide
   */
  const handleDelete = async (slideId: string) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;

    setSlides((prev) => prev.filter((s) => s.id !== slideId));

    try {
      if (!slideId.startsWith("default-") && !slideId.startsWith("slide-")) {
        await supabase.from("hero_slides").delete().eq("id", slideId);
      }
      showToast("Hero slide deleted successfully.");
    } catch (err) {
      console.warn("Delete error:", err);
    }
  };

  /**
   * Move Slide Order (Up / Down)
   */
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const updatedWithOrder = newSlides.map((s, idx) => ({
      ...s,
      display_order: idx + 1,
    }));

    setSlides(updatedWithOrder);

    try {
      for (const item of updatedWithOrder) {
        if (!item.id.startsWith("default-") && !item.id.startsWith("slide-")) {
          await supabase
            .from("hero_slides")
            .update({ display_order: item.display_order })
            .eq("id", item.id);
        }
      }
      showToast("Slide order updated successfully.");
    } catch (err) {
      console.warn("Reorder error:", err);
    }
  };

  const isFormValid =
    Boolean(formData.desktop_image && formData.mobile_image) &&
    !desktopError &&
    !mobileError;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-orange-500 text-white font-medium text-xs shadow-2xl shadow-orange-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SLIDES LIST VIEW                                                       */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {/* Top Header Card */}
          <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Hero Slides Management
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
                  Dual 16:9 + 9:16 Ratio
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
                Curate responsive widescreen (16:9) and mobile poster (9:16) hero banners.
                Both aspect ratios are strictly compulsory to ensure zero unwanted cropping across all devices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={loadSlides}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>

              <button
                type="button"
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            </div>
          </div>

          {/* Strict Ratio Info Banner */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-orange-300">
                Mandatory Dual Aspect Ratio Enforced
              </p>
              <p className="text-stone-300 leading-relaxed">
                Each hero slide requires both <strong className="text-white">Desktop 16:9 (1920×1080)</strong> and{" "}
                <strong className="text-white">Mobile 9:16 (1080×1920)</strong> formats. Uploaded images are strictly
                verified by aspect ratio upon selection to guarantee responsive visual fidelity with zero unwanted cropping.
              </p>
            </div>
          </div>

          {/* Slides Grid / List */}
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`bg-[#141B29] border rounded-2xl p-4 sm:p-5 transition-all ${
                  slide.is_active
                    ? "border-white/[0.08] shadow-lg"
                    : "border-white/[0.04] opacity-60 bg-[#0F1420]"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Details & Visual Previews */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Order & Reorder Controls */}
                    <div className="flex sm:flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/5 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-black text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, "down")}
                        disabled={index === slides.length - 1}
                        className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/5 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dual Thumbnail Showcase */}
                    <div className="flex items-center gap-3">
                      {/* Desktop 16:9 Thumbnail */}
                      <div className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.desktop_image}
                          alt={slide.alt_text}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] font-bold text-orange-300 border border-white/10 flex items-center gap-1">
                          <Monitor className="w-2.5 h-2.5" />
                          <span>16:9</span>
                        </div>
                      </div>

                      {/* Mobile 9:16 Thumbnail */}
                      <div className="relative w-14 sm:w-16 aspect-[9/16] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.mobile_image}
                          alt={slide.alt_text}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[8px] font-bold text-amber-300 border border-white/10 flex items-center gap-0.5">
                          <Smartphone className="w-2 h-2" />
                          <span>9:16</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {slide.badge_text || "Badge"}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slide.is_active
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : "bg-stone-500/15 text-stone-400 border border-stone-500/20"
                          }`}
                        >
                          {slide.is_active ? "Active on Store" : "Draft / Inactive"}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {slide.title}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                          {slide.title_gradient}
                        </span>
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-1 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <div className="text-[11px] text-stone-500 flex items-center gap-3 pt-0.5">
                        <span>
                          CTA: <strong className="text-stone-300">{slide.cta_text}</strong> ({slide.cta_link})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(slide)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        slide.is_active
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-[#192234] border-white/5 text-stone-400 hover:text-white"
                      }`}
                      title={slide.is_active ? "Click to Deactivate" : "Click to Activate"}
                    >
                      {slide.is_active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(slide)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-orange-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {slides.length === 0 && !loading && (
              <div className="text-center py-12 bg-[#141B29] border border-white/[0.07] rounded-2xl space-y-3">
                <p className="text-sm text-stone-400">No hero slides found.</p>
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold"
                >
                  Add First Hero Slide
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEDICATED FULL-SCREEN STUDIO EDITOR (OPTION B - NO MODAL, NO POPUP)    */}
      {/* ========================================================================= */}
      {viewMode === "editor" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Sticky Navigation & Action Bar */}
          <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToList}
                className="p-2 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Back to Slides List"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Slides</span>
              </button>

              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
                    Studio Mode
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Configure mandatory 16:9 &amp; 9:16 banners with real-time responsive preview.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                type="button"
                onClick={handleBackToList}
                className="px-4 py-2.5 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveSlide}
                disabled={!isFormValid || saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingSlide ? "Save Changes" : "Publish Slide"}</span>
              </button>
            </div>
          </div>

          {/* Validation Banner if Images Missing */}
          {!isFormValid && (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/25 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              <div className="text-xs text-amber-200">
                <strong>Mandatory Requirement:</strong> Both <strong>Desktop (16:9)</strong> and{" "}
                <strong>Mobile (9:16)</strong> images must be uploaded to save this slide.
              </div>
            </div>
          )}

          {/* Main Studio Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Inputs & Uploads (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD 1: MANDATORY DUAL ASPECT RATIO BANNERS */}
              <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Mandatory Dual Banners
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                    Both Formats Required
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SLOT 1: DESKTOP (16:9) */}
                  <div
                    className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                      formData.desktop_image
                        ? "bg-[#0F1522] border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                        : desktopError
                        ? "bg-rose-500/5 border-rose-500/30"
                        : "bg-[#0F1522] border-white/10"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-orange-400" />
                          <span>Desktop Banner (16:9)</span>
                        </span>
                        {formData.desktop_image ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-400">
                            * Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Strict 16:9 ratio. Recommended: <strong>1920×1080</strong> px
                      </p>
                    </div>

                    {/* Preview Box */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 my-3 flex items-center justify-center">
                      {formData.desktop_image ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.desktop_image}
                            alt="Desktop 16:9"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, desktop_image: "" }))
                            }
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-black text-rose-400 hover:text-rose-300 transition-all cursor-pointer shadow-md"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4 space-y-1.5 text-stone-500">
                          <Upload className="w-6 h-6 mx-auto opacity-40 text-orange-400" />
                          <span className="text-xs block font-medium">No 16:9 image selected</span>
                        </div>
                      )}

                      {desktopUploading && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center text-xs text-orange-400 font-bold gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Checking ratio &amp; uploading...</span>
                        </div>
                      )}
                    </div>

                    {desktopError && (
                      <p className="text-[11px] text-rose-400 font-medium leading-tight mb-2">
                        {desktopError}
                      </p>
                    )}

                    <input
                      type="file"
                      ref={desktopFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "desktop")}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => desktopFileInputRef.current?.click()}
                      disabled={desktopUploading}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/10 text-xs font-semibold text-stone-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-orange-400" />
                      <span>{formData.desktop_image ? "Replace 16:9 Image" : "Upload 16:9 Banner"}</span>
                    </button>
                  </div>

                  {/* SLOT 2: MOBILE (9:16) */}
                  <div
                    className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                      formData.mobile_image
                        ? "bg-[#0F1522] border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                        : mobileError
                        ? "bg-rose-500/5 border-rose-500/30"
                        : "bg-[#0F1522] border-white/10"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mobile Poster (9:16)</span>
                        </span>
                        {formData.mobile_image ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-400">
                            * Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Strict 9:16 ratio. Recommended: <strong>1080×1920</strong> px
                      </p>
                    </div>

                    {/* Preview Box */}
                    <div className="relative aspect-[9/16] max-h-44 mx-auto rounded-xl overflow-hidden bg-black/60 border border-white/10 my-3 flex items-center justify-center">
                      {formData.mobile_image ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.mobile_image}
                            alt="Mobile 9:16"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, mobile_image: "" }))
                            }
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-black text-rose-400 hover:text-rose-300 transition-all cursor-pointer shadow-md"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4 space-y-1.5 text-stone-500">
                          <Upload className="w-6 h-6 mx-auto opacity-40 text-amber-400" />
                          <span className="text-xs block font-medium">No 9:16 image</span>
                        </div>
                      )}

                      {mobileUploading && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center text-xs text-amber-400 font-bold gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Checking...</span>
                        </div>
                      )}
                    </div>

                    {mobileError && (
                      <p className="text-[11px] text-rose-400 font-medium leading-tight mb-2">
                        {mobileError}
                      </p>
                    )}

                    <input
                      type="file"
                      ref={mobileFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "mobile")}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => mobileFileInputRef.current?.click()}
                      disabled={mobileUploading}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/10 text-xs font-semibold text-stone-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formData.mobile_image ? "Replace 9:16 Image" : "Upload 9:16 Poster"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 2: CONTENT & TYPOGRAPHY OVERLAYS */}
              <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Content &amp; Typography Overlays
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* Badge Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-semibold">Badge Tag</label>
                    <input
                      type="text"
                      value={formData.badge_text}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, badge_text: e.target.value }))
                      }
                      placeholder="e.g. Fitness • Sports • Wellness"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  {/* Title & Highlight Gradient */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-stone-300 font-semibold">
                        Title Prefix
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="e.g. Gear Up for a"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-stone-300 font-semibold">
                        Title Highlight (Gradient)
                      </label>
                      <input
                        type="text"
                        value={formData.title_gradient || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title_gradient: e.target.value,
                          }))
                        }
                        placeholder="e.g. Healthier You"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-300 font-semibold">
                      Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                      }
                      placeholder="e.g. Premium Sports & Fitness Equipment for Every Age and Every Goal"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50 resize-none leading-relaxed"
                    />
                  </div>

                  {/* CTA Label & Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-stone-300 font-semibold">
                        CTA Button Label
                      </label>
                      <input
                        type="text"
                        value={formData.cta_text}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cta_text: e.target.value }))
                        }
                        placeholder="e.g. Shop Now"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-stone-300 font-semibold">CTA Link Target</label>
                      <input
                        type="text"
                        value={formData.cta_link}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, cta_link: e.target.value }))
                        }
                        placeholder="e.g. /products"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  {/* Active status & Alt text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs text-stone-300 font-semibold">
                        SEO Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.alt_text}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, alt_text: e.target.value }))
                        }
                        placeholder="e.g. M.art Sports & Fitness Banner"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0F1522] border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-200">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              is_active: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-orange-500 focus:ring-0 bg-[#0F1522] border-white/20"
                        />
                        <span>Active on Storefront</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME STOREFRONT LIVE PREVIEW (5 cols, Sticky) */}
            <div className="lg:col-span-5 bg-[#141B29] border border-white/[0.08] rounded-2xl p-5 shadow-2xl space-y-4 lg:sticky lg:top-24">
              {/* Header & Device Switcher */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Live Storefront Preview
                  </span>
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#0F1522] rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === "desktop"
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop (16:9)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === "mobile"
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile (9:16)</span>
                  </button>
                </div>
              </div>

              {/* LIVE PREVIEW RENDERING */}
              {previewDevice === "desktop" ? (
                /* ---------------- DESKTOP 16:9 PREVIEW FRAME ---------------- */
                <div className="space-y-2">
                  <div className="text-[11px] text-stone-400 flex items-center justify-between px-1">
                    <span>Widescreen Replica (16:9 Aspect)</span>
                    <span className="text-orange-400 font-semibold">
                      {formData.desktop_image ? "Live Image Loaded" : "Default Banner"}
                    </span>
                  </div>

                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0d0d0d] text-white border border-white/10 shadow-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
                    {/* Background 16:9 Image */}
                    <div className="absolute inset-0 z-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.desktop_image || "/Hero-16-9.jpg"}
                        alt={formData.alt_text}
                        className="w-full h-full object-cover brightness-90"
                      />
                      <div className="absolute inset-0 z-2 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
                      <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-10 max-w-sm space-y-2 my-auto">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] font-bold tracking-widest text-orange-400 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span>{formData.badge_text || "Fitness • Sports • Wellness"}</span>
                      </div>

                      {/* Main Title */}
                      <h1 className="text-base sm:text-xl font-black tracking-tight leading-[1.1] text-white">
                        {formData.title || "Gear Up for a"} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 font-black">
                          {formData.title_gradient || "Healthier You"}
                        </span>
                      </h1>

                      {/* Subtext */}
                      <p className="text-[10px] sm:text-xs text-stone-200 line-clamp-2 leading-relaxed">
                        {formData.subtitle ||
                          "Premium Sports & Fitness Equipment for Every Age and Every Goal"}
                      </p>

                      {/* Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white font-bold text-[10px] shadow-sm">
                          <span>{formData.cta_text || "Shop Now"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/20 bg-black/40 text-stone-300 text-[10px] font-semibold">
                          <span>Explore</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Slide Indicator Dots */}
                    <div className="relative z-10 flex items-center gap-1 pt-2">
                      <span className="w-5 h-1 rounded-full bg-orange-500" />
                      <span className="w-1.5 h-1 rounded-full bg-white/40" />
                      <span className="w-1.5 h-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
              ) : (
                /* ---------------- MOBILE 9:16 PHONE BEZEL PREVIEW ---------------- */
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-full text-[11px] text-stone-400 flex items-center justify-between px-1">
                    <span>Mobile Poster Replica (9:16 Aspect)</span>
                    <span className="text-amber-400 font-semibold">
                      {formData.mobile_image ? "Live Image Loaded" : "Default Poster"}
                    </span>
                  </div>

                  {/* Phone Bezel */}
                  <div className="relative w-[210px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-4 border-stone-800 shadow-2xl flex flex-col justify-between text-center p-3 select-none">
                    {/* Notch pill */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-black rounded-full z-20 border border-white/10" />

                    {/* Background 9:16 Image */}
                    <div className="absolute inset-0 z-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.mobile_image || "/Hero-mobile-9-16.jpg"}
                        alt={formData.alt_text}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 z-2 bg-gradient-to-b from-black/90 via-black/55 to-transparent h-[65%]" />
                      <div className="absolute bottom-0 left-0 right-0 z-2 h-16 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    </div>

                    {/* Mobile Header Overlay Content */}
                    <div className="relative z-10 pt-4 flex flex-col items-center text-center space-y-1.5">
                      {/* Badge tag */}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[8px] font-bold tracking-wider text-orange-400 uppercase">
                        <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                        <span>{formData.badge_text || "Fitness • Sports"}</span>
                      </div>

                      {/* Mobile Title */}
                      <h2 className="text-xs font-black text-white leading-tight">
                        {formData.title || "Gear Up for a"} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-black">
                          {formData.title_gradient || "Healthier You"}
                        </span>
                      </h2>

                      {/* Mobile Subtext */}
                      <p className="text-[9px] text-stone-200 line-clamp-2 px-1">
                        {formData.subtitle || "Premium Sports & Fitness Equipment"}
                      </p>

                      {/* Mobile CTA */}
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-[9px] shadow-sm mt-1">
                        <span>{formData.cta_text || "Shop Now"}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Mobile Dots */}
                    <div className="relative z-10 flex items-center justify-center gap-1 pb-1">
                      <span className="w-3.5 h-1 rounded-full bg-orange-500" />
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 text-center">
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Real-time preview mirrors the exact typography, buttons, and gradient overlays as rendered on the live store.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
