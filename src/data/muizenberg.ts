/**
 * The Muizenberg campaign, as data.
 *
 * Shared by the page, the printable check sheet and the tests, so none of
 * them has to import the other. Offers are named by rate card slug; the
 * prices are read from the rate card at render time and never typed here.
 *
 * No em dashes in this file.
 */

/** Carried into the enquiry form as its `a` parameter, so leads say where they came from. */
export const MUIZENBERG_CONTEXT = 'Muizenberg local business';

/** The two door-openers. Cheap enough to say yes to on the spot. */
export const MUIZENBERG_OFFER_SLUGS = ['clarity-session', 'website-audit'] as const;

export const MUIZENBERG_ENQUIRE_HREF = `/enquire?a=${encodeURIComponent(MUIZENBERG_CONTEXT)}`;
