
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, Video, Share2, Globe } from "lucide-react";

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Business Development Consulting",
      description: "Strategic guidance for conscious businesses looking to create positive impact while achieving sustainable growth.",
      features: ["Brand Development", "Strategic Planning", "Market Analysis", "Sustainability Consulting"],
      icon: Briefcase,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
      link: "/services/business-consulting"
    },
    {
      title: "Media & Content Creation",
      description: "Authentic storytelling through video, photography, and multimedia content that resonates with diverse audiences.",
      features: ["Video Production", "Photography", "Storytelling", "Documentary Work"],
      icon: Video,
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&auto=format&fit=crop",
      link: "/services/media-production"
    },
    {
      title: "Social Media Strategy",
      description: "Comprehensive social media strategies that build communities and drive meaningful engagement.",
      features: ["Content Planning", "Community Building", "Brand Voice", "Engagement Strategy"],
      icon: Share2,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop",
      link: "/services/social-media-strategy"
    },
    {
      title: "Web Development",
      description: "Modern, responsive websites that reflect your brand's values and drive conversions.",
      features: ["Responsive Design", "SEO Optimization", "User Experience", "Performance Optimization"],
      icon: Globe,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      link: "/services/web-development"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up" data-tour="services">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Our <span className="text-gradient-hero">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive solutions that align with your values and amplify your impact. 
            From strategy to execution, we're your partners in conscious growth.
          </p>
        </div>

        {/* Services Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative p-8 md:p-10 min-h-[400px] flex flex-col justify-end">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => navigate(service.link)}
                    className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold rounded-full shadow-lg group-hover:shadow-xl transition-all"
                    size="lg"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-12 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Transform Your Vision?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's create something meaningful together. Schedule a free consultation to discuss your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-8 shadow-lg"
            >
              <Link to="/contact">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-2 border-purple-600 text-purple-700 hover:bg-purple-50 rounded-full px-8"
            >
              <Link to="/services">
                View All Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
