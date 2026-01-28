import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";
import MissionSection from "@/components/sections/MissionSection";
import ToursRetreatsPreview from "@/components/sections/ToursRetreatsPreview";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import WellnessHumansSection from "@/components/sections/WellnessHumansSection";
import PartnersSection from "@/components/sections/PartnersSection";
import FacebookFeedSection from "@/components/sections/FacebookFeedSection";
import { TwoBeWellCTA } from "@/components/sections/TwoBeWellCTA";
import WhatIsOmniSection from "@/components/sections/WhatIsOmniSection";
import SkipNavigation from "@/components/accessibility/SkipNavigation";
import TeamPreviewSection from "@/components/sections/TeamPreviewSection";

/**
 * Index Page - WCAG 2.2 / ISO 9241 Compliant
 * 
 * Implements:
 * - Skip navigation (WCAG 2.4.1)
 * - ARIA landmarks (WCAG 4.1.2)
 * - Semantic HTML structure
 * - Proper heading hierarchy
 */
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Navigation - WCAG 2.4.1 Bypass Blocks */}
      <SkipNavigation />
      
      {/* Header with navigation */}
      <UnifiedNavigation />
      
      {/* Main Content Area - WCAG Landmark */}
      <main id="main-content" role="main" aria-label="Main content">
        <HeroSection />
        <WhatIsOmniSection />
        <MissionSection />
        
        {/* 2BeWell Featured Section */}
        <section 
          aria-labelledby="twobwell-heading"
          className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TwoBeWellCTA />
          </div>
        </section>
        
        <ServicesSection />
        <ToursRetreatsPreview />
        {/* <AIToolsPreview /> Temporarily hidden */}
        <FeaturedProjectsSection />
        <TeamPreviewSection />
        <TestimonialsSection />
        <VideoShowcaseSection />
        <WellnessHumansSection />
        <PartnersSection />
        <FacebookFeedSection />
      </main>
      
      {/* Footer - WCAG Landmark */}
      <Footer />
    </div>
  );
};

export default Index;
