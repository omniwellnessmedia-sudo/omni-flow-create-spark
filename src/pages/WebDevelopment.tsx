
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Code, Smartphone, Zap, Shield, Calendar, Download, Calculator, CheckCircle, Globe, ShoppingCart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalComBooking } from "@/components/booking/CalComBooking";

const WebDevelopment = () => {
  const [projectData, setProjectData] = useState({ type: '', pages: '', features: [], timeline: '' });
  const [estimate, setEstimate] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', website: '', needs: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.needs) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-service-quote', {
        body: {
          name: formData.name,
          email: formData.email,
          service_type: 'Web Development',
          project_details: `Website Need: ${formData.needs}\nCurrent Website: ${formData.website || 'None'}`,
          company: formData.website,
        }
      });
      if (error) throw error;
      toast.success("Quote request submitted!", { description: "We'll get back to you within 24 hours." });
      setFormData({ name: '', email: '', website: '', needs: '' });
    } catch (error) {
      console.error("Quote submission error:", error);
      toast.error("Failed to submit quote request", { description: "Please try again or contact us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimate = () => {
    const baseCosts = {
      'landing': 2500,
      'business': 5000,
      'ecommerce': 8000,
      'custom': 12000
    };

    const featureCosts = {
      'cms': 1000,
      'ecommerce': 2000,
      'booking': 1500,
      'membership': 2500,
      'analytics': 500,
      'seo': 800
    };

    if (projectData.type && projectData.pages) {
      const baseCost = baseCosts[projectData.type] || 0;
      const pages = parseInt(projectData.pages) || 1;
      const pageMultiplier = pages > 10 ? 1.5 : pages > 5 ? 1.2 : 1;
      const featureCost = projectData.features.reduce((sum, feature) => sum + (featureCosts[feature] || 0), 0);
      
      const totalEstimate = Math.round((baseCost * pageMultiplier) + featureCost);
      const timeline = projectData.type === 'custom' ? '8-12 weeks' : 
                     projectData.type === 'ecommerce' ? '6-10 weeks' : 
                     pages > 10 ? '4-8 weeks' : '2-6 weeks';

      setEstimate({
        low: Math.round(totalEstimate * 0.8),
        high: Math.round(totalEstimate * 1.2),
        timeline
      });
    }
  };

  const handleFeatureChange = (feature, checked) => {
    setProjectData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const features = [
    { id: 'cms', label: 'Content Management System', price: '+$1,000' },
    { id: 'ecommerce', label: 'E-commerce Integration', price: '+$2,000' },
    { id: 'booking', label: 'Booking System', price: '+$1,500' },
    { id: 'membership', label: 'Membership Portal', price: '+$2,500' },
    { id: 'analytics', label: 'Advanced Analytics', price: '+$500' },
    { id: 'seo', label: 'SEO Optimization', price: '+$800' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
                Build <span className="text-gradient-rainbow">Powerful Websites</span> That Convert
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Custom web solutions that reflect your brand values and drive results. From stunning designs 
                to robust e-commerce platforms, we create digital experiences that inspire and convert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Globe className="mr-2 w-5 h-5" />
                  View Our Work
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg rounded-full border-2"
                  asChild
                >
                  <a href="mailto:omniwellnessmedia@gmail.com?subject=Web Strategy Guide Request">
                  <Download className="mr-2 w-5 h-5" />
                  Request Strategy Guide
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-600">
                <div className="flex items-center min-h-[44px]"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Mobile-First Design</div>
                <div className="flex items-center min-h-[44px]"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />SEO Optimized</div>
                <div className="flex items-center min-h-[44px]"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Lightning Fast</div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <h3 className="font-heading font-bold text-2xl mb-6 text-center">Get Your Website Quote</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Current Website (if any)</Label>
                    <Input 
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://yoursite.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="needs">Primary Website Need</Label>
                    <Select onValueChange={(value) => setFormData({...formData, needs: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your main need" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Website</SelectItem>
                        <SelectItem value="redesign">Website Redesign</SelectItem>
                        <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                        <SelectItem value="optimization">Performance Optimization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleQuoteSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 rounded-full"
                  >
                    {isSubmitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Submitting...</> : 'Get My Custom Quote'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
              Website <span className="text-gradient-rainbow">Cost Calculator</span>
            </h2>
            <p className="text-lg text-gray-600">Get an instant estimate for your web development project</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-3 w-6 h-6" />
                Web Development Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <Label className="text-sm font-medium">Website Type</Label>
                  <Select onValueChange={(value) => setProjectData({...projectData, type: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="business">Business Website</SelectItem>
                      <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                      <SelectItem value="custom">Custom Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Number of Pages</Label>
                  <Input 
                    type="number"
                    value={projectData.pages}
                    onChange={(e) => setProjectData({...projectData, pages: e.target.value})}
                    placeholder="5"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="mb-8">
                <Label className="text-sm font-medium mb-4 block">Additional Features</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-3">
                      <Checkbox 
                        id={feature.id}
                        checked={projectData.features.includes(feature.id)}
                        onCheckedChange={(checked) => handleFeatureChange(feature.id, checked)}
                      />
                      <label htmlFor={feature.id} className="text-sm cursor-pointer">
                        {feature.label} <span className="text-green-600 font-semibold">{feature.price}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={calculateEstimate} className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 mb-6">
                Calculate Project Cost
              </Button>
              
              {estimate && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 text-indigo-800">Your Project Estimate:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}</div>
                      <div className="text-sm text-indigo-700">Project Cost Range</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{estimate.timeline}</div>
                      <div className="text-sm text-indigo-700">Development Timeline</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Complete <span className="text-gradient-rainbow">Web Solutions</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Code, title: "Custom Development", desc: "Bespoke web applications built to your exact specifications" },
              { icon: Smartphone, title: "Responsive Design", desc: "Mobile-first designs that look perfect on every device" },
              { icon: ShoppingCart, title: "E-commerce Solutions", desc: "Full-featured online stores with secure payment processing" },
              { icon: Zap, title: "Performance Optimization", desc: "Lightning-fast websites optimized for speed and SEO" },
              { icon: Shield, title: "Security & Maintenance", desc: "Ongoing security updates and performance monitoring" },
              { icon: Globe, title: "SEO & Analytics", desc: "Built-in SEO optimization and comprehensive analytics setup" }
            ].map((service, index) => (
              <Card key={service.title} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <service.icon className="w-12 h-12 text-indigo-600 mb-4" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{service.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Our <span className="text-gradient-rainbow">Recent Work</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore some of our latest web development projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "E-commerce Store", type: "Online Shop", desc: "Full-featured online store with secure payments and inventory management" },
              { title: "Business Website", type: "Corporate", desc: "Professional website with lead generation and CRM integration" },
              { title: "Community Platform", type: "Web App", desc: "Interactive platform connecting wellness providers with clients" },
              { title: "Booking System", type: "SaaS", desc: "Custom booking and scheduling solution for service businesses" },
              { title: "Non-Profit Portal", type: "Non-Profit", desc: "Donation management and volunteer coordination system" },
              { title: "Health Dashboard", type: "Healthcare", desc: "Patient portal with secure data management and reporting" }
            ].map((project, index) => (
              <Card key={project.title} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Globe className="w-16 h-16 text-white/80" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">{project.type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{project.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Modern <span className="text-gradient-rainbow">Technology Stack</span>
            </h2>
            <p className="text-lg text-gray-600">We use cutting-edge technologies to build fast, secure, and scalable websites</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "React", desc: "Modern UI Framework" },
              { name: "Next.js", desc: "Full-Stack Framework" },
              { name: "TypeScript", desc: "Type-Safe Development" },
              { name: "Tailwind CSS", desc: "Utility-First Styling" },
              { name: "Node.js", desc: "Server-Side Runtime" },
              { name: "MongoDB", desc: "NoSQL Database" },
              { name: "AWS", desc: "Cloud Infrastructure" },
              { name: "Stripe", desc: "Payment Processing" }
            ].map((tech, index) => (
              <Card key={tech.name} className="text-center bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
            Ready to Build Your Digital Presence?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a free technical consultation to discuss your project requirements and get a detailed development roadmap.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="font-heading font-bold text-2xl mb-6 text-gray-900">Schedule Your Technical Consultation</h3>
            <div className="text-gray-900 mb-6">
              <p className="mb-2">💻 Technical requirements analysis</p>
              <p className="mb-2">🎨 Design and UX consultation</p>
              <p className="mb-2">📊 Project roadmap and timeline</p>
              <p>💰 Detailed pricing breakdown</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6 border border-indigo-200">
              <p className="text-indigo-800 font-medium">✓ Click below to schedule your free technical consultation</p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg min-h-[44px]"
              asChild
            >
              <a href="mailto:omniwellnessmedia@gmail.com?subject=Web Development Consultation Request">
                <Calendar className="mr-2 w-5 h-5" />
                Email to Book Consultation
              </a>
            </Button>
            <div className="mt-6">
              <CalComBooking 
                eventTypeSlug="web-consultation"
                calUsername="omni-wellness-media-gqj9mj"
                buttonText="Book Web Consultation with Cal.com"
                buttonClassName="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebDevelopment;
