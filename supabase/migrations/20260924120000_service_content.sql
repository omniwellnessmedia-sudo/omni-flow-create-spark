-- Let the team write what an offer includes, without a deploy.
--
-- Five of the nineteen offers show a price and no inclusions: a buyer sees
-- "Workshops, from R7,500 half day" and cannot tell what arrives for that.
-- The content has been waiting on one person since 12 September because
-- changing it meant a code change and a deploy. This gives it a table.
--
-- WHAT THIS TABLE MAY AND MAY NOT CHANGE. It carries the description and
-- the inclusions, and nothing else. Price is not here and is not editable
-- from the admin. A price is the most consequential string on the site, it
-- changes rarely, and src/data/publicRateCard.ts stays its single source,
-- so a wrong row here can cost a sentence, never a rand. The admin screen
-- shows the price read only and says a change to it needs a developer.
--
-- The code is still the baseline. A slug with no row here, or a row still
-- in draft, renders exactly what the rate card has always said, so this
-- table failing to exist or failing to load changes nothing on the site.

DO $content$
BEGIN

  CREATE TABLE IF NOT EXISTS public.service_content (
    offer_slug text PRIMARY KEY,
    blurb text,
    bullets jsonb,
    status text NOT NULL DEFAULT 'draft'
      CHECK (status IN ('draft', 'published')),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.service_content ENABLE ROW LEVEL SECURITY;

  COMMENT ON TABLE public.service_content IS
    'Per offer description and inclusions, edited in Admin, Clients and partners, Services. Prices are not here: they live in src/data/publicRateCard.ts.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping service_content table, missing dependency: %', SQLERRM;
END
$content$;

DO $policies$
BEGIN

  DROP POLICY IF EXISTS "Anyone can read published service content" ON public.service_content;
  DROP POLICY IF EXISTS "Staff can read all service content" ON public.service_content;
  DROP POLICY IF EXISTS "Staff can add service content" ON public.service_content;
  DROP POLICY IF EXISTS "Staff can change service content" ON public.service_content;

  -- A published row is rendered to a signed out visitor on the offer page,
  -- so the anonymous read is gated on the status rather than on the row.
  CREATE POLICY "Anyone can read published service content" ON public.service_content
    FOR SELECT TO anon, authenticated
    USING (status = 'published');

  CREATE POLICY "Staff can read all service content" ON public.service_content
    FOR SELECT TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  CREATE POLICY "Staff can add service content" ON public.service_content
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'admin', 'super_admin')
    ));

  CREATE POLICY "Staff can change service content" ON public.service_content
    FOR UPDATE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'admin', 'super_admin')
    ));

  -- No DELETE policy. Unpublishing is the reversible way to take content
  -- off the site, and it keeps the draft for whoever picks it up next.

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping service_content policies, missing dependency: %', SQLERRM;
END
$policies$;

-- Top level on purpose. A CREATE FUNCTION nested inside a DO block is two
-- dollar quotes deep, and the Supabase dashboard SQL editor cannot parse
-- that: it loses track of where the inner quote ends and reports an
-- unterminated dollar-quoted string somewhere further down the file. The
-- CLI copes, the editor does not, and the team runs these in the editor.
CREATE OR REPLACE FUNCTION public.touch_service_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $fn_content$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := COALESCE(auth.uid(), NEW.updated_by);
  RETURN NEW;
END;
$fn_content$;

DO $touch$
BEGIN

  DROP TRIGGER IF EXISTS service_content_touch_updated_at ON public.service_content;
  CREATE TRIGGER service_content_touch_updated_at
    BEFORE INSERT OR UPDATE ON public.service_content
    FOR EACH ROW EXECUTE FUNCTION public.touch_service_content_updated_at();

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping service_content trigger, missing dependency: %', SQLERRM;
END
$touch$;
