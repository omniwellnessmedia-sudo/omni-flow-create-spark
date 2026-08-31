-- The live events module: provenance, moderation, an immutable history and
-- the fields monetisation needs.
--
-- CONTEXT. 20260830100000 renamed screening_events to events and added what a
-- listing needs. This migration turns that into something a public calendar
-- can be trusted with, because the calendar it replaces was rendering six
-- invented events, one of which claimed a food drive run in partnership with a
-- real foundation. Nothing like that may happen again by accident, so every
-- row now has to say where it came from and who vouched for it.
--
-- THE THREE IDEAS HERE
--
-- 1. Provenance. Every event records its source. An event we run ourselves,
--    an event an organiser submitted, and an event pulled from a feed are
--    different things and a reader deserves to know which they are looking at.
--
-- 2. Moderation before publication. Public submissions land in their own
--    table, never in events. A person promotes a submission into an event.
--    There is no path by which an anonymous submission reaches the public
--    calendar without a human acting.
--
-- 3. Immutable history. Every change to an event is appended to
--    event_revisions by a trigger. That table has no update or delete policy
--    and both are revoked, so history can be read but never rewritten,
--    including by the account that made the change.
--
-- No em dashes in this file.

-- ---------------------------------------------------------------------------
-- 1. Provenance, moderation state and monetisation fields on events
-- ---------------------------------------------------------------------------

ALTER TABLE public.events
  -- Where this row came from. 'own' is an event we run. 'submitted' was sent
  -- to us and approved by a person. 'feed' came from a source we registered,
  -- such as an organiser's calendar feed or a partner API.
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'own',
  ADD COLUMN IF NOT EXISTS source_url text,
  -- Stable identifier at the source, so a re-fetch updates rather than
  -- duplicates.
  ADD COLUMN IF NOT EXISTS source_ref text,
  ADD COLUMN IF NOT EXISTS source_fetched_at timestamptz,

  -- A named person confirmed this event is real and the details are right.
  -- Publication requires it. This is the control that the invented calendar
  -- had no equivalent of.
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by uuid,

  -- How a visitor acts on it. 'internal' uses our own seat reservation,
  -- 'external' sends them to external_booking_url, 'enquiry' opens a form,
  -- 'none' is information only.
  ADD COLUMN IF NOT EXISTS booking_mode text NOT NULL DEFAULT 'none',

  -- Monetisation. listing_tier is the paid placement level and featured_until
  -- is when that placement lapses. A tier with no future featured_until is
  -- treated as standard by the readers below, so a lapsed promotion stops
  -- being promoted without anyone remembering to switch it off.
  ADD COLUMN IF NOT EXISTS listing_tier text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS featured_until timestamptz,

  -- Who pays our booking fee on a ticket sold through us, and at what rate.
  -- Null rate means use the platform default in src/config/eventPricing.ts.
  -- Held per event because a partner may negotiate, and because a free
  -- community event must be able to carry no fee at all.
  ADD COLUMN IF NOT EXISTS fee_payer text NOT NULL DEFAULT 'attendee',
  ADD COLUMN IF NOT EXISTS fee_bps int,

  ADD COLUMN IF NOT EXISTS organiser_name text,
  ADD COLUMN IF NOT EXISTS organiser_email text,
  ADD COLUMN IF NOT EXISTS updated_by uuid;

DO $c$
BEGIN
  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_source_check;
  ALTER TABLE public.events ADD CONSTRAINT events_source_check
    CHECK (source IN ('own','submitted','feed'));

  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_booking_mode_check;
  ALTER TABLE public.events ADD CONSTRAINT events_booking_mode_check
    CHECK (booking_mode IN ('internal','external','enquiry','none'));

  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_listing_tier_check;
  ALTER TABLE public.events ADD CONSTRAINT events_listing_tier_check
    CHECK (listing_tier IN ('standard','featured','sponsored'));

  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_fee_payer_check;
  ALTER TABLE public.events ADD CONSTRAINT events_fee_payer_check
    CHECK (fee_payer IN ('attendee','organiser','none'));

  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_fee_bps_range;
  ALTER TABLE public.events ADD CONSTRAINT events_fee_bps_range
    CHECK (fee_bps IS NULL OR (fee_bps >= 0 AND fee_bps <= 3000));

  -- An event booked externally needs somewhere to send people. Enforced here
  -- rather than trusted to the form, because a published event whose only
  -- action goes nowhere is worse than not listing it.
  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_external_needs_url;
  ALTER TABLE public.events ADD CONSTRAINT events_external_needs_url
    CHECK (booking_mode <> 'external' OR external_booking_url IS NOT NULL);

  -- Nothing reaches the public calendar unverified. This is the whole point.
  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_published_must_be_verified;
  ALTER TABLE public.events ADD CONSTRAINT events_published_must_be_verified
    CHECK (status <> 'published' OR verified_at IS NOT NULL);
EXCEPTION
  WHEN undefined_table THEN RAISE NOTICE 'Skipping events constraints: %', SQLERRM;
END
$c$;

-- A feed must not create the same event twice on re-fetch.
CREATE UNIQUE INDEX IF NOT EXISTS events_source_ref_unique
  ON public.events (source, source_ref) WHERE source_ref IS NOT NULL;

CREATE INDEX IF NOT EXISTS events_featured_idx
  ON public.events (listing_tier, featured_until) WHERE listing_tier <> 'standard';

-- The existing screening predates verification. It is ours and it is real, so
-- record that rather than let the new constraint block a future publish.
UPDATE public.events
   SET verified_at = COALESCE(verified_at, now()),
       source = 'own',
       booking_mode = CASE WHEN booking_mode = 'none' THEN 'internal' ELSE booking_mode END
 WHERE slug = 'stunning-pigs';

-- ---------------------------------------------------------------------------
-- 2. Immutable revision history
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.event_revisions (
  id bigserial PRIMARY KEY,
  event_id uuid NOT NULL,
  event_slug text,
  operation text NOT NULL CHECK (operation IN ('insert','update','delete')),
  -- The whole row as it stood after the change. Storing the full row rather
  -- than a diff means history stays readable even after the table's shape
  -- changes underneath it.
  snapshot jsonb NOT NULL,
  changed_fields text[],
  actor uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_revisions_event_idx
  ON public.event_revisions (event_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.record_event_revision()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  changed text[];
BEGIN
  IF TG_OP = 'UPDATE' THEN
    SELECT array_agg(key ORDER BY key) INTO changed
    FROM jsonb_each(to_jsonb(NEW))
    WHERE to_jsonb(NEW) -> key IS DISTINCT FROM to_jsonb(OLD) -> key;

    -- A no-op update is not history worth keeping.
    IF changed IS NULL THEN
      RETURN NEW;
    END IF;
  END IF;

  INSERT INTO public.event_revisions (event_id, event_slug, operation, snapshot, changed_fields, actor)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.slug, OLD.slug),
    lower(TG_OP),
    to_jsonb(COALESCE(NEW, OLD)),
    changed,
    auth.uid()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS events_revision_trigger ON public.events;
CREATE TRIGGER events_revision_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.record_event_revision();

ALTER TABLE public.event_revisions ENABLE ROW LEVEL SECURITY;

-- History is append only. There is deliberately no UPDATE or DELETE policy,
-- and the privileges are revoked as well, so neither PostgREST nor a direct
-- grant can rewrite it. Inserts happen only through the SECURITY DEFINER
-- trigger above, never from a client.
REVOKE UPDATE, DELETE ON public.event_revisions FROM anon, authenticated;

DO $guard$
BEGIN
  DROP POLICY IF EXISTS "Admins read event history" ON public.event_revisions;
  CREATE POLICY "Admins read event history"
    ON public.event_revisions FOR SELECT
    TO authenticated
    USING (public.is_accountant_or_admin(auth.uid()));
EXCEPTION
  WHEN undefined_function OR undefined_object OR undefined_table THEN
    RAISE NOTICE 'Skipping event_revisions policy: %', SQLERRM;
END
$guard$;

-- ---------------------------------------------------------------------------
-- 3. Public submissions, held away from events until a person promotes them
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.event_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  kind text,
  venue text,
  city text,
  event_date date,
  end_date date,
  external_booking_url text,
  cover_image_url text,
  price_from_zar numeric(10,2),
  is_free boolean NOT NULL DEFAULT false,
  organiser_name text NOT NULL,
  organiser_email text NOT NULL,
  organiser_phone text,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  review_note text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  -- Set when approved, so a submission and the event it became stay linked.
  promoted_event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_submissions_status_idx
  ON public.event_submissions (status, created_at DESC);

ALTER TABLE public.event_submissions ENABLE ROW LEVEL SECURITY;

DO $guard2$
BEGIN
  -- Anyone may propose an event. Nobody may read the queue but staff, because
  -- it holds organiser contact details.
  DROP POLICY IF EXISTS "Anyone can submit an event" ON public.event_submissions;
  CREATE POLICY "Anyone can submit an event"
    ON public.event_submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'pending' AND promoted_event_id IS NULL);

  DROP POLICY IF EXISTS "Staff read submissions" ON public.event_submissions;
  CREATE POLICY "Staff read submissions"
    ON public.event_submissions FOR SELECT
    TO authenticated
    USING (public.is_accountant_or_admin(auth.uid()));

  DROP POLICY IF EXISTS "Staff moderate submissions" ON public.event_submissions;
  CREATE POLICY "Staff moderate submissions"
    ON public.event_submissions FOR UPDATE
    TO authenticated
    USING (public.is_accountant_or_admin(auth.uid()))
    WITH CHECK (public.is_accountant_or_admin(auth.uid()));
EXCEPTION
  WHEN undefined_function OR undefined_object OR undefined_table THEN
    RAISE NOTICE 'Skipping event_submissions policies: %', SQLERRM;
END
$guard2$;

-- ---------------------------------------------------------------------------
-- 4. Registered ingestion sources
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.event_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  -- 'ics' is an organiser's own calendar feed. 'jsonld' reads schema.org
  -- Event markup an organiser publishes on their own site for exactly this
  -- purpose. 'api' is a partner ticketing API we hold credentials for.
  -- Social networks are absent on purpose: see docs/EVENTS_INGESTION.md.
  kind text NOT NULL CHECK (kind IN ('ics','jsonld','api')),
  url text NOT NULL,
  -- Written permission from the organiser to list their events, recorded the
  -- same way consent is recorded everywhere else in this codebase.
  permission_note text,
  permission_recorded_at timestamptz,
  permission_recorded_by uuid,
  is_active boolean NOT NULL DEFAULT false,
  last_fetched_at timestamptz,
  last_result text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_sources ENABLE ROW LEVEL SECURITY;

DO $guard3$
BEGIN
  DROP POLICY IF EXISTS "Staff manage event sources" ON public.event_sources;
  CREATE POLICY "Staff manage event sources"
    ON public.event_sources FOR ALL
    TO authenticated
    USING (public.is_accountant_or_admin(auth.uid()))
    WITH CHECK (public.is_accountant_or_admin(auth.uid()));
EXCEPTION
  WHEN undefined_function OR undefined_object OR undefined_table THEN
    RAISE NOTICE 'Skipping event_sources policies: %', SQLERRM;
END
$guard3$;

-- ---------------------------------------------------------------------------
-- 5. Readers that understand promotion
-- ---------------------------------------------------------------------------

-- Replaces the reader from the previous migration. Promoted events sort
-- first, but only while their promotion is current: featured_until in the
-- past falls back to standard ordering without anyone switching it off.
--
-- Dropped rather than replaced: this widens the returned columns, and
-- CREATE OR REPLACE cannot change a function's return type.
DROP FUNCTION IF EXISTS public.list_published_events(date, date);

CREATE FUNCTION public.list_published_events(p_from date DEFAULT NULL, p_to date DEFAULT NULL)
RETURNS TABLE (
  id uuid, slug text, title text, summary text, kind text,
  venue text, city text, event_date date, end_date date,
  cover_image_url text, price_from_zar numeric, is_free boolean,
  external_booking_url text, host_name text,
  source text, booking_mode text, listing_tier text, is_promoted boolean,
  organiser_name text,
  seats_remaining int
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT e.id, e.slug, e.title, e.summary, e.kind,
         e.venue, e.city, e.event_date, e.end_date,
         e.cover_image_url, e.price_from_zar, e.is_free,
         e.external_booking_url, e.host_name,
         e.source, e.booking_mode, e.listing_tier,
         (e.listing_tier <> 'standard' AND e.featured_until IS NOT NULL AND e.featured_until > now()) AS is_promoted,
         e.organiser_name,
         NULLIF(COALESCE(SUM(s.allocation - s.sold), 0), 0)::int
  FROM public.events e
  LEFT JOIN public.event_sessions s ON s.event_id = e.id
  WHERE e.status = 'published'
    AND e.verified_at IS NOT NULL
    AND (p_from IS NULL OR e.event_date >= p_from)
    AND (p_to   IS NULL OR e.event_date <= p_to)
  GROUP BY e.id
  ORDER BY
    (e.listing_tier <> 'standard' AND e.featured_until IS NOT NULL AND e.featured_until > now()) DESC,
    e.event_date NULLS LAST,
    e.title
$$;

GRANT EXECUTE ON FUNCTION public.list_published_events(date, date) TO anon, authenticated;

COMMENT ON TABLE public.event_revisions IS
  'Append only history of every change to public.events. No update or delete policy exists and both privileges are revoked, so history can be read but never rewritten.';
COMMENT ON TABLE public.event_submissions IS
  'Public event proposals. Held here rather than in events so no submission can reach the public calendar without a person promoting it.';
COMMENT ON COLUMN public.events.verified_at IS
  'A named person confirmed the event is real. Publication is constrained on it.';
