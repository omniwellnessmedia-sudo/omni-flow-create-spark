
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";
import ImageCarousel3D from "@/components/ui/image-carousel-3d";

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
      <BreadcrumbNav />
      
      <Hero
        title={
          <>
            About <span className="bg-rainbow-gradient bg-clip-text text-transparent">Omni Wellness Media</span>
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
              <h2 className="heading-secondary no-faded-text">Our Story</h2>
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
              <h2 className="heading-secondary no-faded-text">
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
              <h2 className="heading-secondary no-faded-text">
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
              <h2 className="heading-secondary no-faded-text">
                Our <span className="text-rainbow-enhanced">Impact</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Through our work, we're creating ripples of positive change that extend far beyond individual projects.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <img 
                    src="/lovable-uploads/c3b54db5-586f-41da-a939-1d8c70333591.png"
                    alt="Community gathering and traditional healing practices"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-gray-800">Community Connection</h3>
                  <p className="text-gray-600 leading-relaxed">Building authentic relationships and fostering healing traditions that bring communities together in meaningful ways.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <img 
                    src="/lovable-uploads/3e8c2291-8f3c-4b41-95ee-795689efbdac.png"
                    alt="Youth engagement and activism - BWC Youth Club Troopers"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-gray-800">Youth Empowerment</h3>
                  <p className="text-gray-600 leading-relaxed">Inspiring the next generation through activism, education, and community leadership programs that create lasting change.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="overflow-hidden">
                  <img 
                    src="/lovable-uploads/b02b5fca-2b89-40fa-ac36-acc1a68260fd.png"
                    alt="Animal wellness and compassionate living"
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-gray-800">Animal Wellness</h3>
                  <p className="text-gray-600 leading-relaxed">Promoting compassionate living and advocating for animal rights through education and community awareness programs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section-spacing bg-white">
          <div className="container-width">
            <div className="text-center bg-rainbow-gradient rounded-3xl p-12 md:p-16 text-white">
              <h2 className="heading-secondary text-white mb-6">
                Ready to Create Change Together?
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Whether you need conscious content creation, business development, or want to join our mission 
                of empowering communities, we're here to help you make a meaningful impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/contact" 
                  className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 inline-flex items-center"
                >
                  Start Your Project
                </a>
                <a 
                  href="mailto:omnimediawellness@gmail.com" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 inline-flex items-center"
                >
                  Email Us Directly
                </a>
              </div>
              <p className="mt-6 opacity-80">
                Or book a consultation to discuss your vision
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
