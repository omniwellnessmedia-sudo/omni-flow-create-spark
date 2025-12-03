import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Sparkles,
  ChevronDown,
  FileText,
  Briefcase,
  ClipboardCheck,
  HelpCircle,
  ArrowRight,
  Download,
  Mail,
  Phone,
  Shield,
  TrendingUp,
  Lightbulb,
  Stethoscope,
  TreePine,
  HandHeart
} from 'lucide-react';

// Image URLs from Supabase storage
const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

const images = {
  hero: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20230905-WA0065.jpg`,
  cartHorse1: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/587383422_1285925536894677_4345595592711419953_n.jpg`,
  cartHorse2: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/574087632_1263656015788296_8646920016236566402_n.jpg`,
  cartHorse3: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/565941732_1251461607007737_6890680042161126307_n.jpg`,
  tufcat1: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/556100985_1378021790997566_6773851859108767885_n.jpg`,
  community: `${STORAGE_BASE}/%20community-images%20(Workshop%20Photos)/_MG_9481-2.jpg`,
  accommodation: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/547230382_1363593685773710_4169595945775668111_n.jpg`,
  kitchen: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/556098599_1378021897664222_4748312450378726214_n.jpg`,
  living: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/555728551_1378021847664227_1071983310888780042_n.jpg`,
  volunteer: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20230717-WA0065.jpg`,
  fieldwork1: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG-20221016-WA0017.jpg`,
  fieldwork2: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/IMG_20250729_124830.jpg`,
  workshop: `${STORAGE_BASE}/Tufcat%20and%20Carthorse/542040370_1353140630152349_287216765193985309_n.jpg`
};

const UWCHumanAnimalProgram = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setIsSticky(window.scrollY > heroHeight - 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'outcomes', label: 'Outcomes' },
    { id: 'careers', label: 'Careers' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'apply', label: 'Apply' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const programModules = [
    {
      phase: "Module 1: Week 1-2",
      title: "Foundations of Animal-Assisted Therapy",
      location: "UWC Campus & TUFCAT",
      icon: BookOpen,
      image: images.accommodation,
      academicContent: [
        "Theoretical frameworks: AAT, AAI, and One Health approaches",
        "History and evolution of human-animal bond research",
        "Research methodology and ethics in animal studies",
        "Introduction to biometric measurement (HRV, cortisol)",
        "South African context: Post-apartheid wellness challenges"
      ],
      practicalContent: [
        "Campus orientation and cohort bonding",
        "Biometric device calibration and baseline measurements",
        "Introduction to TUFCAT sanctuary operations",
        "Meet the animals: Initial therapeutic interactions"
      ],
      assessment: "Literature review assignment (2,000 words)",
      included: ["Accommodation", "All meals", "Course materials", "Biometric devices"]
    },
    {
      phase: "Module 2: Week 3-4",
      title: "Equine Welfare & Occupational Stress Research",
      location: "Cart Horse Protection Association",
      icon: Heart,
      image: images.cartHorse1,
      academicContent: [
        "Equine behaviour and welfare assessment protocols",
        "Occupational stress theory and measurement",
        "Handler-animal relationship dynamics",
        "Dual-benefit research methodology",
        "Working animal ethics and policy"
      ],
      practicalContent: [
        "Field placement at Cart Horse Protection",
        "Handler interviews and relationship observations",
        "Equine welfare assessments in community settings",
        "Biometric data collection from handlers and horses"
      ],
      assessment: "Field research report with biometric data analysis",
      included: ["Transport", "Field equipment", "Expert mentorship", "Community meals"]
    },
    {
      phase: "Module 3: Week 5-6",
      title: "Sanctuary Management & Therapeutic Interactions",
      location: "TUFCAT Farm & Sanctuary",
      icon: Leaf,
      image: images.tufcat1,
      academicContent: [
        "Animal sanctuary best practices and management",
        "Therapeutic animal selection and training",
        "Small animal behaviour and welfare",
        "Sustainable farming and permaculture integration",
        "Trauma-informed animal care approaches"
      ],
      practicalContent: [
        "Daily animal care routines and feeding",
        "Therapeutic interaction facilitation practice",
        "Sanctuary management shadowing",
        "Organic farming and permaculture workshops"
      ],
      assessment: "Therapeutic interaction design portfolio",
      included: ["Farm accommodation", "Organic meals", "Hands-on training"]
    },
    {
      phase: "Module 4: Week 7-8",
      title: "Community Integration & Indigenous Knowledge",
      location: "Valley of Plenty, Hanover Park",
      icon: Users,
      image: images.community,
      academicContent: [
        "Indigenous Knowledge Systems and African healing traditions",
        "Community-based participatory research methods",
        "Food security and urban agriculture",
        "Violence prevention through wellness interventions",
        "Decolonizing therapeutic frameworks"
      ],
      practicalContent: [
        "Community placement in Hanover Park",
        "Urban farming and food garden projects",
        "Traditional healing practices observation",
        "Community wellness programme participation"
      ],
      assessment: "Community case study with IKS integration",
      included: ["Community meals", "Cultural experiences", "Local guides", "Safety orientation"]
    },
    {
      phase: "Module 5: Week 9-10",
      title: "Research Synthesis & Professional Development",
      location: "UWC Campus",
      icon: Target,
      image: images.volunteer,
      academicContent: [
        "Data analysis: Quantitative and qualitative methods",
        "Research writing and publication standards",
        "Academic presentation skills",
        "Career development in AAT and related fields",
        "Research ethics and integrity"
      ],
      practicalContent: [
        "Biometric data interpretation workshops",
        "Individual research paper development",
        "Oral presentation preparation",
        "Professional networking events",
        "Certificate ceremony and graduation"
      ],
      assessment: "Final research paper (3,000-5,000 words) + Oral defence",
      included: ["Research support", "Publication guidance", "Networking", "Certificate"]
    }
  ];

  const entryRequirements = {
    academic: [
      "Honours degree (NQF Level 8) in Psychology, Social Work, Counselling, Education, or related health/social science field",
      "OR Bachelor's degree with minimum 3 years relevant professional experience",
      "Academic transcripts demonstrating research capability",
      "English language proficiency (IELTS 6.0 / TOEFL 80 or equivalent)"
    ],
    professional: [
      "Demonstrated interest in animal welfare and/or community development",
      "Clear criminal record (requirement for working with vulnerable populations)",
      "Valid passport for international applicants",
      "Medical fitness certificate for fieldwork participation"
    ],
    ideal: [
      "Mental health professionals seeking AAT specialization",
      "Animal welfare practitioners wanting therapeutic frameworks",
      "Community development workers expanding their toolkit",
      "International students seeking African-context research experience",
      "Educators developing trauma-informed approaches"
    ]
  };

  const learningOutcomes = [
    {
      icon: Brain,
      title: "Apply AAT Frameworks",
      description: "Design and implement Animal-Assisted Therapy interventions in diverse therapeutic settings"
    },
    {
      icon: TrendingUp,
      title: "Conduct Biometric Research",
      description: "Collect, analyse, and interpret HRV and cortisol data using validated research protocols"
    },
    {
      icon: Leaf,
      title: "Integrate Indigenous Knowledge",
      description: "Synthesize African wellness traditions with evidence-based therapeutic approaches"
    },
    {
      icon: Heart,
      title: "Assess Animal Welfare",
      description: "Evaluate animal welfare in therapeutic, working, and sanctuary contexts"
    },
    {
      icon: Users,
      title: "Design Community Programmes",
      description: "Develop sustainable, community-based intervention programmes"
    },
    {
      icon: FileText,
      title: "Contribute to Research",
      description: "Produce publishable academic research contributing to the AAT evidence base"
    },
    {
      icon: Lightbulb,
      title: "Lead with Empathy",
      description: "Demonstrate trauma-informed, conscious leadership in wellness contexts"
    },
    {
      icon: Globe,
      title: "Work Cross-Culturally",
      description: "Navigate diverse cultural contexts with sensitivity and competence"
    }
  ];

  const careerPathways = [
    {
      title: "Animal-Assisted Therapy Practitioner",
      settings: ["Private practice", "Rehabilitation centres", "Mental health facilities"],
      icon: HandHeart
    },
    {
      title: "Equine Welfare Officer",
      settings: ["Animal welfare organizations", "Working animal projects", "Sanctuaries"],
      icon: Heart
    },
    {
      title: "Community Development Specialist",
      settings: ["NGOs", "Government programmes", "International development"],
      icon: Users
    },
    {
      title: "Research Coordinator",
      settings: ["Universities", "Research institutions", "NGO research units"],
      icon: BookOpen
    },
    {
      title: "Mental Health Programme Developer",
      settings: ["Healthcare organizations", "Schools", "Corporate wellness"],
      icon: Brain
    },
    {
      title: "Wellness Tourism Facilitator",
      settings: ["Retreat centres", "Eco-lodges", "Tourism companies"],
      icon: TreePine
    }
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Expression of Interest",
      timeline: "Now - 31 March 2026",
      description: "Submit the online interest form to receive the full programme information pack and application materials.",
      action: "Express Interest"
    },
    {
      step: 2,
      title: "Application Submission",
      timeline: "By 31 March 2026",
      description: "Submit complete application including academic transcripts, CV, motivation letter (500 words), and two professional references.",
      action: "Download Application Form"
    },
    {
      step: 3,
      title: "Selection Interview",
      timeline: "April 2026",
      description: "30-minute video interview with the programme team to discuss your background, motivations, and fit with programme objectives.",
      action: null
    },
    {
      step: 4,
      title: "Acceptance & Deposit",
      timeline: "By 30 April 2026",
      description: "Successful applicants receive offer letters. R20,000 deposit required to secure your place in the cohort.",
      action: null
    },
    {
      step: 5,
      title: "Pre-Programme Preparation",
      timeline: "May 2026",
      description: "Receive reading list, logistics information, and pre-arrival orientation materials. Complete any visa requirements.",
      action: null
    },
    {
      step: 6,
      title: "Programme Commences",
      timeline: "June 2026",
      description: "Arrive at UWC Campus for orientation week. Your 10-week transformative journey begins.",
      action: null
    }
  ];

  const faqs = [
    {
      question: "Is this programme accredited?",
      answer: "Yes, this is a University of the Western Cape Short Course aligned to NQF Level 7-8, carrying 10 SAQA credits. Upon successful completion, you receive a UWC certificate recognized by South African Qualifications Authority. The programme also contributes toward potential future postgraduate study."
    },
    {
      question: "Can international students apply?",
      answer: "Absolutely! We welcome international students and have designed the programme with global participants in mind. International students will need a valid passport and may require a study visa (we provide supporting documentation). The programme fee is inclusive of accommodation and meals, making budgeting straightforward."
    },
    {
      question: "What accommodation is provided?",
      answer: "Students stay at TUFCAT Field Station during field placements, with comfortable shared rooms in a trauma-informed, wellness-focused environment. Campus-based accommodation is arranged for the first and final weeks. All accommodation is included in the programme fee."
    },
    {
      question: "Is financial aid or bursaries available?",
      answer: "Partial bursaries may be available for qualifying South African students. We are actively seeking funding partnerships to support students from underserved communities. International students should explore funding options through their home institutions or professional associations."
    },
    {
      question: "What is the daily schedule like?",
      answer: "Typical days include morning animal care or field activities (7:00-12:00), lunch and rest period (12:00-14:00), afternoon academic sessions (14:00-17:00), and evening reflection/personal time. Schedules vary by phase and location. Weekends include structured activities and free time."
    },
    {
      question: "Do I need prior experience with animals?",
      answer: "No prior animal experience is required, though it is beneficial. The programme includes comprehensive training in animal handling, welfare assessment, and therapeutic interaction. What's most important is your willingness to learn and engage with animals respectfully."
    },
    {
      question: "What research output can I expect?",
      answer: "Students produce a substantial research paper (3,000-5,000 words) suitable for submission to peer-reviewed journals. Outstanding papers will be supported for publication with faculty co-authorship. All students contribute data to our longitudinal HABRI-funded research project."
    },
    {
      question: "Is the fieldwork physically demanding?",
      answer: "Field placements involve moderate physical activity including walking, standing, and animal handling. You should be comfortable spending extended periods outdoors in varying weather conditions. Please disclose any physical limitations in your application so we can discuss accommodations."
    }
  ];

  const teamMembers = [
    {
      name: "Prof. Sharyn Spicer",
      role: "Academic Director",
      organization: "University of the Western Cape",
      bio: "Leading research methodology and academic standards. Expert in community psychology and participatory research approaches in post-apartheid South Africa."
    },
    {
      name: "Dr. Megan White",
      role: "Equine Welfare Lead",
      organization: "Cart Horse Protection Association",
      bio: "Over 20 years experience in working animal welfare. Specialist in handler-animal relationships and community-based equine welfare programmes."
    },
    {
      name: "Chad Cupido",
      role: "Research Design Lead",
      organization: "TUFCAT / Omni Wellness Media",
      bio: "PhD candidate in human-animal interaction. Leading research design, biometric data systems, and programme media documentation."
    },
    {
      name: "Leigh Tucker",
      role: "International Partnerships",
      organization: "UWC International Relations",
      bio: "Strategic partnerships and funder alignment specialist. Connecting the programme with global AAT research networks and funding bodies."
    },
    {
      name: "Wendy Walton",
      role: "Community Integration Lead",
      organization: "Valley of Plenty",
      bio: "Community zone coordinator with deep roots in Hanover Park. Expert in sustainable development and indigenous knowledge integration."
    },
    {
      name: "Tumelo Ncube",
      role: "Technology & Systems Lead",
      organization: "Omni Wellness Media",
      bio: "Biometric systems architect and data pipeline developer. Ensuring research data integrity and technological infrastructure."
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
    { icon: Home, label: "Accommodation", detail: "10 weeks included" },
    { icon: Utensils, label: "All Meals", detail: "Farm-fresh organic" },
    { icon: Camera, label: "Research Equipment", detail: "Biometric devices" },
    { icon: Coffee, label: "Field Transport", detail: "All site visits" },
    { icon: BookOpen, label: "Course Materials", detail: "All readings" },
    { icon: Award, label: "UWC Certificate", detail: "10 SAQA credits" }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number>(0);

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <img 
          src={images.hero}
          alt="Animal-Assisted Therapy research programme"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
        
        <div className="relative z-10 container mx-auto h-full flex items-end pb-16 px-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                <GraduationCap className="w-3 h-3 mr-1.5" />
                UWC Short Course
              </Badge>
              <Badge variant="outline" className="bg-background/80 backdrop-blur border-border">
                NQF Level 7-8 • 10 SAQA Credits
              </Badge>
              <Badge variant="outline" className="bg-background/80 backdrop-blur border-border">
                June 2026
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
              Animal-Assisted Therapy Research & African Wellness
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">
              A transformative 10-week immersive programme combining rigorous academic research 
              with hands-on experiential learning in Animal-Assisted Therapy, Indigenous Knowledge Systems, 
              and community wellness.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Heart className="mr-2 h-4 w-4" />
                Express Interest
              </Button>
              <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur border-border">
                <Download className="mr-2 h-4 w-4" />
                Download Prospectus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <nav className={`border-b border-border bg-background/95 backdrop-blur-sm z-40 transition-all ${isSticky ? 'sticky top-0 shadow-sm' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors ${
                  activeSection === item.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">R70,000</div>
              <div className="text-xs md:text-sm text-muted-foreground">All-Inclusive Fee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">10 Weeks</div>
              <div className="text-xs md:text-sm text-muted-foreground">Immersive Programme</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">NQF 7-8</div>
              <div className="text-xs md:text-sm text-muted-foreground">Academic Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">10</div>
              <div className="text-xs md:text-sm text-muted-foreground">SAQA Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">20-25</div>
              <div className="text-xs md:text-sm text-muted-foreground">Cohort Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">3</div>
              <div className="text-xs md:text-sm text-muted-foreground">Field Sites</div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Programme Overview
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Pioneering Research in Human-Animal Interaction
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  This groundbreaking programme offers a unique opportunity to engage in cutting-edge research 
                  while making a tangible impact on communities and animals. Delivered in partnership with 
                  the University of the Western Cape, TUFCAT Sanctuary, Cart Horse Protection Association, 
                  and Valley of Plenty, you'll gain both academic credentials and practical experience.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">For Students & Graduates</h4>
                      <p className="text-sm text-muted-foreground">Gain hands-on research experience while contributing to groundbreaking studies in AAT. Perfect for those seeking specialization in this emerging field.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">For Professionals</h4>
                      <p className="text-sm text-muted-foreground">Enhance your practice with specialized AAT training. Ideal for psychologists, social workers, counsellors, and animal welfare practitioners.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">For International Participants</h4>
                      <p className="text-sm text-muted-foreground">Experience African wellness traditions while conducting research in a unique post-apartheid context. Build global networks in the AAT field.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={images.fieldwork1}
                  alt="Fieldwork experience"
                  className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-2xl shadow-xl border border-border max-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">HABRI Funded</div>
                  </div>
                  <p className="text-xs text-muted-foreground">Contributing to global AAT research evidence</p>
                </div>
              </div>
            </div>

            {/* Core Research Question */}
            <div className="bg-muted/50 rounded-3xl p-8 md:p-12 text-center border border-border">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Target className="w-3 h-3 mr-1.5" />
                Core Research Question
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight">
                How can Animal-Assisted Therapy transform occupational wellness and violence prevention 
                in post-apartheid South Africa?
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Students participate as co-researchers, collecting biometric data and contributing to 
                longitudinal studies that will shape the future of AAT practice in Africa and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground">Five Core Academic Pillars</h2>
            <p className="text-muted-foreground mt-2">The interdisciplinary foundation of our programme</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {academicPillars.map((pillar, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-background border border-border hover:shadow-lg hover:border-primary/20 transition-all">
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

      {/* Curriculum Section */}
      <section id="curriculum" className="py-20 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Calendar className="w-3 h-3 mr-1.5" />
                10-Week Curriculum
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Programme Modules & Itinerary</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Each module combines theoretical foundations with practical field experience across our three partner sites
              </p>
            </div>
            
            <div className="space-y-4">
              {programModules.map((module, index) => (
                <Collapsible key={index} open={openModule === index} onOpenChange={() => setOpenModule(openModule === index ? -1 : index)}>
                  <div className="bg-muted/30 rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-colors">
                    <CollapsibleTrigger className="w-full">
                      <div className="grid md:grid-cols-4 items-center">
                        <div className="relative h-48 md:h-full md:min-h-[180px]">
                          <img 
                            src={module.image}
                            alt={module.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-background/90 backdrop-blur text-foreground border-0 font-semibold text-xs">
                              {module.phase}
                            </Badge>
                          </div>
                        </div>
                        <div className="md:col-span-3 p-6 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <module.icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-foreground">{module.title}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {module.location}
                                </p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openModule === index ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-6 pb-6 md:pl-[calc(25%+1.5rem)]">
                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-primary" />
                              Academic Content
                            </h4>
                            <ul className="space-y-2">
                              {module.academicContent.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Stethoscope className="w-4 h-4 text-primary" />
                              Practical Experience
                            </h4>
                            <ul className="space-y-2">
                              {module.practicalContent.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Assessment:</span>
                            <p className="text-sm font-medium text-foreground">{module.assessment}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {module.included.map((item, i) => (
                              <Badge key={i} variant="secondary" className="text-xs font-normal">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>

            {/* Assessment Summary */}
            <div className="mt-12 bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                Assessment Overview
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Continuous Assessment (60%)</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Weekly reflection journals</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Biometric data collection reports</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Field observation portfolios</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Group research presentations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Final Assessment (40%)</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Individual research paper (3,000-5,000 words)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Oral defence presentation</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Practical competency demonstration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Requirements */}
      <section id="requirements" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <FileText className="w-3 h-3 mr-1.5" />
                Admission Criteria
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Entry Requirements</h2>
              <p className="text-muted-foreground mt-3">
                Who should apply and what you need to join our programme
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    Academic Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {entryRequirements.academic.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    Professional Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {entryRequirements.professional.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-background rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Ideal Candidates
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {entryRequirements.ideal.map((candidate, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{candidate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section id="outcomes" className="py-20 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Target className="w-3 h-3 mr-1.5" />
                Programme Outcomes
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Learning Outcomes</h2>
              <p className="text-muted-foreground mt-3">
                Upon successful completion, you will be able to:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningOutcomes.map((outcome, index) => (
                <div key={index} className="p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/20 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <outcome.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{outcome.title}</h3>
                  <p className="text-sm text-muted-foreground">{outcome.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Prospects */}
      <section id="careers" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Briefcase className="w-3 h-3 mr-1.5" />
                Career Development
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Career Pathways</h2>
              <p className="text-muted-foreground mt-3">
                This programme opens doors to diverse career opportunities in growing fields
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerPathways.map((career, index) => (
                <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <career.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-3">{career.title}</h3>
                    <div className="space-y-1">
                      {career.settings.map((setting, i) => (
                        <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {setting}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-background rounded-2xl p-8 border border-border">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">Growing Field</div>
                  <p className="text-sm text-muted-foreground">AAT is one of the fastest-growing therapeutic modalities globally</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">First in Africa</div>
                  <p className="text-sm text-muted-foreground">Be among the first practitioners with African AAT research credentials</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">Publication Ready</div>
                  <p className="text-sm text-muted-foreground">Graduate with research suitable for peer-reviewed publication</p>
                </div>
              </div>
            </div>
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
                {["Equine welfare assessment protocols", "Handler-animal relationship research", "Working animal therapy models", "Community engagement expertise"].map((item, i) => (
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
                sustainable farming, and therapeutic animal interactions. The sanctuary houses rescued animals 
                central to our research and serves as the primary accommodation site.
              </p>
              <div className="space-y-3">
                {["Animal sanctuary management", "Therapeutic animal interactions", "Sustainable farming practices", "Student accommodation"].map((item, i) => (
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
                while learning Indigenous Knowledge Systems from local practitioners.
              </p>
              <div className="space-y-3">
                {["Urban permaculture training", "Community food security", "Indigenous Knowledge integration", "Grassroots development models"].map((item, i) => (
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

      {/* What's Included */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-center mb-8 text-foreground">What's Included in Your R70,000 Investment</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {whatsIncluded.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-3">
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

      {/* Accommodation Gallery */}
      <section className="py-20 bg-background">
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

      {/* Leadership Team */}
      <section id="faculty" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Award className="w-3 h-3 mr-1.5" />
                Leadership
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Programme Leadership Team</h2>
              <p className="text-muted-foreground mt-3">
                Expert faculty from academia, animal welfare, and community development
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-primary font-bold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground">{member.name}</h4>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.organization}</p>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section id="apply" className="py-20 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <ClipboardCheck className="w-3 h-3 mr-1.5" />
                How to Apply
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Application Process</h2>
              <p className="text-muted-foreground mt-3">
                Your journey to joining our programme in six clear steps
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
              
              <div className="space-y-6">
                {applicationSteps.map((step, index) => (
                  <div key={index} className="relative flex gap-6">
                    <div className="hidden md:flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold z-10 ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border text-foreground'
                      }`}>
                        {step.step}
                      </div>
                    </div>
                    <Card className="flex-1 border-border hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <Badge variant="outline" className="mb-2 text-xs">{step.timeline}</Badge>
                            <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                          </div>
                          {step.action && (
                            <Button variant={index === 0 ? "default" : "outline"} size="sm">
                              {step.action}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Funding */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1.5" />
                Investment
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Programme Investment</h2>
            </div>

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
                      <span className="text-muted-foreground">10 weeks accommodation at TUFCAT</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">All meals (organic, farm-fresh)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Field transport to all sites</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Biometric research equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">All course materials & readings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">UWC certificate (10 SAQA credits)</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Payment plan available:</strong> R20,000 deposit + 2 instalments of R25,000
                    </p>
                  </div>
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
                      <span className="text-muted-foreground">International research collaboration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Publication support for students</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Programme sustainability</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Contributing to global AAT evidence base</strong> through rigorous, peer-reviewed research
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <HelpCircle className="w-3 h-3 mr-1.5" />
                FAQs
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Collapsible key={index} open={openFaq === index} onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}>
                  <Card className="border-border">
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-6 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground text-left">{faq.question}</h3>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`} />
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="px-6 pb-6 pt-0">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation Bar */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">UWC Accredited</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-2">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">NQF Level 7-8</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">10 SAQA Credits</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-2">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">HABRI Research Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
              Express Interest Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Mail className="mr-2 h-5 w-5" />
              Contact Programme Team
            </Button>
          </div>
          <p className="text-sm opacity-70 mt-8">
            Questions? Email us at <span className="underline">uwc-aat@omniwellness.co.za</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCHumanAnimalProgram;
