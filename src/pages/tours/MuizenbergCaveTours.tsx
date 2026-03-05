import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { 
  Mountain, Users, Camera, Leaf, Heart, Clock, 
  MapPin, Shield, Sun, Moon, Waves, Check 
} from 'lucide-react';

export default function MuizenbergCaveTours() {
  useTourSEO({
    tourName: 'Muizenberg Living Heritage Walk',
    title: 'Muizenberg Living Heritage Walk with Joel Erasmus | Indigenous Healing',
    description: 'Experience indigenous healing through Khoi-San traditions at Muizenberg Cave with expert guide Joel Erasmus. Sacred site meditation, rock art interpretation, and coastal wellness walk.',
    price: 2330,
    currency: 'ZAR',
    location: 'Muizenberg, Cape Town',
    duration: '4 hours',
    rating: 4.9,
    reviewCount: 127,
    images: [],
    url: window.location.href
  });

  const tour = {
    id: 'muizenberg-cave-tours',
    title: 'Muizenberg Living Heritage Walk',
    price: 2330,
    price_from: 1800,
    duration: '4 hours',
    destination: 'Muizenberg, Cape Town',
    max_participants: 20,
    overview: 'Indigenous healing walk with sacred site meditation and Khoi-San cultural protocols',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    active: true
  };

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[75vh] overflow-hidden">
        <img 
          src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg" 
          alt="Muizenberg Cave panoramic view"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Mountain className="w-3 h-3 mr-1" />
              Indigenous Healing Walk • 4 Hours
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Muizenberg Cave & Coastal Wellness Walk
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/95 leading-relaxed">
              Sacred site meditation, Khoi-San rock art interpretation, and indigenous healing practices 
              with expert guide Joel Erasmus in one of Cape Town's most spiritually significant locations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Book Now - From R1,800 pp
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Enquire
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Guide */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Meet Your Guide</h2>
            
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-5 gap-8 p-8">
                <div className="md:col-span-2 flex flex-col items-center text-center">
                  <Avatar className="w-40 h-40 mb-6 border-4 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">JE</AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-bold mb-2">Joel Erasmus</h3>
                  <p className="text-muted-foreground mb-4">Adventure Tour Guide & Indigenous Knowledge Holder</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">
                      <Mountain className="w-3 h-3 mr-1" />
                      10+ Years Experience
                    </Badge>
                    <Badge variant="secondary">
                      <Heart className="w-3 h-3 mr-1" />
                      Cultural Expert
                    </Badge>
                  </div>
                </div>
                
                <div className="md:col-span-3 space-y-4">
                  <p className="text-lg leading-relaxed">
                    Joel is a deeply knowledgeable guide who bridges ancient Khoi-San wisdom with contemporary 
                    wellness practices. Born and raised in the Cape Peninsula, he carries forward generations 
                    of indigenous knowledge about sacred sites, healing plants, and the spiritual significance 
                    of the Muizenberg caves.
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    His approach combines storytelling, rock art interpretation, and mindfulness practices to 
                    create transformative experiences. Joel has guided over 500 international visitors and 
                    local community groups, helping them connect with the land's healing energy and understand 
                    the deep cultural protocols of the Khoi-San people.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-sm">Certified Guide</p>
                        <p className="text-xs text-muted-foreground">SATSA Registered</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Leaf className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold text-sm">Plant Medicine</p>
                        <p className="text-xs text-muted-foreground">Indigenous Herbalist</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Your Journey Timeline</h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-primary/20 hidden md:block" />
              
              <div className="space-y-12">
                {/* 09:00 - Meeting Point */}
                <div className="relative pl-0 md:pl-20">
                  <div className="absolute left-0 md:left-[1.6rem] top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hidden md:flex">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">09:00 AM</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle>Meeting & Cultural Protocols</CardTitle>
                      <CardDescription>Muizenberg Pavilion parking area</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Welcome ceremony and introduction to Khoi-San cultural protocols</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Safety briefing and equipment check</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Setting intentions for the healing journey</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 09:30 - Coastal Walk */}
                <div className="relative pl-0 md:pl-20">
                  <div className="absolute left-0 md:left-[1.6rem] top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hidden md:flex">
                    <Waves className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">09:30 AM</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle>Coastal Wellness Walk</CardTitle>
                      <CardDescription>Along the historic Muizenberg shoreline</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Mindful walking practice with ocean breathing techniques</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Identification of indigenous coastal plants and their healing properties</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Stories of the Khoi-San people's relationship with False Bay</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 10:30 - Cave Arrival */}
                <div className="relative pl-0 md:pl-20">
                  <div className="absolute left-0 md:left-[1.6rem] top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hidden md:flex">
                    <Mountain className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">10:30 AM</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle>Sacred Cave Experience</CardTitle>
                      <CardDescription>The heart of the indigenous healing journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Rock art interpretation - understanding ancient visual language</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Guided meditation utilizing the cave's natural acoustics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Sacred silence practice - connecting with ancestral energy</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Archaeological and spiritual significance explained</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 11:30 - Sharing Circle */}
                <div className="relative pl-0 md:pl-20">
                  <div className="absolute left-0 md:left-[1.6rem] top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hidden md:flex">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">11:30 AM</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle>Integration & Sharing Circle</CardTitle>
                      <CardDescription>Ubuntu philosophy - "I am because we are"</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Reflective sharing circle using traditional storytelling methods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Indigenous tea ceremony with local healing plants</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Q&A about Khoi-San culture, spirituality, and contemporary context</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 12:30 - Return Journey */}
                <div className="relative pl-0 md:pl-20">
                  <div className="absolute left-0 md:left-[1.6rem] top-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hidden md:flex">
                    <Sun className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">12:30 PM</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle>Return & Integration</CardTitle>
                      <CardDescription>Bringing the experience home</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Gentle walk back with integration practices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Closing ceremony and gratitude practice</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>Resources for continued learning and practice</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">What to Bring</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Sun className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Essential Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Comfortable walking shoes</strong> with good grip (trail runners or hiking shoes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Sun protection:</strong> Hat, sunscreen (SPF 50+), sunglasses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Water bottle</strong> (1.5L minimum) - stay hydrated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Light layers</strong> - weather can change quickly on the coast</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Small backpack</strong> for personal items</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Camera className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Optional But Recommended</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Camera or phone</strong> for capturing memories (respectfully)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Journal and pen</strong> for reflections and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Light snacks</strong> (energy bars, fruit, nuts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Small towel</strong> if you wish to sit on the cave floor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span><strong>Binoculars</strong> for coastal bird watching</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Protocols */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Cultural Protocols & Respect</h2>
              <p className="text-lg text-muted-foreground">
                The cave is a sacred site. We honor the Khoi-San ancestors and follow traditional protocols.
              </p>
            </div>
            
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Sacred Space Awareness</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The cave has been a place of ceremony, shelter, and healing for thousands of years. 
                        We enter with reverence, gratitude, and mindfulness. No touching of rock art or 
                        disturbing the natural environment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Respectful Photography</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Photography is permitted but must be done respectfully. No flash photography of rock art. 
                        Always ask permission before photographing other participants. Some moments are meant to be 
                        experienced without screens.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Leaf className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Leave No Trace</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We follow strict environmental ethics. Take only photographs and memories. 
                        Leave only gratitude and footprints. All litter must be carried out, including organic waste.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Moon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Sacred Silence</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Portions of the experience involve intentional silence to honor the sacredness of the space 
                        and allow for deep listening - to the land, to your inner voice, and to the wisdom of ancestors. 
                        Your guide will signal when silence is requested.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Transparent Pricing</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl">1-4 People</CardTitle>
                  <CardDescription>Intimate Experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">R2,330</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow border-primary">
                <CardHeader>
                  <Badge className="mx-auto mb-2" variant="default">Most Popular</Badge>
                  <Users className="w-10 h-10 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl">5-9 People</CardTitle>
                  <CardDescription>Small Group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">R2,100</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                  <Badge variant="secondary" className="mt-2">Save R230</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl">10-14 People</CardTitle>
                  <CardDescription>Group Experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">R1,950</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                  <Badge variant="secondary" className="mt-2">Save R380</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl">15-20 People</CardTitle>
                  <CardDescription>Large Group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">R1,800</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                  <Badge variant="secondary" className="mt-2">Best Value</Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Special Rates for Educational Groups</h3>
                <p className="text-muted-foreground mb-4">
                  Schools and educational institutions receive <strong>50% discount</strong> on all group bookings
                </p>
                <Badge variant="outline" className="text-sm">
                  Contact us for school group arrangements
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-muted/30">
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
