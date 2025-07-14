import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ToursRetreatsPreview = () => {
  const featuredTours = [
    {
      id: '1',
      title: 'Conscious Connections: Indigenous Wisdom + Healing',
      subtitle: 'Ancient traditions for personal transformation',
      duration: '8 days / 7 nights',
      maxParticipants: 12,
      priceFrom: 3999,
      destination: 'Cape Town, South Africa',
      category: 'Indigenous Wisdom',
      slug: 'conscious-connections-indigenous-wisdom-healing',
      categorySlug: 'indigenous-wisdom',
      image: '/placeholder-tour-1.jpg',
      highlights: ['Traditional healing workshops', 'Sacred site visits', 'Plant medicine introduction']
    },
    {
      id: '2',
      title: 'FACT Wellness Hybrid Experience',
      subtitle: 'Innovative blend of in-person and virtual wellness',
      duration: '3-7 days',
      maxParticipants: 16,
      priceFrom: 1299,
      destination: 'Muizenberg, Cape Town',
      category: 'Wellness Programs',
      slug: 'fact-wellness-hybrid-retreat',
      categorySlug: 'wellness-programs',
      image: '/placeholder-tour-2.jpg',
      highlights: ['Hybrid experiences', 'Mindfulness practices', 'Ocean-based wellness']
    },
    {
      id: '3',
      title: 'Ubuntu Immersion Journey',
      subtitle: 'Deep cultural immersion in African philosophy',
      duration: '10 days',
      maxParticipants: 8,
      priceFrom: 4599,
      destination: 'Eastern Cape, South Africa',
      category: 'Indigenous Wisdom',
      slug: 'ubuntu-immersion-journey',
      categorySlug: 'indigenous-wisdom',
      image: '/placeholder-tour-3.jpg',
      highlights: ['Ubuntu philosophy', 'Community projects', 'Traditional ceremonies']
    }
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Transformative Wellness Journeys
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover conscious travel experiences that heal, inspire, and connect you 
          with ancient wisdom and modern wellness practices around the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/tours-retreats">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
              Explore All Tours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/wellness-roaming-packages">
            <Button variant="outline" size="lg">
              Travel Services
              <MapPin className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {featuredTours.map(tour => (
          <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-lg h-64">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="h-10 w-10 text-primary" />
                  </div>
                  <Badge variant="secondary">{tour.category}</Badge>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  From ${tour.priceFrom.toLocaleString()}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">{tour.title}</h3>
              <p className="text-muted-foreground mb-4">{tour.subtitle}</p>
              
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {tour.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Max {tour.maxParticipants}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tour.destination}
                </div>
              </div>

              {tour.highlights && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {tour.highlights.slice(0, 2).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {tour.highlights.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tour.highlights.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Link to={`/tours-retreats/${tour.categorySlug}/${tour.slug}`}>
                <Button className="w-full group-hover:bg-primary/90">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links to Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Indigenous Wisdom & Healing', slug: 'indigenous-wisdom', icon: '🌿' },
          { name: 'Wellness & Mindfulness', slug: 'wellness-programs', icon: '🧘' },
          { name: 'Educational Programs', slug: 'educational', icon: '📚' },
          { name: 'Custom Retreats', slug: 'custom', icon: '✨' }
        ].map(category => (
          <Link key={category.slug} to={`/tours-retreats/${category.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-sm text-foreground">{category.name}</h4>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToursRetreatsPreview;