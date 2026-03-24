import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import StickyBookingBar from '@/components/tours/StickyBookingBar';
import TourImageGallery from '@/components/tours/TourImageGallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { 
  MapPin, Clock, Users, Mountain, Heart, Waves, Camera, Check, 
  Leaf, Shield, Gift, User, Sun, Anchor
} from 'lucide-react';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function KalkBayTour() {
  useTourSEO({
    tourName: 'Kalk Bay Rich Tapestry Walk',
    title: 'Kalk Bay Rich Tapestry Walk | Ancient Whispers, Healing Herbs | Cape Town',
    description: 'Explore the rich tapestry of Kalk Bay — ancient whispers and healing herbs. From the Brass Bell to historic harbour herb stands, Khoi marine knowledge, ancient trade routes, and plant medicine. From R1,850pp.',
    price: 1850,
    currency: 'ZAR',
    location: 'Kalk Bay, Cape Town',
    duration: '5-6 hours',
    rating: 4.8,
    reviewCount: 38,
    images: [],
    url: window.location.href
  });

  const tour = {
    id: 'kalk-bay-tour',
    title: 'Kalk Bay Rich Tapestry Walk',
    price: 1850,
    price_from: 1850,
    duration: '5-6 hours',
    destination: 'Kalk Bay, Cape Town',
    max_participants: 12,
    overview: 'Ancient whispers and healing herbs — explore Kalk Bay\'s harbour, herb stands, Khoi marine knowledge, and plant medicine traditions',
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
    { icon: Leaf, title: 'Plant Medicine Knowledge', desc: 'Herb stands, traditional remedies & healing plant identification' },
    { icon: Anchor, title: 'Marine Heritage', desc: 'Khoi fishing knowledge & harbour cultural history' },
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
          src={`${STORAGE_BASE}/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`}
          alt="Kalk Bay's Rich Tapestry — Chief Kingsley sharing indigenous wisdom"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Waves className="w-3 h-3 mr-1" />
              Indigenous Heritage Walk • 5-6 Hours
            </Badge>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl mb-4 leading-tight break-words">
              Kalk Bay Rich Tapestry Walk
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-2 text-white/95 italic">
              Ancient Whispers, Healing Herbs
            </p>
            <p className="text-base sm:text-lg mb-8 text-white/80 max-w-2xl break-words">
              Discover the rich heritage of Kalk Bay — from the historic harbour and herb stands 
              to ancient Khoi marine knowledge, trade routes, and the living traditions of plant medicine 
              that have sustained communities for millennia.
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
              <div><p className="text-xs text-muted-foreground">Start Point</p><p className="font-semibold text-sm">Brass Bell</p></div>
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

      {/* About This Experience */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl mb-6">About This Experience</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Kalk Bay is one of Cape Town's most beloved coastal villages — a place where fishing 
                heritage, artistic culture, and ancient Khoi knowledge converge. This guided heritage walk takes 
                you through the heart of Kalk Bay, starting next to the iconic Brass Bell Restaurant.
              </p>
              <p>
                Explore the historic harbour where fishermen still bring in their daily catch, visit the 
                traditional herb stands that preserve centuries of plant medicine knowledge, and learn about 
                the Khoi people's deep understanding of marine resources, tidal patterns, and coastal ecology. 
                Chief Kingsley and the team reveal ancient trade routes that connected coastal and inland 
                communities, and the living traditions of healing herbs that continue to this day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/30">
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl mb-8 text-center">Your Journey</h2>
            <div className="space-y-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Gathering: Next to the Brass Bell Restaurant
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Welcome ceremony at the entrance to Kalk Bay. Cultural protocols, safety briefing, and an introduction to the deep heritage of this coastal settlement.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Anchor className="w-5 h-5 text-green-500" />
                    Historic Harbour & Marine Heritage
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Explore the working harbour where fishermen still bring in their daily catch. Learn about the Khoi people's sophisticated understanding of marine resources — tidal patterns, seasonal fishing knowledge, and the sustainable harvesting practices that sustained communities for thousands of years.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="w-5 h-5 text-purple-500" />
                    Herb Stands & Plant Medicine
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Visit the traditional herb stands — a living connection to centuries of plant medicine knowledge. Chief Kingsley identifies healing plants, explains their traditional uses, and reveals the ancient trade routes that connected coastal and inland communities through the exchange of marine resources and medicinal herbs.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mountain className="w-5 h-5 text-orange-500" />
                    Coastal Exploration & Ancient Whispers
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Walk the coastline exploring hidden caves and rock formations. Learn about the archaeological significance of this area — from ancient shell middens to the geological formations that shaped Khoi cosmology and seasonal calendars.</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pink-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sun className="w-5 h-5 text-pink-500" />
                    Integration & Sharing Circle
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Traditional refreshments and herbal tea ceremony. Reflective sharing circle, closing ceremony. Receive your herbal gift and certificate of participation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <TourImageGallery
        title="Kalk Bay's Rich Tapestry"
        images={[
          { src: `${STORAGE_BASE}/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`, alt: 'Chief Kingsley explaining indigenous heritage', caption: 'Chief Kingsley sharing the deep history of Kalk Bay\'s coastal heritage' },
          { src: `${STORAGE_BASE}/General%20Images/community%20outing%202.jpg`, alt: 'Community walking along the coast', caption: 'Traversing ancient Khoi trading routes along False Bay' },
          { src: `${STORAGE_BASE}/General%20Images/chief%20kingsley%20talking%20to%20group.jpg`, alt: 'Chief Kingsley with group', caption: 'Learning about traditional herb knowledge and plant medicine' },
          { src: `${STORAGE_BASE}/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg`, alt: 'Chief Kingsley portrait', caption: 'Chief Kingsley — custodian of Khoi ancestral wisdom' },
          { src: `${STORAGE_BASE}/General%20Images/happy%20client%20on%20tour.jpg`, alt: 'Tour participant', caption: 'Breathtaking panoramic views of False Bay from the trail' },
          { src: `${STORAGE_BASE}/General%20Images/community%20outing%201.jpg`, alt: 'Group at Kalk Bay', caption: 'Archaeological evidence of ancient settlements along the coast' },
        ]}
      />

      {/* What to Bring */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl mb-6 text-center">What to Bring</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Comfortable walking shoes with good grip',
                'Sunscreen & hat',
                'Water bottle (1.5L)',
                'Camera',
                'Light jacket (coastal wind)',
                'Small backpack'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
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
                  <Link to="/csr-impact">
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
      <StickyBookingBar price="R1,850" tourName="Kalk Bay Rich Tapestry Walk" />
    </>
  );
}
