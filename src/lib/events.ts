import { supabase } from '@/integrations/supabase/client';

/**
 * Reads for the public events calendar.
 *
 * Everything here goes through list_published_events or get_event rather than
 * selecting from the tables. Those functions apply the publication and
 * verification rules in one place, so a page cannot accidentally render a
 * draft or an unverified event by writing its own query.
 *
 * WHY LOADING STATE IS EXPLICIT. The calendar this replaces rendered six
 * invented events from a static file, timed to the current month so it always
 * looked populated. The failure mode to avoid is not an empty calendar, it is
 * a calendar that looks full when it is not, or one that silently shows
 * nothing when the read failed. So a failed read is reported as a failure and
 * never as an empty month.
 *
 * No em dashes in this file.
 */

export type EventKind =
  | 'screening'
  | 'workshop'
  | 'retreat'
  | 'community'
  | 'tour'
  | 'wellness'
  | 'cleanup'
  | 'drive'
  | 'volunteer'
  | 'other';

export type BookingMode = 'internal' | 'external' | 'enquiry' | 'none';

export interface PublicEvent {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  kind: EventKind;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  price_from_zar: number | null;
  is_free: boolean;
  external_booking_url: string | null;
  host_name: string | null;
  source: 'own' | 'submitted' | 'feed';
  booking_mode: BookingMode;
  listing_tier: 'standard' | 'featured' | 'sponsored';
  is_promoted: boolean;
  organiser_name: string | null;
  seats_remaining: number | null;
}

export interface EventSession {
  session_id: string | null;
  session_no: number | null;
  session_title: string | null;
  session_description: string | null;
  starts_at: string | null;
  allocation: number | null;
  remaining: number | null;
}

export interface EventDetail extends Omit<PublicEvent, 'seats_remaining' | 'is_promoted'> {
  status: string;
  sessions: EventSession[];
}

/** A read either succeeded with rows, or failed with a reason. Never both. */
export type ReadResult<T> = { ok: true; data: T } | { ok: false; reason: string };

const KIND_LABELS: Record<EventKind, string> = {
  screening: 'Screening',
  workshop: 'Workshop',
  retreat: 'Retreat',
  community: 'Community',
  tour: 'Tour',
  wellness: 'Wellness',
  cleanup: 'Cleanup',
  drive: 'Drive',
  volunteer: 'Volunteer',
  other: 'Event',
};

/** Spectrum hue per kind, so the calendar reads as part of the same system. */
const KIND_HUES: Record<EventKind, string> = {
  screening: '#5C2A8A',
  workshop: '#F38020',
  retreat: '#2BB9B9',
  community: '#2C6FB5',
  tour: '#4FAE3F',
  wellness: '#2BB9B9',
  cleanup: '#4FAE3F',
  drive: '#E63946',
  volunteer: '#F5C518',
  other: '#8A9A96',
};

export const kindLabel = (k: string | null | undefined): string =>
  KIND_LABELS[(k ?? 'other') as EventKind] ?? 'Event';

export const kindHue = (k: string | null | undefined): string =>
  KIND_HUES[(k ?? 'other') as EventKind] ?? KIND_HUES.other;

/**
 * Published events, optionally within a date window.
 *
 * The window is applied in the database rather than by filtering a full read,
 * so a calendar showing one month does not download every event we hold.
 */
export const listPublishedEvents = async (
  from?: Date | null,
  to?: Date | null
): Promise<ReadResult<PublicEvent[]>> => {
  const iso = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : null);
  try {
    const { data, error } = await (supabase as any).rpc('list_published_events', {
      p_from: iso(from),
      p_to: iso(to),
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true, data: (data ?? []) as PublicEvent[] };
  } catch (e: any) {
    return { ok: false, reason: e?.message || 'The events service did not respond.' };
  }
};

/**
 * One event with its sessions.
 *
 * get_event returns one row per session, with the event columns repeated, so
 * the rows are folded back into a single event here. An event with no
 * ticketed sessions still returns one row with null session fields, and that
 * is a real event, not an empty result.
 */
export const getEvent = async (slug: string): Promise<ReadResult<EventDetail | null>> => {
  try {
    const { data, error } = await (supabase as any).rpc('get_event', { p_slug: slug });
    if (error) return { ok: false, reason: error.message };

    const rows = (data ?? []) as any[];
    if (rows.length === 0) return { ok: true, data: null };

    const first = rows[0];
    const detail: EventDetail = {
      id: first.event_id,
      slug,
      title: first.title,
      summary: first.summary ?? null,
      kind: (first.kind ?? 'other') as EventKind,
      venue: first.venue ?? null,
      city: first.city ?? null,
      event_date: first.event_date ?? null,
      end_date: first.end_date ?? null,
      cover_image_url: first.cover_image_url ?? null,
      price_from_zar: first.price_from_zar ?? null,
      is_free: Boolean(first.is_free),
      external_booking_url: first.external_booking_url ?? null,
      host_name: first.host_name ?? null,
      source: (first.source ?? 'own') as PublicEvent['source'],
      booking_mode: (first.booking_mode ?? 'none') as BookingMode,
      listing_tier: (first.listing_tier ?? 'standard') as PublicEvent['listing_tier'],
      organiser_name: first.organiser_name ?? null,
      status: first.status,
      sessions: rows
        .filter((r) => r.session_id)
        .map((r) => ({
          session_id: r.session_id,
          session_no: r.session_no,
          session_title: r.session_title,
          session_description: r.session_description,
          starts_at: r.starts_at,
          allocation: r.allocation,
          remaining: r.remaining,
        })),
    };
    return { ok: true, data: detail };
  } catch (e: any) {
    return { ok: false, reason: e?.message || 'The events service did not respond.' };
  }
};

export interface EventSubmission {
  title: string;
  summary?: string;
  kind?: string;
  venue?: string;
  city?: string;
  event_date?: string;
  external_booking_url?: string;
  price_from_zar?: number | null;
  is_free?: boolean;
  organiser_name: string;
  organiser_email: string;
  organiser_phone?: string;
  notes?: string;
}

/**
 * Propose an event.
 *
 * This writes to event_submissions, never to events. A submission is not a
 * listing and cannot become one without a person promoting it, which is the
 * whole reason the two tables are separate.
 */
export const submitEvent = async (s: EventSubmission): Promise<ReadResult<true>> => {
  try {
    const { error } = await (supabase as any).from('event_submissions').insert({
      ...s,
      status: 'pending',
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true, data: true };
  } catch (e: any) {
    return { ok: false, reason: e?.message || 'Could not send the submission.' };
  }
};

/** Human date, or null when the event has no date yet. */
export const formatEventDate = (
  start: string | null,
  end?: string | null
): string | null => {
  if (!start) return null;
  const s = new Date(`${start}T00:00:00`);
  if (Number.isNaN(s.getTime())) return null;
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  if (!end || end === start) return fmt(s);
  const e = new Date(`${end}T00:00:00`);
  if (Number.isNaN(e.getTime())) return fmt(s);
  return `${s.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })} to ${fmt(e)}`;
};
