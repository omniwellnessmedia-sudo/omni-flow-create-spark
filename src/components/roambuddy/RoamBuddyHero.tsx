import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { omniConnectivityBrands } from "@/data/omniConnectivityBrands";

interface RoamBuddyHeroProps {
  onGetStarted?: () => void;
  onActivate?: () => void;
  onActivitySelect?: (activity: string) => void;
}

export const RoamBuddyHero = ({ onGetStarted }: RoamBuddyHeroProps) => {
  const brand = omniConnectivityBrands.roam;

  return (
    <section className="relative h-[85vh] min-h-[600px] bg-black overflow-hidden">
      <img
        src={IMAGES.tours.capeTown}
        alt="Stay Connected to Your Wellness Journey"
        className="w-full h-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        onError={(e) => {
          e.currentTarget.src = IMAGES.locations.capeTown2;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            {/* Brand eyebrow, in the site's shared mono label voice */}
            <p
              className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[.22em] text-white/70"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-[#2BB9B9]" />
              {brand.fullName}
            </p>

            {/* Main Headline, in the site's shared display face */}
            <h1
              className="mb-6 font-wwpl-display font-medium leading-[1.08] tracking-[-.01em] text-white"
              style={{ fontSize: 'clamp(38px, 5.6vw, 68px)' }}
            >
              {brand.tagline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-xl leading-relaxed">
              Mindful connectivity curated for retreats, adventures & conscious travel
            </p>

            {/* Primary CTA */}
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group"
            >
              <Compass className="mr-2 h-5 w-5 group-hover:rotate-45 transition-transform" />
              Find Your Perfect Plan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
