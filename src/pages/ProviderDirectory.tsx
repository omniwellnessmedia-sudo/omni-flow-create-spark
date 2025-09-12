import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Award,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Heart
} from 'lucide-react';
import { allProviders, getUniqueCategories, getUniqueLocations, featuredProviders } from '@/data/providerDirectory';
import { ProviderDirectory as ProviderDirectoryType, ProviderFilterState } from '@/types/provider';

const ProviderDirectory = () => {
  const [filters, setFilters] = useState<ProviderFilterState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const categories = getUniqueCategories();
  const locations = getUniqueLocations();

  // Filter providers based on current filters and search
  const filteredProviders = useMemo(() => {
    let filtered = allProviders;

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(provider => provider.profile.category === filters.category);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(provider => 
        provider.profile.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Apply verified filter
    if (filters.verified !== undefined) {
      filtered = filtered.filter(provider => provider.profile.verified === filters.verified);
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter(provider => provider.profile.featured === filters.featured);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.profile.business_name.toLowerCase().includes(query) ||
        provider.profile.description.toLowerCase().includes(query) ||
        provider.profile.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
        provider.profile.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [filters, searchQuery]);

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Wellness Provider Directory
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover authentic wellness providers offering yoga, business development, traditional healing, 
            and curated wellness products. Connect with verified professionals dedicated to your wellbeing journey.
          </p>
          
          {/* Featured Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/50 backdrop-blur rounded-lg">
              <div className="text-2xl font-bold text-primary">{allProviders.length}</div>
              <div className="text-sm text-muted-foreground">Providers</div>
            </div>
            <div className="text-center p-4 bg-white/50 backdrop-blur rounded-lg">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center p-4 bg-white/50 backdrop-blur rounded-lg">
              <div className="text-2xl font-bold text-primary">{featuredProviders.length}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
            <div className="text-center p-4 bg-white/50 backdrop-blur rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {allProviders.reduce((sum, p) => sum + p.profile.total_clients, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search providers, specialties, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Select
              value={filters.category || ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value as any }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.location || ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={filters.verified ? "default" : "outline"}
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                verified: prev.verified === true ? undefined : true 
              }))}
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Verified Only
            </Button>

            <Button
              variant={filters.featured ? "default" : "outline"}
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                featured: prev.featured === true ? undefined : true 
              }))}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Featured
            </Button>

            {(Object.keys(filters).length > 0 || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Showing {filteredProviders.length} of {allProviders.length} providers
          </p>
        </div>

        {/* Provider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProviders.map((provider) => (
            <Card key={provider.profile.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={provider.profile.profile_image_url} alt={provider.profile.business_name} />
                    <AvatarFallback>{provider.profile.business_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-1">
                    {provider.profile.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {provider.profile.featured && (
                      <Badge variant="default" className="bg-primary/10 text-primary">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {provider.profile.business_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {provider.profile.location.split(',')[0]}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Badge variant="outline" className="text-xs">
                  {provider.profile.category}
                </Badge>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {provider.profile.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.profile.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{provider.profile.total_clients} clients</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{provider.profile.years_experience} years experience</span>
                </div>

                {/* Top Specialties */}
                <div className="flex flex-wrap gap-1">
                  {provider.profile.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {provider.profile.specialties.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{provider.profile.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0 space-y-2">
                <Button asChild className="w-full">
                  <Link to={`/provider/${provider.profile.id}`}>
                    View Profile & Services
                  </Link>
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  {provider.profile.website && (
                    <a href={provider.profile.website} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-1 hover:text-primary">
                      <Globe className="h-3 w-3" />
                      Website
                    </a>
                  )}
                  <a href={`mailto:${provider.profile.email}`} 
                     className="flex items-center gap-1 hover:text-primary">
                    <Mail className="h-3 w-3" />
                    Email
                  </a>
                  <a href={`tel:${provider.profile.phone}`} 
                     className="flex items-center gap-1 hover:text-primary">
                    <Phone className="h-3 w-3" />
                    Call
                  </a>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No providers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms to find more providers.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center py-16 px-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl">
          <Heart className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with our verified wellness providers and begin your transformation today. 
            From yoga and meditation to business development and traditional healing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/wellness-exchange-signup">Join Our Community</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/wellness-exchange">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDirectory;