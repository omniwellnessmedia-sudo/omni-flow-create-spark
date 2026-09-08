import { getOffer, type RateCardOffer } from '@/data/publicRateCard';

/**
 * Service-anchored sections for the store.
 *
 * WHY. Chad's direction of 4 September 2026, agreeing with Feroza's research:
 * the catalogue must strengthen Omni's paid services, not become a general
 * marketplace, and must stay secondary to service enquiries. The margin
 * review of the same date made the arithmetic plain: the highest margin
 * products on any shelf here are Omni's own services, already priced on the
 * approved rate card. So each curated section leads with the matching Omni
 * offer as its anchor, and third party gear renders beneath it as supporting
 * kit, never the other way round.
 *
 * PRICES LIVE IN ONE PLACE. Sections reference offers by slug and render
 * whatever src/data/publicRateCard.ts holds. No price may be written here.
 *
 * The section names are the ones Feroza proposed in her research email of
 * 3 September 2026, kept verbatim.
 *
 * No em dashes in this file.
 */

export interface ServiceAnchoredSection {
  id: string;
  /** Feroza's proposed section name, verbatim. */
  title: string;
  /** One factual line on how the gear relates to the service. */
  lead: string;
  /** Rate card slugs, resolved at render time so prices cannot drift. */
  anchorSlugs: string[];
  /** Where "about this service" points. A real route in App.tsx. */
  serviceHref: string;
  /** Lowercased keywords matched against a product's category or name. */
  productKeywords: string[];
}

export const SERVICE_ANCHORED_SECTIONS: ServiceAnchoredSection[] = [
  {
    id: 'conscious-business',
    title: 'Conscious Business & Workspace Essentials',
    lead:
      'Start with the service. The workspace products below support the businesses we consult for; the thinking is ours.',
    anchorSlugs: ['clarity-session', 'website-audit'],
    serviceHref: '/business-consulting',
    productKeywords: [
      'office', 'stationery', 'notebook', 'desk', 'workspace', 'ergonomic',
      'planner', 'organiser', 'organizer', 'bag', 'sleeve',
    ],
  },
  {
    id: 'creator-production',
    title: 'Creator & Production Essentials',
    lead:
      'What we make for clients, and the kit that keeps them creating between professional shoots.',
    anchorSlugs: ['content-starter-pack', 'podcast-starter'],
    serviceHref: '/media-production',
    productKeywords: [
      'camera', 'lighting', 'light', 'audio', 'microphone', 'mic', 'tripod',
      'creator', 'video', 'photo', 'studio', 'podcast', 'vlog', 'gimbal',
    ],
  },
  {
    id: 'digital-workspace',
    title: 'Digital Workspace & Tech Essentials',
    lead:
      'The sites we build need somewhere to run. Practical tools for online businesses and remote work sit under the service that makes them earn.',
    anchorSlugs: ['revenue-sprint', 'landing-page'],
    serviceHref: '/web-development',
    productKeywords: [
      'tech', 'computer', 'laptop', 'usb', 'hub', 'network', 'storage',
      'power', 'charger', 'keyboard', 'mouse', 'monitor', 'accessor',
    ],
  },
];

/** Resolve a section's anchors against the rate card. Missing slugs are a
 *  build time bug the tests catch, but the render path stays safe. */
export const anchorsFor = (section: ServiceAnchoredSection): RateCardOffer[] =>
  section.anchorSlugs
    .map((s) => getOffer(s))
    .filter((o): o is RateCardOffer => Boolean(o));

/** Does a product belong under a section? Matched on category and name. */
export const productMatchesSection = (
  section: ServiceAnchoredSection,
  product: { category?: string | null; name?: string | null }
): boolean => {
  const hay = `${product.category ?? ''} ${product.name ?? ''}`.toLowerCase();
  return section.productKeywords.some((k) => hay.includes(k));
};
