import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DEPOSIT_PERCENT, QUOTE_VALID_DAYS, parseRand, isFromPrice, quoteNumber, buildQuote, quotesFromActivities,
  moneySummary, slugFromService, QUOTE_ISSUED, PAYMENT_RECEIVED,
} from '@/lib/quotes';
import { BANK_DETAILS } from '@/data/bankDetails';
import { ALL_OFFERS, RATE_CARD_TERMS } from '@/data/publicRateCard';
import { toPipelineLead } from '@/lib/pipeline';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * Quotations: the maths matches the published terms, the number sorts by
 * day, the ledger reads back what was written, and the bank details have
 * exactly one source. No em dashes in this file.
 */

const read = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');
const now = new Date('2026-09-14T10:00:00Z');
const lead = toPipelineLead('quote', { id: 'a1b2c3d4-0000', name: 'Ann', email: 'ann@cafe.co', company: 'Ann Cafe', project_details: 'p', service_type: 'Website & Visibility Audit (website-audit)', status: 'in_progress', created_at: '2026-09-10T08:00:00Z' });

describe('the terms are the rate card terms', () => {
  it('fifty percent deposit and fourteen day validity are what the site publishes', () => {
    expect(RATE_CARD_TERMS.some((t) => t.includes(`${DEPOSIT_PERCENT}% deposit`))).toBe(true);
    expect(RATE_CARD_TERMS.some((t) => t.includes(`valid for ${QUOTE_VALID_DAYS} days`))).toBe(true);
  });

  it('reads every published price format', () => {
    expect(parseRand('R1,500')).toBe(1500);
    expect(parseRand('R7,500 launch rate')).toBe(7500);
    expect(parseRand('From R1,850 per month')).toBe(1850);
    expect(parseRand('From R7,500 half day · from R12,500 full day')).toBe(7500);
    expect(parseRand('nonsense')).toBeNull();
    for (const o of ALL_OFFERS) expect(parseRand(o.price), o.slug).not.toBeNull();
    expect(isFromPrice('From R2,800')).toBe(true);
    expect(isFromPrice('R2,500')).toBe(false);
  });
});

describe('building a quote', () => {
  it('numbers by day and lead, sums lines, splits the deposit, dates the validity', () => {
    expect(quoteNumber('a1b2c3d4-0000', now)).toBe('Q-260914-A1B2');
    const q = buildQuote({
      lead,
      lines: [
        { slug: 'website-audit', name: 'Website & Visibility Audit', unit: 2500, qty: 1 },
        { slug: null, name: 'Extra revision round', unit: 1500, qty: 2 },
        { slug: 'x', name: 'ignored', unit: 100, qty: 0 },
      ],
      notes: '  Start next Monday  ',
      now,
    });
    expect(q.number).toBe('Q-260914-A1B2');
    expect(q.lines).toHaveLength(2);
    expect(q.subtotal).toBe(5500);
    expect(q.depositDue).toBe(2750);
    expect(q.balanceDue).toBe(2750);
    expect(q.validUntil.slice(0, 10)).toBe('2026-09-28');
    expect(q.notes).toBe('Start next Monday');
    expect(q.terms).toEqual(RATE_CARD_TERMS);
    expect(q.client).toEqual({ name: 'Ann', org: 'Ann Cafe', email: 'ann@cafe.co' });
  });

  it('preselects the offer an enquiry names', () => {
    expect(slugFromService('Website & Visibility Audit (website-audit)')).toBe('website-audit');
    expect(slugFromService('Web Development')).toBeNull();
  });
});

describe('the ledger', () => {
  const issued = (q: ReturnType<typeof buildQuote>, at: string) => ({ id: at, lead_type: 'quote', lead_id: lead.id, action: QUOTE_ISSUED, payload: { quote: q }, created_at: at });
  const paid = (num: string, amount: number, at: string) => ({ id: `${num}-${at}`, lead_type: 'quote', lead_id: lead.id, action: PAYMENT_RECEIVED, payload: { quoteNumber: num, amount, method: 'EFT', at }, created_at: at });

  it('reads status from the payments against each quote', () => {
    const q1 = buildQuote({ lead, lines: [{ slug: null, name: 'A', unit: 2000, qty: 1 }], now });
    const q2 = { ...buildQuote({ lead, lines: [{ slug: null, name: 'B', unit: 4000, qty: 1 }], now }), number: 'Q-260901-ZZZZ' };
    const q3 = { ...buildQuote({ lead, lines: [{ slug: null, name: 'C', unit: 1000, qty: 1 }], now: new Date('2026-08-01T10:00:00Z') }), number: 'Q-260801-OLD1' };
    const records = quotesFromActivities(
      [issued(q1, '2026-09-14T10:00:00Z'), paid(q1.number, 1000, '2026-09-14T11:00:00Z'), issued(q2, '2026-09-01T10:00:00Z'), paid(q2.number, 4000, '2026-09-05T10:00:00Z'), issued(q3, '2026-08-01T10:00:00Z')],
      now
    );
    const by = Object.fromEntries(records.map((r) => [r.quote.number, r]));
    expect(by[q1.number].status).toBe('deposit_paid');
    expect(by[q1.number].outstanding).toBe(1000);
    expect(by['Q-260901-ZZZZ'].status).toBe('paid');
    expect(by['Q-260801-OLD1'].status).toBe('expired');
    expect(records[0].quote.number).toBe(q1.number);

    const s = moneySummary(records, now);
    expect(s.awaitingBalance).toBe(1000);
    expect(s.awaitingDeposit).toBe(0);
    expect(s.paidThisMonth).toBe(5000);
    expect(s.issuedLast30).toBe(2);
    expect(s.expired).toBe(1);
  });

  it('counts an unpaid, unexpired quote as awaiting its deposit', () => {
    const q = buildQuote({ lead, lines: [{ slug: null, name: 'A', unit: 3000, qty: 1 }], now });
    const [r] = quotesFromActivities([issued(q, now.toISOString())], now);
    expect(r.status).toBe('awaiting_deposit');
    expect(moneySummary([r], now).awaitingDeposit).toBe(1500);
  });
});

describe('bank details have one source', () => {
  it('are the confirmed Capitec account', () => {
    expect(BANK_DETAILS).toEqual({ bank: 'Capitec Business', accountName: 'OMNI MEDIA PRODUCTIONS PTY LTD', accountNumber: '1051893445', branchCode: '450105' });
  });

  it('are not retyped anywhere else', () => {
    for (const rel of ['../../pages/tours/OmniWellnessRetreat.tsx', '../../pages/admin/QuotePrint.tsx', '../../components/admin/MoneyScreen.tsx']) {
      const src = read(rel);
      expect(src, rel).toContain('BANK_DETAILS');
      expect(src, rel).not.toContain('1051893445');
    }
  });
});

describe('wiring', () => {
  it('has a printable route, a section, and a sidebar entry under Money', () => {
    expect(read('../../App.tsx')).toContain('path="/admin/quote/:leadType/:leadId/:number"');
    expect(read('../../pages/AdminDashboard.tsx')).toMatch(/case "money"/);
    expect(NAV_GROUPS.find((g) => g.label === 'Money')?.items[0].id).toBe('money');
    expect(read('../../components/admin/LeadDrawer.tsx')).toContain('Build quote');
  });

  it.each([
    ['quotes.ts', '../quotes.ts'],
    ['bankDetails.ts', '../../data/bankDetails.ts'],
    ['QuoteDialog.tsx', '../../components/admin/QuoteDialog.tsx'],
    ['QuotePrint.tsx', '../../pages/admin/QuotePrint.tsx'],
    ['MoneyScreen.tsx', '../../components/admin/MoneyScreen.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(read(rel)).not.toMatch(/\u2014/);
  });
});
