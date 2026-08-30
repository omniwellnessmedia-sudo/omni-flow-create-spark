import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SERVICE_BANDS,
  ALL_OFFERS,
  getOffer,
  getBandForOffer,
  getSiblingOffers,
} from '../publicRateCard';

/**
 * The rate card is the only place a client facing price may be defined, and
 * every offer now has a public page at /services/<slug>. Two things can go
 * wrong quietly as offers are added or renamed: a page can exist with nothing
 * pointing at it, or the sitemap can advertise a URL that redirects away.
 * Both are checked here rather than noticed later.
 *
 * No em dashes in this file.
 */

const sitemap = readFileSync(resolve(__dirname, '../../../public/sitemap.xml'), 'utf8');

const sitemapServiceSlugs = [
  ...sitemap.matchAll(/omniwellnessmedia\.co\.za\/services\/([a-z0-9-]+)</g),
].map((m) => m[1]);

describe('rate card offers', () => {
  it('gives every offer a unique slug', () => {
    const slugs = ALL_OFFERS.map((o) => o.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('uses url safe slugs', () => {
    for (const o of ALL_OFFERS) {
      expect(o.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('gives every offer a name, price, blurb and call to action', () => {
    // A detail page renders only what the rate card holds, so a missing
    // field is a blank section on a live page.
    for (const o of ALL_OFFERS) {
      expect(o.name.trim(), o.slug).not.toBe('');
      expect(o.price.trim(), o.slug).not.toBe('');
      expect(o.blurb.trim(), o.slug).not.toBe('');
      expect(o.cta.trim(), o.slug).not.toBe('');
    }
  });

  it('prices every offer in rand', () => {
    // ZAR only, per the rate card.
    for (const o of ALL_OFFERS) {
      expect(o.price, o.slug).toMatch(/R\s?[\d,]/);
    }
  });

  it('carries no em dashes in published copy', () => {
    for (const o of ALL_OFFERS) {
      const copy = [o.name, o.price, o.blurb, o.footnote ?? '', ...o.bullets].join(' ');
      expect(copy, o.slug).not.toContain('—');
    }
  });
});

describe('offer lookups', () => {
  it('resolves every offer by its slug', () => {
    for (const o of ALL_OFFERS) {
      expect(getOffer(o.slug)?.name, o.slug).toBe(o.name);
    }
  });

  it('finds the band for every offer', () => {
    for (const o of ALL_OFFERS) {
      expect(getBandForOffer(o.slug), o.slug).toBeDefined();
    }
  });

  it('never lists an offer as its own sibling', () => {
    for (const o of ALL_OFFERS) {
      expect(getSiblingOffers(o.slug).map((s) => s.slug)).not.toContain(o.slug);
    }
  });

  it('returns undefined for an unknown or missing slug', () => {
    // The page redirects to the catalogue on this, so it must not throw.
    expect(getOffer('not-a-real-offer')).toBeUndefined();
    expect(getOffer(undefined)).toBeUndefined();
  });

  it('accounts for every offer across the bands', () => {
    const total = SERVICE_BANDS.reduce((n, b) => n + b.offers.length, 0);
    expect(ALL_OFFERS.length).toBe(total);
  });
});

describe('sitemap agrees with the rate card', () => {
  it('lists a page for every offer', () => {
    const missing = ALL_OFFERS.map((o) => o.slug).filter((s) => !sitemapServiceSlugs.includes(s));
    expect(missing).toEqual([]);
  });

  it('lists no service url that would redirect away', () => {
    // A sitemap entry that redirects is a wasted crawl and a soft 404.
    const orphans = sitemapServiceSlugs.filter((s) => !getOffer(s));
    expect(orphans).toEqual([]);
  });
});
