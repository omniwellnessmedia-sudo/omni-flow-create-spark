import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock, Star, Check, ChevronRight, Heart, Share2 } from 'lucide-react';
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
      {/* Tour Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden">
        <img 
          src={images[selectedImage] || '/placeholder-tour.jpg'} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-3xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tour.category?.name}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tour.difficulty_level}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{tour.title}</h1>
              <p className="text-xl mb-6">{tour.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {tour.duration}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Users className="inline h-4 w-4 mr-1" />
                  Max {tour.max_participants} participants
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {tour.destination}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                  From ${tour.price_from}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm">
            <Share2 className="h-4 w-4" />
          </Button>
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