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
    <div className="min-h-screen w-full overflow-x-hidden">
      <MegaNavigation />
      <main className="w-full">
        <Section id="hero" size="breathable" background="gradient">
          <HeroSection />
        </Section>
        <section className="section-spacing bg-white w-full">
          <div className="container-width">
            <WellnessHumansSection />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 w-full">
          <div className="container-width">
            <MissionSection />
          </div>
        </section>
        <section className="section-spacing bg-white w-full">
          <div className="container-width">
            <ServicesSection />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 w-full">
          <div className="container-width">
            <VideoShowcaseSection />
          </div>
        </section>
        <section className="section-spacing bg-white w-full">
          <div className="container-width">
            <AIToolsPreview />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 w-full">
          <div className="container-width">
            <FeaturedProjectsSection />
          </div>
        </section>
        <section className="section-spacing bg-white w-full">
          <div className="container-width">
            <PartnersSection />
          </div>
        </section>
        <section className="section-spacing bg-gray-50 w-full">
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