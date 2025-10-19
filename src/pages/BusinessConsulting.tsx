
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CheckCircle, TrendingUp, Users, Target, Calendar, Download, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { format } from "date-fns";

const BusinessConsulting = () => {
  const [roiData, setRoiData] = useState({ revenue: '', investment: '', timeframe: '' });
  const [roiResult, setRoiResult] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', challenge: '' });
  const { toast } = useToast();

  const calculateROI = () => {
    const revenue = parseFloat(roiData.revenue) || 0;
    const investment = parseFloat(roiData.investment) || 0;
    const months = parseFloat(roiData.timeframe) || 1;
    
    if (investment > 0) {
      const roi = ((revenue - investment) / investment) * 100;
      const monthlyReturn = revenue / months;
      setRoiResult({ roi: roi.toFixed(1), monthlyReturn: monthlyReturn.toFixed(0) });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-service-quote', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service_type: 'Business Consulting',
          project_details: formData.challenge,
          budget_range: null,
          timeline: null
        }
      });

      if (error) throw error;

      toast({
        title: "Assessment Request Submitted!",
        description: "We'll review your information and get back to you within 24 hours with your personalized assessment.",
      });
      setFormData({ name: '', email: '', company: '', challenge: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      company: "GreenTech Solutions",
      text: "Omni Wellness Media transformed our business strategy. We saw 300% growth in sustainable revenue streams within 6 months.",
      result: "300% Revenue Growth"
    },
    {
      name: "Marcus Williams",
      company: "Community Connect",
      text: "Their conscious business approach helped us align our values with profitability. We're now the leading B-Corp in our sector.",
      result: "B-Corp Certification"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 text-gradient-hero">
                Scale Your Conscious Business
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your business with strategic guidance that aligns profit with purpose. 
                Our proven methodology has helped 200+ businesses achieve sustainable growth while making positive impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg">
                  <Calendar className="mr-2 w-5 h-5" />
                  Book Free Strategy Call
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2">
                  <Download className="mr-2 w-5 h-5" />
                  Download Free Guide
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />No Long-term Contracts</div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />30-Day Money Back</div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Proven Results</div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <h3 className="font-heading font-bold text-2xl mb-6 text-center">Free Business Assessment</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
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
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="challenge">Biggest Business Challenge</Label>
                    <Textarea 
                      id="challenge"
                      value={formData.challenge}
                      onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 rounded-full">
                    Get My Free Assessment
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
              Calculate Your <span className="text-gradient-rainbow">ROI Potential</span>
            </h2>
            <p className="text-lg text-gray-600">See how much our consulting could increase your revenue</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-3 w-6 h-6" />
                Business Growth Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Label htmlFor="revenue" className="text-sm font-medium">Current Monthly Revenue ($)</Label>
                  <Input 
                    id="revenue"
                    type="number"
                    value={roiData.revenue}
                    onChange={(e) => setRoiData({...roiData, revenue: e.target.value})}
                    placeholder="50000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="investment" className="text-sm font-medium">Investment Budget ($)</Label>
                  <Input 
                    id="investment"
                    type="number"
                    value={roiData.investment}
                    onChange={(e) => setRoiData({...roiData, investment: e.target.value})}
                    placeholder="5000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe" className="text-sm font-medium">Timeframe (Months)</Label>
                  <Input 
                    id="timeframe"
                    type="number"
                    value={roiData.timeframe}
                    onChange={(e) => setRoiData({...roiData, timeframe: e.target.value})}
                    placeholder="6"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <Button onClick={calculateROI} className="w-full bg-gradient-rainbow hover:opacity-90 text-white font-semibold py-3 mb-6">
                Calculate My ROI
              </Button>
              
              {roiResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-4 text-green-800">Your Projected Results:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{roiResult.roi}%</div>
                      <div className="text-sm text-green-700">Return on Investment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">${roiResult.monthlyReturn}</div>
                      <div className="text-sm text-green-700">Monthly Revenue Increase</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Complete <span className="text-gradient-rainbow">Business Transformation</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach covers every aspect of conscious business development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Strategic Planning", desc: "Develop clear roadmaps for sustainable growth and impact measurement" },
              { icon: TrendingUp, title: "Revenue Optimization", desc: "Identify and implement new revenue streams aligned with your values" },
              { icon: Users, title: "Team Development", desc: "Build high-performing teams with shared vision and purpose" },
              { icon: CheckCircle, title: "Process Improvement", desc: "Streamline operations for maximum efficiency and minimal waste" },
              { icon: Target, title: "Market Positioning", desc: "Position your brand as a conscious leader in your industry" },
              { icon: TrendingUp, title: "Impact Measurement", desc: "Track both financial and social/environmental impact metrics" }
            ].map((service, index) => (
              <Card key={service.title} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <service.icon className="w-12 h-12 text-purple-600 mb-4" />
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

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Client <span className="text-gradient-rainbow">Success Stories</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="bg-white shadow-xl border-0 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-rainbow rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold inline-block">
                    {testimonial.result}
                  </div>
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
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a free 30-minute strategy session to discover how we can help you achieve sustainable growth while making positive impact.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h3 className="font-heading font-bold text-2xl mb-6 text-gray-900">Schedule Your Free Consultation</h3>
            <div className="text-gray-900 mb-6">
              <p className="mb-2">📅 30-minute strategy session</p>
              <p className="mb-2">💡 Personalized growth recommendations</p>
              <p className="mb-2">🎯 Clear action steps</p>
              <p>✅ No sales pressure, just value</p>
            </div>
            <BookingCalendar
              serviceTitle="Business Consulting Session"
              duration={30}
              price_zar={500}
              price_wellcoins={150}
              onBookingSelect={(date, time) => {
                toast({
                  title: "Booking Confirmed!",
                  description: `Your consultation is scheduled for ${format(date, 'EEEE, MMMM d, yyyy')} at ${time}. You'll receive a confirmation email shortly.`,
                });
              }}
            />
            <Button size="lg" className="bg-gradient-rainbow hover:opacity-90 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg">
              <Calendar className="mr-2 w-5 h-5" />
              Book My Free Session Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessConsulting;
