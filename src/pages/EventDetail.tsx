import { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2, MapPin, Calendar, ArrowLeft, AlertTriangle, ExternalLink, Ticket, User,
  Clock, CalendarPlus, Check, Minus, Plus, Users,
} from 'lucide-react';
import {
  getEvent, formatEventDate, kindLabel, kindHue,
  type EventDetail as Detail, type EventSession,
} from '@/lib/events';
import { getEventContent, type EventExtraContent, type EventTicketTier } from '@/data/eventContent';
import { calculateFees, formatZar } from '@/config/eventPricing';
import { useCart } from '@/components/CartProvider';
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
 * THE TICKETING EXPERIENCE. Three real modes, each honest about its plumbing.
 *
 *   internal   The seat reservation and payment we already run: pick a
 *              session, pick seats, see the fee before paying, pay here.
 *   external   The organiser tickets it elsewhere. The page still does the
 *              selling: the programme is interactive, picking sessions shows
 *              the published price tier that covers them, and the button
 *              hands over to the organiser's checkout with that plan made.
 *   enquiry    A conversation starts it. One button, straight to contact.
 *
 * Rich copy (programme, facilitators, what to bring) comes from
 * src/data/eventContent.ts, which mirrors published sources only. An event
 * without an entry renders exactly as a plain listing.
 *
 * No em dashes in this file.
 */

const SOURCE_NOTE: Record<string, string> = {
  own: 'Run by Omni Wellness Media.',
  submitted: 'Listed at the organiser’s request and checked by our team.',
  feed: 'Listed from the organiser’s own published calendar.',
};

const INK = '#15201F';
const CREAM = '#FAF8F2';
const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

/** Milliseconds until the event starts, or null when unknowable or past. */
const untilStart = (date: string | null, clock?: string): number | null => {
  if (!date) return null;
  // Venue local time. South Africa has no daylight saving, so +02:00 holds.
  const t = new Date(`${date}T${clock ?? '00:00'}:00+02:00`).getTime();
  if (Number.isNaN(t)) return null;
  const diff = t - Date.now();
  return diff > 0 ? diff : null;
};

const Countdown = ({ date, clock, hue }: { date: string | null; clock?: string; hue: string }) => {
  const [left, setLeft] = useState<number | null>(() => untilStart(date, clock));
  useEffect(() => {
    const id = window.setInterval(() => setLeft(untilStart(date, clock)), 30_000);
    return () => window.clearInterval(id);
  }, [date, clock]);

  if (left === null) return null;
  const days = Math.floor(left / 86_400_000);
  const hours = Math.floor((left % 86_400_000) / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  const parts: Array<[number, string]> = [
    [days, days === 1 ? 'day' : 'days'],
    [hours, hours === 1 ? 'hour' : 'hours'],
    [minutes, minutes === 1 ? 'minute' : 'minutes'],
  ];
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Time until the event starts">
      {parts.map(([n, label]) => (
        <span
          key={label}
          className="inline-flex items-baseline gap-1.5 rounded-full border bg-white/70 px-3.5 py-1.5"
        >
          <span className="font-wwpl-display text-lg font-medium" style={{ color: INK }}>{n}</span>
          <span className="text-[10px] uppercase tracking-[.16em] text-muted-foreground" style={mono}>
            {label}
          </span>
        </span>
      ))}
      <span className="text-[10px] uppercase tracking-[.16em]" style={{ ...mono, color: hue }}>
        until it starts
      </span>
    </div>
  );
};

/** Build and download an .ics file so the plan survives the visit. */
const downloadIcs = (event: Detail, content: EventExtraContent | null) => {
  if (!event.event_date) return;
  const compact = (clock?: string) =>
    `${event.event_date!.replace(/-/g, '')}T${(clock ?? '09:00').replace(':', '')}00`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Omni Wellness Media//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.slug}@omniwellnessmedia.co.za`,
    `DTSTART;TZID=Africa/Johannesburg:${compact(content?.startClock)}`,
    `DTEND;TZID=Africa/Johannesburg:${compact(content?.endClock ?? content?.startClock)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${[event.venue, event.city].filter(Boolean).join(', ')}`,
    `URL:https://omniwellnessmedia.co.za/events/${event.slug}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * The published tier that covers a number of chosen sessions. Only tiers the
 * organiser publishes are shown; nothing here computes a price they did not
 * state.
 */
const tierFor = (tiers: EventTicketTier[], count: number): EventTicketTier | null => {
  if (count <= 0) return null;
  const exact = tiers.find((t) => t.covers === count);
  if (exact) return exact;
  // More sessions than any counted tier: the all-sessions pass covers it.
  return tiers.find((t) => t.covers === 'all') ?? null;
};

/** Interactive planner for events ticketed on the organiser's own platform. */
const ExternalTicketPanel = ({
  event,
  content,
  selected,
  hue,
}: {
  event: Detail;
  content: EventExtraContent;
  selected: Set<number>;
  hue: string;
}) => {
  const tiers = content.tickets ?? [];
  const total = content.programme?.length ?? 0;
  const count = selected.size;
  const chosen = tiers.length > 0 ? tierFor(tiers, count) : null;

  return (
    <div className="rounded-2xl p-6" style={{ background: INK }}>
      <p className="text-[10px] uppercase tracking-[.2em]" style={{ ...mono, color: '#8A9A96' }}>
        Tickets
      </p>
      <h2 className="mt-1 font-wwpl-display text-2xl font-medium" style={{ color: CREAM }}>
        Book your place
      </h2>

      {tiers.length > 0 && (
        <ul className="mt-4 space-y-2">
          {tiers.map((t) => {
            const active = chosen?.label === t.label;
            return (
              <li
                key={t.label}
                className="flex items-baseline justify-between gap-3 rounded-xl px-3.5 py-2.5"
                style={{
                  background: active ? `${hue}2E` : 'rgba(250,248,242,.06)',
                  outline: active ? `1px solid ${hue}` : '1px solid transparent',
                }}
              >
                <span className="text-sm" style={{ color: CREAM }}>
                  {t.label}
                  {t.note ? <span style={{ color: '#8A9A96' }}> · {t.note}</span> : null}
                </span>
                <span className="whitespace-nowrap text-sm font-medium" style={{ color: CREAM }}>
                  R{t.priceZar}
                  {t.savingZar ? (
                    <span className="ml-2 text-[11px]" style={{ color: '#B9C6C2' }}>
                      save R{t.savingZar}
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {total > 0 && (
        <p className="mt-3 text-xs" style={{ color: '#B9C6C2' }}>
          {count === 0
            ? 'Tap sessions in the programme to plan your day. The matching ticket shows here.'
            : count >= total
              ? 'The full day selected. One pass covers every session.'
              : `${count} ${count === 1 ? 'session' : 'sessions'} selected.`}
        </p>
      )}

      {event.external_booking_url && (
        <a
          href={event.external_booking_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-5 block"
        >
          <Button
            className="w-full justify-center gap-2 rounded-full text-[15px]"
            size="lg"
            style={{ background: CREAM, color: INK }}
          >
            {chosen ? `Book ${chosen.label.toLowerCase()} · R${chosen.priceZar}` : 'Get tickets'}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      )}

      {content.ticketNote && (
        <p className="mt-3 text-xs" style={{ color: '#8A9A96' }}>{content.ticketNote}</p>
      )}
      {/* Said plainly, because the visitor is about to leave our site and
          deal with someone else about their money. */}
      <p className="mt-3 text-xs" style={{ color: '#8A9A96' }}>
        Booking and payment are handled by the organiser on their own site.
      </p>
    </div>
  );
};

/** Seat picker and fee display for events we ticket ourselves. */
const InternalTicketPanel = ({ event }: { event: Detail }) => {
  const { addItem, updateQuantity, items } = useCart();
  const navigate = useNavigate();
  const bookable = event.sessions.filter((s) => s.session_id);
  const [sessionId, setSessionId] = useState<string | null>(
    bookable.find((s) => (s.remaining ?? 0) > 0)?.session_id ?? null
  );
  const [seats, setSeats] = useState(1);

  const session = bookable.find((s) => s.session_id === sessionId) ?? null;
  const remaining = session?.remaining ?? 0;
  const priceZar = event.price_from_zar ? Number(event.price_from_zar) : 0;
  const maxSeats = Math.max(0, Math.min(10, remaining));

  const fees = calculateFees({
    ticketCents: Math.round(priceZar * 100),
    quantity: seats,
    isFree: event.is_free,
    feePayer: event.fee_payer,
    feeBps: event.fee_bps,
  });

  const addToCart = () => {
    if (!session?.session_id) return;
    const id = `event-${event.slug}-${session.session_id}`;
    const perTicketCents = Math.round(fees.attendeePaysCents / Math.max(1, seats));
    const existing = items.find((i) => i.id === id);
    addItem({
      id,
      title: `${event.title}${session.session_title ? `: ${session.session_title}` : ''}`,
      // The attendee price per ticket, fee included, so the cart total and
      // the breakdown shown here cannot disagree.
      price_zar: perTicketCents / 100,
      item_type: 'event_ticket',
      event_session_id: session.session_id,
      seats_per_unit: 1,
      category: 'event',
      location: [event.venue, event.city].filter(Boolean).join(', ') || undefined,
    });
    updateQuantity(id, (existing?.quantity ?? 0) + seats);
    navigate('/checkout');
  };

  if (bookable.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: INK }}>
      <p className="text-[10px] uppercase tracking-[.2em]" style={{ ...mono, color: '#8A9A96' }}>
        Tickets
      </p>
      <h2 className="mt-1 font-wwpl-display text-2xl font-medium" style={{ color: CREAM }}>
        Book your place
      </h2>

      {bookable.length > 1 && (
        <div className="mt-4 space-y-2">
          {bookable.map((s) => (
            <button
              key={s.session_id}
              onClick={() => { setSessionId(s.session_id); setSeats(1); }}
              disabled={(s.remaining ?? 0) === 0}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm disabled:opacity-50"
              style={{
                background: sessionId === s.session_id ? 'rgba(250,248,242,.14)' : 'rgba(250,248,242,.06)',
                color: CREAM,
              }}
            >
              <span>{s.session_title ?? `Session ${s.session_no}`}</span>
              <span className="text-xs" style={{ color: '#B9C6C2' }}>
                {(s.remaining ?? 0) > 0 ? `${s.remaining} left` : 'Fully booked'}
              </span>
            </button>
          ))}
        </div>
      )}

      {session && maxSeats > 0 ? (
        <>
          <div className="mt-4 flex items-center justify-between rounded-xl px-3.5 py-2.5" style={{ background: 'rgba(250,248,242,.06)' }}>
            <span className="text-sm" style={{ color: CREAM }}>Seats</span>
            <span className="inline-flex items-center gap-3">
              <button
                aria-label="One seat fewer"
                onClick={() => setSeats((n) => Math.max(1, n - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'rgba(250,248,242,.12)', color: CREAM }}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-medium" style={{ color: CREAM }}>{seats}</span>
              <button
                aria-label="One seat more"
                onClick={() => setSeats((n) => Math.min(maxSeats, n + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'rgba(250,248,242,.12)', color: CREAM }}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>

          {/* The money, itemised before any button is pressed. */}
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt style={{ color: '#B9C6C2' }}>Tickets ({seats})</dt>
              <dd style={{ color: CREAM }}>{formatZar(Math.round(priceZar * 100) * seats)}</dd>
            </div>
            {fees.platformFeeCents > 0 && event.fee_payer === 'attendee' && (
              <div className="flex justify-between">
                <dt style={{ color: '#B9C6C2' }}>Booking fee</dt>
                <dd style={{ color: CREAM }}>{formatZar(fees.platformFeeCents)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t pt-1.5" style={{ borderColor: 'rgba(250,248,242,.15)' }}>
              <dt className="font-medium" style={{ color: CREAM }}>Total</dt>
              <dd className="font-medium" style={{ color: CREAM }}>
                {formatZar(fees.attendeePaysCents)}
              </dd>
            </div>
          </dl>

          <Button
            className="mt-5 w-full justify-center rounded-full text-[15px]"
            size="lg"
            style={{ background: CREAM, color: INK }}
            onClick={addToCart}
          >
            Book {seats} {seats === 1 ? 'seat' : 'seats'}
          </Button>
          <p className="mt-3 text-xs" style={{ color: '#8A9A96' }}>
            Seats are only confirmed at payment, so nobody can be charged for a
            session that just sold out.
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm" style={{ color: '#B9C6C2' }}>
          Every session is fully booked.
        </p>
      )}
    </div>
  );
};

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  // Programme sessions the visitor has tapped, by index. Drives the planner.
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const content = getEventContent(slug);

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
  const priceLabel = event
    ? event.is_free
      ? 'Free'
      : event.price_from_zar
        ? `From R${Number(event.price_from_zar).toFixed(0)}`
        : 'Confirmed on booking'
    : '';

  const toggleSession = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const hasPanel =
    event &&
    (event.booking_mode === 'external' ||
      (event.booking_mode === 'internal' && event.sessions.length > 0) ||
      event.booking_mode === 'enquiry');

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
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
                  <p className="mt-2 text-xs text-amber-900" style={mono}>
                    {problem}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : event ? (
            <>
              {/* Hero */}
              <header className="relative mt-8 overflow-hidden rounded-3xl border bg-white/60 p-7 md:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-[340px] w-[340px] rounded-full opacity-[.16] blur-3xl"
                  style={{ background: `radial-gradient(circle, ${hue}, transparent 70%)` }}
                />
                <p
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
                  style={mono}
                >
                  <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: hue }} />
                  {kindLabel(event.kind)}
                  {when && <span aria-hidden="true">·</span>}
                  {when}
                </p>
                <h1 className="mt-3 max-w-[24ch] font-wwpl-display text-4xl font-medium leading-tight md:text-5xl">
                  {event.title}
                </h1>
                {content?.tagline && (
                  <p className="mt-3 text-lg font-medium" style={{ color: hue }}>
                    {content.tagline}
                  </p>
                )}
                {!content?.tagline && event.summary && (
                  <p className="mt-4 max-w-[62ch] text-lg text-muted-foreground">{event.summary}</p>
                )}

                <Countdown date={event.event_date} clock={content?.startClock} hue={hue} />

                <div className="mt-6 flex flex-wrap gap-3">
                  {hasPanel && (
                    <a href="#tickets">
                      <Button className="rounded-full" style={{ background: INK, color: CREAM }}>
                        <Ticket className="mr-2 h-4 w-4" />
                        {event.booking_mode === 'enquiry' ? 'Ask about this event' : `Tickets ${priceLabel !== 'Confirmed on booking' ? `· ${priceLabel}` : ''}`}
                      </Button>
                    </a>
                  )}
                  {event.event_date && (
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => downloadIcs(event, content)}
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Add to calendar
                    </Button>
                  )}
                </div>
              </header>

              {event.cover_image_url && (
                <img
                  src={event.cover_image_url}
                  alt=""
                  className="mt-6 aspect-[21/9] w-full rounded-3xl border object-cover"
                />
              )}

              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
                {/* Left column: the story of the day */}
                <div className="min-w-0">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {when && <Fact icon={Calendar} label="When" value={when} />}
                    {content?.timeLabel && (
                      <Fact icon={Clock} label="Time" value={content.timeLabel} />
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
                    <Fact icon={Ticket} label="Cost" value={priceLabel} />
                  </dl>

                  {content?.intro && (
                    <section className="mt-10">
                      {content.intro.map((p) => (
                        <p key={p.slice(0, 32)} className="mt-4 max-w-[68ch] text-[17px] leading-relaxed text-foreground/85 first:mt-0">
                          {p}
                        </p>
                      ))}
                      {content.doorsNote && (
                        <p className="mt-4 max-w-[68ch] text-sm text-muted-foreground">{content.doorsNote}</p>
                      )}
                    </section>
                  )}
                  {!content && event.summary && (
                    <p className="mt-10 max-w-[68ch] text-[17px] leading-relaxed text-foreground/85">
                      {event.summary}
                    </p>
                  )}

                  {/* The published programme, interactive when tiers exist */}
                  {content?.programme && content.programme.length > 0 && (
                    <section className="mt-12" aria-label="Programme">
                      <h2 className="font-wwpl-display text-3xl font-medium">The sessions</h2>
                      {(content.tickets?.length ?? 0) > 0 && (
                        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
                          Tap the sessions you want. The ticket panel matches your plan to the
                          published prices.
                        </p>
                      )}
                      <ol className="mt-6 space-y-4">
                        {content.programme.map((s, i) => {
                          const active = selected.has(i);
                          const interactive = (content.tickets?.length ?? 0) > 0;
                          return (
                            <li key={s.title}>
                              <button
                                type="button"
                                disabled={!interactive}
                                onClick={() => toggleSession(i)}
                                aria-pressed={active}
                                className="group w-full rounded-2xl border bg-white/70 p-5 text-left transition-all disabled:cursor-default md:p-6"
                                style={{
                                  borderColor: active ? s.hue : undefined,
                                  boxShadow: active ? `0 10px 26px ${s.hue}22` : undefined,
                                }}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <p
                                    className="flex items-center gap-2 text-[11px] uppercase tracking-[.16em]"
                                    style={{ ...mono, color: s.hue }}
                                  >
                                    <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: s.hue }} />
                                    {s.starts} to {s.ends}
                                  </p>
                                  {interactive && (
                                    <span
                                      className="flex h-6 w-6 items-center justify-center rounded-full border transition-colors"
                                      style={{
                                        background: active ? s.hue : 'transparent',
                                        borderColor: active ? s.hue : '#C9C4B8',
                                        color: 'white',
                                      }}
                                      aria-hidden="true"
                                    >
                                      {active && <Check className="h-3.5 w-3.5" />}
                                    </span>
                                  )}
                                </div>
                                <h3 className="mt-2 font-wwpl-display text-[22px] font-medium leading-snug">
                                  {s.title}
                                </h3>
                                <p className="mt-0.5 text-sm font-medium text-foreground/75">
                                  with {s.facilitator}
                                </p>
                                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
                                  {s.body}
                                </p>
                                {s.facilitatorNote && (
                                  <p className="mt-2 text-xs text-muted-foreground">{s.facilitatorNote}</p>
                                )}
                                {s.familyNote && (
                                  <p className="mt-3 inline-flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-xs" style={{ background: `${s.hue}14`, color: INK }}>
                                    <Users className="mt-[1px] h-3.5 w-3.5 shrink-0" style={{ color: s.hue }} />
                                    {s.familyNote}
                                  </p>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                      {content.programmeNote && (
                        <p className="mt-4 text-xs text-muted-foreground">{content.programmeNote}</p>
                      )}
                    </section>
                  )}

                  {/* Ticketed sessions we hold seats for */}
                  {event.sessions.length > 0 && (
                    <section className="mt-12">
                      <h2 className="font-wwpl-display text-2xl font-medium">Sessions</h2>
                      <div className="mt-4 space-y-3">
                        {event.sessions.map((s: EventSession) => (
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

                  {content?.bring && content.bring.length > 0 && (
                    <section className="mt-12">
                      <h2 className="font-wwpl-display text-2xl font-medium">What to bring</h2>
                      <ul className="mt-4 space-y-2">
                        {content.bring.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-[15px] text-foreground/85">
                            <Check className="mt-1 h-4 w-4 shrink-0" style={{ color: hue }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {content?.goodToKnow && content.goodToKnow.length > 0 && (
                    <section className="mt-12">
                      <h2 className="font-wwpl-display text-2xl font-medium">Good to know</h2>
                      <ul className="mt-4 max-w-[68ch] space-y-2.5">
                        {content.goodToKnow.map((g) => (
                          <li key={g.slice(0, 32)} className="text-sm leading-relaxed text-muted-foreground">
                            {g}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {(content?.address || event.venue) && (
                    <section className="mt-12">
                      <h2 className="font-wwpl-display text-2xl font-medium">Getting there</h2>
                      <p className="mt-3 text-[15px] text-foreground/85">
                        {[event.venue, content?.address ?? event.city].filter(Boolean).join(' · ')}
                      </p>
                      {content?.directionsUrl && (
                        <a
                          href={content.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                          style={{ color: hue }}
                        >
                          <MapPin className="h-4 w-4" />
                          Get directions
                        </a>
                      )}
                    </section>
                  )}
                </div>

                {/* Right column: the action, sticky so it travels with the read */}
                <aside id="tickets" className="lg:sticky lg:top-24 lg:self-start">
                  {event.booking_mode === 'external' && content && (
                    <ExternalTicketPanel event={event} content={content} selected={selected} hue={hue} />
                  )}

                  {event.booking_mode === 'external' && !content && event.external_booking_url && (
                    <div className="rounded-2xl p-6" style={{ background: INK }}>
                      <h2 className="font-wwpl-display text-2xl font-medium" style={{ color: CREAM }}>
                        Book your place
                      </h2>
                      <a href={event.external_booking_url} target="_blank" rel="noopener noreferrer nofollow" className="mt-5 block">
                        <Button className="w-full justify-center gap-2 rounded-full" size="lg" style={{ background: CREAM, color: INK }}>
                          Book with the organiser
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <p className="mt-3 text-xs" style={{ color: '#8A9A96' }}>
                        Booking and payment are handled by the organiser on their own site.
                      </p>
                    </div>
                  )}

                  {event.booking_mode === 'internal' && <InternalTicketPanel event={event} />}

                  {event.booking_mode === 'enquiry' && (
                    <div className="rounded-2xl p-6" style={{ background: INK }}>
                      <h2 className="font-wwpl-display text-2xl font-medium" style={{ color: CREAM }}>
                        Book your place
                      </h2>
                      <p className="mt-2 text-sm" style={{ color: '#B9C6C2' }}>
                        Bookings for this one start with a conversation.
                      </p>
                      <Link to={`/contact?event=${event.slug}`} className="mt-5 block">
                        <Button className="w-full justify-center rounded-full" size="lg" style={{ background: CREAM, color: INK }}>
                          Ask about this event
                        </Button>
                      </Link>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-muted-foreground">
                    {/* A named host outranks the generic note: saying we run
                        an event somebody else hosts would be untrue. */}
                    {event.source === 'own' && event.host_name
                      ? `Hosted by ${event.host_name}, listed by Omni Wellness Media.`
                      : SOURCE_NOTE[event.source] ?? SOURCE_NOTE.own}
                  </p>
                </aside>
              </div>

              {/* Mobile: the action follows the thumb */}
              {hasPanel && (
                <div
                  className="fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 backdrop-blur lg:hidden"
                  style={{ background: 'rgba(250,248,242,.92)' }}
                >
                  <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: INK }}>{priceLabel}</p>
                      {when && <p className="text-[11px] text-muted-foreground">{when}</p>}
                    </div>
                    <a href="#tickets">
                      <Button className="rounded-full" style={{ background: INK, color: CREAM }}>
                        {event.booking_mode === 'enquiry' ? 'Ask about it' : 'Get tickets'}
                      </Button>
                    </a>
                  </div>
                </div>
              )}
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
      style={mono}
    >
      <Icon className="h-3 w-3" />
      {label}
    </dt>
    <dd className="mt-1.5 text-[15px]">{value}</dd>
  </div>
);

export default EventDetailPage;
