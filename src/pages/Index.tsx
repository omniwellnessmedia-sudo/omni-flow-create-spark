
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
      <main>
        <div className="section-breathable bg-wellhub-light-gradient">
          <HeroSection />
        </div>
        <div className="section-large bg-white">
          <WellnessHumansSection />
        </div>
        <div className="section-breathable bg-wellhub-light-gradient">
          <MissionSection />
        </div>
        <div className="section-large bg-white">
          <ServicesSection />
        </div>
        <div className="section-breathable bg-wellhub-light-gradient">
          <VideoShowcaseSection />
        </div>
        <div className="section-large bg-white">
          <AIToolsPreview />
        </div>
        <div className="section-breathable bg-wellhub-light-gradient">
          <FeaturedProjectsSection />
        </div>
        <div className="section-large bg-white">
          <PartnersSection />
        </div>
        <div className="section-breathable bg-wellhub-light-gradient">
          <TestimonialsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
