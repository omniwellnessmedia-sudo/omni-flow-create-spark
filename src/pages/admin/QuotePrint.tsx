import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { QUOTE_ISSUED, lineTotal, rand, type Quote } from '@/lib/quotes';
import DocumentShell, { Eyebrow, MONO, PayBlock, TermsBlock, day } from '@/components/documents/DocumentShell';

/**
 * The quotation as a document, on the shared template.
 *
 * It reads the quote back out of the lead's activity log by number, so
 * what prints is exactly what was issued.
 *
 * No em dashes in this file.
 */

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

  const empty = { name: '', org: null, email: null };

  return (
    <DocumentShell
      kind="Quotation"
      number={quote?.number ?? number ?? ''}
      dates={quote ? [`Issued ${day(quote.issuedAt)}`, `Valid until ${day(quote.validUntil)}`] : []}
      client={quote?.client ?? empty}
      back={{ href: '/admin-dashboard?section=money', label: 'Quotes and payments' }}
      state={quote === undefined ? 'loading' : quote === null ? 'missing' : 'ready'}
      missingText="No quotation with that number is on record for this lead."
    >
      {quote && (
        <>
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
              <tr><td colSpan={3} className="pt-3 text-right">Total</td><td className="pt-3 text-right text-[14px] font-medium" style={MONO}>{rand(quote.subtotal)}</td></tr>
              <tr><td colSpan={3} className="pt-1 text-right">Deposit due now ({quote.depositPercent}%)</td><td className="pt-1 text-right font-medium" style={MONO}>{rand(quote.depositDue)}</td></tr>
              <tr><td colSpan={3} className="pt-1 text-right text-black/70">Balance before final handover</td><td className="pt-1 text-right text-black/70" style={MONO}>{rand(quote.balanceDue)}</td></tr>
            </tfoot>
          </table>

          {quote.notes && (
            <section className="mt-6">
              <Eyebrow>Scope and notes</Eyebrow>
              <p className="mt-1 whitespace-pre-wrap">{quote.notes}</p>
            </section>
          )}

          <div className="mt-6">
            <PayBlock reference={quote.number} note={<p>Work is scheduled once the deposit reflects. Scope is agreed in writing before anything starts.</p>} />
          </div>

          <div className="mt-6">
            <TermsBlock terms={quote.terms} />
          </div>
        </>
      )}
    </DocumentShell>
  );
};

export default QuotePrint;
