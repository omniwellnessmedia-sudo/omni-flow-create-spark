-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(_post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.blog_posts
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = _post_id
    AND status = 'published';
$$;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
GRANT EXECUTE ON FUNCTION public.increment_blog_post_views(uuid) TO anon, authenticated;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;
