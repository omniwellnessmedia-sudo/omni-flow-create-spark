import { useState } from "react";
import { Link } from "react-router-dom";
import { TourTrigger } from "@/components/ui/app-tour";
import { useAppTour } from "@/hooks/useAppTour";
import AppTour from "@/components/ui/app-tour";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGES, getOmniLogo, getImageWithFallback } from "@/lib/images";
import { CommunityCard } from "@/components/community/CommunityCard";
import { FloatingDecorations } from "@/components/ui/gaia-elements";
import { CuratorTip } from "@/components/curator/CuratorTip";
import { omniVoice } from "@/data/omniVoiceGuide";

import { 
  Sparkles, 
  Briefcase, 
  Video, 
  Users, 
  Bot, 
  MapPin,
  Headphones,
  BookOpen,
  Heart,
  Zap,
  Globe
} from "lucide-react";

// Supabase storage helper for community images
const SUPABASE_URL = "https://dtjmhieeywdvhjxqyxad.supabase.co";
const getStorageUrl = (filename: string) => 
  `${SUPABASE_URL}/storage/v1/object/public/provider-images/General%20Images/${encodeURIComponent(filename)}`;

const HeroSection = () => {
  const { isOpen, hasSeenTour, steps, startTour, completeTour, skipTour } = useAppTour();

  // Helper function to get unique images based on category using centralized system
  const getImageForCategory = (category: string) => {
    const imageMap = {
      'business': IMAGES.services.team,
      'media': IMAGES.services.artscape,
      'ai-tools': IMAGES.services.humanAnimal1,
      'wellness': IMAGES.community.empowerment,
      'tours': IMAGES.locations.view1,
      'inspiration': IMAGES.services.retreat5,
      'podcast': IMAGES.services.muizKitchen,
      'community': IMAGES.community.khoe6,
    };
    return imageMap[category as keyof typeof imageMap] || IMAGES.wellness.deals;
  };

  const [showMoreCommunity, setShowMoreCommunity] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Popular');

  const workspaceItems = [
    {
      title: "Business Strategy",
      description: "Strategic consulting for conscious growth",
      href: "/business-consulting",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg",
      badge: "Consulting"
    },
    {
      title: "Content Creation",
      description: "Video, podcast & social media production", 
      href: "/media-production",
      image: IMAGES.services.artscape,
      badge: "Media"
    },
    {
      title: "Indigenous Wisdom Tours",
      description: "Ancient healing practices & cultural experiences",
      href: "/tours/great-mother-cave-tour",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg",
      badge: "Cultural"
    },
    {
      title: "ROAM eSIM Store",
      description: "Stay connected while you travel",
      href: "/roambuddy-store",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg",
      badge: "Travel"
    }
  ];

  const communityItems = [
    {
      title: "Chief Kingsley's Wisdom",
      description: "Indigenous knowledge & cultural heritage tours",
      href: "/tours/great-mother-cave-tour#chief-kingsley",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/chief%20kingsley%201.jpg",
      category: "tours",
      author: "Cultural Experience",
      badge: "Travel",
      orientation: "portrait",
      tags: ["Popular", "Discover", "Personal"]
    },
    {
      title: "Wellness Group Tours",
      description: "Transformative group experiences in nature",
      href: "/tours/great-mother-cave-tour",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/tour%20picture%20couple%20with%20chief%20kingsley.jpg",
      category: "tours",
      author: "Adventures",
      badge: "Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Sacred Cave Explorations",
      description: "Ancient sites for deep spiritual practice",
      href: "/tours/great-mother-cave-tour",
      image: getStorageUrl("group tour amazing cave view.jpg"),
      category: "wellness",
      author: "Experiences",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Wellness", "Discover", "Personal"]
    },
    {
      title: "Indigenous Teachings",
      description: "Learn from Chief Kingsley's ancestral wisdom",
      href: "/tours/great-mother-cave-tour",
      image: getStorageUrl("chief kingsley talking to group.jpg"),
      category: "community",
      author: "Cultural Learning",
      badge: "Community",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Community Wellness Outings",
      description: "Building connections through shared experiences",
      href: "/about",
      image: getStorageUrl("community outing 1.jpg"),
      category: "wellness",
      author: "Community",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Popular", "Personal", "Wellness"]
    },
    {
      title: "Conscious Meditation",
      description: "Guided practices with experienced facilitators",
      href: "/about",
      image: getStorageUrl("Chad Amazing portrait.jpg"),
      category: "wellness",
      author: "Practices",
      badge: "Wellness",
      orientation: "portrait",
      tags: ["Popular", "Wellness", "Personal"]
    },
    {
      title: "Ancient Rock Art Tours",
      description: "Discover South Africa's indigenous heritage",
      href: "/tours/great-mother-cave-tour",
      image: getStorageUrl("Rock art portrait.jpg"),
      category: "tours",
      author: "Heritage",
      badge: "Travel",
      orientation: "portrait",
      tags: ["Discover", "Personal", "Wellness"]
    },
    {
      title: "Muizenberg Cave Views",
      description: "Breathtaking natural formations & meditation spots",
      href: "/tours/muizenberg-cave-tours",
      image: getStorageUrl("muizenberg cave view.jpg"),
      category: "tours",
      author: "Nature",
      badge: "Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Happy Tour Experiences",
      description: "Joyful moments with our wellness community",
      href: "/tours-retreats",
      image: getStorageUrl("happy client on tour.jpg"),
      category: "community",
      author: "Testimonials",
      badge: "Community",
      orientation: "landscape",
      tags: ["Popular", "Personal", "Wellness"]
    },
    {
      title: "Wellness Retreat Gatherings",
      description: "Transformative multi-day wellness experiences",
      href: "/tours-retreats",
      image: getStorageUrl("Wellness retreat.JPG"),
      category: "wellness",
      author: "Retreats",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Wellness", "Discover", "Personal"]
    },
    {
      title: "Team Zenith Adventures",
      description: "Behind the scenes with our wellness guides",
      href: "/blog",
      image: getStorageUrl("Zenith_TNT_OMNI-9.jpg"),
      category: "community",
      author: "Team",
      badge: "Community",
      orientation: "landscape",
      tags: ["Personal", "Wellness"]
    },
    {
      title: "Couples Wellness Journey",
      description: "Shared transformation & bonding experiences",
      href: "/tours-retreats",
      image: getStorageUrl("tour picture couple with chief kingsley.jpg"),
      category: "wellness",
      author: "Experiences",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Popular", "Personal", "Discover"]
    }
  ];

  return (
    <>
      {/* Stunning Hero Section with Cave View - WCAG 2.2 Compliant + Gaia Magic */}
      <section 
        aria-labelledby="hero-heading"
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Enhanced Contrast Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/muizenberg%20cave%20view%202.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => { e.currentTarget.src = IMAGES.locations.view1; }}
          />
          {/* WCAG 1.4.3 Contrast - Enhanced overlay for 4.5:1 ratio */}
          <div className="absolute inset-0 bg-contrast-overlay" aria-hidden="true"></div>
        </div>

        {/* Gaia Magic - Floating Decorative Orbs (desktop only) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl motion-safe:animate-pulse-slow" />
          <div className="absolute top-40 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-secondary/15 to-transparent blur-3xl motion-safe:animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl motion-safe:animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl motion-safe:animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Logo with Breathing Animation */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
            <div className="relative motion-safe:animate-breathing-slow">
              <img 
                src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png"
                alt="Omni Wellness Media logo"
                className="h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44 object-contain drop-shadow-2xl rounded-full bg-white/90 p-3"
                loading="eager"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 motion-safe:animate-glow-pulse blur-md -z-10" aria-hidden="true"></div>
            </div>
          </div>
          
          {/* Main Headline - Guided, Welcoming Tone */}
          <h1 
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white hero-text-shadow animate-fade-in-up leading-tight"
          >
            {omniVoice.pageIntros.home.headline}
          </h1>
          
          {/* Subheadline - Conversational, Guided */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 sm:mb-12 max-w-4xl mx-auto hero-text-shadow animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            {omniVoice.pageIntros.home.subheadline}
          </p>

          {/* CTA Buttons - Updated with guided copy */}
          <nav 
            aria-label="Primary actions"
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up" 
            style={{ animationDelay: '0.4s' }}
          >
            <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl min-w-[200px] motion-safe:hover:scale-105 transition-transform">
              <a href="/#curated-services" onClick={(e) => { e.preventDefault(); document.getElementById('curated-services')?.scrollIntoView({ behavior: 'smooth' }); }}>{omniVoice.ctas.seeMore}</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold bg-white/90 hover:bg-white text-primary border-2 border-white shadow-2xl min-w-[200px] motion-safe:hover:scale-105 transition-transform">
              <Link to="/tours-retreats">{omniVoice.ctas.discover}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold bg-white/90 hover:bg-white text-primary border-2 border-white shadow-2xl min-w-[200px] motion-safe:hover:scale-105 transition-transform">
              <Link to="/roambuddy-store">Travel Store</Link>
            </Button>
          </nav>

          {/* Reassurance Badge */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm">
              <Heart className="w-4 h-4" />
              {omniVoice.reassurance.gotYourBack}
            </span>
          </div>
        </div>

      </section>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-background to-muted/30 relative">
        {/* Subtle Gaia floating elements */}
        <FloatingDecorations variant="subtle" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">

          {/* Curator Welcome Strip */}
          <div className="mb-8">
            <CuratorTip 
              curator="chad" 
              message={omniVoice.sectionIntros.services}
              variant="banner"
            />
          </div>

          {/* Workspace Section */}
          <div id="curated-services" className="mb-8 sm:mb-16">
            <div className="bg-card rounded-xl shadow-sm border border-border/50 p-4 sm:p-6 motion-safe:animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {omniVoice.transitions.curated}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <select className="border border-border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-background">
                    <option>Last edited</option>
                  </select>
                  <select className="border border-border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-background">
                    <option>Newest first</option>
                  </select>
                  <select className="border border-border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm bg-background">
                    <option>All services</option>
                  </select>
                  <Link to="/services">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">{omniVoice.ctas.explore}</Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {workspaceItems.map((item, index) => (
                  <Link key={index} to={item.href} className="group">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 motion-safe:hover:scale-[1.02] border-border/50">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          onError={(e) => { e.currentTarget.src = IMAGES.wellness.retreat; }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shadow-sm">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Community Section */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-foreground">{omniVoice.sectionIntros.community}</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex gap-2 text-sm overflow-x-auto pb-2 sm:pb-0">
                  {['Popular', 'Discover', 'Wellness', 'Personal'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                        activeFilter === filter 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <Link to="/wellness-community" className="shrink-0">
                  <Button variant="ghost" size="sm">{omniVoice.ctas.explore}</Button>
                </Link>
              </div>
            </div>

            {/* Masonry grid layout - alternating portrait and landscape */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityItems
                .filter(item => item.tags?.includes(activeFilter))
                .slice(0, showMoreCommunity ? 99 : 6)
                .map((item, index) => (
                  <div key={index}>
                    <CommunityCard 
                      item={item}
                      orientation="landscape"
                    />
                  </div>
                ))}
            </div>
          </div>

          {communityItems.filter(item => item.tags?.includes(activeFilter)).length > 6 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMoreCommunity(!showMoreCommunity)}
                  className="px-6 border-border"
                >
                  {showMoreCommunity ? 'Show Less' : `Show More (${communityItems.filter(item => item.tags?.includes(activeFilter)).length - 6} more)`}
                </Button>
              </div>
            )}
        </div>
      </div>

      {/* App Tour */}
      <AppTour
        isOpen={isOpen}
        steps={steps}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      {/* Tour Trigger */}
      {hasSeenTour && <TourTrigger onClick={startTour} />}
    </>
  );
};

export default HeroSection;
