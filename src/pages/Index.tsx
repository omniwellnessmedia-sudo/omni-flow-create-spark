import HeroSection from "@/components/sections/HeroSection";
import ScorecardSection from "@/components/sections/ScorecardSection";
import FeaturedEventSection from "@/components/sections/FeaturedEventSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import ToursRetreatsPreview from "@/components/sections/ToursRetreatsPreview";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import PartnersSection from "@/components/sections/PartnersSection";
import FoundationSection from "@/components/sections/FoundationSection";
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with navigation — includes skip links */}
      <UnifiedNavigation />
      
      {/* Main Content Area - WCAG Landmark */}
      <main id="main-content" role="main" aria-label="Main content">
        <HeroSection />
        {/* Directly after the hero, and only here. It is the one thing on
            the site that qualifies a visitor without costing anybody an
            hour, so it earns the best slot. Repeating it between the other
            sections would read as a pop-up that cannot be closed, and the
            later placements would cannibalise this one. */}
        <ScorecardSection />
        <FeaturedEventSection />
        <ServicesSection />
        <ToursRetreatsPreview />
        <FeaturedProjectsSection />
        <FoundationSection />
        <PartnersSection />
      </main>
      
      {/* Footer - WCAG Landmark */}
      <Footer />
    </div>
  );
};

export default Index;
