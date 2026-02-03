/**
 * GuidedIntroSection - Reusable page header with Gaia magic
 * 
 * Use at the top of any page to add:
 * - Conversational headline
 * - Curator presence
 * - Floating decorative elements
 * - Consistent guided tone
 */

import { cn } from "@/lib/utils";
import { FloatingDecorations, GaiaAura } from "@/components/ui/gaia-elements";
import { CuratorTip } from "@/components/curator/CuratorTip";
import { omniVoice, getPageIntro } from "@/data/omniVoiceGuide";

interface GuidedIntroSectionProps {
  pageKey?: keyof typeof omniVoice.pageIntros;
  headline?: string;
  subheadline?: string;
  curator?: "chad" | "zenith" | "feroza" | "roam";
  curatorMessage?: string;
  showCurator?: boolean;
  showDecorations?: boolean;
  variant?: "default" | "hero" | "minimal";
  className?: string;
  children?: React.ReactNode;
}

export const GuidedIntroSection = ({
  pageKey,
  headline,
  subheadline,
  curator = "chad",
  curatorMessage,
  showCurator = true,
  showDecorations = true,
  variant = "default",
  className,
  children,
}: GuidedIntroSectionProps) => {
  // Get copy from voice guide if pageKey provided
  const pageIntro = pageKey ? getPageIntro(pageKey) : null;
  const displayHeadline = headline || pageIntro?.headline || "Welcome";
  const displaySubheadline = subheadline || pageIntro?.subheadline;

  if (variant === "minimal") {
    return (
      <section className={cn("py-12 px-4", className)}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {displayHeadline}
          </h1>
          {displaySubheadline && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {displaySubheadline}
            </p>
          )}
          {children}
        </div>
      </section>
    );
  }

  if (variant === "hero") {
    return (
      <section className={cn("relative py-20 md:py-28 px-4 overflow-hidden", className)}>
        {/* Background decorations */}
        {showDecorations && <FloatingDecorations variant="hero" />}
        <GaiaAura intensity="medium" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 motion-safe:animate-fade-in">
            {displayHeadline}
          </h1>
          {displaySubheadline && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 motion-safe:animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {displaySubheadline}
            </p>
          )}
          
          {showCurator && curatorMessage && (
            <div className="flex justify-center mt-8 motion-safe:animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CuratorTip 
                curator={curator} 
                message={curatorMessage}
                variant="inline"
              />
            </div>
          )}
          
          {children}
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className={cn("relative py-16 md:py-20 px-4 bg-gradient-to-b from-background to-muted/20 overflow-hidden", className)}>
      {/* Background decorations */}
      {showDecorations && <FloatingDecorations variant="section" />}
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 motion-safe:animate-fade-in">
          {displayHeadline}
        </h1>
        {displaySubheadline && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 motion-safe:animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {displaySubheadline}
          </p>
        )}
        
        {showCurator && curatorMessage && (
          <div className="flex justify-center mt-6 motion-safe:animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CuratorTip 
              curator={curator} 
              message={curatorMessage}
              variant="inline"
            />
          </div>
        )}
        
        {children}
      </div>
    </section>
  );
};

export default GuidedIntroSection;
