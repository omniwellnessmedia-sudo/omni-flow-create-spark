import { useState } from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import { submitEvent } from '@/lib/events';
import { useSEO } from '@/lib/seo';

/**
 * Let an organiser propose an event.
 *
 * This is the ingestion route that actually holds up. It is consented by
 * construction, because the organiser is the one submitting, and it produces
 * no copyright or data protection question because they supply their own
 * words. See docs/EVENTS_INGESTION.md for why the obvious alternative,
 * scraping social platforms, is not built.
 *
 * A submission is not a listing. It lands in event_submissions and a person
 * has to promote it before anything appears publicly. The form says so, so
 * nobody submits expecting to see it live in five minutes.
 *
 * No em dashes in this file.
 */

const EventSubmit = () => {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    venue: '',
    city: 'Cape Town',
    event_date: '',
    external_booking_url: '',
    price_from_zar: '',
    is_free: false,
    organiser_name: '',
    organiser_email: '',
    organiser_phone: '',
    notes: '',
  });

  useSEO({
    title: 'Submit a wellness event | Omni Wellness Media',
    description:
      'Tell us about a wellness event in the Cape and we will check the details and list it.',
    canonical: 'https://omniwellnessmedia.co.za/events/submit',
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.organiser_name.trim() || !form.organiser_email.trim()) {
      setError('Please give the event name, your name and your email address.');
      return;
    }
    if (!consent) {
      setError('Please confirm you are entitled to have this event listed.');
      return;
    }

    setSending(true);
    const price = form.price_from_zar.trim() ? Number(form.price_from_zar) : null;
    const res = await submitEvent({
      title: form.title.trim(),
      summary: form.summary.trim() || undefined,
      venue: form.venue.trim() || undefined,
      city: form.city.trim() || undefined,
      event_date: form.event_date || undefined,
      external_booking_url: form.external_booking_url.trim() || undefined,
      price_from_zar: price !== null && Number.isFinite(price) ? price : null,
      is_free: form.is_free,
      organiser_name: form.organiser_name.trim(),
      organiser_email: form.organiser_email.trim(),
      organiser_phone: form.organiser_phone.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
    setSending(false);

    if (res.ok) setDone(true);
    else setError(res.reason);
  };

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: '#FAF8F2' }}>
        <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
          <p
            className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
            style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
          >
            <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-[#2C6FB5]" />
            Events
          </p>
          <h1 className="mt-3 font-wwpl-display text-4xl font-medium">Submit an event</h1>

          {done ? (
            <Card className="mt-8">
              <CardContent className="py-10 text-center">
                <Check className="mx-auto h-8 w-8 text-[#4FAE3F]" />
                <h2 className="mt-4 font-wwpl-display text-2xl font-medium">Thank you</h2>
                <p className="mx-auto mt-2 max-w-[46ch] text-sm text-muted-foreground">
                  Someone here will check the details and be in touch. Your event does not
                  appear on the calendar until that happens.
                </p>
                <Link to="/events" className="mt-6 inline-block">
                  <Button variant="outline">Back to events</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="mt-4 max-w-[60ch] text-muted-foreground">
                Listing is free. We check every event before it appears, so this is a
                proposal rather than a publication. Expect a reply rather than an instant
                listing.
              </p>

              <form onSubmit={submit} className="mt-8 space-y-5">
                <Field label="Event name" required>
                  <Input value={form.title} onChange={(e) => set('title', e.target.value)} required />
                </Field>

                <Field label="What is it, in a sentence or two">
                  <Textarea
                    rows={3}
                    value={form.summary}
                    onChange={(e) => set('summary', e.target.value)}
                    placeholder="Your own words. We publish what you write here, not a rewrite of it."
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Date">
                    <Input
                      type="date"
                      value={form.event_date}
                      onChange={(e) => set('event_date', e.target.value)}
                    />
                  </Field>
                  <Field label="Town or city">
                    <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
                  </Field>
                </div>

                <Field label="Venue">
                  <Input value={form.venue} onChange={(e) => set('venue', e.target.value)} />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Price from, in rand">
                    <Input
                      inputMode="decimal"
                      value={form.price_from_zar}
                      onChange={(e) => set('price_from_zar', e.target.value)}
                      disabled={form.is_free}
                      placeholder="150"
                    />
                  </Field>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={form.is_free}
                        onCheckedChange={(v) => set('is_free', Boolean(v))}
                      />
                      This event is free
                    </label>
                  </div>
                </div>

                <Field label="Where people book, if not with us">
                  <Input
                    type="url"
                    value={form.external_booking_url}
                    onChange={(e) => set('external_booking_url', e.target.value)}
                    placeholder="https://"
                  />
                </Field>

                <div className="border-t pt-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" required>
                      <Input
                        value={form.organiser_name}
                        onChange={(e) => set('organiser_name', e.target.value)}
                        required
                      />
                    </Field>
                    <Field label="Your email" required>
                      <Input
                        type="email"
                        value={form.organiser_email}
                        onChange={(e) => set('organiser_email', e.target.value)}
                        required
                      />
                    </Field>
                  </div>
                  <div className="mt-5">
                    <Field label="Phone, if you would rather we called">
                      <Input
                        value={form.organiser_phone}
                        onChange={(e) => set('organiser_phone', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>

                <Field label="Anything else we should know">
                  <Textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                  />
                </Field>

                {/* The permission question is asked once, plainly, and the
                    answer is kept with the submission. Listing someone's
                    event without their say so is the thing this whole module
                    is built to avoid. */}
                <label className="flex items-start gap-3 rounded-xl border bg-white/70 p-4 text-sm">
                  <Checkbox
                    className="mt-0.5"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(Boolean(v))}
                  />
                  <span>
                    I am the organiser, or I have the organiser's permission to have this
                    event listed, and the details above are accurate.
                  </span>
                </label>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    <p className="text-sm text-amber-900">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send for review
                </Button>

                <p className="text-xs text-muted-foreground">
                  We use your contact details only to discuss this listing.
                </p>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="text-sm">
      {label}
      {required && <span className="text-muted-foreground"> (required)</span>}
    </Label>
    <div className="mt-1.5">{children}</div>
  </div>
);

export default EventSubmit;
