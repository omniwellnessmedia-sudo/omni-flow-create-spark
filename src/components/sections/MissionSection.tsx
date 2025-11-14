
const MissionSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Our <span className="text-gradient-hero">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Creating authentic content that bridges communities and inspires positive change across South Africa and beyond.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Large Image Card - Left */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl shadow-xl group">
            <img 
              src="/images/wellness/OMNI_KALK BAY_ GRADUATION-8.jpg" 
              alt="Community celebrating achievements"
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-3">Empowering Communities</h3>
              <p className="text-lg text-white/90 leading-relaxed">
                We serve as messengers to humanity, showcasing real stories that inspire action and create lasting impact.
              </p>
            </div>
          </div>

          {/* Values Stack - Right */}
          <div className="space-y-6">
            {[
              { 
                title: "Authenticity", 
                desc: "Real stories, genuine impact",
                gradient: "from-orange-500 to-red-500"
              },
              { 
                title: "Community", 
                desc: "Empowering local voices",
                gradient: "from-green-500 to-teal-500"
              },
              { 
                title: "Sustainability", 
                desc: "Building lasting change",
                gradient: "from-blue-500 to-indigo-500"
              },
              { 
                title: "Wellness", 
                desc: "Holistic flourishing",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((value, index) => (
              <div 
                key={value.title}
                className="relative overflow-hidden rounded-2xl shadow-lg group hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative p-6 bg-white/80 backdrop-blur-sm">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Through <span className="font-semibold text-omni-violet">conscious content creation</span>, 
              <span className="font-semibold text-omni-blue"> business development</span>, and 
              <span className="font-semibold text-omni-green"> community empowerment</span>, 
              we believe that a little bit of help goes a long way.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We inspire others to make the smallest changes that create ripple effects of transformation, 
              bridging the gap between privilege and poverty through authentic storytelling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
