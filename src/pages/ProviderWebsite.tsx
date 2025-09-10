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
import { createIntersectionObserver, debounce } from '@/lib/accessibility';

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
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Performance-optimized image component
  const OptimizedImage = ({ 
    src, 
    alt, 
    className = "", 
    ...props 
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);

    useEffect(() => {
      const observer = createIntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      });

      const imgElement = document.querySelector(`img[alt="${alt}"]`);
      if (imgElement) {
        observer.observe(imgElement);
      }

      return () => observer.disconnect();
    }, [alt]);

    return (
      <div className="relative">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
        )}
        <img
          src={inView ? src : undefined}
          alt={alt}
          className={`transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          {...props}
        />
      </div>
    );
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

      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Hero Section - Mobile-First Responsive */}
      <main id="main-content">
        <section 
          className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 text-center text-white"
          style={{
            backgroundColor: website.theme_color,
            backgroundImage: website.hero_image_url ? `url(${website.hero_image_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-labelledby="hero-title"
        >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 id="hero-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {website.page_title}
          </h1>
          {website.page_subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto">
              {website.page_subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              aria-label="Book a wellness session"
            >
              <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
              Book Session
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 font-semibold"
              aria-label="Contact wellness provider"
            >
              <Phone className="w-5 h-5 mr-2" aria-hidden="true" />
              Contact
            </Button>
          </div>
        </div>
      </section>

        {/* About Section - Mobile-First Responsive */}
        {website.about_section && (
          <section className="py-12 sm:py-16 md:py-20 px-4" aria-labelledby="about-heading">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 id="about-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
                  About {website.provider_profiles.business_name}
                </h2>
                <div className="prose prose-base sm:prose-lg text-gray-600 max-w-none">
                  <p className="text-center lg:text-left leading-relaxed">
                    {website.about_section}
                  </p>
                </div>
                
                {website.provider_profiles.specialties && (
                  <div className="mt-6 text-center lg:text-left">
                    <h3 className="font-semibold mb-3 text-lg">Specialties</h3>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {website.provider_profiles.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {website.provider_profiles.experience_years && (
                  <div className="mt-4 text-center lg:text-left">
                    <p className="text-gray-600 text-lg">
                      <strong className="text-primary">{website.provider_profiles.experience_years}+ years</strong> of experience
                    </p>
                  </div>
                )}
              </div>
              
              {website.provider_profiles.profile_image_url && (
                <div className="text-center order-1 lg:order-2">
                  <OptimizedImage
                    src={website.provider_profiles.profile_image_url}
                    alt={`${website.provider_profiles.business_name} profile photo`}
                    className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-full mx-auto shadow-2xl transition-transform hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>
          </section>
        )}

        {/* Services Section - Mobile-First Responsive */}
        {services.length > 0 && (
          <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50" aria-labelledby="services-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="services-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
              {website.services_section_title}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <Badge variant="secondary" className="w-fit">{service.category}</Badge>
                      {service.is_online && (
                        <Badge className="bg-green-100 text-green-800 w-fit">Online</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl leading-tight">{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{service.location}</span>
                      </div>
                      
                      {service.duration_minutes && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{service.duration_minutes} minutes</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-1">
                        {service.price_zar > 0 && (
                          <p className="font-semibold text-green-600 text-lg">
                            R{service.price_zar}
                          </p>
                        )}
                        {service.price_wellcoins > 0 && (
                          <p className="text-sm font-medium text-amber-600">
                            {service.price_wellcoins} WellCoins
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto font-semibold"
                        style={{ backgroundColor: website.theme_color }}
                      >
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

        {/* Contact Section - Mobile-First Responsive */}
        <section className="py-12 sm:py-16 md:py-20 px-4" aria-labelledby="contact-heading">
        <div className="max-w-5xl mx-auto text-center">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12">
            {website.contact_section_title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {website.provider_profiles.phone && (
              <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 transition-transform hover:scale-110" style={{ color: website.theme_color }} />
                <h3 className="font-semibold mb-2 text-lg">Phone</h3>
                <p className="text-gray-600 text-sm sm:text-base">{website.provider_profiles.phone}</p>
              </div>
            )}
            
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 transition-transform hover:scale-110" style={{ color: website.theme_color }} />
              <h3 className="font-semibold mb-2 text-lg">Email</h3>
              <p className="text-gray-600 text-sm sm:text-base break-all">
                hello@{website.provider_profiles.business_name.toLowerCase().replace(/\s+/g, '')}.com
              </p>
            </div>
            
            {website.provider_profiles.location && (
              <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors sm:col-span-2 lg:col-span-1">
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 transition-transform hover:scale-110" style={{ color: website.theme_color }} />
                <h3 className="font-semibold mb-2 text-lg">Location</h3>
                <p className="text-gray-600 text-sm sm:text-base">{website.provider_profiles.location}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto font-semibold text-base px-8"
              style={{ backgroundColor: website.theme_color }}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-base px-8">
              <ExternalLink className="w-5 h-5 mr-2" />
              View on Marketplace
            </Button>
          </div>
          </div>
        </section>
      </main>

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