import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Star, Users, Camera, Film } from "lucide-react";

const Videography = () => {
  const packages = [
    {
      name: "Starter Package",
      price: "R8,500",
      duration: "Half Day Shoot",
      features: [
        "4 hours of filming",
        "Basic editing & color correction",
        "1 final video (up to 3 minutes)",
        "2 rounds of revisions",
        "HD 1080p delivery",
        "Background music licensing"
      ],
      ideal: "Social media content, basic promotional videos"
    },
    {
      name: "Professional Package",
      price: "R15,000",
      duration: "Full Day Shoot",
      features: [
        "8 hours of filming",
        "Advanced editing & motion graphics",
        "2 final videos (up to 5 minutes each)",
        "Unlimited revisions",
        "4K Ultra HD delivery",
        "Custom soundtrack creation",
        "Drone footage (if applicable)",
        "Professional lighting setup"
      ],
      ideal: "Corporate videos, event documentation, testimonials",
      popular: true
    },
    {
      name: "Premium Package",
      price: "R25,000",
      duration: "Multi-Day Project",
      features: [
        "16+ hours of filming over multiple days",
        "Premium post-production suite",
        "Multiple deliverables (various lengths)",
        "Unlimited revisions",
        "4K & 8K delivery options",
        "Original music composition",
        "Advanced drone cinematography",
        "Professional crew (2-3 people)",
        "Script development support",
        "Distribution strategy consultation"
      ],
      ideal: "Documentary-style content, major campaigns, series production"
    }
  ];

  const portfolio = [
    {
      title: "Valley of Plenty Community Project",
      description: "Documenting sustainable development in Hanover Park",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800",
      category: "Documentary"
    },
    {
      title: "Human Animal Project",
      description: "Advocacy campaign for animal rights and compassionate living",
      thumbnail: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=800",
      category: "Campaign"
    },
    {
      title: "Corporate Wellness Initiative",
      description: "Employee wellness program launch for major corporation",
      thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
      category: "Corporate"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-rainbow-subtle opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-rainbow-gradient text-white">Premium Service</Badge>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
                  Professional <span className="bg-rainbow-gradient bg-clip-text text-transparent">Videography</span> Services
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Crafting visual stories that matter through genuine partnerships. We believe in taking time 
                  to understand your vision and building extraordinary content together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                    <Link to="/contact">Get Quote</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                    <Play className="w-5 h-5 mr-2" />
                    View Portfolio
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800"
                  alt="Professional videography equipment"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                What We <span className="bg-rainbow-gradient bg-clip-text text-transparent">Create</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From non-profit campaigns to corporate documentaries, we create visual content that drives real impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Camera, title: "Campaign Videos", desc: "Non-profit and awareness campaigns that inspire action" },
                { icon: Film, title: "Educational Content", desc: "Training videos and educational materials that engage" },
                { icon: Users, title: "Corporate Films", desc: "CSR documentaries and company culture videos" },
                { icon: Play, title: "Event Documentation", desc: "Capturing your important moments and milestones" },
                { icon: Star, title: "Testimonials", desc: "Authentic interviews that build trust and credibility" },
                { icon: CheckCircle, title: "Commercial Content", desc: "Product showcases and brand storytelling" }
              ].map((service, index) => (
                <Card key={service.title} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <service.icon className="w-12 h-12 text-omni-indigo mb-4" />
                    <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Service <span className="bg-rainbow-gradient bg-clip-text text-transparent">Packages</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose the package that best fits your project needs and budget.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card key={pkg.name} className={`relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${pkg.popular ? 'ring-2 ring-rainbow-gradient scale-105' : ''}`}>
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-rainbow-gradient text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="font-heading text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-omni-indigo mb-2">{pkg.price}</div>
                    <CardDescription className="text-lg">{pkg.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 bg-rainbow-subtle rounded-lg mb-6">
                      <p className="text-sm text-gray-600"><strong>Ideal for:</strong> {pkg.ideal}</p>
                    </div>
                    <Button asChild className="w-full bg-rainbow-gradient hover:opacity-90 text-white font-semibold py-3 rounded-full">
                      <Link to="/contact">Choose Package</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Preview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Recent <span className="bg-rainbow-gradient bg-clip-text text-transparent">Work</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover how we've helped other organizations tell their stories and create meaningful impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolio.map((project, index) => (
                <Card key={project.title} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative group">
                    <img 
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-rainbow-gradient text-white">
                      {project.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline" className="font-semibold px-8 py-3 text-lg rounded-full">
                <Link to="/portfolio">View Full Portfolio</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Ready to Tell Your <span className="bg-rainbow-gradient bg-clip-text text-transparent">Story</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's create powerful visual content that resonates with your audience and drives meaningful change in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                <Link to="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Videography;