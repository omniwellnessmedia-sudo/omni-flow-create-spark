
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-wellhub-light">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-wellhub-gradient rounded-full blur-xl animate-float opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rainbow-enhanced rounded-full blur-xl animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-3xl animate-float opacity-10" style={{ animationDelay: '4s' }}></div>
        
        {/* Vector-like geometric shapes */}
        <div className="absolute top-32 right-20 w-16 h-16 border-4 border-purple-300 rotate-45 animate-pulse-slow opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 border-4 border-pink-300 rounded-full animate-pulse-slow opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg rotate-12 animate-float opacity-30" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Logo - Made Much Larger with cool effect */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              <img 
                src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
                alt="Omni Wellness Media" 
                className="h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 animate-float relative z-10"
              />
              <div className="absolute inset-0 bg-rainbow-enhanced rounded-full opacity-20 animate-pulse-slow blur-2xl"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse-slow rounded-full"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-tight">
            <span className="text-rainbow-enhanced animate-slide-in-left">
              Conscious Content
            </span>
            <br />
            <span className="text-gray-800 animate-slide-in-right">
              for Positive Change
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-12 max-w-5xl mx-auto leading-relaxed font-medium">
            Empowering communities through holistic wellness, authentic storytelling, 
            and conscious business development. <span className="text-wellhub-gradient font-semibold">From South Africa to the world.</span>
          </p>

          {/* Content Pillars */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {['Inspiration', 'Education', 'Empowerment', 'Wellness'].map((pillar, index) => (
              <span 
                key={pillar}
                className="px-6 py-3 glass rounded-2xl text-lg font-semibold text-gray-800 shadow-lg hover-lift cursor-default transform hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {pillar}
              </span>
            ))}
          </div>

          {/* CTA Buttons - Wellhub inspired */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              asChild 
              variant="wellness"
              size="lg" 
              className="px-12 py-4 text-xl"
            >
              <Link to="/services">Explore Our Services</Link>
            </Button>
            <Button 
              asChild 
              variant="soft"
              size="lg" 
              className="px-12 py-4 text-xl"
            >
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
