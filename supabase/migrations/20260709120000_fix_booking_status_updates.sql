-- Feroza QA fix: admin Bookings list was stuck showing "New" for every row.
-- Root cause: (1) no RLS UPDATE policy existed on contact_submissions/service_quotes,
-- so status changes silently failed, and (2) the CHECK constraints only allowed a
-- narrower set of values than the admin UI actually writes.

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_status_check;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('new', 'pending', 'in_progress', 'responded', 'contacted', 'resolved', 'closed', 'archived'));

ALTER TABLE public.service_quotes
  DROP CONSTRAINT IF EXISTS service_quotes_status_check;
ALTER TABLE public.service_quotes
  ADD CONSTRAINT service_quotes_status_check
  CHECK (status IN ('new', 'pending', 'in_progress', 'quoted', 'responded', 'contacted', 'accepted', 'declined', 'resolved', 'closed', 'archived'));

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update service quotes" ON public.service_quotes;
CREATE POLICY "Admins can update service quotes"
ON public.service_quotes
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
