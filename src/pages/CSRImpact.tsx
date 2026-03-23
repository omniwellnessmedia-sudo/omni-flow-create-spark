import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, Leaf, BookOpen, Sprout, Award, TrendingUp } from 'lucide-react';
import { useSEO } from '@/lib/seo';

export default function CSRImpact() {
  useSEO({
    title: 'Community Impact | Dr. Phil-afel Foundation Partnership',
    description: 'Learn how Travel and Tours Cape Town partners with Dr. Phil-afel Foundation to create sustainable community development, education, and social justice initiatives in Cape Town.',
    keywords: ['CSR', 'community impact', 'sustainable development', 'Dr Phil-afel Foundation', 'Cape Town NGO'],
    url: window.location.href
  });

  return (
    <>
      <UnifiedNavigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-wellness-primary to-wellness-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Official CSR Partner</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Community Impact Through Dr. Phil-afel Foundation
            </h1>
            <p className="text-xl mb-8 text-white/90">
              20% of every tour booking directly supports sustainable community development, 
              education, and social justice initiatives in Cape Town's underserved communities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-wellness-primary hover:bg-white/90">
                Make a Donation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View 2025 Action Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">About Dr. Phil-afel Foundation</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Established in 2022, the Dr. Phil-afel Foundation NPC is a catalyst for sustainable change, 
              community upliftment, and social justice in South Africa's most vulnerable communities.
            </p>
            <div className="bg-muted/50 p-6 rounded-lg space-y-2">
              <p><strong>Registration:</strong> NPC 2024/051687/08</p>
              <p><strong>Contact:</strong> admin@omniwellnessmedia.co.za | +27 74 831 5961</p>
              <p><strong>Banking:</strong> FNB Gold Business Account - 63093493509</p>
              <p className="text-sm text-muted-foreground mt-4">
                ✓ All donations are tax-deductible (Section 18A approved)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact Since 2022</h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="w-12 h-12 text-wellness-primary mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">100+</div>
                <p className="text-sm text-muted-foreground">Children impacted annually through education programs</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Youth trained as Beauty Without Cruelty Troopers</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Sprout className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">5+</div>
                <p className="text-sm text-muted-foreground">Urban community gardens established</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <div className="text-4xl font-bold mb-2">100s</div>
                <p className="text-sm text-muted-foreground">Plant-based meals distributed monthly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Active Programs & Initiatives</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <BookOpen className="w-10 h-10 text-wellness-primary mb-2" />
                <CardTitle>Early Childhood & Youth Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Comprehensive education programs providing literacy, numeracy, sports, and environmental 
                  activities to over 100 children annually in underserved Cape Town communities.
                </p>
                <Badge>SDG 4: Quality Education</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Gangster Reform Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Pioneering partnership with Kenneth Donson, former inmate turned certified life coach, 
                  to deliver transformative life coaching at Pollsmoor Prison.
                </p>
                <Badge>SDG 16: Peace & Justice</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Women's Empowerment Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Financial literacy workshops, entrepreneurship training, and leadership development 
                  empowering women to achieve economic independence.
                </p>
                <Badge>SDG 5: Gender Equality</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sprout className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>Urban Community Gardening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Establishing sustainable food sources through permaculture education, providing fresh 
                  produce while teaching regenerative agriculture techniques.
                </p>
                <Badge>SDG 2: Zero Hunger</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="w-10 h-10 text-green-500 mb-2" />
                <CardTitle>Plant-Based Nutrition Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  "Buy One, Feed One" program distributing hundreds of nutritious plant-based meals 
                  monthly while educating communities about sustainable nutrition.
                </p>
                <Badge>SDG 3: Good Health</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-10 h-10 text-yellow-600 mb-2" />
                <CardTitle>Beauty Without Cruelty Troopers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Training over 50 young advocates in animal rights activism, compassionate living, 
                  and ethical consumer education.
                </p>
                <Badge>SDG 15: Life on Land</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">UN Sustainable Development Goals Alignment</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { number: 1, title: 'No Poverty', color: 'bg-red-600' },
                { number: 2, title: 'Zero Hunger', color: 'bg-yellow-600' },
                { number: 4, title: 'Quality Education', color: 'bg-red-700' },
                { number: 11, title: 'Sustainable Cities', color: 'bg-orange-600' },
                { number: 15, title: 'Life on Land', color: 'bg-green-600' }
              ].map((sdg) => (
                <Card key={sdg.number} className={`${sdg.color} text-white`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-1">{sdg.number}</div>
                    <p className="text-xs">{sdg.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2025 Action Plan */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">2025 Strategic Action Plan</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-wellness-primary" />
                    <CardTitle>Expansion Priorities</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-wellness-primary">•</span>
                      <span>Scale educational programs to reach 200+ children annually</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-wellness-primary">•</span>
                      <span>Launch certified life coaching program at Pollsmoor Prison</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-wellness-primary">•</span>
                      <span>Establish 10 new urban community gardens</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-wellness-primary">•</span>
                      <span>Launch Women's Entrepreneurship Accelerator program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-wellness-primary">•</span>
                      <span>Expand Beauty Without Cruelty Troopers to 100 youth advocates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-wellness-primary">•</span>
                      <span>Hire dedicated accountant for financial transparency</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How Tours Contribute */}
      <section className="py-16 bg-gradient-to-br from-wellness-light/30 to-wellness-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">How Your Tour Booking Creates Impact</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-5xl font-bold text-wellness-primary mb-2">20%</div>
                  <p className="text-lg">of every booking goes directly to the foundation</p>
                </div>
                <div>
                  <div className="text-5xl font-bold text-wellness-accent mb-2">100%</div>
                  <p className="text-lg">transparent impact reporting</p>
                </div>
              </div>
              
              <div className="text-left space-y-4">
                <p className="font-semibold">Example: Ubuntu Immersion Tour ($3,999)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Your Investment:</span>
                    <span className="font-semibold">$3,999</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Community Contribution (20%):</span>
                    <span className="font-semibold text-wellness-primary">$800</span>
                  </li>
                  <li className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="text-sm text-muted-foreground">Funds 8 children's education for 1 month</span>
                  </li>
                </ul>
              </div>
            </div>

            <Button size="lg" className="bg-wellness-primary hover:bg-wellness-primary/90">
              Book a Transformative Journey
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
