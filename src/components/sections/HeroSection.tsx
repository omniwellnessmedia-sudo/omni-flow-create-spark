
import Hero from "@/components/ui/hero";
import { Link } from "react-router-dom";
import { TourTrigger } from "@/components/ui/app-tour";
import { useAppTour } from "@/hooks/useAppTour";
import AppTour from "@/components/ui/app-tour";

const HeroSection = () => {
  const { isOpen, hasSeenTour, steps, startTour, completeTour, skipTour } = useAppTour();

  return (
    <>
      <Hero
        title={
          <>
            <span className="text-rainbow-enhanced">Conscious Content</span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">for Positive Change</span>
          </>
        }
        description="Empowering communities through holistic wellness, authentic storytelling, and conscious business development. From South Africa to the world."
        height="full"
        actions={[
          {
            label: "Explore Our Services",
            href: "/services",
            variant: "wellness"
          },
          {
            label: "Try Our AI Tools", 
            href: "/ai-tools",
            variant: "soft"
          }
        ]}
        className="relative"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-12 mt-8">
          <div className="relative">
            <img 
              src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
              alt="Omni Wellness Media" 
              className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 animate-float relative z-10"
            />
            <div className="absolute inset-0 bg-rainbow-enhanced rounded-full opacity-20 animate-pulse-slow blur-2xl"></div>
          </div>
        </div>

        {/* Content Pillars */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Inspiration', 'Education', 'Empowerment', 'Wellness'].map((pillar, index) => (
            <span 
              key={pillar}
              className="px-4 py-2 glass rounded-xl text-sm font-semibold text-gray-800 shadow-lg hover-lift cursor-default transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {pillar}
            </span>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </Hero>

      {/* App Tour */}
      <AppTour
        isOpen={isOpen}
        steps={steps}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      {/* Tour Trigger */}
      {hasSeenTour && <TourTrigger onClick={startTour} />}
    </>
  );
};

export default HeroSection;
