-- ========================================================
-- M.art Sports & Fitness: Hero Slides Table
-- Run this in your Supabase SQL Editor
-- ========================================================

CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Gear Up for a',
  title_gradient VARCHAR(255) DEFAULT 'Healthier You',
  subtitle TEXT DEFAULT 'Premium Sports & Fitness Equipment for Every Age and Every Goal',
  badge_text VARCHAR(100) DEFAULT 'Fitness • Sports • Wellness',
  cta_text VARCHAR(100) DEFAULT 'Shop Now',
  cta_link VARCHAR(255) DEFAULT '/products',
  
  -- Mandatory Dual Image URLs
  desktop_image TEXT NOT NULL,  -- 16:9 Landscape Banner (1920x1080)
  mobile_image TEXT NOT NULL,   -- 9:16 Portrait Poster (1080x1920)
  
  alt_text VARCHAR(255) DEFAULT 'M.art Sports & Fitness Banner',
  object_position VARCHAR(100) DEFAULT 'object-center',
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read of active hero slides for the storefront
CREATE POLICY "Allow public read hero slides"
  ON hero_slides FOR SELECT
  USING (true);

-- 2. Allow full CRUD operations for admin management
CREATE POLICY "Allow admin manage hero slides"
  ON hero_slides FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed initial slides with existing high-res assets
INSERT INTO hero_slides (
  title, 
  title_gradient, 
  subtitle, 
  badge_text, 
  cta_text, 
  cta_link, 
  desktop_image, 
  mobile_image, 
  alt_text, 
  object_position, 
  display_order, 
  is_active
)
VALUES
(
  'Gear Up for a',
  'Healthier You',
  'Premium Sports & Fitness Equipment for Every Age and Every Goal',
  'Fitness • Sports • Wellness',
  'Shop Now',
  '/products',
  '/Hero-16-9.jpg',
  '/Hero-mobile-9-16.jpg',
  'M.art Sports & Fitness Equipment',
  'object-[86%_5%]',
  1,
  true
),
(
  'Gear Up for a',
  'Healthier You',
  'Premium Sports & Fitness Equipment for Every Age and Every Goal',
  'Fitness • Sports • Wellness',
  'Shop Now',
  '/products',
  '/slide 2.jpeg',
  '/slide 2 mobile.jpeg',
  'Premium Gym and Training Gear',
  'object-center',
  2,
  true
),
(
  'Gear Up for a',
  'Healthier You',
  'Premium Sports & Fitness Equipment for Every Age and Every Goal',
  'Fitness • Sports • Wellness',
  'Shop Now',
  '/products',
  '/slide 3.jpeg',
  '/slide 3 mobile.jpeg',
  'Athletic Wellness and Sports Accessories',
  'object-center',
  3,
  true
);
