import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import wellnessHumans from "@/assets/wellness-humans.png";

const WellnessHumansSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="heading-primary text-gradient-hero">
                Join Our Wellness Community
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with like-minded individuals on their wellness journey. Share experiences, 
                discover new practices, and grow together in a supportive environment that celebrates 
                every step towards better health and consciousness.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-rainbow-enhanced rounded-full"></div>
                <span className="text-lg text-gray-700 font-medium">Diverse wellness practices</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gradient-primary rounded-full"></div>
                <span className="text-lg text-gray-700 font-medium">Supportive community</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                <span className="text-lg text-gray-700 font-medium">Expert guidance</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                variant="wellness"
                size="lg" 
                className="px-8 py-3"
              >
                <Link to="/wellness-exchange">Join Community</Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                size="lg" 
                className="px-8 py-3"
              >
                <Link to="/partners">Find Practitioners</Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="/images/sandy/Sandy_August_shoot_omni-2.png"
                alt="Person practicing wellness yoga on beach" 
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-rainbow-enhanced rounded-3xl blur-2xl opacity-20 animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessHumansSection;