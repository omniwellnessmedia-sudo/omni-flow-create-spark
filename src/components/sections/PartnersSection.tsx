
import { useEffect, useState } from "react";

const PartnersSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    { name: "2beWell All Natural", logo: "/lovable-uploads/cce3929c-15e1-4240-9a10-194917d0e6a2.png", description: "Natural Wellness Products" },
    { name: "APKX Advocacy", logo: "/lovable-uploads/9bd1fc88-8e30-41bb-96f8-f3ad2031c817.png", description: "Legal Advocacy Services" },
    { name: "MBS Mzansi Business Services", logo: "/lovable-uploads/f4e7812d-5be4-40ea-a408-13cef8f14bb6.png", description: "Business Solutions" },
    { name: "Dr. Phil-Afei", logo: "/lovable-uploads/47f2fdf7-983a-4c24-a947-c9914636cc6a.png", description: "Healthcare Services" },
    { name: "Hucklberry", logo: "/lovable-uploads/e1f8172d-03e9-45da-832c-b084ae0ff6ad.png", description: "Digital Innovation" },
    { name: "Baboon Conservation", logo: "/lovable-uploads/400a06a0-ddbf-429f-975b-b1c1ca96281a.png", description: "Wildlife Protection" },
    { name: "Kai Cape Nature Cubs", logo: "/lovable-uploads/2cf2a37d-a993-44f1-9751-330306a03454.png", description: "Environmental Education" },
    { name: "Travel & Tours Cape Town", logo: "/lovable-uploads/f5ec8070-277a-4f50-b8e7-f4cd339954e1.png", description: "Adventure Travel" },
    { name: "Cape Nature", logo: "/lovable-uploads/c872ecf3-8ddf-4fd9-8980-1be21b7538c0.png", description: "Conservation Partnership" },
    { name: "Muiz Kitchen", logo: "/lovable-uploads/7bde770e-9c2d-4c9c-89c5-648f41e8470e.png", description: "Conscious Cuisine" }
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
