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
        
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200"><Leaf className="w-3 h-3 mr-1" />Featured Natural Products</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">2BeWell Natural Collection</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">Handcrafted plant-based skincare and wellness essentials. 100% vegan, cruelty-free, and made with love in South Africa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product, index) => (
                <Card key={product.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border-0 shadow-lg group overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-semibold text-green-600">🪙 {product.wellCoins}</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-heading">{product.name}</CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">R{product.price}</span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Natural</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>
                    <AddToCartButton item={{ id: product.id, image: product.image, title: product.name, price_zar: product.price, price_wellcoins: product.wellCoins, item_type: "product" as const }} size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-rainbow hover:opacity-90 text-white px-8 rounded-full">
                <Link to="/2bewell-shop">Shop Full Collection<ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        <ServicesSection />
        <ToursRetreatsPreview />
        <AIToolsPreview />
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
