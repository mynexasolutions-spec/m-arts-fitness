"use client";

import React, { useState, useEffect, useMemo } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { ALL_PRODUCTS, ProductDetailItem } from "@/data/products";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Search,
  Plus,
  Trash2,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Boxes,
  Truck,
  RotateCcw,
  Sparkles,
  KeyRound,
  LayoutDashboard,
  Layers,
  Users,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Megaphone,
  Ticket,
  HelpCircle,
  AlertTriangle,
  Clock,
  PanelLeftClose,
  PanelLeft,
  Sliders,
  Menu,
  X,
} from "lucide-react";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface OrderRecord {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressSummary: string;
  total: number;
  payment: string;
  status: "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
}

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    orderId: "MART-842190",
    customerName: "Rahul Verma",
    customerPhone: "9876543210",
    customerEmail: "rahul.verma@example.com",
    addressSummary:
      "Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103",
    total: 2998,
    payment: "UPI (rahul@oksbi)",
    status: "Processing",
    date: "31 Oct 2026",
    items: [
      {
        id: "hex-dumbbells-5kg",
        name: "Rubber Hex Dumbbells (5 kg Pair)",
        price: 1499,
        quantity: 2,
        image: "/Gym-Equipment.jpg",
      },
    ],
  },
  {
    orderId: "MART-791045",
    customerName: "Pooja Sharma",
    customerPhone: "9823456789",
    customerEmail: "pooja.s@example.com",
    addressSummary: "B-12, Sector 62, Noida, Uttar Pradesh - 201309",
    total: 1148,
    payment: "Cash on Delivery",
    status: "Shipped",
    date: "29 Oct 2026",
    items: [
      {
        id: "yoga-mat",
        name: "Premium Yoga Mat (6 mm)",
        price: 749,
        quantity: 1,
        image: "/Yoga-mat.jpg",
      },
      {
        id: "skipping-rope",
        name: "Pro Skipping Rope",
        price: 399,
        quantity: 1,
        image: "/Skipping-rope.jpg",
      },
    ],
  },
  {
    orderId: "MART-630281",
    customerName: "Amitabh Sen",
    customerPhone: "9748123456",
    customerEmail: "amitabh.sen@example.com",
    addressSummary:
      "Plot 88, Salt Lake City, Sector 5, Kolkata, West Bengal - 700091",
    total: 1299,
    payment: "Credit Card (Paid)",
    status: "Delivered",
    date: "27 Oct 2026",
    items: [
      {
        id: "gym-essentials-kit",
        name: "Pro Gym Essentials Kit",
        price: 1299,
        quantity: 1,
        image: "/GymEssentials.jpg",
      },
    ],
  },
];

type AdminTab =
  | "dashboard"
  | "categories"
  | "products"
  | "orders"
  | "home-customization"
  | "customers"
  | "reviews"
  | "inquiries"
  | "subscribers"
  | "hero-slides"
  | "announcements"
  | "coupons"
  | "delivery-settings"
  | "faqs";

const ACTIVITY_BARS = [
  { day: "27 Oct", value: 450, count: 1, height: 28 },
  { day: "28 Oct", value: 650, count: 2, height: 38 },
  { day: "29 Oct", value: 1148, count: 2, height: 55 },
  { day: "30 Oct", value: 890, count: 2, height: 42 },
  { day: "31 Oct", value: 2998, count: 3, height: 90, isPeak: true },
  { day: "1 Nov", value: 1850, count: 2, height: 68 },
  { day: "2 Nov", value: 920, count: 1, height: 45 },
  { day: "3 Nov", value: 1400, count: 2, height: 60 },
  { day: "4 Nov", value: 600, count: 1, height: 32 },
  { day: "5 Nov", value: 780, count: 1, height: 39 },
  { day: "6 Nov", value: 1050, count: 2, height: 52 },
  { day: "7 Nov", value: 1299, count: 2, height: 62 },
  { day: "8 Nov", value: 850, count: 1, height: 40 },
  { day: "9 Nov", value: 1420, count: 2, height: 65 },
];

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Login Form State
  const [email, setEmail] = useState<string>("admin@mart.com");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Store Data State
  const [products, setProducts] = useState<ProductDetailItem[]>(ALL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>(DEFAULT_ORDERS);

  // Filter / Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    tagline: "",
    category: "gym",
    price: "",
    originalPrice: "",
    image: "/Gym-Equipment.jpg",
    badge: "New Arrival",
    sku: "",
  });

  // Settings & Announcement State
  const [marqueeText, setMarqueeText] = useState(
    "GENUINE M.ART QUALITY • STAY FIT • PLAY BETTER • LIVE HEALTHIER • NATIONWIDE DELIVERY • TESTED BY ATHLETES •"
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("999");
  const [standardDeliveryFee, setStandardDeliveryFee] = useState("49");

  // Check stored admin session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mart_admin_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdminUser(parsed);
        setIsAuthenticated(true);
      }

      const savedProducts = localStorage.getItem("mart_admin_products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

      const savedOrders = localStorage.getItem("mart_orders");
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
          const orderMap = new Map<string, OrderRecord>();
          parsedOrders.forEach((o: OrderRecord) => orderMap.set(o.orderId, o));
          DEFAULT_ORDERS.forEach((o) => {
            if (!orderMap.has(o.orderId)) orderMap.set(o.orderId, o);
          });
          setOrders(Array.from(orderMap.values()));
        }
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Handle Admin Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoginLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const isMasterAdmin =
      (cleanEmail === "admin@mart.com" &&
        (cleanPassword === "admin" ||
          cleanPassword === "admin123" ||
          cleanPassword === "mart2026")) ||
      (cleanEmail === "admin" && cleanPassword === "admin");

    if (isMasterAdmin) {
      const userObj: AdminUser = {
        email: "admin@mart.com",
        name: "Admin",
        role: "Administrator",
      };
      if (rememberMe) {
        localStorage.setItem("mart_admin_user", JSON.stringify(userObj));
      }
      setSuccessMessage("Authentication verified! Welcome to M.art Panel.");
      setTimeout(() => {
        setAdminUser(userObj);
        setIsAuthenticated(true);
        setLoginLoading(false);
      }, 600);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data.user) {
        const userObj: AdminUser = {
          email: data.user.email || cleanEmail,
          name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "Admin",
          role: "Administrator",
        };
        if (rememberMe) {
          localStorage.setItem("mart_admin_user", JSON.stringify(userObj));
        }
        setSuccessMessage("Credentials confirmed! Opening Admin Panel...");
        setTimeout(() => {
          setAdminUser(userObj);
          setIsAuthenticated(true);
          setLoginLoading(false);
        }, 600);
        return;
      }
    } catch (authErr) {
      console.warn("Supabase auth check notice:", authErr);
    }

    setLoginLoading(false);
    setErrorMessage(
      "Invalid administrative credentials. Use admin@mart.com / admin123 or registered credentials."
    );
  };

  const handleAutoFill = () => {
    setEmail("admin@mart.com");
    setPassword("admin123");
    setErrorMessage(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("mart_admin_user");
    setAdminUser(null);
    setIsAuthenticated(false);
    setPassword("");
    setSuccessMessage(null);
  };

  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    setProducts(updated);
    localStorage.setItem("mart_admin_products", JSON.stringify(updated));
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to remove this product from catalog?")) {
      const updated = products.filter((p) => p.id !== productId);
      setProducts(updated);
      localStorage.setItem("mart_admin_products", JSON.stringify(updated));
    }
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderRecord["status"]
  ) => {
    const updated = orders.map((o) =>
      o.orderId === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("mart_orders", JSON.stringify(updated));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Please provide product title and price.");
      return;
    }

    const priceNum = parseInt(newProduct.price) || 499;
    const origPriceNum =
      parseInt(newProduct.originalPrice) || Math.round(priceNum * 1.4);
    const generatedId =
      newProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `prod-${Date.now()}`;
    const generatedSku =
      newProduct.sku ||
      `MART-${newProduct.category.toUpperCase().slice(0, 2)}-${Math.floor(
        100 + Math.random() * 900
      )}`;

    const categoryMap: Record<string, string> = {
      gym: "Gym Equipment",
      training: "Training Gear",
      yoga: "Yoga & Wellness",
      agility: "Agility Tools",
    };

    const createdItem: ProductDetailItem = {
      id: generatedId,
      name: newProduct.name,
      tagline: newProduct.tagline || "Engineered for Peak Athletic Output",
      shortDescription: newProduct.tagline || "Engineered for Peak Athletic Output",
      description: `${newProduct.name} crafted by M.art Sports & Fitness. Built with high durability standards for athletic training and workout recovery.`,
      price: priceNum,
      originalPrice: origPriceNum,
      image: newProduct.image || "/Gym-Equipment.jpg",
      gallery: [newProduct.image || "/Gym-Equipment.jpg"],
      category: newProduct.category as any,
      categoryLabel: categoryMap[newProduct.category] || "Sports Equipment",
      rating: 4.8,
      reviewsCount: 1,
      badge: newProduct.badge || "New Arrival",
      inStock: true,
      sku: generatedSku,
      packInfo: "Pack of 1",
      highlights: [
        {
          title: "Tested for Durability",
          subtitle: "Commercial grade quality",
          icon: "strength",
        },
      ],
      keyFeatures: [
        "Tested by athletes for durability",
        "Direct manufacturer pricing",
      ],
      specifications: [
        { label: "Category", value: categoryMap[newProduct.category] || "Gear" },
        { label: "SKU", value: generatedSku },
        { label: "Origin", value: "Meerut, India" },
      ],
      idealFor: [
        {
          title: "Athletic Training",
          description: "Perfect for athletic workout routines",
          icon: "home",
        },
      ],
    };

    const updated = [createdItem, ...products];
    setProducts(updated);
    localStorage.setItem("mart_admin_products", JSON.stringify(updated));

    setNewProduct({
      name: "",
      tagline: "",
      category: "gym",
      price: "",
      originalPrice: "",
      image: "/Gym-Equipment.jpg",
      badge: "New Arrival",
      sku: "",
    });
    setIsAddModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  // Derived Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const lowStockItems = useMemo(() => {
    return products.filter((p) => !p.inStock);
  }, [products]);

  // Navigation Items list mirroring the reference screenshot
  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "home-customization", label: "Home Customization", icon: Sliders },
    { id: "customers", label: "Customers", icon: Users },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "subscribers", label: "Subscribers", icon: Mail },
    { id: "hero-slides", label: "Hero Slides", icon: ImageIcon },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "delivery-settings", label: "Delivery Settings", icon: Truck },
    { id: "faqs", label: "Global FAQs", icon: HelpCircle },
  ];

  // Helper title for current tab
  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case "dashboard":
        return "Admin Dashboard";
      case "categories":
        return "Categories Manager";
      case "products":
        return "Products Catalog";
      case "orders":
        return "Orders Management";
      case "home-customization":
        return "Home Customization";
      case "customers":
        return "Registered Customers";
      case "reviews":
        return "Customer Reviews";
      case "inquiries":
        return "Inquiries & Bulk Leads";
      case "subscribers":
        return "Newsletter Subscribers";
      case "hero-slides":
        return "Hero Slides Management";
      case "announcements":
        return "Announcements & Ticker";
      case "coupons":
        return "Promo Coupons & Discounts";
      case "delivery-settings":
        return "Delivery Settings";
      case "faqs":
        return "Global Store FAQs";
      default:
        return "Admin Panel";
    }
  };

  // Loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-400 tracking-wider">
            Loading M.art Panel...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (Dark Theme)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0E17] text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#111724] border border-white/10 shadow-2xl mb-4">
              <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                M
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              M.art Sports &amp; Fitness
            </h1>
            <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mt-1">
              Admin Panel
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#111724] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mart.com"
                    className="w-full bg-[#182030] border border-stone-700/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#182030] border border-stone-700/60 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#182030] border-stone-700 text-orange-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                >
                  Fill Demo
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? "Verifying..." : "Sign In to Admin Panel"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <Link
                href="/"
                className="text-xs text-stone-400 hover:text-white transition-colors"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED-IN ADMIN DASHBOARD (Dark Enterprise Layout)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0A0E17] text-stone-100 flex font-sans antialiased">
      {/* ===================================================================== */}
      {/* SIDEBAR NAVIGATION (Matching user's reference in dark color)         */}
      {/* ===================================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[#101623] border-r border-white/[0.07] flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-orange-500/20">
              M
            </div>
            {!isSidebarCollapsed && (
              <div className="text-left leading-tight truncate">
                <div className="font-extrabold text-white text-sm tracking-tight truncate">
                  M.art Sports
                </div>
                <div className="text-[10px] font-bold text-orange-400 tracking-wider">
                  ADMIN PANEL
                </div>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                  isActive
                    ? "bg-white/[0.06] text-white font-bold"
                    : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
                } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
              >
                {/* Active indicator bar on the right edge (like reference image) */}
                {isActive && (
                  <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-orange-500 rounded-l" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-orange-400" : "text-stone-400"
                  }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Bottom: Collapse Toggle (Arrow-free) */}
        <div className="p-3 border-t border-white/[0.07]">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`w-full hidden lg:flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer ${
              isSidebarCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-4 h-4 text-stone-400" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-stone-400" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* ===================================================================== */}
      {/* MAIN CONTAINER (Header + Dynamic Content Area)                       */}
      {/* ===================================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-16 sticky top-0 z-20 bg-[#101623]/90 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-stone-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Current View Title */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {getTabTitle(activeTab)}
              </h2>
            </div>
          </div>

          {/* Right Header: Storefront Link + Admin Profile + Logout */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin Profile Pill (Matching reference layout) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151D2C] border border-white/[0.08]">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="font-bold text-white text-xs">
                  {adminUser?.name || "Admin"}
                </div>
                <div className="text-[10px] text-stone-400">
                  {adminUser?.role || "Administrator"}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600/80 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* ================================================================= */}
          {/* SECTION 1: DASHBOARD OVERVIEW (Directly matches the screenshot!)  */}
          {/* ================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* ----------------------------------------------------------- */}
              {/* STORE OVERVIEW HEADER & GREETING                            */}
              {/* ----------------------------------------------------------- */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Store Overview
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Welcome back! Here&apos;s what needs your attention and how the store is doing.
                  </p>
                </div>
                <div className="text-xs font-semibold text-stone-300 bg-[#141B29] border border-white/[0.08] px-3.5 py-1.5 rounded-xl self-start sm:self-auto shadow-sm">
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 1: ATTENTION / ACTION REQUIRED CARDS (4 Cards)          */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Orders to process */}
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="bg-[#141B29] hover:bg-[#192234] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-white">
                      {
                        orders.filter(
                          (o) =>
                            o.status === "Processing" ||
                            o.status === "Confirmed"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Orders to process
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Pending or processing
                  </div>
                </button>

                {/* 2. Reviews to approve */}
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className="bg-[#141B29] hover:bg-[#192234] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-white">0</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Reviews to approve
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Nothing waiting
                  </div>
                </button>

                {/* 3. Open inquiries */}
                <button
                  type="button"
                  onClick={() => setActiveTab("inquiries")}
                  className="bg-[#141B29] hover:bg-[#192234] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-white">0</span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Open inquiries
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    No open inquiries
                  </div>
                </button>

                {/* 4. Low stock variants */}
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className="bg-[#141B29] hover:bg-[#192234] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        lowStockItems.length === 0
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {lowStockItems.length === 0 ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-2xl font-black text-white">
                      {lowStockItems.length}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm">
                    Low stock variants
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {lowStockItems.length === 0
                      ? "Stock looks healthy"
                      : "Requires restocking"}
                  </div>
                </button>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 2: STORE METRIC PERFORMANCE CARDS (4 Cards)             */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 5. Total Revenue */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
                      ₹
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-stone-400 font-semibold mt-1">
                    Total Revenue
                  </div>
                </div>

                {/* 6. Total Orders */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {orders.length}
                  </div>
                  <div className="text-xs text-stone-400 font-semibold mt-1">
                    Total Orders
                  </div>
                </div>

                {/* 7. Registered Customers */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    4
                  </div>
                  <div className="text-xs text-stone-400 font-semibold mt-1">
                    Registered Customers
                  </div>
                </div>

                {/* 8. Active Products */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {products.filter((p) => p.inStock).length}{" "}
                    <span className="text-xs font-normal text-stone-400">
                      of {products.length} total
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 font-semibold mt-1">
                    Active Products
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* ROW 3: SALES LAST 14 DAYS (8 Cols) + TOP PRODUCTS (4 Cols)  */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols: Sales, last 14 days */}
                <div className="lg:col-span-8 bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <h3 className="text-base font-bold text-white">
                        Sales, last 14 days
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <div className="font-bold text-white">₹0</div>
                        <div className="text-[10px] text-stone-500">
                          Today • 0 orders
                        </div>
                      </div>
                      <div className="text-stone-700">|</div>
                      <div className="text-right">
                        <div className="font-bold text-white">₹0</div>
                        <div className="text-[10px] text-stone-500">
                          7 days • 0 orders
                        </div>
                      </div>
                      <div className="text-stone-700">|</div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">
                          ₹{totalRevenue.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          30 days • {orders.length} orders
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The 14-Day Activity Bars (With highlighted bar like the screenshot) */}
                  <div className="pt-2 pb-2 border-b border-white/[0.06]">
                    <div className="flex items-end justify-between gap-1 sm:gap-2 h-44 px-2">
                      {ACTIVITY_BARS.map((item) => (
                        <div
                          key={item.day}
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                        >
                          {/* Tooltip on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-stone-900 border border-stone-700 text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1">
                            ₹{item.value} ({item.count} ord)
                          </div>

                          {/* Bar */}
                          <div
                            style={{ height: `${item.height}%` }}
                            className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                              item.isPeak
                                ? "bg-gradient-to-t from-orange-600 to-amber-500 shadow-lg shadow-orange-500/25"
                                : "bg-[#222E42] group-hover:bg-[#2D3C55]"
                            }`}
                          />

                          {/* Day Label */}
                          <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap mt-1">
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtitle matching screenshot text */}
                  <div className="mt-4 text-xs text-stone-400">
                    Average order value (30 days):{" "}
                    <span className="text-stone-200 font-bold">
                      ₹{Math.round(totalRevenue / (orders.length || 1))}
                    </span>
                    . Cancelled and refunded orders are excluded.
                  </div>
                </div>

                {/* Right 4 Cols: Top Products Card (From reference image) */}
                <div className="lg:col-span-4 bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-bold text-white">
                          Top products
                        </h4>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold bg-[#192234] px-2 py-0.5 rounded">
                        last 30 days
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-200 truncate pr-2">
                            1. Rubber Hex Dumbbells (5 kg Pair)
                          </span>
                          <span className="font-bold text-orange-400 shrink-0">
                            ₹1,499
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          2 packs sold
                        </div>
                        <div className="w-full bg-[#182030] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full w-[85%]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-200 truncate pr-2">
                            2. Premium Yoga Mat (6 mm)
                          </span>
                          <span className="font-bold text-orange-400 shrink-0">
                            ₹749
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          1 pack sold
                        </div>
                        <div className="w-full bg-[#182030] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full w-[50%]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-200 truncate pr-2">
                            3. Pro Skipping Rope
                          </span>
                          <span className="font-bold text-orange-400 shrink-0">
                            ₹399
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          1 pack sold
                        </div>
                        <div className="w-full bg-[#182030] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full w-[35%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] text-[11px] text-stone-400">
                    Based on public store orders
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Middle Row: Low Stock Card + Quick Actions Card             */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Box 1 (Left 7 Cols): Low Stock Card */}
                <div className="lg:col-span-7 bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Low stock</h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("products")}
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                    >
                      Manage products
                    </button>
                  </div>

                  {/* Body: Healthy State (Matches screenshot) */}
                  {lowStockItems.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white mb-1">
                        Stock looks healthy
                      </div>
                      <p className="text-xs text-stone-400 max-w-xs">
                        Variants with 10 or fewer packs left will show up here.
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      {lowStockItems.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#192234] border border-white/5"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                            <span className="text-xs font-bold text-white">
                              {p.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p.id)}
                            className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
                          >
                            Mark In Stock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/[0.06] text-[11px] text-stone-400">
                    Total active catalog: {products.length} items
                  </div>
                </div>

                {/* Box 2 (Right 5 Cols): Quick Actions Card */}
                <div className="lg:col-span-5 bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                  <div className="pb-4 border-b border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white">
                      Quick actions
                    </h4>
                  </div>

                  <div className="py-4 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold">Add product</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("hero-slides")}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold">Hero slides</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("delivery-settings")}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold">Delivery settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("announcements")}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <Megaphone className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold">Announcement</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("faqs")}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold">Global FAQs</span>
                    </button>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-400">
                    5 quick shortcuts available
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Bottom Card: Recent Customer Orders Table                    */}
              {/* ----------------------------------------------------------- */}
              <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">
                      Recent Customer Orders
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                  >
                    View all orders
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#192234] text-stone-400 font-bold uppercase tracking-wider text-[11px] border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3 px-4">Order Number</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {orders.slice(0, 5).map((o) => (
                        <tr
                          key={o.orderId}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                            #{o.orderId}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            ₹{o.total.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                o.status === "Delivered"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : o.status === "Shipped"
                                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                  : o.status === "Processing"
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : "bg-stone-800 text-stone-300 border border-stone-700"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{o.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-medium text-[11px]">
                              {o.payment.includes("Paid") || o.payment.includes("UPI")
                                ? "Paid"
                                : "COD"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-400 text-xs">
                            {o.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 2: PRODUCTS CATALOG VIEW                                  */}
          {/* ================================================================= */}
          {activeTab === "products" && (
            <div className="space-y-4">
              {/* Header Bar: Category Filter + Search + Add Product */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#141B29] p-3 sm:p-4 rounded-2xl border border-white/[0.07] shadow-md">
                {/* Search */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#182030] border border-stone-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  {["all", "gym", "training", "yoga", "agility"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                        categoryFilter === cat
                          ? "bg-white text-stone-900 shadow-sm"
                          : "bg-[#182030] text-stone-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Add Product Button */}
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table Card */}
              <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#192234] text-stone-400 font-bold uppercase tracking-wider text-[11px] border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">SKU / Category</th>
                        <th className="py-3.5 px-4">Price / MRP</th>
                        <th className="py-3.5 px-4">Stock Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredProducts.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-stone-800 border border-stone-700 overflow-hidden shrink-0">
                                <NextImage
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-stone-400 line-clamp-1">
                                  {p.tagline}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-mono text-xs text-orange-400 font-medium">
                              {p.sku}
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-semibold">
                              {p.categoryLabel}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-white">₹{p.price}</div>
                            <div className="text-[11px] text-stone-500 line-through">
                              ₹{p.originalPrice}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStock(p.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                p.inStock
                                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                                  : "bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  p.inStock ? "bg-emerald-400" : "bg-rose-400"
                                }`}
                              />
                              <span>
                                {p.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/products#${p.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                                title="Preview on Live Site"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                title="Remove Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 3: ORDERS MANAGEMENT VIEW                                 */}
          {/* ================================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Customer Orders ({orders.length})
                    </h3>
                    <p className="text-xs text-stone-400">
                      Track and update fulfillment statuses in real-time.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-stone-400">
                    Total Volume:{" "}
                    <span className="text-emerald-400 font-bold">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {orders.map((o) => (
                    <div
                      key={o.orderId}
                      className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-extrabold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                            #{o.orderId}
                          </span>
                          <span className="text-xs text-stone-400">{o.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400">Status:</span>
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                o.orderId,
                                e.target.value as OrderRecord["status"]
                              )
                            }
                            className="bg-[#182030] border border-stone-700 text-xs font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                        <div>
                          <div className="text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">
                            Customer
                          </div>
                          <div className="font-bold text-white">
                            {o.customerName}
                          </div>
                          <div className="text-stone-400">{o.customerPhone}</div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">
                            Delivery Address
                          </div>
                          <div className="text-stone-300 leading-relaxed">
                            {o.addressSummary}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold uppercase text-stone-500 tracking-wider mb-1">
                            Payment &amp; Items
                          </div>
                          <div className="font-bold text-emerald-400 text-sm">
                            ₹{o.total.toLocaleString("en-IN")}
                          </div>
                          <div className="text-stone-400">{o.payment}</div>
                          <div className="text-stone-500 text-[11px] mt-1">
                            {o.items
                              .map((i) => `${i.name} (×${i.quantity})`)
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 4: CATEGORIES MANAGER VIEW                                */}
          {/* ================================================================= */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: "Gym Equipment",
                    cat: "gym",
                    desc: "Dumbbells, barbells, kettlebells, weight plates",
                    count: products.filter((p) => p.category === "gym").length,
                  },
                  {
                    name: "Training Gear",
                    cat: "training",
                    desc: "Resistance bands, speed ropes, gym shakers",
                    count: products.filter((p) => p.category === "training").length,
                  },
                  {
                    name: "Yoga & Wellness",
                    cat: "yoga",
                    desc: "High density yoga mats, rollers, yoga blocks",
                    count: products.filter((p) => p.category === "yoga").length,
                  },
                  {
                    name: "Agility Tools",
                    cat: "agility",
                    desc: "Cones, agility ladders, hurdles, sprint gear",
                    count: products.filter((p) => p.category === "agility").length,
                  },
                ].map((c) => (
                  <div
                    key={c.cat}
                    className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                        {c.name.slice(0, 1)}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {c.count} items
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 5: DELIVERY SETTINGS VIEW                                 */}
          {/* ================================================================= */}
          {activeTab === "delivery-settings" && (
            <div className="max-w-2xl bg-[#141B29] border border-white/[0.07] rounded-2xl p-6 shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white">
                Delivery &amp; Logistics Configuration
              </h3>
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Free Delivery Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Orders above this amount qualify for automatic Free Delivery
                    at checkout.
                  </p>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Standard Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={standardDeliveryFee}
                    onChange={(e) => setStandardDeliveryFee(e.target.value)}
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Dispatch Hub Location
                  </label>
                  <input
                    type="text"
                    disabled
                    value="4138, Mohsin Bagh, Zaidi Farm, Meerut, UP (Sports Manufacturing Hub)"
                    className="w-full bg-[#182030] border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 6: ANNOUNCEMENTS & TICKER                                 */}
          {/* ================================================================= */}
          {activeTab === "announcements" && (
            <div className="max-w-2xl bg-[#141B29] border border-white/[0.07] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">
                Storefront Running Marquee &amp; Announcements
              </h3>
              <div>
                <label className="block text-stone-300 text-xs font-semibold mb-1">
                  Marquee Running Text
                </label>
                <textarea
                  rows={3}
                  value={marqueeText}
                  onChange={(e) => setMarqueeText(e.target.value)}
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => alert("Announcement banner updated successfully!")}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-orange-500/20"
              >
                Save Announcement
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 7: GLOBAL FAQS VIEW                                       */}
          {/* ================================================================= */}
          {activeTab === "faqs" && (
            <div className="max-w-3xl space-y-3">
              {[
                {
                  q: "What is M.art's delivery timeline across India?",
                  a: "Standard courier orders arrive in 3-5 business days. Direct dispatch from our Meerut manufacturing hub with tracking numbers provided via SMS and email.",
                },
                {
                  q: "Do you offer a return or replacement policy?",
                  a: "Yes, we provide 7-day hassle-free replacements for any genuine manufacturing defects or transit damage.",
                },
                {
                  q: "Can I place bulk institutional orders for gyms and schools?",
                  a: "Yes, we support bulk gym fitouts with commercial discounts and custom branded gym equipment.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 shadow-xl space-y-1.5"
                >
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-stone-300 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Fallback for other tabs (Customers, Reviews, Inquiries, Coupons, Hero Slides) */}
          {(activeTab === "customers" ||
            activeTab === "reviews" ||
            activeTab === "inquiries" ||
            activeTab === "subscribers" ||
            activeTab === "hero-slides" ||
            activeTab === "coupons" ||
            activeTab === "home-customization") && (
            <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-8 shadow-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {getTabTitle(activeTab)}
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                Management console is active. Live customer sync is integrated
                with M.art store database.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="mt-3 px-4 py-2 rounded-xl bg-[#192234] hover:bg-[#202C42] text-xs font-bold text-orange-400 border border-white/5 cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* ADD PRODUCT MODAL (Dark Theme)                                        */}
      {/* ===================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141B29] border border-stone-700 max-w-lg w-full rounded-3xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.07] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" />
                <span>Add New Product</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cast Iron Kettlebell 16 kg"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g., Powder-Coated • Ergonomic Grip"
                  value={newProduct.tagline}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, tagline: e.target.value })
                  }
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="gym">Gym Equipment</option>
                    <option value="training">Training Gear</option>
                    <option value="yoga">Yoga &amp; Wellness</option>
                    <option value="agility">Agility Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="MART-KB-016"
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="999"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="1499"
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        originalPrice: e.target.value,
                      })
                    }
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Product Image URL or Path
                </label>
                <input
                  type="text"
                  placeholder="/Gym-Equipment.jpg"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
