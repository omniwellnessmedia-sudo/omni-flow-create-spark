import type { ReactNode } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SERVICE_BANDS } from "@/data/publicRateCard";
import {
  INK,
  INK_SOFT,
  SLATE,
  CLAY,
  CREAM,
  CREAM_2,
  LINE,
  mono,
  SpectrumRule,
  Reveal,
  Eyebrow,
  OfferCard,
} from "@/components/services/spectrum";

/**
 * Shared layout for the service detail pages, so /business-consulting,
 * /media-production, /web-development and /social-media-strategy present as
 * one system with /services instead of four differently styled leftovers.
 *
 * Each page supplies voice (title, lede, highlights, image) and points at
 * its band in the rate card; offers and prices render from
 * src/data/publicRateCard.ts so a price is never duplicated into a page.
 */

export interface ServiceDetailProps {
  /** Band id in SERVICE_BANDS whose offers this page sells. */
  bandId: string;
  eyebrow: string;
  title: ReactNode;
  lede: string;
  image?: { src: string; alt: string; caption?: string };
  /** Three to six short statements of what the client gets. */
  highlights: { heading: string; detail: string }[];
  /** Optional closing line above the CTA. */
  closing?: string;
}

const PROCESS = [
  { n: "01", title: "Discovery", detail: "We understand the goal, the audience and the constraint before anything is proposed." },
  { n: "02", title: "Proposal", detail: "A written scope with a fixed price or a quotation you can hold us to." },
  { n: "03", title: "The work", detail: "Built in the open, with agreed check-ins and one consolidated revision round." },
  { n: "04", title: "Handover", detail: "Delivered, documented and measured, with the numbers reported honestly." },
];

const ServiceDetailShell = ({ bandId, eyebrow, title, lede, image, highlights, closing }: ServiceDetailProps) => {
  const band = SERVICE_BANDS.find((b) => b.id === bandId);

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <UnifiedNavigation />
      <main style={{ background: CREAM, color: INK }}>
        {/* Hero */}
        <section className="mx-auto max-w-[1180px] px-5 pt-10 sm:px-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-[13.5px]" style={{ color: SLATE }}>
            <ArrowLeft className="h-3.5 w-3.5" /> All services and rates
          </Link>
          <div className="grid items-center gap-10 pb-12 pt-8 md:grid-cols-[1.15fr,1fr]">
            <Reveal>
              <Eyebrow hue={band?.hue}>{eyebrow}</Eyebrow>
              <h1
                className="mt-4 max-w-[18ch] font-wwpl-display font-medium leading-[1.08] tracking-[-.01em]"
                style={{ fontSize: "clamp(36px, 5vw, 62px)", color: INK }}
              >
                {title}
              </h1>
              <p className="mt-5 max-w-[56ch] text-[16.5px] leading-relaxed" style={{ color: INK_SOFT }}>
                {lede}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#offers"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white transition-transform hover:scale-[1.02]"
                  style={{ background: band?.hue || INK }}
                >
                  See packages and rates <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-full px-6 py-3 text-[14px] transition-colors hover:bg-black/5"
                  style={{ border: `1px solid ${LINE}`, color: INK }}
                >
                  Talk to us first
                </Link>
              </div>
            </Reveal>
            {image && (
              <Reveal delay={120}>
                <figure className="overflow-hidden rounded-[22px]" style={{ border: `1px solid ${LINE}` }}>
                  <img src={image.src} alt={image.alt} className="h-[260px] w-full object-cover sm:h-[320px]" />
                  {image.caption && (
                    <figcaption className="px-4 py-2 text-[12px]" style={{ color: SLATE, background: CREAM_2 }}>
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            )}
          </div>
          <SpectrumRule />
        </section>

        {/* Highlights */}
        <section className="mx-auto max-w-[1180px] px-5 py-[56px] sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h, j) => (
              <Reveal key={h.heading} delay={j * 80}>
                <div className="h-full rounded-[16px] bg-white p-6" style={{ border: `1px solid ${LINE}` }}>
                  <span aria-hidden="true" className="block h-[3px] w-10 rounded-full" style={{ background: band?.hue }} />
                  <h3 className="mt-4 font-wwpl-display text-[21px]" style={{ color: INK }}>
                    {h.heading}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: SLATE }}>
                    {h.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Offers from the band */}
        {band && (
          <section id="offers" className="scroll-mt-24" style={{ background: CREAM_2 }}>
            <div className="mx-auto max-w-[1180px] px-5 py-[64px] sm:px-8">
              <Reveal>
                <Eyebrow hue={band.hue}>Packages and rates</Eyebrow>
                <h2 className="mt-3 font-wwpl-display text-[clamp(26px,4vw,36px)] font-medium" style={{ color: INK }}>
                  {band.heading}
                </h2>
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
              <p className="mt-6 text-[14px]" style={{ color: INK_SOFT }}>
                Looking for something adjacent?{" "}
                <Link to="/services" className="underline underline-offset-4" style={{ color: band.hue }}>
                  Browse the full catalogue
                </Link>
                .
              </p>
            </div>
          </section>
        )}

        {/* Process */}
        <section className="mx-auto max-w-[1180px] px-5 py-[64px] sm:px-8">
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
          </Reveal>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, j) => (
              <Reveal key={p.n} delay={j * 80}>
                <div>
                  <span className="text-[12px] uppercase tracking-[.2em]" style={{ ...mono, color: CLAY }}>
                    {p.n}
                  </span>
                  <h3 className="mt-2 font-wwpl-display text-[21px]" style={{ color: INK }}>
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: SLATE }}>
                    {p.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: INK }}>
          <div className="mx-auto max-w-[1180px] px-5 py-[64px] text-center sm:px-8">
            <Reveal>
              <h2 className="mx-auto max-w-[26ch] font-wwpl-display text-[clamp(26px,4vw,36px)] font-medium leading-tight text-wwpl-cream">
                {closing || "Tell us what you are building, and we will tell you what it takes."}
              </h2>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-medium transition-transform hover:scale-[1.02]"
                  style={{ background: "#F7F3EA", color: INK }}
                >
                  Start the conversation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center rounded-full px-7 py-3 text-[14px] text-wwpl-cream transition-colors hover:bg-white/10"
                  style={{ border: "1px solid rgba(246,241,232,.3)" }}
                >
                  See all services and rates
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailShell;
