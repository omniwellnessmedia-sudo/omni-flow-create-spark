import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ALL_OFFERS, SERVICE_BANDS, getOffer } from '@/data/publicRateCard';
import { parseRand, quotesFromActivities, rand } from '@/lib/quotes';
import {
  PROPOSAL_ISSUED, THEMES, buildProposal, coverEmail, defaultTitle, planFor, proposalNumber,
  proposalsFromActivities, themeById, themeForLead, validateProposal,
} from '@/lib/proposals';
import type { PipelineLead } from '@/lib/pipeline';

/**
 * A proposal has to be fast to make and impossible to make dishonest. The
 * tests are about the second half: every price is the rate card's, every
 * free text field is checked for promises, and the money inside it is a
 * real quotation the Money screen can track.
 *
 * No em dashes in this file.
 */

const lead = (over: Partial<PipelineLead> = {}): PipelineLead => ({
  key: 'outreach:abc123', id: 'abc123', source: 'outreach', name: 'Jane Smith', org: 'Surf Emporium',
  email: 'jane@example.co.za', phone: null, service: null, brief: null, status: 'new', stage: 'new',
  createdAt: '2026-09-25T09:00:00.000Z', lastContacted: null, followUpDue: null, campaign: 'muizenberg',
  assignedTo: null, raw: {}, ...over,
});

const line = (slug: string, unit?: number) => {
  const o = getOffer(slug)!;
  return { slug, name: o.name, unit: unit ?? parseRand(o.price) ?? 0, qty: 1, fromPrice: /^from/i.test(o.price) };
};

const NOW = new Date('2026-09-26T10:00:00Z');

describe('themes', () => {
  it('every theme suggests only real offers and promises nothing', () => {
    for (const t of THEMES) {
      for (const slug of t.suggested) expect(getOffer(slug), `${t.id} suggests ${slug}`).toBeTruthy();
      for (const text of [t.opening, t.closing, ...t.prompts]) {
        expect(text).not.toMatch(/guarantee|#1|best in|cheapest|100%|risk[- ]free/i);
        expect(text).not.toMatch(/\u2014/);
        expect(text).not.toMatch(/\b\d+%\b/);
      }
    }
  });

  it('a Muizenberg walk-in is a local business', () => {
    expect(themeForLead(lead())).toBe('local-business');
  });

  it.each([
    [{ raw: { sector: 'Non-profit' } }, 'non-profit'],
    [{ org: 'Beauty Without Cruelty SA', raw: {} }, 'non-profit'],
    [{ raw: { sector: 'Cafe, restaurant or bar' } }, 'hospitality'],
    [{ raw: { sector: 'Guesthouse or holiday let' } }, 'hospitality'],
    [{ org: 'O2 Architects', raw: {} }, 'professional'],
    [{ raw: { sector: 'Shop, market or maker' } }, 'retail'],
    [{ service: 'Event marketing (event-marketing)', raw: {} }, 'events'],
    [{ brief: 'Looking for a monthly retainer', raw: {} }, 'growth'],
  ])('guesses the theme from what the lead says: %j', (over, expected) => {
    expect(themeForLead(lead({ campaign: null, ...over }))).toBe(expected);
  });

  it('an unknown id falls back to the first theme rather than crashing', () => {
    expect(themeById('nonsense').id).toBe(THEMES[0].id);
  });
});

describe('the money is the rate card', () => {
  it('a fixed price line carries the card price exactly', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: [], lines: [line('clarity-session'), line('website-audit')], now: NOW });
    expect(p.quote.subtotal).toBe(1500 + 2500);
    expect(p.quote.depositDue).toBe(2000);
    expect(p.quote.balanceDue).toBe(2000);
  });

  it('carries the proposal number into the quotation, so a deposit matches on it', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: [], lines: [line('clarity-session')], now: NOW });
    expect(p.number).toMatch(/^P-260926-[A-Z0-9]{1,4}$/);
    expect(p.quote.number).toBe(p.number);
  });

  it('the Money screen sees a priced proposal as a quotation awaiting deposit', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: [], lines: [line('website-audit')], now: NOW });
    const records = quotesFromActivities([
      { id: '1', lead_type: 'outreach', lead_id: 'abc123', action: PROPOSAL_ISSUED, payload: { proposal: p }, created_at: NOW.toISOString() },
    ], NOW);
    expect(records).toHaveLength(1);
    expect(records[0].quote.number).toBe(p.number);
    expect(records[0].status).toBe('awaiting_deposit');
    expect(records[0].outstanding).toBe(2500);
  });

  it('a proposal with no price is not a quotation', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: ['One thing'], lines: [], now: NOW });
    expect(quotesFromActivities([
      { id: '1', lead_type: 'outreach', lead_id: 'abc123', action: PROPOSAL_ISSUED, payload: { proposal: p }, created_at: NOW.toISOString() },
    ], NOW)).toHaveLength(0);
  });

  it('refuses a line that is not on the card', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: [], lines: [{ slug: 'made-up', name: 'Made up', unit: 999, qty: 1 }], now: NOW });
    expect(validateProposal(p).some((x) => /not on the rate card/.test(x))).toBe(true);
  });

  it('the dialog cannot type a fixed price', () => {
    const src = readFileSync(resolve(__dirname, '../../components/admin/ProposalDialog.tsx'), 'utf8');
    expect(src).toMatch(/readOnly=\{!l\.fromPrice\}/);
  });
});

describe('nothing may promise a result', () => {
  const base = { lead: lead(), theme: 'local-business' as const, lines: [line('clarity-session')], now: NOW };

  it('a finding that guarantees is refused', () => {
    const p = buildProposal({ ...base, title: '', findings: ['We guarantee page one'] });
    expect(validateProposal(p).some((x) => /promises a result/.test(x))).toBe(true);
  });

  it('a title that claims cheapest is refused', () => {
    const p = buildProposal({ ...base, title: 'The cheapest plan in Cape Town', findings: [] });
    expect(validateProposal(p)).not.toEqual([]);
  });

  it('an em dash is refused', () => {
    const p = buildProposal({ ...base, title: '', findings: ['One \u2014 thing'] });
    expect(validateProposal(p).some((x) => /em dash/.test(x))).toBe(true);
  });

  it('a plain observation passes', () => {
    const p = buildProposal({ ...base, title: '', findings: ['Your Google profile has no opening hours.'] });
    expect(validateProposal(p)).toEqual([]);
  });

  it('an empty proposal cannot be issued', () => {
    const p = buildProposal({ ...base, lines: [], title: '', findings: [] });
    expect(validateProposal(p)).toContain('Pick at least one offer.');
  });
});

describe('the plan writes itself', () => {
  it('one phase per band, in rate card order', () => {
    const plan = planFor([line('social-media-management'), line('clarity-session'), line('landing-page')]);
    expect(plan.map((p) => p.title)).toEqual(['Look and listen', 'Build', 'Run']);
    const bandHues = SERVICE_BANDS.map((b) => b.hue);
    for (const ph of plan) expect(bandHues).toContain(ph.hue);
  });

  it('two offers from one band make one phase', () => {
    expect(planFor([line('clarity-session'), line('website-audit')])).toHaveLength(1);
  });

  it('every band the card has is covered', () => {
    for (const band of SERVICE_BANDS) {
      const first = band.offers[0];
      expect(planFor([line(first.slug)]), band.id).toHaveLength(1);
    }
  });
});

describe('the document and the email', () => {
  it('drops blank findings and keeps at most three', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: ['', 'a', ' ', 'b', 'c', 'd'], lines: [line('clarity-session')], now: NOW });
    expect(p.findings).toEqual(['a', 'b', 'c']);
  });

  it('titles by the business, not the person, when both are known', () => {
    expect(defaultTitle(lead())).toBe('A plan for Surf Emporium');
    expect(defaultTitle(lead({ org: null }))).toBe('A plan for Jane Smith');
  });

  it('the cover email says the price, the deposit, the link and the date, and nothing it should not', () => {
    const p = buildProposal({ lead: lead(), theme: 'local-business', title: '', findings: ['x'], lines: [line('clarity-session'), line('website-audit')], now: NOW });
    const mail = coverEmail(p, 'https://omniwellnessmedia.co.za/admin/proposal/outreach/abc123/' + p.number);
    expect(mail.subject).toBe('A plan for Surf Emporium, from Omni Wellness Media');
    // en-ZA groups thousands with a space in Node and a comma in some
    // browsers; assert through the same formatter the email uses.
    expect(mail.body).toContain(rand(4000));
    expect(mail.body).toContain(rand(2000));
    expect(mail.body).toContain(p.number);
    expect(mail.body).toContain('10 October');
    expect(mail.body).toMatch(/^Hi Jane,/);
    expect(mail.body).not.toMatch(/guarantee|\u2014|\*\*|#/);
  });

  it('reads proposals back newest first and ignores rubbish', () => {
    const a = buildProposal({ lead: lead(), theme: 'local-business', title: 'A', findings: [], lines: [line('clarity-session')], now: new Date('2026-09-20T10:00:00Z') });
    const b = buildProposal({ lead: lead(), theme: 'retail', title: 'B', findings: [], lines: [line('content-pack-12')], now: NOW });
    const out = proposalsFromActivities([
      { id: '1', lead_type: 'outreach', lead_id: 'abc123', action: PROPOSAL_ISSUED, payload: { proposal: a }, created_at: a.issuedAt },
      { id: '2', lead_type: 'outreach', lead_id: 'abc123', action: PROPOSAL_ISSUED, payload: { nonsense: true }, created_at: a.issuedAt },
      { id: '3', lead_type: 'outreach', lead_id: 'abc123', action: PROPOSAL_ISSUED, payload: { proposal: b }, created_at: b.issuedAt },
    ]);
    expect(out.map((p) => p.title)).toEqual(['B', 'A']);
  });
});

describe('wiring', () => {
  const read = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');

  it('has a route, a button in the drawer, and a line on the client timeline', () => {
    expect(read('../../App.tsx')).toMatch(/path="\/admin\/proposal\/:leadType\/:leadId\/:number"/);
    expect(read('../../components/admin/LeadDrawer.tsx')).toMatch(/Build proposal/);
    expect(read('../clients.ts')).toMatch(/case 'proposal_issued'/);
  });

  it('the document renders inclusions through the same merge as the public offer page', () => {
    expect(read('../../pages/admin/ProposalPrint.tsx')).toMatch(/mergeOne\(line\.slug, published\)/);
  });

  it.each([
    ['proposals.ts', '../proposals.ts'],
    ['ProposalDialog.tsx', '../../components/admin/ProposalDialog.tsx'],
    ['ProposalPrint.tsx', '../../pages/admin/ProposalPrint.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(read(rel)).not.toMatch(/\u2014/);
  });

  it('every offer on the card can be proposed', () => {
    expect(ALL_OFFERS.length).toBeGreaterThan(15);
    for (const o of ALL_OFFERS) expect(planFor([line(o.slug)]), o.slug).toHaveLength(1);
  });
});
