import { Link } from "react-router-dom";
import { Mail, Calendar, ArrowLeft } from "lucide-react";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import ImageCarousel3D from "@/components/ui/image-carousel-3d";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/images";

// Import local team images
import warrenPhoto from '@/assets/team/warren.png';
import stephenPhoto from '@/assets/team/stephen.png';

const About = () => {
  const storyImages = [
    {
      src: IMAGES.sandy.yoga,
      alt: "Community wellness activities - yoga session outdoors",
      caption: "Wellness in Action - Community yoga sessions bringing people together"
    },
    {
      src: IMAGES.wellness.communityProject1,
      alt: "Community outreach with children",
      caption: "Youth Engagement - Connecting with the next generation"
    },
    {
      src: IMAGES.wellness.retreat,
      alt: "Community gathering in nature",
      caption: "Nature Connection - Learning and growing together outdoors"
    },
    {
      src: IMAGES.wellness.team,
      alt: "Team collaboration in nature",
      caption: "Team Spirit - Our collaborative approach to wellness"
    },
    {
      src: IMAGES.providers.chad,
      alt: "Animal wellness and connection",
      caption: "Animal Wellness - Promoting compassionate living"
    },
    {
      src: IMAGES.wellness.communityProject2,
      alt: "Community group activities",
      caption: "Community Building - Bringing diverse groups together"
    },
    {
      src: IMAGES.tours.hiking,
      alt: "Outdoor adventure and wellness",
      caption: "Adventure Wellness - Exploring nature for holistic health"
    },
    {
      src: IMAGES.wellness.graduation,
      alt: "Panel discussion and community dialogue",
      caption: "Community Dialogue - Facilitating important conversations"
    },
    {
      src: IMAGES.wellness.communityProject3,
      alt: "Community garden and sustainable development",
      caption: "Sustainable Development - Growing community resilience"
    }
  ];

  const team = [
    {
      name: "Chad Cupido",
      role: "Founding Director",
      image: IMAGES.team.chad,
      initials: "CC",
      description: "Chad is the Founding Director responsible for overall vision, strategy, brand direction, and platform purpose. He leads Omni as a conscious media and commerce ecosystem, with extensive experience across media, wellness, education, tourism, and community development.",
      location: "Muizenberg, Cape Town"
    },
    {
      name: "Tumelo Thabo Ncube",
      role: "Technical Founder | Platform & Systems Architecture",
      image: null,
      initials: "TN",
      description: "Tumelo is the Technical Founder responsible for designing and building the platform's technical architecture, digital systems, and infrastructure. He ensures Omni is technically robust, secure, and scalable.",
      location: "Cape Town, South Africa"
    },
    {
      name: "Zenith Yasin",
      role: "Operations & Platform Coordination Lead",
      image: IMAGES.team.zenith,
      initials: "ZY",
      description: "Zenith supports operations, coordination, and execution across Omni Wellness Media. She ensures content workflows, partnerships, and administrative processes remain organised and aligned with brand values.",
      location: "Cape Town, South Africa"
    },
    {
      name: "Feroza Begg",
      role: "Operations & Administration Support",
      image: IMAGES.team.feroza,
      initials: "FB",
      description: "Feroza supports through administration, coordination, content support, and operational follow-through. She assists with platform tasks, communications, documentation, and campaign execution.",
      location: "Western Cape, South Africa"
    },
    {
      name: "Warren Cramer",
      role: "Senior Financial Advisor & Governance Oversight",
      image: warrenPhoto,
      initials: "WC",
      description: "Warren provides senior financial oversight and governance guidance, supporting leadership in ensuring financial sustainability, compliance, and sound decision-making.",
      location: "Cape Town, South Africa"
    },
    {
      name: "Stephen Bosch",
      role: "Financial Operations & Systems Lead",
      image: stephenPhoto,
      initials: "SB",
      description: "Stephen is the operational financial lead, embedded in day-to-day financial systems, reporting, and execution. He ensures accurate bookkeeping and financial visibility.",
      location: "Cape Town, South Africa"
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
            About <span className="text-gradient-rainbow">Omni Wellness Media</span>
          </>
        }
        description="We are messengers to humanity, creating authentic content that bridges communities and inspires positive change from South Africa to the world."
        image={IMAGES.wellness.community}
        imageAlt="Community outreach with distribution boxes"
        variant="split"
        height="medium"
        actions={[
          {
            label: "Our Services",
            href: "/services",
            variant: "wellness"
          },
          {
            label: "Contact Us",
            href: "/contact",
            variant: "outline"
          }
        ]}
      />
      
      <main>

        {/* Our Story - Redesigned for better image showcase */}
        <section className="section-spacing bg-white">
          <div className="container-width">
            <div className="text-center mb-12">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
                Omni Wellness Media was born from a vision to create authentic content that showcases 
                the real stories behind the brands we work with. We believe in breaking stereotypes 
                and showing the heart of every project we touch.
              </p>
            </div>

            {/* Main Image Carousel - Full Width */}
            <div className="mb-12">
              <ImageCarousel3D 
                images={storyImages}
                autoPlay={true}
                autoPlayDelay={5000}
              />
            </div>

            {/* Story Content Below Carousel */}
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our approach focuses on understanding someone's journey, bringing people into their 
                    life, and fueling passion to help. We specialize in telling the difference between 
                    privilege and poverty to spark awareness and shake people up in the most positive way.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-6 bg-rainbow-subtle rounded-lg">
                    <h3 className="font-heading font-semibold text-3xl text-gray-800 mb-2">50+</h3>
                    <p className="text-gray-600 font-medium">Projects Completed</p>
                  </div>
                  <div className="p-6 bg-rainbow-subtle rounded-lg">
                    <h3 className="font-heading font-semibold text-3xl text-gray-800 mb-2">5+</h3>
                    <p className="text-gray-600 font-medium">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team - New Large Image-Focused Layout */}
        <section className="section-spacing bg-gray-50">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Meet Our <span className="text-rainbow-enhanced">Team</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our diverse team brings together creativity, strategy, and passion for positive change.
              </p>
            </div>

            {/* Premium Grid Layout with Portrait Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 max-w-sm w-full border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image or Gradient Initials Avatar */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* Always show gradient initials as base layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center z-0">
                      <span className="text-white text-6xl font-bold tracking-wider">
                        {member.initials}
                      </span>
                    </div>
                    
                    {/* Image overlay - if exists and loads */}
                    {member.image && (
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 z-10"
                        loading="lazy"
                        onError={(e) => {
                          // Hide image to show initials underneath
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 text-center bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-spacing bg-white">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Our <span className="text-rainbow-enhanced">Values</span>
              </h2>
            </div>
            <div className="grid-responsive-4">
              {[
                { title: "Inspiration", desc: "We create content that uplifts and motivates communities to positive action." },
                { title: "Education", desc: "We share knowledge that empowers individuals to make informed decisions." },
                { title: "Empowerment", desc: "We believe in giving people the tools and confidence to create change." },
                { title: "Wellness", desc: "We promote holistic health - physical, mental, emotional, and spiritual." }
              ].map((value, index) => (
                <div 
                  key={value.title}
                  className="text-center p-6 bg-rainbow-subtle rounded-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <h3 className="font-heading font-semibold text-xl mb-4 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Impact */}
        <section className="section-spacing bg-gray-50">
          <div className="container-width">
            <div className="text-center mb-16">
              <h2 className="heading-secondary text-gradient-hero no-faded-text">
                Our <span className="text-rainbow-enhanced">Impact</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Through our work, we're creating ripples of positive change that extend far beyond individual projects.
              </p>
            </div>
            
            {/* Impact Cards with Portrait Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={IMAGES.wellness.landmark}
                    alt="Environmental wellness and nature conservation"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-gray-800">Environmental Wellness</h3>
                  <p className="text-gray-600">Promoting sustainable practices and connecting communities with nature for holistic healing and environmental consciousness.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={IMAGES.providers.bwc}
                    alt="Youth empowerment and community engagement"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-gray-800">Youth Empowerment</h3>
                  <p className="text-gray-600">Engaging with the next generation through the BWC Youth Club "Troopers" to build awareness and create future change-makers.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={IMAGES.providers.chadAction}
                    alt="Animal wellness and compassionate living"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-gray-800">Animal Wellness</h3>
                  <p className="text-gray-600">Advocating for animal rights and promoting compassionate living through education and community outreach programs.</p>
                </div>
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🌍</span>
                </div>
                <h4 className="font-heading font-semibold text-2xl text-gray-800 mb-2">1000+</h4>
                <p className="text-gray-600 font-medium">Lives Touched</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🤝</span>
                </div>
                <h4 className="font-heading font-semibold text-2xl text-gray-800 mb-2">15+</h4>
                <p className="text-gray-600 font-medium">Communities Served</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">💡</span>
                </div>
                <h4 className="font-heading font-semibold text-2xl text-gray-800 mb-2">50+</h4>
                <p className="text-gray-600 font-medium">Projects Completed</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🎬</span>
                </div>
                <h4 className="font-heading font-semibold text-2xl text-gray-800 mb-2">100+</h4>
                <p className="text-gray-600 font-medium">Stories Told</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="section-spacing bg-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-omni-violet/20"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-omni-blue/20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-omni-teal/10"></div>
          </div>
          
          <div className="container-width relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Main Heading with Better Contrast */}
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                Ready to Create 
                <br />
                <span className="text-gradient-rainbow">
                  Positive Change
                </span> 
                <br />
                Together?
              </h2>
              
              {/* Description */}
              <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join us in bridging wellness, outreach, and media to empower communities and inspire 
                conscious living. Let&apos;s tell your story and make a meaningful impact.
              </p>
              
              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button 
                  size="lg" 
                  className="bg-omni-violet hover:bg-omni-violet/90 text-white font-semibold px-12 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  asChild
                >
                  <Link to="/contact">Start Your Project</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold px-12 py-4 text-lg rounded-full transition-all duration-300"
                  asChild
                >
                  <Link to="/services">View Our Services</Link>
                </Button>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-omni-violet/10 flex items-center justify-center mr-4">
                    <img 
                      src={IMAGES.omni.logo} 
                      alt="Omni Wellness Media" 
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-heading font-bold text-xl text-gray-900">Get in Touch</h3>
                    <p className="text-gray-600">We&apos;re here to help bring your vision to life</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <Mail className="w-5 h-5 text-omni-violet mr-2" />
                      <span className="font-semibold text-gray-900">Email Us</span>
                    </div>
                    <a 
                      href="mailto:omnimediawellness@gmail.com" 
                      className="text-omni-violet hover:text-omni-violet/80 font-medium transition-colors block"
                    >
                      omnimediawellness@gmail.com
                    </a>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <Calendar className="w-5 h-5 text-omni-violet mr-2" />
                      <span className="font-semibold text-gray-900">Book Meeting</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-omni-violet/30 text-omni-violet hover:bg-omni-violet/5 rounded-full"
                      asChild
                    >
                      <Link to="/contact">Schedule Consultation</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
