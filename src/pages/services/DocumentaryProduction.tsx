import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Film, Clock, Users, Award, Target, Camera } from "lucide-react";

const DocumentaryProduction = () => {
  const processSteps = [
    {
      step: "01",
      title: "Research & Development",
      duration: "2-4 weeks",
      description: "Deep dive into your story, research subjects, and develop the narrative framework.",
      icon: Target
    },
    {
      step: "02", 
      title: "Pre-Production",
      duration: "1-2 weeks",
      description: "Script development, location scouting, interview scheduling, and crew preparation.",
      icon: Film
    },
    {
      step: "03",
      title: "Principal Photography",
      duration: "2-8 weeks",
      description: "Interviews, b-roll capture, and immersive storytelling with ethical filming practices.",
      icon: Camera
    },
    {
      step: "04",
      title: "Post-Production",
      duration: "4-12 weeks", 
      description: "Editing, color grading, sound design, music composition, and final delivery.",
      icon: Award
    }
  ];

  const documentaryTypes = [
    {
      title: "Social Impact Documentaries",
      description: "Stories that drive awareness and inspire social change",
      examples: ["Community development projects", "Environmental activism", "Social justice movements"],
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800",
      duration: "20-90 minutes",
      investment: "R50,000 - R200,000"
    },
    {
      title: "Corporate Documentaries", 
      description: "Authentic brand storytelling and company culture films",
      examples: ["Company history narratives", "CSR impact stories", "Employee journey films"],
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800",
      duration: "10-30 minutes",
      investment: "R30,000 - R100,000"
    },
    {
      title: "Educational Documentaries",
      description: "Knowledge-sharing content for schools and organizations",
      examples: ["Historical preservation", "Cultural heritage stories", "Scientific research films"],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800",
      duration: "15-60 minutes", 
      investment: "R40,000 - R150,000"
    }
  ];

  const awards = [
    { title: "Best Documentary Feature", org: "Cape Town Film Festival 2023" },
    { title: "Social Impact Award", org: "African Film Awards 2022" },
    { title: "Audience Choice", org: "Environmental Film Festival 2023" }
  ];

  return (
    <div className="min-h-screen">
      <MegaNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-rainbow-gradient opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-rainbow-gradient text-white">Award-Winning</Badge>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
                  Documentary <span className="bg-rainbow-gradient bg-clip-text text-transparent">Production</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                  Authentic storytelling through documentary films. Quality over speed - we invest in relationships, 
                  deep research, and ethical filmmaking practices to create impactful narratives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                    <Link to="/contact">Discuss Your Story</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full border-white text-white hover:bg-white hover:text-black">
                    <Film className="w-5 h-5 mr-2" />
                    Watch Reel
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800"
                  alt="Documentary filmmaker at work"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="font-heading font-semibold text-lg text-gray-600">Recognition & Awards</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {awards.map((award, index) => (
                <div key={award.title} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Award className="w-8 h-8 text-omni-indigo mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800">{award.title}</h4>
                  <p className="text-sm text-gray-600">{award.org}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentary Types */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Types of <span className="bg-rainbow-gradient bg-clip-text text-transparent">Documentaries</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We specialize in various documentary formats, each tailored to tell your unique story with authenticity and impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {documentaryTypes.map((type, index) => (
                <Card key={type.title} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative">
                    <img 
                      src={type.image}
                      alt={type.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-semibold">{type.duration}</p>
                      <p className="text-xs opacity-90">{type.investment}</p>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">{type.title}</CardTitle>
                    <CardDescription className="text-base">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">Examples:</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example) => (
                          <li key={example} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-omni-indigo rounded-full mr-2"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Production Process */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Process</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every documentary follows a meticulous process designed to honor your story and create maximum impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <Card key={step.step} className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-rainbow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <step.icon className="w-8 h-8 text-omni-indigo mx-auto mb-2" />
                    <CardTitle className="font-heading text-xl">{step.title}</CardTitle>
                    <Badge variant="outline" className="mx-auto">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ethics & Approach */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                  Ethical <span className="bg-rainbow-gradient bg-clip-text text-transparent">Storytelling</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  We believe in building genuine relationships with our subjects and communities. 
                  Our approach prioritizes consent, dignity, and authentic representation.
                </p>
                <div className="space-y-4">
                  {[
                    "Informed consent and ongoing communication",
                    "Fair compensation for participants", 
                    "Community ownership and benefit-sharing",
                    "Culturally sensitive storytelling practices",
                    "Environmental responsibility in production"
                  ].map((principle) => (
                    <div key={principle} className="flex items-center">
                      <div className="w-2 h-2 bg-rainbow-gradient rounded-full mr-3"></div>
                      <span className="text-gray-700">{principle}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800"
                  alt="Documentary interview setup"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Have a Story Worth <span className="bg-rainbow-gradient bg-clip-text text-transparent">Telling</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's explore how documentary storytelling can amplify your message and create lasting impact in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
                <Link to="/contact">
                  Start the Conversation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold px-8 py-3 text-lg rounded-full">
                <Link to="/portfolio">View Our Films</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentaryProduction;