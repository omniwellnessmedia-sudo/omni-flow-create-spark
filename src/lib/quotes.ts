import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { RATE_CARD_TERMS } from '@/data/publicRateCard';
import type { LeadSource, PipelineLead } from '@/lib/pipeline';
import type { ActivityRow } from '@/lib/clients';

/**
 * Quotations and the money they are owed, without a new table.
 *
 * WHY THE ACTIVITY LOG. A quote is an event in a lead's life, and so is a
 * payment. lead_activities already records events per lead with a JSON
 * payload, admins can already write to it, and the client card already
 * reads it. So a quote is an activity of action "quote_issued" carrying
 * the whole quotation, and a payment is "payment_received" carrying the
 * quote number and the amount. Nothing needs migrating to production to
 * start invoicing today, and when a proper ledger table arrives these
 * rows migrate into it in one pass.
 *
 * THE TERMS ARE THE RATE CARD'S. Fifty percent deposit, balance before
 * final handover, quotations valid fourteen days. Those numbers live in
 * publicRateCard.ts as published terms; the maths here reads them as
 * constants that the test checks against the published wording, so the
 * quote can never say something the website does not.
 *
 * No em dashes in this file.
 */

export const DEPOSIT_PERCENT = 50;
export const QUOTE_VALID_DAYS = 14;

export interface QuoteLine {
  /** Rate card slug when the line is an offer; null for a custom line. */
  slug: string | null;
  name: string;
  /** Rand, per unit. */
  unit: number;
  qty: number;
  /** "From" prices on the card are a floor, not a fixed price; the quote says so. */
  fromPrice?: boolean;
}

export interface Quote {
  number: string;
  leadType: LeadSource;
  leadId: string;
  client: { name: string; org: string | null; email: string | null };
  lines: QuoteLine[];
  subtotal: number;
  depositPercent: number;
  depositDue: number;
  balanceDue: number;
  issuedAt: string;
  validUntil: string;
  notes: string | null;
  terms: string[];
}

/** "R7,500 launch rate" reads as 7500; "From R1,850 per month" as 1850. */
export const parseRand = (price: string | null | undefined): number | null => {
  const m = (price ?? '').match(/R\s?(\d[\d,]*)/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
};

export const isFromPrice = (price: string | null | undefined): boolean => /^\s*from\b/i.test(price ?? '');

/** Q-260914-AB12: date first so numbers sort by day, then a slice of the lead id so two on one day differ. */
export const quoteNumber = (leadId: string, now = new Date()): string =>
  `Q-${format(now, 'yyMMdd')}-${leadId.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase()}`;

export const rand = (n: number): string => `R${Math.round(n).toLocaleString('en-ZA')}`;

export const lineTotal = (l: QuoteLine): number => l.unit * l.qty;

export const buildQuote = (args: {
  lead: PipelineLead;
  lines: QuoteLine[];
  notes?: string | null;
  now?: Date;
}): Quote => {
  const now = args.now ?? new Date();
  const lines = args.lines.filter((l) => l.qty > 0 && l.unit >= 0 && l.name.trim());
  const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0);
  const depositDue = Math.round((subtotal * DEPOSIT_PERCENT) / 100);
  return {
    number: quoteNumber(args.lead.id, now),
    leadType: args.lead.source,
    leadId: args.lead.id,
    client: { name: args.lead.name, org: args.lead.org, email: args.lead.email },
    lines,
    subtotal,
    depositPercent: DEPOSIT_PERCENT,
    depositDue,
    balanceDue: subtotal - depositDue,
    issuedAt: now.toISOString(),
    validUntil: addDays(now, QUOTE_VALID_DAYS).toISOString(),
    notes: args.notes?.trim() || null,
    terms: RATE_CARD_TERMS,
  };
};

export interface Payment {
  /** The activity row's id, which is what a receipt is addressed by. */
  id?: string;
  quoteNumber: string;
  amount: number;
  method: string;
  at: string;
}

export type QuoteStatus = 'awaiting_deposit' | 'deposit_paid' | 'paid' | 'expired';

export interface QuoteRecord {
  quote: Quote;
  payments: Payment[];
  paid: number;
  status: QuoteStatus;
  /** Rand still owed. */
  outstanding: number;
}

export const QUOTE_ISSUED = 'quote_issued';
export const PAYMENT_RECEIVED = 'payment_received';
/**
 * A proposal carries a real quotation inside it (see src/lib/proposals.ts),
 * so the Money screen tracks a priced proposal as a quotation awaiting its
 * deposit. Named here rather than imported to keep this module free of a
 * dependency on the proposal module, which depends on this one.
 */
export const PROPOSAL_ISSUED_ACTION = 'proposal_issued';

const isQuote = (v: unknown): v is Quote =>
  !!v && typeof v === 'object' && typeof (v as Quote).number === 'string' && Array.isArray((v as Quote).lines);

/** Every quote on record with its payments, newest first. */
export const quotesFromActivities = (activities: ActivityRow[], now = new Date()): QuoteRecord[] => {
  const quotes = new Map<string, Quote>();
  const payments = new Map<string, Payment[]>();
  for (const a of activities) {
    const p = a.payload ?? {};
    if (a.action === QUOTE_ISSUED && isQuote(p.quote)) {
      quotes.set(p.quote.number, p.quote);
    } else if (a.action === PROPOSAL_ISSUED_ACTION) {
      const inner = (p.proposal as { quote?: unknown } | undefined)?.quote;
      if (isQuote(inner) && inner.subtotal > 0) quotes.set(inner.number, inner);
    } else if (a.action === PAYMENT_RECEIVED && typeof p.quoteNumber === 'string') {
      const list = payments.get(p.quoteNumber) ?? [];
      list.push({
        id: a.id,
        quoteNumber: p.quoteNumber,
        amount: Number(p.amount) || 0,
        method: String(p.method ?? 'EFT'),
        at: String(p.at ?? a.created_at),
      });
      payments.set(p.quoteNumber, list);
    }
  }
  const records = Array.from(quotes.values()).map((quote) => {
    const list = payments.get(quote.number) ?? [];
    const paid = list.reduce((s, x) => s + x.amount, 0);
    const outstanding = Math.max(0, quote.subtotal - paid);
    let status: QuoteStatus;
    if (quote.subtotal > 0 && paid >= quote.subtotal - 0.5) status = 'paid';
    else if (paid >= quote.depositDue - 0.5 && quote.depositDue > 0) status = 'deposit_paid';
    else if (differenceInCalendarDays(now, new Date(quote.validUntil)) > 0) status = 'expired';
    else status = 'awaiting_deposit';
    return { quote, payments: list, paid, status, outstanding };
  });
  records.sort((a, b) => b.quote.issuedAt.localeCompare(a.quote.issuedAt));
  return records;
};

export interface MoneySummary {
  awaitingDeposit: number;
  awaitingBalance: number;
  paidThisMonth: number;
  issuedLast30: number;
  expired: number;
}

export const moneySummary = (records: QuoteRecord[], now = new Date()): MoneySummary => {
  const monthKey = format(now, 'yyyy-MM');
  let awaitingDeposit = 0;
  let awaitingBalance = 0;
  let paidThisMonth = 0;
  let issuedLast30 = 0;
  let expired = 0;
  for (const r of records) {
    if (r.status === 'awaiting_deposit') awaitingDeposit += r.quote.depositDue;
    if (r.status === 'deposit_paid') awaitingBalance += r.outstanding;
    if (r.status === 'expired') expired += 1;
    if (differenceInCalendarDays(now, new Date(r.quote.issuedAt)) < 30) issuedLast30 += 1;
    for (const p of r.payments) if (p.at.slice(0, 7) === monthKey) paidThisMonth += p.amount;
  }
  return { awaitingDeposit, awaitingBalance, paidThisMonth, issuedLast30, expired };
};

export const STATUS_LABEL: Record<QuoteStatus, string> = {
  awaiting_deposit: 'Awaiting deposit',
  deposit_paid: 'Deposit paid',
  paid: 'Paid in full',
  expired: 'Expired',
};

/** The slug an enquiry names, from "Website & Visibility Audit (website-audit)". */
export const slugFromService = (service: string | null | undefined): string | null => {
  const m = (service ?? '').match(/\(([a-z0-9-]+)\)\s*$/i);
  return m ? m[1] : null;
};
