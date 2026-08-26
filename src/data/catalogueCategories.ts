/**
 * Canonical catalogue categories, shared by every surface that categorises
 * listings: the admin catalogue (businesses and products), the unified
 * marketplace filters, and any future storefront.
 *
 * WHY THIS EXISTS. Three taxonomies had grown independently:
 *   - the admin catalogue's short label list ("Food and drink", ...),
 *   - the curated seed data's snake_case slugs (natural_beauty, ...),
 *   - the sample marketplace items' ad hoc labels ("Wellness Tools", ...).
 * The marketplace filter derived its options from raw item values, so the
 * same kind of product landed under three differently spelled categories.
 * Everything now normalises through this module: one list to choose from
 * when saving, one mapper when displaying legacy values.
 */

export const CATALOGUE_CATEGORIES = [
  'Food and Drink',
  'Skincare and Natural Beauty',
  'Supplements and Remedies',
  'Yoga and Meditation',
  'Fitness and Recovery',
  'Aromatherapy',
  'Wellness Services',
  'Wellness Tools',
  'Retreats and Experiences',
  'Books and Learning',
  'Craft and Homeware',
  'Clothing',
  'Digital Products',
  'Other',
] as const;

export type CatalogueCategory = (typeof CATALOGUE_CATEGORIES)[number];

/** Legacy raw values (lowercased) to their canonical category. */
const LEGACY_MAP: Record<string, CatalogueCategory> = {
  // Admin catalogue's original labels
  'food and drink': 'Food and Drink',
  'skincare and body': 'Skincare and Natural Beauty',
  'wellness services': 'Wellness Services',
  'craft and homeware': 'Craft and Homeware',
  clothing: 'Clothing',
  'books and media': 'Books and Learning',
  other: 'Other',
  // Curated seed slugs
  aromatherapy: 'Aromatherapy',
  fitness_recovery: 'Fitness and Recovery',
  natural_beauty: 'Skincare and Natural Beauty',
  wellness_books: 'Books and Learning',
  wellness_supplements: 'Supplements and Remedies',
  yoga_meditation: 'Yoga and Meditation',
  // Sample marketplace labels
  'wellness tools': 'Wellness Tools',
  retreats: 'Retreats and Experiences',
  experiences: 'Retreats and Experiences',
  'digital products': 'Digital Products',
  digital: 'Digital Products',
};

/**
 * Normalise any stored category value to a canonical display category.
 * Unknown values fall back to 'Other' rather than leaking raw slugs into
 * the interface.
 */
export function normaliseCategory(raw: string | null | undefined): CatalogueCategory {
  if (!raw) return 'Other';
  const key = raw.trim().toLowerCase();
  if (LEGACY_MAP[key]) return LEGACY_MAP[key];
  const direct = CATALOGUE_CATEGORIES.find((c) => c.toLowerCase() === key);
  return direct ?? 'Other';
}
