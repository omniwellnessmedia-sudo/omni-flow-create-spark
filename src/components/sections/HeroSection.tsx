
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
            <span className="text-rainbow-enhanced">Bridging Wellness, Outreach & Media</span>
            <br />
            <span className="text-gray-900 dark:text-gray-100">Empowering South Africa's Journey to Health & Consciousness</span>
          </>
        }
        description="Driving positive change through conscious content creation, business development, and sustainable solutions."
        height="medium"
        actions={[
          {
            label: "Learn More",
            href: "/about",
            variant: "wellness"
          },
          {
            label: "Our Services", 
            href: "/services",
            variant: "outline"
          },
          {
            label: "Get in Touch",
            href: "/contact",
            variant: "soft"
          }
        ]}
        className="relative"
      />

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
