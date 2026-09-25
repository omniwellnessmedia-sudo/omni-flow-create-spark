import { describe, it, expect } from 'vitest';
import { NAV_GROUPS, searchNav } from '@/components/dashboard/AdminSidebar';

/**
 * The nav holds thirty three screens across six groups and used to render
 * every one of them, expanded, all the time. Two things make that usable: the
 * groups fold, and you can type. The typing has to be forgiving, because
 * people search for the job they are doing rather than the label we chose.
 *
 * No em dashes in this file.
 */

const ids = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));

describe('the nav is worth searching', () => {
  it('still has every screen', () => {
    expect(ids.length).toBeGreaterThanOrEqual(30);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('an empty query returns nothing, so the groups render instead', () => {
    expect(searchNav('')).toEqual([]);
    expect(searchNav('   ')).toEqual([]);
  });

  it('finds a screen by the start of its label', () => {
    expect(searchNav('pipe')[0].item.id).toBe('pipeline');
    expect(searchNav('acc')[0].item.id).toBe('accounting');
  });

  it('ranks a label that starts with the query above one that merely contains it', () => {
    // "Approve shop products" contains "ac" nowhere useful, but several
    // keywords do. Accounting has to win.
    expect(searchNav('account')[0].item.id).toBe('accounting');
  });

  it('is case insensitive', () => {
    expect(searchNav('PIPELINE')[0].item.id).toBe('pipeline');
  });

  it.each([
    ['invoice', 'money'],
    ['invoices', 'money'],
    ['vat', 'accounting'],
    ['adwords', 'ads'],
    ['kanban', 'pipeline'],
    ['subscribers', 'newsletter'],
    ['permissions', 'team'],
    ['enquiries', 'leads'],
  ])('finds a screen by the word people actually use: %s', (query, id) => {
    expect(searchNav(query).map((h) => h.item.id)).toContain(id);
  });

  it('finds the curation screen, which is why the shop was empty', () => {
    // 665 active products, none featured, so every storefront page showed
    // nothing. Whoever goes looking will not type "approve shop products".
    for (const q of ['featured', 'curate', 'curation']) {
      expect(searchNav(q).map((h) => h.item.id), q).toContain('shop-products');
    }
  });

  it('finds a whole group by its name', () => {
    expect(searchNav('money').map((h) => h.item.id)).toContain('accounting');
  });

  it('returns nothing for a query that matches nothing, rather than everything', () => {
    expect(searchNav('zzzznotascreen')).toEqual([]);
  });

  it('every item carries the search words for its own job', () => {
    // A screen with no keywords is only findable by its label, which is the
    // problem this solves.
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        expect(item.keywords, `${item.label} has no keywords`).toBeTruthy();
      }
    }
  });
});
