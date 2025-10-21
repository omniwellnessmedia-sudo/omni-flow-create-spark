-- Phase 2: Create Products and Enhanced Orders Tables

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_zar NUMERIC(10,2) NOT NULL,
  price_wellcoins INTEGER NOT NULL,
  category TEXT NOT NULL,
  provider TEXT NOT NULL,
  duration TEXT,
  type TEXT NOT NULL CHECK (type IN ('service', 'product', 'package', 'retreat', 'digital')),
  stock INTEGER,
  image_url TEXT,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Deals Table
CREATE TABLE IF NOT EXISTS public.product_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  original_price NUMERIC(10,2) NOT NULL,
  deal_price NUMERIC(10,2) NOT NULL,
  discount_percent INTEGER,
  valid_until TIMESTAMP WITH TIME ZONE,
  available_spots INTEGER,
  claimed_spots INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance existing Orders Table (add new columns if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'items') THEN
    ALTER TABLE public.orders ADD COLUMN items JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal_zar') THEN
    ALTER TABLE public.orders ADD COLUMN subtotal_zar NUMERIC(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tax_zar') THEN
    ALTER TABLE public.orders ADD COLUMN tax_zar NUMERIC(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_zar') THEN
    ALTER TABLE public.orders ADD COLUMN total_zar NUMERIC(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'paypal_payer_id') THEN
    ALTER TABLE public.orders ADD COLUMN paypal_payer_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
    ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'paypal';
  END IF;
END $$;

-- Order Items Table (normalized)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_zar NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_provider ON public.products(provider);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_deals_active ON public.product_deals(is_active);
CREATE INDEX IF NOT EXISTS idx_product_deals_product ON public.product_deals(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Products
CREATE POLICY "Products are viewable by everyone" ON public.products 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage products" ON public.products 
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for Product Deals
CREATE POLICY "Deals are viewable by everyone" ON public.product_deals 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage deals" ON public.product_deals 
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for Order Items
CREATE POLICY "Users can view their order items" ON public.order_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "System can insert order items" ON public.order_items 
  FOR INSERT WITH CHECK (true);

-- Phase 3: Seed 50+ Products
INSERT INTO public.products (name, description, price_zar, price_wellcoins, category, provider, duration, type, image_url, is_active) VALUES
-- Sandy Mitchell - Yoga Services (8 products)
('Dru Yoga Class - Stonehurst', '60-minute transformative yoga session with Sandy Mitchell at Stonehurst (Fridays 9:00 AM)', 120, 16, 'yoga-services', 'sandy', '60 min', 'service', 'sandy.yoga', true),
('Dru Yoga Class - Observatory', '60-minute transformative yoga session with Sandy Mitchell at Observatory (Thursdays 5:45 PM)', 120, 16, 'yoga-services', 'sandy', '60 min', 'service', 'sandy.yoga', true),
('Dru Backcare Course', '5-10 week course focusing on back health and pain relief', 600, 79, 'yoga-services', 'sandy', '5-10 weeks', 'service', 'sandy.yoga', true),
('Buteyko Breathing Private Session', '4-5 breathwork sessions for improved breathing with handouts, MP3s and WhatsApp support', 350, 46, 'yoga-services', 'sandy', '60 min', 'service', 'sandy.meditation', true),
('Dru Mental Wellness Course', '5-week course for mental health and wellness', 600, 79, 'yoga-services', 'sandy', '5 weeks', 'service', 'sandy.wellness', true),
('Free Discovery Call', '15-minute consultation to discuss your wellness journey', 0, 0, 'consultations', 'sandy', '15 min', 'service', 'sandy.consultation', true),
('Monthly Workshop', '90-minute intensive wellness workshop', 250, 33, 'yoga-services', 'sandy', '90 min', 'service', 'sandy.workshop', true),
('Monthly Unlimited Yoga', 'Unlimited yoga classes plus 1 private session, online access, and workshop discounts', 1890, 248, 'yoga-services', 'sandy', '1 month', 'package', 'sandy.hero', true),
('Beginner''s Journey', '8-week comprehensive program with sessions, Healthy Back Programme, breathing training, consultation, and resources', 2200, 288, 'yoga-services', 'sandy', '8 weeks', 'package', 'sandy.teaching', true),

-- 2BeWell - Consultation Services (5 products)
('Personalized Wellness Consultation', '60-minute personalized wellness planning session', 350, 46, 'consultations', '2bewell', '60 min', 'service', 'services.consultation', true),
('Organic Skincare Starter Kit + Consultation', '45-minute consultation with organic skincare starter kit delivered', 1200, 156, 'consultations', '2bewell', '45 min', 'package', 'products.product1', true),
('Mindful Living Essentials Package', '30-minute consultation with mindful living essentials kit', 850, 111, 'consultations', '2bewell', '30 min', 'package', 'products.product2', true),
('Natural Health Supplement Consultation', '75-minute consultation on natural supplements', 650, 85, 'consultations', '2bewell', '75 min', 'service', 'products.product1', true),
('Sustainable Wellness Lifestyle Kit', '30-minute consultation with sustainable wellness kit', 950, 124, 'consultations', '2bewell', '30 min', 'package', 'products.allPurpose', true),

-- 2BeWell - Service Packages (2 products)
('Complete Wellness Transformation', '3-month complete wellness transformation program with consultations, kits, supplements, and ongoing support', 4500, 585, 'consultations', '2bewell', '3 months', 'package', 'products.logo', true),
('Monthly Curated Wellness Box', 'Monthly subscription box with 4-6 premium products, guides, seasonal tips, and member discounts', 750, 98, 'consultations', '2bewell', 'Monthly', 'package', 'products.product2', true),

-- 2BeWell - Physical Products (15 products)
('2BeKissed Mint Lip Balm', 'Organic mint-flavored lip balm (4.5ml)', 85, 42, 'products', '2bewell', null, 'product', 'products.product1', true),
('2BeKissed Lip Balm 3-Pack', 'Value pack of 3 organic lip balms (4.5ml each)', 220, 110, 'products', '2bewell', null, 'product', 'products.product1', true),
('2BeGlow Radiance Face Serum', 'Natural radiance-boosting face serum (30ml)', 165, 82, 'products', '2bewell', null, 'product', 'products.product2', true),
('2BeGlow Face Serum Value', 'Large value size face serum (60ml)', 290, 145, 'products', '2bewell', null, 'product', 'products.product2', true),
('2BeSmooth Vanilla Body Butter', 'Luxurious vanilla-scented body butter (200ml)', 125, 62, 'products', '2bewell', null, 'product', 'products.allPurpose', true),
('2BeSmooth Lavender Body Butter', 'Calming lavender body butter (200ml)', 125, 62, 'products', '2bewell', null, 'product', 'products.allPurpose', true),
('2BeSmooth Unscented Body Butter', 'Pure unscented body butter for sensitive skin (200ml)', 115, 57, 'products', '2bewell', null, 'product', 'products.allPurpose', true),
('2BeCalm Ashwagandha Capsules', 'Natural stress-relief supplement (60 capsules)', 320, 160, 'products', '2bewell', null, 'product', 'products.product1', true),
('2BeCalm Ashwagandha 3-Month', 'Economy 3-month supply (180 capsules)', 850, 425, 'products', '2bewell', null, 'product', 'products.product1', true),
('2BeFresh Citrus All-Purpose Cleaner', 'Eco-friendly citrus-scented cleaner (500ml)', 95, 47, 'products', '2bewell', null, 'product', 'products.allPurpose', true),
('2BeFresh Lavender Cleaner', 'Natural lavender-scented cleaner (500ml)', 98, 49, 'products', '2bewell', null, 'product', 'products.allPurpose', true),
('2BeFresh Unscented Cleaner', 'Fragrance-free natural cleaner (500ml)', 89, 44, 'products', '2bewell', null, 'product', 'products.allPurpose', true),
('2BeRadiant Jade Roller & Gua Sha Set', 'Premium jade facial massage tool set', 185, 92, 'products', '2bewell', null, 'product', 'products.product2', true),
('2BeRadiant Rose Quartz Set', 'Rose quartz facial massage tool set', 195, 97, 'products', '2bewell', null, 'product', 'products.product2', true),
('Starter Gift Set', 'Perfect introduction gift set: lip balm, face serum (15ml), and body butter (100ml)', 199, 99, 'products', '2bewell', null, 'product', 'products.product1', true),
('Deluxe Gift Set', 'Premium gift set with 5 full-size products', 350, 175, 'products', '2bewell', null, 'product', 'products.product2', true),

-- 2BeWell - Digital Products (2 products)
('2BeWise Complete Wellness E-Book Bundle', 'Collection of 5 comprehensive wellness e-books (PDF format)', 149, 74, 'products', '2bewell', null, 'digital', 'products.logo', true),
('Natural Skincare Recipes', 'DIY natural skincare recipe guide (PDF)', 45, 22, 'products', '2bewell', null, 'digital', 'products.logo', true),

-- Chief Kingsley - Traditional Services (7 products)
('Traditional Healing Consultation', '90-minute traditional healing consultation', 450, 59, 'consultations', 'chief', '90 min', 'service', 'community.khoe1', true),
('Full Day Cultural Immersion', '8-hour cultural immersion experience in Eastern Cape village', 1200, 156, 'tours', 'chief', '8 hours', 'service', 'community.khoe2', true),
('Ancestral Wisdom & Modern Wellness Workshop', '150-minute workshop blending traditional and modern wellness', 650, 85, 'consultations', 'chief', '150 min', 'service', 'community.khoe3', true),
('Sacred Plant Medicine Education', '120-minute education on traditional plant medicine', 550, 72, 'consultations', 'chief', '120 min', 'service', 'community.khoe4', true),
('Traditional Drumming & Sacred Music', '120-minute traditional drumming and music session', 380, 49, 'consultations', 'chief', '120 min', 'service', 'community.khoe5', true),
('Complete Cultural Healing Journey', '7-day immersive cultural healing experience with all meals and accommodation', 8500, 1105, 'tours', 'chief', '7 days', 'retreat', 'community.empowerment1', true),
('Monthly Traditional Wellness', 'Monthly traditional wellness program with consultations, workshops, and ceremonies', 1800, 234, 'consultations', 'chief', '1 month', 'package', 'community.khoe1', true),

-- Chad Cupido - Business Services (7 products)
('Strategic Business Development Consultation', '120-minute strategic business planning session', 2500, 325, 'consultations', 'chad', '120 min', 'service', 'services.team', true),
('Digital Transformation Strategy', '3-month digital transformation program', 18500, 2400, 'consultations', 'chad', '3 months', 'package', 'services.team', true),
('Wellness Business Accelerator', '6-week intensive business accelerator program', 8500, 1105, 'consultations', 'chad', '6 weeks', 'package', 'services.team', true),
('Startup Mentorship & Support', 'Monthly ongoing startup mentorship', 3500, 455, 'consultations', 'chad', '1 month', 'service', 'services.team', true),
('Market Research & Analysis', 'Comprehensive market research and analysis service', 4500, 585, 'consultations', 'chad', '60 min', 'service', 'services.team', true),
('Complete Business Transformation', '6-month complete business transformation with strategy, mentorship, and implementation (Save 25%)', 35000, 4550, 'consultations', 'chad', '6 months', 'package', 'services.team', true),
('Startup Success Bundle', '3-month startup success program with mentorship and investor prep (Save 20%)', 15000, 1950, 'consultations', 'chad', '3 months', 'package', 'services.team', true),

-- Tours & Retreats (5 products)
('Conscious Connections: Indigenous Healing', '8-day transformative retreat in Eastern Cape focusing on indigenous healing practices', 3999, 3200, 'tours', 'tours', '8 days', 'retreat', 'services.retreat1', true),
('Table Mountain Wellness Retreat', '3-day wellness retreat in Cape Town with Table Mountain experiences', 2499, 2000, 'tours', 'tours', '3 days', 'retreat', 'locations.view1', true),
('Ubuntu Immersion Journey', '10-day deep immersion into Ubuntu philosophy in Eastern Cape', 4599, 3700, 'tours', 'tours', '10 days', 'retreat', 'community.empowerment2', true),
('FACT Wellness Hybrid Experience', '7-day hybrid wellness experience in Muizenberg', 1299, 1050, 'tours', 'tours', '7 days', 'retreat', 'locations.coastal', true),
('Sustainable Living Immersion', '5-day sustainable living workshop in Stellenbosch', 1899, 1520, 'tours', 'tours', '5 days', 'retreat', 'locations.capeTown1', true);

-- Phase 4: Seed Deals Data
INSERT INTO public.product_deals (product_id, original_price, deal_price, discount_percent, valid_until, available_spots, claimed_spots, is_active)
SELECT id, 1890, 1134, 40, NOW() + INTERVAL '2 days', 25, 12, true
FROM public.products WHERE name = 'Monthly Unlimited Yoga';

INSERT INTO public.product_deals (product_id, original_price, deal_price, discount_percent, valid_until, available_spots, claimed_spots, is_active)
SELECT id, 2499, 1749, 30, NOW() + INTERVAL '30 days', 12, 7, true
FROM public.products WHERE name = 'Table Mountain Wellness Retreat';

INSERT INTO public.product_deals (product_id, original_price, deal_price, discount_percent, valid_until, available_spots, claimed_spots, is_active)
SELECT id, 199, 141, 29, NOW() + INTERVAL '14 days', 50, 23, true
FROM public.products WHERE name = 'Starter Gift Set';

INSERT INTO public.product_deals (product_id, original_price, deal_price, discount_percent, valid_until, available_spots, claimed_spots, is_active)
SELECT id, 4500, 3150, 30, NOW() + INTERVAL '7 days', 10, 4, true
FROM public.products WHERE name = 'Complete Wellness Transformation';

INSERT INTO public.product_deals (product_id, original_price, deal_price, discount_percent, valid_until, available_spots, claimed_spots, is_active)
SELECT id, 8500, 6375, 25, NOW() + INTERVAL '21 days', 8, 3, true
FROM public.products WHERE name = 'Complete Cultural Healing Journey';

INSERT INTO public.product_deals (product_id, original_price, deal_price, discount_percent, valid_until, available_spots, claimed_spots, is_active)
SELECT id, 850, 595, 30, NOW() + INTERVAL '10 days', 30, 15, true
FROM public.products WHERE name = '2BeCalm Ashwagandha 3-Month';