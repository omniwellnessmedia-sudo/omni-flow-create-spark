
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 relative z-10 max-w-4xl mx-auto px-4" data-tour="mission">
          {[
            { name: 'Inspiration', color: 'from-purple-500 to-pink-500', icon: '✨', href: '/blog?category=inspiration' },
            { name: 'Education', color: 'from-blue-500 to-cyan-500', icon: '📚', href: '/blog?category=education' },
            { name: 'Empowerment', color: 'from-green-500 to-emerald-500', icon: '💪', href: '/blog?category=empowerment' },
            { name: 'Wellness', color: 'from-orange-500 to-yellow-500', icon: '🧘', href: '/wellness-marketplace' }
          ].map((pillar, index) => (
            <Link
              key={pillar.name}
              to={pillar.href}
              className={`group relative p-6 bg-gradient-to-br ${pillar.color} rounded-2xl text-white font-semibold shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in block text-center`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </span>
                <span className="text-base font-bold group-hover:tracking-wider transition-all duration-300">
                  {pillar.name}
                </span>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
            </Link>
          ))}
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
