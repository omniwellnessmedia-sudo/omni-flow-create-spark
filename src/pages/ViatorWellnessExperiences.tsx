import { useState, useEffect } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, Heart, Globe, Shield, ExternalLink, 
  Leaf, Users, Mountain, Waves, Lightbulb, MapPin, RefreshCw, Loader2
} from 'lucide-react';
import { useConsciousAffiliate } from '@/hooks/useConsciousAffiliate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WellnessExperience {
  id: string;
  name: string;
  location: string;
  priceFrom: number;
  image: string;
  category: string;
  curatorName: string;
  whyWeChoseIt: string;
  whoShouldGo: string[];
  viatorProductCode: string;
  consciousnessIntent: string;
}

export default function ViatorWellnessExperiences() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apiTours, setApiTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();
  const { toast } = useToast();

  const curators = [
    {
      name: 'Zenith Yasin',
      title: 'Administrative Director & Wellness Curator',
      avatar: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg',
      bio: 'With a deep passion for holistic wellness and cultural immersion, Zenith curates transformative spa and meditation experiences.',
      expertise: 'Spa & Wellness',
    },
    {
      name: 'Chad Cupido',
      title: 'Founder & Cultural Experience Curator',
      avatar: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/chad%20cupido%20portrait.jpg',
      bio: 'Chad specializes in authentic cultural healing experiences that honor indigenous traditions and promote conscious travel.',
      expertise: 'Cultural Healing',
    },
    {
      name: 'Abbi Berkovitz',
      title: 'Media Creator & Nature Immersion Curator',
      avatar: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg',
      bio: 'Abbi\'s lens captures the soul of nature-based wellness experiences, helping travelers find their perfect outdoor sanctuary.',
      expertise: 'Nature Immersions',
    },
  ];

  const experiences: WellnessExperience[] = [
    {
      id: "viator-snorkeling-1",
      name: "Kelp Forest Snorkeling in Cape Town",
      location: "Cape Town, South Africa",
      priceFrom: 975,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80",
      category: "adventure",
      curatorName: "Zenith",
      whyWeChoseIt: "Immersing in the kelp forests connects you with marine biodiversity in a meditative, weightless environment. The oceanic experience promotes mindfulness while supporting local eco-tourism.",
      whoShouldGo: ["Ocean lovers", "Adventure seekers", "Eco-conscious travelers"],
      viatorProductCode: "",
      consciousnessIntent: "nature_connection"
    },
    {
      id: "viator-surf-1",
      name: "Private Surf Lessons Muizenberg",
      location: "Muizenberg, Cape Town",
      priceFrom: 510,
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80",
      category: "adventure",
      curatorName: "Chad",
      whyWeChoseIt: "Surfing cultivates presence, balance, and respect for nature's power. Muizenberg's gentle waves make it ideal for beginners seeking flow state experiences.",
      whoShouldGo: ["Beginners welcome", "Active wellness seekers", "Ocean enthusiasts"],
      viatorProductCode: "",
      consciousnessIntent: "flow_state"
    },
    {
      id: "viator-marine-1",
      name: "Marine Big 5 Safari with Transport",
      location: "Cape Town, South Africa",
      priceFrom: 3160,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "ocean",
      curatorName: "Abbi",
      whyWeChoseIt: "Witnessing whales, sharks, seals, dolphins, and penguins in their natural habitat fosters deep respect for marine ecosystems and our interconnectedness with all life.",
      whoShouldGo: ["Wildlife enthusiasts", "Conscious travelers", "Photography lovers"],
      viatorProductCode: "",
      consciousnessIntent: "ecological_awareness"
    },
    {
      id: "viator-kayak-1",
      name: "Atlantic Outlook Kayak Tour Cape Town",
      location: "Cape Town, South Africa",
      priceFrom: 600,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80",
      category: "ocean",
      curatorName: "Zenith",
      whyWeChoseIt: "Kayaking provides low-impact cardio while connecting you with the ocean's rhythm. The Atlantic perspectives offer both adventure and meditative solitude.",
      whoShouldGo: ["Active wellness seekers", "Ocean lovers", "Photography enthusiasts"],
      viatorProductCode: "",
      consciousnessIntent: "meditative_movement"
    },
    {
      id: "viator-whale-1",
      name: "Whale Watching Tour in Hermanus with Hotel Pickup",
      location: "Hermanus, South Africa",
      priceFrom: 3733,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      category: "ocean",
      curatorName: "Chad",
      whyWeChoseIt: "Hermanus offers world-class whale watching during migration season. The experience of these gentle giants promotes humility and wonder—key wellness qualities.",
      whoShouldGo: ["Nature enthusiasts", "Families", "Conscious travelers"],
      viatorProductCode: "",
      consciousnessIntent: "awe_and_wonder"
    },
    {
      id: "viator-catamaran-1",
      name: "1 Hour Coastal Catamaran Cruise from Cape Town",
      location: "Cape Town, South Africa",
      priceFrom: 370,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
      category: "ocean",
      curatorName: "Abbi",
      whyWeChoseIt: "Sunset sailing combines the therapeutic effects of water, gentle movement, and the day's transition into evening—perfect for reflection and relaxation.",
      whoShouldGo: ["Sunset lovers", "Couples", "Anyone seeking peaceful moments"],
      viatorProductCode: "",
      consciousnessIntent: "relaxation"
    },
    {
      id: "viator-ebike-1",
      name: "Cape Town eBike City Tour",
      location: "Cape Town, South Africa",
      priceFrom: 1500,
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80",
      category: "adventure",
      curatorName: "Chad",
      whyWeChoseIt: "eBike tours combine physical activity with cultural exploration, allowing you to cover more ground without exhaustion. Perfect for mindful urban wellness.",
      whoShouldGo: ["Active explorers", "Culture enthusiasts", "Eco-conscious travelers"],
      viatorProductCode: "",
      consciousnessIntent: "urban_wellness"
    },
    {
      id: "viator-skydive-1",
      name: "Sky Diving Cape Town",
      location: "Cape Town, South Africa",
      priceFrom: 6523,
      image: "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&q=80",
      category: "adventure",
      curatorName: "Zenith",
      whyWeChoseIt: "Skydiving offers a profound confrontation with fear and exhilaration. The adrenaline rush followed by the serene descent creates a unique mindfulness opportunity.",
      whoShouldGo: ["Thrill seekers", "Personal growth enthusiasts", "Courage cultivators"],
      viatorProductCode: "",
      consciousnessIntent: "courage_and_presence"
    },
    {
      id: "viator-rock-climb-1",
      name: "Half-Day Rock-Climbing on Table Mountain",
      location: "Table Mountain, Cape Town",
      priceFrom: 3000,
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80",
      category: "adventure",
      curatorName: "Abbi",
      whyWeChoseIt: "Rock climbing on Table Mountain combines physical challenge with breathtaking views. Each move requires full presence and trust—both in yourself and your guide.",
      whoShouldGo: ["Adventure seekers", "Fitness enthusiasts", "Those conquering fears"],
      viatorProductCode: "",
      consciousnessIntent: "strength_and_trust"
    },
    {
      id: "viator-paraglide-1",
      name: "Paragliding in Cape Town (Icarus)",
      location: "Cape Town, South Africa",
      priceFrom: 1600,
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80",
      category: "adventure",
      curatorName: "Chad",
      whyWeChoseIt: "Paragliding offers bird's-eye perspectives that shift your relationship with earth and sky. The experience of flight is both liberating and humbling.",
      whoShouldGo: ["Adventure seekers", "Perspective shifters", "Those seeking freedom"],
      viatorProductCode: "",
      consciousnessIntent: "liberation_and_perspective"
    },
  ];

  // Fetch Viator tours from API
  useEffect(() => {
    fetchViatorTours();
  }, []);

  const fetchViatorTours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('viator-tours', {
        body: { action: 'get_cached_tours', category: 'wellness' }
      });

      if (error) throw error;

      if (data?.tours && data.tours.length > 0) {
        setApiTours(data.tours);
      } else {
        // Database empty, trigger sync
        console.log('No cached tours found, triggering sync...');
        await syncViatorTours();
      }
    } catch (error) {
      console.error('Error fetching Viator tours:', error);
      toast({
        title: "Unable to load tours",
        description: "Using curated picks only. Please try syncing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncViatorTours = async () => {
    try {
      setSyncing(true);
      toast({
        title: "Syncing wellness experiences...",
        description: "This may take a moment.",
      });

      const { data, error } = await supabase.functions.invoke('viator-tours', {
        body: { action: 'search_tours' }
      });

      if (error) throw error;

      if (data?.cachedTours) {
        setApiTours(data.cachedTours);
        toast({
          title: "Sync complete!",
          description: `Loaded ${data.cachedTours.length} wellness experiences.`,
        });
      }
    } catch (error) {
      console.error('Error syncing Viator tours:', error);
      toast({
        title: "Sync failed",
        description: "Could not sync with Viator. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const filteredExperiences = selectedCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

  const filteredApiTours = selectedCategory === 'all' 
    ? apiTours 
    : apiTours.filter(tour => {
        const category = tour.category?.toLowerCase();
        return category === selectedCategory;
      });

  const handleExperienceClick = (experience: WellnessExperience, e: React.MouseEvent) => {
    e.preventDefault();
    // Link to partner shop for curated collections
    const affiliateUrl = generateAffiliateLink({
      productSlug: '', // Empty for partner shop home
      channel: 'viator_wellness_experiences',
      wellnessCategory: experience.category,
      consciousnessIntent: experience.consciousnessIntent,
      affiliateProgram: 'viator'
    });

    trackAffiliateClick(
      experience.name,
      'viator_wellness_experiences',
      affiliateUrl,
      experience.consciousnessIntent,
      experience.category,
      'viator'
    );
  };

  const handleApiTourClick = (tour: any, e: React.MouseEvent) => {
    e.preventDefault();
    // Link to partner shop for all tours
    const affiliateUrl = generateAffiliateLink({
      productSlug: '', // Empty for partner shop home
      channel: 'viator_wellness_api',
      wellnessCategory: tour.category || 'wellness',
      affiliateProgram: 'viator'
    });

    trackAffiliateClick(
      tour.title,
      'viator_wellness_api',
      affiliateUrl,
      'wellness_exploration',
      tour.category,
      'viator'
    );
  };

  const partnerShopUrl = generateAffiliateLink({
    productSlug: '',
    channel: 'viator_partner_shop',
    affiliateProgram: 'viator'
  });

  return (
    <>
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-base px-4 py-2" variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Curated by Omni Wellness Team
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Wellness Experiences Worldwide
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Handpicked transformative wellness journeys curated by our team of conscious travel experts. 
              Every experience is vetted for authenticity, safety, and genuine healing potential.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href={partnerShopUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5 mr-2" />
                  View Our Partner Shop
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Curated Picks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Curators */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Meet Your Wellness Curators</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team personally vets every experience, ensuring they align with conscious travel principles 
                and deliver authentic transformation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {curators.map((curator, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                      <AvatarImage src={curator.avatar} alt={curator.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {curator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-1">{curator.name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{curator.title}</p>
                    <Badge variant="secondary" className="mb-4">
                      <Leaf className="w-3 h-3 mr-1" />
                      {curator.expertise}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {curator.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Viator Partnership */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why We Partner with Viator</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We've chosen Viator as our global wellness experience partner because they share our 
                commitment to authentic, safe, and transformative travel.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Safety & Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every experience on Viator undergoes rigorous safety and quality checks. They verify 
                    local operators, insurance coverage, and health protocols—so you can focus on healing, 
                    not logistics.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Global Reach, Local Authenticity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Viator connects you with local wellness practitioners and healers worldwide while 
                    providing the customer service and booking convenience of a trusted global platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Flexible Cancellation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Life happens. Most Viator wellness experiences offer flexible cancellation policies, 
                    giving you peace of mind when booking transformative experiences in advance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Real Reviews from Real Travelers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Viator's transparent review system lets you see honest feedback from travelers who've 
                    actually experienced the wellness journeys—no marketing fluff, just real insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Categories & Experiences */}
      <section className="py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Curated Wellness Experiences</h2>

            <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-12">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ocean">
                  <Waves className="w-4 h-4 mr-2" />
                  Ocean
                </TabsTrigger>
                <TabsTrigger value="adventure">
                  <Mountain className="w-4 h-4 mr-2" />
                  Adventure
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-0">
                {/* Curator Picks Section */}
                <div className="mb-16">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Team Curated Picks</h3>
                    <Badge variant="secondary">
                      <Heart className="w-3 h-3 mr-1" />
                      Hand-Selected
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredExperiences.map((experience) => (
                    <Card 
                      key={experience.id} 
                      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                    >
                      {/* Experience Image */}
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={experience.image}
                          alt={experience.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col gap-4">
                        {/* Location */}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {experience.location}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold leading-tight">
                          {experience.name}
                        </h3>

                        {/* Curator */}
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage 
                              src={curators.find(c => c.name.includes(experience.curatorName))?.avatar} 
                              alt={experience.curatorName} 
                            />
                            <AvatarFallback className="text-xs">
                              {experience.curatorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            Curated by {experience.curatorName}
                          </span>
                        </div>

                        {/* Why We Chose It */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-primary mb-1">Why we chose it:</p>
                              <p className="text-xs leading-relaxed text-foreground/90">
                                {experience.whyWeChoseIt}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Who Should Go */}
                        <div className="flex flex-wrap gap-1.5">
                          {experience.whoShouldGo.map((who, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {who}
                            </Badge>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div className="mt-auto pt-4 border-t flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">From</p>
                            <p className="text-xl font-bold text-primary">ZAR {experience.priceFrom}</p>
                          </div>
                          <Button 
                            asChild
                            className="group/btn"
                          >
                            <a
                              href={partnerShopUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleExperienceClick(experience, e)}
                            >
                              Book on Viator
                              <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                    ))}
                  </div>
                </div>

                {/* API Tours Section */}
                {loading ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-6">More Wellness Experiences</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="w-full aspect-[4/3]" />
                          <div className="p-6 space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : filteredApiTours.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">More Wellness Experiences</h3>
                      <Badge variant="outline">
                        <Globe className="w-3 h-3 mr-1" />
                        {filteredApiTours.length} Available
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredApiTours.map((tour) => (
                        <Card 
                          key={tour.id} 
                          className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={tour.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                              alt={tour.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>

                          <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {tour.location || 'Cape Town'}
                              </span>
                              <span>{tour.duration || 'Varies'}</span>
                            </div>

                            <h3 className="text-xl font-bold leading-tight line-clamp-2">
                              {tour.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                              {tour.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-xs text-muted-foreground">From</p>
                                <p className="text-2xl font-bold text-primary">
                                  {tour.currency} {tour.price_from || 'TBD'}
                                </p>
                              </div>
                              <Button 
                                asChild
                                size="lg"
                                className="gap-2"
                              >
                                <a
                                  href={partnerShopUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => handleApiTourClick(tour, e)}
                                >
                                  Book on Viator
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Not Sure CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Not Sure Where to Start?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our wellness curators are here to help you find the perfect experience for your healing journey. 
              We'll ask about your intentions, preferences, and wellness goals to recommend the ideal match.
            </p>
            <Button size="lg" className="text-lg px-8">
              Talk to Our Wellness Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
