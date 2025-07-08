
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
    },
    {
      title: "Videography Services",
      description: "Crafting visual stories that matter through genuine partnerships and conscious media experiences.",
      features: [
        "Non-profit Campaign Videos",
        "Educational Content Creation",
        "Corporate Responsibility Films",
        "Event Documentation",
        "Interview & Testimonial Videos",
        "Commercial Video Production"
      ],
      icon: "🎥",
      link: "/services/videography"
    },
    {
      title: "Documentary Production",
      description: "Authentic storytelling through documentary films with ethical filmmaking practices and deep research.",
      features: [
        "Full-length Documentary Production",
        "Short-form Documentary Films",
        "Concept Development & Research",
        "Ethical Filmmaking Practices",
        "Post-production & Editing",
        "Impact Distribution Strategy"
      ],
      icon: "🎞️",
      link: "/services/documentary-production"
    },
    {
      title: "Custom Art & Illustration",
      description: "Commissioned artwork that tells your story through bespoke visual experiences and artistic consultation.",
      features: [
        "Custom Illustration Work",
        "Commissioned Graffiti Art",
        "Murals & Large-scale Artwork",
        "Brand Visual Identity Design",
        "Artistic Consultation",
        "Concept Development"
      ],
      icon: "🎨",
      link: "/services/custom-art"
    },
    {
      title: "Strategic Consultation",
      description: "Building lasting partnerships through conscious communication and deep understanding of your mission.",
      features: [
        "Initial Project Consultation",
        "Story Development Guidance",
        "Media Strategy Planning",
        "Ethical Storytelling Workshops",
        "Impact Measurement Planning",
        "Partnership Development"
      ],
      icon: "💡",
      link: "/services/consultation"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-wellness-subtle-gradient">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl mb-8 text-wellness-primary leading-tight">
              Conscious <span className="text-wellness-accent">Services</span>
            </h1>
            <p className="text-xl sm:text-2xl text-wellness-deep mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Premium solutions that align with your values and amplify your impact through conscious growth and authentic storytelling.
            </p>
          </div>
        </section>

        {/* Core Services Grid */}
        <section className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-heading font-bold text-4xl sm:text-5xl mb-8 text-wellness-primary">
                What We <span className="text-wellness-accent">Create</span>
              </h2>
              <p className="text-xl text-wellness-deep max-w-3xl mx-auto leading-relaxed font-light">
                Premium solutions crafted with intention, designed to amplify your authentic voice and create lasting impact.
              </p>
            </div>

            {/* Core 4 Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {services.slice(0, 4).map((service, index) => (
                <Card 
                  key={service.title}
                  className="group hover:shadow-wellness-lg transition-all duration-700 border-0 shadow-wellness hover:-translate-y-3 bg-white overflow-hidden rounded-3xl"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardHeader className="pb-6 p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-4xl bg-wellness-glow p-4 rounded-2xl group-hover:bg-wellness-accent group-hover:text-white transition-all duration-500">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="font-heading text-2xl text-wellness-primary group-hover:text-wellness-accent transition-colors mb-3 leading-tight">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-wellness-deep text-lg leading-relaxed font-light">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-8">
                    <div className="space-y-4 mb-10">
                      {service.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-center text-wellness-deep">
                          <div className="w-2 h-2 bg-wellness-accent rounded-full mr-4 flex-shrink-0"></div>
                          <span className="text-base font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="premium"
                      asChild 
                      className="w-full py-4 px-6 rounded-2xl text-lg font-medium"
                    >
                      <Link to={service.link} className="inline-flex items-center justify-center">
                        Explore Service
                        <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Services Expandable */}
            <div className="text-center">
              <details className="group">
                <summary className="cursor-pointer inline-flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  <span>View All Services</span>
                  <svg className="w-5 h-5 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.slice(4).map((service, index) => (
                    <Card 
                      key={service.title}
                      className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200 bg-white"
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="text-3xl mb-3">{service.icon}</div>
                        <CardTitle className="font-heading text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-sm">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button 
                          asChild 
                          variant="outline"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Link to={service.link}>
                            Learn More
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-28 bg-wellness-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-heading font-bold text-4xl sm:text-5xl mb-8 text-wellness-primary">
                Our <span className="text-wellness-accent">Approach</span>
              </h2>
              <p className="text-xl text-wellness-deep max-w-4xl mx-auto leading-relaxed font-light">
                A refined, intentional process that ensures every project delivers meaningful impact through conscious collaboration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Discovery", desc: "Deep understanding of your vision, values, and authentic purpose" },
                { step: "02", title: "Strategy", desc: "Crafting a comprehensive roadmap for conscious growth" },
                { step: "03", title: "Creation", desc: "Bringing your story to life through premium, authentic content" },
                { step: "04", title: "Impact", desc: "Measuring meaningful results and optimizing for lasting change" }
              ].map((phase, index) => (
                <div 
                  key={phase.step}
                  className="text-center animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-20 h-20 bg-wellness-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-wellness group-hover:shadow-wellness-lg transition-all duration-500">
                    <span className="text-white font-bold text-xl">{phase.step}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-2xl mb-4 text-wellness-primary">{phase.title}</h3>
                  <p className="text-wellness-deep leading-relaxed font-light">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-4xl sm:text-5xl mb-8 text-wellness-primary leading-tight">
              Ready to Create <span className="text-wellness-accent">Lasting Impact</span>?
            </h2>
            <p className="text-xl text-wellness-deep mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Let's collaborate to amplify your authentic voice and create premium content that drives meaningful change in your community.
            </p>
            <Button 
              variant="premium" 
              asChild 
              size="lg" 
              className="px-12 py-4 text-xl rounded-2xl"
            >
              <Link to="/contact">Begin Your Journey</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
