import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_OFFERS, getOffer } from '../../data/publicRateCard';

/**
 * The enquiry form.
 *
 * No em dashes in this file.
 */

const src = readFileSync(resolve(__dirname, '../Enquire.tsx'), 'utf8');
const app = readFileSync(resolve(__dirname, '../../App.tsx'), 'utf8');
const codeOnly = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

describe('the enquiry form is reachable and reaches the one lead list', () => {
  it('has a route', () => {
    expect(app).toContain('path="/enquire"');
    expect(app).toContain("import('@/pages/Enquire')");
  });

  it('writes through the function that already feeds Admin Leads', () => {
    // A second enquiry table would split the lead list in two, and the
    // half nobody opens is the half that loses business.
    expect(src).toContain("invoke('submit-service-quote'");
  });

  it('names the exact offer, not a coarse category', () => {
    // /contact sends "business-development" for everything in that band,
    // so somebody had to work out what was actually being asked for.
    expect(src).toContain('`${offer.name} (${offer.slug})`');
  });
});

describe('it takes no money and says so', () => {
  it('states plainly that nothing is charged', () => {
    expect(src).toContain('No payment is taken on this form');
    expect(src).toContain('Nothing has been charged');
  });

  it('carries no payment provider at all', () => {
    const code = codeOnly(src);
    for (const term of ['yoco', 'Yoco', 'stripe', 'Stripe', 'paypal', 'PayPal', 'checkout']) {
      expect(code, term).not.toContain(term);
    }
  });
});

describe('it never invents a service', () => {
  it('reads every price and name from the rate card', () => {
    expect(src).toContain("from '@/data/publicRateCard'");
    // No rand figure may be typed into this page.
    expect(codeOnly(src)).not.toMatch(/R\s?\d[\d,\s]*(?:per|each|\.)/);
  });

  it('an unknown slug in the link selects nothing', () => {
    expect(src).toContain('const knownOffer = getOffer(requestedSlug)');
    expect(src).toContain('We could not match the service in your link');
  });

  it('the budget bands are ranges, not quoted prices', () => {
    // These are the visitor's own budget, not anything the site sells, so
    // they must not collide with a rate card figure.
    const bands = ['Under R5,000', 'R5,000 to R15,000', 'R15,000 to R50,000', 'Over R50,000'];
    for (const b of bands) expect(src).toContain(b);
  });

  it('every offer the site sells can be chosen', () => {
    expect(ALL_OFFERS.length).toBeGreaterThan(0);
    // The select is built from SERVICE_BANDS, so this guards the source
    // rather than the markup.
    expect(src).toContain('SERVICE_BANDS.map');
    expect(src).toContain('b.offers.map');
  });

  it.each(['clarity-session'])('the CTA slug %s is a real offer', (slug) => {
    expect(getOffer(slug)).toBeDefined();
  });
});

describe('a failed send is never shown as a sent enquiry', () => {
  it('treats a 200 carrying an error as a failure', () => {
    // submit-service-quote answers 200 with { error } when it refuses, so
    // checking only the transport error would report success on a refusal.
    expect(src).toContain('returned.error || !returned.success');
  });

  it('says the enquiry did not reach us, and keeps the answers', () => {
    expect(src).toContain('Your enquiry was not sent, so nothing has reached us yet.');
    expect(src).toContain('Your answers are still here');
  });

  it('cannot be submitted twice while it is sending', () => {
    expect(src).toContain("status.kind === 'sending'");
    expect(src).toContain("disabled={status.kind === 'sending'}");
  });
});

describe('it can be used without a mouse or a screen', () => {
  it('every input has a label bound to it', () => {
    for (const id of ['service', 'name', 'email', 'phone', 'company', 'details', 'budget', 'timeline']) {
      expect(src, id).toContain(`htmlFor="${id}"`);
      expect(src, id).toContain(`id="${id}"`);
    }
  });

  it('required fields are announced, not just starred', () => {
    expect(src).toContain('<span className="sr-only">required</span>');
  });

  it('moves focus to the outcome and announces it', () => {
    expect(src).toContain('role="alert"');
    expect(src).toContain('doneRef.current?.focus()');
    expect(src).toContain('errorRef.current?.focus()');
  });

  it('lists what is missing rather than only marking fields red', () => {
    expect(src).toContain('Still needed before this can be sent');
  });
});

describe('it says what happens to what you send', () => {
  it('does not quietly subscribe anyone', () => {
    // Matched across whitespace: JSX reflows, and a test that breaks on
    // reformatting teaches people to ignore it.
    expect(src.replace(/\s+/g, ' ')).toContain('does not subscribe you to anything');
    expect(src).toContain('/privacy-policy');
  });
});

describe('the services funnel is measurable in Google Ads', () => {
  it('fires a conversion once the enquiry is confirmed saved', () => {
    // Every service CTA used to point at /contact, which fires
    // contact_submit. They now point here, so without this the funnel we
    // advertise would report zero conversions while producing real leads.
    expect(src).toContain("trackAdsConversion('booking_inquiry')");
    expect(src).toContain("from '@/lib/googleAds'");
  });

  it('does not fire on a failure or before the save is confirmed', () => {
    const fireAt = src.indexOf("trackAdsConversion('booking_inquiry')");
    const sentAt = src.indexOf("setStatus({ kind: 'sent' });");
    expect(fireAt).toBeGreaterThan(sentAt);
  });

  it('attaches no conversion value', () => {
    // The rate card price is what an offer lists, not what an enquiry is
    // worth. Feeding a list price in would train bidding on a number
    // nobody has agreed to pay.
    expect(src).not.toMatch(/trackAdsConversion\('booking_inquiry',\s*\{/);
  });
});
