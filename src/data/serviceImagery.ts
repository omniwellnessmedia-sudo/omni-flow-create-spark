/**
 * Photography for the individual offer pages.
 *
 * THIS WAS KEYED BY BAND AND THAT WAS WRONG TWICE OVER.
 *
 * Wrong once because six images across nineteen offers guarantees
 * repetition: all three clarity offers showed the same photograph, all
 * three build offers showed the same photograph, and a visitor comparing
 * two offers in a category saw the identical picture twice. That reads as
 * a template, not as a page about the thing they are considering.
 *
 * Wrong twice because the band images are encoded at 4.67:1 for the strip
 * on /services, and this page frames them at 4:5 portrait. Filling a tall
 * box with a wide image scales it up about 1.7 times and crops away four
 * fifths of the width, so what rendered here was a meaningless blown up
 * fragment: a slab of tabletop, half a word, part of a hand.
 *
 * So this is keyed by offer, and points at files cropped to 4:5 for this
 * page and nowhere else. Two files per subject is the cost of two
 * differently shaped containers, and it is cheaper than either one of them
 * looking broken.
 *
 * NINE OF NINETEEN OFFERS HAVE ONE. The other ten render the typographic
 * panel, which is the original rule of this file and still the right one: a
 * photograph that says nothing true about the offer beside it is worse than
 * none, and the panel is a deliberate design rather than an absence. No two
 * offers share a photograph.
 *
 * What the missing ten would need is genuinely per-offer photography. Word
 * tiles spelling SEO or ADWORDS were tried and cannot work here: the word
 * runs horizontally and the frame is vertical, so every crop cuts letters.
 *
 * Sources are licensed from Pixabay, which permits commercial use without
 * attribution, except the campaign command centre, which is Omni's own
 * event photography published with the consent of the person in it. The
 * original filenames are preserved in this repository's history so
 * provenance can be traced without asking anyone.
 *
 * No em dashes in this file.
 */

export interface ServiceImage {
  src: string;
  /** What is actually in the photograph. Not a restatement of the offer. */
  alt: string;
}

/**
 * Keyed by offer slug. An offer absent from this map renders the
 * typographic panel, which is a valid outcome and not a gap to be filled
 * with something vaguely related.
 */
const OFFER_IMAGES: Record<string, ServiceImage> = {
  'clarity-session': {
    src: '/services/offer-clarity-session.webp',
    alt: 'Two people going through printed charts and figures across a table',
  },
  'revenue-sprint': {
    src: '/services/offer-revenue-sprint.webp',
    alt: 'A pen pointing at a traffic and conversion chart on a screen',
  },
  'landing-page': {
    src: '/services/offer-landing-page.webp',
    alt: 'Someone working at a laptop at a wooden desk',
  },
  'content-starter-pack': {
    src: '/services/offer-content-starter.webp',
    alt: 'A desk from above with a newspaper, notebooks, a calculator and coffee',
  },
  'growth-desk': {
    src: '/services/offer-growth-desk.webp',
    alt: 'Someone standing with an open laptop in a meeting room',
  },
  'podcast-starter': {
    src: '/services/offer-podcast-starter.webp',
    alt: 'A podcast microphone on a desk beside an open laptop in a studio',
  },
  'campaign-command-centre': {
    // Omni's own photography, published with consent. On the offer about
    // running campaigns and events, a photograph of Omni running one proves
    // something no licensed image can.
    src: '/services/offer-campaign-centre.webp',
    alt: 'A speaker addressing an audience from a podium at an Omni event',
  },
  'screening-campaign': {
    src: '/services/offer-screening-campaign.webp',
    alt: 'Stage curtains lit above empty theatre seats',
  },
  'event-marketing': {
    src: '/services/offer-event-marketing.webp',
    alt: 'A handshake across a desk covered in planning documents',
  },
};

/** The offer's photograph, or null when we have none that genuinely fits. */
export const offerImage = (slug: string | undefined): ServiceImage | null =>
  slug ? (OFFER_IMAGES[slug] ?? null) : null;

/** Offers that currently render the typographic panel, for the coverage test. */
export const offersWithoutImagery = (allSlugs: string[]): string[] =>
  allSlugs.filter((s) => !OFFER_IMAGES[s]);

/** Every file this map references, for the exists-on-disk test. */
export const offerImageFiles = (): string[] =>
  Object.values(OFFER_IMAGES).map((i) => i.src);
