import { Leaf, Users, Heart, ArrowRight, Sparkles, Film, Mountain, type LucideIcon } from "lucide-react";
import { listPublishedEvents, type PublicEvent } from "@/lib/events";

/**
 * Community events, read from the database.
 *
 * WHAT WAS HERE BEFORE. This file used to hold six hardcoded events whose
 * dates were recomputed against the current month, with a comment explaining
 * that this was done "so the calendar always looks live". They were a beach
 * cleanup, a youth workshop, a food drive described as run in partnership with
 * a real foundation, a sunrise yoga session, a volunteer day and a heritage
 * walk. None of them existed. Anyone reading that calendar was being told
 * about events they could not attend, and one of them attributed an activity
 * to an organisation that had not agreed to it.
 *
 * They are gone. This module now reads published, human verified rows from
 * the events table. The calendar can therefore be empty, and empty is the
 * correct output when nothing is on. A calendar that is honestly empty is
 * worth more than one that is dishonestly full.
 *
 * The category icons and styles below are kept because the widgets that
 * consume them are unchanged.
 *
 * No em dashes in this file.
 */

export type CommunityEventCategory =
  | "cleanup"
  | "workshop"
  | "tour"
  | "drive"
  | "volunteer"
  | "wellness"
  | "screening"
  | "retreat"
  | "community"
  | "other";

export interface CommunityEvent {
  id: string;
  slug: string;
  title: string;
  location?: string;
  date: Date;
  category: CommunityEventCategory;
  description?: string;
}

export const CATEGORY_ICON: Record<CommunityEventCategory, LucideIcon> = {
  cleanup: Leaf,
  workshop: Users,
  tour: ArrowRight,
  drive: Heart,
  volunteer: Users,
  wellness: Sparkles,
  screening: Film,
  retreat: Mountain,
  community: Users,
  other: Sparkles,
};

export const CATEGORY_STYLE: Record<CommunityEventCategory, string> = {
  cleanup: "bg-omni-green/10 text-omni-green",
  workshop: "bg-omni-orange/10 text-omni-orange",
  tour: "bg-omni-violet/10 text-omni-violet",
  drive: "bg-omni-blue/10 text-omni-blue",
  volunteer: "bg-primary/10 text-primary",
  wellness: "bg-omni-violet/10 text-omni-violet",
  screening: "bg-omni-violet/10 text-omni-violet",
  retreat: "bg-omni-teal/10 text-omni-teal",
  community: "bg-omni-blue/10 text-omni-blue",
  other: "bg-muted text-muted-foreground",
};

export const CATEGORY_LABEL: Record<CommunityEventCategory, string> = {
  cleanup: "Cleanup",
  workshop: "Workshop",
  tour: "Tour",
  drive: "Drive",
  volunteer: "Volunteer",
  wellness: "Wellness",
  screening: "Screening",
  retreat: "Retreat",
  community: "Community",
  other: "Event",
};

const toCategory = (kind: string): CommunityEventCategory =>
  (Object.keys(CATEGORY_LABEL) as CommunityEventCategory[]).includes(kind as CommunityEventCategory)
    ? (kind as CommunityEventCategory)
    : "other";

/**
 * Published events as calendar entries.
 *
 * Returns a discriminated result rather than an array, so a caller cannot
 * mistake "the read failed" for "there is nothing on". That distinction is
 * the entire lesson of the data this file used to hold.
 *
 * Events with no date are omitted here and only here: they are real events
 * and appear in the events list, but a calendar has nowhere to draw them.
 */
export const loadCommunityEvents = async (): Promise<
  { ok: true; events: CommunityEvent[] } | { ok: false; reason: string }
> => {
  const res = await listPublishedEvents(null, null);
  if (!res.ok) return { ok: false, reason: res.reason };

  const events = res.data
    .filter((e: PublicEvent) => Boolean(e.event_date))
    .map((e: PublicEvent) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      location: [e.venue, e.city].filter(Boolean).join(", ") || undefined,
      date: new Date(`${e.event_date}T00:00:00`),
      category: toCategory(e.kind),
      description: e.summary ?? undefined,
    }))
    .filter((e) => !Number.isNaN(e.date.getTime()));

  return { ok: true, events };
};
