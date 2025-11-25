import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Check, Mountain, Sun, Leaf, Camera, Heart, User, MapPin, Clock } from 'lucide-react';

export default function GreatMotherCaveTour() {
  useTourSEO({
    tourName: 'The Great Mother Cave Tour with Chief Kingsley',
    title: 'Great Mother Cave Tour | Sacred Indigenous Experience | Cape Town',
    description: 'Full-day sacred journey with Chief Kingsley through Peers Cave and Tunnel Cave. Indigenous plant identification, rock art viewing, traditional ceremonies, and celestial alignments.',
    price: 1500,
    currency: 'ZAR',
    location: 'Muizenberg, Cape Town',
    duration: '1 day (8:30 AM - 4:30 PM)',
    rating: 5.0,
    reviewCount: 47,
    images: [],
    url: window.location.href
  });

  const tour = {
    id: 'great-mother-cave-tour',
    title: 'The Great Mother Cave Tour with Chief Kingsley',
    price: 1500,
    price_from: 1500,
    duration: '1 day',
    destination: 'Muizenberg, Cape Town',
    max_participants: 12,
    overview: 'Sacred indigenous journey through ancient caves with traditional ceremonies and plant wisdom',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    active: true
  };

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <img 
          src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg" 
          alt="Great Mother Cave with Chief Kingsley"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-green-600/80 text-white border-white/30">Sacred Indigenous Experience</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Great Mother Cave Tour
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              with Chief Kingsley of the Gorachouqua Khoi Nation
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-2xl">
              Journey through sacred ancestral lands, learn indigenous plant wisdom, 
              witness ancient rock art, and participate in traditional Khoi ceremonies at Peers Cave and Tunnel Cave.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Book Your Sacred Journey - R1,500
              </Button>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Full Day (8:30 AM - 4:30 PM)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Chief Kingsley */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg"
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

      {/* Detailed Itinerary */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Sacred Journey Timeline</h2>
            
            <div className="space-y-6">
              {/* Morning */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="w-6 h-6 text-orange-500" />
                    8:30 AM - 12:00 PM: Morning Immersion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      Indigenous Plant Identification Walk
                    </h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Learn to identify and understand traditional medicinal plants along the mountain path. 
                      Chief Kingsley shares ancestral knowledge of plant properties, sustainable harvesting 
                      practices, and their role in Khoi healing traditions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      Peers Cave Rock Art Viewing
                    </h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Experience ancient rock art created by San ancestors thousands of years ago. 
                      Understand the symbolic language, hunting narratives, and spiritual significance 
                      of these sacred visual records.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Traditional Storytelling & History
                    </h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Hear oral histories passed down through generations. Chief Kingsley shares stories 
                      of the Gorachouqua people, their relationship with the land, and the significance 
                      of these sacred caves in Khoi cosmology.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lunch */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-green-500" />
                    12:00 PM - 1:00 PM: Sacred Meal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Share a traditional meal prepared with indigenous ingredients. This is a time for 
                    reflection, community connection, and deepening understanding of Khoi food culture 
                    and its connection to the land.
                  </p>
                </CardContent>
              </Card>

              {/* Afternoon */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mountain className="w-6 h-6 text-blue-500" />
                    1:00 PM - 4:30 PM: Afternoon Ceremony & Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      Tunnel Cave Sacred Site
                    </h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Enter the sacred Tunnel Cave where celestial alignments have been observed for millennia. 
                      Experience the profound acoustics and energy of this ancestral ceremonial space.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-600" />
                      Celestial Alignments & Astronomy
                    </h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Discover how the First People used these caves as astronomical observatories. 
                      Learn about seasonal markers, solstice alignments, and the relationship between 
                      celestial movements and traditional agricultural practices.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      Traditional Ceremony (Optional Participation)
                    </h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Respectful participation in a traditional Khoi ceremony honoring the ancestors 
                      and the land. Chief Kingsley guides participants through protocols with full 
                      consent and cultural sensitivity.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Conservation & Community Discussion</h4>
                    <p className="text-muted-foreground text-sm ml-6">
                      Engage in dialogue about land conservation, indigenous rights, and the ongoing 
                      work to protect sacred sites. Learn how participants can support the Gorachouqua 
                      community's efforts to preserve ancestral lands.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What to Bring</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Essential Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Comfortable hiking shoes with good grip</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Sun protection (hat, sunscreen, sunglasses)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Water bottle (at least 1.5L)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Light jacket or sweater (caves can be cool)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Camera (photography permitted with respect)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Journal or notebook for reflections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Small backpack for personal items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Binoculars for distant views</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Open heart and respectful attitude</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Protocols */}
      <section className="py-16 bg-background">
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
                      <li>Photography permitted with Chief Kingsley's guidance (some areas may be restricted)</li>
                      <li>Respect silence when requested during ceremonies</li>
                      <li>Ask permission before touching plants, rocks, or sacred objects</li>
                      <li>Carry out all trash - leave no trace</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Ceremony Participation:</h4>
                    <p className="text-muted-foreground">
                      Participation in traditional ceremonies is entirely optional. Chief Kingsley will 
                      explain protocols and request consent before any ceremonial activities. You are 
                      welcome to observe respectfully if you choose not to participate directly.
                    </p>
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

      {/* Pricing & Group Options */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Tour Options & Pricing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle>Group Tour (Max 12 People)</CardTitle>
                  <div className="text-3xl font-bold text-green-600">R1,500</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Full day experience (8:30 AM - 4:30 PM)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Personal guidance from Chief Kingsley</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Traditional meal included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Access to both Peers Cave & Tunnel Cave</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Certificate of participation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Private Tour (1-6 People)</CardTitle>
                  <div className="text-3xl font-bold text-green-600">R9,000</div>
                  <p className="text-sm text-muted-foreground">flat rate (up to 6 people)</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>All group tour inclusions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Exclusive experience for your group</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Flexible schedule (within daylight hours)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Extended Q&A time with Chief Kingsley</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Custom focus areas (plant medicine, history, etc.)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> 20% of tour proceeds support the Gorachouqua community and sacred land conservation efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-background">
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
