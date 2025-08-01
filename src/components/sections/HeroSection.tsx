
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

        {/* Quick Access Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10 max-w-2xl mx-auto" data-tour="mission">
          <Link
            to="/blog?category=inspiration"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <span className="text-lg">✨</span>
            <span>Inspiration</span>
          </Link>
          <Link
            to="/blog?category=education"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <span className="text-lg">📚</span>
            <span>Education</span>
          </Link>
          <Link
            to="/blog?category=empowerment"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <span className="text-lg">💪</span>
            <span>Empowerment</span>
          </Link>
          <Link
            to="/wellness-marketplace"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <span className="text-lg">🧘</span>
            <span>Wellness</span>
          </Link>
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
