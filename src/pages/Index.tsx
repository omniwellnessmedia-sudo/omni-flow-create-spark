import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";
import MissionSection from "@/components/sections/MissionSection";
import ToursRetreatsPreview from "@/components/sections/ToursRetreatsPreview";
import AIToolsPreview from "@/components/sections/AIToolsPreview";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import WellnessHumansSection from "@/components/sections/WellnessHumansSection";
import PartnersSection from "@/components/sections/PartnersSection";
import FacebookFeedSection from "@/components/sections/FacebookFeedSection";
import { TwoBeWellCTA } from "@/components/sections/TwoBeWellCTA";
import { getFeaturedProducts } from "@/data/twoBeWellProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main>
        <HeroSection />
        <MissionSection />
        
        {/* 2BeWell Featured Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TwoBeWellCTA />
          </div>
        </section>
        
        <ServicesSection />
        <ToursRetreatsPreview />
        {/* <AIToolsPreview /> Temporarily hidden */}
        <FeaturedProjectsSection />
        <TestimonialsSection />
        <VideoShowcaseSection />
        <WellnessHumansSection />
        <PartnersSection />
        <FacebookFeedSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
