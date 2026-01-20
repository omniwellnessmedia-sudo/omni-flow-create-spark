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