import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Globe, HeadphonesIcon } from "lucide-react";
import { IMAGES } from "@/lib/images";

interface RoamBuddyHeroProps {
  onGetStarted?: () => void;
  onActivate?: () => void;
}

export const RoamBuddyHero = ({ onGetStarted, onActivate }: RoamBuddyHeroProps) => {
  return (
    <section className="relative h-[75vh] min-h-[500px] bg-cover bg-center overflow-hidden">
      <img
        src={IMAGES.locations.capeTown1}
        alt="Stay Connected Worldwide"
        className="w-full h-full object-cover object-center"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              Avoid Roaming Bill Shock and Save Over 75% with RoamBuddy!
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              Data coverage when you want, where you want
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm py-3 justify-center text-xs">
                <Zap className="h-4 w-4 mr-1" />
                Instant Activation
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm py-3 justify-center text-xs">
                <Shield className="h-4 w-4 mr-1" />
                No Roaming
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm py-3 justify-center text-xs">
                <Globe className="h-4 w-4 mr-1" />
                180+ Countries
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm py-3 justify-center text-xs">
                <HeadphonesIcon className="h-4 w-4 mr-1" />
                24/7 Support
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
              >
                Order an eSIM
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onActivate}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-6 text-lg"
              >
                Activate SIM
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
