-- Two production fixes confirmed by QA screenshots (16 Jul):
--
-- 1. Video uploads fail while image uploads succeed: the provider-profiles
--    bucket was created with an image-only allowed_mime_types list
--    (20250702133654), so storage rejects every video before RLS is even
--    consulted. Extend the allowlist to the video formats the Media Library
--    dialog accepts.
--
-- 2. "Failed to update lead" on the live admin: the contact_submissions
--    admin-UPDATE policy (20260706120000) is not present in production —
--    the GitHub integration only applies migrations to preview branches.
--    Re-asserted here idempotently; also safe to run directly in the SQL
--    editor.

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml','image/heic','image/heif','image/bmp',
  'video/mp4','video/quicktime','video/webm','video/x-m4v','video/mpeg','video/x-msvideo','video/x-matroska','video/ogg','video/3gpp'
]
WHERE id = 'provider-profiles';

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
