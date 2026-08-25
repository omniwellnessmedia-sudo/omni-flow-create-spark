import type { CSSProperties } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  SERVICE_BANDS,
  QUOTED_CATEGORIES,
  RATE_CARD_TERMS,
  PRACTICE_PROJECTS,
  SPECTRUM,
  type RateCardOffer,
} from "@/data/publicRateCard";
import { trackWhatsappClick } from "@/lib/analytics";

/**
 * Services: the public catalogue, in the Spectrum System (design handoff
 * "Omni Asset System", 25 Aug 2026). Dark ink ground, cream text, Cormorant
 * Garamond display, JetBrains Mono labels, one hue per service category.
 *
 * Copy rule from the handoff: offer names, prices, inclusions and the
 * commercial terms are client supplied and must not be reworded. They all
 * live in src/data/publicRateCard.ts; this file is layout only.
 *
 * CTA rule: "Pay now" style buttons from the design are deliberately not
 * rendered until real checkout URLs exist. Every offer routes to the
 * contact form with its service preselected.
 */

const INK = "#0E1513";
const CREAM = "#F7F3EA";
const MIST = "#B9C6C2";
const SLATE = "#8A9A96";
const CLAY = "#C9B68E";
const CARD_BG = "linear-gradient(180deg, rgba(247,243,234,.085), rgba(247,243,234,.035))";
const CARD_BORDER = "rgba(247,243,234,.16)";
const HAIRLINE = "rgba(247,243,234,.06)";

const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y";

const mono: CSSProperties = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
};

const SpectrumRule = () => (
  <div
    aria-hidden="true"
    className="h-[3px] rounded-[3px]"
    style={{
      background: `linear-gradient(90deg, ${SPECTRUM.red}, ${SPECTRUM.orange}, ${SPECTRUM.yellow}, ${SPECTRUM.green}, ${SPECTRUM.teal}, ${SPECTRUM.blue}, ${SPECTRUM.violet})`,
    }}
  />
);

const OfferCard = ({ offer }: { offer: RateCardOffer }) => (
  <article
    className={`relative flex flex-col overflow-hidden rounded-[18px] p-6 transition-colors duration-300 hover:bg-[rgba(247,243,234,.09)] ${offer.wide ? "md:col-span-2 xl:col-span-3" : ""}`}
    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
  >
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px]" style={{ background: offer.hue }} />
    <h3 className="font-wwpl-display text-[26px] leading-tight" style={{ color: CREAM }}>
      {offer.name}
    </h3>
    <p className="mt-2 text-[13px] uppercase tracking-[.14em]" style={{ ...mono, color: offer.hue }}>
      {offer.price}
    </p>
    <p className="mt-3 text-[15px] leading-relaxed" style={{ color: MIST }}>
      {offer.blurb}
    </p>
    {offer.bullets.length > 0 && (
      <ul className="mt-4 space-y-2">
        {offer.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-[14px] leading-relaxed" style={{ color: MIST }}>
            <span aria-hidden="true" className="mt-[8px] h-[5px] w-[5px] flex-none rounded-full" style={{ background: offer.hue }} />
            {b}
          </li>
        ))}
      </ul>
    )}
    <div className="mt-auto flex flex-wrap items-center gap-3 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: "auto" }}>
      <Link
        to={`/contact?service=${offer.slug}`}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium transition-opacity hover:opacity-85"
        style={{ background: offer.hue, color: INK }}
      >
        {offer.cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      {offer.whatsapp && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsappClick(`services_${offer.slug}`)}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-[13.5px] transition-colors hover:bg-[rgba(247,243,234,.12)]"
          style={{ border: `1px solid ${CARD_BORDER}`, color: CREAM }}
        >
          WhatsApp us
        </a>
      )}
    </div>
    {offer.footnote && (
      <p className="mt-4 text-[12.5px] leading-relaxed" style={{ color: SLATE }}>
        {offer.footnote}
      </p>
    )}
  </article>
);

const Services = () => {
  return (
    <div className="min-h-screen" style={{ background: INK }}>
      <UnifiedNavigation />
      <main style={{ background: INK, color: CREAM }}>
        {/* Hero */}
        <section className="mx-auto max-w-[1180px] px-5 pb-14 pt-20 sm:px-8 sm:pt-24">
          <p className="text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
            Services · South Africa · Rates in ZAR
          </p>
          <h1
            className="mt-5 max-w-[20ch] font-wwpl-display font-normal leading-[1.08] tracking-[-.01em]"
            style={{ fontSize: "clamp(42px, 6.4vw, 82px)" }}
          >
            Bridging wellness, outreach and media.{" "}
            <em style={{ color: CLAY }}>Work that earns its fee.</em>
          </h1>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-relaxed" style={{ color: MIST }}>
            Omni Wellness Media creates conscious content and builds the commercial engine behind
            it: strategy, websites, campaigns, media production and systems. Start with a single
            session or a fixed-scope sprint. Everything larger is quoted properly, after we
            understand the work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact?service=clarity-session"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-colors"
              style={{ background: CREAM, color: INK }}
            >
              Start with R1,500 <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#clarity"
              className="inline-flex items-center rounded-full px-6 py-3 text-[14px] transition-colors hover:bg-[rgba(247,243,234,.12)]"
              style={{ border: `1px solid ${CARD_BORDER}`, color: CREAM }}
            >
              See all packages
            </a>
          </div>

          {/* Real photograph: our stage at The Masque Theatre, 10 Aug 2026.
              The handoff shipped a "photo to come" plate here; this is the
              consent-cleared image from the event media pack. */}
          <figure className="mt-12 overflow-hidden rounded-[18px]" style={{ border: `1px solid ${CARD_BORDER}` }}>
            <img
              src="/screenings/night/stage-screen-wide.webp"
              alt="The Omni Wellness Media stage and full cinema screen at The Masque Theatre"
              className="h-[240px] w-full object-cover sm:h-[300px]"
            />
          </figure>

          {/* Jump nav */}
          <nav aria-label="Service categories" className="mt-10 flex flex-wrap gap-2">
            {[
              ...SERVICE_BANDS.map((b) => ({ href: `#${b.id}`, label: b.heading, hue: b.hue })),
              { href: "#quote", label: "Quotation-based", hue: SLATE },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-colors hover:bg-[rgba(247,243,234,.12)]"
                style={{ border: `1px solid ${CARD_BORDER}`, color: MIST }}
              >
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: l.hue }} />
                {l.label}
              </a>
            ))}
          </nav>
        </section>

        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <SpectrumRule />
        </div>

        {/* Offer bands */}
        {SERVICE_BANDS.map((band) => (
          <section key={band.id} id={band.id} className="mx-auto max-w-[1180px] scroll-mt-24 px-5 pt-[72px] sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="flex items-center gap-3 text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
                  <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full" style={{ background: band.hue }} />
                  {band.eyebrow}
                </p>
                <h2 className="mt-3 font-wwpl-display text-[36px] font-normal leading-tight" style={{ color: CREAM }}>
                  {band.heading}
                </h2>
              </div>
              {band.explore && (
                <Link to={band.explore.href} className="text-[14px] underline-offset-4 hover:underline" style={{ color: band.hue }}>
                  {band.explore.label} →
                </Link>
              )}
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {band.offers.map((o) => (
                <OfferCard key={o.slug} offer={o} />
              ))}
            </div>
            {band.footnote && (
              <p className="mt-6 max-w-[80ch] text-[12.5px] leading-relaxed" style={{ color: SLATE }}>
                {band.footnote}
              </p>
            )}
          </section>
        ))}

        {/* Quotation-based */}
        <section id="quote" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 pt-[72px] sm:px-8">
          <p className="text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
            07 · Quotation-based
          </p>
          <h2 className="mt-3 max-w-[26ch] font-wwpl-display text-[36px] font-normal leading-tight" style={{ color: CREAM }}>
            Some work should not carry a price tag until we understand it.
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: MIST }}>
            These are scoped after a paid discovery or audit, so the number you receive is one we
            can both stand behind.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUOTED_CATEGORIES.map((q) => (
              <div key={q.area} className="rounded-[16px] p-5" style={{ background: "rgba(247,243,234,.06)", border: `1px solid ${HAIRLINE}` }}>
                <p className="text-[11px] uppercase tracking-[.18em]" style={{ ...mono, color: CLAY }}>
                  {q.area}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: MIST }}>
                  {q.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact?service=quotation"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium"
              style={{ background: CREAM, color: INK }}
            >
              Request a quotation <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick("services_quotation")}
              className="inline-flex items-center rounded-full px-6 py-3 text-[14px] hover:bg-[rgba(247,243,234,.12)]"
              style={{ border: `1px solid ${CARD_BORDER}`, color: CREAM }}
            >
              WhatsApp us
            </a>
          </div>
        </section>

        {/* Our work */}
        <section className="mx-auto max-w-[1180px] px-5 pt-[72px] sm:px-8">
          <p className="text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
            Our work
          </p>
          <h2 className="mt-3 font-wwpl-display text-[36px] font-normal leading-tight" style={{ color: CREAM }}>
            Projects behind the practice
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PRACTICE_PROJECTS.map((p) => (
              <Link
                key={p.name}
                to={p.href}
                className="group relative overflow-hidden rounded-[18px] p-6 transition-colors hover:bg-[rgba(247,243,234,.09)]"
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px]" style={{ background: p.hue }} />
                <h3 className="font-wwpl-display text-[24px]" style={{ color: CREAM }}>
                  {p.name}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed" style={{ color: MIST }}>
                  {p.detail}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] group-hover:underline" style={{ color: p.hue }}>
                  Visit the project <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Commercial terms */}
        <section className="mx-auto max-w-[1180px] px-5 pb-24 pt-[72px] sm:px-8">
          <p className="text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
            How we work
          </p>
          <h2 className="mt-3 font-wwpl-display text-[36px] font-normal leading-tight" style={{ color: CREAM }}>
            Standard commercial terms
          </h2>
          <ul className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {RATE_CARD_TERMS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-[14px] leading-relaxed" style={{ color: MIST }}>
                <span aria-hidden="true" className="mt-[9px] h-[5px] w-[5px] flex-none rounded-full" style={{ background: CLAY }} />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-14">
            <SpectrumRule />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
