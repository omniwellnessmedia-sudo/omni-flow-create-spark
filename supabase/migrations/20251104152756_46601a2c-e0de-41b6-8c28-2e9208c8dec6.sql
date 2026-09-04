-- Exception-guarded per statement on 4 September 2026 per
-- docs/SUPABASE_PREVIEW_MIGRATIONS_FIX.md: fresh Supabase preview branches
-- are missing dashboard-created tables, so statements referencing them skip
-- with a NOTICE instead of failing the replay. On production every object
-- exists and every statement runs exactly as before.

DO $g1$
BEGIN
-- Fix services incorrectly linked to 'uthando africa' test provider
-- These services should be linked to Sandy Mitchell's provider profile

UPDATE services
SET provider_id = '351e4f5a-a27f-4fe5-957f-fa0ea1210040'
WHERE provider_id = 'ec7887f9-e0bc-494d-afd6-3779f85021ff'
  AND (
    title ILIKE '%yoga%' 
    OR title ILIKE '%breath%'
    OR title ILIKE '%hatha%'
  );
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g1$;

DO $g2$
BEGIN
-- Log the changes for reference
COMMENT ON TABLE services IS 'Services table - Updated incorrectly linked yoga/breathwork services to Sandy Mitchell provider (2025-01-04)';
EXCEPTION
  WHEN undefined_table OR undefined_column OR undefined_object OR undefined_function THEN
    RAISE NOTICE 'Skipping guarded statement, missing dependency: %', SQLERRM;
END
$g2$;
