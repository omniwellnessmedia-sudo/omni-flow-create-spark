import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
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
        <ServicesSection />
        <ToursRetreatsPreview />
        <TestimonialsSection />
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
