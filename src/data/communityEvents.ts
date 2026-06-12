import { Leaf, Users, Heart, ArrowRight, Sparkles, type LucideIcon } from "lucide-react";

/**
 * Shared community-events source.
 *
 * Both the dashboard widget (CommunityCalendar) and the full events page
 * (CommunityEvents) read from here so they never drift apart. Events are
 * sample data for now, anchored on the current month so the calendar always
 * looks live — they'll move to a `community_events` Supabase table once the
 * schema lands, at which point only `getCommunityEvents` changes.
 */

export type CommunityEventCategory =
  | "cleanup"
  | "workshop"
  | "tour"
  | "drive"
  | "volunteer"
  | "wellness";

export interface CommunityEvent {
  id: string;
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
};

export const CATEGORY_STYLE: Record<CommunityEventCategory, string> = {
  cleanup: "bg-omni-green/10 text-omni-green",
  workshop: "bg-omni-orange/10 text-omni-orange",
  tour: "bg-omni-violet/10 text-omni-violet",
  drive: "bg-omni-blue/10 text-omni-blue",
  volunteer: "bg-primary/10 text-primary",
  wellness: "bg-omni-violet/10 text-omni-violet",
};

export const CATEGORY_LABEL: Record<CommunityEventCategory, string> = {
  cleanup: "Beach & Eco Cleanup",
  workshop: "Workshop",
  tour: "Community Tour",
  drive: "Donation Drive",
  volunteer: "Volunteering",
  wellness: "Wellness Session",
};

/**
 * Returns the community events, anchored to the current month so the calendar
 * is always populated regardless of when it's viewed. Spread across this month
 * and the next so the "next month" view isn't empty either.
 */
export const getCommunityEvents = (): CommunityEvent[] => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return [
    {
      id: "1",
      title: "Beach Cleanup",
      location: "Muizenberg Beach",
      date: new Date(y, m, 7, 9, 0),
      category: "cleanup",
      description: "Join the Omni community for a morning of caring for our coastline. Gloves, bags and refreshments provided.",
    },
    {
      id: "2",
      title: "Youth Empowerment Workshop",
      location: "Omni Wellness Studio, Cape Town",
      date: new Date(y, m, 16, 10, 0),
      category: "workshop",
      description: "A hands-on session helping young people build confidence, mindfulness and practical life skills.",
    },
    {
      id: "3",
      title: "Community Food Drive",
      location: "Hanover Park",
      date: new Date(y, m, 28, 11, 0),
      category: "drive",
      description: "Help pack and distribute nutritious food parcels to families in partnership with the Dr Phil Afel Foundation.",
    },
    {
      id: "4",
      title: "Sunrise Yoga & Mindfulness",
      location: "Sea Point Promenade",
      date: new Date(y, m, 21, 6, 30),
      category: "wellness",
      description: "Start your weekend grounded. An all-levels outdoor yoga and breathwork session open to the whole community.",
    },
    {
      id: "5",
      title: "Conscious Living Volunteer Day",
      location: "Khayelitsha Community Garden",
      date: new Date(y, m + 1, 5, 9, 0),
      category: "volunteer",
      description: "Spend a morning tending the community food garden and mentoring local growers.",
    },
    {
      id: "6",
      title: "Heritage Walking Tour",
      location: "Bo-Kaap, Cape Town",
      date: new Date(y, m + 1, 14, 10, 0),
      category: "tour",
      description: "A guided cultural walk celebrating Cape Town's heritage, with proceeds supporting local artisans.",
    },
  ];
};
