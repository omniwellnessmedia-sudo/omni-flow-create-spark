
import { useState } from "react";
import { Link } from "react-router-dom";
import { TourTrigger } from "@/components/ui/app-tour";
import { useAppTour } from "@/hooks/useAppTour";
import AppTour from "@/components/ui/app-tour";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGES, getOmniLogo, getImageWithFallback } from "@/lib/images";
import { CommunityCard } from "@/components/community/CommunityCard";

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
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Business%20Consulting/Business%20consulting.jpg",
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
      title: "2BeWell Natural Products",
      description: "Handmade wellness essentials",
      href: "/twobewellshop",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/product-images%2A%2A%20(2BeWell)/10.png",
      badge: "Shop"
    },
    {
      title: "Conscious Connections: Indigenous Wisdom + Healing",
      description: "Ancient healing practices & cultural experiences",
      href: "/tours-retreats",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg",
      badge: "Cultural"
    },
    {
      title: "FACT Wellness Hybrid Classes",
      description: "Fitness, wellness & community classes",
      href: "/wellness-community",
      image: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg",
      badge: "Wellness"
    }
  ];

  const communityItems = [
    {
      title: "Chief Kingsley's Wisdom",
      description: "Indigenous knowledge & cultural heritage tours",
      href: "/tours-retreats",
      image: getStorageUrl("Chief Kingsley amazing portrait.jpg"),
      category: "tours",
      author: "Cultural Experience",
      badge: "Travel",
      orientation: "portrait",
      tags: ["Popular", "Discover", "Personal"]
    },
    {
      title: "Wellness Group Tours",
      description: "Transformative group experiences in nature",
      href: "/tours-retreats",
      image: getStorageUrl("wellness group tour.jpg"),
      category: "tours",
      author: "Adventures",
      badge: "Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Sacred Cave Explorations",
      description: "Ancient sites for deep spiritual practice",
      href: "/tours-retreats",
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
      href: "/tours-retreats",
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
      href: "/wellness-community",
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
      href: "/wellness-community",
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
      href: "/tours-retreats",
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
      href: "/tours-retreats",
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
      href: "/wellness-community",
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
      href: "/wellness-community",
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
      {/* Stunning Hero Section with Cave View */}
      <div className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/muizenberg%20cave%20view%202.jpg"
            alt="Muizenberg Cave View - Spiritual Wellness Journey"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = IMAGES.locations.view1; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Logo */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
            <img 
              src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png"
              alt="Omni Wellness Media"
              className="h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44 object-contain drop-shadow-2xl"
            />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg animate-fade-in-up leading-tight">
            Bridging Wellness, Outreach & Media
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 sm:mb-12 max-w-4xl mx-auto drop-shadow-md animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Empowering South Africa's Journey to Health & Consciousness
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold bg-wellness-primary hover:bg-wellness-primary/90 text-white shadow-2xl">
              <Link to="/services">Explore Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold bg-white/90 hover:bg-white text-wellness-primary border-2 border-white shadow-2xl">
              <Link to="/tours-retreats">Wellness Tours</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold bg-white/90 hover:bg-white text-wellness-primary border-2 border-white shadow-2xl">
              <Link to="/twobewellshop">2BeWell Shop</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">

          {/* Workspace Section */}
          <div className="mb-8 sm:mb-16">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Omni's Conscious Workspace</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                  <select className="border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    <option>Last edited</option>
                  </select>
                  <select className="border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    <option>Newest first</option>
                  </select>
                  <select className="border rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    <option>All services</option>
                  </select>
                  <Link to="/services">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">View All</Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {workspaceItems.map((item, index) => (
                  <Link key={index} to={item.href} className="group">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-wellness-light to-wellness-primary/20 relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80"
                          onError={(e) => { e.currentTarget.src = IMAGES.wellness.retreat; }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-wellness-primary text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
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
              <h2 className="text-xl font-semibold text-gray-900">From the Community</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex gap-2 text-sm overflow-x-auto pb-2 sm:pb-0">
                  {['Popular', 'Discover', 'Wellness', 'Personal'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                        activeFilter === filter 
                          ? 'bg-wellness-primary text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <Link to="/wellness-community" className="shrink-0">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </div>

            {/* Masonry grid layout - alternating portrait and landscape */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communityItems
                .filter(item => item.tags?.includes(activeFilter))
                .slice(0, showMoreCommunity ? 99 : 6)
                .map((item, index) => {
                  // Define layout pattern: portrait, landscape(2 cols), landscape(2 cols), portrait, etc
                  const layoutClasses = [
                    'md:col-span-1', // Portrait
                    'md:col-span-2', // Landscape
                    'md:col-span-2', // Landscape  
                    'md:col-span-1', // Portrait
                    'md:col-span-1.5', // Landscape
                    'md:col-span-1.5', // Landscape
                  ];
                  
                  return (
                    <div key={index} className={layoutClasses[index % layoutClasses.length] || 'md:col-span-1'}>
                      <CommunityCard 
                        item={item}
                        orientation={(item.orientation as 'portrait' | 'landscape') || (index % 4 === 0 || index % 4 === 3 ? 'portrait' : 'landscape')}
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          {communityItems.filter(item => item.tags?.includes(activeFilter)).length > 6 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMoreCommunity(!showMoreCommunity)}
                  className="px-6"
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
