import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Star, 
  Clock, 
  Globe, 
  Phone, 
  Award, 
  Calendar,
  DollarSign,
  Coins,
  ArrowLeft
} from "lucide-react";

interface PartnerProfile {
  id: string;
  business_name: string | null;
  description: string | null;
  location: string | null;
  specialties: string[] | null;
  certifications: string[] | null;
  verified: boolean | null;
  profile_image_url: string | null;
  website: string | null;
  phone: string | null;
  experience_years: number | null;
  created_at: string;
  profile: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  services: Array<{
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    price_zar: number | null;
    price_wellcoins: number | null;
    duration_minutes: number | null;
    is_online: boolean | null;
    location: string | null;
  }>;
}

const PartnerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPartner(id);
    }
  }, [id]);

  const fetchPartner = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          profile:profiles(full_name, email, avatar_url),
          services(*)
        `)
        .eq('id', partnerId)
        .single();

      if (error) throw error;
      setPartner(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    return partner?.business_name || partner?.profile?.full_name || 'Wellness Provider';
  };

  const getProfileImage = () => {
    return partner?.profile_image_url || partner?.profile?.avatar_url || '/placeholder.svg';
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-omni-blue/5 to-omni-purple/5">
        <Navigation />
        <div className="pt-20 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading partner profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-omni-blue/5 to-omni-purple/5">
        <Navigation />
        <div className="pt-20 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Partner Not Found</h1>
            <p className="text-gray-600 mb-6">The partner profile you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/partners">Back to Partners</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-omni-blue/5 to-omni-purple/5">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/partners">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Partners
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Partner Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-omni-orange/20">
                    <img
                      src={getProfileImage()}
                      alt={getDisplayName()}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2 flex-wrap">
                    {getDisplayName()}
                    {partner.verified && (
                      <Badge className="bg-green-100 text-green-700">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Verified
                      </Badge>
                    )}
                  </CardTitle>
                  {partner.profile?.email && (
                    <CardDescription>{partner.profile.email}</CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  {partner.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{partner.location}</span>
                    </div>
                  )}
                  
                  {partner.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{partner.phone}</span>
                    </div>
                  )}
                  
                  {partner.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-omni-orange hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {partner.experience_years && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{partner.experience_years} years experience</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Partner since {new Date(partner.created_at).getFullYear()}</span>
                  </div>

                  <Separator />

                  {/* Specialties */}
                  {partner.specialties && partner.specialties.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {partner.certifications && partner.certifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Certifications
                      </h3>
                      <ul className="space-y-1">
                        {partner.certifications.map((cert, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {partner.description || "This wellness provider hasn't added a description yet."}
                  </p>
                </CardContent>
              </Card>

              {/* Services Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Services ({partner.services?.length || 0})</CardTitle>
                  <CardDescription>
                    Professional wellness services offered by this provider
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {partner.services && partner.services.length > 0 ? (
                    <div className="grid gap-6">
                      {partner.services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{service.title}</h3>
                              {service.category && (
                                <Badge variant="secondary" className="mt-1">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              {service.price_zar && (
                                <div className="flex items-center gap-1 text-lg font-semibold">
                                  <DollarSign className="w-4 h-4" />
                                  R{service.price_zar}
                                </div>
                              )}
                              {service.price_wellcoins && (
                                <div className="flex items-center gap-1 text-sm text-omni-orange">
                                  <Coins className="w-4 h-4" />
                                  {service.price_wellcoins} WellCoins
                                </div>
                              )}
                            </div>
                          </div>

                          {service.description && (
                            <p className="text-gray-600 mb-3">{service.description}</p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {service.duration_minutes && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDuration(service.duration_minutes)}
                              </div>
                            )}
                            {service.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {service.location}
                              </div>
                            )}
                            {service.is_online && (
                              <Badge variant="outline" className="text-xs">
                                Available Online
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No services listed yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerProfile;