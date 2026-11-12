"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  Package,
  Boxes,
  Layers,
  Sparkles,
  Tag,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Sliders,
  ListPlus,
  Info,
  ChevronRight,
  ChevronLeft,
  Zap,
  Target,
  Dumbbell,
  ShieldCheck,
  Award,
  RotateCcw,
  UploadCloud,
  Upload,
  Star,
  Check,
  Loader2,
  Palette,
} from "lucide-react";
import {
  ALL_PRODUCTS,
  ProductDetailItem,
  ProductSpec,
  ProductHighlight,
  ProductIdealFor,
  ProductVariantGroup,
  generateVariantCombinations,
} from "@/data/products";
import { supabase } from "@/lib/supabase";
import BrandToast from "@/components/BrandToast";

interface SpecItem {
  id: string;
  label: string;
  value: string;
  unit: string;
}

type TabKey =
  | "basic"
  | "stock"
  | "variants"
  | "specs"
  | "highlights"
  | "description"
  | "media";

const COMMON_UNITS = [
  { value: "none", label: "No Unit (Text only)" },
  { value: "kg", label: "kg (Kilograms)" },
  { value: "g", label: "g (Grams)" },
  { value: "lbs", label: "lbs (Pounds)" },
  { value: "mm", label: "mm (Millimeters)" },
  { value: "cm", label: "cm (Centimeters)" },
  { value: "meters", label: "meters (Meters)" },
  { value: "inch", label: "inch (Inches)" },
  { value: "feet", label: "feet (Feet)" },
  { value: "pcs", label: "pcs (Pieces)" },
  { value: "pairs", label: "pairs (Pairs)" },
  { value: "sets", label: "sets (Sets)" },
  { value: "months", label: "months (Months)" },
  { value: "years", label: "years (Years)" },
  { value: "gsm", label: "GSM" },
];

const SPEC_LABEL_SUGGESTIONS = [
  "Weight",
  "Dimensions",
  "Material",
  "Grip Diameter",
  "Thickness",
  "Length",
  "Color / Finish",
  "Warranty",
  "Package Contents",
  "Max Weight Capacity",
];

const CATEGORY_OPTIONS = [
  { value: "gym", label: "Gym Equipment" },
  { value: "training", label: "Training Gear" },
  { value: "yoga", label: "Yoga & Wellness" },
  { value: "agility", label: "Agility Tools" },
];

const HIGHLIGHT_ICON_OPTIONS: {
  value: ProductHighlight["icon"];
  label: string;
  emoji: string;
}[] = [
  { value: "strength", label: "Builds Strength / Muscle", emoji: "🏋️‍♂️" },
  { value: "shield", label: "Floor-Safe / Durable Shield", emoji: "🛡️" },
  { value: "grip", label: "Non-Slip Grip / Handle", emoji: "✋" },
  { value: "layers", label: "Durable Coating / Multi-Layer", emoji: "🥞" },
  { value: "flame", label: "Fat Burn / High Calorie", emoji: "🔥" },
  { value: "droplet", label: "Sweat-Resistant / Waterproof", emoji: "💧" },
  { value: "feather", label: "Lightweight / Ultra-Portable", emoji: "🪶" },
  { value: "scale", label: "Balanced Weight / Stable", emoji: "⚖️" },
  { value: "heart", label: "Cardio Conditioning / Heart", emoji: "❤️" },
  { value: "bolt", label: "Speed & Explosive Agility", emoji: "⚡" },
  { value: "eye", label: "High-Visibility Neon Color", emoji: "👁️" },
  { value: "grid", label: "Textured Traction Grid", emoji: "🔲" },
  { value: "home", label: "Home Safe / Floor-Friendly", emoji: "🏠" },
  { value: "award", label: "Pro Grade / Certified", emoji: "🏆" },
];

const IDEAL_FOR_ICON_OPTIONS: {
  value: ProductIdealFor["icon"];
  label: string;
  emoji: string;
}[] = [
  { value: "home", label: "Home Workouts", emoji: "🏠" },
  { value: "dumbbell", label: "Strength Training / Gym", emoji: "🏋️‍♂️" },
  { value: "yoga", label: "Yoga & Wellness / Stretching", emoji: "🧘" },
  { value: "scale", label: "Weight Management / Fat Loss", emoji: "⚖️" },
  { value: "cardio", label: "Cardio & Endurance", emoji: "💓" },
  { value: "agility", label: "Speed & Agility Drills", emoji: "🏃" },
  { value: "speed", label: "HIIT & CrossFit Sessions", emoji: "⚡" },
  { value: "football", label: "Football & Field Sports", emoji: "⚽" },
  { value: "school", label: "Schools & PE Academies", emoji: "🏫" },
  { value: "core", label: "Core & Abdominal Training", emoji: "🎯" },
  { value: "rehab", label: "Physio & Joint Mobility", emoji: "🩹" },
  { value: "outdoor", label: "Outdoor & Bootcamp Training", emoji: "🌳" },
];

const CATEGORY_PRESETS: Record<
  string,
  {
    name: string;
    highlights: ProductHighlight[];
    idealFor: ProductIdealFor[];
  }
> = {
  gym: {
    name: "Dumbbells & Gym Equipment",
    highlights: [
      {
        title: "Builds Strength",
        subtitle: "Tones arms, shoulders & upper body",
        icon: "strength",
      },
      {
        title: "Durable Coating",
        subtitle: "Sweat-resistant & long-lasting finish",
        icon: "layers",
      },
      {
        title: "Non-Slip Grip",
        subtitle: "Ergonomic contoured comfort handle",
        icon: "grip",
      },
      {
        title: "Floor-Safe Build",
        subtitle: "Scratch-free & rust-resistant design",
        icon: "shield",
      },
    ],
    idealFor: [
      {
        title: "Home Workouts",
        description: "Daily full-body toning in compact spaces",
        icon: "home",
      },
      {
        title: "Strength Training",
        description: "Bicep curls, presses, lunges & rows",
        icon: "dumbbell",
      },
      {
        title: "Yoga & Fitness",
        description: "Light resistance for aerobics & mobility",
        icon: "yoga",
      },
      {
        title: "Weight Management",
        description: "High-rep calorie burn & endurance sets",
        icon: "scale",
      },
    ],
  },
  yoga: {
    name: "Yoga Mat & Wellness",
    highlights: [
      {
        title: "6mm Cushioning",
        subtitle: "Joint-friendly high density support",
        icon: "layers",
      },
      {
        title: "Anti-Tear Mesh",
        subtitle: "Reinforced middle layer for longevity",
        icon: "shield",
      },
      {
        title: "Non-Slip Texture",
        subtitle: "Dual-sided reversible floor grip",
        icon: "grip",
      },
      {
        title: "Eco-Friendly TPE",
        subtitle: "100% Non-toxic & odor-free material",
        icon: "feather",
      },
    ],
    idealFor: [
      {
        title: "Morning Yoga",
        description: "Asanas, surya namaskars & stretching",
        icon: "yoga",
      },
      {
        title: "Pilates & Core",
        description: "Abs workouts & floor resistance routines",
        icon: "core",
      },
      {
        title: "Home Meditation",
        description: "Comfortable padded seating cushion",
        icon: "home",
      },
      {
        title: "Joint Mobility",
        description: "Low-impact therapy & physio recovery",
        icon: "rehab",
      },
    ],
  },
  cardio: {
    name: "Skipping Rope & Cardio",
    highlights: [
      {
        title: "360° Ball Bearings",
        subtitle: "Ultra-smooth fast spin mechanism",
        icon: "bolt",
      },
      {
        title: "Tangle-Free Cable",
        subtitle: "Steel wire coated with flexible PVC",
        icon: "shield",
      },
      {
        title: "Fat Burn Power",
        subtitle: "Burns up to 300 kcal in 15 minutes",
        icon: "flame",
      },
      {
        title: "Ergonomic Handles",
        subtitle: "Sweat-absorbent foam comfort grips",
        icon: "grip",
      },
    ],
    idealFor: [
      {
        title: "HIIT & CrossFit",
        description: "Fast double-unders and interval sets",
        icon: "speed",
      },
      {
        title: "Cardio Fat Loss",
        description: "Full-body calorie burner routine",
        icon: "cardio",
      },
      {
        title: "Boxing & Footwork",
        description: "Rhythm, stamina & agility training",
        icon: "agility",
      },
      {
        title: "Home Warmups",
        description: "Pre-workout activation and endurance",
        icon: "home",
      },
    ],
  },
  agility: {
    name: "Agility Cones & Drills",
    highlights: [
      {
        title: "High Visibility",
        subtitle: "Fluorescent colors visible in any light",
        icon: "eye",
      },
      {
        title: "Unbreakable PVC",
        subtitle: "Bends and bounces back when stepped on",
        icon: "shield",
      },
      {
        title: "Stackable Carry",
        subtitle: "Compact storage with carry strap holder",
        icon: "grid",
      },
      {
        title: "All-Surface Base",
        subtitle: "Stable on grass, turf, gym floor & court",
        icon: "award",
      },
    ],
    idealFor: [
      {
        title: "Speed & Agility",
        description: "Footwork, acceleration & zig-zag drills",
        icon: "agility",
      },
      {
        title: "Football & Cricket",
        description: "Dribbling, boundary & target markers",
        icon: "football",
      },
      {
        title: "School PE Academies",
        description: "Structured athletic training for youth",
        icon: "school",
      },
      {
        title: "Outdoor Bootcamps",
        description: "High-intensity turf conditioning",
        icon: "outdoor",
      },
    ],
  },
};

const TABS: { id: TabKey; label: string; icon: React.ElementType; shortDesc?: string }[] = [
  { id: "basic", label: "Basic & Pricing", icon: Tag, shortDesc: "Title, SKU & retail price" },
  { id: "stock", label: "Stock & Inventory", icon: Boxes, shortDesc: "Stock status & inventory" },
  { id: "variants", label: "Variants", icon: Layers, shortDesc: "Sizes, colors & pricing" },
  { id: "specs", label: "Specifications", icon: Sliders, shortDesc: "Technical dimensions & specs" },
  { id: "highlights", label: "Highlights & Uses", icon: Sparkles, shortDesc: "Key benefits & ideal for" },
  { id: "description", label: "Description & Story", icon: ListPlus, shortDesc: "Overview & bullet points" },
  { id: "media", label: "Media & Gallery", icon: ImageIcon, shortDesc: "Photos & product gallery" },
];

function ProductEditContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const isNewProduct = productId === "new";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [categoryOptions, setCategoryOptions] = useState(CATEGORY_OPTIONS);

  // Core Form State
  const [product, setProduct] = useState<Partial<ProductDetailItem>>({
    id: isNewProduct ? "" : productId,
    name: "",
    tagline: "",
    shortDescription: "",
    description: "",
    image: "",
    gallery: [],
    category: "gym",
    categoryLabel: "Gym Equipment",
    badge: "",
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 12,
    price: 999,
    originalPrice: 1499,
    sku: "",
    inStock: true,
    stockQuantity: 50,
    lowStockThreshold: 5,
    trackVariantStock: false,
    variantStock: {},
    packInfo: "Pack of 1",
    optionsLabel: "Weight / Variant Options",
    options: [],
    variantGroups: [],
    keyFeatures: [],
    highlights: [],
    specifications: [],
    idealFor: [],
  });

  // Dynamic Specifications State
  const [specs, setSpecs] = useState<SpecItem[]>([]);

  // Multi-Variant Groups State
  const [variantGroups, setVariantGroups] = useState<ProductVariantGroup[]>([]);
  const [groupInputMap, setGroupInputMap] = useState<Record<string, string>>({});

  // Per-Variant Inventory State
  const [trackVariantStock, setTrackVariantStock] = useState<boolean>(false);
  const [variantStockMap, setVariantStockMap] = useState<Record<string, number>>({});
  const [bulkSetQty, setBulkSetQty] = useState<string>("20");

  // Feature Input Helper
  const [featureInput, setFeatureInput] = useState("");

  // Gallery Input Helper
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  // Gallery Metadata & Upload State (Multi-Upload & Variant Connection)
  const [galleryMetadata, setGalleryMetadata] = useState<
    Record<string, { color?: string; caption?: string }>
  >({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // 1. Load Product Data (Static First: LocalStorage -> ALL_PRODUCTS fallback)
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem("mart_categories");
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map((c: any) => ({ value: c.id, label: c.name }));
          const existingVals = new Set(mapped.map((m: any) => m.value));
          CATEGORY_OPTIONS.forEach((def) => {
            if (!existingVals.has(def.value)) {
              mapped.push(def);
            }
          });
          setCategoryOptions(mapped);
        }
      }
    } catch {
      // ignore
    }

    if (isNewProduct) {
      setSpecs([
        { id: "1", label: "Weight", value: "5", unit: "kg" },
        { id: "2", label: "Material", value: "Natural Hardwood", unit: "none" },
        { id: "3", label: "Warranty", value: "1", unit: "years" },
      ]);
      // Default Multi-Variant: Weights + Finish
      const defaultNewGroups = [
        {
          id: "grp-weights",
          name: "Select Weight",
          values: ["1 kg", "2 kg", "3 kg", "5 kg"],
        },
        {
          id: "grp-finish",
          name: "Finish / Variant",
          values: ["Natural Hardwood", "Vinyl Coated (Orange)"],
        },
      ];
      setVariantGroups(defaultNewGroups);
      const newCombos = generateVariantCombinations(defaultNewGroups);
      const newMap: Record<string, number> = {};
      newCombos.forEach((c) => {
        newMap[c] = 15;
      });
      setVariantStockMap(newMap);
      setTrackVariantStock(true);
      setProduct((prev) => ({
        ...prev,
        highlights: CATEGORY_PRESETS.gym.highlights,
        idealFor: CATEGORY_PRESETS.gym.idealFor,
        stockQuantity: 120,
      }));
      setGalleryMetadata({});
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem("mart_admin_products");
      let found: ProductDetailItem | undefined;

      if (stored) {
        const parsed: ProductDetailItem[] = JSON.parse(stored);
        found = parsed.find((p) => p.id === productId);
      }

      const staticDefault = ALL_PRODUCTS.find((p) => p.id === productId);

      let effectiveProduct: ProductDetailItem | undefined;
      if (found && staticDefault) {
        // If staticDefault has more groups (e.g. 2 groups) than older cached found (e.g. 1 group), take staticDefault groups
        const hasFullGroups =
          found.variantGroups &&
          found.variantGroups.length >= (staticDefault.variantGroups?.length || 0);

        const finalGroups = hasFullGroups
          ? found.variantGroups!
          : staticDefault.variantGroups || found.variantGroups;

        const combos = generateVariantCombinations(finalGroups);
        const hasMatchingStock =
          found.variantStock &&
          combos.length > 0 &&
          combos.every((c) => found.variantStock![c] !== undefined);

        const finalVariantStock = hasMatchingStock
          ? found.variantStock
          : staticDefault.variantStock || found.variantStock;

        effectiveProduct = {
          ...staticDefault,
          ...found,
          variantGroups: finalGroups,
          variantStock: finalVariantStock,
          trackVariantStock:
            found.trackVariantStock !== undefined
              ? found.trackVariantStock
              : (staticDefault.trackVariantStock ??
                  Boolean(finalGroups && finalGroups.length > 0)),
          stockQuantity:
            found.stockQuantity !== undefined
              ? found.stockQuantity
              : staticDefault.stockQuantity,
          lowStockThreshold:
            found.lowStockThreshold ?? staticDefault.lowStockThreshold ?? 5,
        };
      } else {
        effectiveProduct = found || staticDefault;
      }

      if (effectiveProduct) {
        setProduct({
          ...effectiveProduct,
          stockQuantity:
            effectiveProduct.stockQuantity ?? (effectiveProduct.inStock ? 50 : 0),
          lowStockThreshold: effectiveProduct.lowStockThreshold ?? 5,
          highlights: effectiveProduct.highlights || CATEGORY_PRESETS.gym.highlights,
          idealFor: effectiveProduct.idealFor || CATEGORY_PRESETS.gym.idealFor,
        });

        if (effectiveProduct.galleryMetadata) {
          setGalleryMetadata(effectiveProduct.galleryMetadata);
        } else {
          setGalleryMetadata({});
        }

        // Initialize Multi-Variant Groups
        let activeGroups: ProductVariantGroup[] = [];
        if (effectiveProduct.variantGroups && effectiveProduct.variantGroups.length > 0) {
          activeGroups = effectiveProduct.variantGroups;
          setVariantGroups(effectiveProduct.variantGroups);
        } else if (effectiveProduct.options && effectiveProduct.options.length > 0) {
          // Convert single options list to Group 1
          activeGroups = [
            {
              id: "grp-1",
              name: effectiveProduct.optionsLabel || "Available Options",
              values: [...effectiveProduct.options],
            },
          ];
          setVariantGroups(activeGroups);
        } else {
          activeGroups = [
            {
              id: "grp-1",
              name: "Select Weight",
              values: ["2.5 kg Pair", "5 kg Pair", "10 kg Pair"],
            },
          ];
          setVariantGroups(activeGroups);
        }

        // Initialize Variant Inventory Matrix aligned with combos
        const combos = generateVariantCombinations(activeGroups);
        const sourceStock = effectiveProduct.variantStock || {};
        const alignedStock: Record<string, number> = {};

        combos.forEach((combo) => {
          if (sourceStock[combo] !== undefined) {
            alignedStock[combo] = Number(sourceStock[combo]);
          } else {
            // Check prefix/fuzzy match
            const match = Object.entries(sourceStock).find(
              ([k]) => k.startsWith(combo) || combo.startsWith(k)
            );
            if (match) {
              alignedStock[combo] = Number(match[1]);
            } else {
              const perCombo =
                effectiveProduct.stockQuantity && combos.length > 0
                  ? Math.max(1, Math.round(Number(effectiveProduct.stockQuantity) / combos.length))
                  : 15;
              alignedStock[combo] = perCombo;
            }
          }
        });

        setVariantStockMap(alignedStock);
        setTrackVariantStock(combos.length > 0);

        // Parse specifications into dynamic rows with units
        if (effectiveProduct.specifications && Array.isArray(effectiveProduct.specifications)) {
          const parsedSpecs: SpecItem[] = effectiveProduct.specifications.map((s, idx) => {
            const rawVal = s.value || "";
            let detectedUnit = s.unit || "none";
            let cleanVal = rawVal;

            if (detectedUnit === "none") {
              for (const u of COMMON_UNITS) {
                if (u.value !== "none" && rawVal.toLowerCase().endsWith(u.value)) {
                  detectedUnit = u.value;
                  cleanVal = rawVal.slice(0, rawVal.length - u.value.length).trim();
                  break;
                }
              }
            }

            return {
              id: `${idx}-${Date.now()}`,
              label: s.label || "",
              value: cleanVal,
              unit: detectedUnit,
            };
          });
          setSpecs(parsedSpecs);
        }
      }
    } catch (e) {
      console.warn("Failed to load product from storage:", e);
    } finally {
      setLoading(false);
    }
  }, [productId, isNewProduct]);

  // Keep variantStockMap aligned whenever variantGroups changes
  useEffect(() => {
    if (loading || variantGroups.length === 0) return;
    const combos = generateVariantCombinations(variantGroups);
    setVariantStockMap((prev) => {
      let changed = false;
      const updated = { ...prev };
      combos.forEach((c) => {
        if (updated[c] === undefined) {
          updated[c] = 10;
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [variantGroups, loading]);

  // Discount Calculation
  const discountPercent =
    product.originalPrice && product.price && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // -------------------------------------------------------------
  // SPECIFICATIONS HANDLERS
  // -------------------------------------------------------------
  const handleAddSpec = () => {
    setSpecs((prev) => [
      ...prev,
      {
        id: `spec-${Date.now()}`,
        label: "",
        value: "",
        unit: "none",
      },
    ]);
  };

  const handleUpdateSpec = (id: string, field: "label" | "value" | "unit", val: string) => {
    setSpecs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleRemoveSpec = (id: string) => {
    setSpecs((prev) => prev.filter((s) => s.id !== id));
  };

  // -------------------------------------------------------------
  // MULTI-VARIANT GROUPS HANDLERS
  // -------------------------------------------------------------
  const handleAddVariantGroup = () => {
    const newId = `grp-${Date.now()}`;
    setVariantGroups((prev) => [
      ...prev,
      {
        id: newId,
        name: `Option Group #${prev.length + 1}`,
        values: [],
      },
    ]);
  };

  const handleRemoveVariantGroup = (groupId: string) => {
    setVariantGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleUpdateGroupName = (groupId: string, newName: string) => {
    setVariantGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
  };

  const handleAddValueToGroup = (groupId: string) => {
    const val = (groupInputMap[groupId] || "").trim();
    if (!val) return;
    setVariantGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId && !g.values.includes(val)) {
          return { ...g, values: [...g.values, val] };
        }
        return g;
      })
    );
    setGroupInputMap((prev) => ({ ...prev, [groupId]: "" }));
  };

  const handleRemoveValueFromGroup = (groupId: string, valToRemove: string) => {
    setVariantGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return { ...g, values: g.values.filter((v) => v !== valToRemove) };
        }
        return g;
      })
    );
  };

  const handleApplyVariantPreset = (presetKey: "weight_finish" | "thickness_color" | "size_color") => {
    if (presetKey === "weight_finish") {
      setVariantGroups([
        {
          id: `grp-${Date.now()}-1`,
          name: "Select Weight",
          values: ["1 kg", "2 kg", "3 kg", "5 kg"],
        },
        {
          id: `grp-${Date.now()}-2`,
          name: "Finish / Coating",
          values: ["Natural Hardwood", "Vinyl Coated (Orange)", "Vinyl Coated (Black)"],
        },
      ]);
    } else if (presetKey === "thickness_color") {
      setVariantGroups([
        {
          id: `grp-${Date.now()}-1`,
          name: "Select Thickness",
          values: ["4 mm (Travel)", "6 mm (Standard)", "8 mm (Extra Cushion)"],
        },
        {
          id: `grp-${Date.now()}-2`,
          name: "Select Color",
          values: ["Ocean Blue", "Dark Grey", "Forest Green", "Berry Purple"],
        },
      ]);
    } else if (presetKey === "size_color") {
      setVariantGroups([
        {
          id: `grp-${Date.now()}-1`,
          name: "Select Size",
          values: ["Small (S)", "Medium (M)", "Large (L)", "Extra Large (XL)"],
        },
        {
          id: `grp-${Date.now()}-2`,
          name: "Colorway",
          values: ["Jet Black", "Electric Orange", "Navy Blue"],
        },
      ]);
    }
  };

  const handleResetToCatalogDefaults = () => {
    const staticDefault = ALL_PRODUCTS.find((p) => p.id === productId);
    if (!staticDefault) return;
    if (confirm("Reset inventory & variant groups to factory catalog defaults?")) {
      if (staticDefault.variantGroups) {
        setVariantGroups(staticDefault.variantGroups);
      }
      if (staticDefault.variantStock) {
        setVariantStockMap({ ...staticDefault.variantStock });
      }
      setTrackVariantStock(Boolean(staticDefault.trackVariantStock));
      setProduct((prev) => ({
        ...prev,
        stockQuantity: staticDefault.stockQuantity,
        lowStockThreshold: staticDefault.lowStockThreshold,
        inStock: staticDefault.inStock,
      }));
    }
  };

  // -------------------------------------------------------------
  // HIGHLIGHTS & IDEAL-FOR HANDLERS
  // -------------------------------------------------------------
  const handleApplyPreset = (presetKey: string) => {
    const preset = CATEGORY_PRESETS[presetKey];
    if (!preset) return;
    setProduct((prev) => ({
      ...prev,
      highlights: [...preset.highlights],
      idealFor: [...preset.idealFor],
    }));
  };

  const handleUpdateHighlight = (
    index: number,
    field: keyof ProductHighlight,
    value: string
  ) => {
    const list = [...(product.highlights || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setProduct({ ...product, highlights: list });
    }
  };

  const handleAddHighlight = () => {
    const list = [...(product.highlights || [])];
    if (list.length < 6) {
      list.push({
        title: "New Highlight",
        subtitle: "Key customer benefit",
        icon: "shield",
      });
      setProduct({ ...product, highlights: list });
    }
  };

  const handleRemoveHighlight = (index: number) => {
    const list = (product.highlights || []).filter((_, i) => i !== index);
    setProduct({ ...product, highlights: list });
  };

  const handleUpdateIdealFor = (
    index: number,
    field: keyof ProductIdealFor,
    value: string
  ) => {
    const list = [...(product.idealFor || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setProduct({ ...product, idealFor: list });
    }
  };

  const handleAddIdealFor = () => {
    const list = [...(product.idealFor || [])];
    if (list.length < 6) {
      list.push({
        title: "Workout Focus",
        description: "Recommended training routine or use-case",
        icon: "home",
      });
      setProduct({ ...product, idealFor: list });
    }
  };

  const handleRemoveIdealFor = (index: number) => {
    const list = (product.idealFor || []).filter((_, i) => i !== index);
    setProduct({ ...product, idealFor: list });
  };

  // -------------------------------------------------------------
  // KEY FEATURES / BULLETS HANDLERS
  // -------------------------------------------------------------
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    const current = product.keyFeatures || [];
    setProduct({ ...product, keyFeatures: [...current, trimmed] });
    setFeatureInput("");
  };

  const handleRemoveFeature = (idx: number) => {
    setProduct({
      ...product,
      keyFeatures: (product.keyFeatures || []).filter((_, i) => i !== idx),
    });
  };

  // -------------------------------------------------------------
  // GALLERY & MULTI-UPLOAD HANDLERS
  // -------------------------------------------------------------
  const variantColorOptions = Array.from(
    new Set(
      variantGroups.flatMap((g) => g.values || []).concat(product.options || [])
    )
  ).filter(Boolean);

  const handleFilesUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (fileArray.length === 0) {
      alert("Please select valid image files.");
      return;
    }

    setIsUploading(true);
    setUploadStatus(
      `Uploading ${fileArray.length} photo${fileArray.length > 1 ? "s" : ""}...`
    );

    try {
      const formData = new FormData();
      formData.append("folder", `/products/${product.id || "items"}`);
      fileArray.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      const uploadedUrls: string[] = [];

      if (data.urls && Array.isArray(data.urls)) {
        uploadedUrls.push(...data.urls);
      } else if (data.url) {
        uploadedUrls.push(data.url);
      } else if (data.items && Array.isArray(data.items)) {
        uploadedUrls.push(...data.items.map((i: any) => i.url));
      }

      if (uploadedUrls.length > 0) {
        const currentGallery = product.gallery || [];
        const newGallery = [...currentGallery, ...uploadedUrls];

        const updatedImage =
          !product.image ||
          product.image === "/wooden-dumbells.jpg" ||
          product.image.trim() === ""
            ? uploadedUrls[0]
            : product.image;

        setProduct((prev) => ({
          ...prev,
          image: updatedImage,
          gallery: newGallery,
        }));

        setUploadStatus(
          `Uploaded ${uploadedUrls.length} photo${uploadedUrls.length > 1 ? "s" : ""} successfully!`
        );
        setTimeout(() => setUploadStatus(""), 3500);
      } else {
        throw new Error("No URL returned from upload server");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload error: ${error?.message || "Could not upload files"}`);
      setUploadStatus("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim();
    if (!trimmed) return;
    const current = product.gallery || [];
    setProduct({
      ...product,
      image: product.image || trimmed,
      gallery: [...current, trimmed],
    });
    setGalleryUrlInput("");
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    const list = product.gallery || [];
    const removedItem = list[idx];
    const newGallery = list.filter((_, i) => i !== idx);

    setProduct({
      ...product,
      gallery: newGallery,
      image:
        product.image === removedItem
          ? newGallery[0] || ""
          : product.image,
    });

    if (removedItem && galleryMetadata[removedItem]) {
      setGalleryMetadata((prev) => {
        const updated = { ...prev };
        delete updated[removedItem];
        return updated;
      });
    }
  };

  const handleSetPrimaryThumbnail = (imgUrl: string) => {
    setProduct((prev) => ({
      ...prev,
      image: imgUrl,
    }));
  };

  const handleAssignGalleryColor = (imgUrl: string, color: string) => {
    setGalleryMetadata((prev) => {
      const updated = { ...prev };
      if (!color || color === "all") {
        if (updated[imgUrl]) {
          delete updated[imgUrl].color;
          if (Object.keys(updated[imgUrl]).length === 0) {
            delete updated[imgUrl];
          }
        }
      } else {
        updated[imgUrl] = {
          ...updated[imgUrl],
          color,
        };
      }
      return updated;
    });
  };

  const handleReorderGallery = (idx: number, direction: "left" | "right") => {
    const list = [...(product.gallery || [])];
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setProduct((prev) => ({ ...prev, gallery: list }));
  };

  // -------------------------------------------------------------
  // TAB NAVIGATION HELPERS
  // -------------------------------------------------------------
  const currentTabIdx = TABS.findIndex((t) => t.id === activeTab);
  const handleNextTab = () => {
    if (currentTabIdx < TABS.length - 1) {
      setActiveTab(TABS[currentTabIdx + 1].id);
    }
  };
  const handlePrevTab = () => {
    if (currentTabIdx > 0) {
      setActiveTab(TABS[currentTabIdx - 1].id);
    }
  };

  // -------------------------------------------------------------
  // SAVE HANDLER (Static-First + Supabase RLS Support)
  // -------------------------------------------------------------
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const formattedSpecs: ProductSpec[] = specs
      .filter((s) => s.label.trim())
      .map((s) => {
        const cleanVal = s.value.trim();
        const fullVal = s.unit !== "none" ? `${cleanVal} ${s.unit}`.trim() : cleanVal;
        return {
          label: s.label.trim(),
          value: fullVal,
          unit: s.unit,
        };
      });

    const categoryMap: Record<string, string> = {};
    categoryOptions.forEach((c) => {
      categoryMap[c.value] = c.label;
    });

    const targetId = isNewProduct
      ? (product.name || "new-product")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : (product.id as string);

    // Flatten first group for backward compatibility
    const primaryGroup = variantGroups[0];
    const legacyOptions = primaryGroup ? primaryGroup.values : [];
    const legacyLabel = primaryGroup ? primaryGroup.name : "Available Options";

    const combos = generateVariantCombinations(variantGroups);
    const hasVariants = combos.length > 0;

    const totalVariantUnits = Object.values(variantStockMap).reduce(
      (sum, q) => sum + (Number(q) || 0),
      0
    );
    const computedStockQty = hasVariants
      ? totalVariantUnits
      : Number(product.stockQuantity) || 0;
    const computedInStock = computedStockQty > 0 && Boolean(product.inStock);

    const updatedProduct: ProductDetailItem = {
      id: targetId,
      name: product.name || "Untitled Product",
      tagline: product.tagline || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      image: product.image || "/wooden-dumbells.jpg",
      gallery:
        product.gallery && product.gallery.length > 0
          ? product.gallery
          : [product.image || "/wooden-dumbells.jpg"],
      galleryMetadata:
        Object.keys(galleryMetadata).length > 0 ? galleryMetadata : undefined,
      category: product.category || "gym",
      categoryLabel: categoryMap[product.category || "gym"] || "Gym Equipment",
      badge: product.badge || "",
      isBestSeller: Boolean(product.isBestSeller),
      rating: Number(product.rating) || 5.0,
      reviewsCount: Number(product.reviewsCount) || 10,
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
      sku: product.sku || `MART-${targetId.slice(0, 4).toUpperCase()}`,
      inStock: computedInStock,
      stockQuantity: computedStockQty,
      lowStockThreshold: Number(product.lowStockThreshold) || 5,
      trackVariantStock: hasVariants,
      variantStock: hasVariants ? variantStockMap : undefined,
      packInfo: product.packInfo || "Pack of 1",
      optionsLabel: legacyLabel,
      options: legacyOptions,
      variantGroups: variantGroups.length > 0 ? variantGroups : undefined,
      keyFeatures: product.keyFeatures || [],
      highlights: product.highlights || [],
      specifications: formattedSpecs,
      idealFor: product.idealFor || [],
    };

    try {
      let storedList: ProductDetailItem[] = [];
      const rawStored = localStorage.getItem("mart_admin_products");
      if (rawStored) {
        storedList = JSON.parse(rawStored);
      } else {
        storedList = [...ALL_PRODUCTS];
      }

      const existingIdx = storedList.findIndex((p) => p.id === targetId);
      if (existingIdx >= 0) {
        storedList[existingIdx] = updatedProduct;
      } else {
        storedList.unshift(updatedProduct);
      }

      localStorage.setItem("mart_admin_products", JSON.stringify(storedList));

      // Optional Supabase sync
      try {
        const { error } = await supabase.from("products").upsert(updatedProduct);
        if (error) {
          console.log("[Supabase Sync Notice]", error.message);
        }
      } catch (err) {
        console.log("[Supabase Offline Notice] Running in Static Mode:", err);
      }

      setSaveSuccess(true);
      setToast({
        isOpen: true,
        title: isNewProduct ? "Product Created Successfully!" : "Changes Saved Successfully!",
        message: `${updatedProduct.name || "Product"} details are updated and now live.`,
        type: "success",
      });
      setTimeout(() => setSaveSuccess(false), 4000);

      if (isNewProduct) {
        router.push(`/admin/products/${targetId}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      setToast({
        isOpen: true,
        title: "Failed to Save Changes",
        message: "An error occurred while saving. Please try again.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D111A] flex items-center justify-center text-stone-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading product editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white selection:bg-orange-500 selection:text-white pb-24">
      {/* ===================================================================== */}
      {/* STICKY TOP HEADER BAR                                                 */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#101623]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="w-full max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
              title="Return to Catalog"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  Product Editor
                </span>
                <span className="text-stone-500 text-xs">•</span>
                <span className="text-stone-400 text-xs font-mono">
                  {isNewProduct ? "NEW PRODUCT" : product.sku || product.id}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight truncate max-w-md">
                {product.name || (isNewProduct ? "Add New Product" : "Untitled")}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isNewProduct && (
              <Link
                href={`/products#${product.id}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* M.art Branded Toast Notification with Logo */}
      <BrandToast
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        duration={4500}
        action={
          !isNewProduct && product.id
            ? {
                label: "Live Preview",
                href: `/products#${product.id}`,
              }
            : undefined
        }
      />

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Product saved successfully! All updates are live.</span>
            </div>
            <Link
              href="/admin"
              className="text-white bg-emerald-600/40 hover:bg-emerald-600/60 px-3 py-1 rounded-lg text-[11px] font-bold"
            >
              Back to Catalog →
            </Link>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2-COLUMN LAYOUT: STICKY VERTICAL SIDEBAR + TAB CONTENT                */}
      {/* ===================================================================== */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ----------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: VERTICAL NAVIGATION                                 */}
          {/* ----------------------------------------------------------------- */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 z-20 space-y-3">
            <div className="bg-[#141B29] border border-white/[0.08] rounded-2xl p-3 sm:p-4 shadow-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2.5 px-2 flex items-center justify-between">
                <span>Product Sections</span>
                <span className="text-orange-400 font-mono text-[11px]">
                  {currentTabIdx + 1}/{TABS.length}
                </span>
              </div>

              {/* Mobile: Horizontal scrollable pills / Desktop: Clean vertical stack */}
              <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 lg:shrink lg:w-full group ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                          : "bg-white/[0.02] lg:bg-transparent text-stone-300 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? "text-white" : "text-stone-400 group-hover:text-orange-400"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="truncate leading-tight">{tab.label}</p>
                          <p
                            className={`hidden lg:block text-[10px] font-normal truncate mt-0.5 ${
                              isActive ? "text-orange-100" : "text-stone-500 group-hover:text-stone-400"
                            }`}
                          >
                            {tab.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="shrink-0 flex items-center">
                        {tab.id === "stock" && (
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
                              isActive
                                ? "bg-black/30 text-white"
                                : product.inStock
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out"}
                          </span>
                        )}
                        {tab.id === "variants" && variantGroups.length > 0 && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                              isActive ? "bg-black/30 text-white" : "bg-white/10 text-stone-300"
                            }`}
                          >
                            {variantGroups.length}
                          </span>
                        )}
                        {tab.id === "specs" && specs.length > 0 && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                              isActive ? "bg-black/30 text-white" : "bg-white/10 text-stone-300"
                            }`}
                          >
                            {specs.length}
                          </span>
                        )}
                        {tab.id === "highlights" && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                              isActive
                                ? "bg-black/30 text-white"
                                : "bg-orange-400/15 text-orange-400 border border-orange-500/20"
                            }`}
                          >
                            {product.highlights?.length ?? 4}
                          </span>
                        )}
                        {tab.id === "media" && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                              isActive ? "bg-black/30 text-white" : "bg-white/10 text-stone-300"
                            }`}
                          >
                            {(product.gallery || []).length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Mini Product Snapshot (desktop only) */}
              <div className="hidden lg:block mt-4 pt-3.5 border-t border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2.5">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name || "Preview"}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10 bg-black/40 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-dashed border-white/10 bg-black/30 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4 text-stone-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {product.name || "Product Name"}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono truncate">
                      {product.sku || "No SKU"} • ₹{product.price?.toLocaleString("en-IN") || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT COLUMN: MAIN TAB CONTENT CARD                               */}
          {/* ----------------------------------------------------------------- */}
          <main className="lg:col-span-9 min-w-0">
            <div className="bg-[#141B29] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* ================================================================= */}
          {/* TAB 1: BASIC DETAILS & PRICING                                    */}
          {/* ================================================================= */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-orange-400" />
                    <span>Basic Details &amp; Pricing</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Product title, category, SKU, and retail pricing.
                  </p>
                </div>
                {discountPercent > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full">
                    {discountPercent}% DISCOUNT
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wooden Dumbbells Pair"
                    value={product.name || ""}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Set of 2 • Ergonomic & Floor-Friendly"
                    value={product.tagline || ""}
                    onChange={(e) => setProduct({ ...product, tagline: e.target.value })}
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={product.category || "gym"}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value} className="bg-[#141B29]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="MART-DB-001"
                    value={product.sku || ""}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="499"
                    value={product.price ?? ""}
                    onChange={(e) =>
                      setProduct({ ...product, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="899"
                    value={product.originalPrice ?? ""}
                    onChange={(e) =>
                      setProduct({ ...product, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm text-stone-300 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Promotional Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller / Popular / New Launch"
                    value={product.badge || ""}
                    onChange={(e) => setProduct({ ...product, badge: e.target.value })}
                    className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#182030] border border-stone-700/60 self-end">
                  <div>
                    <span className="text-xs font-bold text-white block">Best Seller Tag</span>
                    <span className="text-[11px] text-stone-400">
                      Display high-demand badge on store
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(product.isBestSeller)}
                    onChange={(e) =>
                      setProduct({ ...product, isBestSeller: e.target.checked })
                    }
                    className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: STOCK & INVENTORY                                          */}
          {/* ================================================================= */}
          {activeTab === "stock" && (() => {
            const variantCombos = generateVariantCombinations(variantGroups);
            const totalVariantUnits = Object.values(variantStockMap).reduce(
              (sum, q) => sum + (Number(q) || 0),
              0
            );
            const lowThreshold = Number(product.lowStockThreshold) || 5;

            return (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-orange-400" />
                      <span>Stock &amp; Inventory Management</span>
                    </h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Keep product availability, quantities, and per-variant stock in control.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {!isNewProduct && (
                      <button
                        type="button"
                        onClick={handleResetToCatalogDefaults}
                        className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-semibold border border-white/5 transition-all cursor-pointer flex items-center gap-1.5"
                        title="Reset variant groups and inventory to factory catalog defaults"
                      >
                        <RotateCcw className="w-3 h-3 text-orange-400" />
                        <span>Re-sync Defaults</span>
                      </button>
                    )}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        product.inStock
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {product.inStock ? "● IN STOCK" : "○ OUT OF STOCK"}
                    </span>
                  </div>
                </div>

                {/* Status Switch Box */}
                <div className="p-4 rounded-2xl bg-[#182030] border border-stone-700/70 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Store Availability Switch</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      When switched off, customers will see &ldquo;Out of Stock&rdquo; and cart buttons will be disabled storewide.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProduct({ ...product, inStock: !product.inStock })}
                    className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors cursor-pointer ${
                      product.inStock ? "bg-emerald-500" : "bg-stone-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        product.inStock ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* General Inventory Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Low Stock Alert Threshold (Units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="5"
                      value={product.lowStockThreshold ?? 5}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          lowStockThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-orange-500"
                    />
                    <span className="block text-[11px] text-stone-400 mt-1">
                      Triggers warning badge on admin table when variant units fall at or below this.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Package Contents Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Set of 2 Dumbbells (Left + Right)"
                      value={product.packInfo || ""}
                      onChange={(e) => setProduct({ ...product, packInfo: e.target.value })}
                      className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="block text-[11px] text-stone-400 mt-1">
                      Shown to customer as package details pill.
                    </span>
                  </div>
                </div>

                {/* Per-Variant Stock Matrix Section */}
                {variantCombos.length > 0 ? (
                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <div className="p-4 rounded-2xl bg-[#141b28] border border-orange-500/30 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h3 className="text-sm font-bold text-white">
                            Variant Inventory Matrix ({variantCombos.length} Combinations)
                          </h3>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Each variant is tracked individually. Total stock is calculated automatically.
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Auto-Tracking Active</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                        {/* Bulk Action Bar */}
                        <div className="p-3 rounded-xl bg-[#182030] border border-stone-700/70 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-stone-300">
                            <span className="font-bold text-white">
                              Total Stock:{" "}
                              <span className="text-orange-400 font-mono text-sm">
                                {totalVariantUnits} units
                              </span>
                            </span>
                            <span className="text-stone-500">•</span>
                            <span className="text-stone-400">
                              across {variantCombos.length} variant options
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400 font-medium">
                              Bulk set all:
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={bulkSetQty}
                              onChange={(e) => setBulkSetQty(e.target.value)}
                              className="w-16 bg-[#111724] border border-stone-700 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-orange-500 font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const val = Math.max(0, Number(bulkSetQty) || 0);
                                const updated: Record<string, number> = {};
                                variantCombos.forEach((c) => {
                                  updated[c] = val;
                                });
                                setVariantStockMap(updated);
                              }}
                              className="px-3 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30 text-xs font-bold transition-all cursor-pointer"
                            >
                              ⚡ Apply to All
                            </button>
                          </div>
                        </div>

                        {/* Matrix Table */}
                        <div className="border border-stone-700/80 rounded-2xl overflow-hidden bg-[#182030]">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-[#111724] border-b border-stone-700/80 text-stone-400 font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">Variant Option</th>
                                <th className="py-3 px-4">Generated SKU</th>
                                <th className="py-3 px-4 w-36">Stock Units</th>
                                <th className="py-3 px-4">Live Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                              {variantCombos.map((combo) => {
                                const currentUnits =
                                  variantStockMap[combo] !== undefined
                                    ? variantStockMap[combo]
                                    : 10;
                                const isSoldOut = currentUnits <= 0;
                                const isLow = !isSoldOut && currentUnits <= lowThreshold;
                                const cleanSlug = combo
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/(^-|-$)/g, "");
                                const variantSku = `${product.sku || "MART"}-${cleanSlug.slice(0, 8).toUpperCase()}`;

                                return (
                                  <tr
                                    key={combo}
                                    className="hover:bg-white/[0.02] transition-colors"
                                  >
                                    <td className="py-3 px-4 font-bold text-white">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs">
                                        {combo}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">
                                      {variantSku}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setVariantStockMap({
                                              ...variantStockMap,
                                              [combo]: Math.max(0, currentUnits - 1),
                                            });
                                          }}
                                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold flex items-center justify-center cursor-pointer"
                                        >
                                          −
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          value={currentUnits}
                                          onChange={(e) => {
                                            const val = Math.max(0, Number(e.target.value) || 0);
                                            setVariantStockMap({
                                              ...variantStockMap,
                                              [combo]: val,
                                            });
                                          }}
                                          className="w-16 bg-[#111724] border border-stone-700 rounded-lg px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-orange-500"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setVariantStockMap({
                                              ...variantStockMap,
                                              [combo]: currentUnits + 1,
                                            });
                                          }}
                                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold flex items-center justify-center cursor-pointer"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      {isSoldOut ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                          Sold Out (0)
                                        </span>
                                      ) : isLow ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                          Low Stock ({currentUnits} left)
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                          In Stock ({currentUnits})
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                ) : (
                  /* Product has no variants at all */
                  <div className="p-4 rounded-2xl bg-[#182030] border border-stone-700/70">
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Available Stock Count (Units in Hand) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="50"
                      value={product.stockQuantity ?? ""}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        setProduct({
                          ...product,
                          stockQuantity: count,
                          inStock: count > 0,
                        });
                      }}
                      className="w-full bg-[#111724] border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="block text-[11px] text-stone-400 mt-1">
                      Setting count to 0 will automatically mark the product Out of Stock.
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ================================================================= */}
          {/* TAB 3: MULTIPLE PRODUCT VARIANT GROUPS                            */}
          {/* ================================================================= */}
          {activeTab === "variants" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>Multiple Variant Groups (Weight, Color, Size, etc.)</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Add multiple option groups (e.g. Group 1: Weight, Group 2: Color) for independent selection.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariantGroup}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Another Option Group</span>
                </button>
              </div>

              {/* Quick Multi-Variant Presets */}
              <div className="p-3.5 rounded-2xl bg-[#182030] border border-orange-500/30 flex flex-wrap items-center justify-between gap-2.5">
                <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                  <span>Quick Multi-Variant Presets:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyVariantPreset("weight_finish")}
                    className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-semibold border border-white/5 cursor-pointer"
                  >
                    🏋️‍♂️ Weight + Finish (Dumbbells)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVariantPreset("thickness_color")}
                    className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-semibold border border-white/5 cursor-pointer"
                  >
                    🧘 Thickness + Color (Yoga Mat)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVariantPreset("size_color")}
                    className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] font-semibold border border-white/5 cursor-pointer"
                  >
                    👕 Size + Colorway
                  </button>
                </div>
              </div>

              {/* Variant Groups List */}
              {variantGroups.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-stone-700/70 rounded-2xl">
                  <p className="text-stone-400 text-xs">No variant groups configured.</p>
                  <button
                    type="button"
                    onClick={handleAddVariantGroup}
                    className="mt-2 text-xs font-bold text-orange-400 hover:underline cursor-pointer"
                  >
                    + Add your first variant group (e.g. Weight)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {variantGroups.map((group, groupIdx) => (
                    <div
                      key={group.id}
                      className="p-5 rounded-2xl bg-[#182030] border border-stone-700/70 space-y-3.5 relative"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] text-orange-300">
                            {groupIdx + 1}
                          </span>
                          <span>Option Group #{groupIdx + 1}</span>
                        </span>
                        {variantGroups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantGroup(group.id)}
                            className="text-stone-400 hover:text-rose-400 text-xs font-semibold p-1 cursor-pointer flex items-center gap-1"
                            title="Delete this entire option group"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Group</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Group Name (What customer sees e.g. &ldquo;Select Weight&rdquo;, &ldquo;Choose Color&rdquo;)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Select Weight / Available Color"
                            value={group.name}
                            onChange={(e) =>
                              handleUpdateGroupName(group.id, e.target.value)
                            }
                            className="w-full bg-[#111724] border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Add Choice Pill (e.g. &ldquo;5 kg&rdquo;, &ldquo;Natural Wood&rdquo;)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type option and press Add..."
                              value={groupInputMap[group.id] || ""}
                              onChange={(e) =>
                                setGroupInputMap({
                                  ...groupInputMap,
                                  [group.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddValueToGroup(group.id);
                                }
                              }}
                              className="flex-1 bg-[#111724] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddValueToGroup(group.id)}
                              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Configured Choices for this group */}
                      <div>
                        <span className="block text-[11px] font-semibold text-stone-400 mb-2">
                          Available Choices ({group.values.length}):
                        </span>
                        {group.values.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {group.values.map((val) => (
                              <span
                                key={val}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold"
                              >
                                <span>{val}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveValueFromGroup(group.id, val)
                                  }
                                  className="hover:text-white text-stone-400 transition-colors cursor-pointer ml-1"
                                  title="Remove option"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-stone-500 text-xs italic">
                            No options added in this group yet. Type a value above and click + Add.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: DYNAMIC SPECIFICATIONS                                     */}
          {/* ================================================================= */}
          {activeTab === "specs" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-orange-400" />
                    <span>Dynamic Specifications (With Units Choice)</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Add dimensions, material, thickness, weight, or warranty with customizable units.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec Row</span>
                </button>
              </div>

              {specs.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-stone-700/70 rounded-2xl">
                  <p className="text-stone-400 text-xs">No specifications added yet.</p>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="mt-2 text-xs font-bold text-orange-400 hover:underline"
                  >
                    + Add your first specification row
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                    <span className="col-span-5">Spec Label / Property</span>
                    <span className="col-span-3">Value</span>
                    <span className="col-span-3">Unit Choice</span>
                    <span className="col-span-1 text-right">Del</span>
                  </div>

                  {specs.map((spec) => (
                    <div
                      key={spec.id}
                      className="grid grid-cols-12 gap-2 items-center bg-[#182030] p-2.5 rounded-xl border border-stone-700/60"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          list="spec-suggestions"
                          placeholder="e.g. Weight / Thickness"
                          value={spec.label}
                          onChange={(e) => handleUpdateSpec(spec.id, "label", e.target.value)}
                          className="w-full bg-[#111724] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="e.g. 5"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(spec.id, "value", e.target.value)}
                          className="w-full bg-[#111724] border border-stone-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="col-span-3">
                        <select
                          value={spec.unit}
                          onChange={(e) => handleUpdateSpec(spec.id, "unit", e.target.value)}
                          className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          {COMMON_UNITS.map((u) => (
                            <option key={u.value} value={u.value} className="bg-[#141B29]">
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(spec.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove specification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <datalist id="spec-suggestions">
                    {SPEC_LABEL_SUGGESTIONS.map((label) => (
                      <option key={label} value={label} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: HIGHLIGHTS & IDEAL-FOR (DYNAMIC 4-PILLAR & USE-CASES)       */}
          {/* ================================================================= */}
          {activeTab === "highlights" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Presets Strip */}
              <div className="p-4 rounded-2xl bg-[#182030] border border-orange-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      1-Click Category Presets
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Instantly load matching icons, benefits, and use-cases for your product.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("gym")}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer border border-white/5"
                  >
                    🏋️‍♂️ Dumbbells
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("yoga")}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer border border-white/5"
                  >
                    🧘 Yoga Mat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("cardio")}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer border border-white/5"
                  >
                    🔥 Skipping Rope
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset("agility")}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer border border-white/5"
                  >
                    ⚡ Agility Cones
                  </button>
                </div>
              </div>

              {/* Section A: 4-Pillar Product Highlights */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>Product Highlights Strip (4-Card Pillar Grid)</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Shown right below the product image gallery (e.g. &ldquo;Builds Strength&rdquo;, &ldquo;Floor-Safe&rdquo;, &ldquo;Non-Slip Grip&rdquo;).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pillar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(product.highlights || []).map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#182030] border border-stone-700/70 space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                          Pillar Card #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-stone-400 hover:text-rose-400 p-1 cursor-pointer"
                          title="Remove pillar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Icon Picker */}
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                            Icon
                          </label>
                          <select
                            value={hl.icon}
                            onChange={(e) =>
                              handleUpdateHighlight(
                                idx,
                                "icon",
                                e.target.value as ProductHighlight["icon"]
                              )
                            }
                            className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            {HIGHLIGHT_ICON_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-[#141B29]"
                              >
                                {opt.emoji} {opt.value}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Builds Strength"
                            value={hl.title}
                            onChange={(e) =>
                              handleUpdateHighlight(idx, "title", e.target.value)
                            }
                            className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                          />
                        </div>
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                          Benefit One-Liner (Subtitle)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Tones arms, shoulders & upper body"
                          value={hl.subtitle}
                          onChange={(e) =>
                            handleUpdateHighlight(idx, "subtitle", e.target.value)
                          }
                          className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section B: Ideal For / Perfect Use-Cases */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-400" />
                      <span>&ldquo;Ideal For&rdquo; Grid (Target Workout Use-Cases)</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Shown in the prominent bottom section (e.g. &ldquo;Home Workouts&rdquo;, &ldquo;Strength Training&rdquo;, &ldquo;Yoga &amp; Fitness&rdquo;).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIdealFor}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Use-Case</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(product.idealFor || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#182030] border border-stone-700/70 space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                          Use-Case Card #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIdealFor(idx)}
                          className="text-stone-400 hover:text-rose-400 p-1 cursor-pointer"
                          title="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Icon Picker */}
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                            Icon
                          </label>
                          <select
                            value={item.icon}
                            onChange={(e) =>
                              handleUpdateIdealFor(
                                idx,
                                "icon",
                                e.target.value as ProductIdealFor["icon"]
                              )
                            }
                            className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            {IDEAL_FOR_ICON_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-[#141B29]"
                              >
                                {opt.emoji} {opt.value}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                            Focus Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Home Workouts"
                            value={item.title}
                            onChange={(e) =>
                              handleUpdateIdealFor(idx, "title", e.target.value)
                            }
                            className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-400 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Daily full-body toning in compact spaces"
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateIdealFor(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full bg-[#111724] border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: DESCRIPTION & BULLETS                                      */}
          {/* ================================================================= */}
          {activeTab === "description" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ListPlus className="w-4 h-4 text-orange-400" />
                    <span>Product Story, Hook &amp; Feature Checklist</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Craft catchy summaries, craftsmanship details, and bullet points.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Short Hook / Summary (Above-the-fold summary)
                </label>
                <textarea
                  rows={2}
                  placeholder="2-3 crisp sentences highlighting what makes this equipment stand out."
                  value={product.shortDescription || ""}
                  onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                  className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Detailed Product Description &amp; Craftsmanship Story
                </label>
                <textarea
                  rows={5}
                  placeholder="Detailed breakdown of build quality, workout use-cases, materials, durability, and customer benefits."
                  value={product.description || ""}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  className="w-full bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Key Feature Bullet Points
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. 100% Floor-friendly handcrafted wood - won't chip marble"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {(product.keyFeatures || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#182030] border border-stone-700/60 text-xs"
                    >
                      <span className="text-stone-200 flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{feat}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: MEDIA & GALLERY (Multi-Upload & Color Variants)             */}
          {/* ================================================================= */}
          {activeTab === "media" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <span>Media &amp; Product Gallery</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
                      {(product.gallery || []).length} Photos
                    </span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Multi-upload product photographs, choose primary cover image, and link specific photos to color / finish variants.
                  </p>
                </div>
              </div>

              {/* 1. Drag & Drop Multi-Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>Upload Product Images (Bulk / Multi-Select)</span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    Supported: JPG, PNG, WebP, AVIF
                  </span>
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFilesUpload(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => {
                    if (!isUploading) {
                      document.getElementById("multi-photo-file-input")?.click();
                    }
                  }}
                  className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragging
                      ? "border-orange-500 bg-orange-500/10 scale-[1.01]"
                      : "border-stone-700/80 hover:border-orange-500/60 bg-[#141b2d] hover:bg-[#182033]"
                  }`}
                >
                  <input
                    id="multi-photo-file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploading}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesUpload(e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center py-2 space-y-3">
                      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                      <div className="text-xs font-bold text-orange-400">
                        {uploadStatus || "Uploading images to CDN..."}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Please wait while files are uploaded and optimized.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3 text-orange-400 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        Drag &amp; drop multiple photos here, or <span className="text-orange-400 underline underline-offset-2">browse files</span>
                      </h3>
                      <p className="text-xs text-stone-400 max-w-md">
                        Select single or multiple files from your computer. Images are automatically uploaded to ImageKit CDN and added to the gallery.
                      </p>
                      {uploadStatus && (
                        <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{uploadStatus}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 2. Optional Manual URL Input */}
              <div className="pt-2">
                <details className="group">
                  <summary className="text-xs font-medium text-stone-400 hover:text-stone-200 cursor-pointer list-none flex items-center gap-1.5 transition-colors">
                    <span className="text-orange-400 group-open:rotate-90 transition-transform text-[10px]">▶</span>
                    <span>Or paste external image CDN link / URL manually</span>
                  </summary>
                  <div className="mt-2.5 flex gap-2">
                    <input
                      type="text"
                      placeholder="https://ik.imagekit.io/... or /wooden-dumbells.jpg"
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                      className="flex-1 bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add Link
                    </button>
                  </div>
                </details>
              </div>

              {/* 3. Primary Thumbnail Manual Override */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Primary Thumbnail Image URL (Main Storefront Cover) *
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden shrink-0">
                    {product.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.image}
                        alt="Primary thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="/wooden-dumbells.jpg"
                    value={product.image || ""}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    className="flex-1 bg-[#182030] border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* 4. Visual Gallery Grid with Color Variant Association */}
              {(product.gallery || []).length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold text-stone-300">
                      Product Gallery &amp; Variant Photo Mapping ({(product.gallery || []).length} Images):
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Tip: Choose which color variant each photo belongs to.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {product.gallery?.map((img, idx) => {
                      const isPrimary = product.image === img;
                      const assignedColor = galleryMetadata[img]?.color;

                      return (
                        <div
                          key={img + idx}
                          className={`rounded-2xl bg-[#141b2d] border overflow-hidden transition-all flex flex-col justify-between ${
                            isPrimary
                              ? "border-orange-500/80 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/30"
                              : "border-stone-700/80 hover:border-stone-600"
                          }`}
                        >
                          {/* Image Thumbnail with Overlay Badges */}
                          <div className="relative aspect-square w-full bg-stone-900/80 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={`Gallery view ${idx + 1}`}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                (e.target as HTMLElement).style.opacity = "0.3";
                              }}
                            />

                            {/* Position Badge */}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-stone-900/80 text-stone-300 font-mono text-[10px] backdrop-blur-xs">
                              #{idx + 1}
                            </span>

                            {/* Primary Cover Badge */}
                            {isPrimary && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-orange-500 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 fill-white" />
                                <span>Cover</span>
                              </span>
                            )}

                            {/* Variant Tag Badge */}
                            {assignedColor && (
                              <span className="absolute bottom-2 left-2 max-w-[85%] truncate px-2 py-0.5 rounded-full bg-sky-500/90 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 backdrop-blur-xs">
                                <Palette className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{assignedColor}</span>
                              </span>
                            )}
                          </div>

                          {/* Card Content & Controls */}
                          <div className="p-3 space-y-2.5 bg-[#161f33] border-t border-stone-800">
                            {/* Color Variant Connector Dropdown */}
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 flex items-center gap-1">
                                <Palette className="w-3 h-3 text-orange-400" />
                                <span>Connect to Color / Variant:</span>
                              </label>
                              <select
                                value={assignedColor || ""}
                                onChange={(e) => handleAssignGalleryColor(img, e.target.value)}
                                className="w-full bg-[#1e293b] border border-stone-700/80 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                              >
                                <option value="">🌐 Common (All Variants)</option>
                                {variantColorOptions.map((opt) => (
                                  <option key={opt} value={opt}>
                                    🎨 {opt}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Card Action Bar */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                              {isPrimary ? (
                                <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-orange-400" /> Cover Photo
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryThumbnail(img)}
                                  className="text-[11px] text-stone-400 hover:text-orange-400 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                                >
                                  <Star className="w-3 h-3" /> Make Cover
                                </button>
                              )}

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleReorderGallery(idx, "left")}
                                  title="Move earlier"
                                  className="p-1 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === (product.gallery?.length || 1) - 1}
                                  onClick={() => handleReorderGallery(idx, "right")}
                                  title="Move later"
                                  className="p-1 text-stone-400 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryUrl(idx)}
                                  title="Delete photo"
                                  className="p-1 text-stone-400 hover:text-rose-400 cursor-pointer transition-colors ml-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB FOOTER NAVIGATION & SAVE ACTION                               */}
          {/* ================================================================= */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              disabled={currentTabIdx === 0}
              onClick={handlePrevTab}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Tab</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              {currentTabIdx < TABS.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextTab}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Next Tab</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</div>
  );
}

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D111A] flex items-center justify-center text-stone-400">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading product editor...</span>
          </div>
        </div>
      }
    >
      <ProductEditContent params={params} />
    </Suspense>
  );
}
