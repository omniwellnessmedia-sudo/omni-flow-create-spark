import { Link } from "react-router-dom";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Mountain, Sparkles, Building2, TreePine } from "lucide-react";

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

const tours = [
  {
    title: "The Great Mother Cave Tour",
    subtitle: "with Chief Kingsley",
    description: "Journey through 12,000 years of sacred heritage at Peer's Cave and the Ascension Tunnel. Indigenous plant wisdom, ancient rock art, and traditional Khoi ceremonies.",
    location: "Fish Hoek, Cape Town",
    duration: "4-5 hours",
    difficulty: "Moderate",
    price: "From R1,850pp",
    image: `${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`,
    href: "/tours/great-mother-cave-tour",
    badge: "Sacred Indigenous Experience",
    icon: Mountain,
  },
  {
    title: "Muizenberg's Living Heritage",
    subtitle: "An Experience of Ancient History by the Sea",
    description: "From Surfers Corner to ancient foraging paths along Boyes Drive. Discover Khoi-San coastal settlements, shell middens, and the enduring heritage of False Bay.",
    location: "Muizenberg, Cape Town",
    duration: "5-6 hours",
    difficulty: "Challenging",
    price: "From R1,850pp",
    image: `${STORAGE_BASE}/General%20Images/muizenberg%20cave%20view%202.jpg`,
    href: "/tours/muizenberg-cave-tours",
    badge: "Coastal Heritage Walk",
    icon: TreePine,
  },
  {
    title: "Kalk Bay's Rich Tapestry",
    subtitle: "Ancient Whispers, Healing Herbs",
    description: "Explore the historic working harbour, ancient coastal caves, and traditional herb stands. Trace Khoi trade routes and discover ancestral plant medicine along False Bay.",
    location: "Kalk Bay, Cape Town",
    duration: "5-6 hours",
    difficulty: "Challenging",
    price: "From R1,850pp",
    image: `${STORAGE_BASE}/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`,
    href: "/tours/kalk-bay-tour",
    badge: "Cultural Coastal Journey",
    icon: Mountain,
  },
  {
    title: "Hoofbeats & Healing",
    subtitle: "Equine-Assisted Wellness Experience",
    description: "A CPD-accredited, evidence-based encounter with rescued working horses through the Pegasus Programme. Impact travel that transforms lives — human and animal.",
    location: "Cape Town",
    duration: "Half Day",
    difficulty: "Easy",
    price: "From R1,800pp",
    image: `${STORAGE_BASE}/provider-images/CPTCHA_BEACH_LIONSHEAD_MARCH_SHOOT%2002_OMNI-20.jpg`,
    href: "/experiences/cart-horse-urban-wellness",
    badge: "Impact Travel",
    icon: Sparkles,
  },
  {
    title: "Rewild Your Team",
    subtitle: "Bespoke Corporate Wellness Retreats",
    description: "Transformative impact travel for teams. Equine-assisted therapy, indigenous heritage walks, and facilitated wellness programming with measurable outcomes.",
    location: "Cape Town",
    duration: "1-3 Days",
    difficulty: "All Levels",
    price: "From R80,000",
    image: `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`,
    href: "/experiences/corporate-wellness-retreat",
    badge: "Corporate & ESG",
    icon: Building2,
  },
  {
    title: "4th Annual Omni Wellness Retreat",
    subtitle: "Rejuvenate and Renew",
    description: "A weekend wellness retreat at the serene Greyton Eco Lodge. Yoga, meditation, community connection, and holistic wellness programming.",
    location: "Greyton, Western Cape",
    duration: "Weekend",
    difficulty: "All Levels",
    price: "Contact for pricing",
    image: `${STORAGE_BASE}/General%20Images/Wellness%20retreat%202.jpg`,
    href: "/tour-detail/winter-wine-country-wellness",
    badge: "Annual Retreat",
    icon: TreePine,
  },
];

const ToursRetreats = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={`${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`}
          alt="Indigenous walks and wellness experiences in Cape Town"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-green-600/80 text-white border-white/30">Impact Travel Cape Town</Badge>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-4 break-words">
              Tours, Retreats & Experiences
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl">
              Immersive cultural journeys, equine-assisted wellness, and transformative corporate retreats.
              Every experience creates lasting impact for communities, animals, and the land.
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl mb-3">Our Experiences</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From sacred indigenous walks with Chief Kingsley to bespoke corporate wellness retreats —
                each journey is designed to create meaningful connection and lasting change.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <Link key={tour.href} to={tour.href} className="block group">
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 left-3 bg-green-600/90 text-white text-xs">
                        {tour.badge}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tour.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground italic">{tour.subtitle}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{tour.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tour.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tour.duration}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-semibold text-sm text-primary">{tour.price}</span>
                        <Badge variant="outline" className="text-xs">{tour.difficulty}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl mb-4">Can't Decide?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our team will help you choose the perfect experience based on your interests, group size, and schedule.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToursRetreats;
