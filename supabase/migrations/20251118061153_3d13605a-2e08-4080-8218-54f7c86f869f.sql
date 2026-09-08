-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
-- Grant admin role to omniwellnessmedia@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('ec7887f9-e0bc-494d-afd6-3779f85021ff', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;
