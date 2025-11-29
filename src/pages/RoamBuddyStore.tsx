import { useEffect, useState, useRef } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { RoamBuddyHero } from '@/components/roambuddy/RoamBuddyHero';
import { CountrySearch } from '@/components/roambuddy/CountrySearch';
import { WellnessCuratorCard } from '@/components/roambuddy/WellnessCuratorCard';
import { RoamBuddyProductCard } from '@/components/roambuddy/RoamBuddyProductCard';
import { RoamBuddyTestimonials } from '@/components/roambuddy/RoamBuddyTestimonials';
import { SIMActivation } from '@/components/roambuddy/SIMActivation';
import { DeviceCompatibility } from '@/components/roambuddy/DeviceCompatibility';
import { RoamBuddyPartnershipSection } from '@/components/roambuddy/RoamBuddyPartnershipSection';
import { curatedESIMPicks, curatorProfiles } from '@/data/roamBuddyProducts';
import { useRoamBuddyAPI, RoamBuddyProduct } from '@/hooks/useRoamBuddyAPI';
import { useConsciousAffiliate } from '@/hooks/useConsciousAffiliate';
import { Award, Shield, Loader2 } from 'lucide-react';

const RoamBuddyStore = () => {
  const [apiProducts, setApiProducts] = useState<RoamBuddyProduct[]>([]);
  const { getAllProducts, loading, error } = useRoamBuddyAPI();
  const { trackProductView, trackAffiliateClick } = useConsciousAffiliate();
  const searchRef = useRef<HTMLDivElement>(null);
  const activationRef = useRef<HTMLDivElement>(null);
  const compatibilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackProductView('RoamBuddy Store', 'roambuddy-store', 'Global connectivity for conscious travelers');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await getAllProducts();
    if (result?.products) {
      setApiProducts(result.products);
    }
  };

  const handleProductSelect = async (product: any) => {
    const productName = typeof product === 'string' ? product : product.name;
    const destinationUrl = 'https://www.roambuddy.world/searchPlan';
    
    await trackAffiliateClick(
      productName,
      'roambuddy-store',
      destinationUrl,
      'Stay connected during wellness travel',
      'connectivity',
      'roambuddy'
    );

    window.open(destinationUrl, '_blank', 'noopener,noreferrer');
  };

  const calculatePeaceOfMindScore = (product: any): number => {
    let score = 60;
    if (product.dataAmount && parseInt(product.dataAmount) >= 10) score += 15;
    if (product.validity && parseInt(product.validity) >= 30) score += 15;
    if (product.coverage && product.coverage.length >= 5) score += 10;
    return Math.min(score, 100);
  };

  const getWellnessFeatures = (product: any): string[] => {
    return [
      'Instant activation for stress-free travel',
      'No roaming shock - stay present',
      'Stay connected to wellness community',
      '24/7 support for peace of mind',
    ];
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToActivation = () => {
    activationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCompatibility = () => {
    compatibilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero Section */}
      <RoamBuddyHero 
        onGetStarted={scrollToSearch}
        onActivate={scrollToActivation}
      />

      {/* Country Search Section */}
      <div ref={searchRef}>
        <CountrySearch 
          onCountrySelect={(country) => {
            console.log('Selected country:', country);
          }}
          onCheckCompatibility={scrollToCompatibility}
        />
      </div>

      {/* Wellness Curators Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Meet Your Wellness Curators
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team of wellness travel experts have personally curated these eSIM picks 
              to ensure you stay mindfully connected on your journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.values(curatorProfiles).map((curator) => (
              <WellnessCuratorCard key={curator.curatorId} curator={curator} />
            ))}
          </div>
        </div>
      </section>

      {/* Editor's Picks Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Editor's Picks - Curated eSIMs
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-selected connectivity plans for wellness-focused travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  price={2500}
                  speed="4G/5G"
                  wellnessFeatures={[pick.wellnessAngle]}
                  peaceOfMindScore={pick.peaceOfMindScore}
                  isFeatured={true}
                  curatorNote={`${curator.name}: "${pick.whyWeChoseIt}"`}
                  onSelect={() => handleProductSelect({ id: pick.id, name: pick.name })}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* All Connectivity Options */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              All Connectivity Options
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete range of global eSIM plans powered by RoamBuddy
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading connectivity options...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                Unable to load real-time products. Please try again later.
              </p>
            </div>
          ) : apiProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {apiProducts.slice(0, 12).map((product) => (
                <RoamBuddyProductCard
                  key={product.id}
                  planName={product.name}
                  destination={product.destination}
                  dataAmount={product.dataAmount}
                  validity={product.validity}
                  coverage={product.coverage}
                  price={product.price}
                  speed="4G/5G"
                  wellnessFeatures={getWellnessFeatures(product)}
                  peaceOfMindScore={calculatePeaceOfMindScore(product)}
                  onSelect={() => handleProductSelect(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                Check back soon for available eSIM plans in your destination.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Partnership Section */}
      <RoamBuddyPartnershipSection />

      {/* Testimonials Section */}
      <RoamBuddyTestimonials />

      {/* SIM Activation */}
      <div ref={activationRef}>
        <SIMActivation />
      </div>

      {/* Device Compatibility */}
      <div ref={compatibilityRef}>
        <DeviceCompatibility />
      </div>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-6 mb-6">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Warranty & Satisfaction Guaranteed
              </h2>
              <p className="text-xl text-white/90">
                Travel with confidence knowing you're backed by our commitment to quality and service
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={scrollToSearch}
                className="bg-white text-blue-900 hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Get Connected Now
              </button>
              <button 
                onClick={() => window.open('https://www.roambuddy.world/', '_blank')}
                className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Visit RoamBuddy
              </button>
            </div>

            <div className="text-sm text-white/70">
              Questions? Contact our wellness travel support team
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoamBuddyStore;
