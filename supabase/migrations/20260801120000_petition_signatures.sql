-- STUNNING PIGS petition: signature capture + an honest, real-only counter.
--
-- Design notes:
--   * This is the second conversion goal on /events/stunning-pigs. Signing needs
--     no ticket, so the write path is the public `sign-petition` edge function
--     using SUPABASE_SERVICE_ROLE_KEY — NOT a public INSERT policy. Compare
--     contact_submissions, which does have a public rate-limited INSERT policy;
--     that pattern is deliberately NOT copied here (see the RLS section).
--   * The counter seeds at ZERO and is only ever the true count. There is no
--     `base`, no `offset`, no `display_total`. The design prototype's hard-coded
--     BASE = 1284 of fake social proof is explicitly rejected by the owner, and
--     this schema gives it nowhere to live: get_petition_count() returns
--     petition_counters.total unmodified, and recount_petition() can only ever
--     set that column to COUNT(*). Adding an offset would require changing this
--     migration, not flipping a config value.
--   * POPIA (Act 4 of 2013) applies — South African personal data. Omni Wellness
--     Media collects; Beauty Without Cruelty SA and G.A.R.D. are the responsible
--     parties who receive the petition and present it to regulators/industry.
--     Every column below is justified against the §10 minimality principle;
--     user_agent, raw IP, referrer, UTM and phone were considered and dropped.
--   * citext is NOT installed in this project. Email is normalised to lowercase
--     in the edge function, enforced by a CHECK, and deduped by a functional
--     unique index on lower(email).
--   * Style follows 20260705120000_screening_events.sql (IF NOT EXISTS tables,
--     SECURITY DEFINER ... SET search_path = public readers, explicit GRANT
--     EXECUTE, policies inside a DO $guard$ block) and the rate-limit helper
--     shape of check_contact_rate_limit (20251024114906_*.sql:60).

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.petition_signatures (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Scopes the unique index and the counter so a second petition never needs a
  -- second table. Validated against a hard-coded allowlist in the edge function
  -- so a client cannot mint arbitrary counter rows.
  petition_slug      text NOT NULL DEFAULT 'stunning-pigs',
  -- The petition IS the list of names. Kept as parts (not a denormalised
  -- full_name) because BWC/G.A.R.D. sort by surname and corrections are
  -- per-person. Over-length names are REJECTED by the edge function, never
  -- silently truncated — quietly shortening someone's surname on a petition is
  -- not acceptable.
  first_name         text NOT NULL
    CONSTRAINT petition_signatures_first_name_len
    CHECK (length(btrim(first_name)) BETWEEN 1 AND 80),
  surname            text NOT NULL
    CONSTRAINT petition_signatures_surname_len
    CHECK (length(btrim(surname)) BETWEEN 1 AND 80),
  -- Verifiability (a petition of unverifiable signatures is worthless to a
  -- regulator), the dedupe key, and the channel for a correction/withdrawal
  -- request. NEVER published. Lowercase is enforced here so the functional
  -- unique index below cannot be defeated by a case variant.
  email              text NOT NULL
    CONSTRAINT petition_signatures_email_shape
    CHECK (length(email) <= 254 AND email = lower(email)),
  -- Optional. SA regulators weight provincial spread, so geographic reach makes
  -- the petition materially stronger — but it is never required to sign.
  city               text
    CONSTRAINT petition_signatures_city_len
    CHECK (city IS NULL OR length(city) <= 80),
  -- Marketing consent: separate from, and not a condition of, signing.
  -- Unchecked by default in the UI and false by default here.
  updates_consent    boolean NOT NULL DEFAULT false,
  -- POPIA requires demonstrable consent — including WHEN it was given.
  updates_consent_at timestamptz,
  -- WHICH wording the person agreed to. Server-owned constant in the edge
  -- function. Without this, editing the on-page copy retroactively destroys the
  -- evidentiary value of every prior signature. Each value must correspond to a
  -- committed verbatim copy under supabase/migrations/consent-texts/.
  consent_version    text NOT NULL,
  -- Which surface produced the signature (page, embed, QR). Campaign
  -- attribution, and lets one abused channel be rolled back on its own.
  source             text NOT NULL DEFAULT 'stunning-pigs-page'
    CONSTRAINT petition_signatures_source_len CHECK (length(source) <= 60),
  -- Salted SHA-256 of the client IP — NOT a raw IP. Enables per-IP throttling
  -- and bulk removal of a flood without retaining an identifier re-linkable to
  -- a person absent the secret salt. track-affiliate-click/index.ts:166 stores
  -- raw IPs; that is the weaker precedent and is deliberately not followed.
  -- NULL when PETITION_IP_SALT is absent or too short: an unsalted hash of an
  -- IPv4 address is brute-forceable over 2^32 and would be a raw IP in a
  -- costume — worse than storing nothing, because it looks compliant.
  ip_hash            text
    CONSTRAINT petition_signatures_ip_hash_len
    CHECK (ip_hash IS NULL OR length(ip_hash) = 64),
  -- Right to withdraw. Excluded from the count by the trigger below.
  withdrawn_at       timestamptz,
  -- The signing timestamp — this IS the petition-consent timestamp.
  created_at         timestamptz NOT NULL DEFAULT now(),
  -- Makes an unevidenced marketing consent structurally impossible to store:
  -- consent true without a timestamp, or a timestamp without consent, both fail.
  CONSTRAINT updates_consent_at_matches_flag
    CHECK ((updates_consent = false AND updates_consent_at IS NULL)
        OR (updates_consent = true  AND updates_consent_at IS NOT NULL))
);

COMMENT ON TABLE public.petition_signatures IS
  'Signatures for the STUNNING PIGS petition. Personal data under POPIA: names, '
  'emails and an implied political position on animal welfare. No anon or '
  'authenticated role may read it; the only writer is the sign-petition edge '
  'function via the service role. Not replicated to Realtime.';
COMMENT ON COLUMN public.petition_signatures.email IS
  'Never published. Verification, dedupe and correction/withdrawal contact only.';
COMMENT ON COLUMN public.petition_signatures.ip_hash IS
  'Salted SHA-256 (PETITION_IP_SALT), never a raw IP. NULL when no usable salt.';
COMMENT ON COLUMN public.petition_signatures.consent_version IS
  'Points at an archived verbatim copy of the consent wording shown at signing.';
COMMENT ON COLUMN public.petition_signatures.withdrawn_at IS
  'Set on withdrawal; the counter trigger decrements automatically. Never edit '
  'petition_counters.total by hand.';

-- O(1) counter. Seeded at 0. No base/offset/display column exists by design.
CREATE TABLE IF NOT EXISTS public.petition_counters (
  slug       text PRIMARY KEY,
  total      bigint NOT NULL DEFAULT 0
    CONSTRAINT petition_counters_total_non_negative CHECK (total >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.petition_counters IS
  'Live signature count per petition, maintained solely by trg_petition_counter '
  'and repairable only by recount_petition(). Seeded at 0 — never pre-loaded, '
  'estimated, rounded or offset. The page states this to the visitor.';

INSERT INTO public.petition_counters (slug, total)
VALUES ('stunning-pigs', 0)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------

-- Dedupe key, scoped per petition. This is what makes a retry after a timeout
-- that actually committed safe: the second attempt hits this index, the edge
-- function swallows 23505, and the signer is not double-counted.
CREATE UNIQUE INDEX IF NOT EXISTS petition_signatures_slug_email_key
  ON public.petition_signatures (petition_slug, lower(email));

-- Admin listing / CSV hand-over to BWC and G.A.R.D.
CREATE INDEX IF NOT EXISTS petition_signatures_created_at_idx
  ON public.petition_signatures (petition_slug, created_at DESC);

-- Per-IP throttle lookups. Partial, so rows written while PETITION_IP_SALT was
-- absent (ip_hash NULL) stay out of the index entirely.
CREATE INDEX IF NOT EXISTS petition_signatures_ip_hash_idx
  ON public.petition_signatures (ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;

-- No index supports the count: the count is a single primary-key lookup on
-- petition_counters, never an aggregate over this table.

-- ---------------------------------------------------------------------------
-- 3. Counter maintenance
-- ---------------------------------------------------------------------------

-- Runs inside the inserting transaction, so the edge function's post-insert read
-- of the counter is already consistent — the number the signer is shown is the
-- real one, with no second round trip and no eventual-consistency window.
--
-- Known limitation: this does not rebalance if petition_slug itself is UPDATEd
-- on an existing row. Nothing in the application does that (the edge function
-- never updates the slug, and only admins can UPDATE at all); if it ever happens
-- by hand, SELECT public.recount_petition(<slug>) is the sanctioned repair.
CREATE OR REPLACE FUNCTION public.sync_petition_counter()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.withdrawn_at IS NULL THEN
      INSERT INTO public.petition_counters (slug, total, updated_at)
      VALUES (NEW.petition_slug, 1, now())
      ON CONFLICT (slug) DO UPDATE
        SET total = public.petition_counters.total + 1, updated_at = now();
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Withdrawal: decrement. GREATEST(...,0) keeps the CHECK satisfiable even if
    -- the counter has somehow drifted low; recount_petition() is the real fix.
    IF OLD.withdrawn_at IS NULL AND NEW.withdrawn_at IS NOT NULL THEN
      UPDATE public.petition_counters
        SET total = GREATEST(total - 1, 0), updated_at = now()
      WHERE slug = NEW.petition_slug;
    -- Withdrawal reversed (person asks to be put back on): increment.
    ELSIF OLD.withdrawn_at IS NOT NULL AND NEW.withdrawn_at IS NULL THEN
      UPDATE public.petition_counters
        SET total = total + 1, updated_at = now()
      WHERE slug = NEW.petition_slug;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    -- Full erasure request. Already-withdrawn rows were decremented once
    -- already, so they must not be decremented twice.
    IF OLD.withdrawn_at IS NULL THEN
      UPDATE public.petition_counters
        SET total = GREATEST(total - 1, 0), updated_at = now()
      WHERE slug = OLD.petition_slug;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_petition_counter ON public.petition_signatures;
CREATE TRIGGER trg_petition_counter
  AFTER INSERT OR UPDATE OR DELETE ON public.petition_signatures
  FOR EACH ROW EXECUTE FUNCTION public.sync_petition_counter();

-- ---------------------------------------------------------------------------
-- 4. Readers
-- ---------------------------------------------------------------------------

-- The ONLY function on this data that anon may execute. Its return type is
-- bigint: it cannot leak a name, an email, a city or an ip_hash, and it cannot
-- be broken down by any of them. COALESCE(..., 0) means an unknown slug returns
-- a real zero rather than NULL, so the page renders "Be the first to sign"
-- instead of a spinner or a fabricated placeholder.
-- Adding a SECOND anon-executable function over this data requires re-reviewing
-- the RLS section below.
CREATE OR REPLACE FUNCTION public.get_petition_count(p_slug text DEFAULT 'stunning-pigs')
RETURNS bigint
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE((SELECT total FROM public.petition_counters WHERE slug = p_slug), 0);
$$;

REVOKE ALL ON FUNCTION public.get_petition_count(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_petition_count(text) TO anon, authenticated;

-- Drift reconciliation. Run after any bulk admin deletion, or after a manual
-- slug edit. This is the only sanctioned way to change petition_counters.total
-- outside the trigger, and it can only ever set it to the true count — there is
-- no argument by which it could inflate the number.
CREATE OR REPLACE FUNCTION public.recount_petition(p_slug text)
RETURNS bigint
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_total bigint;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM public.petition_signatures
  WHERE petition_slug = p_slug AND withdrawn_at IS NULL;

  INSERT INTO public.petition_counters (slug, total, updated_at)
  VALUES (p_slug, v_total, now())
  ON CONFLICT (slug) DO UPDATE SET total = EXCLUDED.total, updated_at = now();

  RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.recount_petition(text) FROM public;
GRANT EXECUTE ON FUNCTION public.recount_petition(text) TO service_role;

-- Per-IP throttle, mirroring check_contact_rate_limit's shape. 5/hour and 20/day
-- are deliberately generous: SA mobile carriers CGNAT aggressively, and a
-- screening-venue foyer or a school computer lab shares one egress IP. These
-- limits stop a script, not a family. A NULL hash (no salt configured) passes,
-- because the alternative is refusing genuine signatures.
--
-- service_role ONLY — never anon. A boolean answer keyed on an IP hash is itself
-- a probe, and this endpoint is otherwise unauthenticated.
CREATE OR REPLACE FUNCTION public.check_petition_ip_rate(p_ip_hash text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p_ip_hash IS NULL OR (
    (SELECT COUNT(*) FROM public.petition_signatures
      WHERE ip_hash = p_ip_hash AND created_at > now() - interval '1 hour') < 5
    AND
    (SELECT COUNT(*) FROM public.petition_signatures
      WHERE ip_hash = p_ip_hash AND created_at > now() - interval '24 hours') < 20
  );
$$;

REVOKE ALL ON FUNCTION public.check_petition_ip_rate(text) FROM public;
GRANT EXECUTE ON FUNCTION public.check_petition_ip_rate(text) TO service_role;

-- ---------------------------------------------------------------------------
-- 5. RLS
-- ---------------------------------------------------------------------------
-- Design principle: THE PUBLISHABLE KEY HAS NO PATH TO A ROW.
--
-- This table is a register of who publicly opposes an industry practice. Under
-- POPIA that is ordinary personal information, but it is precisely the kind of
-- inference that makes people targets, so the bar here is higher than for the
-- newsletter or contact tables.

ALTER TABLE public.petition_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petition_counters   ENABLE ROW LEVEL SECURITY;

-- Defence in depth. Supabase's default privileges grant anon/authenticated on
-- new public-schema tables; stripping those means PostgREST returns a hard 403
-- at the API layer rather than an empty 200 that some future, sloppier policy
-- could quietly start filling with rows. service_role keeps its grants (and
-- bypasses RLS), which is how the edge function writes.
REVOKE ALL ON public.petition_signatures FROM anon, authenticated;
REVOKE ALL ON public.petition_counters   FROM anon, authenticated;

-- Policies reference public.is_admin(), which fresh Supabase preview branches
-- may lack (its own migration guards itself out there) — so guard, per repo
-- convention. On a branch without is_admin the tables still end up RLS-enabled
-- with ZERO policies, which denies everyone: failing closed, as it should.
DO $guard$
BEGIN

-- WHY: the campaign hand-over to Beauty Without Cruelty SA and G.A.R.D. is a CSV
-- export performed by an admin. Nobody else — no anon visitor, no ordinary
-- signed-in user — has any read path to a name, an email, a city or an ip_hash.
DROP POLICY IF EXISTS "Admins can view petition signatures" ON public.petition_signatures;
CREATE POLICY "Admins can view petition signatures"
  ON public.petition_signatures FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- WHY: POPIA data-subject rights have to be actionable by a human. Withdrawal
-- (set withdrawn_at, blank the name), correction, and full erasure (DELETE) all
-- run through an admin on request to omniwellnessmedia@gmail.com. The counter
-- trigger keeps the public number honest in every one of those cases, so nobody
-- ever needs to touch petition_counters.total by hand.
DROP POLICY IF EXISTS "Admins can manage petition signatures" ON public.petition_signatures;
CREATE POLICY "Admins can manage petition signatures"
  ON public.petition_signatures FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- WHY: admins need the raw counter row for reconciliation against the export.
-- The public does NOT read this table directly — it calls get_petition_count(),
-- which returns a bare bigint.
DROP POLICY IF EXISTS "Admins can view petition counters" ON public.petition_counters;
CREATE POLICY "Admins can view petition counters"
  ON public.petition_counters FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping petition policies — missing dependency: %', SQLERRM;
END
$guard$;

-- That is the COMPLETE policy set. What is absent is load-bearing:
--
--   * NO INSERT policy for anon or authenticated. contact_submissions has a
--     public rate-limited INSERT policy; this table must not. The only writer is
--     the sign-petition edge function holding SUPABASE_SERVICE_ROLE_KEY, which
--     bypasses RLS. Do not add a public INSERT policy "to make testing easier" —
--     a public INSERT combined with any future permissive SELECT is a full
--     breach, and it would also let anyone forge signatures.
--
--   * NO SELECT policy grants anon anything, on either table, ever. RLS with no
--     permissive policy denies by default; the REVOKE above turns that into a
--     403 instead of an empty result set.
--
--   * NO VIEW over petition_signatures. A view owned by postgres runs with the
--     owner's privileges and silently bypasses the base table's RLS unless it is
--     declared security_invoker. If an admin dashboard later needs a shaped
--     read, add another SECURITY DEFINER function that checks
--     public.is_admin(auth.uid()) in its own body and returns only the columns
--     it needs.
--
--   * NO Realtime. Do NOT add petition_signatures (or petition_counters) to the
--     supabase_realtime publication. 20260513170000_admin_dashboard_realtime.sql
--     does that for other tables; replicating these rows to subscribers is
--     exactly the leak this section exists to prevent. A live-ticking count
--     should poll get_petition_count() instead.
