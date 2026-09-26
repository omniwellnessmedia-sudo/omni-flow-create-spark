import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { RATE_CARD_TERMS } from '@/data/publicRateCard';
import { VAT_RATE_PERCENT, VAT_REGISTERED } from '@/data/companyDetails';
import type { LeadSource } from '@/lib/pipeline';
import type { ActivityRow } from '@/lib/clients';
import { rand, type Payment, type Quote, type QuoteLine, type QuoteRecord } from '@/lib/quotes';

/**
 * Invoices and receipts, on the same ledger as quotations.
 *
 * A quotation says what something will cost. An invoice asks for the
 * money, and there are three of them in the life of a job: the deposit,
 * the balance, and occasionally the whole amount at once. A receipt says
 * the money arrived. All of them are events in the lead's activity log,
 * the same as the quotation and the payment they refer to, so nothing
 * needs migrating and the Money screen reads the whole story back from
 * one table.
 *
 * THE REFERENCE IS THE QUOTE NUMBER. Every invoice tells the client to pay
 * with the quotation number as reference, because that is what the
 * payment is recorded against and what the Money screen matches on. One
 * reference for the deposit, the balance and the receipt keeps a bank
 * statement readable without a lookup table.
 *
 * VAT is off until src/data/companyDetails.ts carries a VAT number. See
 * the note there.
 *
 * No em dashes in this file.
 */

export const INVOICE_ISSUED = 'invoice_issued';

export type InvoiceKind = 'deposit' | 'balance' | 'full';

export const KIND_LABEL: Record<InvoiceKind, string> = {
  deposit: 'Deposit invoice',
  balance: 'Balance invoice',
  full: 'Invoice',
};

/** Days a balance or full invoice is due in. A deposit is due on receipt. */
export const INVOICE_DUE_DAYS = 7;

export interface Invoice {
  number: string;
  kind: InvoiceKind;
  /** The quotation this invoices, and the payment reference. */
  quoteNumber: string;
  leadType: LeadSource;
  leadId: string;
  client: Quote['client'];
  lines: QuoteLine[];
  /** Before VAT. */
  subtotal: number;
  vatPercent: number;
  vat: number;
  total: number;
  issuedAt: string;
  dueAt: string;
  terms: string[];
}

export type InvoiceStatus = 'unpaid' | 'overdue' | 'paid';

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  unpaid: 'Unpaid',
  overdue: 'Overdue',
  paid: 'Paid',
};

/** INV-260914-A1B2-D: the quote's own day and tail, then the kind, so the two read as one job. */
export const invoiceNumber = (quoteNumber: string, kind: InvoiceKind): string =>
  `INV-${quoteNumber.replace(/^[A-Z]+-/, '')}-${kind[0].toUpperCase()}`;

const vatOn = (subtotal: number) => {
  const vatPercent = VAT_REGISTERED ? VAT_RATE_PERCENT : 0;
  const vat = Math.round((subtotal * vatPercent) / 100);
  return { vatPercent, vat, total: subtotal + vat };
};

export const buildInvoice = (args: { quote: Quote; kind: InvoiceKind; now?: Date }): Invoice => {
  const { quote, kind } = args;
  const now = args.now ?? new Date();
  const summary = quote.lines.map((l) => l.name).join(', ');
  const lines: QuoteLine[] =
    kind === 'full'
      ? quote.lines
      : kind === 'deposit'
        ? [{ slug: null, name: `Deposit (${quote.depositPercent}%) on ${quote.number}: ${summary}`, unit: quote.depositDue, qty: 1 }]
        : [{ slug: null, name: `Balance on ${quote.number}: ${summary}`, unit: quote.balanceDue, qty: 1 }];
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  return {
    number: invoiceNumber(quote.number, kind),
    kind,
    quoteNumber: quote.number,
    leadType: quote.leadType,
    leadId: quote.leadId,
    client: quote.client,
    lines,
    subtotal,
    ...vatOn(subtotal),
    issuedAt: now.toISOString(),
    dueAt: (kind === 'deposit' ? now : addDays(now, INVOICE_DUE_DAYS)).toISOString(),
    terms: RATE_CARD_TERMS,
  };
};

const isInvoice = (v: unknown): v is Invoice =>
  !!v && typeof v === 'object' && typeof (v as Invoice).number === 'string' && typeof (v as Invoice).quoteNumber === 'string' && Array.isArray((v as Invoice).lines);

/** Every invoice on record, newest first. Issuing the same kind again replaces the earlier one. */
export const invoicesFromActivities = (activities: ActivityRow[]): Invoice[] => {
  const out = new Map<string, Invoice>();
  for (const a of activities) {
    const p = a.payload ?? {};
    if (a.action === INVOICE_ISSUED && isInvoice(p.invoice)) out.set(p.invoice.number, p.invoice);
  }
  return Array.from(out.values()).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
};

export interface InvoiceRecord {
  invoice: Invoice;
  status: InvoiceStatus;
  /** Rand of this invoice covered by payments against the quote, in date order. */
  covered: number;
}

/**
 * Payments are recorded against the quotation, not the invoice, so cover
 * is allocated oldest invoice first: the deposit invoice is paid before a
 * rand goes to the balance invoice. A "full" invoice takes everything.
 */
export const invoiceRecords = (invoices: Invoice[], quotes: QuoteRecord[], now = new Date()): InvoiceRecord[] => {
  const paidByQuote = new Map(quotes.map((r) => [r.quote.number, r.paid]));
  const byQuote = new Map<string, Invoice[]>();
  for (const inv of invoices) byQuote.set(inv.quoteNumber, [...(byQuote.get(inv.quoteNumber) ?? []), inv]);

  const out: InvoiceRecord[] = [];
  for (const [quoteNumber, list] of byQuote) {
    let pool = paidByQuote.get(quoteNumber) ?? 0;
    for (const inv of [...list].sort((a, b) => a.issuedAt.localeCompare(b.issuedAt))) {
      const covered = Math.min(pool, inv.total);
      pool -= covered;
      const status: InvoiceStatus =
        covered >= inv.total - 0.5 && inv.total > 0
          ? 'paid'
          : differenceInCalendarDays(now, new Date(inv.dueAt)) > 0
            ? 'overdue'
            : 'unpaid';
      out.push({ invoice: inv, status, covered });
    }
  }
  return out.sort((a, b) => b.invoice.issuedAt.localeCompare(a.invoice.issuedAt));
};

/** What is on the books but not in the bank. */
export const invoicedUnpaid = (records: InvoiceRecord[]): number =>
  records.filter((r) => r.status !== 'paid').reduce((s, r) => s + (r.invoice.total - r.covered), 0);

/** RCT-260914-1A2B: the day the money arrived and a slice of the payment's own id. */
export const receiptNumber = (payment: Payment): string =>
  `RCT-${format(new Date(payment.at), 'yyMMdd')}-${(payment.id ?? '').replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase() || 'XXXX'}`;

export interface Receipt {
  number: string;
  payment: Payment;
  quote: Quote;
  /** Rand paid on this quote up to and including this payment. */
  paidToDate: number;
  /** Rand still owed on the quote after this payment. */
  remaining: number;
}

export const receiptFor = (record: QuoteRecord, paymentId: string): Receipt | null => {
  const ordered = [...record.payments].sort((a, b) => a.at.localeCompare(b.at));
  const idx = ordered.findIndex((p) => p.id === paymentId);
  if (idx < 0) return null;
  const paidToDate = ordered.slice(0, idx + 1).reduce((s, p) => s + p.amount, 0);
  return {
    number: receiptNumber(ordered[idx]),
    payment: ordered[idx],
    quote: record.quote,
    paidToDate,
    remaining: Math.max(0, record.quote.subtotal - paidToDate),
  };
};

/**
 * The service ledger as rows an accountant can import. Invoices are
 * debits, payments are credits, both against the quotation as reference.
 * Quotations themselves are not accounting events and are left out.
 */
export interface LedgerRow {
  date: string;
  document: string;
  number: string;
  client: string;
  organisation: string;
  reference: string;
  debit: number;
  credit: number;
  method: string;
}

export const ledgerRows = (quotes: QuoteRecord[], invoices: Invoice[]): LedgerRow[] => {
  const rows: LedgerRow[] = [];
  for (const inv of invoices) {
    rows.push({
      date: inv.issuedAt.slice(0, 10), document: KIND_LABEL[inv.kind], number: inv.number,
      client: inv.client.name, organisation: inv.client.org ?? '', reference: inv.quoteNumber,
      debit: inv.total, credit: 0, method: '',
    });
  }
  for (const r of quotes) {
    for (const p of r.payments) {
      rows.push({
        date: p.at.slice(0, 10), document: 'Payment', number: receiptNumber(p),
        client: r.quote.client.name, organisation: r.quote.client.org ?? '', reference: r.quote.number,
        debit: 0, credit: p.amount, method: p.method,
      });
    }
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number));
};

const csvCell = (v: string | number): string => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const ledgerCsv = (rows: LedgerRow[]): string => {
  const head = ['Date', 'Document', 'Number', 'Client', 'Organisation', 'Reference', 'Debit (ZAR)', 'Credit (ZAR)', 'Method'];
  const body = rows.map((r) => [r.date, r.document, r.number, r.client, r.organisation, r.reference, r.debit || '', r.credit || '', r.method].map(csvCell).join(','));
  return [head.join(','), ...body].join('\n') + '\n';
};

/** "R2,500 due on receipt" or "R2,500 due by 3 October". */
export const dueLine = (inv: Invoice): string =>
  inv.kind === 'deposit'
    ? `${rand(inv.total)} due on receipt`
    : `${rand(inv.total)} due by ${new Date(inv.dueAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}`;
