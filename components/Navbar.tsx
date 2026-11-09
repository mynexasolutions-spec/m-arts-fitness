"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SearchIcon,
  HeartIcon,
  ShoppingCartIcon,
  HomeIcon,
  GridIcon,
  MenuIcon,
  XIcon,
  UserIcon,
} from "./Icons";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

const NAV_CATEGORIES = [
  { label: "All Products", href: "/products", count: 6 },
  { label: "Gym Equipment", href: "/products?category=gym", count: 2 },
  { label: "Training Gear", href: "/products?category=training", count: 1 },
  { label: "Yoga & Wellness", href: "/products?category=yoga", count: 1 },
  { label: "Agility Tools", href: "/products?category=agility", count: 2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [navSearch, setNavSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "categories" | "wishlist" | "cart" | "menu">("home");
  const {
    totalCartCount,
    totalWishlistCount,
    setCartDrawerOpen,
    setWishlistDrawerOpen,
  } = useStore();

  const { user, openLoginModal, openSignUpModal, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  // Close user dropdown on route changes
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  // Lock body scroll only when drawer is active
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0d0d0d]/85 backdrop-blur-md shadow-md border-b border-white/10 w-full transition-colors">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-3 lg:gap-6 xl:gap-8">
            
            {/* Logo & Brand Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 shrink-0 transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/logo.png"
                  alt="M.art Sports & Fitness"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-extrabold text-xl sm:text-[22px] lg:text-2xl tracking-tight text-white leading-none group-hover:text-orange-500 transition-colors">
                  M.art
                </span>
                <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold tracking-wider text-orange-500 uppercase mt-0.5 whitespace-nowrap">
                  Sports &amp; Fitness
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-9 text-[15px] xl:text-[16px] font-semibold text-stone-300 tracking-normal shrink-0">
              <Link
                href="/"
                className={`py-1 transition-colors whitespace-nowrap ${
                  pathname === "/"
                    ? "text-orange-500 font-bold border-b-2 border-orange-500"
                    : "hover:text-orange-500"
                }`}
              >
                Home
              </Link>

              {/* Products Page Link (First Products, then Categories) */}
              <Link
                href="/products"
                className={`py-1 transition-colors whitespace-nowrap ${
                  pathname === "/products"
                    ? "text-orange-500 font-bold border-b-2 border-orange-500"
                    : "hover:text-orange-500"
                }`}
              >
                <span>Products</span>
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCategoriesDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 cursor-pointer hover:text-orange-500 text-stone-300 transition-colors py-1 whitespace-nowrap"
                >
                  <span>Categories</span>
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1 w-60 z-50">
                    <div className="bg-[#181818]/95 backdrop-blur-md rounded-2xl border border-stone-800 shadow-2xl p-2 space-y-1">
                      {NAV_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs xl:text-[13px] font-bold text-stone-300 hover:bg-stone-800 hover:text-orange-400 transition-colors"
                        >
                          <span>{cat.label}</span>
                          <span className="text-[10px] font-extrabold bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className={`py-1 transition-colors whitespace-nowrap ${
                  pathname === "/about"
                    ? "text-orange-500 font-bold border-b-2 border-orange-500"
                    : "hover:text-orange-500"
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`py-1 transition-colors whitespace-nowrap ${
                  pathname === "/contact"
                    ? "text-orange-500 font-bold border-b-2 border-orange-500"
                    : "hover:text-orange-500"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions: Search Box, Wishlist, Cart & Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
              {/* Search Box on Tablet/Desktop */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative hidden md:block w-40 lg:w-48 xl:w-60 2xl:w-72 transition-all"
              >
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search products..."
                  autoComplete="off"
                  suppressHydrationWarning
                  className="w-full pl-3.5 pr-9 py-2 text-xs sm:text-sm rounded-full border border-stone-700/80 bg-stone-900/80 hover:bg-stone-900 focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-white placeholder:text-stone-400 font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-400 p-0.5 cursor-pointer"
                  aria-label="Search"
                >
                  <SearchIcon className="w-4 h-4" />
                </button>
              </form>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 sm:p-2.5 text-stone-300 hover:text-orange-400 transition-colors rounded-full hover:bg-white/10 relative shrink-0 cursor-pointer"
                aria-label="Wishlist"
              >
                <HeartIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    totalWishlistCount > 0 ? "text-orange-500 fill-orange-500" : ""
                  }`}
                />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white font-bold text-[10px] sm:text-[11px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart with count badge */}
              <Link
                href="/cart"
                className="p-2 sm:p-2.5 text-stone-300 hover:text-orange-400 transition-colors rounded-full hover:bg-white/10 relative shrink-0 cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white font-bold text-[10px] sm:text-[11px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              </Link>

              {/* Desktop / Tablet Log In & Sign Up Buttons */}
              {!user ? (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-800">
                  <button
                    type="button"
                    onClick={openLoginModal}
                    className="px-3.5 py-1.5 text-xs xl:text-sm font-bold text-stone-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={openSignUpModal}
                    className="px-4 py-1.5 text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full shadow-md hover:shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="relative hidden sm:block pl-2 border-l border-stone-800">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-1.5 pr-3.5 rounded-full bg-orange-500/15 hover:bg-orange-500 border border-orange-500 text-orange-400 hover:text-white transition-all cursor-pointer shadow-xs hover:shadow-orange-500/25 group"
                    aria-label="View Athlete Profile"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center uppercase shadow-sm group-hover:scale-105 transition-transform">
                      {user.user_metadata?.full_name
                        ? user.user_metadata.full_name.charAt(0).toUpperCase()
                        : user.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-xs font-bold max-w-[100px] truncate text-orange-200 group-hover:text-white">
                      {user.user_metadata?.full_name ||
                        user.email?.split("@")[0] ||
                        "Profile"}
                    </span>
                  </Link>
                </div>
              )}

              {/* Mobile User Icon (< sm) */}
              <Link
                href={user ? "/profile" : "#"}
                onClick={
                  user
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        openLoginModal();
                      }
                }
                className="p-2 sm:hidden text-orange-500 hover:text-orange-400 transition-colors rounded-full hover:bg-orange-500/15 cursor-pointer"
                aria-label="Account Profile"
              >
                <UserIcon className="w-5 h-5 text-orange-500" />
              </Link>

              {/* 3-Line Hamburger Trigger for Slide-over Sidebar Drawer */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="p-2 lg:hidden text-stone-300 hover:text-orange-400 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                aria-label="Open Navigation Sidebar"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. SLIDE-OVER SIDEBAR DRAWER (Mobile & Tablet < lg)        */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Dark Backdrop Overlay */}
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Sidebar Panel sliding from Right */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-[#141414] text-white shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-out transform ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-[#181818]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="M.art Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white leading-tight">
                  M.art
                </span>
                <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">
                  Sports &amp; Fitness
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close Sidebar"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content - Primary Nav Links + Expandable Categories */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="flex flex-col space-y-1.5">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors ${
                  pathname === "/"
                    ? "text-orange-500 bg-orange-950/40 font-bold"
                    : "text-stone-300 hover:bg-stone-800/60 hover:text-orange-400"
                }`}
              >
                <span>Home</span>
              </Link>

              {/* Products (First Products, then Categories) */}
              <Link
                href="/products"
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors ${
                  pathname === "/products"
                    ? "text-orange-500 bg-orange-950/40 font-bold"
                    : "text-stone-300 hover:bg-stone-800/60 hover:text-orange-400"
                }`}
              >
                <span>Products</span>
              </Link>

              {/* Expandable Categories Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors cursor-pointer ${
                    mobileCategoriesOpen
                      ? "text-orange-500 bg-orange-950/40 font-bold"
                      : "text-stone-300 hover:bg-stone-800/60 hover:text-orange-400"
                  }`}
                >
                  <span>Categories</span>
                </button>

                {mobileCategoriesOpen && (
                  <div className="pl-4 pr-2 py-1.5 space-y-1">
                    {NAV_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-300 hover:bg-stone-800 hover:text-orange-400 transition-colors"
                      >
                        <span>{cat.label}</span>
                        <span className="text-[10px] font-extrabold bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">
                          {cat.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors ${
                      isActive
                        ? "text-orange-500 bg-orange-950/40 font-bold"
                        : "text-stone-300 hover:bg-stone-800/60 hover:text-orange-400"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Drawer Auth Footer: Log In & Sign Up buttons or user info */}
          <div className="p-4 border-t border-stone-800 bg-[#181818]">
            {!user ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    openLoginModal();
                  }}
                  className="w-full py-2.5 px-4 text-sm font-bold text-stone-200 bg-[#242424] border border-stone-700 hover:border-orange-500 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    openSignUpModal();
                  }}
                  className="w-full py-2.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all cursor-pointer shadow-md text-center"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-orange-500/15 border border-orange-500/60 hover:bg-orange-500/25 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center uppercase shadow-xs">
                    {user.user_metadata?.full_name
                      ? user.user_metadata.full_name.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {user.user_metadata?.full_name || "M.art Member"}
                    </p>
                    <p className="text-xs text-orange-400 font-semibold group-hover:underline">
                      View Athlete Profile
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setDrawerOpen(false);
                    await signOut();
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-red-400 bg-red-950/40 hover:bg-red-900/50 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. APP-LIKE BOTTOM NAVIGATION BAR (Mobile < md)           */}
      {/* ========================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1 px-2 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === "home" ? "text-orange-600" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <HomeIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold leading-tight">Home</span>
          </Link>

          {/* 2. Categories */}
          <Link
            href="/#categories"
            onClick={() => setActiveTab("categories")}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === "categories" ? "text-orange-600" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <GridIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold leading-tight">Categories</span>
          </Link>

          {/* 3. Wishlist */}
          <Link
            href="/wishlist"
            onClick={() => setActiveTab("wishlist")}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === "/wishlist" || activeTab === "wishlist"
                ? "text-orange-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <HeartIcon
              className={`w-5 h-5 mb-0.5 ${
                totalWishlistCount > 0 ? "text-orange-500 fill-orange-500" : ""
              }`}
            />
            <span className="text-[10px] font-semibold leading-tight">Wishlist</span>
            <span
              className={`absolute top-0 right-3 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                totalWishlistCount > 0
                  ? "bg-orange-500 text-white"
                  : "bg-stone-300 text-stone-700"
              }`}
            >
              {totalWishlistCount}
            </span>
          </Link>

          {/* 4. Cart */}
          <Link
            href="/cart"
            onClick={() => setActiveTab("cart")}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              pathname === "/cart" || activeTab === "cart"
                ? "text-orange-600"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <ShoppingCartIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold leading-tight">Cart</span>
            <span className="absolute top-0 right-3 bg-orange-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
              {totalCartCount}
            </span>
          </Link>

          {/* 5. Menu / Sidebar trigger */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("menu");
              setDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              drawerOpen ? "text-orange-600" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <MenuIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold leading-tight">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
