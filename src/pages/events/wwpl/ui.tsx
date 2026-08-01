import * as React from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "./useReveal";

/**
 * Building blocks for the Celebrating Women Who Protect Life landing page.
 *
 * These deliberately do NOT use the site's shadcn <Button>. That component
 * applies .btn-primary, an unlayered rule that overrides utility classes
 * (see the comment in src/index.css) — it would fight every gold/plum style
 * here. This page is a self-contained visual island, so it carries its own
 * small button vocabulary instead of wrestling the global one.
 */

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium " +
  "transition-[background-color,color,border-color] duration-150 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwpl-gold focus-visible:ring-offset-2 " +
  "whitespace-normal text-center";

export type BtnVariant = "gold" | "ink" | "ghost" | "ghostLight";

const BTN_VARIANT: Record<BtnVariant, string> = {
  gold: "bg-wwpl-gold text-wwpl-plum hover:bg-wwpl-goldLight border border-transparent",
  ink: "bg-wwpl-ink text-wwpl-cream hover:bg-wwpl-plum2 border border-transparent",
  ghost: "bg-transparent text-wwpl-ink border border-wwpl-line hover:border-wwpl-goldDeep hover:text-wwpl-goldDeep",
  ghostLight:
    "bg-transparent text-wwpl-cream border border-[rgba(249,245,240,.35)] hover:border-wwpl-gold hover:text-white",
};

export const btnClass = (variant: BtnVariant = "gold", extra?: string) =>
  cn(BTN_BASE, BTN_VARIANT[variant], "px-[22px] py-[11px] text-[15px]", extra);

/** Anchor styled as a button. Everything on this page navigates, so this is
 *  the common case — real links, never window.open in a click handler. */
export const BtnLink = ({
  variant = "gold",
  className,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: BtnVariant }) => (
  <a className={btnClass(variant, className)} {...rest}>
    {children}
  </a>
);

export const BtnButton = ({
  variant = "gold",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) => (
  <button className={btnClass(variant, className)} {...rest}>
    {children}
  </button>
);

/** Uppercase micro-label. Oswald is reserved for exactly this role. */
export const Eyebrow = ({
  className,
  children,
  rule = false,
}: {
  className?: string;
  children: React.ReactNode;
  rule?: boolean;
}) => (
  <span
    className={cn(
      "font-wwpl-cond uppercase inline-flex items-center gap-[14px]",
      rule && "before:block before:w-11 before:h-px before:bg-current before:opacity-80",
      className
    )}
  >
    {children}
  </span>
);

/** Wraps a block in the page's one-way scroll reveal. Gated behind motion-safe
 *  so reduced-motion users get everything visible and static. */
export const Reveal = ({
  children,
  delayMs = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  as?: React.ElementType;
}) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-wwpl",
        !shown && "motion-safe:opacity-0 motion-safe:translate-y-[26px]",
        className
      )}
    >
      {children}
    </Tag>
  );
};

/** Centred section head: eyebrow + h2 + optional sub. Reused across sections. */
export const SecHead = ({
  eyebrow,
  title,
  sub,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) => (
  <Reveal className={cn("mx-auto max-w-[60ch] text-center mb-14", className)}>
    <Eyebrow
      className={cn(
        "text-[13px] tracking-[.22em]",
        tone === "dark" ? "text-wwpl-gold" : "text-wwpl-goldDeep"
      )}
    >
      {eyebrow}
    </Eyebrow>
    <h2
      className={cn(
        "font-wwpl-display font-semibold text-[clamp(32px,5vw,42px)] leading-[1.12] mt-3",
        tone === "dark" ? "text-white" : "text-wwpl-ink"
      )}
    >
      {title}
    </h2>
    {sub && (
      <p
        className={cn(
          "mt-4 text-[16px] leading-relaxed",
          tone === "dark" ? "text-[rgba(246,241,232,.6)]" : "text-wwpl-slate"
        )}
      >
        {sub}
      </p>
    )}
  </Reveal>
);

/** The page's signature component: image tile with a bottom scrim and an
 *  italic caption carrying an uppercase kicker. */
export const MosaicTile = ({
  src,
  alt,
  kicker,
  caption,
  objectPosition,
  className,
}: {
  src: string;
  alt: string;
  kicker: string;
  caption: string;
  objectPosition?: string;
  className?: string;
}) => (
  <figure
    className={cn(
      "group relative overflow-hidden rounded-2xl bg-wwpl-plum shadow-wwpl-md m-0",
      "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-wwpl",
      "hover:-translate-y-1.5 hover:shadow-wwpl-lg",
      className
    )}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={objectPosition ? { objectPosition } : undefined}
      className="h-full w-full object-cover opacity-[.94] motion-safe:transition-transform motion-safe:duration-[1.1s] motion-safe:ease-wwpl group-hover:scale-[1.06] group-hover:opacity-100"
    />
    <span
      aria-hidden="true"
      className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(20,5,12,.9)_0%,rgba(20,5,12,.3)_44%,rgba(20,5,12,0)_72%)]"
    />
    <figcaption className="absolute z-[2] left-5 right-5 bottom-[18px] font-wwpl-display italic text-[17px] leading-[1.42] text-wwpl-goldLight [text-shadow:0_2px_14px_rgba(0,0,0,.65)] motion-safe:translate-y-[5px] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-wwpl group-hover:translate-y-0">
      <em className="not-italic block font-wwpl-cond text-[11px] tracking-[.2em] uppercase text-[rgba(240,217,168,.6)] mb-[7px]">
        {kicker}
      </em>
      {caption}
    </figcaption>
  </figure>
);
