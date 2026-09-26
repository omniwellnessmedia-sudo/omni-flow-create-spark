import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lineTotal, rand } from '@/lib/quotes';
import { INVOICE_ISSUED, KIND_LABEL, dueLine, type Invoice } from '@/lib/invoices';
import { VAT_REGISTERED } from '@/data/companyDetails';
import DocumentShell, { MONO, PayBlock, TermsBlock, day } from '@/components/documents/DocumentShell';

/**
 * An invoice as a document, on the shared template.
 *
 * The client pays with the quotation number as reference, which is what
 * the Money screen matches the payment on. The word "Tax invoice" appears
 * only when the company carries a VAT number; see companyDetails.ts.
 *
 * No em dashes in this file.
 */

const InvoicePrint = () => {
  const { leadType, leadId, number } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!leadType || !leadId || !number) { setInvoice(null); return; }
      const { data } = await supabase
        .from('lead_activities')
        .select('payload, created_at')
        .eq('lead_type', leadType)
        .eq('lead_id', leadId)
        .eq('action', INVOICE_ISSUED)
        .order('created_at', { ascending: false })
        .limit(50);
      const hit = (data ?? [])
        .map((r) => (r.payload as { invoice?: Invoice } | null)?.invoice)
        .find((i) => i && i.number === number);
      setInvoice(hit ?? null);
    };
    load();
  }, [leadType, leadId, number]);

  const empty = { name: '', org: null, email: null };
  const kind = invoice ? (VAT_REGISTERED ? `Tax ${KIND_LABEL[invoice.kind].toLowerCase()}` : KIND_LABEL[invoice.kind]) : 'Invoice';

  return (
    <DocumentShell
      kind={kind.charAt(0).toUpperCase() + kind.slice(1)}
      number={invoice?.number ?? number ?? ''}
      dates={invoice ? [`Issued ${day(invoice.issuedAt)}`, invoice.kind === 'deposit' ? 'Due on receipt' : `Due ${day(invoice.dueAt)}`] : []}
      client={invoice?.client ?? empty}
      back={{ href: '/admin-dashboard?section=money', label: 'Quotes and payments' }}
      state={invoice === undefined ? 'loading' : invoice === null ? 'missing' : 'ready'}
      missingText="No invoice with that number is on record for this lead."
    >
      {invoice && (
        <>
          <table className="mt-8 w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-black text-left text-[9.5px] uppercase tracking-[.16em] text-black/60" style={MONO}>
                <th className="py-2 font-normal">Description</th>
                <th className="py-2 pl-4 text-right font-normal">Unit</th>
                <th className="py-2 pl-4 text-right font-normal">Qty</th>
                <th className="py-2 pl-4 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((l, i) => (
                <tr key={i} className="border-b border-black/20">
                  <td className="py-2.5 pr-4">{l.name}</td>
                  <td className="py-2.5 text-right" style={MONO}>{rand(l.unit)}</td>
                  <td className="py-2.5 text-right" style={MONO}>{l.qty}</td>
                  <td className="py-2.5 text-right" style={MONO}>{rand(lineTotal(l))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {invoice.vatPercent > 0 && (
                <>
                  <tr><td colSpan={3} className="pt-3 text-right text-black/70">Subtotal</td><td className="pt-3 text-right text-black/70" style={MONO}>{rand(invoice.subtotal)}</td></tr>
                  <tr><td colSpan={3} className="pt-1 text-right text-black/70">VAT ({invoice.vatPercent}%)</td><td className="pt-1 text-right text-black/70" style={MONO}>{rand(invoice.vat)}</td></tr>
                </>
              )}
              <tr><td colSpan={3} className="pt-3 pr-4 text-right text-[13px]">Amount due</td><td className="pt-3 text-right text-[16px] font-medium" style={MONO}>{rand(invoice.total)}</td></tr>
            </tfoot>
          </table>

          <p className="mt-4 text-[12.5px] font-medium">{dueLine(invoice)}.</p>
          <p className="mt-1 text-[11.5px] text-black/70">
            {invoice.kind === 'deposit' && 'Work is scheduled once this deposit reflects.'}
            {invoice.kind === 'balance' && 'Final handover follows once this balance reflects.'}
            {invoice.kind === 'full' && 'This invoice covers the whole of the quotation it refers to.'}
            {' '}Reference quotation {invoice.quoteNumber}.
          </p>

          <div className="mt-6">
            <PayBlock reference={invoice.quoteNumber} note={<p>The reference is the quotation number, the same one for the deposit and the balance, so both payments match one job.</p>} />
          </div>

          <div className="mt-6">
            <TermsBlock terms={invoice.terms} />
          </div>
        </>
      )}
    </DocumentShell>
  );
};

export default InvoicePrint;
