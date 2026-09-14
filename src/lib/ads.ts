import { ALL_OFFERS, getBandForOffer, type RateCardOffer } from '@/data/publicRateCard';

/**
 * Google Ads, from the rate card.
 *
 * WHAT THIS IS. Pick an offer, get a Search campaign for it: keywords, a
 * responsive search ad with headlines and descriptions inside Google's
 * character limits, a landing URL with tracking, and a file Google Ads
 * accepts as a bulk upload. The copy starts as a deterministic draft built
 * from the offer's own name, price and bullets, so there is always
 * something correct on screen; the AI pass (generate-ad-copy) rewrites it
 * for punch and the limits here are re-applied to whatever comes back.
 *
 * WHAT IT IS NOT, YET. A button that creates the campaign inside Google
 * Ads. That needs the Google Ads API, which needs a developer token Google
 * grants per manager account after an application. Until that is in hand,
 * the file is the hand-off: Google Ads accepts it under Tools, Bulk
 * actions, Uploads, or Google Ads Editor imports it. One upload, not one
 * ad typed at a time.
 *
 * THE RULES THE COPY MUST OBEY are the site's: prices only from the rate
 * card, no guarantees of results, no invented claims. The validator
 * refuses "guarantee" and its cousins so a headline cannot promise what
 * the terms explicitly do not.
 *
 * No em dashes in this file.
 */

export const LIMITS = {
  headline: 30,
  description: 90,
  path: 15,
  headlinesMin: 3,
  headlinesMax: 15,
  descriptionsMin: 2,
  descriptionsMax: 4,
} as const;

export const FORBIDDEN = /\b(guarantee[ds]?|guaranteeing|#1|number one|best in (cape town|south africa)|cheapest|free money|risk[- ]free|100%)\b/i;

export interface AdCopy {
  headlines: string[];
  descriptions: string[];
  keywords: string[];
  path1: string;
  path2: string;
}

export interface AdPlan {
  offer: RateCardOffer;
  campaign: string;
  adGroup: string;
  finalUrl: string;
  dailyBudget: number;
  location: string;
  copy: AdCopy;
}

export interface Problem {
  field: 'headlines' | 'descriptions' | 'keywords' | 'path1' | 'path2' | 'finalUrl' | 'budget';
  index?: number;
  message: string;
}

const SITE = 'https://omniwellnessmedia.co.za';

export const landingUrl = (offer: RateCardOffer, campaign: string): string => {
  const u = new URL(`${SITE}/services/${offer.slug}`);
  u.searchParams.set('utm_source', 'google');
  u.searchParams.set('utm_medium', 'cpc');
  u.searchParams.set('utm_campaign', campaign.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  return u.toString();
};

/** Trim to a limit on a word boundary, never mid-word, never with a trailing comma. */
export const fit = (text: string, limit: number): string => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= limit) return t;
  const cut = t.slice(0, limit + 1);
  const at = cut.lastIndexOf(' ');
  return (at > 0 ? cut.slice(0, at) : t.slice(0, limit)).replace(/[,;:\-\s]+$/, '');
};

const uniq = (xs: string[]): string[] => {
  const seen = new Set<string>();
  return xs.filter((x) => {
    const k = x.toLowerCase();
    if (!x || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/** A correct, unexciting draft from the offer itself. Every line is inside the limits. */
export const draftCopy = (offer: RateCardOffer): AdCopy => {
  const band = getBandForOffer(offer.slug);
  const price = offer.price.replace(/\s+/g, ' ');
  const headlines = uniq([
    offer.name,
    `${offer.name.split(' ').slice(0, 3).join(' ')} ${price.replace(/^From /i, 'from ')}`,
    'Omni Wellness Media',
    'Muizenberg, Cape Town',
    'Scope agreed in writing',
    'Published rates in rand',
    ...offer.bullets,
    band ? band.heading : '',
    'Quotes valid 14 days',
    'Reply the same working day',
  ].map((h) => fit(h, LIMITS.headline))).slice(0, LIMITS.headlinesMax);

  const descriptions = uniq([
    offer.blurb,
    `${offer.name}, ${price}. ${offer.bullets.slice(0, 2).join('. ')}.`,
    'A Cape Town media company. Published rates, scope agreed in writing before anything starts.',
    'Tell us what you are working on and a person replies, usually the same working day.',
  ].map((d) => fit(d, LIMITS.description))).slice(0, LIMITS.descriptionsMax);

  const words = offer.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, '').split(' ').filter((w) => w.length > 2);
  const keywords = uniq([
    offer.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ''),
    `${words.slice(-2).join(' ')} cape town`,
    `${words.slice(-2).join(' ')} muizenberg`,
    band ? `${band.heading.toLowerCase().replace(/[^a-z0-9 ]/g, '')} cape town` : '',
    ...offer.bullets.map((b) => b.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()).filter((b) => b.split(' ').length <= 4),
  ]).slice(0, 12);

  return {
    headlines,
    descriptions,
    keywords,
    path1: fit(band ? band.id : 'services', LIMITS.path).replace(/\s+/g, '-'),
    path2: fit(offer.slug, LIMITS.path),
  };
};

/** Force any copy, AI's included, back inside the limits and the rules. */
export const normaliseCopy = (copy: Partial<AdCopy>, fallback: AdCopy): AdCopy => {
  const clean = (xs: unknown, limit: number, max: number, fb: string[]) => {
    const arr = Array.isArray(xs) ? xs.filter((x): x is string => typeof x === 'string') : [];
    const kept = uniq(arr.map((x) => fit(x, limit)).filter((x) => x && !FORBIDDEN.test(x)));
    return (kept.length ? kept : fb).slice(0, max);
  };
  return {
    headlines: clean(copy.headlines, LIMITS.headline, LIMITS.headlinesMax, fallback.headlines),
    descriptions: clean(copy.descriptions, LIMITS.description, LIMITS.descriptionsMax, fallback.descriptions),
    keywords: clean(copy.keywords, 80, 20, fallback.keywords).map((k) => k.toLowerCase()),
    path1: fit(typeof copy.path1 === 'string' ? copy.path1 : fallback.path1, LIMITS.path),
    path2: fit(typeof copy.path2 === 'string' ? copy.path2 : fallback.path2, LIMITS.path),
  };
};

export const validatePlan = (plan: AdPlan): Problem[] => {
  const p: Problem[] = [];
  const { copy } = plan;
  if (copy.headlines.length < LIMITS.headlinesMin) p.push({ field: 'headlines', message: `Google needs at least ${LIMITS.headlinesMin} headlines` });
  if (copy.headlines.length > LIMITS.headlinesMax) p.push({ field: 'headlines', message: `At most ${LIMITS.headlinesMax} headlines` });
  copy.headlines.forEach((h, i) => {
    if (h.length > LIMITS.headline) p.push({ field: 'headlines', index: i, message: `Over ${LIMITS.headline} characters` });
    if (FORBIDDEN.test(h)) p.push({ field: 'headlines', index: i, message: 'Promises something the terms do not' });
  });
  if (copy.descriptions.length < LIMITS.descriptionsMin) p.push({ field: 'descriptions', message: `Google needs at least ${LIMITS.descriptionsMin} descriptions` });
  copy.descriptions.forEach((d, i) => {
    if (d.length > LIMITS.description) p.push({ field: 'descriptions', index: i, message: `Over ${LIMITS.description} characters` });
    if (FORBIDDEN.test(d)) p.push({ field: 'descriptions', index: i, message: 'Promises something the terms do not' });
  });
  if (copy.keywords.length === 0) p.push({ field: 'keywords', message: 'At least one keyword' });
  if (copy.path1.length > LIMITS.path) p.push({ field: 'path1', message: `Over ${LIMITS.path} characters` });
  if (copy.path2.length > LIMITS.path) p.push({ field: 'path2', message: `Over ${LIMITS.path} characters` });
  if (!/^https:\/\//.test(plan.finalUrl)) p.push({ field: 'finalUrl', message: 'Needs an https URL' });
  if (!(plan.dailyBudget > 0)) p.push({ field: 'budget', message: 'Daily budget must be above zero' });
  return p;
};

const csvCell = (v: string | number): string => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Rows in the shape Google Ads Editor imports and Google Ads accepts as a
 * bulk upload: one campaign row, one ad group row, one row per keyword,
 * one responsive search ad row. Column names follow Google's own upload
 * templates; if the account asks to map a column on first import, the
 * names here are what to map them to.
 */
export const uploadRows = (plan: AdPlan): Record<string, string | number>[] => {
  const base = { Campaign: plan.campaign, 'Campaign type': 'Search', 'Campaign status': 'Paused', 'Ad group': '', 'Ad group status': '' };
  const rows: Record<string, string | number>[] = [];
  rows.push({ ...base, Budget: plan.dailyBudget, 'Budget type': 'Daily', Location: plan.location, Languages: 'en' });
  rows.push({ ...base, 'Ad group': plan.adGroup, 'Ad group status': 'Enabled', 'Ad group type': 'Standard' });
  for (const k of plan.copy.keywords) {
    rows.push({ ...base, 'Ad group': plan.adGroup, Keyword: k, 'Criterion type': 'Phrase', 'Keyword status': 'Enabled' });
  }
  const ad: Record<string, string | number> = { ...base, 'Ad group': plan.adGroup, 'Ad type': 'Responsive search ad', 'Ad status': 'Enabled', 'Final URL': plan.finalUrl, 'Path 1': plan.copy.path1, 'Path 2': plan.copy.path2 };
  plan.copy.headlines.forEach((h, i) => { ad[`Headline ${i + 1}`] = h; });
  plan.copy.descriptions.forEach((d, i) => { ad[`Description ${i + 1}`] = d; });
  rows.push(ad);
  return rows;
};

export const toCsv = (rows: Record<string, string | number>[]): string => {
  const cols: string[] = [];
  for (const r of rows) for (const k of Object.keys(r)) if (!cols.includes(k)) cols.push(k);
  const lines = [cols.map(csvCell).join(',')];
  for (const r of rows) lines.push(cols.map((c) => csvCell(r[c] ?? '')).join(','));
  return lines.join('\r\n');
};

export const defaultPlan = (offer: RateCardOffer): AdPlan => {
  const campaign = `Omni Search: ${offer.name}`;
  return {
    offer,
    campaign,
    adGroup: offer.name,
    finalUrl: landingUrl(offer, campaign),
    dailyBudget: 150,
    location: 'Cape Town, Western Cape, South Africa',
    copy: draftCopy(offer),
  };
};

export const offersForAds = (): RateCardOffer[] => ALL_OFFERS;
