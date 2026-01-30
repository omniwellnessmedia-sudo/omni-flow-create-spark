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
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg',
    'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%201.jpg',
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
          <Link to="/" className="inline-flex items-center text-white/90 hover:text-white bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all hover:bg-black/40">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
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
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
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
                <h2 className="text-3xl font-bold text-foreground mb-6">Transform Your Life in 4 Sacred Days</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  This isn't just a retreat—it's a journey home to yourself. In the heart of South Africa's most sacred healing valley, 
                  you'll disconnect from the noise of modern life and reconnect with your deepest truth. Guided by indigenous wisdom 
                  keepers and certified wellness practitioners, you'll experience profound shifts in body, mind, and spirit.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-semibold text-foreground mb-2">Authentic Indigenous Wisdom</h4>
                    <p className="text-sm text-muted-foreground">Learn from Khoe cultural experts who carry ancestral knowledge</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-semibold text-foreground mb-2">Transformative Movement</h4>
                    <p className="text-sm text-muted-foreground">NIA Dance Immersion awakens joy and releases stuck energy</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-semibold text-foreground mb-2">Sacred Land Connection</h4>
                    <p className="text-sm text-muted-foreground">Walk ancient paths and feel the earth's healing power</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-semibold text-foreground mb-2">Plant-Based Nourishment</h4>
                    <p className="text-sm text-muted-foreground">Experience how conscious eating transforms your energy</p>
                  </div>
                </div>
              </div>

              {/* Retreat Experience Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl my-8">
                <img 
                  src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/IMG_0052%20(1).jpg"
                  alt="Retreat participants in wellness activity"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Sacred Land Context */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
                <h2 className="text-3xl font-bold text-foreground mb-6">The Sacred Land of Greyton</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      Indigenous Khoe Heritage
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-4">
                      Greyton rests on ancestral lands of the Khoe people, who have inhabited this region for thousands of years. 
                      The area's indigenous name reflects its spiritual significance as a place of healing waters and sacred mountains. 
                      Our retreat honors this heritage by incorporating traditional Khoe wellness practices, indigenous plant knowledge, 
                      and respectful cultural exchange guided by local wisdom keepers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      The Healing Valley
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-4">
                      Nestled in the Riviersonderend Mountains, Greyton has long been recognized as a place of natural healing. 
                      The crisp mountain air, mineral-rich springs, and diverse fynbos ecosystem create a unique environment that 
                      has drawn healers and seekers for generations. The valley's microclimate supports over 1,500 plant species, 
                      many used traditionally for healing—knowledge that will be shared during our indigenous walks.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      A Living Wellness Tradition
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-4">
                      The Greyton Eco Lodge sits within this living landscape, designed to harmonize with nature while providing 
                      modern comfort. Our approach blends ancient indigenous wisdom with contemporary wellness practices, creating 
                      a transformative experience that honors the past while embracing the present. Here, you'll walk where ancestors 
                      walked, breathe where healers breathed, and discover your own healing journey in this sacred space.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sacred Land Visual */}
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/_MG_0152.jpg"
                    alt="Greyton mountain landscape"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg"
                    alt="Indigenous cultural experience"
                    className="w-full h-64 object-cover"
                  />
                </div>
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
                  <div className="relative pl-16">
                    <div className="absolute left-0 flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg ring-4 ring-primary/20">
                      <span className="font-bold text-lg">2</span>
                    </div>
                    <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-foreground">Wellness Sessions & Activities</h3>
                          <Badge variant="secondary" className="w-fit">Day 1 • Throughout Day</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Embrace a day filled with nourishing activities designed to rejuvenate your entire being. Begin with 
                          gentle yoga that opens your body, move into guided meditations that quiet your mind, and surrender to 
                          the ecstatic freedom of NIA Dance Immersion. Each practice builds upon the last, creating a symphony 
                          of healing that resonates through every cell of your body.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Yoga Sessions - Open your body to healing energy (all levels)</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Guided Meditation - Journey deep within to your center</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">NIA Dance Immersion - Ecstatic movement awakens joy</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Smoothie Talk - Discover how plant-based nutrition transforms</span>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <img 
                            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%201.jpg"
                            alt="Wellness yoga session"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <img 
                            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Annual%20Omni%20Wellness%20Retreat/IMG_20241010_175744.jpg"
                            alt="Traditional braai gathering"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Day 2 - Morning */}
                  <div className="relative pl-16">
                    <div className="absolute left-0 flex items-center justify-center w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg ring-4 ring-secondary/20">
                      <span className="font-bold text-lg">4</span>
                    </div>
                    <Card className="border-l-4 border-l-secondary shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-foreground">Sunrise Awakening</h3>
                          <Badge variant="secondary" className="w-fit">Day 2 • 7:00 AM</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          The second day begins as nature intended—with the sun. Rise before the world awakens and step into 
                          the soft morning light. Whether you choose sunrise yoga that stretches your awakening body, a walking 
                          meditation through dew-kissed paths, or simply sitting in sacred silence watching the sky transform, 
                          this morning practice is your personal ceremony. Feel the day's potential flowing through you, clean 
                          and bright and full of promise.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Sunrise Yoga - Awaken your body with the sun's first light</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Nature Walk - Absorb the mountain's healing morning energy</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Day 2 - Mid Morning */}
                  <div className="relative pl-16">
                    <div className="absolute left-0 flex items-center justify-center w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg ring-4 ring-secondary/20">
                      <span className="font-bold text-lg">5</span>
                    </div>
                    <Card className="border-l-4 border-l-secondary shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-foreground">Indigenous Walk with Khoe Wisdom Keepers</h3>
                          <Badge variant="secondary" className="w-fit">Day 2 • 9:00 AM</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Walk where your ancestors walked. Led by Khoe indigenous wisdom keepers, this sacred journey takes you 
                          deep into the heart of the land's living memory. Learn to see the healing plants that sustained generations, 
                          hear stories older than written words, and participate in ceremonies that bridge past and present. Feel the 
                          earth speak through your feet. This isn't tourism—it's homecoming. You'll discover plant medicines used for 
                          millennia, understand the spiritual significance of the landscape, and carry forward ancestral knowledge that 
                          our modern world desperately needs.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Indigenous Plant Medicine - Learn ancestral healing knowledge</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Cultural Ceremonies - Participate in sacred traditions</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Sacred Landscape Walk - Connect with living ancestral memory</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Wisdom Keepers - Direct teaching from Khoe cultural experts</span>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <img 
                            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/group%20tour%20amazing%20cave%20view%20muizenberg.jpg"
                            alt="Indigenous cultural walk"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Day 2 - Farewell */}
                  <div className="relative pl-16">
                    <div className="absolute left-0 flex items-center justify-center w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg ring-4 ring-secondary/20">
                      <span className="font-bold text-lg">6</span>
                    </div>
                    <Card className="border-l-4 border-l-secondary shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-foreground">Closing Circle & Integration</h3>
                          <Badge variant="secondary" className="w-fit">Day 2 • 12:00 PM</Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          As your journey reaches completion, gather one final time in sacred circle. Share the nourishment of 
                          a conscious final meal, exchange the gifts you've discovered within yourself, and set intentions for 
                          carrying this transformation home. This isn't goodbye—it's a new beginning. You're not leaving the 
                          same person who arrived. The retreat may end, but your awakening has only begun.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Wholesome Plant-based Lunch - Final conscious meal together</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Closing Circle - Share insights and set intentions</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Integration Practice - Tools to carry transformation home</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Guided Tour - Final connection with sacred land</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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

              {/* Community Experience Visual */}
              <div className="rounded-2xl overflow-hidden shadow-2xl my-12">
                <img 
                  src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat3%20portrait.jpg"
                  alt="Retreat community gathering"
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Testimonials - What Past Participants Say */}
              <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl p-8 border border-secondary/10">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">What Past Participants Say</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-background/50 backdrop-blur border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
                        "This retreat changed my life. The combination of indigenous wisdom, movement, and the sacred land 
                        of Greyton opened something in me I didn't know was closed. I returned home transformed, carrying 
                        ancestral knowledge that now guides my daily practice."
                      </p>
                      <div className="border-t border-border pt-3">
                        <p className="font-semibold text-foreground text-sm">Sarah M.</p>
                        <p className="text-xs text-muted-foreground">Cape Town</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/50 backdrop-blur border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
                        "The NIA Dance sessions were pure joy. I haven't felt that free in my body in decades. And the 
                        indigenous walk with the wisdom keepers was profoundly moving—learning about the land's true history 
                        and connecting with ancestral practices that modern wellness has forgotten."
                      </p>
                      <div className="border-t border-border pt-3">
                        <p className="font-semibold text-foreground text-sm">Michael T.</p>
                        <p className="text-xs text-muted-foreground">Johannesburg</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/50 backdrop-blur border-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
                        "I came seeking rest and found my purpose. The plant-based meals, the yoga, the ceremonies, the 
                        soul family I discovered—everything aligned to create the most transformative 4 days of my life. 
                        I'm already planning to return next year."
                      </p>
                      <div className="border-t border-border pt-3">
                        <p className="font-semibold text-foreground text-sm">Thandi N.</p>
                        <p className="text-xs text-muted-foreground">Durban</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Experience Highlights Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-12">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Wellness%20retreat%202.jpg"
                    alt="Retreat activity"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg"
                    alt="Community connection"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/khoe%20indigenous%20language%20heritage%20experience%206.jpg"
                    alt="Indigenous heritage"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:col-span-1">
              <div id="booking-section" className="sticky top-8 space-y-6 scroll-mt-20">
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
                      <Button 
                        className="w-full" 
                        size="lg"
                        asChild
                      >
                        <a href="mailto:omniwellnessmedia@gmail.com?subject=Omni Wellness Retreat Booking&body=Hi,%0A%0AI would like to book a spot for the 4th Annual Omni Wellness Retreat.%0A%0APackage preference:%0ANumber of guests:%0A%0APlease send me more information.%0A%0AThank you!">
                          Book Now
                        </a>
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
