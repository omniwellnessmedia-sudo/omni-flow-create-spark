-- STUNNING PIGS screening event: native event + per-session seat inventory.
-- Design notes:
--   * Reuses the blog draft->published pattern (status-gated RLS) and the tours
--     capacity pattern (allocation/sold with an atomic reserve function).
--   * Tickets are sold through the EXISTING cart -> PayPal(ZAR) -> orders flow;
--     these tables only carry the event content + seat inventory.
--   * Seed row ships as status='draft': the page is unlisted and the reserve
--     function refuses to sell until status is flipped to 'published'.

CREATE TABLE IF NOT EXISTS public.screening_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  venue text,
  event_date date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.screening_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.screening_events(id) ON DELETE CASCADE,
  session_no int NOT NULL,
  title text NOT NULL,
  description text,
  starts_at timestamptz,          -- nullable: programme times still being refined
  allocation int NOT NULL CHECK (allocation > 0),
  sold int NOT NULL DEFAULT 0 CHECK (sold >= 0),
  CONSTRAINT sold_within_allocation CHECK (sold <= allocation),
  UNIQUE (event_id, session_no)
);

ALTER TABLE public.screening_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_sessions ENABLE ROW LEVEL SECURITY;

-- Availability reader used by the landing page. SECURITY DEFINER so the unlisted
-- draft page can render real inventory before publish; it exposes nothing beyond
-- the event content + remaining seat counts.
CREATE OR REPLACE FUNCTION public.get_screening_event(p_slug text)
RETURNS TABLE (
  event_id uuid, title text, venue text, event_date date, status text,
  session_id uuid, session_no int, session_title text, session_description text,
  starts_at timestamptz, allocation int, remaining int
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT e.id, e.title, e.venue, e.event_date, e.status,
         s.id, s.session_no, s.title, s.description,
         s.starts_at, s.allocation, s.allocation - s.sold
  FROM public.screening_events e
  JOIN public.screening_sessions s ON s.event_id = e.id
  WHERE e.slug = p_slug
  ORDER BY s.session_no
$$;

-- Atomic seat reservation. Refuses when the event is not published (draft-safety)
-- or when the session lacks capacity. The guarded UPDATE is the oversell stop:
-- concurrent buyers race on the row lock and the loser gets false.
CREATE OR REPLACE FUNCTION public.reserve_screening_seats(p_session_id uuid, p_seats int)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  updated int;
BEGIN
  IF p_seats IS NULL OR p_seats < 1 OR p_seats > 10 THEN
    RETURN false;
  END IF;

  UPDATE public.screening_sessions s
  SET sold = s.sold + p_seats
  FROM public.screening_events e
  WHERE s.id = p_session_id
    AND e.id = s.event_id
    AND e.status = 'published'
    AND s.sold + p_seats <= s.allocation;

  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated = 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_screening_event(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_screening_seats(uuid, int) TO anon, authenticated;

-- Policies reference is_accountant_or_admin(), which fresh preview databases may
-- lack (its own migration guards itself out there) — so guard, per repo convention.
DO $guard$
BEGIN

DROP POLICY IF EXISTS "Public can view published screening events" ON public.screening_events;
CREATE POLICY "Public can view published screening events"
  ON public.screening_events FOR SELECT
  USING (status = 'published' OR public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage screening events" ON public.screening_events;
CREATE POLICY "Admins manage screening events"
  ON public.screening_events FOR ALL
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()))
  WITH CHECK (public.is_accountant_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Public can view sessions of published events" ON public.screening_sessions;
CREATE POLICY "Public can view sessions of published events"
  ON public.screening_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.screening_events e
    WHERE e.id = event_id
      AND (e.status = 'published' OR public.is_accountant_or_admin(auth.uid()))
  ));

DROP POLICY IF EXISTS "Admins manage screening sessions" ON public.screening_sessions;
CREATE POLICY "Admins manage screening sessions"
  ON public.screening_sessions FOR ALL
  TO authenticated
  USING (public.is_accountant_or_admin(auth.uid()))
  WITH CHECK (public.is_accountant_or_admin(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping screening_events policies — missing dependency: %', SQLERRM;
END
$guard$;

-- Seed: STUNNING PIGS, draft, 3 sessions x 169 seats (Omni sells the full house
-- as the event's main marketer). Idempotent for preview replays.
DO $seed$
DECLARE
  v_event_id uuid;
BEGIN
  INSERT INTO public.screening_events (slug, title, venue, event_date, status)
  VALUES (
    'stunning-pigs',
    'STUNNING PIGS — a Women''s Day screening & public education event',
    'The Masque Theatre, 37 Main Road, Muizenberg',
    '2026-08-08',
    'draft'
  )
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_event_id FROM public.screening_events WHERE slug = 'stunning-pigs';

  INSERT INTO public.screening_sessions (event_id, session_no, title, description, allocation)
  VALUES
    (v_event_id, 1, 'Women & Community Empowerment',
     'Opening session celebrating Women''s Day: women leading community change, animal protection, and public education.', 169),
    (v_event_id, 2, 'STUNNING PIGS — Film & Q&A',
     'The main feature: the STUNNING PIGS documentary on high-concentration CO2 gas stunning of pigs, followed by a public Q&A with the BWC campaign and G.A.R.D.', 169),
    (v_event_id, 3, 'Ecosystem & Ethical Travel',
     'Closing session on ecosystems and ethical travel with Travel and Tours Cape Town and Chief Kingsley.', 169)
  ON CONFLICT (event_id, session_no) DO NOTHING;
END
$seed$;
