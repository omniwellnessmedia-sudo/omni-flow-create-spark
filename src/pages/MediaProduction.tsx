
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Play, Camera, Mic, Film, Calendar, Download, Calculator, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MediaProduction = () => {
  const [projectData, setProjectData] = useState({ type: '', duration: '', complexity: '' });
  const [estimate, setEstimate] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', project: '', budget: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.project) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-service-quote', {
        body: {
          name: formData.name,
          email: formData.email,
          service_type: 'Media Production',
          project_details: `Project Type: ${formData.project}\nBudget Range: ${formData.budget || 'Not specified'}`,
          budget_range: formData.budget,
        }
      });
      if (error) throw error;
      toast.success("Quote request submitted!", { description: "We'll get back to you within 24 hours." });
      setFormData({ name: '', email: '', project: '', budget: '' });
    } catch (error) {
      console.error("Quote submission error:", error);
      toast.error("Failed to submit quote request", { description: "Please try again or contact us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimate = () => {
    const baseCosts = {
      video: { simple: 2000, medium: 5000, complex: 10000 },
      documentary: { simple: 8000, medium: 15000, complex: 30000 },
      commercial: { simple: 5000, medium: 12000, complex: 25000 },
      social: { simple: 800, medium: 2000, complex: 4000 }
    };

    const duration = parseInt(projectData.duration) || 1;
    const multiplier = duration > 5 ? 1.5 : duration > 2 ? 1.2 : 1;
    
    if (projectData.type && projectData.complexity && baseCosts[projectData.type]) {
      const baseCost = baseCosts[projectData.type][projectData.complexity];
      const finalEstimate = Math.round(baseCost * multiplier);
      setEstimate({
        low: Math.round(finalEstimate * 0.8),
        high: Math.round(finalEstimate * 1.2),
        timeline: duration > 5 ? '6-12 weeks' : duration > 2 ? '3-6 weeks' : '1-3 weeks'
      });
    }
  };

  const portfolioItems = [
    { title: "The Conscious Content Creators", type: "Documentary", thumbnail: "🎬" },
    { title: "Uniting for Our Baboons", type: "Environmental", thumbnail: "🐒" },
    { title: "Legacy Beyond Success", type: "Business Story", thumbnail: "💼" },
    { title: "Indigenous Tour Kalk Bay", type: "Cultural", thumbnail: "🏛️" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 text-gradient-hero">
                Create Powerful Stories That Inspire
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                From documentaries to social media content, we craft authentic visual narratives that connect, 
                educate, and drive meaningful change. Award-winning production quality meets conscious storytelling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="mr-2 w-5 h-5" />
                  View Our Reel
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg rounded-full border-2"
                  onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=Media Production Guide Request', '_blank')}
                >
                  <Download className="mr-2 w-5 h-5" />
                  Request Production Guide
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-600">
                <div className="flex items-center min-h-[44px]"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />4K Production Quality</div>
                <div className="flex items-center min-h-[44px]"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Full Rights Included</div>
                <div className="flex items-center min-h-[44px]"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Fast Turnaround</div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <h3 className="font-heading font-bold text-2xl mb-6 text-center">Get Your Project Quote</h3>
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
                    <Label htmlFor="project">Project Type</Label>
                    <Select onValueChange={(value) => setFormData({...formData, project: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Promotional Video</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="social">Social Media Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5k">Under $5,000</SelectItem>
                        <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                        <SelectItem value="15k-30k">$15,000 - $30,000</SelectItem>
                        <SelectItem value="over-30k">Over $30,000</SelectItem>
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

      {/* Project Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
              Project <span className="text-gradient-rainbow">Cost Calculator</span>
            </h2>
            <p className="text-lg text-gray-600">Get an instant estimate for your video production project</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-3 w-6 h-6" />
                Video Production Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Label className="text-sm font-medium">Project Type</Label>
                  <Select onValueChange={(value) => setProjectData({...projectData, type: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Promotional Video</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration (minutes)</Label>
                  <Input 
                    type="number"
                    value={projectData.duration}
                    onChange={(e) => setProjectData({...projectData, duration: e.target.value})}
                    placeholder="3"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Complexity Level</Label>
                  <Select onValueChange={(value) => setProjectData({...projectData, complexity: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={calculateEstimate} className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 mb-6">
                Calculate Project Cost
              </Button>
              
              {estimate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 text-blue-800">Your Project Estimate:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}</div>
                      <div className="text-sm text-blue-700">Project Cost Range</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{estimate.timeline}</div>
                      <div className="text-sm text-blue-700">Production Timeline</div>
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
              Complete <span className="text-gradient-rainbow">Production Services</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Film, title: "Documentary Production", desc: "Full-service documentary creation from concept to distribution" },
              { icon: Camera, title: "Commercial Videos", desc: "High-impact promotional content that drives results" },
              { icon: Mic, title: "Podcast Production", desc: "Professional audio production and post-production services" },
              { icon: Play, title: "Social Media Content", desc: "Engaging short-form content optimized for each platform" },
              { icon: Camera, title: "Event Coverage", desc: "Comprehensive event documentation and highlights" },
              { icon: Film, title: "Brand Storytelling", desc: "Authentic narratives that showcase your brand values" }
            ].map((service, index) => (
              <Card key={service.title} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <service.icon className="w-12 h-12 text-blue-600 mb-4" />
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

      {/* Portfolio Showcase */}
      <section id="portfolio" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Featured <span className="text-gradient-rainbow">Work</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Indigenous Heritage Journey in Kalk Bay */}
            <Card className="bg-white shadow-xl border-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/ycYl7KSGkUU" 
                  title="An Indigenous Heritage Journey in Kalk Bay with Travel and Tours Cape Town" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">Indigenous Heritage Journey</h3>
                  <span className="bg-gradient-rainbow text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Cultural
                  </span>
                </div>
                <p className="text-gray-600 mb-4">A meaningful exploration of indigenous heritage in Kalk Bay with Travel and Tours Cape Town.</p>
                <Button variant="outline" className="w-full" onClick={() => window.open('https://www.youtube.com/watch?v=ycYl7KSGkUU', '_blank')}>
                  <Play className="mr-2 w-4 h-4" />
                  Watch Full Video
                </Button>
              </CardContent>
            </Card>

            {/* Uniting for Our Baboons */}
            <Card className="bg-white shadow-xl border-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/KuusruAQeT4" 
                  title="Uniting for Our Baboons – A Shared Mission" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">Uniting for Our Baboons</h3>
                  <span className="bg-gradient-rainbow text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Environmental
                  </span>
                </div>
                <p className="text-gray-600 mb-4">A shared mission to protect and preserve baboon communities through conscious conservation efforts.</p>
                <Button variant="outline" className="w-full" onClick={() => window.open('https://www.youtube.com/watch?v=KuusruAQeT4', '_blank')}>
                  <Play className="mr-2 w-4 h-4" />
                  Watch Full Video
                </Button>
              </CardContent>
            </Card>

            {/* Transform Your Workout with Omni */}
            <Card className="bg-white shadow-xl border-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/8KeDzKgGTHg" 
                  title="Transform your workout with Omni" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">Transform Your Workout</h3>
                  <span className="bg-gradient-rainbow text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Wellness
                  </span>
                </div>
                <p className="text-gray-600 mb-4">Discover how to transform your workout routine with Omni's holistic wellness approach.</p>
                <Button variant="outline" className="w-full" onClick={() => window.open('https://www.youtube.com/watch?v=8KeDzKgGTHg', '_blank')}>
                  <Play className="mr-2 w-4 h-4" />
                  Watch Full Video
                </Button>
              </CardContent>
            </Card>

            {/* Muizenberg Conference Interview */}
            <Card className="bg-white shadow-xl border-0 hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/uE1tcp9KP-Y" 
                  title="We ask Joah Pereira about the Muiz Electric conference" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">Muizenberg Electric Conference</h3>
                  <span className="bg-gradient-rainbow text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Interview
                  </span>
                </div>
                <p className="text-gray-600 mb-4">An insightful interview with Joah Pereira discussing the innovative Muizenberg Electric conference.</p>
                <Button variant="outline" className="w-full" onClick={() => window.open('https://www.youtube.com/watch?v=uE1tcp9KP-Y', '_blank')}>
                  <Play className="mr-2 w-4 h-4" />
                  Watch Full Video
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
            Ready to Tell Your Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a free creative consultation to discuss your vision and get a detailed project proposal.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="font-heading font-bold text-2xl mb-6 text-gray-900">Schedule Your Creative Consultation</h3>
            <div className="text-gray-900 mb-6">
              <p className="mb-2">🎬 45-minute creative session</p>
              <p className="mb-2">📋 Detailed project breakdown</p>
              <p className="mb-2">💰 Custom pricing proposal</p>
              <p>🎯 Timeline and deliverables</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 border border-blue-200">
              <p className="text-blue-800 font-medium">✓ Click below to schedule your free creative consultation</p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg min-h-[44px]"
              asChild
            >
              <a href="mailto:omniwellnessmedia@gmail.com?subject=Media Production Creative Session Request">
                <Calendar className="mr-2 w-5 h-5" />
                Book My Creative Session
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MediaProduction;
