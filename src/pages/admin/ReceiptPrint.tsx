import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { ActivityRow } from '@/lib/clients';
import { PAYMENT_RECEIVED, PROPOSAL_ISSUED_ACTION, QUOTE_ISSUED, quotesFromActivities, rand } from '@/lib/quotes';
import { receiptFor, type Receipt } from '@/lib/invoices';
import DocumentShell, { Eyebrow, MONO, day } from '@/components/documents/DocumentShell';

/**
 * A receipt for one recorded payment, on the shared template.
 *
 * It rebuilds the quotation's record from the lead's activity log so it
 * can say not only what arrived but what has been paid to date and what
 * is still owed, which is the question the client actually has.
 *
 * No em dashes in this file.
 */

const ReceiptPrint = () => {
  const { leadType, leadId, activityId } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      if (!leadType || !leadId || !activityId) { setReceipt(null); return; }
      const { data } = await supabase
        .from('lead_activities')
        .select('*')
        .eq('lead_type', leadType)
        .eq('lead_id', leadId)
        .in('action', [QUOTE_ISSUED, PROPOSAL_ISSUED_ACTION, PAYMENT_RECEIVED])
        .order('created_at', { ascending: false })
        .limit(200);
      const records = quotesFromActivities((data ?? []) as unknown as ActivityRow[]);
      const hit = records.map((r) => receiptFor(r, activityId)).find((r) => r !== null) ?? null;
      setReceipt(hit);
    };
    load();
  }, [leadType, leadId, activityId]);

  const empty = { name: '', org: null, email: null };

  return (
    <DocumentShell
      kind="Receipt"
      number={receipt?.number ?? ''}
      dates={receipt ? [`Received ${day(receipt.payment.at)}`] : []}
      client={receipt?.quote.client ?? empty}
      back={{ href: '/admin-dashboard?section=money', label: 'Quotes and payments' }}
      state={receipt === undefined ? 'loading' : receipt === null ? 'missing' : 'ready'}
      missingText="No payment with that id is on record for this lead."
    >
      {receipt && (
        <>
          <section className="mt-8 rounded-[10px] border border-black/30 p-5">
            <Eyebrow>Received with thanks</Eyebrow>
            <p className="mt-2 font-wwpl-display text-[40px] leading-none" style={MONO}>{rand(receipt.payment.amount)}</p>
            <p className="mt-2 text-[12px] text-black/75">
              By {receipt.payment.method} on {day(receipt.payment.at)}, against quotation <span style={MONO}>{receipt.quote.number}</span>.
            </p>
          </section>

          <table className="mt-6 w-full border-collapse text-[12px]">
            <tbody>
              <tr className="border-b border-black/20"><td className="py-2 text-black/70">Quotation total</td><td className="py-2 text-right" style={MONO}>{rand(receipt.quote.subtotal)}</td></tr>
              <tr className="border-b border-black/20"><td className="py-2 text-black/70">Paid to date, including this payment</td><td className="py-2 text-right" style={MONO}>{rand(receipt.paidToDate)}</td></tr>
              <tr><td className="py-2 font-medium">Still owed</td><td className="py-2 text-right font-medium" style={MONO}>{rand(receipt.remaining)}</td></tr>
            </tbody>
          </table>

          <section className="mt-6">
            <Eyebrow>For</Eyebrow>
            <ul className="mt-1 list-disc pl-4 text-[12px]">
              {receipt.quote.lines.map((l, i) => <li key={i}>{l.name}{l.qty > 1 ? ` (x${l.qty})` : ''}</li>)}
            </ul>
          </section>

          <p className="mt-8 text-[11px] text-black/60">
            {receipt.remaining > 0
              ? `The balance of ${rand(receipt.remaining)} is due before final handover, with ${receipt.quote.number} as reference.`
              : 'This quotation is paid in full. Thank you.'}
          </p>
        </>
      )}
    </DocumentShell>
  );
};

export default ReceiptPrint;
