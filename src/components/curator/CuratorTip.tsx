/**
 * CuratorTip - Reusable component for showing curator guidance
 * 
 * Can be placed anywhere to add a personal, guided touch.
 * Supports multiple display variants: inline, floating, card, minimal.
 */

import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { curators, type CuratorProfile } from "@/data/curatorTips";

export interface CuratorTipProps {
  curator: "chad" | "zenith" | "feroza" | "roam";
  message: string;
  variant?: "inline" | "floating" | "card" | "minimal" | "banner";
  className?: string;
  showImage?: boolean;
  animated?: boolean;
}

const getCuratorData = (curatorId: string): CuratorProfile => {
  return curators[curatorId] || curators.chad;
};

export const CuratorTip = ({
  curator,
  message,
  variant = "inline",
  className,
  showImage = true,
  animated = true,
}: CuratorTipProps) => {
  const data = getCuratorData(curator);

  // Minimal - just text with emoji
  if (variant === "minimal") {
    return (
      <p className={cn("text-sm text-muted-foreground italic", className)}>
        {data.emoji} {data.name}: "{message}"
      </p>
    );
  }

  // Banner - full-width strip
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "w-full bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5",
          "border-y border-border/30 py-3 px-4",
          animated && "motion-safe:animate-fade-in",
          className
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          {showImage && (
            <img
              src={data.image}
              alt={data.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
              onError={(e) => {
                e.currentTarget.src = IMAGES.logos.omniPrimary;
              }}
            />
          )}
          <p className="text-sm text-foreground">
            <span className="font-medium text-primary">{data.emoji} {data.name}:</span>{" "}
            "{message}"
          </p>
        </div>
      </div>
    );
  }

  // Floating - small pill that hovers
  if (variant === "floating") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2",
          "bg-background/95 backdrop-blur-sm rounded-full",
          "px-3 py-1.5 shadow-md border border-border/30",
          animated && "motion-safe:animate-float-gentle",
          className
        )}
      >
        {showImage && (
          <img
            src={data.image}
            alt={data.name}
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = IMAGES.logos.omniPrimary;
            }}
          />
        )}
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {data.emoji} "{message}"
        </span>
      </div>
    );
  }

  // Card - elevated, larger display
  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-background to-muted/30",
          "rounded-2xl p-6 border border-border/50 shadow-lg",
          animated && "motion-safe:animate-fade-in",
          className
        )}
      >
        <div className="flex items-start gap-4">
          {showImage && (
            <div className="relative shrink-0">
              <img
                src={data.image}
                alt={data.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                onError={(e) => {
                  e.currentTarget.src = IMAGES.logos.omniPrimary;
                }}
              />
              <span className="absolute -bottom-1 -right-1 text-lg bg-background rounded-full px-1 shadow-sm">
                {data.emoji}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{data.name}</h4>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {data.title}
              </span>
            </div>
            <p className="text-foreground leading-relaxed">"{message}"</p>
          </div>
        </div>
      </div>
    );
  }

  // Inline - default, compact horizontal display
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "bg-gradient-to-r from-primary/5 to-secondary/5",
        "rounded-xl px-4 py-3 border border-border/30",
        animated && "motion-safe:animate-fade-in",
        className
      )}
    >
      {showImage && (
        <div className="relative shrink-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
            onError={(e) => {
              e.currentTarget.src = IMAGES.logos.omniPrimary;
            }}
          />
          <span className="absolute -bottom-1 -right-1 text-sm bg-background rounded-full px-1">
            {data.emoji}
          </span>
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wide">
          {data.emoji} {data.name}'s Tip
        </p>
        <p className="text-sm text-foreground">"{message}"</p>
      </div>
    </div>
  );
};

// Quick-use component for specific curators
export const ChadTip = ({ message, ...props }: Omit<CuratorTipProps, "curator">) => (
  <CuratorTip curator="chad" message={message} {...props} />
);

export const ZenithTip = ({ message, ...props }: Omit<CuratorTipProps, "curator">) => (
  <CuratorTip curator="zenith" message={message} {...props} />
);

export const FerozaTip = ({ message, ...props }: Omit<CuratorTipProps, "curator">) => (
  <CuratorTip curator="feroza" message={message} {...props} />
);

export const RoamTip = ({ message, ...props }: Omit<CuratorTipProps, "curator">) => (
  <CuratorTip curator="roam" message={message} {...props} />
);

export default CuratorTip;
