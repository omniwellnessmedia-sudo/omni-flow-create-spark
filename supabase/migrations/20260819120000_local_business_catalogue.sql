-- Local business catalogue: lets a catalogue manager onboard local businesses
-- and their products without those businesses needing a login.
--
-- WHY A NEW TABLE RATHER THAN provider_profiles
--   provider_profiles.id is a foreign key to profiles, which is a foreign key to
--   auth.users, and its RLS only permits a provider to insert their own row
--   (auth.uid() = id). An admin therefore cannot create a listing on behalf of a
--   corner shop or a soap maker who will never hold an account. local_businesses
--   carries no auth dependency, so a staff member can onboard on their behalf.
--
-- TWO GATES, BOTH ENFORCED IN THE DATABASE
--   1. CONSENT. A listing publishes another organisation's name, prices and
--      contact details. Publication is impossible unless listing_consent is true.
--      That is a CHECK constraint, not a convention, so no code path and no
--      future editor can bypass it.
--   2. REVIEW. A catalogue manager creates and edits drafts but cannot publish.
--      Only an admin can move a row to published. Enforced by separate RLS
--      policies, not by hiding a button.
--
-- Everything after the enum change is wrapped in an exception-guarded DO block so
-- this migration is a no-op on environments where the referenced objects do not
-- exist, such as fresh preview branches. Production is unaffected.

-- 1. The narrow role. Deliberately NOT admin: the admin gate also reaches
--    accounting, leads, team management and role assignment.
--    ALTER TYPE ... ADD VALUE cannot run inside a DO block, so it stays here.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'catalogue_manager';

DO $guard$
BEGIN

-- 2. Helper. Returns true for catalogue managers, admins and super admins.
--    NOTE the ::text cast. Postgres parses a SQL function body at creation time,
--    and a bare 'catalogue_manager' literal would have to be resolved against the
--    enum in the very transaction that added that value, which Postgres rejects
--    as an unsafe use of a new enum value. Comparing the column as text sidesteps
--    the resolution entirely and behaves identically at runtime.
CREATE OR REPLACE FUNCTION public.is_catalogue_manager(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = is_catalogue_manager.user_id
      AND ur.role::text IN ('catalogue_manager', 'admin', 'super_admin')
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_catalogue_manager(uuid) TO authenticated, anon;

-- 3. The businesses themselves.
CREATE TABLE IF NOT EXISTS public.local_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  logo_url TEXT,

  -- Consent to be listed. An enquiry, a conversation or a handshake is not
  -- consent. Only an explicit record is, and it carries who logged it and when.
  listing_consent BOOLEAN NOT NULL DEFAULT false,
  listing_consent_at TIMESTAMP WITH TIME ZONE,
  listing_consent_recorded_by UUID,
  listing_consent_note TEXT,

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID,

  created_by UUID DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- The gate. Publishing without recorded consent is not a policy, it is a
  -- constraint violation.
  CONSTRAINT local_businesses_published_requires_consent
    CHECK (status <> 'published' OR listing_consent = true)
);

CREATE INDEX IF NOT EXISTS local_businesses_public_idx
  ON public.local_businesses (status)
  WHERE status = 'published';

-- 4. Products hang off a business. The products table already existed but was
--    orphaned: nothing in the application read or wrote it. Its provider column
--    is plain text, which is why it suits a business with no account.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.local_businesses(id) ON DELETE CASCADE;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';

-- Added separately so re-running cannot fail on an existing constraint.
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- price_wellcoins was NOT NULL with no default, which blocks any insert from a
-- catalogue screen where WellCoins pricing is not part of the local offer.
ALTER TABLE public.products
  ALTER COLUMN price_wellcoins DROP NOT NULL;

CREATE INDEX IF NOT EXISTS products_business_idx ON public.products (business_id);

-- 5. Row level security.
ALTER TABLE public.local_businesses ENABLE ROW LEVEL SECURITY;

-- Public sees a business only when it is published AND consented. The consent
-- term is redundant given the CHECK constraint above, and it stays deliberately:
-- if the constraint is ever dropped, the data still cannot leak through this
-- policy.
DROP POLICY IF EXISTS "Public can view published businesses" ON public.local_businesses;
CREATE POLICY "Public can view published businesses"
  ON public.local_businesses FOR SELECT
  USING (status = 'published' AND listing_consent = true);

-- Catalogue managers see everything, including drafts, so they can work.
DROP POLICY IF EXISTS "Catalogue managers can view all businesses" ON public.local_businesses;
CREATE POLICY "Catalogue managers can view all businesses"
  ON public.local_businesses FOR SELECT
  TO authenticated
  USING (public.is_catalogue_manager(auth.uid()));

DROP POLICY IF EXISTS "Catalogue managers can create businesses" ON public.local_businesses;
CREATE POLICY "Catalogue managers can create businesses"
  ON public.local_businesses FOR INSERT
  TO authenticated
  WITH CHECK (public.is_catalogue_manager(auth.uid()) AND status <> 'published');

-- The publish gate. A catalogue manager may edit freely but may not leave a row
-- in the published state, so they cannot publish and cannot unpublish-then-
-- republish around review either.
DROP POLICY IF EXISTS "Catalogue managers can edit drafts" ON public.local_businesses;
CREATE POLICY "Catalogue managers can edit drafts"
  ON public.local_businesses FOR UPDATE
  TO authenticated
  USING (public.is_catalogue_manager(auth.uid()))
  WITH CHECK (status <> 'published' OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage businesses" ON public.local_businesses;
CREATE POLICY "Admins can manage businesses"
  ON public.local_businesses FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 6. Same shape for products. The existing "Admins can manage products" policy
--    is left in place; these are additive.
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Public can view published products"
  ON public.products FOR SELECT
  USING (
    status = 'published'
    AND (
      business_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.local_businesses b
        WHERE b.id = products.business_id
          AND b.status = 'published'
          AND b.listing_consent = true
      )
    )
  );

DROP POLICY IF EXISTS "Catalogue managers can view all products" ON public.products;
CREATE POLICY "Catalogue managers can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.is_catalogue_manager(auth.uid()));

DROP POLICY IF EXISTS "Catalogue managers can create products" ON public.products;
CREATE POLICY "Catalogue managers can create products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_catalogue_manager(auth.uid()) AND status <> 'published');

DROP POLICY IF EXISTS "Catalogue managers can edit draft products" ON public.products;
CREATE POLICY "Catalogue managers can edit draft products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_catalogue_manager(auth.uid()))
  WITH CHECK (status <> 'published' OR public.is_admin(auth.uid()));

-- 7. Keep updated_at honest.
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $fn$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS local_businesses_touch_updated_at ON public.local_businesses;
CREATE TRIGGER local_businesses_touch_updated_at
  BEFORE UPDATE ON public.local_businesses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

COMMENT ON TABLE public.local_businesses IS
  'Local businesses onboarded by staff on the business''s behalf. No auth account required. Publishing requires recorded consent (CHECK constraint) and an admin (RLS).';
COMMENT ON COLUMN public.local_businesses.listing_consent IS
  'TRUE only when the business gave explicit permission to be listed. Never set this from an enquiry, a conversation or a handshake.';

EXCEPTION WHEN undefined_table OR undefined_function OR undefined_object THEN
  RAISE NOTICE 'local_business_catalogue: prerequisite objects missing, skipping (expected on fresh preview branches)';
END
$guard$;
