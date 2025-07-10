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
  ArrowLeft,
  Play,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Heart,
  Eye,
  ExternalLink
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
  media?: Array<{
    id: string;
    title: string;
    description: string | null;
    media_type: string;
    media_url: string;
    thumbnail_url: string | null;
    featured: boolean;
    view_count: number;
    created_at: string;
  }>;
  testimonials?: Array<{
    id: string;
    client_name: string;
    client_image_url: string | null;
    testimonial_text: string;
    rating: number;
    service_type: string | null;
    featured: boolean;
    created_at: string;
  }>;
  posts?: Array<{
    id: string;
    title: string;
    excerpt: string | null;
    featured_image_url: string | null;
    category: string | null;
    view_count: number;
    created_at: string;
  }>;
  website_info?: {
    id: string;
    page_title: string;
    published: boolean;
    custom_domain: string | null;
  };
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
      // Fetch provider profile
      const { data: profileData, error: profileError } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          profile:profiles(full_name, email, avatar_url),
          services(*)
        `)
        .eq('id', partnerId)
        .single();

      if (profileError) throw profileError;

      // Fetch media
      const { data: mediaData } = await supabase
        .from('provider_media')
        .select('*')
        .eq('provider_id', partnerId)
        .eq('active', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      // Fetch testimonials
      const { data: testimonialsData } = await supabase
        .from('provider_testimonials')
        .select('*')
        .eq('provider_id', partnerId)
        .eq('approved', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch blog posts
      const { data: postsData } = await supabase
        .from('provider_posts')
        .select('id, title, excerpt, featured_image_url, category, view_count, created_at')
        .eq('provider_id', partnerId)
        .eq('published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch website info
      const { data: websiteData } = await supabase
        .from('provider_websites')
        .select('id, page_title, published, custom_domain')
        .eq('provider_id', partnerId)
        .single();

      // Combine all data
      const combinedData = {
        ...profileData,
        media: mediaData || [],
        testimonials: testimonialsData || [],
        posts: postsData || [],
        website_info: websiteData
      };

      setPartner(combinedData);
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

              {/* Website Link Section */}
              {partner.website_info?.published && (
                <Card className="border-omni-orange/20 bg-gradient-to-r from-omni-orange/5 to-omni-yellow/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-omni-orange" />
                      Personal Website
                    </CardTitle>
                    <CardDescription>
                      {getDisplayName()} has their own wellness website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{partner.website_info.page_title}</h3>
                        <p className="text-sm text-gray-600">
                          {partner.website_info.custom_domain || `${getDisplayName()}'s Wellness Hub`}
                        </p>
                      </div>
                      <Button className="bg-omni-orange hover:bg-omni-orange/90 text-white">
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Media Gallery Section */}
              {partner.media && partner.media.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Media Gallery
                    </CardTitle>
                    <CardDescription>
                      Videos, images, and content shared by {getDisplayName()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {partner.media.map((media) => (
                        <div key={media.id} className="relative group cursor-pointer">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            {media.media_type === 'video' ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={media.thumbnail_url || media.media_url}
                                  alt={media.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                  <Play className="w-12 h-12 text-white" />
                                </div>
                              </div>
                            ) : (
                              <img
                                src={media.media_url}
                                alt={media.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <div className="mt-2">
                            <h4 className="font-medium text-sm">{media.title}</h4>
                            {media.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{media.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Eye className="w-3 h-3" />
                              <span>{media.view_count} views</span>
                              {media.featured && (
                                <Badge variant="outline" className="text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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

              {/* Testimonials Section */}
              {partner.testimonials && partner.testimonials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Client Testimonials
                    </CardTitle>
                    <CardDescription>
                      What clients are saying about {getDisplayName()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {partner.testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="border-l-4 border-omni-orange/30 pl-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                <img
                                  src={testimonial.client_image_url || '/placeholder.svg'}
                                  alt={testimonial.client_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                {testimonial.service_type && (
                                  <Badge variant="outline" className="text-xs">
                                    {testimonial.service_type}
                                  </Badge>
                                )}
                                {testimonial.featured && (
                                  <Badge className="bg-omni-orange text-white text-xs">Featured</Badge>
                                )}
                              </div>
                              <p className="text-gray-600 italic mb-2">"{testimonial.testimonial_text}"</p>
                              <p className="text-sm font-medium">— {testimonial.client_name}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Blog Posts Section */}
              {partner.posts && partner.posts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Latest Articles
                    </CardTitle>
                    <CardDescription>
                      Insights and articles by {getDisplayName()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      {partner.posts.map((post) => (
                        <div key={post.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                          {post.featured_image_url && (
                            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                            {post.excerpt && (
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {post.category && (
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.view_count} views
                              </div>
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerProfile;