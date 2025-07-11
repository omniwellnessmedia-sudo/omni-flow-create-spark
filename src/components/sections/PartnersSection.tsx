
import { useEffect, useState } from "react";

const PartnersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    { name: "Valley of Plenty", logo: "🌱", description: "Community Development" },
    { name: "Human Animal Project", logo: "🐾", description: "Animal Rights Advocacy" },
    { name: "Conscious Media Collective", logo: "📸", description: "Media Partnership" },
    { name: "Sustainable Business Network", logo: "🌍", description: "Business Development" },
    { name: "Wellness Community Hub", logo: "🧘", description: "Wellness Programs" },
    { name: "Creative Content Studios", logo: "🎬", description: "Content Creation" },
    { name: "Impact Investors Group", logo: "💡", description: "Investment Partners" },
    { name: "Local Community Foundation", logo: "🤝", description: "Community Support" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-black via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Collaborating with organizations that share our vision for positive change and conscious growth.
          </p>
        </div>

        {/* Logo Scroller */}
        <div className="relative">
          <div className="flex space-x-8 animate-scroll">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className={`flex-shrink-0 w-32 h-32 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  index % partners.length === currentIndex ? 'ring-4 ring-rainbow-gradient ring-opacity-50' : ''
                }`}
              >
                <div className="text-4xl mb-2">{partner.logo}</div>
                <h3 className="font-semibold text-xs text-center px-2">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Partner */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">{partners[currentIndex].logo}</div>
            <h3 className="font-heading font-bold text-2xl mb-2">{partners[currentIndex].name}</h3>
            <p className="text-gray-600 mb-4">{partners[currentIndex].description}</p>
            <div className="flex justify-center space-x-2">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-rainbow-gradient' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
