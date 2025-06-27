import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const team = [
    { name: "Chad", role: "Founder & Creative Director", image: "/lovable-uploads/00bcae7d-32b7-4512-ba26-c767559ee023.png" },
    { name: "Tumelo", role: "Content Strategist", image: "/lovable-uploads/65549a00-dea0-461e-9e85-fe455db1c706.png" },
    { name: "Abbi", role: "Community Manager", image: "/lovable-uploads/fcf93d20-65c1-4e39-8c34-360afdf825f1.png" },
    { name: "Zenith", role: "Wellness Coach", image: "/lovable-uploads/8599bcc3-c73a-4244-84fe-6caa49ab80df.png" }
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
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              We are messengers to humanity, creating authentic content that bridges communities 
              and inspires positive change from South Africa to the world.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Omni Wellness Media was born from a vision to create authentic content that showcases 
                  the real stories behind the brands we work with. We believe in breaking stereotypes 
                  and showing the heart of every project we touch.
                </p>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Our approach focuses on understanding someone's journey, bringing people into their 
                  life, and fueling passion to help. We specialize in telling the difference between 
                  privilege and poverty to spark awareness and shake people up in the most positive way.
                </p>
              </div>
              <div>
                <img 
                  src="/lovable-uploads/ae84052e-02fe-4443-9a9f-63f094e6a81e.png"
                  alt="Team celebrating success"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={member.name}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover mb-4 shadow-lg"
                  />
                  <h3 className="font-heading font-semibold text-xl mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
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
      </main>
      <Footer />
    </div>
  );
};

export default About;
