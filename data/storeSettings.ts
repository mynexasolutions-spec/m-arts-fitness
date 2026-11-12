export interface StoreCustomizations {
  // 1. Factory & Contact Hub
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  address: string;
  operatingHours: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;

  // 2. Factory Numbers & Facts Counter (Social Proof)
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;

  // 3. Trust Strip & Value Badges
  trust1: string;
  trust2: string;
  trust3: string;
  trust4: string;

  // 4. 3-Step Ordering Guide (Wholesale Process)
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // 5. Brand Slogans & Taglines
  brandTagline: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
}

export const DEFAULT_STORE_CUSTOMIZATIONS: StoreCustomizations = {
  // 1. Factory & Contact Hub
  phoneDisplay: "+91 80776 46203",
  phoneTel: "+918077646203",
  whatsappNumber: "918077646203",
  whatsappDefaultMessage:
    "Hi M.art, I have an inquiry regarding sports & fitness gear.",
  email: "multipleart786@gmail.com",
  address: "4138, Mohsin Bagh, Zaidi Farm, Meerut, Uttar Pradesh - 250002",
  operatingHours: "Mon – Sat: 9:00 AM – 8:00 PM (Sunday Closed / By Appointment)",
  instagramUrl:
    "https://www.instagram.com/m.art.sports.and.fitness?cplk=MXIyaHhjOTJsZ2xkaw%3D%3D&utm_source=qr",
  facebookUrl: "https://www.facebook.com/share/14pE7e2essx/?mibextid=wwXIfr",
  youtubeUrl: "https://youtube.com/@mohdshoaib1513?si=fxzA9WhiFlI8s7ve",

  // 2. Factory Numbers & Facts Counter
  stat1Value: "50,000+",
  stat1Label: "Dumbbells & Weight Plates Manufactured",
  stat2Value: "2,500+",
  stat2Label: "Commercial Gyms & Academies Fitted",
  stat3Value: "10+ Years",
  stat3Label: "Meerut Foundry & Crafting Legacy",
  stat4Value: "Pan-India",
  stat4Label: "Express Doorstep Cargo Dispatch",

  // 3. Trust Strip & Value Badges
  trust1: "Direct Factory Wholesale Pricing",
  trust2: "100% Genuine Casting Materials",
  trust3: "Custom Gym Logo & Weight Branding",
  trust4: "Official GST Tax Invoicing",

  // 4. 3-Step Ordering Guide
  step1Title: "Share Requirement",
  step1Desc:
    "Fill in the inquiry form above or share your required gear, custom weights, and order quantity.",
  step2Title: "WhatsApp & Call Quote",
  step2Desc:
    "Our Meerut factory team reviews your order specs and connects directly on WhatsApp or Call with quotation.",
  step3Title: "Pan-India Dispatch",
  step3Desc:
    "Orders are safely packed and dispatched from our Meerut manufacturing unit via express cargo with tracking.",

  // 5. Brand Slogans & Taglines
  brandTagline: "Direct Manufacturer & Fitness Gear Supplier • Meerut",
  heroBadge: "Get In Touch With M.art",
  heroTitle: "Contact Us & Bulk Order Inquiries",
  heroSubtitle:
    "Have a question about our gym dumbbells, yoga mats, skipping ropes, or looking for wholesale factory pricing for your gym or academy? Reach out to our Meerut team directly.",
  formTitle: "Send Us Your Requirement",
  formSubtitle:
    "Fill in your details below for bulk wholesale pricing, custom gym orders, or product support.",
};

const STORAGE_KEY = "mart_store_customizations_v1";

export function getStoredStoreCustomizations(): StoreCustomizations {
  if (typeof window === "undefined") return DEFAULT_STORE_CUSTOMIZATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_STORE_CUSTOMIZATIONS)
      );
      return DEFAULT_STORE_CUSTOMIZATIONS;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        ...DEFAULT_STORE_CUSTOMIZATIONS,
        ...parsed,
      };
    }
    return DEFAULT_STORE_CUSTOMIZATIONS;
  } catch (err) {
    console.warn("Failed to load store customizations from localStorage:", err);
    return DEFAULT_STORE_CUSTOMIZATIONS;
  }
}

export async function fetchStoreCustomizations(): Promise<StoreCustomizations> {
  if (typeof window === "undefined") return DEFAULT_STORE_CUSTOMIZATIONS;
  try {
    const res = await fetch("/api/customizations");
    const data = await res.json();
    if (data && data.success && data.customizations) {
      const merged = {
        ...DEFAULT_STORE_CUSTOMIZATIONS,
        ...data.customizations,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("mart_customizations_updated"));
      return merged;
    }
  } catch (err) {
    console.warn("Could not fetch customizations from server API:", err);
  }
  return getStoredStoreCustomizations();
}

export function saveStoredStoreCustomizations(
  customizations: StoreCustomizations
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customizations));
    window.dispatchEvent(new Event("mart_customizations_updated"));
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(customizations) })
    );

    // Sync to server API asynchronously
    fetch("/api/customizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customizations),
    }).catch((err) => {
      console.warn("Failed to sync customizations to server API:", err);
    });
  } catch (err) {
    console.warn("Failed to save store customizations to localStorage:", err);
  }
}

export function resetStoredStoreCustomizations(): StoreCustomizations {
  saveStoredStoreCustomizations(DEFAULT_STORE_CUSTOMIZATIONS);
  fetch("/api/customizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset: true }),
  }).catch((err) => {
    console.warn("Failed to reset customizations on server API:", err);
  });
  return DEFAULT_STORE_CUSTOMIZATIONS;
}
