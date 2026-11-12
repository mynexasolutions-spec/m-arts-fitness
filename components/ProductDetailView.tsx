"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ALL_PRODUCTS,
  ProductDetailItem,
  ProductHighlight,
  ProductIdealFor,
} from "@/data/products";
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
  CreditCardIcon,
  XIcon,
} from "./Icons";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { ReviewItem, DEFAULT_REVIEWS } from "@/data/reviews";
import { Camera, Lock, Maximize2, X as LucideX, Sparkles, Clock, CheckCircle2 } from "lucide-react";

function renderHighlightIcon(icon: ProductHighlight["icon"]) {
  const cls = "w-5 h-5 sm:w-6 sm:h-6 text-orange-600";
  switch (icon) {
    case "strength":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5 17.5 17.5" />
          <path d="M3 10l7-7" />
          <path d="M14 21l7-7" />
          <path d="m2 6 4-4" />
          <path d="m18 22 4-4" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
      );
    case "flame":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
        </svg>
      );
    case "scale":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="3" />
          <path d="M12 7v5l3 3" />
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
    case "layers":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      );
    case "grip":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
          <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      );
    case "droplet":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      );
    case "feather":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
          <path d="M16 8 2 22" />
          <path d="M17.5 15H9" />
        </svg>
      );
    case "eye":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "grid":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      );
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "award":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "shield":
    default:
      return <ShieldCheckIcon className={cls} />;
  }
}

function renderIdealForIcon(icon: ProductIdealFor["icon"]) {
  const cls = "w-6 h-6 text-orange-600";
  switch (icon) {
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "dumbbell":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6.5 6.5 11 11" />
          <path d="m21 21-1-1" />
          <path d="m3 3 1 1" />
          <path d="m18 22 4-4" />
          <path d="m2 6 4-4" />
          <path d="m3 10 7-7" />
          <path d="m14 21 7-7" />
        </svg>
      );
    case "yoga":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <path d="M7 20h10" />
          <path d="m9 16 3-6 3 6" />
          <path d="m6 12 6-2 6 2" />
        </svg>
      );
    case "scale":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="3" />
          <path d="M8 7h8" />
          <path d="M12 7v4" />
        </svg>
      );
    case "football":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 7 16 10 14.5 15 9.5 15 8 10 12 7" />
        </svg>
      );
    case "agility":
    case "speed":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "school":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "cardio":
    case "core":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
        </svg>
      );
    case "rehab":
    case "outdoor":
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
  }
}

export default function ProductDetailView({
  product: initialProduct,
}: {
  product: ProductDetailItem;
}) {
  const [product, setProduct] = useState<ProductDetailItem>(initialProduct);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    if (initialProduct.variantGroups && initialProduct.variantGroups.length > 0) {
      initialProduct.variantGroups.forEach((g) => {
        if (g.values && g.values[0]) {
          init[g.name] = g.values[0];
        }
      });
    }
    return init;
  });

  const [selectedOption, setSelectedOption] = useState(() => {
    if (initialProduct.variantGroups && initialProduct.variantGroups.length > 0) {
      const vals = initialProduct.variantGroups.map((g) => g.values[0]).filter(Boolean);
      return vals.join(" / ");
    }
    return initialProduct.options?.[0] || "";
  });

  // Detect currently selected Color/Finish value
  const activeColorValue = useMemo(() => {
    for (const [key, val] of Object.entries(selectedVariants)) {
      const lower = key.toLowerCase();
      if (
        lower.includes("color") ||
        lower.includes("finish") ||
        lower.includes("edition") ||
        lower.includes("shade")
      ) {
        return val;
      }
    }
    if (product.galleryMetadata) {
      const assignedColors = Object.values(product.galleryMetadata)
        .map((m) => m?.color?.trim().toLowerCase())
        .filter(Boolean);
      for (const val of Object.values(selectedVariants)) {
        if (assignedColors.includes(val.trim().toLowerCase())) {
          return val;
        }
      }
    }
    return selectedOption || "";
  }, [selectedVariants, product.galleryMetadata, selectedOption]);

  // Compute active gallery based on selected color (shows selected color's photo + info photos)
  const activeGallery = useMemo(() => {
    if (!product.gallery || product.gallery.length === 0) {
      return product.image ? [product.image] : [];
    }

    if (!activeColorValue || !product.galleryMetadata) {
      return product.gallery;
    }

    const activeColorLower = activeColorValue.trim().toLowerCase();

    const hasAnyColorAssigned = product.gallery.some((url) => {
      const c = product.galleryMetadata?.[url]?.color;
      return Boolean(c && c.trim());
    });

    if (!hasAnyColorAssigned) {
      return product.gallery;
    }

    // Keep images that match the active color, OR general images without any assigned color
    const filtered = product.gallery.filter((url) => {
      const assignedColor = product.galleryMetadata?.[url]?.color;
      if (!assignedColor || !assignedColor.trim()) {
        return true; // General info / infographic image
      }
      const c = assignedColor.trim().toLowerCase();
      return (
        c === activeColorLower ||
        c.includes(activeColorLower) ||
        activeColorLower.includes(c)
      );
    });

    return filtered.length > 0 ? filtered : product.gallery;
  }, [product.gallery, product.galleryMetadata, product.image, activeColorValue]);

  // Auto-switch to first photo of active color when color selection changes
  useEffect(() => {
    setSelectedImageIdx(0);
  }, [activeColorValue]);

  const handleSelectVariantGroup = (groupName: string, value: string) => {
    const updated = { ...selectedVariants, [groupName]: value };
    setSelectedVariants(updated);
    const combined = Object.values(updated).filter(Boolean).join(" / ");
    setSelectedOption(combined);

    // Auto-switch gallery photo if an image is mapped to this variant/color
    if (product.gallery && product.galleryMetadata) {
      const targetIdx = product.gallery.findIndex((imgUrl) => {
        const meta = product.galleryMetadata?.[imgUrl];
        if (!meta?.color) return false;
        const metaColor = meta.color.trim().toLowerCase();
        const selectedVal = value.trim().toLowerCase();
        return (
          metaColor === selectedVal ||
          metaColor.includes(selectedVal) ||
          selectedVal.includes(metaColor)
        );
      });
      if (targetIdx !== -1) {
        setSelectedImageIdx(targetIdx);
      }
    }
  };

  // Sync client-side admin edits from localStorage (Static Mode)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mart_admin_products");
      if (stored) {
        const parsed: ProductDetailItem[] = JSON.parse(stored);
        const match = parsed.find((p) => p.id === initialProduct.id);
        if (match) {
          setProduct(match);
          if (match.variantGroups && match.variantGroups.length > 0) {
            const initialMap: Record<string, string> = {};
            match.variantGroups.forEach((g) => {
              if (g.values && g.values[0]) {
                initialMap[g.name] = g.values[0];
              }
            });
            setSelectedVariants(initialMap);
            setSelectedOption(Object.values(initialMap).filter(Boolean).join(" / "));
          } else if (match.options && match.options.length > 0) {
            setSelectedOption((prev) =>
              match.options!.includes(prev) ? prev : match.options![0]
            );
          }
        }
      }
    } catch (e) {
      console.warn("Could not sync local product:", e);
    }
  }, [initialProduct.id]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, getProductCartCount } =
    useStore();
  const { user, openLoginModal, openSignUpModal } = useAuth();
  const wishlisted = isInWishlist(product.id);
  const addedCount = getProductCartCount(product.id);

  // Touch Swipe Refs for Image Gallery
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setSelectedImageIdx((prev) =>
          prev > 0 ? prev - 1 : activeGallery.length - 1
        );
      }
      if (e.key === "ArrowRight") {
        setSelectedImageIdx((prev) =>
          prev < activeGallery.length - 1 ? prev + 1 : 0
        );
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, activeGallery.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40 && activeGallery.length > 1) {
      handleNextImage();
    } else if (diff < -40 && activeGallery.length > 1) {
      handlePrevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Customer Reviews State
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewToast, setReviewToast] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [modalStarFilter, setModalStarFilter] = useState<string>("all");
  const [activePhotoLightbox, setActivePhotoLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dbReviews, setDbReviews] = useState<ReviewItem[]>([]);

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.reviews)) {
        setDbReviews(data.reviews);
      }
    } catch (err) {
      console.warn("Could not load reviews from API:", err);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Auto-fill reviewName when user logs in
  useEffect(() => {
    if (user && !reviewName) {
      setReviewName(
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        ""
      );
    }
  }, [user, reviewName]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a photo under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setReviewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }
    if (!reviewName.trim() || !reviewComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          userName: reviewName.trim(),
          userEmail: user.email,
          userId: user.id,
          rating: reviewRating,
          comment: reviewComment.trim(),
          photoUrl: reviewPhoto || undefined,
        }),
      });
      const data = await res.json();
      if (data && data.success && data.review) {
        // Awaits admin approval before appearing in public reviews
        setReviewComment("");
        setReviewPhoto(null);
        setReviewRating(5);
        setReviewSubmitted(true);
        setReviewToast({
          title: "Review Submitted!",
          message: "Thank you! Your review has been submitted and is waiting for admin approval.",
        });
        setTimeout(() => setReviewSubmitted(false), 5000);
        setTimeout(() => setReviewToast(null), 6000);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Combine with fallback default reviews if none in db
  const allReviews: ReviewItem[] = dbReviews.length > 0
    ? dbReviews
    : DEFAULT_REVIEWS.filter((r) => r.productId === product.id || r.productId === "wooden-dumbbells");

  const filteredModalReviews = useMemo(() => {
    if (modalStarFilter === "all") return allReviews;
    if (modalStarFilter === "photo") return allReviews.filter((r) => !!r.photoUrl);
    const starNum = Number(modalStarFilter);
    return allReviews.filter((r) => r.rating === starNum);
  }, [allReviews, modalStarFilter]);
  const visibleReviews = showAllReviews ? allReviews : allReviews.slice(0, 2);



  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedOption, false);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedOption, false);
    router.push("/checkout");
  };

  const handlePrevImage = () => {
    setSelectedImageIdx((prev) =>
      prev > 0 ? prev - 1 : activeGallery.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIdx((prev) =>
      prev < activeGallery.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#fffaf7]/70 via-white to-[#fffaf7]/50">
      {/* ========================================================= */}
      {/* 1. BREADCRUMB & QUICK NAVIGATION BAR                      */}
      {/* ========================================================= */}
      <div className="border-b border-stone-200/80 bg-white/80 backdrop-blur-xs">
        <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-stone-500">
          <nav className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <span className="text-stone-300">/</span>
            <Link
              href="/products"
              className="hover:text-orange-600 transition-colors"
            >
              Shop Gear
            </Link>
            <span className="text-stone-300">/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-orange-600 transition-colors"
            >
              {product.categoryLabel}
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-stone-900 font-bold truncate max-w-[180px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold text-xs"
          >
            <span>Back to All Gear</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HERO PRODUCT BUY-BOX (Gallery + Info & Highlights)     */}
      {/* ========================================================= */}
      <section className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10 pt-6 sm:pt-9 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 xl:gap-12 items-start">
          {/* LEFT: INTERACTIVE PRODUCT IMAGE GALLERY (Balanced 6 cols on lg & xl, Natural Scroll) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="group relative w-full aspect-square rounded-2xl sm:rounded-3xl bg-[#f7f7f6] border border-stone-200/90 overflow-hidden shadow-sm"
            >
              {/* Main Selected Image (Click to Expand Fullscreen) */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Click to view full screen image"
                className="relative w-full h-full block cursor-zoom-in focus:outline-none"
              >
                <Image
                  src={activeGallery[selectedImageIdx] || activeGallery[0] || product.image}
                  alt={`${product.name} - View ${selectedImageIdx + 1}`}
                  fill
                  priority
                  className="object-contain p-1 sm:p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </button>

              {/* Subtle Bottom-Right "Click to Expand" Hint Pill */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/75 hover:bg-stone-950 text-white text-[11px] font-bold backdrop-blur-xs shadow-sm transition-all cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5 text-orange-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" x2="14" y1="3" y2="10" />
                  <line x1="3" x2="10" y1="21" y2="14" />
                </svg>
                <span>Click to Expand</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {activeGallery.length > 1 && (
              <div className="mt-3.5 flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1">
                {activeGallery.map((imgUrl, idx) => {
                  const isActive = selectedImageIdx === idx;
                  return (
                    <button
                      type="button"
                      key={imgUrl + idx}
                      onClick={() => {
                        setSelectedImageIdx(idx);
                        const assignedColor = product.galleryMetadata?.[imgUrl]?.color;
                        if (assignedColor && product.variantGroups) {
                          for (const grp of product.variantGroups) {
                            const matchVal = grp.values.find((v) => {
                              const a = v.trim().toLowerCase();
                              const b = assignedColor.trim().toLowerCase();
                              return a === b || a.includes(b) || b.includes(a);
                            });
                            if (matchVal && selectedVariants[grp.name] !== matchVal) {
                              handleSelectVariantGroup(grp.name, matchVal);
                              break;
                            }
                          }
                        }
                      }}
                      className={`relative w-18 h-18 sm:w-22 sm:h-22 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-[#f7f7f6] ${
                        isActive
                          ? "border-orange-500 ring-2 ring-orange-500/25 scale-102"
                          : "border-stone-200/90 opacity-75 hover:opacity-100 hover:border-orange-300"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* 4-Pillar Highlights Strip (Desktop View: directly below thumbnails to balance layout) */}
            {(product.highlights || []).length > 0 && (
              <div className="hidden lg:grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6">
                {(product.highlights || []).map((hl, idx) => (
                  <div
                    key={`${hl.title}-${idx}`}
                    className="bg-[#fff7f2] border border-orange-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:border-orange-400 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-full bg-orange-100/90 border border-orange-200 flex items-center justify-center mb-2 shrink-0">
                      {renderHighlightIcon(hl.icon)}
                    </div>
                    <h4 className="text-xs sm:text-[13px] font-extrabold text-stone-900 leading-snug">
                      {hl.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 font-medium mt-0.5 leading-tight">
                      {hl.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS, HIGHLIGHTS & BUY CONTROLS (Balanced 6 cols on lg & xl) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
            {/* Top Meta Row: Badge + Category + Stock + SKU */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2.5">
              {product.badge === "Best Seller" ? (
                <span className="bg-stone-950 text-amber-400 text-xs font-bold px-3 py-1 rounded-full tracking-wide shadow-2xs flex items-center gap-1.5">
                  <span>★</span>
                  <span className="text-white">Best Seller</span>
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide shadow-2xs">
                  {product.badge}
                </span>
              )}
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-full">
                {product.categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                <span>●</span>
                <span>In Stock • Fast Dispatch</span>
              </span>
              <span className="text-xs font-semibold text-stone-400">
                SKU: {product.sku}
              </span>
            </div>

            {/* Product Title + Wishlist Button Row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 tracking-tight leading-tight flex-1">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border shadow-2xs flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                  wishlisted
                    ? "text-orange-500 border-orange-200 bg-orange-50 shadow-xs"
                    : "text-stone-400 border-stone-200 bg-white hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50/40"
                }`}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <HeartIcon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${
                    wishlisted ? "fill-orange-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Tagline & Pack Info Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.packInfo && (
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-800 bg-stone-100 border border-stone-200/90 px-3 py-1 rounded-full">
                  <span>📦</span>
                  <span>{product.packInfo}</span>
                </span>
              )}
              {product.tagline && (
                <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-xs tracking-wide">
                  {product.tagline}
                </span>
              )}
            </div>

            {/* Rating & Reviews Row */}
            <div className="flex items-center flex-wrap gap-3 mb-4 pb-4 border-b border-stone-200/80">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-3.5 h-3.5" />
                  ))}
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-stone-600">
                {product.reviewsCount} Verified Customer Reviews
              </span>
            </div>

            {/* Price & Savings Block */}
            <div className="bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200/80 mb-5">
              <div className="flex items-baseline flex-wrap gap-3">
                <span className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
                  ₹{product.price}
                </span>
                <span className="text-base sm:text-lg text-stone-400 line-through font-semibold">
                  MRP ₹{product.originalPrice}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs">
                    Save {discountPercent}% (₹{product.originalPrice - product.price} OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1">
                Inclusive of all taxes • Factory-direct M.art athletic pricing
              </p>
            </div>

            {/* Live Stock Level Indicator (Variant Responsive) */}
            <div className="mb-5">
              {(() => {
                const threshold = product.lowStockThreshold ?? 5;
                const hasVariantStock =
                  product.trackVariantStock &&
                  product.variantStock &&
                  product.variantStock[selectedOption] !== undefined;

                const effectiveStock = hasVariantStock
                  ? product.variantStock![selectedOption]
                  : product.stockQuantity ?? (product.inStock ? 50 : 0);

                const isOut = !product.inStock || effectiveStock <= 0;
                const isLow = !isOut && effectiveStock <= threshold;

                if (isOut) {
                  return (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>
                        {hasVariantStock
                          ? `Currently Sold Out for "${selectedOption}"`
                          : "Currently Out of Stock"}
                      </span>
                    </div>
                  );
                }

                if (isLow) {
                  return (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold shadow-xs animate-in fade-in">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                      <span>
                        🔥 Only {effectiveStock} left in stock for &ldquo;{selectedOption}&rdquo; — order soon!
                      </span>
                    </div>
                  );
                }

                return (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-800 text-xs font-bold animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>
                      In Stock ({effectiveStock} units available for {selectedOption || "selection"})
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* ===================================================== */}
            {/* 1. VARIANT / WEIGHT / COLOR OPTIONS PILLS              */}
            {/* ===================================================== */}
            {product.variantGroups && product.variantGroups.length > 0 ? (
              <div className="space-y-4 mb-5">
                {product.variantGroups.map((grp) => {
                  const currentSelected =
                    selectedVariants[grp.name] || grp.values[0] || "";
                  return (
                    <div key={grp.id || grp.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                          {grp.name}:
                        </span>
                        <span className="text-xs font-bold text-orange-600">
                          {currentSelected}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {grp.values.map((val) => {
                          const active = currentSelected === val;
                          return (
                            <button
                              type="button"
                              key={val}
                              onClick={() =>
                                handleSelectVariantGroup(grp.name, val)
                              }
                              className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold border transition-all cursor-pointer ${
                                active
                                  ? "bg-orange-500 text-white border-orange-500 shadow-xs scale-102"
                                  : "bg-[#fff4ed] border-orange-200 text-stone-800 hover:border-orange-400"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : product.options && product.options.length > 0 ? (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                    {product.optionsLabel || "Available Options"}:
                  </span>
                  <span className="text-xs font-bold text-orange-600">
                    {selectedOption}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.options.map((opt) => {
                    const active = selectedOption === opt;
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          if (product.gallery && product.galleryMetadata) {
                            const targetIdx = product.gallery.findIndex((imgUrl) => {
                              const meta = product.galleryMetadata?.[imgUrl];
                              return (
                                meta?.color &&
                                meta.color.trim().toLowerCase() === opt.trim().toLowerCase()
                              );
                            });
                            if (targetIdx !== -1) {
                              setSelectedImageIdx(targetIdx);
                            }
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold border transition-all cursor-pointer ${
                          active
                            ? "bg-orange-500 text-white border-orange-500 shadow-xs scale-102"
                            : "bg-[#fff4ed] border-orange-200 text-stone-800 hover:border-orange-400"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* ===================================================== */}
            {/* 2. QUANTITY & ADD TO CART / BUY NOW ACTIONS            */}
            {/* ===================================================== */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              {/* Quantity Counter */}
              <div className="inline-flex items-center justify-between border border-stone-300 rounded-full bg-white px-2 py-1.5 sm:w-36 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center font-extrabold text-stone-700 text-base cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-extrabold text-sm text-stone-900 px-3">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center font-extrabold text-stone-700 text-base cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart & Buy Now Buttons (Variant Responsive) */}
              {(() => {
                const hasVariantStock =
                  product.trackVariantStock &&
                  product.variantStock &&
                  product.variantStock[selectedOption] !== undefined;

                const effectiveStock = hasVariantStock
                  ? product.variantStock![selectedOption]
                  : product.stockQuantity ?? (product.inStock ? 50 : 0);

                const isCurrentOut = !product.inStock || effectiveStock <= 0;

                if (isCurrentOut) {
                  return (
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-3.5 px-6 rounded-full font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 bg-stone-200 text-stone-500 cursor-not-allowed"
                    >
                      <ShoppingCartIcon className="w-5 h-5 text-stone-400" />
                      <span>
                        {hasVariantStock
                          ? "Sold Out for this Variant"
                          : "Out of Stock"}
                      </span>
                    </button>
                  );
                }

                return (
                  <>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                        addedCount > 0
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                          : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25"
                      }`}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>
                        {addedCount > 0
                          ? `Added to Cart (${addedCount})`
                          : `Add to Cart • ₹${product.price * quantity}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="py-3.5 px-7 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                    >
                      <span>Buy Now</span>
                    </button>
                  </>
                );
              })()}
            </div>

            {/* ===================================================== */}
            {/* 3. TRUST MICRO-STRIP (Amazon Style - Icon Top)        */}
            {/* ===================================================== */}
            <div className="mb-6 rounded-2xl bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed]/80 border border-stone-200/90 shadow-2xs overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-stone-200/70 lg:divide-y-0 lg:divide-x divide-stone-200/80">
                {/* 1. Fast Delivery */}
                <div className="p-3 sm:p-3.5 flex flex-col items-center text-center justify-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 mb-1.5 shadow-2xs">
                    <TruckIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-extrabold text-stone-900 leading-tight">
                    Pan-India Delivery
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                    Fast &amp; Trackable
                  </p>
                </div>

                {/* 2. Quality Tested */}
                <div className="p-3 sm:p-3.5 flex flex-col items-center text-center justify-center border-l border-stone-200/70 lg:border-l-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 mb-1.5 shadow-2xs">
                    <ShieldCheckIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-extrabold text-stone-900 leading-tight">
                    100% Quality
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                    Tested &amp; Verified
                  </p>
                </div>

                {/* 3. Replacement */}
                <div className="p-3 sm:p-3.5 flex flex-col items-center text-center justify-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 mb-1.5 shadow-2xs">
                    <RotateCcwIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-extrabold text-stone-900 leading-tight">
                    7-Day Returns
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                    Easy Replacement
                  </p>
                </div>

                {/* 4. Payments */}
                <div className="p-3 sm:p-3.5 flex flex-col items-center text-center justify-center border-l border-stone-200/70 lg:border-l-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 mb-1.5 shadow-2xs">
                    <CreditCardIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-extrabold text-stone-900 leading-tight">
                    COD &amp; UPI
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium leading-tight mt-0.5">
                    Secure Checkout
                  </p>
                </div>
              </div>
            </div>

            {/* ===================================================== */}
            {/* 4. PRODUCT OVERVIEW & 4-PILLAR HIGHLIGHTS (Details)   */}
            {/* ===================================================== */}
            <div className="pt-6 border-t border-stone-200/80">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 mb-2.5">
                Product Overview
              </h3>
              {/* Lead Summary Paragraph */}
              <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed mb-6">
                {product.shortDescription}{" "}
                <span className="text-stone-600 font-normal">
                  {product.description}
                </span>
              </p>

              {/* 4-Pillar Highlights Strip (Mobile Only: under Overview, on Desktop it is under thumbnails on Left) */}
              {(product.highlights || []).length > 0 && (
                <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {(product.highlights || []).map((hl, idx) => (
                    <div
                      key={`${hl.title}-${idx}`}
                      className="bg-[#fff7f2] border border-orange-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:border-orange-400 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full bg-orange-100/90 border border-orange-200 flex items-center justify-center mb-2 shrink-0">
                        {renderHighlightIcon(hl.icon)}
                      </div>
                      <h4 className="text-xs sm:text-[13px] font-extrabold text-stone-900 leading-snug">
                        {hl.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-stone-600 font-medium mt-0.5 leading-tight">
                        {hl.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. UNIFORM A+ PRODUCT INFOGRAPHIC LAYOUT (FOR ALL ITEMS)  */}
      {/*    (Matches the exact cards in your uploaded images!)      */}
      {/* ========================================================= */}
      <section className="py-10 sm:py-14 bg-[#f8f6f3] border-y border-stone-200/90">
        <div className="max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
          {/* Section Title */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-orange-500" />
              <span className="text-[11px] font-extrabold tracking-widest text-orange-600 uppercase">
                Complete Product Breakdown
              </span>
              <span className="w-5 h-[2px] bg-orange-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Features, Specifications &amp; Ideal Use
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 font-medium">
              Everything you need to know about the {product.name} at a glance.
            </p>
          </div>

          {/* 2-Column Top Infographic Cards: Key Features + Dimensions & Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* CARD A: KEY FEATURES CHECKLIST (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                {/* Orange Pill Header (Just like "Key Features" in Skipping Rope image) */}
                <div className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full mb-5 shadow-2xs">
                  Key Features
                </div>

                <ul className="space-y-3.5 sm:space-y-4">
                  {product.keyFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-stone-800 text-xs sm:text-[14px] font-semibold leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Highlight Callout Box */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3 bg-[#fff8f3] rounded-2xl p-3.5 border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-orange-200 bg-white shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-stone-900">
                      Built for Daily Performance
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      {product.tagline}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shrink-0">
                  M.art Pro
                </span>
              </div>
            </div>

            {/* CARD B: CLEAN MODERN SPECIFICATION TABLE (IDEA 1) */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full shadow-2xs">
                    Dimensions &amp; Specifications
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {product.packInfo}
                  </span>
                </div>

                {/* Clean 6-Row Alternating Specification Table */}
                <div className="rounded-2xl border border-stone-200/90 overflow-hidden divide-y divide-stone-200/70">
                  {(product.specifications || []).map((spec, idx) => (
                    <div
                      key={`${spec.label}-${idx}`}
                      className={`flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5 ${
                        idx % 2 === 0 ? "bg-[#fcfaf8]" : "bg-white"
                      }`}
                    >
                      <span className="text-xs sm:text-[14px] font-semibold text-stone-600">
                        {spec.label}
                      </span>
                      <span className="text-xs sm:text-[14px] font-extrabold text-stone-900 text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD C: "IDEAL FOR" / "PERFECT FOR" FULL-WIDTH STRIP (Just like bottom of all 5 uploaded pics) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full shadow-2xs w-fit">
                Ideal For
              </div>
              <span className="text-xs font-semibold text-stone-500">
                Engineered for versatile home, gym, and field workouts
              </span>
            </div>

            {(product.idealFor || []).length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {(product.idealFor || []).map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="group rounded-2xl border border-stone-200/80 bg-gradient-to-b from-[#fffaf6] to-white p-4 sm:p-5 flex flex-col items-center text-center hover:border-orange-400 hover:shadow-md transition-all"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-100/80 border-2 border-orange-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                      {renderIdealForIcon(item.icon)}
                    </div>
                    <h3 className="text-xs sm:text-[15px] font-extrabold text-stone-900">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===================================================== */}
          {/* CUSTOMER REVIEWS SECTION (ENHANCED AUTH & PHOTO SUPPORT) */}
          {/* ===================================================== */}
          <div className="mt-6 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-4 sm:p-7 shadow-xs">
            {/* Simple Header */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-stone-200/80">
              <div className="flex items-center gap-2.5">
                <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                  Customer Reviews
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-700 whitespace-nowrap">
                  ★ {product.rating} ({allReviews.length} Verified)
                </span>
              </div>

              {allReviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAllReviewsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View All in Modal</span>
                </button>
              )}
            </div>

            {/* 2-Column Split: Left = Write a Review | Right = Reviews + View More */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT (5 Cols): Compact Rating + Sign-In Gate + Form */}
              <div className="lg:col-span-5 bg-[#fff9f5] rounded-2xl border border-orange-200/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-orange-200/60">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                      Write a Review
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Rate {product.name}
                    </p>
                  </div>

                  {/* Interactive Star Picker */}
                  <div className="flex items-center gap-0.5 bg-white px-2.5 py-1 rounded-full border border-orange-200 shrink-0">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`p-0.5 cursor-pointer transition-transform hover:scale-110 ${
                          star <= reviewRating
                            ? "text-amber-500"
                            : "text-stone-300"
                        }`}
                        aria-label={`Rate ${star} stars`}
                      >
                        <StarIcon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIGN IN COMPULSORY GATE */}
                {!user ? (
                  <div className="py-4 px-2 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto border border-orange-200">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        Sign In Required to Review
                      </h4>
                      <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                        Please sign in with your M.art account to leave a verified rating & upload product photos.
                      </p>
                    </div>
                    <div className="pt-1 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Sign In to Review
                      </button>
                      <button
                        type="button"
                        onClick={openSignUpModal}
                        className="px-3.5 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 transition-all cursor-pointer"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    {/* Auto-filled Name badge */}
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 bg-white/80 px-3 py-2 rounded-xl border border-orange-200/80">
                      <span className="flex items-center gap-1.5 text-stone-800 truncate">
                        Reviewing as:{" "}
                        <strong className="text-orange-600 font-bold">
                          {reviewName || user.email}
                        </strong>
                      </span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold shrink-0">
                        ✓ Verified Buyer
                      </span>
                    </div>

                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your honest review and experience with this gear..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-orange-500 resize-none placeholder:text-stone-400"
                    />

                    {/* Photo Upload Row */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {reviewPhoto ? (
                        <div className="relative inline-block mt-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={reviewPhoto}
                            alt="Review preview"
                            className="w-16 h-16 object-cover rounded-xl border-2 border-orange-400 shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setReviewPhoto(null)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs cursor-pointer"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-orange-300 text-orange-600 hover:bg-orange-50/70 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Add Photo (optional)</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                      {reviewSubmitted ? (
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Review submitted! Waiting for admin approval.</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-500 font-medium">
                          ✓ Moderated by M.art Admin
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap text-center disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* RIGHT (7 Cols): Clean Stacked Reviews + Photo Thumbnails + View More Toggle */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div className="divide-y divide-stone-200/80">
                  {visibleReviews.map((rev: any, idx: number) => (
                    <div
                      key={rev.id || (rev.userName || rev.name) + idx}
                      className={`${idx === 0 ? "pb-4" : "py-4"} flex flex-col gap-2`}
                    >
                      {/* Top Row: Reviewer Name + Verified Badge + Stars + Date */}
                      <div className="flex items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold flex items-center justify-center shrink-0">
                            {(rev.userName || rev.name || "C").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-extrabold text-stone-900 whitespace-nowrap">
                                {rev.userName || rev.name}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap border border-emerald-100">
                                ✓ {rev.city || "Verified Buyer"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 shrink-0">
                          <div className="flex items-center text-amber-500 gap-0.5">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 whitespace-nowrap">
                            {rev.date}
                          </span>
                        </div>
                      </div>

                      {/* Review Comment */}
                      <p className="text-xs sm:text-[13px] text-stone-600 font-medium leading-relaxed sm:pl-10">
                        {rev.comment}
                      </p>

                      {/* Photo Thumbnail if uploaded */}
                      {rev.photoUrl && (
                        <div className="sm:pl-10 pt-1">
                          <button
                            type="button"
                            onClick={() => setActivePhotoLightbox(rev.photoUrl)}
                            className="group relative inline-block rounded-xl overflow-hidden border border-stone-200 hover:border-orange-500 transition-colors shadow-2xs"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={rev.photoUrl}
                              alt="Customer review photo"
                              className="w-14 h-14 sm:w-16 sm:h-16 object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                              View
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* View More Controls */}
                {allReviews.length > 2 && (
                  <div className="pt-3 mt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 sm:pl-9">
                    <button
                      type="button"
                      onClick={() => setShowAllReviews((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      <span>
                        {showAllReviews
                          ? "Show Less Reviews ↑"
                          : `View More Reviews (${allReviews.length - 2} more) ↓`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAllReviewsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-stone-700 text-xs font-bold border border-stone-200 transition-colors cursor-pointer"
                    >
                      <span>Full Reviews & Photos Modal</span>
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ALL REVIEWS & PHOTO GALLERY MODAL                         */}
      {/* ========================================================= */}
      {isAllReviewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between gap-3 bg-[#fffaf5]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {product.name} — Reviews
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  ★ {product.rating} overall rating • {allReviews.length} verified customer feedback
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Filter Pills */}
            <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-stone-500 mr-1 text-[11px] uppercase tracking-wider">
                Filter:
              </span>
              {[
                { id: "all", label: "All Reviews" },
                { id: "5", label: "5 ★ Stars" },
                { id: "4", label: "4 ★ Stars" },
                { id: "photo", label: "📷 With Photos" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setModalStarFilter(f.id)}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer text-xs ${
                    modalStarFilter === f.id
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-white text-stone-600 hover:bg-stone-200 border border-stone-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 divide-y divide-stone-100">
              {filteredModalReviews.length === 0 ? (
                <p className="text-center py-10 text-xs font-semibold text-stone-400">
                  No reviews match this filter.
                </p>
              ) : (
                filteredModalReviews.map((rev: any, i: number) => (
                  <div key={rev.id || i} className={i === 0 ? "" : "pt-4"}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-black flex items-center justify-center">
                          {(rev.userName || rev.name || "C").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-stone-900">
                          {rev.userName || rev.name}
                        </span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                          ✓ Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating || 5)].map((_, idx) => (
                          <StarIcon key={idx} className="w-3 h-3" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed pl-9">
                      {rev.comment}
                    </p>
                    {rev.photoUrl && (
                      <div className="pl-9 pt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rev.photoUrl}
                          alt="Customer photo"
                          onClick={() => setActivePhotoLightbox(rev.photoUrl)}
                          className="w-20 h-20 object-cover rounded-xl border border-stone-200 cursor-pointer hover:opacity-90 shadow-2xs"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHOTO LIGHTBOX POPUP                                      */}
      {/* ========================================================= */}
      {activePhotoLightbox && (
        <div
          onClick={() => setActivePhotoLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-zoom-out"
        >
          <div className="relative max-w-xl w-full bg-black/40 rounded-2xl p-2 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhotoLightbox}
              alt="Enlarged review photo"
              className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <p className="text-xs text-white/80 font-medium mt-2">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* 4. SIMILAR / RELATED PRODUCTS SECTION                     */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-16 max-w-[1520px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-10">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="w-5 h-[2px] bg-orange-500" />
              <span className="text-[11px] font-bold tracking-widest text-orange-600 uppercase">
                Complete Your Setup
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900">
              You May Also Like
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            <span>View All Gear</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {relatedProducts.map((rel) => (
            <Link
              key={rel.id}
              href={`/products/${rel.id}`}
              className="group bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-orange-400 transition-all duration-300"
            >
              <div className="relative w-full aspect-square bg-[#f6f6f6] overflow-hidden">
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-stone-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {rel.badge}
                  </span>
                </div>
                <Image
                  src={rel.image}
                  alt={rel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 sm:p-4 border-t border-stone-100">
                <div className="text-[10px] font-bold uppercase text-orange-600 mb-0.5">
                  {rel.categoryLabel}
                </div>
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-orange-600 transition-colors line-clamp-1">
                  {rel.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-sm sm:text-base font-extrabold text-stone-950">
                    ₹{rel.price}
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                    ₹{rel.originalPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FULL-WINDOW EDGE-TO-EDGE LIGHTBOX + 1x/2x CLICK ZOOM   */}
      {/* ========================================================= */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 w-screen h-screen bg-white flex flex-col overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Floating Top Controls Bar */}
          <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-6 sm:right-6 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-stone-950/85 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
              <span className="text-xs sm:text-sm font-extrabold">
                {product.name}
              </span>
              <span className="text-[11px] font-bold text-orange-400">
                {selectedImageIdx + 1} / {activeGallery.length}
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              {/* 1x / 2x Zoom Toggle Button */}
              <button
                type="button"
                onClick={() => setIsZoomed((z) => !z)}
                className="px-3.5 py-2 rounded-full bg-stone-950/85 hover:bg-orange-500 text-white text-xs font-extrabold backdrop-blur-md shadow-lg transition-colors cursor-pointer"
              >
                {isZoomed ? "🔍 1x Fit" : "🔍 2x Zoom"}
              </button>

              {/* Close Full Window Button */}
              <button
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setLightboxOpen(false);
                }}
                aria-label="Close fullscreen view"
                className="w-10 h-10 rounded-full bg-stone-950/85 hover:bg-orange-500 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-colors cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Window Edge-to-Edge Image Canvas (100vw x 100vh) */}
          <div
            onClick={() => setIsZoomed((z) => !z)}
            className={`w-screen h-screen flex-1 overflow-auto flex items-center justify-center select-none ${
              isZoomed ? "cursor-zoom-out items-start" : "cursor-zoom-in"
            }`}
          >
            <div
              className={`relative transition-all duration-200 ${
                isZoomed
                  ? "w-[180vw] sm:w-[150vw] lg:w-[135vw] h-[150vh] sm:h-[165vh] shrink-0"
                  : "w-screen h-screen"
              }`}
            >
              <Image
                src={activeGallery[selectedImageIdx] || activeGallery[0] || product.image}
                alt={`${product.name} expanded view ${selectedImageIdx + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Floating Thumbnail Selector (Right-Center Vertical Dock on Laptop, Bottom on Mobile) */}
          {activeGallery.length > 1 && (
            <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 flex flex-row sm:flex-col items-center gap-2.5 bg-stone-950/85 backdrop-blur-md px-3 py-2 sm:px-2.5 sm:py-3.5 rounded-2xl shadow-2xl border border-white/10">
              {activeGallery.map((imgUrl, idx) => {
                const isActive = selectedImageIdx === idx;
                return (
                  <button
                    type="button"
                    key={imgUrl + idx}
                    onClick={() => {
                      setIsZoomed(false);
                      setSelectedImageIdx(idx);
                    }}
                    aria-label={`Switch to image view ${idx + 1}`}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                      isActive
                        ? "border-orange-500 scale-105 shadow-md ring-2 ring-orange-500/40"
                        : "border-white/30 opacity-60 hover:opacity-100 hover:border-white/80"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Review Submission Floating Toast Notification */}
      {reviewToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-sm font-bold text-white">{reviewToast.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Pending Approval
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                {reviewToast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReviewToast(null)}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <LucideX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
