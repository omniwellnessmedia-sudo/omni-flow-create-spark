import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Clock, ExternalLink, Search, Filter, Users, Heart, Zap, CheckCircle } from "lucide-react";
import partnersHero from "@/assets/partners-hero.png";

interface Partner {
  id: string;
  business_name: string | null;
  description: string | null;
  location: string | null;
  specialties: string[] | null;
  verified: boolean | null;
  profile_image_url: string | null;
  website: string | null;
  experience_years: number | null;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  };
  services: Array<{
    id: string;
    title: string;
    category: string | null;
    price_zar: number | null;
    price_wellcoins: number | null;
  }>;
}

const PartnersDirectory = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          profile:profiles(full_name, avatar_url),
          services(id, title, category, price_zar, price_wellcoins)
        `)
        .eq('verified', true);

      if (error) throw error;
      const partnersData = data || [];
      setPartners(partnersData);
      setFilteredPartners(partnersData);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter partners based on search and category
  useEffect(() => {
    let filtered = partners;

    if (searchTerm) {
      filtered = filtered.filter(partner => 
        getDisplayName(partner).toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(partner =>
        partner.specialties?.some(specialty => 
          specialty.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    setFilteredPartners(filtered);
  }, [partners, searchTerm, selectedCategory]);

  const categories = [
    "all",
    "yoga",
    "fitness",
    "nutrition",
    "massage",
    "mindfulness",
    "coaching"
  ];

  const getDisplayName = (partner: Partner) => {
    return partner.business_name || partner.profile?.full_name || 'Wellness Provider';
  };

  const getProfileImage = (partner: Partner) => {
    return partner.profile_image_url || partner.profile?.avatar_url || '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wellhub-light">
        <Navigation />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-wellhub-gradient mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Discovering amazing wellness partners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wellhub-light">
      <Navigation />
      
      {/* Hero Section - Wellhub inspired */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-wellhub-gradient"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 text-white">
              <div className="space-y-6">
                <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight">
                  Find Your Perfect
                  <br />
                  <span className="text-yellow-300">Wellness Partner</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-lg">
                  Connect with verified wellness practitioners who understand your journey and are ready to guide you towards better health.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">{partners.length}+</div>
                  <div className="text-sm text-white/80">Verified Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">50+</div>
                  <div className="text-sm text-white/80">Specialties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">100%</div>
                  <div className="text-sm text-white/80">Verified</div>
                </div>
              </div>

              {/* Value Props */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-yellow-300" />
                  <span className="text-lg">All practitioners verified and background-checked</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-yellow-300" />
                  <span className="text-lg">Personalized matching based on your wellness goals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 text-yellow-300" />
                  <span className="text-lg">Flexible booking with WellCoins or traditional payment</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src={partnersHero}
                alt="Wellness Partners" 
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Section */}
          <div className="glass rounded-3xl p-8 mb-12 shadow-xl">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">Find the Right Partner for You</h2>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "wellness" : "soft"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === "all" ? "All Specialties" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Partners Grid */}
          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="group hover-lift glass border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="text-center bg-gradient-to-br from-white/50 to-white/30 pb-6">
                    <div className="relative w-28 h-28 mx-auto mb-6">
                      <img
                        src={getProfileImage(partner)}
                        alt={getDisplayName(partner)}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      {partner.verified && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                      {getDisplayName(partner)}
                    </CardTitle>
                    {partner.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 mb-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Partner
                      </Badge>
                    )}
                    {partner.location && (
                      <CardDescription className="flex items-center justify-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {partner.location}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-6 p-6">
                    {/* Description */}
                    {partner.description && (
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {partner.description}
                      </p>
                    )}

                    {/* Experience */}
                    {partner.experience_years && (
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-xl p-3">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">{partner.experience_years} years experience</span>
                      </div>
                    )}

                    {/* Specialties */}
                    {partner.specialties && partner.specialties.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {partner.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              {specialty}
                            </Badge>
                          ))}
                          {partner.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-500 bg-gray-50">
                              +{partner.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Services Count */}
                    {partner.services && partner.services.length > 0 && (
                      <div className="flex items-center gap-2 text-purple-600 bg-purple-50 rounded-xl p-3">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">{partner.services.length} service{partner.services.length !== 1 ? 's' : ''} available</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button asChild variant="wellness" className="flex-1">
                        <Link to={`/partners/${partner.id}`}>
                          View Profile
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      {partner.website && (
                        <Button variant="outline" size="sm" asChild className="px-4">
                          <a href={partner.website} target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {searchTerm || selectedCategory !== "all" ? "No matches found" : "No verified partners yet"}
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search criteria or browse all partners."
                    : "Be the first to join our wellness community!"
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  {(searchTerm || selectedCategory !== "all") && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button asChild variant="wellness">
                    <Link to="/wellness-exchange/provider-signup">Become a Partner</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersDirectory;