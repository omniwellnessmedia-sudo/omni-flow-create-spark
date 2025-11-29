import { useState, useEffect } from "react";
import Hero from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { RoamBuddyPartnershipSection } from "@/components/roambuddy/RoamBuddyPartnershipSection";
import { WellnessCuratorCard } from "@/components/roambuddy/WellnessCuratorCard";
import { RoamBuddyProductCard } from "@/components/roambuddy/RoamBuddyProductCard";
import { DestinationTabs } from "@/components/roambuddy/DestinationTabs";
import { curatedESIMPicks, curatorProfiles, trustBadges } from "@/data/roamBuddyProducts";
import { useRoamBuddyAPI } from "@/hooks/useRoamBuddyAPI";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { Loader2 } from "lucide-react";

const TravelWellConnectedESIM = () => {
  const { getAllProducts, getServices, loading } = useRoamBuddyAPI();
  const { trackProductView, trackAffiliateClick } = useConsciousAffiliate();
  const [apiProducts, setApiProducts] = useState<any[]>([]);

  useEffect(() => {
    trackProductView('RoamBuddy eSIM Store', 'roambuddy_esim', 'wellness_connectivity');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await getAllProducts();
    if (result?.data?.products) {
      setApiProducts(result.data.products);
    }
  };

  const handleProductSelect = async (product: any) => {
    const productName = typeof product === 'string' ? product : product.name;
    await trackAffiliateClick(
      productName,
      'roambuddy_esim',
      'https://www.roambuddy.world/searchPlan',
      'wellness_connectivity',
      'travel_connectivity',
      'roambuddy'
    );
    window.open('https://www.roambuddy.world/searchPlan', '_blank', 'noopener,noreferrer');
  };

  const calculatePeaceOfMindScore = (product: any): number => {
    let score = 70;
    if (product.dataAmount && parseInt(product.dataAmount) > 10) score += 10;
    if (product.validity && parseInt(product.validity) > 30) score += 10;
    if (product.coverage?.length > 1) score += 10;
    return Math.min(score, 100);
  };

  const getWellnessFeatures = (product: any): string[] => {
    return [
      'Meditation app optimized',
      '24/7 wellness support',
      'Instant activation',
      'No roaming fees'
    ];
  };

  return (
    <div className="min-h-screen">
      <Hero
        title="Stay Connected, Stay Well"
        subtitle="Wellness-optimized eSIM connectivity for mindful travelers"
        variant="centered"
        height="medium"
        className="bg-gradient-to-br from-primary/5 via-background to-secondary/5"
      >
        <div className="flex flex-col items-center gap-4 mt-6">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Your Wellness Travel Partner
          </Badge>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-lg">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Hero>

      <Section size="large" background="white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Your Wellness Curators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team has selected the best connectivity solutions for your wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.values(curatorProfiles).map((curator) => (
            <WellnessCuratorCard key={curator.curatorId} curator={curator} />
          ))}
        </div>
      </Section>

      <Section size="large" background="light">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Editor's Picks: Wellness-Optimized Connectivity
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            These recommendations are based on our understanding of wellness travel needs and RoamBuddy's offerings. 
            We haven't personally tested every plan in every country—these are thoughtful curations to help you choose 
            the right connectivity for your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedESIMPicks.map((pick) => {
            const curator = curatorProfiles[pick.curator];
            return (
              <RoamBuddyProductCard
                key={pick.id}
                planName={pick.name}
                destination={pick.destination}
                dataAmount={pick.dataAmount}
                validity={pick.validity}
                coverage={pick.whoShouldGet}
                peaceOfMindScore={pick.peaceOfMindScore}
                wellnessFeatures={[pick.wellnessAngle]}
                isFeatured={true}
                curatorNote={`${curator.name}: "${pick.whyWeChoseIt}"`}
                price={2500}
                onSelect={() => handleProductSelect({ id: pick.id, name: pick.name })}
              />
            );
          })}
        </div>
      </Section>

      <RoamBuddyPartnershipSection />

      <Section size="large" background="white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore All Connectivity Options
          </h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect eSIM for your destination
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DestinationTabs>
            {(destination) => (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiProducts.length > 0 ? (
                  apiProducts.slice(0, 6).map((product, index) => (
                    <RoamBuddyProductCard
                      key={index}
                      planName={product.name || 'eSIM Package'}
                      destination={product.destination}
                      dataAmount={product.dataAmount}
                      validity={product.validity}
                      coverage={product.coverage}
                      peaceOfMindScore={calculatePeaceOfMindScore(product)}
                      wellnessFeatures={getWellnessFeatures(product)}
                      price={product.price || 2500}
                      onSelect={() => handleProductSelect(product)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      Loading wellness connectivity options...
                    </p>
                  </div>
                )}
              </div>
            )}
          </DestinationTabs>
        )}
      </Section>
    </div>
  );
};

export default TravelWellConnectedESIM;
