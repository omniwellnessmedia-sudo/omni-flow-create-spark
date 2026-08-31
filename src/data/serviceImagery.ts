import { IMAGES } from '@/lib/images';

/**
 * Photography for the service pages, mapped per band.
 *
 * THE RULE: A BAND GETS A PHOTOGRAPH ONLY IF WE HAVE ONE THAT ACTUALLY SHOWS
 * THE WORK. Where we do not, the page renders a typographic panel instead and
 * that is the better outcome.
 *
 * This is not caution for its own sake. The image catalogue in lib/images.ts
 * has convenience groups that alias unrelated photographs: `ai.neural` points
 * at a Beauty Without Cruelty campaign cover, and `business.strategy`,
 * `business.consulting` and `business.teamwork` all resolve to the same team
 * photograph. Wiring those in would put a campaign cover beside a podcast
 * offer and the same picture on four pages. That is exactly the "images to
 * context are very sus" problem already raised about the home page, and
 * repeating it on nineteen sales pages would be worse, because a mismatched
 * photograph on a page asking for money reads as filler and costs more trust
 * than a blank space does.
 *
 * So: real photographs where the subject genuinely matches, and null
 * otherwise. Every alt text below describes what is actually in the frame,
 * which is both an accessibility requirement and a check on whether the image
 * belongs at all. If the alt text has to be vague to fit, the image is wrong.
 *
 * TO ADD MORE. Put real photography of the work into the image catalogue and
 * map it here. Do not map a stock photograph to fill a gap.
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
   * Clarity and audits. A working session between people is what this offer
   * is, and the team photograph shows exactly that.
   */
  clarity: {
    src: IMAGES.services.team,
    alt: 'The Omni Wellness Media team working together at a table in Cape Town',
  },

  /**
   * Websites and sprints. We hold no photographs of screens, builds or
   * development work. A person at a laptop would be stock, so this band takes
   * the typographic panel.
   */
  build: null,

  /**
   * Content and brand identity. Production stills from our own shoots show
   * the work being made, which is the thing being sold.
   */
  content: {
    src: IMAGES.services.artscape,
    alt: 'Filming on location at the Artscape during an Omni production',
  },

  /**
   * Ongoing support. This is a retainer, meaning capacity and consistency
   * over months. Nothing photographic represents that honestly.
   */
  retainer: null,

  /**
   * Podcast. We hold no recording or studio photography. Mapping a microphone
   * stock image here was the obvious move and is the exact mistake this file
   * exists to avoid.
   */
  podcast: null,

  /**
   * Campaigns and events. Our own screening and event work, photographed at
   * the events themselves.
   */
  campaign: {
    src: IMAGES.services.humanAnimal1,
    alt: 'Audience gathered at an Omni Wellness Media screening event',
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
