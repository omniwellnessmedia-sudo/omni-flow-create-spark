import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users } from "lucide-react";
import { IMAGES } from "@/lib/images";

const team = [
  {
    name: "Chad Cupido",
    role: "Founding Director",
    image: IMAGES.team.chad,
    initials: "CC",
  },
  {
    name: "Tumelo Thabo Ncube",
    role: "Technical Founder",
    image: null,
    initials: "TN",
  },
  {
    name: "Zenith Yasin",
    role: "Operations Lead",
    image: IMAGES.team.zenith,
    initials: "ZY",
  },
  {
    name: "Feroza Begg",
    role: "Admin Support",
    image: IMAGES.team.feroza,
    initials: "FB",
  },
];

export const TeamPreviewSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet the <span className="text-gradient-rainbow">People</span> Behind Omni
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A passionate team dedicated to creating conscious content that uplifts, educates, and inspires real change.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {team.map((member, index) => (
            <Card 
              key={member.name} 
              className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Gradient Initials Fallback */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center ${member.image ? 'hidden' : ''}`}>
                    <span className="text-white text-4xl md:text-5xl font-bold tracking-wider">
                      {member.initials}
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 line-clamp-1">
                    {member.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/about" className="flex items-center gap-2">
              Meet the Full Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TeamPreviewSection;
