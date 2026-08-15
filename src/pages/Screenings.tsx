import { useState } from 'react';
import { useSEO } from '@/lib/seo';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Film, HandCoins, Megaphone, Store, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { trackAdsConversion } from '@/lib/googleAds';
import { trackLead } from '@/lib/socialPixels';

/**
 * Impact Screenings — the screening-as-a-service offering.
 *
 * This page sells what the 10 Aug 2026 Masque Theatre event PROVED: Omni can
 * fill a theatre with the Southern Peninsula's conscious audience and wrap a
 * film in a campaign (petition, awards, panel, press). Four SKUs, priced per
 * the Screening Engine plan (Aug 2026). Every claim of proof on this page
 * must stay true to that event — no invented numbers.
 *
 * Enquiries submit through the LIVE submit-contact edge function (writes to
 * contact_submissions + emails the team). Deliberately not a new backend:
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
    price: 'R15,000 – R25,000',
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
    audience: 'For strong films whose makers have no budget — local businesses fund the night instead.',
    includes: [
      'We curate the film and secure the community screening licence',
      'Title sponsor: naming, screen ad, stall and 10 tickets',
      'Partner sponsors: logo, screen mention and 4 tickets',
      'The screening is confirmed only once the title sponsor signs',
    ],
    enquiry: 'sponsored-screening',
  },
  {
    icon: HandCoins,
    name: 'Sponsorship-as-a-Service',
    price: 'R2,500 + 20–25%',
    priceNote: 'packaging fee + commission on sponsorship closed',
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
    price: 'R500 – R2,500',
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
  { n: '4', h: 'The night — and the proof', p: 'You get the audience, the moment, and a recap pack to show funders it worked.' },
];

const Screenings = () => {
  useSEO({
    title: 'Impact Screenings | Film Screening as a Service | Omni Wellness Media',
    description:
      'Turnkey documentary screenings for the Southern Peninsula, Cape Town. We deliver the audience, the theatre, the campaign moment and the recap — for filmmakers, NGOs and brands.',
    canonical: 'https://omniwellnessmedia.co.za/screenings',
  });

  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', organisation: '', type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Missing information', description: 'Name, email and a few words about your enquiry are required.', variant: 'destructive' });
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
          service: `Impact Screenings — ${typeLabel}`,
          message: form.message,
        },
      });
      if (error) throw error;
      trackAdsConversion('contact_submit');
      trackLead('screening_enquiry');
      setDone(true);
    } catch {
      // Inputs are preserved on failure — never swap to a success state
      // unless the server confirmed (same rule as the petition form).
      toast({
        title: "We couldn't send that just now",
        description: 'Something went wrong on our side. Please try again in a minute, or email omniwellnessmedia@gmail.com — your details are still filled in.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToEnquire = (type: string) => {
    setForm((f) => ({ ...f, type }));
    document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <UnifiedNavigation />
      <main className="bg-wwpl-cream text-wwpl-ink">

        {/* Hero */}
        <section className="border-b border-wwpl-line">
          <div className="mx-auto max-w-5xl px-5 pb-16 pt-20 text-center sm:pt-24">
            <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldText">
              Impact screenings · Muizenberg – Kalk Bay – Fish Hoek
            </p>
            <h1 className="mx-auto mt-4 max-w-[22ch] font-wwpl-display text-[clamp(34px,6vw,54px)] font-semibold leading-[1.08]">
              Your film deserves this audience.
            </h1>
            <p className="mx-auto mt-5 max-w-[58ch] text-[17px] leading-relaxed text-wwpl-slate">
              We stage documentary nights at The Masque Theatre for the Southern Peninsula's conscious
              community — and wrap them in a campaign: panel, petition, awards, press. You bring the film.
              We deliver the full theatre and the proof it mattered.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {/* btn-primary applies a teal gradient via background-image, so the
                  brand override needs !bg-none as well as the plum colour. */}
              <Button size="lg" className="!bg-none !bg-wwpl-plum !text-wwpl-cream hover:!bg-wwpl-ink" onClick={() => scrollToEnquire('hosted-screening')}>
                Book a scoping call <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-wwpl-line" asChild>
                <a href="#offerings">See the offerings</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Proof stats — all real numbers from the 10 Aug 2026 event. */}
        <section className="border-b border-wwpl-line bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-10 text-center sm:grid-cols-4">
            {[
              ['100+', 'paid attendees, first-time event'],
              ['3', 'sessions sold via Quicket'],
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

        {/* Case study — the dark treatment carried over from the event page. */}
        <section className="bg-wwpl-ink py-16 text-wwpl-cream">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldLight">
              Proof · 10 August 2026
            </p>
            <p className="mt-5 font-wwpl-display text-[clamp(22px,3.6vw,30px)] font-medium leading-snug">
              “Celebrating Women Who Protect Life” filled The Masque Theatre — a documentary premiere,
              an awards ceremony honouring 37 women, and a national petition launched the same night.
            </p>
            <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-[rgba(246,241,232,.72)]">
              One evening produced a paying audience, a permanent certificate register, seven active
              partnerships and a live campaign. That is what a screening looks like when it's built
              as a moment, not a booking.
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
                Every engagement follows one rule: the night is funded — by your deposit or a signed
                title sponsor — before it is announced. No surprises for anyone.
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
                  <ul className="mt-4 flex-1 space-y-2">
                    {o.includes.map((line) => (
                      <li key={line} className="flex gap-2.5 text-[14px] leading-snug">
                        <Check className="mt-0.5 h-4 w-4 flex-none text-wwpl-goldText" aria-hidden="true" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
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
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-wwpl-line bg-white py-16">
          <div className="mx-auto max-w-5xl px-5">
            <div className="text-center">
              <p className="font-wwpl-cond text-[12px] uppercase tracking-[.24em] text-wwpl-goldText">From enquiry to full house</p>
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

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-8 py-16">
          <div className="mx-auto max-w-2xl px-5">
            {done ? (
              <div className="rounded-[20px] border border-wwpl-line bg-white p-10 text-center shadow-wwpl-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-wwpl-gold text-[24px] text-wwpl-plum">✓</div>
                <h2 className="font-wwpl-display text-[26px] font-semibold">Enquiry received</h2>
                <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-wwpl-slate">
                  Thank you — we'll come back to you within one working day to set up a scoping call.
                  If it's urgent, email{' '}
                  <a href="mailto:omniwellnessmedia@gmail.com" className="text-wwpl-goldText underline underline-offset-2">
                    omniwellnessmedia@gmail.com
                  </a>.
                </p>
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
                    <Label>What are you enquiring about?</Label>
                    <Select value={form.type} onValueChange={set('type')}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose the closest fit" /></SelectTrigger>
                      <SelectContent>
                        {ENQUIRY_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sc-msg">Your enquiry *</Label>
                    <Textarea id="sc-msg" rows={5} className="mt-1.5" value={form.message}
                      placeholder="The film or event, your goal, and any dates you have in mind."
                      onChange={(e) => set('message')(e.target.value)} required />
                  </div>
                  <Button type="submit" disabled={submitting}
                    className="w-full !bg-none !bg-wwpl-plum !text-wwpl-cream hover:!bg-wwpl-ink">
                    {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>) : 'Send enquiry'}
                  </Button>
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
