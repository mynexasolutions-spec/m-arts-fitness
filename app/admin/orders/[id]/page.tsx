"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  Users,
  DollarSign,
  Ticket,
  Copy,
  Check,
  Boxes,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { ALL_PRODUCTS } from "@/data/products";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
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
  couponCode?: string;
  couponDiscount?: number;
  items: OrderItem[];
}

const DEFAULT_FALLBACK_ORDERS: OrderRecord[] = [
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

function OrderDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;
  const cleanId = decodeURIComponent(rawId).replace(/^#/, "");

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Helper to match SKU from Catalog if missing on item
  const resolveItemSku = (item: OrderItem) => {
    if (item.sku) return item.sku;
    const found = ALL_PRODUCTS.find(
      (p) =>
        p.id === item.id ||
        p.name.toLowerCase() === item.name.toLowerCase()
    );
    if (found?.sku) return found.sku;
    const prefix = (item.name || item.id || "PROD")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 3)
      .toUpperCase();
    return `MART-${prefix || "SKU"}-101`;
  };

  const resolveItemImage = (item: OrderItem) => {
    if (item.image) return item.image;
    const found = ALL_PRODUCTS.find(
      (p) =>
        p.id === item.id ||
        p.name.toLowerCase() === item.name.toLowerCase()
    );
    return found?.image || found?.gallery?.[0] || "/Gym-Equipment.jpg";
  };

  // Load Order Data
  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      setLoading(true);

      // 1. Try fetching from live DB API
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.orders)) {
            const foundInDb = data.orders.find(
              (o: any) =>
                o.orderId.toLowerCase() === cleanId.toLowerCase() ||
                o.orderId.toLowerCase() === `mart-${cleanId}`.toLowerCase()
            );
            if (foundInDb && isMounted) {
              setOrder(foundInDb);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("DB orders fetch notice:", e);
      }

      // 2. Check localStorage
      try {
        const stored = localStorage.getItem("mart_orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const foundInStorage = parsed.find(
              (o: OrderRecord) =>
                o.orderId.toLowerCase() === cleanId.toLowerCase() ||
                o.orderId.toLowerCase() === `mart-${cleanId}`.toLowerCase()
            );
            if (foundInStorage && isMounted) {
              setOrder(foundInStorage);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Storage orders read notice:", err);
      }

      // 3. Fallback to mock dataset
      const foundMock = DEFAULT_FALLBACK_ORDERS.find(
        (o) =>
          o.orderId.toLowerCase() === cleanId.toLowerCase() ||
          o.orderId.toLowerCase() === `mart-${cleanId}`.toLowerCase()
      );

      if (foundMock && isMounted) {
        setOrder(foundMock);
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [cleanId]);

  const handleCopy = (text: string, type: "sku" | "order") => {
    navigator.clipboard.writeText(text);
    if (type === "sku") {
      setCopiedSku(text);
      setTimeout(() => setCopiedSku(null), 2000);
    } else {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  const handleUpdateStatus = async (newStatus: OrderRecord["status"]) => {
    if (!order) return;
    setStatusUpdating(true);
    const updatedOrder = { ...order, status: newStatus };
    setOrder(updatedOrder);

    // 1. Update in database
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, status: newStatus }),
      });
    } catch (err) {
      console.warn("DB order update status error:", err);
    }

    // 2. Update in localStorage
    try {
      const stored = localStorage.getItem("mart_orders");
      const currentList: OrderRecord[] = stored ? JSON.parse(stored) : [];
      const updatedList = currentList.map((o) =>
        o.orderId === order.orderId ? { ...o, status: newStatus } : o
      );
      if (!updatedList.some((o) => o.orderId === order.orderId)) {
        updatedList.unshift(updatedOrder);
      }
      localStorage.setItem("mart_orders", JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Local storage update notice:", err);
    }

    setStatusUpdating(false);
    setSaveToast(`Order status updated to "${newStatus}"!`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-white">
        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-stone-400">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-[#141B29] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-white mb-2">Order Not Found</h2>
          <p className="text-xs text-stone-400 mb-6 leading-relaxed">
            Could not find an order matching #{cleanId}. It may have been archived or removed.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Admin Panel</span>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalUnits = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const couponDiscount = order.couponDiscount || 0;
  const shippingFee = Math.max(
    0,
    Math.round(order.total - Math.max(0, subtotal - couponDiscount))
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* TOP HEADER / ACTION BAR */}
      <header className="sticky top-0 z-40 bg-[#101622]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </Link>

            <span className="text-stone-600 hidden sm:inline">/</span>

            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="font-mono text-xs sm:text-sm font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg shrink-0">
                #{order.orderId}
              </span>
              <span className="text-xs text-stone-400 hidden md:inline truncate">
                • {order.customerName}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-xs font-bold text-stone-200 hover:text-white transition-all cursor-pointer"
              title="Print Packing Slip / Invoice"
            >
              <Printer className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>

            {order.customerPhone && (
              <a
                href={`https://wa.me/91${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello ${order.customerName}, this is regarding your M.art Sports Order #${order.orderId}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
                title="WhatsApp Customer"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        
        {/* ORDER OVERVIEW HERO BAR */}
        <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-extrabold shrink-0 shadow-lg shadow-orange-500/10">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Order #{order.orderId}
                </h1>
                <button
                  type="button"
                  onClick={() => handleCopy(order.orderId, "order")}
                  className="text-stone-400 hover:text-orange-400 text-xs transition-colors p-1"
                  title="Copy Order ID"
                >
                  {copiedOrderId ? (
                    <span className="text-emerald-400 text-[11px] font-bold">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  Placed on {order.date}
                </span>
                <span>•</span>
                <span className="text-stone-300 font-medium">
                  {order.items.length} Products ({totalUnits} total units)
                </span>
              </p>
            </div>
          </div>

          {/* Fulfillment Status Selector */}
          <div className="flex items-center gap-3 bg-[#101622] p-2.5 sm:p-3 rounded-xl border border-white/[0.06] shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                Fulfillment Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold mt-0.5 ${
                  order.status === "Delivered"
                    ? "text-emerald-400"
                    : order.status === "Shipped"
                    ? "text-sky-400"
                    : order.status === "Processing"
                    ? "text-amber-400"
                    : "text-stone-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {order.status}
              </span>
            </div>

            <select
              value={order.status}
              disabled={statusUpdating}
              onChange={(e) =>
                handleUpdateStatus(e.target.value as OrderRecord["status"])
              }
              className="bg-[#182030] border border-stone-700 text-xs font-bold text-white rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer disabled:opacity-50"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: ITEMS & SKU BREAKDOWN + TIMELINE (8 COLS)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Products & SKU Table */}
            <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-orange-400" />
                  <h2 className="text-base font-bold text-white">
                    Ordered Products &amp; SKU Numbers
                  </h2>
                </div>
                {copiedSku && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    Copied SKU: {copiedSku}
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#192234] text-stone-400 font-bold uppercase tracking-wider text-[11px] border-b border-white/[0.06]">
                    <tr>
                      <th className="py-3.5 px-5">Product Details</th>
                      <th className="py-3.5 px-4">SKU Code</th>
                      <th className="py-3.5 px-4 text-right">Unit Price</th>
                      <th className="py-3.5 px-4 text-center">Qty</th>
                      <th className="py-3.5 px-5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {order.items.map((item, idx) => {
                      const itemSku = resolveItemSku(item);
                      const itemImg = resolveItemImage(item);
                      const lineTotal = item.price * item.quantity;

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Image & Title */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-14 h-14 rounded-xl bg-stone-900 border border-white/[0.08] overflow-hidden relative shrink-0">
                                <NextImage
                                  src={itemImg}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-1.5"
                                  sizes="56px"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-white text-sm leading-snug">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                                  Item ID: {item.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU Number with Copy Button */}
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => handleCopy(itemSku, "sku")}
                              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer"
                              title="Click to copy SKU"
                            >
                              <span className="font-mono text-xs font-bold text-orange-400 tracking-wider">
                                {itemSku}
                              </span>
                              <Copy className="w-3.5 h-3.5 text-stone-500 group-hover:text-orange-400 transition-colors" />
                            </button>
                          </td>

                          {/* Unit Price */}
                          <td className="py-4 px-4 text-right font-semibold text-stone-300 text-sm">
                            ₹{item.price.toLocaleString("en-IN")}
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg bg-white/[0.07] border border-white/10 text-white font-extrabold text-xs">
                              ×{item.quantity}
                            </span>
                          </td>

                          {/* Line Total */}
                          <td className="py-4 px-5 text-right font-extrabold text-emerald-400 text-sm">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Items Table Footer */}
              <div className="p-4 bg-[#101622] border-t border-white/[0.06] flex items-center justify-between text-xs text-stone-400">
                <span>
                  Showing <strong className="text-white">{order.items.length}</strong> unique item(s)
                </span>
                <span className="font-semibold">
                  Total Items Quantity: <strong className="text-white">{totalUnits} units</strong>
                </span>
              </div>
            </div>

            {/* Visual Fulfillment Tracker Stepper */}
            <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Order Fulfillment Lifecycle</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { key: "Confirmed", label: "1. Confirmed", desc: "Order received" },
                  { key: "Processing", label: "2. Processing", desc: "Packaging in warehouse" },
                  { key: "Shipped", label: "3. Shipped", desc: "Handed to courier" },
                  { key: "Delivered", label: "4. Delivered", desc: "Completed" },
                ].map((step, idx) => {
                  const statuses = ["Confirmed", "Processing", "Shipped", "Delivered"];
                  const currentIndex = statuses.indexOf(order.status);
                  const isPassed = currentIndex >= idx;
                  const isCurrent = order.status === step.key;

                  return (
                    <div
                      key={step.key}
                      onClick={() => handleUpdateStatus(step.key as any)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                          : isPassed
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-[#101622] border-white/[0.05] text-stone-500 hover:text-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-stone-600 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                        )}
                        <span>{step.label}</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 pl-5">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: CUSTOMER, ADDRESS & BILLING (4 COLS)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Customer Details Card */}
            <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 shadow-xl space-y-3.5">
              <div className="text-[10px] font-bold uppercase text-stone-400 tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Customer Information</span>
              </div>

              <div className="font-extrabold text-white text-base">
                {order.customerName}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-stone-300">
                  <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="hover:text-orange-400 font-semibold transition-colors"
                  >
                    {order.customerPhone}
                  </a>
                </div>

                {order.customerEmail && (
                  <div className="flex items-center gap-2.5 text-stone-300 truncate">
                    <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="hover:text-orange-400 truncate transition-colors"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                )}
              </div>

              {order.customerPhone && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/91${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hello ${order.customerName}, regarding your M.art Sports Order #${order.orderId}...`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>
              )}
            </div>

            {/* Shipping Address Card */}
            <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 shadow-xl space-y-3">
              <div className="text-[10px] font-bold uppercase text-stone-400 tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Delivery Address</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                {order.addressSummary}
              </p>

              <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-xs text-stone-400 font-semibold">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Standard Doorstep Delivery</span>
              </div>
            </div>

            {/* Payment & Bill Summary Card */}
            <div className="bg-[#141B29] border border-white/[0.07] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="text-[10px] font-bold uppercase text-stone-400 tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Payment &amp; Billing Summary</span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#101622] border border-white/[0.05]">
                <span className="text-stone-400">Payment Mode:</span>
                <span className="font-extrabold text-white">{order.payment}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-stone-200">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {order.couponCode && (
                  <div className="flex items-center justify-between text-orange-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Coupon ({order.couponCode}):</span>
                    </span>
                    <span className="font-bold">
                      -₹{order.couponDiscount || 0}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-stone-400">
                  <span>Shipping Fee:</span>
                  {shippingFee > 0 ? (
                    <span className="font-bold text-stone-200">
                      +₹{shippingFee}
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-extrabold">FREE</span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-white font-extrabold text-sm">
                    Grand Total:
                  </span>
                  <span className="text-emerald-400 font-black text-xl">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Packing Slip</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default function DedicatedOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-stone-400">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading order details...</span>
          </div>
        </div>
      }
    >
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
