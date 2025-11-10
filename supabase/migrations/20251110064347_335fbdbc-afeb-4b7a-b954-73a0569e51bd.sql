-- Create secure user roles system
-- This replaces the insecure profiles.user_type approach

-- Step 1: Create role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  UNIQUE (user_id, role)
);

-- Step 3: Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

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

-- Step 6: Migrate existing admins from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT id, 'admin'::app_role, id
FROM public.profiles
WHERE user_type = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 7: RLS policies for user_roles table
DROP POLICY IF EXISTS "Admins can view user roles" ON public.user_roles;
CREATE POLICY "Admins can view user roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Super admins can manage user roles" ON public.user_roles;
CREATE POLICY "Super admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Step 8: Grant execute permissions
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;

-- Step 9: Add admin update policy for affiliate_products if not exists
DO $$ BEGIN
  CREATE POLICY "Admins can update product settings"
    ON public.affiliate_products FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;