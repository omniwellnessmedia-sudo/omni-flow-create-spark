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

/**
 * Required production credit for What Feeds Us. Contractual, not decorative —
 * it must appear verbatim wherever the film is referenced, so it lives here as
 * one constant rather than being retyped at each of its three placements.
 * Do not reword, abbreviate, or split it.
 */
export const WHAT_FEEDS_US_CREDIT =
  "Commissioned by Humane World for Animals and produced by 1000 THINGS Productions.";

/**
 * Viewer advisory for Stunning Pigs, worded by Chad after his first-hand
 * full viewing of the completed film (internal brief, 5 Aug): no visible
 * slaughter, blood or gore, but emotionally difficult subject matter. He has
 * flagged that the wording may be adjusted once the classification position
 * is confirmed — if it changes, change it here only.
 *
 * Note this credit/advisory distinction: WHAT_FEEDS_US_CREDIT belongs to
 * What Feeds Us ONLY. Per the same brief, do not describe Humane World for
 * Animals as commissioner or rights holder of STUNNING PIGS anywhere.
 */
export const CONTENT_ADVISORY =
  "Stunning Pigs contains non-graphic footage and distressing discussion relating to pig farming, transport and carbon dioxide stunning. Some viewers may find the subject matter upsetting. Viewer discretion is advised.";

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
  /** Production credit rendered as fine print under the card's description. */
  credit?: string;
  /** Anchor of this session's trailer tile, when the film has one. */
  trailerHref?: string;
  /** Anchor of the awards section, for the session that hosts the ceremony. */
  awardsHref?: string;
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
    credit: WHAT_FEEDS_US_CREDIT,
    trailerHref: "#trailer-what-feeds-us",
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
    trailerHref: "#trailer-stunning-pigs",
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
    awardsHref: "#awards",
    cta: "Book this session",
  },
];

/* ------------------------------------------------------------------ awards */

/**
 * The Voices for Women honourees.
 *
 * These seven entries are transcribed VERBATIM from the designed profile
 * cards Feroza produced for public promotion (Drive folder "Awardees Womens
 * day event profile", supplied directly by Tumelo on 6 Aug). The `portrait`
 * files ARE those cards — square artwork carrying the portrait, name, role
 * and award citation in the event's own visual language. Their use here is
 * the narrow, documented exception to the page's no-people rule: promotional
 * cards produced by the campaign for the awardees, supplied by the team for
 * this purpose. Do not add anyone from the tracker spreadsheet who does not
 * yet have a produced card.
 *
 * The tracker ("Awardess Tracker Info", 5 Aug) lists 27 honourees in total;
 * cards for the rest are still in production. The grid centres partial rows,
 * so appending new entries needs no layout work.
 *
 * NOTE: the cards print the session as 14:00–16:30; the Quicket-verified
 * SESSIONS data says 14:00–16:00. Flagged to the team 6 Aug — per this
 * file's header, design files do not override verified facts, so SESSIONS
 * stands until the team confirms.
 */
export interface AwardeeDef {
  /** "[AWARDEE NAME]" until real; drives the anchor slug once real. */
  name: string;
  /** Role + award, verbatim from the produced card. */
  citation: string;
  /** The produced profile card under /events/wwpl/. Absent → rosette. */
  portrait?: string;
}

export const AWARDEES: AwardeeDef[] = [
  {
    name: "Louise Van Der Merwe",
    citation:
      "Founder & Managing Trustee, NatureBased Education. Award for Outstanding Contribution to Humane Education & Environmental Awareness.",
    portrait: "/events/wwpl/awardee-louise-van-der-merwe.webp",
  },
  {
    name: "Valerie Roscoe",
    citation:
      "Development Volunteer, Hazardous Poisons Committee, UnPoison South Africa. In recognition of her creative, cultural & community advocacy.",
    portrait: "/events/wwpl/awardee-valerie-roscoe.webp",
  },
  {
    name: "Nicola Van Wyk",
    citation:
      "Policy Advisor, FOUR PAWS South Africa. In recognition of her work in animal law & policy.",
    portrait: "/events/wwpl/awardee-nicola-van-wyk.webp",
  },
  {
    name: "Michelle Taberer",
    citation:
      "Founder and Chairperson, Stop Live Export South Africa. Award for Campaigning Against Live Animal Export by Sea.",
    portrait: "/events/wwpl/awardee-michelle-taberer.webp",
  },
  {
    name: "Karen de Klerk",
    citation:
      "Chairperson, Cape Animal Welfare Forum. Lifetime Achievement Award for Animal-Welfare Leadership and Sector Collaboration.",
    portrait: "/events/wwpl/awardee-karen-de-klerk.webp",
  },
  {
    name: "Megan Choritz",
    citation:
      "Writer, theatre director, actor, improviser, facilitator and activist. Award for Creative Courage, Theatre and Transformative Storytelling.",
    portrait: "/events/wwpl/awardee-megan-choritz.webp",
  },
  {
    name: "Dr Stephanie-Emmy Klarmann",
    citation:
      "Campaign Manager, Blood Lions. Award for Captive-Wildlife Campaigning and Youth Education.",
    portrait: "/events/wwpl/awardee-stephanie-emmy-klarmann.webp",
  },
];

/**
 * Awardee video, supplied by Tumelo on 6 Aug ("place it for now, details
 * later"). Context — who is in it, its title, where it belongs long-term —
 * is coming separately, so the tile carries a deliberately generic label
 * until then. Sharing verified 6 Aug: "Anyone with the link — Viewer", so
 * the Drive embed plays without a sign-in wall.
 */
export const AWARDS_VIDEO_FILE_ID = "14EtVqr_bZ412r_PFcpV7h7imuMMVlHO9";

/**
 * Every honouree card carries its own anchor so an awardee can share a link
 * that lands directly on her entry: /events/stunning-pigs#awardee-jane-doe.
 * Placeholder entries fall back to a stable numeric slug so the anchors exist
 * (and can be tested) before the names arrive; once a real name is set the
 * slug becomes awardee-firstname-lastname automatically. Honorifics are
 * stripped so the link stays personal ("awardee-stephanie-emmy-klarmann",
 * not "awardee-dr-stephanie-emmy-klarmann").
 */
export const awardeeAnchor = (a: AwardeeDef, index: number): string => {
  if (a.name.startsWith("[")) return `awardee-${index + 1}`;
  return (
    "awardee-" +
    a.name
      .toLowerCase()
      .replace(/^(dr|prof|adv|rev)\.?\s+/i, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
};

/** Feroza's cuts, in upload order (Drive "Clips" folder, 29 Jul). The design's
 *  CLIP_*_URL placeholders resolve to these. Each file must be shared
 *  "Anyone with the link — Viewer" or the embed shows a Google sign-in wall. */
export const TRAILER_FILE_ID = "1wfhWxDeOtED8vn-bKNm2UpbmCNXtzLDV";

/** What Feeds Us — the Session 1 film. Supplied by Candice on 4 Aug. */
export const WHAT_FEEDS_US_TRAILER_FILE_ID = "1xsZuZETVhTO3Sl_mF5wBrNYSglksePnH";

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

/**
 * Both films screening on the day, as co-equal trailers. Stunning Pigs is the
 * main feature and leads; What Feeds Us opens the day and follows.
 *
 * `anchor` gives each tile its own id so the session cards can deep-link to
 * the right trailer instead of dumping the visitor at the top of the section.
 *
 * The What Feeds Us poster is the film's official screening artwork, supplied
 * by the team on 4 Aug (WhatsApp). Its printed facts — Mon 10 Aug 2026,
 * 10:00–12:00, The Masque Theatre, R150, Quicket — were checked against this
 * file before use and match. If any of those facts ever change, this artwork
 * goes stale with them: replace it, don't crop the text out.
 */
export const TRAILERS = [
  {
    id: TRAILER_FILE_ID,
    anchor: "trailer-stunning-pigs",
    title: "Stunning Pigs",
    label: "Stunning Pigs — official trailer",
    session: "Session 2 · 12:00 — the Cape Town premiere",
    poster: TRAILER_POSTER,
  },
  {
    id: WHAT_FEEDS_US_TRAILER_FILE_ID,
    anchor: "trailer-what-feeds-us",
    title: "What Feeds Us",
    label: "What Feeds Us — official trailer",
    session: "Session 1 · 10:00 — opens the day",
    poster: "/events/wwpl/wfu-poster.webp",
    credit: WHAT_FEEDS_US_CREDIT,
  },
] as {
  id: string; anchor: string; title: string; label: string;
  session: string; poster?: string; credit?: string;
}[];

/* ---------------------------------------------------------------- partners */

/**
 * Each partner carries who they are in their own right (`blurb` — what the
 * organisation does, not what they do for this event) plus a link to their own
 * site or page. Blurb facts were checked against each organisation's public
 * site on 5 Aug; if one is wrong, fix it here, not in the section markup.
 *
 * Logos: G.A.R.D. and Vegan Streetfood supplied by Feroza on 5 Aug (Drive
 * links in the "Women's Day Event Page Changes" thread). Travel & Tours Cape
 * Town reuses the logo the main site already serves from its Supabase CDN
 * (src/lib/images.ts CORE.logos.ttct). The Masque Theatre logo lives in a
 * Drive folder that could not be listed from the build session — it renders
 * as a monogram + wordmark until the file itself is supplied.
 *
 * G.A.R.D. has no link because no official site or page could be verified at
 * build time — never guess a URL for a partner; an anchor to someone else's
 * page is worse than none.
 */
export interface PartnerDef {
  name: string;
  role: string;
  blurb: string;
  href?: string;
  logo?: string;
  /** Circular crop, for square icon-style marks. */
  round?: boolean;
}

export const PARTNERS: PartnerDef[] = [
  {
    name: "Beauty Without Cruelty South Africa",
    role: "Campaign anchor",
    blurb:
      "South Africa's oldest animal rights organisation, educating the public about the suffering of animals and kinder choices since 1975.",
    href: "https://bwcsa.co.za/",
    logo: "/events/wwpl/bwc-rabbit.webp",
  },
  {
    name: "G.A.R.D.",
    role: "Campaign partner",
    blurb:
      "Gauteng Animal Rights Defenders — grassroots campaigners standing up for the humane treatment of animals across Gauteng.",
    logo: "/events/wwpl/gard-logo.webp",
  },
  {
    name: "Omni Wellness Media",
    role: "Organiser & producer",
    blurb:
      "A Cape Town wellness media house producing campaigns, events and community programmes around conscious living.",
    href: ORIGIN,
    logo: "/events/wwpl/omni-icon.webp",
    round: true,
  },
  {
    name: "Travel and Tours Cape Town",
    role: "Campaign partner",
    blurb:
      "Cape Town tour operator running heritage and wellness journeys, from indigenous-heritage walks in Kalk Bay to coastal retreats.",
    href: `${ORIGIN}/tours-retreats`,
    logo: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/logo%20tt%20ct%20(1).png",
  },
  {
    name: "Vegan Streetfood",
    role: "Food partner on the day",
    blurb:
      "Cape Town's 100% plant-powered kitchen and food truck, serving vegan street food across the city.",
    href: "https://veganstreetfood.co.za/",
    logo: "/events/wwpl/vegan-streetfood.webp",
  },
  {
    name: "The Masque Theatre",
    role: "Venue & ticketing partner",
    blurb:
      "A community-driven theatre on Muizenberg's Main Road, staging professional and community productions since 1959.",
    href: "https://www.themasque.co.za/",
    logo: "/events/wwpl/masque-logo.webp",
  },
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
