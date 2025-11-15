
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          
          {/* Visual Hero Banner with Images */}
          <div className="relative overflow-hidden rounded-3xl mb-8 sm:mb-12 shadow-2xl">
            {/* Background Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 opacity-40">
              <div className="aspect-square">
                <img src={getStorageUrl("Chief Kingsley amazing portrait.jpg")} alt="Chief Kingsley" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square">
                <img src={getStorageUrl("group tour amazing cave view.jpg")} alt="Sacred Cave" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square">
                <img src={getStorageUrl("wellness group tour.jpg")} alt="Wellness Group" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square">
                <img src={getStorageUrl("ubuntu-community-gathering.jpg")} alt="Ubuntu Community" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square hidden lg:block">
                <img src={getStorageUrl("service-learning-education.jpg")} alt="Education" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square hidden lg:block">
                <img src={getStorageUrl("traditional-healing-experience.jpg")} alt="Traditional Healing" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-wellness-primary/90 via-wellness-accent/85 to-blue-600/80 flex items-center justify-center">
              <div className="text-center text-white px-4 py-12 sm:py-20">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                    <img 
                      {...getOmniLogo()} 
                      alt="Omni Wellness Media" 
                      className="h-12 w-12 sm:h-20 sm:w-20 object-contain"
                    />
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                  Build something <span className="text-yellow-300">Conscious</span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                  Transform communities through indigenous wisdom, wellness experiences, and conscious content
                </p>

                {/* Impact Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="text-2xl sm:text-4xl font-bold text-yellow-300">100+</div>
                    <div className="text-xs sm:text-sm mt-1">Children Educated</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="text-2xl sm:text-4xl font-bold text-yellow-300">247</div>
                    <div className="text-xs sm:text-sm mt-1">Lives Transformed</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <div className="text-2xl sm:text-4xl font-bold text-yellow-300">20%</div>
                    <div className="text-xs sm:text-sm mt-1">Community Impact</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                  <Link to="/tours-retreats">
                    <Button size="lg" className="bg-white text-wellness-primary hover:bg-white/90 shadow-lg">
                      <MapPin className="mr-2 h-5 w-5" />
                      Explore Tours & Retreats
                    </Button>
                  </Link>
                  <Link to="/wellness-deals">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 backdrop-blur-sm">
                      <Heart className="mr-2 h-5 w-5" />
                      Wellness Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assistant Section - Redesigned */}
          <div className="text-center mb-8 sm:mb-12 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-wellness-primary/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Bot className="h-8 w-8 text-wellness-primary" />
                <Sparkles className="h-4 w-4 text-wellness-accent absolute -top-1 -right-1" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Chat with Omni AI Assistant
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
              Get instant guidance on wellness services, business consulting, AI tools, and content creation. 
              <span className="text-wellness-primary font-medium"> Ask about tours, retreats, or community programs!</span>
            </p>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-3xl mx-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center">
                <Users className="h-4 w-4" />
                Wellness Services
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center">
                <Briefcase className="h-4 w-4" />
                Business Consulting
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center">
                <Zap className="h-4 w-4" />
                AI Tools
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center">
                <Video className="h-4 w-4" />
                Content Creation
              </Button>
            </div>

            {/* Chat Interface */}
            <div className="max-w-2xl mx-auto" data-tour="mission">
              <ChatInterface 
                placeholder="Ask about wellness programs, tours, or how to get involved..."
                welcomeMessage="👋 Welcome! I'm Omni AI, your conscious wellness guide. I can help you discover wellness programs, indigenous wisdom experiences with Chief Kingsley, sacred cave tours, or community impact opportunities with the Dr. Phil-afel Foundation. What interests you?"
              />
            </div>

            <p className="text-xs text-gray-500 mt-4">
              💡 This is an interactive guide. For personalized consultations, <Link to="/contact" className="text-wellness-primary underline">contact our team</Link>.
            </p>
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

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-6 items-stretch">
            {communityItems
              .filter(item => item.tags?.includes(activeFilter))
              .slice(0, showMoreCommunity ? 99 : 6)
              .map((item, index) => (
              <Link 
                key={index} 
                to={item.href} 
                className={`group block ${
                  item.orientation === 'portrait' ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-3 lg:col-span-3'
                }`}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`relative bg-gradient-to-br from-wellness-light/20 to-wellness-accent/10 ${
                    item.orientation === 'portrait' ? 'aspect-[4/5]' : 'aspect-[21/9]'
                  }`}>
                     <img 
                       src={item.image} 
                       alt={item.title}
                       loading="lazy"
                       decoding="async"
                       className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
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
