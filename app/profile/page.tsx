"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import {
  UserIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
} from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/lib/supabase";
import { ALL_PRODUCTS, ProductDetailItem } from "@/data/products";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderRecord {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, openLoginModal, openSignUpModal, signOut } =
    useAuth();
  const {
    wishlist,
    totalWishlistCount,
    totalCartCount,
    setWishlistDrawerOpen,
    setCartDrawerOpen,
    addToCart,
    toggleWishlist,
  } = useStore();

  const wishlistedProducts = ALL_PRODUCTS.filter((p) =>
    wishlist.includes(p.id)
  );

  const [activeTab, setActiveTab] = useState<
    "details" | "orders" | "wishlist" | "security"
  >("details");

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [primarySport, setPrimarySport] = useState("Gym & Fitness");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Password Change States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // User Orders
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Auto-switch tab based on URL query param (e.g. ?tab=orders)
  useEffect(() => {
    const handleUrlTab = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (
          tab === 'orders' ||
          tab === 'wishlist' ||
          tab === 'security' ||
          tab === 'details'
        ) {
          setActiveTab(tab as any);
        }
      }
    };
    handleUrlTab();
    window.addEventListener('popstate', handleUrlTab);
    return () => window.removeEventListener('popstate', handleUrlTab);
  }, []);

  // Sync initial user data
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
      setPrimarySport(user.user_metadata?.primary_sport || "Gym & Fitness");
      setAddress(user.user_metadata?.address || "");
      setCity(user.user_metadata?.city || "");
      setStateName(user.user_metadata?.state || "");
      setPincode(user.user_metadata?.pincode || "");

      // Fetch user orders from Supabase
      async function fetchUserOrders() {
        if (!user) return;
        setLoadingOrders(true);
        try {
          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data) {
            setOrders(data as OrderRecord[]);
          }
        } catch (e) {
          console.warn("Failed to fetch user orders:", e);
        } finally {
          setLoadingOrders(false);
        }
      }

      fetchUserOrders();
    }
  }, [user]);

  // Handle Save Profile Information
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          primary_sport: primarySport,
          address: address.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
      });

      if (error) {
        setSaveError(error.message);
      } else {
        setSaveSuccess("Profile details saved successfully!");
        setTimeout(() => setSaveSuccess(null), 4000);
      }
    } catch (err: any) {
      setSaveError(err?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(null), 4000);
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <TopBar />
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm font-semibold text-stone-600">
              Loading your profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <TopBar />
      <Navbar />

      <main className="flex-1 pb-16 sm:pb-24">
        {/* ========================================================= */}
        {/* HERO BANNER SECTION                                       */}
        {/* ========================================================= */}
        <section className="relative w-full bg-[#0d0d0d] text-white py-10 sm:py-14 border-b border-stone-800 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src="/Hero-16-9.jpg"
              alt="M.art Athlete Profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-3">
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-orange-400">My Profile</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
                  <span className="text-[11px] font-extrabold tracking-widest text-orange-400 uppercase">
                    Member Dashboard
                  </span>
                  <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  My Athlete Profile
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
                  Manage your personal details, order history, default shipping addresses, and security settings.
                </p>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="self-start md:self-center px-4 py-2 rounded-full border border-stone-700 hover:border-red-500/60 bg-stone-900/80 hover:bg-red-500/10 text-stone-300 hover:text-red-400 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA                                         */}
        {/* ========================================================= */}
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 mt-8 sm:mt-10">
          {!user ? (
            /* Logged-Out Prompt Card */
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
                <UserIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Sign In to View Your Profile
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 mb-6 leading-relaxed max-w-md mx-auto">
                Access your orders, track shipments in real-time, view your wishlist, and unlock member discounts across all fitness gear.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-orange-500/25 transition-all cursor-pointer"
                >
                  Sign In to Account
                </button>
                <button
                  type="button"
                  onClick={openSignUpModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-stone-300 hover:border-orange-500 text-stone-800 hover:text-orange-600 bg-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Create Free Account
                </button>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-8 border-t border-stone-100 text-left">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-sm">✓</span>
                  <span className="text-[11px] font-semibold text-stone-600">
                    Order Tracking
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-sm">✓</span>
                  <span className="text-[11px] font-semibold text-stone-600">
                    Saved Addresses
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-sm">✓</span>
                  <span className="text-[11px] font-semibold text-stone-600">
                    VIP Discounts
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Logged-In User Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
              
              {/* Left Column: Athlete Profile Card & Tab Switcher */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm text-center">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
                    {user.user_metadata?.full_name
                      ? user.user_metadata.full_name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase() || "U"}
                    <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
                      ✓
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-stone-900 mt-4 leading-tight">
                    {user.user_metadata?.full_name || "M.art Athlete"}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 truncate">
                    {user.email}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 text-[11px] font-extrabold">
                    <span>★</span>
                    <span>Verified M.art Member</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-stone-100 text-left">
                    <Link
                      href="/wishlist"
                      className="bg-stone-50 hover:bg-orange-50/60 p-2.5 rounded-xl border border-stone-200/70 hover:border-orange-300 transition-colors block cursor-pointer group"
                    >
                      <span className="text-[10px] text-stone-500 group-hover:text-orange-600 font-bold uppercase tracking-wider block">
                        Wishlist
                      </span>
                      <span className="text-sm font-black text-stone-900 mt-0.5 block">
                        {totalWishlistCount} items
                      </span>
                    </Link>
                    <Link
                      href="/cart"
                      className="bg-stone-50 hover:bg-orange-50/60 p-2.5 rounded-xl border border-stone-200/70 hover:border-orange-300 transition-colors block cursor-pointer group"
                    >
                      <span className="text-[10px] text-stone-500 group-hover:text-orange-600 font-bold uppercase tracking-wider block">
                        Cart
                      </span>
                      <span className="text-sm font-black text-stone-900 mt-0.5 block">
                        {totalCartCount} items
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Vertical Navigation Tabs */}
                <div className="bg-white rounded-3xl p-3 border border-stone-200/90 shadow-sm space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "details"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs"
                        : "text-stone-700 hover:bg-stone-50 hover:text-orange-600"
                    }`}
                  >
                    Personal Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "orders"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs"
                        : "text-stone-700 hover:bg-stone-50 hover:text-orange-600"
                    }`}
                  >
                    Order History
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "wishlist"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs"
                        : "text-stone-700 hover:bg-stone-50 hover:text-orange-600"
                    }`}
                  >
                    Saved Wishlist ({totalWishlistCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "security"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs"
                        : "text-stone-700 hover:bg-stone-50 hover:text-orange-600"
                    }`}
                  >
                    Security & Password
                  </button>
                </div>
              </div>

              {/* Right Column: Tab Content */}
              <div className="lg:col-span-8 xl:col-span-9">
                
                {/* 1. PERSONAL DETAILS TAB */}
                {activeTab === "details" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
                    <div className="border-b border-stone-200/80 pb-4 mb-6">
                      <h3 className="text-lg sm:text-xl font-black text-stone-900">
                        Personal Information & Address
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Keep your contact and shipping information updated for quick 1-click checkout.
                      </p>
                    </div>

                    {saveSuccess && (
                      <div className="p-3.5 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                        <span>✓</span>
                        <span>{saveSuccess}</span>
                      </div>
                    )}

                    {saveError && (
                      <div className="p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
                        <span>✕</span>
                        <span>{saveError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            disabled
                            value={user.email || ""}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 text-xs sm:text-sm font-semibold cursor-not-allowed"
                          />
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            Your verified login email address
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            Primary Fitness Focus
                          </label>
                          <select
                            value={primarySport}
                            onChange={(e) => setPrimarySport(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900 cursor-pointer"
                          >
                            <option value="Gym & Fitness">Gym &amp; Strength Training</option>
                            <option value="Athletics & Running">Athletics &amp; Running</option>
                            <option value="Football & Field Sports">Football &amp; Team Sports</option>
                            <option value="Yoga & Wellness">Yoga &amp; Mobility</option>
                            <option value="CrossFit & Agility">CrossFit &amp; Agility Drills</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          Default Shipping Address
                        </label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House/Flat number, Street name, Apartment/Colony..."
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. New Delhi"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            State
                          </label>
                          <input
                            type="text"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            placeholder="e.g. Delhi"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="110001"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                        >
                          {isSaving && (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          )}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 2. ORDER HISTORY TAB */}
                {activeTab === "orders" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
                    <div className="border-b border-stone-200/80 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                      <div>
                        <h3 className="text-base sm:text-xl font-black text-stone-900">
                          Order History
                        </h3>
                        <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                          View details of your past sports &amp; gym equipment purchases.
                        </p>
                      </div>
                      <Link
                        href="/products"
                        className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline whitespace-nowrap shrink-0"
                      >
                        <span>Shop More Gear</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>

                    {loadingOrders ? (
                      <div className="py-12 text-center text-xs font-semibold text-stone-500">
                        Loading your orders...
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs font-bold text-stone-900">
                                  Order #{ord.id.slice(0, 8).toUpperCase()}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                                  {ord.status || "Confirmed"}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500">
                                Placed on{" "}
                                {new Date(ord.created_at).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-base font-black text-stone-900">
                                ₹{ord.total_amount}
                              </span>
                              <span className="text-xs text-stone-400">
                                ({ord.items?.length || 1} items)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                          <ShoppingCartIcon className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">
                          No Orders Placed Yet
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 mb-4">
                          Explore our fitness essentials and place your first order today!
                        </p>
                        <Link
                          href="/products"
                          className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-xs hover:shadow-orange-500/25 transition-all"
                        >
                          Explore Store
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. WISHLIST TAB */}
                {activeTab === "wishlist" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
                    <div className="border-b border-stone-200/80 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <div>
                        <h3 className="text-base sm:text-xl font-black text-stone-900">
                          My Saved Wishlist
                        </h3>
                        <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                          Equipment and accessories you have bookmarked for later.
                        </p>
                      </div>
                      <span className="self-start sm:self-auto text-xs font-bold text-orange-600 whitespace-nowrap shrink-0">
                        {wishlistedProducts.length} Saved Items
                      </span>
                    </div>

                    {wishlistedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {wishlistedProducts.map((item: ProductDetailItem) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-2xl border border-stone-200 bg-white hover:border-orange-400 transition-all flex flex-col justify-between"
                          >
                            <div className="relative aspect-square w-full rounded-xl bg-stone-50 overflow-hidden mb-3">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                                {item.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1 mb-3">
                                <span className="font-black text-stone-950 text-sm">
                                  ₹{item.price}
                                </span>
                                <span className="text-xs text-stone-400 line-through">
                                  ₹{item.originalPrice}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => addToCart(item.id, 1, undefined, false)}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs transition-all shadow-xs"
                              >
                                Add to Cart
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleWishlist(item.id)}
                                className="p-1.5 rounded-xl border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors"
                                aria-label="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                          <HeartIcon className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">
                          Your Wishlist is Empty
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 mb-4">
                          Browse through our catalog and tap the heart icon on any gear to save it here.
                        </p>
                        <Link
                          href="/products"
                          className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-xs"
                        >
                          Discover Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SECURITY & PASSWORD TAB */}
                {activeTab === "security" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm max-w-xl">
                    <div className="border-b border-stone-200/80 pb-4 mb-6">
                      <h3 className="text-lg sm:text-xl font-black text-stone-900">
                        Account Security &amp; Password
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Update your password to keep your M.art account secure.
                      </p>
                    </div>

                    {passwordSuccess && (
                      <div className="p-3.5 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                        <span>✓</span>
                        <span>{passwordSuccess}</span>
                      </div>
                    )}

                    {passwordError && (
                      <div className="p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
                        <span>✕</span>
                        <span>{passwordError}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-stone-900"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                        >
                          {passwordLoading && (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          )}
                          <span>Update Password</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </main>

      <TrustStrip />
      <Footer />
    </div>
  );
}
