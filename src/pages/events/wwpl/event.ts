/**
 * Single source of truth for the Celebrating Women Who Protect Life event.
 *
 * VERIFIED against the Chad ↔ The Masque correspondence (18 Jul) and the
 * Quicket listing (live since 13 Jul). Do not edit these from a design file or
 * a screenshot — if a fact changes, change it here and nowhere else, and mirror
 * it in scripts/prerender-event.mjs which duplicates a subset for the static
 * shell.
 *
 * HARD RULES that govern anything built on top of this:
 *   - Tickets sell ONLY on Quicket. Never reintroduce a native cart: Quicket
 *     holds the seat plan, and selling the same seats from our own inventory
 *     would double-sell allocated seats.
 *   - No graphic gassing or slaughter imagery anywhere. All artwork is derived
 *     from the official commissioned event artwork.
 *   - No false scarcity. The countdown is a real date delta and nothing else.
 *   - The full-day discount CODE is never printed on the page. Quicket
 *     confirmed (27 Jul) that email-issuing the code is the only mechanism
 *     their seated configuration supports safely.
 *   - ONLY OFFICIAL COMMISSIONED ARTWORK, plus real frames from the film. The
 *     poster, the banner and the three glyphs from the poster's own icon row
 *     are the artwork set; TRAILER_POSTER and the CLIPS posters are genuine
 *     screenshots supplied by the team on 3 Aug. The "motif" and "still" files
 *     that shipped with the design handoff were neither — they were separate
 *     synthetic images being presented as frames from the documentary, and were
 *     removed on 2 Aug. Do not reintroduce generated imagery here.
 *   - NO PEOPLE PHOTOGRAPHS until Chad gives written approval, with one narrow
 *     exception documented at TRAILER_POSTER: a poster frame taken from the
 *     very clip that tile plays. The BWC
 *     "Meet the Team" pack (2 Aug) states on its first page: "Review pack
 *     only. This document is not permission to publish." Of its 12 images only
 *     two are APPROVED (Heather Howe, Zaahira Mahomed); the rest are
 *     review-only fallbacks and Laureen Bertin is on hold with permission
 *     outstanding. Those photographs belong to a separate, unlisted BWC team
 *     page — never this public, ad-funded one.
 */

export const QUICKET_URL =
  "https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/";

export const PAGE_URL = "https://omniwellnessmedia.co.za/events/stunning-pigs";
export const ORIGIN = "https://omniwellnessmedia.co.za";

/** 1200x630 landscape crop of the official artwork — social cards centre-crop
 *  a square poster and lose the date and price, so this exists for sharing. */
export const OG_IMAGE = `${ORIGIN}/events/wwpl/og-landscape.jpg`;
export const POSTER = "/events/wwpl/final-square.webp";

export const CONTACT_EMAIL = "omniwellnessmedia@gmail.com";

/**
 * NOTE: the design handoff carried +27 74 524 5411, which conflicts with
 * +27 74 831 5961 in src/pages/Contact.tsx. The repo's Contact page is treated
 * as the verified source until someone confirms which is current — a wrong
 * number in the "buying with confidence" block is worse than none, because
 * that block exists to prove the business is reachable.
 */
export const CONTACT_PHONE = "+27 74 831 5961";

export const VENUE_NAME = "The Masque Theatre";
export const VENUE_ADDRESS = "37 Main Road, Muizenberg";
export const VENUE_QUERY = `${VENUE_NAME}, ${VENUE_ADDRESS}, Cape Town`;
export const VENUE_MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(VENUE_QUERY)}`;

export const EVENT_DATE_DISPLAY = "Monday 10 August 2026 — Women's Day public holiday";

/** Doors 10:00 SAST (= 08:00 UTC). Built from an explicit offset, never the
 *  visitor's local timezone. */
export const EVENT_START_MS = Date.UTC(2026, 7, 10, 8, 0, 0);

export const CAL = {
  title: "Celebrating Women Who Protect Life — Cape Town Premiere of Stunning Pigs",
  startUTC: "20260810T080000Z",
  endUTC: "20260810T140000Z",
  location: VENUE_QUERY,
  details: `Three sessions: What Feeds Us 10:00 · Stunning Pigs premiere + Q&A 12:00 · Voices for Women Showcase & Awards 14:00. Tickets R150/session on Quicket: ${QUICKET_URL}`,
};

export const GOOGLE_CAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(CAL.title)}` +
  `&dates=${CAL.startUTC}/${CAL.endUTC}` +
  `&details=${encodeURIComponent(CAL.details)}` +
  `&location=${encodeURIComponent(CAL.location)}`;

export const downloadIcs = () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Omni Wellness Media//Event//EN",
    "BEGIN:VEVENT",
    "UID:stunning-pigs-2026@omniwellnessmedia.co.za",
    `DTSTART:${CAL.startUTC}`,
    `DTEND:${CAL.endUTC}`,
    `SUMMARY:${CAL.title}`,
    `DESCRIPTION:${CAL.details.replace(/,/g, "\\,")}`,
    `LOCATION:${CAL.location.replace(/,/g, "\\,")}`,
    `URL:${PAGE_URL}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "celebrating-women-who-protect-life.ics";
  a.click();
  URL.revokeObjectURL(a.href);
};

export interface SessionDef {
  no: number;
  time: string;
  startISO: string;
  endISO: string;
  title: string;
  description: string;
  icon: string;
  feature?: boolean;
  cta: string;
}

export const SESSIONS: SessionDef[] = [
  {
    no: 1,
    time: "10:00 — Session 1",
    startISO: "2026-08-10T10:00:00+02:00",
    endISO: "2026-08-10T12:00:00+02:00",
    title: "What Feeds Us",
    description:
      "The day opens with What Feeds Us — food, ethics and community, setting the table for everything that follows.",
    icon: "/events/wwpl/icon-wheat.webp",
    cta: "Book this session",
  },
  {
    no: 2,
    time: "12:00 — Session 2",
    startISO: "2026-08-10T12:00:00+02:00",
    endISO: "2026-08-10T14:00:00+02:00",
    title: "Stunning Pigs — Cape Town Premiere",
    description:
      "The Cape Town premiere of the Stunning Pigs documentary, followed by a public Q&A with the Beauty Without Cruelty campaign and G.A.R.D.",
    icon: "/events/wwpl/icon-pig.webp",
    feature: true,
    cta: "Book the premiere",
  },
  {
    no: 3,
    time: "14:00 — Session 3",
    startISO: "2026-08-10T14:00:00+02:00",
    endISO: "2026-08-10T16:00:00+02:00",
    title: "Voices for Women — Showcase & Awards",
    description:
      "The day closes with live performances and the Voices for Women awards, honouring the women who protect life.",
    icon: "/events/wwpl/icon-mic.webp",
    cta: "Book this session",
  },
];

/** Feroza's cuts, in upload order (Drive "Clips" folder, 29 Jul). The design's
 *  CLIP_*_URL placeholders resolve to these. Each file must be shared
 *  "Anyone with the link — Viewer" or the embed shows a Google sign-in wall. */
export const TRAILER_FILE_ID = "1wfhWxDeOtED8vn-bKNm2UpbmCNXtzLDV";

/**
 * POSTER FRAMES. These are real frames from Stunning Pigs, screenshotted by the
 * team on 3 Aug and supplied specifically for use as video thumbnails (Drive
 * folder 1yVg6GFAkiar-o7uZu_8Lc4lLCBOQBO4O). They are NOT generated images and
 * NOT the "still" files that shipped with the design handoff — those were
 * synthetic and were deleted on 2 Aug.
 *
 * They are the only photographs of a person on this page, and they are frames
 * from the film the tile itself plays: tapping the tile streams the same face.
 * A poster from the clip is therefore not a new disclosure, which is why they
 * sit outside the "no people photographs" rule above.
 *
 * Only three frames were supplied, all of the same interviewee, so Clip 03 has
 * no poster and keeps the designed panel. Do not duplicate a frame across tiles
 * to fill the gap — identical thumbnails were the original complaint.
 */
export const TRAILER_POSTER = "/events/wwpl/frame-trailer.webp";

export const CLIPS = [
  { id: "1j2W-PPxhpZDPzwP1TVshlbIablN3Uc4p", tag: "Clip 01", poster: "/events/wwpl/frame-clip-01.webp" },
  { id: "1DjdwMvCOVegw7fFYGSCoWTYOqDSuHkTD", tag: "Clip 02", poster: "/events/wwpl/frame-clip-02.webp" },
  { id: "14y7dapbwvotxDf4IsPkTwqsJ2V4Hg8Zy", tag: "Clip 03" },
] as { id: string; tag: string; poster?: string }[];

export const drivePreview = (fileId: string) =>
  `https://drive.google.com/file/d/${fileId}/preview`;

export const PARTNERS = [
  { name: "Beauty Without Cruelty", role: "Campaign partner", logo: "/events/wwpl/bwc-rabbit.webp" },
  { name: "G.A.R.D.", role: "Campaign partner", logo: null },
  { name: "Vegan Streetfood", role: "Official vegan food partner", logo: null },
  { name: "Omni Wellness Media", role: "Organiser & presenter", logo: "/events/wwpl/omni-icon.webp", round: true },
  { name: "The Masque Theatre", role: "Host venue", logo: null },
];

/** Top-level site navigation, mirrored from UnifiedNavigation. This page is a
 *  standalone landing page on the same origin, so these are absolute links
 *  back into the main site rather than router routes. Keep in step with
 *  src/components/navigation/UnifiedNavigation.tsx. */
export const SITE_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Tours & Retreats", href: "/tours-retreats" },
  { label: "ROAM Store", href: "/roambuddy-store" },
  { label: "Services", href: "/services" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

export const PETITION_GOAL = 5000;

/** Must match ALLOWED_SLUGS in supabase/functions/sign-petition/index.ts and
 *  the seeded row in petition_counters. */
export const PETITION_SLUG = "stunning-pigs";
