import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Section } from "@/components/ui/section";
import { toast } from "sonner";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import {
  MapPin,
  Phone,
  Globe,
  Star,
  Calendar,
  Clock,
  Coins,
  PiggyBank,
  Award,
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  Play,
  Pause,
  Image as ImageIcon,
  Video
} from "lucide-react";

interface ProviderProfile {
  id: string;
  business_name: string;
  description: string;
  location: string;
  phone: string;
  website: string;
  specialties: string[];
  certifications: string[];
  experience_years: number;
  verified: boolean;
  profile_image_url: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price_zar: number;
  price_wellcoins: number;
  duration_minutes: number;
  location: string;
  is_online: boolean;
  images: string[];
}

interface MediaItem {
  id: string;
  title: string;
  description: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  featured: boolean;
}

interface Testimonial {
  id: string;
  client_name: string;
  testimonial_text: string;
  rating: number;
  service_type: string;
  created_at: string;
}

const ProviderLandingPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    if (providerId) {
      loadProviderData();
    }
  }, [providerId]);

  const loadProviderData = async () => {
    try {
      setLoading(true);

      // Load provider profile
      const { data: providerData, error: providerError } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          profiles!provider_profiles_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq('id', providerId)
        .single();

      if (providerError) throw providerError;
      setProvider(providerData);

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Load media
      const { data: mediaData, error: mediaError } = await supabase
        .from('provider_media')
        .select('*')
        .eq('provider_id', providerId)
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;
      setMedia(mediaData || []);

      // Load testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('provider_testimonials')
        .select('*')
        .eq('provider_id', providerId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (testimonialsError) throw testimonialsError;
      setTestimonials(testimonialsData || []);

    } catch (error: any) {
      console.error('Error loading provider data:', error);
      toast.error('Failed to load provider information');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceId: string) => {
    window.location.href = `/services/${serviceId}`;
  };

  const handleContactProvider = () => {
    if (provider?.phone) {
      window.open(`tel:${provider.phone}`);
    } else {
      toast.info("Contact information not available");
    }
  };

  const toggleVideoPlay = (mediaId: string, videoElement: HTMLVideoElement) => {
    if (playingVideo === mediaId) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      videoElement.play();
      setPlayingVideo(mediaId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation />
        <div className="pt-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavigation />
        <Section size="large" background="white">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
            <p className="text-gray-600 mb-8">The wellness provider you're looking for doesn't exist or is no longer available.</p>
            <Button onClick={() => window.history.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <Section size="large" background="white">
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Provider Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={provider.profile_image_url || provider.profiles?.avatar_url} />
                  <AvatarFallback className="text-xl">
                    {provider.business_name?.charAt(0) || provider.profiles?.full_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{provider.business_name}</h1>
                    {provider.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{provider.profiles?.full_name}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {provider.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {provider.location}
                      </div>
                    )}
                    
                    {provider.experience_years && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {provider.experience_years} years experience
                      </div>
                    )}
                    
                    {averageRating > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {averageRating.toFixed(1)} ({testimonials.length} reviews)
                      </div>
                    )}
                  </div>
                  
                  {provider.specialties && provider.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-gray-700 leading-relaxed">{provider.description}</p>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-rainbow hover:opacity-90 text-white"
                    onClick={handleContactProvider}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Provider
                  </Button>
                  
                  {provider.phone && (
                    <Button variant="outline" className="w-full" onClick={() => window.open(`tel:${provider.phone}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      {provider.phone}
                    </Button>
                  )}
                  
                  {provider.website && (
                    <Button variant="outline" className="w-full" onClick={() => window.open(provider.website, '_blank')}>
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Media Gallery */}
      {media.length > 0 && (
        <Section size="large" background="light">
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-8">Media Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item, index) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative group">
                    {item.media_type === 'image' ? (
                      <img 
                        src={item.media_url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative">
                        <video 
                          src={item.media_url}
                          className="w-full h-full object-cover"
                          muted
                          onClick={(e) => toggleVideoPlay(item.id, e.currentTarget)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            size="lg"
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              const video = e.currentTarget.parentElement?.previousElementSibling as HTMLVideoElement;
                              if (video) toggleVideoPlay(item.id, video);
                            }}
                          >
                            {playingVideo === item.id ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Badge 
                      className="absolute top-2 left-2"
                      variant={item.media_type === 'video' ? 'default' : 'secondary'}
                    >
                      {item.media_type === 'video' ? (
                        <Video className="h-3 w-3 mr-1" />
                      ) : (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      )}
                      {item.media_type}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Services */}
      <Section size="large" background="white">
        <div className="py-12">
          <h2 className="text-2xl font-bold mb-8">Services</h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  {service.images && service.images.length > 0 && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={service.images[0]} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2">
                        {service.category}
                      </Badge>
                      {service.is_online && (
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="flex-1">{service.location}</span>
                        {service.duration_minutes && (
                          <>
                            <Clock className="h-4 w-4 ml-4 mr-1" />
                            <span>{service.duration_minutes}min</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {service.price_zar > 0 && (
                            <div className="flex items-center text-green-600">
                              <PiggyBank className="h-4 w-4 mr-1" />
                              <span className="font-medium">R{service.price_zar}</span>
                            </div>
                          )}
                          {service.price_wellcoins > 0 && (
                            <div className="flex items-center text-omni-orange">
                              <Coins className="h-4 w-4 mr-1" />
                              <span className="font-medium">{service.price_wellcoins} WC</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          size="sm"
                          className="bg-gradient-rainbow hover:opacity-90 text-white"
                          onClick={() => handleBookService(service.id)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No services available at the moment</p>
            </div>
          )}
        </div>
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section size="large" background="light">
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-8">Client Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      "{testimonial.testimonial_text}"
                    </p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{testimonial.client_name}</span>
                      {testimonial.service_type && (
                        <Badge variant="outline">{testimonial.service_type}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Footer />
    </div>
  );
};

export default ProviderLandingPage;