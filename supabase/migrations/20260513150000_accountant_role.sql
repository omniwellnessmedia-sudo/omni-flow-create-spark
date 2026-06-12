-- Accountant role: read-only access to financial tables for Steve / external accountants
-- Grants visibility into orders, transactions, affiliate commissions, payouts, bookings
-- without any write capability. Pairs with /accountant route on the frontend.

-- 1. Add 'accountant' to the app_role enum
--    NOTE: ALTER TYPE ... ADD VALUE cannot run inside a DO/transaction-function
--    block, so it stays at top level. It's already idempotent (IF NOT EXISTS)
--    and only depends on the core app_role enum, present in every environment.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'accountant';

-- Everything below is wrapped in an exception-guarded DO block so this migration
-- is a no-op on environments where the referenced tables (user_roles, orders,
-- transactions, …) don't yet exist — e.g. fresh Supabase preview branches.
-- Production is unaffected: every object exists there, so no exception fires and
-- all statements run exactly as before.
DO $guard$
BEGIN

-- 2. Helper function: returns true for accountants, admins, and super_admins
CREATE OR REPLACE FUNCTION public.is_accountant_or_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = is_accountant_or_admin.user_id
      AND ur.role IN ('accountant', 'admin', 'super_admin')
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_accountant_or_admin(uuid) TO authenticated, anon;

-- 3. Read-only SELECT policies for accountants on financial tables
-- Each policy is additive — existing user/admin policies are unaffected.

DROP POLICY IF EXISTS "Accountants can view all orders" ON public.orders;
CREATE POLICY "Accountants can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants can view all transactions" ON public.transactions;
CREATE POLICY "Accountants can view all transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants can view all affiliate commissions" ON public.affiliate_commissions;
CREATE POLICY "Accountants can view all affiliate commissions"
  ON public.affiliate_commissions FOR SELECT
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants can view all affiliate payouts" ON public.affiliate_payouts;
CREATE POLICY "Accountants can view all affiliate payouts"
  ON public.affiliate_payouts FOR SELECT
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Accountants can view all tour bookings" ON public.tour_bookings;
CREATE POLICY "Accountants can view all tour bookings"
  ON public.tour_bookings FOR SELECT
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()));

-- 4. user_roles: let accountants see their own role row (for auth checks on the client)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping migration 20260513150000 — missing dependency: %', SQLERRM;
END
$guard$;

-- Provisioning (run manually once Steve has signed up):
--   INSERT INTO public.user_roles (user_id, role, created_by)
--   SELECT id, 'accountant'::app_role, '<your-admin-user-id>'
--   FROM auth.users WHERE email = '<steve-email>'
--   ON CONFLICT (user_id, role) DO NOTHING;
