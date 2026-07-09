import {
  Grape,
  Waves,
  Sailboat,
  Landmark,
  Heart,
  Mountain,
  Users,
  type LucideIcon,
} from "lucide-react";

// Viator only gives us a single raw tag per tour (see supabase/functions/viator-tours),
// which is far too inconsistent to browse by ("Tour", "Tours", a random first tag).
// The client asked for a fixed, curated set of experience categories instead - we
// resolve each tour into one of these by keyword-matching its title/description/raw
// category, rather than trusting whatever Viator happened to tag it with.
export interface TourCategoryDef {
  id: string;
  label: string;
  icon: LucideIcon;
  keywords: string[];
}

export const TOUR_CATEGORIES: TourCategoryDef[] = [
  {
    id: "cape-winelands",
    label: "Cape Winelands",
    icon: Grape,
    keywords: ["wine", "winelands", "vineyard", "cellar", "stellenbosch", "franschhoek", "constantia", "paarl"],
  },
  {
    id: "ocean-adventures",
    label: "Ocean Adventures",
    icon: Waves,
    keywords: ["ocean", "beach", "surf", "snorkel", "dive", "diving", "whale", "shark", "coastal", "sea", "swim"],
  },
  {
    id: "boat-experiences",
    label: "Boat Experiences",
    icon: Sailboat,
    keywords: ["boat", "sail", "yacht", "cruise", "catamaran", "ferry", "harbour", "harbor"],
  },
  {
    id: "indigenous-heritage",
    label: "Indigenous Heritage Experiences",
    icon: Landmark,
    keywords: ["indigenous", "heritage", "cultural", "culture", "history", "historic", "ancient", "tribal", "cave", "township"],
  },
  {
    id: "wellness-retreats",
    label: "Wellness and Retreats",
    icon: Heart,
    keywords: ["wellness", "retreat", "yoga", "meditation", "spa", "mindful", "healing", "wellbeing"],
  },
  {
    id: "hiking-nature",
    label: "Hiking and Nature",
    icon: Mountain,
    keywords: ["hike", "hiking", "mountain", "nature", "trail", "trek", "botanical", "fynbos", "reserve", "wildlife", "adventure"],
  },
  {
    id: "family-friendly",
    label: "Family-Friendly Experiences",
    icon: Users,
    keywords: ["family", "kids", "children", "penguin", "zoo", "aquarium", "farm", "kid-friendly"],
  },
];

const FALLBACK_LABEL = "More Experiences";

/**
 * Resolve a tour to one of the 7 curated categories by matching keywords against
 * its title, description, and Viator's raw category tag. Falls back to a generic
 * bucket when nothing matches rather than forcing a wrong category.
 */
export function resolveTourCategory(tour: { title?: string; description?: string; category?: string }): string {
  const haystack = `${tour.title || ""} ${tour.description || ""} ${tour.category || ""}`.toLowerCase();
  for (const def of TOUR_CATEGORIES) {
    if (def.keywords.some((kw) => haystack.includes(kw))) {
      return def.label;
    }
  }
  return FALLBACK_LABEL;
}

export function getTourCategoryIcon(label: string): LucideIcon {
  return TOUR_CATEGORIES.find((c) => c.label === label)?.icon || Mountain;
}
