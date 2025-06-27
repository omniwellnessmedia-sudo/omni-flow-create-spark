
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      title: "Business Development Consulting",
      description: "Strategic guidance for conscious businesses looking to create positive impact while achieving sustainable growth.",
      features: ["Brand Development", "Strategic Planning", "Market Analysis", "Sustainability Consulting"]
    },
    {
      title: "Media & Content Creation",
      description: "Authentic storytelling through video, photography, and multimedia content that resonates with diverse audiences.",
      features: ["Video Production", "Photography", "Storytelling", "Documentary Work"]
    },
    {
      title: "Social Media Strategy",
      description: "Comprehensive social media strategies that build communities and drive meaningful engagement.",
      features: ["Content Planning", "Community Building", "Brand Voice", "Engagement Strategy"]
    },
    {
      title: "Web Development",
      description: "Modern, responsive websites that reflect your brand's values and drive conversions.",
      features: ["Responsive Design", "SEO Optimization", "User Experience", "Performance Optimization"]
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <CardTitle className="font-heading text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-rainbow-gradient rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
