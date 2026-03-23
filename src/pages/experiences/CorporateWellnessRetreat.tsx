import { useState } from 'react';
import { useTourSEO } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Check, Heart, Users, Clock, MapPin, Award, Shield, Leaf, Sun, Star, Mountain, TreePine, Sparkles, Building2, Target, BarChart3, GraduationCap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function CorporateWellnessRetreat() {
  const { toast } = useToast();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '', email: '', phone: '', company: '', role: '',
    companySize: '', retreatFormat: '', groupSize: '', preferredWindow: '',
    primaryGoal: '', source: '', context: ''
  });

  useTourSEO({
    tourName: 'Rewild Your Team — Corporate Wellness Retreats',
    title: 'Corporate Wellness Retreats Cape Town | Impact Travel for Teams | Rewild Your Team',
    description: 'Bespoke corporate wellness retreats in Cape Town combining equine-assisted therapy, indigenous heritage walks, and sustainable impact travel. Research-backed, CPD-eligible, ESG-aligned programmes from R80,000. Transform your team.',
    price: 80000,
    currency: 'ZAR',
    location: 'Cape Town, South Africa',
    duration: '1-3 Days',
    rating: 5.0,
    reviewCount: 18,
    images: [],
    url: window.location.href
  });

  const retreatFormats = [
    {
      name: 'The Reset',
      duration: '1 Day',
      price: 'R80,000',
      pax: 'Up to 20 participants',
      badge: 'Most Popular',
      desc: 'A focused, high-impact day designed to break patterns and reconnect your team with purpose. Combines equine-assisted wellness with indigenous wisdom and facilitated reflection.',
      includes: [
        'Full-day facilitated programme',
        'Equine-assisted wellness session (Pegasus Programme)',
        'Indigenous heritage walk with Chief Kingsley',
        'Facilitated reflection & integration',
        'Traditional refreshments & lunch',
        'CPD certificates for eligible professionals',
        'Impact report for ESG/CSI reporting',
      ],
    },
    {
      name: 'The Reconnect',
      duration: '2 Days',
      price: 'R130,000',
      pax: 'Up to 20 participants',
      badge: 'Deep Immersion',
      desc: 'A two-day immersion that gives your team space to decompress, reconnect, and emerge with renewed clarity. Includes overnight accommodation and evening cultural programme.',
      includes: [
        'Everything in The Reset, plus:',
        'Overnight boutique accommodation',
        'Evening cultural programme & traditional dinner',
        'Extended equine interaction session',
        'Mindfulness & breathwork workshop',
        'Team dynamics facilitation',
        'Pre and post-retreat wellness survey',
        'Detailed team wellness insights report',
      ],
    },
    {
      name: 'The Transformation',
      duration: '3 Days',
      price: 'R200,000',
      pax: 'Up to 20 participants',
      badge: 'Premium',
      desc: 'The complete experience. Three days of immersive programming designed for teams ready for real change — combining all three indigenous walks, equine therapy, and strategic team facilitation.',
      includes: [
        'Everything in The Reconnect, plus:',
        'All three Indigenous Heritage Walks',
        'Two nights boutique accommodation',
        'Extended Pegasus Programme with handler training',
        'Strategic team alignment workshop',
        'Individual wellness coaching session',
        'Comprehensive 360° team wellness report',
        'Post-retreat follow-up session (virtual)',
        'Priority rebooking for annual programmes',
      ],
    },
  ];

  const differentiators = [
    { icon: BarChart3, title: 'Research-Backed', desc: 'Programmes developed with UWC and grounded in evidence-based equine-assisted therapy methodology' },
    { icon: Sparkles, title: 'Animal-Assisted', desc: 'Facilitated connection with rescued horses through the Pegasus Programme — not team-building theatre' },
    { icon: Globe, title: 'Impact-Generating', desc: 'Every retreat directly funds animal rescue, indigenous heritage preservation, and community development' },
    { icon: GraduationCap, title: 'CPD Eligible', desc: 'Accredited professional development for healthcare, HR, and wellness professionals in your team' },
  ];

  const clientProfiles = [
    { title: 'Executive Leadership Teams', desc: 'For C-suite and senior leadership seeking authentic experiences that build trust, empathy, and strategic alignment beyond the boardroom.', icon: Building2 },
    { title: 'HR & People Teams', desc: 'Wellness programme managers designing meaningful offsites that deliver measurable outcomes for employee wellbeing and team cohesion.', icon: Users },
    { title: 'CSI & ESG Officers', desc: 'Organisations seeking impact-aligned corporate experiences that contribute to social investment goals with verifiable, reportable outcomes.', icon: Target },
  ];

  const handleSubmitEnquiry = () => {
    if (!formData.contactName || !formData.email || !formData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Enquiry Received",
      description: "Thank you! Our corporate experiences team will be in touch within 48 hours to discuss your bespoke retreat.",
    });
    setEnquiryOpen(false);
    setFormData({ contactName: '', email: '', phone: '', company: '', role: '', companySize: '', retreatFormat: '', groupSize: '', preferredWindow: '', primaryGoal: '', source: '', context: '' });
  };

  // Minimum date: 30 days for corporate planning
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 30);

  return (
    <>
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src={`${STORAGE_BASE}/General%20Images/Chief%20Kingsley%20amazing%20portrait.jpg`}
          alt="Corporate wellness retreat in Cape Town"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-emerald-600/80 text-white border-white/30">Impact Travel</Badge>
              <Badge className="bg-amber-600/80 text-white border-white/30">CPD Eligible</Badge>
              <Badge className="bg-blue-600/80 text-white border-white/30">ESG Aligned</Badge>
              <Badge className="bg-purple-600/80 text-white border-white/30">Bespoke</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 break-words">
              Rewild Your Team
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-4 text-white/90">
              Bespoke Corporate Wellness Retreats — Cape Town
            </p>
            <p className="text-base sm:text-lg mb-8 text-white/80 max-w-2xl break-words">
              Transformative impact travel for teams. Combine equine-assisted therapy, indigenous heritage walks,
              and facilitated wellness programming in a retreat that delivers measurable outcomes and lasting change.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Design Your Retreat
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                onClick={() => document.getElementById('retreat-formats')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Retreat Formats
              </Button>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>1-3 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Cape Town</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-emerald-600">Why This Matters</Badge>
                <h2 className="text-3xl font-bold mb-4">Your Team Deserves More Than a Conference Room</h2>
                <p className="text-base leading-relaxed mb-4">
                  Burnout is not a badge of honour. Disengagement is not inevitable. The teams that thrive are the ones
                  that invest in real experiences — not motivational speakers and trust falls, but encounters that fundamentally
                  shift how people relate to each other and to their work.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Our retreats are designed for organisations that understand the difference between corporate entertainment
                  and genuine transformation. This is impact travel for teams — experiences that give back to people, animals,
                  and communities while delivering measurable wellness outcomes.
                </p>
              </div>
              <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">76%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">of employees report burnout symptoms at least sometimes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">3x</span>
                    </div>
                    <p className="text-sm text-muted-foreground">higher retention in companies with meaningful wellness programmes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">92%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">of participants report improved team connection after experiential retreats</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-center">What Makes This Different</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Not another team-building exercise. A carefully designed impact travel experience backed by research and rooted in purpose.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {differentiators.map((item, i) => (
                <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <item.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Retreat Formats */}
      <section id="retreat-formats" className="py-16 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-center">Three Retreat Formats</h2>
            <p className="text-center text-muted-foreground mb-8">
              Each retreat is bespoke — choose a format and we'll tailor every detail to your team.
            </p>
            <div className="grid lg:grid-cols-3 gap-6">
              {retreatFormats.map((format, i) => (
                <Card key={i} className={`hover:shadow-xl transition-shadow ${i === 2 ? 'border-emerald-600 ring-2 ring-emerald-600/20' : ''}`}>
                  <CardHeader>
                    <Badge className={`w-fit mb-2 ${i === 2 ? 'bg-emerald-600' : ''}`} variant={i === 2 ? 'default' : 'secondary'}>
                      {format.badge}
                    </Badge>
                    <CardTitle className="text-2xl">{format.name}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{format.duration}</div>
                      <div className="flex items-center gap-1"><Users className="w-4 h-4" />{format.pax}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-emerald-600">{format.price}</div>
                    <p className="text-sm text-muted-foreground">{format.desc}</p>
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold mb-2">Includes:</h4>
                      <ul className="space-y-1.5">
                        {format.includes.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
                      <DialogTrigger asChild>
                        <Button className={`w-full mt-4 ${i === 2 ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`} variant={i === 2 ? 'default' : 'outline'}>
                          Enquire About {format.name}
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programme Architecture */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-center">Programme Architecture</h2>
            <p className="text-center text-muted-foreground mb-8">
              Every retreat is tailored to your team's needs and scheduled around your preferred dates.
            </p>
            <Tabs defaultValue="1day" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="1day" className="text-xs sm:text-sm">1-Day Reset</TabsTrigger>
                <TabsTrigger value="2day" className="text-xs sm:text-sm">2-Day Reconnect</TabsTrigger>
                <TabsTrigger value="3day" className="text-xs sm:text-sm">3-Day Transform</TabsTrigger>
              </TabsList>

              <TabsContent value="1day">
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-amber-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sun className="w-5 h-5 text-amber-500" />Morning: Equine-Assisted Wellness</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Arrive at the Cart Horse sanctuary. Opening circle, mindfulness grounding, and facilitated equine interaction through the Pegasus Programme. Your team connects with rescued horses in sessions that naturally surface trust, communication, and empathy.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Leaf className="w-5 h-5 text-green-500" />Midday: Indigenous Heritage Walk</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Traditional lunch followed by a sacred indigenous walk with Chief Kingsley. Your team walks ancient paths, learning Khoi wisdom about land, community, and reciprocity — themes that translate directly to organisational culture.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Star className="w-5 h-5 text-purple-500" />Afternoon: Integration & Action</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Facilitated reflection session connecting the day's experiences to team dynamics and workplace wellness. CPD certificates issued, impact reports distributed, and closing ceremony.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="2day">
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-amber-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sun className="w-5 h-5 text-amber-500" />Day 1: Equine Therapy & Grounding</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Full Pegasus Programme experience with extended equine interaction. Afternoon mindfulness and breathwork workshop. Evening cultural dinner with traditional storytelling.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Mountain className="w-5 h-5 text-green-500" />Day 2: Heritage Walk & Team Dynamics</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Indigenous heritage walk with Chief Kingsley. Facilitated team dynamics session connecting insights from both days. Pre/post wellness survey results shared. Closing ceremony with CPD and impact documentation.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="3day">
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-amber-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Sun className="w-5 h-5 text-amber-500" />Day 1: Arrival & Equine Connection</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Welcome dinner and orientation. Full Pegasus Programme with extended handler training. Evening mindfulness session and cultural storytelling.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><TreePine className="w-5 h-5 text-green-500" />Day 2: Indigenous Heritage Immersion</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>All three Indigenous Heritage Walks across Fish Hoek, Muizenberg, and Kalk Bay with Chief Kingsley. Deep immersion in Khoi wisdom, plant medicine, and sacred site visits. Traditional dinner.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="w-5 h-5 text-purple-500" />Day 3: Strategic Alignment & Integration</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>Individual wellness coaching sessions. Strategic team alignment workshop connecting retreat insights to organisational goals. Comprehensive 360° wellness report. Closing ceremony. Virtual follow-up session scheduled.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Outcomes & Measurement */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Outcomes & Measurement</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader><CardTitle className="text-xl">The Experience</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Authentic connection with rescued animals',
                      'Indigenous cultural immersion with traditional leaders',
                      'Facilitated team reflection and dialogue',
                      'Mindfulness and breathwork practices',
                      'Impact travel that transforms communities',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Heart className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-xl">The Measurables</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Pre/post wellness survey with quantified results',
                      'Team dynamics assessment and insights report',
                      'CPD-accredited professional development hours',
                      'ESG/CSI impact documentation for reporting',
                      'Follow-up virtual session for accountability',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
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

      {/* CSI / ESG Callout */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-emerald-600/20 bg-gradient-to-br from-emerald-50/80 to-blue-50/80">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-2">CSI & ESG Impact Alignment</h3>
                    <p className="text-muted-foreground mb-4">
                      Every retreat generates verifiable social impact. Your investment supports animal rescue and rehabilitation,
                      indigenous heritage preservation, community development, and youth education through the Dr. Phil-afel Foundation.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Section 18A tax-deductible donations available.</strong> We provide full impact documentation
                      for your CSI reporting, B-BBEE scorecard, and ESG disclosures.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <Link to="/drphilafel">
                    <Button variant="outline" size="sm">Dr. Phil-afel Foundation →</Button>
                  </Link>
                  <Link to="/csr-impact">
                    <Button variant="outline" size="sm">Our Impact Story →</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Books This */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Who Books This</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {clientProfiles.map((profile, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <profile.icon className="w-8 h-8 text-emerald-600 mb-2" />
                    <CardTitle className="text-xl">{profile.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{profile.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What Leaders Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "We've done every team-building concept going. This was the first time my senior team actually opened up. The horses don't let you hide behind your job title.", name: "Corporate Executive", role: "Financial Services" },
                { quote: "The impact documentation alone justified the investment for our CSI team. But the real value was watching our people reconnect with purpose.", name: "CSI Manager", role: "Technology Company" },
                { quote: "I was sceptical about 'wellness retreats' but this was different. Evidence-based, professionally facilitated, and genuinely transformative. We're booking annually.", name: "HR Director", role: "Consulting Firm" },
              ].map((testimonial, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                    <p className="text-sm italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="customisation">
                <AccordionTrigger>How customisable are the retreats?</AccordionTrigger>
                <AccordionContent>
                  Fully bespoke. The three formats are starting frameworks — we work with your team to tailor every element including scheduling, dietary requirements, wellness focus areas, facilitation style, and cultural programming. Share your preferred travel dates and objectives, and we'll design the perfect retreat.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="location">
                <AccordionTrigger>Where do the retreats take place?</AccordionTrigger>
                <AccordionContent>
                  Retreats are based in Cape Town, South Africa. The equine component takes place at the Cart Horse Protection Association sanctuary, and indigenous walks visit locations across Fish Hoek, Muizenberg, and Kalk Bay. Accommodation is at carefully selected boutique venues.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="group-size">
                <AccordionTrigger>What about larger groups?</AccordionTrigger>
                <AccordionContent>
                  Standard retreats accommodate up to 20 participants for optimal facilitation quality. For larger groups, we can design multi-session programmes or parallel tracks. Contact us to discuss your specific requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="roi">
                <AccordionTrigger>How do you measure ROI?</AccordionTrigger>
                <AccordionContent>
                  We provide pre and post-retreat wellness surveys, team dynamics assessments, and comprehensive impact reports. For multi-day retreats, you receive a 360° team wellness report with quantified outcomes. All documentation is formatted for ESG/CSI reporting requirements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="booking-process">
                <AccordionTrigger>What's the booking process?</AccordionTrigger>
                <AccordionContent>
                  Submit an enquiry with your preferred dates and objectives. Our team will schedule a discovery call within 48 hours to understand your needs. We then present a bespoke proposal, and upon approval, secure all venues, facilitators, and logistics. We recommend a minimum 4-week lead time for optimal planning.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Team?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Design a bespoke impact travel experience that your team will remember long after the offsite ends.
          </p>
          <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Start Your Retreat Enquiry
              </Button>
            </DialogTrigger>
          </Dialog>
          <p className="mt-4 text-sm text-white/60">
            Operated by Travel & Tours Cape Town Pty Ltd · traveltourscapetown@gmail.com
          </p>
        </div>
      </section>

      {/* Enquiry Modal */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Design Your Bespoke Retreat</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Tell us about your team and vision. We'll craft a personalised proposal.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eq-name">Contact Name *</Label>
                <Input id="eq-name" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="eq-role">Your Role</Label>
                <Input id="eq-role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. HR Director" />
              </div>
            </div>
            <div>
              <Label htmlFor="eq-company">Company / Organisation *</Label>
              <Input id="eq-company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Company name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eq-email">Email *</Label>
                <Input id="eq-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="work@company.com" />
              </div>
              <div>
                <Label htmlFor="eq-phone">Phone</Label>
                <Input id="eq-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+27 (0) 00 000 0000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Size</Label>
                <Select value={formData.companySize} onValueChange={(val) => setFormData({ ...formData, companySize: val })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eq-group">Group Size for Retreat</Label>
                <Input id="eq-group" value={formData.groupSize} onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })} placeholder="e.g. 12" />
              </div>
            </div>
            <div>
              <Label>Preferred Retreat Format</Label>
              <Select value={formData.retreatFormat} onValueChange={(val) => setFormData({ ...formData, retreatFormat: val })}>
                <SelectTrigger><SelectValue placeholder="Select a format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reset">The Reset (1 Day — R80,000)</SelectItem>
                  <SelectItem value="reconnect">The Reconnect (2 Days — R130,000)</SelectItem>
                  <SelectItem value="transformation">The Transformation (3 Days — R200,000)</SelectItem>
                  <SelectItem value="custom">Custom / Not Sure Yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eq-date">Preferred Travel Window</Label>
              <Input id="eq-date" type="date" value={formData.preferredWindow} onChange={(e) => setFormData({ ...formData, preferredWindow: e.target.value })} min={minDate.toISOString().split('T')[0]} />
              <p className="text-xs text-muted-foreground mt-1">Select your ideal start date. We'll coordinate all logistics around your availability.</p>
            </div>
            <div>
              <Label>Primary Goal</Label>
              <Select value={formData.primaryGoal} onValueChange={(val) => setFormData({ ...formData, primaryGoal: val })}>
                <SelectTrigger><SelectValue placeholder="What's the main objective?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="team-cohesion">Team Cohesion & Connection</SelectItem>
                  <SelectItem value="burnout-recovery">Burnout Prevention & Recovery</SelectItem>
                  <SelectItem value="leadership-development">Leadership Development</SelectItem>
                  <SelectItem value="csi-impact">CSI / Social Impact Programme</SelectItem>
                  <SelectItem value="cpd">Professional Development (CPD)</SelectItem>
                  <SelectItem value="celebration">Team Celebration & Recognition</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eq-context">Additional Context</Label>
              <Textarea id="eq-context" value={formData.context} onChange={(e) => setFormData({ ...formData, context: e.target.value })} placeholder="Tell us about your team, goals, dietary requirements, accessibility needs, or anything else that will help us design the perfect experience." rows={3} />
            </div>
            <div>
              <Label>How did you hear about us?</Label>
              <Select value={formData.source} onValueChange={(val) => setFormData({ ...formData, source: val })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="referral">Referral / Word of Mouth</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="conference">Conference / Event</SelectItem>
                  <SelectItem value="partner">Partner Organisation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmitEnquiry} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Submit Retreat Enquiry
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Our corporate experiences team will respond within 48 hours with a tailored proposal.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
