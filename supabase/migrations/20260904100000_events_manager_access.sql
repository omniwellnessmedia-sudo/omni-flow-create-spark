-- Let the people who run events actually run them, and stop drafts leaking.
--
-- THREE DEFECTS, FOUND TOGETHER ON 4 SEPTEMBER 2026 WHILE DIAGNOSING WHY
-- FEROZA COULD NOT SAVE AN EVENT.
--
-- 1. THE ROLE MISMATCH. The /admin/events route admits catalogue managers,
--    but every write policy on events, event_sessions, event_submissions and
--    event_sources demands is_accountant_or_admin(). A catalogue manager can
--    open the events desk, fill in the form, and have the database refuse the
--    insert. That is exactly what Feroza reported: she cannot save her
--    events. The fix is a proper is_events_manager() helper that admits
--    catalogue managers alongside accountants and admins, used consistently
--    across the module.
--
-- 2. THE READER DROPS THE BOOKING MODE. get_event never returned source,
--    booking_mode, listing_tier or organiser_name, but src/lib/events.ts
--    reads all four. Every event page therefore fell back to booking_mode
--    'none' and rendered NO booking action at all, whatever the row said.
--    An events platform whose event pages cannot show a booking button is
--    not a platform. The function is widened; fee_payer and fee_bps ride
--    along so the ticket panel can show the attendee fee honestly.
--
-- 3. DRAFTS WERE PUBLIC. get_event is SECURITY DEFINER and had no status
--    filter, so any visitor who knew a slug could read a draft event. The
--    module's founding rule is that nothing is public until a person has
--    checked and published it; the reader now enforces the same rule as
--    list_published_events, except for events managers, who see drafts
--    because checking drafts is their job.
--
-- Also here, because they are one-line data corrections that belong with
-- this deploy:
--   * The Wellness Day Fundraiser gains its real Quicket booking link, but
--     only if nobody has set a link already.
--   * Faithful to Nature affiliate products are deactivated. Feroza
--     confirmed on 31 August that no affiliate relationship exists.
--
-- Idempotent: safe to replay. Guarded per repo convention so fresh preview
-- databases without the referenced objects skip cleanly.
--
-- No em dashes in this file.

-- ---------------------------------------------------------------------------
-- 1. The events manager helper
-- ---------------------------------------------------------------------------

DO $helper$
BEGIN

CREATE OR REPLACE FUNCTION public.is_events_manager(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = is_events_manager.user_id
      -- Compared as text, same reason as is_catalogue_manager: an enum value
      -- added in the same transaction cannot be referenced as a literal.
      -- catalogue_manager is included deliberately: the same team curates
      -- the catalogue and the calendar. accountant keeps the access it
      -- already had, so nobody loses a capability in this migration.
      AND ur.role::text IN ('catalogue_manager', 'accountant', 'admin', 'super_admin')
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_events_manager(uuid) TO authenticated, anon;

EXCEPTION
  WHEN undefined_table OR undefined_object THEN
    RAISE NOTICE 'Skipping is_events_manager, missing dependency: %', SQLERRM;
END
$helper$;

-- ---------------------------------------------------------------------------
-- 2. Policies: same shape as before, wider gate
-- ---------------------------------------------------------------------------

DO $policies$
BEGIN

-- events
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
DROP POLICY IF EXISTS "Admins manage events" ON public.events;
DROP POLICY IF EXISTS "Events managers manage events" ON public.events;

CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR public.is_events_manager(auth.uid()));

CREATE POLICY "Events managers manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.is_events_manager(auth.uid()))
  WITH CHECK (public.is_events_manager(auth.uid()));

-- event_sessions
DROP POLICY IF EXISTS "Public can view sessions of published events" ON public.event_sessions;
DROP POLICY IF EXISTS "Admins manage event sessions" ON public.event_sessions;
DROP POLICY IF EXISTS "Events managers manage event sessions" ON public.event_sessions;

CREATE POLICY "Public can view sessions of published events"
  ON public.event_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_id
      AND (e.status = 'published' OR public.is_events_manager(auth.uid()))
  ));

CREATE POLICY "Events managers manage event sessions"
  ON public.event_sessions FOR ALL
  TO authenticated
  USING (public.is_events_manager(auth.uid()))
  WITH CHECK (public.is_events_manager(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping events policies, missing dependency: %', SQLERRM;
END
$policies$;

DO $moderation$
BEGIN

-- event_submissions: reading and moderating the queue. The public INSERT
-- policy is untouched; proposing an event was never restricted.
DROP POLICY IF EXISTS "Staff read submissions" ON public.event_submissions;
CREATE POLICY "Staff read submissions"
  ON public.event_submissions FOR SELECT
  TO authenticated
  USING (public.is_events_manager(auth.uid()));

DROP POLICY IF EXISTS "Staff moderate submissions" ON public.event_submissions;
CREATE POLICY "Staff moderate submissions"
  ON public.event_submissions FOR UPDATE
  TO authenticated
  USING (public.is_events_manager(auth.uid()))
  WITH CHECK (public.is_events_manager(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping event_submissions policies, missing dependency: %', SQLERRM;
END
$moderation$;

DO $history$
BEGIN

-- event_revisions: read only widens. UPDATE and DELETE stay revoked; the
-- history being unrewritable is the module's whole promise.
DROP POLICY IF EXISTS "Admins read event history" ON public.event_revisions;
CREATE POLICY "Admins read event history"
  ON public.event_revisions FOR SELECT
  TO authenticated
  USING (public.is_events_manager(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping event_revisions policy, missing dependency: %', SQLERRM;
END
$history$;

DO $sources$
BEGIN

DROP POLICY IF EXISTS "Staff manage event sources" ON public.event_sources;
CREATE POLICY "Staff manage event sources"
  ON public.event_sources FOR ALL
  TO authenticated
  USING (public.is_events_manager(auth.uid()))
  WITH CHECK (public.is_events_manager(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping event_sources policy, missing dependency: %', SQLERRM;
END
$sources$;

-- ---------------------------------------------------------------------------
-- 3. get_event: return what the page reads, hide what the public must not see
-- ---------------------------------------------------------------------------

-- Dropped rather than replaced: the return type widens, and CREATE OR
-- REPLACE cannot change a function's return type. get_screening_event is
-- recreated afterwards because it selects from this one.
DROP FUNCTION IF EXISTS public.get_event(text);

CREATE FUNCTION public.get_event(p_slug text)
RETURNS TABLE (
  event_id uuid, title text, venue text, event_date date, status text,
  kind text, summary text, city text, cover_image_url text, end_date date,
  price_from_zar numeric, is_free boolean, external_booking_url text, host_name text,
  source text, booking_mode text, listing_tier text, organiser_name text,
  fee_payer text, fee_bps int,
  session_id uuid, session_no int, session_title text, session_description text,
  starts_at timestamptz, allocation int, remaining int
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT e.id, e.title, e.venue, e.event_date, e.status,
         e.kind, e.summary, e.city, e.cover_image_url, e.end_date,
         e.price_from_zar, e.is_free, e.external_booking_url, e.host_name,
         e.source, e.booking_mode, e.listing_tier, e.organiser_name,
         e.fee_payer, e.fee_bps,
         s.id, s.session_no, s.title, s.description,
         s.starts_at, s.allocation, s.allocation - s.sold
  FROM public.events e
  LEFT JOIN public.event_sessions s ON s.event_id = e.id
  WHERE e.slug = p_slug
    -- Drafts are not public. Events managers see them because checking
    -- drafts is their job; everyone else gets the same nothing an unknown
    -- slug gets, so a draft's existence is not confirmed either way.
    AND (e.status = 'published' OR public.is_events_manager(auth.uid()))
  ORDER BY s.session_no
$$;

DROP FUNCTION IF EXISTS public.get_screening_event(text);

CREATE FUNCTION public.get_screening_event(p_slug text)
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

GRANT EXECUTE ON FUNCTION public.get_event(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_screening_event(text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Data corrections that ship with this deploy
-- ---------------------------------------------------------------------------

DO $data$
BEGIN

-- The Wellness Day Fundraiser's ticketing went live on Quicket, so the
-- listing can now send people somewhere real. Guarded on the link being
-- unset: if the team has already pointed the event somewhere, a migration
-- does not overwrite a person's decision. Publishing remains manual.
UPDATE public.events
   SET booking_mode = 'external',
       external_booking_url = 'https://www.quicket.co.za/events/389529-dr-phil-afel-foundation-wellness-day-fundraiser/'
 WHERE slug = 'wellness-day-fundraiser-2026'
   AND external_booking_url IS NULL;

-- Listing facts from the live Quicket listing, which Tumelo pasted in full
-- on 4 September 2026: five 45 minute sessions from 10:30 to 15:30 at The
-- Lookout, Zandvlei (57 Promenade Rd, Muizenberg), tickets from R125, run
-- by the Dr Phil-Afel Foundation. host_name was left NULL by the seed
-- because the naming decision was Tumelo's; his instruction to use the
-- published listing's wording is that decision, and the guard on
-- host_name IS NULL means a later manual change is never overwritten.
UPDATE public.events
   SET host_name = 'Dr Phil-Afel Foundation',
       venue = 'The Lookout, Zandvlei',
       summary = 'Five 45 minute sessions of movement, breath and sound at The Lookout, Zandvlei: Pilates, Hatha Yoga, Qi cultivation and breathwork, movement and play, and Yin Yoga with a restorative sound journey. Come for one session, choose a few, or spend the full day.',
       price_from_zar = 125.00,
       is_free = false
 WHERE slug = 'wellness-day-fundraiser-2026'
   AND host_name IS NULL;

EXCEPTION
  WHEN undefined_table OR undefined_column THEN
    RAISE NOTICE 'Skipping Wellness Day booking link, missing dependency: %', SQLERRM;
END
$data$;

DO $ftn$
BEGIN

-- No affiliate relationship exists with Faithful to Nature (Feroza,
-- 31 August 2026). Their products must not show in the shop, and the
-- config entry is removed from the codebase in the same commit.
UPDATE public.affiliate_products
   SET is_active = false, is_featured = false
 WHERE affiliate_program_id = 'faithful_to_nature'
   AND (is_active IS DISTINCT FROM false OR is_featured IS DISTINCT FROM false);

EXCEPTION
  WHEN undefined_table OR undefined_column THEN
    RAISE NOTICE 'Skipping Faithful to Nature cleanup, missing dependency: %', SQLERRM;
END
$ftn$;

COMMENT ON FUNCTION public.is_events_manager(uuid) IS
  'True for catalogue_manager, accountant, admin and super_admin. The gate for managing the events module; the same team curates the catalogue and the calendar.';
