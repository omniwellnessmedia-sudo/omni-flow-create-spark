-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
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
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;

DO $g3$
BEGIN
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g3$;
