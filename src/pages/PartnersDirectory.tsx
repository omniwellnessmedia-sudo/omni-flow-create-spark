import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, ExternalLink, Users } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

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
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (partner: Partner) => {
    return partner.business_name || partner.profile?.full_name || 'Wellness Provider';
  };

  const getProfileImage = (partner: Partner) => {
    return partner.profile_image_url || partner.profile?.avatar_url || '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-omni-blue/5 to-omni-purple/5">
        <Navigation />
        <div className="pt-20 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading our wellness partners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png')] opacity-5 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85"></div>
      
      <Navigation />
      
      <main className="relative pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Verified Practitioners Available</span>
            </div>
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6 leading-tight">
              Meet Our Trusted <br />
              <span className="bg-rainbow-gradient bg-clip-text text-transparent">Wellness Partners</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with verified wellness practitioners who share our commitment to conscious healing and transformative experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary hover-lift">
                <Link to="/wellness-exchange/provider-signup" className="flex items-center gap-2">
                  Become a Partner
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary hover-scale">
                <Link to="/wellness-exchange/marketplace">
                  Browse Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Partners Grid */}
          {partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <Card key={partner.id} className="group hover-lift border-0 bg-card-gradient backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="text-center relative pb-4">
                    {/* Floating verification badge */}
                    {partner.verified && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-green-500 text-white shadow-lg border-0">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Verified
                        </Badge>
                      </div>
                    )}
                    
                    {/* Enhanced profile image */}
                    <div className="relative w-28 h-28 mx-auto mb-6">
                      <div className="absolute inset-0 bg-rainbow-gradient rounded-full p-1 animate-pulse-slow">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <img
                            src={getProfileImage(partner)}
                            alt={getDisplayName(partner)}
                            className="w-full h-full object-cover hover-scale"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold mb-2 group-hover:text-omni-indigo transition-colors">
                      {getDisplayName(partner)}
                    </CardTitle>
                    
                    {partner.location && (
                      <CardDescription className="flex items-center justify-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4 text-omni-orange" />
                        {partner.location}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Description */}
                    {partner.description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {partner.description}
                      </p>
                    )}

                    {/* Experience */}
                    {partner.experience_years && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {partner.experience_years} years experience
                      </div>
                    )}

                    {/* Specialties */}
                    {partner.specialties && partner.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {partner.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{partner.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Services Count */}
                    {partner.services && partner.services.length > 0 && (
                      <p className="text-sm text-omni-orange font-medium">
                        {partner.services.length} service{partner.services.length !== 1 ? 's' : ''} available
                      </p>
                    )}

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col gap-3 pt-6">
                      <Button asChild className="w-full btn-primary hover-lift">
                        <Link to={`/partners/${partner.id}`}>
                          View Full Profile
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        {partner.website && (
                          <Button variant="outline" className="flex-1 btn-secondary" asChild>
                            <a href={partner.website} target="_blank" rel="noopener noreferrer">
                              Website
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1 btn-secondary" asChild>
                          <Link to="/wellness-exchange/marketplace">
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-rainbow-gradient rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Partners Yet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Be among the first verified wellness practitioners to join our conscious community
                </p>
                <Button size="lg" className="btn-primary hover-lift" asChild>
                  <Link to="/wellness-exchange/provider-signup">
                    Become Our First Partner
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
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

export default PartnersDirectory;