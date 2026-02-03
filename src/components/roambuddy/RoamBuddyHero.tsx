import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Compass, Leaf, Sparkles, Heart } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { omniConnectivityBrands } from "@/data/omniConnectivityBrands";

interface RoamBuddyHeroProps {
  onGetStarted?: () => void;
  onActivate?: () => void;
  onActivitySelect?: (activity: string) => void;
}

// Quick action wellness activities
const wellnessActivities = [
  { id: 'yoga', icon: '🧘', label: 'Yoga Retreat' },
  { id: 'hiking', icon: '🥾', label: 'Hiking' },
  { id: 'safari', icon: '🦁', label: 'Safari' },
  { id: 'multi-country', icon: '🧭', label: 'Multi-Country' },
];

export const RoamBuddyHero = ({ onGetStarted, onActivate, onActivitySelect }: RoamBuddyHeroProps) => {
  const brand = omniConnectivityBrands.roam;

  return (
    <section className="relative h-[85vh] min-h-[600px] bg-cover bg-center overflow-hidden">
      <img
        src={IMAGES.tours.capeTown}
        alt="Stay Connected to Your Wellness Journey"
        className="w-full h-full object-cover object-center"
        loading="eager"
        onError={(e) => {
          e.currentTarget.src = IMAGES.locations.capeTown2;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl">
            {/* Brand Badge */}
            <Badge className="mb-6 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2 text-sm">
              <span className="mr-2 text-lg">{brand.icon}</span>
              {brand.fullName}
            </Badge>

            {/* Main Headline - ROAM Branding */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              <span className="text-3xl sm:text-4xl md:text-5xl">{brand.icon}</span>{' '}
              {brand.tagline}
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Mindful connectivity curated for retreats, adventures & conscious travel
            </p>

            {/* Wellness-Focused Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {brand.trustBadges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 backdrop-blur-sm py-3 justify-center text-xs"
                >
                  <span className="text-base mr-1.5">{badge.icon}</span>
                  {badge.label}
                </Badge>
              ))}
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg group"
              >
                <Compass className="mr-2 h-5 w-5 group-hover:rotate-45 transition-transform" />
                Find Your Perfect Plan
              </Button>
            </div>

            {/* Wellness Activity Quick Actions */}
            <div className="space-y-3">
              <p className="text-white/70 text-sm font-medium">Choose your wellness journey:</p>
              <div className="flex flex-wrap gap-3">
                {wellnessActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => onActivitySelect?.(activity.id)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-lg">{activity.icon}</span>
                    {activity.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by RoamBuddy disclosure */}
      <div className="absolute bottom-4 right-4 z-10">
        <Badge variant="outline" className="bg-black/30 text-white/70 border-white/20 text-xs backdrop-blur-sm">
          Powered by RoamBuddy Technology
        </Badge>
      </div>
    </section>
  );
};
