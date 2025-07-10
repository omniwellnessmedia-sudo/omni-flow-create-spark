
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/ui/hero";
import BreadcrumbNav from "@/components/ui/breadcrumb-nav";

const About = () => {
  const team = [
    { 
      name: "Chad Cupido", 
      role: "Founder & Head of Media and Strategy", 
      image: "/lovable-uploads/d149bef9-d800-4673-8e57-4c9befd8ad7c.png",
      description: "Chad oversees content creation and overall design direction, leveraging his strong background in media to produce high-quality, impactful content that bridges communities and inspires positive change."
    },
    { 
      name: "Abbi", 
      role: "Content Developer", 
      image: "/lovable-uploads/acc84685-2d7b-4845-99fd-744ce2c3c932.png",
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
      role: "Strategic Consultant", 
      image: "/lovable-uploads/3e329aa7-398b-4473-948d-2d5f9d54915a.png",
      description: "Feroza brings strategic insights and innovative thinking to help clients achieve their conscious business goals and sustainable growth."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <BreadcrumbNav />
      
      <Hero
        title={
          <>
            About <span className="bg-rainbow-gradient bg-clip-text text-transparent">Omni Wellness Media</span>
          </>
        }
        description="We are messengers to humanity, creating authentic content that bridges communities and inspires positive change from South Africa to the world."
        image="/lovable-uploads/362cb38a-2c1c-4857-a238-75f8e507408e.png"
        imageAlt="Omni Wellness Media Team"
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

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-8">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Omni Wellness Media was born from a vision to create authentic content that showcases 
                  the real stories behind the brands we work with. We believe in breaking stereotypes 
                  and showing the heart of every project we touch.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our approach focuses on understanding someone's journey, bringing people into their 
                  life, and fueling passion to help. We specialize in telling the difference between 
                  privilege and poverty to spark awareness and shake people up in the most positive way.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-rainbow-subtle rounded-lg">
                    <h3 className="font-heading font-semibold text-2xl text-gray-800 mb-2">50+</h3>
                    <p className="text-gray-600">Projects Completed</p>
                  </div>
                  <div className="p-4 bg-rainbow-subtle rounded-lg">
                    <h3 className="font-heading font-semibold text-2xl text-gray-800 mb-2">5+</h3>
                    <p className="text-gray-600">Years Experience</p>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="/lovable-uploads/0b9c95c5-3439-459b-a4d2-0ca456a0f42e.png"
                  alt="Team with community project materials"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team - New Large Image-Focused Layout */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Meet Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Team</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our diverse team brings together creativity, strategy, and passion for positive change.
              </p>
            </div>

            {/* Grid Layout with Large Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden animate-fade-in-up hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-heading font-bold text-2xl mb-2 text-gray-800">{member.name}</h3>
                    <p className="text-omni-indigo font-semibold mb-4 text-lg">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Values</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
                Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Impact</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Through our work, we're creating ripples of positive change that extend far beyond individual projects.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-rainbow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🌍</span>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">Global Reach</h3>
                <p className="text-gray-600">Our content reaches communities across South Africa and beyond, inspiring change worldwide.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rainbow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🤝</span>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">Community Building</h3>
                <p className="text-gray-600">We foster connections between diverse communities, breaking down barriers and building bridges.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rainbow-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">💡</span>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">Conscious Content</h3>
                <p className="text-gray-600">Every piece of content we create is designed to educate, inspire, and empower positive action.</p>
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
