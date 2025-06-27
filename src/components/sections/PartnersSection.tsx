
import { Card } from "@/components/ui/card";

const PartnersSection = () => {
  const partners = [
    { name: "Valley of Plenty", logo: "🌱", description: "Sustainable community development in Hanover Park" },
    { name: "Human Animal Project", logo: "🐾", description: "Animal rights advocacy and compassionate living" },
    { name: "Mzansi Business Services", logo: "💼", description: "Business development and financial success" },
    { name: "Kalk Bay Indigenous Tours", logo: "🌍", description: "Cultural heritage and indigenous wisdom" },
    { name: "Conscious Brands Co", logo: "✨", description: "Ethical business partnerships" },
    { name: "SA Wellness Network", logo: "🧘", description: "Community wellness initiatives" },
    { name: "Green Media Alliance", logo: "🌿", description: "Sustainable media production" },
    { name: "Impact Collective", logo: "🤝", description: "Social impact collaboration" },
    { name: "Mindful Ventures", logo: "🧠", description: "Conscious business investment" },
    { name: "Ubuntu Foundation", logo: "❤️", description: "Community upliftment programs" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
            Our <span className="bg-rainbow-gradient bg-clip-text text-transparent">Partners</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Collaborating with conscious organizations and brands to create meaningful impact across South Africa and beyond.
          </p>
        </div>

        {/* Interactive Logo Scroller */}
        <div className="relative">
          <div className="flex animate-scroll-left space-x-8 mb-8">
            {[...partners, ...partners].map((partner, index) => (
              <Card 
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-64 h-32 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-transparent group-hover:bg-rainbow-gradient group-hover:bg-clip-text transition-all duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {partner.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Second row - reverse direction */}
          <div className="flex animate-scroll-right space-x-8">
            {[...partners.slice(5), ...partners.slice(5)].map((partner, index) => (
              <Card 
                key={`${partner.name}-reverse-${index}`}
                className="flex-shrink-0 w-64 h-32 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer group border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {partner.logo}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-transparent group-hover:bg-rainbow-gradient group-hover:bg-clip-text transition-all duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {partner.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to partner with us?</p>
          <button className="bg-rainbow-gradient hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
