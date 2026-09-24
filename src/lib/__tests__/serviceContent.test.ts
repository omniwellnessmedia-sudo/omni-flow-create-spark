import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_OFFERS, getOffer } from '@/data/publicRateCard';
import {
  BLURB_MAX, BULLETS_MAX, BULLET_MAX, FORBIDDEN, cleanBullets, merge, mergeAll, mergeOne,
  offersMissingInclusions, validate, type ServiceContentRow,
} from '@/lib/serviceContent';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * The team can write what a service includes without a deploy. The rules
 * that make that safe: the code is the baseline, only published rows show,
 * price is never touched, and nothing may promise a result.
 *
 * No em dashes in this file.
 */

const offer = ALL_OFFERS.find((o) => o.slug === 'clarity-session')!;
const row = (over: Partial<ServiceContentRow>): ServiceContentRow => ({
  offer_slug: offer.slug, blurb: null, bullets: null, status: 'published', ...over,
});

describe('the code is the baseline', () => {
  it('no row means the rate card, unchanged', () => {
    expect(merge(offer, undefined)).toEqual(offer);
  });

  it('a draft row never reaches a visitor', () => {
    const out = merge(offer, row({ status: 'draft', blurb: 'Draft copy', bullets: ['Draft line'] }));
    expect(out.blurb).toBe(offer.blurb);
    expect(out.bullets).toEqual(offer.bullets);
  });

  it('a published row with blank fields falls back rather than blanking the page', () => {
    const out = merge(offer, row({ blurb: '   ', bullets: [] }));
    expect(out.blurb).toBe(offer.blurb);
    expect(out.bullets).toEqual(offer.bullets);
  });

  it('a published row replaces only what it carries', () => {
    const out = merge(offer, row({ bullets: ['Sixty minutes, recorded'] }));
    expect(out.bullets).toEqual(['Sixty minutes, recorded']);
    expect(out.blurb).toBe(offer.blurb);
  });

  it('membership and order always come from the code', () => {
    const merged = mergeAll({ [offer.slug]: row({ blurb: 'New' }) });
    expect(merged.map((o) => o.slug)).toEqual(ALL_OFFERS.map((o) => o.slug));
  });

  it('mergeOne is undefined for a slug the rate card does not have', () => {
    expect(mergeOne('not-an-offer', {})).toBeUndefined();
    expect(mergeOne(offer.slug, {})?.name).toBe(offer.name);
  });
});

describe('price is never editable from here', () => {
  it('a row carrying a price cannot change one', () => {
    const sneaky = row({ blurb: 'Fine' }) as ServiceContentRow & { price?: string };
    sneaky.price = 'R1';
    expect(merge(offer, sneaky).price).toBe(offer.price);
  });

  it('every merged offer keeps its rate card price', () => {
    const rows = Object.fromEntries(
      ALL_OFFERS.map((o) => [o.slug, row({ offer_slug: o.slug, blurb: 'x', bullets: ['y'] })])
    );
    for (const merged of mergeAll(rows)) {
      expect(merged.price, merged.slug).toBe(getOffer(merged.slug)!.price);
    }
  });

  it('the migration stores no price column, and says why', () => {
    const sql = readFileSync(
      resolve(__dirname, '../../../supabase/migrations/20260924120000_service_content.sql'),
      'utf8'
    );
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS public.service_content');
    expect(sql).not.toMatch(/^\s*price\b/m);
    expect(sql).toContain('publicRateCard.ts');
    expect(sql).toMatch(/status = 'published'/);
    expect(sql).not.toMatch(/FOR DELETE/);
    expect(sql).not.toMatch(/\u2014/);
  });

  it('the editor shows the price locked rather than as a field', () => {
    const screen = readFileSync(resolve(__dirname, '../../components/admin/ServicesScreen.tsx'), 'utf8');
    expect(screen).toContain('needs a developer to change');
    expect(screen).not.toMatch(/setPrice|value=\{price\}/);
  });
});

describe('nothing published here may promise a result', () => {
  it('refuses the same claims the ad copy refuses', () => {
    expect(FORBIDDEN.test('We guarantee results')).toBe(true);
    expect(FORBIDDEN.test('Cheapest in Cape Town')).toBe(true);
    expect(FORBIDDEN.test('A written action map')).toBe(false);
  });

  it('drops a forbidden blurb back to the code rather than rendering it', () => {
    const out = merge(offer, row({ blurb: 'We guarantee page one rankings' }));
    expect(out.blurb).toBe(offer.blurb);
  });

  it('drops the whole list if any line promises something', () => {
    const out = merge(offer, row({ bullets: ['A fine line', 'Guaranteed leads'] }));
    expect(out.bullets).toEqual(offer.bullets);
  });

  it('the validator flags it before it can be saved', () => {
    expect(validate({ blurb: 'We guarantee leads', bullets: [] })).toHaveLength(1);
    expect(validate({ blurb: 'Fine', bullets: ['x'.repeat(BULLET_MAX + 1)] })).toHaveLength(1);
    expect(validate({ blurb: 'x'.repeat(BLURB_MAX + 1), bullets: [] })).toHaveLength(1);
    expect(validate({ blurb: 'Fine', bullets: ['A real inclusion'] })).toEqual([]);
  });
});

describe('a bad row cannot break a page', () => {
  it('ignores an over long blurb', () => {
    expect(merge(offer, row({ blurb: 'x'.repeat(BLURB_MAX + 1) })).blurb).toBe(offer.blurb);
  });

  it('ignores a list with an over long line', () => {
    expect(merge(offer, row({ bullets: ['ok', 'y'.repeat(BULLET_MAX + 1)] })).bullets).toEqual(offer.bullets);
  });

  it('survives rubbish in the bullets column', () => {
    for (const bad of [null, 'a string', 42, {}] as unknown[]) {
      expect(cleanBullets(bad)).toBeNull();
      expect(merge(offer, row({ bullets: bad as string[] })).bullets).toEqual(offer.bullets);
    }
  });

  it('caps how many inclusions can render', () => {
    const many = Array.from({ length: BULLETS_MAX + 5 }, (_, i) => `Line ${i}`);
    expect(merge(offer, row({ bullets: many })).bullets).toHaveLength(BULLETS_MAX);
  });
});

describe('the worklist this screen exists for', () => {
  it('names the five offers that show a price and no inclusions', () => {
    expect(offersMissingInclusions({}).map((o) => o.slug)).toEqual([
      'podcast-concept',
      'podcast-launch',
      'event-marketing',
      'screening-campaign',
      'workshops',
    ]);
  });

  it('an offer leaves the list once its inclusions are published', () => {
    const rows = { 'workshops': row({ offer_slug: 'workshops', bullets: ['A half day on site'] }) };
    expect(offersMissingInclusions(rows).map((o) => o.slug)).not.toContain('workshops');
  });

  it('a draft does not take it off the list, because the site still shows nothing', () => {
    const rows = { 'workshops': row({ offer_slug: 'workshops', status: 'draft', bullets: ['A half day'] }) };
    expect(offersMissingInclusions(rows).map((o) => o.slug)).toContain('workshops');
  });
});

describe('wiring', () => {
  it('sits under Clients and partners and has a section', () => {
    expect(NAV_GROUPS.find((g) => g.label === 'Clients and partners')?.items.map((i) => i.id)).toContain('services');
    expect(readFileSync(resolve(__dirname, '../../pages/AdminDashboard.tsx'), 'utf8')).toMatch(/case "services"/);
  });

  it('the offer page reads published content and the rate card underneath', () => {
    const page = readFileSync(resolve(__dirname, '../../pages/ServiceOfferDetail.tsx'), 'utf8');
    expect(page).toMatch(/usePublishedServiceContent\(\)/);
    expect(page).toMatch(/mergeOne\(slug, publishedContent\)/);
  });

  it.each([
    ['serviceContent.ts', '../serviceContent.ts'],
    ['useServiceContent.ts', '../../hooks/useServiceContent.ts'],
    ['ServicesScreen.tsx', '../../components/admin/ServicesScreen.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(readFileSync(resolve(__dirname, rel), 'utf8')).not.toMatch(/\u2014/);
  });
});
