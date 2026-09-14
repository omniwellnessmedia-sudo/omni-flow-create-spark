import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_OFFERS } from '@/data/publicRateCard';
import { LIMITS, FORBIDDEN, fit, draftCopy, normaliseCopy, validatePlan, defaultPlan, uploadRows, toCsv, landingUrl } from '@/lib/ads';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * Google Ads from the rate card: every offer gets a valid draft, the AI's
 * output is forced back inside the limits and the rules, and the upload
 * file is well formed. No em dashes in this file.
 */

describe('limits', () => {
  it('fits on a word boundary without a trailing comma', () => {
    expect(fit('AI & Business Clarity Session, one hour', 30)).toBe('AI & Business Clarity Session');
    expect(fit('short', 30)).toBe('short');
    expect(fit('averyveryverylongsinglewordthatcannotbreak', 10)).toHaveLength(10);
  });

  it('every offer gets a draft inside the limits with nothing forbidden', () => {
    for (const offer of ALL_OFFERS) {
      const plan = defaultPlan(offer);
      const problems = validatePlan(plan);
      expect(problems, `${offer.slug}: ${problems.map((p) => p.message).join('; ')}`).toEqual([]);
      for (const h of plan.copy.headlines) expect(h.length, h).toBeLessThanOrEqual(LIMITS.headline);
      for (const d of plan.copy.descriptions) expect(d.length, d).toBeLessThanOrEqual(LIMITS.description);
      expect(plan.copy.headlines.length).toBeGreaterThanOrEqual(LIMITS.headlinesMin);
      expect(plan.copy.descriptions.length).toBeGreaterThanOrEqual(LIMITS.descriptionsMin);
      expect(plan.copy.keywords.length).toBeGreaterThan(0);
      expect(plan.finalUrl).toContain(`/services/${offer.slug}?`);
      expect(plan.finalUrl).toContain('utm_source=google');
    }
  });

  it('uses the published price and never invents one', () => {
    const offer = ALL_OFFERS.find((o) => o.slug === 'clarity-session')!;
    const copy = draftCopy(offer);
    const all = [...copy.headlines, ...copy.descriptions].join(' ');
    expect(all).toContain('R1,500');
    expect(all.match(/R\d[\d,]*/g)?.every((p) => p === 'R1,500')).toBe(true);
  });
});

describe('the AI pass cannot break the rules', () => {
  const offer = ALL_OFFERS[0];
  const fallback = draftCopy(offer);

  it('trims long lines, drops forbidden ones, caps the counts, and falls back when nothing survives', () => {
    const out = normaliseCopy({
      headlines: ['We guarantee page one rankings', 'A perfectly reasonable headline that is far too long for Google', 'Clarity Session in Cape Town', ...Array.from({ length: 20 }, (_, i) => `Line ${i}`)],
      descriptions: ['Risk free growth, 100% results'],
      keywords: ['Business Consulting Cape Town', 'business consulting cape town'],
      path1: 'consulting-in-muizenberg',
    }, fallback);
    expect(out.headlines.some((h) => /guarantee/i.test(h))).toBe(false);
    expect(out.headlines.every((h) => h.length <= LIMITS.headline)).toBe(true);
    expect(out.headlines.length).toBeLessThanOrEqual(LIMITS.headlinesMax);
    expect(out.descriptions).toEqual(fallback.descriptions.slice(0, LIMITS.descriptionsMax));
    expect(out.keywords).toEqual(['business consulting cape town']);
    expect(out.path1.length).toBeLessThanOrEqual(LIMITS.path);
  });

  it('refuses promises in the validator too', () => {
    expect(FORBIDDEN.test('Guaranteed results')).toBe(true);
    expect(FORBIDDEN.test('Best in Cape Town')).toBe(true);
    expect(FORBIDDEN.test('A written action map')).toBe(false);
    const plan = defaultPlan(offer);
    plan.copy.headlines[0] = 'We guarantee leads';
    expect(validatePlan(plan).some((p) => p.field === 'headlines' && p.index === 0)).toBe(true);
  });
});

describe('the upload file', () => {
  it('has a campaign row, an ad group row, one row per keyword, and one ad with every headline', () => {
    const plan = defaultPlan(ALL_OFFERS.find((o) => o.slug === 'website-audit')!);
    const rows = uploadRows(plan);
    expect(rows[0]['Campaign type']).toBe('Search');
    expect(rows[0]['Campaign status']).toBe('Paused');
    expect(rows[1]['Ad group']).toBe(plan.adGroup);
    const keywordRows = rows.filter((r) => r.Keyword);
    expect(keywordRows).toHaveLength(plan.copy.keywords.length);
    const ad = rows[rows.length - 1];
    expect(ad['Ad type']).toBe('Responsive search ad');
    expect(ad['Final URL']).toBe(plan.finalUrl);
    plan.copy.headlines.forEach((h, i) => expect(ad[`Headline ${i + 1}`]).toBe(h));
  });

  it('writes CSV with quoting and a consistent header', () => {
    const csv = toCsv([{ A: 'plain', B: 'has, comma', C: 'has "quote"' }, { A: 'x', C: 'y' }]);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('A,B,C');
    expect(lines[1]).toBe('plain,"has, comma","has ""quote"""');
    expect(lines[2]).toBe('x,,y');
  });

  it('tags the landing URL for the channel report', () => {
    const u = new URL(landingUrl(ALL_OFFERS[0], 'Omni Search: Test Name'));
    expect(u.searchParams.get('utm_medium')).toBe('cpc');
    expect(u.searchParams.get('utm_campaign')).toBe('omni-search-test-name');
  });
});

describe('wiring', () => {
  it('sits under Marketing and has a section', () => {
    expect(NAV_GROUPS.find((g) => g.label === 'Marketing')?.items.map((i) => i.id)).toContain('ads');
    expect(readFileSync(resolve(__dirname, '../../pages/AdminDashboard.tsx'), 'utf8')).toMatch(/case "ads"/);
  });

  it.each([
    ['ads.ts', '../ads.ts'],
    ['AdsScreen.tsx', '../../components/admin/AdsScreen.tsx'],
    ['generate-ad-copy', '../../../supabase/functions/generate-ad-copy/index.ts'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(readFileSync(resolve(__dirname, rel), 'utf8')).not.toMatch(/\u2014/);
  });
});
