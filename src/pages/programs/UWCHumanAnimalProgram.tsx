import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { 
  GraduationCap, 
  Heart, 
  Globe, 
  Users, 
  Calendar, 
  MapPin, 
  Award,
  BookOpen,
  Leaf,
  Brain,
  Building2,
  Clock,
  Check,
  Target,
  Star,
  Coffee,
  Utensils,
  Home,
  Camera,
  Sparkles
} from 'lucide-react';

// Image URLs
const images = {
  hero: "/lovable-uploads/uwc-hero-cart-horse.jpg",
  cartHorse1: "https://carthorse.org.za/wp/wp-content/uploads/2022/08/Equine-Welfare-Training-Course-CHA.jpg",
  cartHorse2: "https://carthorse.org.za/wp/wp-content/uploads/2022/08/cart-horse-donkeys-equine-training.jpg",
  tufcat1: "https://www.tufcat.co.za/wp-content/uploads/2021/01/Freckles-Speckles.jpg",
  community: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/%20community-images**%20(Workshop%20Photos)/_MG_9481-2.jpg",
  accommodation: "/lovable-uploads/536268543_1347914427341636_1998936286569467143_n-2.jpg",
  kitchen: "/lovable-uploads/556098599_1378021897664222_4748312450378726214_n-2.jpg",
  living: "/lovable-uploads/555728551_1378021847664227_1071983310888780042_n-2.jpg",
  vetCare: "/lovable-uploads/573883488_1410644557735289_7908845877500205254_n.jpg",
  volunteer: "/lovable-uploads/547235882_1363651465767932_6536218706891973805_n.jpg",
  workshop: "/lovable-uploads/585868855_1429203929212685_6885647248657070604_n.jpg"
};

const UWCHumanAnimalProgram = () => {
  const programTimeline = [
    {
      phase: "Week 1-2",
      title: "Foundation & Orientation",
      location: "UWC Campus & TUFCAT",
      icon: BookOpen,
      image: images.accommodation,
      highlights: [
        "Academic orientation and research methodology",
        "Introduction to Animal-Assisted Therapy frameworks",
        "Biometric device setup and baseline measurements",
        "Campus integration and community introductions"
      ],
      included: ["Accommodation", "All meals", "Course materials"]
    },
    {
      phase: "Week 3-4",
      title: "Cart Horse Protection Immersion",
      location: "Cart Horse Protection Association",
      icon: Heart,
      image: images.cartHorse1,
      highlights: [
        "Field placement with Cart Horse Protection",
        "Equine welfare assessment training",
        "Handler relationship observations and interviews",
        "Dual-benefit research: handler stress + equine welfare"
      ],
      included: ["Transport", "Field equipment", "Mentorship"]
    },
    {
      phase: "Week 5-6",
      title: "TUFCAT Sanctuary Experience",
      location: "TUFCAT Farm & Sanctuary",
      icon: Leaf,
      image: images.tufcat1,
      highlights: [
        "Daily animal care routines and therapeutic interactions",
        "Small animal welfare and sanctuary management",
        "Sustainable farming and permaculture practices",
        "On-site accommodation at TUFCAT Field Station"
      ],
      included: ["Farm accommodation", "Organic meals", "Hands-on training"]
    },
    {
      phase: "Week 7-8",
      title: "Valley of Plenty Community Integration",
      location: "Hanover Park, Cape Town",
      icon: Users,
      image: images.community,
      highlights: [
        "Community placement in Hanover Park",
        "Urban farming and food security initiatives",
        "Indigenous knowledge integration with local healers",
        "Community wellness program participation"
      ],
      included: ["Community meals", "Cultural experiences", "Local guides"]
    },
    {
      phase: "Week 9-10",
      title: "Research Synthesis & Presentation",
      location: "UWC Campus",
      icon: Target,
      image: images.workshop,
      highlights: [
        "Data analysis workshops and research writing",
        "Biometric data interpretation and findings",
        "Academic presentation preparation",
        "Certificate ceremony and graduation"
      ],
      included: ["Research support", "Publication guidance", "Networking"]
    }
  ];

  const teamMembers = [
    {
      name: "Prof. Sharyn Spicer",
      role: "Academic Director",
      organization: "University of the Western Cape",
      bio: "Overseeing research methodology and academic standards for the programme"
    },
    {
      name: "Dr. Megan White",
      role: "Equine Welfare Lead",
      organization: "Cart Horse Protection Association",
      bio: "Expert in working animal welfare and community liaison programmes"
    },
    {
      name: "Chad Cupido",
      role: "Research Design Lead",
      organization: "TUFCAT / Omni Wellness Media",
      bio: "PhD candidate leading research design and media documentation"
    },
    {
      name: "Leigh Tucker",
      role: "International Partnerships",
      organization: "UWC International Relations",
      bio: "Strategic partnerships and funder alignment specialist"
    },
    {
      name: "Wendy Walton",
      role: "Community Integration",
      organization: "Valley of Plenty",
      bio: "Community zone coordination and life skills development"
    },
    {
      name: "Tumelo Ncube",
      role: "Technology Lead",
      organization: "Omni Wellness Media",
      bio: "Biometric systems and data pipeline development"
    }
  ];

  const academicPillars = [
    {
      icon: Heart,
      title: "Animal-Assisted Therapy & Empathy Development",
      description: "Biometric measurement of HRV, cortisol, and empathy through human-animal interactions"
    },
    {
      icon: Leaf,
      title: "Indigenous Knowledge Systems",
      description: "Integration of African wellness practices with evidence-based therapeutic approaches"
    },
    {
      icon: Globe,
      title: "Environmental Sustainability",
      description: "Hands-on permaculture, food security, and ecological stewardship"
    },
    {
      icon: Users,
      title: "Wellness Education & Community Regeneration",
      description: "Valley of Plenty model: sustainable development in Hanover Park"
    },
    {
      icon: Brain,
      title: "Conscious Leadership",
      description: "Developing change agents who lead with empathy and community-centered values"
    }
  ];

  const whatsIncluded = [
    { icon: Home, label: "Accommodation", detail: "TUFCAT Field Station" },
    { icon: Utensils, label: "All Meals", detail: "Farm-fresh organic" },
    { icon: Camera, label: "Research Equipment", detail: "Biometric devices" },
    { icon: Coffee, label: "Field Transport", detail: "All site visits" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <img 
          src={images.hero}
          alt="Cart Horse Protection Association community event"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        
        <div className="relative z-10 container mx-auto h-full flex items-end pb-16 px-4">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-primary text-primary-foreground">
              <GraduationCap className="w-3 h-3 mr-1.5" />
              UWC × TUFCAT Consortium • June 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
              Animal-Assisted Therapy Research & African Wellness
            </h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl">
              A 10-week immersive programme combining academic research with hands-on experiential learning 
              at TUFCAT Sanctuary and Valley of Plenty community.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Heart className="mr-2 h-4 w-4" />
                Express Interest
              </Button>
              <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur">
                Download Prospectus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">R70,000</div>
              <div className="text-sm text-muted-foreground">Per Student</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10 Weeks</div>
              <div className="text-sm text-muted-foreground">NQF Level 7-8</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">20-25</div>
              <div className="text-sm text-muted-foreground">Students Per Cohort</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">SAQA Credits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Question Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Core Research Question
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight">
              How can Animal-Assisted Therapy transform occupational wellness and violence prevention 
              in post-apartheid South Africa?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This pioneering programme combines rigorous academic research with hands-on experiential learning. 
              Students participate as co-researchers, contributing to groundbreaking studies on the therapeutic 
              benefits of human-animal interaction.
            </p>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">Five Core Academic Pillars</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {academicPillars.map((pillar, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-background border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-sm text-foreground">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Partners */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Building2 className="w-3 h-3 mr-1.5" />
              Partner Consortium
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">Meet Our Partners</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Three organizations united to create Africa's first Animal-Assisted Therapy research programme
            </p>
          </div>

          {/* Cart Horse Protection */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 max-w-6xl mx-auto">
            <div className="relative">
              <img 
                src={images.cartHorse1}
                alt="Cart Horse Protection Association"
                className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium text-sm shadow-lg">
                Since 1995
              </div>
            </div>
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">Equine Welfare & Community Liaison</Badge>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Cart Horse Protection Association</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Since 1995, the Cart Horse Protection Association has protected working horses in Cape Town's 
                most vulnerable communities. Their expertise in equine welfare, handler relationships, and 
                community engagement forms the foundation of our animal-assisted therapy research.
              </p>
              <div className="space-y-3">
                {["Equine welfare assessment", "Community handler relationships", "Working animal therapy models"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TUFCAT */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 max-w-6xl mx-auto">
            <div className="lg:order-2 relative">
              <img 
                src={images.tufcat1}
                alt="TUFCAT Farm & Sanctuary"
                className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium text-sm shadow-lg">
                7 Hectares
              </div>
            </div>
            <div className="lg:order-1">
              <Badge className="mb-4 bg-primary/10 text-primary">Field Site Operations</Badge>
              <h3 className="text-2xl font-bold mb-4 text-foreground">TUFCAT Farm & Sanctuary</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                TUFCAT provides the 7-hectare living classroom where students experience hands-on animal care, 
                sustainable farming, and therapeutic animal interactions. Their sanctuary houses rescued cats, 
                dogs, and farm animals central to our research.
              </p>
              <div className="space-y-3">
                {["Animal sanctuary management", "Therapeutic animal interactions", "Sustainable farming practices"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Valley of Plenty */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <img 
                src={images.community}
                alt="Valley of Plenty Community"
                className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium text-sm shadow-lg">
                Hanover Park
              </div>
            </div>
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">Community Development Model</Badge>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Valley of Plenty</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Located in Hanover Park, Valley of Plenty demonstrates sustainable community development in action. 
                Students participate in urban farming, food security initiatives, and community wellness programs 
                as part of their experiential learning journey.
              </p>
              <div className="space-y-3">
                {["Urban permaculture", "Community food security", "Grassroots development"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Itinerary - Airbnb Style */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Calendar className="w-3 h-3 mr-1.5" />
                Your 10-Week Journey
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Programme Itinerary</h2>
              <p className="text-muted-foreground mt-3">
                An immersive experience across three field sites
              </p>
            </div>
            
            <div className="space-y-8">
              {programTimeline.map((phase, index) => (
                <div key={index} className="bg-background rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3">
                    <div className="relative h-64 md:h-auto">
                      <img 
                        src={phase.image}
                        alt={phase.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-background/90 backdrop-blur text-foreground border-0 font-semibold">
                          {phase.phase}
                        </Badge>
                      </div>
                    </div>
                    <div className="md:col-span-2 p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <phase.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{phase.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {phase.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        {phase.highlights.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {phase.included.map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-center mb-8 text-foreground">What's Included</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {whatsIncluded.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Gallery */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Home className="w-3 h-3 mr-1.5" />
              Accommodation
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">TUFCAT Field Station</h2>
            <p className="text-muted-foreground mt-3">
              Comfortable accommodation in a trauma-informed, wellness-focused environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <img 
              src={images.accommodation}
              alt="TUFCAT accommodation"
              className="rounded-2xl aspect-[4/3] object-cover shadow-lg hover:shadow-xl transition-shadow"
            />
            <img 
              src={images.kitchen}
              alt="Community kitchen"
              className="rounded-2xl aspect-[4/3] object-cover shadow-lg hover:shadow-xl transition-shadow"
            />
            <img 
              src={images.living}
              alt="Living space"
              className="rounded-2xl aspect-[4/3] object-cover shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Leadership Team - Text Only */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Award className="w-3 h-3 mr-1.5" />
                Leadership
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Programme Leadership Team</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-primary font-bold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground">{member.name}</h4>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.organization}</p>
                    <p className="text-sm text-muted-foreground mt-3">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Funding */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    Student Investment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">R70,000</div>
                  <p className="text-muted-foreground text-sm mb-4">Per student, all-inclusive</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">10 weeks accommodation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">All meals and transport</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Research equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">UWC certificate</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    Research Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">$195,000</div>
                  <p className="text-muted-foreground text-sm mb-4">HABRI grant target over 3 years</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Biometric research equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Longitudinal data collection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">International collaboration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Publication support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Begin Your Journey in June 2026
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join the first cohort of this groundbreaking programme and contribute to pioneering research 
            in Animal-Assisted Therapy and African wellness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
              <Heart className="mr-2 h-5 w-5" />
              Express Interest
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Contact Programme Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCHumanAnimalProgram;
