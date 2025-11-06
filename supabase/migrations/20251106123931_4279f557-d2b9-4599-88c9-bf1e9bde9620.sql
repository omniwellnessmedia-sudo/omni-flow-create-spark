-- Add advertiser fields to affiliate_products table
ALTER TABLE affiliate_products 
ADD COLUMN IF NOT EXISTS advertiser_id text,
ADD COLUMN IF NOT EXISTS advertiser_name text,
ADD COLUMN IF NOT EXISTS brand_logo_url text,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trending boolean DEFAULT false;

-- Create brands table for better brand management
CREATE TABLE IF NOT EXISTS affiliate_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  website_url text,
  description text,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  product_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on affiliate_brands
ALTER TABLE affiliate_brands ENABLE ROW LEVEL SECURITY;

-- Anyone can view brands
CREATE POLICY "Anyone can view brands"
  ON affiliate_brands FOR SELECT
  TO public
  USING (true);

-- Admins can manage brands
CREATE POLICY "Admins can manage brands"
  ON affiliate_brands FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create index for faster brand lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_products_advertiser ON affiliate_products(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_featured ON affiliate_products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_affiliate_products_trending ON affiliate_products(is_trending) WHERE is_trending = true;

-- Create view tracking table for analytics
CREATE TABLE IF NOT EXISTS product_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES affiliate_products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  viewed_at timestamptz DEFAULT now(),
  referrer_url text,
  user_agent text
);

-- Enable RLS on product_views
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views
CREATE POLICY "Anyone can track views"
  ON product_views FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can see their own views
CREATE POLICY "Users can view their own views"
  ON product_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for view analytics
CREATE INDEX IF NOT EXISTS idx_product_views_product ON product_views(product_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_product_views_user ON product_views(user_id, viewed_at);