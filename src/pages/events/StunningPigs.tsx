import { useEffect, useMemo, useState } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IMAGES } from "@/lib/images";
import { SmartImage } from "@/components/ui/smart-image";
import { trackAdsConversion } from "@/lib/googleAds";
import { useSEO, injectJSONLD } from "@/lib/seo";
import {
  MapPin, CalendarDays, Ticket, Users, Accessibility,
  GlassWater, ArrowDown, Loader2, Film, MessageCircle, Mic2, Utensils, ExternalLink,
  CalendarPlus, Share2, Copy, Play, ShieldCheck, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Celebrating Women Who Protect Life — Women's Day event at The Masque Theatre,
 * featuring the Cape Town premiere of the Stunning Pigs documentary.
 *
 * SOURCE OF TRUTH (verified 18 Jul against the Chad ↔ The Masque email thread):
 *   - Date: Monday 10 August 2026 (Women's Day public holiday)
 *   - Sessions: What Feeds Us 10:00 · Stunning Pigs 12:00 · Voices for Women
 *     Showcase & Awards Ceremony 14:00 — R150 per session
 *   - TICKETS ARE SOLD ON QUICKET (assigned seating, live since 13 Jul):
 *     https://qkt.io/Eu8CpR — this page is a promo pre-lander that routes there.
 *
 * NATIVE TICKET SALES ARE PERMANENTLY RETIRED FOR THIS EVENT. Quicket holds the
 * seat plan; selling seats from our own inventory in parallel would double-sell
 * seats Quicket has already allocated. Do not reconnect the cart flow.
 *
 * The full-day discount code exists but is distributed PRIVATELY to trusted
 * attendees (per Chad, and re-confirmed by Quicket on 27 Jul as the only
 * mechanism their seated configuration can support safely) — never print it
 * on this page.
 *
 * Content rules (fixed): factual, dignified framing; NO graphic gassing or
 * slaughter imagery anywhere; no false scarcity.
 *
 * CONVERSION NOTES (29 Jul, from Clarity + the Google Ads console):
 *   - Every CTA is a real <a href>, never window.open(). window.open ran
 *     synchronously inside the click handler, counted in full toward INP
 *     (measured 604ms) on the one interaction this page exists for, and is the
 *     path mobile popup-blockers kill. Tracking now runs in onClick and
 *     navigation is the browser's job.
 *   - Large poster/card/bar surfaces are anchors, not inert divs. Clarity
 *     measured dead clicks on 14.12% of sessions, overwhelmingly on
 *     button-shaped things that did nothing.
 *   - The trailer and the map are click-to-load facades. Both were eager
 *     third-party iframes worth ~1.5-2MB on an 85%-Android audience, and the
 *     Drive player's gapi loader is the source of the apis.google.com
 *     jsloader error Clarity recorded.
 */

const QUICKET_URL = "https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/";
const EVENT_DATE_DISPLAY = "Monday 10 August 2026 · Women's Day public holiday";
const PAGE_URL = "https://omniwellnessmedia.co.za/events/stunning-pigs";
const POSTER_URL = "https://omniwellnessmedia.co.za/events/wwpl-square.png";
const VENUE_QUERY = "The Masque Theatre, 37 Main Road, Muizenberg, Cape Town";
const VENUE_MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(VENUE_QUERY)}`;
const TRAILER_FILE_ID = "1wfhWxDeOtED8vn-bKNm2UpbmCNXtzLDV";
const CONTACT_EMAIL = "omniwellnessmedia@gmail.com";

/**
 * Feroza's cuts from the documentary, in upload order (Drive "Clips" folder,
 * 29 Jul). Labels are deliberately plain — they are numbered rather than
 * described because the cuts were not reviewed shot-by-shot before publishing.
 *
 * REQUIRES: each file must be shared "Anyone with the link — Viewer" in Drive.
 * A restricted file renders a Google sign-in wall inside the embed rather than
 * failing visibly, so it looks like a broken player to the visitor.
 *
 * These cost nothing on load: VideoFacade fetches only after a tap.
 */
const CLIPS = [
  { id: "1j2W-PPxhpZDPzwP1TVshlbIablN3Uc4p", label: "Clip 1" },
  { id: "1DjdwMvCOVegw7fFYGSCoWTYOqDSuHkTD", label: "Clip 2" },
  { id: "14y7dapbwvotxDf4IsPkTwqsJ2V4Hg8Zy", label: "Clip 3" },
  { id: "1zvXrHuG0QMCk6Lyn39aQcZfzK9BBOEWQ", label: "Clip 4" },
  { id: "1dpJyyA79Mcp-Z3yEN08HNVZ4dA_goROu", label: "Clip 5" },
  { id: "1qjnunjL-Ul1JUonAVuUuJFzeam7dXqNV", label: "Clip 6" },
];

// Shared by the Event node and every subEvent. Google requires location.address
// on each offline event and does NOT inherit it from the parent.
const EVENT_PLACE = {
  "@type": "Place",
  name: "The Masque Theatre",
  address: {
    "@type": "PostalAddress",
    streetAddress: "37 Main Road",
    addressLocality: "Muizenberg",
    addressRegion: "Western Cape",
    postalCode: "7945",
    addressCountry: "ZA",
  },
} as const;

// 10 Aug 2026, 10:00–16:00 SAST (UTC+2) — expressed in UTC for calendar links.
const CAL = {
  title: "Celebrating Women Who Protect Life — Cape Town Premiere of Stunning Pigs",
  startUTC: "20260810T080000Z",
  endUTC: "20260810T140000Z",
  location: VENUE_QUERY,
  details: `Three sessions: What Feeds Us 10:00 · Stunning Pigs premiere + Q&A 12:00 · Voices for Women Showcase & Awards 14:00. Tickets R150/session on Quicket: ${QUICKET_URL}`,
};

// Every input is a module constant, so build this once rather than on every
// render (it was previously re-running three encodeURIComponent calls per tick
// of the countdown).
const GOOGLE_CAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(CAL.title)}` +
  `&dates=${CAL.startUTC}/${CAL.endUTC}` +
  `&details=${encodeURIComponent(CAL.details)}` +
  `&location=${encodeURIComponent(CAL.location)}`;

// Apple/Outlook path: a standards-compliant .ics generated client-side.
const downloadIcs = () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Omni Wellness Media//Event//EN",
    "BEGIN:VEVENT",
    `UID:stunning-pigs-2026@omniwellnessmedia.co.za`,
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

const EVENT_START_MS = Date.UTC(2026, 7, 10, 8, 0, 0);

const SESSIONS = [
  {
    no: 1,
    time: "10:00",
    startUTC: "2026-08-10T10:00:00+02:00",
    endUTC: "2026-08-10T12:00:00+02:00",
    title: "What Feeds Us",
    description:
      "The day opens with What Feeds Us — food, ethics and community, setting the table for everything that follows.",
    icon: Utensils,
  },
  {
    no: 2,
    time: "12:00",
    startUTC: "2026-08-10T12:00:00+02:00",
    endUTC: "2026-08-10T14:00:00+02:00",
    title: "Stunning Pigs — Cape Town Premiere",
    description:
      "The main feature: the Cape Town premiere of the Stunning Pigs documentary, followed by a public Q&A with the Beauty Without Cruelty campaign and G.A.R.D.",
    icon: Film,
  },
  {
    no: 3,
    time: "14:00",
    startUTC: "2026-08-10T14:00:00+02:00",
    endUTC: "2026-08-10T16:00:00+02:00",
    title: "Voices for Women Showcase & Awards Ceremony",
    description:
      "The day closes with live performances and the Voices for Women awards, honouring women who protect life.",
    icon: Mic2,
  },
];

// Partner list per the live campaign coordination (Chad's tracking structure).
// Omni's role reads "Organiser & promoter", not "Media & production": Google's
// event-ticket certification review treats a media co-producer as a secondary
// reseller, which is the profile the certificate is designed to catch.
const PARTNERS = [
  { name: "Beauty Without Cruelty (BWC)", role: "Anchor", logo: IMAGES.partners?.bwc as string | undefined },
  { name: "G.A.R.D.", role: "Campaign partner", logo: undefined },
  { name: "Vegan Streetfood", role: "Food truck on the day", logo: undefined },
  { name: "Omni Wellness Media", role: "Organiser & promoter", logo: IMAGES.logos.omniPrimary },
  { name: "Travel and Tours Cape Town", role: "Campaign partner", logo: IMAGES.partners?.travelTours as string | undefined },
];

const track = (event: string, params: Record<string, unknown> = {}) => {
  const w = window as any;
  w.gtag?.("event", event, { campaign: "stunningpigs", ...params });
  w.tagClarityEvent?.(event, "stunningpigs");
};

/**
 * The trackable conversion for this event: the click through to Quicket.
 * Purchases complete on Quicket's domain. Quicket confirmed on 27 Jul that GA4
 * (G-X9DQ4DEHNB) can be connected to the event's details/checkout/completed
 * stages, and The Masque approved it in writing on 29 Jul — once that is live,
 * real purchases become visible and this click becomes a mid-funnel signal
 * rather than the terminal one.
 *
 * NOTE: trackAdsConversion currently no-ops into a GA4-only event because
 * ADS_CONVERSION_LABELS.quicket_ticket_click is still "" in src/lib/googleAds.ts.
 * The GA4 event `ads_quicket_ticket_click` DOES fire and can be imported as a
 * conversion in Google Ads today.
 */
const trackQuicket = (from: string) => {
  track("quicket_click", { from });
  trackAdsConversion("quicket_ticket_click", { value: 150, currency: "ZAR" });
};

/** Props shared by every element that navigates to Quicket. */
const quicketLinkProps = (from: string) => ({
  href: QUICKET_URL,
  target: "_blank",
  rel: "noopener",
  onClick: () => trackQuicket(from),
});

/**
 * Owns its own clock so the minute tick re-renders one <p> instead of the
 * whole 500-line page. Real date, real urgency, no false scarcity.
 */
const CountdownPill = () => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const diff = EVENT_START_MS - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);

  return (
    <p
      className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 text-sm font-medium text-rose-700 dark:text-rose-300 pointer-events-none"
      aria-live="off"
    >
      <CalendarDays className="h-4 w-4" aria-hidden="true" />
      {days}d {hours}h {mins}m until doors open
    </p>
  );
};

/**
 * Click-to-load video. Renders the poster + a real <button> until the user asks
 * for it, then mounts the Drive iframe. The trailer used to be a bare black
 * rectangle under a "Watch the trailer" heading — the single largest
 * tappable-but-inert surface on the page — and it pulled ~0.5-1MB of Drive
 * player JS on scroll. Nothing is fetched now until someone taps.
 *
 * Every clip on this page reuses this, so adding clips costs zero bytes on
 * load no matter how many there are.
 */
const VideoFacade = ({
  fileId,
  label,
  event,
}: {
  fileId: string;
  label: string;
  event: string;
}) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        title={label}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        track(event, { fileId });
        setPlaying(true);
      }}
      className="group absolute inset-0 h-full w-full cursor-pointer overflow-hidden"
      aria-label={`Play ${label}`}
    >
      <SmartImage
        src="/events/wwpl-square.webp"
        fallback="/events/wwpl-square.png"
        category="community"
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-75"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-transform group-hover:scale-105">
          <Play className="h-7 w-7 translate-x-0.5" aria-hidden="true" fill="currentColor" />
        </span>
        <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      </span>
    </button>
  );
};

const StunningPigs = () => {
  const [optinEmail, setOptinEmail] = useState("");
  const [optinBusy, setOptinBusy] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const seo = useMemo(
    () => ({
      title: "Celebrating Women Who Protect Life — 10 Aug at The Masque | Omni Wellness Media",
      description:
        "The Cape Town premiere of the Stunning Pigs documentary, on Women's Day at The Masque Theatre, Muizenberg. Three sessions — film, food, voices and awards. R150 per session, assigned seating.",
      url: PAGE_URL,
      canonical: PAGE_URL,
      image: POSTER_URL,
      type: "article",
    }),
    []
  );
  useSEO(seo);

  // schema.org/Event — the cheapest machine-readable proof that R150 ZAR is the
  // face value and that Omni Wellness Media is the organiser, which is exactly
  // what the Google Ads event-ticket certification review looks for. Also the
  // entry ticket to event rich results, where every auction competitor
  // (viagogo, stubhub, ticketmaster) already appears.
  useEffect(() => {
    injectJSONLD(
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Celebrating Women Who Protect Life — Cape Town Premiere of Stunning Pigs",
        description: seo.description,
        startDate: "2026-08-10T10:00:00+02:00",
        endDate: "2026-08-10T16:00:00+02:00",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: [POSTER_URL],
        url: PAGE_URL,
        location: EVENT_PLACE,
        organizer: {
          "@type": "Organization",
          "@id": "https://omniwellnessmedia.co.za/#organization",
          name: "Omni Wellness Media",
          url: "https://omniwellnessmedia.co.za",
        },
        offers: {
          "@type": "Offer",
          price: "150",
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
          url: QUICKET_URL,
          validFrom: "2026-07-13T00:00:00+02:00",
          category: "primary",
        },
        subEvent: SESSIONS.map((s) => ({
          "@type": "Event",
          name: s.title,
          startDate: s.startUTC,
          endDate: s.endUTC,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: EVENT_PLACE,
          url: PAGE_URL,
          image: [POSTER_URL],
          offers: {
            "@type": "Offer",
            price: "150",
            priceCurrency: "ZAR",
            availability: "https://schema.org/InStock",
            url: QUICKET_URL,
          },
        })),
      },
      "event-jsonld"
    );
    return () => document.getElementById("event-jsonld")?.remove();
  }, [seo.description]);

  useEffect(() => {
    track("view_event");
  }, []);

  const shareEvent = async (channel: "whatsapp" | "facebook" | "copy") => {
    track("share_event", { channel });
    const text = `${CAL.title} — ${EVENT_DATE_DISPLAY}. Tickets R150 on Quicket: ${QUICKET_URL}`;
    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } else if (channel === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PAGE_URL)}`, "_blank", "noopener,noreferrer");
    } else {
      try {
        await navigator.clipboard.writeText(PAGE_URL);
        toast.success("Link copied");
      } catch {
        toast.error("Couldn't copy — long-press the address bar instead.");
      }
    }
  };

  const submitOptin = async () => {
    const email = optinEmail.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setOptinBusy(true);
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email, source: "stunningpigs", interests: ["stunning-pigs"] },
      });
      if (error) throw error;
      toast.success("You're on the list — we'll keep you posted.");
      setOptinEmail("");
    } catch {
      toast.error("Couldn't sign you up just now — please try again.");
    } finally {
      setOptinBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero — dignified, factual. No graphic imagery. */}
      <section className="relative border-b border-border/50 bg-gradient-to-b from-rose-500/[0.06] via-background to-background">
        <div className="container mx-auto px-4 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="outline" className="mb-5 border-rose-500/40 text-rose-700 dark:text-rose-400 pointer-events-none">
              Cape Town Premiere · Women's Day, 10 August
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-4">
              Celebrating Women<br />Who Protect Life
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-6">
              One day at The Masque Theatre, Muizenberg — the Cape Town premiere of the{" "}
              <em>Stunning Pigs</em> documentary, plus a live Q&amp;A, and the{" "}
              <em>Voices for Women</em> awards.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <a
                href={GOOGLE_CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("add_to_calendar_google", { from: "hero-date" })}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <CalendarDays className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
                {EVENT_DATE_DISPLAY}
              </a>
              <a
                href={VENUE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("venue_map_open", { from: "hero-address" })}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
                The Masque Theatre, 37 Main Road, Muizenberg
              </a>
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
                Three sessions · 10:00, 12:00 &amp; 14:00 · assigned seating
              </p>
            </div>

            {/* Primary CTA sits directly under the facts — the amenities row,
                countdown and calendar buttons used to live above it and pushed
                it below the fold on every common Android viewport. */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="!bg-none !bg-rose-600 hover:!bg-rose-700 text-white whitespace-normal">
                <a {...quicketLinkProps("hero")}>
                  <Ticket className="h-4 w-4 mr-2" aria-hidden="true" />Get tickets — R150 a session
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#trailer" onClick={() => track("nav_trailer")}>
                  Watch the trailer <ArrowDown className="h-4 w-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <p className="mt-3 text-sm">
              <span className="font-medium text-foreground">R150 per session. Book one, two or all three.</span>{" "}
              <span className="text-muted-foreground">
                Assigned seating, sold by Quicket — The Masque Theatre's official ticketing partner.
              </span>
            </p>
          </div>

          {/* Official event artwork. WebP first (212KB) with the original PNG
              (673KB) as SmartImage's next fallback link, so ancient browsers
              still get a poster. Both are cached immutably — see netlify.toml,
              where they are listed by exact filename because /events/* also
              matches the SPA route for this very page.

              Deliberately NOT eager: below `lg` the grid stacks and the poster
              sits several hundred pixels below the fold, so eager-loading it
              only stole bandwidth from the text paint that actually is the LCP
              element for the 93% of sessions on a phone.

              It is also a link. A full-bleed event flyer is the most natural
              thing on the page to tap, and until now tapping it did nothing. */}
          <a
            {...quicketLinkProps("hero-poster")}
            className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <SmartImage
              src="/events/wwpl-square.webp"
              fallback="/events/wwpl-square.png"
              category="community"
              alt="Celebrating Women Who Protect Life — official event poster: Monday 10 August 2026 at The Masque Theatre, Muizenberg. Tickets from R150 on Quicket."
              aspectRatio="1 / 1"
              className="rounded-3xl border border-border/60 shadow-lg w-full object-cover transition-transform group-hover:scale-[1.01]"
            />
          </a>
        </div>
      </section>

      {/* Trailer — moved directly under the hero. It is the most persuasive
          asset on the page and previously sat below a wall of text, past where
          the average reader stops scrolling (73%). */}
      <section id="trailer" className="scroll-mt-24 container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="font-heading text-3xl mb-6 text-center">Watch the trailer</h2>
        <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-black" style={{ aspectRatio: "16 / 9" }}>
          <VideoFacade fileId={TRAILER_FILE_ID} label="Play the trailer" event="trailer_play" />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Trouble playing?{" "}
          <a
            href={`https://drive.google.com/file/d/${TRAILER_FILE_ID}/view`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("trailer_fallback_link")}
            className="underline underline-offset-2"
          >
            Watch on Google Drive
          </a>
        </p>
      </section>

      {/* Clips. Sits under the trailer so the strongest single asset still
          leads. Each tile is click-to-load, so six clips add zero bytes to the
          initial page — which matters on a page whose LCP problem was payload. */}
      <section id="clips" className="scroll-mt-24 container mx-auto px-4 pb-16 max-w-5xl">
        <h2 className="font-heading text-2xl mb-2 text-center">More from the film</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Short cuts from <em>Stunning Pigs</em>. Tap any one to play.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLIPS.map((c) => (
            <div
              key={c.id}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-black"
              style={{ aspectRatio: "16 / 9" }}
            >
              <VideoFacade fileId={c.id} label={c.label} event="clip_play" />
            </div>
          ))}
        </div>
      </section>

      {/* Sessions */}
      <section id="sessions" className="scroll-mt-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-16">
          <h2 className="font-heading text-3xl mb-2">Three sessions, one day</h2>
          <p className="text-base text-muted-foreground mb-8">
            Each session is R150. Come for one, come for all three.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {SESSIONS.map((s) => {
              const Icon = s.icon;
              return (
                /* The whole card is the target. It was a div with a small
                   button inside, styled exactly like a selectable plan card —
                   nine inert tap targets across the three cards. */
                <a
                  key={s.no}
                  {...quicketLinkProps(`session-${s.no}`)}
                  className={cn(
                    "group block rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500",
                    s.no === 2 ? "border-rose-500/60 ring-2 ring-rose-500/20 shadow-lg" : "border-border/60",
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", s.no === 2 ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <Badge variant={s.no === 2 ? "default" : "secondary"} className={cn("text-[10px]", s.no === 2 && "bg-rose-600 text-white")}>
                      {s.no === 2 ? "Main feature" : `Session ${s.no}`}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">{s.time}</p>
                  <h3 className="font-heading text-lg leading-snug mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.description}</p>
                  {/* Visual only — the anchor above is the hit target, so this
                      must not create a nested interactive element. */}
                  <span className="pointer-events-none flex h-11 w-full items-center justify-center rounded-lg bg-rose-600 text-sm font-medium text-white">
                    <Ticket className="h-4 w-4 mr-2" aria-hidden="true" />Book this session — R150
                  </span>
                </a>
              );
            })}
          </div>

          {/* Full-day access. The email-for-a-code mechanism is the only one
              Quicket's seated configuration can support safely (confirmed
              27 Jul), so it stays — but it was a two-word inline mailto in
              grey footnote type. Now a real 44px+ control, tracked, and it
              names the R450 it is beating so the three R150 buttons above
              stop reading as an unexplained triple charge.
              The code itself is never rendered. */}
          <div className="mt-8 mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-6 text-center">
            <h3 className="font-heading text-lg mb-2">Doing the whole day?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Booking all three sessions separately comes to R450. We hold a lower
              full-day rate for people coming for the full programme — email us and
              we'll send your code before you book.
            </p>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto whitespace-normal">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Full-day%20access%20—%20Celebrating%20Women%20Who%20Protect%20Life`}
                onClick={() => track("fullday_code_request")}
              >
                <Mail className="h-4 w-4 mr-2" aria-hidden="true" />Email us for full-day access
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Or write to <span className="font-medium">{CONTACT_EMAIL}</span> — we reply within one working day.
            </p>
          </div>
        </div>
      </section>

      {/* About — factual framing */}
      <section id="about" className="scroll-mt-24 container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="font-heading text-3xl mb-6">Why this day matters</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <em>Stunning Pigs</em> is a documentary examining the use of high-concentration
            CO2 gas stunning of pigs. The film presents what happens inside gas-stunning
            systems factually and without sensationalism, and asks a simple public
            question: do current practices meet the standard of humane treatment South
            Africans expect?
          </p>
          <p>
            The premiere is followed by a public Q&amp;A with the Beauty Without Cruelty
            campaign and G.A.R.D. — an open, respectful conversation about achievable,
            more humane standards. This is a public education event: no graphic footage
            is used in any of our promotion, and the day is designed to inform, not to shock.
          </p>
          <p>
            Held on Women's Day, the programme celebrates the women leading this work —
            opening with <em>What Feeds Us</em> and closing with the <em>Voices for
            Women</em> showcase and awards ceremony.
          </p>
        </div>
      </section>

      {/* Buying with confidence. Two jobs: answer the cold visitor's "who are
          you and why am I being sent to a domain I don't know", and give the
          Google Ads event-ticket certification reviewer the explicit
          organiser / face-value / no-markup statements they look for. The page
          previously carried none of this. */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="font-heading text-2xl mb-6 text-center">Buying with confidence</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <ShieldCheck className="h-5 w-5 text-rose-500 mb-2" aria-hidden="true" />
              <h3 className="font-medium mb-1 text-foreground">This is the official event page</h3>
              <p className="text-muted-foreground leading-relaxed">
                The day is organised and promoted by Omni Wellness Media, a Cape Town
                production company, in partnership with Beauty Without Cruelty and
                G.A.R.D., and hosted at The Masque Theatre in Muizenberg.
              </p>
            </div>
            <div>
              <Ticket className="h-5 w-5 text-rose-500 mb-2" aria-hidden="true" />
              <h3 className="font-medium mb-1 text-foreground">Face value, no markup</h3>
              <p className="text-muted-foreground leading-relaxed">
                R150 per session is the face value set for this event. Omni Wellness
                Media is not a ticket reseller and adds no booking fee or markup.
              </p>
            </div>
            <div>
              <ExternalLink className="h-5 w-5 text-rose-500 mb-2" aria-hidden="true" />
              <h3 className="font-medium mb-1 text-foreground">Why you finish on Quicket</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Masque sells its seats through Quicket, its official ticketing
                partner. You choose your exact seat there and your ticket arrives by
                email. Entry, refund and exchange conditions are governed by Quicket's
                terms for this event.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Omni Wellness Media · Cape Town, South Africa · +27 74 831 5961 ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>

      {/* Book — the single conversion surface. Nothing else interactive lives
          in this section; the share row and newsletter moved below so they
          stop competing at the decision moment. */}
      <section id="tickets" className="scroll-mt-24 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl mb-3">Get your seat</h2>
          <p className="text-muted-foreground mb-8">
            R150 per session with assigned seating, sold securely through Quicket —
            The Masque Theatre's official ticketing partner.
          </p>
          <Button size="lg" asChild className="!bg-none !bg-rose-600 hover:!bg-rose-700 text-white text-base px-8 whitespace-normal">
            <a {...quicketLinkProps("tickets-section")}>
              <Ticket className="h-5 w-5 mr-2" aria-hidden="true" />Choose your seats
              <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
            </a>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Opens Quicket in a new tab · card &amp; instant EFT · tickets emailed instantly
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <a
                href={GOOGLE_CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("add_to_calendar_google", { from: "tickets" })}
              >
                <CalendarPlus className="h-4 w-4 mr-1.5" aria-hidden="true" />Google Calendar
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { track("add_to_calendar_ics"); downloadIcs(); }}
              className="text-muted-foreground"
            >
              <CalendarPlus className="h-4 w-4 mr-1.5" aria-hidden="true" />Apple / Outlook (.ics)
            </Button>
          </div>
          <div className="mt-4 flex justify-center">
            <CountdownPill />
          </div>
        </div>
      </section>

      {/* Getting there. The Maps iframe is gone: it was ~0.6-0.9MB of
          third-party payload and tiles for a pre-lander that only needs a
          link, and on Android this deep-links straight into the Maps app. */}
      <section id="venue" className="scroll-mt-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <h2 className="font-heading text-2xl mb-2">Getting there</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The Masque Theatre, 37 Main Road, Muizenberg
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-2"><Accessibility className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />Wheelchair access</span>
            <span className="flex items-center gap-2"><GlassWater className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />Licensed bar</span>
            <span className="flex items-center gap-2"><Utensils className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />Vegan Streetfood truck</span>
          </p>
          <Button variant="outline" size="lg" asChild>
            <a
              href={VENUE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("venue_map_open", { from: "venue-section" })}
            >
              <MapPin className="h-4 w-4 mr-2" aria-hidden="true" />Open in Google Maps
            </a>
          </Button>
        </div>
      </section>

      {/* Partners */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl text-center mb-2">Presented with</h2>
        <p className="text-xs text-muted-foreground text-center mb-10">
          Hosted at The Masque Theatre — @masquetheatresa
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 max-w-4xl mx-auto">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-2 w-36 text-center">
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  className="h-14 w-auto max-w-[120px] object-contain"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                /* Plain heading type, not a rose pill. The pill version was
                   the same colour family and shape as the live CTA buttons,
                   so it read as a control and collected dead clicks. */
                <div className="h-14 flex items-center justify-center px-2 font-heading text-base text-foreground">
                  {p.name.replace(/ \(.*\)$/, "")}
                </div>
              )}
              <span className="text-xs font-medium leading-tight">{p.name}</span>
              <span className="text-xs text-muted-foreground -mt-1">{p.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Share + updates opt-in — below the primary CTA by design. The opt-in
          button is deliberately not rose: no non-Quicket action on this page
          should wear the CTA colour. */}
      <section className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 py-14 max-w-xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <span className="w-full text-xs text-muted-foreground mb-1">Spread the word</span>
            <Button variant="outline" size="sm" onClick={() => shareEvent("whatsapp")}>
              <Share2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />WhatsApp
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareEvent("facebook")}>
              <Share2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareEvent("copy")} aria-label="Copy event link">
              <Copy className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />Copy link
            </Button>
          </div>

          <MessageCircle className="h-8 w-8 text-rose-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-heading text-2xl mb-2">Stay close to the campaign</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Programme updates, honouree announcements, and how to add your voice for
            more humane standards.
          </p>
          {/* A real <form>, so the Android keyboard's Go key submits. It was a
              div, which left that key doing nothing. */}
          <form
            onSubmit={(e) => { e.preventDefault(); submitOptin(); }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="you@example.com"
              aria-label="Email address for event updates"
              autoComplete="email"
              enterKeyHint="go"
              className="h-12"
              value={optinEmail}
              onChange={(e) => setOptinEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            <Button type="submit" variant="outline" disabled={optinBusy} className="h-12 shrink-0">
              {optinBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Notify me"}
            </Button>
          </form>
        </div>
      </section>

      {/* Sticky mobile CTA — the whole bar is one anchor. Previously ~70% of it
          was inert text and only the small right-hand button converted, on the
          surface that is on screen for almost the entire session.
          It hides while the newsletter input has focus: on Android the
          keyboard either pushes this bar on top of the field or drops it
          behind the keyboard, and neither is useful mid-form. */}
      <a
        {...quicketLinkProps("sticky-bar")}
        className={cn(
          "fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-border bg-background/95 backdrop-blur px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3",
          emailFocused && "hidden"
        )}
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold truncate">From R150 · 10 August</span>
          <span className="block text-xs leading-4 text-muted-foreground">Assigned seating on Quicket</span>
        </span>
        <span className="pointer-events-none flex h-11 shrink-0 items-center rounded-lg bg-rose-600 px-4 text-sm font-medium text-white">
          <Ticket className="h-4 w-4 mr-1.5" aria-hidden="true" />Get tickets
        </span>
      </a>
      {/* Clears the sticky bar (≈73px + safe area); the old h-16 left it
          covering the last few pixels of the footer. */}
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))] sm:hidden" aria-hidden="true" />

      <Footer />
    </div>
  );
};

export default StunningPigs;
