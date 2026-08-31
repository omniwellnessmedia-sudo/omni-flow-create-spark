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
 */
export function curatedOnly<T>(query: T): T {
  if (!CURATED_ONLY) return query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (query as any).eq('is_featured', true) as T;
}
