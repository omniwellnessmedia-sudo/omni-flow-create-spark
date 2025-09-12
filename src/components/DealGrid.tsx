import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { wellnessDealsAPI, type WellnessDeal } from '@/lib/southAfricanDealsAPI';
import { Search, Filter, MapPin, Star, Clock, Shield, Percent } from 'lucide-react';

interface DealGridProps {
  limit?: number;
  showFilters?: boolean;
}

export default function DealGrid({ limit, showFilters = true }: DealGridProps) {
  const [deals, setDeals] = useState<WellnessDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeals();
  }, [selectedCategory, selectedLocation, limit]);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wellnessDealsAPI.fetchDeals({
        category: selectedCategory === 'all' ? undefined : selectedCategory as any,
        location: selectedLocation === 'all' ? undefined : selectedLocation as any,
        limit: limit || 12
      });
      setDeals(response.deals);
    } catch (err) {
      setError('Failed to load wellness deals');
      console.error('Error loading deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDeals();
      return;
    }

    setLoading(true);
    try {
      const response = await wellnessDealsAPI.searchDeals(searchTerm, {
        category: selectedCategory === 'all' ? undefined : selectedCategory as any,
        location: selectedLocation === 'all' ? undefined : selectedLocation as any,
        limit: limit || 12
      });
      setDeals(response.deals);
    } catch (err) {
      setError('Failed to search deals');
      console.error('Error searching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => `R${price.toLocaleString()}`;
  const formatLocation = (location: string) => 
    location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const formatCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'spa': 'Spa & Beauty',
      'fitness': 'Fitness & Movement',
      'nutrition': 'Nutrition & Wellness',
      'meditation': 'Meditation & Mindfulness',
      'retreats': 'Retreats & Getaways',
      'beauty': 'Beauty & Aesthetics'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {showFilters && (
            <div className="mb-8">
              <div className="skeleton-loader h-12 w-full bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-4">
                <div className="skeleton-loader h-10 w-48 bg-gray-200 rounded"></div>
                <div className="skeleton-loader h-10 w-48 bg-gray-200 rounded"></div>
                <div className="skeleton-loader h-10 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit || 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadDeals} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            South African Wellness Deals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover authentic wellness experiences across South Africa. From spa treatments in Cape Town 
            to fitness programs in Johannesburg - find your perfect wellness deal.
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search wellness deals, providers, or treatments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="spa">🧖‍♀️ Spa & Beauty</SelectItem>
                  <SelectItem value="fitness">🏃‍♀️ Fitness & Movement</SelectItem>
                  <SelectItem value="nutrition">🥗 Nutrition & Wellness</SelectItem>
                  <SelectItem value="meditation">🧘‍♀️ Meditation & Mindfulness</SelectItem>
                  <SelectItem value="retreats">🏞️ Retreats & Getaways</SelectItem>
                  <SelectItem value="beauty">💄 Beauty & Aesthetics</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="cape-town">🏔️ Cape Town</SelectItem>
                  <SelectItem value="johannesburg">🏙️ Johannesburg</SelectItem>
                  <SelectItem value="durban">🏖️ Durban</SelectItem>
                  <SelectItem value="pretoria">🌆 Pretoria</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  loadDeals();
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or explore all categories
              </p>
              <Button onClick={loadDeals}>Browse All Deals</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Deal Image */}
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={deal.imageUrl} 
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white">
                      <Percent className="h-3 w-3 mr-1" />
                      {deal.discountPercentage}% OFF
                    </Badge>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {formatCategory(deal.category)}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg leading-tight group-hover:text-omni-blue transition-colors line-clamp-2">
                      {deal.title}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-omni-blue font-medium">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{formatLocation(deal.location)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium text-gray-600">
                        {deal.rating} ({deal.reviewCount})
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Provider */}
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">{deal.provider}</span>
                  </div>

                  {/* Features */}
                  {deal.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {deal.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {deal.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{deal.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(deal.discountedPrice)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Valid until {new Date(deal.availableUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/wellness-deals/${deal.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-omni-blue to-omni-purple hover:opacity-90 text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}