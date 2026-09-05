-- Take away the one call that can publish unvetted stock to the storefront.
--
-- WHAT THIS CLOSES. auto_curate_featured_products() sets is_featured = true
-- on every active product whose commission is above 15 per cent and whose
-- image_url is merely non-empty. is_featured is the flag the storefront's
-- allowlist reads (src/config/catalogueGate.ts), so that one statement
-- publishes whatever the affiliate feed happens to contain, ranked by what we
-- earn. It is how catalogue photography of a topless model came to sit beside
-- a mirror, a laptop battery and a chemistry textbook on a live collection
-- page in the audit of 28 August 2026.
--
-- WHY A MIGRATION AND NOT JUST A UI CHANGE. The function was created with
-- GRANT EXECUTE TO authenticated (20251110105227), so it was reachable over
-- PostgREST by ANY signed in account, not only by an admin looking at the
-- admin screen. Removing the buttons was necessary and not sufficient: the
-- privilege is the control. src/pages/admin/ProductCuration.tsx recorded that
-- "removing it needs a migration and is noted for the next database change".
-- This is that change.
--
-- The function is dropped rather than left revoked. Nothing calls it: the
-- button was removed from Product Curation in August and from Admin Tools in
-- the commit that carries this file. Featuring is done by a person in
-- /admin/products, one product at a time, having looked at the picture.
-- If a future curation aid is wanted, it should propose candidates for review
-- and must never write is_featured itself.
--
-- Idempotent and safe to replay. Guarded per repo convention so a preview
-- branch that never had the function skips cleanly.
--
-- No em dashes in this file.

DO $revoke_guard$
BEGIN
  -- Revoke first, so the privilege is gone even where something unexpected
  -- holds a dependency on the function and blocks the drop.
  REVOKE EXECUTE ON FUNCTION public.auto_curate_featured_products() FROM anon;
  REVOKE EXECUTE ON FUNCTION public.auto_curate_featured_products() FROM authenticated;
  REVOKE EXECUTE ON FUNCTION public.auto_curate_featured_products() FROM PUBLIC;
EXCEPTION
  WHEN undefined_function OR undefined_object THEN
    RAISE NOTICE 'Skipping auto_curate revoke, function not present: %', SQLERRM;
END
$revoke_guard$;

DROP FUNCTION IF EXISTS public.auto_curate_featured_products();

-- The storefront's own gate is unchanged and still the thing that matters:
-- a product is visible to a shopper only while is_featured is true, and only
-- a person sets it.
COMMENT ON COLUMN public.affiliate_products.is_featured IS
  'Set by a person in /admin/products after looking at the product image. The public storefront shows featured products only. Never set this in bulk: doing so republishes an unvetted third party feed.';
