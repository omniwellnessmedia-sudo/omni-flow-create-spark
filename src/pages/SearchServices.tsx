import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileNavigation from "@/components/MobileNavigation";
import { Search, Filter, MapPin, Star, TrendingUp, Clock, Users } from "lucide-react";

const SearchServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "Yoga", "Meditation", "Nutrition", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism"
  ];

  const trendingSearches = [
    "Yoga classes Cape Town",
    "Online meditation sessions", 
    "Holistic healing retreat",
    "Personal training Stellenbosch",
    "Nutrition coaching online"
  ];

  const popularServices = [
    {
      title: "Hatha Yoga",
      searches: 145,
      providers: 23,
      avgPrice: "R75"
    },
    {
      title: "Meditation Classes",
      searches: 112,
      providers: 18,
      avgPrice: "R60"
    },
    {
      title: "Life Coaching",
      searches: 89,
      providers: 15,
      avgPrice: "R350"
    },
    {
      title: "Massage Therapy",
      searches: 76,
      providers: 12,
      avgPrice: "R250"
    }
  ];

  const handleSearch = () => {
    // Navigate to marketplace with search filters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    
    window.location.href = `/wellness-exchange/marketplace?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2">
              Find Your Perfect <span className="bg-rainbow-gradient bg-clip-text text-transparent">Wellness Service</span>
            </h1>
            <p className="text-gray-600">Discover wellness providers and services that match your needs</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Services
              </CardTitle>
              <CardDescription>Find exactly what you're looking for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="What service are you looking for?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Location (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-rainbow-gradient hover:opacity-90 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Services
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trending Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-omni-orange" />
                  Trending Searches
                </CardTitle>
                <CardDescription>What others are looking for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setSearchTerm(search)}
                    >
                      <div className="flex items-center">
                        <span className="text-omni-orange font-bold mr-3">#{index + 1}</span>
                        <span>{search}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Popular Services
                </CardTitle>
                <CardDescription>Most sought-after wellness services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <h4 className="font-medium">{service.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Search className="h-3 w-3 mr-1" />
                          <span>{service.searches} searches</span>
                          <Users className="h-3 w-3 ml-3 mr-1" />
                          <span>{service.providers} providers</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{service.avgPrice}</Badge>
                        <p className="text-xs text-gray-600 mt-1">avg price</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Categories */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Browse by Category
              </CardTitle>
              <CardDescription>Explore different wellness categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    className="h-auto p-4 flex-col"
                    onClick={() => {
                      setCategory(cat);
                      handleSearch();
                    }}
                  >
                    <span className="text-sm font-medium">{cat}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SearchServices;