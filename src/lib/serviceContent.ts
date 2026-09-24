import { ALL_OFFERS, getOffer, type RateCardOffer } from '@/data/publicRateCard';

/**
 * The description and inclusions of an offer, editable without a deploy.
 *
 * WHY ONLY THOSE TWO FIELDS. Five of the nineteen offers carry a price and
 * no inclusions, so a buyer reads "Workshops, from R7,500 half day" and
 * cannot tell what arrives for the money. That content has been waiting on
 * one person since 12 September because changing it meant a deploy.
 *
 * Price is deliberately not editable here. It is the most consequential
 * string on the site, it changes rarely, and the repository rule is that a
 * client facing price comes from src/data/publicRateCard.ts and nowhere
 * else. So the worst a wrong row here can do is publish a poor sentence.
 * A price change still needs a developer, and the admin screen says so.
 *
 * THE CODE IS THE BASELINE. merge() starts from the rate card and only
 * replaces a field the row actually carries. An empty table, a failed
 * read, a draft row or a blank field all leave the offer exactly as the
 * code has always rendered it, which is what makes this safe to ship.
 *
 * No em dashes in this file.
 */

export type ContentStatus = 'draft' | 'published';

export interface ServiceContentRow {
  offer_slug: string;
  blurb: string | null;
  bullets: string[] | null;
  status: ContentStatus;
  updated_at?: string;
}

/** Longest a description may run before it stops being a description. */
export const BLURB_MAX = 400;
/** One inclusion. Long enough for a real line, short enough to scan. */
export const BULLET_MAX = 120;
export const BULLETS_MAX = 10;

export interface Problem {
  field: 'blurb' | 'bullets';
  index?: number;
  message: string;
}

/**
 * Claims the site does not let anyone make, whoever is typing. The same
 * list the ad copy is held to, for the same reason: the terms do not
 * promise a result and neither may a service description.
 */
export const FORBIDDEN = /\b(guarantee[ds]?|guaranteeing|#1|number one|best in (cape town|south africa)|cheapest|risk[- ]free|100% (success|results))\b/i;

const clean = (v: unknown): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.replace(/\s+/g, ' ').trim();
  return t ? t : null;
};

/** Only strings survive, blanks are dropped, and the count is capped. */
export const cleanBullets = (v: unknown): string[] | null => {
  if (!Array.isArray(v)) return null;
  const out = v.map(clean).filter((x): x is string => x !== null).slice(0, BULLETS_MAX);
  return out.length ? out : null;
};

/**
 * The offer as a visitor should see it: the rate card, with any published
 * description or inclusions laid over it. Anything invalid is ignored
 * rather than rendered, so a bad row degrades to the code, never to a
 * broken page.
 */
export const merge = (offer: RateCardOffer, row: ServiceContentRow | undefined): RateCardOffer => {
  if (!row || row.status !== 'published') return offer;
  const blurb = clean(row.blurb);
  const bullets = cleanBullets(row.bullets);
  return {
    ...offer,
    blurb: blurb && blurb.length <= BLURB_MAX && !FORBIDDEN.test(blurb) ? blurb : offer.blurb,
    bullets:
      bullets && bullets.every((b) => b.length <= BULLET_MAX && !FORBIDDEN.test(b))
        ? bullets
        : offer.bullets,
  };
};

/** Every offer, merged. Order and membership always come from the code. */
export const mergeAll = (rows: Record<string, ServiceContentRow | undefined>): RateCardOffer[] =>
  ALL_OFFERS.map((o) => merge(o, rows[o.slug]));

export const mergeOne = (
  slug: string | undefined,
  rows: Record<string, ServiceContentRow | undefined>
): RateCardOffer | undefined => {
  const offer = getOffer(slug);
  return offer ? merge(offer, rows[offer.slug]) : undefined;
};

/** What an editor is about to save, checked before it can be published. */
export const validate = (draft: { blurb: string; bullets: string[] }): Problem[] => {
  const p: Problem[] = [];
  const blurb = draft.blurb.trim();
  if (blurb.length > BLURB_MAX) p.push({ field: 'blurb', message: `Over ${BLURB_MAX} characters` });
  if (blurb && FORBIDDEN.test(blurb)) p.push({ field: 'blurb', message: 'Promises something the terms do not' });
  draft.bullets.forEach((b, i) => {
    if (b.trim().length > BULLET_MAX) p.push({ field: 'bullets', index: i, message: `Over ${BULLET_MAX} characters` });
    if (FORBIDDEN.test(b)) p.push({ field: 'bullets', index: i, message: 'Promises something the terms do not' });
  });
  if (draft.bullets.length > BULLETS_MAX) p.push({ field: 'bullets', message: `At most ${BULLETS_MAX} inclusions` });
  return p;
};

/**
 * The offers a buyer cannot currently evaluate: a price and no inclusions.
 * This is the worklist the Services screen opens on.
 */
export const offersMissingInclusions = (rows: Record<string, ServiceContentRow | undefined>): RateCardOffer[] =>
  mergeAll(rows).filter((o) => !o.bullets || o.bullets.length === 0);
