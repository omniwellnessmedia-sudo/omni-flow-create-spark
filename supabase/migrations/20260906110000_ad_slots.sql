-- House ad slots, and what happened to them.
--
-- Two tables. ad_slots is what may be shown, edited by the catalogue and
-- marketing side. ad_events is what was shown and what was clicked.
--
-- THE PART THAT NEEDS CARE IS ad_events. It is written by anonymous
-- visitors, because an impression happens before anyone signs in. A table
-- the public can insert into is a table the public can fill, so the insert
-- policy checks the shape of every row and the table is readable only by
-- staff. A visitor may add a row. A visitor may not read one, may not
-- change one, and may not delete one.
--
-- No personal data is recorded here. There is no IP address, no user
-- agent, no cookie id and no visitor id, so this counts events without
-- tracking people and needs no consent banner to be lawful.

DO $slots$
BEGIN

  CREATE TABLE IF NOT EXISTS public.ad_slots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_key text NOT NULL,
    title text NOT NULL,
    body text NOT NULL DEFAULT '',
    cta_label text NOT NULL DEFAULT '',
    cta_href text NOT NULL DEFAULT '',
    image_url text,
    hue text,
    weight integer NOT NULL DEFAULT 1,
    active boolean NOT NULL DEFAULT false,
    starts_at timestamptz,
    ends_at timestamptz,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  -- A tile with no words is a blank box on a page.
  ALTER TABLE public.ad_slots DROP CONSTRAINT IF EXISTS ad_slots_title_not_blank;
  ALTER TABLE public.ad_slots
    ADD CONSTRAINT ad_slots_title_not_blank CHECK (length(btrim(title)) > 0);

  ALTER TABLE public.ad_slots DROP CONSTRAINT IF EXISTS ad_slots_key_not_blank;
  ALTER TABLE public.ad_slots
    ADD CONSTRAINT ad_slots_key_not_blank CHECK (length(btrim(slot_key)) > 0);

  -- A window that ends before it starts would never show, which is a
  -- scheduling mistake that is invisible until somebody asks why the
  -- campaign did nothing.
  ALTER TABLE public.ad_slots DROP CONSTRAINT IF EXISTS ad_slots_window_ordered;
  ALTER TABLE public.ad_slots
    ADD CONSTRAINT ad_slots_window_ordered
    CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at);

  ALTER TABLE public.ad_slots DROP CONSTRAINT IF EXISTS ad_slots_weight_sane;
  ALTER TABLE public.ad_slots
    ADD CONSTRAINT ad_slots_weight_sane CHECK (weight BETWEEN 0 AND 1000);

  -- A tile that links nowhere but shows a button is a dead end. Either
  -- both the label and the destination are set, or neither is.
  ALTER TABLE public.ad_slots DROP CONSTRAINT IF EXISTS ad_slots_cta_complete;
  ALTER TABLE public.ad_slots
    ADD CONSTRAINT ad_slots_cta_complete
    CHECK ((length(btrim(cta_label)) = 0) = (length(btrim(cta_href)) = 0));

  CREATE INDEX IF NOT EXISTS ad_slots_serving_idx
    ON public.ad_slots (slot_key, active);

  ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;

  COMMENT ON TABLE public.ad_slots IS
    'House promo tiles. Only rows that are active and inside their window are readable by the public.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_slots table, missing dependency: %', SQLERRM;
END
$slots$;

DO $events$
BEGIN

  CREATE TABLE IF NOT EXISTS public.ad_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id uuid NOT NULL REFERENCES public.ad_slots(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('impression', 'click')),
    -- Where it was shown. A path only: no query string, so nothing a page
    -- carries in its URL can be smuggled in here.
    path text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE public.ad_events DROP CONSTRAINT IF EXISTS ad_events_path_is_a_path;
  ALTER TABLE public.ad_events
    ADD CONSTRAINT ad_events_path_is_a_path
    CHECK (path = '' OR (path ~ '^/[A-Za-z0-9/_-]*$' AND length(path) <= 200));

  CREATE INDEX IF NOT EXISTS ad_events_slot_idx
    ON public.ad_events (slot_id, kind, created_at DESC);

  ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;

  COMMENT ON TABLE public.ad_events IS
    'Impression and click counts. Written by anonymous visitors, readable only by staff. Holds no personal data: no IP, user agent, cookie or visitor id.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_events table, missing dependency: %', SQLERRM;
END
$events$;

DO $policies$
BEGIN

  DROP POLICY IF EXISTS "Anyone can read a live slot" ON public.ad_slots;
  DROP POLICY IF EXISTS "Staff can read every slot" ON public.ad_slots;
  DROP POLICY IF EXISTS "Marketing can write slots" ON public.ad_slots;
  DROP POLICY IF EXISTS "Marketing can change slots" ON public.ad_slots;
  DROP POLICY IF EXISTS "Admin can delete slots" ON public.ad_slots;

  -- The public sees a slot only while it is meant to be live. An expired
  -- or draft tile is not readable at all, so a campaign cannot leak early
  -- by someone reading the table directly.
  CREATE POLICY "Anyone can read a live slot" ON public.ad_slots
    FOR SELECT TO anon, authenticated
    USING (
      active
      AND (starts_at IS NULL OR starts_at <= now())
      AND (ends_at IS NULL OR ends_at > now())
    );

  CREATE POLICY "Staff can read every slot" ON public.ad_slots
    FOR SELECT TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  CREATE POLICY "Marketing can write slots" ON public.ad_slots
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'admin', 'super_admin')
    ));

  CREATE POLICY "Marketing can change slots" ON public.ad_slots
    FOR UPDATE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'admin', 'super_admin')
    ));

  CREATE POLICY "Admin can delete slots" ON public.ad_slots
    FOR DELETE TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('admin', 'super_admin')
    ));

  DROP POLICY IF EXISTS "Anyone can record an event on a live slot" ON public.ad_events;
  DROP POLICY IF EXISTS "Staff can read events" ON public.ad_events;

  -- An impression happens before anybody signs in, so this insert has to
  -- be open. What keeps it from being a dumping ground is that the row
  -- must point at a slot that is actually live, the kind is constrained,
  -- and there is no column to write anything else into.
  CREATE POLICY "Anyone can record an event on a live slot" ON public.ad_events
    FOR INSERT TO anon, authenticated
    WITH CHECK (
      kind IN ('impression', 'click')
      AND EXISTS (
        SELECT 1 FROM public.ad_slots s
         WHERE s.id = ad_events.slot_id
           AND s.active
           AND (s.starts_at IS NULL OR s.starts_at <= now())
           AND (s.ends_at IS NULL OR s.ends_at > now())
      )
    );

  -- Read is staff only. Counts are a business fact, not public.
  CREATE POLICY "Staff can read events" ON public.ad_events
    FOR SELECT TO authenticated
    USING (EXISTS (
      SELECT 1 FROM public.user_roles ur
       WHERE ur.user_id = auth.uid()
         AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
    ));

  -- No UPDATE or DELETE policy on ad_events at all. A count nobody can
  -- edit is a count worth reading.

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad policies, missing dependency: %', SQLERRM;
END
$policies$;

DO $touch$
BEGIN

  CREATE OR REPLACE FUNCTION public.touch_ad_slots_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $body$
  BEGIN
    NEW.updated_at := now();
    RETURN NEW;
  END;
  $body$;

  DROP TRIGGER IF EXISTS ad_slots_touch_updated_at ON public.ad_slots;
  CREATE TRIGGER ad_slots_touch_updated_at
    BEFORE UPDATE ON public.ad_slots
    FOR EACH ROW EXECUTE FUNCTION public.touch_ad_slots_updated_at();

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_slots trigger, missing dependency: %', SQLERRM;
END
$touch$;

-- Counts per slot, so a report does not have to scan every event row.
DO $rollup$
BEGIN

  CREATE OR REPLACE VIEW public.ad_slot_performance
  WITH (security_invoker = true) AS
  SELECT
    s.id AS slot_id,
    s.slot_key,
    s.title,
    s.active,
    s.starts_at,
    s.ends_at,
    COUNT(*) FILTER (WHERE e.kind = 'impression') AS impressions,
    COUNT(*) FILTER (WHERE e.kind = 'click') AS clicks
  FROM public.ad_slots s
  LEFT JOIN public.ad_events e ON e.slot_id = s.id
  GROUP BY s.id, s.slot_key, s.title, s.active, s.starts_at, s.ends_at;

  -- security_invoker means the view is read with the caller's own
  -- permissions, so the staff only policy on ad_events still applies and
  -- this cannot become a way for the public to read counts.

  COMMENT ON VIEW public.ad_slot_performance IS
    'Impressions and clicks per slot. Deliberately reports no rate: dividing by a zero impression count is a decision for the reader, not the database.';

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_column OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping ad_slot_performance view, missing dependency: %', SQLERRM;
END
$rollup$;
