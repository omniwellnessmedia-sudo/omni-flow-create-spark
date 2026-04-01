import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { FloatingDecorations } from "@/components/ui/gaia-elements";
import { CuratorTip } from "@/components/curator/CuratorTip";
import { omniVoice } from "@/data/omniVoiceGuide";

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
      link: "/business-consulting"
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
      link: "/media-production"
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
      link: "/social-media-strategy"
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
      link: "/web-development"
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
      link: "/media-production"
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
      link: "/media-production"
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
      link: "/contact"
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
      link: "/contact"
    }
  ];

  return (
    <div className="min-h-screen">
      <UnifiedNavigation />
      <div className="px-4 pt-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
      <BreadcrumbNav />
      
      <Hero
        title={
          <>
            {omniVoice.pageIntros.services.headline}
          </>
        }
        description={omniVoice.pageIntros.services.subheadline}
        variant="minimal"
        height="small"
        actions={[
          {
            label: omniVoice.ctas.contact,
            href: "/contact",
            variant: "wellness"
          },
          {
            label: "View Portfolio",
            href: "/portfolio",
            variant: "outline"
          }
        ]}
      />
      
      <main>

        {/* Core Services Grid */}
        <section className="py-20 bg-white relative overflow-hidden">
          <FloatingDecorations variant="subtle" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Curator Welcome */}
            <div className="mb-8">
              <CuratorTip 
                curator="chad" 
                message={omniVoice.sectionIntros.services}
                variant="banner"
              />
            </div>

            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                What We <span className="text-primary">Create</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {omniVoice.transitions.curated}
              </p>
            </div>

            {/* Core 4 Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-16">
              {services.slice(0, 4).map((service, index) => (
                <Card 
                  key={service.title}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-100 transition-colors">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="font-heading text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-lg leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-8">
                      {service.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                          <span className="text-base">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/btn"
                    >
                      <Link to={service.link} className="inline-flex items-center justify-center text-lg">
                        {omniVoice.ctas.getStarted}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
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
                  <span>{omniVoice.transitions.explore}</span>
                  <svg className="w-5 h-5 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
                            {omniVoice.ctas.learn}
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
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <FloatingDecorations variant="section" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our <span className="text-primary">Process</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {omniVoice.reassurance.everyStep}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
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
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 motion-safe:animate-breathing-slow">
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
        <section className="py-20 bg-white relative overflow-hidden">
          <FloatingDecorations variant="hero" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <CuratorTip 
              curator="chad" 
              message={omniVoice.curatorVoices.chad.intro}
              variant="card"
              className="mb-8"
            />
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              Ready to Create <span className="text-primary">Positive Change</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {omniVoice.reassurance.noPressure}
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg">
              <Link to="/contact">{omniVoice.ctas.start}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
