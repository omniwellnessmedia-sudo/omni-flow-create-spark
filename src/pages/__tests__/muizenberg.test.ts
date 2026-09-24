import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { getOffer } from '@/data/publicRateCard';
import { SERVICE_ENTRY_POINTS } from '@/data/navigation';
import { MUIZENBERG_OFFER_SLUGS, MUIZENBERG_CONTEXT } from '@/data/muizenberg';

/**
 * The Muizenberg page and its check sheet, held to the same rules as the
 * rest of the sales pages: prices only from the rate card, no invented
 * urgency, no Foundation wording on the commercial site, reachable from
 * the places a visitor would look.
 *
 * No em dashes in this file.
 */

const read = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');
// The two page files are scanned with their comments removed: the header
// comments name the things the page must not contain, which is exactly
// what the scanners below look for.
const uncommented = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const page = uncommented(read('../Muizenberg.tsx'));
const sheet = uncommented(read('../MuizenbergAuditSheet.tsx'));
const app = read('../../App.tsx');
const footer = read('../../components/Footer.tsx');
const dock = read('../../components/FloatingActionDock.tsx');
const sitemap = read('../../../public/sitemap.xml');

describe('the two door-opener offers', () => {
  it('both exist on the rate card', () => {
    for (const slug of MUIZENBERG_OFFER_SLUGS) {
      expect(getOffer(slug), slug).toBeDefined();
    }
  });

  it('are two distinct entry-band offers', () => {
    expect(new Set(MUIZENBERG_OFFER_SLUGS).size).toBe(2);
  });
});

describe('no figure is typed into either file', () => {
  it.each([
    ['Muizenberg.tsx', page],
    ['MuizenbergAuditSheet.tsx', sheet],
  ])('%s carries no rand amount of its own', (_name, src) => {
    // Every price on these pages must come from getOffer(); a literal
    // "R1,500" would drift the moment the rate card changed.
    expect(src).not.toMatch(/R\s?\d[\d,]*/);
    expect(src).toMatch(/getOffer\(/);
  });
});

describe('governance', () => {
  it.each([
    ['Muizenberg.tsx', page],
    ['MuizenbergAuditSheet.tsx', sheet],
  ])('%s has no em dashes', (_name, src) => {
    expect(src).not.toMatch(/\u2014/);
  });

  it.each([
    ['Muizenberg.tsx', page],
    ['MuizenbergAuditSheet.tsx', sheet],
  ])('%s invents no scarcity', (_name, src) => {
    expect(src).not.toMatch(/first (five|ten|\d+)/i);
    expect(src).not.toMatch(/limited (slots|spaces|places|time)/i);
    expect(src).not.toMatch(/only \d+ (left|remaining|spots)/i);
    expect(src).not.toMatch(/hurry|act now|ends (soon|today)/i);
  });

  it.each([
    ['Muizenberg.tsx', page],
    ['MuizenbergAuditSheet.tsx', sheet],
  ])('%s carries no Foundation wording', (_name, src) => {
    expect(src).not.toMatch(/Phil-afel|Section ?18A|donat/i);
  });

  it('quotes nobody', () => {
    // The only consented testimonials on the site are about a screening.
    expect(page).not.toMatch(/testimonial|"[^"]{40,}"\s*[,.]?\s*<\/blockquote>/i);
    expect(page).not.toMatch(/<blockquote/);
  });
});

describe('leads from this page are attributable', () => {
  it('every enquiry route carries the Muizenberg context', () => {
    expect(MUIZENBERG_CONTEXT).toBe('Muizenberg local business');
    // The hero and contact links build on ENQUIRE_HREF, the offer cards
    // pass enquiryContext. Neither path may reach /enquire bare.
    expect(page).not.toMatch(/to=["'`]\/enquire["'`]/);
    expect(page).toMatch(/enquiryContext=\{MUIZENBERG_CONTEXT\}/);
  });
});

describe('photographs', () => {
  const servicesDir = resolve(__dirname, '../../../public/services');
  const referenced = Array.from(page.matchAll(/'\/services\/([a-z0-9-]+\.webp)'/g)).map((m) => m[1]);

  it('references the three Muizenberg crops', () => {
    for (const f of ['muizenberg-strip', 'muizenberg-audit', 'muizenberg-outdoors']) {
      expect(referenced).toContain(`${f}.webp`);
    }
  });

  it('serves neither photograph that was asked to come down', () => {
    // Two separate requests, each on behalf of someone in the frame: the
    // crew photograph on 23 September and the market gazebo photograph on
    // 24 September. Each frame had been cropped twice, so all four files
    // are asserted absent from disk as well as unreferenced. Removing one
    // crop and leaving the other is the same faces still published, which
    // is the mistake that made the first request take three attempts.
    for (const f of [
      'muizenberg-made-here.webp',
      'offer-social-media.webp',
      'muizenberg-hero.webp',
      'offer-brand-content-audit.webp',
    ]) {
      expect(referenced, f).not.toContain(f);
      expect(existsSync(resolve(servicesDir, f)), f).toBe(false);
    }
    expect(page).not.toMatch(/made-here|madeHere\s*[:.]|MUIZENBERG_IMAGES\.hero/);
  });

  it.each(Array.from(new Set(page.match(/muizenberg-[a-z-]+\.webp/g) ?? [])))(
    '%s exists and is under 250KB',
    (file) => {
      const path = resolve(servicesDir, file);
      expect(existsSync(path), path).toBe(true);
      expect(statSync(path).size).toBeLessThan(250 * 1024);
    }
  );

  it('serves no camera original from the services folder', () => {
    // The uploads arrive as multi megabyte JPEGs. They are cropped and
    // encoded, and the originals are removed so a phone never downloads one.
    const originals = readdirSync(servicesDir).filter((f) => /\.(jpe?g|png|heic)$/i.test(f));
    expect(originals).toEqual([]);
  });

  it('does not reference the two photographs with a child in them', () => {
    expect(page).not.toMatch(/APPRENTICE|DAILY_MUIZ/);
  });

  it('credits every Omni photograph and claims nothing about the people in it', () => {
    const captions = Array.from(page.matchAll(/caption: '([^']+)'/g)).map((m) => m[1]);
    // Three: the crew photograph came down on 23 September 2026 and the
    // market gazebo hero on 24 September, both on request.
    expect(captions.length).toBe(3);
    for (const caption of captions) {
      // The credit is the point of the caption.
      expect(caption).toContain('Omni Wellness Media');
      // A caption may say whose shoot it was. It may not describe the
      // people in the frame as clients, or how they felt: neither is known.
      expect(caption).not.toMatch(/happy|satisfied|delighted|loved|thrilled|our clients?\b/i);
      expect(caption).not.toMatch(/\u2014/);
    }
  });

  it('gives every photograph an alt that names no person', () => {
    // Nobody in these photographs is named on the page, so the alt text
    // must not name anyone either.
    const alts = Array.from(page.matchAll(/alt: '([^']+)'/g)).map((m) => m[1]);
    expect(alts.length).toBeGreaterThanOrEqual(3);
    for (const alt of alts) {
      expect(alt).not.toMatch(/\b(Chad|Feroza|Zenith|Steven|Kingsley|Hennie)\b/);
    }
  });
});

describe('reachable and wired', () => {
  it('both routes are registered', () => {
    expect(app).toMatch(/path="\/muizenberg"/);
    expect(app).toMatch(/path="\/muizenberg\/audit-sheet"/);
  });

  it('is linked from the footer and the services menu', () => {
    expect(footer).toMatch(/to="\/muizenberg"/);
    expect(SERVICE_ENTRY_POINTS.some((e) => e.href === '/muizenberg')).toBe(true);
  });

  it('is in the sitemap, and the internal sheet is not', () => {
    expect(sitemap).toContain('<loc>https://omniwellnessmedia.co.za/muizenberg</loc>');
    expect(sitemap).not.toContain('/muizenberg/audit-sheet');
  });

  it('hides the floating dock on the printable sheet', () => {
    expect(dock).toMatch(/"\/muizenberg\/audit-sheet"/);
  });
});
