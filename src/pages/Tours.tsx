import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, Clock, Star, Users, ExternalLink, Search, 
  Mountain, Waves, Leaf, Camera, Heart, Filter, Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsciousAffiliate } from '@/hooks/useConsciousAffiliate';
import { toast } from 'sonner';

interface ViatorTour {
  id: string;
  viator_product_code: string;
  title: string;
  description: string;
  location: string;
  price_from: number;
  currency: string;
  duration: any;
  rating: number;
  review_count: number;
  image_url: string;
  booking_url: string;
  category: string;
  is_active: boolean;
}

const categoryIcons: Record<string, any> = {
  'Tours': Mountain,
  'Nature': Leaf,
  'Wildlife': Camera,
  'Ocean': Waves,
  'Adventure': Mountain,
  'Wellness': Heart,
};

const formatDuration = (duration: any): string => {
  if (!duration) return 'Varies';
  if (typeof duration === 'string') {
    try {
      const parsed = JSON.parse(duration);
      if (parsed.fixedDurationInMinutes) {
        const hours = Math.floor(parsed.fixedDurationInMinutes / 60);
        const mins = parsed.fixedDurationInMinutes % 60;
        return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;
      }
      if (parsed.variableDurationFromMinutes && parsed.variableDurationToMinutes) {
        const fromHours = Math.floor(parsed.variableDurationFromMinutes / 60);
        const toHours = Math.floor(parsed.variableDurationToMinutes / 60);
        return `${fromHours}-${toHours} hours`;
      }
    } catch {
      return duration;
    }
  }
  if (typeof duration === 'object') {
    if (duration.fixedDurationInMinutes) {
      const hours = Math.floor(duration.fixedDurationInMinutes / 60);
      return `${hours} hours`;
    }
    if (duration.variableDurationFromMinutes) {
      const fromHours = Math.floor(duration.variableDurationFromMinutes / 60);
      const toHours = Math.floor(duration.variableDurationToMinutes / 60);
      return `${fromHours}-${toHours} hours`;
    }
  }
  return 'Varies';
};

export default function Tours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<ViatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('viator_tours')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations and categories
  const locations = [...new Set(tours.map(t => t.location).filter(Boolean))];
  const categories = [...new Set(tours.map(t => t.category).filter(Boolean))];

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = !searchQuery || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedLocation === 'all' || tour.location === selectedLocation;
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'budget') matchesPrice = tour.price_from < 100;
    else if (priceRange === 'mid') matchesPrice = tour.price_from >= 100 && tour.price_from < 300;
    else if (priceRange === 'premium') matchesPrice = tour.price_from >= 300;

    return matchesSearch && matchesLocation && matchesCategory && matchesPrice;
  });

  const handleTourClick = async (tour: ViatorTour) => {
    // Track affiliate click
    await trackAffiliateClick(
      tour.title,
      'viator_tours_page',
      tour.booking_url,
      'tour_booking',
      tour.category,
      'viator'
    );

    // Open Viator in new tab
    window.open(tour.booking_url, '_blank', 'noopener,noreferrer');
  };

  const TourCard = ({ tour }: { tour: ViatorTour }) => {
    const IconComponent = categoryIcons[tour.category] || Mountain;
    
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => handleTourClick(tour)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={tour.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80'}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary/90 text-primary-foreground">
              <IconComponent className="w-3 h-3 mr-1" />
              {tour.category || 'Tour'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90">
              <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
              {tour.rating?.toFixed(1) || 'New'}
              {tour.review_count > 0 && (
                <span className="ml-1 text-muted-foreground">({tour.review_count})</span>
              )}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {tour.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              {tour.location}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tour.description?.slice(0, 150)}...
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(tour.duration)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">From</div>
              <div className="font-bold text-lg text-primary">
                ${tour.price_from?.toFixed(0) || '—'}
              </div>
            </div>
          </div>
          
          <Button className="w-full group-hover:bg-primary/90" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View & Book on Viator
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 text-sm px-4 py-2" variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Powered by Viator
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tours & Experiences
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover incredible wellness tours, safaris, and cultural experiences across South Africa. 
              Curated by our team for conscious travelers.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search tours, destinations, experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Under $100</SelectItem>
                <SelectItem value="mid">$100 - $300</SelectItem>
                <SelectItem value="premium">$300+</SelectItem>
              </SelectContent>
            </Select>

            {(selectedLocation !== 'all' || selectedCategory !== 'all' || priceRange !== 'all' || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedLocation('all');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSearchQuery('');
                }}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {loading ? 'Loading...' : `${filteredTours.length} tours available`}
            </p>
          </div>

          {/* Tours Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-16">
              <Mountain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Tours Found</h3>
              <p className="text-muted-foreground mb-6">
                {tours.length === 0 
                  ? 'Tours are being synced. Please check back soon!' 
                  : 'Try adjusting your filters or search query.'}
              </p>
              {tours.length === 0 && (
                <Button onClick={() => navigate('/viator-wellness-experiences')}>
                  View Curated Experiences
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Looking for Custom Experiences?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our wellness curators can help you plan personalized tours and retreats 
            tailored to your interests and wellness goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/contact')}>
              Contact Our Team
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/tours-retreats')}>
              View Omni Retreats
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
