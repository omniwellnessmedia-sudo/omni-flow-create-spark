import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Users, Wifi, Globe, Signal, Heart, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/lib/images';

const roamPlans = [
  {
    id: 'sa',
    title: 'South Africa',
    emoji: '🇿🇦',
    data: '10GB',
    validity: '30 days',
    priceUSD: 15,
    priceZAR: 279,
    description: 'Perfect for retreats, safaris & local wellness journeys',
    popular: true,
  },
  {
    id: 'africa',
    title: 'Africa Explorer',
    emoji: '🌍',
    data: '20GB',
    validity: '60 days',
    priceUSD: 35,
    priceZAR: 649,
    description: 'Multi-country coverage for cross-continental adventures',
    popular: false,
  },
  {
    id: 'global',
    title: 'Global Zen',
    emoji: '✈️',
    data: 'Unlimited',
    validity: '90 days',
    priceUSD: 65,
    priceZAR: 1199,
    description: 'Worldwide connectivity for digital nomads & frequent travelers',
    popular: false,
  },
];

const featuredExperiences = [
  {
    title: 'Hoofbeats & Healing',
    subtitle: 'Cart Horse Urban Wellness Day',
    meta: 'Salt River / Woodstock · 9am–4pm · From R1,800',
    href: '/experiences/cart-horse-urban-wellness',
    image: IMAGES.services.humanAnimal1,
    badge: 'Bookable Day Experience',
    icon: Heart,
  },
  {
    title: 'Rewild Your Team',
    subtitle: 'Corporate Wellness Retreats',
    meta: 'Cape Town · 1–3 days · From R80,000',
    href: '/experiences/corporate-wellness-retreat',
    image: IMAGES.services.chief,
    badge: 'Corporate Impact Travel',
    icon: Building2,
  },
  {
    title: '4th Annual Omni Wellness Retreat',
    subtitle: 'Weekend sanctuary retreat',
    meta: 'Tufcat Sanctuary · 4 days / 3 nights · From R3,000',
    href: '/tour-detail/winter-wine-country-wellness',
    image: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/IMG_0052%20(1).jpg',
    badge: 'Weekend Retreats',
    icon: Users,
  },
];

const ToursRetreatsPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
            🧭 ROAM by Omni
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Stay Connected on Your Wellness Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Instant eSIM data — no physical SIM needed. Stay present, stay connected,
            wherever your journey takes you.
          </p>
        </div>

        {/* eSIM Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {roamPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`group relative hover:shadow-xl transition-all duration-300 overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6 flex flex-col h-full">
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">{plan.emoji}</span>
                  <h3 className="text-xl font-bold text-foreground">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Signal className="h-3.5 w-3.5" />
                    {plan.data}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {plan.validity}
                  </span>
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary">${plan.priceUSD}</div>
                  <div className="text-xs text-muted-foreground">≈ R{plan.priceZAR.toLocaleString()}</div>
                </div>

                <div className="mt-auto">
                  <Link to="/roambuddy-store">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90'
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Connected
                      <Wifi className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Experience Cards */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            🧘 Pair with a Wellness Experience
          </h3>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredExperiences.map((experience) => (
              <Card key={experience.href} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = IMAGES.wellness.retreat; }}
                  />
                </div>
                <CardContent className="p-5 flex flex-col gap-3">
                  <Badge variant="secondary" className="w-fit text-xs gap-1">
                    <experience.icon className="h-3 w-3" />
                    {experience.badge}
                  </Badge>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">{experience.title}</h4>
                    <p className="text-sm text-muted-foreground">{experience.subtitle}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{experience.meta}</p>
                  <Link to={experience.href} className="mt-auto">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/roambuddy-store">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
              Browse All eSIM Plans
              <Globe className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/tours-retreats">
            <Button variant="outline" size="lg">
              Explore Tours & Travel
              <MapPin className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToursRetreatsPreview;
