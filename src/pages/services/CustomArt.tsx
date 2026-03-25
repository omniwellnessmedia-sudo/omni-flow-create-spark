import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Palette, Brush, Image, Users, Star, Zap } from "lucide-react";
import { IMAGES } from "@/lib/images";

const CustomArt = () => {
  const artServices = [
    {
      title: "Custom Illustration",
      description: "Bespoke digital and traditional illustrations for brands, publications, and personal projects",
      features: ["Character design", "Editorial illustrations", "Brand mascots", "Storyboard creation"],
      image: IMAGES.wellness.community,
      priceRange: "R2,500 - R15,000",
      timeline: "1-3 weeks"
    },
    {
      title: "Commissioned Graffiti Art",
      description: "Street art and murals that transform spaces and communicate powerful messages",
      features: ["Wall murals", "Graffiti installations", "Community art projects", "Event live painting"],
      image: IMAGES.providers.bwc,
      priceRange: "R8,000 - R50,000",
      timeline: "2-6 weeks"
    },
    {
      title: "Large-Scale Artwork",
      description: "Monumental pieces that make bold statements and transform environments",
      features: ["Building murals", "Public installations", "Corporate art pieces", "Gallery exhibitions"],
      image: IMAGES.wellness.team,
      priceRange: "R15,000 - R100,000+",
      timeline: "4-12 weeks"
    },
    {
      title: "Brand Visual Identity",
      description: "Comprehensive visual branding that captures your essence and values",
      features: ["Logo design", "Brand illustration style", "Pattern creation", "Visual guidelines"],
      image: IMAGES.wellness.graduation,
      priceRange: "R5,000 - R25,000",
      timeline: "2-4 weeks"
    }
  ];

  const portfolio = [
    {
      title: "Community Unity Mural",
      location: "Hanover Park Community Center",
      description: "A vibrant 50-meter mural celebrating diversity and unity in the community",
      image: IMAGES.wellness.communityProject2,
      category: "Mural"
    },
    {
      title: "Eco-Warriors Campaign",
      client: "Environmental NGO",
      description: "Character design and illustrations for environmental awareness campaign",
      image: IMAGES.wellness.landmark,
      category: "Illustration"
    },
    {
      title: "Corporate Headquarters Installation",
      client: "Tech Startup",
      description: "Modern abstract installation representing innovation and growth",
      image: IMAGES.wellness.retreat,
      category: "Installation"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Concept & Consultation",
      description: "Understanding your vision, space, and message",
      icon: Users
    },
    {
      step: "02",
      title: "Design Development",
      description: "Creating sketches, mood boards, and design proposals",
      icon: Palette
    },
    {
      step: "03",
      title: "Feedback & Refinement",
      description: "Collaborating to perfect the artistic direction",
      icon: Star
    },
    {
      step: "04",
      title: "Creation & Installation",
      description: "Bringing your vision to life with expert execution",
      icon: Brush
    }
  ];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-rainbow-subtle opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary text-white">Bespoke Artwork</Badge>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
                  Custom Art & <span className="text-primary">Illustration</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Commissioned artwork that tells your story through bespoke visual experiences. 
                  From illustrations to graffiti murals - we create art that inspires and transforms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                    <Link to="/contact">Commission Artwork</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                    <Image className="w-5 h-5 mr-2" />
                    View Gallery
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src={IMAGES.sandy.teaching}
                  alt="Artist creating custom illustration"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                <div className="absolute top-4 right-4">
                  <Palette className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Art Services */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our Art <span className="text-primary">Services</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From intimate illustrations to monumental murals, we create custom artwork that captures your vision and transforms spaces.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {artServices.map((service, index) => (
                <Card key={service.title} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-semibold">{service.priceRange}</p>
                      <p className="text-xs opacity-90">{service.timeline}</p>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-full">
                      <Link to="/contact">Get Quote</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Featured <span className="text-primary">Artwork</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore some of our most impactful custom artwork and commissioned pieces.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolio.map((project, index) => (
                <Card key={project.title} className="overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Badge className="absolute top-4 right-4 bg-primary text-white">
                      {project.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">{project.title}</CardTitle>
                    <p className="text-sm text-omni-indigo font-semibold">
                      {project.location || project.client}
                    </p>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline" className="font-semibold px-8 py-3 text-lg rounded-full">
                <Link to="/portfolio">View Complete Gallery</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Creative <span className="text-primary">Process</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our collaborative approach ensures your vision is realized through every stage of creation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <Card key={step.step} className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <step.icon className="w-8 h-8 text-omni-indigo mx-auto mb-2" />
                    <CardTitle className="font-heading text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Investment <span className="text-primary">Guide</span>
              </h2>
              <p className="text-lg text-gray-600">
                Transparent pricing for custom artwork that fits your budget and vision.
              </p>
            </div>
            
            <Card className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-4">Factors Affecting Price:</h3>
                  <ul className="space-y-2">
                    {[
                      "Size and complexity of artwork",
                      "Materials and medium required",
                      "Timeline and urgency",
                      "Location accessibility",
                      "Permits and legal requirements",
                      "Number of revisions needed"
                    ].map((factor) => (
                      <li key={factor} className="flex items-center text-gray-700">
                        <Zap className="w-4 h-4 text-omni-indigo mr-2" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-4">What's Included:</h3>
                  <ul className="space-y-2">
                    {[
                      "Initial consultation & concept development",
                      "Detailed sketches & design proposals",
                      "High-quality materials & supplies",
                      "Professional installation (if applicable)",
                      "Progress photos & documentation",
                      "Care instructions & warranty"
                    ].map((include) => (
                      <li key={include} className="flex items-center text-gray-700">
                        <Star className="w-4 h-4 text-green-500 mr-2" />
                        {include}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-4 bg-rainbow-subtle rounded-lg">
                <p className="text-center text-gray-700">
                  <strong>Free Consultation:</strong> We offer complimentary initial consultations to discuss your project and provide accurate quotes.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Ready to Create Something <span className="text-primary">Extraordinary</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's bring your vision to life through custom artwork that inspires, transforms, and tells your unique story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                <Link to="/contact">
                  Start Your Commission
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                <Link to="/portfolio">Explore Our Work</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomArt;