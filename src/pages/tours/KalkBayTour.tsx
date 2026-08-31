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
import { withManifestImages } from '@/data/tourGalleries';
import { WalkAbout, WalkIncluded, WalkPricing, WalkSeriesNav } from '@/components/tours/IndigenousWalkSections';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function KalkBayTour() {
  useTourSEO({
    tourName: 'Kalk Bay Rich Tapestry Walk',
    title: 'Kalk Bay Rich Tapestry Walk | Ancient Whispers, Healing Herbs | Cape Town',
    description: 'Explore the rich tapestry of Kalk Bay — ancient whispers and healing herbs. From the Brass Bell to historic harbour herb stands, Khoi marine knowledge, ancient trade routes, and plant medicine. Three-walk suite from R1,850 pp.',
    price: 1850,
    currency: 'ZAR',
    location: 'Kalk Bay, Cape Town',
    duration: '5-6 hours',
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
                Book This Experience
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

      <WalkAbout slug="kalk-bay-tour" />

      {/* Shared inclusions, lunch package and not-included list.
          One source for all three walks: src/data/indigenousWalks.ts. */}
      <WalkIncluded />

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
                  <p>Traditional refreshments and herbal tea ceremony. Reflective sharing circle, closing ceremony. Receive your commemorative indigenous gift.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <TourImageGallery
        title="Kalk Bay's Rich Tapestry"
        images={withManifestImages('kalk-bay-tour', [
          { src: `${STORAGE_BASE}/General%20Images/indigenous%20tour%20chief%20kingsley%20explaining.jpg`, alt: 'Chief Kingsley explaining indigenous heritage', caption: 'Chief Kingsley sharing the deep history of Kalk Bay\'s coastal heritage' },
          { src: `${STORAGE_BASE}/General%20Images/community%20outing%202.jpg`, alt: 'Community walking along the coast', caption: 'Traversing ancient Khoi trading routes along False Bay' },
          { src: `${STORAGE_BASE}/General%20Images/chief%20kingsley%20talking%20to%20group.jpg`, alt: 'Chief Kingsley with group', caption: 'Learning about traditional herb knowledge and plant medicine' },
          { src: `${STORAGE_BASE}/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg`, alt: 'Chief Kingsley portrait', caption: 'Chief Kingsley — custodian of Khoi ancestral wisdom' },
          { src: `${STORAGE_BASE}/General%20Images/happy%20client%20on%20tour.jpg`, alt: 'Tour participant', caption: 'Breathtaking panoramic views of False Bay from the trail' },
          { src: `${STORAGE_BASE}/General%20Images/community%20outing%201.jpg`, alt: 'Group at Kalk Bay', caption: 'Archaeological evidence of ancient settlements along the coast' },
        ])}
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


      {/* Cultural Protocols. Added 30 August 2026: the other two walks carry
          this section and this one did not. The walk visits working herb
          stands and cultural sites, so the same respect rules apply. */}
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
                  { icon: Heart, title: 'Working Community, Not a Backdrop', text: 'The harbour, herb stands and shops we visit are people\'s livelihoods. Ask before photographing anyone, and buy from the stands if something speaks to you.' },
                  { icon: Leaf, title: 'Plant Knowledge Is Shared, Not Taken', text: 'Traditional remedies are explained by the people who hold that knowledge. Harvest nothing yourself, and treat what you are told as their heritage.' },
                  { icon: Camera, title: 'Leave No Trace', text: 'Take only photographs and memories. All litter is carried out.' },
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
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <WalkPricing />

            {/* Community impact.
                WHAT THIS REPLACED. Until 30 August 2026 this card carried
                our sister foundation's branding, a proceeds percentage with
                no verifiable source in this repository, and tax deduction
                language. The standing rule for this site is explicit: it is
                the commercial entity, and foundation branding, donation
                links and tax receipt language do not appear on it. What remains below is only what
                the commercial site can stand behind, and the community work
                itself is presented on our own CSR page. */}
            <Card className="mt-8 border-2 border-green-600/20 bg-gradient-to-br from-green-50/80 to-blue-50/80">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <Heart className="w-10 h-10 text-green-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Your visit gives back</h3>
                    <p className="text-sm text-muted-foreground">
                      These walks are run with the communities whose heritage they share. A
                      portion of every booking supports community education and the care of
                      the sacred sites you will visit.
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/csr-impact">
                    <Button variant="outline" size="sm">See our community impact</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              An Ubuntu Journeys experience · Operated by Travel & Tours Cape Town Pty Ltd, presented with Omni Wellness Media · traveltourscapetown@gmail.com
            </p>
          </div>
        </div>
      </section>


      <WalkSeriesNav slug="kalk-bay-tour" />

      {/* The wellness layer: this walk is one thread of a wider programme.
          Links only to routes that exist. */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-6 rounded-2xl border bg-background p-7">
            <div className="min-w-[260px] flex-1">
              <p className="font-heading text-xl">Make a wellness day of it</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Screenings, workshops and community wellness events run alongside our walks.
                Every listing on the calendar is checked by a person before it appears.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/events"><Button variant="outline">What is on</Button></Link>
              <Link to="/tours"><Button variant="outline">All tours</Button></Link>
            </div>
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
