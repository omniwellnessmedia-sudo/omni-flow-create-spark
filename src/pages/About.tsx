
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const team = [
    { 
      name: "Chad Cupido", 
      role: "Founder & Head of Media and Strategy", 
      image: "/lovable-uploads/4a01dcd5-fe18-4590-afd3-fe656ef63428.png",
      description: "Chad oversees content creation and overall design direction, leveraging his strong background in media to produce high-quality, impactful content."
    },
    { 
      name: "Abbi", 
      role: "Content Developer", 
      image: "/lovable-uploads/e8cedac1-53a9-4d1a-84c4-308d24ca529c.png",
      description: "Abbi works closely with Chad on content development, creating engaging copy and organizing visuals for the website and other platforms."
    },
    { 
      name: "Tumelo", 
      role: "Web Development Lead", 
      image: "/lovable-uploads/65549a00-dea0-461e-9e85-fe455db1c706.png",
      description: "Tumelo leads our web development and e-commerce services, ensuring a strong online presence for our clients."
    },
    { 
      name: "Zenith", 
      role: "Administration and Coordination", 
      image: "/lovable-uploads/8599bcc3-c73a-4244-84fe-6caa49ab80df.png",
      description: "Zenith handles the administrative and coordination aspects, ensuring deadlines are met and managing client relationships."
    },
    { 
      name: "Feroza", 
      role: "Strategic Consultant", 
      image: "/lovable-uploads/521beecf-f15f-46a9-a1c6-0e3973419248.png",
      description: "Feroza brings strategic insights and innovative thinking to help clients achieve their conscious business goals."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              About <span className="bg-rainbow-gradient bg-clip-text text-transparent">Omni Wellness Media</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
              We are messengers to humanity, creating authentic content that bridges communities 
              and inspires positive change from South Africa to the world.
            </p>
            
            {/* Team Group Photo */}
            <div className="max-w-4xl mx-auto mb-16">
              <img 
                src="/lovable-uploads/362cb38a-2c1c-4857-a238-75f8e507408e.png"
                alt="Omni Wellness Media Team"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </section>

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

        {/* Meet Our Team */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-xl mb-2">{member.name}</h3>
                    <p className="text-omni-indigo font-medium mb-3">{member.role}</p>
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
