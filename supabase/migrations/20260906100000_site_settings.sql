-- Settings a super admin can change without a deploy.
--
-- The immediate need is the WhatsApp link. Every "WhatsApp us" button on
-- the service pages pointed at a WhatsApp Channel, which is broadcast
-- only: a reader can follow it and cannot reply to it. So a button
-- offering a way to reach us opened something nobody can reach us
-- through, and changing it meant a code change and a deploy.
--
-- is_public defaults to false and the anonymous read policy is gated on
-- it, so a value added here later is private until somebody deliberately
-- publishes it. Nothing secret belongs in this table either way: a
-- published row is readable by the whole internet.

DO $settings$
BEGIN

  CREATE TABLE IF NOT EXISTS public.site_settings (
    key text PRIMARY KEY,
    value text NOT NULL DEFAULT '',
    label text NOT NULL DEFAULT '',
    help text NOT NULL DEFAULT '',
    is_public boolean NOT NULL DEFAULT false,
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

  COMMENT ON TABLE public.site_settings IS
    'Key value settings a super admin edits from Admin Settings. Rows with is_public are readable by anyone, so no secrets here.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping site_settings table, missing dependency: %', SQLERRM;
END
$settings$;

DO $policies$
BEGIN

  DROP POLICY IF EXISTS "Anyone can read published settings" ON public.site_settings;
  DROP POLICY IF EXISTS "Staff can read all settings" ON public.site_settings;
  DROP POLICY IF EXISTS "Super admin can change settings" ON public.site_settings;
  DROP POLICY IF EXISTS "Super admin can add settings" ON public.site_settings;

  -- A published setting is rendered on public pages, so the signed out
  -- visitor has to be able to read it.
  CREATE POLICY "Anyone can read published settings" ON public.site_settings
    FOR SELECT TO anon, authenticated
    USING (is_public);

  CREATE POLICY "Staff can read all settings" ON public.site_settings
    FOR SELECT TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  -- Changing where a public call to action points is a super admin act.
  -- A wrong value here sends every enquiry somewhere nobody is reading.
  CREATE POLICY "Super admin can change settings" ON public.site_settings
    FOR UPDATE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid() AND ur.role::text = 'super_admin'
    ));

  CREATE POLICY "Super admin can add settings" ON public.site_settings
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid() AND ur.role::text = 'super_admin'
    ));

  -- No DELETE policy on purpose. A page reads these by key; removing a row
  -- breaks the page, and setting the value to empty is the reversible way
  -- to turn something off.

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping site_settings policies, missing dependency: %', SQLERRM;
END
$policies$;

DO $touch$
BEGIN

  CREATE OR REPLACE FUNCTION public.touch_site_settings_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $body$
  BEGIN
    NEW.updated_at := now();
    NEW.updated_by := COALESCE(auth.uid(), NEW.updated_by);
    RETURN NEW;
  END;
  $body$;

  DROP TRIGGER IF EXISTS site_settings_touch_updated_at ON public.site_settings;
  CREATE TRIGGER site_settings_touch_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.touch_site_settings_updated_at();

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping site_settings trigger, missing dependency: %', SQLERRM;
END
$touch$;

DO $seed$
BEGIN

  -- Seeded with the channel that is already live, so nothing changes on
  -- the site the moment this runs. What changes is that a super admin can
  -- now point it at a wa.me number without a deploy, and the button
  -- relabels itself when they do.
  INSERT INTO public.site_settings (key, value, label, help, is_public)
  VALUES (
    'whatsapp_url',
    'https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y',
    'WhatsApp link',
    'A wa.me number lets people message you and the buttons read "WhatsApp us". A whatsapp.com/channel link is broadcast only, so the buttons read "WhatsApp channel" instead.',
    true
  )
  ON CONFLICT (key) DO NOTHING;

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping site_settings seed, missing dependency: %', SQLERRM;
END
$seed$;
