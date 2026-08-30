import { SPECTRUM } from './publicRateCard';

/**
 * The Revenue Readiness Scorecard: the free way in.
 *
 * WHY A SCORECARD AND NOT AN EBOOK. A lead magnet has to be worth the email
 * address on its own, whether or not the visitor ever buys. A downloadable
 * guide is worth very little and everyone knows it. A diagnostic that tells
 * someone specifically what is wrong with their setup is worth something
 * immediately, and it does the qualifying work for us: by the time a result
 * appears we know which of our offers actually fits, and so does the visitor.
 *
 * The offer was already named in Chad's approved promo copy as "the free
 * Revenue Readiness Scorecard" alongside the R1,500 clarity session. This
 * builds the thing that copy refers to.
 *
 * TWO RULES THIS FILE KEEPS.
 *
 * 1. The result is shown in full before any email is requested. Withholding a
 *    result the visitor has already earned in order to extract an address is
 *    the tactic that makes people distrust these, and it converts worse than
 *    giving it away, because a person who has seen a useful answer has a
 *    reason to hand over the address and a person staring at a form does not.
 *
 * 2. Recommendations point only at offers that exist on the rate card, by
 *    slug. No question recommends something we do not sell, and no
 *    recommendation carries a price, because prices live in publicRateCard.ts
 *    and are read from there.
 *
 * No em dashes in this file.
 */

export interface ScorecardOption {
  label: string;
  /** 0 is worst, 2 is best. Kept small so the weighting stays legible. */
  score: 0 | 1 | 2;
}

export interface ScorecardQuestion {
  id: string;
  dimension: Dimension;
  question: string;
  help?: string;
  options: ScorecardOption[];
  /** Rate card slugs this question points at when the answer scores low. */
  recommends: string[];
}

export type Dimension = 'offer' | 'website' | 'content' | 'conversion' | 'measurement';

export const DIMENSIONS: Record<Dimension, { label: string; hue: string; blurb: string }> = {
  offer: {
    label: 'Your offer',
    hue: SPECTRUM.teal,
    blurb: 'Whether a stranger can tell what you sell and what it costs.',
  },
  website: {
    label: 'Your website',
    hue: SPECTRUM.blue,
    blurb: 'Whether the site does a job or just exists.',
  },
  content: {
    label: 'Your content',
    hue: SPECTRUM.orange,
    blurb: 'Whether anything is published often enough to compound.',
  },
  conversion: {
    label: 'Your route to payment',
    hue: SPECTRUM.green,
    blurb: 'Whether an interested person can actually book or buy.',
  },
  measurement: {
    label: 'Your measurement',
    hue: SPECTRUM.violet,
    blurb: 'Whether you can tell what worked.',
  },
};

export const QUESTIONS: ScorecardQuestion[] = [
  {
    id: 'offer-clarity',
    dimension: 'offer',
    question: 'Can a stranger tell what you sell within ten seconds of landing on your site?',
    options: [
      { label: 'No, they would have to read around to work it out', score: 0 },
      { label: 'Roughly, but it is not stated plainly anywhere', score: 1 },
      { label: 'Yes, it is the first thing on the page', score: 2 },
    ],
    recommends: ['clarity-session', 'brand-content-audit'],
  },
  {
    id: 'offer-price',
    dimension: 'offer',
    question: 'Are your prices published?',
    help: 'Published prices filter out enquiries you were never going to win.',
    options: [
      { label: 'No, everything is quoted on request', score: 0 },
      { label: 'Some of it, or only a from price', score: 1 },
      { label: 'Yes, the main offers carry a number', score: 2 },
    ],
    recommends: ['clarity-session'],
  },
  {
    id: 'site-exists',
    dimension: 'website',
    question: 'Where does your business actually live online?',
    options: [
      { label: 'Social media only', score: 0 },
      { label: 'A site that is out of date or half finished', score: 1 },
      { label: 'A current site we control', score: 2 },
    ],
    recommends: ['landing-page', 'revenue-sprint'],
  },
  {
    id: 'site-mobile',
    dimension: 'website',
    question: 'When did you last open your own site on a phone and try to buy from it?',
    options: [
      { label: 'Not recently, or it is awkward on a phone', score: 0 },
      { label: 'It works but it is not pleasant', score: 1 },
      { label: 'Recently, and it was fine', score: 2 },
    ],
    recommends: ['website-audit'],
  },
  {
    id: 'content-cadence',
    dimension: 'content',
    question: 'How often does something new go out?',
    help: 'Consistency matters more than volume. Stopping in week three is the usual pattern.',
    options: [
      { label: 'In bursts, then nothing for weeks', score: 0 },
      { label: 'Most weeks, when there is time', score: 1 },
      { label: 'On a schedule somebody owns', score: 2 },
    ],
    recommends: ['content-starter-pack', 'growth-desk'],
  },
  {
    id: 'content-owner',
    dimension: 'content',
    question: 'Who is responsible for it?',
    options: [
      { label: 'Whoever remembers', score: 0 },
      { label: 'The founder, on top of everything else', score: 1 },
      { label: 'A named person or partner', score: 2 },
    ],
    recommends: ['growth-desk', 'social-media-management'],
  },
  {
    id: 'conversion-route',
    dimension: 'conversion',
    question: 'What happens when someone decides they want to buy?',
    options: [
      { label: 'They have to message us and wait', score: 0 },
      { label: 'There is a form, then a manual back and forth', score: 1 },
      { label: 'They can book or pay without us', score: 2 },
    ],
    recommends: ['revenue-sprint', 'landing-page'],
  },
  {
    id: 'conversion-followup',
    dimension: 'conversion',
    question: 'What happens to an enquiry that does not reply?',
    options: [
      { label: 'Nothing, it goes quiet', score: 0 },
      { label: 'Someone chases it when they notice', score: 1 },
      { label: 'There is a follow up that happens anyway', score: 2 },
    ],
    recommends: ['growth-desk'],
  },
  {
    id: 'measure-analytics',
    dimension: 'measurement',
    question: 'Do you know how many people visited your site last month?',
    options: [
      { label: 'No', score: 0 },
      { label: 'Roughly, from social media numbers', score: 1 },
      { label: 'Yes, from analytics on the site', score: 2 },
    ],
    recommends: ['website-audit', 'visibility-sprint'],
  },
  {
    id: 'measure-source',
    dimension: 'measurement',
    question: 'Do you know where your last five customers came from?',
    help: 'This is the question that decides where the next rand of effort goes.',
    options: [
      { label: 'No', score: 0 },
      { label: 'Some of them', score: 1 },
      { label: 'Yes, all five', score: 2 },
    ],
    recommends: ['visibility-sprint', 'clarity-session'],
  },
];

export const MAX_SCORE = QUESTIONS.length * 2;

export interface Band {
  min: number;
  label: string;
  hue: string;
  verdict: string;
  /** The single next step for someone in this band. */
  primarySlug: string;
}

/**
 * Bands are deliberately blunt. A scorecard that tells everyone they are
 * "almost there" is flattery and is worth nothing to the reader.
 */
export const BANDS: Band[] = [
  {
    min: 0,
    label: 'Starting from scratch',
    hue: SPECTRUM.red,
    verdict:
      'The basics are not in place yet. That is a normal position to be in and it is cheaper to fix now than after you have spent money driving traffic to it.',
    primarySlug: 'clarity-session',
  },
  {
    min: 8,
    label: 'Working, but leaking',
    hue: SPECTRUM.orange,
    verdict:
      'The pieces exist and people are falling through the gaps between them. This is usually the cheapest score to improve, because nothing has to be built from nothing.',
    primarySlug: 'website-audit',
  },
  {
    min: 14,
    label: 'Ready to push',
    hue: SPECTRUM.green,
    verdict:
      'The foundation holds. The return now comes from consistency and from measuring what works rather than from building anything new.',
    primarySlug: 'growth-desk',
  },
];

export const bandFor = (score: number): Band =>
  [...BANDS].reverse().find((b) => score >= b.min) ?? BANDS[0];

export interface ScorecardResult {
  total: number;
  max: number;
  percent: number;
  band: Band;
  byDimension: { dimension: Dimension; score: number; max: number }[];
  /** Weakest dimensions first, which is the order to act in. */
  priorities: Dimension[];
  /** Deduplicated rate card slugs, weakest answers first. */
  recommendedSlugs: string[];
}

/**
 * Score a set of answers.
 *
 * Answers are keyed by question id and hold the chosen option index.
 * Unanswered questions score zero rather than being skipped, so a partly
 * completed scorecard cannot flatter someone by omission.
 */
export const scoreAnswers = (answers: Record<string, number>): ScorecardResult => {
  let total = 0;
  const dimTotals: Record<string, { score: number; max: number }> = {};
  const lowFirst: { slug: string; score: number }[] = [];

  for (const q of QUESTIONS) {
    const idx = answers[q.id];
    const opt = idx !== undefined ? q.options[idx] : undefined;
    const s = opt ? opt.score : 0;
    total += s;

    dimTotals[q.dimension] ??= { score: 0, max: 0 };
    dimTotals[q.dimension].score += s;
    dimTotals[q.dimension].max += 2;

    // Only a weak answer earns a recommendation. Recommending a fix for
    // something already working is how these tools lose credibility.
    if (s < 2) for (const slug of q.recommends) lowFirst.push({ slug, score: s });
  }

  const byDimension = (Object.keys(DIMENSIONS) as Dimension[]).map((d) => ({
    dimension: d,
    score: dimTotals[d]?.score ?? 0,
    max: dimTotals[d]?.max ?? 0,
  }));

  const priorities = [...byDimension]
    .sort((a, b) => a.score / (a.max || 1) - b.score / (b.max || 1))
    .map((d) => d.dimension);

  const seen = new Set<string>();
  const recommendedSlugs = lowFirst
    .sort((a, b) => a.score - b.score)
    .map((r) => r.slug)
    .filter((s) => (seen.has(s) ? false : (seen.add(s), true)))
    .slice(0, 3);

  return {
    total,
    max: MAX_SCORE,
    percent: Math.round((total / MAX_SCORE) * 100),
    band: bandFor(total),
    byDimension,
    priorities,
    recommendedSlugs,
  };
};
