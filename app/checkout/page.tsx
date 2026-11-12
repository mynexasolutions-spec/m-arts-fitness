"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { getProductById, ProductDetailItem } from "@/data/products";
import {
  Coupon,
  getStoredCoupons,
  validateCoupon,
  saveStoredCoupons,
} from "@/data/coupons";
import {
  Ticket,
  Tag,
  Check,
  X,
  Sparkles,
  Percent,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import {
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  ShoppingCartIcon,
} from "@/components/Icons";

export default function CheckoutPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, deliverySettings } = useStore();
  const { user, openLoginModal, openSignUpModal } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'netbanking'>('cod');

  // Auto-prefill customer details from authenticated user
  useEffect(() => {
    if (user) {
      if (!fullName) {
        setFullName(
          user.user_metadata?.full_name || user.user_metadata?.name || ""
        );
      }
      if (!email && user.email) {
        setEmail(user.email);
      }
    }
  }, [user]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const [orderPlaced, setOrderPlaced] = useState<{
    orderId: string;
    total: number;
    itemCount: number;
    customerName: string;
    addressSummary: string;
    payment: string;
    couponCode?: string;
    couponDiscount?: number;
  } | null>(null);

  // Coupon State
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showOffers, setShowOffers] = useState<boolean>(false);

  // Load available coupons on mount and when updated in admin
  useEffect(() => {
    const loadCoupons = () => {
      setAvailableCoupons(getStoredCoupons());
    };
    loadCoupons();

    window.addEventListener("mart_coupons_updated", loadCoupons);
    return () => {
      window.removeEventListener("mart_coupons_updated", loadCoupons);
    };
  }, []);

  const detailedItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { ...item, product } : null;
      })
      .filter(
        (
          x
        ): x is typeof cart[number] & {
          product: ProductDetailItem;
        } => x !== null
      );
  }, [cart]);

  const subtotal = useMemo(
    () =>
      detailedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [detailedItems]
  );

  // Re-calculate coupon discount if subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      const res = validateCoupon(appliedCoupon.code, subtotal, availableCoupons);
      if (res.valid) {
        setCouponDiscount(res.discountAmount);
        setCouponError(null);
      } else {
        setCouponDiscount(0);
        setCouponError(res.error || "Coupon criteria no longer met");
        setAppliedCoupon(null);
      }
    } else if (subtotal === 0) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponSuccess(null);
    }
  }, [subtotal, appliedCoupon, availableCoupons]);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    setCouponError(null);
    setCouponSuccess(null);

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const res = validateCoupon(code, subtotal, availableCoupons);
    if (!res.valid || !res.coupon) {
      setCouponError(res.error || "Invalid coupon code");
      setAppliedCoupon(null);
      setCouponDiscount(0);
      return;
    }

    setAppliedCoupon(res.coupon);
    setCouponDiscount(res.discountAmount);
    setCouponInput(res.coupon.code);
    setCouponSuccess(
      `🎉 Coupon "${res.coupon.code}" applied! You saved ₹${res.discountAmount}`
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
    setCouponSuccess(null);
    setCouponInput("");
  };

  const totalMRP = useMemo(
    () =>
      detailedItems.reduce(
        (sum, item) => sum + item.product.originalPrice * item.quantity,
        0
      ),
    [detailedItems]
  );

  const totalSavings = totalMRP - subtotal;
  const freeThreshold = Number(deliverySettings?.freeShippingThreshold) || 999;
  const standardFee = Number(deliverySettings?.standardDeliveryFee) || 49;
  const deliveryCharge =
    subtotal >= freeThreshold || subtotal === 0 ? 0 : standardFee;
  const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryCharge);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (detailedItems.length === 0) return;

    const newErrors: Record<string, string> = {};

    if (fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (min 2 characters)";
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (address.trim().length < 6) {
      newErrors.address = "Please enter your complete house / street address";
    }
    if (city.trim().length < 2) {
      newErrors.city = "Please enter a valid city name";
    }
    if (stateName.trim().length < 2) {
      newErrors.stateName = "Please enter your state";
    }
    if (!/^[1-9]\d{5}$/.test(pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit PIN code";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = document.querySelector("[data-error='true']");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const totalCount = detailedItems.reduce((s, i) => s + i.quantity, 0);

    const orderRecord = {
      orderId: `MART-${randomNum}`,
      total: grandTotal,
      itemCount: totalCount,
      customerName: fullName.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      addressSummary: `${address.trim()}, ${city.trim()}, ${stateName.trim()} - ${pincode.trim()}`,
      payment:
        paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Net Banking',
      status: "Confirmed",
      date: new Date().toISOString(),
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      couponDiscount: couponDiscount > 0 ? couponDiscount : 0,
      items: detailedItems.map((item) => ({
        id: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        sku: (item.product as any)?.sku || `MART-${item.productId.slice(0, 3).toUpperCase()}-101`,
      })),
    };

    setOrderPlaced({
      orderId: orderRecord.orderId,
      total: orderRecord.total,
      itemCount: orderRecord.itemCount,
      customerName: orderRecord.customerName,
      addressSummary: orderRecord.addressSummary,
      payment: orderRecord.payment,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
    });

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem("mart_orders") || "[]"
      );
      localStorage.setItem(
        "mart_orders",
        JSON.stringify([orderRecord, ...existingOrders])
      );

      // Increment coupon usage count if applied
      if (appliedCoupon) {
        const stored = getStoredCoupons();
        const updated = stored.map((c) =>
          c.id === appliedCoupon.id
            ? { ...c, timesUsed: (c.timesUsed || 0) + 1 }
            : c
        );
        saveStoredCoupons(updated);
      }

      // Persist to Supabase Backend Database via API
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderRecord,
          userId: user?.id || null,
        }),
      }).catch((apiErr) => {
        console.warn("Could not sync order to Supabase:", apiErr);
      });
    } catch (storageErr) {
      console.warn("Could not persist order to local storage:", storageErr);
    }

    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* Top Breadcrumb Bar */}
        <div className="bg-white border-b border-stone-200/80">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-3.5 flex items-center justify-between text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-orange-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-orange-600">
                Shop Gear
              </Link>
              <span>/</span>
              <span className="text-stone-900 font-extrabold">Checkout</span>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        <section className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-8 sm:py-12">
          {orderPlaced ? (
            /* ===================================================== */
            /* ORDER CONFIRMED CELEBRATION CARD                      */
            /* ===================================================== */
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 text-center shadow-sm">
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-emerald-100/80 animate-ping [animation-duration:1.8s] [animation-iteration-count:2]" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>
              <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-3.5 py-1 rounded-full mb-2">
                Order Confirmed • {orderPlaced.orderId}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
                Thank You, {orderPlaced.customerName}!
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-2 leading-relaxed">
                Your M.art fitness order has been received and is being prepared for fast dispatch.
              </p>

              <div className="mt-6 bg-[#fff9f5] border border-orange-200/80 rounded-2xl p-4 sm:p-5 text-left space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">Order ID:</span>
                  <span className="font-extrabold text-stone-900">
                    {orderPlaced.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">
                    Total Items:
                  </span>
                  <span className="font-extrabold text-stone-900">
                    {orderPlaced.itemCount} item(s)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">
                    Payment Mode:
                  </span>
                  <span className="font-extrabold text-orange-600">
                    {orderPlaced.payment}
                  </span>
                </div>
                {orderPlaced.couponDiscount && orderPlaced.couponDiscount > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/90 -mx-1 px-2 py-1 rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5" />
                      Promo Discount ({orderPlaced.couponCode}):
                    </span>
                    <span>− ₹{orderPlaced.couponDiscount}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">
                    Amount Payable:
                  </span>
                  <span className="font-black text-stone-950 text-base">
                    ₹{orderPlaced.total}
                  </span>
                </div>
                <div className="pt-2 border-t border-orange-200/60">
                  <span className="text-stone-500 font-semibold block mb-0.5">
                    Delivery Address:
                  </span>
                  <span className="font-bold text-stone-800">
                    {orderPlaced.addressSummary}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-7 py-3 rounded-full border border-stone-300 hover:border-stone-900 text-stone-800 text-xs sm:text-sm font-bold transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : detailedItems.length === 0 ? (
            /* ===================================================== */
            /* EMPTY CART STATE                                      */
            /* ===================================================== */
            <div className="max-w-lg mx-auto bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
                <ShoppingCartIcon className="w-8 h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-2">
                Your Checkout Cart is Empty
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Add your favorite dumbbells, skipping rope, yoga mat, or training cones to proceed with checkout.
              </p>
              <Link
                href="/products"
                className="inline-block px-7 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all"
              >
                Browse M.art Gear
              </Link>
            </div>
          ) : (
            /* ===================================================== */
            /* 2-COLUMN CHECKOUT FORM & ORDER SUMMARY                */
            /* ===================================================== */
            <form
              noValidate
              onSubmit={handlePlaceOrder}
              className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start"
            >
              {/* LEFT (7 Cols): Shipping Details + Payment Method */}
              <div className="lg:col-span-7 space-y-6">
                {/* Sign-in Authentication Gate / Status Banner */}
                {!user ? (
                  <div className="rounded-2xl border-2 border-orange-500/40 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                          Sign In Required to Place Order
                        </h3>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                          Please sign in or create a free M.art account to proceed with checkout and receive live order updates.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={openLoginModal}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={openSignUpModal}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200 transition-all cursor-pointer"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-3 sm:p-3.5 px-3.5 sm:px-4 text-xs">
                    {/* Mobile layout: clean 2-line layout so verified badge never overflows */}
                    <div className="sm:hidden space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span className="text-stone-600 font-medium text-xs">Ordering as:</span>
                        </div>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full text-[10px] shrink-0">
                          ✓ Verified Account
                        </span>
                      </div>
                      <div className="pl-3.5 min-w-0">
                        <p className="font-bold text-stone-900 truncate text-xs">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        {user.user_metadata?.full_name && user.email && (
                          <p className="text-stone-500 text-[11px] truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Desktop / Tablet layout: single clean row */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <span className="text-stone-600 font-medium shrink-0">Ordering as:</span>
                        <span className="font-bold text-stone-900 truncate">
                          {user.user_metadata?.full_name || user.email}
                        </span>
                        {user.user_metadata?.full_name && user.email && (
                          <span className="text-stone-400 text-[11px] truncate">
                            ({user.email})
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full text-[10px] shrink-0 whitespace-nowrap">
                        ✓ Verified Account
                      </span>
                    </div>
                  </div>
                )}
                {/* Step 1: Shipping Address */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-200/80">
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                      Delivery Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div data-error={Boolean(errors.fullName)}>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          clearFieldError("fullName");
                        }}
                        placeholder="e.g., Rohit Sharma"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                          errors.fullName
                            ? "border-red-500 focus:border-red-500 bg-red-50/30"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-[11px] font-bold text-red-600">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div data-error={Boolean(errors.phone)}>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhone(digitsOnly);
                          clearFieldError("phone");
                        }}
                        placeholder="10-digit mobile number"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                          errors.phone
                            ? "border-red-500 focus:border-red-500 bg-red-50/30"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[11px] font-bold text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2" data-error={Boolean(errors.email)}>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          clearFieldError("email");
                        }}
                        placeholder="For order tracking updates"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 bg-red-50/30"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-[11px] font-bold text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2" data-error={Boolean(errors.address)}>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Complete Street Address / House No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          clearFieldError("address");
                        }}
                        placeholder="House/Flat No., Building, Locality, Landmark"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                          errors.address
                            ? "border-red-500 focus:border-red-500 bg-red-50/30"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-[11px] font-bold text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div data-error={Boolean(errors.city)}>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          clearFieldError("city");
                        }}
                        placeholder="e.g., New Delhi"
                        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                          errors.city
                            ? "border-red-500 focus:border-red-500 bg-red-50/30"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-[11px] font-bold text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div data-error={Boolean(errors.stateName)}>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={stateName}
                          onChange={(e) => {
                            setStateName(e.target.value);
                            clearFieldError("stateName");
                          }}
                          placeholder="State"
                          className={`w-full px-3 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                            errors.stateName
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.stateName && (
                          <p className="mt-1 text-[11px] font-bold text-red-600">
                            {errors.stateName}
                          </p>
                        )}
                      </div>
                      <div data-error={Boolean(errors.pincode)}>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          Pin Code *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          value={pincode}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setPincode(digitsOnly);
                            clearFieldError("pincode");
                          }}
                          placeholder="6-digit PIN"
                          className={`w-full px-3 py-2.5 rounded-xl border bg-white text-xs sm:text-sm font-medium text-stone-900 focus:outline-none ${
                            errors.pincode
                              ? "border-red-500 focus:border-red-500 bg-red-50/30"
                              : "border-stone-300 focus:border-orange-500"
                          }`}
                        />
                        {errors.pincode && (
                          <p className="mt-1 text-[11px] font-bold text-red-600">
                            {errors.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment Method */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-200/80">
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Option A: COD */}
                    <label
                      onClick={() => {
                        setPaymentMethod('cod');
                      }}
                      className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-orange-500 bg-[#fff8f3]"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center ${
                            paymentMethod === "cod"
                              ? "border-orange-500 bg-orange-500"
                              : "border-stone-300"
                          }`}
                        >
                          {paymentMethod === "cod" && (
                            <span className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </span>
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                            Cash on Delivery (COD)
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            Pay in cash or UPI when the product arrives at your doorstep
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Option B: Net Banking (Coming Soon) */}
                    <div
                      className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/70 select-none cursor-not-allowed opacity-80"
                      title="Net Banking is coming soon"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 shrink-0 rounded-full border border-stone-300 bg-stone-200/60 flex items-center justify-center">
                            {/* Disabled unselected radio */}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-extrabold text-stone-700">
                                Net Banking
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                Coming Soon
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium">
                              Pay securely via SBI, HDFC, ICICI, Axis & other major Indian banks
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT (5 Cols): Order Summary Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs">
                <h2 className="text-base sm:text-lg font-extrabold text-stone-900 pb-4 mb-4 border-b border-stone-200/80">
                  Order Summary ({detailedItems.reduce((s, i) => s + i.quantity, 0)}{" "}
                  Items)
                </h2>

                {/* Items List */}
                <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1 mb-5">
                  {detailedItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-3 p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 truncate">
                            {item.product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            className="text-stone-400 hover:text-red-500 text-xs font-bold cursor-pointer"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        {item.option && (
                          <div className="text-[11px] font-bold text-orange-600 mt-0.5">
                            {item.option}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center border border-stone-300 rounded-full bg-white px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.key, item.quantity - 1)
                              }
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-stone-700 cursor-pointer"
                            >
                              −
                            </button>
                            <span className="text-xs font-extrabold px-2">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.key, item.quantity + 1)
                              }
                              className="w-5 h-5 flex items-center justify-center text-xs font-bold text-stone-700 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs sm:text-sm font-black text-stone-950">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon / Promo Code Input Card */}
                <div className="pt-4 pb-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-orange-500" />
                      <span>Have a Discount Coupon?</span>
                    </label>
                    {availableCoupons.filter((c) => c.isActive).length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowOffers(!showOffers)}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{showOffers ? "Hide Offers" : "View Offers"}</span>
                        {showOffers ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-emerald-900 tracking-wider">
                            {appliedCoupon.code}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-medium">
                            {appliedCoupon.discountType === "percentage"
                              ? `${appliedCoupon.discountValue}% OFF (Saved ₹${couponDiscount})`
                              : `Flat ₹${couponDiscount} OFF Applied`}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-stone-400 hover:text-red-500 p-1 rounded-md text-xs font-bold transition-colors cursor-pointer"
                        title="Remove coupon"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              setCouponError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            placeholder="e.g. WELCOME10"
                            className="w-full uppercase font-mono tracking-wider px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-xs font-bold text-stone-900 placeholder:normal-case placeholder:font-sans placeholder:font-normal focus:outline-none focus:border-orange-500 focus:bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          Apply
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-1.5 text-[11px] font-bold text-red-600 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{couponError}</span>
                        </p>
                      )}

                      {couponSuccess && (
                        <p className="mt-1.5 text-[11px] font-bold text-emerald-600">
                          {couponSuccess}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Available Offers Carousel / Drawer */}
                  {showOffers && (
                    <div className="mt-3 p-3 bg-orange-50/60 border border-orange-200/70 rounded-xl space-y-2">
                      <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-orange-500" />
                        <span>Available Store Coupons:</span>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {availableCoupons
                          .filter((c) => c.isActive)
                          .map((coupon) => {
                            const isEligible =
                              !coupon.minOrderValue || subtotal >= coupon.minOrderValue;
                            const isCurrent = appliedCoupon?.id === coupon.id;
                            return (
                              <div
                                key={coupon.id}
                                className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between gap-2 ${
                                  isCurrent
                                    ? "bg-emerald-100/70 border-emerald-300"
                                    : "bg-white border-orange-100 hover:border-orange-300"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] font-black text-stone-900 tracking-wider bg-orange-100/80 px-1.5 py-0.5 rounded border border-orange-200">
                                      {coupon.code}
                                    </span>
                                    <span className="text-[11px] font-extrabold text-orange-600">
                                      {coupon.discountType === "percentage"
                                        ? `${coupon.discountValue}% OFF`
                                        : `₹${coupon.discountValue} FLAT`}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-stone-600 truncate mt-0.5">
                                    {coupon.description ||
                                      (coupon.minOrderValue
                                        ? `Orders above ₹${coupon.minOrderValue}`
                                        : "Valid on all orders")}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={isCurrent}
                                  onClick={() => handleApplyCoupon(coupon.code)}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold cursor-pointer transition-all ${
                                    isCurrent
                                      ? "text-emerald-700 bg-emerald-200/60"
                                      : isEligible
                                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
                                      : "bg-stone-200 text-stone-500 hover:bg-stone-300"
                                  }`}
                                >
                                  {isCurrent ? "Applied" : "Apply"}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-stone-200 text-xs sm:text-sm">
                  <div className="flex justify-between text-stone-500 font-medium">
                    <span>Total MRP</span>
                    <span className="line-through">₹{totalMRP}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Product Discount</span>
                    <span>− ₹{totalSavings}</span>
                  </div>
                  {couponDiscount > 0 && appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/80">
                      <span className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                        Coupon ({appliedCoupon.code})
                      </span>
                      <span>− ₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-700 font-semibold">
                    <span>Delivery Charges</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <strong className="text-emerald-600">FREE</strong>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base sm:text-lg font-black text-stone-950">
                    <span>Total Amount</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Place Order Submit Button */}
                <button
                  type="submit"
                  className="mt-5 w-full py-3.5 px-6 rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Place Order • ₹{grandTotal}
                </button>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-[11px] font-semibold text-stone-500 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4 text-orange-500" />
                    <span>100% Genuine</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <TruckIcon className="w-4 h-4 text-orange-500" />
                    <span>Fast Dispatch</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <CreditCardIcon className="w-4 h-4 text-orange-500" />
                    <span>Safe Checkout</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}
