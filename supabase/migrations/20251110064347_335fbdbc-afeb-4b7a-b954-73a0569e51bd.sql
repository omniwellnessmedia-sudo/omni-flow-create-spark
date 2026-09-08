-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

-- Create secure user roles system
-- This replaces the insecure profiles.user_type approach

-- Step 1: Create role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $g1$
BEGIN
-- Step 2: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  UNIQUE (user_id, role)
);
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
-- Step 3: Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;

DO $g3$
BEGIN
-- Step 4: Create security definer function to check specific roles
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = has_role.user_id
      AND ur.role = has_role.role
  )
$$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g3$;

DO $g4$
BEGIN
-- Step 5: Update is_admin to check user_roles table instead of profiles
-- This maintains compatibility with existing RLS policies
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = is_admin.user_id
      AND ur.role IN ('admin', 'super_admin')
  )
$$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g4$;

DO $g5$
BEGIN
-- Step 6: Migrate existing admins from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT id, 'admin'::app_role, id
FROM public.profiles
WHERE user_type = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g5$;

DO $g6$
BEGIN
-- Step 7: RLS policies for user_roles table
DROP POLICY IF EXISTS "Admins can view user roles" ON public.user_roles;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g6$;

DO $g7$
BEGIN
CREATE POLICY "Admins can view user roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g7$;

DO $g8$
BEGIN
DROP POLICY IF EXISTS "Super admins can manage user roles" ON public.user_roles;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g8$;

DO $g9$
BEGIN
CREATE POLICY "Super admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g9$;

DO $g10$
BEGIN
-- Step 8: Grant execute permissions
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g10$;

DO $g11$
BEGIN
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g11$;

-- Step 9: Add admin update policy for affiliate_products if not exists
DO $$ BEGIN
  CREATE POLICY "Admins can update product settings"
    ON public.affiliate_products FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
