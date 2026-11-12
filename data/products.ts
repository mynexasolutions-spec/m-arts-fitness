import { supabase } from "@/lib/supabase";

export interface ProductHighlight {
  title: string;
  subtitle: string;
  icon: "strength" | "shield" | "grip" | "home" | "heart" | "flame" | "bolt" | "scale" | "layers" | "droplet" | "feather" | "eye" | "grid" | "award";
}

export interface ProductSpec {
  label: string;
  value: string;
  unit?: string;
  detail?: string;
}

export interface ProductIdealFor {
  title: string;
  description: string;
  icon: "home" | "dumbbell" | "yoga" | "scale" | "football" | "agility" | "speed" | "school" | "cardio" | "core" | "rehab" | "outdoor";
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  values: string[];
}

export function generateVariantCombinations(groups?: ProductVariantGroup[]): string[] {
  if (!groups || groups.length === 0) return [];
  const validGroups = groups.filter((g) => g.values && g.values.length > 0);
  if (validGroups.length === 0) return [];

  let combos: string[] = [...validGroups[0].values];
  for (let i = 1; i < validGroups.length; i++) {
    const nextGroup = validGroups[i];
    const newCombos: string[] = [];
    for (const c of combos) {
      for (const v of nextGroup.values) {
        newCombos.push(`${c} / ${v}`);
      }
    }
    combos = newCombos;
  }
  return combos;
}

export interface ProductDetailItem {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  galleryMetadata?: Record<string, { color?: string; caption?: string }>;
  infographicImages?: string[];
  category: string;
  categoryLabel: string;
  badge: string;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  sku: string;
  inStock: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  trackVariantStock?: boolean;
  variantStock?: Record<string, number>;
  packInfo: string;
  optionsLabel?: string;
  options?: string[];
  variantGroups?: ProductVariantGroup[];
  highlights: ProductHighlight[];
  keyFeatures: string[];
  specifications: ProductSpec[];
   dimensionsSummary?: {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
    extraLabel?: string;
    extraValue?: string;
  };
  idealFor: ProductIdealFor[];
}

export const ALL_PRODUCTS: ProductDetailItem[] = [
  {
    id: "wooden-dumbbells",
    name: "Wooden Dumbbells",
    tagline: "Set of 2 • Ergonomic & Floor-Friendly",
    shortDescription:
      "Durable, floor-friendly and handcrafted workout pair designed for daily home workouts, strength training, and traditional conditioning.",
    description:
      "Engineered for natural grip comfort and everyday durability, M.art's Dumbbell Pair gives you balanced weight distribution for wrist conditioning, shoulder mobility, and progressive home strength training. Includes both natural wooden finish and vinyl-coated variant options for sweat-resistant, floor-safe performance.",
    image: "/wooden-dumbells.jpg",
    gallery: [
      "/wooden-dumbells.jpg",
      "/dumbbells-info-1.jpg",
      "/dumbbells-info-2.jpg",
    ],
    galleryMetadata: {
      "/wooden-dumbells.jpg": { color: "Vinyl Coated (Orange)" },
    },
    infographicImages: ["/dumbbells-info-1.jpg", "/dumbbells-info-2.jpg"],
    category: "gym",
    categoryLabel: "Gym Equipment",
    badge: "Best Seller",
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 120,
    price: 499,
    originalPrice: 899,
    sku: "MART-DB-001",
    inStock: true,
    stockQuantity: 68,
    lowStockThreshold: 5,
    trackVariantStock: true,
    variantStock: {
      "0.5 kg / Natural Hardwood": 10,
      "0.5 kg / Vinyl Coated (Orange)": 8,
      "1 kg / Natural Hardwood": 12,
      "1 kg / Vinyl Coated (Orange)": 15,
      "1.5 kg / Natural Hardwood": 6,
      "1.5 kg / Vinyl Coated (Orange)": 5,
      "2 kg / Natural Hardwood": 8,
      "2 kg / Vinyl Coated (Orange)": 4,
      "3 kg / Natural Hardwood": 5,
      "3 kg / Vinyl Coated (Orange)": 2,
      "5 kg / Natural Hardwood": 3,
      "5 kg / Vinyl Coated (Orange)": 0,
    },
    packInfo: "Set of 2 Dumbbells",
    optionsLabel: "Available Weights (Each)",
    options: ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "5 kg"],
    variantGroups: [
      {
        id: "grp-weights",
        name: "Available Weights (Each)",
        values: ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "5 kg"],
      },
      {
        id: "grp-finish",
        name: "Finish / Edition",
        values: ["Vinyl Coated (Orange)", "Natural Hardwood"],
      },
    ],
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
    keyFeatures: [
      "Balanced twin-head weight distribution for stable lifting & swings",
      "Ergonomic non-slip comfort grip reduces palm fatigue during high reps",
      "Floor-friendly smooth exterior prevents tile and wooden floor scuffs",
      "Sweat-resistant, wipe-clean surface built for daily indoor & outdoor use",
      "Compact profile stores easily on racks, shelves, or under workout benches",
    ],
    specifications: [
      { label: "Length", value: "~ 18–20 cm", detail: "Compact balanced shaft" },
      { label: "Head Diameter", value: "~ 5–6 cm", detail: "Anti-roll end profile" },
      { label: "Pack Contents", value: "Set of 2", detail: "Matched weight pair" },
      { label: "Material", value: "Seasoned Hardwood / Vinyl Coat", detail: "Rust & crack resistant" },
      { label: "Grip Type", value: "Contoured Anti-Slip", detail: "Comfort ergonomic barrel" },
      { label: "Weight Options", value: "0.5 kg to 5 kg", detail: "Per dumbbell" },
    ],
    dimensionsSummary: {
      primaryLabel: "Total Length",
      primaryValue: "~ 18–20 cm",
      secondaryLabel: "End Diameter",
      secondaryValue: "~ 5–6 cm",
      extraLabel: "Pack Size",
      extraValue: "Set of 2 Pair",
    },
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
  {
    id: "training-cones",
    name: "Training Cones Set",
    tagline: "Pack of 50 • Flexible & Unbreakable",
    shortDescription:
      "Durable, flexible and highly visible disc cones for sports training, agility drills, and field boundary marking.",
    description:
      "Take your footwork, speed drills, and field coaching to the next level with M.art's Pack of 50 Training Cones. Molded from high-flexibility LDPE thermoplastic, these low-profile disc cones bounce right back into shape even when stepped on or kicked during intense football, cricket, and basketball practice.",
    image: "/Training-cones.jpg",
    gallery: ["/Training-cones.jpg", "/training-cones-info.jpg"],
    infographicImages: ["/training-cones-info.jpg"],
    category: "agility",
    categoryLabel: "Agility Tools",
    badge: "33% OFF",
    isBestSeller: true,
    rating: 4.7,
    reviewsCount: 95,
    price: 799,
    originalPrice: 1199,
    sku: "MART-TC-050",
    inStock: true,
    stockQuantity: 28,
    lowStockThreshold: 5,
    packInfo: "Pack of 50 Cones + Carry Stand",
    optionsLabel: "Color Options Included",
    options: ["Bright Yellow", "Fiery Red", "Electric Blue", "Multi-Color Pack of 50"],
    highlights: [
      {
        title: "Durable & Long-Lasting",
        subtitle: "All-weather UV-protected plastic",
        icon: "shield",
      },
      {
        title: "Lightweight & Portable",
        subtitle: "Stacks neatly on central carry stand",
        icon: "feather",
      },
      {
        title: "Flexible & Unbreakable",
        subtitle: "Crush-proof LDPE bounces back instantly",
        icon: "layers",
      },
      {
        title: "Bright High Visibility",
        subtitle: "Easy to spot on turf, grass & courts",
        icon: "eye",
      },
    ],
    keyFeatures: [
      "Pack of 50 high-visibility disc cones for large team & academy drills",
      "Flexible & unbreakable crack-resistant material safe for cleats & shoes",
      "Low-profile 5 cm aerodynamic height prevents wind tipping on open grounds",
      "Wide 19 cm stable base with 5 cm center hole for vertical stack holder",
      "Multi-sport versatility for turf, grass, synthetic courts, and indoor halls",
    ],
    specifications: [
      { label: "Base Diameter", value: "19 cm", detail: "Wide wind-stable footprint" },
      { label: "Cone Height", value: "5 cm", detail: "Low-profile trip-safe height" },
      { label: "Inner Hole Diameter", value: "5 cm", detail: "Fits stackable carry pole" },
      { label: "Pack Quantity", value: "50 Cones", detail: "Includes mesh bag & holder" },
      { label: "Material", value: "Flexible Virgin LDPE", detail: "Crack & crush resistant" },
      { label: "Color Options", value: "Yellow, Red, Blue", detail: "UV-bright neon pigments" },
    ],
    dimensionsSummary: {
      primaryLabel: "Base Diameter",
      primaryValue: "19 cm",
      secondaryLabel: "Cone Height",
      secondaryValue: "5 cm",
      extraLabel: "Inner Hole",
      extraValue: "5 cm Diameter",
    },
    idealFor: [
      {
        title: "Football Training",
        description: "Dribbling gates, passing lanes & small-sided pitches",
        icon: "football",
      },
      {
        title: "Basketball Drills",
        description: "Defensive slides, court markers & handling",
        icon: "agility",
      },
      {
        title: "Agility & Speed",
        description: "Shuttle runs, directional cuts & sprint intervals",
        icon: "speed",
      },
      {
        title: "School & Sports",
        description: "PE classes, obstacle courses & academy coaching",
        icon: "school",
      },
    ],
  },
  {
    id: "skipping-rope",
    name: "Pro Skipping Rope",
    tagline: "Adjustable & Durable • Tangle-Free PVC",
    shortDescription:
      "A perfect fitness tool for high-speed cardio, weight loss, footwork coordination, and overall stamina building.",
    description:
      "Engineered for smooth, rapid rotation without kinking or tangling, the M.art Pro Skipping Rope features a high-density solid PVC cord paired with ergonomic anti-slip grooved handles. Easily customize the rope length in seconds to match any user height from beginners to pro boxers.",
    image: "/Skipping-rope.jpg",
    gallery: ["/Skipping-rope.jpg", "/skipping-rope-info.jpg"],
    infographicImages: ["/skipping-rope-info.jpg"],
    category: "training",
    categoryLabel: "Training Gear",
    badge: "20% OFF",
    rating: 4.6,
    reviewsCount: 72,
    price: 399,
    originalPrice: 499,
    sku: "MART-SR-204",
    inStock: true,
    stockQuantity: 4,
    lowStockThreshold: 5,
    packInfo: "1 Adjustable Pro Jump Rope",
    optionsLabel: "Length Adjustment",
    options: ["Up to 9.5 ft (Adjustable for All Heights)"],
    highlights: [
      {
        title: "Boosts Cardio Fitness",
        subtitle: "Elevates heart rate & lung capacity fast",
        icon: "heart",
      },
      {
        title: "Burns Calories",
        subtitle: "High-efficiency HIIT fat-burning tool",
        icon: "flame",
      },
      {
        title: "Builds Stamina",
        subtitle: "Improves footwork speed & endurance",
        icon: "strength",
      },
      {
        title: "Supports Weight Loss",
        subtitle: "Full-body metabolic conditioning",
        icon: "scale",
      },
    ],
    keyFeatures: [
      "Adjustable rope length mechanism suitable for adults and athletes of all heights",
      "Tangle-free solid PVC cord ensures smooth, high-speed 360° rotation",
      "Anti-slip grooved grip handles offer firm control even with sweaty palms",
      "Lightweight & pocket-portable — carry it to the gym, park, or travel bag",
      "Abrasion-resistant durable cord built for concrete, wood, and gym mat surfaces",
    ],
    specifications: [
      { label: "Rope Length", value: "280 cm (9.2 ft)", detail: "Fully adjustable clip lock" },
      { label: "Cord Material", value: "High-Density PVC", detail: "Tangle-free 5mm cord" },
      { label: "Handle Design", value: "Ring-Grooved Matte Polymer", detail: "Anti-slip ergonomic grip" },
      { label: "Handle Length", value: "13.5 cm", detail: "Balanced palm control" },
      { label: "Net Weight", value: "~ 160 g", detail: "Fast wrist feedback" },
      { label: "Rotation System", value: "Low-Friction Collar", detail: "Smooth continuous swing" },
    ],
    dimensionsSummary: {
      primaryLabel: "Max Cord Length",
      primaryValue: "280 cm (Adjustable)",
      secondaryLabel: "Cord Thickness",
      secondaryValue: "5 mm PVC",
      extraLabel: "Handle Length",
      extraValue: "13.5 cm Anti-Slip",
    },
    idealFor: [
      {
        title: "Home Workouts",
        description: "Zero-setup daily cardio in living rooms or balconies",
        icon: "home",
      },
      {
        title: "Fitness Training",
        description: "Warm-ups, HIIT circuits, boxing & CrossFit double-unders",
        icon: "cardio",
      },
      {
        title: "Weight Management",
        description: "Burns up to 15 calories per minute of active jumping",
        icon: "scale",
      },
      {
        title: "Agility & Stamina",
        description: "Sharpens ankle resilience, rhythm, and coordination",
        icon: "speed",
      },
    ],
  },
  {
    id: "yoga-mat",
    name: "Premium Yoga Mat",
    tagline: "Comfort • Grip • Durability (6 mm Thick)",
    shortDescription:
      "A perfect high-density cushioned mat for yoga, floor workouts, stretching, pilates, and everyday fitness.",
    description:
      "Experience superior joint protection and rock-solid stability with the M.art Premium 6 mm Yoga Mat. Crafted from eco-friendly, high-density EVA/TPE foam with a micro-ribbed textured surface, it prevents slipping during intense vinyasa flows, planks, and sweaty core sessions. Comes complete with a free carry strap.",
    image: "/Yoga-mat.jpg",
    gallery: ["/Yoga-mat.jpg", "/yoga-mat-info.jpg"],
    infographicImages: ["/yoga-mat-info.jpg"],
    category: "yoga",
    categoryLabel: "Yoga & Wellness",
    badge: "Best Seller",
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 145,
    price: 749,
    originalPrice: 999,
    sku: "MART-YM-6MM",
    inStock: true,
    stockQuantity: 49,
    lowStockThreshold: 5,
    trackVariantStock: true,
    variantStock: {
      "6 mm / Royal Blue": 8,
      "6 mm / Charcoal Black": 10,
      "6 mm / Deep Purple": 4,
      "6 mm / Teal Green": 6,
      "8 mm / Royal Blue": 5,
      "8 mm / Charcoal Black": 3,
      "8 mm / Deep Purple": 0,
      "8 mm / Teal Green": 4,
      "10 mm / Royal Blue": 2,
      "10 mm / Charcoal Black": 5,
      "10 mm / Deep Purple": 2,
      "10 mm / Teal Green": 0,
    },
    packInfo: "1 Yoga Mat + Free Carry Strap",
    optionsLabel: "Available Colors",
    options: ["Royal Blue", "Charcoal Black", "Deep Purple", "Teal Green"],
    variantGroups: [
      {
        id: "grp-thickness",
        name: "Select Thickness",
        values: ["6 mm", "8 mm", "10 mm"],
      },
      {
        id: "grp-colors",
        name: "Available Colors",
        values: ["Royal Blue", "Charcoal Black", "Deep Purple", "Teal Green"],
      },
    ],
    highlights: [
      {
        title: "High-Density Cushion",
        subtitle: "6 mm shock-absorbing joint protection",
        icon: "layers",
      },
      {
        title: "Anti-Slip Texture",
        subtitle: "Double-sided grip stays firm on floors",
        icon: "grip",
      },
      {
        title: "Sweat & Water Resistant",
        subtitle: "Closed-cell surface blocks moisture & odor",
        icon: "droplet",
      },
      {
        title: "Lightweight & Portable",
        subtitle: "800 g roll-up design with carry strap",
        icon: "feather",
      },
    ],
    keyFeatures: [
      "6 mm optimal cushioning protects knees, elbows, and spine on hard floors",
      "Textured anti-slip bubble & ridge surface ensures firm traction in every pose",
      "Flexible & tear-resistant construction withstands daily stretching and shoe workouts",
      "Sweat and water-resistant closed-cell foam cleans easily with a damp cloth",
      "Includes detachable dual-loop carry strap for effortless commute to studio or park",
    ],
    specifications: [
      { label: "Length", value: "183 cm (72 inch)", detail: "Full-body tall coverage" },
      { label: "Width", value: "61 cm (24 inch)", detail: "Generous shoulder span" },
      { label: "Thickness", value: "6 mm", detail: "High-density cushioning" },
      { label: "Material", value: "Premium Eco EVA / TPE", detail: "Non-toxic & latex-free" },
      { label: "Net Weight", value: "~ 800 g", detail: "Ultra-portable with strap" },
      { label: "Surface Pattern", value: "Textured Anti-Slip", detail: "Moisture-repellent grip" },
    ],
    dimensionsSummary: {
      primaryLabel: "Dimensions",
      primaryValue: "183 cm × 61 cm",
      secondaryLabel: "Thickness",
      secondaryValue: "6 mm Cushion",
      extraLabel: "Weight",
      extraValue: "~ 800 g",
    },
    idealFor: [
      {
        title: "Yoga & Pranayama",
        description: "Asanas, Surya Namaskar, meditation & floor balance",
        icon: "yoga",
      },
      {
        title: "Home Workouts",
        description: "Push-ups, planks, crunches & bodyweight circuits",
        icon: "home",
      },
      {
        title: "Stretching & Mobility",
        description: "Post-run cooldowns, foam rolling & flexibility",
        icon: "rehab",
      },
      {
        title: "Fitness Training",
        description: "Pilates, core conditioning & studio group classes",
        icon: "dumbbell",
      },
    ],
  },
  {
    id: "hex-dumbbells-5kg",
    name: "Rubber Hex Dumbbells",
    tagline: "Pair of 5 kg • Commercial Knurled Steel Handle",
    shortDescription:
      "Heavy-duty virgin rubber-encased hexagonal dumbbells built for zero floor rolling and commercial strength training.",
    description:
      "Built to commercial gym standards, M.art Rubber Hex Dumbbells feature solid cast-iron heads encased in thick virgin rubber to reduce noise, protect flooring, and prevent rolling between sets. The chrome-plated ergonomic steel handle features precision diamond knurling for a locked-in grip.",
    image: "/Gym-Equipment.jpg",
    gallery: ["/Gym-Equipment.jpg"],
    category: "gym",
    categoryLabel: "Gym Equipment",
    badge: "Best Seller",
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 210,
    price: 1499,
    originalPrice: 2199,
    sku: "MART-HEX-05K",
    inStock: true,
    stockQuantity: 12,
    lowStockThreshold: 5,
    packInfo: "Set of 2 (5 kg × 2 = 10 kg Total)",
    optionsLabel: "Available Weight Pairs",
    options: ["2.5 kg Pair", "5 kg Pair", "7.5 kg Pair", "10 kg Pair", "12.5 kg Pair", "15 kg Pair"],
    highlights: [
      {
        title: "Anti-Roll Hex Head",
        subtitle: "6-sided flat edges stay put on floors",
        icon: "grid",
      },
      {
        title: "Virgin Rubber Coat",
        subtitle: "Low-odor, shock-absorbing armor",
        icon: "shield",
      },
      {
        title: "Chrome Knurled Grip",
        subtitle: "Solid steel handle prevents slipping",
        icon: "grip",
      },
      {
        title: "Commercial Grade",
        subtitle: "Friction-welded head-to-shaft bond",
        icon: "strength",
      },
    ],
    keyFeatures: [
      "Hexagonal anti-roll heads ideal for renegade rows and floor push-ups",
      "Thick virgin rubber casing absorbs impact and protects home tiles",
      "Ergonomic 28 mm solid steel chrome handle with medium diamond knurling",
      "Precision weight tolerance within ±2% for balanced progressive overload",
      "Rust-proof, weather-resistant finish built for decades of heavy lifting",
    ],
    specifications: [
      { label: "Total Length", value: "27.5 cm", detail: "Balanced commercial profile" },
      { label: "Hex Head Width", value: "11.5 cm", detail: "6-sided anti-roll flats" },
      { label: "Handle Length", value: "13 cm", detail: "28 mm ergonomic diameter" },
      { label: "Core Material", value: "Solid Cast Iron + Steel", detail: "Virgin rubber encased" },
      { label: "Weight in Box", value: "10 kg Total", detail: "2 × 5 kg Dumbbells" },
      { label: "Finish", value: "Matte Black Rubber & Chrome", detail: "Corrosion-proof" },
    ],
    dimensionsSummary: {
      primaryLabel: "Total Length",
      primaryValue: "27.5 cm",
      secondaryLabel: "Hex Diameter",
      secondaryValue: "11.5 cm",
      extraLabel: "Grip Shaft",
      extraValue: "13 cm Knurled",
    },
    idealFor: [
      {
        title: "Strength Training",
        description: "Bench press, shoulder press, rows & goblet squats",
        icon: "dumbbell",
      },
      {
        title: "Home Gym Setup",
        description: "Quiet, floor-safe lifting in apartments & garages",
        icon: "home",
      },
      {
        title: "Core & HIIT",
        description: "Renegade rows, thrusters, devil presses & lunges",
        icon: "core",
      },
      {
        title: "Muscle Hypertrophy",
        description: "Progressive overload for upper & lower body",
        icon: "scale",
      },
    ],
  },
  {
    id: "agility-ladder-pro",
    name: "Speed Agility Ladder",
    tagline: "6 Meter • 12 Adjustable Heavy-Duty Rungs",
    shortDescription:
      "Pro-grade flat-rung speed training ladder with carry bag for explosive footwork, coordination, and athletic quickness.",
    description:
      "Unlock faster foot speed, sharper lateral cuts, and superior neuromuscular coordination with the M.art 6-Meter Speed Agility Ladder. Constructed with shatterproof PP flat rungs threaded onto braided nylon straps, you can customize rung spacing for short quick-steps or wide explosive bounds.",
    image: "/Agility-tools.jpg",
    gallery: ["/Agility-tools.jpg"],
    category: "agility",
    categoryLabel: "Agility Tools",
    badge: "35% OFF",
    rating: 4.7,
    reviewsCount: 88,
    price: 649,
    originalPrice: 999,
    sku: "MART-AL-12R",
    inStock: true,
    stockQuantity: 3,
    lowStockThreshold: 5,
    packInfo: "6m 12-Rung Ladder + Carry Bag + 4 Ground Pegs",
    optionsLabel: "Ladder Size",
    options: ["4 Meter (8 Rungs)", "6 Meter (12 Rungs)", "8 Meter (16 Rungs)"],
    highlights: [
      {
        title: "Explosive Foot Speed",
        subtitle: "Sharpens stride frequency & reflexes",
        icon: "bolt",
      },
      {
        title: "Unbreakable Rungs",
        subtitle: "High-impact flexible PP flat slats",
        icon: "layers",
      },
      {
        title: "Adjustable Spacing",
        subtitle: "Slide rungs along nylon straps easily",
        icon: "grid",
      },
      {
        title: "Instant Setup Bag",
        subtitle: "Tangle-free roll-out with steel pegs",
        icon: "feather",
      },
    ],
    keyFeatures: [
      "12 heavy-duty flat plastic rungs engineered to lie flush against turf or courts",
      "Fully adjustable rung distance up to 6 meters on weatherproof nylon webbing",
      "Includes 4 steel ground stakes to anchor the ladder firmly on grass fields",
      "Snap-buckle ends allow connecting two ladders together for extended 12m drills",
      "Comes with a breathable drawstring carry bag for effortless field transport",
    ],
    specifications: [
      { label: "Total Length", value: "6 Meters (20 ft)", detail: "End-to-end nylon strap" },
      { label: "Rung Width", value: "50 cm", detail: "4 cm flat anti-trip profile" },
      { label: "Number of Rungs", value: "12 Rungs", detail: "Slide-adjustable spacing" },
      { label: "Material", value: "Shatterproof PP + Nylon", detail: "High-visibility yellow/black" },
      { label: "Net Weight", value: "~ 650 g", detail: "Includes carry bag & 4 pegs" },
      { label: "Surface Use", value: "Grass, Turf, Court, Concrete", detail: "Indoor & outdoor" },
    ],
    dimensionsSummary: {
      primaryLabel: "Total Length",
      primaryValue: "600 cm (6 m)",
      secondaryLabel: "Rung Width",
      secondaryValue: "50 cm",
      extraLabel: "Rung Count",
      extraValue: "12 Flat Slats",
    },
    idealFor: [
      {
        title: "Football & Cricket",
        description: "Fast feet, lateral shuffles & wicket sprint bursts",
        icon: "football",
      },
      {
        title: "Agility Drills",
        description: "Ickey shuffle, in-and-outs, hopscotch & crossovers",
        icon: "agility",
      },
      {
        title: "Speed & Cardio",
        description: "High-knee metabolic conditioning & calorie burn",
        icon: "speed",
      },
      {
        title: "School & Academies",
        description: "Youth athletic development & team warm-ups",
        icon: "school",
      },
    ],
  },
  {
    id: "foam-roller-pro",
    name: "High Density Foam Roller",
    tagline: "45 cm • Muscle Recovery & Deep Tissue Massage",
    shortDescription:
      "Commercial-grade EPP high-density foam roller designed for deep tissue muscle release, spine alignment, and post-workout recovery.",
    description:
      "Relieve muscle tightness, increase joint flexibility, and accelerate workout recovery with M.art's High-Density Foam Roller. Made from non-toxic, eco-friendly expanded polypropylene (EPP) that will not lose its firmness or shape under heavy load. Ideal for calves, quads, IT bands, glutes, and upper back.",
    image: "/Yoga-wellness.jpg",
    gallery: ["/Yoga-wellness.jpg"],
    category: "yoga",
    categoryLabel: "Yoga & Wellness",
    badge: "Top Rated",
    rating: 4.8,
    reviewsCount: 110,
    price: 599,
    originalPrice: 899,
    sku: "MART-FR-45",
    inStock: true,
    stockQuantity: 35,
    lowStockThreshold: 5,
    packInfo: "1 x 45cm EPP Foam Roller",
    optionsLabel: "Roller Length",
    options: ["30 cm", "45 cm", "90 cm"],
    highlights: [
      {
        title: "Deep Tissue Release",
        subtitle: "Targets trigger points & relaxes tight muscles",
        icon: "layers",
      },
      {
        title: "Spine & Core Rehab",
        subtitle: "Enhances mobility and back posture",
        icon: "heart",
      },
      {
        title: "Non-Deforming Core",
        subtitle: "Dense EPP foam retains firm shape",
        icon: "shield",
      },
      {
        title: "Ultra Lightweight",
        subtitle: "Effortless to carry in gym or travel bags",
        icon: "feather",
      },
    ],
    keyFeatures: [
      "High-density expanded polypropylene (EPP) structure supporting up to 150 kg",
      "Textured non-slip matte exterior for controlled rolling on gym mats or floors",
      "Waterproof, sweat-resistant, and easily washable with mild soap and water",
      "Ideal for pre-workout dynamic stretching and post-workout myofascial release",
    ],
    specifications: [
      { label: "Length", value: "45 cm (18 inches)", detail: "Full spine coverage" },
      { label: "Diameter", value: "15 cm (6 inches)", detail: "Ergonomic curvature" },
      { label: "Material", value: "100% Recyclable EPP", detail: "Odorless & eco-safe" },
      { label: "Weight", value: "220 g", detail: "Featherlight density" },
    ],
    dimensionsSummary: {
      primaryLabel: "Length",
      primaryValue: "45 cm",
      secondaryLabel: "Diameter",
      secondaryValue: "15 cm",
      extraLabel: "Max Load",
      extraValue: "150 kg",
    },
    idealFor: [
      {
        title: "Muscle Recovery",
        description: "Post-workout myofascial release & soreness relief",
        icon: "rehab",
      },
      {
        title: "Yoga & Pilates",
        description: "Balance training, core stabilization & chest openers",
        icon: "yoga",
      },
      {
        title: "Back Posture",
        description: "Spinal decompression after long sitting hours",
        icon: "core",
      },
      {
        title: "Home Fitness",
        description: "Daily flexibility routine before bedtime or training",
        icon: "home",
      },
    ],
  },
  {
    id: "sports-water-bottle",
    name: "Insulated Sports Shaker",
    tagline: "750 ml • Leak-Proof Stainless Steel",
    shortDescription:
      "BPA-free insulated fitness shaker bottle with whisk ball and leak-proof spout for protein shakes, hydration, and pre-workouts.",
    description:
      "Stay hydrated throughout intense gym sessions with M.art's Insulated Sports Shaker. Features food-grade double-walled stainless steel construction that keeps water ice-cold for up to 24 hours. Includes a surgical steel mixing ball for lump-free protein shakes and a silicone-sealed flip cap.",
    image: "/Sports-Acessories.jpg",
    gallery: ["/Sports-Acessories.jpg"],
    category: "training",
    categoryLabel: "Training Gear",
    badge: "Popular",
    rating: 4.6,
    reviewsCount: 85,
    price: 349,
    originalPrice: 499,
    sku: "MART-SHK-750",
    inStock: true,
    stockQuantity: 50,
    lowStockThreshold: 5,
    packInfo: "1 x 750ml Shaker + Whisk Ball",
    optionsLabel: "Color Variant",
    options: ["Matte Black", "Steel Silver", "Olympic Orange"],
    highlights: [
      {
        title: "24-Hour Cold",
        subtitle: "Double-walled vacuum insulation",
        icon: "droplet",
      },
      {
        title: "Zero Leaks",
        subtitle: "Silicone seal flip cap with carry loop",
        icon: "shield",
      },
      {
        title: "Smooth Shakes",
        subtitle: "Stainless wire ball dissolves all clumps",
        icon: "layers",
      },
      {
        title: "Food-Grade Steel",
        subtitle: "100% BPA-free and rust-resistant",
        icon: "award",
      },
    ],
    keyFeatures: [
      "Premium 18/8 food-grade stainless steel interior eliminates odor retention",
      "Wide-mouth design makes adding ice cubes and supplement scoops effortless",
      "Leak-proof safety twist cap with integrated ergonomic carry handle",
      "Debossed interior volume markings in both milliliters and ounces",
    ],
    specifications: [
      { label: "Capacity", value: "750 ml (25 oz)", detail: "Full day hydration" },
      { label: "Material", value: "18/8 Stainless Steel", detail: "Double-wall insulated" },
      { label: "Insulation", value: "24h Cold / 12h Hot", detail: "Vacuum sealed" },
      { label: "Weight", value: "310 g", detail: "Lightweight & sturdy" },
    ],
    dimensionsSummary: {
      primaryLabel: "Capacity",
      primaryValue: "750 ml",
      secondaryLabel: "Height",
      secondaryValue: "24 cm",
      extraLabel: "Base Width",
      extraValue: "7.5 cm",
    },
    idealFor: [
      {
        title: "Gym & Outdoor",
        description: "Hydration during heavy lifting and running drills",
        icon: "outdoor",
      },
      {
        title: "Cardio Workouts",
        description: "Instant sip access during treadmill and HIIT sessions",
        icon: "cardio",
      },
      {
        title: "Protein Shakes",
        description: "Lump-free post-workout whey and BCAA blending",
        icon: "home",
      },
      {
        title: "Daily Commute",
        description: "Fits securely into standard car and bike cup holders",
        icon: "speed",
      },
    ],
  },
  {
    id: "sports-training-ball",
    name: "Multi-Sport Training Ball",
    tagline: "Size 5 • Thermal Bonded Weatherproof",
    shortDescription:
      "High-resilience multi-sport training ball with textured grip and reinforced butyl bladder for football, basketball, and agility drills.",
    description:
      "Engineered for match-level rebound and pinpoint trajectory, M.art's Multi-Sport Training Ball features machine-stitched PU leather with water-resistant micro-texture. Suitable for grass pitches, turf fields, hard courts, and training academies.",
    image: "/Sports-gear.jpg",
    gallery: ["/Sports-gear.jpg"],
    category: "training",
    categoryLabel: "Training Gear",
    badge: "25% OFF",
    rating: 4.7,
    reviewsCount: 92,
    price: 549,
    originalPrice: 799,
    sku: "MART-BALL-05",
    inStock: true,
    stockQuantity: 22,
    lowStockThreshold: 5,
    packInfo: "1 x Size 5 Ball + Inflation Needle",
    optionsLabel: "Ball Size",
    options: ["Size 4 (Youth)", "Size 5 (Official)"],
    highlights: [
      {
        title: "Pinpoint Flight",
        subtitle: "Aerodynamic 32-panel precision geometry",
        icon: "bolt",
      },
      {
        title: "All-Weather PU",
        subtitle: "Zero water absorption on wet fields",
        icon: "layers",
      },
      {
        title: "Micro-Textured Grip",
        subtitle: "Superior boot and glove friction",
        icon: "grip",
      },
      {
        title: "Air Retention",
        subtitle: "Reinforced butyl bladder holds pressure",
        icon: "shield",
      },
    ],
    keyFeatures: [
      "Abrasion-resistant textured outer casing withstands rough turf and gravel",
      "High-rebound EVA foam cushioning layer provides soft touch and control",
      "Reinforced wound bladder delivers consistent bounce and true flight",
      "Includes air pump inflation needle in the box for instant match readiness",
    ],
    specifications: [
      { label: "Size", value: "Official Size 5", detail: "Circumference 68-70 cm" },
      { label: "Weight", value: "410 - 430 g", detail: "Official match standard" },
      { label: "Casing", value: "Textured PU Leather", detail: "Thermal bonded seams" },
      { label: "Bladder", value: "Reinforced Butyl", detail: "High air retention" },
    ],
    dimensionsSummary: {
      primaryLabel: "Size",
      primaryValue: "Size 5",
      secondaryLabel: "Weight",
      secondaryValue: "420 g",
      extraLabel: "Circumference",
      extraValue: "69 cm",
    },
    idealFor: [
      {
        title: "Football Matches",
        description: "Official 11v11 match play, passing and shooting practice",
        icon: "football",
      },
      {
        title: "Agility & Speed",
        description: "Dribbling cone mazes, sprint touches and reaction drills",
        icon: "agility",
      },
      {
        title: "Youth Academies",
        description: "Skill development and coaching clinics",
        icon: "school",
      },
      {
        title: "Weekend Games",
        description: "Turf and park friendlies with unmatched durability",
        icon: "speed",
      },
    ],
  },
];

export const PRODUCT_ORDER = [
  "wooden-dumbbells",
  "training-cones",
  "skipping-rope",
  "yoga-mat",
  "sports-training-ball",
  "hex-dumbbells-5kg",
  "agility-ladder-pro",
];

export function getProductById(id: string): ProductDetailItem | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export async function fetchProducts(): Promise<ProductDetailItem[]> {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (!error && data && data.length > 0) {
      const orderMap = new Map(PRODUCT_ORDER.map((id, index) => [id, index]));
      return (data as ProductDetailItem[]).sort((a, b) => {
        const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
        const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
        return indexA - indexB;
      });
    }
    if (error) {
      console.warn("[Supabase] Products query warning:", error.message);
    }
  } catch (err) {
    console.warn("[Supabase] Error loading products:", err);
  }
  return ALL_PRODUCTS;
}

export async function fetchProductById(id: string): Promise<ProductDetailItem | undefined> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return data as ProductDetailItem;
    }
    if (error) {
      console.warn("[Supabase] Product single query warning:", error.message);
    }
  } catch (err) {
    console.warn("[Supabase] Error loading product by id:", err);
  }
  return getProductById(id);
}
