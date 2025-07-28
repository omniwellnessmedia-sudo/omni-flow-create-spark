import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock, Star, Check, ChevronRight, Heart, Share2, Camera, Award, Shield, Globe, Compass, Mountain, ArrowLeft, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import MegaNavigation from '@/components/MegaNavigation';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';
import { PriceDisplay } from '@/components/ui/price-display';
import { Link } from 'react-router-dom';

interface Tour {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  duration: string;
  max_participants: number;
  price_from: number;
  destination: string;
  hero_image_url: string;
  image_gallery: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  difficulty_level: string;
  category: {
    name: string;
    slug: string;
  };
}

interface Itinerary {
  day_number: number;
  title: string;
  description: string;
  location: string;
  activities: string[];
  meals_included: string[];
  accommodation: string;
}

interface Testimonial {
  name: string;
  title: string;
  testimonial_text: string;
  rating: number;
  image_url: string;
}

const TourDetail = () => {
  const { category, slug } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchTourData();
    }
  }, [slug]);

  const fetchTourData = async () => {
    try {
      console.log('Fetching tour with slug:', slug, 'in category:', category);
      
      // Fetch tour details
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select(`
          *,
          category:tour_categories(name, slug)
        `)
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (tourError) {
        console.error('Error fetching tour:', tourError);
        setLoading(false);
        return;
      }

      if (tourData) {
        setTour(tourData);

        // Fetch itinerary
        const { data: itineraryData } = await supabase
          .from('tour_itineraries')
          .select('*')
          .eq('tour_id', tourData.id)
          .order('day_number');

        // Fetch testimonials
        const { data: testimonialsData } = await supabase
          .from('tour_testimonials')
          .select('*')
          .eq('tour_id', tourData.id)
          .eq('approved', true)
          .limit(6);

        setItinerary(itineraryData || []);
        setTestimonials(testimonialsData || []);
      } else {
        console.log('No tour found with slug:', slug);
        // If no tour found, maybe the user is trying to access a category
        // Let's check if this slug is actually a category
        const { data: categoryData } = await supabase
          .from('tour_categories')
          .select('slug')
          .eq('slug', slug)
          .eq('active', true)
          .maybeSingle();
          
        if (categoryData) {
          // Redirect to category page
          window.location.href = `/tours-retreats/${slug}`;
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching tour data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground">The tour you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const images = tour.image_gallery && tour.image_gallery.length > 0 
    ? [tour.hero_image_url, ...tour.image_gallery].filter(Boolean)
    : [tour.hero_image_url];

  return (
    <div className="min-h-screen bg-background">
      <MegaNavigation />
      <BreadcrumbNav 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tours & Retreats', href: '/tours-retreats' },
          { label: tour?.category?.name || 'Category', href: `/tours-retreats/${tour?.category?.slug}` },
          { label: tour?.title || 'Tour', current: true }
        ]}
      />
      
      {/* Immersive Hero Section - Mobile Optimized */}
      <section className="relative">
        {/* Hero Image Container */}
        <div className="relative h-[60vh] sm:h-[80vh] lg:h-screen overflow-hidden">
          <img 
            src={images[selectedImage] || '/lovable-uploads/wellness-humans.png'} 
            alt={tour.title}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = '/lovable-uploads/wellness-humans.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Back button */}
          <div className="absolute top-4 left-4 z-20">
            <Link 
              to={`/tours-retreats/${tour?.category?.slug || 'indigenous-wisdom'}`} 
              className="inline-flex items-center text-white/80 hover:text-white bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back to {tour?.category?.name || 'Tours'}</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          
          {/* Top badges and actions */}
          <div className="absolute top-4 right-4 z-20 flex gap-1">
            <Badge className="bg-yellow-500/90 text-black border-0 font-bold text-xs px-2 py-1">
              <Award className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">EXCLUSIVE</span>
              <span className="sm:hidden">EXC</span>
            </Badge>
            <Button size="sm" variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-6 w-6 p-0">
              <Heart className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 h-6 w-6 p-0">
              <Share2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Image Gallery Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border ${
                    selectedImage === index 
                      ? 'bg-white border-white' 
                      : 'bg-transparent border-white/50 hover:border-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Overlay - Mobile Optimized */}
        <div className="relative -mt-32 sm:-mt-40 lg:-mt-48 z-10">
          <div className="bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-sm">
            <div className="container mx-auto px-4 pt-20 sm:pt-24 lg:pt-32 pb-8">
              <div className="max-w-4xl">
                {/* Journey Classification */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                    <Mountain className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{tour.category?.name}</span>
                    <span className="sm:hidden">{tour.category?.name?.split(' ')[0]}</span>
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{tour.difficulty_level.toUpperCase()}</span>
                    <span className="sm:hidden">{tour.difficulty_level.toUpperCase()}</span>
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                  {tour.title}
                </h1>
                
                {/* Subtitle */}
                <p className="text-base sm:text-xl text-muted-foreground mb-6 leading-relaxed">
                  {tour.subtitle}
                </p>

                {/* Expedition Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
                    <div className="font-semibold text-xs sm:text-sm">{tour.duration}</div>
                    <div className="text-muted-foreground text-xs">Duration</div>
                  </div>
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
                    <div className="font-semibold text-xs sm:text-sm">{tour.max_participants}</div>
                    <div className="text-muted-foreground text-xs">Max Guests</div>
                  </div>
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
                    <div className="font-semibold text-xs sm:text-sm">Western Cape</div>
                    <div className="text-muted-foreground text-xs">Destination</div>
                  </div>
                  <div className="bg-card border rounded-lg p-3 text-center">
                    <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1" />
                    <div className="font-semibold text-xs sm:text-sm">${Math.round(tour.price_from / 18.5)}</div>
                    <div className="text-muted-foreground text-xs">From USD</div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-6 py-3 text-base">
                    Reserve Your Spot
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 py-3 text-base">
                    <Camera className="h-4 w-4 mr-2" />
                    View Gallery
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Content Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary" className="text-xs sm:text-sm px-2 py-2">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions" className="text-xs sm:text-sm px-2 py-2">Inclusions</TabsTrigger>
                  <TabsTrigger value="wellness" className="text-xs sm:text-sm px-2 py-2">
                    <span className="hidden sm:inline">Wellness Highlights</span>
                    <span className="sm:hidden">Wellness</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Journey</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {tour.overview || "Embark on a transformative journey that combines ancient wisdom with modern wellness practices. This carefully curated experience will guide you through profound healing modalities and consciousness-expanding practices in some of the world's most sacred locations."}
                      </p>
                    </CardContent>
                  </Card>

                  {tour.highlights && tour.highlights.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Journey Highlights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-3">
                          {tour.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground text-sm sm:text-base">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4">
                  {itinerary.length > 0 ? (
                    itinerary.map((day, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                              {day.day_number}
                            </span>
                            <span>{day.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{day.description}</p>
                          {day.location && (
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {day.location}
                            </div>
                          )}
                          {day.activities && day.activities.length > 0 && (
                            <div className="mt-3">
                              <h4 className="font-semibold text-sm mb-2">Activities:</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {day.activities.map((activity, i) => (
                                  <li key={i}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Detailed itinerary coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="inclusions" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {tour.inclusions && tour.inclusions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-600">What's Included</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {tour.inclusions.map((inclusion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{inclusion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {tour.exclusions && tour.exclusions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-red-600">Not Included</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {tour.exclusions.map((exclusion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-600 mt-0.5">×</span>
                                <span className="text-sm text-muted-foreground">{exclusion}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="wellness" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Wellness Benefits & Earning Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-primary">Wellness Highlights</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">Deep healing through ancestral wisdom</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">Stress reduction and mental clarity</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">Community connection and support</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">Personal transformation and growth</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">Mindfulness and meditation practices</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">Cultural immersion and learning</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Coins className="h-5 w-5 text-yellow-600" />
                            <h4 className="font-semibold text-yellow-800">Earn WellCoins</h4>
                          </div>
                          <p className="text-sm text-yellow-700 mb-4">
                            Complete this transformative journey and earn WellCoins - our wellness currency that rewards your commitment to personal growth.
                          </p>
                          <div className="space-y-2 text-sm text-yellow-700">
                            <div className="flex justify-between">
                              <span>Journey Completion:</span>
                              <span className="font-semibold">+250 WellCoins</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Community Sharing:</span>
                              <span className="font-semibold">+50 WellCoins</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Wellness Goals Met:</span>
                              <span className="font-semibold">+100 WellCoins</span>
                            </div>
                            <hr className="border-yellow-300" />
                            <div className="flex justify-between font-bold">
                              <span>Total Potential:</span>
                              <span>400 WellCoins</span>
                            </div>
                          </div>
                          <Link to="/wellness-exchange" className="block mt-4">
                            <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                              Learn About WellCoins
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Why Choose Omni Wellness Journeys?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <h5 className="font-medium text-blue-800">Expert Guidance</h5>
                            <p className="text-sm text-blue-600">Led by certified wellness practitioners</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Globe className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <h5 className="font-medium text-green-800">Authentic Experiences</h5>
                            <p className="text-sm text-green-600">Real cultural immersion with local communities</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <Heart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <h5 className="font-medium text-purple-800">Lasting Impact</h5>
                            <p className="text-sm text-purple-600">Tools and practices for lifelong wellness</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <TourBookingSidebar tour={tour} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourDetail;