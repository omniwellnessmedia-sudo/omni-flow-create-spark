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
import { Section } from "@/components/ui/section";

const Index = () => {
  return (
    <div className="min-h-screen">
      <MegaNavigation />
      <main>
        <Section id="hero" size="breathable" background="gradient">
          <HeroSection />
        </Section>
        <Section size="large" background="white">
          <WellnessHumansSection />
        </Section>
        <Section size="breathable" background="light">
          <MissionSection />
        </Section>
        <Section size="large" background="white">
          <ServicesSection />
        </Section>
        <Section size="breathable" background="light">
          <VideoShowcaseSection />
        </Section>
        <Section size="large" background="white">
          <AIToolsPreview />
        </Section>
        <Section size="breathable" background="light">
          <FeaturedProjectsSection />
        </Section>
        <Section size="large" background="white">
          <PartnersSection />
        </Section>
        <Section size="breathable" background="light">
          <TestimonialsSection />
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;