
const MissionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in-up">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 text-gray-900">
              Our <span className="bg-rainbow-gradient bg-clip-text text-transparent font-bold">Mission</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We serve as messengers to humanity, starting with South Africa and reaching the world. 
              Our mission is to create authentic content that bridges the gap between privilege and 
              poverty, showcasing real stories that inspire positive change.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Through conscious content creation, business development, and community empowerment, 
              we believe that a little bit of help goes a long way. We inspire others to make 
              the smallest changes that create ripple effects of transformation.
            </p>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Authenticity", desc: "Real stories, real impact" },
                { title: "Community", desc: "Empowering local voices" },
                { title: "Sustainability", desc: "Building lasting change" },
                { title: "Wellness", desc: "Holistic human flourishing" }
              ].map((value, index) => (
                <div 
                  key={value.title}
                  className="p-4 bg-rainbow-subtle rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="animate-fade-in">
            <img 
              src="/lovable-uploads/ae84052e-02fe-4443-9a9f-63f094e6a81e.png" 
              alt="Community celebrating achievements together"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
