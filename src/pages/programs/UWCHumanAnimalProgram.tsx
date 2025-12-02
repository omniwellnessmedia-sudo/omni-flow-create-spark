import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  CheckCircle2,
  Star,
  Activity,
  Sun,
  Mountain,
  User,
  Check,
  Target
} from 'lucide-react';

// Image URLs - Cart Horse, TUFCAT, and Valley of Plenty community
const images = {
  hero: "https://carthorse.org.za/wp/wp-content/uploads/2021/03/History-of-cart-horses-in-the-Cape.jpg",
  cartHorse1: "https://carthorse.org.za/wp/wp-content/uploads/2022/08/Equine-Welfare-Training-Course-CHA.jpg",
  cartHorse2: "https://carthorse.org.za/wp/wp-content/uploads/2022/08/cart-horse-donkeys-equine-training.jpg",
  tufcat1: "https://www.tufcat.co.za/wp-content/uploads/2021/01/Freckles-Speckles.jpg",
  tufcat2: "https://www.tufcat.co.za/wp-content/uploads/2021/01/IMG-20210123-WA0002.jpg",
  accommodation: "/lovable-uploads/536268543_1347914427341636_1998936286569467143_n-2.jpg",
  kitchen: "/lovable-uploads/556098599_1378021897664222_4748312450378726214_n-2.jpg",
  living: "/lovable-uploads/555728551_1378021847664227_1071983310888780042_n-2.jpg",
  vetCare: "/lovable-uploads/573883488_1410644557735289_7908845877500205254_n.jpg",
  volunteer: "/lovable-uploads/547235882_1363651465767932_6536218706891973805_n.jpg",
  community: "/lovable-uploads/585868855_1429203929212685_6885647248657070604_n.jpg"
};

const UWCHumanAnimalProgram = () => {
  const partners = [
    {
      name: "Cart Horse Protection Association",
      role: "Equine Welfare & Community Liaison",
      description: "Since 1995, the Cart Horse Protection Association has protected working horses in Cape Town's most vulnerable communities. Their expertise in equine welfare, handler relationships, and community engagement forms the foundation of our animal-assisted therapy research.",
      image: images.cartHorse1,
      expertise: ["Equine welfare assessment", "Community handler relationships", "Working animal therapy models"]
    },
    {
      name: "TUFCAT Farm & Sanctuary",
      role: "Field Site Operations & Accommodation",
      description: "TUFCAT provides the 7-hectare living classroom where students experience hands-on animal care, sustainable farming, and therapeutic animal interactions. Their sanctuary houses rescued cats, dogs, and farm animals central to our research.",
      image: images.tufcat1,
      expertise: ["Animal sanctuary management", "Therapeutic animal interactions", "Sustainable farming practices"]
    },
    {
      name: "Valley of Plenty",
      role: "Community Development Model",
      description: "Located in Hanover Park, Valley of Plenty demonstrates sustainable community development in action. Students participate in urban farming, food security initiatives, and community wellness programs as part of their experiential learning.",
      image: images.community,
      expertise: ["Urban permaculture", "Community food security", "Grassroots development"]
    }
  ];

  const programTimeline = [
    {
      phase: "Week 1-2",
      title: "Foundation & Orientation",
      icon: BookOpen,
      color: "text-blue-600",
      borderColor: "border-l-blue-500",
      activities: [
        "Academic orientation and research methodology training",
        "Introduction to Animal-Assisted Therapy frameworks",
        "Biometric device setup and baseline measurements",
        "Campus integration and community introductions"
      ]
    },
    {
      phase: "Week 3-4",
      title: "Cart Horse Protection Immersion",
      icon: Heart,
      color: "text-rose-600",
      borderColor: "border-l-rose-500",
      activities: [
        "Field placement with Cart Horse Protection Association",
        "Equine welfare assessment training with Dr. Megan White",
        "Handler relationship observations and interviews",
        "Dual-benefit research: measuring handler stress + equine welfare indicators"
      ]
    },
    {
      phase: "Week 5-6",
      title: "TUFCAT Sanctuary Experience",
      icon: Leaf,
      color: "text-green-600",
      borderColor: "border-l-green-500",
      activities: [
        "Daily animal care routines and therapeutic interactions",
        "Small animal welfare and sanctuary management",
        "Sustainable farming and permaculture practices",
        "Student accommodation at TUFCAT Field Station"
      ]
    },
    {
      phase: "Week 7-8",
      title: "Valley of Plenty Community Integration",
      icon: Users,
      color: "text-amber-600",
      borderColor: "border-l-amber-500",
      activities: [
        "Community placement in Hanover Park",
        "Urban farming and food security initiatives",
        "Indigenous knowledge integration with local healers",
        "Community wellness program participation"
      ]
    },
    {
      phase: "Week 9-10",
      title: "Research Synthesis & Presentation",
      icon: Target,
      color: "text-purple-600",
      borderColor: "border-l-purple-500",
      activities: [
        "Data analysis workshops and research writing",
        "Biometric data interpretation and findings",
        "Academic presentation preparation",
        "Certificate ceremony and graduation"
      ]
    }
  ];

  const teamMembers = [
    {
      name: "Prof. Sharyn Spicer",
      role: "Academic Director",
      organization: "University of the Western Cape",
      description: "Overseeing research methodology and academic standards"
    },
    {
      name: "Dr. Megan White",
      role: "Equine Welfare Lead",
      organization: "Cart Horse Protection Association",
      description: "Expert in working animal welfare and community liaison"
    },
    {
      name: "Chad Cupido",
      role: "Research Design Lead",
      organization: "TUFCAT / Omni Wellness Media",
      description: "PhD candidate leading research design and media documentation"
    },
    {
      name: "Leigh Tucker",
      role: "International Partnerships",
      organization: "UWC International Relations",
      description: "Strategic partnerships and funder alignment"
    },
    {
      name: "Wendy Walton",
      role: "Community Integration",
      organization: "Valley of Plenty",
      description: "Community zone coordination and life skills development"
    },
    {
      name: "Tumelo Ncube",
      role: "Technology Lead",
      organization: "Omni Wellness Media",
      description: "Biometric systems and data pipeline development"
    }
  ];

  const academicPillars = [
    {
      icon: Heart,
      title: "Animal-Assisted Therapy",
      description: "Biometric measurement of HRV, cortisol, and empathy through human-animal interactions",
      color: "bg-rose-500"
    },
    {
      icon: Leaf,
      title: "Indigenous Knowledge Systems",
      description: "Integration of African wellness practices with evidence-based therapeutic approaches",
      color: "bg-emerald-500"
    },
    {
      icon: Globe,
      title: "Environmental Sustainability",
      description: "Hands-on permaculture, food security, and ecological stewardship",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Community Regeneration",
      description: "Valley of Plenty model: sustainable development in Hanover Park",
      color: "bg-amber-500"
    },
    {
      icon: Brain,
      title: "Conscious Leadership",
      description: "Developing change agents who lead with empathy and community-centered values",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero Section - Single Clear Image */}
      <section className="relative h-[80vh] overflow-hidden">
        <img 
          src={images.hero}
          alt="Cart Horse Protection Association - History of working horses in Cape Town"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-primary/80 text-primary-foreground border-primary/30">
              <GraduationCap className="w-4 h-4 mr-2" />
              UWC × TUFCAT Consortium • June 2026
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Animal-Assisted Therapy Research,{' '}
              <span className="text-primary">Violence Prevention</span>{' '}
              & African Wellness
            </h1>
            <p className="text-xl mb-4 text-white/90">
              International Partnership Programme with Cart Horse Protection Association
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-2xl">
              Combining rigorous academic research with hands-on experiential learning at TUFCAT Sanctuary 
              and Valley of Plenty community in Hanover Park.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Heart className="mr-2 h-5 w-5" />
                Express Interest - R70,000
              </Button>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>10 Weeks • NQF Level 7-8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">R70K</div>
              <div className="text-sm text-muted-foreground">Per Student</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">20-25</div>
              <div className="text-sm text-muted-foreground">Students Per Cohort</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">SAQA Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">$195K</div>
              <div className="text-sm text-muted-foreground">HABRI Grant Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Research Question */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary">Core Research Question</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              How can Animal-Assisted Therapy transform occupational wellness and violence prevention 
              in post-apartheid South Africa?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This pioneering programme combines rigorous academic research with hands-on experiential learning. 
              Students participate as co-researchers, contributing to groundbreaking studies on the therapeutic benefits of 
              human-animal interaction while developing practical skills in community wellness and sustainable development.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Partners - Curator/Narrative Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <Building2 className="w-4 h-4 mr-2" />
              Partner Consortium
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">Meet Our Partners</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Three organizations united to create Africa's first Animal-Assisted Therapy research programme
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {partners.map((partner, index) => (
              <div key={index} className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <img 
                    src={partner.image}
                    alt={partner.name}
                    className="rounded-2xl shadow-2xl w-full h-64 md:h-80 object-cover"
                  />
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <Badge className="mb-4 bg-primary/10 text-primary">{partner.role}</Badge>
                  <h3 className="text-2xl font-bold mb-4">{partner.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {partner.description}
                  </p>
                  <div className="space-y-2">
                    {partner.expertise.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Pillars */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <BookOpen className="w-4 h-4 mr-2" />
              Academic Framework
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">Five Core Academic Pillars</h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {academicPillars.map((pillar, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-full ${pillar.color} flex items-center justify-center mx-auto mb-4`}>
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Itinerary */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Program Structure
              </Badge>
              <h2 className="text-3xl font-bold">10-Week Learning Journey</h2>
            </div>
            
            <div className="space-y-6">
              {programTimeline.map((phase, index) => (
                <Card key={index} className={`border-l-4 ${phase.borderColor}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <phase.icon className={`w-6 h-6 ${phase.color}`} />
                      <div>
                        <span className="text-sm text-muted-foreground block">{phase.phase}</span>
                        <span>{phase.title}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {phase.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation & Fieldwork Gallery */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <MapPin className="w-4 h-4 mr-2" />
              Fieldwork & Accommodation
            </Badge>
            <h2 className="text-3xl font-bold">TUFCAT Field Station</h2>
            <p className="text-muted-foreground mt-2">
              Comfortable accommodation in a trauma-informed, wellness-focused environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <img src={images.accommodation} alt="Student accommodation" className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Comfortable Rooms</h3>
                <p className="text-sm text-muted-foreground">Private and shared bedrooms in a safe, nurturing environment</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <img src={images.kitchen} alt="Kitchen facilities" className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Communal Kitchen</h3>
                <p className="text-sm text-muted-foreground">Modern facilities supporting plant-based nutrition education</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <img src={images.vetCare} alt="Animal care" className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">Hands-On Animal Care</h3>
                <p className="text-sm text-muted-foreground">Daily therapeutic interactions with sanctuary animals</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <Users className="w-4 h-4 mr-2" />
              Leadership Team
            </Badge>
            <h2 className="text-3xl font-bold">Faculty & Research Leadership</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-2">{member.organization}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment & Timeline */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Investment */}
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary">
                  <Award className="w-4 h-4 mr-2" />
                  Investment
                </Badge>
                <h2 className="text-3xl font-bold mb-6">Program Investment</h2>
                
                <Card className="shadow-xl">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-primary mb-2">R70,000</div>
                      <div className="text-muted-foreground">Per Student (First Cohort)</div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cohort Size</span>
                        <span className="font-semibold">20-25 students</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SA Scholarships</span>
                        <span className="font-semibold">20% of places</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HABRI Grant Target</span>
                        <span className="font-semibold">USD $195K (~R3.5M)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Deductibility</span>
                        <span className="font-semibold">Section 18A</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap gap-4 mt-6">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Heart className="mr-2 h-4 w-4" />
                    Sponsor a Student
                  </Button>
                  <Button variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    Become a Partner
                  </Button>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary">
                  <Clock className="w-4 h-4 mr-2" />
                  Timeline
                </Badge>
                <h2 className="text-3xl font-bold mb-6">Key Milestones</h2>

                <div className="space-y-6">
                  {[
                    { date: "November 2025", event: "MOU Finalization", status: "current" },
                    { date: "February 13, 2026", event: "HABRI Grant Submission", status: "upcoming" },
                    { date: "May 2026", event: "HABRI Funding Decision", status: "upcoming" },
                    { date: "June 2026", event: "First Cohort Launch", status: "upcoming" }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === 'current' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.status === 'current' ? (
                            <Star className="w-5 h-5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>
                        {index < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
                      </div>
                      <div className="pb-8">
                        <div className="text-sm text-primary font-medium">{item.date}</div>
                        <div className="font-semibold">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">Gallery</Badge>
            <h2 className="text-3xl font-bold">Program Gallery</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { src: images.hero, alt: "Cart Horse history" },
              { src: images.cartHorse1, alt: "Equine training" },
              { src: images.cartHorse2, alt: "Horse care" },
              { src: images.tufcat1, alt: "TUFCAT cats" },
              { src: images.accommodation, alt: "Accommodation" },
              { src: images.vetCare, alt: "Animal care" },
              { src: images.volunteer, alt: "Volunteer work" },
              { src: images.community, alt: "Community" }
            ].map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-xl group cursor-pointer">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Lives Through Human-Animal Connection?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join us in pioneering research that bridges African wellness traditions with evidence-based therapy
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Heart className="mr-2 h-5 w-5" />
              Express Interest
            </Button>
            <Button size="lg" variant="outline">
              <BookOpen className="mr-2 h-5 w-5" />
              Download Prospectus
            </Button>
            <Button size="lg" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              Partner With Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCHumanAnimalProgram;
