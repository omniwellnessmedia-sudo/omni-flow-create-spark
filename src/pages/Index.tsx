import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Sparkles, 
  TreePine, 
  Users, 
  Video, 
  Camera, 
  Mic, 
  Globe,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Star,
  ChevronRight,
  Flower2,
  Sun,
  Moon,
  Wind,
  Waves,
  Mountain
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50">
      <MegaNavigation />
      
      {/* Hero Section - Zen Approach */}
      <Section id="hero" size="large" className="pt-32 pb-16 min-h-screen flex items-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 opacity-20">
            <Flower2 className="h-24 w-24 text-purple-400 animate-pulse" />
          </div>
          <div className="absolute top-40 right-16 opacity-15">
            <TreePine className="h-32 w-32 text-green-400 animate-float" />
          </div>
          <div className="absolute bottom-32 left-20 opacity-25">
            <Mountain className="h-20 w-20 text-blue-400 animate-bounce" />
          </div>
          <div className="absolute bottom-40 right-32 opacity-20">
            <Waves className="h-16 w-16 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Meditation Logo with Breathing Effect */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full opacity-30 animate-ping"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full opacity-40 animate-pulse"></div>
              <img 
                src="/src/assets/omni-logo.png" 
                alt="Omni Wellness Media" 
                className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64 drop-shadow-2xl animate-breathe"
              />
            </div>
          </div>

          {/* Zen Title */}
          <div className="space-y-8 mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-light text-gray-800 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
                Bridging
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-normal mt-4">
                Wellness • Outreach • Media
              </span>
            </h1>
            
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Empowering South Africa's journey to health & consciousness through 
              <br className="hidden sm:block" />
              conscious content creation, business development, and sustainable solutions.
            </p>
          </div>

          {/* Floating Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Learn More",
                description: "Discover our mission",
                href: "/about",
                color: "from-pink-400 to-rose-400"
              },
              {
                icon: Sparkles,
                title: "Our Services",
                description: "Explore what we offer",
                href: "/services",
                color: "from-purple-400 to-indigo-400"
              },
              {
                icon: Globe,
                title: "Get in Touch",
                description: "Start the conversation",
                href: "/contact",
                color: "from-cyan-400 to-blue-400"
              }
            ].map((action, index) => (
              <Card 
                key={action.title}
                className="group hover-lift border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <Button asChild variant="ghost" className="group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-cyan-500 group-hover:text-white transition-all">
                    <Link to={action.href}>
                      Explore
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Wellness Pillars - Floating Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'Inspiration', icon: Sun, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
              { name: 'Education', icon: BookOpen, color: 'bg-blue-100 text-blue-700 border-blue-200' },
              { name: 'Empowerment', icon: Sparkles, color: 'bg-purple-100 text-purple-700 border-purple-200' },
              { name: 'Wellness', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-200' }
            ].map((pillar, index) => (
              <div 
                key={pillar.name}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full ${pillar.color} border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <pillar.icon className="h-5 w-5" />
                <span className="font-medium">{pillar.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-sm text-gray-500 font-light">Scroll to explore</span>
          </div>
        </div>
      </Section>

      {/* Mission - Minimalist Cards */}
      <Section size="large" background="white" className="py-24">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full">
              <Flower2 className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-light text-gray-800 mb-6">
            Our Sacred <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">Mission</span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Transforming and empowering individuals and communities by creating conscious media content 
            that uplifts, educates, and inspires. We focus on education, sustainable development, 
            and activism to drive positive change.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              icon: Heart,
              title: "Conscious Content",
              description: "Creating media that uplifts, educates, and inspires positive change in communities worldwide through authentic storytelling.",
              gradient: "from-pink-400 to-rose-400"
            },
            {
              icon: Users,
              title: "Community Focus", 
              description: "Building bridges between wellness practitioners and those seeking holistic health solutions in our interconnected world.",
              gradient: "from-purple-400 to-indigo-400"
            },
            {
              icon: TreePine,
              title: "Sustainable Development",
              description: "Promoting environmental consciousness and sustainable practices through every project we undertake with mindful intention.",
              gradient: "from-green-400 to-cyan-400"
            }
          ].map((value, index) => (
            <div key={value.title} className="text-center group">
              <div className="relative mb-8">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${value.gradient} p-1 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <value.icon className={`h-10 w-10 bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Services - Elegant Grid */}
      <Section size="large" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-800 mb-6">
            Holistic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">Services</span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Comprehensive wellness and media solutions designed to help you achieve your goals and make a lasting impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: Users,
              title: "Business Development",
              description: "Strategic guidance for growth and sustainable practices that align with your values.",
              href: "/services/business-consulting",
              gradient: "from-blue-400 to-purple-400"
            },
            {
              icon: Video,
              title: "Media Creation",
              description: "High-quality video production, podcasting, and photography that tells your story.",
              href: "/services/media-production", 
              gradient: "from-purple-400 to-pink-400"
            },
            {
              icon: Globe,
              title: "Social Strategy",
              description: "Building engaging online communities and impactful campaigns that matter.",
              href: "/services/social-media",
              gradient: "from-pink-400 to-red-400"
            },
            {
              icon: BookOpen,
              title: "Web Development",
              description: "Expert web and e-commerce solutions that reflect your authentic brand.",
              href: "/services/web-development",
              gradient: "from-cyan-400 to-blue-400"
            }
          ].map((service, index) => (
            <Card 
              key={service.title} 
              className="group hover-lift border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <CardContent className="p-8 text-center h-full flex flex-col">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light flex-grow mb-6">{service.description}</p>
                <Button asChild variant="ghost" className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-cyan-500 group-hover:text-white transition-all">
                  <Link to={service.href}>
                    Explore Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Featured Projects - Story Cards */}
      <Section size="large" background="white" className="py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-800 mb-6">
            Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">Stories</span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Real projects creating positive change in communities across South Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Valley of Plenty",
              description: "A transformative community development initiative in Hanover Park, implementing sustainable wellness practices, urban farming, and conscious living education to uplift the entire community.",
              image: "/lovable-uploads/bb1d5ac4-6c06-4ce7-8866-b0376ad65c36.png",
              badge: "Community Transformation",
              stats: "200+ Families Impacted"
            },
            {
              title: "Human Animal Project", 
              description: "Advocating for compassionate living through educational content, workshops, and community outreach programs that promote animal rights and ethical treatment of all beings.",
              image: "/lovable-uploads/acc84685-2d7b-4845-99fd-744ce2c3c932.png",
              badge: "Compassionate Living",
              stats: "500+ Lives Changed"
            }
          ].map((project, index) => (
            <Card key={project.title} className="group hover-lift border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/90 text-gray-800 border-0 shadow-lg">
                    {project.badge}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{project.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light mb-6">{project.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-purple-600">{project.stats}</span>
                  <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
                    Read Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Testimonials - Peaceful Design */}
      <Section size="large" className="py-24 bg-gradient-to-br from-purple-50 to-cyan-50">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-800 mb-6">
            Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">Transformation</span>
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {[
            {
              quote: "Omni Wellness Media helped us articulate our vision and reach a wider audience. Their dedication to conscious content is truly inspiring and transformative.",
              author: "Sarah Johnson",
              role: "Wellness Center Director", 
              avatar: "SJ",
              rating: 5
            },
            {
              quote: "The team at Omni Wellness Media is professional, creative, and deeply committed to making a difference. We highly recommend their holistic approach.",
              author: "Michael Chen",
              role: "Sustainable Business Owner",
              avatar: "MC", 
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardContent className="p-10">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 leading-relaxed font-light italic mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-semibold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Footer />

    </div>
  );
};

export default Index;