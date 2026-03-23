import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import StickyBookingBar from '@/components/tours/StickyBookingBar';
import TourImageGallery from '@/components/tours/TourImageGallery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { 
  Mountain, Users, Camera, Leaf, Heart, Clock, 
  MapPin, Shield, Sun, Waves, Check, Gift, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function MuizenbergCaveTours() {
  useTourSEO({
    tourName: 'Muizenberg Living Heritage Walk',
    title: 'Muizenberg Living Heritage Walk | Ancient History by the Sea | Cape Town',
    description: 'An experience of ancient history by the sea. Walk from Surfers Corner through Boyes Drive, explore ancient foraging paths, shell middens, and marine heritage with Chief Kingsley. From R1,850pp.',
    price: 1850,
    currency: 'ZAR',
    location: 'Muizenberg, Cape Town',
    duration: '5-6 hours',
    rating: 4.9,
    reviewCount: 127,
    images: [],
    url: window.location.href
  });

  const tour = {
    id: 'muizenberg-cave-tours',
    title: 'Muizenberg Living Heritage Walk',
    price: 1850,
    price_from: 1850,
    duration: '5-6 hours',
    destination: 'Muizenberg, Cape Town',
    max_participants: 12,
    overview: 'An experience of ancient history by the sea — from Surfers Corner through Boyes Drive to ancient shell middens',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    active: true
  };

  const pricingTiers = [
    { range: '1-4 People', label: 'Intimate Experience', price: 'R2,330', perPerson: true },
    { range: '5-9 People', label: 'Small Group', price: 'R2,050', perPerson: true, popular: true },
    { range: '10-12 People', label: 'Group Experience', price: 'R1,850', perPerson: true, bestValue: true },
  ];

  const inclusions = [
    { icon: User, title: 'Expert Indigenous Guidance', desc: 'Led by Chief Kingsley & Travel and Tours Cape Town team' },
    { icon: Mountain, title: 'Deep Cultural Immersion', desc: 'Ancient foraging paths, shell middens & marine heritage' },
    { icon: Leaf, title: 'Traditional Refreshments', desc: 'Indigenous herbal tea and light refreshments' },
    { icon: Gift, title: 'Herbal Gift', desc: 'A traditional herbal gift to take home' },
    { icon: Camera, title: 'Commemorative Gift', desc: 'Certificate of participation' },
    { icon: Shield, title: 'Safety Support', desc: 'Trained support team and first aid throughout' },
  ];

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[75vh] overflow-hidden">
        <img 
          src={`${STORAGE_BASE}/General%20Images/muizenberg%20cave%20view%202.jpg`}
          alt="Muizenberg Living Heritage Walk — panoramic False Bay coastline"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Mountain className="w-3 h-3 mr-1" />
              Indigenous Heritage Walk • 5-6 Hours
            </Badge>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl mb-4 leading-tight break-words">
              Muizenberg Living Heritage Walk
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-2 text-white/95 italic">
              An Experience of Ancient History by the Sea
            </p>
            <p className="text-base sm:text-lg mb-8 text-white/80 max-w-2xl break-words">
              Walk from Surfers Corner through Boyes Drive, exploring ancient foraging paths, 
              shell middens, and the marine heritage of the First People with Chief Kingsley 
              and the Travel & Tours Cape Town team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Now — From R1,850 pp
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">Enquire</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 justify-center">
              <Clock className="w-5 h-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Duration</p><p className="font-semibold text-sm">5-6 hours</p></div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <MapPin className="w-5 h-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Start Point</p><p className="font-semibold text-sm">Surfers Corner</p></div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Users className="w-5 h-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Group Size</p><p className="font-semibold text-sm">Max 12</p></div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Mountain className="w-5 h-5 text-primary" />
              <div><p className="text-xs text-muted-foreground">Difficulty</p><p className="font-semibold text-sm">Challenging</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Guide */}
      <section id="chief-kingsley" className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src={`${STORAGE_BASE}/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg`}
                  alt="Chief Kingsley"
                  className="rounded-2xl shadow-2xl"
                  loading="lazy"
                />
              </div>
              <div>
                <Badge className="mb-4 bg-green-600">Your Guide</Badge>
                <h2 className="text-3xl font-bold mb-4">Chief Kingsley & Team</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Gorachouqua Khoi Nation Traditional Leader · Travel & Tours Cape Town
                </p>
                <p className="text-base leading-relaxed mb-4">
                  Chief Kingsley is a respected custodian of Khoi ancestral knowledge. Together with the 
                  Travel & Tours Cape Town team, he leads immersive heritage walks that bridge ancient 
                  traditions with contemporary understanding.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This walk reveals the deep connection between the First People and the Muizenberg coastline — 
                  from ancient marine foraging practices to the shell middens that tell stories spanning millennia.
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
            <h2 className="font-heading text-3xl mb-8 text-center">What's Included</h2>
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

            {/* What's Not Included */}
            <div className="mt-10 bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Please Note — Not Included</h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="text-destructive">✗</span> Transport to and from venues</li>
                <li className="flex items-center gap-2"><span className="text-destructive">✗</span> Lunch (optional add-on available — see above)</li>
                <li className="flex items-center gap-2"><span className="text-destructive">✗</span> Personal items and hiking gear</li>
                <li className="flex items-center gap-2"><span className="text-destructive">✗</span> Additional drinks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl mb-8 text-center">Your Journey Timeline</h2>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Gathering: Surfers Corner Circle (Walk of Fame)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Welcome ceremony at the iconic Surfers Corner. Cultural protocols, safety briefing, and setting intentions for the heritage journey ahead.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Waves className="w-5 h-5 text-green-500" />
                    Coastal Walk & Marine Heritage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Walk the historic Muizenberg shoreline, learning about the Khoi-San people's relationship with False Bay. Explore ancient marine resource knowledge — how the First People read tides, harvested shellfish, and understood seasonal ocean patterns.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mountain className="w-5 h-5 text-orange-500" />
                    Boyes Drive Ascent & Ancient Foraging Paths
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Ascend through indigenous fynbos along routes used for millennia. Chief Kingsley identifies traditional medicinal plants, explains sustainable harvesting practices, and shares the ethnobotanical knowledge of the Khoi people.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sun className="w-5 h-5 text-purple-500" />
                    Shell Middens & Archaeological Heritage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Discover ancient shell middens — layered deposits that reveal thousands of years of human activity. Learn to read these natural archives that tell the story of the First People's diet, trade, and seasonal movements along the coast.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pink-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="w-5 h-5 text-pink-500" />
                    Integration & Sharing Circle
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Traditional refreshments and herbal tea ceremony. Reflective sharing circle, Q&A about Khoi-San culture, and closing ceremony. Receive your herbal gift and certificate of participation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <TourImageGallery
        title="Muizenberg's Living Heritage"
        images={[
          { src: `${STORAGE_BASE}/General%20Images/muizenberg%20cave%20view%202.jpg`, alt: 'Muizenberg cave panoramic view', caption: 'Panoramic views of False Bay from the ancient cave vantage points' },
          { src: `${STORAGE_BASE}/General%20Images/muizenberg%20cave%20view.jpg`, alt: 'Cave formations at Muizenberg', caption: 'Ancient cave formations along the Muizenberg trail' },
          { src: `${STORAGE_BASE}/General%20Images/wellness%20group%20tour.jpg`, alt: 'Group walking the coastal trail', caption: 'Ascending Boyes Drive — ancient foraging and trade paths' },
          { src: `${STORAGE_BASE}/General%20Images/chief%20kingsley%201.jpg`, alt: 'Chief Kingsley on the trail', caption: 'Chief Kingsley sharing Khoi-San coastal heritage' },
          { src: `${STORAGE_BASE}/General%20Images/community%20outing%201.jpg`, alt: 'Community on the walk', caption: 'Small groups foster deeper cultural connection' },
          { src: `${STORAGE_BASE}/General%20Images/tour%20picture%20couple%20with%20chief%20kingsley.jpg`, alt: 'Guests with Chief Kingsley', caption: 'Meaningful encounters along the ancient coastline' },
        ]}
      />

      {/* What to Bring */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl mb-8 text-center">What to Bring</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Essential Items</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {['Comfortable hiking shoes with good grip', 'Sun protection (hat, sunscreen SPF 50+, sunglasses)', 'Water bottle (1.5L minimum)', 'Light layers — weather changes quickly on the coast', 'Small backpack for personal items'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
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
                    {['Camera or phone for capturing memories', 'Journal and pen for reflections', 'Light snacks (energy bars, fruit)', 'Binoculars for coastal bird watching', 'Small towel if you wish to sit on cave floor'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
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
            <div className="text-center mb-8">
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Cultural Protocols & Respect</h2>
            </div>
            <Card className="border-primary/20">
              <CardContent className="p-8 space-y-6">
                {[
                  { icon: Heart, title: 'Sacred Space Awareness', text: 'We enter ancestral sites with reverence, gratitude, and mindfulness. No touching of rock art or disturbing the natural environment.' },
                  { icon: Camera, title: 'Respectful Photography', text: 'Photography is permitted but must be done respectfully. No flash photography of rock art. Some moments are meant to be experienced without screens.' },
                  { icon: Leaf, title: 'Leave No Trace', text: 'Take only photographs and memories. Leave only gratitude and footprints. All litter must be carried out.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl mb-8 text-center">Tour Pricing</h2>
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
                      youth education, sacred site conservation, and community development. 
                      <em> Section 18A tax-deductible donations available.</em>
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

            <Card className="mt-4 bg-muted/30">
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold mb-1">Special Rates for Educational Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Schools and educational institutions receive <strong>50% discount</strong>. Contact us for arrangements.
                </p>
              </CardContent>
            </Card>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Operated by Travel & Tours Cape Town Pty Ltd · Contact: traveltourscapetown@gmail.com
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TourBookingSidebar tour={tour} />
          </div>
        </div>
      </section>

      <Footer />
      <StickyBookingBar price="R1,850" tourName="Muizenberg Living Heritage Walk" />
    </>
  );
}
