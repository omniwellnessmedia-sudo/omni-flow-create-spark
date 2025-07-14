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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Smartphone, ShoppingCart, Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  return <div className="min-h-screen overflow-safe">
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
        <section className="section-spacing bg-white overflow-safe">
          <div className="container-width">
            <div className="text-center mb-12" data-tour="community">
              <h2 className="text-3xl font-bold mb-4">Omni Wellness Ecosystem</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A comprehensive platform for wellness, travel, and conscious living
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-400">
                    <Globe className="w-8 h-8 text-white bg-transparent" />
                  </div>
                  <CardTitle>Premium eSIM Data</CardTitle>
                  <CardDescription>
                    Stay connected worldwide with instant activation eSIM plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      200+ Countries
                    </div>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Smartphone className="w-4 h-4 mr-2" />
                      5G Speeds
                    </div>
                  </div>
                  <Button asChild className="w-full bg-gradient-primary hover:bg-gradient-primary/90">
                    <Link to="/data-products" onClick={() => setTimeout(() => window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  }), 100)}>
                      Explore eSIM Plans
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-400">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>RoamBuddy Store</CardTitle>
                  <CardDescription>
                    Complete travel solutions with eSIM, WiFi devices & accessories
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Globe className="w-4 h-4 mr-2" />
                      Global Network
                    </div>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      Trusted Partner
                    </div>
                  </div>
                  <Button asChild className="w-full bg-gradient-primary hover:bg-gradient-primary/90">
                    <Link to="/roambuddy-store" onClick={() => setTimeout(() => window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  }), 100)}>
                      Shop Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 bg-yellow-900">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>Wellness Tours</CardTitle>
                  <CardDescription>
                    Transformative travel experiences in South Africa's most beautiful locations
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      Cape Town
                    </div>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      Small Groups
                    </div>
                  </div>
                  <Button asChild className="w-full bg-gradient-primary hover:bg-gradient-primary/90">
                    <Link to="/tours-retreats" onClick={() => setTimeout(() => window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  }), 100)}>
                      Discover Tours
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
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
    </div>;
};
export default Index;