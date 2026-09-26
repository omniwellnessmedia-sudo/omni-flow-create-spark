import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { BANK_DETAILS, paymentReference } from '@/data/bankDetails';
import { COMPANY } from '@/data/companyDetails';
import { publishedContacts } from '@/data/humanContact';

/**
 * The one template every client facing document prints through.
 *
 * Quotation, invoice and receipt are the same A4 sheet with a different
 * word at the top: the same header, the same "prepared for" and "from"
 * blocks, the same bank details with the reference the client must use,
 * the same terms and the same footer. A change to the company details or
 * the bank account reaches every document at once, and a document that is
 * not built on this shell is a document that will drift.
 *
 * The proposal keeps its own cover, because it is an argument and not a
 * statement of account, but it uses the same pay and terms blocks so the
 * commercial part reads identically.
 *
 * No em dashes in this file.
 */

export const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

export const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-[9.5px] uppercase tracking-[.2em] text-black/60" style={MONO}>{children}</p>
);

/** Where to pay and what to write on the payment. */
export const PayBlock = ({ reference, note }: { reference: string; note?: ReactNode }) => (
  <section className="grid grid-cols-2 gap-8 rounded-[10px] border border-black/30 p-4">
    <div>
      <Eyebrow>How to pay</Eyebrow>
      <dl className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-[12px]">
        <dt className="text-black/60">Bank</dt><dd>{BANK_DETAILS.bank}</dd>
        <dt className="text-black/60">Account name</dt><dd>{BANK_DETAILS.accountName}</dd>
        <dt className="text-black/60">Account number</dt><dd style={MONO}>{BANK_DETAILS.accountNumber}</dd>
        <dt className="text-black/60">Branch code</dt><dd style={MONO}>{BANK_DETAILS.branchCode}</dd>
        <dt className="text-black/60">Reference</dt><dd className="font-medium" style={MONO}>{paymentReference(reference)}</dd>
      </dl>
    </div>
    <div className="text-[11.5px] leading-relaxed text-black/80">
      <p>Please use the reference exactly as shown so the payment can be matched without a phone call.</p>
      {note && <div className="mt-2">{note}</div>}
    </div>
  </section>
);

export const TermsBlock = ({ terms }: { terms: string[] }) => (
  <section>
    <Eyebrow>Terms</Eyebrow>
    <ol className="mt-1.5 list-decimal space-y-0.5 pl-4 text-[10.5px] leading-snug text-black/75">
      {terms.map((t) => <li key={t}>{t}</li>)}
    </ol>
  </section>
);

/** The issuing company. Empty fields render nothing rather than a blank beside a label. */
export const FromBlock = () => {
  const contact = publishedContacts()[0];
  return (
    <div>
      <Eyebrow>From</Eyebrow>
      <p className="mt-1 text-[14px] font-medium">{COMPANY.tradingName}</p>
      <p>{COMPANY.legalName}</p>
      <p>{COMPANY.location}</p>
      <p className="text-black/70">{COMPANY.website}</p>
      <p className="text-black/70">{COMPANY.email}</p>
      {contact && <p className="text-black/70">{contact.name}, {contact.phone}</p>}
      {COMPANY.registrationNumber && <p className="text-black/70" style={MONO}>Reg {COMPANY.registrationNumber}</p>}
      {COMPANY.vatNumber && <p className="text-black/70" style={MONO}>VAT {COMPANY.vatNumber}</p>}
    </div>
  );
};

export const ForBlock = ({ client }: { client: { name: string; org: string | null; email: string | null } }) => (
  <div>
    <Eyebrow>Prepared for</Eyebrow>
    <p className="mt-1 text-[14px] font-medium">{client.name}</p>
    {client.org && client.org !== client.name && <p>{client.org}</p>}
    {client.email && <p className="text-black/70">{client.email}</p>}
  </div>
);

export const PrintStyles = () => (
  <style>{`
    @media print {
      @page { size: A4; margin: 14mm; }
      .sheet-toolbar, .fixed { display: none !important; }
      .sheet-page { box-shadow: none !important; margin: 0 !important; width: auto !important; min-height: 0 !important; padding: 0 !important; }
      .page-break { break-before: page; }
      body { background: #fff !important; }
    }
  `}</style>
);

export const Toolbar = ({ back, actions }: { back: { href: string; label: string }; actions?: ReactNode }) => (
  <div className="sheet-toolbar mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 py-4">
    <Link to={back.href} className="inline-flex min-h-[24px] items-center gap-1.5 text-sm text-neutral-700 hover:text-black">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {back.label}
    </Link>
    <div className="flex gap-2">
      {actions}
      <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">
        <Printer className="h-4 w-4" aria-hidden="true" /> Print or save as PDF
      </button>
    </div>
  </div>
);

/**
 * The sheet itself: header with the document's name and number, the two
 * parties, whatever the document is (children), and the footer.
 */
const DocumentShell = ({
  kind, number, dates, client, back, actions, children, state, missingText,
}: {
  /** "Quotation", "Deposit invoice", "Receipt". */
  kind: string;
  number: string;
  /** Right hand lines under the number: issued, valid until, due. */
  dates: string[];
  client: { name: string; org: string | null; email: string | null };
  back: { href: string; label: string };
  actions?: ReactNode;
  children: ReactNode;
  state?: 'loading' | 'missing' | 'ready';
  missingText?: string;
}) => (
  <div className="min-h-screen bg-neutral-200 text-black">
    <PrintStyles />
    <Toolbar back={back} actions={actions} />
    <main className="sheet-page mx-auto mb-8 w-[210mm] max-w-full bg-white px-[16mm] py-[14mm] text-[12px] leading-relaxed shadow-[0_2px_18px_rgba(0,0,0,.15)]" style={{ minHeight: '297mm' }}>
      {state === 'loading' && <p className="text-neutral-500">Loading.</p>}
      {state === 'missing' && <p className="text-neutral-700">{missingText ?? 'Nothing with that number is on record for this lead.'}</p>}
      {(state ?? 'ready') === 'ready' && (
        <>
          <header className="flex items-start justify-between border-b-2 border-black pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[.24em] text-black/60" style={MONO}>{COMPANY.tradingName}</p>
              <h1 className="mt-1 font-wwpl-display text-[34px] leading-none">{kind}</h1>
            </div>
            <div className="text-right text-[11px]" style={MONO}>
              <p className="text-[14px] font-medium">{number}</p>
              {dates.map((d) => <p key={d} className="mt-0.5">{d}</p>)}
            </div>
          </header>

          <section className="mt-6 grid grid-cols-2 gap-8">
            <ForBlock client={client} />
            <FromBlock />
          </section>

          {children}

          <footer className="mt-10 border-t border-black/20 pt-3 text-[9.5px] text-black/55" style={MONO}>
            {COMPANY.legalName}, trading as {COMPANY.tradingName}. {COMPANY.location}. {COMPANY.website}
          </footer>
        </>
      )}
    </main>
  </div>
);

export default DocumentShell;
