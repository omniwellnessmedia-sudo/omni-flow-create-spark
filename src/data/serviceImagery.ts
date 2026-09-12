/**
 * Photography for the service detail pages, mapped per band.
 *
 * THIS FILE USED TO FORBID STOCK, and the rule read: "A band gets a
 * photograph only if we have one that actually shows the work. Do not map a
 * stock photograph to fill a gap." Three of the six bands rendered a
 * typographic panel instead, because we held nothing that fitted.
 *
 * THAT RULE WAS SOLVING THE RIGHT PROBLEM AND NAMED THE WRONG CULPRIT. What
 * it was protecting against is a photograph that says nothing true about the
 * offer beside it: a Beauty Without Cruelty campaign cover next to a podcast
 * package, or the same team photograph on four unrelated pages. That is a
 * relevance problem, not a licensing one. Owning a picture never made it
 * relevant, and licensing one never made it irrelevant.
 *
 * So the rule is now stated as what it always meant: A BAND GETS A
 * PHOTOGRAPH ONLY IF THE SUBJECT IS GENUINELY WHAT THE BAND SELLS. Licensed
 * stock qualifies. An owned photograph of something else does not.
 *
 * Under that rule all six bands now have one. Podcast was the last and took
 * two rounds: the first images offered were a microphone on a plain field,
 * which is a photograph of equipment. The one used is a photograph of a
 * session. The old file was right that a microphone stock photo is the
 * obvious move and the wrong one, and waiting was worth it.
 *
 * These are the same files /services uses, so a visitor moving from the
 * catalogue to an offer page sees one system rather than two.
 *
 * Every alt text describes what is actually in the frame, which is both an
 * accessibility requirement and a check on whether the image belongs. If the
 * alt has to go vague to fit, the image is wrong.
 *
 * Sources are licensed from Pixabay, which permits commercial use without
 * attribution. The original filenames are preserved in this repository's
 * history so provenance can be traced without asking anyone.
 *
 * No em dashes in this file.
 */

export interface ServiceImage {
  src: string;
  /** What is actually in the photograph. Not a restatement of the offer. */
  alt: string;
}

const BAND_IMAGES: Record<string, ServiceImage | null> = {
  /**
   * Clarity and audits. Two people going through printed figures is what a
   * paid audit looks like from the outside.
   */
  clarity: {
    src: '/services/clarity-audit.webp',
    alt: 'Two people reviewing printed charts and figures across a table',
  },

  /**
   * Websites and sprints. This band had nothing. An analytics dashboard is
   * the output of a build sprint, which is closer to the offer than a
   * photograph of a developer would be.
   */
  build: {
    src: '/services/build-sprint.webp',
    alt: 'A web analytics dashboard on screen, traffic and conversion charts in view',
  },

  /**
   * Content and brand identity. Someone at a desk making something.
   */
  content: {
    src: '/services/content-brand.webp',
    alt: 'Someone working at a laptop at a wooden desk',
  },

  /**
   * Ongoing support. A retainer is capacity and consistency over months,
   * which nothing photographs directly. Someone arriving at a meeting with
   * their work open is the nearest honest thing.
   */
  retainer: {
    src: '/services/retainer-support.webp',
    alt: 'Someone standing with an open laptop in a meeting room',
  },

  /**
   * Podcast. This band ran without an image longer than any other, because
   * the honest options were a microphone on a plain background, which shows
   * equipment rather than work. This shows a session: the mic in front of a
   * laptop with a conversation happening behind it.
   */
  podcast: {
    src: '/services/podcast-studio.webp',
    alt: 'A podcast microphone on a desk beside an open laptop, two people talking behind it',
  },

  /**
   * Campaigns and events. A campaign starts as an agreement across a table.
   */
  campaign: {
    src: '/services/campaign-events.webp',
    alt: 'A handshake across a desk covered in planning documents',
  },
};

/** The band's photograph, or null when we have nothing that genuinely fits. */
export const bandImage = (bandId: string | undefined): ServiceImage | null =>
  bandId ? (BAND_IMAGES[bandId] ?? null) : null;

/** Bands that currently have no photography, for the coverage test. */
export const bandsWithoutImagery = (): string[] =>
  Object.entries(BAND_IMAGES)
    .filter(([, v]) => v === null)
    .map(([k]) => k);
