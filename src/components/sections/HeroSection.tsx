
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
      title: "Wellness Marketplace",
      description: "Connect with wellness providers",
      href: "/wellness-exchange/marketplace",
      imagePrompt: "Beautiful outdoor wellness marketplace with diverse people practicing yoga, meditation, healthy food vendors, natural healing products",
      category: "wellness",
      author: "Community",
      badge: "Wellness"
    },
    {
      title: "Tours & Retreats", 
      description: "Transformative wellness experiences",
      href: "/tours-retreats",
      imagePrompt: "Stunning South African landscape with Table Mountain, people on a wellness retreat doing yoga at sunrise, beautiful Cape Town scenery",
      category: "tours",
      author: "Experiences",
      badge: "Travel"
    },
    {
      title: "Conscious Blog",
      description: "Inspiration, education & empowerment",
      href: "/blog",
      imagePrompt: "Inspiring blog content creation scene with person writing, surrounded by books, plants, natural light, peaceful creative workspace",
      category: "inspiration",
      author: "Content",
      badge: "Blog"
    },
    {
      title: "Podcast Platform",
      description: "Conscious conversations & interviews",
      href: "/podcast",
      imagePrompt: "Professional podcast studio with high-quality microphones, soundproofing, warm lighting, two people having an engaging conversation",
      category: "podcast",
      author: "Audio",
      badge: "Podcast"
    },
    {
      title: "Partner Network",
      description: "Collaborate with conscious businesses",
      href: "/partners-directory", 
      imagePrompt: "Diverse group of business partners shaking hands, networking event with conscious business leaders, collaborative workspace with sustainable elements",
      category: "business",
      author: "Network",
      badge: "Partners"
    },
    {
      title: "Community Hub",
      description: "Connect with like-minded souls",
      href: "/wellness-community",
      imagePrompt: "Diverse community gathering in a circle, people connecting and sharing, warm inclusive atmosphere, outdoor community space with natural elements",
      category: "community",
      author: "Social",
      badge: "Community"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">From the Community</h2>
              <div className="flex items-center gap-4">
                <div className="flex gap-2 text-sm">
                  {['Popular', 'Discover', 'Wellness', 'Personal', 'Business'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-full transition-colors ${
                        activeFilter === filter 
                          ? 'bg-wellness-primary text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <Link to="/wellness-community">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityItems.slice(0, showMoreCommunity ? communityItems.length : 6).map((item, index) => (
                <Link key={index} to={item.href} className="group">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-wellness-light to-wellness-accent/20 relative">
                       <img 
                         src={getImageForCategory(item.category)} 
                         alt={item.title}
                         className="w-full h-full object-cover opacity-80"
                       />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white text-wellness-primary text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-wellness-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-wellness-primary">
                            {item.author.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <p className="text-xs text-gray-500">{item.author}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowMoreCommunity(!showMoreCommunity)}
              >
                {showMoreCommunity ? 'Show Less' : 'Show More'}
              </Button>
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
