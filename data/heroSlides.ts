import { supabase } from "@/lib/supabase";

export interface HeroSlide {
  id: string;
  title: string;
  title_gradient?: string;
  subtitle: string;
  badge_text: string;
  cta_text: string;
  cta_link: string;
  desktop_image: string; // Mandatory 16:9
  mobile_image: string;  // Mandatory 9:16
  alt_text: string;
  object_position?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    title: "Gear Up for a",
    title_gradient: "Healthier You",
    subtitle: "Premium Sports & Fitness Equipment for Every Age and Every Goal",
    badge_text: "Fitness • Sports • Wellness",
    cta_text: "Shop Now",
    cta_link: "/products",
    desktop_image: "/Hero-16-9.jpg",
    mobile_image: "/Hero-mobile-9-16.jpg",
    alt_text: "M.art Sports & Fitness Equipment",
    object_position: "object-[84%_6%] md:object-[85%_6%] lg:object-[86%_6%] xl:object-[86%_5%] 2xl:object-[86%_4%]",
    display_order: 1,
    is_active: true,
  },
  {
    id: "default-2",
    title: "Gear Up for a",
    title_gradient: "Healthier You",
    subtitle: "Premium Sports & Fitness Equipment for Every Age and Every Goal",
    badge_text: "Fitness • Sports • Wellness",
    cta_text: "Shop Now",
    cta_link: "/products",
    desktop_image: "/slide 2.jpeg",
    mobile_image: "/slide 2 mobile.jpeg",
    alt_text: "Premium Gym and Training Gear",
    object_position: "object-center",
    display_order: 2,
    is_active: true,
  },
  {
    id: "default-3",
    title: "Gear Up for a",
    title_gradient: "Healthier You",
    subtitle: "Premium Sports & Fitness Equipment for Every Age and Every Goal",
    badge_text: "Fitness • Sports • Wellness",
    cta_text: "Shop Now",
    cta_link: "/products",
    desktop_image: "/slide 3.jpeg",
    mobile_image: "/slide 3 mobile.jpeg",
    alt_text: "Athletic Wellness and Sports Accessories",
    object_position: "object-center",
    display_order: 3,
    is_active: true,
  },
];

/**
 * Fetch all hero slides (for admin management)
 */
export async function getAdminHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HERO_SLIDES;
    }

    return data as HeroSlide[];
  } catch (err) {
    console.warn("[heroSlides] Falling back to default slides:", err);
    return DEFAULT_HERO_SLIDES;
  }
}

/**
 * Fetch only active hero slides (for frontend store)
 */
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HERO_SLIDES.filter((s) => s.is_active);
    }

    return data as HeroSlide[];
  } catch (err) {
    console.warn("[heroSlides] Frontend fallback to default slides:", err);
    return DEFAULT_HERO_SLIDES.filter((s) => s.is_active);
  }
}
