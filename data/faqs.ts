export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Shipping & Delivery" | "Returns & Exchanges" | "Orders & Bulk" | "Product Quality" | "General";
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is M.art's delivery timeline across India?",
    answer: "Standard courier orders arrive in 3-5 business days. Direct dispatch from our Meerut manufacturing hub with live tracking numbers provided via SMS, WhatsApp, and email.",
    category: "Shipping & Delivery",
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "faq-2",
    question: "Do you offer a return or replacement policy?",
    answer: "Yes, we provide 7-day hassle-free replacements for any genuine manufacturing defects or transit damage. Simply raise a request via our Contact page or WhatsApp helpline.",
    category: "Returns & Exchanges",
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "faq-3",
    question: "Can I place bulk institutional orders for gyms, academies, and schools?",
    answer: "Yes, we support commercial gym fitouts, sports academies, and institutional bulk orders with wholesale commercial pricing, custom brand engraving, and door-step pallet delivery.",
    category: "Orders & Bulk",
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "faq-4",
    question: "Are your sports products 100% authentic and tested?",
    answer: "Every single piece of equipment is manufactured to match tournament regulations and tested by active athletes and trainers for durability before packaging.",
    category: "Product Quality",
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "faq-5",
    question: "What payment methods are supported on M.art?",
    answer: "We support UPI (GPay, PhonePe, Paytm), All major Credit & Debit cards, Net Banking, and Cash on Delivery (COD) for eligible serviceable pincodes across India.",
    category: "General",
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = "mart_global_faqs";

export function getStoredFAQs(): FAQItem[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FAQS));
      return DEFAULT_FAQS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
    return DEFAULT_FAQS;
  } catch (err) {
    console.warn("Failed to load FAQs from localStorage:", err);
    return DEFAULT_FAQS;
  }
}

export function saveStoredFAQs(faqs: FAQItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
    window.dispatchEvent(new Event("mart_faqs_updated"));
  } catch (err) {
    console.warn("Failed to save FAQs to localStorage:", err);
  }
}
