import { useEffect, useMemo, useState } from "react";
import { useSEO, injectJSONLD } from "@/lib/seo";
import { trackAdsConversion } from "@/lib/googleAds";
import { trackEventPageView } from "@/lib/socialPixels";
import { cn } from "@/lib/utils";
import {
  QUICKET_URL, PAGE_URL, ORIGIN, OG_IMAGE, POSTER, CONTACT_EMAIL, CONTACT_PHONE,
  VENUE_NAME, VENUE_ADDRESS, VENUE_MAPS_URL, EVENT_DATE_DISPLAY, EVENT_START_MS,
  GOOGLE_CAL_URL, downloadIcs, SESSIONS, CLIPS, TRAILERS,
  PARTNERS, AWARDEES, awardeeAnchor, AWARDS_VIDEO_FILE_ID, SITE_NAV,
  WHAT_FEEDS_US_CREDIT, CONTENT_ADVISORY,
  drivePreview,
} from "./wwpl/event";
import { BtnLink, BtnButton, Eyebrow, Reveal, SecHead } from "./wwpl/ui";
import { PetitionForm } from "./wwpl/PetitionForm";
import { SeatingMap } from "./wwpl/SeatingMap";
import { CtaBand } from "./wwpl/CtaBand";

/**
 * Celebrating Women Who Protect Life — Women's Day event at The Masque
 * Theatre, featuring the Cape Town premiere of the Stunning Pigs documentary.
 *
 * Facts, URLs and hard content rules live in ./wwpl/event.ts — read the header
 * comment there before changing anything on this page.
 *
 * This is a deliberate visual island: it carries its OWN header and footer
 * rather than the site's UnifiedNavigation/Footer, so the whole page can hold
 * one design language (plum/gold, Cormorant headings, Oswald micro-labels,
 * Inter body) per the approved handoff.
 *
 * It does still carry real site navigation (SITE_NAV, mirrored from
 * UnifiedNavigation). The handoff specified a bare brand-plus-breadcrumb header
 * on the argument that a campaign landing page should not leak clicks, but in
 * review that read as the site simply having no navigation. The compromise: nav
 * is present but visually quiet, and gold stays reserved for the ticket CTA so
 * nothing competes with it.
 *
 * WHAT MUST SURVIVE ANY REDESIGN OF THIS PAGE:
 *   - Every ticket CTA is a real <a href> to Quicket that calls trackQuicket().
 *     Not window.open — it counted toward INP on the one interaction that
 *     matters and mobile popup blockers kill it.
 *   - The Event JSON-LD, the canonical/OG tags, and the prerendered shell
 *     (scripts/prerender-event.mjs) — social scrapers and the Google Ads
 *     event-ticket reviewer do not execute JavaScript.
 *   - The "buying with confidence" copy. It is legally load-bearing: it states
 *     who organises the event, that R150 is face value, and that we are not a
 *     reseller. Do not paraphrase without approval.
 */

const track = (event: string, params: Record<string, unknown> = {}) => {
  const w = window as any;
  w.gtag?.("event", event, { campaign: "stunningpigs", ...params });
  w.tagClarityEvent?.(event, "stunningpigs");
};

/**
 * NOTE: ADS_CONVERSION_LABELS.quicket_ticket_click is still "" in
 * src/lib/googleAds.ts, so this reports to GA4 only. The GA4 event
 * `ads_quicket_ticket_click` fires and can be imported as a Google Ads
 * conversion today; pasting the label lights up the direct path.
 */
const trackQuicket = (from: string) => {
  track("quicket_click", { from });
  trackAdsConversion("quicket_ticket_click", { value: 150, currency: "ZAR" });
};

const quicketProps = (from: string) => ({
  href: QUICKET_URL,
  target: "_blank",
  rel: "noopener",
  onClick: () => trackQuicket(from),
});

/* ---------------------------------------------------------------- countdown */

const pad = (n: number) => String(n).padStart(2, "0");

const Countdown = () => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Stop ticking while the tab is hidden — a 1s interval on a backgrounded
    // marketing page is pure battery cost on the 85%-Android audience.
    let id: number | undefined;
    const start = () => { if (id === undefined) id = window.setInterval(() => setNow(Date.now()), 1000); };
    const stop = () => { if (id !== undefined) { window.clearInterval(id); id = undefined; } };
    const onVis = () => (document.hidden ? stop() : (setNow(Date.now()), start()));
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const d = Math.max(0, EVENT_START_MS - now);
  const units = [
    { v: Math.floor(d / 864e5), l: "Days" },
    { v: Math.floor(d / 36e5) % 24, l: "Hours" },
    { v: Math.floor(d / 6e4) % 60, l: "Minutes" },
    { v: Math.floor(d / 1e3) % 60, l: "Seconds" },
  ];

  return (
    <div className="mt-9 flex flex-wrap gap-3" aria-label="Countdown to the premiere">
      {units.map((u) => (
        <div key={u.l} className="w-[78px] rounded-xl border border-[rgba(240,217,168,.22)] bg-[rgba(249,245,240,.05)] px-0 pt-3 pb-2.5 text-center">
          <b className="block font-wwpl-display font-semibold text-[30px] leading-none text-wwpl-goldLight tabular-nums">
            {pad(u.v)}
          </b>
          <span className="mt-1 block font-wwpl-cond font-light text-[10.5px] tracking-[.22em] uppercase text-[rgba(249,245,240,.55)]">
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------ awardee copy link */

/**
 * Quiet per-card control that copies the awardee's personal anchor URL —
 * honourees share these links with their families and communities, so the
 * affordance has to exist on the card itself. Clipboard API with a prompt()
 * fallback; feedback swaps the label in place — nothing on this page pops
 * over content.
 */
const CopyAnchorButton = ({ anchor, name }: { anchor: string; name: string }) => {
  const [copied, setCopied] = useState(false);
  const url = `${PAGE_URL}#${anchor}`;
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          track("awardee_link_copied", { anchor });
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this link", url);
        }
      }}
      aria-label={`Copy a direct link to ${name}'s entry`}
      className="mt-5 self-start font-wwpl-cond text-[11.5px] tracking-[.16em] uppercase text-[rgba(240,217,168,.65)] underline underline-offset-[3px] transition-colors hover:text-wwpl-gold"
    >
      {copied ? "Link copied" : "Copy link to this entry"}
    </button>
  );
};

/* ------------------------------------------------------------------- video */

/**
 * Click-to-load video. Nothing is fetched from Drive until someone taps.
 *
 * NO POSTER IMAGE, DELIBERATELY. Two earlier attempts both failed honestly:
 * Drive's own thumbnail returns 200 with a blank image for files it cannot
 * thumbnail (so the onError fallback never fires and the tile paints black),
 * and the bundled "stills" that shipped with the design handoff were not frames
 * from the documentary at all — they were separate synthetic images. Dressing a
 * film about factory farming with invented stills is not something this page
 * should do.
 *
 * So the tile is an honest designed panel: brand gradient, play control, and a
 * label. It reads as a deliberate player rather than a broken image, and it
 * cannot misrepresent the film.
 *
 * `poster` is that promised escape hatch, now filled: the team supplied real
 * screenshots from the film on 3 Aug. A tile with a poster draws the frame; a
 * tile without one keeps the designed panel. The gradient stays underneath as
 * the background either way, so a poster that fails to load degrades to the
 * panel rather than to a black rectangle — the exact failure the Drive
 * thumbnail endpoint used to cause.
 */
const VideoTile = ({
  fileId, label, kicker, poster, main = false,
}: { fileId: string; label: string; kicker?: string; poster?: string; main?: boolean }) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={drivePreview(fileId)}
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
      onClick={() => { track(main ? "trailer_play" : "clip_play", { fileId }); setPlaying(true); }}
      className={cn(
        "group absolute inset-0 h-full w-full overflow-hidden",
        "bg-[radial-gradient(120%_120%_at_50%_0%,#43122E_0%,#2A0A1E_70%)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwpl-gold"
      )}
      aria-label={`Play ${label}`}
    >
      {poster ? (
        <>
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={main ? 1280 : 640}
            height={main ? 720 : 360}
            className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]"
          />
          {/* Scrim. One frame is a dusk interior and is already near-black, so
              this stays light: the gold play control carries the contrast, and
              a heavier wash would crush that shot to a flat rectangle. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,10,30,.30)_0%,rgba(42,10,30,.16)_45%,rgba(42,10,30,.62)_100%)]"
          />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(115deg,transparent_0_22px,rgba(240,217,168,.06)_22px_23px)]"
        />
      )}
      {main && poster ? (
        /* Poster-backed feature tile: the artwork carries its own composition
           (and, for What Feeds Us, its own gold typography), so a centred
           overlay would sit on top of it. The play control tucks into the
           bottom-left as a compact pill instead, leaving the artwork legible. */
        <span className="absolute inset-0 flex items-end justify-start p-5 sm:p-6">
          <span className="flex items-center gap-3 rounded-full bg-[rgba(20,5,12,.55)] py-2 pl-2 pr-5 backdrop-blur-[3px] motion-safe:transition-transform group-hover:scale-[1.04]">
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[rgba(217,179,108,.95)] text-[15px] text-wwpl-plum shadow-[0_4px_18px_rgba(0,0,0,.45)]">
              <span className="pl-1">▶</span>
            </span>
            <span className="font-wwpl-cond text-[12px] uppercase tracking-[.2em] text-wwpl-goldLight">
              {kicker ?? "Play the trailer"}
            </span>
          </span>
        </span>
      ) : (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span
            className={cn(
              "flex items-center justify-center rounded-full text-wwpl-plum",
              "motion-safe:transition-transform group-hover:scale-[1.06]",
              main
                ? "h-[84px] w-[84px] bg-[rgba(217,179,108,.95)] text-[26px] shadow-[0_8px_32px_rgba(0,0,0,.4)] motion-safe:animate-wwpl-pulse"
                : "h-[46px] w-[46px] bg-[rgba(217,179,108,.9)] text-[16px]"
            )}
          >
            <span className="pl-1.5">▶</span>
          </span>
          <span
            className={cn(
              "font-wwpl-cond uppercase tracking-[.22em] text-wwpl-goldLight",
              main ? "text-[12px]" : "text-[10.5px]"
            )}
          >
            {kicker ?? "Play the trailer"}
          </span>
        </span>
      )}
    </button>
  );
};

/* ------------------------------------------------------------------- sticky */

const StickyBar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Shown once the hero has scrolled past, hidden whenever the real ticket
    // CTA or the footer is on screen — never compete with the actual CTA.
    const hero = document.getElementById("hero");
    const tickets = document.getElementById("tickets");
    const footer = document.getElementById("site-footer");
    let heroPast = false;
    let ctaVisible = false;

    const sync = () => setShow(heroPast && !ctaVisible);

    const heroIo = new IntersectionObserver(
      ([e]) => { heroPast = e.boundingClientRect.top < 0 && !e.isIntersecting; sync(); },
      { rootMargin: "-80px 0px 0px 0px" }
    );
    const ctaIo = new IntersectionObserver(
      (entries) => {
        ctaVisible = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.01 }
    );

    if (hero) heroIo.observe(hero);
    if (tickets) ctaIo.observe(tickets);
    if (footer) ctaIo.observe(footer);
    return () => { heroIo.disconnect(); ctaIo.disconnect(); };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[60] bg-[rgba(42,10,30,.96)] backdrop-blur-[10px] shadow-[0_-10px_34px_rgba(21,32,31,.3)]",
        "transition-transform duration-[350ms] ease-out pb-[env(safe-area-inset-bottom)]",
        show ? "translate-y-0" : "translate-y-[110%]"
      )}
    >
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="min-w-0">
          <b className="block font-wwpl-display text-[17px] leading-tight text-white">
            Celebrating Women Who Protect Life
          </b>
          <span className="hidden text-[14px] text-[rgba(249,245,240,.85)] lg:block">
            Mon 10 Aug 2026 · The Masque Theatre · from R150
          </span>
        </div>
        <BtnLink {...quicketProps("sticky-bar")} variant="gold" className="shrink-0 whitespace-nowrap px-[22px] py-2.5">
          Get tickets
        </BtnLink>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------- page */

const StunningPigs = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const seo = useMemo(
    () => ({
      title: "Celebrating Women Who Protect Life — 10 Aug at The Masque | Omni Wellness Media",
      description:
        "The Cape Town premiere of the Stunning Pigs documentary, on Women's Day at The Masque Theatre, Muizenberg. Three sessions — film, food, voices and awards. R150 per session, assigned seating.",
      url: PAGE_URL,
      canonical: PAGE_URL,
      image: OG_IMAGE,
      type: "article",
    }),
    []
  );
  useSEO(seo);

  useEffect(() => {
    track("view_event");
    // Meta/TikTok ViewContent. No-ops until a real pixel ID is configured —
    // see src/lib/socialPixels.ts.
    trackEventPageView();
  }, []);

  useEffect(() => {
    const PLACE = {
      "@type": "Place",
      name: VENUE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: "37 Main Road",
        addressLocality: "Muizenberg",
        addressRegion: "Western Cape",
        postalCode: "7945",
        addressCountry: "ZA",
      },
    };
    const offer = {
      "@type": "Offer",
      price: "150",
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url: QUICKET_URL,
    };
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
        image: [OG_IMAGE, `${ORIGIN}${POSTER}`],
        url: PAGE_URL,
        location: PLACE,
        organizer: {
          "@type": "Organization",
          "@id": `${ORIGIN}/#organization`,
          name: "Omni Wellness Media",
          url: ORIGIN,
        },
        offers: { ...offer, validFrom: "2026-07-13T00:00:00+02:00", category: "primary" },
        subEvent: SESSIONS.map((s) => ({
          "@type": "Event",
          name: s.title,
          startDate: s.startISO,
          endDate: s.endISO,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: PLACE,
          url: PAGE_URL,
          image: [OG_IMAGE],
          offers: offer,
        })),
      },
      "event-jsonld"
    );
    return () => document.getElementById("event-jsonld")?.remove();
  }, [seo.description]);

  const wrap = "mx-auto w-full max-w-[1120px] px-5 sm:px-8";

  return (
    <div className="min-h-screen bg-wwpl-creamSoft font-sans text-wwpl-ink [scroll-behavior:smooth]">
      {/* 1 — Header. The handoff specified brand lockup + breadcrumb only, on
          the reasoning that a campaign landing page should not leak clicks.
          In review that read as the site having no navigation at all, so real
          nav is back — but rendered in this page's own visual language rather
          than pulling in the site chrome, and the ticket CTA stays the only
          gold element so nothing competes with it. */}
      <header className="border-b border-wwpl-line bg-white">
        <div className={cn(wrap, "flex h-[68px] items-center justify-between gap-4")}>
          <a href={ORIGIN} className="flex items-center gap-2.5 shrink-0" onClick={() => track("nav_home")}>
            <img src="/events/wwpl/omni-icon.webp" alt="" aria-hidden="true"
              width={36} height={36} className="h-9 w-9 rounded-full" />
            <span className="whitespace-nowrap font-wwpl-display font-semibold text-[20px] tracking-[.01em] text-wwpl-ink">
              Omni Wellness Media
            </span>
          </a>

          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {SITE_NAV.map((n) => (
              <a
                key={n.label}
                href={`${ORIGIN}${n.href}`}
                onClick={() => track("nav_click", { to: n.href })}
                className="text-[14px] text-wwpl-slate transition-colors hover:text-wwpl-goldDeep"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <p className="hidden text-[13px] text-wwpl-slate xl:block">
              Events / <span className="font-medium text-wwpl-ink">Celebrating Women Who Protect Life</span>
            </p>
            <BtnButton
              type="button"
              variant="ghost"
              aria-expanded={menuOpen}
              aria-controls="wwpl-mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden !px-3 !py-2 text-[14px]"
            >
              {menuOpen ? "Close" : "Menu"}
            </BtnButton>
          </div>
        </div>

        {menuOpen && (
          <nav id="wwpl-mobile-nav" aria-label="Main" className="border-t border-wwpl-line bg-white lg:hidden">
            <div className={cn(wrap, "flex flex-col py-2")}>
              {SITE_NAV.map((n) => (
                <a
                  key={n.label}
                  href={`${ORIGIN}${n.href}`}
                  onClick={() => track("nav_click", { to: n.href })}
                  className="border-b border-wwpl-line/60 py-3 text-[15px] text-wwpl-ink last:border-0"
                >
                  {n.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* 2 — Hero */}
      <section
        id="hero"
        className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_78%_0%,#5A1A3E_0%,#43122E_38%,#2A0A1E_78%)]"
      >
        <span aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_72%_42%,rgba(217,179,108,.14),transparent_70%)]" />
        <div className={cn(wrap, "relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-[88px]")}>
          <div>
            <Eyebrow rule className="text-[13px] tracking-[.28em] text-wwpl-rose">
              Cape Town Premiere · Women's Day
            </Eyebrow>
            <h1 className="mt-5 font-wwpl-display font-semibold text-[clamp(40px,8vw,64px)] leading-[1.08] text-white">
              Celebrating{" "}
              <em className="italic bg-[linear-gradient(178deg,#F7E9C6,#EBCE93_45%,#C99A52_75%)] bg-clip-text text-transparent motion-safe:bg-[length:250%_auto] motion-safe:animate-wwpl-shimmer">
                Women
              </em>{" "}
              Who Protect Life
            </h1>
            <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.7] text-[rgba(249,245,240,.82)]">
              One day at The Masque Theatre, Muizenberg — the Cape Town premiere of the{" "}
              <i className="text-wwpl-goldLight">Stunning Pigs</i> documentary, plus a live Q&amp;A and the{" "}
              <i className="text-wwpl-goldLight">Voices for Women</i> showcase and awards.
            </p>

            <div className="mt-8 grid gap-3.5">
              {[
                { k: "Date", v: EVENT_DATE_DISPLAY },
                { k: "Venue", v: `${VENUE_NAME}, ${VENUE_ADDRESS}` },
                { k: "Sessions", v: "10:00 · 12:00 · 14:00 — assigned seating" },
              ].map((f) => (
                <div key={f.k} className="flex items-baseline gap-3.5">
                  <span className="w-[76px] shrink-0 font-wwpl-cond text-[12px] tracking-[.22em] uppercase text-wwpl-gold">
                    {f.k}
                  </span>
                  <span className="text-[15.5px] text-[rgba(249,245,240,.9)]">{f.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3.5">
              <BtnLink {...quicketProps("hero")} variant="gold">Get tickets — from R150</BtnLink>
              <BtnLink href="#trailer" variant="ghostLight" onClick={() => track("nav_trailer", { from: "hero" })}>
                Watch the trailers
              </BtnLink>
            </div>

            <p className="mt-4 max-w-[52ch] text-[13px] leading-relaxed text-[rgba(249,245,240,.55)]">
              R150 per session. Book one, two or all three. Sold securely by Quicket — The Masque
              Theatre's official ticketing partner.
            </p>

            <Countdown />
          </div>

          {/* Poster is the LCP element on desktop; eager + high priority, and
              preloaded from the prerendered shell. */}
          <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
            <img
              src={POSTER}
              alt="Celebrating Women Who Protect Life — official event artwork: Monday 10 August 2026 at The Masque Theatre, Muizenberg. Tickets from R150."
              width={800}
              height={800}
              fetchPriority="high"
              decoding="async"
              className="w-full rounded-2xl shadow-wwpl-lg [box-shadow:0_12px_40px_rgba(42,10,30,.18),0_30px_80px_rgba(42,10,30,.12),0_0_90px_rgba(217,179,108,.22)] motion-safe:animate-wwpl-float"
            />
          </div>
        </div>
      </section>

      {/* 3 — Sessions */}
      <section id="sessions" className="scroll-mt-8 py-24">
        <div className={wrap}>
          <SecHead
            eyebrow="The programme"
            title="Three experiences, one day"
            sub="Each session is R150. Come for one, come for all three."
          />
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {SESSIONS.map((s, i) => (
              <Reveal key={s.no} delayMs={(i % 3) * 90} className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col rounded-[20px] p-8 sm:p-9 motion-safe:transition-all motion-safe:duration-[250ms] hover:-translate-y-1.5",
                    s.feature
                      ? "border border-wwpl-plum bg-[linear-gradient(165deg,#43122E,#2A0A1E)] text-wwpl-cream shadow-wwpl-lg"
                      : "border border-wwpl-line bg-white shadow-[0_1px_2px_rgba(21,32,31,.05)] hover:shadow-wwpl-md"
                  )}
                >
                  {s.feature && (
                    <span className="mb-[18px] self-start rounded-full bg-wwpl-gold px-3 py-[5px] font-wwpl-cond text-[11px] tracking-[.22em] uppercase text-wwpl-plum">
                      Main feature
                    </span>
                  )}
                  <span className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[rgba(217,179,108,.45)] bg-wwpl-plum">
                    <img src={s.icon} alt="" aria-hidden="true" loading="lazy" decoding="async"
                      className="h-full w-full scale-[1.12] object-cover" />
                  </span>
                  <span className={cn("font-wwpl-cond font-medium text-[15px] tracking-[.14em]",
                    s.feature ? "text-wwpl-gold" : "text-wwpl-goldDeep")}>
                    {s.time}
                  </span>
                  <h3 className={cn("mt-3 font-wwpl-display font-semibold text-[26px] leading-tight",
                    s.feature ? "text-white" : "text-wwpl-ink")}>
                    {s.title}
                  </h3>
                  <p className={cn("mt-3 flex-1 text-[15px] leading-relaxed",
                    s.feature ? "text-[rgba(249,245,240,.75)]" : "text-wwpl-slate")}>
                    {s.description}
                  </p>
                  {/* Required production credit. `flex-1` stays on the paragraph
                      above so the CTAs still line up across the three cards. */}
                  {s.credit && (
                    <p className={cn("mt-4 text-[12.5px] leading-snug",
                      s.feature ? "text-[rgba(249,245,240,.55)]" : "text-wwpl-slate/70")}>
                      {s.credit}
                    </p>
                  )}
                  {/* Secondary, deliberately a text link rather than a second
                      button — the booking CTA must stay the only thing on this
                      card that reads as the action. It sits ABOVE the button so
                      the button stays the last element in every card and the
                      three CTAs keep a common baseline. */}
                  {s.trailerHref && (
                    <a href={s.trailerHref}
                      onClick={() => track("nav_trailer", { from: `session-${s.no}` })}
                      className={cn("mt-5 self-start text-[13.5px] underline underline-offset-[3px] transition-colors",
                        s.feature
                          ? "text-[rgba(240,217,168,.8)] hover:text-wwpl-gold"
                          : "text-wwpl-slate hover:text-wwpl-goldDeep")}>
                      Watch the trailer
                    </a>
                  )}
                  {s.awardsHref && (
                    <a href={s.awardsHref}
                      onClick={() => track("nav_awards", { from: `session-${s.no}` })}
                      className="mt-5 self-start text-[13.5px] text-wwpl-slate underline underline-offset-[3px] transition-colors hover:text-wwpl-goldDeep">
                      About the awards
                    </a>
                  )}
                  <BtnLink {...quicketProps(`session-${s.no}`)} variant={s.feature ? "gold" : "ghost"}
                    className="mt-6 self-start text-[14px]">
                    {s.cta}
                  </BtnLink>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Full-day: the code is issued by email and never printed here. */}
          <Reveal className="mx-auto mt-12 max-w-[680px] rounded-[20px] border border-wwpl-line bg-wwpl-cream p-8 text-center sm:px-10">
            <h3 className="font-wwpl-display font-semibold text-[22px] text-wwpl-ink">Doing the whole day?</h3>
            <p className="mx-auto mt-3 max-w-[56ch] text-[14.5px] leading-relaxed text-wwpl-slate">
              Booking all three sessions separately comes to R450. We hold a lower full-day rate for
              people coming for the full programme — email us and we'll send your code before you book.
            </p>
            <BtnLink
              variant="ink"
              className="mt-6"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Full-day access — Celebrating Women Who Protect Life")}`}
              onClick={() => track("fullday_code_request")}
            >
              Email us for full-day access
            </BtnLink>
          </Reveal>
        </div>
      </section>

      {/* 4 — Trailer */}
      <section id="trailer" className="scroll-mt-8 bg-wwpl-ink py-24">
        <div className={wrap}>
          <SecHead
            tone="dark"
            eyebrow="Watch"
            title="The trailers"
            sub="Both films screening on the day — no graphic footage is used in any of our promotion."
          />
          {/* Two films, two co-equal tiles. Each carries its own anchor so the
              session cards can deep-link straight to the right trailer. */}
          <div className="grid gap-7 lg:grid-cols-2">
            {TRAILERS.map((t, i) => (
              <Reveal key={t.id} delayMs={i * 90} id={t.anchor} className="scroll-mt-24">
                <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-wwpl-lg"
                  style={{ aspectRatio: "16 / 9" }}>
                  <VideoTile fileId={t.id} label={t.label} poster={t.poster} main />
                </div>
                <h3 className="mt-4 font-wwpl-display text-[21px] font-semibold text-wwpl-cream">
                  {t.title}
                </h3>
                <p className="mt-1 font-wwpl-cond text-[12.5px] uppercase tracking-[.14em] text-wwpl-goldLight">
                  {t.session}
                </p>
                {/* Required production credit, repeated wherever the film appears. */}
                {t.credit && (
                  <p className="mt-2.5 text-[12.5px] leading-snug text-[rgba(246,241,232,.5)]">
                    {t.credit}
                  </p>
                )}
              </Reveal>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CLIPS.map((c, i) => (
              <Reveal key={c.id} delayMs={(i % 3) * 90}>
                <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "16 / 9" }}>
                  <VideoTile fileId={c.id} label={c.tag} kicker={c.tag} poster={c.poster} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band — official banner artwork. Repeats the booking action between
          sections so it is never more than a screen away on a long page. */}
      <CtaBand
        from="band-after-sessions"
        headline="Three sessions, one day"
        sub="R150 each. Come for one, come for all three — assigned seating on Quicket."
      />

      {/* 5 — Why this day matters */}
      <section className="py-24">
        <div className={cn(wrap, "grid gap-9 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:items-start")}>
          <Reveal>
            <Eyebrow className="text-[13px] tracking-[.22em] text-wwpl-goldDeep">About the day</Eyebrow>
            <h2 className="mt-3 font-wwpl-display font-semibold text-[clamp(30px,5vw,42px)] leading-[1.12] text-wwpl-ink">
              Why this day matters
            </h2>
          </Reveal>
          <Reveal delayMs={90}>
            <p className="font-wwpl-display text-[23px] font-medium leading-[1.5] text-wwpl-ink">
              Stunning Pigs examines the use of high-concentration CO₂ gas stunning of pigs — and asks
              a simple public question: do current practices meet the standard of humane treatment
              South Africans expect?
            </p>
            <p className="mt-6 text-[16.5px] leading-[1.75] text-wwpl-inkSoft">
              The premiere is followed by a public Q&amp;A with the Beauty Without Cruelty campaign and
              G.A.R.D. — an open, respectful conversation about achievable, more humane standards. This
              is a public education event: no graphic footage is used in any of our promotion, and the
              day is designed to inform, not to shock.
            </p>
            <p className="mt-5 text-[16.5px] leading-[1.75] text-wwpl-inkSoft">
              Held on Women's Day, the programme celebrates the women leading this work — opening with{" "}
              <em>What Feeds Us</em> and closing with the <em>Voices for Women</em> showcase and awards
              ceremony.
            </p>
            {/* Required production credit, attached to the reference to the film
                rather than floated on its own. */}
            <p className="mt-3 text-[13px] leading-snug text-wwpl-slate/70">
              <em>What Feeds Us</em>: {WHAT_FEEDS_US_CREDIT}
            </p>
            <div className="mt-6 border-l-2 border-wwpl-gold pl-5 text-[14.5px] leading-relaxed text-wwpl-slate">
              Delicious vegan food is available for purchase on the day, from official vegan food
              partner Vegan Streetfood.
            </div>
            {/* Viewer advisory — see the provenance note on CONTENT_ADVISORY. */}
            <p className="mt-5 text-[13px] leading-relaxed text-wwpl-slate/75">
              {CONTENT_ADVISORY}
            </p>

          </Reveal>
        </div>

      </section>

      {/* 5b — The awards. The emotional centre of the day, so it gets its own
          section rather than a line inside the Session 3 card. Dark like the
          trailer section — ceremony territory, gold on plum. Honourees will
          share this page with their own networks: every card carries a
          personal anchor (#awardee-firstname-lastname) and a copy-link
          control, so a shared link feels like hers, not ours. Card imagery is
          the produced promotional artwork supplied by the team — see the
          provenance note on AWARDEES in wwpl/event.ts. */}
      <section
        id="awards"
        className="scroll-mt-8 bg-[radial-gradient(110%_130%_at_50%_-20%,#43122E,#2A0A1E_72%)] py-24 text-wwpl-cream"
      >
        <div className={wrap}>
          <SecHead
            tone="dark"
            eyebrow="Session 3 · 14:00 · R150"
            title={
              <>
                Voices for Women —{" "}
                <em className="italic text-wwpl-goldLight">Showcase &amp; Awards</em>
              </>
            }
            sub="The day closes with live performances and an awards ceremony honouring the women who protect life — campaigners, carers and community leaders whose daily work defends animals and uplifts the communities around them."
          />

          {/* Awardee video — placed 6 Aug at Tumelo's request; label stays
              generic until the team supplies its details. Click-to-load like
              every player on this page: nothing streams until tapped. */}
          <Reveal className="mx-auto mb-14 w-full max-w-[720px]">
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-black shadow-wwpl-lg"
              style={{ aspectRatio: "16 / 9" }}
            >
              <VideoTile fileId={AWARDS_VIDEO_FILE_ID} label="From the awardees" kicker="Awardee video" />
            </div>
            <p className="mt-3 text-center font-wwpl-cond text-[12px] uppercase tracking-[.16em] text-[rgba(240,217,168,.55)]">
              From the awardees — more to come
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-7">
            {AWARDEES.map((a, i) => {
              const anchor = awardeeAnchor(a, i);
              return (
                <Reveal
                  key={anchor}
                  id={anchor}
                  delayMs={(i % 3) * 90}
                  className="w-full scroll-mt-24 sm:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)]"
                >
                  <article className="flex h-full flex-col rounded-[20px] border border-[rgba(217,179,108,.26)] bg-[linear-gradient(165deg,rgba(90,26,62,.55),rgba(42,10,30,.6))] p-6 sm:p-7">
                    {/* The produced profile cards are square and self-contained
                        (portrait, name, role and award in the artwork), so the
                        media slot is 1:1 and the text below restates the same
                        facts for screen readers, search and link previews. */}
                    <div
                      className="relative overflow-hidden rounded-xl bg-wwpl-plum"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      {a.portrait ? (
                        <img
                          src={a.portrait}
                          alt={`${a.name} — ${a.citation}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 64 64"
                            className="h-16 w-16 opacity-40"
                            fill="none"
                            stroke="#D9B36C"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          >
                            <circle cx="32" cy="25" r="13" />
                            <path d="M24.5 35.5 18 56l14-8 14 8-6.5-20.5" />
                          </svg>
                          <span className="font-wwpl-cond text-[10.5px] tracking-[.22em] uppercase text-[rgba(240,217,168,.45)]">
                            Portrait to follow
                          </span>
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 font-wwpl-display font-semibold text-[22px] leading-tight text-white">
                      {a.name}
                    </h3>
                    <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-[rgba(249,245,240,.68)]">
                      {a.citation}
                    </p>
                    <CopyAnchorButton anchor={anchor} name={a.name} />
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-14 text-center">
            <p className="mx-auto max-w-[54ch] text-[13.5px] leading-relaxed text-[rgba(249,245,240,.55)]">
              More honourees are being announced — the full list of women being celebrated appears
              here as their profiles are finalised.
            </p>
            <BtnLink {...quicketProps("awards-section")} variant="gold" className="mt-7">
              Book the awards session — R150
            </BtnLink>
          </Reveal>
        </div>
      </section>

      {/* 6 — Buying with confidence. Legally load-bearing; see file header. */}
      <section className="border-y border-wwpl-line bg-wwpl-cream py-[88px]">
        <div className={wrap}>
          <SecHead eyebrow="Buying with confidence" title="The official event page" className="mb-16" />
          <div className="grid gap-12 md:grid-cols-3 lg:gap-14">
            {[
              { n: "01", h: "Organised by Omni", p: "This day is organised and promoted by Omni Wellness Media, in partnership with Beauty Without Cruelty and G.A.R.D., and hosted at The Masque Theatre in Muizenberg." },
              { n: "02", h: "Face value, no markup", p: "R150 per session is the face value set for this event. Omni Wellness Media is not a ticket reseller and adds no booking fee or markup." },
              { n: "03", h: "You finish on Quicket", p: "The Masque sells its seats through Quicket, its official ticketing partner. You choose your exact seat there and your ticket arrives by email — all sales governed by Quicket's terms." },
            ].map((c, i) => (
              <Reveal key={c.n} delayMs={(i % 3) * 90}>
                <span className="block font-wwpl-cond text-[13px] tracking-[.22em] text-wwpl-goldDeep">{c.n}</span>
                <h3 className="mb-3 mt-4 font-wwpl-display font-semibold text-[23px] text-wwpl-ink">{c.h}</h3>
                <p className="text-[15px] leading-relaxed text-wwpl-slate">{c.p}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-14 text-center text-[13.5px] text-wwpl-slate">
            Omni Wellness Media · Cape Town, South Africa · {CONTACT_PHONE} ·{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-wwpl-goldDeep underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <CtaBand
        from="band-after-about"
        headline="Women's Day at The Masque"
        sub="Monday 10 August 2026, Muizenberg. Wheelchair access, licensed bar and the Vegan Streetfood truck on site."
      />

      {/* 6b — The room. Sits directly before the conversion band: it answers
          "where will I sit / is there wheelchair access" at the moment someone
          is deciding, then hands straight off to Quicket. READ-ONLY by design —
          see the header comment in wwpl/SeatingMap.tsx. */}
      <SeatingMap />

      {/* 7 — Tickets: the conversion band */}
      <section id="tickets" className="scroll-mt-8 bg-[radial-gradient(110%_130%_at_50%_-20%,#5A1A3E,#2A0A1E_70%)] py-[104px] text-center text-wwpl-cream">
        <div className={wrap}>
          <Reveal>
            <Eyebrow className="text-[13px] tracking-[.22em] text-wwpl-rose">Tickets</Eyebrow>
            <h2 className="mt-3 font-wwpl-display font-semibold text-[clamp(34px,6vw,46px)] leading-tight text-white">
              Get your seat
            </h2>
            <p className="mx-auto mt-[18px] max-w-[52ch] text-[16px] leading-relaxed text-[rgba(249,245,240,.75)]">
              Assigned seating, sold securely through Quicket — The Masque Theatre's official
              ticketing partner. Card and instant EFT; tickets emailed instantly.
            </p>
            <p className="mt-5 font-wwpl-display italic text-[22px] text-wwpl-goldLight">
              R150 per session · Monday 10 August 2026
            </p>
            <div className="mt-8 flex justify-center">
              <BtnLink {...quicketProps("tickets-section")} variant="gold" className="whitespace-nowrap px-8 py-3.5 text-[16px]">
                Choose your seats on Quicket
              </BtnLink>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={GOOGLE_CAL_URL} target="_blank" rel="noopener noreferrer"
                onClick={() => track("add_to_calendar_google")}
                className="rounded-full border border-[rgba(249,245,240,.25)] px-[18px] py-2.5 text-[13.5px] text-[rgba(249,245,240,.7)] transition-colors hover:border-wwpl-gold hover:text-white">
                ＋ Google Calendar
              </a>
              <button type="button" onClick={() => { track("add_to_calendar_ics"); downloadIcs(); }}
                className="rounded-full border border-[rgba(249,245,240,.25)] px-[18px] py-2.5 text-[13.5px] text-[rgba(249,245,240,.7)] transition-colors hover:border-wwpl-gold hover:text-white">
                ＋ Apple / Outlook (.ics)
              </button>
            </div>
            <p className="mx-auto mt-7 max-w-[60ch] text-[13px] leading-relaxed text-[rgba(249,245,240,.5)]">
              Opens Quicket in a new tab. Booking for a group? Assigned seating means you can sit
              together — book in one order.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 8 — Petition: the page's second conversion goal */}
      <section id="petition" className="scroll-mt-8 overflow-hidden border-y border-wwpl-line bg-wwpl-cream py-[100px]">
        <div className={cn(wrap, "grid items-center gap-11 lg:grid-cols-[.95fr_1.05fr] lg:gap-[72px]")}>
          <Reveal>
            <Eyebrow className="text-[13px] tracking-[.22em] text-wwpl-goldDeep">Take a stand</Eyebrow>
            <h2 className="mt-3 font-wwpl-display font-semibold text-[clamp(30px,5vw,42px)] leading-[1.12] text-wwpl-ink">
              Sign for humane standards
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16.5px] leading-[1.75] text-wwpl-inkSoft">
              You don't need a ticket to add your voice. Our petition asks South African regulators and
              industry to review high-concentration CO₂ gas stunning and commit to achievable, more
              humane alternatives. Every signature is presented with the campaign after the premiere.
            </p>
            <blockquote className="mt-8 rounded-2xl border-l-2 border-wwpl-gold bg-wwpl-plum p-6">
              <p className="font-wwpl-display italic text-[19px] leading-snug text-wwpl-goldLight">
                "Informed, not shocked — that's how change begins."
              </p>
            </blockquote>
          </Reveal>
          <Reveal delayMs={90}>
            <PetitionForm onSigned={() => track("petition_signed")} />
          </Reveal>
        </div>
      </section>

      {/* 9 — Getting there */}
      <section className="py-24 text-center">
        <div className={wrap}>
          <Reveal>
            <Eyebrow className="text-[13px] tracking-[.22em] text-wwpl-goldDeep">Getting there</Eyebrow>
            <h2 className="mt-3 font-wwpl-display font-semibold text-[clamp(28px,4.5vw,36px)] text-wwpl-ink">
              {VENUE_NAME}
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[16px] leading-relaxed text-wwpl-slate">
              {VENUE_ADDRESS} — on the Cape Town southern line, minutes from Muizenberg beach.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[14px] text-wwpl-slate">
              {["Wheelchair access", "Licensed bar", "Vegan Streetfood truck on site"].map((a) => (
                <span key={a} className="flex items-center gap-2 before:block before:h-[5px] before:w-[5px] before:rounded-full before:bg-wwpl-gold">
                  {a}
                </span>
              ))}
            </div>
            <BtnLink variant="ink" className="mt-8" href={VENUE_MAPS_URL} target="_blank"
              rel="noopener noreferrer" onClick={() => track("venue_map_open")}>
              Open in Google Maps
            </BtnLink>
          </Reveal>
        </div>
      </section>

      {/* 10 — Partners. Not a logo strip: each partner is a named collaborator
          with who-they-are copy and a link to their own site. This section is
          doing credibility work for a first-time event — six organisations
          with real track records vouching for the day. Data (blurbs, links,
          logos and their provenance) lives in PARTNERS in wwpl/event.ts. */}
      <section id="partners" className="scroll-mt-8 border-t border-wwpl-line pb-[96px] pt-[80px]">
        <div className={wrap}>
          <SecHead
            eyebrow="Presented with"
            title="The people behind the day"
            sub="A first-time event, carried by organisations that have been doing this work for years."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((p, i) => {
              const external = !!p.href && !p.href.startsWith(ORIGIN);
              return (
                <Reveal key={p.name} delayMs={(i % 3) * 90} className="h-full">
                  <article className="flex h-full flex-col rounded-[20px] border border-wwpl-line bg-white p-7 shadow-[0_1px_2px_rgba(21,32,31,.05)] motion-safe:transition-all motion-safe:duration-[250ms] hover:-translate-y-1 hover:shadow-wwpl-md">
                    <span className="mb-5 flex h-14 items-center">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={`${p.name} logo`}
                          loading="lazy"
                          decoding="async"
                          /* T&T CT's mark loads from the site CDN; if any logo
                             404s, an empty slot beats a broken-image glyph. */
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                          className={cn(
                            "max-h-14 max-w-[150px] object-contain",
                            p.round && "h-14 w-14 rounded-full"
                          )}
                        />
                      ) : (
                        /* Monogram stand-in until the organisation's own mark
                           is supplied — see the provenance note in PARTNERS. */
                        <span
                          aria-hidden="true"
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-wwpl-plum font-wwpl-display font-semibold text-[24px] text-wwpl-goldLight"
                        >
                          {p.name.replace(/^The /, "").charAt(0)}
                        </span>
                      )}
                    </span>
                    <span className="font-wwpl-cond text-[11.5px] tracking-[.2em] uppercase text-wwpl-goldDeep">
                      {p.role}
                    </span>
                    <h3 className="mt-2 font-wwpl-display font-semibold text-[21px] leading-snug text-wwpl-ink">
                      {p.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-wwpl-slate">
                      {p.blurb}
                    </p>
                    {p.href && (
                      <a
                        href={p.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        onClick={() => track("partner_click", { partner: p.name })}
                        className="mt-5 self-start text-[13.5px] text-wwpl-goldDeep underline underline-offset-[3px] transition-colors hover:text-wwpl-ink"
                      >
                        {external ? "Visit their site ↗" : "Visit their page"}
                      </a>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
          {/* Required production credit, as the page's credits footnote. */}
          <p className="mx-auto mt-12 max-w-[62ch] text-center text-[12.5px] leading-relaxed text-wwpl-slate/75">
            <em>What Feeds Us</em> — {WHAT_FEEDS_US_CREDIT}
          </p>
        </div>
      </section>

      {/* 11 — Footer */}
      <footer id="site-footer" className="bg-wwpl-ink py-14 text-[rgba(246,241,232,.65)]">
        <div className={cn(wrap, "flex flex-wrap items-center justify-between gap-6")}>
          <span className="flex items-center gap-2.5">
            <img src="/events/wwpl/omni-icon.webp" alt="" aria-hidden="true" width={32} height={32}
              className="h-8 w-8 rounded-full bg-white" />
            <b className="font-wwpl-display text-[18px] font-semibold text-wwpl-cream">Omni Wellness Media</b>
          </span>
          <nav className="flex flex-wrap gap-6 text-[13.5px]">
            <a href={ORIGIN} className="transition-colors hover:text-wwpl-goldLight">Home</a>
            <a href="#sessions" className="transition-colors hover:text-wwpl-goldLight">Programme</a>
            <a href="#tickets" className="transition-colors hover:text-wwpl-goldLight">Tickets</a>
            <a href="#petition" className="transition-colors hover:text-wwpl-goldLight">Petition</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-wwpl-goldLight">Contact</a>
          </nav>
          <p className="w-full text-[12.5px] text-[rgba(246,241,232,.4)]">
            © 2026 Omni Wellness Media. Bridging wellness, culture and community as media from Cape
            Town to the world.
          </p>
        </div>
      </footer>

      {/* 12 — Sticky ticket bar */}
      <StickyBar />
    </div>
  );
};

export default StunningPigs;
