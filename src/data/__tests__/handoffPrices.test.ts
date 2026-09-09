import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getOffer } from '../publicRateCard';

/**
 * The design handoff's prices, checked against the rate card.
 *
 * WHY THIS EXISTS. design/service-pack/data/services.json calls itself the
 * single source of truth for every price. src/data/publicRateCard.ts is
 * what the site actually reads. Two files claiming the same authority is
 * how a page ends up advertising a figure nobody approved.
 *
 * Rather than pick one and hope, this pins them together: every price in
 * the handoff must equal the rate card's. If either moves, this fails and
 * somebody looks, which is the whole point.
 *
 * The handoff splits a price across two fields, price and priceNote, and
 * reading price alone makes several offers look cheaper than they are:
 * "R6,500" is the Growth Desk per month, not once off. They are compared
 * joined.
 *
 * No em dashes in this file.
 */

const HANDOFF = resolve(__dirname, '../../../design/service-pack/data/services.json');

/** Four slugs differ between the handoff and the live routes. The live slug wins. */
const SLUG_ALIASES: Record<string, string> = {
  'website-visibility-audit': 'website-audit',
  'revenue-ready-sprint': 'revenue-sprint',
  'visibility-conversion-sprint': 'visibility-sprint',
  'bespoke-content-pack': 'content-pack-12',
};

/**
 * The one figure the handoff carries that the rate card deliberately does
 * not: ten prepaid hours at R10,000. It was withdrawn from the public page
 * on 27 August 2026 because it implied R1,000 per hour and undercut the
 * published hourly rate by a third. It returns only with written sign off.
 */
const WITHDRAWN = 'R10,000';

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/·/g, ' ')
    .replace(/[^a-z0-9,. ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ');

interface HandoffService {
  slug: string;
  name: string;
  price?: string;
  priceNote?: string;
}

const load = (): HandoffService[] => {
  const raw = JSON.parse(readFileSync(HANDOFF, 'utf8')) as { services: HandoffService[] };
  return raw.services;
};

const describeIfPresent = existsSync(HANDOFF) ? describe : describe.skip;

describeIfPresent('the handoff and the rate card agree on every price', () => {
  const services = existsSync(HANDOFF) ? load() : [];

  it('covers every offer the site sells', () => {
    expect(services.length).toBe(19);
  });

  it.each(services.map((s) => [s.slug, s] as const))(
    '%s matches the published rate',
    (slug, service) => {
      const offer = getOffer(SLUG_ALIASES[slug] ?? slug);
      expect(offer, `${slug} has no offer on the rate card`).toBeDefined();

      const combined = [service.price, service.priceNote].filter(Boolean).join(' ');
      const a = norm(combined);
      const b = norm(offer!.price);

      // The rate card's string must be present in the handoff's joined
      // price. Anything else means one of the two has moved.
      expect(
        a.includes(b) || b.includes(a.replace('once off ', '')),
        `${slug}: handoff "${combined}" vs rate card "${offer!.price}"`
      ).toBe(true);
    }
  );

  it('the withdrawn ten hour block never reaches the rate card', () => {
    // The handoff still carries it on executive-support. The site must not.
    const handoffHasIt = services.some((s) =>
      [s.price, s.priceNote].filter(Boolean).join(' ').includes(WITHDRAWN)
    );
    expect(handoffHasIt, 'handoff no longer carries the block price').toBe(true);

    const card = readFileSync(resolve(__dirname, '../publicRateCard.ts'), 'utf8');
    const codeOnly = card.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(codeOnly).not.toContain(WITHDRAWN);
  });

  it('the four downloadable kits stay off the site until they reach the rate card', () => {
    const card = readFileSync(resolve(__dirname, '../publicRateCard.ts'), 'utf8');
    const codeOnly = card.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const kit of ['R199', 'R349', 'R499', 'R799']) {
      expect(codeOnly, kit).not.toContain(kit);
    }
  });
});
