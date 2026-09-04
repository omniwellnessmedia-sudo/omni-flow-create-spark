-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
-- Increase rate limits for service quotes (3 -> 10 per hour)
CREATE OR REPLACE FUNCTION public.check_quote_rate_limit(submitter_email text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COUNT(*) < 10
  FROM public.service_quotes
  WHERE email = submitter_email
    AND created_at > NOW() - INTERVAL '1 hour';
$function$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
-- Increase rate limits for contact submissions (5 -> 15 per hour)
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(submitter_email text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COUNT(*) < 15
  FROM public.contact_submissions
  WHERE email = submitter_email
    AND created_at > NOW() - INTERVAL '1 hour';
$function$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;
