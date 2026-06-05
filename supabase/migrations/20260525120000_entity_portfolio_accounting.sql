-- =============================================================================
-- Multi-entity portfolio accounting
-- Adapted from the /admin/accounting scaffold to THIS repo's reality:
--   * Roles live in public.user_roles (app_role enum) + is_accountant_or_admin(),
--     NOT a profiles.role column. RLS below reuses is_accountant_or_admin.
--   * Real money tables/columns: bookings.amount_zar, tour_bookings.total_price,
--     orders.amount, affiliate_commissions.commission_amount.
--   * No donations table exists yet — omitted from the view. When it lands, add a
--     donations_agg CTE mirroring the others and a LEFT JOIN.
-- Every block is idempotent.
-- =============================================================================

-- 1. Entities registry — the master brand list
CREATE TABLE IF NOT EXISTS public.entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('commercial', 'npc', 'tourism', 'brand', 'education')),
  brand_color TEXT NOT NULL,
  xero_org_code TEXT,
  display_order INT NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.entities (slug, name, entity_type, brand_color, display_order) VALUES
  ('omni',       'Omni Wellness Media',          'commercial', '#C8973A', 10),
  ('foundation', 'Dr. Phil-afel Foundation',     'npc',        '#4A7C3F', 20),
  ('tnt',        'Travel & Tours Cape Town',     'tourism',    '#1B6CA8', 30),
  ('roam',       'ROAM by Omni',                 'commercial', '#D4AF37', 40),
  ('bwc',        'Beauty Without Cruelty SA',    'brand',      '#E8862A', 50),
  ('eduponics',  'Eduponics',                    'brand',      '#3D7B3D', 60),
  ('fact',       'Futurist Academy of Cape Town','education',  '#2D2A4E', 70)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Entities readable by admins and accountants" ON public.entities;
CREATE POLICY "Entities readable by admins and accountants"
  ON public.entities FOR SELECT TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

-- 2. entity_id on each financial table (skip any table that doesn't exist)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['bookings', 'tour_bookings', 'orders', 'affiliate_commissions']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS entity_id UUID REFERENCES public.entities(id)', t);
    END IF;
  END LOOP;
END $$;

-- 3. Backfill sensible defaults (re-tag later via UI)
UPDATE public.bookings              SET entity_id = (SELECT id FROM public.entities WHERE slug = 'omni') WHERE entity_id IS NULL;
UPDATE public.tour_bookings         SET entity_id = (SELECT id FROM public.entities WHERE slug = 'tnt')  WHERE entity_id IS NULL;
UPDATE public.orders                SET entity_id = (SELECT id FROM public.entities WHERE slug = 'roam') WHERE entity_id IS NULL;
UPDATE public.affiliate_commissions SET entity_id = (SELECT id FROM public.entities WHERE slug = 'roam') WHERE entity_id IS NULL;

-- 4. Master revenue view — single source of truth for the portfolio dashboard
CREATE OR REPLACE VIEW public.entity_revenue_summary AS
WITH bookings_agg AS (
  SELECT entity_id,
         COALESCE(SUM(amount_zar) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', NOW())), 0) AS mtd,
         COALESCE(SUM(amount_zar) FILTER (WHERE date_trunc('year', created_at) = date_trunc('year', NOW())), 0) AS ytd
  FROM public.bookings
  WHERE status IN ('completed', 'confirmed')
  GROUP BY entity_id
),
tours_agg AS (
  SELECT entity_id,
         COALESCE(SUM(total_price) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', NOW())), 0) AS mtd,
         COALESCE(SUM(total_price) FILTER (WHERE date_trunc('year', created_at) = date_trunc('year', NOW())), 0) AS ytd
  FROM public.tour_bookings
  WHERE status IN ('completed', 'confirmed')
  GROUP BY entity_id
),
orders_agg AS (
  SELECT entity_id,
         COALESCE(SUM(amount) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', NOW())), 0) AS mtd,
         COALESCE(SUM(amount) FILTER (WHERE date_trunc('year', created_at) = date_trunc('year', NOW())), 0) AS ytd
  FROM public.orders
  WHERE status IN ('completed', 'processing')
  GROUP BY entity_id
),
affiliate_agg AS (
  SELECT entity_id,
         COALESCE(SUM(commission_amount) FILTER (WHERE date_trunc('month', created_at) = date_trunc('month', NOW())), 0) AS mtd,
         COALESCE(SUM(commission_amount) FILTER (WHERE date_trunc('year', created_at) = date_trunc('year', NOW())), 0) AS ytd
  FROM public.affiliate_commissions
  WHERE status = 'paid'
  GROUP BY entity_id
)
SELECT
  e.id   AS entity_id,
  e.slug, e.name, e.entity_type, e.brand_color, e.display_order,
  COALESCE(b.mtd,0) + COALESCE(t.mtd,0) + COALESCE(o.mtd,0) + COALESCE(a.mtd,0) AS total_mtd,
  COALESCE(b.ytd,0) + COALESCE(t.ytd,0) + COALESCE(o.ytd,0) + COALESCE(a.ytd,0) AS total_ytd,
  COALESCE(b.mtd,0) AS bookings_mtd,
  COALESCE(t.mtd,0) AS tours_mtd,
  COALESCE(o.mtd,0) AS orders_mtd,
  COALESCE(a.mtd,0) AS affiliate_mtd
FROM public.entities e
LEFT JOIN bookings_agg  b ON b.entity_id = e.id
LEFT JOIN tours_agg     t ON t.entity_id = e.id
LEFT JOIN orders_agg    o ON o.entity_id = e.id
LEFT JOIN affiliate_agg a ON a.entity_id = e.id
WHERE e.is_active = TRUE
ORDER BY e.display_order;

GRANT SELECT ON public.entity_revenue_summary TO authenticated;

-- 5. RLS — accountants + admins get read-only access to the financial tables
--    (reuses the existing is_accountant_or_admin helper; additive to existing policies)
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Accountants read all bookings" ON public.bookings;
CREATE POLICY "Accountants read all bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants read all tour bookings" ON public.tour_bookings;
CREATE POLICY "Accountants read all tour bookings"
  ON public.tour_bookings FOR SELECT TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants read all orders" ON public.orders;
CREATE POLICY "Accountants read all orders"
  ON public.orders FOR SELECT TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants read all affiliate" ON public.affiliate_commissions;
CREATE POLICY "Accountants read all affiliate"
  ON public.affiliate_commissions FOR SELECT TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));
