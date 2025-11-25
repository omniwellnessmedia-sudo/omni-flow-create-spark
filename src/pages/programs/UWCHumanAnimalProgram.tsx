import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Users, BookOpen, Award, GraduationCap, Heart, Building, Calendar, DollarSign, Target } from 'lucide-react';

export default function UWCHumanAnimalProgram() {
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
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <img 
          src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/community%20outing%202.jpg"
          alt="UWC Human-Animal Program"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 container mx-auto h-full flex items-center px-4">
          <div className="max-w-3xl text-white">
            <Badge className="mb-4 bg-blue-600/80 text-white border-white/30">NQF Level 7-8 | Pilot January 2026</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Animals, Society & Violence Prevention in Post-Apartheid South Africa
            </h1>
            <p className="text-xl mb-4 text-white/90">
              University of the Western Cape Short Course
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-2xl">
              40 Contact Hours | 10 SAQA Credits | Research-Based Learning | Fieldwork Immersion
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Apply for Pilot Program
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Download Curriculum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Research Question */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">Core Research Question</h2>
            <p className="text-xl text-muted-foreground italic mb-8">
              "Can healthy and cruelty-free human-animal relations lead to better food security 
              and violence prevention in post-apartheid South Africa?"
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              This pioneering short course examines the intersection of animal welfare, social justice, 
              and community well-being through academic theory, practical fieldwork, and indigenous wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Program Structure</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <GraduationCap className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>Academic Rigor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1" />
                      <span>NQF Level 7-8 certification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1" />
                      <span>10 SAQA credits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1" />
                      <span>40 contact hours over 4 weeks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 mt-1" />
                      <span>Research project component</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle>Fieldwork Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>TUFCAT sanctuary immersion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Gorachouqua community engagement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Valley of Plenty visits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Youth advocate workshops</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle>Pilot Cohort</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1" />
                      <span>15-20 students (January 2026)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1" />
                      <span>4 scholarships for local students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1" />
                      <span>Diverse backgrounds encouraged</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-purple-600 mt-1" />
                      <span>Alumni network access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 4-Week Curriculum */}
            <h3 className="text-2xl font-bold mb-6">4-Week Curriculum Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Week 1: Theoretical Foundations (10 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Violence Prevention Frameworks</h4>
                    <p className="text-muted-foreground">
                      Introduction to violence as a public health issue, intersectionality theory, 
                      and the Link between animal cruelty and interpersonal violence.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Food Security & Ethics</h4>
                    <p className="text-muted-foreground">
                      Plant-based nutrition science, ethical food systems, and sustainable agriculture 
                      in the South African context.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Post-Apartheid Social Context</h4>
                    <p className="text-muted-foreground">
                      Historical trauma, socio-economic inequality, and structural violence in contemporary SA.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Week 2: Applied Practice (10 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Animal Welfare Interventions</h4>
                    <p className="text-muted-foreground">
                      Cruelty-free advocacy methods, community education strategies, and ethical leadership.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Workshop Facilitation Skills</h4>
                    <p className="text-muted-foreground">
                      Training youth as advocates, designing age-appropriate curricula, and trauma-informed pedagogy.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Urban Farming Practicum</h4>
                    <p className="text-muted-foreground">
                      Hands-on experience with eduponics systems, permaculture design, and community food gardens.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Week 3: Fieldwork Immersion (15 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">TUFCAT Sanctuary Experience</h4>
                    <p className="text-muted-foreground">
                      Multi-day immersion at The Urgent Force Cat sanctuary, observing rescue operations, 
                      rehabilitation protocols, and community outreach programs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Community Engagement</h4>
                    <p className="text-muted-foreground">
                      Work directly with Valley of Plenty, Hanover Park youth, and Gorachouqua elders 
                      on real-world projects addressing food insecurity and violence prevention.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Indigenous Knowledge Systems</h4>
                    <p className="text-muted-foreground">
                      Learning from Chief Kingsley about Khoi relationships with animals, land stewardship, 
                      and holistic well-being.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Week 4: Research & Integration (5 hours)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Research Project Development</h4>
                    <p className="text-muted-foreground">
                      Students design and begin implementation of original research addressing the 
                      core question in their chosen community context.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Presentation & Peer Review</h4>
                    <p className="text-muted-foreground">
                      Share research proposals, receive feedback from faculty and partners, 
                      and refine methodologies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Action Planning</h4>
                    <p className="text-muted-foreground">
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Program Faculty & Leadership</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Dr. Sharyn Spicer</h3>
                      <p className="text-sm text-muted-foreground mb-2">Academic Director | UWC Faculty</p>
                      <p className="text-sm">
                        Academic oversight and research methodology guidance. Expert in violence prevention 
                        and social justice frameworks in post-apartheid contexts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Chad Cupido</h3>
                      <p className="text-sm text-muted-foreground mb-2">Executive Director | Omni Wellness Media</p>
                      <p className="text-sm">
                        Program operations, media production, and community partnership coordination. 
                        Leads fieldwork experiences and conscious media documentation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Building className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Tumelo Ncube</h3>
                      <p className="text-sm text-muted-foreground mb-2">Operations Lead | Technical Systems</p>
                      <p className="text-sm">
                        Manages logistics, scheduling, and digital infrastructure. Ensures seamless 
                        coordination between academic institution, partners, and fieldwork sites.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Chief Kingsley</h3>
                      <p className="text-sm text-muted-foreground mb-2">Indigenous Protocols Advisor | Gorachouqua Nation</p>
                      <p className="text-sm">
                        Guides indigenous knowledge integration and ensures cultural protocols are 
                        respected throughout the program. Facilitates sacred land experiences.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Consortium */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Partner Consortium</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              This program is made possible through collaboration with leading organizations 
              in animal welfare, indigenous rights, youth development, and sustainable agriculture.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {partners.map((partner) => (
                <Card key={partner.name} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-3">{partner.logo}</div>
                    <h3 className="font-semibold text-sm mb-1">{partner.name}</h3>
                    <p className="text-xs text-muted-foreground">{partner.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Enrollment */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Program Investment & Funding</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <DollarSign className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle>Pilot Program Funding Need</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-4">R900,000</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Total funding required to launch the January 2026 pilot cohort with 15-20 students, 
                    including scholarships, fieldwork costs, and research support.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>4 full scholarships for local students</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Transportation to fieldwork sites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Materials & research resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-1" />
                      <span>Faculty compensation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Calendar className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>Pilot Launch Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">Applications Open: October 2025</h4>
                      <p className="text-muted-foreground">
                        Application process begins with essays and video submissions
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Selection Announced: November 2025</h4>
                      <p className="text-muted-foreground">
                        15-20 students selected for pilot cohort
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Orientation: December 2025</h4>
                      <p className="text-muted-foreground">
                        Pre-course materials and community introductions
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Program Launch: January 2026</h4>
                      <p className="text-muted-foreground">
                        4-week intensive begins at UWC
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-blue-600/20 bg-gradient-to-br from-blue-50/50 to-white">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Join the Pilot Cohort?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Applications will open in October 2025. Express your interest now to receive 
                  application materials and program updates.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Express Interest
                  </Button>
                  <Button size="lg" variant="outline">
                    Download Full Prospectus
                  </Button>
                  <Button size="lg" variant="outline">
                    Corporate Sponsorship Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Expected Outcomes */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What You'll Gain</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Award className="w-10 h-10 text-yellow-600 mb-2" />
                  <CardTitle className="text-lg">Academic Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• UWC certificate</li>
                    <li>• 10 SAQA credits</li>
                    <li>• Research portfolio</li>
                    <li>• Professional references</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Career Pathways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Animal welfare advocacy</li>
                    <li>• Community development</li>
                    <li>• Violence prevention programs</li>
                    <li>• Sustainable agriculture</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="w-10 h-10 text-red-500 mb-2" />
                  <CardTitle className="text-lg">Personal Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Indigenous wisdom integration</li>
                    <li>• Leadership development</li>
                    <li>• Community connections</li>
                    <li>• Ethical frameworks</li>
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
