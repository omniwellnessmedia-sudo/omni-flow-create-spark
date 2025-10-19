import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, ExternalLink, Users, Heart, Sparkles } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-omni-blue/5 to-omni-violet/5">
        <UnifiedNavigation />
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
    <div className="min-h-screen bg-gradient-to-br from-wellhub-light via-white to-omni-violet/5">
      <UnifiedNavigation />
      <BreadcrumbNav />
      
      {/* Background Video */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-omni-violet/5"></div>
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          autoPlay
          muted
          loop
          playsInline
        >
        </video>
      </div>
      
      <Hero
        title={
          <>
            Our <span className="text-gradient-rainbow">Wellness Partners</span>
          </>
        }
        subtitle="Verified Community"
        description="Connect with trusted wellness practitioners who share our vision for holistic health and conscious living"
        variant="centered"
        height="small"
        actions={[
          {
            label: "Become a Partner",
            href: "/wellness-exchange/provider-signup",
            variant: "wellness"
          },
          {
            label: "Browse Services",
            href: "/wellness-exchange/marketplace",
            variant: "soft"
          }
        ]}
      />

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-omni-orange">{partners.length}+</div>
              <div className="text-gray-600 font-medium">Verified Partners</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-omni-green">
                {partners.reduce((acc, partner) => acc + (partner.services?.length || 0), 0)}+
              </div>
              <div className="text-gray-600 font-medium">Services Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-omni-blue">
                {Math.round(partners.reduce((acc, partner) => acc + (partner.experience_years || 0), 0) / partners.length) || 0}
              </div>
              <div className="text-gray-600 font-medium">Avg Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="section-padding bg-gradient-to-br from-omni-violet/5 to-omni-orange/5">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Why Partner With Omni Wellness
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join a community of conscious practitioners making a real difference in people's lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-omni-orange/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-omni-orange" />
              </div>
              <h3 className="font-heading font-semibold text-xl">Community Focus</h3>
              <p className="text-gray-600">Connect with like-minded practitioners and build meaningful relationships</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-omni-green/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-omni-green" />
              </div>
              <h3 className="font-heading font-semibold text-xl">Conscious Mission</h3>
              <p className="text-gray-600">Be part of a movement that prioritizes wellness, sustainability, and positive change</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-omni-violet/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-omni-violet" />
              </div>
              <h3 className="font-heading font-semibold text-xl">Growth Opportunities</h3>
              <p className="text-gray-600">Access tools, resources, and collaborations to expand your practice</p>
            </div>
          </div>
        </div>
      </section>
      
      <main className="section-padding">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Meet Our Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover verified wellness practitioners ready to support your journey
            </p>
          </div>

          {/* Partners Grid */}
          {partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <Card key={partner.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white/95 overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-3 border-omni-orange/20 group-hover:border-omni-orange/40 transition-colors">
                      <img
                        src={getProfileImage(partner)}
                        alt={getDisplayName(partner)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2 text-lg">
                      {getDisplayName(partner)}
                      {partner.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    {partner.location && (
                      <CardDescription className="flex items-center justify-center gap-1 text-sm">
                        <MapPin className="w-4 h-4" />
                        {partner.location}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-0">
                    {/* Description */}
                    {partner.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {partner.description}
                      </p>
                    )}

                    {/* Experience */}
                    {partner.experience_years && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-omni-orange" />
                        {partner.experience_years} years experience
                      </div>
                    )}

                    {/* Specialties */}
                    {partner.specialties && partner.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-omni-orange/30 text-omni-orange">
                            {specialty}
                          </Badge>
                        ))}
                        {partner.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                            +{partner.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Services Count */}
                    {partner.services && partner.services.length > 0 && (
                      <div className="bg-omni-orange/5 rounded-lg p-3 text-center">
                        <p className="text-sm font-medium text-omni-orange">
                          {partner.services.length} service{partner.services.length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1 bg-gradient-rainbow hover:opacity-90 text-white font-medium">
                        <Link to={`/partners/${partner.id}`}>
                          View Profile
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      {partner.website && (
                        <Button variant="outline" size="sm" asChild className="border-omni-orange text-omni-orange hover:bg-omni-orange hover:text-white">
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
            <div className="text-center py-16 bg-white/80 rounded-2xl">
              <div className="w-24 h-24 mx-auto mb-6 bg-omni-orange/10 rounded-full flex items-center justify-center">
                <Users className="h-12 w-12 text-omni-orange" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">No Partners Yet</h3>
              <p className="text-gray-600 mb-6">Be among the first to join our conscious wellness community!</p>
              <Button asChild className="bg-gradient-rainbow hover:opacity-90 text-white font-medium px-8">
                <Link to="/wellness-exchange/provider-signup">Become a Partner</Link>
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-20 text-center bg-gradient-to-r from-omni-orange/10 via-omni-violet/10 to-omni-green/10 rounded-2xl p-12">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Ready to Join Our Wellness Community?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you're a practitioner looking to connect or someone seeking wellness services, we're here to support your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-rainbow hover:opacity-90 text-white font-medium px-8">
                <Link to="/wellness-exchange/provider-signup">Become a Partner</Link>
              </Button>
              <Button asChild variant="soft" size="lg" className="px-8">
                <Link to="/wellness-exchange/marketplace">Browse Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnersDirectory;