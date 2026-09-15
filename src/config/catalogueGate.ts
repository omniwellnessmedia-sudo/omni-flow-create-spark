/**
 * Curation gate for the affiliate product feed.
 *
 * WHY THIS EXISTS. The storefront rendered an unvetted third party product
 * feed directly to shoppers. A live audit on 28 August 2026 found catalogue
 * photography of a topless model on a collection page and again on a product
 * page, beside a R5,438 mirror, a bamboo lamp shade, a Lenovo Yoga laptop
 * battery, an organic chemistry textbook and a 1976 rock album. All of them
 * had matched the feed on ordinary English words: natural, organic, yoga.
 *
 * Text filters were tightened first (src/lib/productFilters.ts) and they are
 * still worth having, but they cannot win this. Three of the four items in
 * that screenshot pass the tightened filter, because their names genuinely
 * contain the word "Natural". More importantly, what made the apparel
 * listing unpublishable was its photograph, and no text filter can see a
 * photograph.
 *
 * So the storefront now works from an allowlist rather than a blocklist. A
 * product appears to a shopper only once a person has featured it in the
 * admin Product Curation screen, which sets is_featured on the row. The
 * mechanism already existed and was simply not enforced.
 *
 * SAFE BY DEFAULT. The gate is ON unless explicitly disabled, so a missing
 * environment variable fails towards showing less, never towards showing an
 * unvetted feed. Set VITE_UNCURATED_CATALOGUE to the literal string "true"
 * only for local work on the feed itself, and never in production.
 *
 * ADMIN SURFACES ARE NOT GATED. Curation screens must see everything in
 * order to curate it. This applies to shopper facing reads only.
 *
 * Expect the storefront to look sparse until the team features products.
 * That is the intended state: an empty shelf is recoverable, the alternative
 * is not.
 */

export const CURATED_ONLY =
  import.meta.env.VITE_UNCURATED_CATALOGUE !== 'true';

/**
 * Apply the gate to a Supabase query builder for affiliate_products.
 * Call on every shopper facing read. Chainable, so it drops into an existing
 * query without restructuring it.
 *
 * PASS IT A SELECT, NOT A TABLE. .eq() lives on the filter builder that
 * .select() returns, not on the table builder that .from() returns, so
 *
 *   curatedOnly(supabase.from('affiliate_products').select('*')).eq(...)
 *
 * is right and
 *
 *   curatedOnly(supabase.from('affiliate_products')).select('*')
 *
 * throws. Every one of the thirteen call sites had it the wrong way round,
 * which meant every shopper facing product read on the site threw
 * "eq is not a function" before it reached the database: the storefront,
 * search, the wishlist, related and recently viewed products and all the
 * product pages showed nothing from the catalogue at all. Found by a
 * browser pass on 15 September 2026, fixed everywhere, and the check below
 * makes the mistake say so in words rather than reaching a shopper again.
 *
 * It throws rather than returning the query untouched on purpose. An
 * ungated read is the failure this whole module exists to prevent, so the
 * wrong shape has to stop the read, never quietly widen it.
 */
export function curatedOnly<T>(query: T): T {
  if (!CURATED_ONLY) return query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const q = query as any;
  if (!q || typeof q.eq !== 'function') {
    throw new TypeError(
      'curatedOnly needs a Supabase filter builder: call .select() before it, ' +
        'as curatedOnly(supabase.from(table).select(columns)), not after it.'
    );
  }
  return q.eq('is_featured', true) as T;
}
