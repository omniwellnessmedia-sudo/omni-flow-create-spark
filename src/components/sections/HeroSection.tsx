
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rainbow-gradient rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rainbow-gradient rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-rainbow-gradient rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
              alt="Omni Wellness Media" 
              className="h-24 w-24 sm:h-32 sm:w-32 animate-pulse-slow"
            />
          </div>

          {/* Main Heading */}
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6">
            <span className="bg-rainbow-gradient bg-clip-text text-transparent">
              Conscious Content
            </span>
            <br />
            <span className="text-gray-800">
              for Positive Change
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Empowering communities through holistic wellness, authentic storytelling, 
            and conscious business development. From South Africa to the world.
          </p>

          {/* Content Pillars */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Inspiration', 'Education', 'Empowerment', 'Wellness'].map((pillar, index) => (
              <span 
                key={pillar}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {pillar}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link to="/services">Our Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-omni-indigo text-omni-indigo hover:bg-omni-indigo hover:text-white font-semibold px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
              <Link to="/ai-tools">Try Our AI Tools</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
