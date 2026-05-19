-- Extend the realtime publication so AdminDashboard's subscription actually receives
-- events for the tables that drive its stats + alert counts. Without these, the
-- subscription wires up cleanly but never fires, so the badges go stale on every write.
--
-- Each block is idempotent on two axes:
--   1. Skips if the table is already in the publication
--   2. Skips if the table itself doesn't exist (some Supabase projects haven't
--      applied earlier migrations yet — to_regclass returns NULL in that case)

DO $$
BEGIN
  IF to_regclass('public.tour_bookings') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tour_bookings'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_bookings;
    ALTER TABLE public.tour_bookings REPLICA IDENTITY FULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.contact_submissions') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_submissions'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
    ALTER TABLE public.contact_submissions REPLICA IDENTITY FULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.service_quotes') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'service_quotes'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_quotes;
    ALTER TABLE public.service_quotes REPLICA IDENTITY FULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.orders') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    ALTER TABLE public.orders REPLICA IDENTITY FULL;
  END IF;
END $$;
