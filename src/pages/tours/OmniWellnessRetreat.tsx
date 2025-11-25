import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';

const OmniWellnessRetreat = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  const images = [
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/IMG_20241010_175744.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/IMG_0052%20(1).jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/_MG_0152.jpg',
  ];

  return (
    <>
      <UnifiedNavigation />
      
      {/* Immersive Hero Section with Gallery */}
      <section className="relative h-screen bg-black">
        <div className="absolute inset-0">
          <img 
            src={images[selectedImage]} 
            alt="Omni Wellness Retreat"
            className="w-full h-full object-cover transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80"></div>
        </div>
        
        {/* Navigation */}
        <div className="absolute top-6 left-4 z-20">
          <Link to="/tour-category/weekend-retreats" className="inline-flex items-center text-white/90 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all hover:bg-black/40">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Weekend Retreats
          </Link>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-20">
          <div className="max-w-4xl text-white space-y-6">
            <Badge className="mb-4 bg-primary/90 text-primary-foreground backdrop-blur-sm border-0 px-4 py-2 text-sm">
              Weekend Retreats
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              4th Annual Omni<br />Wellness Retreat
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90 font-light max-w-2xl">
              Rejuvenate and Renew in the Serene Greyton Eco Lodge
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <Calendar className="h-6 w-6 mb-2 text-white/80" />
                <div className="text-sm text-white/60">Dates</div>
                <div className="font-semibold">Feb 27 - May 2</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <MapPin className="h-6 w-6 mb-2 text-white/80" />
                <div className="text-sm text-white/60">Location</div>
                <div className="font-semibold">Greyton Lodge</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <Clock className="h-6 w-6 mb-2 text-white/80" />
                <div className="text-sm text-white/60">Duration</div>
                <div className="font-semibold">4 days / 3 nights</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <Users className="h-6 w-6 mb-2 text-white/80" />
                <div className="text-sm text-white/60">Group Size</div>
                <div className="font-semibold">Max 30 guests</div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                Reserve Your Spot
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-6 text-lg"
                onClick={() => setShowGallery(true)}
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
        
        {/* Image Gallery Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`transition-all duration-300 ${
                  selectedImage === index 
                    ? 'w-12 h-3 bg-white rounded-full' 
                    : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Full Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <span className="sr-only">Close</span>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-6xl w-full">
            <img 
              src={images[selectedImage]} 
              alt="Gallery" 
              className="w-full h-auto rounded-lg"
            />
            <div className="flex gap-4 mt-6 justify-center overflow-x-auto pb-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index ? 'ring-4 ring-primary scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-24 h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
                <h2 className="text-3xl font-bold text-foreground mb-4">Journey Itinerary</h2>
                <p className="text-sm text-muted-foreground mb-8 italic">*Subject to seasonal adjustments and weather conditions</p>
                
                <div className="relative space-y-6">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
                  
                  {/* Day 1 - Morning */}
                  <div className="relative pl-16">
                    <div className="absolute left-0 flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg ring-4 ring-primary/20">
                      <span className="font-bold text-lg">1</span>
                    </div>
                    <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-foreground">Arrival & Opening Ceremony</h3>
                          <Badge variant="secondary" className="w-fit">Day 1 • 8:45 AM</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Your journey begins as the morning light kisses the landscapes of Greyton. At Greyton Eco Lodge, 
                          a sacred opening ceremony awaits. Under the wise guidance of our indigenous leaders, you'll 
                          feel the ancient energy of the land envelop you.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Opening Ceremony - Sacred ritual that grounds and centres</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Welcoming Circle - Connect with fellow seekers</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

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
