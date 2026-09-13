import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { getOffer } from '@/data/publicRateCard';
import { publishedContacts } from '@/data/humanContact';
import { MUIZENBERG_OFFER_SLUGS } from '@/data/muizenberg';
import { useSEO } from '@/lib/seo';

/**
 * The one-page sheet the team fills in by hand before walking into a shop.
 *
 * WHY PAPER. The Muizenberg plan is feet and phones, not features: pick a
 * business, spend five minutes on its website and Google profile, write
 * three specific findings, walk in with the page. A printed sheet with
 * boxes to tick is faster to fill in on a pavement than any form, and the
 * business owner can keep it.
 *
 * WHAT IT CHECKS. Only things a person can verify from a phone in five
 * minutes, phrased so the finding writes itself: "no way to book from the
 * site", "hours on Google are wrong", "last post in March". Nothing here
 * needs a tool, an account or a login.
 *
 * PRICES COME FROM THE RATE CARD. The two offers in the next-step box are
 * read by slug, so a rate change lands on the sheet without anyone editing
 * it. Nothing else on the sheet is a figure.
 *
 * It is an internal tool: no navigation, no footer, no floating dock (the
 * dock hides itself on this path), and it prints to one A4 page. The
 * toolbar at the top is screen only.
 *
 * No em dashes in this file.
 */

const GOOGLE_CHECKS = [
  'Profile exists and is claimed by the business',
  'Opening hours are correct today',
  'Address and map pin land on the right door',
  'Phone number on the profile rings',
  'Photos added in the last three months',
  'Reviews answered (count them: total / replied)',
];

const WEBSITE_CHECKS = [
  'Has a website at all (write the address below)',
  'Loads on a phone without waiting',
  'Says what it does and where it is before scrolling',
  'A visible way to call, book or buy on the first screen',
  'Prices, or a clear way to ask for them',
  'Readable on a phone without pinching',
];

const SOCIAL_ROWS = ['Instagram', 'Facebook', 'TikTok', 'WhatsApp Business'];

const Box = () => (
  <span
    aria-hidden="true"
    className="inline-block h-[13px] w-[13px] flex-none border border-black align-middle"
  />
);

const Line = ({ label, flex = 1 }: { label: string; flex?: number }) => (
  <div className="flex items-end gap-1.5" style={{ flex }}>
    <span className="text-[9.5px] uppercase tracking-[.12em] text-black/60">{label}</span>
    <span aria-hidden="true" className="h-[14px] flex-1 border-b border-black" />
  </div>
);

const MuizenbergAuditSheet = () => {
  useSEO({
    title: 'Muizenberg visibility check sheet | Omni Wellness Media',
    description: 'Printable one-page check sheet for the Muizenberg three-findings visit.',
    canonical: 'https://omniwellnessmedia.co.za/muizenberg/audit-sheet',
  });

  const offers = MUIZENBERG_OFFER_SLUGS.map((slug) => getOffer(slug)).filter(
    (o): o is NonNullable<typeof o> => Boolean(o)
  );
  const contact = publishedContacts()[0];

  return (
    <div className="min-h-screen bg-neutral-200 text-black">
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          .sheet-toolbar { display: none !important; }
          /* Site-wide floating widgets (accessibility gear, cookie bar) would print too. */
          .fixed { display: none !important; }
          .sheet-page { box-shadow: none !important; margin: 0 !important; width: auto !important; min-height: 0 !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="sheet-toolbar mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/muizenberg" className="inline-flex min-h-[24px] items-center gap-1.5 text-sm text-neutral-700 hover:text-black">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Muizenberg page
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          <Printer className="h-4 w-4" aria-hidden="true" /> Print this sheet
        </button>
      </div>

      <main
        className="sheet-page mx-auto mb-8 w-[210mm] max-w-full bg-white px-[10mm] py-[9mm] text-[11px] leading-snug shadow-[0_2px_18px_rgba(0,0,0,.15)]"
        style={{ minHeight: '277mm' }}
      >
        {/* Header */}
        <header className="flex items-start justify-between border-b-2 border-black pb-2.5">
          <div>
            <p className="text-[9px] uppercase tracking-[.22em] text-black/60">Omni Wellness Media, Muizenberg</p>
            <h1 className="mt-0.5 text-[20px] font-semibold leading-none">Visibility check</h1>
          </div>
          <p className="max-w-[62mm] text-right text-[9.5px] leading-snug text-black/70">
            Three findings, written down, yours to keep. Whether or not you hire us.
          </p>
        </header>

        {/* Who */}
        <section className="mt-3 space-y-2">
          <div className="flex gap-4">
            <Line label="Business" flex={2} />
            <Line label="Owner or contact" flex={1.4} />
          </div>
          <div className="flex gap-4">
            <Line label="Phone or WhatsApp" flex={1.3} />
            <Line label="Date" flex={0.7} />
            <Line label="Checked by" flex={1} />
          </div>
        </section>

        {/* Checks */}
        <section className="mt-4 grid grid-cols-2 gap-x-6">
          <div>
            <h2 className="border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[.16em]">
              A. Google Business profile
            </h2>
            <ul className="mt-1.5 space-y-[5px]">
              {GOOGLE_CHECKS.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <Box />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-4">
              <Line label="Reviews" flex={1} />
              <Line label="Replied" flex={1} />
            </div>
          </div>
          <div>
            <h2 className="border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[.16em]">
              B. Website
            </h2>
            <ul className="mt-1.5 space-y-[5px]">
              {WEBSITE_CHECKS.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <Box />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <Line label="Address" />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="mt-4">
          <h2 className="border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[.16em]">
            C. Social pages
          </h2>
          <table className="mt-1.5 w-full border-collapse">
            <thead>
              <tr className="text-left text-[9px] uppercase tracking-[.12em] text-black/60">
                <th className="w-[34mm] py-0.5 font-normal">Platform</th>
                <th className="w-[16mm] py-0.5 font-normal">Has one</th>
                <th className="py-0.5 font-normal">Last post</th>
                <th className="py-0.5 font-normal">What we noticed</th>
              </tr>
            </thead>
            <tbody>
              {SOCIAL_ROWS.map((s) => (
                <tr key={s} className="border-t border-black/30">
                  <td className="py-[5px]">{s}</td>
                  <td className="py-[5px]"><Box /></td>
                  <td className="py-[5px]"><span aria-hidden="true" className="block h-[12px] w-[22mm] border-b border-black/60" /></td>
                  <td className="py-[5px]"><span aria-hidden="true" className="block h-[12px] border-b border-black/60" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Findings */}
        <section className="mt-4">
          <h2 className="border-b-2 border-black pb-1 text-[10px] font-semibold uppercase tracking-[.16em]">
            D. The three findings
          </h2>
          <ol className="mt-2 space-y-2.5">
            {[1, 2, 3].map((n) => (
              <li key={n} className="grid grid-cols-[8mm_1fr_1fr_1fr] gap-x-3 border border-black/40 p-2">
                <span className="text-[18px] font-semibold leading-none">{n}</span>
                {['What we saw', 'Why it costs you customers', 'The fix'].map((h) => (
                  <div key={h}>
                    <p className="text-[8.5px] uppercase tracking-[.12em] text-black/60">{h}</p>
                    <div aria-hidden="true" className="mt-1 space-y-[9px]">
                      <span className="block border-b border-black/40" />
                      <span className="block border-b border-black/40" />
                      <span className="block border-b border-black/40" />
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ol>
        </section>

        {/* Next step */}
        <section className="mt-4 grid grid-cols-[1.3fr_1fr] gap-x-6">
          <div>
            <h2 className="border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[.16em]">
              E. Suggested next step
            </h2>
            <ul className="mt-1.5 space-y-[5px]">
              {offers.map((o) => (
                <li key={o.slug} className="flex items-start gap-2">
                  <Box />
                  <span>
                    <span className="font-medium">{o.name}</span>, {o.price}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-2"><Box /><span>Something bigger, quote needed (say what)</span></li>
              <li className="flex items-start gap-2"><Box /><span>Nothing right now, check back on the date below</span></li>
            </ul>
          </div>
          <div className="space-y-3 pt-1">
            <Line label="Follow up on" />
            <Line label="Owner's preferred contact" />
            <Line label="Notes" />
            <span aria-hidden="true" className="block h-[14px] border-b border-black" />
          </div>
        </section>

        <footer className="mt-4 flex items-end justify-between border-t border-black pt-2 text-[9px] text-black/70">
          <p>
            Rates as published at omniwellnessmedia.co.za/services. No payment is taken on a visit.
          </p>
          {contact && (
            <p className="text-right">
              {contact.name}, {contact.phone}
            </p>
          )}
        </footer>
      </main>
    </div>
  );
};

export default MuizenbergAuditSheet;
