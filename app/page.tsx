import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustStrip from "@/components/TrustStrip";
import LifestyleBanner from "@/components/LifestyleBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import CollectionsGrid from "@/components/CollectionsGrid";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0"
    >
      {/* 1. Announcement Bar */}
      <TopBar />

      {/* 2. Header & Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection />

        {/* 4. Shop by Category */}
        <CategoriesSection />

        {/* 5. Featured Products */}
        <FeaturedProducts />

        {/* 6. Action / Lifestyle Mid-Banner */}
        <LifestyleBanner />

        {/* 7. Why Choose M.art? */}
        <WhyChooseUs />

        {/* 8. Curated Collections 3-Card Grid */}
        <CollectionsGrid />

        {/* 9. Customer Testimonials */}
        <Testimonials />

        {/* 10. Stay Updated / Newsletter */}
        <Newsletter />

        {/* 11. Trust & Service Value Proposition Strip (Pre-Footer Reassurance) */}
        <TrustStrip />
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
