import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Check, Mountain, Sun, Leaf, Camera, Heart, User, MapPin, Clock, Users, Gift, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function GreatMotherCaveTour() {
  useTourSEO({
    tourName: 'The Great Mother Cave Tour with Chief Kingsley',
    title: 'Great Mother Cave Tour | 12,000-Year Sacred Indigenous Experience | Fish Hoek, Cape Town',
    description: 'Journey through 12,000 years of heritage with Chief Kingsley at Peer\'s Cave and Tunnel Cave. Indigenous plant wisdom, ancient rock art, traditional ceremonies, and celestial alignments. From R1,850pp.',
    price: 1850,
    currency: 'ZAR',
    location: 'Fish Hoek, Cape Town',
    duration: '4-5 hours',
    rating: 5.0,
    reviewCount: 47,
    images: [],
    url: window.location.href
  });

  const tour = {
    id: 'great-mother-cave-tour',
    title: 'The Great Mother Cave Tour with Chief Kingsley',
    price: 1850,
    price_from: 1850,
    duration: '4-5 hours',
    destination: 'Fish Hoek, Cape Town',
    max_participants: 12,
    overview: 'Sacred indigenous journey through 12,000 years of heritage at Peer\'s Cave and the Ascension Tunnel',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    active: true
  };

  const pricingTiers = [
    { range: '1-4 People', label: 'Intimate Experience', price: 'R2,330', perPerson: true },
    { range: '5-9 People', label: 'Small Group', price: 'R2,050', perPerson: true, popular: true },
    { range: '10-12 People', label: 'Group Experience', price: 'R1,850', perPerson: true, bestValue: true },
  ];

  const inclusions = [
    { icon: User, title: 'Expert Indigenous Guidance', desc: 'Led by Chief Kingsley of the Gorachouqua Khoi Nation' },
    { icon: Mountain, title: 'Deep Cultural Immersion', desc: '12,000 years of living heritage at Peer\'s Cave & Ascension Tunnel' },
    { icon: Leaf, title: 'Traditional Refreshments', desc: 'Indigenous herbal tea and light refreshments' },
    { icon: Gift, title: 'Herbal Gift', desc: 'A traditional herbal gift to take home' },
    { icon: Camera, title: 'Commemorative Gift', desc: 'Certificate of participation in this sacred journey' },
    { icon: Shield, title: 'Safety Support', desc: 'Trained support team and first aid throughout' },
  ];

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <img 
          src={`${STORAGE_BASE}/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg`}
          alt="Great Mother Cave with Chief Kingsley"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-green-600/80 text-white border-white/30">Sacred Indigenous Experience</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 break-words">
              The Great Mother Cave Tour
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-4 text-white/90">
              with Chief Kingsley of the Gorachouqua Khoi Nation
            </p>
            <p className="text-base sm:text-lg mb-8 text-white/80 max-w-2xl break-words">
              Journey through 12,000 years of sacred heritage. Explore Peer's Cave and the Ascension Tunnel, 
              learn indigenous plant wisdom, witness ancient rock art, and participate in traditional Khoi ceremonies.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Your Sacred Journey
              </Button>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>4-5 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Fish Hoek</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Chief Kingsley */}
      <section id="chief-kingsley" className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src={`${STORAGE_BASE}/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg`}
                  alt="Chief Kingsley"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div>
                <Badge className="mb-4 bg-green-600">Your Guide</Badge>
                <h2 className="text-3xl font-bold mb-4">Chief Kingsley</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Gorachouqua Khoi Nation Traditional Leader
                </p>
                <p className="text-base leading-relaxed mb-4">
                  Chief Kingsley is a respected custodian of Khoi ancestral knowledge, 
                  dedicated to preserving and sharing the sacred wisdom of the First People of Southern Africa.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Through this tour, Chief Kingsley bridges ancient traditions with contemporary 
                  understanding, offering participants an authentic window into indigenous practices, 
                  plant medicine, ceremonial protocols, and the profound spiritual connection between 
                  land, ancestors, and community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What's Included</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inclusions.map((item, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Badge variant="outline" className="text-sm">
                Optional: Traditional lunch add-on — R200 per person
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Sacred Journey Timeline</h2>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sun className="w-5 h-5 text-orange-500" />
                    Morning: Gathering & Ascent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Meeting Point:</strong> Fish Hoek Athletics Club</p>
                  <p>Opening ceremony, safety briefing, and cultural protocols. Begin the ascent through indigenous fynbos, with Chief Kingsley identifying traditional medicinal plants and sharing ancestral harvesting knowledge along the path.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="w-5 h-5 text-green-500" />
                    Peer's Cave: 12,000 Years of Heritage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Experience one of the most significant archaeological sites in Southern Africa. View ancient rock art created by San ancestors, understand the symbolic language and spiritual significance of these sacred visual records.</p>
                  <p>Chief Kingsley shares oral histories passed down through generations — stories of the Gorachouqua people, their relationship with the land, and the cosmological significance of these caves.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mountain className="w-5 h-5 text-blue-500" />
                    The Ascension Tunnel: Sacred Ceremony
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Enter the sacred Tunnel Cave where celestial alignments have been observed for millennia. Experience the profound acoustics and energy of this ancestral ceremonial space.</p>
                  <p>Discover how the First People used these caves as astronomical observatories — seasonal markers, solstice alignments, and the relationship between celestial movements and traditional agricultural practices.</p>
                  <p>Optional participation in a traditional Khoi ceremony honouring the ancestors and the land, guided with full consent and cultural sensitivity.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="w-5 h-5 text-purple-500" />
                    Integration & Descent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Traditional refreshments and herbal tea sharing circle. Reflective discussion about land conservation, indigenous rights, and how to support the Gorachouqua community. Receive your herbal gift and certificate of participation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What to Bring</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Essential Items</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {['Comfortable hiking shoes with good grip', 'Sun protection (hat, sunscreen, sunglasses)', 'Water bottle (at least 1.5L)', 'Light jacket or sweater (caves can be cool)', 'Camera (photography permitted with respect)'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Recommended</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {['Journal or notebook for reflections', 'Small backpack for personal items', 'Binoculars for distant views', 'Open heart and respectful attitude'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Protocols */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Cultural Protocols & Consent</h2>
            <Card className="border-2 border-green-600/20">
              <CardContent className="pt-6">
                <div className="space-y-4 text-sm">
                  <p className="font-semibold text-base">
                    This is a sacred indigenous experience. Your respect and participation are guided by Khoi protocols.
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Sacred Site Etiquette:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>No alcohol or recreational substances before or during the tour</li>
                      <li>Photography permitted with Chief Kingsley's guidance</li>
                      <li>Respect silence when requested during ceremonies</li>
                      <li>Ask permission before touching plants, rocks, or sacred objects</li>
                      <li>Carry out all trash — leave no trace</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Physical Requirements:</h4>
                    <p className="text-muted-foreground">
                      Moderate fitness level required. The tour involves hiking on uneven terrain and 
                      climbing into cave areas. Please inform us of any physical limitations when booking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Tour Pricing</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {pricingTiers.map((tier, i) => (
                <Card key={i} className={`text-center hover:shadow-xl transition-shadow ${tier.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                  <CardHeader>
                    {tier.popular && <Badge className="mx-auto mb-2">Most Popular</Badge>}
                    {tier.bestValue && <Badge variant="secondary" className="mx-auto mb-2">Best Value</Badge>}
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <CardTitle className="text-xl">{tier.range}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tier.label}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-1">{tier.price}</div>
                    <p className="text-sm text-muted-foreground">per person</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Community Impact */}
            <Card className="mt-8 border-2 border-green-600/20 bg-gradient-to-br from-green-50/80 to-blue-50/80">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <Heart className="w-10 h-10 text-green-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Buy One, Sponsor One</h3>
                    <p className="text-sm text-muted-foreground">
                      20% of all tour proceeds support the <strong>Dr. Phil-afel Foundation</strong> community projects — 
                      including youth education, sacred site conservation, and community development. 
                      Your journey creates lasting impact. <em>Section 18A tax-deductible donations available.</em>
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/drphilafel">
                    <Button variant="outline" size="sm">Learn About Our Foundation →</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Operated by Travel & Tours Cape Town Pty Ltd · Contact: traveltourscapetown@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TourBookingSidebar tour={tour} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
