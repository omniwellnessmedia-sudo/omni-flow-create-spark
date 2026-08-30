import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2, MapPin, Calendar, ArrowLeft, AlertTriangle, ExternalLink, Ticket, User,
} from 'lucide-react';
import { getEvent, formatEventDate, kindLabel, kindHue, type EventDetail as Detail } from '@/lib/events';
import { useSEO } from '@/lib/seo';

/**
 * A page for one event, whatever kind it is.
 *
 * PROVENANCE IS SHOWN, NOT HIDDEN. An event we run, an event an organiser
 * asked us to list, and an event pulled from a feed are different things, and
 * the reader is told which. That matters most for the action: a ticket we sell
 * carries our booking flow and our responsibility, while a link to someone
 * else's ticketing page does not, and presenting them identically would be
 * misleading about who the visitor is dealing with.
 *
 * No em dashes in this file.
 */

const SOURCE_NOTE: Record<string, string> = {
  own: 'Run by Omni Wellness Media.',
  submitted: 'Listed at the organiser’s request and checked by our team.',
  feed: 'Listed from the organiser’s own published calendar.',
};

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useSEO({
    title: event ? `${event.title} | Omni Wellness Media` : 'Event | Omni Wellness Media',
    description:
      event?.summary ??
      'Wellness events, screenings, workshops and retreats around Cape Town.',
    canonical: slug ? `https://omniwellnessmedia.co.za/events/${slug}` : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const res = await getEvent(slug);
      if (cancelled) return;
      if (!res.ok) {
        setProblem(res.reason);
      } else if (res.data === null) {
        setNotFound(true);
      } else {
        setEvent(res.data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // An unknown or unpublished slug goes back to the calendar. It is not an
  // error worth its own page, and a draft event must not confirm it exists.
  if (notFound) return <Navigate to="/events" replace />;

  const hue = event ? kindHue(event.kind) : '#8A9A96';
  const when = event ? formatEventDate(event.event_date, event.end_date) : null;
  const totalRemaining = event?.sessions.reduce((n, s) => n + (s.remaining ?? 0), 0) ?? 0;

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: '#FAF8F2' }}>
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All events
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : problem ? (
            <Card className="mt-8 border-amber-200 bg-amber-50/60">
              <CardContent className="flex items-start gap-3 py-5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    We could not load this event
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
          ) : event ? (
            <>
              <header className="mt-8">
                <p
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
                  style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                >
                  <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
                  {kindLabel(event.kind)}
                </p>
                <h1 className="mt-3 font-wwpl-display text-4xl font-medium leading-tight md:text-5xl">
                  {event.title}
                </h1>
                {event.summary && (
                  <p className="mt-4 max-w-[62ch] text-lg text-muted-foreground">{event.summary}</p>
                )}
              </header>

              {event.cover_image_url && (
                <img
                  src={event.cover_image_url}
                  alt=""
                  className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
                />
              )}

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {when && (
                  <Fact icon={Calendar} label="When" value={when} />
                )}
                {(event.venue || event.city) && (
                  <Fact
                    icon={MapPin}
                    label="Where"
                    value={[event.venue, event.city].filter(Boolean).join(', ')}
                  />
                )}
                {(event.host_name || event.organiser_name) && (
                  <Fact
                    icon={User}
                    label="Hosted by"
                    value={event.host_name || event.organiser_name || ''}
                  />
                )}
                <Fact
                  icon={Ticket}
                  label="Cost"
                  value={
                    event.is_free
                      ? 'Free'
                      : event.price_from_zar
                        ? `From R${Number(event.price_from_zar).toFixed(0)}`
                        : 'Confirmed on booking'
                  }
                />
              </dl>

              {event.sessions.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-wwpl-display text-2xl font-medium">Sessions</h2>
                  <div className="mt-4 space-y-3">
                    {event.sessions.map((s) => (
                      <Card key={s.session_id}>
                        <CardContent className="flex flex-wrap items-start justify-between gap-4 py-5">
                          <div className="min-w-[240px] flex-1">
                            <p className="text-[15px] font-medium">{s.session_title}</p>
                            {s.session_description && (
                              <p className="mt-1 max-w-[60ch] text-sm text-muted-foreground">
                                {s.session_description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {/* Seat counts come from the same reader that
                                enforces the oversell guard, so what is shown
                                and what can be sold cannot disagree. */}
                            <p className="text-sm font-medium">
                              {s.remaining && s.remaining > 0
                                ? `${s.remaining} of ${s.allocation} left`
                                : 'Fully booked'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-12 rounded-2xl p-8" style={{ background: '#15201F' }}>
                <h2 className="font-wwpl-display text-2xl font-medium" style={{ color: '#FAF8F2' }}>
                  {event.booking_mode === 'none' ? 'Good to know' : 'Book your place'}
                </h2>
                <p className="mt-2 max-w-[54ch] text-sm" style={{ color: '#B9C6C2' }}>
                  {SOURCE_NOTE[event.source] ?? SOURCE_NOTE.own}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {/* Events we ticket ourselves currently route to an enquiry.
                      The seat reservation and payment exist, but only wired
                      into the bespoke screening page, and the repo rule is
                      that only routes which exist may be linked. When the
                      generic booking flow lands this becomes a direct link
                      and nothing else on this page changes. */}
                  {event.booking_mode === 'internal' && (
                    <Link to={`/contact?event=${event.slug}`}>
                      <Button
                        className="rounded-full"
                        style={{ background: '#FAF8F2', color: '#15201F' }}
                        disabled={totalRemaining === 0}
                      >
                        {totalRemaining === 0 ? 'Fully booked' : 'Request a seat'}
                      </Button>
                    </Link>
                  )}

                  {event.booking_mode === 'external' && event.external_booking_url && (
                    <a
                      href={event.external_booking_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <Button
                        className="inline-flex items-center gap-2 rounded-full"
                        style={{ background: '#FAF8F2', color: '#15201F' }}
                      >
                        Book with the organiser
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}

                  {event.booking_mode === 'enquiry' && (
                    <Link to={`/contact?event=${event.slug}`}>
                      <Button className="rounded-full" style={{ background: '#FAF8F2', color: '#15201F' }}>
                        Ask about this event
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Said plainly, because the visitor is about to leave our
                    site and deal with someone else about their money. */}
                {event.booking_mode === 'external' && (
                  <p className="mt-4 text-xs" style={{ color: '#8A9A96' }}>
                    Booking and payment are handled by the organiser on their own site.
                  </p>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
};

const Fact = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border bg-white/70 p-4">
    <dt
      className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.18em] text-muted-foreground"
      style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
    >
      <Icon className="h-3 w-3" />
      {label}
    </dt>
    <dd className="mt-1.5 text-[15px]">{value}</dd>
  </div>
);

export default EventDetailPage;
