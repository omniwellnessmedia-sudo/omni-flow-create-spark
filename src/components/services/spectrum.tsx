import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SPECTRUM, type RateCardOffer } from "@/data/publicRateCard";
import { trackWhatsappClick } from "@/lib/analytics";

/**
 * Spectrum System primitives, light edition.
 *
 * The design handoff's system (Cormorant display, JetBrains Mono labels,
 * one hue per category, spectrum rule) recast on the site's cream ground so
 * the services surfaces read as part of the same website as everything
 * else. Shared by /services and every service detail page so the five
 * surfaces stop looking like two different sites.
 */

export const INK = "#15201F";
export const INK_SOFT = "#33403E";
export const SLATE = "#5A6A68";
export const CLAY = "#9C7434";
export const CREAM = "#FAF8F2";
export const CREAM_2 = "#F4EFE5";
export const LINE = "rgba(21,32,31,.12)";
export const HAIRLINE = "rgba(21,32,31,.07)";

export const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y";

export const mono: CSSProperties = {
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
};

export const SpectrumRule = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`h-[3px] rounded-[3px] ${className}`}
    style={{
      background: `linear-gradient(90deg, ${SPECTRUM.red}, ${SPECTRUM.orange}, ${SPECTRUM.yellow}, ${SPECTRUM.green}, ${SPECTRUM.teal}, ${SPECTRUM.blue}, ${SPECTRUM.violet})`,
    }}
  />
);

/**
 * Scroll reveal: children fade and rise in when they enter the viewport.
 * Inert under prefers-reduced-motion and before hydration, so content is
 * never hidden from crawlers or from anyone with animations off.
 */
export const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(22px)",
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/** Eyebrow label in mono with a hue dot. */
export const Eyebrow = ({ hue, children }: { hue?: string; children: ReactNode }) => (
  <p className="flex items-center gap-3 text-[11px] uppercase tracking-[.22em]" style={{ ...mono, color: SLATE }}>
    {hue && <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full" style={{ background: hue }} />}
    {children}
  </p>
);

/** One offer card, light surface, hue accented. */
export const OfferCard = ({ offer }: { offer: RateCardOffer }) => (
  <article
    className={`group relative flex h-full flex-col overflow-hidden rounded-[18px] bg-white p-6 shadow-[0_1px_3px_rgba(21,32,31,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(21,32,31,.10)] ${offer.wide ? "md:col-span-2 xl:col-span-3" : ""}`}
    style={{ border: `1px solid ${LINE}` }}
  >
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ background: offer.hue }} />
    {/* The name links to the offer's own page. The primary action below still
        goes straight to the enquiry form, so the shorter path to contact is
        not lengthened for anyone who already knows what they want. */}
    <h3 className="font-wwpl-display text-[25px] leading-tight" style={{ color: INK }}>
      <Link to={`/services/${offer.slug}`} className="hover:underline underline-offset-4">
        {offer.name}
      </Link>
    </h3>
    <p className="mt-2 text-[12.5px] uppercase tracking-[.14em]" style={{ ...mono, color: offer.hue }}>
      {offer.price}
    </p>
    <p className="mt-3 text-[15px] leading-relaxed" style={{ color: SLATE }}>
      {offer.blurb}
    </p>
    {offer.bullets.length > 0 && (
      <ul className="mt-4 space-y-2">
        {offer.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-[14px] leading-relaxed" style={{ color: INK_SOFT }}>
            <span aria-hidden="true" className="mt-[8px] h-[5px] w-[5px] flex-none rounded-full" style={{ background: offer.hue }} />
            {b}
          </li>
        ))}
      </ul>
    )}
    <div className="mt-auto flex flex-wrap items-center gap-3 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      <Link
        to={`/contact?service=${offer.slug}`}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-white transition-transform duration-300 group-hover:scale-[1.02]"
        style={{ background: offer.hue }}
      >
        {offer.cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
      {offer.whatsapp && (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsappClick(`services_${offer.slug}`)}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-[13.5px] transition-colors hover:bg-black/5"
          style={{ border: `1px solid ${LINE}`, color: INK }}
        >
          WhatsApp us
        </a>
      )}
      <Link
        to={`/services/${offer.slug}`}
        className="inline-flex items-center gap-1.5 text-[13.5px] underline-offset-4 hover:underline"
        style={{ color: SLATE }}
      >
        Full details
      </Link>
    </div>
    {offer.footnote && (
      <p className="mt-4 text-[12.5px] leading-relaxed" style={{ color: SLATE }}>
        {offer.footnote}
      </p>
    )}
  </article>
);

/**
 * Giant outlined band numeral, the category separator the eye anchors on.
 * Rendered as text with a transparent fill and hue stroke.
 */
export const BandNumeral = ({ n, hue }: { n: string; hue: string }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none select-none font-wwpl-display font-semibold leading-none"
    style={{
      fontSize: "clamp(84px, 12vw, 168px)",
      color: "transparent",
      WebkitTextStroke: `1.5px ${hue}`,
      opacity: 0.55,
    }}
  >
    {n}
  </span>
);
