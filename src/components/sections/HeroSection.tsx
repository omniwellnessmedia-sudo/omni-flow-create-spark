
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
        <div className="flex justify-center mb-8 sm:mb-12 mt-4 sm:mt-8 overflow-safe">
          <div className="relative max-w-full">
            <img 
              src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
              alt="Omni Wellness Media" 
              className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48 animate-float relative z-10 mx-auto object-contain"
            />
            <div className="absolute inset-0 bg-rainbow-enhanced rounded-full opacity-20 animate-pulse-slow blur-2xl max-w-full"></div>
          </div>
        </div>

        {/* Content Pillars */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 relative z-10 overflow-safe px-4">
          {[
            { name: 'Inspiration', color: 'from-purple-500 to-pink-500', icon: '✨' },
            { name: 'Education', color: 'from-blue-500 to-cyan-500', icon: '📚' },
            { name: 'Empowerment', color: 'from-green-500 to-emerald-500', icon: '💪' },
            { name: 'Wellness', color: 'from-orange-500 to-yellow-500', icon: '🧘' }
          ].map((pillar, index) => (
            <div 
              key={pillar.name}
              className={`group relative px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r ${pillar.color} rounded-xl sm:rounded-2xl text-white font-semibold text-xs sm:text-sm shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-2xl animate-fade-in flex-shrink-0 min-w-0 max-w-full`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-sm sm:text-lg group-hover:scale-125 transition-transform duration-300 flex-shrink-0">
                  {pillar.icon}
                </span>
                <span className="group-hover:tracking-wider transition-all duration-300 text-ellipsis overflow-hidden whitespace-nowrap">
                  {pillar.name}
                </span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl sm:rounded-2xl transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator - positioned lower to avoid overlap */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-0">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
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
