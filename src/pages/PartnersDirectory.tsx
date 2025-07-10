import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, ExternalLink } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-omni-blue/5 to-omni-purple/5">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Wellness Partners</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover verified wellness practitioners and services in our community
            </p>
          </div>

          {/* Partners Grid */}
          {partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <Card key={partner.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-omni-orange/20">
                      <img
                        src={getProfileImage(partner)}
                        alt={getDisplayName(partner)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {getDisplayName(partner)}
                      {partner.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    {partner.location && (
                      <CardDescription className="flex items-center justify-center gap-1">
                        <MapPin className="w-4 h-4" />
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

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button asChild className="flex-1 bg-rainbow-gradient hover:opacity-90 text-white">
                        <Link to={`/partners/${partner.id}`}>
                          View Profile
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      {partner.website && (
                        <Button variant="outline" size="sm" asChild>
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
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No verified partners yet.</p>
              <Button asChild className="bg-rainbow-gradient hover:opacity-90 text-white">
                <Link to="/wellness-exchange/provider-signup">Become a Partner</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersDirectory;