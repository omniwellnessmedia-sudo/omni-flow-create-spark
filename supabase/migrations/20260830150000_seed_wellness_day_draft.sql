-- Seed the first real event into the events module, as a DRAFT.
--
-- SOURCE. The team's own planning documents in the Omni Drive, read on
-- 30 August 2026: the venue enquiry letter ("planned for Saturday 10 October
-- 2026") and the Wellness Day Outreach Tracker, whose venue row reads
-- "The Lookout, Promenade Road Muizenberg ... Booking confirmed - 10 Oct
-- 2026, 10:00-15:30". The session list below is the letter's own list.
--
-- WHY A DRAFT AND NOT A PUBLISHED EVENT. Two reasons, both deliberate.
--
-- 1. The module's rule is that nothing reaches the public calendar until a
--    person ticks "I have checked this" in /admin/events. Seeding a
--    published row from a migration would be the module's author bypassing
--    the module's own gate on day one.
--
-- 2. A NAMING DECISION IS PENDING, and it is Tumelo's to make, not a
--    migration's. The event is a fundraiser whose proceeds go to the
--    Foundation, and the standing rule is that the commercial site carries
--    no Foundation branding, donation links or Section 18A language. A bare
--    factual calendar listing (what, when, where, how to book) may well be
--    fine; naming the Foundation as host on the commercial site is the open
--    question. host_name is therefore left NULL. Whoever verifies and
--    publishes this event decides, with that rule in front of them, and the
--    event page shows only what the row carries.
--
-- Ticketing is planned via Quicket per the letter. Until that listing
-- exists there is no external URL, so booking_mode is 'enquiry'.
--
-- Idempotent: keyed on slug, safe to replay.
--
-- No em dashes in this file.

INSERT INTO public.events (
  slug, title, kind, summary,
  venue, city, event_date,
  status, booking_mode, is_free, source
)
VALUES (
  'wellness-day-fundraiser-2026',
  'Wellness Day Fundraiser',
  'wellness',
  'A half day, ticketed community wellness event: yoga, Pilates, sound healing and meditation, a men''s wellness and movement circle, and a women''s health and awareness session, facilitated by qualified practitioners.',
  'The Lookout, Promenade Road',
  'Muizenberg',
  '2026-10-10',
  'draft',
  'enquiry',
  false,
  'own'
)
ON CONFLICT (slug) DO NOTHING;
