-- Fix provider roles security issue by creating proper database table
-- and fixing function search_path issues

-- Create provider_roles table with proper RLS
CREATE TABLE IF NOT EXISTS public.provider_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('owner', 'manager', 'staff')) NOT NULL,
  permissions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, provider_id)
);

-- Enable RLS
ALTER TABLE public.provider_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own provider roles
CREATE POLICY "Users can view their own provider roles"
ON public.provider_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all provider roles
CREATE POLICY "Admins can view all provider roles"
ON public.provider_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Only admins can insert/update/delete provider roles
CREATE POLICY "Admins can manage provider roles"
ON public.provider_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_provider_roles_user_id ON public.provider_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_roles_provider_id ON public.provider_roles(provider_id);

-- Fix search_path on existing functions - use CASCADE to handle dependencies
-- Update check_contact_rate_limit
DROP FUNCTION IF EXISTS public.check_contact_rate_limit(text) CASCADE;
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(submitter_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 5
  FROM public.contact_submissions
  WHERE email = submitter_email
    AND created_at > NOW() - INTERVAL '1 hour';
$$;

-- Recreate the policy that depends on check_contact_rate_limit
CREATE POLICY "Allow rate-limited contact submissions"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (public.check_contact_rate_limit(email));

-- Update check_quote_rate_limit
DROP FUNCTION IF EXISTS public.check_quote_rate_limit(text) CASCADE;
CREATE OR REPLACE FUNCTION public.check_quote_rate_limit(submitter_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 3
  FROM public.service_quotes
  WHERE email = submitter_email
    AND created_at > NOW() - INTERVAL '1 hour';
$$;

-- Recreate the policy that depends on check_quote_rate_limit
CREATE POLICY "Allow rate-limited quote submissions"
ON public.service_quotes
FOR INSERT
TO public
WITH CHECK (public.check_quote_rate_limit(email));

-- Update auto_curate_awin_products
CREATE OR REPLACE FUNCTION public.auto_curate_awin_products()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE affiliate_products
  SET 
    is_featured = true,
    updated_at = now()
  WHERE 
    affiliate_program_id = 'awin'
    AND is_active = true
    AND commission_rate > 0.10
    AND image_url IS NOT NULL
    AND image_url != ''
    AND price_zar > 100
    AND is_featured = false;
END;
$$;

-- Update increment_resource_download
CREATE OR REPLACE FUNCTION public.increment_resource_download(resource_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.resources
  SET download_count = download_count + 1
  WHERE id = resource_id;
$$;

-- Update auto_curate_featured_products
CREATE OR REPLACE FUNCTION public.auto_curate_featured_products()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE affiliate_products
  SET 
    is_featured = true,
    updated_at = now()
  WHERE 
    is_active = true
    AND commission_rate > 0.15
    AND image_url IS NOT NULL
    AND image_url != ''
    AND is_featured = false;
    
  WITH top_viewed AS (
    SELECT id 
    FROM affiliate_products 
    WHERE is_active = true 
    AND view_count > 0
    ORDER BY view_count DESC 
    LIMIT 50
  )
  UPDATE affiliate_products
  SET 
    is_trending = true,
    updated_at = now()
  WHERE id IN (SELECT id FROM top_viewed)
  AND is_trending = false;
END;
$$;