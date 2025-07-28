import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Star, Clock, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/ui/price-display';
import { ImagePreloader } from '@/components/ui/image-preloader';
import { supabase } from '@/integrations/supabase/client';

// Category images from uploads
const indigenousWisdomImg = '/lovable-uploads/indigenous-wisdom-category.jpg';
const wellnessRetreatsImg = '/lovable-uploads/wellness-retreats-category.jpg';
const consciousLivingImg = '/lovable-uploads/conscious-living-category.jpg';
const studyAbroadImg = '/lovable-uploads/study-abroad-category.jpg';

// Generated wellness journey images
import consciousConnectionsMeditation from '@/assets/conscious-connections-meditation.jpg';
import ubuntuHealingCircle from '@/assets/ubuntu-healing-circle.jpg';
import mountainWellnessRetreat from '@/assets/mountain-wellness-retreat.jpg';
import indigenousHealingCeremony from '@/assets/indigenous-healing-ceremony.jpg';
import sustainableLivingCommunity from '@/assets/sustainable-living-community.jpg';
import serviceLearningStudents from '@/assets/service-learning-students.jpg';

interface TourCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

interface Tour {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  max_participants: number;
  price_from: number;
  destination: string;
  hero_image_url: string;
  difficulty_level: string;
  featured: boolean;
  category: TourCategory;
}

const ToursRetreats = () => {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('tour_categories')
        .select('*')
        .eq('active', true)
        .order('display_order');

      // Fetch featured tours
      const { data: toursData } = await supabase
        .from('tours')
        .select(`
          *,
          category:tour_categories(*)
        `)
        .eq('active', true)
        .eq('featured', true)
        .limit(6);

      setCategories(categoriesData || []);
      setFeaturedTours(toursData || []);
    } catch (error) {
      console.error('Error fetching tours data:', error);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Preload critical images */}
      <ImagePreloader images={[
        '/lovable-uploads/omni-wellness-hero.jpg',
        '/lovable-uploads/wellness-humans.png',
        '/lovable-uploads/conscious-connections-hero.jpg',
        '/lovable-uploads/fact-wellness-hero.jpg',
        '/lovable-uploads/service-learning-hero.jpg',
        ...featuredTours.map(tour => tour.hero_image_url).filter(Boolean),
        ...categories.map(cat => cat.image_url).filter(Boolean)
      ]} />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Transformative Wellness Journeys
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
            Discover conscious travel experiences that heal, inspire, and connect you 
            with ancient wisdom and modern wellness practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              Explore Our Journeys
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Tour Categories Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Journey Categories
          </h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {categories.map(category => (
                <TourCategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <PlaceholderCategoryCard 
                title="Indigenous Wisdom"
                description="Connect with ancient healing traditions and indigenous knowledge systems"
                slug="indigenous-wisdom"
                image={indigenousWisdomImg}
              />
              <PlaceholderCategoryCard 
                title="Wellness Retreats"
                description="Transformative wellness journeys combining modern and traditional healing"
                slug="wellness-retreats"
                image={wellnessRetreatsImg}
              />
              <PlaceholderCategoryCard 
                title="Conscious Living"
                description="Immersive experiences in sustainable and mindful living practices"
                slug="conscious-living"
                image={consciousLivingImg}
              />
              <PlaceholderCategoryCard 
                title="Study Abroad"
                description="Educational service-learning programs in Cape Town"
                slug="study-abroad"
                image={studyAbroadImg}
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Featured Experiences
          </h2>
          {featuredTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredTours.map(tour => (
                <FeaturedTourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <PlaceholderTourCard 
                title="Conscious Connections: Indigenous Wisdom + Healing"
                duration="8 days / 7 nights"
                priceFrom={3999}
                destination="Cape Town, South Africa"
                category="Indigenous Wisdom"
                image={consciousConnectionsMeditation}
              />
              <PlaceholderTourCard 
                title="FACT Wellness Hybrid Experience"
                duration="3-7 days"
                priceFrom={1299}
                destination="Muizenberg, Cape Town"
                category="Wellness Programs"
                image={mountainWellnessRetreat}
              />
              <PlaceholderTourCard 
                title="Ubuntu Immersion Journey"
                duration="10 days"
                priceFrom={4599}
                destination="Eastern Cape, South Africa"
                category="Indigenous Wisdom"
                image={ubuntuHealingCircle}
              />
              <PlaceholderTourCard 
                title="Sustainable Living Immersion"
                duration="5 days"
                priceFrom={1899}
                destination="Cape Town, South Africa"
                category="Conscious Living"
                image={sustainableLivingCommunity}
              />
              <PlaceholderTourCard 
                title="Indigenous Healing Traditions"
                duration="7 days"
                priceFrom={2799}
                destination="Eastern Cape, South Africa"
                category="Indigenous Wisdom"
                image={indigenousHealingCeremony}
              />
              <PlaceholderTourCard 
                title="Service Learning Adventure"
                duration="14 days"
                priceFrom={3299}
                destination="Cape Town, South Africa"
                category="Study Abroad"
                image={serviceLearningStudents}
              />
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with our wellness travel specialists to design your perfect transformative experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg">
              View All Tours
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const TourCategoryCard = ({ category }: { category: TourCategory }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 border-border">
    <div className="relative overflow-hidden rounded-t-lg h-48 sm:h-64">
      <img 
        src={category.image_url || '/lovable-uploads/omni-wellness-hero.jpg'} 
        alt={category.name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        loading="eager"
        onError={(e) => {
          e.currentTarget.src = '/lovable-uploads/omni-wellness-hero.jpg';
        }}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
      <p className="text-muted-foreground mb-4">{category.description}</p>
      <Link to={`/tour-category/${category.slug}`}>
        <Button variant="outline" className="w-full">
          Explore Category
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const PlaceholderCategoryCard = ({ title, description, slug, image }: { title: string; description: string; slug: string; image: string }) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <div className="relative overflow-hidden rounded-t-lg h-48 sm:h-64">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Link to={`/tour-category/${slug}`}>
        <Button variant="outline" className="w-full">
          Explore Category
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const FeaturedTourCard = ({ tour }: { tour: Tour }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 border-border">
    <div className="relative overflow-hidden rounded-t-lg h-64 sm:h-72">
      <img 
        src={tour.hero_image_url || '/lovable-uploads/conscious-connections-hero.jpg'} 
        alt={tour.title}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        loading="eager"
        onError={(e) => {
          e.currentTarget.src = '/lovable-uploads/conscious-connections-hero.jpg';
        }}
      />
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-background/90">
          {tour.category?.name || 'Featured'}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <PriceDisplay 
          price={tour.price_from} 
          primaryCurrency="USD"
          showBothCurrencies={false}
          className="bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold"
        />
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
          Max {tour.max_participants}
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {tour.destination}
        </div>
      </div>

      <Link to={`/tour-category/${tour.category?.slug || 'tours'}/${tour.slug}`}>
        <Button className="w-full">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const PlaceholderTourCard = ({ title, duration, priceFrom, destination, category, image }: {
  title: string;
  duration: string;
  priceFrom: number;
  destination: string;
  category: string;
  image?: string;
}) => (
  <Card className="group hover:shadow-xl transition-all duration-300">
    <div className="relative overflow-hidden rounded-t-lg h-64 sm:h-72">
      {image ? (
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-background/90">
          {category}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <PriceDisplay 
          price={priceFrom} 
          primaryCurrency="USD"
          showBothCurrencies={false}
          className="bg-primary/90 text-white px-2 py-1 rounded text-xs font-semibold"
        />
      </div>
    </div>
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">An transformative journey awaits you.</p>
      
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {duration}
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          Max 12
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {destination}
        </div>
      </div>

      <Button className="w-full">
        View Details
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

export default ToursRetreats;