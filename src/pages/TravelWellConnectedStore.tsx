import { useState, useEffect } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Clock, 
  Check, 
  Star, 
  Loader2,
  Heart,
  Shield,
  Users,
  Mountain,
  Sparkles,
  Globe,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

interface LocalTour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  image: string;
  link: string;
  highlights: string[];
  badge?: string;
}

interface ViatorTour {
  id: string;
  viator_product_code: string;
  title: string;
  description: string;
  duration: string;
  price_from: number;
  currency: string;
  location: string;
  rating: number;
  review_count: number;
  image_url: string;
  booking_url: string;
  category: string;
}

const TravelWellConnectedStore = () => {
  const [viatorTours, setViatorTours] = useState<ViatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingViator, setSyncingViator] = useState(false);
  const { toast } = useToast();

  const localTours: LocalTour[] = [
    {
      id: 'annual-omni-retreat',
      title: 'Annual Omni Wellness Retreat',
      description: 'Transformative 4-day wellness journey in Cape Wine Country with yoga, meditation, and conscious community.',
      price: 3999,
      duration: '4 days',
      location: 'Cape Wine Country, South Africa',
      image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg',
      link: '/tour-detail/winter-wine-country-wellness',
      highlights: [
        'Daily yoga & meditation',
        'Organic farm-to-table meals',
        'Wine country exploration',
        'Conscious community building'
      ],
      badge: 'Flagship Experience'
    },
    {
      id: 'great-mother-cave',
      title: 'Great Mother Cave Tour with Chief Kingsley',
      description: 'Sacred indigenous journey through ancient caves with traditional Khoi ceremonies and plant wisdom.',
      price: 1500,
      duration: 'Full day (8:30 AM - 4:30 PM)',
      location: 'Muizenberg, Cape Town',
      image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg',
      link: '/tours/great-mother-cave-tour',
      highlights: [
        'Indigenous plant identification',
        'Ancient rock art viewing',
        'Traditional Khoi ceremonies',
        'Celestial alignments at Tunnel Cave'
      ],
      badge: 'Sacred Experience'
    },
    {
      id: 'muizenberg-wellness-walk',
      title: 'Muizenberg Cave Wellness Journey',
      description: 'Evidence-based integration of Khoi-San healing traditions with contemporary wellness science.',
      price: 3999,
      duration: '7-10 days',
      location: 'Muizenberg, Cape Town',
      image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg',
      link: '/tours/muizenberg-cave-tours',
      highlights: [
        'Trauma-informed somatic practices',
        'Indigenous knowledge integration',
        'Clinical competencies development',
        'Community impact partnership'
      ],
      badge: 'Academic Program'
    }
  ];

  useEffect(() => {
    loadViatorTours();
  }, []);

  const loadViatorTours = async () => {
    try {
      setLoading(true);
      
      // First, try to get cached tours
      const { data: cachedTours, error } = await supabase
        .from('viator_tours')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (cachedTours && cachedTours.length > 0) {
        setViatorTours(cachedTours);
      } else {
        // If no cached tours, sync from Viator API
        await syncViatorTours();
      }
    } catch (error) {
      console.error('Error loading Viator tours:', error);
      toast({
        title: "Loading Notice",
        description: "Showing local tours. Viator tours will sync shortly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncViatorTours = async () => {
    try {
      setSyncingViator(true);
      
      const { data, error } = await supabase.functions.invoke('viator-tours', {
        body: {
          action: 'search_tours',
          location: 'Cape Town',
          category: 'Tours'
        }
      });

      if (error) throw error;

      if (data?.success && data?.tours) {
        setViatorTours(data.tours);
        toast({
          title: "Tours Synced! ✅",
          description: `Loaded ${data.tours.length} Viator experiences.`,
        });
      }
    } catch (error) {
      console.error('Error syncing Viator tours:', error);
      toast({
        title: "Sync Info",
        description: "Viator tours will be available after the next sync.",
        variant: "destructive"
      });
    } finally {
      setSyncingViator(false);
    }
  };

  const LocalTourCard = ({ tour }: { tour: LocalTour }) => (
    <Card className="relative transition-all duration-300 hover:shadow-xl group">
      {tour.badge && (
        <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg z-10">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {tour.badge}
        </Badge>
      )}
      
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{tour.title}</CardTitle>
        <CardDescription className="text-sm">
          {tour.description}
        </CardDescription>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {tour.duration}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {tour.location}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-green-600" />
            Highlights:
          </div>
          <ul className="space-y-1">
            {tour.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start text-sm">
                <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-green-600">
              R{tour.price.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>

        <Button asChild className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Link to={tour.link}>
            <Mountain className="w-4 h-4 mr-2" />
            Explore Experience
          </Link>
        </Button>

        <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
          <Heart className="w-3 h-3 mr-1 text-red-500" />
          20% supports community development
        </div>
      </CardContent>
    </Card>
  );

  const ViatorTourCard = ({ tour }: { tour: ViatorTour }) => (
    <Card className="transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tour.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        {tour.rating > 0 && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {tour.rating.toFixed(1)}
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{tour.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3">
          {tour.description}
        </CardDescription>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {tour.duration}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {tour.location}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold">
              ${tour.price_from}
            </div>
            {tour.review_count > 0 && (
              <div className="text-xs text-muted-foreground">
                {tour.review_count} reviews
              </div>
            )}
          </div>
          <Badge variant="outline">{tour.category}</Badge>
        </div>

        <Button 
          asChild
          className="w-full"
          variant="outline"
        >
          <a href={tour.booking_url} target="_blank" rel="noopener noreferrer">
            <Globe className="w-4 h-4 mr-2" />
            Book on Viator
            <ExternalLink className="w-3 h-3 ml-2" />
          </a>
        </Button>

        <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
          <Shield className="w-3 h-3 mr-1" />
          Powered by Viator
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero Section - Premium Immersive */}
      <section className="relative h-[85vh] overflow-hidden">
        <img 
          src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg"
          alt="Travel Well Connected Wellness Experiences"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        
        {/* Decorative overlay patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_50%)]" />
        
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-4xl text-white">
            <Badge className="mb-6 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2 text-sm">
              <Globe className="w-4 h-4 mr-2" />
              Local & Global Wellness Experiences
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Travel Well Connected
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90 max-w-2xl leading-relaxed">
              Discover transformative wellness journeys in South Africa and beyond.
            </p>
            <p className="text-lg mb-10 text-white/70 max-w-2xl">
              From sacred indigenous experiences to global wellness adventures—each journey 
              curated to deepen your connection to self, community, and the natural world.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                <Mountain className="w-5 h-5 mr-2" />
                Explore Sacred Local Tours
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg">
                <Globe className="w-5 h-5 mr-2" />
                Browse Global Adventures
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Verified Experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span>20% Community Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Small Group Focus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="local" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-14">
              <TabsTrigger value="local" className="text-base">
                <Mountain className="w-5 h-5 mr-2" />
                Omni Local Tours
              </TabsTrigger>
              <TabsTrigger value="viator" className="text-base">
                <Globe className="w-5 h-5 mr-2" />
                Viator Experiences
              </TabsTrigger>
            </TabsList>

            {/* Local Tours Tab */}
            <TabsContent value="local">
              <div className="mb-12 text-center">
                <Badge className="mb-4 bg-green-600">Featured Experiences</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Omni Wellness Local Experiences</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Handcrafted wellness journeys designed by our team, featuring indigenous wisdom, 
                  sacred land access, and deep community connection. Each experience honors the land 
                  and supports local communities.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {localTours.map((tour) => (
                  <LocalTourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Community Impact Section */}
              <div className="mt-16">
                <Card className="max-w-4xl mx-auto border-2 border-green-600/20 bg-gradient-to-br from-green-50/80 via-white to-blue-50/80 shadow-xl">
                  <CardContent className="py-12 px-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/10 mb-4">
                        <Heart className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">Community Impact Promise</h3>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        20% of all local tour proceeds directly support the Dr. Phil-afel Foundation 
                        and indigenous community development initiatives.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/10 mb-3">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">100+</div>
                        <p className="text-sm text-muted-foreground">Youth Educated</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600/10 mb-3">
                          <Mountain className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-1">5+</div>
                        <p className="text-sm text-muted-foreground">Sacred Sites Protected</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/10 mb-3">
                          <Heart className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">R50k+</div>
                        <p className="text-sm text-muted-foreground">Community Investment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Viator Tours Tab */}
            <TabsContent value="viator">
              <div className="mb-12 text-center">
                <Badge className="mb-4 bg-blue-600">Global Wellness</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Worldwide Wellness Experiences</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                  Curated selection of wellness tours and experiences from around the world, 
                  powered by Viator's global platform. Each experience vetted for quality and wellness alignment.
                </p>
                
                {viatorTours.length === 0 && !loading && (
                  <Button 
                    onClick={syncViatorTours} 
                    disabled={syncingViator}
                    className="mb-6"
                  >
                    {syncingViator ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Syncing Viator Tours...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Load Viator Experiences
                      </>
                    )}
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Loading experiences...</span>
                </div>
              ) : viatorTours.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {viatorTours.map((tour) => (
                    <ViatorTourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <Card className="max-w-2xl mx-auto text-center">
                  <CardContent className="pt-6">
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Global Experiences Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      We're curating a selection of the best wellness experiences from Viator's global catalog.
                    </p>
                    <Button onClick={syncViatorTours} disabled={syncingViator}>
                      {syncingViator ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Sync Viator Tours Now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TravelWellConnectedStore;
