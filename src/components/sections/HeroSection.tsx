
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

  const quickActions = [
    {
      icon: Briefcase,
      label: "Business Consulting",
      href: "/business-consulting",
      description: "Strategic guidance for conscious growth"
    },
    {
      icon: Video,
      label: "Media Production",
      href: "/media-production", 
      description: "Conscious content creation"
    },
    {
      icon: Bot,
      label: "AI Tools",
      href: "/ai-tools",
      description: "Wellness-focused AI assistants"
    },
    {
      icon: Users,
      label: "Wellness Community",
      href: "/wellness-community",
      description: "Connect with like-minded souls"
    },
    {
      icon: MapPin,
      label: "Tours & Retreats",
      href: "/tours-retreats",
      description: "Transformative wellness experiences"
    },
    {
      icon: Headphones,
      label: "Podcast",
      href: "/podcast",
      description: "Conscious conversations"
    }
  ];

  const contentPillars = [
    { icon: Sparkles, label: "Inspiration", href: "/blog?category=inspiration", color: "text-yellow-500" },
    { icon: BookOpen, label: "Education", href: "/blog?category=education", color: "text-blue-500" },
    { icon: Zap, label: "Empowerment", href: "/blog?category=empowerment", color: "text-purple-500" },
    { icon: Heart, label: "Wellness", href: "/wellness-marketplace", color: "text-green-500" }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-wellness-light via-white to-wellness-accent/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-wellness-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-wellness-accent/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
                  alt="Omni Wellness Media" 
                  className="h-24 w-24 lg:h-32 lg:w-32 animate-float relative z-10 object-contain"
                />
                <div className="absolute inset-0 bg-rainbow-enhanced rounded-full opacity-20 animate-pulse-slow blur-2xl"></div>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-rainbow-enhanced">Conscious AI</span>
              <br />
              <span className="text-gray-900">for Wellness & Growth</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Your AI-powered guide to holistic wellness, conscious business development, and authentic storytelling. From South Africa to the world.
            </p>
          </div>

          {/* Main Chat Interface */}
          <div className="mb-12" data-tour="mission">
            <ChatInterface className="mb-8" />
          </div>

          {/* Content Pillars */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
              Explore Our Content Pillars
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {contentPillars.map((pillar) => (
                <Link
                  key={pillar.label}
                  to={pillar.href}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <pillar.icon className={`h-5 w-5 ${pillar.color}`} />
                  <span>{pillar.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
              Quick Access to Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href} className="group">
                  <Card className="h-full bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <action.icon className="h-12 w-12 mx-auto mb-4 text-wellness-primary group-hover:text-wellness-accent transition-colors" />
                      <h3 className="font-semibold text-gray-900 mb-2">{action.label}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                className="bg-wellness-primary hover:bg-wellness-primary/90 text-white px-8 py-3"
              >
                <Link to="/services">
                  <Globe className="mr-2 h-5 w-5" />
                  Explore All Services
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-wellness-primary text-wellness-primary hover:bg-wellness-primary hover:text-white px-8 py-3"
              >
                <Link to="/contact">
                  Get Started Today
                </Link>
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
