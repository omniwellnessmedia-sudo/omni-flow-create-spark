import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List, MapPin, Clock, Users, Star, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PriceDisplay } from '@/components/ui/price-display';
import { supabase } from '@/integrations/supabase/client';

interface Tour {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  max_participants: number;
  price_from: number;
  destination: string;
  hero_image_url: string;
  difficulty_level: string;
  highlights: string[];
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

const TourCategory = () => {
  const { category } = useParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetchCategoryData();
  }, [category]);

  const fetchCategoryData = async () => {
    try {
      // Fetch category info
      const { data: categoryData } = await supabase
        .from('tour_categories')
        .select('*')
        .eq('slug', category)
        .eq('active', true)
        .single();

      if (categoryData) {
        setCategoryInfo(categoryData);

        // Fetch tours for this category
        const { data: toursData } = await supabase
          .from('tours')
          .select(`
            *,
            category:tour_categories(name, slug)
          `)
          .eq('category_id', categoryData.id)
          .eq('active', true);

        setTours(toursData || []);
      } else {
        // If no category found, create placeholder data
        const categoryMap: Record<string, Category> = {
          'indigenous-wisdom': {
            id: '1',
            name: 'Indigenous Wisdom & Healing',
            slug: 'indigenous-wisdom',
            description: 'Connect with ancient healing traditions and indigenous knowledge systems',
            image_url: '/lovable-uploads/conscious-connections-hero.jpg'
          },
          'wellness-retreats': {
            id: '2',
            name: 'Wellness Retreats',
            slug: 'wellness-retreats',
            description: 'Transformative wellness journeys combining modern and traditional healing',
            image_url: '/lovable-uploads/fact-wellness-hero.jpg'
          },
          'conscious-living': {
            id: '3',
            name: 'Conscious Living',
            slug: 'conscious-living',
            description: 'Immersive experiences in sustainable and mindful living practices',
            image_url: '/lovable-uploads/wellness-humans.png'
          },
          'study-abroad': {
            id: '4',
            name: 'Study Abroad',
            slug: 'study-abroad',
            description: 'Educational service-learning programs in Cape Town',
            image_url: '/lovable-uploads/service-learning-hero.jpg'
          },
          'winter-wellness': {
            id: '5',
            name: 'Winter Wellness',
            slug: 'winter-wellness',
            description: 'Embrace Cape Town\'s beautiful winter season with warming wellness experiences',
            image_url: '/lovable-uploads/winter-wellness-category.jpg'
          },
          'weekend-retreats': {
            id: '6',
            name: 'Weekend Retreats',
            slug: 'weekend-retreats',
            description: 'Perfect short getaways for busy schedules',
            image_url: '/lovable-uploads/weekend-retreats-category.jpg'
          }
        };

        const placeholderCategory = categoryMap[category || ''] || categoryMap['indigenous-wisdom'];
        setCategoryInfo(placeholderCategory);

        // Create placeholder tours
        const placeholderTours: Tour[] = [
          {
            id: '1',
            title: 'Conscious Connections: Indigenous Wisdom + Healing',
            slug: 'conscious-connections-indigenous-wisdom-healing',
            subtitle: 'Ancient traditions for personal and collective transformation',
            duration: '10 days / 9 nights',
            max_participants: 16,
            price_from: 3850,
            destination: 'Cape Town & Western Cape, South Africa',
            hero_image_url: '/lovable-uploads/conscious-connections-hero.jpg',
            difficulty_level: 'moderate',
            highlights: [
              'Learn from authentic Khoisan knowledge keepers',
              'Traditional fynbos medicine harvesting',
              'Ancient rock art sites in Cederberg',
              'Ocean therapy and coastal healing',
              'Small group experience (max 16)',
              'Take home custom herbal remedies'
            ],
            category: {
              name: placeholderCategory.name,
              slug: placeholderCategory.slug
            }
          },
          {
            id: '2',
            title: 'Winter Wine Country Wellness Weekend',
            slug: 'winter-wine-country-wellness',
            subtitle: 'Luxury weekend retreat in Stellenbosch with spa, yoga, and wine',
            duration: '2 days / 1 night',
            max_participants: 8,
            price_from: 1850,
            destination: 'Stellenbosch Wine Country, Western Cape',
            hero_image_url: '/lovable-uploads/wine-country-yoga-hero.jpg',
            difficulty_level: 'beginner',
            highlights: [
              'Luxury wine estate accommodation',
              'Daily yoga with Chad in vineyard settings',
              'Private wine tastings with sommelier',
              'Spa treatments with local botanicals',
              'Farm-to-table gourmet meals',
              'Professional photography included'
            ],
            category: {
              name: placeholderCategory.name,
              slug: placeholderCategory.slug
            }
          }
        ];

        setTours(placeholderTours);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTours = tours
    .filter(tour => 
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tour => {
      if (priceFilter === 'all') return true;
      if (priceFilter === 'under-2000') return tour.price_from < 2000;
      if (priceFilter === '2000-5000') return tour.price_from >= 2000 && tour.price_from <= 5000;
      if (priceFilter === 'over-5000') return tour.price_from > 5000;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price_from - b.price_from;
        case 'price-high': return b.price_from - a.price_from;
        case 'duration': return a.duration.localeCompare(b.duration);
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/tours-retreats">
            <Button>Browse All Tours</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Category Hero */}
      <section className="relative h-64 sm:h-80 lg:h-96 bg-cover bg-center" style={{
        backgroundImage: `url(${categoryInfo.image_url})`,
        backgroundColor: '#f0f9ff'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <Link to="/tours-retreats" className="inline-flex items-center text-white/80 hover:text-white mb-3 sm:mb-4 text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Tours
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">{categoryInfo.name}</h1>
            <p className="text-base sm:text-lg lg:text-xl opacity-90">{categoryInfo.description}</p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-4 sm:py-6 lg:py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Input
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-sm"
              />
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-2000">Under $2,000</SelectItem>
                  <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                  <SelectItem value="over-5000">Over $5,000</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid/List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {filteredAndSortedTours.length} {filteredAndSortedTours.length === 1 ? 'Tour' : 'Tours'} Available
            </h2>
            <p className="text-muted-foreground">
              Discover transformative experiences in {categoryInfo.name.toLowerCase()}
            </p>
          </div>

          {filteredAndSortedTours.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                : "space-y-4 sm:space-y-6"
            }>
              {filteredAndSortedTours.map(tour => (
                <TourCard key={tour.id} tour={tour} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No tours found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms to find the perfect journey for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => {
                    setSearchTerm('');
                    setPriceFilter('all');
                    setSortBy('featured');
                  }}>
                    Clear Filters
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/tours-retreats">Browse All Tours</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const TourCard = ({ tour, viewMode }: { tour: Tour; viewMode: 'grid' | 'list' }) => {
  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-80 h-64 sm:h-48 lg:h-auto relative overflow-hidden">
            <img 
              src={tour.hero_image_url || '/lovable-uploads/wellness-humans.png'} 
              alt={tour.title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/lovable-uploads/wellness-humans.png';
              }}
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs">{tour.difficulty_level}</Badge>
            </div>
            <div className="absolute top-3 right-3 flex gap-1">
              <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm h-8 w-8 p-0">
                <Heart className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm h-8 w-8 p-0">
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <CardContent className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{tour.title}</h3>
              <div className="text-left sm:text-right">
                <PriceDisplay 
                  price={tour.price_from} 
                  primaryCurrency="USD"
                  size="lg"
                />
                <div className="text-sm text-muted-foreground">per person</div>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">{tour.subtitle}</p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {tour.duration}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Max {tour.max_participants}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="truncate">{tour.destination}</span>
              </div>
            </div>

            {tour.highlights && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tour.highlights.slice(0, 2).map((highlight, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                  {tour.highlights.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{tour.highlights.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Link to={`/tour-category/${tour.category.slug}/${tour.slug}`}>
              <Button className="w-full sm:w-auto">View Details</Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-lg h-64 sm:h-56 lg:h-64">
        <img 
          src={tour.hero_image_url || '/lovable-uploads/wellness-humans.png'} 
          alt={tour.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/lovable-uploads/wellness-humans.png';
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">{tour.difficulty_level}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold">
            From ${Math.round(tour.price_from / 18.5)}
            <span className="text-xs opacity-75 hidden sm:inline"> (R{tour.price_from})</span>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm h-8 w-8 p-0">
            <Heart className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm h-8 w-8 p-0">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{tour.title}</h3>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base line-clamp-2">{tour.subtitle}</p>
        
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {tour.duration}
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Max {tour.max_participants}
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">{tour.destination}</span>
          </div>
        </div>

        <Link to={`/tour-category/${tour.category.slug}/${tour.slug}`}>
          <Button className="w-full text-sm sm:text-base">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default TourCategory;