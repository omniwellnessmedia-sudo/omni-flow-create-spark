-- Affiliate tracking tables.
-- Exception-guarded in sections on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: orders and profiles were created
-- via the dashboard and may be absent on a fresh preview branch, and this
-- file used to halt the whole replay there, which also meant
-- affiliate_products (self-contained, needed by ten later migrations) was
-- never created. Sections that do not depend on missing objects run bare so
-- they always land; on production every object exists and every statement
-- runs exactly as before.

-- Affiliate clicks tracking (FK to profiles, so guarded)
DO $clicks_guard$
BEGIN
  CREATE TABLE affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_program_id TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    click_id TEXT UNIQUE NOT NULL,
    referrer_url TEXT,
    destination_url TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    country_code TEXT,
    device_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_affiliate_clicks_program ON affiliate_clicks(affiliate_program_id);
  CREATE INDEX idx_affiliate_clicks_created ON affiliate_clicks(created_at DESC);
  CREATE INDEX idx_affiliate_clicks_click_id ON affiliate_clicks(click_id);
  ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Anyone can insert clicks" ON affiliate_clicks
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Admins can view all clicks" ON affiliate_clicks
    FOR SELECT USING (is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping affiliate_clicks, missing dependency: %', SQLERRM;
END
$clicks_guard$;

-- Affiliate conversions/commissions (FKs to clicks, orders, profiles: guarded)
DO $commissions_guard$
BEGIN
  CREATE TABLE affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_program_id TEXT NOT NULL,
    click_id TEXT REFERENCES affiliate_clicks(click_id),
    order_id UUID REFERENCES orders(id),
    user_id UUID REFERENCES profiles(id),
    product_id TEXT,
    product_name TEXT,
    order_amount NUMERIC NOT NULL,
    commission_amount NUMERIC NOT NULL,
    commission_currency TEXT NOT NULL,
    commission_rate NUMERIC,
    status TEXT DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    payment_batch_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Add affiliate tracking to orders
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_click_id TEXT;
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_program_id TEXT;
  ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_commission_id UUID REFERENCES affiliate_commissions(id);

  CREATE INDEX idx_affiliate_commissions_program ON affiliate_commissions(affiliate_program_id);
  CREATE INDEX idx_affiliate_commissions_status ON affiliate_commissions(status);
  CREATE INDEX idx_affiliate_commissions_created ON affiliate_commissions(created_at DESC);
  CREATE INDEX idx_affiliate_commissions_order ON affiliate_commissions(order_id);
  ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Admins can view commissions" ON affiliate_commissions
    FOR SELECT USING (is_admin(auth.uid()));

  CREATE POLICY "Admins can manage commissions" ON affiliate_commissions
    FOR ALL USING (is_admin(auth.uid()));

  CREATE POLICY "System can insert commissions" ON affiliate_commissions
    FOR INSERT WITH CHECK (true);

  -- Trigger for updated_at
  CREATE TRIGGER update_affiliate_commissions_updated_at
    BEFORE UPDATE ON affiliate_commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping affiliate_commissions, missing dependency: %', SQLERRM;
END
$commissions_guard$;

-- Affiliate payout batches (self-contained, always lands)
CREATE TABLE affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  total_amount_usd NUMERIC DEFAULT 0,
  total_amount_eur NUMERIC DEFAULT 0,
  total_amount_zar NUMERIC DEFAULT 0,
  commission_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_gateway TEXT,
  payment_reference TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate products catalog (self-contained, always lands)
CREATE TABLE affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_program_id TEXT NOT NULL,
  external_product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_usd NUMERIC,
  price_zar NUMERIC,
  price_eur NUMERIC,
  commission_rate NUMERIC,
  category TEXT,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_program_id, external_product_id)
);

CREATE INDEX idx_affiliate_products_program ON affiliate_products(affiliate_program_id);
CREATE INDEX idx_affiliate_products_active ON affiliate_products(is_active) WHERE is_active = true;

ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active products" ON affiliate_products
  FOR SELECT USING (is_active = true);

-- Policies that need is_admin(), which an earlier skipped migration may not
-- have created on a preview branch.
DO $admin_policies_guard$
BEGIN
  CREATE POLICY "Admins can manage products" ON affiliate_products
    FOR ALL USING (is_admin(auth.uid()));

  CREATE POLICY "Admins can view payouts" ON affiliate_payouts
    FOR SELECT USING (is_admin(auth.uid()));

  CREATE POLICY "Admins can manage payouts" ON affiliate_payouts
    FOR ALL USING (is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping admin policies, missing dependency: %', SQLERRM;
END
$admin_policies_guard$;
