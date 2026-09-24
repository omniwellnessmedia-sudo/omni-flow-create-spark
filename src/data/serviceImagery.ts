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
 * FIFTEEN OF NINETEEN OFFERS HAVE ONE. The other four render the typographic
 * panel, which is the original rule of this file and still the right one: a
 * photograph that says nothing true about the offer beside it is worse than
 * none, and the panel is a deliberate design rather than an absence. No two
 * offers share a photograph.
 *
 * EVERY PHOTOGRAPH SAYS WHOSE IT IS. Omni's own photographs, from client
 * shoots and events, carry a credit line beneath them on the page so a
 * visitor can tell an example of our work from a licensed picture. Licensed
 * pictures say "Stock photograph" for the same reason: nothing on a page
 * that sells work may imply that work is ours when it is not. A caption is
 * context and credit; it is not consent from the people in the frame, so
 * nobody is named and nobody is described as a client.
 *
 * Word tiles spelling SEO or ADWORDS were tried and cannot work here: the
 * word runs horizontally and the frame is vertical, so every crop cuts
 * letters. The four offers still without a photograph need per-offer
 * photography, not a nearer miss.
 *
 * Licensed sources are Pixabay, which permits commercial use without
 * attribution. Omni's own photographs are published on the instruction of
 * the company, with adults only in frame; two photographs from the same
 * shoots were excluded because a child is the subject. Original filenames
 * are preserved in this repository's history so provenance can be traced.
 *
 * No em dashes in this file.
 */

export type ImageCredit = 'omni' | 'stock';

export interface ServiceImage {
  src: string;
  /** What is actually in the photograph. Not a restatement of the offer. */
  alt: string;
  /** Whose photograph it is. Rendered as the credit line under the image. */
  credit: ImageCredit;
  /** Omni photographs only: the kind of job it was taken on. */
  context?: string;
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
    credit: 'stock',
  },
  // 'brand-content-audit' had the market gazebo photograph, the second crop
  // of the frame that came off the Muizenberg hero on 24 September 2026 at
  // Feroza's request on behalf of someone in it. Both crops are deleted,
  // because removing one and leaving the other is the same faces still
  // published. This offer renders the typographic panel until it has a
  // photograph of its own.
  'website-audit': {
    src: '/services/offer-website-audit.webp',
    alt: 'A woman in a green shirt writing notes on a sheet of paper at an outdoor event',
    credit: 'omni',
    context: 'On a client shoot',
  },
  'revenue-sprint': {
    src: '/services/offer-revenue-sprint.webp',
    alt: 'A pen pointing at a traffic and conversion chart on a screen',
    credit: 'stock',
  },
  'visibility-sprint': {
    src: '/services/offer-visibility-sprint.webp',
    alt: 'A hand with a pen over a laptop keyboard, with a web of contact icons drawn across the desk',
    credit: 'stock',
  },
  'landing-page': {
    src: '/services/offer-landing-page.webp',
    alt: 'Someone working at a laptop at a wooden desk',
    credit: 'stock',
  },
  'content-starter-pack': {
    src: '/services/offer-content-starter.webp',
    alt: 'A desk from above with a newspaper, notebooks, a calculator and coffee',
    credit: 'stock',
  },
  'growth-desk': {
    src: '/services/offer-growth-desk.webp',
    alt: 'Someone standing with an open laptop in a meeting room',
    credit: 'stock',
  },
  // 'social-media-management' had the crew photograph, a second crop of the
  // same frame that came off the Muizenberg page on 23 September 2026 at
  // Feroza's request on behalf of someone in it. Taking one crop down and
  // leaving the other serving the same faces on the services pages was the
  // same picture still published, so this one is gone too and the offer
  // renders the typographic panel until it has a photograph of its own.
  'executive-support': {
    src: '/services/offer-executive-support.webp',
    alt: 'A person in a suit holding an open laptop in a meeting room',
    credit: 'stock',
  },
  'podcast-starter': {
    src: '/services/offer-podcast-starter.webp',
    alt: 'A podcast microphone on a desk beside an open laptop in a studio',
    credit: 'stock',
  },
  'campaign-command-centre': {
    // On the offer about running campaigns and events, a photograph of Omni
    // running one proves something no licensed image can.
    src: '/services/offer-campaign-centre.webp',
    alt: 'A speaker addressing an audience from a podium at an Omni event',
    credit: 'omni',
    context: 'On stage at a client event',
  },
  'event-marketing': {
    src: '/services/offer-event-marketing.webp',
    alt: 'A handshake across a desk covered in planning documents',
    credit: 'stock',
  },
  'screening-campaign': {
    src: '/services/offer-screening-campaign.webp',
    alt: 'Stage curtains lit above empty theatre seats',
    credit: 'stock',
  },
  'workshops': {
    src: '/services/offer-workshops.webp',
    alt: 'People gathered on a field under branded umbrellas, with the mountains behind',
    credit: 'omni',
    context: 'A client event day on the field',
  },
};

/** The offer's photograph, or null when we have none that genuinely fits. */
export const offerImage = (slug: string | undefined): ServiceImage | null =>
  slug ? (OFFER_IMAGES[slug] ?? null) : null;

/** The credit line printed under a photograph. */
export const imageCreditLine = (image: ServiceImage): string =>
  image.credit === 'omni'
    ? `${image.context ? `${image.context}. ` : ''}Photograph: Omni Wellness Media.`
    : 'Stock photograph.';

/** Offers that currently render the typographic panel, for the coverage test. */
export const offersWithoutImagery = (allSlugs: string[]): string[] =>
  allSlugs.filter((s) => !OFFER_IMAGES[s]);

/** Every file this map references, for the exists-on-disk test. */
export const offerImageFiles = (): string[] =>
  Object.values(OFFER_IMAGES).map((i) => i.src);
