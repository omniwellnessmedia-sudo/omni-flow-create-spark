import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, Lightbulb, TrendingUp, MessageCircle, Calendar } from "lucide-react";

const Consultation = () => {
  const consultationTypes = [
    {
      title: "Strategic Media Planning",
      duration: "2-4 weeks",
      description: "Comprehensive media strategy development for conscious organizations",
      includes: [
        "Audience research & persona development",
        "Content strategy roadmap",
        "Platform selection & optimization",
        "Budget allocation planning",
        "KPI setting & measurement framework"
      ],
      price: "R12,000 - R25,000",
      icon: Target
    },
    {
      title: "Ethical Storytelling Workshop",
      duration: "1-2 days",
      description: "Training sessions on conscious communication and authentic brand storytelling",
      includes: [
        "Storytelling framework development",
        "Brand voice & messaging alignment",
        "Cultural sensitivity training",
        "Stakeholder engagement strategies",
        "Impact measurement methodologies"
      ],
      price: "R8,000 - R15,000",
      icon: MessageCircle
    },
    {
      title: "Impact Measurement Planning",
      duration: "1-3 weeks",
      description: "Developing systems to measure and communicate your social impact effectively",
      includes: [
        "Impact framework design",
        "Data collection strategy",
        "Reporting template creation",
        "Stakeholder communication plan",
        "Continuous improvement processes"
      ],
      price: "R10,000 - R20,000",
      icon: TrendingUp
    },
    {
      title: "Partnership Development",
      duration: "Ongoing",
      description: "Building lasting relationships with aligned organizations and communities",
      includes: [
        "Partnership strategy development",
        "Network mapping & analysis",
        "Collaboration framework design",
        "Mutual benefit planning",
        "Relationship management systems"
      ],
      price: "R15,000 - R30,000",
      icon: Users
    }
  ];

  const methodology = [
    {
      phase: "Discovery",
      description: "Deep dive into your organization's mission, values, and current challenges",
      activities: ["Stakeholder interviews", "Current state analysis", "Gap identification", "Opportunity mapping"]
    },
    {
      phase: "Analysis",
      description: "Research and analyze your market, audience, and competitive landscape",
      activities: ["Market research", "Audience analysis", "Competitor assessment", "Best practice review"]
    },
    {
      phase: "Strategy",
      description: "Develop comprehensive strategies aligned with your mission and goals",
      activities: ["Strategy formulation", "Action plan creation", "Resource allocation", "Timeline development"]
    },
    {
      phase: "Implementation",
      description: "Support you through the execution phase with guidance and troubleshooting",
      activities: ["Launch support", "Progress monitoring", "Adjustment recommendations", "Success measurement"]
    }
  ];

  const testimonials = [
    {
      quote: "The strategic consultation transformed how we communicate our impact. Our community engagement increased by 300%.",
      author: "Sarah Johnson",
      role: "Director, Valley of Hope Foundation",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?q=80&w=150"
    },
    {
      quote: "Their ethical storytelling workshop helped us find our authentic voice and connect with supporters on a deeper level.",
      author: "Marcus Thompson",
      role: "CEO, Urban Gardens Initiative",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-rainbow-subtle opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-rainbow-gradient text-white">Strategic Guidance</Badge>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
                  Strategic <span className="bg-rainbow-gradient bg-clip-text text-transparent">Consultation</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                  Building lasting partnerships through conscious communication. We focus on understanding 
                  your mission deeply and developing strategies that create meaningful, sustainable impact.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                    <Link to="/contact">Book Consultation</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800"
                  alt="Strategic consultation meeting"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                <div className="absolute top-4 right-4">
                  <Lightbulb className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Types */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Consultation <span className="bg-rainbow-gradient bg-clip-text text-transparent">Services</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tailored strategic guidance to help your organization communicate authentically and create lasting impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {consultationTypes.map((consultation, index) => (
                <Card key={consultation.title} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-rainbow-gradient rounded-full flex items-center justify-center">
                        <consultation.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="font-heading text-xl">{consultation.title}</CardTitle>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{consultation.duration}</span>
                          <span>•</span>
                          <span className="font-semibold text-omni-indigo">{consultation.price}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">{consultation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-gray-700 mb-3">What's Included:</h4>
                    <ul className="space-y-2 mb-6">
                      {consultation.includes.map((item) => (
                        <li key={item} className="flex items-start text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-rainbow-gradient rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-rainbow-gradient hover:opacity-90 text-white font-semibold py-2 rounded-full">
                      <Link to="/contact">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Methodology</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A proven four-phase approach that ensures comprehensive understanding and sustainable results.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {methodology.map((phase, index) => (
                <Card key={phase.phase} className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-rainbow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <CardTitle className="font-heading text-xl">{phase.phase}</CardTitle>
                    <CardDescription className="text-sm">{phase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-xs text-gray-600">
                      {phase.activities.map((activity) => (
                        <li key={activity} className="flex items-center">
                          <span className="w-1 h-1 bg-omni-indigo rounded-full mr-2"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                  Areas of <span className="bg-rainbow-gradient bg-clip-text text-transparent">Expertise</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We specialize in helping conscious organizations navigate complex communication challenges 
                  and build authentic connections with their communities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    "Non-profit communication strategy",
                    "Social impact measurement",
                    "Community engagement planning",
                    "Ethical marketing practices",
                    "Stakeholder relationship management",
                    "Crisis communication planning",
                    "Cultural sensitivity training",
                    "Partnership development"
                  ].map((area, index) => (
                    <div key={area} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="w-2 h-2 bg-rainbow-gradient rounded-full mr-3"></div>
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=800"
                  alt="Team collaboration and strategy planning"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Client <span className="bg-rainbow-gradient bg-clip-text text-transparent">Success Stories</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how our strategic consultation has helped organizations amplify their impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.author} className="p-8 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="p-0">
                    <blockquote className="text-lg text-gray-700 mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{testimonial.author}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & Booking */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Getting <span className="bg-rainbow-gradient bg-clip-text text-transparent">Started</span>
              </h2>
              <p className="text-lg text-gray-600">
                Every partnership begins with understanding your unique needs and challenges.
              </p>
            </div>
            
            <Card className="p-8 text-center">
              <CardHeader>
                <CardTitle className="font-heading text-2xl mb-4">Free Initial Consultation</CardTitle>
                <CardDescription className="text-lg">
                  Start with a complimentary 60-minute consultation to explore how we can help your organization thrive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-omni-indigo mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">60 Minutes</h4>
                    <p className="text-sm text-gray-600">In-depth discussion</p>
                  </div>
                  <div className="text-center">
                    <MessageCircle className="w-8 h-8 text-omni-indigo mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">No Commitment</h4>
                    <p className="text-sm text-gray-600">Explore options freely</p>
                  </div>
                  <div className="text-center">
                    <Lightbulb className="w-8 h-8 text-omni-indigo mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Custom Proposal</h4>
                    <p className="text-sm text-gray-600">Tailored to your needs</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                    <Link to="/contact">
                      Book Free Consultation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                    <Link to="/portfolio">View Case Studies</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Consultation;