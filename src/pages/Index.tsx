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
        <section className="section-spacing bg-white">
          <WellnessHumansSection />
        </section>
        <section className="section-spacing bg-gray-50">
          <MissionSection />
        </section>
        <section className="section-spacing bg-white">
          <ServicesSection />
        </section>
        <section className="section-spacing bg-gray-50">
          <VideoShowcaseSection />
        </section>
        <section className="section-spacing bg-white">
          <AIToolsPreview />
        </section>
        <section className="section-spacing bg-gray-50">
          <FeaturedProjectsSection />
        </section>
        <section className="section-spacing bg-white">
          <PartnersSection />
        </section>
        <section className="section-spacing bg-gray-50">
          <TestimonialsSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;