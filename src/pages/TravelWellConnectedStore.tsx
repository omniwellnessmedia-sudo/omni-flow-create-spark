import { useState, useEffect, useCallback } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
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
  ExternalLink,
  MessageCircle,
  Leaf,
  Compass,
  TreePine
} from "lucide-react";
import { Link } from "react-router-dom";

// Storage base URL
const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

// Fallback images for Viator tours
const VIATOR_FALLBACKS = [
  `${STORAGE_BASE}/General%20Images/Wellness%20retreat%202.jpg`,
  `${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`,
  `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`,
];

// Helper to parse duration JSON
const formatDuration = (duration: string | null | undefined): string => {
  if (!duration) return "Varies";
  
  try {
    // Handle JSON duration format from Viator
    if (duration.startsWith("{")) {
      const parsed = JSON.parse(duration);
      if (parsed.fixedDurationInMinutes) {
        const hours = Math.floor(parsed.fixedDurationInMinutes / 60);
        const mins = parsed.fixedDurationInMinutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${mins} min`;
      }
      if (parsed.variableDurationFromMinutes && parsed.variableDurationToMinutes) {
        const fromHours = Math.floor(parsed.variableDurationFromMinutes / 60);
        const toHours = Math.floor(parsed.variableDurationToMinutes / 60);
        return `${fromHours}-${toHours} hours`;
      }
    }
    return duration;
  } catch {
    return duration;
  }
};

// Get valid image URL with fallback
const getImageUrl = (imageUrl: string | null | undefined, index: number = 0): string => {
  if (!imageUrl || imageUrl === "SUPPLIER_PROVIDED" || imageUrl === "") {
    return VIATOR_FALLBACKS[index % VIATOR_FALLBACKS.length];
  }
  return imageUrl;
};

// Wellness intent mapping based on category/title keywords
const getWellnessIntent = (title: string, category: string): { label: string; icon: typeof Leaf } => {
  const titleLower = title.toLowerCase();
  const categoryLower = category?.toLowerCase() || "";
  
  if (titleLower.includes("spa") || titleLower.includes("wellness") || titleLower.includes("yoga")) {
    return { label: "Restoration", icon: Sparkles };
  }
  if (titleLower.includes("safari") || titleLower.includes("wildlife") || titleLower.includes("nature")) {
    return { label: "Nature Connection", icon: TreePine };
  }
  if (titleLower.includes("wine") || titleLower.includes("food") || titleLower.includes("culinary")) {
    return { label: "Mindful Indulgence", icon: Heart };
  }
  if (titleLower.includes("hike") || titleLower.includes("mountain") || titleLower.includes("adventure")) {
    return { label: "Flow State", icon: Mountain };
  }
  if (titleLower.includes("cultural") || titleLower.includes("history") || titleLower.includes("heritage")) {
    return { label: "Cultural Awareness", icon: Compass };
  }
  return { label: "Exploration", icon: Globe };
};

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

// Curator profiles for travel experiences - matching CameraStuff design
const curatorProfiles = {
  zenith: {
    name: "Zenith",
    title: "Travel Coordinator & Wellness Guide",
    expertise: "Wellness Retreats • Mindful Travel • Group Coordination",
    bio: "Travel should nourish your soul, not just tick boxes. I curate experiences that create lasting transformation.",
    avatar: `${STORAGE_BASE}/General%20Images/Zenith_TNT_OMNI-9.jpg`
  },
  chad: {
    name: "Chad",
    title: "Head of Media & Strategy",
    expertise: "Adventure Travel • Documentary Journeys • Cultural Immersion",
    bio: "The best adventures are those that change your perspective and connect you to something greater.",
    avatar: `${STORAGE_BASE}/General%20Images/Chad%20Amazing%20portrait.jpg`
  },
  feroza: {
    name: "Feroza",
    title: "Communications & Media Curator",
    expertise: "Wellness Travel • Cultural Experiences • Travel Planning",
    bio: "I believe every journey should nurture the soul. I help travelers discover experiences that create lasting transformation.",
    avatar: `${STORAGE_BASE}/General%20Images/feroza%20begg%20-%20portrait.jpg`
  }
};

const TravelWellConnectedStore = () => {
  const [viatorTours, setViatorTours] = useState<ViatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingViator, setSyncingViator] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'viator'>('local');
  const { toast } = useToast();
  const { trackAffiliateClick, trackProductView } = useConsciousAffiliate();

  const localTours: LocalTour[] = [
    {
      id: 'annual-omni-retreat',
      title: 'Annual Omni Wellness Retreat',
      description: 'Transformative 4-day wellness journey in Cape Wine Country with yoga, meditation, and conscious community.',
      price: 3999,
      duration: '4 days',
      location: 'Cape Wine Country, South Africa',
      image: `${STORAGE_BASE}/General%20Images/Wellness%20retreat%202.jpg`,
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
      image: `${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`,
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
      image: `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`,
      link: '/tours/muizenberg-cave-tours',
      highlights: [
        'Trauma-informed somatic practices',
        'Indigenous knowledge integration',
        'Clinical competencies development',
        'Community impact partnership'
      ],
      badge: 'Academic Program'
    },
    {
      id: 'fish-hoek-walk',
      title: 'Fish Hoek Coastal Walk',
      description: 'A scenic coastal wellness walk through Fish Hoek, exploring natural beauty and local heritage.',
      price: 500,
      duration: 'Half day',
      location: 'Fish Hoek, Cape Town',
      image: `${STORAGE_BASE}/General%20Images/community%20outing%201.jpg`,
      link: '/tours/fish-hoek-walk',
      highlights: [
        'Scenic coastal trail',
        'Local heritage sites',
        'Nature immersion',
        'Guided wellness experience'
      ],
      badge: 'New Experience'
    }
  ];

  useEffect(() => {
    loadViatorTours();
  }, []);

  const loadViatorTours = async () => {
    try {
      setLoading(true);
      
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
          title: "Tours Synced!",
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

  const handleViatorClick = async (tour: ViatorTour) => {
    await trackAffiliateClick(
      tour.title,
      "viator-travel-store",
      tour.booking_url,
      "wellness travel",
      "tours",
      "viator"
    );
  };

  const LocalTourCard = ({ tour }: { tour: LocalTour }) => (
    <Card className="relative transition-all duration-300 hover:shadow-xl group overflow-hidden">
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

  const ViatorTourCard = ({ tour, index }: { tour: ViatorTour; index: number }) => {
    const wellnessIntent = getWellnessIntent(tour.title, tour.category);
    const WellnessIcon = wellnessIntent.icon;
    
    return (
      <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={getImageUrl(tour.image_url, index)} 
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = VIATOR_FALLBACKS[index % VIATOR_FALLBACKS.length];
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Wellness Intent Badge */}
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground backdrop-blur-sm">
            <WellnessIcon className="w-3 h-3 mr-1" />
            {wellnessIntent.label}
          </Badge>
          
          {tour.rating > 0 && (
            <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {tour.rating.toFixed(1)}
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-2">{tour.title}</CardTitle>
          <CardDescription className="text-sm line-clamp-3">
            {tour.description || "Discover this curated wellness experience handpicked by our team for its transformative potential."}
          </CardDescription>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(tour.duration)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {tour.location || "South Africa"}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xl font-bold text-primary">
                From ${tour.price_from?.toFixed(2) || "0.00"}
              </div>
              {tour.review_count > 0 && (
                <div className="text-xs text-muted-foreground">
                  {tour.review_count} reviews
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {tour.category || "Experience"}
            </Badge>
          </div>

          <Button 
            asChild
            className="w-full"
            onClick={() => handleViatorClick(tour)}
          >
            <a 
              href={`https://www.viator.com/partner-shop/omniwellnessmedia/?search=${encodeURIComponent(tour.title || '')}&medium=link&medium_version=shop&campaign=omni-wellness`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Globe className="w-4 h-4 mr-2" />
              Book on Viator
              <ExternalLink className="w-3 h-3 ml-2" />
            </a>
          </Button>

          <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3 mr-1" />
            Powered by Viator Partner Network
          </div>
        </CardContent>
      </Card>
    );
  };

  // Travel Curator Card - matching CameraStuff design
  const TravelCuratorCard = ({ curator, curatorId }: { curator: typeof curatorProfiles.zenith; curatorId: string }) => (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center">
          <img 
            src={curator.avatar} 
            alt={curator.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const span = document.createElement('span');
              span.className = 'text-2xl font-bold text-primary';
              span.textContent = curator.name.charAt(0); // textContent prevents XSS
              target.parentElement?.appendChild(span);
            }}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{curator.name}</h3>
          <p className="text-sm font-medium text-primary">{curator.title}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{curator.expertise}</p>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed">"{curator.bio}"</p>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => {
            trackProductView(
              `Travel Curator Picks: ${curator.name}`,
              'travel_well_connected_curator',
              'view_curator_picks'
            );
            const section = document.getElementById('local-tours');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          See {curator.name}'s Picks
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <img 
          src={`${STORAGE_BASE}/General%20Images/Wellness%20retreat%202.jpg`}
          alt="Travel Well Connected Wellness Experiences"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_50%)]" />
        
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-4xl text-white">
            <Badge className="mb-6 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-2 text-sm">
              <Globe className="w-4 h-4 mr-2" />
              Curated Wellness Experiences
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
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                onClick={() => document.getElementById('local-tours')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Mountain className="w-5 h-5 mr-2" />
                Explore Sacred Local Tours
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
                onClick={() => {
                  setActiveTab('viator');
                  setTimeout(() => {
                    document.getElementById('viator-tours')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
              >
                <Globe className="w-5 h-5 mr-2" />
                Browse Global Adventures
              </Button>
            </div>
            
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Curators Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
              Meet Your Guides
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Omni Wellness Travel Curators
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each experience is handpicked by our team based on wellness values, cultural authenticity, 
              and transformative potential. We're here to guide your journey, not just book your trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Object.entries(curatorProfiles).map(([id, curator]) => (
              <TravelCuratorCard key={id} curator={curator} curatorId={id} />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Why Viator Partnership Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-background rounded-2xl p-8 lg:p-12 border-2 border-primary/10 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Why We Partner with Viator</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed text-muted-foreground">
              <div>
                <p className="mb-4">
                  We've partnered with <strong className="text-foreground">Viator</strong> to expand your wellness journey options beyond South Africa. As part of the TripAdvisor family, Viator offers verified reviews and secure bookings for experiences worldwide.
                </p>
                <p>
                  Every experience we feature is filtered through our wellness lens—we look for tours that offer genuine cultural connection, environmental respect, and transformative potential.
                </p>
              </div>
              <div>
                <p className="mb-4">
                  <strong className="text-foreground">Omni Wellness Media doesn't operate these tours.</strong> We curate and recommend experiences that align with our conscious travel philosophy. When you book through our links, you support our community development work.
                </p>
                <p>
                  <strong className="text-foreground">Need personalized recommendations?</strong> Our team is here to help you find the perfect experience for your wellness journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Main Content Tabs */}
      <section id="local-tours" className="py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'local' | 'viator')} className="w-full">
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
                  sacred land access, and deep community connection.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {localTours.map((tour) => (
                  <LocalTourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Community Impact Section */}
              <div className="mt-16">
                <Card className="max-w-4xl mx-auto border-2 border-green-600/20 bg-gradient-to-br from-green-50/80 via-background to-blue-50/80 shadow-xl">
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
                        <div className="text-2xl font-bold text-green-600 mb-1">15+</div>
                        <p className="text-sm text-muted-foreground">Sacred Sites Protected</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/10 mb-3">
                          <Heart className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">R50K+</div>
                        <p className="text-sm text-muted-foreground">Community Investment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Viator Tours Tab */}
            <TabsContent value="viator" id="viator-tours">
              <div className="mb-12 text-center">
                <Badge className="mb-4">Global Wellness</Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Viator Wellness Experiences</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Curated global experiences filtered through our wellness lens. Each tour is selected for its 
                  transformative potential, cultural authenticity, and alignment with conscious travel values.
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                  <span className="text-muted-foreground">Loading wellness experiences...</span>
                </div>
              ) : viatorTours.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {viatorTours.map((tour, index) => (
                    <ViatorTourCard key={tour.id} tour={tour} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Experiences Loading</h3>
                  <p className="text-muted-foreground mb-6">
                    Our Viator experiences are syncing. Check back soon or browse our local tours.
                  </p>
                  <Button 
                    onClick={syncViatorTours} 
                    disabled={syncingViator}
                    variant="outline"
                  >
                    {syncingViator ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Sync Experiences
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Viator Partnership Note */}
              {viatorTours.length > 0 && (
                <div className="mt-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-1" />
                    All Viator experiences include their booking protection and verified reviews.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Separator />

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">From Our Travelers</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-muted-foreground italic mb-4">
                  "The Great Mother Cave tour changed my perspective on travel. It wasn't just sightseeing—it was a genuine connection to the land and its people."
                </p>
                <p className="font-semibold">— Wellness Retreat Participant</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-muted-foreground italic mb-4">
                  "Omni's travel recommendations go beyond typical tourism. They understand that meaningful travel transforms both the visitor and the community."
                </p>
                <p className="font-semibold">— International Visitor</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Consultation CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Need Help Planning Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every wellness journey is unique. Let's talk about what you're seeking and help you 
              find the perfect experience for your transformation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Talk to Omni
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a 
                  href="https://www.viator.com/partner-shop/omniwellnessmedia/?medium=link&medium_version=shop&campaign=omni-wellness"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Browse Full Viator Catalog
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TravelWellConnectedStore;
