import { useState } from "react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalComBooking } from "@/components/booking/CalComBooking";
import { FloatingDecorations } from "@/components/ui/gaia-elements";
import { CuratorTip } from "@/components/curator/CuratorTip";
import { omniVoice } from "@/data/omniVoiceGuide";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    service: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: formData
      });
      if (error) throw error;
      toast({
        title: "Message Sent! ✨",
        description: omniVoice.contactResponses.success
      });
      setFormData({
        name: "",
        email: "",
        organization: "",
        service: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Oops!",
        description: omniVoice.contactResponses.error,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
          <FloatingDecorations variant="hero" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="heading-secondary text-gradient-hero no-faded-text">
              {omniVoice.pageIntros.contact.headline}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              {omniVoice.pageIntros.contact.subheadline}
            </p>
            
            {/* Curator Welcome */}
            <div className="max-w-xl mx-auto">
              <CuratorTip 
                curator="chad" 
                message={omniVoice.curatorVoices.chad.intro}
                variant="inline"
              />
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-white relative overflow-hidden">
          <FloatingDecorations variant="subtle" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl mb-2">{omniVoice.ctas.start}</CardTitle>
                  <CardDescription>
                    Tell us about your vision and how we can help bring it to life. {omniVoice.reassurance.noPressure}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name" 
                          required 
                          value={formData.name} 
                          onChange={e => handleInputChange("name", e.target.value)} 
                          placeholder="Your full name" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          required 
                          value={formData.email} 
                          onChange={e => handleInputChange("email", e.target.value)} 
                          placeholder="your.email@example.com" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="organization">Organization/Company</Label>
                      <Input 
                        id="organization" 
                        value={formData.organization} 
                        onChange={e => handleInputChange("organization", e.target.value)} 
                        placeholder="Your organization name (optional)" 
                      />
                    </div>

                    <div>
                      <Label htmlFor="service">Service of Interest</Label>
                      <Select value={formData.service} onValueChange={value => handleInputChange("service", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business-development">Business Development Consulting</SelectItem>
                          <SelectItem value="content-creation">Media & Content Creation</SelectItem>
                          <SelectItem value="community-engagement">Community Engagement</SelectItem>
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="ai-tools">AI Tools & Strategy</SelectItem>
                          <SelectItem value="multiple">Multiple Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Project Details *</Label>
                      <Textarea 
                        id="message" 
                        required 
                        value={formData.message} 
                        onChange={e => handleInputChange("message", e.target.value)} 
                        placeholder="Tell us about your project, goals, timeline, and how we can help..." 
                        className="min-h-[120px]" 
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 text-lg rounded-full shadow-lg">
                      {omniVoice.ctas.contact}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      Our Location
                    </h3>
                    <p className="text-gray-600 mb-2">Cape Town, South Africa</p>
                    <p className="text-gray-600">Serving communities across Africa and beyond</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                      <span className="text-2xl">✉️</span>
                      Get in Touch
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>📧 admin@omniwellnessmedia.co.za</p>
                      <p>📱 +27 74 831 5961</p>
                      <p>🕐 Mon - Fri, 9AM - 5PM SAST</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                      <span className="text-2xl">🤝</span>
                      Partnership Opportunities
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Interested in partnering with us? We collaborate with:
                    </p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• NPOs and community organizations</li>
                      <li>• Conscious businesses and social enterprises</li>
                      <li>• Educational institutions</li>
                      <li>• Media and content creators</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      Book a Discovery Call
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {omniVoice.reassurance.takeYourTime}
                    </p>
                    <CalComBooking 
                      eventTypeSlug="discovery-call"
                      calUsername="omni-wellness-media-gqj9mj"
                      buttonText="Book Discovery Call"
                      buttonClassName="w-full"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-rainbow-subtle border-0">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-heading font-semibold text-xl mb-2">
                      Follow Our Journey
                    </h3>
                    <p className="text-gray-600 mb-4">Stay connected with our latest projects and insights</p>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                      <Button variant="outline" size="sm" className="rounded-full text-xs sm:text-sm" asChild>
                        <a href="https://www.facebook.com/omniwellnessmedia" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full text-xs sm:text-sm" asChild>
                        <a href="https://www.instagram.com/omniwellnessmedia/" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full text-xs sm:text-sm" asChild>
                        <a href="https://www.linkedin.com/company/omniwellnessmedia" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full text-xs sm:text-sm" asChild>
                        <a href="https://www.youtube.com/@omniwellnessmedia" target="_blank" rel="noopener noreferrer">📺 YouTube</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <FloatingDecorations variant="section" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Frequently Asked <span className="text-gradient-rainbow">Questions</span>
              </h2>
              <p className="text-muted-foreground mt-4">
                {omniVoice.reassurance.covered}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "What types of projects do you work on?",
                  answer: "We work on a wide range of projects including community documentaries, business development consulting, brand storytelling, social media campaigns, and wellness program development."
                },
                {
                  question: "How long does a typical project take?",
                  answer: "Project timelines vary depending on scope and complexity. Simple content projects may take 2-4 weeks, while comprehensive campaigns or documentaries can take 2-6 months."
                },
                {
                  question: "Do you work with organizations outside South Africa?",
                  answer: "Yes! While we're based in South Africa, we work with organizations globally, especially those focused on community development, wellness, and social impact."
                },
                {
                  question: "What makes your approach different?",
                  answer: "We focus on authentic storytelling that bridges communities and creates real impact. Our holistic approach combines conscious business development with genuine community engagement."
                }
              ].map((faq, index) => (
                <Card 
                  key={faq.question} 
                  className="border-0 shadow-md animate-fade-in-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
