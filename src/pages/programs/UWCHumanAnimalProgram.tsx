import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Footer from '@/components/Footer';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { 
  GraduationCap, Heart, Globe, Users, Calendar, MapPin, Award, BookOpen, Leaf, Brain,
  Building2, Clock, Check, Target, Star, Coffee, Utensils, Home, Camera, Sparkles,
  ChevronDown, ChevronRight, FileText, Briefcase, HelpCircle, ArrowRight, Download,
  Mail, Phone, Shield, TrendingUp, Lightbulb, TreePine, HandHeart, Mountain,
  Waves, Sun, Play, Video, Plane, Building, DollarSign, CreditCard, Gift,
  PawPrint, Cat, Sprout, GraduationCap as GradCap, Film, ExternalLink, Handshake
} from 'lucide-react';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

const images = {
  hero: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20230905-WA0065.jpg`,
  volunteer: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20230717-WA0065.jpg`,
  fieldwork1: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20221016-WA0017.jpg`,
  fieldwork2: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20221016-WA0017.jpg`,
  cartHorse1: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/587383422_1285925536894677_4345595592711419953_n.jpg`,
  cartHorse2: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/574087632_1263656015788296_8646920016236566402_n.jpg`,
  cartHorse3: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/565941732_1251461607007737_6890680042161126307_n.jpg`,
  tufcat1: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/556100985_1378021790997566_6773851859108767885_n.jpg`,
  community: `${STORAGE_BASE}/%20community-images%20(Workshop%20Photos)/_MG_9481-2.jpg`,
  accommodation: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/547230382_1363593685773710_4169595945775668111_n.jpg`,
  kitchen: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/556098599_1378021897664222_4748312450378726214_n.jpg`,
  living: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/555728551_1378021847664227_1071983310888780042_n.jpg`,
  workshop: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/542040370_1353140630152349_287216765193985309_n.jpg`,
  // Cape Town stock images for destination context
  tableMountain: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
  winelands: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&q=80",
  coastline: "https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=800&q=80",
  sunset: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&q=80",
  // Partner images
  cartHorseHero: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
  catSanctuary: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
  urbanGarden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  uwcCampus: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  mediaProduction: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80"
};

const heroGallery = [images.hero, images.cartHorse1, images.volunteer, images.fieldwork1, images.tufcat1];

// Partner data
const partners = [
  {
    id: 'carthorse',
    name: 'Cart Horse Protection Association',
    shortName: 'Cart Horse',
    tagline: 'Giving a Voice to Those Who Can\'t Speak',
    icon: PawPrint,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    heroImage: images.cartHorse1,
    gallery: [images.cartHorse1, images.cartHorse2, images.cartHorse3],
    story: `Since 1995, the Cart Horse Protection Association has been Cape Town's leading voice for working equine welfare. From their Recovery & Rehabilitation Centre in Epping, they provide vital veterinary care, handler education, and community outreach that transforms lives—both human and horse.`,
    roleInProgramme: `As our **primary research partner**, Cart Horse provides the unique field environment where students witness the profound bond between working horses and their handlers. During Weeks 3-4, you'll conduct real biometric research, interview handlers, and collect data that contributes directly to HABRI-funded global studies on the human-animal bond in occupational settings.`,
    stats: [
      { value: '29+', label: 'Years of Service' },
      { value: '7,000+', label: 'Horses Helped Annually' },
      { value: '2,500+', label: 'Handler Trainings' }
    ],
    keyPeople: [
      { name: 'Dr. Megan White', role: 'Senior Veterinarian & Field Guide' }
    ],
    website: 'https://carthorse.org.za/',
    ctas: [
      { label: 'Visit Cart Horse', url: 'https://carthorse.org.za/', primary: true },
      { label: 'Volunteer', url: 'https://carthorse.org.za/volunteer' }
    ]
  },
  {
    id: 'tufcat',
    name: 'TUFCAT - UWC Feral Cat Project',
    shortName: 'TUFCAT',
    tagline: '21 Years of Compassion on Campus',
    icon: Cat,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    heroImage: images.tufcat1,
    gallery: [images.tufcat1, images.accommodation, images.kitchen, images.living],
    story: `What started as a small initiative to care for feral cats on UWC campus has blossomed into a 7-hectare sanctuary of hope. TUFCAT now provides trauma-informed care for multiple species, runs community vet assistance programmes, and operates a working organic farm that feeds both animals and humans.`,
    roleInProgramme: `TUFCAT is your **home base** for the entire 10-week programme. Wake each morning surrounded by rescued animals, participate in daily sanctuary routines, and learn sustainable farming practices. During Weeks 5-6, you'll immerse in therapeutic animal interactions and discover how healing happens naturally in this unique environment.`,
    stats: [
      { value: '21+', label: 'Years Operating' },
      { value: '7 ha', label: 'Sanctuary Size' },
      { value: '500+', label: 'Animals Rescued' }
    ],
    keyPeople: [
      { name: 'Leigh Tucker', role: 'Founder & Sanctuary Director' }
    ],
    website: 'https://www.tufcat.co.za/',
    ctas: [
      { label: 'Visit TUFCAT', url: 'https://www.tufcat.co.za/', primary: true },
      { label: 'Support the Sanctuary', url: 'https://www.tufcat.co.za/donate' }
    ]
  },
  {
    id: 'drphilafel',
    name: 'Dr. Phil-afel Foundation',
    shortName: 'Dr. Phil-afel',
    tagline: 'From Cape Flats to Valley of Plenty',
    icon: Sprout,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    heroImage: images.community,
    gallery: [images.community, images.workshop],
    story: `The Dr. Phil-afel Foundation emerged from the heart of Hanover Park—one of Cape Town's most challenged communities—with a radical vision: transform barren spaces into thriving gardens of abundance. Their "Valley of Plenty" and "Where Rainbows Meet" projects have brought food security, community healing, and hope to thousands of residents.`,
    roleInProgramme: `As our **City Twin Partner**, Dr. Phil-afel provides the crucial community integration component during Weeks 7-8. Students work alongside local practitioners learning Indigenous Knowledge Systems, participate in urban agriculture projects, and understand how wellness interventions can heal communities affected by generational trauma.`,
    stats: [
      { value: '500+', label: 'Families Fed' },
      { value: '12', label: 'Community Gardens' },
      { value: '50+', label: 'Youth Employed' }
    ],
    keyPeople: [
      { name: 'Wendy Walton', role: 'Community Bridge & IKS Practitioner' }
    ],
    website: 'https://www.drphilafel.foundation/',
    ctas: [
      { label: 'Visit Dr. Phil-afel', url: 'https://www.drphilafel.foundation/', primary: true },
      { label: 'Support Valley of Plenty', url: 'https://www.drphilafel.foundation/donate' }
    ]
  },
  {
    id: 'uwc',
    name: 'University of the Western Cape',
    shortName: 'UWC',
    tagline: 'Where Scholarship Meets Service',
    icon: GradCap,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    heroImage: images.uwcCampus,
    gallery: [images.uwcCampus],
    story: `Founded during apartheid to serve "non-white" students, UWC has evolved into a beacon of academic excellence with a deep commitment to social justice. The Psychology Department brings world-class research methodology and community psychology expertise, while the broader university provides the academic framework for this groundbreaking programme.`,
    roleInProgramme: `UWC is the **academic backbone** of the programme, providing official accreditation (NQF Level 7-8, 10 SAQA credits), research supervision, and the scholarly rigour that ensures your work meets publication standards. Opening and closing weeks take place on campus, connecting you to the broader academic community.`,
    stats: [
      { value: '1960', label: 'Founded' },
      { value: '23,000+', label: 'Students' },
      { value: 'Top 1000', label: 'World Ranking' }
    ],
    keyPeople: [
      { name: 'Prof. Sharyn Spicer', role: 'Academic Director, Psychology Dept.' }
    ],
    website: 'https://www.uwc.ac.za/',
    ctas: [
      { label: 'Explore UWC', url: 'https://www.uwc.ac.za/', primary: true },
      { label: 'Psychology Department', url: 'https://www.uwc.ac.za/faculties/faculty-of-community-and-health-sciences/departments/psychology' }
    ]
  },
  {
    id: 'omni',
    name: 'Omni Wellness Media',
    shortName: 'Omni',
    tagline: 'Where Wellness Meets Media',
    icon: Film,
    color: 'from-primary to-secondary',
    bgColor: 'bg-primary/5 dark:bg-primary/10',
    heroImage: images.mediaProduction,
    gallery: [images.mediaProduction],
    story: `Omni Wellness Media is a conscious content company bridging wellness, outreach, and media to empower South Africa's journey to health and consciousness. With expertise in documentary production, biometric research technology, and community storytelling, Omni brings the technical and creative infrastructure that makes this programme possible.`,
    roleInProgramme: `As **Programme Coordinator**, Omni handles all operational logistics, manages enrollment, provides biometric data collection technology, and documents your journey through professional media production. Chad Cupido's PhD research is directly informed by student discoveries, ensuring your work contributes to academic advancement.`,
    stats: [
      { value: '500+', label: 'Hours Documented' },
      { value: '10+', label: 'Biometric Devices' },
      { value: '3', label: 'Research Papers' }
    ],
    keyPeople: [
      { name: 'Chad Cupido', role: 'Head of Media & Research Partner' }
    ],
    website: '/',
    ctas: [
      { label: 'About Omni', url: '/', primary: true },
      { label: 'Partner With Us', url: '/contact' }
    ]
  }
];

const UWCHumanAnimalProgram = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number>(0);
  const [activePartner, setActivePartner] = useState('carthorse');

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > window.innerHeight - 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroGallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'partners', label: 'Our Partners' },
    { id: 'journey', label: 'Your Journey' },
    { id: 'destination', label: 'Cape Town' },
    { id: 'guides', label: 'Your Guides' },
    { id: 'pricing', label: 'Investment' },
    { id: 'apply', label: 'Apply Now' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  };

  const journeyPhases = [
    {
      phase: "Weeks 1-2",
      title: "Arrival & Foundation",
      subtitle: "Land, breathe, and begin your transformation",
      location: "UWC Campus & TUFCAT Sanctuary",
      image: images.accommodation,
      description: "Your journey begins as you touch down in Cape Town. After settling into your accommodation at TUFCAT's peaceful sanctuary, you'll join an opening ceremony that honors the land and welcomes you into our learning community. These first weeks are about grounding—learning the foundational theories while your body and mind adjust to this new rhythm of life.",
      highlights: ["Welcome ceremony with indigenous blessing", "First encounters with sanctuary animals", "Biometric device setup & baseline measurements", "Evening fireside discussions under African stars"]
    },
    {
      phase: "Weeks 3-4",
      title: "Into the Field",
      subtitle: "Meet the horses that will teach you empathy",
      location: "Cart Horse Protection Association",
      image: images.cartHorse1,
      description: "Step into the world of working horses and the compassionate handlers who care for them. In the dusty township streets of Cape Town's Cape Flats, you'll discover how the bond between human and horse reveals profound truths about stress, resilience, and healing. This isn't observation—it's participation. You'll collect real data that contributes to global research.",
      highlights: ["Daily field visits to Cart Horse communities", "Handler interviews and relationship mapping", "Biometric data collection in real-world settings", "Community lunches with local families"]
    },
    {
      phase: "Weeks 5-6",
      title: "Sanctuary Immersion",
      subtitle: "Where healing happens naturally",
      location: "TUFCAT Farm & Sanctuary",
      image: images.tufcat1,
      description: "Immerse yourself in the daily rhythms of sanctuary life. Wake with the animals, tend the gardens, and discover how therapeutic interactions unfold organically. You'll learn sustainable farming practices while deepening your understanding of trauma-informed animal care.",
      highlights: ["Daily animal care routines", "Therapeutic interaction facilitation", "Organic farming & permaculture workshops", "Sunset meditation with rescue animals"]
    },
    {
      phase: "Weeks 7-8",
      title: "Community Integration",
      subtitle: "Where ancient wisdom meets modern research",
      location: "Valley of Plenty, Hanover Park",
      image: images.community,
      description: "Enter the heart of community wellness in Hanover Park. Work alongside local practitioners learning Indigenous Knowledge Systems that have sustained communities for generations. Plant gardens, share meals, and understand how wellness interventions can transform lives.",
      highlights: ["Community placement in urban gardens", "Traditional healing practices observation", "Food security & urban farming projects", "Community wellness programme participation"]
    },
    {
      phase: "Weeks 9-10",
      title: "Research & Celebration",
      subtitle: "Share your discoveries with the world",
      location: "UWC Campus",
      image: images.volunteer,
      description: "Synthesize your experiences into meaningful research. With expert guidance, craft your findings into a paper worthy of publication. Present to faculty, fellow students, and community partners. Celebrate your transformation at the graduation ceremony—you'll leave as a changed person, ready to change the world.",
      highlights: ["Research paper development & mentorship", "Oral presentation preparation", "Professional networking events", "Certificate ceremony & graduation celebration"]
    }
  ];

  const facilitators = [
    {
      name: "Prof. Sharyn Spicer",
      role: "Your Academic Anchor",
      quote: "I've spent 30 years studying how communities heal. This programme is where all that learning comes alive—and I can't wait to see what you discover.",
      expertise: ["Research Methodology", "Community Psychology", "Participatory Methods"],
      funFact: "Ask her about the time a horse taught her more about psychology than any textbook"
    },
    {
      name: "Chad Cupido",
      role: "Your Research Partner",
      quote: "Every morning with the animals teaches me something new. My PhD research is directly shaped by what students discover—you'll be contributing to real science.",
      expertise: ["Biometric Systems", "Human-Animal Bond", "Media Documentation"],
      funFact: "He's filmed over 500 hours of animal interactions and still gets emotional"
    },
    {
      name: "Dr. Megan White",
      role: "Your Field Guide",
      quote: "The horses have a way of showing us who we really are. Are you ready to meet yourself?",
      expertise: ["Equine Welfare", "Working Animals", "Handler Support"],
      funFact: "She's been called the 'Horse Whisperer of Cape Town' by colleagues"
    },
    {
      name: "Wendy Walton",
      role: "Your Community Bridge",
      quote: "Hanover Park isn't just where I work—it's where my heart lives. Welcome to my community.",
      expertise: ["Indigenous Knowledge", "Urban Agriculture", "Community Healing"],
      funFact: "Her urban gardens have fed over 500 families this year alone"
    }
  ];

  const faqs = [
    { question: "Is this programme accredited?", answer: "Yes! This is a University of the Western Cape Short Course aligned to NQF Level 7-8, carrying 10 SAQA credits. You'll receive a UWC certificate recognized by South African Qualifications Authority." },
    { question: "Can international students apply?", answer: "Absolutely! We welcome global participants. International students need a valid passport and may require a study visa (we provide documentation). The fee includes accommodation and meals, making budgeting straightforward." },
    { question: "What accommodation is provided?", answer: "Students stay at TUFCAT Field Station in comfortable shared rooms within a trauma-informed, wellness-focused environment. Campus-based accommodation is arranged for opening and closing weeks. All included in your fee!" },
    { question: "Is financial aid available?", answer: "Partial bursaries may be available for qualifying South African students. We're actively seeking funding partnerships to support students from underserved communities. International students should explore home institution funding." },
    { question: "Do I need animal experience?", answer: "No prior animal experience required! We provide comprehensive training in animal handling, welfare assessment, and therapeutic interaction. What matters most is your willingness to learn and engage respectfully." },
    { question: "What research output can I expect?", answer: "You'll produce a substantial research paper (3,000-5,000 words) suitable for peer-reviewed publication. Outstanding papers receive faculty co-authorship support. All students contribute to our HABRI-funded longitudinal project." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Immersive Hero Section */}
      <section className="relative h-screen overflow-hidden bg-black">
        {heroGallery.map((img, idx) => (
          <img 
            key={idx}
            src={img}
            alt="Programme experience"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        
        <div className="relative z-10 container mx-auto h-full flex flex-col justify-end pb-16 px-4">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-white/20 backdrop-blur text-white border-0 px-4 py-1.5">
                <Plane className="w-3.5 h-3.5 mr-2" />
                Wellness Study Abroad
              </Badge>
              <Badge className="bg-primary/90 text-primary-foreground border-0 px-4 py-1.5">
                June 2026 • 10 Weeks
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white leading-[1.1]">
              Where Research<br/>Meets <span className="text-primary">Transformation</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl font-light leading-relaxed">
              A life-changing 10-week journey into Animal-Assisted Therapy, Indigenous Wisdom, 
              and African Wellness in beautiful Cape Town, South Africa.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: MapPin, label: "Cape Town, SA" },
                { icon: Calendar, label: "June 2026" },
                { icon: Clock, label: "10 Weeks" },
                { icon: Award, label: "UWC Certified" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl">
                <Heart className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur">
                <Phone className="mr-2 h-5 w-5" />
                Book a Discovery Call
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </Button>
            </div>
          </div>

          {/* Hero Gallery Navigation */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {heroGallery.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === heroIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav className={`border-b border-border bg-background/95 backdrop-blur-sm z-50 transition-all ${isSticky ? 'fixed top-0 left-0 right-0 shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                    activeSection === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button size="sm" className="hidden md:flex bg-primary hover:bg-primary/90">
              Apply Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Quick Stats Banner */}
      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: "R70,000", label: "All-Inclusive" },
              { value: "10 Weeks", label: "Full Immersion" },
              { value: "20-25", label: "Cohort Size" },
              { value: "3 Sites", label: "Field Locations" },
              { value: "10 Credits", label: "SAQA Accredited" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                More Than a Course
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                This Is Your Transformation
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Imagine waking up on a 7-hectare sanctuary, surrounded by rescued animals, in one of the 
                world's most beautiful cities. This isn't just education—it's a journey that will change 
                how you see yourself, your work, and your impact on the world.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {[
                { 
                  icon: GraduationCap, 
                  title: "For Students", 
                  description: "Gain hands-on research experience while contributing to groundbreaking AAT studies. Perfect for those seeking specialization in this emerging field.",
                  highlight: "UWC-certified qualification"
                },
                { 
                  icon: Briefcase, 
                  title: "For Professionals", 
                  description: "Enhance your practice with specialized AAT training. Ideal for psychologists, social workers, counsellors, and animal welfare practitioners.",
                  highlight: "CPD-accredited content"
                },
                { 
                  icon: Globe, 
                  title: "For Global Seekers", 
                  description: "Experience African wellness traditions while conducting research in a unique post-apartheid context. Build international networks.",
                  highlight: "Study abroad experience"
                }
              ].map((item, idx) => (
                <Card key={idx} className="border-border hover:shadow-xl hover:border-primary/30 transition-all group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-xs">
                      {item.highlight}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Programme Features */}
            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-3xl p-8 md:p-12 border border-border">
              <h3 className="text-2xl font-bold text-center mb-8 text-foreground">What Makes This Programme Unique</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Heart, title: "Real Research", desc: "Contribute to HABRI-funded studies" },
                  { icon: Leaf, title: "Indigenous Wisdom", desc: "Learn African healing traditions" },
                  { icon: Home, title: "Full Immersion", desc: "Live on a working sanctuary" },
                  { icon: Award, title: "Publication Ready", desc: "Graduate with publishable research" }
                ].map((feature, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section id="partners" className="py-24 bg-muted/30 scroll-mt-20 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Handshake className="w-3.5 h-3.5 mr-2" />
              The Partnership
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Five Partners, One Vision
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              This programme brings together leading organizations in animal welfare, community development, 
              academic research, and conscious media to create an unprecedented learning experience.
            </p>
          </div>

          {/* Partner Logo Trust Bar */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16 py-8 border-y border-border">
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => {
                  setActivePartner(partner.id);
                  document.getElementById('partner-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                  activePartner === partner.id 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-background border border-border hover:border-primary/30 hover:shadow-md'
                }`}
              >
                <partner.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{partner.shortName}</span>
              </button>
            ))}
          </div>

          {/* Journey Map Visual */}
          <div className="max-w-5xl mx-auto mb-16">
            <h3 className="text-xl font-bold text-center mb-8 text-foreground">Your Journey Through Our Partners</h3>
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-violet-500 via-green-500 via-blue-500 to-primary transform -translate-y-1/2 rounded-full opacity-30" />
              
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { partner: partners[3], weeks: 'Weeks 1-2', label: 'Foundation' },
                  { partner: partners[0], weeks: 'Weeks 3-4', label: 'Field Research' },
                  { partner: partners[1], weeks: 'Weeks 5-6', label: 'Sanctuary Life' },
                  { partner: partners[2], weeks: 'Weeks 7-8', label: 'Community' },
                  { partner: partners[3], weeks: 'Weeks 9-10', label: 'Graduation' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="relative text-center group cursor-pointer"
                    onClick={() => setActivePartner(item.partner.id)}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${item.partner.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                      <item.partner.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="mb-2 bg-background border-border text-xs">{item.weeks}</Badge>
                    <p className="font-semibold text-foreground text-sm">{item.partner.shortName}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partner Tabs Content */}
          <div id="partner-tabs" className="scroll-mt-24">
            <Tabs value={activePartner} onValueChange={setActivePartner} className="w-full">
              <TabsList className="w-full flex-wrap h-auto p-2 bg-background border border-border rounded-2xl mb-8">
                {partners.map((partner) => (
                  <TabsTrigger 
                    key={partner.id} 
                    value={partner.id}
                    className="flex-1 min-w-[140px] py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl"
                  >
                    <partner.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{partner.shortName}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {partners.map((partner) => (
                <TabsContent key={partner.id} value={partner.id} className="mt-0">
                  <div className={`${partner.bgColor} rounded-3xl overflow-hidden border border-border`}>
                    {/* Partner Hero */}
                    <div className="relative h-64 md:h-96">
                      <img 
                        src={partner.heroImage} 
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${partner.color} flex items-center justify-center shadow-lg`}>
                            <partner.icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white">{partner.name}</h3>
                            <p className="text-white/80 font-medium">{partner.tagline}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partner Content */}
                    <div className="p-8 md:p-12">
                      <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Story */}
                        <div className="lg:col-span-2 space-y-6">
                          <div>
                            <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                              <Heart className="w-5 h-5 text-primary" />
                              The Story
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">{partner.story}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5 text-primary" />
                              Role in Your Journey
                            </h4>
                            <p className="text-muted-foreground leading-relaxed" 
                               dangerouslySetInnerHTML={{ __html: partner.roleInProgramme.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') }} 
                            />
                          </div>

                          {/* Image Gallery */}
                          {partner.gallery.length > 1 && (
                            <div className="grid grid-cols-3 gap-3">
                              {partner.gallery.slice(0, 3).map((img, idx) => (
                                <img 
                                  key={idx}
                                  src={img} 
                                  alt={`${partner.name} gallery ${idx + 1}`}
                                  className="w-full aspect-square object-cover rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                          {/* Impact Stats */}
                          <Card className="border-border">
                            <CardContent className="p-6">
                              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Impact
                              </h4>
                              <div className="space-y-4">
                                {partner.stats.map((stat, idx) => (
                                  <div key={idx} className="text-center p-3 bg-muted/50 rounded-xl">
                                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Key People */}
                          <Card className="border-border">
                            <CardContent className="p-6">
                              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Your Contact
                              </h4>
                              {partner.keyPeople.map((person, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-bold">
                                      {person.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">{person.name}</p>
                                    <p className="text-sm text-muted-foreground">{person.role}</p>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>

                          {/* CTAs */}
                          <div className="space-y-3">
                            {partner.ctas.map((cta, idx) => (
                              <Button 
                                key={idx}
                                variant={cta.primary ? "default" : "outline"}
                                className="w-full"
                                asChild
                              >
                                <a href={cta.url} target={cta.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {cta.label}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Combined Impact Stats */}
          <div className="mt-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-3xl p-8 md:p-12 border border-border">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">The Power of Partnership</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '50+', label: 'Years Combined Experience' },
                { value: '8,000+', label: 'Animals Helped Annually' },
                { value: '2,500+', label: 'Community Members Served' },
                { value: '5', label: 'World-Class Organizations' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Partnership Quote */}
            <div className="mt-12 text-center max-w-3xl mx-auto">
              <blockquote className="text-lg md:text-xl italic text-muted-foreground leading-relaxed">
                "When organizations unite around a shared vision of healing—for animals, communities, and 
                the humans who connect them—something magical happens. This programme is proof that 
                collaboration creates transformation."
              </blockquote>
              <p className="mt-4 font-semibold text-foreground">— Prof. Sharyn Spicer, Academic Director</p>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Interested in becoming a programme partner?</p>
            <Button variant="outline" size="lg" className="rounded-xl">
              <Handshake className="mr-2 h-5 w-5" />
              Partnership Enquiries
            </Button>
          </div>
        </div>
      </section>

      {/* Destination Section - Cape Town */}
      <section id="destination" className="py-24 bg-muted/30 scroll-mt-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <MapPin className="w-3.5 h-3.5 mr-2" />
              Your Study Abroad Destination
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Experience Cape Town
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Where mountain meets ocean, and ancient wisdom meets cutting-edge research
            </p>
          </div>

          {/* Image Collage */}
          <div className="grid grid-cols-4 gap-3 max-w-6xl mx-auto mb-12">
            <img src={images.tableMountain} alt="Table Mountain" className="col-span-2 row-span-2 w-full h-full object-cover rounded-2xl shadow-lg" />
            <img src={images.coastline} alt="Cape coastline" className="w-full aspect-square object-cover rounded-2xl shadow-lg" />
            <img src={images.fieldwork1} alt="Fieldwork" className="w-full aspect-square object-cover rounded-2xl shadow-lg" />
            <img src={images.winelands} alt="Cape Winelands" className="w-full aspect-square object-cover rounded-2xl shadow-lg" />
            <img src={images.cartHorse1} alt="Cart Horse work" className="w-full aspect-square object-cover rounded-2xl shadow-lg" />
          </div>

          {/* Destination Highlights */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Mountain, title: "Table Mountain", desc: "World Heritage Site in your backyard" },
              { icon: Sun, title: "Winter Sun", desc: "15-22°C during your June-August stay" },
              { icon: Waves, title: "Coastal Beauty", desc: "Muizenberg beach just 20 minutes away" },
              { icon: TreePine, title: "Wine Country", desc: "Weekend vineyard excursions included" }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Wellness Journey */}
      <section id="journey" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              Your 10-Week Transformation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The Journey Awaits
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From arrival to graduation, every moment is designed for your growth
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-24">
            {journeyPhases.map((phase, idx) => (
              <div key={idx} className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative">
                    <img 
                      src={phase.image}
                      alt={phase.title}
                      className="w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
                        {phase.phase}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{phase.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-lg text-primary font-medium mb-4">{phase.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">{phase.description}</p>
                  <div className="space-y-3">
                    {phase.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your Guides */}
      <section id="guides" className="py-24 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Users className="w-3.5 h-3.5 mr-2" />
              Meet Your Guides
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The People Who'll Walk Beside You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than instructors—they're mentors, guides, and fellow seekers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {facilitators.map((person, idx) => (
              <Card key={idx} className="border-border hover:shadow-xl transition-all overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xl">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">{person.name}</h4>
                      <p className="text-primary font-medium">{person.role}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-muted-foreground italic mb-6 pl-4 border-l-2 border-primary/30">
                    "{person.quote}"
                  </blockquote>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {person.expertise.map((exp, i) => (
                      <Badge key={i} variant="outline" className="bg-muted/50 text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
                    {person.funFact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-xl">
              <Video className="mr-2 h-5 w-5" />
              Watch Our Team Introduction Video
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <DollarSign className="w-3.5 h-3.5 mr-2" />
              Your Investment
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pricing That Works For You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All-inclusive packages designed for different needs and budgets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Early Bird */}
            <Card className="border-border hover:shadow-xl transition-all relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-500 text-white border-0 px-4">Save R7,000</Badge>
              </div>
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-bold text-foreground mb-1">Early Bird</h3>
                <p className="text-sm text-muted-foreground mb-6">Apply by Dec 2025</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">R63,000</span>
                  <span className="text-muted-foreground ml-2">≈ $3,400 USD</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Everything in Full Programme", "Priority cohort placement", "Pre-programme mentorship call", "Welcome gift pack"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">Apply Early</Button>
                <p className="text-xs text-center text-muted-foreground mt-3">Deadline: 31 December 2025</p>
              </CardContent>
            </Card>

            {/* Full Programme - Featured */}
            <Card className="border-primary shadow-xl relative scale-105 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground border-0 px-4">Most Popular</Badge>
              </div>
              <CardContent className="p-8 pt-10">
                <h3 className="text-xl font-bold text-foreground mb-1">Full Programme</h3>
                <p className="text-sm text-muted-foreground mb-6">Individual Students</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">R70,000</span>
                  <span className="text-muted-foreground ml-2">≈ $3,800 USD</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["10 weeks accommodation at TUFCAT", "All meals (organic, farm-fresh)", "Field transport to all sites", "Biometric research equipment", "UWC certificate (10 SAQA credits)", "Publication support"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">Reserve Your Spot</Button>
              </CardContent>
            </Card>

            {/* University Partners */}
            <Card className="border-border hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-1">University Partners</h3>
                <p className="text-sm text-muted-foreground mb-6">Institutional Pricing</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">Custom</span>
                  <span className="text-muted-foreground block text-sm mt-1">Contact for group rates</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Custom cohort arrangements", "Credit transfer support", "Faculty exchange options", "Research collaboration", "Branded certificates"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  <Building className="mr-2 h-4 w-4" />
                  Partner With Us
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div className="bg-muted/50 rounded-3xl p-8 max-w-4xl mx-auto border border-border">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">Flexible Payment Options</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">R20,000</div>
                <div className="text-sm text-muted-foreground">Deposit to secure place</div>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">3 Installments</div>
                <div className="text-sm text-muted-foreground">Spread over 3 months</div>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">Bursaries</div>
                <div className="text-sm text-muted-foreground">Limited partial funding</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Everything Included in Your Investment</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: Home, label: "Accommodation", detail: "10 weeks" },
                { icon: Utensils, label: "All Meals", detail: "Farm-fresh organic" },
                { icon: Camera, label: "Equipment", detail: "Biometric devices" },
                { icon: Coffee, label: "Transport", detail: "All field sites" },
                { icon: BookOpen, label: "Materials", detail: "Full course pack" },
                { icon: Award, label: "Certificate", detail: "UWC accredited" }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="font-medium text-foreground text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Universities Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-1.5">
                <Building2 className="w-3.5 h-3.5 mr-2" />
                For Universities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Partner With Us</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Integrate this programme into your study abroad offerings, exchange programmes, 
                or postgraduate pathways. We provide full academic support, credit transfer 
                documentation, and custom cohort arrangements.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-blue-900 hover:bg-white/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download Partnership Prospectus
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Phone className="mr-2 h-4 w-4" />
                  Schedule Faculty Call
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Globe, title: "Study Abroad Ready" },
                { icon: Award, title: "Credit Transfer" },
                { icon: Users, title: "Custom Cohorts" },
                { icon: FileText, title: "Full Documentation" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Sponsors - With Embedded Proposal */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <Gift className="w-3.5 h-3.5 mr-2" />
              For Sponsors & Funders
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Invest in Future Change-Makers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support students from underserved communities to access this transformative experience. 
              Your sponsorship directly funds bursaries, equipment, and community impact.
            </p>
          </div>

          {/* Embedded Gamma Proposal */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-background rounded-2xl shadow-xl overflow-hidden border border-border">
              <div className="p-4 bg-muted/50 border-b border-border flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Research & Innovation Platform Proposal</span>
              </div>
              <iframe 
                src="https://gamma.app/embed/3lz7fc000368av4" 
                style={{ width: '100%', height: '500px' }}
                allow="fullscreen" 
                title="The Human-Animal Bond in Action: A UWC-Led Research and Innovation Platform"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              <Heart className="mr-2 h-5 w-5" />
              Sponsor a Student
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Building2 className="mr-2 h-5 w-5" />
              Corporate Partnership
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Download className="mr-2 h-5 w-5" />
              Download Funding Proposal
            </Button>
          </div>
        </div>
      </section>

      {/* Pre-Enrollment Section */}
      <section id="apply" className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground border-0 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Limited to 20-25 Students
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ready to Begin?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Applications for June 2026 are now open. Here's how to join us.
            </p>
          </div>

          {/* Application Steps */}
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
            {[
              { num: "1", title: "Express Interest", desc: "Fill out our quick form", active: true, cta: "Get Started" },
              { num: "2", title: "Book a Call", desc: "Speak with our team", active: false, cta: "Schedule" },
              { num: "3", title: "Apply", desc: "Submit your documents", active: false, cta: "Apply Now" },
              { num: "4", title: "Secure Your Spot", desc: "Pay deposit to confirm", active: false, cta: null }
            ].map((step, idx) => (
              <div key={idx} className={`p-6 rounded-2xl text-center transition-all ${step.active ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-background border border-border hover:shadow-md'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold ${step.active ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  {step.num}
                </div>
                <h3 className={`font-bold mb-2 ${step.active ? 'text-white' : 'text-foreground'}`}>{step.title}</h3>
                <p className={`text-sm mb-4 ${step.active ? 'text-white/80' : 'text-muted-foreground'}`}>{step.desc}</p>
                {step.cta && (
                  <Button size="sm" variant={step.active ? "secondary" : "outline"} className={step.active ? 'bg-white text-primary hover:bg-white/90' : ''}>
                    {step.cta} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-border shadow-xl">
              <CardContent className="p-8 md:p-12 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-3">Not sure if this is right for you?</h3>
                <p className="text-muted-foreground mb-8">
                  Book a free 20-minute discovery call with our team. No pressure, just conversation.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                    <Phone className="mr-2 h-5 w-5" />
                    Book a Discovery Call
                  </Button>
                  <Button size="lg" variant="outline" className="px-8">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Us a Question
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Or reach out directly: <a href="mailto:info@omniwellness.co.za" className="text-primary hover:underline">info@omniwellness.co.za</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
              <HelpCircle className="w-3.5 h-3.5 mr-2" />
              Common Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Collapsible key={idx} open={openFaq === idx} onOpenChange={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                  <CollapsibleTrigger className="w-full p-6 flex items-center justify-between text-left">
                    <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation Bar */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              { label: "University of the Western Cape", badge: "Academic Partner" },
              { label: "NQF Level 7-8", badge: "Academic Level" },
              { label: "10 SAQA Credits", badge: "Accredited" },
              { label: "HABRI", badge: "Research Partner" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="font-bold text-foreground">{item.label}</div>
                <Badge variant="outline" className="mt-1 text-xs">{item.badge}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your Transformation Starts Here
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join 20-25 extraordinary individuals on a journey that will change 
            how you see animals, communities, and yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg">
              <Heart className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
              <Download className="mr-2 h-5 w-5" />
              Download Prospectus
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCHumanAnimalProgram;
