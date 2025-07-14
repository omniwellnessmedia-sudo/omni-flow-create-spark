import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock, Star, Check, ChevronRight, Heart, Share2, Camera, Award, Shield, Globe, Compass, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';

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
      // Fetch tour details
      const { data: tourData } = await supabase
        .from('tours')
        .select(`
          *,
          category:tour_categories(name, slug)
        `)
        .eq('slug', slug)
        .eq('active', true)
        .single();

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
      {/* Immersive Hero Section - National Geographic Style */}
      <section className="relative h-screen bg-cover bg-center overflow-hidden">
        <img 
          src={images[selectedImage] || '/placeholder-tour.jpg'} 
          alt={tour.title}
          className="w-full h-full object-cover scale-105 transition-transform duration-[20s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Expedition Badge */}
        <div className="absolute top-8 left-8 z-20">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <Compass className="h-4 w-4" />
              <span>OMNI WELLNESS EXPEDITION</span>
            </div>
          </div>
        </div>

        {/* National Geographic style categorization */}
        <div className="absolute top-8 right-8 z-20 flex gap-2">
          <Badge className="bg-yellow-500/90 text-black border-0 font-bold">
            <Award className="h-3 w-3 mr-1" />
            EXCLUSIVE
          </Badge>
          <Button size="sm" variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-8 pb-16 z-10">
            <div className="max-w-4xl">
              {/* Journey Classification */}
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                  <Mountain className="h-3 w-3 mr-1" />
                  {tour.category?.name}
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  {tour.difficulty_level.toUpperCase()} DIFFICULTY
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                  <Globe className="h-3 w-3 mr-1" />
                  CULTURAL IMMERSION
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                {tour.title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
                {tour.subtitle}
              </p>

              {/* Expedition Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                  <Clock className="h-6 w-6 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">{tour.duration}</div>
                  <div className="text-white/70 text-sm">Duration</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                  <Users className="h-6 w-6 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">{tour.max_participants}</div>
                  <div className="text-white/70 text-sm">Max Guests</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                  <MapPin className="h-6 w-6 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Western Cape</div>
                  <div className="text-white/70 text-sm">Destination</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-white">$</span>
                  <div className="text-white font-semibold">{tour.price_from}</div>
                  <div className="text-white/70 text-sm">From</div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg">
                  Reserve Your Spot
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg">
                  <Camera className="h-5 w-5 mr-2" />
                  View Gallery
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  selectedImage === index 
                    ? 'bg-white border-white scale-110' 
                    : 'bg-transparent border-white/50 hover:border-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 text-white animate-bounce">
          <ChevronRight className="h-6 w-6 rotate-90" />
        </div>
      </section>

      {/* Tour Content Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tour.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{highlight}</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <TabsContent value="reviews" className="space-y-6">
                  {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonials.map((testimonial, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <Avatar>
                                <AvatarImage src={testimonial.image_url} />
                                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{testimonial.name}</h4>
                                {testimonial.title && (
                                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                )}
                              </div>
                              <div className="ml-auto flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm italic">
                              "{testimonial.testimonial_text}"
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                      </CardContent>
                    </Card>
                  )}
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