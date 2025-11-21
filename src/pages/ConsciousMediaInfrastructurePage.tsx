import { useState, useMemo } from "react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { ExternalLink, Sparkles, MessageCircle } from "lucide-react";
import { WhyCameraStuffSection } from "@/components/conscious-media/WhyCameraStuffSection";
import { TestimonialsSection } from "@/components/conscious-media/TestimonialsSection";
import { CreativeExamplesSection } from "@/components/conscious-media/CreativeExamplesSection";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import { ProductFilter } from "@/components/conscious-media/ProductFilter";
import { CuratorCard } from "@/components/conscious-media/CuratorCard";
import { SimplifiedProductCard } from "@/components/conscious-media/SimplifiedProductCard";
import { products, curatorProfiles, UseCase, Curator, SkillLevel } from "@/data/consciousMediaProducts";

const ConsciousMediaInfrastructurePage = () => {
  const { trackAffiliateClick } = useConsciousAffiliate();
  
  const [selectedCategory, setSelectedCategory] = useState<UseCase | 'all'>('all');
  const [selectedCurator, setSelectedCurator] = useState<Curator | 'all'>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | 'all'>('all');
  const [displayCount, setDisplayCount] = useState(6);

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
      const curatorMatch = selectedCurator === 'all' || product.curator === selectedCurator;
      const skillMatch = selectedSkillLevel === 'all' || product.skillLevel === selectedSkillLevel;
      
      return categoryMatch && curatorMatch && skillMatch;
    });
  }, [selectedCategory, selectedCurator, selectedSkillLevel]);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCurator('all');
    setSelectedSkillLevel('all');
    setDisplayCount(6);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, filteredProducts.length));
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
            <span className="text-sm font-medium text-primary">Curated Recommendations from Our Team</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground drop-shadow-lg">
            Conscious Media Equipment Guide
          </h1>
          <p className="text-lg lg:text-xl text-foreground/90 max-w-2xl mx-auto drop-shadow-md">
            Honest recommendations from Ferozza, Chad, and Zenith to help you choose the right tools for your wellness storytelling
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto italic">
            We haven't personally tested every product—these are thoughtful recommendations based on our experience in wellness media production across South Africa
          </p>
        </div>
      </div>

      {/* Meet Your Curators Section */}
      <Section size="large" className="bg-muted">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">
              Meet Your Guides
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Omni Wellness Media Team
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each recommendation reflects our team's perspective on what might work for your wellness documentation needs. 
              We're here to help you think through your choices, not to sell you equipment.
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
                  setDisplayCount(6);
                }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Why CameraStuff Section */}
      <WhyCameraStuffSection />

      {/* Equipment Recommendations Section */}
      <Section size="large" className="bg-background">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-sm font-bold text-primary uppercase tracking-wider">
              Equipment Recommendations
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Find What Fits Your Vision
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Filter by your needs and our team's insights. Not sure what's right? 
              <Button 
                variant="link" 
                className="inline px-1" 
                onClick={() => window.location.href = '/contact'}
              >
                Talk to us—we're happy to help you think through it.
              </Button>
            </p>
          </div>

          {/* Filter Component */}
          <ProductFilter
            selectedCategory={selectedCategory}
            selectedCurator={selectedCurator}
            selectedSkillLevel={selectedSkillLevel}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setDisplayCount(6);
            }}
            onCuratorChange={(cur) => {
              setSelectedCurator(cur);
              setDisplayCount(6);
            }}
            onSkillLevelChange={(skill) => {
              setSelectedSkillLevel(skill);
              setDisplayCount(6);
            }}
            onResetFilters={handleResetFilters}
            resultCount={filteredProducts.length}
          />

          {/* Products List */}
          <div>
            {displayedProducts.map((product, index) => (
              <SimplifiedProductCard 
                key={product.id} 
                product={product}
                imagePosition={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          {/* Load More / No Results */}
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

          {hasMore && (
            <div className="text-center pt-8">
              <Button 
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
              >
                Show More Equipment ({filteredProducts.length - displayCount} remaining)
              </Button>
            </div>
          )}

          {/* Consultation CTA */}
          <div className="bg-muted border border-border rounded-xl p-8 text-center space-y-4 mt-12">
            <MessageCircle className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-2xl font-bold text-foreground">
              Need Help Choosing the Right Equipment?
            </h3>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Every wellness project is unique. Let's talk about what you're creating and help you make the right choices for your specific needs and budget.
            </p>
            <Button
              onClick={() => window.location.href = '/contact'}
              size="lg"
              className="mt-4"
            >
              Schedule a Consultation with Omni
            </Button>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Creative Examples Section */}
      <CreativeExamplesSection />

      {/* Footer CTA Section */}
      <Section className="bg-muted py-16 lg:py-20 mt-0">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Partner with CameraStuff
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Omni Wellness Media partners with CameraStuff—a proudly South African company serving creators since 2006. 
            Supporting local businesses means supporting accessible professional tools for our creative community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleMainCTAClick}
              size="lg"
              className="text-lg px-8"
            >
              Browse CameraStuff
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Talk to Omni
            </Button>
          </div>
          <p className="text-sm text-muted-foreground italic pt-4">
            Need full media production services? Omni creates conscious wellness content from concept to delivery.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default ConsciousMediaInfrastructurePage;
