import { IMAGES } from '@/lib/images';
import { Heart, Users, Sprout, Sparkles } from 'lucide-react';

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
              src={IMAGES.services.retreat6}
              alt="Community wellness and empowerment"
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

          {/* Values Stack - Right - Vibrant Omni Rainbow */}
          <div className="space-y-6">
            {[
              { 
                title: "Inspiration", 
                desc: "Igniting passion for change",
                gradient: "from-red-500 via-orange-500 to-yellow-500",
                icon: Sparkles,
                glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
              },
              { 
                title: "Community", 
                desc: "Ubuntu in action",
                gradient: "from-green-500 via-emerald-500 to-teal-500",
                icon: Users,
                glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              },
              { 
                title: "Wellness", 
                desc: "Holistic flourishing",
                gradient: "from-blue-500 via-indigo-500 to-purple-500",
                icon: Heart,
                glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              },
              { 
                title: "Growth", 
                desc: "Sustainable transformation",
                gradient: "from-purple-500 via-pink-500 to-rose-500",
                icon: Sprout,
                glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              }
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={value.title}
                  className={`relative overflow-hidden rounded-2xl shadow-lg group hover:shadow-2xl transition-all duration-500 animate-fade-in hover:-translate-y-1 ${value.glow}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  
                  {/* Floating orb effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  {/* Content */}
                  <div className="relative p-6 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl">
                        {value.title}
                      </h3>
                      <Icon className="h-6 w-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    </div>
                    <p className="text-white/90 font-medium">{value.desc}</p>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              );
            })}
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
