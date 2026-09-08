import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSEO } from '@/lib/seo';
import {
  SERVICE_BANDS,
  getOffer,
  getBandForOffer,
  RATE_CARD_TERMS,
} from '@/data/publicRateCard';
import { INK, SLATE, CREAM, LINE, mono, SpectrumRule, WhatsappButton } from '@/components/services/spectrum';
import TalkToAHuman from '@/components/services/TalkToAHuman';

/**
 * The enquiry form the service pages point at.
 *
 * WHY THIS EXISTS ALONGSIDE /contact. /contact offers eight coarse
 * categories that do not match the rate card, so an enquiry about the
 * Revenue Ready Sprint arrived labelled "business-development" and
 * somebody had to work out what was actually wanted. This form is
 * addressed by offer slug, so the lead names the exact offer and lands in
 * the same service_quotes table Admin Leads already reads. One lead list,
 * not two.
 *
 * NO PAYMENT IS TAKEN HERE, deliberately. These are scoped engagements
 * that need a conversation before a number, and a checkout on a page that
 * cannot yet tell you what you are buying would be worse than none.
 *
 * WHAT THE QUERY STRING MAY SAY. ?s= is validated against the rate card:
 * an unknown slug selects nothing rather than rendering a service name
 * the site does not sell. ?a= is free context, sanitised and shown back in
 * an editable field, never rendered as a claim about the person.
 *
 * PRICES. Read from publicRateCard.ts through getOffer, never written
 * here. This page displays the approved string as it stands.
 *
 * No em dashes in this file.
 */

const BUDGETS = [
  'Not sure yet',
  'Under R5,000',
  'R5,000 to R15,000',
  'R15,000 to R50,000',
  'Over R50,000',
];

const TIMELINES = [
  'As soon as possible',
  'Within a month',
  'One to three months',
  'Later than that',
  'Still deciding',
];

type Status =
  | { kind: 'editing' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'failed'; reason: string };

const Enquire = () => {
  const [params] = useSearchParams();
  const requestedSlug = params.get('s') ?? '';
  const context = (params.get('a') ?? '').replace(/[<>]/g, '').trim().slice(0, 120);

  // An unknown slug selects nothing. Echoing it back would put a service
  // name on the page that the rate card does not carry.
  const knownOffer = getOffer(requestedSlug);

  const [serviceSlug, setServiceSlug] = useState(knownOffer?.slug ?? '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [details, setDetails] = useState(context ? `Context: ${context}\n\n` : '');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'editing' });
  const [touched, setTouched] = useState(false);

  const doneRef = useRef<HTMLDivElement | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  const offer = getOffer(serviceSlug);
  const band = getBandForOffer(serviceSlug);
  const hue = offer?.hue || band?.hue || INK;

  useSEO({
    title: offer
      ? `Enquire about ${offer.name} | Omni Wellness Media`
      : 'Enquire | Omni Wellness Media',
    description:
      'Tell us what you need and we will come back with scope and a price. No payment is taken on this form.',
    canonical: 'https://omniwellnessmedia.co.za/enquire',
  });

  const problems = useMemo(() => {
    const list: string[] = [];
    if (!name.trim()) list.push('Your name');
    if (!email.trim()) list.push('Your email address');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) list.push('A valid email address');
    if (!serviceSlug) list.push('Which service this is about');
    if (details.trim().length < 10) list.push('A sentence or two about what you need');
    return list;
  }, [name, email, serviceSlug, details]);

  // Move focus to whichever panel replaced the form, so a screen reader is
  // told the outcome rather than left on a button that is now gone.
  useEffect(() => {
    if (status.kind === 'sent') doneRef.current?.focus();
    if (status.kind === 'failed') errorRef.current?.focus();
  }, [status.kind]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (problems.length > 0 || status.kind === 'sending') return;

    setStatus({ kind: 'sending' });

    const { data, error } = await supabase.functions.invoke('submit-service-quote', {
      body: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        company: company.trim() || null,
        // The exact offer, so the lead does not have to be decoded.
        service_type: offer ? `${offer.name} (${offer.slug})` : serviceSlug,
        project_details: details.trim(),
        budget_range: budget || null,
        timeline: timeline || null,
      },
    });

    if (error) {
      setStatus({ kind: 'failed', reason: error.message });
      return;
    }

    // The function answers 200 with { error } on a validation refusal, so a
    // missing transport error is not the same as a saved enquiry.
    const returned = (data ?? {}) as { success?: boolean; error?: string };
    if (returned.error || !returned.success) {
      setStatus({ kind: 'failed', reason: returned.error ?? 'The enquiry was not saved.' });
      return;
    }

    setStatus({ kind: 'sent' });
  };

  const field =
    'mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-offset-1';

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: CREAM }}>
        <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services and rates
          </Link>

          <header className="mt-8">
            <p
              className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em]"
              style={{ ...mono, color: SLATE }}
            >
              <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
              Enquiry
            </p>
            <h1 className="mt-3 font-wwpl-display text-4xl leading-[1.08] md:text-[48px]" style={{ color: INK }}>
              {offer ? `About the ${offer.name}` : 'Tell us what you need'}
            </h1>
            {offer && (
              <p className="mt-3 text-[13px] uppercase tracking-[.14em]" style={{ ...mono, color: hue }}>
                {offer.price}
              </p>
            )}
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed" style={{ color: SLATE }}>
              Send this and we will come back with scope, a price and what we need from
              you. No payment is taken on this form.
            </p>
            <SpectrumRule className="mt-6 max-w-[220px]" />
          </header>

          {status.kind === 'sent' ? (
            <div
              ref={doneRef}
              tabIndex={-1}
              className="mt-10 rounded-2xl border bg-white p-8 outline-none"
              style={{ borderColor: LINE }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Check className="h-7 w-7 text-green-700" />
              </div>
              <h2 className="text-center font-wwpl-display text-2xl" style={{ color: INK }}>
                That is with us
              </h2>
              <p className="mt-3 text-center text-[15px] leading-relaxed" style={{ color: SLATE }}>
                We read every enquiry ourselves. You will get a reply at{' '}
                <strong>{email.trim()}</strong>, usually within two working days.
                Nothing has been charged.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium text-white"
                  style={{ background: INK }}
                >
                  Back to services <ArrowRight className="h-4 w-4" />
                </Link>
                <WhatsappButton
                  source="enquire_confirmation"
                  prefill={
                    offer
                      ? `Hi, I have just sent an enquiry about the ${offer.name}.`
                      : 'Hi, I have just sent an enquiry through your site.'
                  }
                  icon={<MessageCircle className="h-4 w-4" />}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px] font-medium"
                  style={{ borderColor: LINE, color: INK }}
                />
              </div>

              <TalkToAHuman compact className="mt-8 text-left" />
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-10 space-y-6">
              {status.kind === 'failed' && (
                <div
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 outline-none"
                >
                  <p className="flex items-start gap-2 text-sm font-medium text-red-900">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
                    Your enquiry was not sent, so nothing has reached us yet.
                  </p>
                  <p className="mt-2 text-xs text-red-800">{status.reason}</p>
                  <p className="mt-2 text-xs text-red-800">
                    Your answers are still here. Press send again, or email{' '}
                    <a className="underline" href="mailto:hello@omniwellnessmedia.com">
                      hello@omniwellnessmedia.com
                    </a>
                    .
                  </p>
                </div>
              )}

              {touched && problems.length > 0 && (
                <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900">
                    Still needed before this can be sent:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-900">
                    {problems.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label htmlFor="service" className="text-sm font-medium" style={{ color: INK }}>
                  Which service <span aria-hidden="true">*</span>
                  <span className="sr-only">required</span>
                </label>
                <select
                  id="service"
                  required
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                  className={field}
                  style={{ borderColor: LINE }}
                >
                  <option value="">Choose a service</option>
                  {SERVICE_BANDS.map((b) => (
                    <optgroup key={b.id} label={b.heading}>
                      {b.offers.map((o) => (
                        <option key={o.slug} value={o.slug}>
                          {o.name} ({o.price})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {requestedSlug && !knownOffer && (
                  <p className="mt-2 text-xs" style={{ color: SLATE }}>
                    We could not match the service in your link, so please pick one above.
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium" style={{ color: INK }}>
                    Your name <span aria-hidden="true">*</span>
                    <span className="sr-only">required</span>
                  </label>
                  <input
                    id="name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                    style={{ borderColor: LINE }}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium" style={{ color: INK }}>
                    Email <span aria-hidden="true">*</span>
                    <span className="sr-only">required</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                    style={{ borderColor: LINE }}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium" style={{ color: INK }}>
                    Phone <span style={{ color: SLATE }}>(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={field}
                    style={{ borderColor: LINE }}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="text-sm font-medium" style={{ color: INK }}>
                    Organisation <span style={{ color: SLATE }}>(optional)</span>
                  </label>
                  <input
                    id="company"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={field}
                    style={{ borderColor: LINE }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="details" className="text-sm font-medium" style={{ color: INK }}>
                  What do you need <span aria-hidden="true">*</span>
                  <span className="sr-only">required</span>
                </label>
                <textarea
                  id="details"
                  required
                  rows={6}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What you are trying to achieve, anything already in place, and anything fixed like a date or a budget."
                  className={field}
                  style={{ borderColor: LINE }}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="budget" className="text-sm font-medium" style={{ color: INK }}>
                    Budget <span style={{ color: SLATE }}>(optional)</span>
                  </label>
                  <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={field}
                    style={{ borderColor: LINE }}
                  >
                    <option value="">Prefer not to say</option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className="text-sm font-medium" style={{ color: INK }}>
                    Timing <span style={{ color: SLATE }}>(optional)</span>
                  </label>
                  <select
                    id="timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className={field}
                    style={{ borderColor: LINE }}
                  >
                    <option value="">Prefer not to say</option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status.kind === 'sending'}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium text-white disabled:opacity-60"
                  style={{ background: INK }}
                >
                  {status.kind === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send enquiry <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <WhatsappButton
                  source="enquire_form"
                  prefill={
                    offer
                      ? `Hi, I would like to ask about the ${offer.name}.`
                      : 'Hi, I would like to ask about your services.'
                  }
                  icon={<MessageCircle className="h-4 w-4" />}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[15px]"
                  style={{ borderColor: LINE, color: INK }}
                />
              </div>

              <p className="text-xs leading-relaxed" style={{ color: SLATE }}>
                We use what you send here to answer your enquiry and nothing else. It
                does not subscribe you to anything. See our{' '}
                <Link to="/privacy-policy" className="underline">
                  privacy policy
                </Link>
                .
              </p>
            </form>
          )}

          <TalkToAHuman className="mt-12" />

          <section className="mt-8 rounded-2xl border bg-white p-6" style={{ borderColor: LINE }}>
            <h2 className="text-[11px] uppercase tracking-[.2em]" style={{ ...mono, color: SLATE }}>
              Terms that apply
            </h2>
            <ul className="mt-4 space-y-2">
              {RATE_CARD_TERMS.map((t) => (
                <li key={t} className="text-[13.5px] leading-relaxed" style={{ color: SLATE }}>
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Enquire;
