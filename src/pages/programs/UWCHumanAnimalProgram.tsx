import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Footer from '@/components/Footer';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { 
  GraduationCap, Heart, Globe, Users, Calendar, MapPin, Award, BookOpen,
  Clock, Check, ChevronDown, ArrowRight, Phone, Mail, HelpCircle, Download,
  Sparkles, Play, Building2, DollarSign, ExternalLink
} from 'lucide-react';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

// Hero image - static, high-quality
const heroImage = `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20230905-WA0065.jpg`;

// Partner logos - all from Supabase storage (corrected folder path: partner-logos** not partner-logos)
const partnerLogos = {
  carthorse: `${STORAGE_BASE}/partner-logos%2A%2A%20(Brand%20Assets)/cart-horse-favicon-black.png`,
  tufcat: 'https://www.tufcat.co.za/wp-content/uploads/2021/01/tufcat-logo-spaced.png',
  drphilafel: `${STORAGE_BASE}/partner-logos%2A%2A%20(Brand%20Assets)/DR%20PHIL%20LOGO%20NPO_OMNI-02.png`,
  valleyOfPlenty: `${STORAGE_BASE}/partner-logos%2A%2A%20(Brand%20Assets)/The%20Valley%20of%20Plenty%20Logo%20No%20Background%20(2).png`,
  uwc: `${STORAGE_BASE}/partner-logos%2A%2A%20(Brand%20Assets)/UWC-Crest.png`,
  omni: `${STORAGE_BASE}/partner-logos%2A%2A%20(Brand%20Assets)/OMNI%20LOGO%20FA-06(1)%20(1).png`
};

// Journey images
const journeyImages = [
  `${STORAGE_BASE}/Tufcat%20and%20Carthorse/587383422_1285925536894677_4345595592711419953_n.jpg`,
  `${STORAGE_BASE}/Tufcat%20and%20Carthorse/556100985_1378021790997566_6773851859108767885_n.jpg`,
  `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG_20230819_102326.jpg`,
  `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20230717-WA0065.jpg`,
  `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG_20230929_170146.jpg`
];

// Programme constants
const PROGRAMME_FEE_ZAR = 70000;
const PROGRAMME_FEE_USD = 3850;

// Simple image component with placeholder fallback
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center`}>
        <span className="text-primary/40 text-sm">Image</span>
      </div>
    );
  }
  
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} loading="lazy" />;
};

const UWCHumanAnimalProgram: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCurrency, setShowCurrency] = useState<'ZAR' | 'USD'>('ZAR');

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight - 100);
      
      // Update active section based on scroll position
      const sections = ['overview', 'journey', 'investment', 'team', 'apply'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simplified navigation - 5 items only
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'journey', label: 'Your Journey' },
    { id: 'investment', label: 'Investment' },
    { id: 'team', label: 'Meet the Team' },
    { id: 'apply', label: 'Apply' }
  ];

  // Journey phases - simplified
  const journeyPhases = [
    { weeks: 'Weeks 1-2', title: 'Orientation', location: 'UWC Campus', image: journeyImages[0] },
    { weeks: 'Weeks 3-4', title: 'Field Research', location: 'Cart Horse Association', image: journeyImages[1] },
    { weeks: 'Weeks 5-6', title: 'Sanctuary Immersion', location: 'TUFCAT', image: journeyImages[2] },
    { weeks: 'Weeks 7-8', title: 'Community Wellness', location: 'Valley of Plenty', image: journeyImages[3] },
    { weeks: 'Weeks 9-10', title: 'Research & Graduation', location: 'UWC Campus', image: journeyImages[4] }
  ];

  // Team members
  const team = [
    { name: 'Dr. Sharyn Spicer', role: 'Academic Director', expertise: 'Research Methodology, Community Psychology' },
    { name: 'Chad Cupido', role: 'Research Partner', expertise: 'Human-Animal Bond, Media Documentation' },
    { name: 'Dr. Megan White', role: 'Field Guide', expertise: 'Equine Welfare, Working Animals' },
    { name: 'Wendy Walton', role: 'Community Bridge', expertise: 'Indigenous Knowledge, Urban Agriculture' }
  ];

  // FAQs - condensed
  const faqs = [
    { question: "Is this programme accredited?", answer: "Yes! This is a University of the Western Cape Short Course aligned to NQF Level 7-8, carrying 10 SAQA credits." },
    { question: "Can international students apply?", answer: "Absolutely! We welcome global participants. The fee includes accommodation and meals, making budgeting straightforward." },
    { question: "What accommodation is provided?", answer: "Students stay at TUFCAT Field Station in comfortable shared rooms within a wellness-focused environment." },
    { question: "Do I need animal experience?", answer: "No prior animal experience required! We provide comprehensive training. What matters most is your willingness to learn." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero Section - Static, Clean */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <ImageWithFallback 
          src={heroImage}
          alt="Human-Animal Bond Programme"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <div className="relative z-10 container mx-auto h-full flex flex-col justify-end pb-16 md:pb-24 px-4">
          <div className="max-w-3xl">
            {/* Simple badge */}
            <Badge className="bg-white/20 backdrop-blur text-white border-0 px-4 py-2 mb-6">
              UWC Accredited • 10 Weeks • June 2026
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Human-Animal Bond<br />
              <span className="text-primary">Research Programme</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              A transformative 10-week study abroad experience in Cape Town, South Africa. 
              Explore animal-assisted therapy, indigenous wisdom, and community wellness.
            </p>

            {/* Clean metadata */}
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-8">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Cape Town, South Africa
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> June – August 2026
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" /> 10 SAQA Credits
              </span>
            </div>
            
            {/* Two clear CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl"
                onClick={() => scrollToSection('apply')}
              >
                <Heart className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl"
                onClick={() => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Book a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation - Simple */}
      <nav className={`bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-all ${isSticky ? 'fixed top-0 left-0 right-0 shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 min-h-[44px] text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button 
              size="sm" 
              className="hidden md:flex"
              onClick={() => scrollToSection('apply')}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {/* Currency Toggle */}
            <div className="flex items-center gap-1 bg-background rounded-lg p-1 border border-border">
              <button 
                onClick={() => setShowCurrency('ZAR')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${showCurrency === 'ZAR' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                ZAR
              </button>
              <button 
                onClick={() => setShowCurrency('USD')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${showCurrency === 'USD' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                USD
              </button>
            </div>
            
            {[
              { value: showCurrency === 'ZAR' ? `R${PROGRAMME_FEE_ZAR.toLocaleString()}` : `$${PROGRAMME_FEE_USD.toLocaleString()}`, label: "All-Inclusive" },
              { value: "10 Weeks", label: "Duration" },
              { value: "20-25", label: "Cohort Size" },
              { value: "5 Partners", label: "Field Sites" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                About the Programme
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                More Than Education — A Transformation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Wake up on a 7-hectare sanctuary surrounded by rescued animals in one of the world's 
                most beautiful cities. This isn't just a course — it's a journey that will change 
                how you see yourself and your impact on the world.
              </p>
            </div>

            {/* Who is it for */}
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              {[
                { icon: GraduationCap, title: "Students", desc: "Psychology, Social Work, Counselling, or Occupational Therapy postgraduates", highlight: "Earn 10 SAQA credits" },
                { icon: Heart, title: "Professionals", desc: "Therapists, counsellors, and animal welfare practitioners seeking AAT specialization", highlight: "CPD accredited" },
                { icon: Globe, title: "Global Seekers", desc: "International study abroad students from partner universities worldwide", highlight: "Study abroad ready" }
              ].map((item, idx) => (
                <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{item.desc}</p>
                    <Badge variant="outline" className="bg-primary/5 text-primary text-xs">{item.highlight}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Partner Trust Bar */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-6">In partnership with</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {[
                  { name: 'UWC', logo: partnerLogos.uwc },
                  { name: 'Cart Horse', logo: partnerLogos.carthorse },
                  { name: 'TUFCAT', logo: partnerLogos.tufcat },
                  { name: 'Dr. Phil-afel', logo: partnerLogos.drphilafel },
                  { name: 'Valley of Plenty', logo: partnerLogos.valleyOfPlenty }
                ].map((partner, idx) => (
                  <div key={idx} className="group">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white shadow-sm border border-border p-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-xs font-bold text-primary">${partner.name}</span>`;
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-24 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              10-Week Programme
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Journey Awaits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From arrival to graduation, every week is designed for your growth.
            </p>
          </div>

          {/* Timeline - Clean Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {journeyPhases.map((phase, idx) => (
                <div key={idx} className="group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md">
                    <ImageWithFallback 
                      src={phase.image}
                      alt={phase.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Badge className="bg-white/90 text-foreground mb-2 text-xs">{phase.weeks}</Badge>
                      <h4 className="font-bold text-white text-lg">{phase.title}</h4>
                      <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {phase.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Watch Video CTA */}
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-xl"
                onClick={() => window.open('https://www.youtube.com/watch?v=ycYl7KSGkUU', '_blank')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Programme Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="investment" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <DollarSign className="w-3.5 h-3.5 mr-2" />
              Your Investment
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              All-Inclusive Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One fee covers everything — accommodation, meals, fieldwork, and academic supervision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Early Bird */}
            <Card className="border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
              <CardContent className="p-6 pt-8">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 mb-4">Save R7,000</Badge>
                <h3 className="text-xl font-bold text-foreground mb-1">Early Bird</h3>
                <p className="text-sm text-muted-foreground mb-4">Apply by Dec 2025</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R63,000</span>
                  <p className="text-sm text-muted-foreground">≈ $3,400 USD</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {["Everything included", "Priority placement", "Pre-programme mentorship"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=UWC Programme - Early Bird Application', '_blank')}>Apply Early</Button>
              </CardContent>
            </Card>

            {/* Full Programme - Featured */}
            <Card className="border-primary shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardContent className="p-6 pt-10">
                <h3 className="text-xl font-bold text-foreground mb-1">Full Programme</h3>
                <p className="text-sm text-muted-foreground mb-4">Standard enrollment</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R70,000</span>
                  <p className="text-sm text-muted-foreground">≈ $3,850 USD</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {["10-week full immersion", "Accommodation & meals", "Field research access", "UWC certification", "Publication support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=UWC Programme - Full Programme Application', '_blank')}>Apply Now</Button>
              </CardContent>
            </Card>

            {/* University Partners */}
            <Card className="border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
              <CardContent className="p-6 pt-8">
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 mb-4">Partner Rate</Badge>
                <h3 className="text-xl font-bold text-foreground mb-1">University Partners</h3>
                <p className="text-sm text-muted-foreground mb-4">For partner institutions</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">Custom</span>
                  <p className="text-sm text-muted-foreground">Cohort pricing available</p>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {["Custom cohort sizes", "Credit transfer support", "Faculty coordination"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/programs/uwc-human-animal/university-partners">
                  <Button className="w-full" variant="outline">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* What's Included */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-xl font-bold text-center mb-8 text-foreground">What's Included</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Shared accommodation",
                "All meals provided",
                "Field transportation",
                "Research materials",
                "Academic supervision",
                "UWC certificate",
                "Publication support",
                "Graduation ceremony"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Users className="w-3.5 h-3.5 mr-2" />
              Your Guides
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than instructors — they're mentors who'll walk beside you on this journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map((person, idx) => (
              <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{person.name}</h4>
                  <p className="text-primary text-sm mb-3">{person.role}</p>
                  <p className="text-muted-foreground text-xs">{person.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground border-0 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Limited to 20-25 Students
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Begin?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Applications for June 2026 are now open.
            </p>
          </div>

          {/* Application Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { num: "1", title: "Express Interest", desc: "Quick form" },
              { num: "2", title: "Book a Call", desc: "20 min chat" },
              { num: "3", title: "Apply", desc: "Submit docs" },
              { num: "4", title: "Confirm", desc: "Pay deposit" }
            ].map((step, idx) => (
              <div key={idx} className={`p-4 md:p-6 rounded-xl text-center ${idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border border-border'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold ${idx === 0 ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  {step.num}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${idx === 0 ? 'text-white' : 'text-foreground'}`}>{step.title}</h3>
                <p className={`text-xs ${idx === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button 
                size="lg" 
                className="px-8"
                onClick={() => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Book Discovery Call
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8"
                onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=UWC Programme Interest', '_blank')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Questions? Contact <a href="mailto:info@omniwellness.co.za" className="text-primary hover:underline">info@omniwellness.co.za</a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <HelpCircle className="w-3.5 h-3.5 mr-2" />
              Questions
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <Collapsible key={idx} open={openFaq === idx} onOpenChange={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-left">
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation Bar */}
      <section className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { label: "University of the Western Cape", badge: "Academic Partner" },
              { label: "NQF Level 7-8", badge: "Academic Level" },
              { label: "10 SAQA Credits", badge: "Accredited" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="font-bold text-foreground text-sm">{item.label}</div>
                <Badge variant="outline" className="mt-1 text-xs">{item.badge}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Your Transformation Starts Here
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto mb-8">
            Join 20-25 extraordinary individuals on a journey that will change how you see 
            animals, communities, and yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8"
              onClick={() => scrollToSection('apply')}
            >
              <Heart className="mr-2 h-5 w-5" />
              Begin Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-8"
              onClick={() => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Book a Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCHumanAnimalProgram;
