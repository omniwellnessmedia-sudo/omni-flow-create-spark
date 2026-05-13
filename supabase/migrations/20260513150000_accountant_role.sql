-- Accountant role: read-only access to financial tables for Steve / external accountants
-- Grants visibility into orders, transactions, affiliate commissions, payouts, bookings
-- without any write capability. Pairs with /accountant route on the frontend.

-- 1. Add 'accountant' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'accountant';

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

-- Provisioning (run manually once Steve has signed up):
--   INSERT INTO public.user_roles (user_id, role, created_by)
--   SELECT id, 'accountant'::app_role, '<your-admin-user-id>'
--   FROM auth.users WHERE email = '<steve-email>'
--   ON CONFLICT (user_id, role) DO NOTHING;
