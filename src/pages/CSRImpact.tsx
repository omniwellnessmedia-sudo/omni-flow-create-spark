import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, Leaf, BookOpen, Sprout, Award, TrendingUp, Globe, HandHeart, Shield, ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { useSEO } from '@/lib/seo';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

export default function CSRImpact() {
  useSEO({
    title: 'CSR Impact | Omni Wellness Media — Community-Driven Change',
    description: 'Discover how Omni Wellness Media and Dr. Phil-Afei Foundation drive sustainable community development, education, women empowerment, and conservation across Cape Town.',
    keywords: ['CSR', 'community impact', 'sustainable development', 'Dr Phil-Afei Foundation', 'Cape Town NGO', 'Omni Wellness Media'],
    url: window.location.href
  });

  const latestCampaigns = [
    {
      title: "Women's Empowerment Course — The Lookout",
      description: "Multi-week empowerment workshops equipping women with financial literacy, leadership skills, and entrepreneurship training at The Lookout, Muizenberg.",
      image: IMAGES.community.empowerment,
      badge: "Active Campaign",
      sdg: "SDG 5: Gender Equality",
    },
    {
      title: "Khoe Meisie Cultural Preservation",
      description: "Documenting and preserving indigenous Khoe heritage through community storytelling, cultural workshops, and artistic expression for future generations.",
      image: IMAGES.community.khoe,
      badge: "Cultural Heritage",
      sdg: "SDG 11: Sustainable Cities",
    },
    {
      title: "Beauty Without Cruelty Youth Troopers",
      description: "Training young advocates in animal rights activism, compassionate living, and ethical consumer education — expanding to 100 youth in 2026.",
      image: IMAGES.services.bwcCover,
      badge: "Youth Program",
      sdg: "SDG 15: Life on Land",
    },
    {
      title: "Landmark Foundation Rewilding Partnership",
      description: "Supporting predator conservation and rewilding efforts in the Western Cape through media production, awareness campaigns, and community education.",
      image: IMAGES.services.landmark,
      badge: "Conservation",
      sdg: "SDG 15: Life on Land",
    },
    {
      title: "Community Outreach & Feeding Program",
      description: "Ongoing community support providing essential resources, plant-based meals, and educational materials to families in underserved Cape Town neighborhoods.",
      image: IMAGES.wellness.communityProject1,
      badge: "Ongoing",
      sdg: "SDG 2: Zero Hunger",
    },
    {
      title: "Cart Horse Protection — Urban Wellness",
      description: "Partnering with Cart Horse Protection Association for animal welfare advocacy and community wellness programs in working-class neighborhoods.",
      image: IMAGES.services.chadBwc,
      badge: "Animal Welfare",
      sdg: "SDG 3: Good Health",
    },
  ];

  return (
    <>
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.community.empowerment2}
            alt="Community impact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Omni Wellness Media CSR</Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Creating Lasting Impact Through Conscious Action
            </h1>
            <p className="text-xl mb-8 text-white/85 leading-relaxed">
              Every tour booked, every story told, and every service delivered contributes to
              sustainable community development across Cape Town. In partnership with
              Dr. Phil-Afei Foundation NPC.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8" asChild>
                <a href="mailto:admin@omniwellnessmedia.co.za?subject=CSR Donation Inquiry">
                  <HandHeart className="mr-2 w-5 h-5" />
                  Make a Donation
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8" asChild>
                <Link to="/tours-retreats">
                  Book a Tour — 20% Goes to Impact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Impact Since 2022</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">Our Collective Impact</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, value: "200+", label: "Children impacted through education programs", color: "text-primary" },
              { icon: Users, value: "50+", label: "Youth trained as BWC Troopers", color: "text-blue-600" },
              { icon: Sprout, value: "5+", label: "Urban community gardens established", color: "text-green-600" },
              { icon: Heart, value: "500+", label: "Plant-based meals distributed monthly", color: "text-red-500" },
            ].map((stat) => (
              <Card key={stat.label} className="text-center border-0 shadow-md">
                <CardContent className="pt-6">
                  <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest CSR Campaigns — with images */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-3">Active Campaigns</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">Latest CSR Campaigns</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real programs creating measurable change in Cape Town communities — powered by your support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {latestCampaigns.map((campaign) => (
              <Card key={campaign.title} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{campaign.badge}</Badge>
                    <Badge variant="outline" className="text-xs">{campaign.sdg}</Badge>
                  </div>
                  <CardTitle className="font-heading text-lg">{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={IMAGES.partners.drPhil}
                  alt="Dr. Phil-Afei Foundation"
                  className="w-20 h-20 object-contain rounded-lg bg-white p-2 shadow-sm"
                />
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl">Dr. Phil-Afei Foundation</h2>
                  <p className="text-sm text-muted-foreground">NPC 2024/051687/08</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Established in 2022, Dr. Phil-Afei Foundation NPC is a catalyst for sustainable change,
                community upliftment, and social justice in South Africa's most vulnerable communities.
                As the official CSR partner of Travel and Tours Cape Town, the foundation receives
                20% of every tour booking.
              </p>
              <div className="bg-muted/50 p-5 rounded-lg space-y-2 text-sm">
                <p><strong>Contact:</strong> admin@omniwellnessmedia.co.za</p>
                <p><strong>Banking:</strong> FNB Gold Business Account — 63093493509</p>
                <p className="text-primary font-medium mt-3">
                  All donations are tax-deductible (Section 18A approved)
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={IMAGES.wellness.communityProject2}
                alt="Community outreach"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl mb-4">Active Programs & Initiatives</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: BookOpen, title: "Early Childhood & Youth Development", desc: "Literacy, numeracy, sports, and environmental activities for 200+ children annually.", badge: "SDG 4", color: "text-primary" },
              { icon: Shield, title: "Gangster Reform Program", desc: "Transformative life coaching at Pollsmoor Prison with certified former-inmate coaches.", badge: "SDG 16", color: "text-blue-600" },
              { icon: Heart, title: "Women's Empowerment", desc: "Financial literacy, entrepreneurship training, and leadership development workshops.", badge: "SDG 5", color: "text-purple-600" },
              { icon: Sprout, title: "Urban Community Gardening", desc: "Sustainable food sources through permaculture education and regenerative techniques.", badge: "SDG 2", color: "text-green-600" },
              { icon: Leaf, title: "Plant-Based Nutrition", desc: "'Buy One, Feed One' — distributing 500+ plant-based meals monthly.", badge: "SDG 3", color: "text-green-500" },
              { icon: Award, title: "BWC Youth Troopers", desc: "Training 50+ young advocates in animal rights, compassion, and ethical consumerism.", badge: "SDG 15", color: "text-yellow-600" },
            ].map((program) => (
              <Card key={program.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <program.icon className={`w-8 h-8 ${program.color}`} />
                    <Badge variant="outline" className="text-xs">{program.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{program.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">UN Sustainable Development Goals</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { number: 1, title: 'No Poverty', color: 'bg-red-600' },
                { number: 2, title: 'Zero Hunger', color: 'bg-yellow-600' },
                { number: 3, title: 'Good Health', color: 'bg-green-500' },
                { number: 4, title: 'Quality Education', color: 'bg-red-700' },
                { number: 5, title: 'Gender Equality', color: 'bg-orange-500' },
                { number: 11, title: 'Sustainable Cities', color: 'bg-orange-600' },
                { number: 15, title: 'Life on Land', color: 'bg-green-600' },
                { number: 16, title: 'Peace & Justice', color: 'bg-blue-700' },
              ].map((sdg) => (
                <Card key={sdg.number} className={`${sdg.color} text-white border-0`}>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold">{sdg.number}</div>
                    <p className="text-[10px] leading-tight mt-1">{sdg.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2026 Action Plan */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl mb-4">2026 Strategic Action Plan</h2>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <CardTitle>Growth & Expansion Priorities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Scale educational programs to 300+ children annually",
                    "Expand certified life coaching at Pollsmoor Prison",
                    "Establish 10 new urban community gardens",
                    "Launch Women's Entrepreneurship Accelerator",
                    "Grow BWC Troopers to 100 youth advocates",
                    "Partner with 5 new conservation organizations",
                    "Launch impact-tracking digital dashboard",
                    "Hire dedicated accountant for full transparency",
                  ].map((goal, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <span className="text-primary font-bold text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Tours Contribute */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={IMAGES.wellness.communityProject3}
                  alt="Tour impact"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="font-heading text-3xl mb-6">Your Booking Creates Change</h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">20%</div>
                    <p className="text-muted-foreground">of every booking goes directly to the foundation</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">100%</div>
                    <p className="text-muted-foreground">transparent impact reporting on every rand</p>
                  </div>
                </div>

                <div className="bg-muted/50 p-5 rounded-lg mb-6">
                  <p className="font-semibold mb-3">Example: Indigenous Heritage Tour (R2,330)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Your Investment:</span>
                      <span className="font-semibold">R2,330</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Contribution (20%):</span>
                      <span className="font-semibold text-primary">R466</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="text-muted-foreground">Funds 4 children's meals for 1 month</span>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full" asChild>
                  <Link to="/tours-retreats">
                    Book a Transformative Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
