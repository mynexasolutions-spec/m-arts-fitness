"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/data/products";
import {
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  CreditCardIcon,
} from "@/components/Icons";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    totalCartCount,
  } = useStore();

  // Resolve products from cart items
  const detailedCartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { ...item, product } : null;
      })
      .filter(Boolean) as Array<(typeof cart)[0] & { product: ReturnType<typeof getProductById> & object }>;
  }, [cart]);

  // Pricing calculations
  const subtotal = useMemo(() => {
    return detailedCartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
  }, [detailedCartItems]);

  const totalMrp = useMemo(() => {
    return detailedCartItems.reduce((acc, item) => {
      return acc + item.product.originalPrice * item.quantity;
    }, 0);
  }, [detailedCartItems]);

  const discountSavings = Math.max(0, totalMrp - subtotal);
  const freeDeliveryThreshold = 999;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || subtotal === 0;
  const deliveryCharge = isFreeDelivery ? 0 : 99;
  const totalPayable = subtotal + deliveryCharge;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-[#faf8f6] text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Strip */}
        <section className="bg-[#0e0d0c] text-white py-10 sm:py-12 border-b border-stone-800">
          <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-3">
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-orange-400">Shopping Cart</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
                  <span className="text-[11px] font-extrabold tracking-widest text-orange-400 uppercase">
                    Your Order Basket
                  </span>
                  <span className="w-4 h-[2px] bg-orange-500 rounded-full" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Shopping Cart
                </h1>
              </div>

              {detailedCartItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-stone-300">
                    {totalCartCount} {totalCartCount === 1 ? "Item" : "Items"} in Cart
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20 py-8 sm:py-12">
          {detailedCartItems.length === 0 ? (
            /* Empty Cart View */
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-14 border border-stone-200/90 shadow-sm text-center">
              <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-orange-200/80">
                <ShoppingCartIcon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Your Cart is Empty
              </h2>
              <p className="text-stone-500 text-sm mt-2 mb-8 leading-relaxed max-w-md mx-auto">
                Looks like you haven&apos;t added any sports or gym equipment yet. Discover our premium dumbbells, mats, and training accessories!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Explore Products</span>
              </Link>
            </div>
          ) : (
            /* Filled Cart 2-Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
              
              {/* Left Column: Cart Items (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Free Shipping Alert Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-stone-900 mb-2">
                    <TruckIcon className="w-5 h-5 text-orange-500 shrink-0" />
                    {isFreeDelivery ? (
                      <span className="text-emerald-700">
                        🎉 You&apos;ve unlocked <strong className="font-extrabold text-emerald-800">FREE Fast Delivery</strong> on this order!
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong className="text-orange-600">
                          ₹{amountForFreeDelivery}
                        </strong>{" "}
                        more to qualify for <span className="text-emerald-600 font-extrabold">FREE Doorstep Delivery</span>
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((subtotal / freeDeliveryThreshold) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm divide-y divide-stone-100 overflow-hidden">
                  {detailedCartItems.map((item) => (
                    <div
                      key={item.key}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                    >
                      {/* Product Media & Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f7f5f3] border border-stone-200 overflow-hidden shrink-0 group"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200/70 mb-1">
                            {item.product.categoryLabel}
                          </span>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="block font-black text-sm sm:text-base text-stone-900 hover:text-orange-600 transition-colors truncate"
                          >
                            {item.product.name}
                          </Link>

                          {item.option && (
                            <p className="text-xs text-stone-500 font-medium mt-0.5">
                              Variant: <span className="font-bold text-stone-800">{item.option}</span>
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-base sm:text-lg font-black text-stone-950">
                              ₹{item.product.price}
                            </span>
                            <span className="text-xs text-stone-400 line-through">
                              ₹{item.product.originalPrice}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              Save ₹{item.product.originalPrice - item.product.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs text-stone-400 font-medium">Subtotal</span>
                          <p className="text-base sm:text-lg font-black text-stone-900">
                            ₹{item.product.price * item.quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-9 text-center text-xs sm:text-sm font-black text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-200 font-bold transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            aria-label="Remove item"
                            className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from Cart"
                          >
                            <span className="text-sm font-bold">✕</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Link */}
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    <span>Continue Shopping For More Gear</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">100% Genuine</p>
                      <p className="text-[11px] text-stone-500">M.art authentic gear</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <RotateCcwIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">7-Day Replacement</p>
                      <p className="text-[11px] text-stone-500">Hassle-free guarantee</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <CreditCardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">Secure Payments</p>
                      <p className="text-[11px] text-stone-500">COD, UPI &amp; Cards</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary (4 cols) */}
              <div className="lg:col-span-4 sticky top-24">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm">
                  <h3 className="text-lg font-black text-stone-900 pb-4 border-b border-stone-100">
                    Order Summary
                  </h3>

                  <div className="space-y-3 py-4 border-b border-stone-100 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Total MRP</span>
                      <span className="font-semibold text-stone-800">₹{totalMrp}</span>
                    </div>

                    {discountSavings > 0 && (
                      <div className="flex items-center justify-between text-emerald-600 font-bold">
                        <span>Discount Savings</span>
                        <span>- ₹{discountSavings}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-stone-600">
                      <span>Delivery Charge</span>
                      <span className="font-bold">
                        {isFreeDelivery ? (
                          <span className="text-emerald-600 uppercase text-xs">FREE</span>
                        ) : (
                          <span>₹{deliveryCharge}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Total Payable */}
                  <div className="pt-4 pb-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-500 block uppercase tracking-wider">
                        Total Amount
                      </span>
                      <span className="text-2xl font-black text-stone-950">
                        ₹{totalPayable}
                      </span>
                    </div>
                    {discountSavings > 0 && (
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        You save ₹{discountSavings}
                      </span>
                    )}
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/45 transition-all transform hover:-translate-y-0.5 active:scale-95 text-center cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                  </Link>

                  <p className="text-[11px] text-center text-stone-400 mt-4 leading-relaxed font-medium">
                    Taxes included. Cash on Delivery and online UPI payments available at checkout.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>

        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}

