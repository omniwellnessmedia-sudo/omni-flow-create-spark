import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Copy, Printer, Wallet, ArrowRight, Download, FileText, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import { BANK_DETAILS } from '@/data/bankDetails';
import { COMPANY, VAT_REGISTERED } from '@/data/companyDetails';
import type { ActivityRow } from '@/lib/clients';
import {
  PAYMENT_RECEIVED, PROPOSAL_ISSUED_ACTION, QUOTE_ISSUED, STATUS_LABEL, moneySummary, quotesFromActivities, rand,
  type QuoteRecord, type QuoteStatus,
} from '@/lib/quotes';
import {
  INVOICE_ISSUED, INVOICE_STATUS_LABEL, KIND_LABEL, buildInvoice, invoiceRecords, invoicedUnpaid, invoicesFromActivities,
  ledgerCsv, ledgerRows, type InvoiceKind, type InvoiceRecord,
} from '@/lib/invoices';

/**
 * Quotes and payments: what has been quoted, what has been invoiced, what
 * is owed, what came in.
 *
 * Built on the activity log (see src/lib/quotes.ts and src/lib/invoices.ts):
 * a quote is an event, a proposal carries a quote, an invoice is an event,
 * a payment is an event, and this screen is the ledger read from them. The
 * Accounting screen keeps the orders, commissions and payouts; this one is
 * the service work the sales pipeline produces, and the Download ledger
 * button is how it reaches the accountant.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const STATUS_HUE: Record<QuoteStatus, string> = {
  awaiting_deposit: '#F38020', deposit_paid: '#2BB9B9', paid: '#4FAE3F', expired: '#8A9A96',
};
const INVOICE_HUE = { unpaid: '#F38020', overdue: '#E63946', paid: '#4FAE3F' } as const;

const day = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });

const Tile = ({ label, value, hue, hint }: { label: string; value: string; hue: string; hint: string }) => (
  <div className="rounded-[18px] border border-border/60 bg-card p-4">
    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
      <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: hue }} />{label}
    </p>
    <p className="mt-2 font-wwpl-display text-[34px] leading-none">{value}</p>
    <p className="mt-2 text-[12px] text-muted-foreground">{hint}</p>
  </div>
);

const PaymentDialog = ({ record, onOpenChange, onSaved }: { record: QuoteRecord | null; onOpenChange: (v: boolean) => void; onSaved: () => void }) => {
  const { toast } = useToast();
  const suggested = record ? (record.status === 'deposit_paid' ? record.outstanding : record.quote.depositDue) : 0;
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState('EFT');
  const [at, setAt] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  useEffect(() => { setAmount(suggested ? String(suggested) : ''); }, [suggested, record?.quote.number]);

  if (!record) return null;

  const save = async () => {
    const n = Number(amount);
    if (!(n > 0)) { toast({ title: 'Enter the amount received', variant: 'destructive' }); return; }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('lead_activities').insert({
      lead_type: record.quote.leadType,
      lead_id: record.quote.leadId,
      actor_id: auth.user?.id ?? null,
      action: PAYMENT_RECEIVED,
      payload: { quoteNumber: record.quote.number, amount: n, method, at: new Date(`${at}T12:00:00`).toISOString() },
    });
    setSaving(false);
    if (error) { toast({ title: 'Could not record the payment', description: error.message, variant: 'destructive' }); return; }
    toast({ title: `${rand(n)} recorded against ${record.quote.number}`, description: 'A receipt is ready to print from the row.' });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={record !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record a payment</DialogTitle>
          <DialogDescription>{record.quote.number}, {record.quote.client.name}. {rand(record.outstanding)} outstanding.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-1 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-1"><Label className="text-xs">Amount (R)</Label><Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div className="space-y-1.5"><Label className="text-xs">Method</Label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              {['EFT', 'Card', 'Cash', 'Other'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Received on</Label><Input type="date" value={at} onChange={(e) => setAt(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving' : 'Record payment'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MoneyScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');
  const [paying, setPaying] = useState<QuoteRecord | null>(null);
  const [issuing, setIssuing] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('lead_activities')
      .select('*')
      .in('action', [QUOTE_ISSUED, PROPOSAL_ISSUED_ACTION, INVOICE_ISSUED, PAYMENT_RECEIVED])
      .order('created_at', { ascending: false })
      .limit(3000);
    setActivities((data ?? []) as unknown as ActivityRow[]);
    setError(err ? err.message : null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const records = useMemo(() => quotesFromActivities(activities), [activities]);
  const invoices = useMemo(() => invoicesFromActivities(activities), [activities]);
  const invRecords = useMemo(() => invoiceRecords(invoices, records), [invoices, records]);
  const invByQuote = useMemo(() => {
    const m = new Map<string, InvoiceRecord[]>();
    for (const r of invRecords) m.set(r.invoice.quoteNumber, [...(m.get(r.invoice.quoteNumber) ?? []), r]);
    return m;
  }, [invRecords]);
  const summary = useMemo(() => moneySummary(records), [records]);
  const unpaidInvoiced = useMemo(() => invoicedUnpaid(invRecords), [invRecords]);
  const shown = filter === 'all' ? records : records.filter((r) => r.status === filter);

  const issueInvoice = async (record: QuoteRecord, kind: InvoiceKind) => {
    const invoice = buildInvoice({ quote: record.quote, kind });
    setIssuing(invoice.number);
    const { data: auth } = await supabase.auth.getUser();
    const { error: err } = await supabase.from('lead_activities').insert({
      lead_type: record.quote.leadType,
      lead_id: record.quote.leadId,
      actor_id: auth.user?.id ?? null,
      action: INVOICE_ISSUED,
      payload: JSON.parse(JSON.stringify({ invoice })),
    });
    setIssuing(null);
    if (err) { toast({ title: 'Could not issue the invoice', description: err.message, variant: 'destructive' }); return; }
    toast({ title: `${invoice.number} issued`, description: `${rand(invoice.total)}, reference ${invoice.quoteNumber}` });
    await load();
    window.open(`/admin/invoice/${invoice.leadType}/${invoice.leadId}/${invoice.number}`, '_blank', 'noopener');
  };

  const downloadLedger = () => {
    const csv = ledgerCsv(ledgerRows(records, invoices));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-service-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBank = async () => {
    const text = `${BANK_DETAILS.bank}\n${BANK_DETAILS.accountName}\nAccount ${BANK_DETAILS.accountNumber}\nBranch ${BANK_DETAILS.branchCode}`;
    try { await navigator.clipboard.writeText(text); toast({ title: 'Banking details copied' }); } catch { toast({ title: 'Could not copy', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-5">
      <AdminScreenHeader
        eyebrow="Money"
        title="Quotes and payments"
        description="Every quotation and priced proposal from the pipeline, the invoices raised on it, what is owed, and what has come in. Orders, commissions and payouts stay under Accounting."
        actions={
          <>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={downloadLedger} disabled={records.length === 0}><Download className="mr-1.5 h-3.5 w-3.5" />Download ledger</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => navigate('/admin-dashboard?section=pipeline')}>Quote from the pipeline <ArrowRight className="ml-1 h-3 w-3" /></Button>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => navigate('/admin-dashboard?section=accounting')}><Wallet className="mr-1.5 h-3.5 w-3.5" />Accounting</Button>
          </>
        }
        meta={loading ? 'Loading' : `${records.length} quote${records.length === 1 ? '' : 's'}, ${invoices.length} invoice${invoices.length === 1 ? '' : 's'} on record`}
      />

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">Could not read the ledger: {error}. <button className="underline" onClick={load}>Try again</button></p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Deposits awaited" value={rand(summary.awaitingDeposit)} hue="#F38020" hint="Quoted, deposit not yet in" />
        <Tile label="Invoiced, unpaid" value={rand(unpaidInvoiced)} hue="#E63946" hint={`${invRecords.filter((r) => r.status === 'overdue').length} overdue`} />
        <Tile label="Received this month" value={rand(summary.paidThisMonth)} hue="#4FAE3F" hint="All payments recorded this month" />
        <Tile label="Quotes, 30 days" value={String(summary.issuedLast30)} hue="#5C2A8A" hint={summary.expired ? `${summary.expired} expired unanswered` : 'None expired'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="rounded-[18px] border border-border/60 bg-card">
          <header className="flex flex-wrap items-center gap-2 border-b border-border/50 px-4 py-3">
            <h2 className="!text-[18px]">Quotations</h2>
            <div className="ml-auto flex flex-wrap gap-1.5">
              {(['all', 'awaiting_deposit', 'deposit_paid', 'paid', 'expired'] as const).map((k) => (
                <button key={k} type="button" onClick={() => setFilter(k)} className={cn('h-7 rounded-full border px-2.5 text-[11px]', filter === k ? 'border-foreground bg-foreground text-background' : 'border-border/70 text-muted-foreground hover:text-foreground')}>
                  {k === 'all' ? 'All' : STATUS_LABEL[k]}
                </button>
              ))}
            </div>
          </header>
          {!loading && shown.length === 0 && (
            <p className="p-5 text-sm text-muted-foreground">No quotations here yet. Open a lead on the pipeline and press Build proposal or Build quote.</p>
          )}
          <ul className="divide-y divide-border/40">
            {shown.map((r) => {
              const invs = invByQuote.get(r.quote.number) ?? [];
              const has = (k: InvoiceKind) => invs.some((i) => i.invoice.kind === k);
              const isProposal = r.quote.number.startsWith('P-');
              const docHref = isProposal
                ? `/admin/proposal/${r.quote.leadType}/${r.quote.leadId}/${r.quote.number}`
                : `/admin/quote/${r.quote.leadType}/${r.quote.leadId}/${r.quote.number}`;
              return (
                <li key={r.quote.number} className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATUS_HUE[r.status] }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium">{r.quote.client.name}{r.quote.client.org && r.quote.client.org !== r.quote.client.name ? <span className="font-normal text-muted-foreground"> / {r.quote.client.org}</span> : null}</p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        <span style={MONO}>{r.quote.number}</span>, {day(r.quote.issuedAt)}, {r.quote.lines.map((l) => l.name).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px]" style={MONO}>{rand(r.quote.subtotal)}</p>
                      <p className="text-[11px] text-muted-foreground">{STATUS_LABEL[r.status]}{r.paid > 0 && r.status !== 'paid' ? `, ${rand(r.paid)} in` : ''}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" asChild>
                        <Link to={docHref} target="_blank"><Printer className="mr-1 h-3.5 w-3.5" />{isProposal ? 'Proposal' : 'Quote'}</Link>
                      </Button>
                      {r.status !== 'paid' && !has('full') && !has('deposit') && (
                        <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" disabled={issuing !== null} onClick={() => issueInvoice(r, 'deposit')}><FileText className="mr-1 h-3.5 w-3.5" />Invoice deposit</Button>
                      )}
                      {r.status !== 'paid' && !has('full') && has('deposit') && !has('balance') && (
                        <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" disabled={issuing !== null} onClick={() => issueInvoice(r, 'balance')}><FileText className="mr-1 h-3.5 w-3.5" />Invoice balance</Button>
                      )}
                      {r.status !== 'paid' && invs.length === 0 && (
                        <Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" disabled={issuing !== null} onClick={() => issueInvoice(r, 'full')}>Invoice in full</Button>
                      )}
                      {r.status !== 'paid' && (
                        <Button size="sm" className="h-8 rounded-full text-xs" onClick={() => setPaying(r)}>Record payment</Button>
                      )}
                    </div>
                  </div>

                  {(invs.length > 0 || r.payments.length > 0) && (
                    <ul className="mt-2 space-y-1 pl-[22px] text-[12px]">
                      {invs.map((ir) => (
                        <li key={ir.invoice.number} className="flex flex-wrap items-center gap-2">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: INVOICE_HUE[ir.status] }} />
                          <span style={MONO}>{ir.invoice.number}</span>
                          <span className="text-muted-foreground">{KIND_LABEL[ir.invoice.kind]}, {rand(ir.invoice.total)}, {INVOICE_STATUS_LABEL[ir.status].toLowerCase()}{ir.status !== 'paid' && ir.covered > 0 ? `, ${rand(ir.covered)} in` : ''}</span>
                          <Link className="underline underline-offset-4" to={`/admin/invoice/${ir.invoice.leadType}/${ir.invoice.leadId}/${ir.invoice.number}`} target="_blank">Print</Link>
                        </li>
                      ))}
                      {[...r.payments].sort((a, b) => a.at.localeCompare(b.at)).map((p) => (
                        <li key={p.id ?? p.at} className="flex flex-wrap items-center gap-2">
                          <ReceiptText className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span className="text-muted-foreground">{rand(p.amount)} by {p.method}, {day(p.at)}</span>
                          {p.id && <Link className="underline underline-offset-4" to={`/admin/receipt/${r.quote.leadType}/${r.quote.leadId}/${p.id}`} target="_blank">Receipt</Link>}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[18px] border border-border/60 bg-card p-4">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
              <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: '#4FAE3F' }} />Banking details
            </p>
            <dl className="mt-3 space-y-1.5 text-[13px]">
              <div><dt className="text-[11px] text-muted-foreground">Bank</dt><dd>{BANK_DETAILS.bank}</dd></div>
              <div><dt className="text-[11px] text-muted-foreground">Account name</dt><dd>{BANK_DETAILS.accountName}</dd></div>
              <div><dt className="text-[11px] text-muted-foreground">Account number</dt><dd style={MONO}>{BANK_DETAILS.accountNumber}</dd></div>
              <div><dt className="text-[11px] text-muted-foreground">Branch code</dt><dd style={MONO}>{BANK_DETAILS.branchCode}</dd></div>
            </dl>
            <Button size="sm" variant="outline" className="mt-3 h-8 rounded-full text-xs" onClick={copyBank}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy</Button>
            <p className="mt-3 text-[11px] leading-snug text-muted-foreground">Printed on every quotation and invoice with the quote number as the reference. Nobody types these by hand.</p>
          </div>

          <div className="rounded-[18px] border border-border/60 bg-card p-4">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
              <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: '#8A9A96' }} />On every document
            </p>
            <dl className="mt-3 space-y-1.5 text-[13px]">
              <div><dt className="text-[11px] text-muted-foreground">Legal name</dt><dd>{COMPANY.legalName}</dd></div>
              <div><dt className="text-[11px] text-muted-foreground">Trading as</dt><dd>{COMPANY.tradingName}</dd></div>
              <div><dt className="text-[11px] text-muted-foreground">Registration number</dt><dd>{COMPANY.registrationNumber || <span className="text-muted-foreground">Not on file. Add it in companyDetails.ts.</span>}</dd></div>
              <div><dt className="text-[11px] text-muted-foreground">VAT</dt><dd>{VAT_REGISTERED ? `Registered, ${COMPANY.vatNumber}` : <span className="text-muted-foreground">No VAT number on file. Invoices carry no VAT until one is added.</span>}</dd></div>
            </dl>
          </div>
        </aside>
      </div>

      <PaymentDialog record={paying} onOpenChange={(v) => { if (!v) setPaying(null); }} onSaved={load} />
    </div>
  );
};

export default MoneyScreen;
