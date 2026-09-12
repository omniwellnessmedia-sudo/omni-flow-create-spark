import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
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
      // These used to be absolute Supabase storage URLs. They are local files
      // now, which is the stronger requirement: same origin, no third party
      // that can move or rate limit them, and a build that fails loudly if
      // one was never committed.
      expect(img.src, band.id).toMatch(/^\/services\/[a-z-]+\.webp$/);
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
    // The label is no longer written here. WhatsappButton derives it from
    // the link, so a channel cannot be presented as a way to message us.
    ['a way to ask a question', 'WhatsappButton'],
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

  it('never reinstates the withdrawn prepaid block price', () => {
    // R10,000 for ten prepaid hours was withdrawn on 27 August 2026 because
    // it implied R1,000 per hour against a published rate of R1,500. The
    // handoff still carries it in an FAQ answer. Nothing in this repository
    // may republish it without written sign off on a block rate.
    const body = detail.slice(detail.indexOf('export const SERVICE_DETAIL_CONTENT'));
    expect(body).not.toContain('R10,000');
    expect(rateCard).not.toMatch(/price:\s*'[^']*R10,000/);
  });

  it('keeps the digital resource prices out until they are on the rate card', () => {
    // The handoff prices four downloadable kits at R199, R349, R499 and R799.
    // None appears on the rate card, so none may reach a public page yet.
    const body = detail.slice(detail.indexOf('export const SERVICE_DETAIL_CONTENT'));
    for (const f of ['R199', 'R349', 'R499', 'R799']) {
      expect(body, `${f} is not an approved price`).not.toContain(f);
    }
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

describe('the pricing page publishes only rate card figures', () => {
  const pricingFile = readFileSync(resolve(__dirname, '../Pricing.tsx'), 'utf8');
  // The file header records which figures are deliberately excluded and why,
  // so the guards apply to the code below it, which is what renders.
  const pricing = pricingFile.slice(pricingFile.indexOf('const INK'));

  it('writes no price of its own', () => {
    // Every figure is read from publicRateCard.ts by slug, so a rate change
    // reaches this page without anyone editing it.
    expect(pricing).not.toMatch(/R\s?\d/);
    expect(pricingFile).toContain('getOffer');
    expect(pricingFile).toContain('{t.offer!.price}');
  });

  it('omits the digital kits until their prices are approved', () => {
    for (const f of ['R199', 'R349', 'R499', 'R799']) {
      expect(pricing).not.toContain(f);
    }
  });

  it('lists the quoted areas rather than showing them with an empty rate', () => {
    expect(pricing).toContain('QUOTED_CATEGORIES');
    expect(pricing).toContain('Quoted on scope');
  });
});

describe('the services hero matches the handoff treatment', () => {
  const svc = readFileSync(resolve(__dirname, '../Services.tsx'), 'utf8');

  it('sits on ink, as the handoff sets it', () => {
    expect(svc).toContain('<section className="relative overflow-hidden" style={{ background: INK }}>');
  });

  it('frames the banner at 21:9 under the spectrum rule', () => {
    expect(svc).toContain('aspect-[21/9]');
    expect(svc).toContain('<SpectrumRule />');
  });

  it('uses an image about the work, served from our own origin', () => {
    // THIS TEST USED TO REQUIRE THE OPPOSITE. It pinned the Masque Theatre
    // photograph and forbade stock, on the reasoning that we hold rights to a
    // picture of the thing we actually sell. The reasoning was half right:
    // we do hold the rights, and a theatre stage is not what this page sells.
    // It sells audits, websites, content and retainers. The owner asked for
    // imagery that matches the offers, so licensed stock replaced it.
    //
    // What still has to hold is that the image is ours to serve and cheap to
    // load: a local file, not a hotlink to somebody else's CDN that can move,
    // rate limit or start charging.
    expect(svc).toContain('/services/services-hero.webp');
    expect(svc).not.toMatch(/src="https?:\/\//);
  });

  it('gives the hero intrinsic dimensions and a loading priority', () => {
    // It is the largest contentful paint on this route. Without width and
    // height the page reflows around it, and without the priority hint the
    // browser discovers it late.
    expect(svc).toContain('fetchPriority="high"');
    expect(svc).toMatch(/width=\{1600\}[\s\S]{0,40}height=\{686\}/);
  });

  it('offers every category as a jump target, including quotation-based', () => {
    expect(svc).toContain('{ href: "#quote", label: "Quotation-based"');
    expect(svc).toContain('SERVICE_BANDS.map((b) => ({ href: `#${b.id}`');
  });

  it('keeps one h1', () => {
    expect((svc.match(/<h1/g) || []).length).toBe(1);
  });
});

describe('service and screening imagery', () => {
  const svc = readFileSync(resolve(__dirname, '../Services.tsx'), 'utf8');
  const scr = readFileSync(resolve(__dirname, '../Screenings.tsx'), 'utf8');
  const dir = resolve(__dirname, '../../../public/services');

  const REFERENCED = [
    'services-hero.webp',
    'clarity-audit.webp',
    'build-sprint.webp',
    'content-brand.webp',
    'retainer-support.webp',
    'campaign-events.webp',
    'screening-curtains.webp',
    'screening-seats.webp',
    'screening-tickets.webp',
    'screening-popcorn.webp',
  ];

  it.each(REFERENCED)('%s exists on disk', (file) => {
    // A referenced image that was never committed renders as a broken box,
    // and nothing in a typecheck or a build catches it.
    expect(existsSync(resolve(dir, file))).toBe(true);
  });

  it.each(REFERENCED)('%s is small enough to serve', (file) => {
    // These arrived as camera and stock originals between 276KB and 1.6MB.
    // Shipping them unprocessed is the difference between a page that loads
    // on South African mobile data and one that does not.
    const bytes = statSync(resolve(dir, file)).size;
    expect(bytes, `${file} is ${Math.round(bytes / 1024)}KB`).toBeLessThan(250 * 1024);
  });

  it.each(REFERENCED)('%s is not excluded from the deploy by .gitignore', (file) => {
    // THE TRAP THIS CATCHES. .gitignore blanket-ignores *.webp to keep bulk
    // media out of the repository, with an explicit exception per directory.
    // Miss the exception and the page references an image that was never
    // committed: the build succeeds, the typecheck passes, the file sits on
    // the disk of whoever added it, and the live site shows a broken box.
    // Nothing else in this suite would notice.
    const ignore = readFileSync(resolve(__dirname, '../../../.gitignore'), 'utf8');
    expect(ignore, 'public/services/*.webp needs a ! exception in .gitignore')
      .toMatch(/^!public\/services\/\*\.webp$/m);
    expect(file).toMatch(/\.webp$/);
  });

  it('ships no unprocessed source originals', () => {
    // The originals stay in git history and in the owner's Drive. Keeping a
    // 1.6MB JPEG next to the 60KB WebP that replaced it invites somebody to
    // reference the wrong one.
    const stray = readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f));
    expect(stray, `unprocessed originals left in public/services: ${stray.join(', ')}`).toEqual([]);
  });

  it('gives every band image intrinsic dimensions and lazy loading', () => {
    // Only the hero loads eagerly. Everything below the fold waits.
    expect(svc).toMatch(/src=\{image\.src\}[\s\S]{0,200}loading="lazy"/);
    expect(svc).toMatch(/src=\{image\.src\}[\s\S]{0,200}width=\{1400\}/);
  });

  it('illustrates all four screening offerings', () => {
    // They carried an icon and nothing else on the section where somebody
    // chooses between R500 and R25,000.
    expect((scr.match(/image: '\/services\/screening-/g) || []).length).toBe(4);
    expect(scr).toMatch(/src=\{o\.image\}/);
    expect(scr).toMatch(/alt=\{o\.imageAlt\}/);
  });

  it("leaves the screenings collage as Omni's own photography", () => {
    // The collage is the evidence on that page. Stock belongs on the price
    // cards, not where a reader is being shown what we have actually done.
    expect(scr).toContain('IMAGES.services.artscape');
    expect(scr).toContain('/screenings/night/qa-panel-wide.webp');
  });
});
