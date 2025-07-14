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
import ToursRetreatsPreview from "@/components/sections/ToursRetreatsPreview";
import { Section } from "@/components/ui/section";

const Index = () => {
  return (
    <div className="min-h-screen overflow-safe">
      <MegaNavigation />
      <main className="overflow-safe">
        <Section id="hero" size="breathable" background="gradient">
          <HeroSection />
        </Section>
        <section className="section-spacing bg-white overflow-safe">
          <div className="container-width">
            <WellnessHumansSection />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 overflow-safe">
          <div className="container-width">
            <MissionSection />
          </div>
        </section>
        <section className="section-spacing bg-white overflow-safe">
          <div className="container-width">
            <ServicesSection />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 overflow-safe">
          <div className="container-width">
            <VideoShowcaseSection />
          </div>
        </section>
        <section className="section-spacing bg-white overflow-safe">
          <div className="container-width">
            <ToursRetreatsPreview />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 overflow-safe">
          <div className="container-width">
            <AIToolsPreview />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 overflow-safe">
          <div className="container-width">
            <FeaturedProjectsSection />
          </div>
        </section>
        <section className="section-spacing bg-white overflow-safe">
          <div className="container-width">
            <PartnersSection />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 overflow-safe">
          <div className="container-width">
            <TestimonialsSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;