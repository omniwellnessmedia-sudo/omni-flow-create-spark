/**
 * Deposit engine: the offers that can take a deposit today.
 *
 * WHY A TYPED CONFIG AND NOT A SUPABASE TABLE (decision logged in
 * REVENUE_ENGINE_REPORT.md): the payment links are plain URLs that change
 * rarely and must be reviewed like copy, not content. A table adds an RLS
 * surface, a migration and an admin screen for five rows. The shape below is
 * deliberately 1:1 with a future `offers` table so migrating later is a
 * data move, not a refactor.
 *
 * HOW A PAYMENT LINK WORKS. eft_link and card_link are plain checkout URLs:
 * today a Quicket product per offer (Quicket is the rail this business has
 * already proven), later Ozow (EFT, cheaper: about 1.5%) and PayFast (card,
 * about 3.2% plus R2) links can be pasted in with ZERO code changes. EFT is
 * always presented first: at R7,500 the fee difference per deposit is real
 * money.
 *
 * AN OFFER IS INVISIBLE UNTIL IT IS ACTIVE. active: true requires BOTH a
 * real eft_link or card_link AND the price having been confirmed by the
 * team. No offer ships active from this change because no live payment URL
 * exists in the repo yet: inventing one would break the first rule of this
 * codebase, nothing planned is presented as operational.
 *
 * TO ACTIVATE AN OFFER
 *   1. Create the payment product (Quicket: a ticket type priced at the
 *      deposit amount works) and copy its URL.
 *   2. Paste it into eft_link (bank transfer style rails) or card_link.
 *   3. Set active: true. The Pay deposit buttons appear wherever the offer
 *      is wired; /payment-success and /payment-cancelled already handle the
 *      return with ?offer=<slug>.
 */

export interface Offer {
  /** Stable identifier; used in analytics events and return URLs. */
  slug: string;
  name: string;
  /** Full price in ZAR. 0 means "priced at scoping". */
  price_zar: number;
  /** The deposit that secures the date, in ZAR. */
  deposit_zar: number;
  /** Plain checkout URL for EFT rails (Ozow/Quicket). Empty = not available. */
  eft_link: string;
  /** Plain checkout URL for card rails (PayFast/Quicket). Empty = not available. */
  card_link: string;
  active: boolean;
  /** Route(s) where this offer's deposit CTA belongs, for reference. */
  surfaces: string[];
}

export const OFFERS: Offer[] = [
  {
    slug: 'hosted-screening',
    name: 'Hosted Screening Package',
    price_zar: 15000,
    deposit_zar: 7500,
    eft_link: '',
    card_link: '',
    active: false,
    surfaces: ['/screenings'],
  },
  {
    slug: 'muizenberg-cave-tours',
    name: 'Muizenberg Cave Tours',
    price_zar: 0,
    deposit_zar: 500,
    eft_link: '',
    card_link: '',
    active: false,
    surfaces: ['/tours/muizenberg-cave-tours'],
  },
  {
    slug: 'great-mother-cave-tour',
    name: 'Great Mother Cave Tour',
    price_zar: 0,
    deposit_zar: 500,
    eft_link: '',
    card_link: '',
    active: false,
    surfaces: ['/tours/great-mother-cave-tour'],
  },
  {
    slug: 'kalk-bay-tour',
    name: 'Kalk Bay Tour',
    price_zar: 0,
    deposit_zar: 500,
    eft_link: '',
    card_link: '',
    active: false,
    surfaces: ['/tours/kalk-bay-tour'],
  },
  {
    slug: 'winter-wine-country-wellness',
    name: 'Winter Wine Country Wellness Retreat',
    price_zar: 0,
    deposit_zar: 1500,
    eft_link: '',
    card_link: '',
    active: false,
    surfaces: ['/tours/winter-wine-country-wellness'],
  },
];

/** Active offer by slug, or null. The UI renders nothing for null. */
export function getActiveOffer(slug: string): Offer | null {
  const offer = OFFERS.find((o) => o.slug === slug);
  return offer && offer.active && (offer.eft_link || offer.card_link)
    ? offer
    : null;
}
