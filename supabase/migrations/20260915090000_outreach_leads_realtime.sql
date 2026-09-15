-- Walk-ins and outreach conversations appear on the Pipeline without a refresh.
--
-- The May realtime migration put contact_submissions, service_quotes,
-- tour_bookings and orders in the supabase_realtime publication and left
-- outreach_leads out, because at the time no admin screen watched it. The
-- Pipeline and the Today board now do, so a walk-in typed on one phone
-- reaches the board on another. lead_activities joins for the same reason:
-- the drawer's timeline and the quote list read it.

DO $rt$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'outreach_leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.outreach_leads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'lead_activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_activities;
  END IF;
EXCEPTION
  WHEN undefined_table OR undefined_object OR invalid_schema_name THEN
    RAISE NOTICE 'Skipping realtime publication change, missing dependency: %', SQLERRM;
END
$rt$;
