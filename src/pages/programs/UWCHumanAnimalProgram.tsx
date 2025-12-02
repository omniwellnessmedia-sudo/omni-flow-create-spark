import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Sparkles,
  Target,
  TrendingUp,
  Home,
  Clock,
  CheckCircle2,
  Star,
  Microscope,
  Activity
} from 'lucide-react';

// Image URLs (using uploaded images)
const heroImages = [
  "/lovable-uploads/482325347_1198932732239807_143306161811243658_n.jpg",
  "/lovable-uploads/558852709_1243815057772392_7668626230595706187_n.jpg",
  "/lovable-uploads/565111747_1249493680537863_2087503467128195421_n.jpg",
  "/lovable-uploads/565941732_1251461607007737_6890680042161126307_n.jpg",
  "/lovable-uploads/547230382_1363593685773710_4169595945775668111_n.jpg"
];

const accommodationImages = {
  bedroom: "/lovable-uploads/536268543_1347914427341636_1998936286569467143_n.jpg",
  kitchen: "/lovable-uploads/542040370_1353140630152349_287216765193985309_n.jpg"
};

const sanctuaryImages = [
  "/lovable-uploads/556098599_1378021897664222_4748312450378726214_n.jpg",
  "/lovable-uploads/555728551_1378021847664227_1071983310888780042_n.jpg"
];

const UWCHumanAnimalProgram = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  const academicPillars = [
    {
      icon: Heart,
      title: "Animal-Assisted Therapy & Empathy Development",
      description: "Biometric measurement of HRV, cortisol, and empathy indicators through human-animal interactions",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: Leaf,
      title: "Indigenous Knowledge & African Healing Practices",
      description: "Integration of traditional African wellness practices with evidence-based therapeutic approaches",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Environmental Sustainability & Permaculture",
      description: "Hands-on learning in sustainable farming, food security, and ecological stewardship",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Wellness Education & Community Regeneration",
      description: "Zone-based community placements in Khayelitsha, Mitchells Plain, Gugulethu, and Delft",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Brain,
      title: "Conscious Leadership & Social Innovation",
      description: "Developing change agents who lead with empathy, purpose, and community-centered values",
      color: "from-purple-500 to-violet-600"
    }
  ];

  const researchInnovations = [
    {
      icon: Activity,
      title: "Biometric Integration",
      description: "Wearable devices tracking HRV, sleep quality, and stress indicators throughout the program"
    },
    {
      icon: MapPin,
      title: "Geofenced Community Zones",
      description: "Targeted placements in Khayelitsha, Mitchells Plain, Gugulethu, and Delft communities"
    },
    {
      icon: Heart,
      title: "Dual-Benefit Model",
      description: "Simultaneous measurement of handler stress reduction and equine welfare indicators"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Data Pipeline",
      description: "Continuous feedback loops from biometric data directly into curriculum refinement"
    }
  ];

  const partners = [
    {
      name: "University of the Western Cape",
      role: "Academic Institution & Research Supervision",
      description: "NQF Level 7-8 accreditation and academic oversight"
    },
    {
      name: "Cart Horse Protection Association",
      role: "Equine Welfare & Community Liaison",
      description: "Expertise in working horse welfare and community engagement"
    },
    {
      name: "TUFCAT Farm & Brands Consortium",
      role: "Field Site Operations",
      description: "7-hectare living classroom with sanctuary animals and accommodation"
    },
    {
      name: "Dr. Phil-afel Foundation",
      role: "Section 18A Funding Partner",
      description: "Tax-deductible sponsorship and scholarship support"
    },
    {
      name: "EduPonics",
      role: "Urban Farming & Food Security",
      description: "Sustainable agriculture training and community gardens"
    },
    {
      name: "Omni Wellness Media",
      role: "Platform & Data Integration",
      description: "Digital infrastructure and biometric data management"
    }
  ];

  const teamMembers = [
    {
      name: "Prof. Sharyn Spicer",
      role: "Academic Supervision",
      description: "Overseeing research methodology and academic standards"
    },
    {
      name: "Dr. Megan White",
      role: "Cart Horse Protection Association",
      description: "Equine welfare expertise and community liaison"
    },
    {
      name: "Chad Cupido",
      role: "Research Design Lead",
      description: "TUFCAT/PhD candidate leading research design and implementation"
    },
    {
      name: "Leigh Tucker",
      role: "Funder Alignment Lead",
      description: "UWC International Relations and strategic partnerships"
    },
    {
      name: "Wendy Walton",
      role: "Geofencing & Life Skills Integration",
      description: "Community zone coordination and practical skills development"
    },
    {
      name: "Tumelo Ncube",
      role: "Technology-Enabled Measurement",
      description: "RPL Pathway development and biometric data systems"
    }
  ];

  const timeline = [
    { date: "November 2025", event: "MOU Finalization", status: "current" },
    { date: "February 13, 2026", event: "HABRI Grant Submission Deadline", status: "upcoming" },
    { date: "May 2026", event: "HABRI Funding Decision", status: "upcoming" },
    { date: "June 2026", event: "First Cohort Launch", status: "upcoming" }
  ];

  const galleryImages = [
    { src: heroImages[0], alt: "Horse care and therapy session" },
    { src: heroImages[1], alt: "Human-animal interaction" },
    { src: heroImages[2], alt: "Community engagement" },
    { src: heroImages[3], alt: "Equine welfare program" },
    { src: sanctuaryImages[0], alt: "Sanctuary animals" },
    { src: sanctuaryImages[1], alt: "Animal sanctuary" },
    { src: heroImages[4], alt: "Community outreach" },
    { src: accommodationImages.bedroom, alt: "Student accommodation" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Height with Image Carousel */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Program highlight ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-6xl mx-auto">
          <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-sm px-4 py-2 text-sm">
            <GraduationCap className="w-4 h-4 mr-2" />
            UWC × TUFCAT Consortium • HABRI-Funded Research • June 2026
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Animal-Assisted Therapy Research,{' '}
            <span className="text-primary">Violence Prevention</span>{' '}
            & African Wellness
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
            International Partnership Programme combining evidence-based therapy with indigenous knowledge systems
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Heart className="mr-2 h-5 w-5" />
              Express Interest
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
              <BookOpen className="mr-2 h-5 w-5" />
              Download Prospectus
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">R70K</div>
              <div className="text-sm text-white/70">Per Student</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">20-25</div>
              <div className="text-sm text-white/70">Students Per Cohort</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">NQF 7-8</div>
              <div className="text-sm text-white/70">Academic Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">10</div>
              <div className="text-sm text-white/70">SAQA Credits</div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbNav 
            items={[
              { label: 'Programs', href: '/programs' },
              { label: 'UWC Human-Animal Interaction', href: '/programs/uwc-human-animal' }
            ]}
          />
        </div>
      </div>

      {/* Research Question Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary">
              <Microscope className="w-4 h-4 mr-2" />
              Core Research Question
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
              How can Animal-Assisted Therapy transform occupational wellness and violence prevention in post-apartheid South Africa?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This pioneering international partnership programme combines rigorous academic research with hands-on experiential learning. 
              Students will participate as co-researchers, contributing to groundbreaking studies on the therapeutic benefits of 
              human-animal interaction while developing practical skills in community wellness and sustainable development.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Pillars */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <BookOpen className="w-4 h-4 mr-2" />
              Academic Framework
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Five Core Academic Pillars
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our interdisciplinary curriculum integrates evidence-based research with indigenous knowledge systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicPillars.map((pillar, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-card">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <pillar.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <Calendar className="w-4 h-4 mr-2" />
              Program Structure
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Flexible Learning Pathways
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 bg-card border-0 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Academic Modules</h3>
              <p className="text-muted-foreground text-sm">Short courses (3-6 weeks) or semester exchanges with NQF Level 7-8 accreditation</p>
            </Card>

            <Card className="text-center p-6 bg-card border-0 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Experiential Learning</h3>
              <p className="text-muted-foreground text-sm">Fieldwork at 7-hectare Tufcat Farm + zone-based community placements</p>
            </Card>

            <Card className="text-center p-6 bg-card border-0 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Microscope className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Research Participation</h3>
              <p className="text-muted-foreground text-sm">Biometric + qualitative measurement with students as co-researchers</p>
            </Card>

            <Card className="text-center p-6 bg-card border-0 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Blended Delivery</h3>
              <p className="text-muted-foreground text-sm">On-campus + field immersion + digital reflection labs</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Innovation */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Research Innovation
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Cutting-Edge Biometric Research
              </h2>
              <p className="text-muted-foreground mb-8">
                Our programme pioneers the integration of wearable technology with therapeutic animal interactions, 
                creating a unique dual-benefit research model that measures outcomes for both human participants and animal welfare.
              </p>

              <div className="space-y-6">
                {researchInnovations.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImages[1]} 
                alt="Research in action" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">USD $195K</div>
                    <div className="text-sm text-muted-foreground">HABRI Grant Target</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fieldwork & Accommodation */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <Home className="w-4 h-4 mr-2" />
              Fieldwork & Accommodation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tufcat Farm Living Classroom
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A 7-hectare sanctuary providing immersive learning experiences with comfortable student accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <img src={accommodationImages.bedroom} alt="Student bedroom" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Comfortable Accommodation</h3>
                <p className="text-muted-foreground text-sm">Cozy private and shared bedrooms in a safe, trauma-informed environment</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <img src={accommodationImages.kitchen} alt="Kitchen facilities" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Fully-Equipped Kitchen</h3>
                <p className="text-muted-foreground text-sm">Modern kitchen facilities supporting plant-based nutrition education</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <img src={sanctuaryImages[0]} alt="Sanctuary animals" className="w-full h-48 object-cover" />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Animal Sanctuary</h3>
                <p className="text-muted-foreground text-sm">Daily interaction with rescued animals in therapeutic settings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <Users className="w-4 h-4 mr-2" />
              Leadership Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Faculty & Research Leadership
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Consortium */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">
              <Building2 className="w-4 h-4 mr-2" />
              Partner Consortium
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Strategic Partnership Network
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="p-6 bg-card border-0 shadow-lg">
                <h3 className="font-bold text-lg text-foreground mb-1">{partner.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{partner.role}</p>
                <p className="text-muted-foreground text-sm">{partner.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment & Timeline */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Investment */}
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Award className="w-4 h-4 mr-2" />
                Investment
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Program Investment
              </h2>
              
              <Card className="p-8 bg-card border-0 shadow-xl mb-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-primary mb-2">R70,000</div>
                  <div className="text-muted-foreground">Per Student (First Cohort)</div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cohort Size</span>
                    <span className="font-semibold">20-25 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SA Scholarships</span>
                    <span className="font-semibold">20% of places</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HABRI Grant</span>
                    <span className="font-semibold">USD $195K (~R3.5M)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Deductibility</span>
                    <span className="font-semibold">Section 18A</span>
                  </div>
                </div>
              </Card>

              <div className="flex flex-wrap gap-4">
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
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Program Timeline
              </h2>

              <div className="space-y-6">
                {timeline.map((item, index) => (
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
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <div className="text-sm text-primary font-medium">{item.date}</div>
                      <div className="font-semibold text-foreground">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">
              Gallery
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Program Gallery
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
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
              Download Full Prospectus
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
