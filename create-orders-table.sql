-- ========================================================
-- 1. Create Orders Table in Supabase
-- ========================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  delivery_charge NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Confirmed',
  coupon_code TEXT,
  coupon_discount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- 2. Enable Row Level Security (RLS)
-- ========================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders from checkout
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders"
ON public.orders FOR INSERT TO public
WITH CHECK (true);

-- Allow authenticated users to view their own orders
DROP POLICY IF EXISTS "Allow users to read their own orders" ON public.orders;
CREATE POLICY "Allow users to read their own orders"
ON public.orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Allow service role full access (for Next.js API / backend)
DROP POLICY IF EXISTS "Allow service_role full access to orders" ON public.orders;
CREATE POLICY "Allow service_role full access to orders"
ON public.orders FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- ========================================================
-- 3. Insert Initial Dummy Orders (Rahul, Pooja, Amitabh)
-- ========================================================
INSERT INTO public.orders (
  order_id,
  customer_name,
  customer_email,
  customer_phone,
  shipping_address,
  payment_method,
  items,
  subtotal,
  total_amount,
  status,
  created_at
) VALUES 
(
  'MART-842190',
  'Rahul Verma',
  'rahul.verma@example.com',
  '9876543210',
  'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103',
  'UPI (rahul@oksbi)',
  '[{"id": "hex-dumbbells-5kg", "name": "Rubber Hex Dumbbells (5 kg Pair)", "price": 1499, "quantity": 2, "image": "/Gym-Equipment.jpg"}]'::jsonb,
  2998,
  2998,
  'Processing',
  '2026-10-31 10:00:00+00'
),
(
  'MART-791045',
  'Pooja Sharma',
  'pooja.s@example.com',
  '9823456789',
  'B-12, Sector 62, Noida, Uttar Pradesh - 201309',
  'Cash on Delivery',
  '[{"id": "yoga-mat", "name": "Premium Yoga Mat (6 mm)", "price": 749, "quantity": 1, "image": "/Yoga-mat.jpg"}, {"id": "skipping-rope", "name": "Pro Skipping Rope", "price": 399, "quantity": 1, "image": "/Skipping-rope.jpg"}]'::jsonb,
  1148,
  1148,
  'Shipped',
  '2026-10-29 14:30:00+00'
),
(
  'MART-630281',
  'Amitabh Sen',
  'amitabh.sen@example.com',
  '9748123456',
  'Plot 88, Salt Lake City, Sector 5, Kolkata, West Bengal - 700091',
  'Credit Card (Paid)',
  '[{"id": "gym-essentials-kit", "name": "Pro Gym Essentials Kit", "price": 1299, "quantity": 1, "image": "/GymEssentials.jpg"}]'::jsonb,
  1299,
  1299,
  'Delivered',
  '2026-10-27 18:15:00+00'
)
ON CONFLICT (order_id) DO NOTHING;
