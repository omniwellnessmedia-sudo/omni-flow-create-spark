
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Business Development Consulting",
      description: "Strategic guidance for conscious businesses looking to create positive impact while achieving sustainable growth.",
      features: ["Brand Development", "Strategic Planning", "Market Analysis", "Sustainability Consulting"],
      icon: "🚀",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Media & Content Creation",
      description: "Authentic storytelling through video, photography, and multimedia content that resonates with diverse audiences.",
      features: ["Video Production", "Photography", "Storytelling", "Documentary Work"],
      icon: "🎬",
      color: "from-orange-500 to-yellow-500"
    },
    {
      title: "Social Media Strategy",
      description: "Comprehensive social media strategies that build communities and drive meaningful engagement.",
      features: ["Content Planning", "Community Building", "Brand Voice", "Engagement Strategy"],
      icon: "📱",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Web Development",
      description: "Modern, responsive websites that reflect your brand's values and drive conversions.",
      features: ["Responsive Design", "SEO Optimization", "User Experience", "Performance Optimization"],
      icon: "💻",
      color: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
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

        {/* Interactive Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service, index) => (
            <button
              key={service.title}
              onClick={() => setActiveService(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeService === index
                  ? 'bg-rainbow-gradient text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span className="mr-2">{service.icon}</span>
              {service.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Service Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className={`w-full h-80 rounded-2xl bg-gradient-to-br ${services[activeService].color} p-8 flex items-center justify-center text-white shadow-2xl`}>
              <div className="text-center">
                <div className="text-8xl mb-4">{services[activeService].icon}</div>
                <h3 className="font-heading font-bold text-2xl">{services[activeService].title}</h3>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h3 className="font-heading font-bold text-3xl mb-4">{services[activeService].title}</h3>
            <p className="text-gray-600 text-lg mb-6">{services[activeService].description}</p>
            <div className="space-y-3 mb-8">
              {services[activeService].features.map((feature, index) => (
                <div key={feature} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              asChild 
              className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full shadow-lg group"
            >
              <Link to="/services" className="inline-flex items-center">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              variant="standard"
              className={`hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up cursor-pointer ${
                activeService === index ? 'ring-2 ring-rainbow-gradient' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={() => setActiveService(index)}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{service.icon}</span>
                  <CardTitle variant="clamp" className="font-heading text-xl">{service.title}</CardTitle>
                </div>
                <CardDescription variant="clamp" className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-rainbow-gradient rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline"
                  className="w-full card-button-standard"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to service detail
                  }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
