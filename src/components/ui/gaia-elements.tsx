/**
 * Gaia Elements - Calm Wellness Visual Components
 * 
 * These components add the "Gaia Magic" visual aesthetic:
 * - Floating decorative orbs (calm energy)
 * - Breathing animations (organic feel)
 * - Gradient auras (depth and warmth)
 * - Guide presence indicators
 * 
 * All animations respect prefers-reduced-motion for accessibility.
 */

import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/images";

interface GaiaOrbProps {
  position?: string;
  colorFrom?: string;
  colorTo?: string;
  size?: "sm" | "md" | "lg" | "xl";
  blur?: "md" | "lg" | "xl" | "2xl" | "3xl";
  opacity?: number;
  className?: string;
}

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-48 h-48",
  xl: "w-64 h-64",
};

const blurMap = {
  md: "blur-md",
  lg: "blur-lg",
  xl: "blur-xl",
  "2xl": "blur-2xl",
  "3xl": "blur-3xl",
};

/**
 * GaiaOrb - Floating decorative orb with gradient and blur
 * Creates calm, organic energy throughout the site
 */
export const GaiaOrb = ({
  position = "top-0 left-0",
  colorFrom = "from-primary/30",
  colorTo = "to-secondary/20",
  size = "md",
  blur = "3xl",
  opacity = 30,
  className,
}: GaiaOrbProps) => (
  <div
    className={cn(
      "absolute rounded-full bg-gradient-to-br pointer-events-none motion-safe:animate-pulse-slow",
      sizeMap[size],
      blurMap[blur],
      colorFrom,
      colorTo,
      position,
      className
    )}
    style={{ opacity: opacity / 100 }}
    aria-hidden="true"
  />
);

interface BreathingWrapperProps {
  children: React.ReactNode;
  className?: string;
  duration?: "slow" | "medium" | "fast";
}

/**
 * BreathingWrapper - Adds subtle breathing animation to children
 * Creates organic, alive feeling
 */
export const BreathingWrapper = ({
  children,
  className,
  duration = "medium",
}: BreathingWrapperProps) => {
  const durationClass = {
    slow: "motion-safe:animate-breathing-slow",
    medium: "motion-safe:animate-breathing",
    fast: "motion-safe:animate-breathing-fast",
  };

  return (
    <div className={cn(durationClass[duration], className)}>
      {children}
    </div>
  );
};

interface GaiaAuraProps {
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
}

/**
 * GaiaAura - Radial gradient background behind sections
 * Adds depth and warmth
 */
export const GaiaAura = ({ intensity = "subtle", className }: GaiaAuraProps) => {
  const intensityClass = {
    subtle: "from-primary/5",
    medium: "from-primary/10",
    strong: "from-primary/15",
  };

  return (
    <div
      className={cn(
        "absolute inset-0 bg-gradient-radial to-transparent -z-10 pointer-events-none",
        intensityClass[intensity],
        className
      )}
      aria-hidden="true"
    />
  );
};

interface GuidePresenceProps {
  curator: "chad" | "zenith" | "feroza" | "roam";
  message: string;
  variant?: "fixed" | "inline" | "floating";
  className?: string;
}

const curatorData = {
  chad: {
    name: "Chad",
    emoji: "💡",
    image: IMAGES.team.chad,
  },
  zenith: {
    name: "Zenith",
    emoji: "🧭",
    image: IMAGES.team.zenith,
  },
  feroza: {
    name: "Feroza",
    emoji: "🌿",
    image: IMAGES.team.feroza,
  },
  roam: {
    name: "Roam",
    emoji: "🧭",
    image: IMAGES.logos.omniPrimary,
  },
};

/**
 * GuidePresence - Shows a curator's presence with avatar and message
 * Makes users feel guided throughout the site
 */
export const GuidePresence = ({
  curator,
  message,
  variant = "inline",
  className,
}: GuidePresenceProps) => {
  const data = curatorData[curator];

  if (variant === "fixed") {
    return (
      <div
        className={cn(
          "fixed bottom-24 right-6 bg-background/95 backdrop-blur-sm",
          "rounded-2xl px-4 py-3 shadow-lg border border-border/50 z-40",
          "max-w-xs motion-safe:animate-fade-in",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={data.image}
              alt={data.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              onError={(e) => {
                e.currentTarget.src = IMAGES.logos.omniPrimary;
              }}
            />
            <span className="absolute -bottom-1 -right-1 text-xs">
              {data.emoji}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {data.name} says:
            </p>
            <p className="text-sm text-foreground">"{message}"</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 motion-safe:animate-float-gentle",
          className
        )}
      >
        <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md border border-border/30 flex items-center gap-2">
          <img
            src={data.image}
            alt={data.name}
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = IMAGES.logos.omniPrimary;
            }}
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {message}
          </span>
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-gradient-to-r from-primary/5 to-secondary/5",
        "rounded-xl px-4 py-3 border border-border/30",
        className
      )}
    >
      <div className="relative shrink-0">
        <img
          src={data.image}
          alt={data.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
          onError={(e) => {
            e.currentTarget.src = IMAGES.logos.omniPrimary;
          }}
        />
        <span className="absolute -bottom-1 -right-1 text-sm bg-background rounded-full px-1">
          {data.emoji}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wide">
          {data.emoji} {data.name}'s Tip
        </p>
        <p className="text-sm text-foreground">"{message}"</p>
      </div>
    </div>
  );
};

interface FloatingDecorationsProps {
  variant?: "hero" | "section" | "subtle";
  className?: string;
}

/**
 * FloatingDecorations - Pre-composed floating orb arrangements
 * Use for consistent Gaia magic across sections
 */
export const FloatingDecorations = ({
  variant = "section",
  className,
}: FloatingDecorationsProps) => {
  if (variant === "hero") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
        <GaiaOrb position="top-20 -left-20" size="xl" colorFrom="from-primary/20" colorTo="to-transparent" />
        <GaiaOrb position="top-40 right-10" size="lg" colorFrom="from-secondary/15" colorTo="to-transparent" />
        <GaiaOrb position="bottom-20 left-1/3" size="md" colorFrom="from-accent/20" colorTo="to-transparent" />
        <GaiaOrb position="-bottom-10 -right-10" size="xl" colorFrom="from-primary/10" colorTo="to-secondary/10" />
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
        <GaiaOrb position="top-10 -right-20" size="md" colorFrom="from-primary/10" colorTo="to-transparent" opacity={20} />
        <GaiaOrb position="bottom-10 -left-10" size="sm" colorFrom="from-secondary/10" colorTo="to-transparent" opacity={15} />
      </div>
    );
  }

  // Section variant (default)
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
      <GaiaOrb position="-top-10 -left-10" size="lg" colorFrom="from-primary/15" colorTo="to-transparent" />
      <GaiaOrb position="bottom-0 right-0" size="md" colorFrom="from-secondary/10" colorTo="to-transparent" />
    </div>
  );
};

/**
 * GaiaGradientText - Text with subtle animated gradient
 */
interface GaiaGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GaiaGradientText = ({ children, className }: GaiaGradientTextProps) => (
  <span
    className={cn(
      "bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent",
      "motion-safe:animate-gradient-shift bg-[length:200%_auto]",
      className
    )}
  >
    {children}
  </span>
);

export default {
  GaiaOrb,
  BreathingWrapper,
  GaiaAura,
  GuidePresence,
  FloatingDecorations,
  GaiaGradientText,
};
