export interface DeliverySettings {
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  dispatchHubLocation: string;
  estimatedDeliveryDays: string;
  expressCargoDispatch: boolean;
}

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  freeShippingThreshold: 999,
  standardDeliveryFee: 49,
  dispatchHubLocation:
    "4138, Mohsin Bagh, Zaidi Farm, Meerut, UP (Sports Manufacturing Hub)",
  estimatedDeliveryDays: "3-5 Business Days",
  expressCargoDispatch: true,
};

const STORAGE_KEY = "mart_delivery_settings_v1";

export function getStoredDeliverySettings(): DeliverySettings {
  if (typeof window === "undefined") return DEFAULT_DELIVERY_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DELIVERY_SETTINGS));
      return DEFAULT_DELIVERY_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        ...DEFAULT_DELIVERY_SETTINGS,
        ...parsed,
        freeShippingThreshold: Number(parsed.freeShippingThreshold) || DEFAULT_DELIVERY_SETTINGS.freeShippingThreshold,
        standardDeliveryFee: Number(parsed.standardDeliveryFee) ?? DEFAULT_DELIVERY_SETTINGS.standardDeliveryFee,
      };
    }
    return DEFAULT_DELIVERY_SETTINGS;
  } catch (err) {
    console.warn("Failed to load delivery settings from localStorage:", err);
    return DEFAULT_DELIVERY_SETTINGS;
  }
}

export function saveStoredDeliverySettings(settings: DeliverySettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("mart_delivery_settings_updated"));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(settings),
      })
    );
  } catch (err) {
    console.warn("Failed to save delivery settings to localStorage:", err);
  }
}

export function resetStoredDeliverySettings(): DeliverySettings {
  saveStoredDeliverySettings(DEFAULT_DELIVERY_SETTINGS);
  return DEFAULT_DELIVERY_SETTINGS;
}
