import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TOUR_GALLERY_MANIFEST, withManifestImages } from '@/data/tourGalleries';

/**
 * The tour landing pages, held to the same rules as everything else here.
 *
 * WHY THESE EXIST. On 30 August 2026 all three pages were found publishing
 * invented aggregate ratings to search engines (5.0 from 47 reviews, 4.9 from
 * 127, 4.8 from 38) with no review source anywhere in the repository, plus a
 * Foundation branded Section 18A card on what is the commercial entity, plus
 * a provider domain we do not hold. Each of those is the kind of thing that
 * quietly comes back when someone copies an old page as a template, so they
 * are pinned here rather than left to review.
 *
 * No em dashes in this file.
 */

const PAGES = [
  'GreatMotherCaveTour.tsx',
  'MuizenbergCaveTours.tsx',
  'KalkBayTour.tsx',
].map((f) => [f, readFileSync(resolve(__dirname, '../tours', f), 'utf8')] as const);

describe('no invented review markup', () => {
  it.each(PAGES)('%s passes no rating without a review source', (_f, src) => {
    // The SEO helper now drops ratings lacking a reviewSource, but the page
    // must not pass invented figures at all.
    expect(src).not.toMatch(/rating:\s*[\d.]/);
    expect(src).not.toMatch(/reviewCount:\s*\d/);
  });

  it('the SEO helper refuses a rating without a source', () => {
    const seo = readFileSync(resolve(__dirname, '../../lib/seo.ts'), 'utf8');
    expect(seo).toContain('data.rating && data.reviewCount && data.reviewSource');
  });

  it('the provider domain is one we hold', () => {
    const seo = readFileSync(resolve(__dirname, '../../lib/seo.ts'), 'utf8');
    expect(seo).not.toContain("'https://omni-wellness.com'");
    expect(seo).toContain('https://omniwellnessmedia.co.za');
  });
});

describe('commercial entity separation', () => {
  it.each(PAGES)('%s carries no Foundation branding or tax language', (_f, src) => {
    // Standing rule: this is the commercial entity. Foundation branding,
    // donation links and Section 18A language do not appear on it.
    expect(src).not.toMatch(/Phil-?afel/i);
    expect(src).not.toMatch(/Section 18A/i);
    expect(src).not.toMatch(/tax.deductible/i);
    // The unverifiable proceeds figure must not return either.
    expect(src).not.toMatch(/20% of all/i);
  });
});

describe('the three pages carry the same logic', () => {
  const REQUIRED = [
    ['a quick info strip', 'Start Point'],
    ['the guide section', 'Chief Kingsley'],
    ['inclusions', "What's Included"],
    ['a not-included list', 'Not Included'],
    ['a gallery fed by the manifest', 'withManifestImages('],
    ['cultural protocols', 'Cultural Protocols'],
    ['group pricing tiers', 'pricingTiers'],
    ['the community impact card', 'Your visit gives back'],
    ['the wellness layer', 'Make a wellness day of it'],
    ['a booking section', 'booking-section'],
    ['a sticky booking bar', 'StickyBookingBar'],
    ['the presentation line', 'An Ubuntu Journeys experience'],
  ] as const;

  for (const [label, marker] of REQUIRED) {
    it.each(PAGES)(`%s has ${label}`, (_f, src) => {
      expect(src).toContain(marker);
    });
  }

  it.each(PAGES)('%s links only to routes that exist', (_f, src) => {
    // The wellness band points at /events and /tours, both real routes.
    const app = readFileSync(resolve(__dirname, '../../App.tsx'), 'utf8');
    for (const to of ['"/events"', '"/tours"']) {
      if (src.includes(`to=${to}`)) {
        expect(app).toContain(`path=${to}`);
      }
    }
  });
});

describe('the gallery manifest pipeline', () => {
  it('merges manifest photos after the hand captioned set, without duplicates', () => {
    const base = [{ src: '/a.jpg', alt: 'a' }];
    const merged = withManifestImages('kalk-bay-tour', base);
    expect(merged[0]).toEqual(base[0]);
    // Idempotent against the current manifest state.
    expect(withManifestImages('kalk-bay-tour', merged).length).toBe(merged.length);
  });

  it('ships no placeholder alt text', () => {
    // The import script writes REPLACE ME alts on purpose; a person must
    // rewrite them before commit. This is the gate that enforces it.
    for (const photos of Object.values(TOUR_GALLERY_MANIFEST)) {
      for (const p of photos) {
        expect(p.alt).not.toContain('REPLACE ME');
        expect(p.alt.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it('serves manifest photos from the repo, never hotlinked', () => {
    // The image retry incident started with fragile external images. Imported
    // gallery frames must be repo hosted files under /tours/.
    for (const photos of Object.values(TOUR_GALLERY_MANIFEST)) {
      for (const p of photos) {
        expect(p.src).toMatch(/^\/tours\//);
      }
    }
  });
});
