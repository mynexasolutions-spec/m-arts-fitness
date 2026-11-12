export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate?: string; // YYYY-MM-DD
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coupon-1",
    code: "WELCOME10",
    description: "Get 10% OFF on your fitness gear (up to ₹500)",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 499,
    maxDiscount: 500,
    expiryDate: "2027-12-31",
    usageLimit: 500,
    timesUsed: 42,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "coupon-2",
    code: "MART200",
    description: "Flat ₹200 Instant Discount on orders above ₹1,499",
    discountType: "flat",
    discountValue: 200,
    minOrderValue: 1499,
    expiryDate: "2027-12-31",
    usageLimit: 200,
    timesUsed: 19,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "coupon-3",
    code: "FIT50",
    description: "Flat ₹50 OFF on any order above ₹299",
    discountType: "flat",
    discountValue: 50,
    minOrderValue: 299,
    expiryDate: "2027-12-31",
    usageLimit: 1000,
    timesUsed: 87,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = "mart_coupons";

export function getStoredCoupons(): Coupon[] {
  if (typeof window === "undefined") return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_COUPONS;
  } catch (err) {
    console.warn("Failed to load coupons from localStorage:", err);
    return DEFAULT_COUPONS;
  }
}

export function saveStoredCoupons(coupons: Coupon[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    // Trigger custom event so any other open component can re-sync
    window.dispatchEvent(new Event("mart_coupons_updated"));
  } catch (err) {
    console.warn("Failed to save coupons to localStorage:", err);
  }
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  coupon?: Coupon;
  error?: string;
}

export function validateCoupon(
  code: string,
  cartTotal: number,
  customCoupons?: Coupon[]
): CouponValidationResult {
  const cleanCode = (code || "").trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountAmount: 0, error: "Please enter a coupon code" };
  }

  const coupons = customCoupons || getStoredCoupons();
  const coupon = coupons.find((c) => c.code.trim().toUpperCase() === cleanCode);

  if (!coupon) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Coupon "${cleanCode}" is invalid or does not exist.`,
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Coupon "${cleanCode}" is currently inactive.`,
    };
  }

  if (coupon.expiryDate) {
    const expiry = new Date(coupon.expiryDate);
    // End of day
    expiry.setHours(23, 59, 59, 999);
    if (Date.now() > expiry.getTime()) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Coupon "${cleanCode}" has expired on ${coupon.expiryDate}.`,
      };
    }
  }

  if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
    const shortBy = coupon.minOrderValue - cartTotal;
    return {
      valid: false,
      discountAmount: 0,
      error: `Minimum order value for ${cleanCode} is ₹${coupon.minOrderValue}. Add ₹${shortBy} more to apply!`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((cartTotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = Math.min(coupon.discountValue, cartTotal);
  }

  return {
    valid: true,
    discountAmount: Math.max(0, discount),
    coupon,
  };
}
