
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";

const PartnersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    { name: "2beWell All Natural", logo: IMAGES.partners.twoBeWell, description: "Natural Wellness Products" },
    { name: "APEX Advocacy", logo: IMAGES.partners.apex, description: "Legal Advocacy Services" },
    { name: "MBS Mzansi Business Services", logo: IMAGES.partners.mbs, description: "Business Solutions" },
    { name: "Dr. Phil-Afei", logo: IMAGES.partners.drPhil, description: "Healthcare Services" },
    { name: "Amor Foundation", logo: IMAGES.partners.amor, description: "Community Support" },
    { name: "Baboon Conservation", logo: IMAGES.partners.baboonConservation, description: "Wildlife Protection" },
    { name: "Kai Cape Nature Cubs", logo: IMAGES.partners.kai, description: "Environmental Education" },
    { name: "Travel & Tours Cape Town", logo: IMAGES.partners.travelTours, description: "Adventure Travel" },
    { name: "Omni Wellness", logo: IMAGES.omni.logo, description: "Holistic Wellness Platform" },
    { name: "Sandy Mitchell Yoga", logo: IMAGES.logos.omniIcon, description: "Yoga & Breathwork" }
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
                className={`flex-shrink-0 w-40 h-32 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 p-3 ${
                  index % partners.length === currentIndex ? 'ring-4 ring-primary ring-opacity-50' : ''
                }`}
              >
              <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-w-full max-h-16 object-contain mb-2"
                  onError={(e) => { e.currentTarget.src = IMAGES.omni.logo; }}
                />
                <h3 className="font-semibold text-xs text-center px-2">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Partner */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="h-24 flex items-center justify-center mb-4">
              <img 
                src={partners[currentIndex].logo} 
                alt={partners[currentIndex].name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.currentTarget.src = IMAGES.omni.logo; }}
              />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2">{partners[currentIndex].name}</h3>
            <p className="text-gray-600 mb-4">{partners[currentIndex].description}</p>
            <div className="flex justify-center space-x-2">
              {partners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
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
