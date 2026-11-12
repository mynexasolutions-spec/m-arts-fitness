"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { ReviewItem } from "@/data/reviews";
import { InquiryItem, DEFAULT_INQUIRIES } from "@/data/inquiries";
import { SubscriberItem, DEFAULT_SUBSCRIBERS } from "@/data/subscribers";
import { ALL_PRODUCTS, ProductDetailItem, generateVariantCombinations } from "@/data/products";
import {
  Coupon,
  DEFAULT_COUPONS,
  getStoredCoupons,
  saveStoredCoupons,
} from "@/data/coupons";
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
  ChevronDown,
  Pencil,
  Copy,
  Check,
  Tag,
  Calendar,
  RefreshCw,
  Phone,
  MapPin,
  LayoutGrid,
  List,
  Camera,
  Filter,
  IndianRupee,
  UserPlus,
  Printer,
} from "lucide-react";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";
import FAQsManager from "@/components/admin/FAQsManager";
import StoreCustomizationsManager from "@/components/admin/StoreCustomizationsManager";
import DeliverySettingsManager from "@/components/admin/DeliverySettingsManager";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  orderCount: number;
  totalSpend: number;
  createdAt: string;
  lastSignIn: string;
}

interface CustomerStats {
  totalUsers: number;
  totalSpend: number;
  repeatBuyers: number;
  newThisMonth: number;
}

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  desc?: string;
}

const DEFAULT_CATEGORIES: AdminCategory[] = [
  {
    id: "gym",
    name: "Gym Equipment",
    desc: "Dumbbells, barbells, kettlebells, weight plates",
  },
  {
    id: "training",
    name: "Training Gear",
    desc: "Resistance bands, speed ropes, gym shakers",
  },
  {
    id: "yoga",
    name: "Yoga & Wellness",
    desc: "High density yoga mats, rollers, yoga blocks",
  },
  {
    id: "agility",
    name: "Agility Tools",
    desc: "Cones, agility ladders, hurdles, sprint gear",
  },
];

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
  couponCode?: string;
  couponDiscount?: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    sku?: string;
  }[];
}

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    orderId: "MART-751561",
    customerName: "Sushaindemo",
    customerPhone: "9876543210",
    customerEmail: "sushaindemo@gmail.com",
    addressSummary:
      "Demo 123,Gurugram, Gurugram, Haryana - 122017",
    total: 698,
    payment: "Cash on Delivery (COD)",
    status: "Confirmed",
    date: "12 Nov 2026",
    items: [
      {
        id: "agility-ladder-pro",
        name: "Speed Agility Ladder",
        price: 649,
        quantity: 1,
        image: "/Agility-tools.jpg",
        sku: "MART-AL-12R",
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isHeroStudioActive, setIsHeroStudioActive] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab !== "hero-slides") {
      setIsHeroStudioActive(false);
    }
  }, [activeTab]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    commerce: true,
    crm: true,
    cms: false,
    settings: false,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Store Data State
  const [products, setProducts] = useState<ProductDetailItem[]>(ALL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>(DEFAULT_ORDERS);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [isDbOrdersConnected, setIsDbOrdersConnected] = useState<boolean>(false);
  const [categories, setCategories] = useState<AdminCategory[]>(DEFAULT_CATEGORIES);

  // Order Details Modal & SKU State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderRecord | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState<boolean>(false);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const getProductSku = (itemId?: string, itemName?: string, explicitSku?: string) => {
    if (explicitSku) return explicitSku;
    if (!itemId && !itemName) return "MART-GEN-001";
    const found = products.find(
      (p) =>
        (itemId && p.id === itemId) ||
        (itemName && p.name.toLowerCase() === itemName.toLowerCase())
    );
    if (found?.sku) return found.sku;
    const cleanPrefix = (itemName || itemId || "PROD")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 3)
      .toUpperCase();
    return `MART-${cleanPrefix || "SKU"}-001`;
  };

  const getProductImage = (itemId?: string, itemName?: string, explicitImage?: string) => {
    if (explicitImage) return explicitImage;
    const found = products.find(
      (p) =>
        (itemId && p.id === itemId) ||
        (itemName && p.name.toLowerCase() === itemName.toLowerCase())
    );
    return found?.image || found?.gallery?.[0] || "/Gym-Equipment.jpg";
  };

  const handleCopySku = (sku: string) => {
    if (!sku) return;
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  // Coupons State
  // Subscribers State
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(DEFAULT_SUBSCRIBERS);
  const [subscribersLoading, setSubscribersLoading] = useState<boolean>(false);
  const [subscriberSearch, setSubscriberSearch] = useState<string>("");
  const [copiedAllEmails, setCopiedAllEmails] = useState<boolean>(false);

  const fetchSubscribers = useCallback(async () => {
    try {
      setSubscribersLoading(true);
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (data && data.success && Array.isArray(data.subscribers)) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.warn("Could not fetch subscribers:", err);
    } finally {
      setSubscribersLoading(false);
    }
  }, []);

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && data.success) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    }
  };

  const copyAllEmails = () => {
    const list = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(list);
    setCopiedAllEmails(true);
    setTimeout(() => setCopiedAllEmails(false), 2500);
  };

  const filteredSubscribers = useMemo(() => {
    if (!subscriberSearch.trim()) return subscribers;
    const q = subscriberSearch.toLowerCase().trim();
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, subscriberSearch]);

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryItem[]>(DEFAULT_INQUIRIES);
  const [inquiriesLoading, setInquiriesLoading] = useState<boolean>(false);
  const [inquirySearch, setInquirySearch] = useState<string>("");
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [selectedInquiryForModal, setSelectedInquiryForModal] = useState<InquiryItem | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setInquiriesLoading(true);
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data && data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.warn("Could not fetch inquiries:", err);
    } finally {
      setInquiriesLoading(false);
    }
  }, []);

  const toggleInquiryResolve = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isResolved: !currentStatus }),
      });
      const data = await res.json();
      if (data && data.success && data.inquiry) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? data.inquiry : i))
        );
        if (selectedInquiryForModal?.id === id) {
          setSelectedInquiryForModal(data.inquiry);
        }
      }
    } catch (err) {
      console.error("Failed to toggle inquiry status:", err);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiryForModal?.id === id) {
          setSelectedInquiryForModal(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  const unresolvedInquiriesCount = useMemo(() => {
    return inquiries.filter((i) => !i.isResolved).length;
  }, [inquiries]);

  const resolvedInquiriesCount = useMemo(() => {
    return inquiries.filter((i) => i.isResolved).length;
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((i) => {
      if (inquiryFilter === "unresolved" && i.isResolved) return false;
      if (inquiryFilter === "resolved" && !i.isResolved) return false;

      if (!inquirySearch.trim()) return true;
      const q = inquirySearch.toLowerCase().trim();
      return (
        i.fullName.toLowerCase().includes(q) ||
        i.phone.includes(q) ||
        (i.email && i.email.toLowerCase().includes(q)) ||
        i.city.toLowerCase().includes(q) ||
        i.inquiryType.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, inquiryFilter, inquirySearch]);

  // Reviews Management State
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSearch, setReviewSearch] = useState("");
  const [selectedReviewForModal, setSelectedReviewForModal] = useState<ReviewItem | null>(null);
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [reviewsViewMode, setReviewsViewMode] = useState<"table" | "cards">("table");

  const pendingReviewsCount = useMemo(() => {
    return reviews.filter((r) => r.status === "pending").length;
  }, [reviews]);

  const updateReviewStatus = async (
    id: string,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data && data.success && data.review) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (selectedReviewForModal?.id === id) {
          setSelectedReviewForModal((prev) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }
      }
    } catch (err) {
      console.error("Failed to update review status:", err);
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data && data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.warn("Could not fetch reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        if (selectedReviewForModal?.id === id) {
          setSelectedReviewForModal(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (reviewFilter === "pending" && r.status !== "pending") return false;
      if (
        reviewFilter === "approved" &&
        r.status !== "approved" &&
        r.status !== undefined
      )
        return false;
      if (reviewFilter === "photo" && !r.photoUrl) return false;
      if (reviewFilter === "5" && r.rating !== 5) return false;
      if (reviewFilter === "4" && r.rating !== 4) return false;

      if (!reviewSearch.trim()) return true;
      const q = reviewSearch.toLowerCase().trim();
      return (
        r.userName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        (r.userEmail && r.userEmail.toLowerCase().includes(q)) ||
        r.comment.toLowerCase().includes(q)
      );
    });
  }, [reviews, reviewFilter, reviewSearch]);

  // Customers State
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    totalUsers: 0,
    totalSpend: 0,
    repeatBuyers: 0,
    newThisMonth: 0,
  });
  const [customersLoading, setCustomersLoading] = useState<boolean>(false);
  const [customerSearch, setCustomerSearch] = useState<string>("");

  const fetchCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data && data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
        if (data.stats) {
          setCustomerStats(data.stats);
        }
      }
    } catch (err) {
      console.warn("Could not fetch customers from /api/admin/customers:", err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.role.toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [couponSearch, setCouponSearch] = useState<string>("");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "flat",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    expiryDate: "",
    isActive: true,
  });
  const [couponCopiedId, setCouponCopiedId] = useState<string | null>(null);

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

  // Add Category Modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    desc: "",
  });

  // Settings & Announcement State
  const [marqueeText, setMarqueeText] = useState(
    "GENUINE M.ART QUALITY • STAY FIT • PLAY BETTER • LIVE HEALTHIER • NATIONWIDE DELIVERY • TESTED BY ATHLETES •"
  );

  // Check stored admin session on mount
  const fetchOrdersFromDb = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data && data.success && Array.isArray(data.orders)) {
        setIsDbOrdersConnected(true);
        if (data.orders.length > 0) {
          const dbOrders: OrderRecord[] = data.orders;
          setOrders(dbOrders);
          try {
            localStorage.setItem("mart_orders", JSON.stringify(dbOrders));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Could not fetch orders from /api/orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Verify cryptographic JWT session with backend
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setIsAuthenticated(true);
        } else {
          setAdminUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("mart_admin_user");
        }
      })
      .catch(() => {
        setAdminUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });

    try {

      const savedProducts = localStorage.getItem("mart_admin_products");
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Smart merge with ALL_PRODUCTS so new schema properties (variantStock, variantGroups, stockQuantity)
            // are populated even if older cached localStorage data was missing them
            const merged = parsed.map((saved: ProductDetailItem) => {
              const staticDefault = ALL_PRODUCTS.find((p) => p.id === saved.id);
              if (!staticDefault) return saved;

              const hasSavedGroups =
                saved.variantGroups &&
                saved.variantGroups.length >= (staticDefault.variantGroups?.length || 0);

              const finalGroups = hasSavedGroups
                ? saved.variantGroups
                : staticDefault.variantGroups || saved.variantGroups;

              const combos = generateVariantCombinations(finalGroups);
              const hasValidSavedStock =
                saved.variantStock &&
                combos.every((c) => saved.variantStock![c] !== undefined);

              const finalVariantStock = hasValidSavedStock
                ? saved.variantStock
                : staticDefault.variantStock || saved.variantStock;

              const finalTrackVariants =
                saved.trackVariantStock !== undefined
                  ? saved.trackVariantStock
                  : (staticDefault.trackVariantStock ?? Boolean(finalGroups && finalGroups.length > 0));

              return {
                ...staticDefault,
                ...saved,
                variantGroups: finalGroups,
                variantStock: finalVariantStock,
                trackVariantStock: finalTrackVariants,
                stockQuantity:
                  saved.stockQuantity !== undefined
                    ? saved.stockQuantity
                    : staticDefault.stockQuantity,
                lowStockThreshold:
                  saved.lowStockThreshold ?? staticDefault.lowStockThreshold ?? 5,
              };
            });
            setProducts(merged);
            localStorage.setItem("mart_admin_products", JSON.stringify(merged));
          } else {
            setProducts(ALL_PRODUCTS);
          }
        } catch {
          setProducts(ALL_PRODUCTS);
        }
      } else {
        setProducts(ALL_PRODUCTS);
      }

      const savedOrders = localStorage.getItem("mart_orders");
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            const orderMap = new Map<string, OrderRecord>();
            parsedOrders
              .filter(
                (o: OrderRecord) =>
                  !["MART-842190", "MART-791045", "MART-630281"].includes(o.orderId) &&
                  (!o.customerName || o.customerName.toLowerCase().includes("sushain"))
              )
              .forEach((o: OrderRecord) => orderMap.set(o.orderId, o));
            DEFAULT_ORDERS.forEach((o) => {
              if (!orderMap.has(o.orderId)) orderMap.set(o.orderId, o);
            });
            const validOrders = Array.from(orderMap.values());
            setOrders(validOrders);
            localStorage.setItem("mart_orders", JSON.stringify(validOrders));
          }
        } catch {}
      }

      const savedCategories = localStorage.getItem("mart_categories");
      if (savedCategories) {
        try {
          const parsedCat = JSON.parse(savedCategories);
          if (Array.isArray(parsedCat) && parsedCat.length > 0) {
            setCategories(parsedCat);
          }
        } catch {
          // ignore error
        }
      }

      const savedCoupons = getStoredCoupons();
      setCoupons(savedCoupons);

      // Fetch live orders from database
      fetchOrdersFromDb();
    fetchCustomers();
    fetchReviews();
    fetchInquiries();
    fetchSubscribers();
    } catch (e) {
      console.warn("Storage read error:", e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [fetchOrdersFromDb]);

  // Handle Admin Login submission with JWT Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setSuccessMessage("JWT Verified! Opening M.art Admin Panel...");
        if (rememberMe) {
          localStorage.setItem("mart_admin_user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("mart_admin_user");
        }
        setTimeout(() => {
          setAdminUser(data.user);
          setIsAuthenticated(true);
          setLoginLoading(false);
        }, 500);
      } else {
        setErrorMessage(
          data.error || "Invalid administrative credentials."
        );
        setLoginLoading(false);
      }
    } catch (err) {
      console.error("[Login fetch error]:", err);
      setErrorMessage("Authentication server error. Please try again.");
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("Logout error:", e);
    }
    localStorage.removeItem("mart_admin_user");
    setAdminUser(null);
    setIsAuthenticated(false);
    setPassword("");
    setSuccessMessage(null);
  };

  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextInStock = !p.inStock;
        return {
          ...p,
          inStock: nextInStock,
          stockQuantity: nextInStock
            ? p.stockQuantity && p.stockQuantity > 0
              ? p.stockQuantity
              : 50
            : 0,
        };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem("mart_admin_products", JSON.stringify(updated));
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to remove this product from catalog?")) {
      const updated = products.filter((p) => p.id !== productId);
      setProducts(updated);
      localStorage.setItem("mart_admin_products", JSON.stringify(updated));

      // 1. Save to deleted list so frontend never restores it
      try {
        const deletedRaw = localStorage.getItem("mart_deleted_products");
        const deletedList: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
        if (!deletedList.includes(productId)) {
          deletedList.push(productId);
          localStorage.setItem("mart_deleted_products", JSON.stringify(deletedList));
        }
      } catch (e) {
        console.warn("Could not save deleted product id:", e);
      }

      // 2. Also delete from Supabase database
      try {
        const { error } = await supabase.from("products").delete().eq("id", productId);
        if (error) {
          console.warn("[Supabase Delete Notice]:", error.message);
        }
      } catch (err) {
        console.warn("[Supabase Delete Notice]:", err);
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderRecord["status"]
  ) => {
    const updated = orders.map((o) =>
      o.orderId === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem("mart_orders", JSON.stringify(updated));
    } catch {}

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
    } catch (err) {
      console.warn("Failed to update order status in Supabase:", err);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCategory.name.trim();
    if (!trimmedName) {
      alert("Please provide category name.");
      return;
    }

    const slug = (newCategory.slug || trimmedName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!slug) {
      alert("Please enter a valid category name or slug.");
      return;
    }

    if (categories.some((c) => c.id === slug)) {
      alert(`Category with ID "${slug}" already exists!`);
      return;
    }

    const item: AdminCategory = {
      id: slug,
      name: trimmedName,
      desc: newCategory.desc.trim() || `${trimmedName} gear & equipment`,
    };

    const updated = [...categories, item];
    setCategories(updated);
    try {
      localStorage.setItem("mart_categories", JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage write error:", err);
    }

    setNewCategory({ name: "", slug: "", desc: "" });
    setIsAddCategoryModalOpen(false);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const assignedProducts = products.filter((p) => p.category === catId);
    let message = `Are you sure you want to delete category "${catName}"?`;
    if (assignedProducts.length > 0) {
      message = `Warning: There are ${assignedProducts.length} product(s) linked to "${catName}".\n\nDeleting this category will leave these products uncategorized.\n\nDo you still want to delete?`;
    }

    if (!window.confirm(message)) return;

    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    try {
      localStorage.setItem("mart_categories", JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage write error:", err);
    }

    if (categoryFilter === catId) {
      setCategoryFilter("all");
    }
  };

  // =========================================================================
  // COUPON MANAGEMENT HANDLERS
  // =========================================================================
  const handleToggleCoupon = (couponId: string) => {
    const updated = coupons.map((c) =>
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    );
    setCoupons(updated);
    saveStoredCoupons(updated);
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const updated = coupons.filter((c) => c.id !== couponId);
      setCoupons(updated);
      saveStoredCoupons(updated);
    }
  };

  const handleOpenAddCoupon = () => {
    setEditingCouponId(null);
    setCouponForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "",
      maxDiscount: "",
      expiryDate: "",
      isActive: true,
    });
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (c: Coupon) => {
    setEditingCouponId(c.id);
    setCouponForm({
      code: c.code,
      description: c.description || "",
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderValue: c.minOrderValue ? String(c.minOrderValue) : "",
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : "",
      expiryDate: c.expiryDate || "",
      isActive: c.isActive,
    });
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponForm.code.trim().toUpperCase();
    if (!cleanCode) {
      alert("Please enter a valid coupon code");
      return;
    }
    const val = Number(couponForm.discountValue) || 0;
    if (val <= 0) {
      alert("Please enter a valid discount value");
      return;
    }

    if (editingCouponId) {
      const updated = coupons.map((c) => {
        if (c.id === editingCouponId) {
          return {
            ...c,
            code: cleanCode,
            description: couponForm.description.trim(),
            discountType: couponForm.discountType,
            discountValue: val,
            minOrderValue: Number(couponForm.minOrderValue) || 0,
            maxDiscount:
              couponForm.discountType === "percentage" && couponForm.maxDiscount
                ? Number(couponForm.maxDiscount)
                : undefined,
            expiryDate: couponForm.expiryDate || undefined,
            isActive: couponForm.isActive,
          };
        }
        return c;
      });
      setCoupons(updated);
      saveStoredCoupons(updated);
    } else {
      const newCouponItem: Coupon = {
        id: `coupon-${Date.now()}`,
        code: cleanCode,
        description: couponForm.description.trim(),
        discountType: couponForm.discountType,
        discountValue: val,
        minOrderValue: Number(couponForm.minOrderValue) || 0,
        maxDiscount:
          couponForm.discountType === "percentage" && couponForm.maxDiscount
            ? Number(couponForm.maxDiscount)
            : undefined,
        expiryDate: couponForm.expiryDate || undefined,
        timesUsed: 0,
        isActive: couponForm.isActive,
        createdAt: new Date().toISOString(),
      };
      const updated = [newCouponItem, ...coupons];
      setCoupons(updated);
      saveStoredCoupons(updated);
    }

    setIsCouponModalOpen(false);
  };

  const handleCopyCouponCode = (id: string, code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCouponCopiedId(id);
      setTimeout(() => setCouponCopiedId(null), 2000);
    }
  };

  const filteredCoupons = useMemo(() => {
    const q = couponSearch.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [coupons, couponSearch]);

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

    const categoryMap: Record<string, string> = {};
    categories.forEach((c) => {
      categoryMap[c.id] = c.name;
    });

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
    return products.filter((p) => {
      if (!p.inStock) return true;
      const threshold = p.lowStockThreshold ?? 10;

      if (
        p.trackVariantStock &&
        p.variantStock &&
        Object.keys(p.variantStock).length > 0
      ) {
        const hasLowVariant = Object.values(p.variantStock).some(
          (q) => Number(q) <= threshold
        );
        if (hasLowVariant) return true;
      }

      const totalUnits = p.stockQuantity ?? 50;
      return totalUnits <= threshold;
    });
  }, [products]);

  // Top 10 Products Ranking (Based on orders sales & catalog popularity)
  const topProducts = useMemo(() => {
    const salesMap: Record<string, { unitsSold: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const key = item.id || item.name;
        if (!salesMap[key]) {
          salesMap[key] = { unitsSold: 0, revenue: 0 };
        }
        salesMap[key].unitsSold += item.quantity || 1;
        salesMap[key].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const ranked = products.map((p) => {
      const match = salesMap[p.id] || salesMap[p.name] || { unitsSold: 0, revenue: 0 };
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        unitsSold: match.unitsSold,
        revenue: match.revenue,
        reviewsCount: p.reviewsCount || 0,
      };
    });

    ranked.sort((a, b) => {
      if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold;
      if (b.revenue !== a.revenue) return b.revenue - a.revenue;
      if (b.reviewsCount !== a.reviewsCount) return b.reviewsCount - a.reviewsCount;
      return b.price - a.price;
    });

    const top10 = ranked.slice(0, 10);
    const maxSales = Math.max(...top10.map((p) => p.unitsSold), 1);

    return top10.map((p, index) => {
      let pct = 20;
      if (p.unitsSold > 0) {
        pct = Math.max(30, Math.min(100, Math.round((p.unitsSold / maxSales) * 100)));
      } else {
        pct = Math.max(15, Math.round(75 - index * 6));
      }

      const barColor =
        index === 0
          ? "bg-orange-500"
          : index === 1
          ? "bg-amber-500"
          : index === 2
          ? "bg-emerald-500"
          : index < 5
          ? "bg-cyan-500"
          : "bg-blue-500";

      return {
        ...p,
        rank: index + 1,
        percentage: pct,
        barColor,
      };
    });
  }, [orders, products]);

  // Accordion Navigation Structure (Option 3)
  interface NavSingleItem {
    type: "item";
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
  }

  interface NavGroupItem {
    type: "group";
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    items: {
      id: AdminTab;
      label: string;
      icon: React.ElementType;
      badge?: string | number;
    }[];
  }

  type NavEntry = NavSingleItem | NavGroupItem;

  const NAV_ENTRIES: NavEntry[] = useMemo(
    () => [
      {
        type: "item",
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        type: "group",
        id: "commerce",
        label: "Catalog & Orders",
        icon: ShoppingCart,
        items: [
          {
            id: "orders",
            label: "Orders",
            icon: ShoppingCart,
            badge: orders.length > 0 ? orders.length : undefined,
          },
          { id: "products", label: "Products", icon: Package },
          { id: "categories", label: "Categories", icon: Layers },
          { id: "coupons", label: "Coupons", icon: Ticket },
        ],
      },
      {
        type: "group",
        id: "crm",
        label: "Customers & Leads",
        icon: Users,
        items: [
          { id: "customers", label: "Customers", icon: Users },
          { id: "reviews", label: "Reviews", icon: Star, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined },
          { id: "inquiries", label: "Inquiries", icon: MessageSquare, badge: unresolvedInquiriesCount > 0 ? unresolvedInquiriesCount : undefined },
          { id: "subscribers", label: "Subscribers", icon: Mail, badge: subscribers.length > 0 ? subscribers.length : undefined },
        ],
      },
      {
        type: "group",
        id: "cms",
        label: "Website & CMS",
        icon: Sliders,
        items: [
          {
            id: "home-customization",
            label: "Customizations",
            icon: Sliders,
          },
          { id: "hero-slides", label: "Hero Slides", icon: ImageIcon },
          { id: "announcements", label: "Announcements", icon: Megaphone },
          { id: "faqs", label: "Global FAQs", icon: HelpCircle },
        ],
      },
      {
        type: "group",
        id: "settings",
        label: "Settings",
        icon: Settings,
        items: [
          { id: "delivery-settings", label: "Delivery Settings", icon: Truck },
        ],
      },
    ],
    [orders.length, unresolvedInquiriesCount, subscribers.length]
  );

  // Auto-expand accordion group if the active tab is located inside it
  useEffect(() => {
    NAV_ENTRIES.forEach((entry) => {
      if (entry.type === "group") {
        const hasActive = entry.items.some((sub) => sub.id === activeTab);
        if (hasActive) {
          setOpenGroups((prev) =>
            prev[entry.id] ? prev : { ...prev, [entry.id]: true }
          );
        }
      }
    });
  }, [activeTab, NAV_ENTRIES]);

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
        return "Store Customizations";
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
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden bg-white p-2 border border-white/15 shadow-2xl mb-4">
              <NextImage
                src="/logo.jpg"
                alt="M.art Sports & Fitness"
                fill
                className="object-contain p-0.5"
                priority
              />
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
                    placeholder="Enter email address"
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
          isHeroStudioActive
            ? "-translate-x-full pointer-events-none opacity-0"
            : isSidebarCollapsed
            ? "w-20"
            : "w-64"
        } ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white p-1 border border-white/20 shrink-0 shadow-md shadow-black/20">
              <NextImage
                src="/logo.jpg"
                alt="M.art Sports & Fitness"
                fill
                className="object-contain p-0.5"
                priority
              />
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

        {/* Navigation Items (Scrollable Accordion Groups) */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_ENTRIES.map((entry) => {
            if (entry.type === "item") {
              const Icon = entry.icon;
              const isActive = activeTab === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(entry.id);
                    setIsMobileMenuOpen(false);
                  }}
                  title={isSidebarCollapsed ? entry.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-white/[0.08] text-white font-bold"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
                  } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
                >
                  {isActive && (
                    <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-orange-500 rounded-l" />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-orange-400" : "text-stone-400"
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{entry.label}</span>
                  )}
                </button>
              );
            }

            // Group Item (Accordion)
            const Icon = entry.icon;
            const isOpen = !!openGroups[entry.id];
            const isChildActive = entry.items.some((sub) => sub.id === activeTab);

            return (
              <div key={entry.id} className="space-y-0.5">
                {/* Accordion Group Header */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSidebarCollapsed) {
                      setIsSidebarCollapsed(false);
                      setOpenGroups((prev) => ({ ...prev, [entry.id]: true }));
                    } else {
                      toggleGroup(entry.id);
                    }
                  }}
                  title={isSidebarCollapsed ? entry.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isChildActive
                      ? "text-orange-400 bg-orange-500/[0.06]"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isChildActive ? "text-orange-400" : "text-stone-400"
                      }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate text-left font-semibold tracking-tight">
                        {entry.label}
                      </span>
                    )}
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {entry.badge !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-stone-300">
                          {entry.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-stone-300" : ""
                        }`}
                      />
                    </div>
                  )}
                </button>

                {/* Sub-items list (Expanded Sidebar) */}
                {!isSidebarCollapsed && isOpen && (
                  <div className="pl-3 pr-1 py-0.5 space-y-0.5 border-l border-white/[0.08] ml-5 my-0.5 animate-fadeIn">
                    {entry.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(subItem.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer relative ${
                            isSubActive
                              ? "bg-white/[0.08] text-white font-bold"
                              : "text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]"
                          }`}
                        >
                          {isSubActive && (
                            <span className="absolute right-0 top-1 bottom-1 w-0.5 bg-orange-500 rounded-l" />
                          )}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <SubIcon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSubActive ? "text-orange-400" : "text-stone-400"
                              }`}
                            />
                            <span className="truncate">{subItem.label}</span>
                          </div>
                          {subItem.badge !== undefined && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                                isSubActive
                                  ? "bg-orange-500 text-white"
                                  : "bg-white/[0.08] text-stone-400"
                              }`}
                            >
                              {subItem.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items in Collapsed Sidebar mode */}
                {isSidebarCollapsed && isOpen && (
                  <div className="space-y-1 py-1">
                    {entry.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeTab === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          type="button"
                          title={subItem.label}
                          onClick={() => {
                            setActiveTab(subItem.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-center p-2 rounded-xl text-xs transition-all cursor-pointer relative ${
                            isSubActive
                              ? "bg-white/[0.08] text-orange-400 font-bold"
                              : "text-stone-400 hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          {isSubActive && (
                            <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-orange-500 rounded-l" />
                          )}
                          <SubIcon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
          isHeroStudioActive
            ? "lg:ml-0"
            : isSidebarCollapsed
            ? "lg:ml-20"
            : "lg:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        {!isHeroStudioActive && (
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
        )}

        {/* Dynamic Page Content */}
        <main className="w-full p-4 sm:p-6 lg:p-8 2xl:px-10 space-y-6">
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
              {/* ROW 3: TOP PRODUCTS + LOW STOCK + QUICK ACTIONS (3 Cards)   */}
              {/* ----------------------------------------------------------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Top Products Card */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-bold text-white">
                          Top 10 Products
                        </h4>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold bg-[#192234] px-2 py-0.5 rounded">
                        last 30 days
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-[225px] overflow-y-auto pr-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-700/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-orange-500/80 [scrollbar-width:thin] [scrollbar-color:rgba(120,113,108,0.4)_transparent]">
                      {topProducts.map((p) => (
                        <div key={p.id} className="space-y-1 group">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-stone-200 truncate pr-2 group-hover:text-orange-300 transition-colors">
                              {p.rank}. {p.name}
                            </span>
                            <span className="font-bold text-orange-400 shrink-0">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500">
                            <span>
                              {p.unitsSold > 0
                                ? `${p.unitsSold} pack${p.unitsSold > 1 ? "s" : ""} sold`
                                : "Trending in catalog"}
                            </span>
                            {p.unitsSold > 0 && (
                              <span className="text-[10px] text-stone-400 font-medium">
                                ₹{p.revenue.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-[#182030] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`${p.barColor} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${p.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-stone-400">
                    <span>Based on public store orders</span>
                    <span className="text-orange-400 font-semibold">10 products</span>
                  </div>
                </div>

                {/* Card 2: Low Stock Card */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
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

                  {/* Body: Healthy State or Low Stock List */}
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
                    <div className="py-1 space-y-2 max-h-[225px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-700/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-orange-500/80 [scrollbar-width:thin] [scrollbar-color:rgba(120,113,108,0.4)_transparent]">
                      {lowStockItems.map((p) => {
                        const threshold = p.lowStockThreshold ?? 10;
                        const hasVariantStock =
                          p.trackVariantStock &&
                          p.variantStock &&
                          Object.keys(p.variantStock).length > 0;

                        let statusLabel = "";
                        let isSoldOut = false;

                        if (!p.inStock) {
                          statusLabel = "Out of Stock (0)";
                          isSoldOut = true;
                        } else if (hasVariantStock) {
                          const entries = Object.entries(p.variantStock!);
                          const soldOutVariants = entries.filter(
                            ([, q]) => Number(q) <= 0
                          );
                          const lowVariants = entries.filter(
                            ([, q]) => Number(q) > 0 && Number(q) <= threshold
                          );

                          if (soldOutVariants.length > 0) {
                            statusLabel = `${soldOutVariants.length} variant sold out`;
                            isSoldOut = true;
                          } else if (lowVariants.length > 0) {
                            statusLabel = `${lowVariants.length} variant low (≤${threshold})`;
                          } else {
                            statusLabel = `${p.stockQuantity ?? 0} units left`;
                          }
                        } else {
                          statusLabel = `${p.stockQuantity ?? 0} units left`;
                        }

                        return (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 px-2.5 rounded-xl bg-[#192234] border border-white/5 hover:border-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isSoldOut
                                    ? "bg-rose-400"
                                    : "bg-amber-400 animate-pulse"
                                }`}
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">
                                  {p.name}
                                </div>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mt-0.5 ${
                                    isSoldOut
                                      ? "text-rose-400 bg-rose-500/15 border-rose-500/30"
                                      : "text-amber-400 bg-amber-500/15 border-amber-500/30"
                                  }`}
                                >
                                  {statusLabel}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline shrink-0 flex items-center gap-1"
                            >
                              <span>Restock</span>
                              <span>➔</span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-stone-400">
                    <span>Total catalog: {products.length} items</span>
                    {lowStockItems.length > 0 && (
                      <span className="text-amber-400 font-bold">
                        {lowStockItems.length} require attention
                      </span>
                    )}
                  </div>
                </div>

                {/* Card 3: Quick Actions Card */}
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                  <div className="pb-4 border-b border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white">
                      Quick actions
                    </h4>
                  </div>

                  <div className="py-4 space-y-2.5">
                    <Link
                      href="/admin/products/new"
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/5 text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold">Add product</span>
                    </Link>

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
                        <th className="py-3 px-4 text-right">Details</th>
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
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/admin/orders/${o.orderId}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View</span>
                            </Link>
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
              {/* Header Bar: Search + Category Dropdown Filter + Add Product */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141B29] p-3 sm:p-4 rounded-2xl border border-white/[0.07] shadow-md">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by title, SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#182030] border border-stone-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative sm:w-56 shrink-0">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full bg-[#182030] border border-stone-700/60 rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-white focus:outline-none focus:border-orange-500 cursor-pointer appearance-none transition-colors"
                    >
                      <option value="all" className="bg-[#141B29] text-white">
                        All Categories
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#141B29] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Add Product Button */}
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Link>
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
                            {(() => {
                              const threshold = p.lowStockThreshold ?? 5;
                              const hasVariantStock =
                                p.trackVariantStock &&
                                p.variantStock &&
                                Object.keys(p.variantStock).length > 0;

                              const totalUnits = hasVariantStock
                                ? Object.values(p.variantStock!).reduce(
                                    (sum, q) => sum + (Number(q) || 0),
                                    0
                                  )
                                : p.stockQuantity ?? (p.inStock ? 50 : 0);

                              const isOut = !p.inStock || totalUnits <= 0;
                              const isLow = !isOut && totalUnits <= threshold;

                              return (
                                <button
                                  type="button"
                                  onClick={() => handleToggleStock(p.id)}
                                  title="Click to toggle availability"
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                    isOut
                                      ? "bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25"
                                      : isLow
                                      ? "bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 shadow-sm shadow-amber-500/10"
                                      : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isOut
                                        ? "bg-rose-400"
                                        : isLow
                                        ? "bg-amber-400 animate-pulse"
                                        : "bg-emerald-400"
                                    }`}
                                  />
                                  <span>
                                    {isOut
                                      ? "Out of Stock (0)"
                                      : isLow
                                      ? `Low Stock (${totalUnits} units)`
                                      : `In Stock (${totalUnits} units)`}
                                  </span>
                                </button>
                              );
                            })()}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/products/${p.id}`}
                                className="p-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 hover:text-orange-300 transition-colors"
                                title="Edit Product (Full Editor)"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
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
                <div className="p-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-white">
                        Customer Orders ({orders.length})
                      </h3>
                      {isDbOrdersConnected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Database Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Local Cache
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Track and update fulfillment statuses in real-time.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fetchOrdersFromDb()}
                      disabled={ordersLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-stone-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                      title="Sync orders from Supabase"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? "animate-spin text-orange-400" : ""}`} />
                      <span>{ordersLoading ? "Syncing..." : "Refresh"}</span>
                    </button>
                    <div className="text-xs font-semibold text-stone-400">
                      Total Volume:{" "}
                      <span className="text-emerald-400 font-bold">
                        ₹{totalRevenue.toLocaleString("en-IN")}
                      </span>
                    </div>
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
                          <Link
                            href={`/admin/orders/${o.orderId}`}
                            className="font-mono text-sm font-extrabold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/20 transition-colors"
                            title="Open Full Order Page"
                          >
                            #{o.orderId}
                          </Link>
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-emerald-400 text-sm">
                              ₹{o.total.toLocaleString("en-IN")}
                            </span>
                            {o.couponCode && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold font-mono">
                                <Ticket className="w-3 h-3" />
                                {o.couponCode}
                                {o.couponDiscount ? ` (-₹${o.couponDiscount})` : ""}
                              </span>
                            )}
                          </div>
                          <div className="text-stone-400">{o.payment}</div>
                          <div className="mt-2 space-y-1">
                            {o.items.slice(0, 3).map((item, idx) => {
                              const itemSku = getProductSku(item.id, item.name, item.sku);
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-stone-900/60 border border-white/[0.04]"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                                      {itemSku}
                                    </span>
                                    <span className="truncate text-stone-300 font-medium text-[11px]">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="font-extrabold text-white text-[10px] shrink-0 bg-stone-800 px-1.5 py-0.5 rounded">
                                    ×{item.quantity}
                                  </span>
                                </div>
                              );
                            })}
                            {o.items.length > 3 && (
                              <div className="text-[10px] text-stone-400 font-semibold pl-1">
                                + {o.items.length - 3} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
                        <Link
                          href={`/admin/orders/${o.orderId}`}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/15 to-amber-500/15 hover:from-orange-500/25 hover:to-amber-500/25 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Order Details Page (SKU &amp; Billing)</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${o.orderId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 text-xs font-medium transition-colors cursor-pointer"
                            title="Print Packing Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Print Slip</span>
                          </Link>

                          {o.customerPhone && (
                            <a
                              href={`https://wa.me/91${o.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hello ${o.customerName}, this is regarding your M.art Sports Order #${o.orderId}.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                          )}
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
              {/* Header with Add Category Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#141B29] p-4 rounded-2xl border border-white/[0.07] shadow-md">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Store Categories</span>
                    <span className="text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      {categories.length}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Create, manage and organize product categories for the catalog
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                {categories.map((c) => {
                  const itemCount = products.filter((p) => p.category === c.id).length;
                  return (
                    <div
                      key={c.id}
                      className="bg-[#141B29] border border-white/[0.07] hover:border-white/20 rounded-2xl p-5 shadow-xl space-y-3 transition-all relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs uppercase">
                          {c.name.slice(0, 1)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {itemCount} items
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            title={`Delete ${c.name}`}
                            className="w-7 h-7 rounded-lg bg-stone-800/80 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{c.name}</h4>
                        <div className="inline-block text-[10px] font-mono text-stone-500 mt-0.5">
                          slug: <span className="text-stone-400">{c.id}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-2 leading-relaxed line-clamp-2">
                          {c.desc || "No description provided."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {categories.length === 0 && (
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-12 text-center">
                  <Layers className="w-10 h-10 text-stone-500 mx-auto mb-3" />
                  <p className="text-sm font-bold text-white">No categories found</p>
                  <p className="text-xs text-stone-400 mt-1 mb-4">Get started by creating your first category.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 5: DELIVERY SETTINGS VIEW                                 */}
          {/* ================================================================= */}
          {activeTab === "delivery-settings" && (
            <DeliverySettingsManager />
          )}

          {/* ================================================================= */}
          {/* SECTION 6: ANNOUNCEMENTS & TICKER                                 */}
          {/* ================================================================= */}
          {activeTab === "announcements" && (
            <div className="w-full">
              <AnnouncementsManager />
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 7: GLOBAL FAQS VIEW                                    */}
          {/* ============================================================== */}
          {activeTab === "faqs" && (
            <div className="w-full">
              <FAQsManager />
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION: COUPONS & DISCOUNTS MANAGEMENT VIEW                      */}
          {/* ================================================================= */}
          {activeTab === "coupons" && (
            <div className="space-y-6">
              {/* Header Stats & Add Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-2">
                    <span>Total Coupons</span>
                    <Ticket className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{coupons.length}</div>
                  <div className="text-[11px] text-stone-500 mt-1">Configured in store database</div>
                </div>

                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-2">
                    <span>Active Coupons</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {coupons.filter((c) => c.isActive).length}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">Ready for checkout use</div>
                </div>

                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-bold mb-2">
                    <span>Total Redemptions</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-blue-400">
                    {coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0)}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">Times used by customers</div>
                </div>

                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-center">
                  <button
                    type="button"
                    onClick={handleOpenAddCoupon}
                    className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Coupon</span>
                  </button>
                  <p className="text-[11px] text-stone-500 text-center mt-2">
                    Instant sync with checkout page
                  </p>
                </div>
              </div>

              {/* Coupons List Section */}
              <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                {/* Search & Filter Toolbar */}
                <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-orange-400" />
                      <span>Store Promo Coupons ({filteredCoupons.length})</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Customers enter these coupon codes on the checkout page to receive instant discounts.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponSearch}
                        onChange={(e) => setCouponSearch(e.target.value)}
                        placeholder="Search coupons..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#192234] border border-white/[0.08] text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Coupons Cards / List */}
                {filteredCoupons.length === 0 ? (
                  <div className="p-12 text-center text-stone-400 space-y-2">
                    <Ticket className="w-10 h-10 mx-auto text-stone-600 opacity-50" />
                    <p className="text-sm font-semibold">No coupons match your search</p>
                    <p className="text-xs text-stone-500">
                      Try searching with another keyword or click Create New Coupon.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {filteredCoupons.map((coupon) => {
                      const isExpired =
                        coupon.expiryDate &&
                        new Date(coupon.expiryDate).getTime() < Date.now();
                      return (
                        <div
                          key={coupon.id}
                          className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Left: Code, Badge, Description */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2.5">
                              <span className="font-mono text-sm sm:text-base font-black text-white bg-[#192234] px-3 py-1 rounded-xl border border-white/10 tracking-wider">
                                {coupon.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCouponCode(coupon.id, coupon.code)}
                                className="text-stone-400 hover:text-orange-400 p-1 rounded-md text-xs transition-colors cursor-pointer"
                                title="Copy code"
                              >
                                {couponCopiedId === coupon.id ? (
                                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Copied!
                                  </span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <span
                                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                                  coupon.discountType === "percentage"
                                    ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                }`}
                              >
                                {coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}% OFF`
                                  : `₹${coupon.discountValue} FLAT OFF`}
                              </span>

                              {isExpired ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                                  Expired
                                </span>
                              ) : coupon.isActive ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Live in Store
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-500/10 border border-stone-500/20 text-stone-400">
                                  Inactive
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-stone-300 font-medium leading-relaxed">
                              {coupon.description || "Valid on all M.art orders"}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-400 pt-1">
                              {coupon.minOrderValue > 0 && (
                                <span>
                                  Min Cart: <strong className="text-stone-200">₹{coupon.minOrderValue}</strong>
                                </span>
                              )}
                              {coupon.maxDiscount && (
                                <span>
                                  Max Cap: <strong className="text-stone-200">₹{coupon.maxDiscount}</strong>
                                </span>
                              )}
                              {coupon.expiryDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-stone-500" />
                                  Expires: <strong className="text-stone-200">{coupon.expiryDate}</strong>
                                </span>
                              )}
                              <span>
                                Used: <strong className="text-orange-400">{coupon.timesUsed || 0} times</strong>
                              </span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                            <button
                              type="button"
                              onClick={() => handleToggleCoupon(coupon.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                coupon.isActive
                                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                                  : "bg-stone-800 border-stone-700 text-stone-400 hover:text-white"
                              }`}
                            >
                              {coupon.isActive ? "Active" : "Disabled"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditCoupon(coupon)}
                              className="p-2 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/[0.08] text-stone-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Coupon"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION: REGISTERED CUSTOMERS (ALL USERS VIEW)                    */}
          {/* ================================================================= */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      All <span className="text-orange-500">Users</span>
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      Live Auth Sync
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {customers.length} registered {customers.length === 1 ? "user" : "users"} — customers and admins.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="Search name, email, phone..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#192234] border border-white/[0.08] text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchCustomers}
                    disabled={customersLoading}
                    title="Refresh customers list"
                    className="p-2.5 rounded-xl bg-[#192234] border border-white/[0.08] text-stone-300 hover:text-white hover:border-orange-500/40 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${customersLoading ? "animate-spin text-orange-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 4 Customer Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Total Registered Users */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-4 sm:p-5 shadow-xl flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-sky-500/10 border border-sky-500/20 p-2.5 sm:p-3 text-sky-400">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {customerStats.totalUsers || customers.length}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Total Customers
                    </p>
                  </div>
                </div>

                {/* Total Spend / Revenue */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-4 sm:p-5 shadow-xl flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 sm:p-3 text-emerald-400">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      ₹{(customerStats.totalSpend || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Total Customer Spend
                    </p>
                  </div>
                </div>

                {/* Repeat Buyers */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-4 sm:p-5 shadow-xl flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 text-amber-400">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {customerStats.repeatBuyers || 0}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Repeat Buyers
                    </p>
                  </div>
                </div>

                {/* New This Month */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-4 sm:p-5 shadow-xl flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 sm:p-3 text-orange-400">
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {customerStats.newThisMonth || 0}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      New (Last 30 Days)
                    </p>
                  </div>
                </div>
              </div>

              {/* Customers Table Card */}
              <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#192234] text-stone-400 font-bold uppercase tracking-wider text-[11px] border-b border-white/[0.06]">
                      <tr>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Contact Phone</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Orders Placed</th>
                        <th className="py-3.5 px-4">Total Spent</th>
                        <th className="py-3.5 px-4 text-right">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-stone-500">
                            {customerSearch.trim()
                              ? "No customers found matching your search."
                              : "No registered customers found."}
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center uppercase shadow-sm shrink-0">
                                  {c.name ? c.name.charAt(0).toUpperCase() : c.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-white text-xs truncate">
                                    {c.name}
                                  </div>
                                  <div className="text-[11px] text-stone-400 truncate">
                                    {c.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-stone-300 font-mono text-[11px]">
                              {c.phone || "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                                  c.role.toLowerCase() === "admin"
                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                    : "bg-stone-800 text-stone-300 border-stone-700"
                                }`}
                              >
                                {c.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-extrabold text-white">
                                {c.orderCount} {c.orderCount === 1 ? "order" : "orders"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-extrabold text-emerald-400">
                                ₹{c.totalSpend.toLocaleString("en-IN")}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right text-stone-400 text-[11px]">
                              {new Date(c.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION: CUSTOMER REVIEWS VIEW                                    */}
          {/* ================================================================= */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Reviews Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Customer <span className="text-orange-500">Reviews</span>
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Moderation Hub
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Moderate and manage athlete product reviews, ratings and photo testimonials.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      placeholder="Search customer, product, comment..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#192234] border border-white/[0.08] text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchReviews}
                    disabled={reviewsLoading}
                    title="Refresh reviews list"
                    className="p-2.5 rounded-xl bg-[#192234] border border-white/[0.08] text-stone-300 hover:text-white hover:border-orange-500/40 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${reviewsLoading ? "animate-spin text-orange-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Total Reviews */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-4 sm:p-5 shadow-xl flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/20 p-2.5 sm:p-3 text-orange-400">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {reviews.length}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Total Reviews
                    </p>
                  </div>
                </div>

                {/* Pending Approval */}
                <div
                  onClick={() => setReviewFilter("pending")}
                  className={`rounded-2xl border p-4 sm:p-5 shadow-xl flex items-center gap-4 cursor-pointer transition-all ${
                    pendingReviewsCount > 0
                      ? "bg-[#1c181f] border-amber-500/40 hover:border-amber-400"
                      : "bg-[#141B29] border-white/[0.07]"
                  }`}
                >
                  <div
                    className={`shrink-0 rounded-xl p-2.5 sm:p-3 ${
                      pendingReviewsCount > 0
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-stone-800 text-stone-400 border border-white/10"
                    }`}
                  >
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p
                      className={`text-xl sm:text-2xl font-black leading-tight ${
                        pendingReviewsCount > 0 ? "text-amber-400" : "text-white"
                      }`}
                    >
                      {pendingReviewsCount}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Pending Approval
                    </p>
                  </div>
                </div>

                {/* Approved Reviews */}
                <div
                  onClick={() => setReviewFilter("approved")}
                  className="rounded-2xl border border-white/[0.07] bg-[#141B29] hover:border-emerald-500/30 p-4 sm:p-5 shadow-xl flex items-center gap-4 cursor-pointer transition-all"
                >
                  <div className="shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 sm:p-3 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {reviews.filter((r) => r.status === "approved" || !r.status).length}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Approved Reviews
                    </p>
                  </div>
                </div>

                {/* Avg Rating */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-4 sm:p-5 shadow-xl flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 p-2.5 sm:p-3 text-purple-400">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
                        : "5.0"}
                      <span className="text-xs font-normal text-stone-400"> / 5.0</span>
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-stone-400 mt-0.5">
                      Avg Rating
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-stone-400 text-xs font-bold mr-1 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {[
                  { id: "all", label: "All Reviews" },
                  {
                    id: "pending",
                    label: `⏳ Pending (${pendingReviewsCount})`,
                    highlight: pendingReviewsCount > 0,
                  },
                  { id: "approved", label: "✓ Approved" },
                  { id: "5", label: "5 ★ Stars" },
                  { id: "4", label: "4 ★ Stars" },
                  { id: "photo", label: "📷 With Photos" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setReviewFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs whitespace-nowrap shrink-0 ${
                      reviewFilter === f.id
                        ? "bg-orange-500 text-white shadow-xs"
                        : f.highlight
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-[#192234] text-stone-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Empty State */}
              {filteredReviews.length === 0 ? (
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-12 text-center space-y-3 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-stone-400 mx-auto flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-stone-300">
                    {reviewSearch ? "No reviews match your search" : "No customer reviews yet"}
                  </p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Customer reviews submitted on the store product pages will appear here automatically.
                  </p>
                </div>
              ) : reviewsViewMode === "table" ? (
                /* ========================================================= */
                /* 1. RESPONSIVE TABLE VIEW (CLICKABLE ROWS + NO CUT-OFFS)   */
                /* ========================================================= */
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-[#0F1420]/70 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                          <th className="px-3.5 sm:px-4 py-3.5 w-[20%] min-w-0">Product</th>
                          <th className="px-3.5 sm:px-4 py-3.5 w-[18%] min-w-0">Customer</th>
                          <th className="px-3 py-3.5 w-20 shrink-0">Rating</th>
                          <th className="px-2 py-3.5 text-center w-14 shrink-0">Photo</th>
                          <th className="px-2 py-3.5 text-center w-24 shrink-0">Status</th>
                          <th className="px-3.5 sm:px-4 py-3.5 min-w-0">Review Snippet</th>
                          <th className="px-3 py-3.5 w-24 shrink-0 hidden 2xl:table-cell">Date</th>
                          <th className="px-3.5 sm:px-4 py-3.5 text-right w-32 shrink-0">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {filteredReviews.map((rev) => {
                          const matchedProduct = ALL_PRODUCTS.find((p) => p.id === rev.productId);
                          const prodImg = matchedProduct?.image || "/wooden-dumbells.jpg";

                          return (
                            <tr
                              key={rev.id}
                              onClick={() => setSelectedReviewForModal(rev)}
                              className="hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors cursor-pointer group"
                              title="Click to view full review in modal"
                            >
                              {/* 1. Product */}
                              <td className="px-3.5 sm:px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={prodImg}
                                    alt={rev.productName}
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-white/10 shrink-0 bg-white/5"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-semibold text-white text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-orange-400 transition-colors">
                                      {rev.productName}
                                    </p>
                                    <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                                      ID: {rev.productId}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Customer */}
                              <td className="px-3.5 sm:px-4 py-3.5">
                                <p className="font-bold text-white leading-tight">
                                  {rev.userName}
                                </p>
                                <p className="text-[11px] text-stone-400 truncate max-w-[150px] mt-0.5">
                                  {rev.userEmail || "Customer"}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20 whitespace-nowrap">
                                    ✓ Verified Buyer
                                  </span>
                                  <span className="text-[10px] text-stone-500 2xl:hidden">
                                    • {rev.date || "Recent"}
                                  </span>
                                </div>
                              </td>

                              {/* 3. Rating */}
                              <td className="px-3 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-0.5 text-amber-400">
                                  {[...Array(rev.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                                <span className="text-[11px] text-stone-400 font-bold mt-0.5 block">
                                  {rev.rating} / 5.0
                                </span>
                              </td>

                              {/* 4. Photo */}
                              <td className="px-2 py-3.5 text-center">
                                {rev.photoUrl ? (
                                  <div className="relative inline-block rounded-xl overflow-hidden border border-white/10 group-hover:border-orange-500/50 transition-colors">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={rev.photoUrl}
                                      alt="Attached photo"
                                      className="w-9 h-9 sm:w-10 sm:h-10 object-cover"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-stone-600 font-mono">
                                    —
                                  </span>
                                )}
                              </td>

                              {/* 5. Status Badge */}
                              <td className="px-2 py-3.5 text-center whitespace-nowrap">
                                {rev.status === "pending" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                    <Clock className="w-3 h-3" />
                                    <span>Pending</span>
                                  </span>
                                ) : rev.status === "rejected" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                    <X className="w-3 h-3" />
                                    <span>Rejected</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                    <Check className="w-3 h-3" />
                                    <span>Approved</span>
                                  </span>
                                )}
                              </td>

                              {/* 6. Review Snippet */}
                              <td className="px-3.5 sm:px-4 py-3.5">
                                <p className="text-stone-300 text-xs sm:text-[13px] line-clamp-2 leading-relaxed">
                                  &ldquo;{rev.comment}&rdquo;
                                </p>
                              </td>

                              {/* 7. Date */}
                              <td className="px-3 py-3.5 text-xs text-stone-400 whitespace-nowrap hidden 2xl:table-cell">
                                {rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN") : "Recent")}
                              </td>

                              {/* 8. Action Buttons */}
                              <td className="px-3.5 sm:px-4 py-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  {rev.status === "pending" && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateReviewStatus(rev.id, "approved");
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                                      title="Approve review"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Approve</span>
                                    </button>
                                  )}
                                  {rev.status === "approved" && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateReviewStatus(rev.id, "rejected");
                                      }}
                                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                      title="Reject review"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/15 text-orange-400 hover:bg-orange-500 hover:text-white border border-orange-500/30 text-xs font-bold transition-all cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteReview(rev.id);
                                    }}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Delete review"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* ========================================================= */
                /* 2. CARD GRID VIEW (BEST FOR WIDE SCREENS & VISUAL REVIEW) */
                /* ========================================================= */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredReviews.map((rev) => {
                    const matchedProduct = ALL_PRODUCTS.find((p) => p.id === rev.productId);
                    const prodImg = matchedProduct?.image || "/wooden-dumbells.jpg";

                    return (
                      <div
                        key={rev.id}
                        onClick={() => setSelectedReviewForModal(rev)}
                        className="bg-[#141B29] border border-white/[0.07] hover:border-orange-500/40 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          {/* Product strip */}
                          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prodImg}
                              alt={rev.productName}
                              className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0 bg-white/5"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white text-xs truncate group-hover:text-orange-400 transition-colors">
                                {rev.productName}
                              </p>
                              <span className="text-[10px] text-stone-500 font-mono block">
                                {rev.productId}
                              </span>
                            </div>
                          </div>

                          {/* Customer & Rating */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center">
                                {(rev.userName || "C").charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-white">
                                {rev.userName}
                              </span>
                            </div>

                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>

                          {/* Comment */}
                          <p className="text-xs text-stone-300 leading-relaxed italic line-clamp-3 bg-[#0F1420]/50 p-3 rounded-xl border border-white/[0.03]">
                            &ldquo;{rev.comment}&rdquo;
                          </p>

                          {/* Attached Photo Preview */}
                          {rev.photoUrl && (
                            <div className="pt-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={rev.photoUrl}
                                alt="Customer photo"
                                className="w-full h-32 object-cover rounded-xl border border-white/10 group-hover:border-orange-500/40 transition-colors"
                              />
                            </div>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                          <div>
                            {rev.status === "pending" ? (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> Pending
                              </span>
                            ) : rev.status === "rejected" ? (
                              <span className="text-[10px] font-bold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                                ✕ Rejected
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                ✓ Approved
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {rev.status === "pending" && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateReviewStatus(rev.id, "approved");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                                title="Approve review"
                              >
                                Approve
                              </button>
                            )}
                            <span className="text-xs font-bold text-orange-400 flex items-center gap-1 group-hover:underline">
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteReview(rev.id);
                              }}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* FULL REVIEW DETAIL MODAL (ADMIN)                                 */}
          {/* ================================================================= */}
          {selectedReviewForModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
              <div className="bg-[#141B29] border border-white/10 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0F1420]/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 fill-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-white">
                          Customer Review Detail
                        </h3>
                        {selectedReviewForModal.status === "pending" ? (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Pending Approval
                          </span>
                        ) : selectedReviewForModal.status === "rejected" ? (
                          <span className="text-[10px] font-bold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                            Rejected
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Approved
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {selectedReviewForModal.productName}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReviewForModal(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                  {/* Customer Info Card */}
                  <div className="p-3.5 rounded-2xl bg-[#192234] border border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-sm uppercase">
                        {(selectedReviewForModal.userName || "C").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {selectedReviewForModal.userName}
                        </p>
                        <p className="text-xs text-stone-400">
                          {selectedReviewForModal.userEmail || "No email registered"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                      ✓ Verified Buyer
                    </span>
                  </div>

                  {/* Rating & Date */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[...Array(selectedReviewForModal.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-white ml-1">
                        {selectedReviewForModal.rating} / 5 Stars
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 font-medium">
                      {selectedReviewForModal.date || (selectedReviewForModal.createdAt ? new Date(selectedReviewForModal.createdAt).toLocaleDateString("en-IN") : "Recent")}
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="p-4 rounded-2xl bg-[#0F1420]/70 border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                      Feedback
                    </p>
                    <p className="text-sm text-stone-200 leading-relaxed italic">
                      &ldquo;{selectedReviewForModal.comment}&rdquo;
                    </p>
                  </div>

                  {/* Uploaded Photo (if present) */}
                  {selectedReviewForModal.photoUrl && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Customer Uploaded Photo
                      </p>
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedReviewForModal.photoUrl}
                          alt="Customer attached review photo"
                          className="max-h-72 w-auto object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer with Approve / Reject Controls */}
                <div className="p-4 border-t border-white/10 bg-[#0F1420]/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => deleteReview(selectedReviewForModal.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    {selectedReviewForModal.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => updateReviewStatus(selectedReviewForModal.id, "rejected")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject / Hide</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedReviewForModal.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => updateReviewStatus(selectedReviewForModal.id, "approved")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Publish to Store</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedReviewForModal(null)}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION: CLIENT INQUIRIES & BULK LEADS VIEW                       */}
          {/* ================================================================= */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Client <span className="text-orange-500">Inquiries</span>
                    </h2>
                    {unresolvedInquiriesCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {unresolvedInquiriesCount} Action Needed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Manage and review customer quote requests and contact messages. Click any inquiry to inspect details in full view.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-60">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search name, phone, city..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#192234] border border-white/[0.08] text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={fetchInquiries}
                    disabled={inquiriesLoading}
                    title="Refresh inquiries list"
                    className="p-2.5 rounded-xl bg-[#192234] border border-white/[0.08] text-stone-300 hover:text-white hover:border-orange-500/40 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${inquiriesLoading ? "animate-spin text-orange-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 3 Overview Stat Cards (Exactly as Reference UI) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Total Inquiries */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-5 shadow-xl flex items-center gap-4 transition-all hover:border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {inquiries.length}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      Total Inquiries
                    </p>
                  </div>
                </div>

                {/* 2. Unresolved (Pending Action) */}
                <div className="rounded-2xl border border-amber-500/20 bg-[#141B29] p-5 shadow-xl flex items-center gap-4 transition-all hover:border-amber-500/40">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400 leading-tight">
                      {unresolvedInquiriesCount}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      Unresolved
                    </p>
                  </div>
                </div>

                {/* 3. Resolved */}
                <div className="rounded-2xl border border-emerald-500/20 bg-[#141B29] p-5 shadow-xl flex items-center gap-4 transition-all hover:border-emerald-500/40">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400 leading-tight">
                      {resolvedInquiriesCount}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      Resolved
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Count Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: "all", label: `All Inquiries (${inquiries.length})` },
                    { id: "unresolved", label: `New & Unresolved (${unresolvedInquiriesCount})` },
                    { id: "resolved", label: `Resolved (${resolvedInquiriesCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInquiryFilter(tab.id as any)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer text-xs whitespace-nowrap ${
                        inquiryFilter === tab.id
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-[#192234] text-stone-400 hover:text-white border border-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-stone-400 font-medium">
                  Showing {filteredInquiries.length} of {inquiries.length} messages
                </span>
              </div>

              {/* Inquiries List View */}
              {filteredInquiries.length === 0 ? (
                <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-12 text-center space-y-3 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-stone-400 mx-auto flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-stone-300">
                    {inquirySearch ? "No inquiries match your search" : "No client inquiries in this filter"}
                  </p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    New inquiries submitted by customers on the Contact page will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInquiries.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInquiryForModal(item)}
                      className="bg-[#141B29] border border-white/[0.07] hover:border-orange-500/40 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer group space-y-3.5"
                    >
                      {/* Top Header Row: Customer Name, Badges, Timestamp & Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Avatar initial */}
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-sm uppercase">
                            {item.fullName.charAt(0)}
                          </div>

                          {/* Customer Name */}
                          <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors">
                            {item.fullName}
                          </h3>

                          {/* Status Badge */}
                          {!item.isResolved ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              New &amp; Unresolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              Resolved
                            </span>
                          )}

                          {/* Inquiry Type Tag */}
                          <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                            {item.inquiryType}
                          </span>

                          {/* City */}
                          {item.city && (
                            <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-500" />
                              {item.city}
                            </span>
                          )}

                          {/* Timestamp */}
                          <span className="text-[11px] text-stone-500 font-mono">
                            • {new Date(item.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {/* View Modal Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInquiryForModal(item);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold transition-all cursor-pointer"
                            title="View inquiry details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Toggle Resolve Status */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleInquiryResolve(item.id, item.isResolved);
                            }}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              item.isResolved
                                ? "bg-stone-800 text-stone-400 hover:text-white border-white/10"
                                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25"
                            }`}
                            title={item.isResolved ? "Mark as unresolved" : "Mark as resolved"}
                          >
                            {item.isResolved ? (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reopen</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Resolve</span>
                              </>
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteInquiry(item.id);
                            }}
                            className="p-1.5 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact row: Email & Phone */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-300">
                        {item.email && (
                          <a
                            href={`mailto:${item.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 hover:text-orange-400 transition-colors text-stone-300"
                          >
                            <Mail className="w-3.5 h-3.5 text-orange-400" />
                            <span>{item.email}</span>
                          </a>
                        )}

                        <a
                          href={`tel:${item.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 hover:text-orange-400 transition-colors text-stone-300"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{item.phone}</span>
                        </a>

                        {/* Direct WhatsApp Quick Pill */}
                        <a
                          href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(item.fullName)}%2C%20thank%20you%20for%20contacting%20M.art%20Sports%20%26%20Fitness.`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                        >
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {/* Message Box Preview */}
                      <div className="p-3.5 rounded-xl bg-[#0F1420]/60 border border-white/[0.04] text-xs text-stone-300 leading-relaxed font-normal line-clamp-3">
                        {item.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* FULL INQUIRY DETAIL MODAL (ADMIN)                                */}
          {/* ================================================================= */}
          {selectedInquiryForModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
              <div className="bg-[#141B29] border border-white/10 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
                {/* Modal Top Bar */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0F1420]/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        Client Inquiry Details
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Received on {new Date(selectedInquiryForModal.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedInquiryForModal(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                  {/* Customer Card */}
                  <div className="p-4 rounded-2xl bg-[#192234] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-base uppercase shrink-0">
                        {selectedInquiryForModal.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-white">
                            {selectedInquiryForModal.fullName}
                          </p>
                          <span className="text-[10px] text-stone-400 font-medium">
                            ({selectedInquiryForModal.city})
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {selectedInquiryForModal.email || "No email provided"} • {selectedInquiryForModal.phone}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
                        selectedInquiryForModal.isResolved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      }`}
                    >
                      {selectedInquiryForModal.isResolved ? "✓ Resolved" : "Pending Action"}
                    </span>
                  </div>

                  {/* Inquiry Type Tag */}
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-stone-400 font-medium">Requirement Type:</span>
                    <span className="font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                      {selectedInquiryForModal.inquiryType}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="p-4 rounded-2xl bg-[#0F1420]/70 border border-white/5 space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Customer Message / Quotation Request
                    </p>
                    <p className="text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiryForModal.message}
                    </p>
                  </div>

                  {/* Fast Action Buttons: WhatsApp / Call / Email */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Direct Communication Channels
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/91${selectedInquiryForModal.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(selectedInquiryForModal.fullName)}%2C%20thank%20you%20for%20contacting%20M.art%20Sports%20%26%20Fitness%20regarding%20${encodeURIComponent(selectedInquiryForModal.inquiryType)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all text-center"
                      >
                        <span>WhatsApp Chat</span>
                      </a>

                      {/* Call Button */}
                      <a
                        href={`tel:${selectedInquiryForModal.phone}`}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/10 text-white font-bold text-xs transition-all text-center"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Customer</span>
                      </a>

                      {/* Email Button */}
                      {selectedInquiryForModal.email ? (
                        <a
                          href={`mailto:${selectedInquiryForModal.email}?subject=Regarding%20your%20M.art%20Sports%20Inquiry`}
                          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#192234] hover:bg-[#202C42] border border-white/10 text-white font-bold text-xs transition-all text-center"
                        >
                          <Mail className="w-3.5 h-3.5 text-orange-400" />
                          <span>Send Email</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-white/[0.03] text-stone-500 text-xs font-medium text-center">
                          No Email
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-white/10 bg-[#0F1420]/80 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => deleteInquiry(selectedInquiryForModal.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleInquiryResolve(selectedInquiryForModal.id, selectedInquiryForModal.isResolved)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedInquiryForModal.isResolved
                          ? "bg-stone-800 text-stone-300 hover:text-white border-white/10"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {selectedInquiryForModal.isResolved ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reopen Inquiry</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark as Resolved</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedInquiryForModal(null)}
                      className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION: NEWSLETTER SUBSCRIBERS VIEW                              */}
          {/* ================================================================= */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Newsletter <span className="text-orange-500">Subscribers</span>
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Mail className="w-3 h-3 text-sky-400" />
                      Live Store Sync
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {subscribers.length} genuine audience members subscribed to M.art gear drops &amp; updates.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative w-full sm:w-56">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      placeholder="Search email..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#192234] border border-white/[0.08] text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Copy All Emails button */}
                  <button
                    type="button"
                    onClick={copyAllEmails}
                    disabled={subscribers.length === 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {copiedAllEmails ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied All!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={fetchSubscribers}
                    disabled={subscribersLoading}
                    title="Refresh subscribers list"
                    className="p-2.5 rounded-xl bg-[#192234] border border-white/[0.08] text-stone-300 hover:text-white hover:border-orange-500/40 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${subscribersLoading ? "animate-spin text-orange-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 3 Stats Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Total Subscribers */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#141B29] p-5 shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {subscribers.length}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      Total Subscribers
                    </p>
                  </div>
                </div>

                {/* 2. Active Ratio */}
                <div className="rounded-2xl border border-emerald-500/20 bg-[#141B29] p-5 shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400 leading-tight">
                      100%
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      Active Status
                    </p>
                  </div>
                </div>

                {/* 3. New This Month */}
                <div className="rounded-2xl border border-sky-500/20 bg-[#141B29] p-5 shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-sky-400 leading-tight">
                      {subscribers.length}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                      New This Month
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
                {filteredSubscribers.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-stone-400 mx-auto flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-stone-300">
                      {subscriberSearch ? "No subscribers match your search" : "No subscribers yet"}
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      When visitors enter their email on the homepage Stay Updated banner, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-[#0F1420]/70 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                          <th className="px-5 py-3.5">Subscriber Email</th>
                          <th className="px-5 py-3.5">Source</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5">Subscribed Date</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {filteredSubscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Email */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                  {sub.email.charAt(0)}
                                </div>
                                <span className="font-semibold text-white">
                                  {sub.email}
                                </span>
                              </div>
                            </td>

                            {/* Source */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/[0.05] text-stone-300 border border-white/[0.08]">
                                {sub.source}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {sub.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-5 py-4 text-xs text-stone-400 whitespace-nowrap">
                              {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                {/* Copy Email button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(sub.email);
                                    alert(`Copied: ${sub.email}`);
                                  }}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                  title="Copy email address"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => deleteSubscriber(sub.id)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Remove subscriber"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hero Slides Management */}
          {activeTab === "hero-slides" && (
            <HeroSlidesManager
              onReturnToDashboard={() => setActiveTab("dashboard")}
              onStudioModeChange={setIsHeroStudioActive}
            />
          )}

          {/* Store Customizations & Facts */}
          {activeTab === "home-customization" && (
            <StoreCustomizationsManager />
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
                    className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
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

      {/* =================================================================== */}
      {/* MODAL: ADD CATEGORY                                                */}
      {/* =================================================================== */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141B29] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsAddCategoryModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Add New Category</h3>
                <p className="text-xs text-stone-400">Create a category to organize catalog products</p>
              </div>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boxing Gear, Gym Wear, Accessories"
                  value={newCategory.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    setNewCategory((prev) => ({
                      ...prev,
                      name: val,
                      slug:
                        prev.slug === "" ||
                        prev.slug === autoSlug.slice(0, -1) ||
                        prev.slug.startsWith(autoSlug.slice(0, Math.max(0, autoSlug.length - 1)))
                          ? autoSlug
                          : prev.slug,
                    }));
                  }}
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Category ID / Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. boxing, gym-wear"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Unique identifier used for URL filters &amp; product mapping.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Boxing gloves, punching bags, hand wraps, mouth guards"
                  value={newCategory.desc}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, desc: e.target.value })
                  }
                  className="w-full bg-[#182030] border border-stone-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-400 hover:text-white bg-stone-800/60 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =================================================================== */}
      {/* MODAL: CREATE / EDIT DISCOUNT COUPON                               */}
      {/* =================================================================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141B29] border border-stone-700 max-w-lg w-full rounded-3xl p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(false)}
              className="absolute right-5 top-5 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {editingCouponId ? "Edit Promo Coupon" : "Create New Discount Coupon"}
                </h3>
                <p className="text-xs text-stone-400">
                  Configure discount coupons for customer checkout
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g. WELCOME10, SAVE500"
                  className="w-full uppercase font-mono tracking-wider px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Description / Offer Tagline
                </label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, description: e.target.value })
                  }
                  placeholder="e.g. Get 10% off on your fitness gear order"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value as "percentage" | "flat",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Discount Value * {couponForm.discountType === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponForm.discountValue}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountValue: e.target.value })
                    }
                    placeholder={couponForm.discountType === "percentage" ? "10" : "200"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={couponForm.minOrderValue}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, minOrderValue: e.target.value })
                    }
                    placeholder="e.g. 499 (0 for no limit)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Max Discount Cap (₹) {couponForm.discountType === "flat" && "(N/A)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={couponForm.discountType === "flat"}
                    value={couponForm.maxDiscount}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, maxDiscount: e.target.value })
                    }
                    placeholder="e.g. 500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white focus:outline-none focus:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, expiryDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#192234] border border-white/10 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Store Status
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer bg-[#192234] px-3 py-2 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      checked={couponForm.isActive}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
                    />
                    <span className="font-bold text-white">
                      Active (Live on checkout)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 font-bold text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  {editingCouponId ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
