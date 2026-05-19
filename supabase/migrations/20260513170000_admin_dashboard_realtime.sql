-- Extend the realtime publication so AdminDashboard's subscription actually receives
-- events for the tables that drive its stats + alert counts. Without these, the
-- subscription wires up cleanly but never fires, so the badges go stale on every write.
-- Pattern mirrors 20260430141435 — guard each table individually so the migration is idempotent.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tour_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_bookings;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contact_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'service_quotes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_quotes;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;

-- REPLICA IDENTITY FULL so UPDATE events include the previous row state — needed for
-- accurate filtering on the client when only one column changes.
ALTER TABLE public.tour_bookings REPLICA IDENTITY FULL;
ALTER TABLE public.contact_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.service_quotes REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
