import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePreloader } from "@/components/ui/image-preloader";
import { PriceDisplay } from "@/components/ui/price-display";
import Footer from "@/components/Footer";
import { 
  Search, Filter, MapPin, Clock, Coins, Star, Globe, Calendar, 
  ShoppingBag, Sparkles, Mountain, Gift, Users, ArrowRight,
  Heart, Share2, Eye, Download, Play, Bookmark
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { IMAGES } from '@/lib/images';
import type { WellnessExperience, WellnessMarketplaceItem } from "@/types/marketplace";

// Sample tour and retreat data following the unified marketplace structure
const sampleToursRetreats: WellnessExperience[] = [
  {
    id: 'conscious-connections-indigenous-healing',
    content_type: 'experience',
    title: 'Conscious Connections: Indigenous Wisdom + Healing',
    description: 'Transform through authentic indigenous healing practices and ancient wisdom traditions in the heart of South Africa.',
    longDescription: 'Immerse yourself in a profound journey of self-discovery and healing through authentic indigenous practices. This transformative experience combines traditional healing ceremonies, storytelling, and community connection.',
    provider_id: 'conscious-connections',
    provider_name: 'Conscious Connections SA',
    category: 'Indigenous Wisdom',
    subcategory: 'Healing Ceremonies',
    images: [IMAGES.wellness.retreat, IMAGES.wellness.landmark],
    location: 'Eastern Cape, South Africa',
    is_online: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.9,
    review_count: 127,
    tags: ['indigenous', 'healing', 'ceremonies', 'traditional', 'south-africa'],
    price_zar: 3999,
    price_wellcoins: 3200,
    experience_type: 'retreat',
    start_date: '2025-02-15',
    end_date: '2025-02-22',
    duration_days: 8,
    max_participants: 12,
    current_participants: 8,
    includes: ['Accommodation', 'All meals', 'Ceremony participation', 'Cultural activities', 'Traditional healers', 'Transportation'],
    accommodation_included: true,
    meals_included: true,
    transport_included: true,
    difficulty_level: 'all_levels'
  },
  {
    id: 'table-mountain-wellness-retreat',
    content_type: 'experience',
    title: 'Table Mountain Wellness Retreat',
    description: '3-day transformative wellness experience combining yoga, meditation, and nature connection with breathtaking mountain views.',
    longDescription: 'Escape to the majestic Table Mountain for a rejuvenating wellness retreat that harmonizes body, mind, and spirit through yoga, meditation, and immersive nature experiences.',
    provider_id: 'mountain-wellness-co',
    provider_name: 'Mountain Wellness Co',
    category: 'Wellness Retreats',
    subcategory: 'Mountain Retreats',
    images: [IMAGES.tours.mountain, IMAGES.tours.mountain2],
    location: 'Table Mountain, Cape Town',
    is_online: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.8,
    review_count: 89,
    tags: ['mountains', 'yoga', 'meditation', 'nature', 'cape-town'],
    price_zar: 2499,
    price_wellcoins: 2000,
    experience_type: 'retreat',
    start_date: '2025-01-15',
    end_date: '2025-01-17',
    duration_days: 3,
    max_participants: 16,
    current_participants: 12,
    includes: ['Accommodation', 'All meals', 'Yoga classes', 'Guided hikes', 'Meditation sessions'],
    accommodation_included: true,
    meals_included: true,
    transport_included: false,
    difficulty_level: 'beginner'
  },
  {
    id: 'ubuntu-immersion-journey',
    content_type: 'experience',
    title: 'Ubuntu Immersion Journey',
    description: '10-day deep dive into Ubuntu philosophy and community healing practices in traditional South African villages.',
    longDescription: 'Experience the profound philosophy of Ubuntu through authentic community immersion, traditional storytelling, and collective healing practices in rural South Africa.',
    provider_id: 'ubuntu-collective',
    provider_name: 'Ubuntu Healing Collective',
    category: 'Indigenous Wisdom',
    subcategory: 'Community Healing',
    images: [IMAGES.wellness.community, IMAGES.wellness.graduation],
    location: 'Eastern Cape Villages, South Africa',
    is_online: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.9,
    review_count: 64,
    tags: ['ubuntu', 'community', 'philosophy', 'villages', 'healing'],
    price_zar: 4599,
    price_wellcoins: 3700,
    experience_type: 'retreat',
    start_date: '2025-03-10',
    end_date: '2025-03-19',
    duration_days: 10,
    max_participants: 10,
    current_participants: 6,
    includes: ['Village accommodation', 'Traditional meals', 'Elder teachings', 'Community activities', 'Cultural exchanges'],
    accommodation_included: true,
    meals_included: true,
    transport_included: true,
    difficulty_level: 'intermediate'
  },
  {
    id: 'fact-wellness-hybrid-experience',
    content_type: 'experience',
    title: 'FACT Wellness Hybrid Experience',
    description: 'Flexible 3-7 day wellness program combining fitness, mindfulness, and therapeutic practices in beautiful Muizenberg.',
    longDescription: 'A comprehensive wellness experience that adapts to your schedule and needs, combining physical fitness, mental wellness, and therapeutic interventions in the stunning coastal setting of Muizenberg.',
    provider_id: 'fact-wellness',
    provider_name: 'FACT Wellness Center',
    category: 'Wellness Programs',
    subcategory: 'Hybrid Programs',
    images: [IMAGES.wellness.beachLions, IMAGES.tours.mountain2],
    location: 'Muizenberg, Cape Town',
    is_online: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.7,
    review_count: 156,
    tags: ['fitness', 'therapy', 'flexibility', 'coastal', 'hybrid'],
    price_zar: 1299,
    price_wellcoins: 1050,
    experience_type: 'workshop',
    start_date: '2025-01-20',
    end_date: '2025-01-26',
    duration_days: 7,
    max_participants: 20,
    current_participants: 14,
    includes: ['Fitness sessions', 'Therapy consultations', 'Mindfulness training', 'Beach activities', 'Nutritional guidance'],
    accommodation_included: false,
    meals_included: false,
    transport_included: false,
    difficulty_level: 'all_levels'
  },
  {
    id: 'sustainable-living-immersion',
    content_type: 'experience',
    title: 'Sustainable Living Immersion',
    description: '5-day intensive program learning practical sustainable living skills and eco-conscious lifestyle practices.',
    longDescription: 'Discover how to live sustainably through hands-on workshops, permaculture practices, and eco-friendly lifestyle techniques in a supportive community environment.',
    provider_id: 'eco-living-sa',
    provider_name: 'EcoLiving South Africa',
    category: 'Conscious Living',
    subcategory: 'Sustainability',
    images: [IMAGES.wellness.communityProject2, IMAGES.wellness.retreat2],
    location: 'Stellenbosch, Western Cape',
    is_online: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.6,
    review_count: 78,
    tags: ['sustainability', 'eco-living', 'permaculture', 'environment', 'community'],
    price_zar: 1899,
    price_wellcoins: 1520,
    experience_type: 'workshop',
    start_date: '2025-02-01',
    end_date: '2025-02-05',
    duration_days: 5,
    max_participants: 15,
    current_participants: 9,
    includes: ['Workshop materials', 'Organic meals', 'Accommodation', 'Garden tours', 'Take-home resources'],
    accommodation_included: true,
    meals_included: true,
    transport_included: false,
    difficulty_level: 'beginner'
  },
  {
    id: 'service-learning-adventure',
    content_type: 'experience',
    title: 'Cape Town Service Learning Adventure',
    description: '14-day educational service-learning program combining cultural immersion, community service, and personal development.',
    longDescription: 'Engage in meaningful community service while learning about South African culture, history, and social challenges through hands-on educational experiences.',
    provider_id: 'service-learning-sa',
    provider_name: 'Service Learning South Africa',
    category: 'Study Abroad',
    subcategory: 'Educational Programs',
    images: [IMAGES.wellness.graduation2, IMAGES.wellness.communityProject3],
    location: 'Cape Town & Townships',
    is_online: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: 4.8,
    review_count: 203,
    tags: ['education', 'service-learning', 'community', 'cultural-immersion', 'students'],
    price_zar: 3299,
    price_wellcoins: 2640,
    experience_type: 'course',
    start_date: '2025-03-01',
    end_date: '2025-03-14',
    duration_days: 14,
    max_participants: 25,
    current_participants: 18,
    includes: ['Homestay accommodation', 'All meals', 'Educational materials', 'Community project participation', 'Cultural activities', 'Transportation'],
    accommodation_included: true,
    meals_included: true,
    transport_included: true,
    difficulty_level: 'all_levels'
  }
];

const ToursRetreats = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [items, setItems] = useState<WellnessExperience[]>([]);
  const [filteredItems, setFilteredItems] = useState<WellnessExperience[]>([]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // Try to fetch from Supabase first, fallback to sample data
        const { data: dbTours } = await supabase
          .from('tours')
          .select(`
            *,
            category:tour_categories(*)
          `)
          .eq('active', true);

        if (dbTours && dbTours.length > 0) {
          // Convert database tours to unified format
          const convertedTours: WellnessExperience[] = dbTours.map(tour => ({
            id: tour.id,
            content_type: 'experience' as const,
            title: tour.title,
            description: tour.subtitle || tour.description || '',
            longDescription: tour.description,
            provider_id: 'omni-wellness',
            provider_name: 'Omni Wellness',
            category: tour.category?.name || 'Tours & Retreats',
            subcategory: tour.category?.slug,
            images: [tour.hero_image_url].filter(Boolean),
            location: tour.destination || 'South Africa',
            is_online: false,
            is_active: tour.active,
            created_at: tour.created_at,
            updated_at: tour.updated_at,
            rating: 4.5,
            review_count: Math.floor(Math.random() * 100) + 20,
            tags: tour.category ? [tour.category.slug] : [],
            price_zar: tour.price_from || 999,
            price_wellcoins: Math.floor((tour.price_from || 999) * 0.8),
            experience_type: 'retreat' as const,
            start_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000 + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duration_days: Math.floor(Math.random() * 10) + 3,
            max_participants: tour.max_participants || 12,
            current_participants: Math.floor(Math.random() * (tour.max_participants || 12)),
            includes: ['Accommodation', 'Meals', 'Activities', 'Transportation'],
            accommodation_included: true,
            meals_included: true,
            transport_included: false,
            difficulty_level: tour.difficulty_level as any || 'all_levels'
          }));
          setItems(convertedTours);
        } else {
          // Use sample data
          setItems(sampleToursRetreats);
        }
        
        toast.success(`Loaded wellness experiences`);
      } catch (error) {
        console.error('Error loading tours data:', error);
        setItems(sampleToursRetreats);
        toast.info('Loaded sample wellness experiences');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = items;

    // Filter by experience type
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.experience_type === activeTab);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (activeTab !== 'all') params.set('type', activeTab);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [items, activeTab, selectedCategory, searchTerm, setSearchParams]);

  const handleItemClick = (item: WellnessExperience) => {
    navigate(`/experience/${item.id}`);
  };

  const getExperienceTypeIcon = (type: string) => {
    switch (type) {
      case 'retreat': return <Mountain className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'course': return <Calendar className="h-4 w-4" />;
      case 'ceremony': return <Sparkles className="h-4 w-4" />;
      case 'tour': return <Globe className="h-4 w-4" />;
      default: return <Mountain className="h-4 w-4" />;
    }
  };

  const getExperienceTypeColor = (type: string) => {
    switch (type) {
      case 'retreat': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'course': return 'bg-green-100 text-green-800';
      case 'ceremony': return 'bg-orange-100 text-orange-800';
      case 'tour': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [...new Set(items.map(item => item.category))];
  const experienceTypes = [...new Set(items.map(item => item.experience_type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-48 bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Preload critical images */}
      <ImagePreloader images={[
        '/lovable-uploads/omni-wellness-hero.jpg',
        IMAGES.wellness.retreat,
        IMAGES.wellness.beachLions,
        '/lovable-uploads/service-learning-hero.jpg',
        ...filteredItems.flatMap(item => item.images).filter(Boolean)
      ]} />

      {/* Ambient Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full px-4 py-2 mb-6">
              <Mountain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Transformative Wellness Journeys</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Tours & Retreats
              </span>
              <br />
              <span className="text-gray-800">That Transform Lives</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover transformative wellness experiences, healing retreats, and conscious travel adventures 
              that connect you with ancient wisdom and modern healing practices across South Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
                <Play className="mr-2 h-5 w-5" />
                Explore Experiences
              </Button>
              <Button variant="outline" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Brochure
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search wellness experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-purple-200/50"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="md:w-48 bg-white/80 backdrop-blur-sm border-purple-200/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="all">All ({items.length})</TabsTrigger>
                <TabsTrigger value="retreat">Retreats ({items.filter(i => i.experience_type === 'retreat').length})</TabsTrigger>
                <TabsTrigger value="workshop">Workshops ({items.filter(i => i.experience_type === 'workshop').length})</TabsTrigger>
                <TabsTrigger value="course">Courses ({items.filter(i => i.experience_type === 'course').length})</TabsTrigger>
                <TabsTrigger value="ceremony">Ceremonies ({items.filter(i => i.experience_type === 'ceremony').length})</TabsTrigger>
                <TabsTrigger value="tour">Tours ({items.filter(i => i.experience_type === 'tour').length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <img 
                    src={item.images[0] || "/lovable-uploads/omni-wellness-hero.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/lovable-uploads/omni-wellness-hero.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Experience Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getExperienceTypeColor(item.experience_type)} border-0 flex items-center gap-1`}>
                      {getExperienceTypeIcon(item.experience_type)}
                      {item.experience_type}
                    </Badge>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.duration_days}d
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs font-medium">{item.rating}</span>
                  </div>

                  {/* Availability Indicator */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className={`${item.current_participants < item.max_participants ? 'bg-green-500/90' : 'bg-orange-500/90'} text-white`}>
                      {item.max_participants - item.current_participants} spots left
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-purple-600 font-medium">
                    {item.provider_name}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Max {item.max_participants}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="font-medium">Includes:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.includes.slice(0, 3).map((include, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                          {include}
                        </Badge>
                      ))}
                      {item.includes.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          +{item.includes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-gray-900">
                        <PriceDisplay 
                          price={item.price_zar} 
                          primaryCurrency="ZAR"
                          showBothCurrencies={false}
                          className="text-lg font-bold"
                        />
                      </span>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                    {item.price_wellcoins > 0 && (
                      <div className="flex items-center justify-between text-orange-600">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          <span className="font-semibold">{item.price_wellcoins} WellCoins</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => handleItemClick(item)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No experiences found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters to find the perfect wellness journey.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setActiveTab('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Call to Action */}
          {filteredItems.length > 0 && (
            <div className="mt-16 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-200/50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Begin Your Transformation?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Connect with our wellness travel specialists to design your perfect transformative experience 
                and start your journey toward healing and self-discovery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Consultation
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Save Favorites
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToursRetreats;