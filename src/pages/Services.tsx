import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  SERVICE_BANDS,
  QUOTED_CATEGORIES,
  RATE_CARD_TERMS,
  PRACTICE_PROJECTS,
} from "@/data/publicRateCard";
import {
  INK,
  INK_SOFT,
  SLATE,
  CLAY,
  CREAM,
  CREAM_2,
  LINE,
  HAIRLINE,
  WHATSAPP_URL,
  mono,
  SpectrumRule,
  Reveal,
  Eyebrow,
  OfferCard,
  BandNumeral,
} from "@/components/services/spectrum";
import { trackWhatsappClick } from "@/lib/analytics";
import { IMAGES } from "@/lib/images";

/**
 * Services: the public catalogue in the Spectrum System, light edition.
 *
 * Copy rule from the design handoff: offer names, prices, inclusions and
 * the commercial terms are client supplied and must not be reworded. They
 * live in src/data/publicRateCard.ts; this file is presentation only.
 *
 * The dark handoff palette is recast on the site's cream ground so this
 * page reads as part of the same website as everything else; the category
 * hues, Cormorant display and mono labels carry the system. Band imagery
 * is Omni's own photography from the shared catalogue, never stock.
 */

const BAND_IMAGES: Record<string, { src: string; alt: string } | undefined> = {
  clarity: {
    src: IMAGES.services.team,
    alt: "Cape Town landscape from an Omni location shoot",
  },
  content: {
    src: IMAGES.services.artscape,
    alt: "On stage at the Artscape Theatre during an Omni production",
  },
  retainer: {
    src: IMAGES.services.community1,
    alt: "An Omni community wellness project in session",
  },
  campaign: {
    src: "/screenings/night/stage-banner-wide.webp",
    alt: "The Omni stage at The Masque Theatre on 10 August 2026",
  },
};

const PROJECT_IMAGES: Record<string, { src: string; alt: string }> = {
  "Valley of Plenty": {
    src: IMAGES.services.community2,
    alt: "Community food systems work in Hanover Park",
  },
  "Human Animal Project": {
    src: IMAGES.services.humanAnimal1,
    alt: "Filming for the Human Animal Project",
  },
  "Retreats and experiences": {
    src: IMAGES.services.retreat1,
    alt: "A wellness retreat hosted and documented by Omni",
  },
};

const Services = () => {
  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <UnifiedNavigation />
      <main style={{ background: CREAM, color: INK }}>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Soft spectrum glow behind the display type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[560px] rounded-full opacity-[.14] blur-3xl"
            style={{ background: "conic-gradient(from 90deg, #E63946, #F38020, #F5C518, #4FAE3F, #2BB9B9, #2C6FB5, #5C2A8A, #E63946)" }}
          />
          <div className="relative mx-auto max-w-[1180px] px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
                Services · South Africa · Rates in ZAR
              </p>
              <h1
                className="mt-5 max-w-[21ch] font-wwpl-display font-medium leading-[1.06] tracking-[-.01em]"
                style={{ fontSize: "clamp(40px, 6vw, 76px)", color: INK }}
              >
                Bridging wellness, outreach and media.{" "}
                <em style={{ color: CLAY }}>Work that earns its fee.</em>
              </h1>
              <p className="mt-6 max-w-[62ch] text-[17.5px] leading-relaxed" style={{ color: INK_SOFT }}>
                Omni Wellness Media creates conscious content and builds the commercial engine
                behind it: strategy, websites, campaigns, media production and systems. Start with
                a single session or a fixed-scope sprint. Everything larger is quoted properly,
                after we understand the work.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact?service=clarity-session"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white transition-transform hover:scale-[1.02]"
                  style={{ background: INK }}
                >
                  Start with R1,500 <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#clarity"
                  className="inline-flex items-center rounded-full px-6 py-3 text-[14px] transition-colors hover:bg-black/5"
                  style={{ border: `1px solid ${LINE}`, color: INK }}
                >
                  See all packages
                </a>
              </div>
            </Reveal>

            {/* Real photograph: our stage at The Masque Theatre. */}
            <Reveal delay={120}>
              <figure className="relative mt-12 overflow-hidden rounded-[22px]" style={{ border: `1px solid ${LINE}` }}>
                <img
                  src="/screenings/night/stage-screen-wide.webp"
                  alt="The Omni Wellness Media stage and full cinema screen at The Masque Theatre"
                  className="h-[240px] w-full object-cover sm:h-[320px]"
                />
                <figcaption
                  className="absolute bottom-3 left-3 rounded-full bg-black/45 px-4 py-1.5 text-[11px] uppercase tracking-[.16em] text-white backdrop-blur-sm"
                  style={mono}
                >
                  The Masque Theatre · 10 August 2026 · our production
                </figcaption>
              </figure>
            </Reveal>

            {/* Jump nav */}
            <nav aria-label="Service categories" className="mt-10 flex flex-wrap gap-2">
              {[
                ...SERVICE_BANDS.map((b) => ({ href: `#${b.id}`, label: b.heading, hue: b.hue })),
                { href: "#quote", label: "Quotation-based", hue: SLATE },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ border: `1px solid ${LINE}`, color: INK_SOFT }}
                >
                  <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: l.hue }} />
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <SpectrumRule />
          </div>
        </section>

        {/* Offer bands, alternating grounds for clear category separation */}
        {SERVICE_BANDS.map((band, i) => {
          const image = BAND_IMAGES[band.id];
          return (
            <section
              key={band.id}
              id={band.id}
              className="scroll-mt-24"
              style={{ background: i % 2 === 0 ? CREAM : CREAM_2 }}
            >
              <div className="mx-auto max-w-[1180px] px-5 py-[64px] sm:px-8">
                <Reveal>
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="flex items-end gap-5">
                      <BandNumeral n={String(i + 1).padStart(2, "0")} hue={band.hue} />
                      <div className="pb-3">
                        <Eyebrow hue={band.hue}>{band.eyebrow}</Eyebrow>
                        <h2 className="mt-2 font-wwpl-display text-[clamp(30px,4vw,40px)] font-medium leading-tight" style={{ color: INK }}>
                          {band.heading}
                        </h2>
                        {band.explore && (
                          <Link to={band.explore.href} className="mt-1 inline-block text-[14px] underline-offset-4 hover:underline" style={{ color: band.hue }}>
                            {band.explore.label} →
                          </Link>
                        )}
                      </div>
                    </div>
                    {image && (
                      <figure className="hidden overflow-hidden rounded-[16px] md:block" style={{ border: `1px solid ${LINE}` }}>
                        <img src={image.src} alt={image.alt} loading="lazy" className="h-[110px] w-[220px] object-cover" />
                      </figure>
                    )}
                  </div>
                </Reveal>
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {band.offers.map((o, j) => (
                    <Reveal key={o.slug} delay={j * 90} className={o.wide ? "h-full md:col-span-2 xl:col-span-3" : "h-full"}>
                      <OfferCard offer={o} />
                    </Reveal>
                  ))}
                </div>
                {band.footnote && (
                  <p className="mt-6 max-w-[80ch] text-[12.5px] leading-relaxed" style={{ color: SLATE }}>
                    {band.footnote}
                  </p>
                )}
              </div>
            </section>
          );
        })}

        {/* Quotation-based */}
        <section id="quote" className="scroll-mt-24" style={{ background: INK }}>
          <div className="mx-auto max-w-[1180px] px-5 py-[72px] sm:px-8">
            <Reveal>
              <Eyebrow hue={CLAY}>07 · Quotation-based</Eyebrow>
              <h2 className="mt-3 max-w-[26ch] font-wwpl-display text-[clamp(28px,4vw,38px)] font-medium leading-tight text-wwpl-cream">
                Some work should not carry a price tag until we understand it.
              </h2>
              <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: "rgba(246,241,232,.72)" }}>
                These are scoped after a paid discovery or audit, so the number you receive is one
                we can both stand behind.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {QUOTED_CATEGORIES.map((q, j) => (
                <Reveal key={q.area} delay={j * 70}>
                  <div className="h-full rounded-[16px] p-5" style={{ background: "rgba(246,241,232,.07)", border: "1px solid rgba(246,241,232,.14)" }}>
                    <p className="text-[11px] uppercase tracking-[.18em]" style={{ ...mono, color: "#C9B68E" }}>
                      {q.area}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(246,241,232,.78)" }}>
                      {q.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact?service=quotation"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-transform hover:scale-[1.02]"
                style={{ background: "#F7F3EA", color: INK }}
              >
                Request a quotation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsappClick("services_quotation")}
                className="inline-flex items-center rounded-full px-6 py-3 text-[14px] text-wwpl-cream transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(246,241,232,.3)" }}
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </section>

        {/* Our work */}
        <section style={{ background: CREAM }}>
          <div className="mx-auto max-w-[1180px] px-5 py-[72px] sm:px-8">
            <Reveal>
              <Eyebrow>Our work</Eyebrow>
              <h2 className="mt-3 font-wwpl-display text-[clamp(28px,4vw,38px)] font-medium leading-tight" style={{ color: INK }}>
                Projects behind the practice
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {PRACTICE_PROJECTS.map((p, j) => {
                const img = PROJECT_IMAGES[p.name];
                return (
                  <Reveal key={p.name} delay={j * 90}>
                    <Link
                      to={p.href}
                      className="group block h-full overflow-hidden rounded-[18px] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(21,32,31,.10)]"
                      style={{ border: `1px solid ${LINE}` }}
                    >
                      {img && (
                        <div className="h-[170px] overflow-hidden">
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                      )}
                      <div className="relative p-6">
                        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ background: p.hue }} />
                        <h3 className="font-wwpl-display text-[23px]" style={{ color: INK }}>
                          {p.name}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: SLATE }}>
                          {p.detail}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] group-hover:underline" style={{ color: p.hue }}>
                          Visit the project <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Commercial terms */}
        <section style={{ background: CREAM_2 }}>
          <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-[64px] sm:px-8">
            <Reveal>
              <Eyebrow>How we work</Eyebrow>
              <h2 className="mt-3 font-wwpl-display text-[clamp(28px,4vw,38px)] font-medium leading-tight" style={{ color: INK }}>
                Standard commercial terms
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
              {RATE_CARD_TERMS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[14px] leading-relaxed" style={{ color: INK_SOFT }}>
                  <span aria-hidden="true" className="mt-[9px] h-[5px] w-[5px] flex-none rounded-full" style={{ background: CLAY }} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-14">
              <SpectrumRule />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
