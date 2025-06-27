
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Business Development Consulting",
      description: "Strategic guidance for conscious businesses looking to create positive impact while achieving sustainable growth.",
      features: [
        "Brand Development & Strategy",
        "Market Analysis & Research", 
        "Sustainability Consulting",
        "Corporate Culture Alignment",
        "NPO Project Integration",
        "Impact Measurement"
      ],
      icon: "🚀",
      link: "/services/business-consulting"
    },
    {
      title: "Media & Content Creation",
      description: "Authentic storytelling through video, photography, and multimedia content that resonates with diverse audiences.",
      features: [
        "Video Production & Editing",
        "Photography & Visual Content",
        "Documentary Storytelling",
        "Social Media Content",
        "Podcast Production",
        "Multimedia Campaigns"
      ],
      icon: "🎬",
      link: "/services/media-production"
    },
    {
      title: "Social Media Strategy",
      description: "Build authentic connections between brands and communities through meaningful engagement strategies.",
      features: [
        "Content Strategy & Planning",
        "Community Management", 
        "Platform Optimization",
        "Influencer Partnerships",
        "Analytics & Reporting",
        "Paid Social Campaigns"
      ],
      icon: "📱",
      link: "/services/social-media-strategy"
    },
    {
      title: "Web Development",
      description: "Modern, responsive digital solutions that reflect your brand's values and drive meaningful engagement.",
      features: [
        "Website Design & Development",
        "SEO Optimization",
        "User Experience Design",
        "E-commerce Solutions",
        "Digital Marketing Strategy",
        "Analytics & Reporting"
      ],
      icon: "💻",
      link: "/services/web-development"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Comprehensive solutions that align with your values and amplify your impact. 
              From strategy to execution, we're your partners in conscious growth.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card 
                  key={service.title}
                  className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border-0 shadow-md group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{service.icon}</span>
                      <CardTitle className="font-heading text-2xl">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 bg-rainbow-gradient rounded-full mr-3 flex-shrink-0"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={service.link} className="inline-flex items-center justify-center">
                        Learn More & Get Quote
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Process</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We follow a structured yet flexible approach to ensure every project delivers maximum impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Discovery", desc: "Understanding your vision, values, and goals" },
                { step: "02", title: "Strategy", desc: "Developing a comprehensive plan for success" },
                { step: "03", title: "Creation", desc: "Bringing your story to life with authentic content" },
                { step: "04", title: "Impact", desc: "Measuring results and optimizing for growth" }
              ].map((phase, index) => (
                <div 
                  key={phase.step}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 bg-rainbow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{phase.step}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{phase.title}</h3>
                  <p className="text-gray-600">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Ready to Create <span className="bg-rainbow-gradient bg-clip-text text-transparent">Positive Change</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's work together to amplify your impact and create content that inspires meaningful change in your community.
            </p>
            <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
