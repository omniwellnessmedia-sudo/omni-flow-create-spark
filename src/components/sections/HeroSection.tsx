
import { Link } from "react-router-dom";
import { TourTrigger } from "@/components/ui/app-tour";
import { useAppTour } from "@/hooks/useAppTour";
import AppTour from "@/components/ui/app-tour";
import { ChatInterface } from "@/components/ui/chat-interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const workspaceItems = [
    {
      title: "Business Strategy",
      description: "Strategic consulting for conscious growth",
      href: "/business-consulting",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      badge: "Consulting"
    },
    {
      title: "Content Creation",
      description: "Video, podcast & social media production", 
      href: "/media-production",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      badge: "Media"
    },
    {
      title: "Wellness AI Tools",
      description: "AI-powered wellness assistants",
      href: "/ai-tools", 
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      badge: "AI Tools"
    }
  ];

  const communityItems = [
    {
      title: "Wellness Marketplace",
      description: "Connect with wellness providers",
      href: "/wellness-marketplace",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      author: "Community",
      badge: "Wellness"
    },
    {
      title: "Tours & Retreats", 
      description: "Transformative wellness experiences",
      href: "/tours-retreats",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      author: "Experiences",
      badge: "Travel"
    },
    {
      title: "Conscious Blog",
      description: "Inspiration, education & empowerment",
      href: "/blog",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png", 
      author: "Content",
      badge: "Blog"
    },
    {
      title: "Podcast Platform",
      description: "Conscious conversations & interviews",
      href: "/podcast",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      author: "Audio",
      badge: "Podcast"
    },
    {
      title: "Partner Network",
      description: "Collaborate with conscious businesses",
      href: "/partners-directory", 
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      author: "Network",
      badge: "Partners"
    },
    {
      title: "Community Hub",
      description: "Connect with like-minded souls",
      href: "/wellness-community",
      image: "/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png",
      author: "Social",
      badge: "Community"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
                alt="Omni Wellness Media" 
                className="h-16 w-16 object-contain"
              />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              Build something <span className="text-rainbow-enhanced">🌈 Conscious</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Create wellness experiences by chatting with Omni AI
            </p>

            {/* Main Chat Interface */}
            <div className="max-w-2xl mx-auto mb-16" data-tour="mission">
              <ChatInterface 
                placeholder="Ask Omni AI to create a wellness program about..."
                welcomeMessage="👋 Welcome! I'm Omni AI. I can help you create wellness programs, business strategies, content, and more. What would you like to build today?"
              />
            </div>
          </div>

          {/* Workspace Section */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Omni's Conscious Workspace</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <select className="border rounded px-3 py-1">
                    <option>Last edited</option>
                  </select>
                  <select className="border rounded px-3 py-1">
                    <option>Newest first</option>
                  </select>
                  <select className="border rounded px-3 py-1">
                    <option>All services</option>
                  </select>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workspaceItems.map((item, index) => (
                  <Link key={index} to={item.href} className="group">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video bg-gradient-to-br from-wellness-light to-wellness-primary/20 relative">
                        <img 
                          src={item.image} 
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
                  <button className="px-3 py-1 bg-gray-100 rounded-full">Popular</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded-full">Discover</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded-full">Wellness</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded-full">Personal</button>
                  <button className="px-3 py-1 hover:bg-gray-100 rounded-full">Business</button>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityItems.map((item, index) => (
                <Link key={index} to={item.href} className="group">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-wellness-light to-wellness-accent/20 relative">
                      <img 
                        src={item.image} 
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
              <Button variant="outline">Show More</Button>
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
