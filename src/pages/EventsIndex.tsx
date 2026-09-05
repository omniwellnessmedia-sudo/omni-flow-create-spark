import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Calendar, ArrowRight, AlertTriangle, Ticket } from 'lucide-react';
import {
  listPublishedEvents,
  formatEventDate,
  kindLabel,
  kindHue,
  type PublicEvent, isReadFailure } from '@/lib/events';
import { useSEO } from '@/lib/seo';

/**
 * The public wellness events calendar.
 *
 * WHAT THIS REPLACES. src/data/communityEvents.ts held six invented events
 * with their dates recomputed against the current month so the calendar
 * "always looks live". One of them described a food drive run in partnership
 * with a real foundation. None of it happened. This page reads only published,
 * human verified rows from the events table, so it can be empty, and an empty
 * calendar is the correct output when there is nothing on.
 *
 * A FAILED READ IS NOT AN EMPTY MONTH. If the events service does not answer,
 * this says so. Rendering "no events" when we simply could not ask is the same
 * class of dishonesty as inventing events, in the opposite direction.
 *
 * No em dashes in this file.
 */

type Filter = 'upcoming' | 'all';

const EventsIndex = () => {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [kind, setKind] = useState<string>('all');

  useSEO({
    title: 'Wellness Events in Cape Town | Omni Wellness Media',
    description:
      'Screenings, workshops, retreats and community wellness events. Every listing is checked by a person before it appears.',
    canonical: 'https://omniwellnessmedia.co.za/events',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const from = filter === 'upcoming' ? new Date() : null;
      const res = await listPublishedEvents(from, null);
      if (cancelled) return;
      if (res.ok) {
        setEvents(res.data);
        setProblem(null);
      } else if (isReadFailure(res)) {
        setEvents([]);
        setProblem(res.reason);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const kinds = useMemo(() => {
    const present = new Set(events.map((e) => e.kind));
    return [...present].sort();
  }, [events]);

  const visible = useMemo(
    () => (kind === 'all' ? events : events.filter((e) => e.kind === kind)),
    [events, kind]
  );

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: '#FAF8F2' }}>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p
            className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
            style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
          >
            <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-[#2C6FB5]" />
            Events
          </p>
          <h1 className="mt-3 font-wwpl-display text-4xl font-medium md:text-5xl">
            What is on
          </h1>
          <p className="mt-4 max-w-[64ch] text-lg text-muted-foreground">
            Screenings, workshops, retreats and community gatherings around the Cape.
            Every listing here is checked by a person before it appears.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border p-1">
              {(['upcoming', 'all'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm capitalize ${
                    filter === f ? 'bg-muted font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {f === 'upcoming' ? 'Upcoming' : 'Everything'}
                </button>
              ))}
            </div>

            {kinds.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setKind('all')}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    kind === 'all' ? 'bg-muted font-medium' : 'text-muted-foreground'
                  }`}
                >
                  All kinds
                </button>
                {kinds.map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                      kind === k ? 'bg-muted font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-[6px] w-[6px] rounded-full"
                      style={{ background: kindHue(k) }}
                    />
                    {kindLabel(k)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : problem ? (
            <Card className="mt-10 border-amber-200 bg-amber-50/60">
              <CardContent className="flex items-start gap-3 py-5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    We could not load the events list
                  </p>
                  <p className="mt-1 text-sm text-amber-900">
                    This is a fault on our side, not an empty calendar. Please try again
                    shortly.
                  </p>
                  <p
                    className="mt-2 text-xs text-amber-900"
                    style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                  >
                    {problem}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : visible.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed p-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <h2 className="mt-4 font-wwpl-display text-2xl font-medium">
                Nothing listed for now
              </h2>
              <p className="mx-auto mt-2 max-w-[52ch] text-sm text-muted-foreground">
                We only list events once someone here has checked them, so this page is
                empty rather than padded. If you run a wellness event in the Cape, tell us
                about it.
              </p>
              <Link to="/events/submit" className="mt-6 inline-block">
                <Button>Submit an event</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>

              <div className="mt-14 rounded-2xl border p-8 text-center">
                <h2 className="font-wwpl-display text-2xl font-medium">
                  Running a wellness event?
                </h2>
                <p className="mx-auto mt-2 max-w-[52ch] text-sm text-muted-foreground">
                  Tell us about it and we will check the details and list it. Listing is
                  free.
                </p>
                <Link to="/events/submit" className="mt-5 inline-block">
                  <Button>Submit an event</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

const EventCard = ({ event: e }: { event: PublicEvent }) => {
  const hue = kindHue(e.kind);
  const when = formatEventDate(e.event_date, e.end_date);

  return (
    <Link to={`/events/${e.slug}`} className="group">
      <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-foreground/20">
        {e.cover_image_url ? (
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
            <img
              src={e.cover_image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-[3px] w-full" style={{ background: hue }} aria-hidden="true" />
        )}

        <CardContent className="flex flex-1 flex-col gap-2 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-[.12em]"
              style={{ background: `${hue}1A`, color: hue, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              {kindLabel(e.kind)}
            </span>
            {/* Paid placement is labelled. A reader is entitled to know that
                position on this page was bought rather than earned. */}
            {e.is_promoted && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
                Featured
              </span>
            )}
          </div>

          <h2 className="text-[17px] font-medium leading-snug">{e.title}</h2>

          {when && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {when}
            </p>
          )}
          {(e.venue || e.city) && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {[e.venue, e.city].filter(Boolean).join(', ')}
            </p>
          )}

          {e.summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{e.summary}</p>
          )}

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-sm font-medium">
              {e.is_free
                ? 'Free'
                : e.price_from_zar
                  ? `From R${Number(e.price_from_zar).toFixed(0)}`
                  : ''}
            </span>
            {/* Only stated when we actually sell the seats. An event ticketed
                elsewhere has no seat count we can vouch for. */}
            {e.booking_mode === 'internal' && e.seats_remaining !== null && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Ticket className="h-3.5 w-3.5" />
                {e.seats_remaining} left
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            See details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventsIndex;
