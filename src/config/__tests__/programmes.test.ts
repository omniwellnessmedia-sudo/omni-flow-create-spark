import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  buildViatorLink,
  camerastuffLink,
  viatorIsAttributable,
  withViatorAttribution,
} from '../programmes';

/**
 * These tests exist because the failure they guard against is silent.
 *
 * A Viator link missing pid or mcid still works. It opens the right page, the
 * visitor books, and nothing anywhere reports a problem. The only symptom is
 * that we are not paid. That went unnoticed on this site for the whole period
 * the old hand-built links were live, so the link shape is pinned here rather
 * than left to review.
 *
 * Values verified against the Viator partner dashboard on 30 August 2026.
 *
 * No em dashes in this file.
 */

afterEach(() => {
  vi.restoreAllMocks();
});

const params = (url: string) => new URL(url).searchParams;

describe('buildViatorLink', () => {
  it('carries the verified account identifiers', () => {
    const p = params(buildViatorLink());
    expect(p.get('pid')).toBe('P00273922');
    expect(p.get('mcid')).toBe('42383');
  });

  it('defaults to the text link medium', () => {
    expect(params(buildViatorLink()).get('medium')).toBe('link');
  });

  it('sends only the four parameters Viator documents', () => {
    const p = params(buildViatorLink({ campaign: 'tours-page' }));
    expect([...p.keys()].sort()).toEqual(['campaign', 'mcid', 'medium', 'pid']);
  });

  it('omits campaign when none is given', () => {
    expect(params(buildViatorLink()).has('campaign')).toBe(false);
  });

  it('reports as attributable with the committed defaults', () => {
    expect(viatorIsAttributable()).toBe(true);
  });

  it('builds a product path onto the viator host', () => {
    const url = buildViatorLink({
      productPath: '/tours/Cape-Town/Kelp-Forest-Snorkeling/d318-407621P1',
    });
    expect(url.startsWith('https://www.viator.com/tours/Cape-Town/')).toBe(true);
    expect(params(url).get('pid')).toBe('P00273922');
  });

  it('accepts a product path without a leading slash', () => {
    const url = buildViatorLink({ productPath: 'tours/Cape-Town/Thing/d318-1P1' });
    expect(url.startsWith('https://www.viator.com/tours/Cape-Town/')).toBe(true);
  });

  it('falls back to the partner shop when no product path is given', () => {
    expect(buildViatorLink().startsWith('https://www.viator.com/partner-shop/')).toBe(true);
  });

  it('warns when a non-link medium is paired with the text link mcid', () => {
    // Widgets and banners are issued their own mcid. Reusing the text link one
    // reports the click against the wrong media type.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    buildViatorLink({ medium: 'widget' });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0]).toContain('42383');
  });

  it('does not warn for the text link medium', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    buildViatorLink({ medium: 'link' });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('withViatorAttribution', () => {
  // Tour rows carry a booking_url from the Viator product sync. It has no
  // pid or mcid of ours, and the tours page opened it directly, so every
  // click from the busiest outbound page went unattributed.
  const stored = 'https://www.viator.com/tours/Cape-Town/Table-Mountain/d318-1234P5';

  it('adds our identifiers to a stored viator url', () => {
    const p = params(withViatorAttribution(stored));
    expect(p.get('pid')).toBe('P00273922');
    expect(p.get('mcid')).toBe('42383');
    expect(p.get('medium')).toBe('link');
  });

  it('keeps the original path', () => {
    expect(new URL(withViatorAttribution(stored)).pathname).toBe(
      '/tours/Cape-Town/Table-Mountain/d318-1234P5'
    );
  });

  it('overwrites a foreign pid rather than leaving it', () => {
    // A stale or another partner's identifier on a link we publish would pay
    // someone else.
    const foreign = `${stored}?pid=P00000001&mcid=99999`;
    const p = params(withViatorAttribution(foreign));
    expect(p.get('pid')).toBe('P00273922');
    expect(p.get('mcid')).toBe('42383');
  });

  it('preserves other query parameters viator set', () => {
    const p = params(withViatorAttribution(`${stored}?supplierId=42`));
    expect(p.get('supplierId')).toBe('42');
    expect(p.get('pid')).toBe('P00273922');
  });

  it('leaves non viator hosts untouched', () => {
    // An operator's own booking page is not ours to tag.
    const operator = 'https://www.someoperator.co.za/book?ref=x';
    expect(withViatorAttribution(operator)).toBe(operator);
  });

  it('tags viator subdomains', () => {
    expect(params(withViatorAttribution('https://partners.viator.com/x')).get('pid')).toBe(
      'P00273922'
    );
  });

  it('does not match a lookalike host', () => {
    const lookalike = 'https://notviator.com/tours/x';
    expect(withViatorAttribution(lookalike)).toBe(lookalike);
  });

  it('returns an unparseable value unchanged', () => {
    // A working link that earns nothing still beats a broken one.
    expect(withViatorAttribution('not a url')).toBe('not a url');
  });

  it('falls back to the partner shop when the url is missing', () => {
    expect(withViatorAttribution(null).startsWith('https://www.viator.com/partner-shop/')).toBe(
      true
    );
  });

  it('applies the campaign label', () => {
    expect(params(withViatorAttribution(stored, 'tours-page')).get('campaign')).toBe('tours-page');
  });
});

describe('camerastuffLink', () => {
  it('emits no affiliate tag while the programme is inactive', () => {
    // Tagging links for a programme we are not in earns nothing and
    // misstates the relationship.
    expect(camerastuffLink('/product/x')).toBe('https://www.camerastuff.co.za/product/x');
    expect(camerastuffLink()).not.toContain('a_aid');
  });
});
