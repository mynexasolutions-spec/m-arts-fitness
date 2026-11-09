"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_PRODUCTS, getProductById, ProductDetailItem } from "@/data/products";
import {
  ShoppingCartIcon,
  HeartIcon,
  XIcon,
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export interface CartItem {
  key: string; // `${productId}__${option || "default"}`
  productId: string;
  option?: string;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  cartDrawerOpen: boolean;
  wishlistDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  setWishlistDrawerOpen: (open: boolean) => void;
  addToCart: (
    productId: string,
    quantity?: number,
    option?: string,
    openDrawer?: boolean
  ) => void;
  updateCartQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getProductCartCount: (productId: string) => number;
  totalCartCount: number;
  totalWishlistCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);

  // Clean up any previously saved localStorage keys so state is purely in-memory
  useEffect(() => {
    try {
      localStorage.removeItem("mart_cart_v1");
      localStorage.removeItem("mart_wishlist_v1");
    } catch {
      // ignore storage errors
    }
  }, []);

  // Lock body scroll when either drawer is open
  useEffect(() => {
    if (cartDrawerOpen || wishlistDrawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [cartDrawerOpen, wishlistDrawerOpen]);

  const addToCart = (
    productId: string,
    quantity = 1,
    option?: string,
    openDrawer = false
  ) => {
    const product = getProductById(productId);
    if (!product) return;
    const resolvedOption = option || product.options?.[0] || "";
    const key = `${productId}__${resolvedOption || "default"}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.key === key);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          key,
          productId,
          option: resolvedOption || undefined,
          quantity,
        },
      ];
    });

    // Do not automatically open side bar on add to cart - user opens it via cart icon
    if (openDrawer) {
      setWishlistDrawerOpen(false);
      // Side bar opening disabled per user request
    }
  };

  const updateCartQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const getProductCartCount = (productId: string) =>
    cart
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);

  const totalCartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalWishlistCount = wishlist.length;

  // Detailed cart items with product objects
  const detailedCartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { ...item, product } : null;
      })
      .filter(
        (x): x is CartItem & { product: ProductDetailItem } => x !== null
      );
  }, [cart]);

  const subtotal = useMemo(
    () =>
      detailedCartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [detailedCartItems]
  );

  const totalMRP = useMemo(
    () =>
      detailedCartItems.reduce(
        (sum, item) => sum + item.product.originalPrice * item.quantity,
        0
      ),
    [detailedCartItems]
  );

  const totalSavings = totalMRP - subtotal;
  const freeDeliveryThreshold = 999;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const wishlistProducts = useMemo(
    () =>
      wishlist
        .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
        .filter((p): p is ProductDetailItem => Boolean(p)),
    [wishlist]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        cartDrawerOpen,
        wishlistDrawerOpen,
        setCartDrawerOpen,
        setWishlistDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        getProductCartCount,
        totalCartCount,
        totalWishlistCount,
      }}
    >
      {children}

      {/* ========================================================= */}
      {/* 1. SLIDE-OVER CART DRAWER (Right Side)                    */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          cartDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!cartDrawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setCartDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[420px] bg-white shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-out ${
            cartDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                <ShoppingCartIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900 leading-none">
                  Your Cart ({totalCartCount})
                </h3>
                <p className="text-[11px] text-stone-500 font-medium mt-1">
                  100% Genuine M.art Sports Gear
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCartDrawerOpen(false)}
              aria-label="Close Cart"
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          {detailedCartItems.length > 0 && (
            <div className="px-5 py-3 bg-[#fff8f3] border-b border-orange-200/70">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <TruckIcon className="w-4 h-4 text-orange-500 shrink-0" />
                {amountForFreeDelivery === 0 ? (
                  <span className="text-emerald-600">
                    🎉 Yay! You unlocked FREE Fast Delivery!
                  </span>
                ) : (
                  <span>
                    Add{" "}
                    <strong className="text-orange-600">
                      ₹{amountForFreeDelivery}
                    </strong>{" "}
                    more for <span className="text-emerald-600">FREE Delivery</span>
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((subtotal / freeDeliveryThreshold) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-5">
            {detailedCartItems.length > 0 ? (
              <div className="space-y-4">
                {detailedCartItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-3.5 p-3.5 rounded-2xl border border-stone-200/90 bg-white shadow-2xs hover:border-orange-300 transition-colors"
                  >
                    <Link
                      href={`/products/${item.product.id}`}
                      onClick={() => setCartDrawerOpen(false)}
                      className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#f6f6f6] border border-stone-200/60 shrink-0"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.product.id}`}
                            onClick={() => setCartDrawerOpen(false)}
                            className="font-extrabold text-xs sm:text-sm text-stone-900 hover:text-orange-600 transition-colors truncate"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            aria-label="Remove item"
                            className="text-stone-400 hover:text-red-500 text-xs font-bold p-0.5 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        {item.option && (
                          <div className="text-[11px] font-bold text-orange-600 mt-0.5 truncate">
                            Option: {item.option}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2.5">
                        {/* Quantity Stepper */}
                        <div className="inline-flex items-center border border-stone-300 rounded-full bg-stone-50 px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.key, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center font-extrabold text-stone-700 text-xs cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="font-extrabold text-xs text-stone-900 px-2.5">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.key, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full hover:bg-white flex items-center justify-center font-extrabold text-stone-700 text-xs cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <span className="text-sm font-black text-stone-950">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through ml-1.5">
                            ₹{item.product.originalPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                  <ShoppingCartIcon className="w-7 h-7" />
                </div>
                <h4 className="text-base font-extrabold text-stone-900 mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore M.art dumbbells, skipping ropes, yoga mats, and agility gear to start your fitness journey.
                </p>
                <Link
                  href="/products"
                  onClick={() => setCartDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all"
                >
                  Shop Fitness Gear
                </Link>
              </div>
            )}
          </div>

          {/* Drawer Footer: Bill Summary + Proceed to Checkout */}
          {detailedCartItems.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/90 space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500 font-medium">
                  <span>Total MRP</span>
                  <span className="line-through">₹{totalMRP}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Savings</span>
                  <span>− ₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-stone-600 font-semibold">
                  <span>Delivery</span>
                  <span>
                    {amountForFreeDelivery === 0 ? (
                      <strong className="text-emerald-600">FREE</strong>
                    ) : (
                      "₹49"
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-sm sm:text-base font-black text-stone-950">
                  <span>Total Payable</span>
                  <span>
                    ₹{subtotal + (amountForFreeDelivery === 0 ? 0 : 49)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setCartDrawerOpen(false)}
                  className="w-full py-3.5 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-stone-500">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-orange-500" />
                  <span>COD, UPI &amp; 7-Day Easy Replacement</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SLIDE-OVER WISHLIST DRAWER (Right Side)                */}
      {/* ========================================================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          wishlistDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!wishlistDrawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setWishlistDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-[400px] bg-white shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-out ${
            wishlistDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center">
                <HeartIcon className="w-4 h-4 fill-red-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900 leading-none">
                  Saved Wishlist ({totalWishlistCount})
                </h3>
                <p className="text-[11px] text-stone-500 font-medium mt-1">
                  Your favorite fitness gear
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWishlistDrawerOpen(false)}
              aria-label="Close Wishlist"
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-5">
            {wishlistProducts.length > 0 ? (
              <div className="space-y-3.5">
                {wishlistProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 rounded-2xl border border-stone-200/90 bg-white shadow-2xs hover:border-orange-300 transition-colors"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      onClick={() => setWishlistDrawerOpen(false)}
                      className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#f6f6f6] border border-stone-200/60 shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.id}`}
                            onClick={() => setWishlistDrawerOpen(false)}
                            className="font-extrabold text-xs sm:text-sm text-stone-900 hover:text-orange-600 transition-colors truncate"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.id)}
                            aria-label="Remove from wishlist"
                            className="text-stone-400 hover:text-red-500 text-xs font-bold p-0.5 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-sm font-black text-stone-950">
                            ₹{item.price}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(item.id, 1, item.options?.[0], false);
                        }}
                        className="mt-2 w-full py-1.5 px-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <ShoppingCartIcon className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
                  <HeartIcon className="w-7 h-7" />
                </div>
                <h4 className="text-base font-extrabold text-stone-900 mb-1">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Tap the heart icon on any product to save it here for later.
                </p>
                <Link
                  href="/products"
                  onClick={() => setWishlistDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
