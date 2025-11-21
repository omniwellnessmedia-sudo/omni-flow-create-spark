import { useState, useMemo } from "react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { ExternalLink, Sparkles } from "lucide-react";
import { WhyCameraStuffSection } from "@/components/conscious-media/WhyCameraStuffSection";
import { TestimonialsSection } from "@/components/conscious-media/TestimonialsSection";
import { CreativeExamplesSection } from "@/components/conscious-media/CreativeExamplesSection";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import { ProductFilter } from "@/components/conscious-media/ProductFilter";
import { CuratorCard } from "@/components/conscious-media/CuratorCard";
import { EnhancedProductCard } from "@/components/conscious-media/EnhancedProductCard";
import { products, curatorProfiles, UseCase, Curator, SkillLevel } from "@/data/consciousMediaProducts";

const ConsciousMediaInfrastructurePage = () => {
  const { trackAffiliateClick } = useConsciousAffiliate();
  
  const [selectedCategory, setSelectedCategory] = useState<UseCase | 'all'>('all');
  const [selectedCurator, setSelectedCurator] = useState<Curator | 'all'>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | 'all'>('all');

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      const curatorMatch = selectedCurator === 'all' || product.curator === selectedCurator;
      const skillMatch = selectedSkillLevel === 'all' || product.skillLevel === selectedSkillLevel;
      
      return categoryMatch && curatorMatch && skillMatch;
    });
  }, [selectedCategory, selectedCurator, selectedSkillLevel]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCurator('all');
    setSelectedSkillLevel('all');
  };

  const handleMainCTAClick = async () => {
    const affiliateUrl = "https://www.camerastuff.co.za/?a_aid=omniwellnessmedia";
    
    await trackAffiliateClick(
      "CameraStuff Main Store",
      "general-browse",
      affiliateUrl,
      "conscious media infrastructure footer",
      "media equipment"
    );

    window.open(affiliateUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <div className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Business%20Consulting/DSC00124.jpg"
            alt="Conscious Media Documentation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Hand-Curated by Our Team</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground drop-shadow-lg">
            Conscious Media Infrastructure
          </h1>
          <p className="text-lg lg:text-xl text-foreground/90 max-w-2xl mx-auto drop-shadow-md">
            Equipment recommendations from Ferozza, Chad, and Zenith—tested in real wellness projects across South Africa
          </p>
        </div>
      </div>

      {/* Meet Your Curators Section */}
      <Section size="large" className="bg-muted">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">
              Meet Your Curators
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Authentic Recommendations from Real Projects
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each product is personally tested and recommended by our team members who use this equipment daily in wellness documentation across South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(curatorProfiles).map(([id, curator]) => (
              <CuratorCard
                key={id}
                {...curator}
                curatorId={id as Curator}
                onViewPicks={(curatorId) => {
                  setSelectedCurator(curatorId);
                  setSelectedCategory('all');
                  setSelectedSkillLevel('all');
                }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Why CameraStuff Section */}
      <WhyCameraStuffSection />

      {/* Equipment Showcase Section */}
      <Section size="large" className="bg-background">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">
              Featured Equipment
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Professional Tools for Conscious Practice
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Filter by use case, curator, or skill level to find exactly what you need for your wellness media journey.
            </p>
          </div>

          {/* Filter Component */}
          <ProductFilter
            selectedCategory={selectedCategory}
            selectedCurator={selectedCurator}
            selectedSkillLevel={selectedSkillLevel}
            onCategoryChange={setSelectedCategory}
            onCuratorChange={setSelectedCurator}
            onSkillLevelChange={setSelectedSkillLevel}
            onResetFilters={handleResetFilters}
            resultCount={filteredProducts.length}
          />

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <EnhancedProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <p className="text-lg text-muted-foreground">
                No products match your current filters
              </p>
              <Button onClick={handleResetFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Creative Examples Section */}
      <CreativeExamplesSection />

      {/* Enhanced Footer CTA Section */}
      <Section className="bg-muted py-16 lg:py-20 mt-0">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Build Your Conscious Media Infrastructure?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            All equipment handpicked by Ferozza, Chad, and Zenith to support respectful, authentic, professional 
            storytelling. Partnered with CameraStuff—proudly South African since 2006—supporting local creative 
            infrastructure and accessible professional tools.
          </p>
          <Button
            onClick={handleMainCTAClick}
            size="lg"
            className="text-lg px-8"
          >
            Explore CameraStuff
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground italic">
            Need help with media production? Partner with Omni Wellness Media for full-service conscious content creation
          </p>
        </div>
      </Section>
    </div>
  );
};

export default ConsciousMediaInfrastructurePage;
