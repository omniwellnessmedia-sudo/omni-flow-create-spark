
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WellnessHumansSection from "@/components/sections/WellnessHumansSection";
import MissionSection from "@/components/sections/MissionSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import AIToolsPreview from "@/components/sections/AIToolsPreview";
import PartnersSection from "@/components/sections/PartnersSection";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <MegaNavigation />
      <main className="pt-20">
        <div className="section-breathable">
          <HeroSection />
        </div>
        <div className="section-large bg-gradient-to-br from-wellhub-light/30 to-white">
          <WellnessHumansSection />
        </div>
        <div className="section-breathable bg-gradient-to-br from-white to-wellhub-light/20">
          <MissionSection />
        </div>
        <div className="section-large bg-gradient-to-br from-wellhub-light/30 to-white">
          <ServicesSection />
        </div>
        <div className="section-breathable bg-gradient-to-br from-white to-wellhub-accent/10">
          <VideoShowcaseSection />
        </div>
        <div className="section-large bg-gradient-to-br from-wellhub-light/30 to-white">
          <AIToolsPreview />
        </div>
        <div className="section-breathable bg-gradient-to-br from-white to-wellhub-light/20">
          <FeaturedProjectsSection />
        </div>
        <div className="section-large bg-gradient-to-br from-wellhub-light/30 to-white">
          <PartnersSection />
        </div>
        <div className="section-breathable bg-gradient-to-br from-white to-wellhub-accent/10">
          <TestimonialsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
