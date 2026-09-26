import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { publishedContacts } from '@/data/humanContact';
import { lineTotal, rand } from '@/lib/quotes';
import { PROPOSAL_ISSUED, coverEmail, proposalOffers, themeById, type Proposal } from '@/lib/proposals';
import { mergeOne } from '@/lib/serviceContent';
import { usePublishedServiceContent } from '@/hooks/useServiceContent';
import { useToast } from '@/hooks/use-toast';
import { PayBlock, TermsBlock } from '@/components/documents/DocumentShell';

/**
 * The proposal as a document: branded, themed, printable to PDF from the
 * browser, and readable on a phone from the link in the cover email.
 *
 * It reads the proposal back out of the lead's activity log by number, so
 * what prints is exactly what was issued. Inclusions come from the rate
 * card, with any published service content on top, the same way the
 * public offer page renders them, so the proposal and the website never
 * describe an offer differently.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;
const INK = '#15201F';

const day = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

const Eyebrow = ({ children, hue }: { children: React.ReactNode; hue: string }) => (
  <p className="flex items-center gap-2 text-[9.5px] uppercase tracking-[.22em] text-black/60" style={MONO}>
    <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
    {children}
  </p>
);

const ProposalPrint = () => {
  const { leadType, leadId, number } = useParams();
  const [proposal, setProposal] = useState<Proposal | null | undefined>(undefined);
  const { rows: published } = usePublishedServiceContent();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!leadType || !leadId || !number) { setProposal(null); return; }
      const { data } = await supabase
        .from('lead_activities')
        .select('payload, created_at')
        .eq('lead_type', leadType)
        .eq('lead_id', leadId)
        .eq('action', PROPOSAL_ISSUED)
        .order('created_at', { ascending: false })
        .limit(50);
      const hit = (data ?? [])
        .map((r) => (r.payload as { proposal?: Proposal } | null)?.proposal)
        .find((p) => p && p.number === number);
      setProposal(hit ?? null);
    };
    load();
  }, [leadType, leadId, number]);

  const theme = themeById(proposal?.theme);
  const contact = publishedContacts()[0];
  const offers = useMemo(() => (proposal ? proposalOffers(proposal) : []), [proposal]);

  const copy = async () => {
    if (!proposal) return;
    const mail = coverEmail(proposal, window.location.href);
    await navigator.clipboard.writeText(`Subject: ${mail.subject}\n\n${mail.body}`);
    toast({ title: 'Cover email copied' });
  };

  return (
    <div className="min-h-screen bg-neutral-200 text-black">
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          .sheet-toolbar, .fixed { display: none !important; }
          .sheet-page { box-shadow: none !important; margin: 0 !important; width: auto !important; min-height: 0 !important; padding: 0 !important; }
          .page-break { break-before: page; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="sheet-toolbar mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/admin-dashboard?section=pipeline" className="inline-flex min-h-[24px] items-center gap-1.5 text-sm text-neutral-700 hover:text-black">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Pipeline
        </Link>
        <div className="flex gap-2">
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-white px-4 py-2.5 text-sm">
            <Copy className="h-4 w-4" aria-hidden="true" /> Copy cover email
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">
            <Printer className="h-4 w-4" aria-hidden="true" /> Print or save as PDF
          </button>
        </div>
      </div>

      <main className="sheet-page mx-auto mb-8 w-[210mm] max-w-full bg-white text-[12px] leading-relaxed shadow-[0_2px_18px_rgba(0,0,0,.15)]" style={{ minHeight: '297mm' }}>
        {proposal === undefined && <p className="p-8 text-neutral-500">Loading the proposal.</p>}
        {proposal === null && <p className="p-8 text-neutral-700">No proposal with that number is on record for this lead.</p>}
        {proposal && (
          <>
            {/* Cover */}
            <section className="px-[16mm] pb-10 pt-[14mm]" style={{ borderTop: `10px solid ${theme.hue}` }}>
              <div className="flex items-start justify-between">
                <p className="text-[10px] uppercase tracking-[.24em] text-black/60" style={MONO}>Omni Wellness Media</p>
                <p className="text-right text-[11px]" style={MONO}>{proposal.number}</p>
              </div>
              <div className="mt-16">
                <Eyebrow hue={theme.hue}>{theme.eyebrow}</Eyebrow>
                <h1 className="mt-4 max-w-[150mm] font-wwpl-display text-[44px] leading-[1.02]" style={{ color: INK }}>{proposal.title}</h1>
                <p className="mt-6 max-w-[140mm] text-[13.5px] leading-relaxed text-black/75">{theme.opening}</p>
              </div>
              <div className="mt-14 grid grid-cols-2 gap-8 border-t border-black/20 pt-5">
                <div>
                  <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>Prepared for</p>
                  <p className="mt-1 text-[14px] font-medium">{proposal.client.name}</p>
                  {proposal.client.org && proposal.client.org !== proposal.client.name && <p>{proposal.client.org}</p>}
                </div>
                <div>
                  <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>From</p>
                  <p className="mt-1 text-[14px] font-medium">Omni Wellness Media</p>
                  <p>Muizenberg, Cape Town</p>
                  <p className="text-black/70">{day(proposal.issuedAt)}. Valid until {day(proposal.validUntil)}.</p>
                </div>
              </div>
            </section>

            {/* Findings */}
            {proposal.findings.length > 0 && (
              <section className="page-break px-[16mm] py-10">
                <Eyebrow hue={theme.hue}>What we noticed</Eyebrow>
                <h2 className="mt-3 font-wwpl-display text-[28px] leading-tight" style={{ color: INK }}>
                  {proposal.findings.length === 1 ? 'One thing' : `${['', 'One', 'Two', 'Three'][proposal.findings.length]} things`} that are costing you customers
                </h2>
                <ol className="mt-6 space-y-5">
                  {proposal.findings.map((f, i) => (
                    <li key={i} className="grid grid-cols-[36px_1fr] gap-4">
                      <span className="font-wwpl-display text-[30px] leading-none" style={{ color: theme.hue }}>{i + 1}</span>
                      <p className="pt-1 text-[13px] leading-relaxed">{f}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 text-[11px] text-black/60">These are what we saw from the outside, written down so they are yours to keep whether or not you go further.</p>
              </section>
            )}

            {/* Offers */}
            <section className={`px-[16mm] py-10 ${proposal.findings.length ? '' : 'page-break'}`}>
              <Eyebrow hue={theme.hue}>What we propose</Eyebrow>
              <div className="mt-4 space-y-6">
                {offers.map(({ line, offer }) => {
                  const merged = line.slug ? mergeOne(line.slug, published) : undefined;
                  const bullets = merged?.bullets ?? offer?.bullets ?? [];
                  const blurb = merged?.blurb ?? offer?.blurb;
                  return (
                    <article key={line.slug ?? line.name} className="rounded-[12px] border border-black/20 p-5" style={{ borderLeft: `4px solid ${offer?.hue ?? theme.hue}` }}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-[16px] font-medium" style={{ color: INK }}>{line.name}{line.qty > 1 ? ` (x${line.qty})` : ''}</h3>
                        <p className="shrink-0 text-[13px]" style={MONO}>{rand(lineTotal(line))}</p>
                      </div>
                      {blurb && <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/75">{blurb}</p>}
                      {bullets.length > 0 && (
                        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11.5px]">
                          {bullets.map((b) => (
                            <li key={b} className="flex gap-2"><span aria-hidden="true" className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: offer?.hue ?? theme.hue }} />{b}</li>
                          ))}
                        </ul>
                      )}
                      {line.fromPrice && <p className="mt-2 text-[10.5px] text-black/60">Priced from the published rate; confirmed here.</p>}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Plan */}
            {proposal.plan.length > 0 && (
              <section className="px-[16mm] py-10">
                <Eyebrow hue={theme.hue}>How it runs</Eyebrow>
                <ol className="mt-4 divide-y divide-black/15">
                  {proposal.plan.map((ph) => (
                    <li key={ph.title} className="grid grid-cols-[120px_1fr] gap-6 py-4">
                      <p className="text-[10.5px] uppercase tracking-[.16em]" style={{ ...MONO, color: ph.hue }}>{ph.when}</p>
                      <div>
                        <p className="text-[14px] font-medium" style={{ color: INK }}>{ph.title}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-black/75">{ph.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                {proposal.notes && (
                  <div className="mt-4 rounded-[10px] bg-neutral-100 p-4">
                    <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>Agreed already</p>
                    <p className="mt-1 whitespace-pre-wrap text-[12px]">{proposal.notes}</p>
                  </div>
                )}
              </section>
            )}

            {/* Investment */}
            <section className="page-break px-[16mm] py-10">
              <Eyebrow hue={theme.hue}>Investment</Eyebrow>
              <table className="mt-4 w-full border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-black text-left text-[9.5px] uppercase tracking-[.16em] text-black/60" style={MONO}>
                    <th className="py-2 font-normal">Item</th>
                    <th className="py-2 text-right font-normal">Unit</th>
                    <th className="py-2 text-right font-normal">Qty</th>
                    <th className="py-2 text-right font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.quote.lines.map((l, i) => (
                    <tr key={i} className="border-b border-black/20">
                      <td className="py-2.5 pr-4">{l.name}</td>
                      <td className="py-2.5 text-right" style={MONO}>{rand(l.unit)}</td>
                      <td className="py-2.5 text-right" style={MONO}>{l.qty}</td>
                      <td className="py-2.5 text-right" style={MONO}>{rand(lineTotal(l))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={3} className="pt-3 text-right">Total</td><td className="pt-3 text-right text-[15px] font-medium" style={MONO}>{rand(proposal.quote.subtotal)}</td></tr>
                  <tr><td colSpan={3} className="pt-1 text-right">To start ({proposal.quote.depositPercent}%)</td><td className="pt-1 text-right font-medium" style={MONO}>{rand(proposal.quote.depositDue)}</td></tr>
                  <tr><td colSpan={3} className="pt-1 text-right text-black/70">Balance before final handover</td><td className="pt-1 text-right text-black/70" style={MONO}>{rand(proposal.quote.balanceDue)}</td></tr>
                </tfoot>
              </table>

              <p className="mt-6 max-w-[150mm] text-[12.5px] leading-relaxed text-black/75">{theme.closing}</p>

              <div className="mt-8">
                <PayBlock
                  reference={proposal.number}
                  note={
                    <>
                      <p>To say yes, reply to the email or send the deposit with this reference and we will schedule the start.</p>
                      {contact && <p className="mt-1">{contact.name}, {contact.phone}. omniwellnessmedia.co.za</p>}
                    </>
                  }
                />
              </div>

              <div className="mt-6">
                <TermsBlock terms={proposal.quote.terms} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProposalPrint;
