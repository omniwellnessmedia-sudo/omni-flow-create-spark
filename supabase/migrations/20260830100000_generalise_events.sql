-- Generalise screening_events into a wellness events model.
--
-- WHY. screening_events and screening_sessions were built for one screening,
-- but what they actually model is an event with sessions, per session capacity,
-- a draft/published gate and an oversell-safe seat reservation. That is the
-- expensive part of an events platform and it already runs in production. The
-- name was the only thing tying it to screenings.
--
-- The Community calendar meanwhile renders from a static file whose own comment
-- says its entries are anchored to the current month "so the calendar always
-- looks live". That calendar shows invented events. This migration gives it a
-- real table to read instead.
--
-- WHAT THIS IS NOT. This does not add ticket types, seat maps, waitlists or
-- recurrence. It renames, adds the few columns a listing and a calendar need,
-- and stops there.
--
-- SAFETY. The only application reference to any of this is the
-- reserve_screening_seats RPC called from PayPalCheckout. Both old function
-- names are kept as thin wrappers over the new ones, so the running site keeps
-- working whether it is deployed before or after this migration is applied.
-- That matters here because code deploys through Netlify and migrations are
-- applied separately, so the two cannot be assumed to land together.
--
-- No em dashes in this file.

-- 1. Rename. Constraints, indexes and policies follow the table automatically.
ALTER TABLE IF EXISTS public.screening_events RENAME TO events;
ALTER TABLE IF EXISTS public.screening_sessions RENAME TO event_sessions;

-- 2. Columns a listing and a calendar need, and nothing more.
ALTER TABLE public.events
  -- What sort of event this is. The first six values match the categories the
  -- Community calendar already renders, so the static file maps across without
  -- inventing a taxonomy.
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'screening',
  -- One or two sentences for a calendar card. Distinct from a session's
  -- description, which covers a single sitting.
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  -- Multi day events. Null means a single day, given by event_date.
  ADD COLUMN IF NOT EXISTS end_date date,
  -- Price shown on a listing card. is_free is explicit rather than inferred
  -- from a zero or null price, because "free" and "price not published yet"
  -- are different statements and must not render the same way.
  ADD COLUMN IF NOT EXISTS price_from_zar numeric(10,2),
  ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false,
  -- Events we list but do not ticket ourselves. When set, the listing sends
  -- the visitor here instead of into our own seat reservation.
  ADD COLUMN IF NOT EXISTS external_booking_url text,
  -- Who is running it, when that is not us.
  ADD COLUMN IF NOT EXISTS host_name text;

DO $constraints$
BEGIN
  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_kind_check;
  ALTER TABLE public.events ADD CONSTRAINT events_kind_check
    CHECK (kind IN ('screening','workshop','retreat','community','tour','wellness','cleanup','drive','volunteer','other'));

  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_end_after_start;
  ALTER TABLE public.events ADD CONSTRAINT events_end_after_start
    CHECK (end_date IS NULL OR event_date IS NULL OR end_date >= event_date);
EXCEPTION
  WHEN undefined_table THEN
    RAISE NOTICE 'Skipping events constraints, table not present: %', SQLERRM;
END
$constraints$;

-- A calendar always asks the same question: published events, by date.
CREATE INDEX IF NOT EXISTS events_status_date_idx
  ON public.events (status, event_date);

-- 3. Readers. get_event is the general form; get_screening_event stays as a
-- wrapper so a build deployed before this migration keeps working.
CREATE OR REPLACE FUNCTION public.get_event(p_slug text)
RETURNS TABLE (
  event_id uuid, title text, venue text, event_date date, status text,
  kind text, summary text, city text, cover_image_url text, end_date date,
  price_from_zar numeric, is_free boolean, external_booking_url text, host_name text,
  session_id uuid, session_no int, session_title text, session_description text,
  starts_at timestamptz, allocation int, remaining int
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT e.id, e.title, e.venue, e.event_date, e.status,
         e.kind, e.summary, e.city, e.cover_image_url, e.end_date,
         e.price_from_zar, e.is_free, e.external_booking_url, e.host_name,
         s.id, s.session_no, s.title, s.description,
         s.starts_at, s.allocation, s.allocation - s.sold
  FROM public.events e
  LEFT JOIN public.event_sessions s ON s.event_id = e.id
  WHERE e.slug = p_slug
  ORDER BY s.session_no
$$;

-- LEFT JOIN above is deliberate: a community event with no ticketed sessions
-- is a real event and must still be readable. The original INNER JOIN would
-- have returned nothing for it.

CREATE OR REPLACE FUNCTION public.get_screening_event(p_slug text)
RETURNS TABLE (
  event_id uuid, title text, venue text, event_date date, status text,
  session_id uuid, session_no int, session_title text, session_description text,
  starts_at timestamptz, allocation int, remaining int
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT g.event_id, g.title, g.venue, g.event_date, g.status,
         g.session_id, g.session_no, g.session_title, g.session_description,
         g.starts_at, g.allocation, g.remaining
  FROM public.get_event(p_slug) g
$$;

-- 4. Listing reader for the calendar. Published events only, never drafts,
-- and no session detail: a calendar needs one row per event.
CREATE OR REPLACE FUNCTION public.list_published_events(p_from date DEFAULT NULL, p_to date DEFAULT NULL)
RETURNS TABLE (
  id uuid, slug text, title text, summary text, kind text,
  venue text, city text, event_date date, end_date date,
  cover_image_url text, price_from_zar numeric, is_free boolean,
  external_booking_url text, host_name text,
  seats_remaining int
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT e.id, e.slug, e.title, e.summary, e.kind,
         e.venue, e.city, e.event_date, e.end_date,
         e.cover_image_url, e.price_from_zar, e.is_free,
         e.external_booking_url, e.host_name,
         -- Null rather than zero when the event sells no seats through us.
         -- Zero would read as "sold out" on a card.
         NULLIF(COALESCE(SUM(s.allocation - s.sold), 0), 0)::int
  FROM public.events e
  LEFT JOIN public.event_sessions s ON s.event_id = e.id
  WHERE e.status = 'published'
    AND (p_from IS NULL OR e.event_date >= p_from)
    AND (p_to   IS NULL OR e.event_date <= p_to)
  GROUP BY e.id
  ORDER BY e.event_date NULLS LAST, e.title
$$;

-- 5. Seat reservation. Same oversell guard as before: concurrent buyers race
-- on the row lock and the loser gets false.
CREATE OR REPLACE FUNCTION public.reserve_event_seats(p_session_id uuid, p_seats int)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  updated int;
BEGIN
  IF p_seats IS NULL OR p_seats < 1 OR p_seats > 10 THEN
    RETURN false;
  END IF;

  UPDATE public.event_sessions s
  SET sold = s.sold + p_seats
  FROM public.events e
  WHERE s.id = p_session_id
    AND e.id = s.event_id
    AND e.status = 'published'
    AND s.sold + p_seats <= s.allocation;

  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated = 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.reserve_screening_seats(p_session_id uuid, p_seats int)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.reserve_event_seats(p_session_id, p_seats)
$$;

GRANT EXECUTE ON FUNCTION public.get_event(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_screening_event(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_published_events(date, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_event_seats(uuid, int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_screening_seats(uuid, int) TO anon, authenticated;

-- 6. Policies. Renamed tables keep their old policy names, which would now be
-- misleading, so they are replaced. Guarded because fresh preview databases
-- may lack is_accountant_or_admin(), per repo convention.
DO $guard$
BEGIN

-- Old names, carried over by the rename.
DROP POLICY IF EXISTS "Public can view published screening events" ON public.events;
DROP POLICY IF EXISTS "Admins manage screening events" ON public.events;
DROP POLICY IF EXISTS "Public can view sessions of published events" ON public.event_sessions;
DROP POLICY IF EXISTS "Admins manage screening sessions" ON public.event_sessions;

-- New names too. Without these the migration fails on a second run, because
-- CREATE POLICY raises duplicate_object and that is not one of the missing
-- dependency errors the handler below is meant to swallow. Verified by
-- applying this file twice against Postgres 16.
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
DROP POLICY IF EXISTS "Admins manage events" ON public.events;
DROP POLICY IF EXISTS "Public can view sessions of published events" ON public.event_sessions;
DROP POLICY IF EXISTS "Admins manage event sessions" ON public.event_sessions;

CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR public.is_accountant_or_admin(auth.uid()));

CREATE POLICY "Admins manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()))
  WITH CHECK (public.is_accountant_or_admin(auth.uid()));

CREATE POLICY "Public can view sessions of published events"
  ON public.event_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id
      AND (e.status = 'published' OR public.is_accountant_or_admin(auth.uid()))
  ));

CREATE POLICY "Admins manage event sessions"
  ON public.event_sessions FOR ALL
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()))
  WITH CHECK (public.is_accountant_or_admin(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping events policies, missing dependency: %', SQLERRM;
END
$guard$;

-- 7. The existing screening keeps its kind. Nothing else about it changes:
-- its slug, sessions, allocations and draft status are untouched.
UPDATE public.events SET kind = 'screening' WHERE slug = 'stunning-pigs' AND kind IS DISTINCT FROM 'screening';

COMMENT ON TABLE public.events IS
  'Events with sessions and per session capacity. Renamed from screening_events on 30 August 2026; the model was never screening specific. status gates publication, and no row is public until it is published.';
COMMENT ON COLUMN public.events.is_free IS
  'Explicit rather than inferred from price_from_zar, because "free" and "price not published yet" must not render the same way.';
