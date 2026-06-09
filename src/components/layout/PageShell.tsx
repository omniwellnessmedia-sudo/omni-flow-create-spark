import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fluid layout primitives — replace the ad-hoc max-w-*xl + px-* + py-* sprinkles
 * scattered across pages with a consistent rhythm. Three layers:
 *
 *   <PageShell>   one per route; gives the page a soft tonal backdrop, base
 *                 vertical spacing, and flex-col so the footer sits at the bottom
 *                 even on short pages.
 *
 *   <Section>     vertical band; sets section-level padding rhythm
 *                 (sm: comfortable, lg: signature/hero, none: caller controls).
 *
 *   <Container>   horizontal max-width + responsive gutters. Three widths:
 *                 narrow (reading), default (content), wide (galleries/dashboards).
 *
 * Compose them: PageShell > Section > Container > content.
 */

type Tone = "default" | "muted" | "warm" | "cool" | "transparent";

const toneClasses: Record<Tone, string> = {
  default: "bg-background",
  muted: "bg-muted/30",
  warm: "bg-gradient-to-br from-background via-background to-omni-orange/5",
  cool: "bg-gradient-to-br from-background via-background to-primary/5",
  transparent: "",
};

export const PageShell = ({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) => (
  <div className={cn("min-h-screen flex flex-col", toneClasses[tone], className)}>
    {children}
  </div>
);

type Spacing = "none" | "sm" | "md" | "lg" | "xl";

const spacingClasses: Record<Spacing, string> = {
  none: "",
  sm: "py-8 sm:py-10",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-20 lg:py-24",
  xl: "py-20 sm:py-28 lg:py-32",
};

export const Section = ({
  children,
  spacing = "md",
  tone = "transparent",
  className,
  id,
  as: As = "section",
}: {
  children: ReactNode;
  spacing?: Spacing;
  tone?: Tone;
  className?: string;
  id?: string;
  as?: "section" | "div" | "main" | "header";
}) => (
  <As id={id} className={cn(spacingClasses[spacing], toneClasses[tone], className)}>
    {children}
  </As>
);

type Width = "narrow" | "default" | "wide" | "full";

const widthClasses: Record<Width, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

export const Container = ({
  children,
  width = "default",
  className,
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) => (
  <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", widthClasses[width], className)}>
    {children}
  </div>
);
