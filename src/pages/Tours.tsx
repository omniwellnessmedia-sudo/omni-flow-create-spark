import { useState, useEffect } from 'react';
import { trackAdsConversion } from '@/lib/googleAds';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MapPin, Clock, Star, Users, ExternalLink, Search,
  Mountain, Waves, Leaf, Camera, Heart, Filter, Globe, Building2, ArrowRight, Compass,
  Grape, Anchor, Landmark, Smile
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useConsciousAffiliate } from '@/hooks/useConsciousAffiliate';
import { useSavedTours } from '@/hooks/useSavedTours';
import { toast } from 'sonner';
import { FloatingDecorations } from '@/components/ui/gaia-elements';
import { CuratorTip } from '@/components/curator/CuratorTip';
import { omniVoice } from '@/data/omniVoiceGuide';
import { IMAGES, applyImageFallback } from '@/lib/images';
import { classifyTour, TOUR_CATEGORIES, type TourCategory } from '@/lib/tourCategories';
import { useSEO } from '@/lib/seo';
import { withViatorAttribution } from '@/config/programmes';
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";

interface ViatorTour {
  id: string;
  viator_product_code: string;
  title: string;
  description: string;
  location: string;
  price_from: number;
  currency: string;
  duration: any;
  rating: number;
  review_count: number;
  image_url: string;
  booking_url: string;
  category: string;
  is_active: boolean;
}

const categoryIcons: Record<TourCategory, any> = {
  'Cape Winelands': Grape,
  'Ocean Adventures': Waves,
  'Boat Experiences': Anchor,
  'Indigenous Heritage': Landmark,
  'Wellness & Retreats': Heart,
  'Hiking & Nature': Mountain,
  'Family-Friendly': Smile,
};

const featuredExperiences = [
  {
    title: 'Hoofbeats & Healing',
    description: 'A full-day equine-assisted urban wellness experience supporting Cart Horse Protection Association and impact partners.',
    meta: 'Cape Town · 9am–4pm · R1,800pp',
    href: '/experiences/cart-horse-urban-wellness',
    image: IMAGES.services.humanAnimal1,
    icon: Heart,
    badge: 'Bookable Day Experience',
  },
  {
    title: 'Rewild Your Team',
    description: 'Bespoke corporate wellness retreats combining equine connection, indigenous heritage and measurable CSI/ESG impact.',
    meta: 'Cape Town · 1–3 days · From R80,000',
    href: '/experiences/corporate-wellness-retreat',
    image: IMAGES.services.chief,
    icon: Building2,
    badge: 'Corporate Wellness',
  },
];

/**
 * Tours we run ourselves, each with a real page on this site. Shown when the
 * partner feed returns nothing, so an empty feed never leaves the page with
 * nothing to offer. Titles match the pages they link to.
 */
const OWN_TOURS = [
  {
    href: '/tours/great-mother-cave-tour',
    title: 'The Great Mother Cave Tour',
    blurb: 'A sacred indigenous experience in Fish Hoek, led by Chief Kingsley.',
  },
  {
    href: '/tours/muizenberg-cave-tours',
    title: 'Muizenberg Living Heritage Walk',
    blurb: 'Ancient history by the sea, on foot.',
  },
  {
    href: '/tours/kalk-bay-tour',
    title: 'Kalk Bay Rich Tapestry Walk',
    blurb: 'Ancient whispers and healing herbs along the harbour.',
  },
];

const formatDuration = (duration: any): string => {
  if (!duration) return 'Varies';
  if (typeof duration === 'string') {
    try {
      const parsed = JSON.parse(duration);
      if (parsed.fixedDurationInMinutes) {
        const hours = Math.floor(parsed.fixedDurationInMinutes / 60);
        const mins = parsed.fixedDurationInMinutes % 60;
        return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;
      }
      if (parsed.variableDurationFromMinutes && parsed.variableDurationToMinutes) {
        const fromHours = Math.floor(parsed.variableDurationFromMinutes / 60);
        const toHours = Math.floor(parsed.variableDurationToMinutes / 60);
        return `${fromHours}-${toHours} hours`;
      }
    } catch {
      return duration;
    }
  }
  if (typeof duration === 'object') {
    if (duration.fixedDurationInMinutes) {
      const hours = Math.floor(duration.fixedDurationInMinutes / 60);
      return `${hours} hours`;
    }
    if (duration.variableDurationFromMinutes) {
      const fromHours = Math.floor(duration.variableDurationFromMinutes / 60);
      const toHours = Math.floor(duration.variableDurationToMinutes / 60);
      return `${fromHours}-${toHours} hours`;
    }
  }
  return 'Varies';
};

export default function Tours() {
  const navigate = useNavigate();
  const { toggleSaved, isSaved } = useSavedTours();
  const [tours, setTours] = useState<ViatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();

  // Without this the page inherited the site wide title, so every tours
  // result in search and every shared link read "Conscious Content Creation
  // and Business Development", which tells a traveller nothing.
  useSEO({
    title: 'Tours and Experiences in Cape Town | Omni Wellness Media',
    description:
      'Guided cave, heritage and ocean experiences around Cape Town, plus wellness day experiences and corporate retreats booked directly with us.',
    canonical: 'https://omniwellnessmedia.co.za/tours',
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('viator_tours')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations. Categories are derived, not read from tour.category:
  // the Viator sync only ever sets that field to "Tour"/"Tours", which isn't a
  // usable taxonomy — classifyTour buckets each tour into a real experience
  // type from its title/description instead. Ordered per the canonical list so
  // the chip strip and dropdown are stable rather than "whatever order showed up".
  const locations = [...new Set(tours.map(t => t.location).filter(Boolean))];
  const presentCategories = new Set(tours.map(t => classifyTour(t)));
  const categories = TOUR_CATEGORIES.filter(c => presentCategories.has(c));

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = !searchQuery ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = selectedLocation === 'all' || tour.location === selectedLocation;
    const matchesCategory = selectedCategory === 'all' || classifyTour(tour) === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'budget') matchesPrice = tour.price_from < 100;
    else if (priceRange === 'mid') matchesPrice = tour.price_from >= 100 && tour.price_from < 300;
    else if (priceRange === 'premium') matchesPrice = tour.price_from >= 300;

    return matchesSearch && matchesLocation && matchesCategory && matchesPrice;
  });

  const handleTourClick = async (tour: ViatorTour) => {
    // booking_url comes from the Viator product sync, not from our partner
    // link builder, so it carries no pid or mcid of ours. Opening it directly
    // meant every click from this page was unattributable and unpaid. See
    // src/config/programmes.ts.
    const destination = withViatorAttribution(tour.booking_url, 'tours-page');

    await trackAffiliateClick(
      tour.title,
      'viator_tours_page',
      destination,
      'tour_booking',
      tour.category,
      'viator'
    );

    trackAdsConversion('marketplace_clickthrough', { value: tour.price_from || 0, currency: tour.currency || 'USD' });

    window.open(destination, '_blank', 'noopener,noreferrer');
  };

  const TourCard = ({ tour }: { tour: ViatorTour }) => {
    const tourCategory = classifyTour(tour);
    const IconComponent = categoryIcons[tourCategory] || Mountain;
    
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer motion-safe:hover:-translate-y-1"
            onClick={() => handleTourClick(tour)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={tour.image_url || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80'}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              applyImageFallback(e, 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80');
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary/90 text-primary-foreground">
              <IconComponent className="w-3 h-3 mr-1" />
              {tourCategory}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-background/90">
              <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
              {tour.rating?.toFixed(1) || 'New'}
              {tour.review_count > 0 && (
                <span className="ml-1 text-muted-foreground">({tour.review_count})</span>
              )}
            </Badge>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleSaved(tour.id); }}
              aria-label={isSaved(tour.id) ? "Remove from favorites" : "Save to favorites"}
              className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:scale-110 hover:bg-background transition-all"
            >
              <Heart className={`h-4 w-4 transition-colors ${isSaved(tour.id) ? "fill-rose-500 text-rose-500" : "text-foreground/70"}`} />
            </button>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {tour.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              {tour.location}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tour.description?.slice(0, 150)}...
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(tour.duration)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">From</div>
              <div className="font-bold text-lg text-primary">
                ${tour.price_from?.toFixed(0) || '—'}
              </div>
            </div>
          </div>
          
          <Button className="w-full group-hover:bg-primary/90" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View & Book on Viator
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <FloatingDecorations variant="hero" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* The supplier is a fact about how booking works, not the
                headline. It used to be the first thing on the page, above our
                own name for what we offer. It now sits under the intro, where
                a traveller reads it as reassurance rather than as the pitch. */}
            <p
              className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-[#2BB9B9]" />
              Tours and Experiences
            </p>
            <h1 className="mt-3 font-wwpl-display text-4xl font-medium md:text-5xl">
              {omniVoice.pageIntros.tours.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-[60ch] text-lg text-muted-foreground">
              {omniVoice.pageIntros.tours.subheadline}
            </p>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Partner experiences are booked through Viator
            </p>
            
            {/* Curator Welcome */}
            <div className="max-w-xl mx-auto mb-8">
              <CuratorTip 
                curator="zenith" 
                message={omniVoice.curatorVoices.zenith.intro}
                variant="inline"
              />
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search tours, destinations, experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8 md:py-12 bg-background relative overflow-hidden">
        <FloatingDecorations variant="subtle" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <Badge variant="secondary" className="mb-2">Omni Featured Experiences</Badge>
                <h2 className="text-2xl md:text-3xl font-bold">Book directly with our impact partners</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredExperiences.map((experience) => (
                <Card key={experience.href} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="grid sm:grid-cols-[0.42fr_0.58fr] h-full">
                    <div className="aspect-[4/3] sm:aspect-auto overflow-hidden bg-muted">
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { applyImageFallback(e, IMAGES.wellness.retreat); }}
                      />
                    </div>
                    <CardContent className="p-5 flex flex-col gap-3">
                      <Badge variant="outline" className="w-fit gap-1">
                        <experience.icon className="h-3.5 w-3.5" />
                        {experience.badge}
                      </Badge>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{experience.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{experience.description}</p>
                      </div>
                      <p className="text-sm font-medium text-primary">{experience.meta}</p>
                      <Button className="mt-auto w-fit" variant="outline" onClick={() => navigate(experience.href)}>
                        View Experience <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Explore by category — visual chip strip above the dropdowns.
              Replaces the "pick a category from a dropdown buried in filters" flow with
              browsable, iconic cards that double as the active-state for selectedCategory. */}
          {categories.length > 0 && (
            <div className="mb-8">
              <h3 className="font-heading text-2xl mb-1">Explore by category</h3>
              <p className="text-sm text-muted-foreground mb-5">Pick a vibe — we'll narrow it down for you.</p>
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`shrink-0 snap-start flex flex-col items-center justify-center gap-2 w-28 h-28 rounded-2xl border transition-all ${
                    selectedCategory === 'all'
                      ? 'border-primary bg-primary/5 soft-shadow'
                      : 'border-border/60 hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <Compass className={`h-6 w-6 ${selectedCategory === 'all' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">All</span>
                </button>
                {categories.map(cat => {
                  const Icon = categoryIcons[cat] || Mountain;
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 snap-start flex flex-col items-center justify-center gap-2 w-28 h-28 rounded-2xl border transition-all ${
                        active
                          ? 'border-primary bg-primary/5 soft-shadow'
                          : 'border-border/60 hover:border-primary/40 hover:bg-muted/40'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-xs font-medium text-center leading-tight px-1">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filters. Hidden when there is nothing to filter: a row of empty
              dropdowns above the words "0 tours available" reads as a broken
              page rather than as an empty one. */}
          {!(!loading && tours.length === 0) && (
          <div className="flex flex-wrap gap-3 mb-8 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Under $100</SelectItem>
                <SelectItem value="mid">$100 - $300</SelectItem>
                <SelectItem value="premium">$300+</SelectItem>
              </SelectContent>
            </Select>

            {(selectedLocation !== 'all' || selectedCategory !== 'all' || priceRange !== 'all' || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedLocation('all');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSearchQuery('');
                }}
              >
                Clear All
              </Button>
            )}
          </div>
          )}

          {/* Results Count. "0 tours available" is not worth a line of its
              own: the empty state below already says what is going on. */}
          {!(!loading && tours.length === 0) && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loading
                  ? 'Loading...'
                  : `${filteredTours.length} ${filteredTours.length === 1 ? 'tour' : 'tours'} available`}
              </p>
            </div>
          )}

          {/* Tours Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTours.length === 0 ? (
            /* When the partner feed returns nothing, the page used to say
               "Tours are being synced, please check back soon" and stop. That
               asks a visitor to come back later on a page where we already
               have things they can book today. Our own tours are listed
               instead. The filter case is different and still says so. */
            tours.length === 0 ? (
              <div className="py-12">
                <div className="mx-auto max-w-2xl text-center">
                  <h3 className="font-wwpl-display text-2xl font-medium">
                    Our own tours are running
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Partner listings are not loading at the moment. These are ours, and
                    you can book them directly with us.
                  </p>
                </div>
                <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
                  {OWN_TOURS.map((t) => (
                    <Card
                      key={t.href}
                      className="cursor-pointer transition-colors hover:border-foreground/20"
                      onClick={() => navigate(t.href)}
                    >
                      <CardContent className="py-5">
                        <p className="text-[15px] font-medium">{t.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                          See the tour
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Mountain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">Nothing matches that</h3>
                <p className="text-muted-foreground mb-6">
                  Try a different search, or clear the filters to see everything.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLocation('all');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5 relative overflow-hidden">
        <FloatingDecorations variant="section" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <CuratorTip 
            curator="zenith" 
            message="Looking for something more personal? Let's create your perfect itinerary together."
            variant="card"
            className="max-w-xl mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold mb-4">Looking for Custom Experiences?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {omniVoice.reassurance.everyStep}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/contact')}>
              {omniVoice.ctas.contact}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/tours-retreats')}>
              View Omni Retreats
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <AffiliateDisclosure variant="panel" />
      </div>
      <Footer />
    </>
  );
}
