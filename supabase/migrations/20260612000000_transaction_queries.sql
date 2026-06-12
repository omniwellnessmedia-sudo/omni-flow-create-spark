-- Transaction queries / notes thread — lets the accountant (or admin) flag a
-- transaction with a question, and lets admins reply inside the portal.
-- Replaces the WhatsApp / email "what's this entry?" loop.
--
-- Visibility: anyone with the is_accountant_or_admin() role can see, write,
-- and resolve queries. There is intentionally no per-transaction visibility
-- scoping beyond the role gate — these are operator-side notes.

DO $guard$
BEGIN

CREATE TABLE IF NOT EXISTS public.transaction_queries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Target the query at a specific record. We use a generic (table, row) pair
  -- so the same thread system serves orders / transactions / commissions /
  -- payouts / tour_bookings without per-table proliferation.
  target_table TEXT NOT NULL CHECK (target_table IN (
    'orders', 'transactions', 'affiliate_commissions', 'affiliate_payouts', 'tour_bookings'
  )),
  target_id    UUID NOT NULL,
  entity_id    UUID REFERENCES public.entities(id) ON DELETE SET NULL,

  author_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL CHECK (length(trim(body)) > 0),
  status       TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  resolved_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at  TIMESTAMPTZ,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tx_queries_target      ON public.transaction_queries(target_table, target_id);
CREATE INDEX IF NOT EXISTS idx_tx_queries_status      ON public.transaction_queries(status);
CREATE INDEX IF NOT EXISTS idx_tx_queries_entity      ON public.transaction_queries(entity_id);
CREATE INDEX IF NOT EXISTS idx_tx_queries_created_at  ON public.transaction_queries(created_at DESC);

ALTER TABLE public.transaction_queries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Accountants and admins can read tx queries"  ON public.transaction_queries;
CREATE POLICY "Accountants and admins can read tx queries"
  ON public.transaction_queries FOR SELECT
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants and admins can write tx queries" ON public.transaction_queries;
CREATE POLICY "Accountants and admins can write tx queries"
  ON public.transaction_queries FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_accountant_or_admin(auth.uid())
    AND author_id = auth.uid()
  );

DROP POLICY IF EXISTS "Accountants and admins can update tx queries" ON public.transaction_queries;
CREATE POLICY "Accountants and admins can update tx queries"
  ON public.transaction_queries FOR UPDATE
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()))
  WITH CHECK (public.is_accountant_or_admin(auth.uid()));

-- updated_at trigger using the existing helper
DROP TRIGGER IF EXISTS trg_tx_queries_updated_at ON public.transaction_queries;
CREATE TRIGGER trg_tx_queries_updated_at
  BEFORE UPDATE ON public.transaction_queries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping migration 20260612000000 — missing dependency: %', SQLERRM;
END
$guard$;
