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
      title: "Indigenous Walks",
      description: "Sacred heritage journeys with Chief Kingsley — Fish Hoek, Muizenberg & Kalk Bay",
      href: "/tours-retreats",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg",
      badge: "Impact Travel"
    },
    {
      title: "Hoofbeats & Healing",
      description: "Equine-assisted wellness with rescued working horses",
      href: "/experiences/cart-horse-urban-wellness",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg",
      badge: "New Experience"
    },
    {
      title: "ROAM eSIM Store",
      description: "Stay connected while you travel — global eSIM plans",
      href: "/roambuddy-store",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg",
      badge: "Travel Store"
    },
    {
      title: "Corporate Retreats",
      description: "Bespoke team wellness programmes with measurable outcomes",
      href: "/experiences/corporate-wellness-retreat",
      image: IMAGES.services.artscape,
      badge: "For Teams"
    }
  ];

  const communityItems = [
    {
      title: "Chief Kingsley's Wisdom",
      description: "Indigenous knowledge passed down through generations of the Gorachouqua Khoi Nation",
      href: "/tours/great-mother-cave-tour#chief-kingsley",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/chief%20kingsley%201.jpg",
      category: "tours",
      author: "Cultural Experience",
      badge: "Impact Travel",
      orientation: "portrait",
      tags: ["Popular", "Discover", "Personal"]
    },
    {
      title: "12,000 Years of Heritage",
      description: "Explore Peer's Cave and the Ascension Tunnel in Fish Hoek",
      href: "/tours/great-mother-cave-tour",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/tour%20picture%20couple%20with%20chief%20kingsley.jpg",
      category: "tours",
      author: "Great Mother Cave",
      badge: "Impact Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Hoofbeats & Healing",
      description: "Equine-assisted wellness with rescued working horses",
      href: "/experiences/cart-horse-urban-wellness",
      image: getStorageUrl("community outing 2.jpg"),
      category: "tours",
      author: "Impact Travel",
      badge: "Impact Travel",
      orientation: "landscape",
      tags: ["Wellness", "Discover", "Personal"]
    },
    {
      title: "Muizenberg's Living Heritage",
      description: "Ancient Khoi-San coastal settlements and marine heritage by the sea",
      href: "/tours/muizenberg-cave-tours",
      image: getStorageUrl("muizenberg cave view 2.jpg"),
      category: "tours",
      author: "Coastal Journey",
      badge: "Impact Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Kalk Bay's Healing Herbs",
      description: "Historic harbour, ancient trade routes, and traditional plant medicine",
      href: "/tours/kalk-bay-tour",
      image: getStorageUrl("community outing 1.jpg"),
      category: "tours",
      author: "Heritage Walk",
      badge: "Impact Travel",
      orientation: "landscape",
      tags: ["Popular", "Personal", "Wellness"]
    },
    {
      title: "Meet Chad Cupido",
      description: "Founding Director — bridging tourism, culture, and community",
      href: "/about",
      image: getStorageUrl("Chad Amazing portrait.jpg"),
      category: "community",
      author: "Our Team",
      badge: "About Us",
      orientation: "portrait",
      tags: ["Popular", "Wellness", "Personal"]
    },
    {
      title: "Ancient Rock Art",
      description: "Direct connection to the spiritual beliefs of the Khoi and San",
      href: "/tours/great-mother-cave-tour",
      image: getStorageUrl("Rock art portrait.jpg"),
      category: "tours",
      author: "Heritage",
      badge: "Impact Travel",
      orientation: "portrait",
      tags: ["Discover", "Personal", "Wellness"]
    },
    {
      title: "Hoofbeats & Healing",
      description: "Equine-assisted wellness with rescued working horses",
      href: "/experiences/cart-horse-urban-wellness",
      image: getStorageUrl("wellness group tour.jpg"),
      category: "wellness",
      author: "New Experience",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Popular", "Personal", "Wellness"]
    },
    {
      title: "Wellness Retreat Gatherings",
      description: "Transformative multi-day wellness experiences at Tufcat Sanctuary",
      href: "/tour-detail/winter-wine-country-wellness",
      image: getStorageUrl("Wellness retreat 2.jpg"),
      category: "wellness",
      author: "Annual Retreat",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Wellness", "Discover", "Personal"]
    },
    {
      title: "Operations Excellence",
      description: "Zenith Yassin ensuring every journey runs with care and precision",
      href: "/about",
      image: getStorageUrl("Zenith_TNT_OMNI-9.jpg"),
      category: "community",
      author: "Our Team",
      badge: "About Us",
      orientation: "landscape",
      tags: ["Personal", "Wellness"]
    },
    {
      title: "Corporate Wellness Retreats",
      description: "Rewild your team — bespoke programmes with measurable ESG outcomes",
      href: "/experiences/corporate-wellness-retreat",
      image: getStorageUrl("tour picture couple with chief kingsley.jpg"),
      category: "wellness",
      author: "For Teams",
      badge: "Corporate",
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
          {/* Cinematic overlay — warm dark with depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" aria-hidden="true"></div>
        </div>

        {/* Ambient light — subtle warm glow (desktop only) */}
        <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-teal-500/[0.07] blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-amber-500/[0.05] blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Logo — Clean, confident */}
          <div className="flex justify-center mb-8 sm:mb-10 animate-fade-in">
            <img
              src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png"
              alt="Omni Wellness Media logo"
              className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain rounded-full bg-white/95 p-2.5 shadow-lg"
              loading="eager"
            />
          </div>
          
          {/* Main Headline - Guided, Welcoming Tone */}
          <h1
            id="hero-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-5 sm:mb-7 text-white animate-fade-in-up leading-[1.1] tracking-tight"
          >
            {omniVoice.pageIntros.home.headline}
          </h1>

          {/* Subheadline — light, editorial */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-10 sm:mb-14 max-w-2xl mx-auto animate-fade-in-up leading-relaxed font-light" style={{ animationDelay: '0.2s' }}>
            {omniVoice.pageIntros.home.subheadline}
          </p>

          {/* CTA Buttons — Premium, restrained */}
          <nav
            aria-label="Primary actions"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button asChild size="lg" className="px-8 py-5 text-base font-medium bg-white text-gray-900 hover:bg-white/90 shadow-lg min-w-[200px] rounded-full transition-all duration-300 hover:shadow-xl">
              <Link to="/tours-retreats">Explore Experiences</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-5 text-base font-medium bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white/70 min-w-[200px] rounded-full transition-all duration-300">
              <a href="/#curated-services" onClick={(e) => { e.preventDefault(); document.getElementById('curated-services')?.scrollIntoView({ behavior: 'smooth' }); }}>Our Services</a>
            </Button>
          </nav>

          {/* Trust signals — editorial */}
          <div className="mt-10 animate-fade-in flex flex-wrap gap-6 justify-center text-white/60 text-sm" style={{ animationDelay: '0.6s' }}>
            <span className="flex items-center gap-1.5">Indigenous-led experiences</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-1.5">Small groups of 12</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="flex items-center gap-1.5">Cape Town, South Africa</span>
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

          {/* Featured Experiences — Editorial grid */}
          <div id="curated-services" className="mb-20 sm:mb-28">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Curated for you</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
                Experiences That Matter
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                Indigenous heritage walks, equine-assisted wellness, and transformative corporate retreats — each journey creates lasting impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {workspaceItems.map((item, index) => (
                <Link key={index} to={item.href} className="group">
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = IMAGES.wellness.retreat; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                      <span className="inline-block text-xs font-medium tracking-wider uppercase text-white/70 mb-2">{item.badge}</span>
                      <h3 className="font-heading text-xl sm:text-2xl text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/70 max-w-md">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/tours-retreats">
                <Button variant="outline" className="rounded-full px-8 py-5 text-sm font-medium border-border/60 hover:bg-muted/50">
                  View All Experiences
                </Button>
              </Link>
            </div>
          </div>

          {/* Impact strip */}
          <div className="mb-20 sm:mb-28 py-12 sm:py-16 border-y border-border/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-heading text-3xl sm:text-4xl text-foreground mb-1">12,000+</div>
                <p className="text-sm text-muted-foreground">Years of heritage</p>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl text-foreground mb-1">3</div>
                <p className="text-sm text-muted-foreground">Indigenous walks</p>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl text-foreground mb-1">12</div>
                <p className="text-sm text-muted-foreground">Max group size</p>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl text-foreground mb-1">100%</div>
                <p className="text-sm text-muted-foreground">Community impact</p>
              </div>
            </div>
          </div>

          {/* Community — Curated editorial gallery (3 items max) */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">On the ground</p>
              <h2 className="font-heading text-3xl sm:text-4xl text-foreground">
                Stories From the Land
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {communityItems
                .filter(item => item.tags?.includes('Popular'))
                .slice(0, 3)
                .map((item, index) => (
                  <Link key={index} to={item.href} className="group">
                    <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="inline-block text-xs font-medium tracking-wider uppercase text-white/60 mb-2">{item.badge}</span>
                        <h3 className="font-heading text-lg text-white">{item.title}</h3>
                        <p className="text-sm text-white/60 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
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
