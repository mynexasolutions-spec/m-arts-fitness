-- ==========================================
-- 1. Create the products table
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  "shortDescription" TEXT,
  description TEXT,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  "infographicImages" JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  "categoryLabel" TEXT,
  badge TEXT,
  "isBestSeller" BOOLEAN DEFAULT false,
  rating NUMERIC(3, 1) DEFAULT 0,
  "reviewsCount" INTEGER DEFAULT 0,
  price NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  sku TEXT,
  "inStock" BOOLEAN DEFAULT true,
  "packInfo" TEXT,
  "optionsLabel" TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  "keyFeatures" JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '[]'::jsonb,
  "dimensionsSummary" JSONB DEFAULT '{}'::jsonb,
  "idealFor" JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. Policy: Allow anyone (anon / public) to read products
-- ==========================================
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products"
ON products
FOR SELECT
TO public
USING (true);

-- ==========================================
-- 4. Insert Initial Products
-- ==========================================
INSERT INTO products (
  id, name, tagline, "shortDescription", description, image, gallery, "infographicImages", category, "categoryLabel", badge, "isBestSeller", rating, "reviewsCount", price, "originalPrice", sku, "inStock", "packInfo", "optionsLabel", options, highlights, "keyFeatures", specifications, "dimensionsSummary", "idealFor"
) VALUES
  ('wooden-dumbbells', 'Wooden Dumbbells', 'Set of 2 • Ergonomic & Floor-Friendly', 'Durable, floor-friendly and handcrafted workout pair designed for daily home workouts, strength training, and traditional conditioning.', 'Engineered for natural grip comfort and everyday durability, M.art''s Dumbbell Pair gives you balanced weight distribution for wrist conditioning, shoulder mobility, and progressive home strength training. Includes both natural wooden finish and vinyl-coated variant options for sweat-resistant, floor-safe performance.', '/wooden-dumbells.jpg', '["/wooden-dumbells.jpg","/dumbbells-info-1.jpg","/dumbbells-info-2.jpg"]'::jsonb, '["/dumbbells-info-1.jpg","/dumbbells-info-2.jpg"]'::jsonb, 'gym', 'Gym Equipment', 'Best Seller', TRUE, 4.8, 120, 499, 899, 'MART-DB-001', TRUE, 'Set of 2 Dumbbells', 'Available Weights (Each)', '["0.5 kg","1 kg","1.5 kg","2 kg","3 kg","5 kg"]'::jsonb, '[{"title":"Builds Strength","subtitle":"Tones arms, shoulders & upper body","icon":"strength"},{"title":"Durable Coating","subtitle":"Sweat-resistant & long-lasting finish","icon":"layers"},{"title":"Non-Slip Grip","subtitle":"Ergonomic contoured comfort handle","icon":"grip"},{"title":"Floor-Safe Build","subtitle":"Scratch-free & rust-resistant design","icon":"shield"}]'::jsonb, '["Balanced twin-head weight distribution for stable lifting & swings","Ergonomic non-slip comfort grip reduces palm fatigue during high reps","Floor-friendly smooth exterior prevents tile and wooden floor scuffs","Sweat-resistant, wipe-clean surface built for daily indoor & outdoor use","Compact profile stores easily on racks, shelves, or under workout benches"]'::jsonb, '[{"label":"Length","value":"~ 18–20 cm","detail":"Compact balanced shaft"},{"label":"Head Diameter","value":"~ 5–6 cm","detail":"Anti-roll end profile"},{"label":"Pack Contents","value":"Set of 2","detail":"Matched weight pair"},{"label":"Material","value":"Seasoned Hardwood / Vinyl Coat","detail":"Rust & crack resistant"},{"label":"Grip Type","value":"Contoured Anti-Slip","detail":"Comfort ergonomic barrel"},{"label":"Weight Options","value":"0.5 kg to 5 kg","detail":"Per dumbbell"}]'::jsonb, '{"primaryLabel":"Total Length","primaryValue":"~ 18–20 cm","secondaryLabel":"End Diameter","secondaryValue":"~ 5–6 cm","extraLabel":"Pack Size","extraValue":"Set of 2 Pair"}'::jsonb, '[{"title":"Home Workouts","description":"Daily full-body toning in compact spaces","icon":"home"},{"title":"Strength Training","description":"Bicep curls, presses, lunges & rows","icon":"dumbbell"},{"title":"Yoga & Fitness","description":"Light resistance for aerobics & mobility","icon":"yoga"},{"title":"Weight Management","description":"High-rep calorie burn & endurance sets","icon":"scale"}]'::jsonb),
  ('training-cones', 'Training Cones Set', 'Pack of 50 • Flexible & Unbreakable', 'Durable, flexible and highly visible disc cones for sports training, agility drills, and field boundary marking.', 'Take your footwork, speed drills, and field coaching to the next level with M.art''s Pack of 50 Training Cones. Molded from high-flexibility LDPE thermoplastic, these low-profile disc cones bounce right back into shape even when stepped on or kicked during intense football, cricket, and basketball practice.', '/Training-cones.jpg', '["/Training-cones.jpg","/training-cones-info.jpg"]'::jsonb, '["/training-cones-info.jpg"]'::jsonb, 'agility', 'Agility Tools', '33% OFF', TRUE, 4.7, 95, 799, 1199, 'MART-TC-050', TRUE, 'Pack of 50 Cones + Carry Stand', 'Color Options Included', '["Bright Yellow","Fiery Red","Electric Blue","Multi-Color Pack of 50"]'::jsonb, '[{"title":"Durable & Long-Lasting","subtitle":"All-weather UV-protected plastic","icon":"shield"},{"title":"Lightweight & Portable","subtitle":"Stacks neatly on central carry stand","icon":"feather"},{"title":"Flexible & Unbreakable","subtitle":"Crush-proof LDPE bounces back instantly","icon":"layers"},{"title":"Bright High Visibility","subtitle":"Easy to spot on turf, grass & courts","icon":"eye"}]'::jsonb, '["Pack of 50 high-visibility disc cones for large team & academy drills","Flexible & unbreakable crack-resistant material safe for cleats & shoes","Low-profile 5 cm aerodynamic height prevents wind tipping on open grounds","Wide 19 cm stable base with 5 cm center hole for vertical stack holder","Multi-sport versatility for turf, grass, synthetic courts, and indoor halls"]'::jsonb, '[{"label":"Base Diameter","value":"19 cm","detail":"Wide wind-stable footprint"},{"label":"Cone Height","value":"5 cm","detail":"Low-profile trip-safe height"},{"label":"Inner Hole Diameter","value":"5 cm","detail":"Fits stackable carry pole"},{"label":"Pack Quantity","value":"50 Cones","detail":"Includes mesh bag & holder"},{"label":"Material","value":"Flexible Virgin LDPE","detail":"Crack & crush resistant"},{"label":"Color Options","value":"Yellow, Red, Blue","detail":"UV-bright neon pigments"}]'::jsonb, '{"primaryLabel":"Base Diameter","primaryValue":"19 cm","secondaryLabel":"Cone Height","secondaryValue":"5 cm","extraLabel":"Inner Hole","extraValue":"5 cm Diameter"}'::jsonb, '[{"title":"Football Training","description":"Dribbling gates, passing lanes & small-sided pitches","icon":"football"},{"title":"Basketball Drills","description":"Defensive slides, court markers & handling","icon":"agility"},{"title":"Agility & Speed","description":"Shuttle runs, directional cuts & sprint intervals","icon":"speed"},{"title":"School & Sports","description":"PE classes, obstacle courses & academy coaching","icon":"school"}]'::jsonb),
  ('skipping-rope', 'Pro Skipping Rope', 'Adjustable & Durable • Tangle-Free PVC', 'A perfect fitness tool for high-speed cardio, weight loss, footwork coordination, and overall stamina building.', 'Engineered for smooth, rapid rotation without kinking or tangling, the M.art Pro Skipping Rope features a high-density solid PVC cord paired with ergonomic anti-slip grooved handles. Easily customize the rope length in seconds to match any user height from beginners to pro boxers.', '/Skipping-rope.jpg', '["/Skipping-rope.jpg","/skipping-rope-info.jpg"]'::jsonb, '["/skipping-rope-info.jpg"]'::jsonb, 'training', 'Training Gear', '20% OFF', FALSE, 4.6, 72, 399, 499, 'MART-SR-204', TRUE, '1 Adjustable Pro Jump Rope', 'Length Adjustment', '["Up to 9.5 ft (Adjustable for All Heights)"]'::jsonb, '[{"title":"Boosts Cardio Fitness","subtitle":"Elevates heart rate & lung capacity fast","icon":"heart"},{"title":"Burns Calories","subtitle":"High-efficiency HIIT fat-burning tool","icon":"flame"},{"title":"Builds Stamina","subtitle":"Improves footwork speed & endurance","icon":"strength"},{"title":"Supports Weight Loss","subtitle":"Full-body metabolic conditioning","icon":"scale"}]'::jsonb, '["Adjustable rope length mechanism suitable for adults and athletes of all heights","Tangle-free solid PVC cord ensures smooth, high-speed 360° rotation","Anti-slip grooved grip handles offer firm control even with sweaty palms","Lightweight & pocket-portable — carry it to the gym, park, or travel bag","Abrasion-resistant durable cord built for concrete, wood, and gym mat surfaces"]'::jsonb, '[{"label":"Rope Length","value":"280 cm (9.2 ft)","detail":"Fully adjustable clip lock"},{"label":"Cord Material","value":"High-Density PVC","detail":"Tangle-free 5mm cord"},{"label":"Handle Design","value":"Ring-Grooved Matte Polymer","detail":"Anti-slip ergonomic grip"},{"label":"Handle Length","value":"13.5 cm","detail":"Balanced palm control"},{"label":"Net Weight","value":"~ 160 g","detail":"Fast wrist feedback"},{"label":"Rotation System","value":"Low-Friction Collar","detail":"Smooth continuous swing"}]'::jsonb, '{"primaryLabel":"Max Cord Length","primaryValue":"280 cm (Adjustable)","secondaryLabel":"Cord Thickness","secondaryValue":"5 mm PVC","extraLabel":"Handle Length","extraValue":"13.5 cm Anti-Slip"}'::jsonb, '[{"title":"Home Workouts","description":"Zero-setup daily cardio in living rooms or balconies","icon":"home"},{"title":"Fitness Training","description":"Warm-ups, HIIT circuits, boxing & CrossFit double-unders","icon":"cardio"},{"title":"Weight Management","description":"Burns up to 15 calories per minute of active jumping","icon":"scale"},{"title":"Agility & Stamina","description":"Sharpens ankle resilience, rhythm, and coordination","icon":"speed"}]'::jsonb),
  ('yoga-mat', 'Premium Yoga Mat', 'Comfort • Grip • Durability (6 mm Thick)', 'A perfect high-density cushioned mat for yoga, floor workouts, stretching, pilates, and everyday fitness.', 'Experience superior joint protection and rock-solid stability with the M.art Premium 6 mm Yoga Mat. Crafted from eco-friendly, high-density EVA/TPE foam with a micro-ribbed textured surface, it prevents slipping during intense vinyasa flows, planks, and sweaty core sessions. Comes complete with a free carry strap.', '/Yoga-mat.jpg', '["/Yoga-mat.jpg","/yoga-mat-info.jpg"]'::jsonb, '["/yoga-mat-info.jpg"]'::jsonb, 'yoga', 'Yoga & Wellness', 'Best Seller', TRUE, 4.8, 145, 749, 999, 'MART-YM-6MM', TRUE, '1 Yoga Mat + Free Carry Strap', 'Available Colors', '["Royal Blue","Charcoal Black","Deep Purple","Teal Green"]'::jsonb, '[{"title":"High-Density Cushion","subtitle":"6 mm shock-absorbing joint protection","icon":"layers"},{"title":"Anti-Slip Texture","subtitle":"Double-sided grip stays firm on floors","icon":"grip"},{"title":"Sweat & Water Resistant","subtitle":"Closed-cell surface blocks moisture & odor","icon":"droplet"},{"title":"Lightweight & Portable","subtitle":"800 g roll-up design with carry strap","icon":"feather"}]'::jsonb, '["6 mm optimal cushioning protects knees, elbows, and spine on hard floors","Textured anti-slip bubble & ridge surface ensures firm traction in every pose","Flexible & tear-resistant construction withstands daily stretching and shoe workouts","Sweat and water-resistant closed-cell foam cleans easily with a damp cloth","Includes detachable dual-loop carry strap for effortless commute to studio or park"]'::jsonb, '[{"label":"Length","value":"183 cm (72 inch)","detail":"Full-body tall coverage"},{"label":"Width","value":"61 cm (24 inch)","detail":"Generous shoulder span"},{"label":"Thickness","value":"6 mm","detail":"High-density cushioning"},{"label":"Material","value":"Premium Eco EVA / TPE","detail":"Non-toxic & latex-free"},{"label":"Net Weight","value":"~ 800 g","detail":"Ultra-portable with strap"},{"label":"Surface Pattern","value":"Textured Anti-Slip","detail":"Moisture-repellent grip"}]'::jsonb, '{"primaryLabel":"Dimensions","primaryValue":"183 cm × 61 cm","secondaryLabel":"Thickness","secondaryValue":"6 mm Cushion","extraLabel":"Weight","extraValue":"~ 800 g"}'::jsonb, '[{"title":"Yoga & Pranayama","description":"Asanas, Surya Namaskar, meditation & floor balance","icon":"yoga"},{"title":"Home Workouts","description":"Push-ups, planks, crunches & bodyweight circuits","icon":"home"},{"title":"Stretching & Mobility","description":"Post-run cooldowns, foam rolling & flexibility","icon":"rehab"},{"title":"Fitness Training","description":"Pilates, core conditioning & studio group classes","icon":"dumbbell"}]'::jsonb),
  ('hex-dumbbells-5kg', 'Rubber Hex Dumbbells', 'Pair of 5 kg • Commercial Knurled Steel Handle', 'Heavy-duty virgin rubber-encased hexagonal dumbbells built for zero floor rolling and commercial strength training.', 'Built to commercial gym standards, M.art Rubber Hex Dumbbells feature solid cast-iron heads encased in thick virgin rubber to reduce noise, protect flooring, and prevent rolling between sets. The chrome-plated ergonomic steel handle features precision diamond knurling for a locked-in grip.', '/Gym-Equipment.jpg', '["/Gym-Equipment.jpg"]'::jsonb, '[]'::jsonb, 'gym', 'Gym Equipment', 'Best Seller', TRUE, 4.9, 210, 1499, 2199, 'MART-HEX-05K', TRUE, 'Set of 2 (5 kg × 2 = 10 kg Total)', 'Available Weight Pairs', '["2.5 kg Pair","5 kg Pair","7.5 kg Pair","10 kg Pair","12.5 kg Pair","15 kg Pair"]'::jsonb, '[{"title":"Anti-Roll Hex Head","subtitle":"6-sided flat edges stay put on floors","icon":"grid"},{"title":"Virgin Rubber Coat","subtitle":"Low-odor, shock-absorbing armor","icon":"shield"},{"title":"Chrome Knurled Grip","subtitle":"Solid steel handle prevents slipping","icon":"grip"},{"title":"Commercial Grade","subtitle":"Friction-welded head-to-shaft bond","icon":"strength"}]'::jsonb, '["Hexagonal anti-roll heads ideal for renegade rows and floor push-ups","Thick virgin rubber casing absorbs impact and protects home tiles","Ergonomic 28 mm solid steel chrome handle with medium diamond knurling","Precision weight tolerance within ±2% for balanced progressive overload","Rust-proof, weather-resistant finish built for decades of heavy lifting"]'::jsonb, '[{"label":"Total Length","value":"27.5 cm","detail":"Balanced commercial profile"},{"label":"Hex Head Width","value":"11.5 cm","detail":"6-sided anti-roll flats"},{"label":"Handle Length","value":"13 cm","detail":"28 mm ergonomic diameter"},{"label":"Core Material","value":"Solid Cast Iron + Steel","detail":"Virgin rubber encased"},{"label":"Weight in Box","value":"10 kg Total","detail":"2 × 5 kg Dumbbells"},{"label":"Finish","value":"Matte Black Rubber & Chrome","detail":"Corrosion-proof"}]'::jsonb, '{"primaryLabel":"Total Length","primaryValue":"27.5 cm","secondaryLabel":"Hex Diameter","secondaryValue":"11.5 cm","extraLabel":"Grip Shaft","extraValue":"13 cm Knurled"}'::jsonb, '[{"title":"Strength Training","description":"Bench press, shoulder press, rows & goblet squats","icon":"dumbbell"},{"title":"Home Gym Setup","description":"Quiet, floor-safe lifting in apartments & garages","icon":"home"},{"title":"Core & HIIT","description":"Renegade rows, thrusters, devil presses & lunges","icon":"core"},{"title":"Muscle Hypertrophy","description":"Progressive overload for upper & lower body","icon":"scale"}]'::jsonb),
  ('agility-ladder-pro', 'Speed Agility Ladder', '6 Meter • 12 Adjustable Heavy-Duty Rungs', 'Pro-grade flat-rung speed training ladder with carry bag for explosive footwork, coordination, and athletic quickness.', 'Unlock faster foot speed, sharper lateral cuts, and superior neuromuscular coordination with the M.art 6-Meter Speed Agility Ladder. Constructed with shatterproof PP flat rungs threaded onto braided nylon straps, you can customize rung spacing for short quick-steps or wide explosive bounds.', '/Agility-tools.jpg', '["/Agility-tools.jpg"]'::jsonb, '[]'::jsonb, 'agility', 'Agility Tools', '35% OFF', FALSE, 4.7, 88, 649, 999, 'MART-AL-12R', TRUE, '6m 12-Rung Ladder + Carry Bag + 4 Ground Pegs', 'Ladder Size', '["4 Meter (8 Rungs)","6 Meter (12 Rungs)","8 Meter (16 Rungs)"]'::jsonb, '[{"title":"Explosive Foot Speed","subtitle":"Sharpens stride frequency & reflexes","icon":"bolt"},{"title":"Unbreakable Rungs","subtitle":"High-impact flexible PP flat slats","icon":"layers"},{"title":"Adjustable Spacing","subtitle":"Slide rungs along nylon straps easily","icon":"grid"},{"title":"Instant Setup Bag","subtitle":"Tangle-free roll-out with steel pegs","icon":"feather"}]'::jsonb, '["12 heavy-duty flat plastic rungs engineered to lie flush against turf or courts","Fully adjustable rung distance up to 6 meters on weatherproof nylon webbing","Includes 4 steel ground stakes to anchor the ladder firmly on grass fields","Snap-buckle ends allow connecting two ladders together for extended 12m drills","Comes with a breathable drawstring carry bag for effortless field transport"]'::jsonb, '[{"label":"Total Length","value":"6 Meters (20 ft)","detail":"End-to-end nylon strap"},{"label":"Rung Width","value":"50 cm","detail":"4 cm flat anti-trip profile"},{"label":"Number of Rungs","value":"12 Rungs","detail":"Slide-adjustable spacing"},{"label":"Material","value":"Shatterproof PP + Nylon","detail":"High-visibility yellow/black"},{"label":"Net Weight","value":"~ 650 g","detail":"Includes carry bag & 4 pegs"},{"label":"Surface Use","value":"Grass, Turf, Court, Concrete","detail":"Indoor & outdoor"}]'::jsonb, '{"primaryLabel":"Total Length","primaryValue":"600 cm (6 m)","secondaryLabel":"Rung Width","secondaryValue":"50 cm","extraLabel":"Rung Count","extraValue":"12 Flat Slats"}'::jsonb, '[{"title":"Football & Cricket","description":"Fast feet, lateral shuffles & wicket sprint bursts","icon":"football"},{"title":"Agility Drills","description":"Ickey shuffle, in-and-outs, hopscotch & crossovers","icon":"agility"},{"title":"Speed & Cardio","description":"High-knee metabolic conditioning & calorie burn","icon":"speed"},{"title":"School & Academies","description":"Youth athletic development & team warm-ups","icon":"school"}]'::jsonb),
  ('sports-training-ball', 'Multi-Sport Training Ball', 'All-Weather Durability • Precision Touch & Flight', 'High-rebound all-weather size 5 training ball designed for football practice, drills, and everyday recreational sports.', 'Engineered with aerodynamic textured casing and high-air-retention butyl bladder, the M.art Multi-Sport Training Ball delivers authentic match-grade flight, soft touch, and rugged durability on grass, turf, and hard outdoor ground.', '/Sports-gear.jpg', '["/Sports-gear.jpg"]'::jsonb, '[]'::jsonb, 'training', 'Training Gear', '25% OFF', FALSE, 4.7, 92, 549, 799, 'MART-BALL-05', TRUE, '1 x Size 5 Ball + Inflation Needle', 'Ball Size', '["Size 4 (Youth)","Size 5 (Official)"]'::jsonb, '[{"title":"Pinpoint Flight","subtitle":"Aerodynamic 32-panel precision geometry","icon":"bolt"},{"title":"All-Weather PU","subtitle":"Zero water absorption on wet fields","icon":"layers"},{"title":"Micro-Textured Grip","subtitle":"Superior boot and glove friction","icon":"grip"},{"title":"Air Retention","subtitle":"Reinforced butyl bladder holds pressure","icon":"shield"}]'::jsonb, '["Abrasion-resistant textured outer casing withstands rough turf and gravel","High-rebound EVA foam cushioning layer provides soft touch and control","Reinforced wound bladder delivers consistent bounce and true flight","Includes air pump inflation needle in the box for instant match readiness"]'::jsonb, '[{"label":"Size","value":"Official Size 5","detail":"Circumference 68-70 cm"},{"label":"Weight","value":"410 - 430 g","detail":"Official match standard"},{"label":"Casing","value":"Textured PU Leather","detail":"Thermal bonded seams"},{"label":"Bladder","value":"Reinforced Butyl","detail":"High air retention"}]'::jsonb, '{"primaryLabel":"Size","primaryValue":"Size 5","secondaryLabel":"Weight","secondaryValue":"420 g","extraLabel":"Circumference","extraValue":"69 cm"}'::jsonb, '[{"title":"Football Matches","description":"Official 11v11 match play, passing and shooting practice","icon":"football"},{"title":"Agility & Speed","description":"Dribbling cone mazes, sprint touches and reaction drills","icon":"agility"},{"title":"Youth Academies","description":"Skill development and coaching clinics","icon":"school"},{"title":"Weekend Games","description":"Turf and park friendlies with unmatched durability","icon":"speed"}]'::jsonb),
  ('gym-essentials-kit', 'Pro Gym Essentials Kit', '5-in-1 Complete Conditioning Bundle', 'All-in-one home workout kit including resistance bands, speed rope, push-up bars, and gym carry tote.', 'Level up your home fitness regimen with M.art''s Pro Gym Essentials Kit. Comes equipped with heavy-duty resistance loop bands, ultra-fast bearing jump rope, ergonomic non-slip push-up handles, and a durable ripstop gym sack. Everything you need for functional hypertrophy, cardio conditioning, and calisthenics.', '/GymEssentials.jpg', '["/GymEssentials.jpg"]'::jsonb, '[]'::jsonb, 'gym', 'Gym Equipment', 'Bundle Offer', TRUE, 4.9, 160, 1299, 1999, 'MART-KIT-05', TRUE, '5-Piece Complete Gym Set + Bag', 'Resistance Level', '["Standard (Light-Medium)","Pro (Heavy-Extra Heavy)"]'::jsonb, '[{"title":"Total Body Training","subtitle":"Targets arms, chest, core and legs","icon":"strength"},{"title":"Heavy-Duty Latex","subtitle":"Snap-resistant layered loop bands","icon":"layers"},{"title":"Ergonomic Handles","subtitle":"Padded push-up stands protect wrists","icon":"grid"},{"title":"Travel-Ready Tote","subtitle":"Pack everything and train anywhere","icon":"award"}]'::jsonb, '["Includes 3 progressive loop resistance bands (Light, Medium, Heavy)","High-speed 360-degree ball bearing jump rope with coated steel cable","Ergonomic angled push-up bars with slip-resistant foam grips","Water-resistant drawstring backpack for portable gym sessions"]'::jsonb, '[{"label":"Items Included","value":"5 Pieces","detail":"Bands, rope, bars & bag"},{"label":"Push-Up Bars","value":"Steel + Padded EVA","detail":"Supports up to 130 kg"},{"label":"Bands Material","value":"100% Natural Latex","detail":"Eco-friendly elasticity"},{"label":"Total Weight","value":"1.1 kg","detail":"Compact travel kit"}]'::jsonb, '{"primaryLabel":"Kit Contents","primaryValue":"5 Items","secondaryLabel":"Total Weight","secondaryValue":"1.1 kg","extraLabel":"Carry Bag","extraValue":"Included"}'::jsonb, '[{"title":"Home Workouts","description":"Full-body strength and conditioning in any room","icon":"home"},{"title":"Strength & Toning","description":"Progressive overload with resistance bands & push-ups","icon":"dumbbell"},{"title":"HIIT & Cardio","description":"High-cadence rope skipping intervals to burn fat","icon":"cardio"},{"title":"Core Stability","description":"Calisthenics, planks, and mountain climbers","icon":"core"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  "shortDescription" = EXCLUDED."shortDescription",
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  gallery = EXCLUDED.gallery,
  "infographicImages" = EXCLUDED."infographicImages",
  category = EXCLUDED.category,
  "categoryLabel" = EXCLUDED."categoryLabel",
  badge = EXCLUDED.badge,
  "isBestSeller" = EXCLUDED."isBestSeller",
  rating = EXCLUDED.rating,
  "reviewsCount" = EXCLUDED."reviewsCount",
  price = EXCLUDED.price,
  "originalPrice" = EXCLUDED."originalPrice",
  sku = EXCLUDED.sku,
  "inStock" = EXCLUDED."inStock",
  "packInfo" = EXCLUDED."packInfo",
  "optionsLabel" = EXCLUDED."optionsLabel",
  options = EXCLUDED.options,
  highlights = EXCLUDED.highlights,
  "keyFeatures" = EXCLUDED."keyFeatures",
  specifications = EXCLUDED.specifications,
  "dimensionsSummary" = EXCLUDED."dimensionsSummary",
  "idealFor" = EXCLUDED."idealFor";

-- ==========================================
-- 5. Create Orders Table
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  delivery_charge NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to orders" ON orders;
CREATE POLICY "Allow public insert to orders"
ON orders FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to read their own orders" ON orders;
CREATE POLICY "Allow users to read their own orders"
ON orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- ========================================================
-- 6. Disable Email Confirmation / Auto-Confirm All Users
-- ========================================================
-- 1. Confirm any existing unconfirmed users:
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Database Trigger to automatically confirm any future signup:
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_new_user();


