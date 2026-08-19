import { useState } from 'react';
import { useSEO } from '@/lib/seo';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Check, Film, HandCoins, Megaphone, Store, ArrowRight, Loader2, ShieldCheck,
  Clapperboard, Ticket, Award, Globe, Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackAdsConversion } from '@/lib/googleAds';
import { trackLead } from '@/lib/socialPixels';

/**
 * Impact Screenings: the screening-as-a-service offering.
 *
 * COPY RULES (set by the production copy correction of 15 Aug 2026, which
 * followed the team minutes of 14 Aug 2026). These are commercial claims on a
 * sales page quoting engagements up to R25,000, so they are governed:
 *
 *   1. ONLY these figures may appear as proof of the 10 Aug 2026 event.
 *      Source: official Quicket Event Statements and tax invoices,
 *      event 386047, issued 12 Aug 2026.
 *
 *        306        issued session admissions
 *        58         paid session admissions (53 online, 5 box office)
 *        248        complimentary session admissions
 *        R7,900.16  gross ticket sales
 *        37         women honoured
 *        37         unique verifiable certificates
 *        3          separately ticketed sessions, one day
 *        2          documentary screenings
 *        3          conferring bodies per certificate
 *
 *      SUPERSEDED, must not reappear: 173, 46 paid, 127 complimentary,
 *      R6,200.14, and "100+" in any form.
 *
 *      306 IS SESSION ADMISSIONS, NOT PEOPLE AND NOT ATTENDANCE. Three
 *      sessions ran, so one person attending all three counts three
 *      times. It never appears bare: always "306 session admissions
 *      across three sessions" or "306 issued session admissions", and
 *      never "306 attendees", "306 people", "306 guests" or
 *      "306 tickets".
 *
 *      Venue capacity is NOT evidence of attendance. Recorded check-ins
 *      must NOT be presented as attendance: the venue did not scan
 *      consistently. Attendance itself remains unpublished while
 *      reconciliation is open. Never infer or reconstruct a figure.
 *   2. Claims removed and NOT to be reinstated: "100+ paying attendees"
 *      (false); "a documentary premiere" (the premiered title has an
 *      unresolved rights position and cannot be used as a commercial
 *      credential); the petition described as live or anchoring the
 *      campaign (it has not launched, six governance gates are open, and
 *      the standing rule forbids presenting planned work as operational).
 *   3. No em dashes or en dashes anywhere in this file.
 *   4. No photographs of award recipients: consent has not been obtained.
 *
 * Enquiries submit through the LIVE submit-contact edge function (writes to
 * contact_submissions and emails the team). Deliberately not a new backend:
 * that function is deployed and verified in production.
 */

const ENQUIRY_TYPES = [
  { value: 'hosted-screening', label: 'Host my film (Hosted Screening Package)' },
  { value: 'sponsored-screening', label: 'Submit a film for a sponsored screening' },
  { value: 'sponsor', label: 'Sponsor a screening night' },
  { value: 'sponsorship-service', label: 'Sponsorship-as-a-Service for my event' },
  { value: 'product-activation', label: 'Product stall / activation' },
  { value: 'other', label: 'Something else' },
] as const;

const OFFERINGS = [
  {
    icon: Film,
    name: 'Hosted Screening Package',
    price: 'R15,000 to R25,000',
    priceNote: 'flat fee · 50% deposit confirms the date',
    audience: 'For filmmakers, impact producers, NGOs and brands with a film that needs this audience.',
    includes: [
      'The Masque Theatre booked and produced for your night',
      'Ticketing, seat plan and a branded event page (Quicket)',
      'Audience mobilisation: our attendee community, campaign partners and local channels',
      'MC, panel or Q&A production on the night',
      'Photo recap pack for your funders, press and socials',
    ],
    enquiry: 'hosted-screening',
  },
  {
    icon: Megaphone,
    name: 'Sponsored Screening',
    price: 'Sponsor-funded',
    priceNote: 'title sponsor R7,500 · partner slots R3,500',
    audience: 'For strong films whose makers have no budget. Local businesses fund the night instead.',
    includes: [
      // GOVERNED. The BWC governance report of 17 August 2026 bars announcing
      // or selling another public screening until the rights holder and FPB
      // pathway are documented for that specific film. The earlier wording,
      // "We curate the film and secure the community screening licence",
      // described Omni sourcing and licensing a film, which that control
      // prohibits until a pathway exists. Do not restore it.
      'We identify candidate films and confirm exhibition rights in writing with the rights holder before any date is announced',
      'Title sponsor: naming, screen ad, stall and 10 tickets',
      'Partner sponsors: logo, screen mention and 4 tickets',
      'The screening is confirmed only once the title sponsor signs',
    ],
    /** Rendered beneath this card's bullets only. Governed, 17 August 2026. */
    gate: 'Sponsored screenings are confirmed only once written exhibition rights and the classification position are documented for that specific film.',
    enquiry: 'sponsored-screening',
  },
  {
    icon: HandCoins,
    name: 'Sponsorship-as-a-Service',
    price: 'R2,500 + 20 to 25%',
    priceNote: 'packaging fee plus commission on sponsorship closed',
    audience: 'For organisers of other events and campaigns who need their sponsorship built and sold.',
    includes: [
      'Sponsor deck and tier design for your event',
      'Named local-business target list and outreach',
      'We negotiate and close; you deliver your event',
    ],
    enquiry: 'sponsorship-service',
  },
  {
    icon: Store,
    name: 'Product Activation',
    price: 'R500 to R2,500',
    priceNote: 'per night, or per 4-screening season',
    audience: 'For local products and food vendors who want a stall in front of a values-aligned crowd.',
    includes: [
      'Stall or sampling slot at a screening night',
      '“Official product partner” of a full season',
      'Mention from the stage and on the event page',
    ],
    enquiry: 'product-activation',
  },
];

const STEPS = [
  { n: '1', h: 'Scoping call', p: 'Twenty minutes: your film or brand, your goal, the right format and date window.' },
  { n: '2', h: 'Date secured', p: 'A 50% deposit (or a signed title sponsor) locks the theatre. We never announce before the night is funded.' },
  { n: '3', h: 'We mobilise', p: 'Ticketing live, audience invited, partners and press briefed, programme produced.' },
  { n: '4', h: 'The night, and the proof', p: 'You get the audience, the moment, and a recap pack to show funders it worked.' },
];

/** Stated as process, not as accreditation. Do not upgrade this wording. */
const RIGHTS_POINTS = [
  'Exhibition rights confirmed in writing with the rights holder',
  'Classification position established before the night is announced',
  'A documented record your funders can audit',
];

/**
 * Capability, not packages. The page sells four screening SKUs, but most of
 * what Omni actually delivers does not depend on film rights at all, and none
 * of it was visible. Added 19 August 2026.
 *
 * DELIBERATELY EXCLUDED, do not add back:
 *   - Paid advertising and media buying. Conversion tracking on the ads
 *     account is unwired, so attribution is blind. Not sellable as a line
 *     item until that is fixed.
 *   - Photography and videography. Not delivered in house.
 *   - Media and press guarantees. Outreach happened; no confirmed published
 *     coverage exists.
 *
 * No prices here. This section shows what we can do, not what it costs.
 */
const CAPABILITIES = [
  {
    icon: Clapperboard,
    title: 'Production',
    items: [
      'Venue sourcing, contracting and settlement',
      'Run of show, cue sheets and show calling',
      'Sound, lighting and media pack coordination',
      'MC and stage management',
      'Live performance and vendor coordination',
    ],
  },
  {
    icon: Ticket,
    title: 'Ticketing and audience',
    items: [
      'Ticketing platform build, multi-session and multi-tier',
      'Complimentary and partner allocation management',
      'Door, check-in and box office process',
      'Audience mobilisation across community and partner networks',
      'Session-level reconciliation and financial closeout',
    ],
  },
  {
    icon: Award,
    title: 'Recognition and verification',
    items: [
      'Awards programme and citation design',
      'Certificate production to print standard',
      'Permanent verification register, unique serial and token per record',
      'Records that can later carry photographs, citations and video without any link changing',
      'Consent and permissions register',
    ],
  },
  {
    icon: Globe,
    title: 'Digital and campaign',
    items: [
      'Event landing page, built and deployed',
      'Enquiry and lead capture that persists and notifies',
      'Petition and signature platform with compliant consent capture',
      'Email campaign design and delivery',
      'Social campaign, scheduling and engagement management',
    ],
  },
  {
    icon: Users,
    title: 'Partnerships and reporting',
    items: [
      'Partner and sponsor coordination',
      'In-kind contribution management and evidence recording',
      'Impact reporting with stated claim boundaries',
      'SDG and ESG alignment mapping',
      'Rights and classification clearance before any date is announced',
    ],
  },
];

/**
 * The gate itself, stated plainly. Added 17 August 2026 under the BWC
 * governance control. It binds both directions, films Omni sources and films
 * a client brings, so it cannot be read as applying only to the other party.
 */
const RIGHTS_GATE =
  'No screening date is announced or sold until written exhibition rights and the classification position are documented for that title. This applies to films we source and to films clients bring to us.';

const Screenings = () => {
  useSEO({
    title: 'Impact Screenings | Film Screening as a Service | Omni Wellness Media',
    description:
      'Turnkey documentary screenings for the Southern Peninsula, Cape Town. We deliver the audience, the theatre, the campaign moment and the recap, for filmmakers, NGOs and brands.',
    canonical: 'https://omniwellnessmedia.co.za/screenings',
  });

  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', organisation: '', type: '', message: '' });
  // POPIA: separate from the act of enquiring, and DEFAULT UNCHECKED. Never
  // pre-tick this. An enquiry is not consent; only the ticked box is.
  const [keepPosted, setKeepPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Missing information', description: 'Name, email and a few words about your enquiry are required.', variant: 'destructive' });
      return;
    }
    // Same regex the edge function enforces, so a mistyped email gets a clear
    // client-side message rather than a misleading "our side" server error.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast({ title: 'Check your email address', description: 'That email address does not look complete. Please correct it and send again.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const typeLabel = ENQUIRY_TYPES.find((t) => t.value === form.type)?.label ?? 'General';
      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: form.name,
          email: form.email,
          organization: form.organisation || null,
          service: `Impact Screenings: ${typeLabel}`,
          message: form.message,
          // Recorded against the submission with a timestamp, server side.
          marketing_consent: keepPosted,
        },
      });
      if (error) throw error;
      trackAdsConversion('contact_submit');
      trackLead('screening_enquiry');
      setDone(true);
    } catch {
      // Inputs are preserved on failure. Never swap to a success state unless
      // the server confirmed (same rule as the petition form).
      toast({
        title: "We couldn't send that just now",
        description: 'Something went wrong on our side. Please try again in a minute, or email omniwellnessmedia@gmail.com. Your details are still filled in.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToEnquire = (type: string) => {
    setForm((f) => ({ ...f, type }));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('enquire')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    // Move keyboard focus with the scroll so the CTA actually lands users in
    // the form, not stranded back at the card they clicked.
    document.getElementById('sc-name')?.focus({ preventScroll: true });
  };

  return (
    <>
      <UnifiedNavigation />
      <main className="bg-wwpl-cream text-wwpl-ink">

        {/* Hero */}
        <section className="border-b border-wwpl-line">
          <div className="mx-auto max-w-5xl px-5 pb-16 pt-20 text-center sm:pt-24">
            <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldText">
              Impact screenings · Muizenberg, Kalk Bay, Fish Hoek
            </p>
            <h1 className="mx-auto mt-4 max-w-[22ch] font-wwpl-display text-[clamp(34px,6vw,54px)] font-semibold leading-[1.08]">
              Your film deserves this audience.
            </h1>
            <p className="mx-auto mt-5 max-w-[58ch] text-[17px] leading-relaxed text-wwpl-slate">
              We stage documentary nights at The Masque Theatre for the Southern Peninsula's conscious
              community, and wrap them in a campaign: panel, awards, press. You bring the film.
              We deliver the audience, the occasion, and the proof it mattered.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {/* btn-primary applies a teal gradient via background-image, so the
                  brand override needs !bg-none as well as the plum colour. */}
              <Button size="lg" className="!bg-none !bg-wwpl-plum !text-wwpl-cream hover:!bg-wwpl-ink" onClick={() => scrollToEnquire('hosted-screening')}>
                Start a scoping call <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-wwpl-line" asChild>
                <a href="#offerings">See the offerings</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Proof stats. Governed figures only: see the COPY RULES header. */}
        <section className="border-b border-wwpl-line bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-10 text-center sm:grid-cols-4">
            {[
              ['306', 'session admissions, three sessions'],
              ['3', 'sessions in one day'],
              ['7', 'partner organisations'],
              ['37', 'honourees on our awards register'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-wwpl-display text-[34px] font-semibold text-wwpl-plum">{n}</div>
                <div className="mx-auto mt-1 max-w-[18ch] text-[13px] leading-snug text-wwpl-slate">{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Case study. The dark treatment carried over from the event page. */}
        <section className="bg-wwpl-ink py-16 text-wwpl-cream">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldLight">
              Proof · 10 August 2026
            </p>
            <p className="mt-5 font-wwpl-display text-[clamp(22px,3.6vw,30px)] font-medium leading-snug">
              “Celebrating Women Who Protect Life” delivered 306 session admissions across three
              separately ticketed sessions at The Masque Theatre, with two documentary screenings
              and an awards ceremony honouring 37 women, each holding a permanently verifiable
              certificate.
            </p>
            <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-[rgba(246,241,232,.72)]">
              One day produced a live audience, a permanent certificate register, seven active
              partnerships and a campaign that continues. That is what a screening looks like when
              it is built as a moment, not a booking.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[14px]">
              <Link to="/events/stunning-pigs" className="text-wwpl-goldLight underline underline-offset-4 hover:text-wwpl-cream">
                See the event page
              </Link>
              <a href="/awards" className="text-wwpl-goldLight underline underline-offset-4 hover:text-wwpl-cream">
                See the awards register
              </a>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section id="offerings" className="scroll-mt-8 border-b border-wwpl-line py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="mx-auto max-w-[60ch] text-center">
              <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldText">Four ways to work with us</p>
              <h2 className="mt-3 font-wwpl-display text-[clamp(26px,4.5vw,36px)] font-semibold">The offerings</h2>
              <p className="mt-3 text-[15px] text-wwpl-slate">
                Every engagement follows one rule: the night is funded, by your deposit or a signed
                title sponsor, before it is announced. No surprises for anyone.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {OFFERINGS.map((o) => (
                <article key={o.name} className="flex flex-col rounded-[18px] border border-wwpl-line bg-white p-7 shadow-[0_1px_2px_rgba(21,32,31,.05)]">
                  <div className="flex items-start justify-between gap-4">
                    <o.icon className="h-7 w-7 text-wwpl-goldText" aria-hidden="true" />
                    <div className="text-right">
                      <div className="font-wwpl-display text-[20px] font-semibold text-wwpl-plum">{o.price}</div>
                      <div className="text-[12px] text-wwpl-slate">{o.priceNote}</div>
                    </div>
                  </div>
                  <h3 className="mt-4 font-wwpl-display text-[22px] font-semibold">{o.name}</h3>
                  <p className="mt-1.5 text-[14px] text-wwpl-slate">{o.audience}</p>
                  <ul className="mt-4 space-y-2">
                    {o.includes.map((line) => (
                      <li key={line} className="flex gap-2.5 text-[14px] leading-snug">
                        <Check className="mt-0.5 h-4 w-4 flex-none text-wwpl-goldText" aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Only the Sponsored Screening card carries a gate today.
                      flex-1 moves here so the card still bottoms out its CTA. */}
                  <div className="flex-1">
                    {o.gate && (
                      <p className="mt-4 border-t border-wwpl-line pt-3 text-[13px] leading-relaxed text-wwpl-slate">
                        {o.gate}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6 self-start border-wwpl-line text-wwpl-ink hover:bg-wwpl-cream"
                    onClick={() => scrollToEnquire(o.enquiry)}
                  >
                    Enquire about this
                  </Button>
                </article>
              ))}
            </div>
            {/* The published figures are indicative, not a quote to a named
                client. This qualifier is what makes that distinction explicit
                while the venue invoice is still open. */}
            <p className="mx-auto mt-8 max-w-[60ch] text-center text-[15px] text-wwpl-slate">
              Final pricing is confirmed at scoping and depends on date, venue configuration and
              licensing scope.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-wwpl-line bg-white py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center">
              <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldText">From enquiry to opening night</p>
              <h2 className="mt-3 font-wwpl-display text-[clamp(26px,4.5vw,36px)] font-semibold">How it works</h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-[16px] border border-wwpl-line bg-wwpl-cream p-6">
                  <div className="font-wwpl-display text-[26px] font-semibold text-wwpl-goldText">{s.n}</div>
                  <h3 className="mt-2 font-wwpl-display text-[18px] font-semibold">{s.h}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-wwpl-slate">{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Everything a night needs. Capability, not packages, and no prices.
            See the CAPABILITIES note for what is deliberately excluded. */}
        <section className="border-b border-wwpl-line py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="mx-auto max-w-[60ch] text-center">
              <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldText">
                Behind the night
              </p>
              <h2 className="mt-3 font-wwpl-display text-[clamp(26px,4.5vw,36px)] font-semibold">
                Everything a night needs
              </h2>
              <p className="mt-3 text-[15px] text-wwpl-slate">
                A screening is the visible part. This is what sits behind it.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((group) => (
                <article
                  key={group.title}
                  className="rounded-[18px] border border-wwpl-line bg-white p-6 shadow-[0_1px_2px_rgba(21,32,31,.05)]"
                >
                  <group.icon className="h-6 w-6 text-wwpl-goldText" aria-hidden="true" />
                  <h3 className="mt-3 font-wwpl-display text-[19px] font-semibold">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-wwpl-slate">
                        <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-wwpl-goldText" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Rights and licensing. Process, not accreditation: do not upgrade
            this into a claim of certification or legal service. */}
        <section className="border-b border-wwpl-line py-16">
          <div className="mx-auto max-w-3xl px-5">
            <div className="rounded-[20px] border border-wwpl-line bg-white p-8 shadow-[0_1px_2px_rgba(21,32,31,.05)] sm:p-10">
              <ShieldCheck className="h-8 w-8 text-wwpl-goldText" aria-hidden="true" />
              <h2 className="mt-4 font-wwpl-display text-[clamp(24px,4vw,32px)] font-semibold">
                Rights handled properly
              </h2>
              <p className="mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-wwpl-slate">
                Every title we screen goes through a documented rights and classification check
                before a date is confirmed. Filmmakers and funders get a clean chain of permission,
                not a handshake.
              </p>
              <ul className="mt-6 space-y-3">
                {RIGHTS_POINTS.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-snug">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-wwpl-goldText" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[62ch] border-t border-wwpl-line pt-5 text-[15px] font-medium leading-relaxed text-wwpl-ink">
                {RIGHTS_GATE}
              </p>
            </div>
          </div>
        </section>

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-8 py-16">
          <div className="mx-auto max-w-2xl px-5">
            {done ? (
              /* role=status announces the swap to screen readers; the form it
                 replaces contained the focused submit button, so focus must
                 not silently evaporate. */
              <div role="status" className="rounded-[20px] border border-wwpl-line bg-white p-10 text-center shadow-wwpl-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-wwpl-gold text-[24px] text-wwpl-plum">✓</div>
                <h2 className="font-wwpl-display text-[26px] font-semibold">Enquiry received</h2>
                <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-wwpl-slate">
                  Thank you. We will come back to you within one working day to set up a scoping
                  call. If it is urgent, email{' '}
                  <a href="mailto:omniwellnessmedia@gmail.com" className="text-wwpl-goldText underline underline-offset-2">
                    omniwellnessmedia@gmail.com
                  </a>.
                </p>
                {/* The offering-card CTAs still point here after success, so
                    give them somewhere to land instead of a dead end. */}
                <Button variant="outline" className="mt-6 border-wwpl-line"
                  onClick={() => { setForm((f) => ({ ...f, message: '' })); setDone(false); }}>
                  Send another enquiry
                </Button>
              </div>
            ) : (
              <div className="rounded-[20px] border border-wwpl-line bg-white p-8 shadow-wwpl-md sm:p-10">
                <h2 className="font-wwpl-display text-[26px] font-semibold">Start the conversation</h2>
                <p className="mt-2 text-[14px] text-wwpl-slate">
                  Tell us about your film, your event or your brand. We reply within one working day.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="sc-name">Name *</Label>
                      <Input id="sc-name" className="mt-1.5" autoComplete="name" value={form.name}
                        onChange={(e) => set('name')(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="sc-email">Email *</Label>
                      <Input id="sc-email" type="email" className="mt-1.5" autoComplete="email" value={form.email}
                        onChange={(e) => set('email')(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sc-org">Organisation / film title</Label>
                    <Input id="sc-org" className="mt-1.5" autoComplete="organization" value={form.organisation}
                      onChange={(e) => set('organisation')(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="sc-type">What are you enquiring about?</Label>
                    <Select value={form.type} onValueChange={set('type')}>
                      <SelectTrigger id="sc-type" className="mt-1.5"><SelectValue placeholder="Choose the closest fit" /></SelectTrigger>
                      <SelectContent>
                        {ENQUIRY_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sc-msg">Your enquiry *</Label>
                    {/* The edge function truncates at 1000 chars, so cap here
                        and nothing a prospect writes is silently discarded. */}
                    <Textarea id="sc-msg" rows={5} maxLength={900} className="mt-1.5" value={form.message}
                      placeholder="The film or event, your goal, and any dates you have in mind."
                      onChange={(e) => set('message')(e.target.value)} required />
                  </div>

                  {/* POPIA: optional, separate from the enquiry itself, and
                      unchecked by default. Do not pre-tick. */}
                  <label className="flex items-start gap-2.5 text-[14px] text-wwpl-slate">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-[#9C7434]"
                      checked={keepPosted}
                      onChange={(e) => setKeepPosted(e.target.checked)}
                    />
                    <span>Keep me posted about upcoming screenings</span>
                  </label>

                  <Button type="submit" disabled={submitting}
                    className="w-full !bg-none !bg-wwpl-plum !text-wwpl-cream hover:!bg-wwpl-ink">
                    {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>) : 'Send enquiry'}
                  </Button>

                  <p className="text-center text-[12.5px] leading-relaxed text-wwpl-slate">
                    We use your details only to respond to this enquiry. We do not share them. See our{' '}
                    <a href="/privacy-policy" className="text-wwpl-goldText underline underline-offset-2">
                      Privacy Policy
                    </a>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Screenings;
