import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Brain, 
  Leaf, 
  Users, 
  Video, 
  Camera, 
  Mic, 
  Globe,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Sparkles,
  Star,
  ChevronRight
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <MegaNavigation />
      
      {/* Hero Section */}
      <Section id="hero" size="large" background="gradient" className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-blue-50 opacity-60"></div>
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src="/src/assets/omni-logo.png" 
                alt="Omni Wellness Media" 
                className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 animate-float drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-rainbow-enhanced rounded-full opacity-20 animate-pulse-slow blur-3xl scale-150"></div>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-high-contrast">
            Bridging <span className="text-rainbow-enhanced">Wellness</span>,
            <br />
            <span className="text-rainbow-enhanced">Outreach</span> & <span className="text-rainbow-enhanced">Media</span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Empowering South Africa's journey to health & consciousness through conscious content creation, 
            business development, and sustainable solutions.
          </p>

          {/* Content Pillars */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Inspiration', 'Education', 'Empowerment', 'Wellness'].map((pillar, index) => (
              <Badge 
                key={pillar} 
                variant="secondary" 
                className="px-6 py-3 text-lg font-semibold bg-white/80 backdrop-blur-sm border-rainbow-enhanced border-2 text-gray-800 hover:bg-rainbow-enhanced hover:text-white transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pillar}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-rainbow-enhanced text-white px-8 py-4 text-lg hover:scale-105 transition-transform">
              <Link to="/services">
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg hover:bg-rainbow-enhanced hover:text-white transition-all">
              <Link to="/services">Our Services</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="px-8 py-4 text-lg hover:bg-white/20 transition-all">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <Heart className="h-12 w-12 text-pink-400 animate-pulse" />
        </div>
        <div className="absolute top-32 right-16 opacity-30">
          <Leaf className="h-10 w-10 text-green-400 animate-bounce" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-30">
          <Brain className="h-14 w-14 text-purple-400 animate-float" />
        </div>
      </Section>

      {/* Mission & Values */}
      <Section size="large" background="white">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-high-contrast mb-6">
            Our <span className="text-rainbow-enhanced">Mission</span> & Values
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Omni Wellness Media is dedicated to transforming and empowering individuals and communities by creating 
            conscious media content that uplifts, educates, and inspires. We focus on education, sustainable development, 
            and activism to drive positive change.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: "Conscious Content",
              description: "Creating media that uplifts, educates, and inspires positive change in communities worldwide.",
              color: "text-red-500"
            },
            {
              icon: Users,
              title: "Community Focus",
              description: "Building bridges between wellness practitioners and those seeking holistic health solutions.",
              color: "text-blue-500"
            },
            {
              icon: Leaf,
              title: "Sustainable Development",
              description: "Promoting environmental consciousness and sustainable practices through every project we undertake.",
              color: "text-green-500"
            }
          ].map((value, index) => (
            <Card key={value.title} className="card-standard hover-lift border-2 hover:border-rainbow-enhanced transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                    <value.icon className={`h-12 w-12 ${value.color}`} />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-high-contrast">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-center leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Services Overview */}
      <Section size="large" background="light">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-high-contrast mb-6">
            Our <span className="text-rainbow-enhanced">Services</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive range of services designed to help you achieve your goals and make a lasting impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              title: "Business Development",
              description: "Strategic guidance for growth and sustainable practices.",
              href: "/services/business-consulting"
            },
            {
              icon: Video,
              title: "Media & Content Creation",
              description: "High-quality video production, podcasting, and photography.",
              href: "/services/media-production"
            },
            {
              icon: Globe,
              title: "Social Media Strategy",
              description: "Building engaging online communities and impactful campaigns.",
              href: "/services/social-media"
            },
            {
              icon: BookOpen,
              title: "Web Development",
              description: "Expert web and e-commerce solutions.",
              href: "/services/web-development"
            }
          ].map((service, index) => (
            <Card key={service.title} className="card-standard hover-lift group cursor-pointer border-2 hover:border-rainbow-enhanced transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-rainbow-enhanced/10 group-hover:bg-rainbow-enhanced rounded-full transition-all duration-300">
                    <service.icon className="h-10 w-10 text-rainbow-enhanced group-hover:text-white transition-colors" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-high-contrast card-title-clamp">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="card-description-clamp text-base mb-4">
                  {service.description}
                </CardDescription>
                <Button asChild variant="ghost" className="w-full group-hover:bg-rainbow-enhanced group-hover:text-white transition-all">
                  <Link to={service.href}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Featured Projects */}
      <Section size="large" background="white">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-high-contrast mb-6">
            Featured <span className="text-rainbow-enhanced">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore some of our impactful projects that are creating positive change in communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Valley of Plenty",
              description: "Located in Hanover Park, we are implementing sustainable development across the community through wellness education, urban farming, and conscious living practices.",
              image: "/lovable-uploads/bb1d5ac4-6c06-4ce7-8866-b0376ad65c36.png",
              badge: "Community Development"
            },
            {
              title: "Human Animal Project",
              description: "Advocating for animal rights and compassionate living through educational content, workshops, and community outreach programs.",
              image: "/lovable-uploads/acc84685-2d7b-4845-99fd-744ce2c3c932.png",
              badge: "Animal Welfare"
            }
          ].map((project, index) => (
            <Card key={project.title} className="card-standard hover-lift overflow-hidden border-2 hover:border-rainbow-enhanced transition-all duration-300">
              <div className="h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-rainbow-enhanced/10 text-rainbow-enhanced border-rainbow-enhanced">
                  {project.badge}
                </Badge>
                <CardTitle className="text-2xl font-bold text-high-contrast card-title-clamp">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="card-description-clamp text-base leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Video Background Section - Instructions */}
      <Section size="large" background="light">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-high-contrast mb-6">
            Adding <span className="text-rainbow-enhanced">Background-Free Videos</span>
          </h2>
          <div className="max-w-4xl mx-auto text-left bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-rainbow-enhanced/20">
            <h3 className="text-2xl font-bold text-high-contrast mb-4">How to Add Background-Free Videos:</h3>
            <div className="space-y-4 text-lg text-gray-700">
              <p><strong>1. Video Format:</strong> Use MP4 videos with transparent backgrounds (Alpha channel) or green screen videos.</p>
              <p><strong>2. Upload Location:</strong> Place videos in the <code className="bg-gray-100 px-2 py-1 rounded">/public</code> folder or use the upload feature.</p>
              <p><strong>3. Implementation:</strong> Use HTML5 video elements with CSS for overlay effects:</p>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                {`<video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover opacity-30">
  <source src="/your-video.mp4" type="video/mp4" />
</video>`}
              </div>
              <p><strong>4. Positioning:</strong> Use absolute positioning with CSS to overlay videos behind content.</p>
              <p><strong>5. Performance:</strong> Optimize video file sizes and consider using poster images for faster loading.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Client Testimonials */}
      <Section size="large" background="white">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-high-contrast mb-6">
            Client <span className="text-rainbow-enhanced">Testimonials</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              quote: "Omni Wellness Media helped us articulate our vision and reach a wider audience. Their dedication to conscious content is truly inspiring.",
              author: "Sarah Johnson",
              role: "Wellness Center Director",
              rating: 5
            },
            {
              quote: "The team at Omni Wellness Media is professional, creative, and deeply committed to making a difference. We highly recommend their services.",
              author: "Michael Chen",
              role: "Sustainable Business Owner",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="card-standard hover-lift border-2 hover:border-rainbow-enhanced transition-all duration-300">
              <CardContent className="pt-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-rainbow-enhanced rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-high-contrast">{testimonial.author}</p>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
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