import React, { useState } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Users, BookOpen, Award, GraduationCap, Heart, Building, Calendar, DollarSign, Target, ArrowLeft, Share2, ChevronRight } from 'lucide-react';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';
import { Link } from 'react-router-dom';

// Import generated images
import uwcHero from '@/assets/uwc-hero.jpg';
import uwcFieldwork from '@/assets/uwc-fieldwork.jpg';
import uwcCampus from '@/assets/uwc-campus.jpg';
import drSharynSpicer from '@/assets/dr-sharyn-spicer.jpg';

export default function UWCHumanAnimalProgram() {
  const [selectedImage, setSelectedImage] = useState(0);
  const heroImages = [uwcHero, uwcFieldwork, uwcCampus];

  const partners = [
    { name: 'UWC', logo: '🎓', role: 'Academic Institution' },
    { name: 'Beauty Without Cruelty SA', logo: '🐰', role: 'Animal Rights' },
    { name: 'Eduponics', logo: '🌱', role: 'Urban Farming' },
    { name: 'Gorachouqua Khoi Nation', logo: '🏔️', role: 'Indigenous Knowledge' },
    { name: 'Dr. Phil-afel Foundation', logo: '💚', role: 'Youth Development' },
    { name: 'TUFCAT Sanctuary', logo: '🐾', role: 'Animal Welfare' },
    { name: 'Soul Restoration Wellness', logo: '🧘', role: 'Holistic Health' },
    { name: 'Valley of Plenty', logo: '🌾', role: 'Community Farming' },
  ];

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section with Image Gallery */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">
        <img 
          src={heroImages[selectedImage]}
          alt="UWC Human-Animal Program"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        {/* Navigation Overlay */}
        <div className="absolute top-6 left-6 z-10">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              UWC Short Course • NQF Level 7-8 • Pilot January 2026
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Animals, Society & Violence Prevention in Post-Apartheid South Africa
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              University of the Western Cape Short Course
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-2xl">
              40 Contact Hours • 10 SAQA Credits • Research-Based Learning • Fieldwork Immersion
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Apply for Pilot Program
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Download Curriculum
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                selectedImage === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <BreadcrumbNav 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Programs', href: '/programs' },
            { label: 'UWC Human-Animal Program' }
          ]}
        />
      </div>

      {/* Research Question */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Core Research Question</h2>
            <p className="text-xl md:text-2xl text-muted-foreground italic mb-8 leading-relaxed">
              "Can healthy and cruelty-free human-animal relations lead to better food security 
              and violence prevention in post-apartheid South Africa?"
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This pioneering short course examines the intersection of animal welfare, social justice, 
              and community well-being through academic theory, practical fieldwork, and indigenous wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Program Structure</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <GraduationCap className="w-12 h-12 text-blue-600 mb-3" />
                  <CardTitle className="text-xl">Academic Rigor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>NQF Level 7-8 certification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>10 SAQA credits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>40 contact hours over 4 weeks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Research project component</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <Heart className="w-12 h-12 text-green-600 mb-3" />
                  <CardTitle className="text-xl">Fieldwork Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>TUFCAT sanctuary immersion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Gorachouqua community engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Valley of Plenty visits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Youth advocate workshops</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
                  <Users className="w-12 h-12 text-purple-600 mb-3" />
                  <CardTitle className="text-xl">Pilot Cohort</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>15-20 students (January 2026)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>4 scholarships for local students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Diverse backgrounds encouraged</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Alumni network access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 4-Week Curriculum */}
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">4-Week Curriculum Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Week 1: Theoretical Foundations (10 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Violence Prevention Frameworks</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Introduction to violence as a public health issue, intersectionality theory, 
                      and the Link between animal cruelty and interpersonal violence.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Food Security & Ethics</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Plant-based nutrition science, ethical food systems, and sustainable agriculture 
                      in the South African context.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Post-Apartheid Social Context</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Historical trauma, socio-economic inequality, and structural violence in contemporary SA.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Week 2: Applied Practice (10 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Animal Welfare Interventions</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Cruelty-free advocacy methods, community education strategies, and ethical leadership.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Workshop Facilitation Skills</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Training youth as advocates, designing age-appropriate curricula, and trauma-informed pedagogy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Urban Farming Practicum</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Hands-on experience with eduponics systems, permaculture design, and community food gardens.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Week 3: Fieldwork Immersion (15 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">TUFCAT Sanctuary Experience</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Multi-day immersion at The Urgent Force Cat sanctuary, observing rescue operations, 
                      rehabilitation protocols, and community outreach programs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Community Engagement</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Work directly with Valley of Plenty, Hanover Park youth, and Gorachouqua elders 
                      on real-world projects addressing food insecurity and violence prevention.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Indigenous Knowledge Systems</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Learning from Chief Kingsley about Khoi relationships with animals, land stewardship, 
                      and holistic well-being.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Week 4: Research & Integration (5 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Research Project Development</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Students design and begin implementation of original research addressing the 
                      core question in their chosen community context.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Presentation & Peer Review</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Share research proposals, receive feedback from faculty and partners, 
                      and refine methodologies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Action Planning</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Create personal action plans for continued advocacy, community involvement, 
                      and knowledge dissemination beyond the course.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty & Leadership */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Faculty & Leadership</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn from distinguished experts in animal welfare, psychology, and social justice
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Dr. Sharyn Spicer - Featured with Image */}
              <Card className="md:col-span-2 hover:shadow-xl transition-all">
                <CardContent className="pt-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-600/20">
                      <img 
                        src={drSharynSpicer}
                        alt="Dr. Sharyn Spicer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-2xl mb-2">Dr. Sharyn Spicer</h3>
                      <p className="text-base text-blue-600 mb-3 font-medium">Academic Director & Lead Facilitator</p>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        Academic oversight and research methodology guidance. Expert in violence prevention 
                        and social justice frameworks in post-apartheid contexts. Dr. Spicer brings decades 
                        of experience in interdisciplinary research and community-based interventions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Chad Cupido</h3>
                      <p className="text-sm text-green-600 mb-2 font-medium">Executive Director | Omni Wellness Media</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Program operations, media production, and community partnership coordination. 
                        Leads fieldwork experiences and conscious media documentation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Building className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Tumelo Ncube</h3>
                      <p className="text-sm text-purple-600 mb-2 font-medium">Operations Lead | Technical Systems</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Manages logistics, scheduling, and digital infrastructure. Ensures seamless 
                        coordination between academic institution, partners, and fieldwork sites.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Chief Kingsley</h3>
                      <p className="text-sm text-orange-600 mb-2 font-medium">Indigenous Protocols Advisor | Gorachouqua Nation</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Ensures culturally respectful engagement with Khoi traditions and sacred sites. 
                        Shares indigenous knowledge systems throughout the program.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Dr. Erika Lemmer</h3>
                      <p className="text-sm text-blue-600 mb-2 font-medium">Academic Supervisor</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Provides academic mentorship and research guidance to students throughout 
                        the program, with expertise in companion animal studies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Fieldwork Visual Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={uwcFieldwork}
                  alt="Fieldwork Experience"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Immersive Fieldwork Experience</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Experience hands-on learning in real community settings across Cape Town. Work directly 
                  with animal welfare organizations, urban farming initiatives, and indigenous communities 
                  to understand the practical applications of course concepts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-base">Multi-day sanctuary immersion at TUFCAT</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-base">Community engagement in Hanover Park and Valley of Plenty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-base">Indigenous knowledge sessions with Gorachouqua elders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Consortium */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Partner Consortium</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Collaborating with leading organizations in animal welfare and social development
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partners.map((partner, index) => (
                <Card key={index} className="hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-4xl mb-3">{partner.logo}</div>
                    <p className="font-medium text-sm mb-1">{partner.name}</p>
                    <p className="text-xs text-muted-foreground">{partner.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Campus Image */}
            <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={uwcCampus}
                alt="University of the Western Cape Campus"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Enrollment */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Investment & Enrollment</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Funding Needed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-green-600 mb-2">R180,000 Total</p>
                    <p className="text-sm text-muted-foreground">For pilot cohort of 15-20 students</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm">UWC Accreditation & Credits</span>
                      <span className="font-semibold">R90,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Local Student Scholarships (4)</span>
                      <span className="font-semibold">R40,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Fieldwork & Transport</span>
                      <span className="font-semibold">R25,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Materials & Documentation</span>
                      <span className="font-semibold">R15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Partner Stipends & Admin</span>
                      <span className="font-semibold">R10,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Pilot Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <p className="font-semibold">November 2025</p>
                        <p className="text-sm text-muted-foreground">Applications Open</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                      <div>
                        <p className="font-semibold">December 2025</p>
                        <p className="text-sm text-muted-foreground">Student Selection & Onboarding</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                      <div>
                        <p className="font-semibold">January 2026</p>
                        <p className="text-sm text-muted-foreground">Pilot Program Launch (4 weeks)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                      <div>
                        <p className="font-semibold">February 2026</p>
                        <p className="text-sm text-muted-foreground">Research Projects & Alumni Network</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Users className="mr-2 h-5 w-5" />
                Express Interest in Enrollment
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="mr-2 h-5 w-5" />
                Sponsor a Local Student
              </Button>
              <Button size="lg" variant="outline">
                <Building className="mr-2 h-5 w-5" />
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Gain</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your understanding and create lasting impact
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <Award className="w-12 h-12 text-blue-600 mb-3" />
                  <CardTitle className="text-xl">Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>UWC Short Course Certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>10 SAQA credits (NQF 7-8)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <span>Research project publication opportunity</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <Target className="w-12 h-12 text-green-600 mb-3" />
                  <CardTitle className="text-xl">Career Pathways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Animal welfare advocacy roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Community development positions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span>Violence prevention programming</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all">
                <CardHeader>
                  <Heart className="w-12 h-12 text-purple-600 mb-3" />
                  <CardTitle className="text-xl">Personal Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span>Expanded worldview and empathy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span>Indigenous wisdom integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span>Lifelong alumni network</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
