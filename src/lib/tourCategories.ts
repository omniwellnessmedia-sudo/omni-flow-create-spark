/**
 * Curated tour categories for browsing/filtering.
 *
 * The Viator sync only ever populates tour.category with "Tour" or "Tours" —
 * not a real taxonomy — so the category filter and chip strip on /tours had
 * nothing meaningful to group by. This classifies each tour from its title +
 * description into one of a small set of experience types a visitor actually
 * browses by, without needing a schema change or manual tagging pass.
 */

export const TOUR_CATEGORIES = [
  "Cape Winelands",
  "Ocean Adventures",
  "Boat Experiences",
  "Indigenous Heritage",
  "Wellness & Retreats",
  "Hiking & Nature",
  "Family-Friendly",
] as const;

export type TourCategory = (typeof TOUR_CATEGORIES)[number];

// Ordered by specificity: boat/wine/heritage keywords are checked before the
// broader nature/hiking bucket so e.g. a "wine tram" isn't caught by "tram"
// alone, and checked before family-friendly so a family wine tour still reads
// primarily as Winelands.
const RULES: Array<{ category: TourCategory; keywords: RegExp }> = [
  { category: "Cape Winelands", keywords: /\bwine(lands|ry|ries)?\b|\bvineyard|\bstellenbosch\b|\bfranschhoek\b|\bconstantia\b|\btasting\b/i },
  { category: "Boat Experiences", keywords: /\bboat\b|\byacht\b|\bcatamaran\b|\bcruise\b|\bsailing\b|\bkayak/i },
  { category: "Ocean Adventures", keywords: /\bocean\b|\bwhale\b|\bshark\b|\bsurf(ing)?\b|\bpenguin\b|\bbeach\b|\bcoastal\b|\bseal\b|\bdiving\b|\bsnorkel/i },
  { category: "Indigenous Heritage", keywords: /\bindigenous\b|\bheritage\b|\bcave\b|\bkhoe\b|\bsan\b|\bcultural\b|\btribal\b|\bancestr/i },
  { category: "Wellness & Retreats", keywords: /\bwellness\b|\bretreat\b|\byoga\b|\bmeditat|\bhealing\b|\bspa\b|\bmindful/i },
  { category: "Family-Friendly", keywords: /\bfamily\b|\bkids?\b|\bchildren\b/i },
  { category: "Hiking & Nature", keywords: /\bhik(e|ing)\b|\bmountain\b|\btrail\b|\bnature\b|\bforest\b|\bwildlife\b|\bsunrise\b|\bsunset\b|\blion'?s head\b|\btable mountain\b/i },
];

export function classifyTour(tour: { title?: string; description?: string; category?: string }): TourCategory {
  const haystack = `${tour.title || ""} ${tour.description || ""}`;
  for (const rule of RULES) {
    if (rule.keywords.test(haystack)) return rule.category;
  }
  // No keyword hit: fall back to the closest generic bucket rather than an
  // unhelpful raw "Tour"/"Tours" label.
  return "Hiking & Nature";
}
