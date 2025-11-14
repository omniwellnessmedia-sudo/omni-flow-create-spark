
import { useState } from "react";
import { Link } from "react-router-dom";
import { TourTrigger } from "@/components/ui/app-tour";
import { useAppTour } from "@/hooks/useAppTour";
import AppTour from "@/components/ui/app-tour";
import { ChatInterface } from "@/components/ui/chat-interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGES, getOmniLogo, getImageWithFallback } from "@/lib/images";
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

// Import community images
import zenithImg from "@/assets/community-zenith.jpg";
import chadMeditationImg from "@/assets/community-chad-meditation.jpg";
import groupTourImg from "@/assets/community-group-tour.jpg";
import chiefKingsleyImg from "@/assets/community-chief-kingsley.jpg";
import rockArtImg from "@/assets/community-rock-art.jpg";
import mountainViewImg from "@/assets/community-mountain-view.jpg";
import caveGroupImg from "@/assets/community-cave-group.jpg";
import indigenousTourImg from "@/assets/community-indigenous-tour.jpg";
import tourGroupImg from "@/assets/community-tour-group.jpg";

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
      imagePrompt: "Professional business consulting meeting with diverse team around a modern conference table, strategic planning documents, charts and graphs, clean modern office environment",
      category: "business",
      badge: "Consulting"
    },
    {
      title: "Content Creation",
      description: "Video, podcast & social media production", 
      href: "/media-production",
      imagePrompt: "Professional video production studio with cameras, lighting equipment, creative content being filmed, modern media workspace with editing screens",
      category: "media",
      badge: "Media"
    },
    {
      title: "Wellness AI Tools",
      description: "AI-powered wellness assistants",
      href: "/ai-tools", 
      imagePrompt: "Futuristic AI interface with holographic wellness data, brain-computer interface, glowing neural networks, advanced technology for health and wellness",
      category: "ai-tools",
      badge: "AI Tools"
    }
  ];

  const communityItems = [
    {
      title: "Meet Zenith",
      description: "Co-Founder & Skincare Specialist at 2BeWell",
      href: "/2bewell",
      image: zenithImg,
      category: "wellness",
      author: "Team",
      badge: "Wellness",
      orientation: "portrait",
      tags: ["Popular", "Wellness", "Personal"]
    },
    {
      title: "Meditation Journey",
      description: "Finding peace on Cape Town's mountains",
      href: "/tours-retreats",
      image: chadMeditationImg,
      category: "tours",
      author: "Chad Cupido",
      badge: "Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness", "Personal"]
    },
    {
      title: "Wellness Group Tours",
      description: "Experience nature with conscious community",
      href: "/tours-retreats",
      image: groupTourImg,
      category: "tours",
      author: "Experiences",
      badge: "Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Chief Kingsley",
      description: "Indigenous wisdom & spiritual guidance",
      href: "/tours-retreats",
      image: chiefKingsleyImg,
      category: "community",
      author: "Chief Kingsley",
      badge: "Community",
      orientation: "portrait",
      tags: ["Popular", "Discover", "Personal"]
    },
    {
      title: "Ancient Rock Art",
      description: "Connecting with ancestral heritage",
      href: "/tours-retreats",
      image: rockArtImg,
      category: "inspiration",
      author: "Heritage",
      badge: "Culture",
      orientation: "landscape",
      tags: ["Discover", "Personal"]
    },
    {
      title: "Mountain Adventures",
      description: "Breathtaking views & wellness experiences",
      href: "/tours-retreats",
      image: mountainViewImg,
      category: "tours",
      author: "Adventures",
      badge: "Travel",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    },
    {
      title: "Sacred Cave Experience",
      description: "Group meditation in ancient caves",
      href: "/tours-retreats",
      image: caveGroupImg,
      category: "wellness",
      author: "Experiences",
      badge: "Wellness",
      orientation: "landscape",
      tags: ["Popular", "Wellness", "Discover"]
    },
    {
      title: "Indigenous Tours",
      description: "Learn from traditional wisdom keepers",
      href: "/tours-retreats",
      image: indigenousTourImg,
      category: "community",
      author: "Cultural Tours",
      badge: "Community",
      orientation: "landscape",
      tags: ["Discover", "Personal", "Wellness"]
    },
    {
      title: "Community Adventures",
      description: "Connect with nature & like-minded souls",
      href: "/tours-retreats",
      image: tourGroupImg,
      category: "community",
      author: "Community",
      badge: "Community",
      orientation: "landscape",
      tags: ["Popular", "Discover", "Wellness"]
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img 
                {...getOmniLogo()} 
                alt="Omni Wellness Media" 
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
              />
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
              Build something <span className="text-wellness-primary">Conscious</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Create wellness experiences by chatting with Omni AI or explore our <Link to="/wellness-deals" className="text-wellness-primary underline font-semibold hover:text-wellness-primary/80">wellness deals marketplace</Link>
            </p>

            {/* Main Chat Interface */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-16" data-tour="mission">
              <ChatInterface 
                placeholder="Ask Omni AI to create a wellness program about..."
                welcomeMessage="👋 Welcome! I'm Omni AI. I can help you create wellness programs, business strategies, content, and more. What would you like to build today?"
              />
            </div>
          </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {workspaceItems.map((item, index) => (
                  <Link key={index} to={item.href} className="group">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-wellness-light to-wellness-primary/20 relative">
                        <img 
                          src={getImageForCategory(item.category)} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityItems
                .filter(item => item.tags?.includes(activeFilter))
                .slice(0, showMoreCommunity ? 99 : 6)
                .map((item, index) => (
                <Link key={index} to={item.href} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`relative bg-gradient-to-br from-wellness-light/20 to-wellness-accent/10 ${
                      item.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'
                    }`}>
                       <img 
                         src={item.image} 
                         alt={item.title}
                         loading="lazy"
                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                       />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm text-wellness-primary text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                          {item.badge}
                        </span>
                      </div>
                      {/* Gradient overlay for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-wellness-primary to-wellness-accent rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-white">
                            {item.author.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-wellness-primary transition-colors">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                          <p className="text-xs text-gray-500 truncate">{item.author}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
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
