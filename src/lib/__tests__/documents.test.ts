import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { COMPANY, VAT_RATE_PERCENT, VAT_REGISTERED } from '@/data/companyDetails';
import { BANK_DETAILS } from '@/data/bankDetails';
import { PAYMENT_RECEIVED, PROPOSAL_ISSUED_ACTION, QUOTE_ISSUED, buildQuote, quotesFromActivities, rand } from '@/lib/quotes';
import {
  INVOICE_DUE_DAYS, INVOICE_ISSUED, buildInvoice, dueLine, invoiceNumber, invoiceRecords, invoicedUnpaid,
  invoicesFromActivities, ledgerCsv, ledgerRows, receiptFor, receiptNumber,
} from '@/lib/invoices';
import { buildProposal } from '@/lib/proposals';
import { toPipelineLead } from '@/lib/pipeline';
import type { ActivityRow } from '@/lib/clients';

/**
 * Invoices, receipts, the ledger export, and the one template they all
 * print through. The rules: the money comes from the quotation, the
 * reference is the quotation number, VAT is off until a VAT number
 * exists, and nothing about the company is invented.
 *
 * No em dashes in this file.
 */

const read = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');
const NOW = new Date('2026-09-26T10:00:00Z');
const lead = toPipelineLead('quote', { id: 'a1b2c3d4-0000', name: 'Ann Smith', email: 'ann@cafe.co', company: 'Ann Cafe', project_details: 'p', service_type: 'Website & Visibility Audit (website-audit)', status: 'in_progress', created_at: '2026-09-10T08:00:00Z' });
const quote = buildQuote({ lead, lines: [{ slug: 'website-audit', name: 'Website & Visibility Audit', unit: 2500, qty: 1 }, { slug: 'clarity-session', name: 'AI & Business Clarity Session', unit: 1500, qty: 1 }], now: NOW });

const act = (action: string, payload: Record<string, unknown>, at: string, id = at): ActivityRow =>
  ({ id, lead_type: 'quote', lead_id: lead.id, action, payload, created_at: at });

describe('the company on every document', () => {
  it('is the registered entity on the bank account, trading as Omni', () => {
    expect(COMPANY.legalName).toBe(BANK_DETAILS.accountName);
    expect(COMPANY.tradingName).toBe('Omni Wellness Media');
  });

  it('carries no registration or VAT number that nobody supplied', () => {
    // These are empty on purpose. Filling them in is a one line change in
    // companyDetails.ts; guessing them would be a false statement on an
    // invoice.
    expect(COMPANY.registrationNumber).toBe('');
    expect(COMPANY.vatNumber).toBe('');
    expect(VAT_REGISTERED).toBe(false);
    expect(VAT_RATE_PERCENT).toBe(15);
  });

  it('the template renders an empty field as nothing, never as a label beside a blank', () => {
    const src = read('../../components/documents/DocumentShell.tsx');
    expect(src).toMatch(/COMPANY\.registrationNumber && /);
    expect(src).toMatch(/COMPANY\.vatNumber && /);
  });
});

describe('an invoice is the quotation asking for its money', () => {
  it('a deposit invoice is half the quote, due on receipt, referenced to the quote', () => {
    const inv = buildInvoice({ quote, kind: 'deposit', now: NOW });
    expect(inv.number).toBe('INV-260926-A1B2-D');
    expect(inv.total).toBe(2000);
    expect(inv.vat).toBe(0);
    expect(inv.quoteNumber).toBe(quote.number);
    expect(inv.dueAt).toBe(inv.issuedAt);
    expect(inv.lines[0].name).toMatch(/^Deposit \(50%\) on Q-260926-A1B2: Website/);
    expect(dueLine(inv)).toBe(`${rand(2000)} due on receipt`);
  });

  it('a balance invoice is the rest, due in seven days', () => {
    const inv = buildInvoice({ quote, kind: 'balance', now: NOW });
    expect(inv.number).toBe('INV-260926-A1B2-B');
    expect(inv.total).toBe(2000);
    expect(new Date(inv.dueAt).toISOString().slice(0, 10)).toBe('2026-10-03');
    expect(INVOICE_DUE_DAYS).toBe(7);
    expect(dueLine(inv)).toMatch(/due by 3 October$/);
  });

  it('a full invoice carries the quote lines as they are', () => {
    const inv = buildInvoice({ quote, kind: 'full', now: NOW });
    expect(inv.lines).toEqual(quote.lines);
    expect(inv.total).toBe(4000);
    expect(invoiceNumber(quote.number, 'full')).toBe('INV-260926-A1B2-F');
  });

  it('a proposal invoices the same way, on its own number', () => {
    const p = buildProposal({ lead, theme: 'local-business', title: '', findings: [], lines: quote.lines, now: NOW });
    const inv = buildInvoice({ quote: p.quote, kind: 'deposit', now: NOW });
    expect(inv.number).toBe('INV-260926-A1B2-D');
    expect(inv.quoteNumber).toBe(p.number);
  });

  it('adds no VAT while there is no VAT number', () => {
    for (const kind of ['deposit', 'balance', 'full'] as const) {
      const inv = buildInvoice({ quote, kind, now: NOW });
      expect(inv.vatPercent).toBe(0);
      expect(inv.total).toBe(inv.subtotal);
    }
    expect(read('../../pages/admin/InvoicePrint.tsx')).toMatch(/VAT_REGISTERED \? `Tax /);
  });
});

describe('payments cover invoices oldest first', () => {
  const dep = buildInvoice({ quote, kind: 'deposit', now: new Date('2026-09-26T10:00:00Z') });
  const bal = buildInvoice({ quote, kind: 'balance', now: new Date('2026-10-05T10:00:00Z') });
  const base = [act(QUOTE_ISSUED, { quote }, quote.issuedAt), act(INVOICE_ISSUED, { invoice: dep }, dep.issuedAt), act(INVOICE_ISSUED, { invoice: bal }, bal.issuedAt)];

  it('nothing paid: deposit unpaid, balance unpaid, all of it on the books', () => {
    const q = quotesFromActivities(base, NOW);
    const recs = invoiceRecords(invoicesFromActivities(base), q, NOW);
    expect(recs.map((r) => [r.invoice.kind, r.status])).toEqual([['balance', 'unpaid'], ['deposit', 'unpaid']]);
    expect(invoicedUnpaid(recs)).toBe(4000);
  });

  it('the deposit paid: deposit paid, balance still open', () => {
    const acts = [...base, act(PAYMENT_RECEIVED, { quoteNumber: quote.number, amount: 2000, method: 'EFT', at: '2026-09-27T09:00:00Z' }, '2026-09-27T09:00:00Z', 'pay1')];
    const q = quotesFromActivities(acts, NOW);
    const recs = invoiceRecords(invoicesFromActivities(acts), q, NOW);
    const by = Object.fromEntries(recs.map((r) => [r.invoice.kind, r]));
    expect(by.deposit.status).toBe('paid');
    expect(by.balance.status).toBe('unpaid');
    expect(invoicedUnpaid(recs)).toBe(2000);
  });

  it('a short payment covers part of the deposit and the rest waits', () => {
    const acts = [...base, act(PAYMENT_RECEIVED, { quoteNumber: quote.number, amount: 500, method: 'Cash', at: '2026-09-27T09:00:00Z' }, '2026-09-27T09:00:00Z', 'pay1')];
    const recs = invoiceRecords(invoicesFromActivities(acts), quotesFromActivities(acts, NOW), NOW);
    const by = Object.fromEntries(recs.map((r) => [r.invoice.kind, r]));
    expect(by.deposit.covered).toBe(500);
    expect(by.balance.covered).toBe(0);
  });

  it('an unpaid invoice past its due date is overdue', () => {
    const later = new Date('2026-10-20T10:00:00Z');
    const recs = invoiceRecords(invoicesFromActivities(base), quotesFromActivities(base, later), later);
    expect(recs.find((r) => r.invoice.kind === 'balance')?.status).toBe('overdue');
  });

  it('issuing the same kind again replaces the earlier one', () => {
    const again = buildInvoice({ quote, kind: 'deposit', now: new Date('2026-09-26T15:00:00Z') });
    const acts = [...base, act(INVOICE_ISSUED, { invoice: again }, again.issuedAt)];
    const invs = invoicesFromActivities(acts);
    expect(invs.filter((i) => i.kind === 'deposit')).toHaveLength(1);
    expect(invs.find((i) => i.kind === 'deposit')?.issuedAt).toBe(again.issuedAt);
  });
});

describe('a receipt says what arrived and what is still owed', () => {
  const acts = [
    act(QUOTE_ISSUED, { quote }, quote.issuedAt),
    act(PAYMENT_RECEIVED, { quoteNumber: quote.number, amount: 2000, method: 'EFT', at: '2026-09-27T09:00:00Z' }, '2026-09-27T09:00:00Z', 'pay-one'),
    act(PAYMENT_RECEIVED, { quoteNumber: quote.number, amount: 2000, method: 'Card', at: '2026-10-10T09:00:00Z' }, '2026-10-10T09:00:00Z', 'pay-two'),
  ];
  const [record] = quotesFromActivities(acts, NOW);

  it('carries the payment id so a receipt has an address', () => {
    expect(record.payments.map((p) => p.id).sort()).toEqual(['pay-one', 'pay-two']);
  });

  it('the first receipt shows the balance still owed, the second shows paid in full', () => {
    const one = receiptFor(record, 'pay-one')!;
    expect(one.number).toBe('RCT-260927-PAYO');
    expect(one.paidToDate).toBe(2000);
    expect(one.remaining).toBe(2000);
    const two = receiptFor(record, 'pay-two')!;
    expect(two.paidToDate).toBe(4000);
    expect(two.remaining).toBe(0);
    expect(receiptFor(record, 'nope')).toBeNull();
  });

  it('a payment with no id still gets a number rather than crashing', () => {
    expect(receiptNumber({ quoteNumber: 'Q', amount: 1, method: 'EFT', at: '2026-09-27T09:00:00Z' })).toBe('RCT-260927-XXXX');
  });
});

describe('the ledger export', () => {
  it('invoices are debits, payments are credits, both referenced to the quote, in date order', () => {
    const dep = buildInvoice({ quote, kind: 'deposit', now: NOW });
    const acts = [
      act(QUOTE_ISSUED, { quote }, quote.issuedAt),
      act(INVOICE_ISSUED, { invoice: dep }, dep.issuedAt),
      act(PAYMENT_RECEIVED, { quoteNumber: quote.number, amount: 2000, method: 'EFT', at: '2026-09-27T09:00:00Z' }, '2026-09-27T09:00:00Z', 'pay1'),
    ];
    const rows = ledgerRows(quotesFromActivities(acts, NOW), invoicesFromActivities(acts));
    expect(rows.map((r) => [r.document, r.debit, r.credit, r.reference])).toEqual([
      ['Deposit invoice', 2000, 0, quote.number],
      ['Payment', 0, 2000, quote.number],
    ]);
    const csv = ledgerCsv(rows);
    expect(csv.split('\n')[0]).toBe('Date,Document,Number,Client,Organisation,Reference,Debit (ZAR),Credit (ZAR),Method');
    expect(csv).toContain('2026-09-26,Deposit invoice,INV-260926-A1B2-D,Ann Smith,Ann Cafe,Q-260926-A1B2,2000,,');
    expect(csv).toContain('2026-09-27,Payment,RCT-260927-PAY1,Ann Smith,Ann Cafe,Q-260926-A1B2,,2000,EFT');
  });

  it('quotes a cell that contains a comma', () => {
    expect(ledgerCsv([{ date: 'd', document: 'x', number: 'n', client: 'Smith, Ann', organisation: '', reference: 'r', debit: 1, credit: 0, method: '' }]))
      .toContain('"Smith, Ann"');
  });

  it('a quotation on its own is not an accounting event', () => {
    const acts = [act(QUOTE_ISSUED, { quote }, quote.issuedAt)];
    expect(ledgerRows(quotesFromActivities(acts, NOW), invoicesFromActivities(acts))).toEqual([]);
  });
});

describe('wiring', () => {
  it('the Money screen reads proposals and invoices as well as quotes', () => {
    const src = read('../../components/admin/MoneyScreen.tsx');
    expect(src).toMatch(/\.in\('action', \[QUOTE_ISSUED, PROPOSAL_ISSUED_ACTION, INVOICE_ISSUED, PAYMENT_RECEIVED\]\)/);
    expect(src).toMatch(/Download ledger/);
    expect(src).toMatch(/Invoice deposit/);
    expect(src).toMatch(/\/admin\/receipt\//);
    expect(PROPOSAL_ISSUED_ACTION).toBe('proposal_issued');
  });

  it('has routes for the invoice and the receipt', () => {
    const app = read('../../App.tsx');
    expect(app).toContain('path="/admin/invoice/:leadType/:leadId/:number"');
    expect(app).toContain('path="/admin/receipt/:leadType/:leadId/:activityId"');
  });

  it('the client timeline names an issued invoice', () => {
    expect(read('../clients.ts')).toMatch(/case 'invoice_issued'/);
  });

  it.each([
    ['invoices.ts', '../invoices.ts'],
    ['companyDetails.ts', '../../data/companyDetails.ts'],
    ['DocumentShell.tsx', '../../components/documents/DocumentShell.tsx'],
    ['InvoicePrint.tsx', '../../pages/admin/InvoicePrint.tsx'],
    ['ReceiptPrint.tsx', '../../pages/admin/ReceiptPrint.tsx'],
    ['QuotePrint.tsx', '../../pages/admin/QuotePrint.tsx'],
    ['MoneyScreen.tsx', '../../components/admin/MoneyScreen.tsx'],
  ])('%s has no em dashes', (_n, rel) => {
    expect(read(rel)).not.toMatch(/\u2014/);
  });
});
