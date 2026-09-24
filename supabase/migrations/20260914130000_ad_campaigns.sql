-- Google Ads copy the team has written or approved, one row per offer.
--
-- The Ads screen drafts a Search campaign for every offer from the rate
-- card, and the AI pass rewrites it. Without this table the rewrite lived
-- only in the browser that asked for it, so Chad's approved headlines were
-- invisible to Feroza and gone on refresh. With it, "Download all
-- campaigns" builds one upload file from whatever the team has saved,
-- falling back to the draft for any offer nobody has touched yet.
--
-- Prices never live here. Every row is keyed to an offer on the rate card
-- and the screen rebuilds the landing URL and validates every line against
-- the published price and the site's rules before a file is produced.

DO $ads$
BEGIN

  CREATE TABLE IF NOT EXISTS public.ad_campaigns (
    offer_slug text PRIMARY KEY,
    campaign text NOT NULL,
    ad_group text NOT NULL,
    final_url text NOT NULL,
    daily_budget numeric(10, 2) NOT NULL DEFAULT 150,
    location text NOT NULL DEFAULT 'Cape Town, Western Cape, South Africa',
    copy jsonb NOT NULL,
    status text NOT NULL DEFAULT 'draft'
      CHECK (status IN ('draft', 'approved')),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

  COMMENT ON TABLE public.ad_campaigns IS
    'Google Ads Search campaign copy per rate card offer, saved from Admin, Marketing, Google Ads. Downloaded as a bulk upload file.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_campaigns table, missing dependency: %', SQLERRM;
END
$ads$;

DO $policies$
BEGIN

  DROP POLICY IF EXISTS "Staff can read ad campaigns" ON public.ad_campaigns;
  DROP POLICY IF EXISTS "Staff can add ad campaigns" ON public.ad_campaigns;
  DROP POLICY IF EXISTS "Staff can change ad campaigns" ON public.ad_campaigns;

  -- The same role set that runs the task board and the catalogue. Ad copy
  -- is marketing work, not a super admin act: a wrong headline costs a
  -- little money for a day, and the campaign arrives paused anyway.
  CREATE POLICY "Staff can read ad campaigns" ON public.ad_campaigns
    FOR SELECT TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  CREATE POLICY "Staff can add ad campaigns" ON public.ad_campaigns
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  CREATE POLICY "Staff can change ad campaigns" ON public.ad_campaigns
    FOR UPDATE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  -- No DELETE policy. "Back to draft" on the screen overwrites the row;
  -- nothing needs removing.

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_campaigns policies, missing dependency: %', SQLERRM;
END
$policies$;

-- Top level on purpose. A CREATE FUNCTION nested inside a DO block is two
-- dollar quotes deep, and the Supabase dashboard SQL editor cannot parse
-- that: it loses track of where the inner quote ends and reports an
-- unterminated dollar-quoted string somewhere further down the file. The
-- CLI copes, the editor does not, and the team runs these in the editor.
-- Nothing is lost by lifting it out: the body is not checked at creation,
-- so there is no missing dependency for the guard below to catch.
CREATE OR REPLACE FUNCTION public.touch_ad_campaigns_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $fn_ads$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := COALESCE(auth.uid(), NEW.updated_by);
  RETURN NEW;
END;
$fn_ads$;

DO $touch$
BEGIN

  DROP TRIGGER IF EXISTS ad_campaigns_touch_updated_at ON public.ad_campaigns;
  CREATE TRIGGER ad_campaigns_touch_updated_at
    BEFORE INSERT OR UPDATE ON public.ad_campaigns
    FOR EACH ROW EXECUTE FUNCTION public.touch_ad_campaigns_updated_at();

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_campaigns trigger, missing dependency: %', SQLERRM;
END
$touch$;
