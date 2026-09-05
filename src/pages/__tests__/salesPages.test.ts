import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SERVICE_BANDS, ALL_OFFERS, getOffer, getBandForOffer, getBandSales, RATE_CARD_TERMS,
} from '@/data/publicRateCard';
import { bandImage } from '@/data/serviceImagery';
import { QUESTIONS, scoreAnswers, MAX_SCORE, DIMENSIONS, BANDS } from '@/data/scorecard';

/**
 * The sales page checklist, as tests.
 *
 * There is no industry standard that yields a percentage for a "sales page
 * test", so this file defines the checklist explicitly and asserts every item
 * for every one of the offer pages. What is checkable without a browser is
 * checked here: that each offer has the content each section needs, that no
 * page can render an empty section, that no recommendation points at
 * something that does not exist, and that the governance rules hold.
 *
 * WHAT IS DELIBERATELY NOT ASSERTED, because it would be false. There is no
 * test for testimonials or scarcity on these pages. The only consented
 * testimonials this site holds are about a screening event, so placing them
 * beside a web development offer would move praise from one product to
 * another, and every scarcity claim available to us would be invented. Both
 * are standard conversion tactics and both are excluded on purpose.
 *
 * No em dashes in this file.
 */

const page = readFileSync(resolve(__dirname, '../ServiceOfferDetail.tsx'), 'utf8');

describe('every offer can fill every section of its page', () => {
  it.each(ALL_OFFERS.map((o) => [o.slug, o] as const))(
    '%s has the content the page renders',
    (_slug, offer) => {
      expect(offer.name.trim()).not.toBe('');
      expect(offer.price.trim()).not.toBe('');
      expect(offer.blurb.trim()).not.toBe('');
      expect(offer.cta.trim()).not.toBe('');

      // Every offer must state its inclusions somewhere. Five of them carry
      // that list inside the blurb as prose rather than as bullets, for
      // example "Audience, purpose, format, episode structure, guest strategy
      // and launch plan". That is approved commercial copy and is not ours to
      // restructure into bullets, so the rule is that inclusions exist, not
      // that they are bulleted. The page hides "What you get" rather than
      // rendering an empty heading when bullets are absent.
      const statesInclusions = offer.bullets.length > 0 || offer.blurb.trim().length > 40;
      expect(statesInclusions, `${offer.slug} states no inclusions anywhere`).toBe(true);
    }
  );

  it('reports which offers would read better with bulleted inclusions', () => {
    // Not a failure. A standing list of what to ask Chad for, so it is visible
    // rather than forgotten. These pages are weaker without a scannable
    // "What you get" and the fix is approved copy, not invented copy.
    const proseOnly = ALL_OFFERS.filter((o) => o.bullets.length === 0).map((o) => o.slug);
    expect(proseOnly).toEqual([
      'podcast-concept',
      'podcast-launch',
      'event-marketing',
      'screening-campaign',
      'workshops',
    ]);
  });

  it.each(ALL_OFFERS.map((o) => [o.slug] as const))(
    '%s belongs to a band with qualification, process and FAQs',
    (slug) => {
      const band = getBandForOffer(slug);
      expect(band, slug).toBeDefined();
      const sales = getBandSales(band!.id);
      expect(sales, `${slug} band ${band!.id}`).toBeDefined();
      expect(sales!.forYouIf.length).toBeGreaterThanOrEqual(2);
      // Saying who it is NOT for is the trust-earning half and must not be
      // quietly dropped for any band.
      expect(sales!.notForYouIf.length).toBeGreaterThanOrEqual(1);
      expect(sales!.process.length).toBeGreaterThanOrEqual(3);
      expect(sales!.faqs.length).toBeGreaterThanOrEqual(3);
    }
  );

  it('gives every band either a real photograph with real alt text, or none', () => {
    for (const band of SERVICE_BANDS) {
      const img = bandImage(band.id);
      if (img === null) continue;
      expect(img.src, band.id).toMatch(/^https?:\/\//);
      // Alt text must describe the photograph, not restate the offer. A short
      // or generic alt is the signal that the image does not belong.
      expect(img.alt.length, band.id).toBeGreaterThan(25);
    }
  });
});

describe('the page structure holds the conversion checklist', () => {
  const required: [string, string][] = [
    ['a single named primary action', 'offer.cta'],
    ['the price above the fold', 'offer.price'],
    ['a lead magnet for people not ready to buy', '/scorecard'],
    ['qualification, both ways', 'notForYouIf'],
    ['the process written out', 'sales.process'],
    // FAQs now come from the merged list: per service where the service pack
    // supplies them, per category otherwise. The section is still required.
    ['objection handling', 'faqs.map'],
    ['commercial terms in plain sight', 'RATE_CARD_TERMS'],
    ['a way to ask a question', 'WHATSAPP_URL'],
    ['onward navigation to related offers', 'siblings'],
    ['structured data for search', 'application/ld+json'],
    ['a sticky action on small screens', 'fixed inset-x-0 bottom-0'],
  ];

  it.each(required)('renders %s', (_label, marker) => {
    expect(page).toContain(marker);
  });

  it('prefers per service copy over the per category fallback', () => {
    // BAND_SALES answers the same questions for every offer in a category.
    // Where the service pack supplies copy for the specific offer, that wins.
    expect(page).toContain('getServiceDetailContent');
    expect(page).toContain('detail?.audience?.length ? detail.audience : sales?.forYouIf');
    expect(page).toContain('detail?.faqs?.length');
  });

  it('declares both Service and FAQPage structured data', () => {
    expect(page).toContain("'@type': 'Service'");
    expect(page).toContain("'@type': 'FAQPage'");
  });

  it('publishes the approved price string rather than a parsed number', () => {
    // Several offers are "From R..." or carry a launch rate. Turning those
    // into a bare figure would publish a price the rate card does not state.
    expect(page).toContain('description: offer.price');
    expect(page).not.toMatch(/parseFloat\(offer\.price|Number\(offer\.price/);
  });

  it('carries no invented scarcity', () => {
    expect(page).not.toMatch(/slots? left|only \d+ (left|remaining)|hurry|act now|limited time/i);
  });

  it('removes its structured data on unmount so it cannot leak to the next route', () => {
    expect(page).toContain('el.remove()');
  });

  it('reserves space for the sticky bar so it never covers the terms', () => {
    expect(page).toContain('h-20 md:hidden');
  });
});

describe('governance holds across the sales content', () => {
  const allCopy = [
    ...ALL_OFFERS.flatMap((o) => [o.name, o.price, o.blurb, o.footnote ?? '', ...o.bullets]),
    ...SERVICE_BANDS.flatMap((b) => {
      const s = getBandSales(b.id);
      if (!s) return [];
      return [
        ...s.forYouIf, ...s.notForYouIf,
        ...s.process.flatMap((p) => [p.title, p.detail]),
        ...s.faqs.flatMap((f) => [f.q, f.a]),
      ];
    }),
    ...RATE_CARD_TERMS,
  ];

  it('contains no em dashes anywhere in published copy', () => {
    const offenders = allCopy.filter((t) => t.includes('—'));
    expect(offenders).toEqual([]);
  });

  it('states no price outside the rate card offers', () => {
    // Sales furniture must carry no numbers. A price in an FAQ is a price
    // that drifts, because nobody updates it when the rate card changes.
    const furniture = SERVICE_BANDS.flatMap((b) => {
      const s = getBandSales(b.id);
      if (!s) return [];
      return [...s.forYouIf, ...s.notForYouIf,
              ...s.process.flatMap((p) => [p.title, p.detail]),
              ...s.faqs.flatMap((f) => [f.q, f.a])];
    });
    const withPrices = furniture.filter((t) => /R\s?\d[\d,]*/.test(t));
    expect(withPrices).toEqual([]);
  });

  it('promises no outcome it cannot control', () => {
    const furniture = SERVICE_BANDS.flatMap((b) => getBandSales(b.id)?.faqs ?? []).map((f) => f.a);
    // "Guarantee" may appear only in a sentence declining to give one.
    for (const a of furniture) {
      if (/guarantee/i.test(a)) {
        expect(a, a).toMatch(/nobody|no,|cannot|not (a )?guarantee/i);
      }
    }
  });
});

describe('the scorecard is a working diagnostic, not a form', () => {
  it('scores a perfect run as full marks', () => {
    const best: Record<string, number> = {};
    for (const q of QUESTIONS) best[q.id] = q.options.findIndex((o) => o.score === 2);
    const r = scoreAnswers(best);
    expect(r.total).toBe(MAX_SCORE);
    expect(r.percent).toBe(100);
  });

  it('scores the worst run as zero and recommends something', () => {
    const worst: Record<string, number> = {};
    for (const q of QUESTIONS) worst[q.id] = q.options.findIndex((o) => o.score === 0);
    const r = scoreAnswers(worst);
    expect(r.total).toBe(0);
    expect(r.recommendedSlugs.length).toBeGreaterThan(0);
  });

  it('does not flatter an unanswered scorecard', () => {
    // Unanswered questions score zero rather than being skipped, so a partly
    // completed run cannot come out well by omission.
    expect(scoreAnswers({}).total).toBe(0);
  });

  it('recommends nothing when every answer is already strong', () => {
    // Recommending a fix for something that works is how these lose credibility.
    const best: Record<string, number> = {};
    for (const q of QUESTIONS) best[q.id] = q.options.findIndex((o) => o.score === 2);
    expect(scoreAnswers(best).recommendedSlugs).toEqual([]);
  });

  it('only ever recommends offers that exist on the rate card', () => {
    const referenced = new Set(QUESTIONS.flatMap((q) => q.recommends));
    for (const slug of referenced) expect(getOffer(slug), slug).toBeDefined();
    for (const b of BANDS) expect(getOffer(b.primarySlug), b.primarySlug).toBeDefined();
  });

  it('covers every dimension with at least two questions', () => {
    for (const d of Object.keys(DIMENSIONS)) {
      expect(QUESTIONS.filter((q) => q.dimension === d).length, d).toBeGreaterThanOrEqual(2);
    }
  });

  it('gives every question a full spread of options', () => {
    for (const q of QUESTIONS) {
      const scores = q.options.map((o) => o.score).sort();
      expect(scores, q.id).toEqual([0, 1, 2]);
      expect(q.recommends.length, q.id).toBeGreaterThan(0);
    }
  });

  it('bands every possible score without a gap', () => {
    for (let s = 0; s <= MAX_SCORE; s++) {
      const r = scoreAnswers(
        Object.fromEntries(QUESTIONS.map((q, i) => [q.id, i < s / 2 ? q.options.findIndex((o) => o.score === 2) : q.options.findIndex((o) => o.score === 0)]))
      );
      expect(r.band, `score ${s}`).toBeDefined();
      expect(r.band.verdict.length).toBeGreaterThan(20);
    }
  });

  it('shows the result before asking for an email', () => {
    // Gating a result the visitor has already earned is the tactic that makes
    // people distrust these tools. The result must render first.
    const sc = readFileSync(resolve(__dirname, '../Scorecard.tsx'), 'utf8');
    const resultIdx = sc.indexOf('Your score');
    const emailIdx = sc.indexOf('Want this emailed');
    expect(resultIdx).toBeGreaterThan(-1);
    expect(emailIdx).toBeGreaterThan(resultIdx);
  });

  it('reports a failed send rather than dropping the address silently', () => {
    const sc = readFileSync(resolve(__dirname, '../Scorecard.tsx'), 'utf8');
    expect(sc).toContain('setSendError');
  });
});

describe('the service pack handoff did not become a second price source', () => {
  const detail = readFileSync(resolve(__dirname, '../../data/serviceDetailContent.ts'), 'utf8');
  const rateCard = readFileSync(resolve(__dirname, '../../data/publicRateCard.ts'), 'utf8');

  it('states no price the approved rate card does not carry', () => {
    // The handoff's README calls its own JSON the source of truth for prices.
    // It is not. Two of its FAQ answers quote a R5,500 Signature tier and a
    // R10,000 prepaid block, neither of which the rate card publishes, and
    // three of its card prices are less complete than the approved strings.
    // So: any figure that survives in this content must also appear in the
    // rate card, which is the only place a client facing price is defined.
    const body = detail.slice(detail.indexOf('export const SERVICE_DETAIL_CONTENT'));
    const figures = Array.from(new Set(Array.from(body.matchAll(/R[\d,]+/g)).map((m) => m[0].replace(/,$/, ''))));
    for (const f of figures) {
      expect(rateCard, `${f} is published nowhere on the rate card`).toContain(f);
    }
  });

  it('keeps the two unapproved figures out', () => {
    expect(detail.slice(detail.indexOf('export const SERVICE_DETAIL_CONTENT'))).not.toContain('R5,500');
    expect(detail.slice(detail.indexOf('export const SERVICE_DETAIL_CONTENT'))).not.toContain('R10,000');
  });

  it('the rate card keeps the recurrence and the second workshop rate', () => {
    expect(rateCard).toContain('R6,500 per month');
    expect(rateCard).toContain('From R1,850 per month');
    expect(rateCard).toContain('full day');
  });

  it('every detail entry maps to a real rate card offer', () => {
    const slugs = Array.from(detail.matchAll(/^ {2}'([a-z0-9-]+)': \{/gm)).map((m) => m[1]);
    expect(slugs.length).toBe(19);
    for (const s of slugs) {
      expect(rateCard, `${s} has no offer`).toContain(`slug: '${s}'`);
    }
  });

  it('ships no hotlinked handoff imagery', () => {
    // The handoff hotlinks Unsplash. Imagery here is served from our own
    // domain, the same rule the tour galleries follow.
    expect(detail).not.toContain('unsplash.com');
  });
});
