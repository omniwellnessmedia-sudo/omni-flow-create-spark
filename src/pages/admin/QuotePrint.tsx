import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BANK_DETAILS, paymentReference } from '@/data/bankDetails';
import { QUOTE_ISSUED, lineTotal, rand, type Quote } from '@/lib/quotes';
import { publishedContacts } from '@/data/humanContact';

/**
 * The quotation as a document: one A4 page a client can be sent, printed
 * or saved as a PDF from the browser.
 *
 * It reads the quote back out of the lead's activity log by number, so
 * what prints is exactly what was issued, and it carries the confirmed
 * banking details with the quote number as the payment reference so a
 * deposit can be matched without a phone call.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const day = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

const QuotePrint = () => {
  const { leadType, leadId, number } = useParams();
  const [quote, setQuote] = useState<Quote | null | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!leadType || !leadId || !number) { setQuote(null); return; }
      const { data } = await supabase
        .from('lead_activities')
        .select('payload, created_at')
        .eq('lead_type', leadType)
        .eq('lead_id', leadId)
        .eq('action', QUOTE_ISSUED)
        .order('created_at', { ascending: false })
        .limit(50);
      const hit = (data ?? [])
        .map((r) => (r.payload as { quote?: Quote } | null)?.quote)
        .find((q) => q && q.number === number);
      setQuote(hit ?? null);
    };
    load();
  }, [leadType, leadId, number]);

  const contact = publishedContacts()[0];

  return (
    <div className="min-h-screen bg-neutral-200 text-black">
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          .sheet-toolbar, .fixed { display: none !important; }
          .sheet-page { box-shadow: none !important; margin: 0 !important; width: auto !important; min-height: 0 !important; padding: 0 !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="sheet-toolbar mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/admin-dashboard?section=money" className="inline-flex min-h-[24px] items-center gap-1.5 text-sm text-neutral-700 hover:text-black">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Quotes and payments
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">
          <Printer className="h-4 w-4" aria-hidden="true" /> Print or save as PDF
        </button>
      </div>

      <main className="sheet-page mx-auto mb-8 w-[210mm] max-w-full bg-white px-[16mm] py-[14mm] text-[12px] leading-relaxed shadow-[0_2px_18px_rgba(0,0,0,.15)]" style={{ minHeight: '297mm' }}>
        {quote === undefined && <p className="text-neutral-500">Loading the quotation.</p>}
        {quote === null && <p className="text-neutral-700">No quotation with that number is on record for this lead.</p>}
        {quote && (
          <>
            <header className="flex items-start justify-between border-b-2 border-black pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[.24em] text-black/60" style={MONO}>Omni Wellness Media</p>
                <h1 className="mt-1 font-wwpl-display text-[34px] leading-none">Quotation</h1>
              </div>
              <div className="text-right text-[11px]" style={MONO}>
                <p className="text-[14px] font-medium">{quote.number}</p>
                <p className="mt-1">Issued {day(quote.issuedAt)}</p>
                <p>Valid until {day(quote.validUntil)}</p>
              </div>
            </header>

            <section className="mt-6 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>Prepared for</p>
                <p className="mt-1 text-[14px] font-medium">{quote.client.name}</p>
                {quote.client.org && quote.client.org !== quote.client.name && <p>{quote.client.org}</p>}
                {quote.client.email && <p className="text-black/70">{quote.client.email}</p>}
              </div>
              <div>
                <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>From</p>
                <p className="mt-1 text-[14px] font-medium">Omni Wellness Media</p>
                <p>Muizenberg, Cape Town</p>
                <p className="text-black/70">omniwellnessmedia.co.za</p>
                {contact && <p className="text-black/70">{contact.name}, {contact.phone}</p>}
              </div>
            </section>

            <table className="mt-8 w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-black text-left text-[9.5px] uppercase tracking-[.16em] text-black/60" style={MONO}>
                  <th className="py-2 font-normal">Item</th>
                  <th className="py-2 text-right font-normal">Unit</th>
                  <th className="py-2 text-right font-normal">Qty</th>
                  <th className="py-2 text-right font-normal">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.lines.map((l, i) => (
                  <tr key={i} className="border-b border-black/20">
                    <td className="py-2.5 pr-4">{l.name}{l.fromPrice ? <span className="block text-[10.5px] text-black/60">Priced from the published rate; confirmed here.</span> : null}</td>
                    <td className="py-2.5 text-right" style={MONO}>{rand(l.unit)}</td>
                    <td className="py-2.5 text-right" style={MONO}>{l.qty}</td>
                    <td className="py-2.5 text-right" style={MONO}>{rand(lineTotal(l))}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-3 text-right">Total</td>
                  <td className="pt-3 text-right text-[14px] font-medium" style={MONO}>{rand(quote.subtotal)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="pt-1 text-right">Deposit due now ({quote.depositPercent}%)</td>
                  <td className="pt-1 text-right font-medium" style={MONO}>{rand(quote.depositDue)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="pt-1 text-right text-black/70">Balance before final handover</td>
                  <td className="pt-1 text-right text-black/70" style={MONO}>{rand(quote.balanceDue)}</td>
                </tr>
              </tfoot>
            </table>

            {quote.notes && (
              <section className="mt-6">
                <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>Scope and notes</p>
                <p className="mt-1 whitespace-pre-wrap">{quote.notes}</p>
              </section>
            )}

            <section className="mt-6 grid grid-cols-2 gap-8 rounded-[10px] border border-black/30 p-4">
              <div>
                <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>How to pay</p>
                <dl className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-[12px]">
                  <dt className="text-black/60">Bank</dt><dd>{BANK_DETAILS.bank}</dd>
                  <dt className="text-black/60">Account name</dt><dd>{BANK_DETAILS.accountName}</dd>
                  <dt className="text-black/60">Account number</dt><dd style={MONO}>{BANK_DETAILS.accountNumber}</dd>
                  <dt className="text-black/60">Branch code</dt><dd style={MONO}>{BANK_DETAILS.branchCode}</dd>
                  <dt className="text-black/60">Reference</dt><dd className="font-medium" style={MONO}>{paymentReference(quote.number)}</dd>
                </dl>
              </div>
              <div className="text-[11.5px] leading-relaxed text-black/80">
                <p>Please use the reference exactly as shown so the payment can be matched to this quotation.</p>
                <p className="mt-2">Work is scheduled once the deposit reflects. Scope is agreed in writing before anything starts.</p>
              </div>
            </section>

            <section className="mt-6">
              <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>Terms</p>
              <ol className="mt-1.5 list-decimal space-y-0.5 pl-4 text-[10.5px] leading-snug text-black/75">
                {quote.terms.map((t) => <li key={t}>{t}</li>)}
              </ol>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default QuotePrint;
