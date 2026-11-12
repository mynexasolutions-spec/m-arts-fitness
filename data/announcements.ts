export interface AnnouncementItem {
  id: string;
  icon: "truck" | "shield" | "rotate" | "card" | "flame" | "tag" | "award" | "star";
  text: string;
  badge?: string;
  linkUrl?: string;
  couponCode?: string;
  isActive: boolean;
}

export interface AnnouncementsConfig {
  isEnabled: boolean;
  autoplaySpeedSeconds: number;
  mobileMode: "auto-swipe";
  desktopMode: "clean-bar";
  desktopShowTrustBadges: boolean;
  items: AnnouncementItem[];
}

export const DEFAULT_ANNOUNCEMENTS_CONFIG: AnnouncementsConfig = {
  isEnabled: true,
  autoplaySpeedSeconds: 3.5,
  mobileMode: "auto-swipe",
  desktopMode: "clean-bar",
  desktopShowTrustBadges: true,
  items: [
    {
      id: "ann-1",
      icon: "truck",
      text: "Free Delivery Above ₹999",
      badge: "FREE SHIP",
      linkUrl: "/products",
      isActive: true,
    },
    {
      id: "ann-2",
      icon: "flame",
      text: "Flat 10% OFF on all Gear",
      badge: "OFFER",
      couponCode: "WELCOME10",
      linkUrl: "/products",
      isActive: true,
    },
    {
      id: "ann-3",
      icon: "shield",
      text: "100% Genuine Sports Gear",
      badge: "VERIFIED",
      isActive: true,
    },
    {
      id: "ann-4",
      icon: "rotate",
      text: "7-Day Easy Returns",
      badge: "GUARANTEED",
      isActive: true,
    },
    {
      id: "ann-5",
      icon: "card",
      text: "Safe Payments + COD Available",
      badge: "100% SECURE",
      isActive: true,
    },
  ],
};

const STORAGE_KEY = "mart_announcements_config_v2";

export function getStoredAnnouncementsConfig(): AnnouncementsConfig {
  if (typeof window === "undefined") return DEFAULT_ANNOUNCEMENTS_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENTS_CONFIG));
      return DEFAULT_ANNOUNCEMENTS_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
      return {
        ...DEFAULT_ANNOUNCEMENTS_CONFIG,
        ...parsed,
      };
    }
    return DEFAULT_ANNOUNCEMENTS_CONFIG;
  } catch (err) {
    console.warn("Failed to load announcements from localStorage:", err);
    return DEFAULT_ANNOUNCEMENTS_CONFIG;
  }
}

export function saveStoredAnnouncementsConfig(config: AnnouncementsConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("mart_announcements_updated"));
  } catch (err) {
    console.warn("Failed to save announcements to localStorage:", err);
  }
}
