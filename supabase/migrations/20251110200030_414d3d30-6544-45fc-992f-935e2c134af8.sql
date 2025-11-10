-- Add new columns for rich product data to affiliate_products table

-- Text columns for product details
ALTER TABLE affiliate_products
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS gtin TEXT,
ADD COLUMN IF NOT EXISTS mpn TEXT;

-- Numeric columns for sale pricing
ALTER TABLE affiliate_products
ADD COLUMN IF NOT EXISTS sale_price_usd NUMERIC,
ADD COLUMN IF NOT EXISTS sale_price_zar NUMERIC,
ADD COLUMN IF NOT EXISTS sale_price_eur NUMERIC;

-- JSONB columns for complex/array data
ALTER TABLE affiliate_products
ADD COLUMN IF NOT EXISTS product_highlights JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS product_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS additional_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS google_category JSONB DEFAULT '{}'::jsonb;

-- Add index for better search performance on new text fields
CREATE INDEX IF NOT EXISTS idx_affiliate_products_brand ON affiliate_products(brand);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_condition ON affiliate_products(condition);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_availability ON affiliate_products(availability);

-- Add GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_highlights ON affiliate_products USING GIN(product_highlights);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_details ON affiliate_products USING GIN(product_details);