
import { Link } from "react-router-dom";
import { Mail, Calendar, ArrowLeft } from "lucide-react";
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import ImageCarousel3D from "@/components/ui/image-carousel-3d";
import { Button } from "@/components/ui/button";

const About = () => {
  const storyImages = [
    {
      src: "/lovable-uploads/f82ae266-4067-45f3-be51-c7eb82a086b5.png",
      alt: "Community wellness activities - yoga session outdoors",
      caption: "Wellness in Action - Community yoga sessions bringing people together"
    },
    {
      src: "/lovable-uploads/a173755d-1be1-43bf-90cf-73ff1ab97eca.png",
      alt: "Community outreach with children",
      caption: "Youth Engagement - Connecting with the next generation"
    },
    {
      src: "/lovable-uploads/5fc374c8-c75f-4568-8d6f-8b6690f60fe8.png",
      alt: "Community gathering in nature",
      caption: "Nature Connection - Learning and growing together outdoors"
    },
    {
      src: "/lovable-uploads/ae7dd422-830f-4fc0-bd09-99d59ac3c74d.png",
      alt: "Team collaboration in nature",
      caption: "Team Spirit - Our collaborative approach to wellness"
    },
    {
      src: "/lovable-uploads/9541ac9f-baaf-408d-b27b-d51d6b29843c.png",
      alt: "Animal wellness and connection",
      caption: "Animal Wellness - Promoting compassionate living"
    },
    {
      src: "/lovable-uploads/3b0dbe5c-71d7-4531-9223-49d482c3cae4.png",
      alt: "Community group activities",
      caption: "Community Building - Bringing diverse groups together"
    },
    {
      src: "/lovable-uploads/5fd8d5d0-c500-460f-b154-d7521729dbc7.png",
      alt: "Outdoor adventure and wellness",
      caption: "Adventure Wellness - Exploring nature for holistic health"
    },
    {
      src: "/lovable-uploads/c34eeb26-fb7a-4e01-9a3d-be12dced06c5.png",
      alt: "Panel discussion and community dialogue",
      caption: "Community Dialogue - Facilitating important conversations"
    },
    {
      src: "/lovable-uploads/8237809d-793d-4524-8c54-a6395a6efe94.png",
      alt: "Community garden and sustainable development",
      caption: "Sustainable Development - Growing community resilience"
    }
  ];

  const team = [
    { 
      name: "Chad Cupido", 
      role: "Founder & Head of Media and Strategy", 
      image: "/lovable-uploads/d149bef9-d800-4673-8e57-4c9befd8ad7c.png",
      description: "Chad oversees content creation and overall design direction, leveraging his strong background in media to produce high-quality, impactful content that bridges communities and inspires positive change."
    },
    { 
      name: "Abbi Berkovitz", 
      role: "Content Developer", 
      image: "/lovable-uploads/310e880f-0ee8-41fe-b098-6a2d5481ea5b.png",
      description: "Abbi works closely with Chad on content development, creating engaging copy and organizing visuals for the website and other platforms. She specializes in distributing content across Facebook and TikTok."
    },
    { 
      name: "Tumelo", 
      role: "Web Development Lead", 
      image: "/lovable-uploads/6d1fcc0d-a3de-47d0-91c1-353fecb2f9ca.png",
      description: "Tumelo leads our web development and e-commerce services, ensuring a strong online presence for our clients with cutting-edge technical solutions."
    },
    { 
      name: "Zenith", 
      role: "Administration and Coordination", 
      image: "/lovable-uploads/19bf84a4-63da-41b9-b117-545dd1a52294.png",
      description: "Zenith handles the administrative and coordination aspects, ensuring deadlines are met and managing client relationships with precision and care."
    },
    { 
      name: "Feroza", 
      role: "Project Lead Support", 
      image: "/lovable-uploads/3e329aa7-398b-4473-948d-2d5f9d54915a.png",
      description: "Feroza brings strategic insights and innovative thinking to help clients achieve their conscious business goals and sustainable growth."
    }
  ];

  return (
    <div className="min-h-screen">
      <MegaNavigation />
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
        image="/lovable-uploads/590721a1-f529-47d4-b7f1-8e856b424bb9.png"
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

            {/* Grid Layout with Square Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="card-team group bg-white rounded-3xl shadow-lg overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 max-w-sm w-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden flex justify-center">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="card-title-clamp text-gray-800">{member.name}</h3>
                    <p className="text-omni-indigo font-semibold mb-4 text-lg">{member.role}</p>
                    <p className="card-description-clamp text-left">{member.description}</p>
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
                    src="/lovable-uploads/962ceac6-b494-43d6-b37e-f994560fecab.png"
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
                    src="/lovable-uploads/75a97d0a-ea73-42e4-b7b2-a80c52327de4.png"
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
                    src="/lovable-uploads/e85ad5c6-1b62-462b-a36e-4d42baf1f960.png"
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
                      src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
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
