import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/lib/images';

const ToursRetreatsPreview = () => {
  const featuredTours = [{
    id: '1',
    title: '4th Annual Omni Wellness Retreat',
    subtitle: 'Rejuvenate and Renew in the Serene Greyton Eco Lodge',
    duration: '4 days / 3 nights',
    maxParticipants: 30,
    priceFrom: 3000,
    destination: 'Greyton Eco Lodge, Greyton, South Africa',
    category: 'Weekend Retreats',
    slug: 'winter-wine-country-wellness',
    categorySlug: 'weekend-retreats',
    image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/IMG_0052%20(1).jpg',
    highlights: ['Daily yoga sessions', 'NIA Dance Immersion', 'Traditional braai & live music']
  }];
  return <div className="py-16">
      <div className="text-center mb-12" data-tour="tours">
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
        {featuredTours.map(tour => <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden rounded-t-lg h-64">
              <img 
                src={tour.image} 
                alt={tour.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-primary">
                  {tour.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  From R{tour.priceFrom.toLocaleString()}
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

              {tour.highlights && <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {tour.highlights.slice(0, 2).map((highlight, index) => <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>)}
                    {tour.highlights.length > 2 && <Badge variant="outline" className="text-xs">
                        +{tour.highlights.length - 2} more
                      </Badge>}
                  </div>
                </div>}

              <Link to="/tour-detail/winter-wine-country-wellness">
                <Button className="w-full group-hover:bg-primary/90">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>)}
      </div>

      {/* Quick Links to Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{
        name: 'Indigenous Wisdom & Healing',
        slug: 'indigenous-wisdom',
        icon: '🌿'
      }, {
        name: 'Wellness Retreats',
        slug: 'wellness-retreats',
        icon: '🧘'
      }, {
        name: 'Study Abroad',
        slug: 'study-abroad',
        icon: '📚'
      }, {
        name: 'Winter Wellness',
        slug: 'winter-wellness',
        icon: '❄️'
      }].map(category => <Link 
            key={category.slug} 
            to={`/tours-retreats/${category.slug}`}
            aria-label={`Explore ${category.name}`}
          >
            <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full group border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-sm text-foreground mb-2">{category.name}</h4>
                <div className="flex items-center justify-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>)}
      </div>
    </div>;
};
export default ToursRetreatsPreview;