import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Coins, 
  Clock,
  Globe,
  Calendar,
  ExternalLink
} from "lucide-react";

interface WebsiteData {
  id: string;
  page_title: string;
  page_subtitle: string;
  hero_image_url: string;
  hero_video_url: string;
  about_section: string;
  services_section_title: string;
  testimonials_section_title: string;
  contact_section_title: string;
  theme_color: string;
  custom_css: string;
  provider_profiles: {
    business_name: string;
    description: string;
    phone: string;
    location: string;
    specialties: string[];
    experience_years: number;
    profile_image_url: string;
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
}

const ProviderWebsite = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Sanitize custom CSS to prevent XSS attacks
  const sanitizedCSS = useMemo(() => {
    if (!website?.custom_css) return "";
    
    // Basic CSS sanitization - remove script tags, javascript:, and dangerous properties
    const cleanCSS = website.custom_css
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/expression\s*\(/gi, '') // Remove CSS expressions
      .replace(/@import/gi, '') // Remove @import to prevent external resource loading
      .replace(/behavior\s*:/gi, '') // Remove IE behavior property
      .replace(/binding\s*:/gi, '') // Remove binding property
      .replace(/url\s*\(\s*["']?\s*javascript:/gi, '') // Remove javascript URLs in url()
      .replace(/url\s*\(\s*["']?\s*data:/gi, ''); // Remove data URLs to prevent data injection

    return cleanCSS;
  }, [website?.custom_css]);

  useEffect(() => {
    if (websiteId) {
      fetchWebsiteData();
    }
  }, [websiteId]);

  const fetchWebsiteData = async () => {
    if (!websiteId) return;

    try {
      // Fetch website data with provider profile
      const { data: websiteData, error: websiteError } = await supabase
        .from('provider_websites')
        .select(`
          *,
          provider_profiles (
            business_name,
            description,
            phone,
            location,
            specialties,
            experience_years,
            profile_image_url
          )
        `)
        .eq('id', websiteId)
        .eq('published', true)
        .single();

      if (websiteError) {
        if (websiteError.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw websiteError;
        }
        return;
      }

      setWebsite(websiteData);

      // Fetch provider's services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', websiteData.provider_id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

    } catch (error: any) {
      console.error('Error fetching website data:', error);
      toast.error('Failed to load website');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-blue mx-auto mb-4"></div>
          <p>Loading website...</p>
        </div>
      </div>
    );
  }

  if (notFound || !website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Website Not Found</h1>
          <p className="text-gray-600 mb-6">This wellness provider website could not be found or is not published.</p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sanitized Custom CSS */}
      {sanitizedCSS && (
        <style dangerouslySetInnerHTML={{ __html: sanitizedCSS }} />
      )}

      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 text-center text-white"
        style={{
          backgroundColor: website.theme_color,
          backgroundImage: website.hero_image_url ? `url(${website.hero_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {website.page_title}
          </h1>
          {website.page_subtitle && (
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {website.page_subtitle}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <Calendar className="w-5 h-5 mr-2" />
              Book Session
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Phone className="w-5 h-5 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      {website.about_section && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">About {website.provider_profiles.business_name}</h2>
                <div className="prose prose-lg text-gray-600">
                  <p>{website.about_section}</p>
                </div>
                
                {website.provider_profiles.specialties && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {website.provider_profiles.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {website.provider_profiles.experience_years && (
                  <div className="mt-4">
                    <p className="text-gray-600">
                      <strong>{website.provider_profiles.experience_years}+ years</strong> of experience
                    </p>
                  </div>
                )}
              </div>
              
              {website.provider_profiles.profile_image_url && (
                <div className="text-center">
                  <img
                    src={website.provider_profiles.profile_image_url}
                    alt={website.provider_profiles.business_name}
                    className="w-80 h-80 object-cover rounded-full mx-auto shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {website.services_section_title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{service.category}</Badge>
                      {service.is_online && (
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{service.location}</span>
                      </div>
                      
                      {service.duration_minutes && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{service.duration_minutes} minutes</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {service.price_zar > 0 && (
                          <p className="font-medium text-green-600">
                            R{service.price_zar}
                          </p>
                        )}
                        {service.price_wellcoins > 0 && (
                          <p className="text-sm text-omni-orange">
                            {service.price_wellcoins} WellCoins
                          </p>
                        )}
                      </div>
                      
                      <Button size="sm" style={{ backgroundColor: website.theme_color }}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            {website.contact_section_title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {website.provider_profiles.phone && (
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" style={{ color: website.theme_color }} />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">{website.provider_profiles.phone}</p>
              </div>
            )}
            
            <div className="text-center">
              <Mail className="w-8 h-8 mx-auto mb-4" style={{ color: website.theme_color }} />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">hello@{website.provider_profiles.business_name.toLowerCase().replace(/\s+/g, '')}.com</p>
            </div>
            
            {website.provider_profiles.location && (
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: website.theme_color }} />
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-600">{website.provider_profiles.location}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: website.theme_color }}>
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline">
              <ExternalLink className="w-5 h-5 mr-2" />
              View on Marketplace
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">
            © 2024 {website.provider_profiles.business_name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Powered by <a href="/" className="text-white hover:underline">Omni Wellness Media</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProviderWebsite;