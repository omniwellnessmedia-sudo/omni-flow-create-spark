
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";

const ServicesSection = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      title: "Business Development Consulting",
      description: "Strategic guidance for conscious businesses looking to create positive impact while achieving sustainable growth.",
      features: ["Brand Development", "Strategic Planning", "Market Analysis", "Sustainability Consulting"],
      color: "from-omni-red to-omni-orange",
      icon: "🚀",
      stats: "50+ businesses transformed"
    },
    {
      title: "Media & Content Creation",
      description: "Authentic storytelling through video, photography, and multimedia content that resonates with diverse audiences.",
      features: ["Video Production", "Photography", "Storytelling", "Documentary Work"],
      color: "from-omni-blue to-omni-indigo",
      icon: "🎬",
      stats: "100+ stories told"
    },
    {
      title: "Social Media Strategy",
      description: "Comprehensive social media strategies that build communities and drive meaningful engagement.",
      features: ["Content Planning", "Community Building", "Brand Voice", "Engagement Strategy"],
      color: "from-omni-green to-omni-blue",
      icon: "📱",
      stats: "1M+ people reached"
    },
    {
      title: "Web Development",
      description: "Modern, responsive websites that reflect your brand's values and drive conversions.",
      features: ["Responsive Design", "SEO Optimization", "User Experience", "Performance Optimization"],
      color: "from-omni-yellow to-omni-green",
      icon: "💻",
      stats: "25+ websites launched"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
            Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive solutions that align with your values and amplify your impact. 
            From strategy to execution, we're your partners in conscious growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up border-0 overflow-hidden relative"
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`h-2 bg-gradient-to-r ${service.color} group-hover:h-4 transition-all duration-300`}></div>
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl group-hover:scale-110 transition-transform duration-300 ${hoveredService === index ? 'animate-bounce' : ''}`}>
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="font-heading text-xl mb-1 group-hover:text-transparent group-hover:bg-rainbow-gradient group-hover:bg-clip-text transition-all duration-300">
                        {service.title}
                      </CardTitle>
                      <div className="text-xs text-gray-500 font-medium">
                        {service.stats}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div 
                      key={feature} 
                      className="flex items-center text-sm text-gray-700 p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors duration-300"
                    >
                      <span className="w-2 h-2 bg-rainbow-gradient rounded-full mr-3 flex-shrink-0"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Project Timeline</span>
                    <span className="text-sm font-medium text-gray-800">2-8 weeks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${service.color} transition-all duration-1000 ${hoveredService === index ? 'w-full' : 'w-1/3'}`}></div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-gray-200 hover:bg-rainbow-subtle hover:border-transparent group-hover:shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link to="/services">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
