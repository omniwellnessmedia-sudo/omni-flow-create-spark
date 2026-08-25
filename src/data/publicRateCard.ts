/**
 * PUBLIC rate card for the services page.
 *
 * Source of truth: Chad Cupido's approved Master Services Rate Card and
 * implementation direction, email of 23 August 2026, section "Recommended
 * Public Rate Card". Chad's direction: the public site shows only the
 * clearest entry offers and outcomes; the detailed modular pricing stays
 * internal for quotations and custom proposals.
 *
 * THIS REPOSITORY IS PUBLIC. Only the approved public subset may appear in
 * this file or anywhere else in the repo. The full modular card, partner
 * production rates, margin rules and package economics are CONFIDENTIAL and
 * live in Chad's email, never here. Adding them "for convenience" publishes
 * them to the open internet.
 *
 * Two items from the recommended public card are deliberately withheld:
 *   - Monthly social-media management: Chad's own caveat says do not publish
 *     these packages unchanged until the source-content production
 *     definitions are re-costed and margins protected. That revision is a
 *     business decision that has not happened yet, so the packages stay off
 *     the public page and the category appears under quotation instead.
 *   - Digital resources (R199 to R799): no delivery mechanism (payment plus
 *     file delivery) exists on the site yet, so listing them would present
 *     planned work as operational.
 *
 * Prices are stated in South African rand. VAT treatment is not yet
 * confirmed with finance (Chad's standard terms), so no VAT wording appears
 * until it is.
 */

export interface RateCardOffer {
  /** Stable id; also the ?service= value the contact form understands. */
  slug: string;
  name: string;
  /** Display price exactly as approved, e.g. "R1,500" or "From R12,500". */
  price: string;
  /** Qualifier under the price, e.g. "once off" or "per month". */
  priceNote: string;
  /** One sentence: what the client walks away with. */
  outcome: string;
  bullets: string[];
  /** Marks the entry offers to surface first. */
  featured?: boolean;
}

export const RATE_CARD_OFFERS: RateCardOffer[] = [
  {
    slug: 'clarity-session',
    name: 'AI and Business Clarity Session',
    price: 'R1,500',
    priceNote: 'once off',
    outcome: 'Leave one hour with a clear, written plan of action.',
    bullets: [
      '60 minute online strategy session',
      'A concise written action map afterwards',
    ],
    featured: true,
  },
  {
    slug: 'brand-content-audit',
    name: 'Wellness Brand and Content Audit',
    price: 'R2,500',
    priceNote: 'once off',
    outcome: 'Know exactly what your brand says, where it leaks, and what to fix first.',
    bullets: [
      'Website and social media review with a scorecard',
      'Prioritised fixes',
      '45 minute debrief call',
    ],
    featured: true,
  },
  {
    slug: 'content-starter-pack',
    name: 'Content Starter Pack',
    price: 'R3,500',
    priceNote: 'once off',
    outcome: 'A month of on-brand content, ready to post.',
    bullets: [
      'One campaign theme',
      'Six branded graphics and six captions',
      'WhatsApp or email copy',
      'A 30 day posting plan',
    ],
    featured: true,
  },
  {
    slug: 'revenue-sprint',
    name: 'Revenue-Ready Website and Campaign Sprint',
    price: 'R7,500',
    priceNote: 'launch rate',
    outcome: 'One focused page that turns visitors into enquiries or payments.',
    bullets: [
      'One agreed offer, positioned and written',
      'One focused landing page',
      'One lead, booking or payment route',
      'Analytics and one conversion test',
      'One consolidated revision round',
    ],
    featured: true,
  },
  {
    slug: 'visibility-sprint',
    name: '30-Day Visibility and Conversion Sprint',
    price: 'R10,500',
    priceNote: 'standard',
    outcome: 'A month of focused positioning, campaign assets and measurable conversion work.',
    bullets: [
      'Positioning and landing page build or conversion refresh',
      '12 campaign assets',
      'Lead form, advertising setup and tracking',
      'Review at the end of the sprint',
    ],
  },
  {
    slug: 'campaign-command-centre',
    name: 'Campaign Command Centre',
    price: 'From R12,500',
    priceNote: 'scoped per campaign',
    outcome: 'The full engine behind a campaign, from assets to impact report.',
    bullets: [
      'Campaign hub, asset bank and copy bank',
      'Partner toolkit',
      'Ticketing or lead pathway',
      'Tracking dashboard and impact report',
    ],
  },
  {
    slug: 'growth-desk',
    name: 'Omni Growth Desk',
    price: 'R6,500',
    priceNote: 'per month',
    outcome: 'A senior team on retainer, moving your marketing every month.',
    bullets: [
      'Monthly strategy',
      'Eight content pieces',
      'One WhatsApp or email campaign',
      'Up to four website support hours',
      'Optimisation and reporting',
    ],
  },
  {
    slug: 'podcast-starter',
    name: 'Podcast Starter System',
    price: 'R2,500',
    priceNote: 'once off',
    outcome: 'Everything you need to start a podcast properly, before buying anything.',
    bullets: [
      '90 minute strategy session',
      'Launch checklist',
      'Curated equipment and software guide',
    ],
  },
  {
    slug: 'brand-identity',
    name: 'Brand Identity',
    price: 'From R2,800',
    priceNote: 'starter kit',
    outcome: 'A brand that looks decided, with templates your team can actually use.',
    bullets: [
      'Two logo concepts with one revision round',
      'Colour palette and two fonts',
      'One page brand guide',
      'Five editable Canva templates',
    ],
  },
];

/** Categories that are quoted per project rather than priced on the page. */
export const QUOTED_CATEGORIES: string[] = [
  'Custom multi-page websites',
  'Photography, videography and media production',
  'Events, screenings and experiences',
  'Monthly social media management',
  'Marketplace and partner arrangements',
  'Custom systems, automation and AI workflows',
];

/** Public commercial terms, exactly as approved for publication. */
export const RATE_CARD_TERMS: string[] = [
  'All prices are in South African rand.',
  'Project work is confirmed with a 50% deposit, with the balance due before final handover.',
  'Monthly retainers are payable in advance.',
  'Quotations are valid for 14 days.',
];
