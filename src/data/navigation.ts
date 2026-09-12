import { SERVICE_BANDS, ALL_OFFERS } from '@/data/publicRateCard';

/**
 * The site navigation, in one place.
 *
 * IT USED TO BE IN TWO. UnifiedNavigation held a navigationItems array for
 * the mobile sheet and MegaNavigation held its own sections for the desktop
 * menu. Two copies of the same menu drift, and these had: the mobile menu
 * offered All Services and Rates and Impact Screenings, the desktop menu
 * offered neither. So on a laptop the entire catalogue of nineteen priced
 * offers, the pricing page and the scorecard could not be reached by
 * browsing at all. The only way in was a direct link.
 *
 * That is a navigation bug that costs money, and it was invisible because
 * whoever checked the menu on a phone saw a complete one.
 *
 * One array, both renderers. A link added here appears in both.
 *
 * NO EMOJI. The old menu labelled items with a pictograph each, and a
 * pictograph renders as a different drawing on every operating system, sits
 * on a different baseline in every font, and cannot be given a colour. The
 * spectrum hue a category already owns does the same job, consistently.
 *
 * NO EM DASHES, per the house rule. The travel descriptions carried one
 * each and are rewritten here.
 */

export interface NavLink {
  title: string;
  href: string;
  /** One line on what is behind the link. Not a restatement of the title. */
  description: string;
  /** Spectrum hue, where the item belongs to a category that owns one. */
  hue?: string;
}

export interface NavGroup {
  title: string;
  /** Where the group itself goes, when the heading is clickable. */
  href?: string;
  links: NavLink[];
}

export const TRAVEL: NavGroup = {
  title: 'Impact Travel',
  href: '/tours-retreats',
  links: [
    {
      title: 'Great Mother Cave Tour',
      href: '/tours/great-mother-cave-tour',
      description: 'Twelve thousand years of sacred heritage, in Fish Hoek',
    },
    {
      title: "Muizenberg's Living Heritage",
      href: '/tours/muizenberg-cave-tours',
      description: 'Ancient history by the sea',
    },
    {
      title: "Kalk Bay's Rich Tapestry",
      href: '/tours/kalk-bay-tour',
      description: 'Ancient whispers and healing herbs',
    },
    {
      title: 'Hoofbeats and Healing',
      href: '/experiences/cart-horse-urban-wellness',
      description: 'Equine assisted wellness',
    },
    {
      title: 'Corporate Wellness Retreats',
      href: '/experiences/corporate-wellness-retreat',
      description: 'Bespoke team retreats with measurable impact',
    },
    {
      title: 'Annual Omni Wellness Retreat',
      href: '/tour-detail/winter-wine-country-wellness',
      description: 'A weekend at Tufcat Sanctuary',
    },
    {
      title: 'All Tours and Experiences',
      href: '/tours-retreats',
      description: 'Browse everything',
    },
  ],
};

export const STORE: NavGroup = {
  title: 'Store',
  links: [
    {
      title: 'ROAM eSIM Store',
      href: '/roambuddy-store',
      description: 'Global eSIM plans, so you stay connected while you travel',
    },
  ],
};

export const COMMUNITY: NavGroup = {
  title: 'Community',
  links: [
    {
      title: 'Events Calendar',
      href: '/events',
      description: 'Upcoming community events, month by month',
    },
  ],
};

/**
 * The four routes into the services catalogue, ordered by how ready the
 * visitor is. The scorecard comes first on purpose: it is the only one that
 * costs the visitor nothing and tells us who they are, and it is the right
 * answer for somebody who does not yet know which service they need.
 */
export const SERVICE_ENTRY_POINTS: NavLink[] = [
  {
    title: 'Revenue Readiness Scorecard',
    href: '/scorecard',
    description: 'Ten questions, two minutes, an answer without giving us anything',
  },
  {
    title: 'All Services and Rates',
    href: '/services',
    description: 'The full catalogue with prices, from R1,500',
  },
  {
    title: 'Pricing',
    href: '/pricing',
    description: 'Every rate on one page',
  },
  {
    title: 'Impact Screenings',
    href: '/screenings',
    description: 'Film screening as a service, audience included',
  },
];

/** The established service pages, which predate the catalogue. */
export const SERVICE_PAGES: NavLink[] = [
  {
    title: 'Business Consulting',
    href: '/business-consulting',
    description: 'Strategy, offers and revenue plans that hold up',
  },
  {
    title: 'Media Production',
    href: '/media-production',
    description: 'Video, photography and content',
  },
  {
    title: 'Web Development',
    href: '/web-development',
    description: 'Websites and the systems behind them',
  },
];

/**
 * The six catalogue categories, derived from the rate card rather than
 * retyped, so a band renamed there is renamed here. Each anchors into its
 * own section of the catalogue.
 */
export const SERVICE_CATEGORIES: NavLink[] = SERVICE_BANDS.map((band) => ({
  title: band.heading,
  href: `/services#${band.id}`,
  description: `${band.offers.length} ${band.offers.length === 1 ? 'offer' : 'offers'}`,
  hue: band.hue,
}));

export interface OfferSearchRow {
  slug: string;
  name: string;
  price: string;
  href: string;
  band: string;
  hue: string;
  /** Lowercased haystack, built once rather than on every keystroke. */
  haystack: string;
}

/**
 * Every offer, flattened for the menu's search box.
 *
 * Built once at module load from the rate card. The search is local: it
 * touches no network, cannot fail, and returns on the keystroke. A visitor
 * typing "podcast" should not wait on a request to find out we sell three.
 */
export const OFFER_SEARCH_ROWS: OfferSearchRow[] = SERVICE_BANDS.flatMap((band) =>
  band.offers.map((offer) => ({
    slug: offer.slug,
    name: offer.name,
    price: offer.price,
    href: `/services/${offer.slug}`,
    band: band.heading,
    hue: offer.hue,
    haystack: [offer.name, offer.blurb, band.heading, ...offer.bullets].join(' ').toLowerCase(),
  }))
);

/**
 * Offers matching a query, best first.
 *
 * A name match beats a description match, because somebody typing "audit"
 * wants the offers called audit before the ones that merely mention one.
 */
export const searchOffers = (query: string, limit = 6): OfferSearchRow[] => {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const scored = OFFER_SEARCH_ROWS.map((row) => {
    const name = row.name.toLowerCase();
    let score = 0;
    if (name.startsWith(q)) score = 3;
    else if (name.includes(q)) score = 2;
    else if (row.haystack.includes(q)) score = 1;
    return { row, score };
  }).filter((r) => r.score > 0);
  scored.sort((a, b) => b.score - a.score || a.row.name.localeCompare(b.row.name));
  return scored.slice(0, limit).map((r) => r.row);
};

/** Total offers, for the menu to state rather than guess. */
export const OFFER_COUNT = ALL_OFFERS.length;
