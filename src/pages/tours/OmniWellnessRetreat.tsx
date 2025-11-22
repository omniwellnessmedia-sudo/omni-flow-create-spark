import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';

const OmniWellnessRetreat = () => {
  const images = [
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Wellness-Tours**(travelandtourscapetow)/Omni%20Wellness%20Retreat.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Wellness-Tours**(travelandtourscapetow)/_MG_0148.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat3%20portrait.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg'
  ];

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${images[0]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <Link to="/tour-category/weekend-retreats" className="inline-flex items-center text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Weekend Retreats
            </Link>
            <Badge className="mb-4 bg-primary text-primary-foreground">Weekend Retreats</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              4th Annual Omni Wellness Retreat
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Rejuvenate and Renew in the Serene Greyton Eco Lodge
            </p>
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Feb 27 - May 2, 2026
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Greyton Eco Lodge, South Africa
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                4 days / 3 nights
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Max 30 participants
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">About This Experience</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Join us for a deeply transformative journey at the 2026 Omni Wellness Retreat, set amidst the serene and 
                  enchanting Greyton Eco Lodge. As winter wraps the land in its gentle embrace, we invite you to retreat 
                  within, to a space where mind, body, and soul come into harmonious balance. Hosted by Omni Wellness Media 
                  in collaboration with Olive Tree Realty, this retreat promises not just relaxation, but a profound 
                  reconnection with your inner self and the ancient rhythms of nature.
                </p>
              </div>

              {/* Detailed Itinerary */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Detailed Itinerary</h2>
                <p className="text-sm text-muted-foreground mb-6 italic">Subject to Change</p>
                
                <div className="space-y-8">
                  {/* Day 1 - Morning */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">Arrival and Opening Ceremony</h3>
                            <Badge variant="outline">Day 1 - 8:45 AM</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Your journey begins as the morning light kisses the landscapes of Greyton. At Greyton Eco Lodge, 
                            a sacred opening ceremony awaits. Here, under the wise guidance of our indigenous leaders, you'll 
                            feel the ancient energy of the land envelop you.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Opening Ceremony - Ritual that grounds and centres you
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Welcoming Circle - Meet fellow seekers
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Day 1 - Day Activities */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">Wellness Sessions and Activities</h3>
                            <Badge variant="outline">Day 1 - Throughout Day</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Embrace a day filled with nourishing activities designed to rejuvenate and uplift. Begin with 
                            gentle yoga sessions, move into guided meditations, and experience the joy of NIA Dance Immersion.
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Yoga Sessions (all levels)
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Guided Meditation
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              NIA Dance Immersion
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Smoothie Talk - Plant-based nutrition
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Day 1 - Evening */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">Evening Braai with Live Music</h3>
                            <Badge variant="outline">Day 1 - Evening</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            As the day transitions into evening, gather around for a traditional braai, a South African 
                            barbecue that tantalises the taste buds. Accompanied by live music, this communal meal is a 
                            time to connect, laugh, and share stories under the stars.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Traditional South African Braai
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Live Music Performance
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Day 2 - Morning */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">Morning Wellness Activity</h3>
                            <Badge variant="outline">Day 2 - 7:00 AM</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Rise with the sun and engage in a refreshing morning wellness activity. Whether it's a sunrise 
                            yoga session, a guided meditation, or a nature walk, this activity is designed to energise and 
                            prepare you for the day ahead.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Morning Yoga - Enhance mood and boost productivity
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Nature Walk - Absorb fresh morning air
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Day 2 - Mid Morning */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">Indigenous Walk and Cultural Exploration</h3>
                            <Badge variant="outline">Day 2 - 9:00 AM</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Step into the footsteps of the ancestors with an indigenous walk guided by local experts. Learn 
                            about the rich cultural heritage of the area, participate in traditional practices, and gain a 
                            deeper understanding of the land's historical and spiritual significance.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Indigenous Walk - Traverse sacred paths
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Cultural Practices - Traditional hands-on activities
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Day 2 - Farewell */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">Lunch and Farewell</h3>
                            <Badge variant="outline">Day 2 - 12:00 PM</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            Gather for a nourishing lunch that fuels your body and soul. Afterward, enjoy a guided tour of 
                            the lodge's surroundings, reflecting on the experiences of the weekend. As the retreat comes to 
                            a close, feel rejuvenated, inspired, and deeply connected.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Wholesome Plant-based Lunch
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                              Guided Tour of Lodge Surroundings
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* What to Bring */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">What to Bring</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Comfortable, weather-appropriate attire</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Yoga mat and personal wellness items</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Water bottle for hydration</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Open heart to receive teachings</span>
                  </div>
                </div>
              </div>

              {/* Know Before You Book */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Know Before You Book</h2>
                <div className="space-y-3">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">Age Restriction</h4>
                      <p className="text-sm text-muted-foreground">This retreat is designed for adults aged 18 and above.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">Fitness Level</h4>
                      <p className="text-sm text-muted-foreground">Suitable for individuals with a moderate level of fitness.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">Weather Dependent</h4>
                      <p className="text-sm text-muted-foreground">This retreat is weather-dependent. Notifications will be sent via WhatsApp.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">WhatsApp Group</h4>
                      <p className="text-sm text-muted-foreground">Ensure you are added to our WhatsApp group for updates and notifications.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Package Options */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-4">Package Options</h3>
                    
                    <div className="space-y-4">
                      <div className="border-2 border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Package 1: Dormitory</h4>
                          <Badge variant="secondary">Popular</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Shared Dormitory Rooms</p>
                        <p className="text-2xl font-bold text-primary">R3,000</p>
                        <p className="text-xs text-muted-foreground">per person sharing</p>
                      </div>

                      <div className="border-2 border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <h4 className="font-semibold text-foreground mb-2">Package 2: Shared Rooms</h4>
                        <p className="text-sm text-muted-foreground mb-2">Private Shared Accommodation</p>
                        <p className="text-2xl font-bold text-primary">R3,500</p>
                        <p className="text-xs text-muted-foreground">per person sharing</p>
                      </div>

                      <div className="border-2 border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <h4 className="font-semibold text-foreground mb-2">Package 3: Guest House</h4>
                        <p className="text-sm text-muted-foreground mb-2">Off-site with Transport Included</p>
                        <p className="text-2xl font-bold text-primary">R4,000</p>
                        <p className="text-xs text-muted-foreground">per person sharing + R500 transport</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Button className="w-full" size="lg">
                        Book Now
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        50% deposit required (non-refundable)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">What's Included</h3>
                    <div className="space-y-2">
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Professional wellness guides</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">All scheduled meals</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Yoga & meditation sessions</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">NIA Dance workshops</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Indigenous walk & exploration</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Herbal tea service</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Indigenous herbal gift</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <a href="tel:0748315961" className="flex items-center text-sm hover:text-primary transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        Chad Cupido: 074 831 5961
                      </a>
                      <a href="tel:0813884726" className="flex items-center text-sm hover:text-primary transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        Joline Oliver: 081 388 4726
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Payment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank:</span>
                        <span className="font-medium">Capitec Business</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Name:</span>
                        <span className="font-medium text-xs">OMNI MEDIA PRODUCTIONS PTY LTD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account No:</span>
                        <span className="font-medium">1051893445</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Branch Code:</span>
                        <span className="font-medium">450105</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Use your full name as payment reference
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default OmniWellnessRetreat;
