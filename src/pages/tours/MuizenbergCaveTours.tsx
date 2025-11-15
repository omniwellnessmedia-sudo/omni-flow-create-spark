import { useTourSEO } from '@/lib/seo';
import TourBookingSidebar from '@/components/tours/TourBookingSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Check, Heart, BookOpen, Users, Leaf, Award, TrendingUp, Star, MapPin, Calendar } from 'lucide-react';

const SUPABASE_URL = "https://dtjmhieeywdvhjxqyxad.supabase.co";
const getStorageUrl = (filename: string) => 
  `${SUPABASE_URL}/storage/v1/object/public/provider-images/General%20Images/${encodeURIComponent(filename)}`;

export default function MuizenbergCaveTours() {
  const tourImages = [
    getStorageUrl('muizenberg cave view.jpg'),
    getStorageUrl('group tour amazing cave view.jpg'),
    getStorageUrl('sacred cave wellness.jpg'),
    getStorageUrl('fact-wellness-hero.jpg'),
    getStorageUrl('fact-outdoor-fitness.jpg')
  ];

  useTourSEO({
    tourName: 'Sacred Cave Healing: Muizenberg Wellness Journey',
    title: 'Sacred Cave Healing | Ancient Khoi-San Wisdom Meets Modern Therapy | Muizenberg',
    description: 'Transform through evidence-based indigenous healing in sacred cave spaces. 7-10 day academic program combining Khoi-San traditions, trauma-informed care, and therapeutic practices. 20% supports Dr. Phil-afel Foundation. 40% stress reduction proven.',
    price: 3999,
    currency: 'USD',
    location: 'Muizenberg, Cape Town, South Africa',
    duration: '7-10 days',
    rating: 4.8,
    reviewCount: 247,
    images: tourImages,
    url: window.location.href,
    keywords: ['sacred cave healing', 'Khoi-San wisdom', 'indigenous healing', 'trauma-informed care', 'wellness retreat', 'Cape Town', 'Muizenberg', 'Dr. Phil-afel Foundation', 'therapeutic retreat', 'somatic practices']
  });

  const tour = {
    id: 'muizenberg-cave-tours',
    title: 'Muizenberg Cave Wellness Journey',
    price: 3999,
    price_from: 3999,
    duration: '7-10 days',
    destination: 'Muizenberg, Cape Town',
    max_participants: 12,
    overview: 'Evidence-based integration of indigenous healing with contemporary wellness science',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    active: true
  };

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section with Cave Images */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={tourImages[0]} 
            alt="Sacred Muizenberg Cave Wellness Space"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-wellness-primary/90 text-white border-0">Academic Program</Badge>
              <Badge className="bg-white/20 text-white border-white/30">7-10 Days</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Dr. Phil-afel Foundation Partner</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Sacred Cave Healing: Where Ancient Wisdom Meets Modern Therapy
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              Evidence-based integration of Khoi-San healing traditions in sacred cave spaces
            </p>
            <p className="text-lg mb-8 text-white/80">
              40% stress reduction • Cultural competency certification • 20% supports community programs
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-wellness-primary text-white hover:bg-wellness-primary/90">
                <Calendar className="mr-2 h-5 w-5" />
                Enroll Now - $3,999
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
                <BookOpen className="mr-2 h-5 w-5" />
                Download Syllabus
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold mb-1">247</div>
                <div className="text-sm text-white/70">Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1 flex items-center gap-1">
                  4.8 <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="text-sm text-white/70">Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">40%</div>
                <div className="text-sm text-white/70">Stress Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* What Makes This Unique */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What Makes This Journey Unique</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-wellness-primary/20">
                <CardHeader>
                  <MapPin className="w-10 h-10 text-wellness-primary mb-2" />
                  <CardTitle className="text-xl">Sacred Cave Spaces</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The only program using authentic Khoi-San sacred caves for healing work. Natural acoustics enhance breathwork and meditation practices.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-wellness-primary/20">
                <CardHeader>
                  <Users className="w-10 h-10 text-wellness-primary mb-2" />
                  <CardTitle className="text-xl">Indigenous Knowledge Keepers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Learn directly from Chief Kingsley and traditional healers following authentic Khoi-San protocols with cultural respect and consent.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-wellness-primary/20">
                <CardHeader>
                  <Award className="w-10 h-10 text-wellness-primary mb-2" />
                  <CardTitle className="text-xl">Clinical Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    FACT Wellness certified facilitators bridge indigenous wisdom with trauma-informed care and evidence-based therapeutic practices.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-wellness-primary/20">
                <CardHeader>
                  <Heart className="w-10 h-10 text-wellness-primary mb-2" />
                  <CardTitle className="text-xl">Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    20% of every enrollment directly supports Dr. Phil-afel Foundation programs: education for 100+ children, urban gardening, and women's empowerment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {tourImages.slice(1, 4).map((img, idx) => (
              <div key={idx} className="relative h-64 rounded-lg overflow-hidden group">
                <img 
                  src={img} 
                  alt={`Muizenberg Cave Wellness Experience ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Therapeutic Outcomes Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Measurable Learning Outcomes</h2>
            <p className="text-lg text-muted-foreground">
              Participants develop evidence-based competencies in trauma-informed care, somatic practices, 
              and cultural humility through experiential learning with indigenous knowledge holders.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Award className="w-10 h-10 text-wellness-primary mb-2" />
                <CardTitle>Clinical Competencies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-primary mt-1 flex-shrink-0" />
                    <span>Trauma-informed somatic practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-primary mt-1 flex-shrink-0" />
                    <span>Breathwork protocols (Pranayama, indigenous)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-primary mt-1 flex-shrink-0" />
                    <span>Grounding techniques for anxiety management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-primary mt-1 flex-shrink-0" />
                    <span>Cultural humility in therapeutic contexts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-10 h-10 text-wellness-accent mb-2" />
                <CardTitle>Academic Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-accent mt-1 flex-shrink-0" />
                    <span>Indigenous epistemologies as valid knowledge systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-accent mt-1 flex-shrink-0" />
                    <span>Decolonial approaches to wellness education</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-accent mt-1 flex-shrink-0" />
                    <span>Ethnographic research methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-accent mt-1 flex-shrink-0" />
                    <span>Ethical engagement with indigenous communities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-wellness-secondary mb-2" />
                <CardTitle>Practical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-secondary mt-1 flex-shrink-0" />
                    <span>Facilitation of healing circles using Ubuntu principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-secondary mt-1 flex-shrink-0" />
                    <span>Assessment of somatic stress markers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-secondary mt-1 flex-shrink-0" />
                    <span>Integration of traditional practices in modern contexts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-wellness-secondary mt-1 flex-shrink-0" />
                    <span>Community-based participatory research</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Daily Structure */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Structured Daily Itinerary</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Days 1-3: Foundation & Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Therapeutic Rationale:</strong> Establishing psychological safety and cultural context before experiential work</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Orientation to Khoi-San cultural protocols</li>
                  <li>Cave ecology and archaeological significance</li>
                  <li>Consent and ceremony participation guidelines</li>
                  <li>Baseline stress marker assessment</li>
                  <li>Introduction to grounding techniques</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Days 4-6: Immersion & Practice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Therapeutic Rationale:</strong> Embodied learning through direct experience with indigenous practitioners</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Guided cave meditation sessions at dawn</li>
                  <li>Somatic breathwork with traditional healers</li>
                  <li>Plant medicine education (ethical, legal frameworks)</li>
                  <li>Sound healing utilizing cave acoustics</li>
                  <li>Daily reflective integration circles</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Days 7-9: Integration & Application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Therapeutic Rationale:</strong> Translating experiential insights into transferable knowledge and skills</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Development of personal practice protocols</li>
                  <li>Facilitation skills training for healing circles</li>
                  <li>Assessment of stress reduction outcomes</li>
                  <li>Community service learning application</li>
                  <li>Re-entry preparation and action planning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Day 10: Closure & Commitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Therapeutic Rationale:</strong> Honoring transformation and establishing accountability for continued practice</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Closing ceremony with community elders</li>
                  <li>Final reflective assessment</li>
                  <li>Certificate of completion</li>
                  <li>Ongoing support resources</li>
                  <li>Alumni network connection</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Evidence Base */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Evidence-Based Outcomes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-wellness-primary mb-2">40%</div>
                <p className="text-sm text-muted-foreground">Reduction in cortisol levels (average)</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-wellness-primary mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Improved emotional regulation capacity</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-wellness-primary mb-2">92%</div>
                <p className="text-sm text-muted-foreground">Enhanced cultural competency scores</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-wellness-primary mb-2">78%</div>
                <p className="text-sm text-muted-foreground">Continue practice 6 months post-program</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CSR Impact */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-wellness-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Community Impact Partnership</h2>
              <p className="text-lg text-muted-foreground">
                20% of your program fee directly supports Dr. Phil-afel Foundation initiatives 
                in Cape Town's underserved communities (Tax-deductible: NPC 2024/051687/08)
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Leaf className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">100+</div>
                  <p className="text-sm text-muted-foreground">Children educated annually</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">50+</div>
                  <p className="text-sm text-muted-foreground">Youth trained as advocates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">5</div>
                  <p className="text-sm text-muted-foreground">SDG Goals addressed</p>
                </CardContent>
              </Card>
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
