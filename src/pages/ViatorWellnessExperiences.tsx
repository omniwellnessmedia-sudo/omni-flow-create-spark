import { useState } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Heart, Globe, Shield, ExternalLink, 
  Leaf, Users, Mountain, Waves, Lightbulb, MapPin
} from 'lucide-react';
import { useConsciousAffiliate } from '@/hooks/useConsciousAffiliate';

interface WellnessExperience {
  id: string;
  name: string;
  location: string;
  duration: string;
  priceFrom: string;
  image: string;
  category: string;
  curatorName: string;
  curatorAvatar: string;
  whyWeChoseIt: string;
  whoShouldGo: string[];
  viatorProductCode: string;
  consciousnessIntent: string;
}

export default function ViatorWellnessExperiences() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();

  const curators = [
    {
      name: 'Zenith Yassin',
      title: 'Administrative Director & Wellness Curator',
      avatar: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/wellness%20group%20tour.jpg',
      bio: 'With a deep passion for holistic wellness and cultural immersion, Zenith curates transformative spa and meditation experiences.',
      expertise: 'Spa & Wellness',
    },
    {
      name: 'Chad Cupido',
      title: 'Founder & Cultural Experience Curator',
      avatar: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/chad%20cupido%20portrait.jpg',
      bio: 'Chad specializes in authentic cultural healing experiences that honor indigenous traditions and promote conscious travel.',
      expertise: 'Cultural Healing',
    },
    {
      name: 'Abbi Berkovitz',
      title: 'Media Creator & Nature Immersion Curator',
      avatar: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg',
      bio: 'Abbi\'s lens captures the soul of nature-based wellness experiences, helping travelers find their perfect outdoor sanctuary.',
      expertise: 'Nature Immersions',
    },
  ];

  const experiences: WellnessExperience[] = [
    {
      id: 'bali-spa-retreat',
      name: 'Sacred Balinese Spa Ritual',
      location: 'Ubud, Bali',
      duration: '3 hours',
      priceFrom: 'USD 120',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
      category: 'spa',
      curatorName: 'Zenith Yassin',
      curatorAvatar: curators[0].avatar,
      whyWeChoseIt: 'This isn\'t just a spa treatment—it\'s a deeply spiritual experience rooted in Balinese Hindu traditions. The therapists are trained healers who understand energy work and incorporate prayers and blessings.',
      whoShouldGo: ['Stressed professionals', 'Spiritual seekers', 'Anyone needing deep relaxation'],
      viatorProductCode: 'BALI-SPA-001',
      consciousnessIntent: 'spiritual_healing',
    },
    {
      id: 'kyoto-meditation',
      name: 'Zen Meditation with Buddhist Monk',
      location: 'Kyoto, Japan',
      duration: '2 hours',
      priceFrom: 'USD 85',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
      category: 'meditation',
      curatorName: 'Chad Cupido',
      curatorAvatar: curators[1].avatar,
      whyWeChoseIt: 'Learning meditation from an actual Buddhist monk in a centuries-old temple offers authentic wisdom you won\'t find in any app. The cultural and spiritual depth is unmatched.',
      whoShouldGo: ['Meditation beginners', 'Experienced practitioners', 'Culture enthusiasts'],
      viatorProductCode: 'KYOTO-ZEN-001',
      consciousnessIntent: 'mindfulness_practice',
    },
    {
      id: 'swiss-alps-yoga',
      name: 'Mountain Yoga & Breathwork',
      location: 'Interlaken, Switzerland',
      duration: '4 hours',
      priceFrom: 'USD 150',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      category: 'nature',
      curatorName: 'Abbi Berkovitz',
      curatorAvatar: curators[2].avatar,
      whyWeChoseIt: 'There\'s something profoundly healing about practicing yoga surrounded by the Swiss Alps. The pristine air, the mountain energy, and expert instruction create a transformative experience.',
      whoShouldGo: ['Yoga practitioners', 'Nature lovers', 'Adventure seekers'],
      viatorProductCode: 'SWISS-YOGA-001',
      consciousnessIntent: 'nature_connection',
    },
    {
      id: 'thai-wellness',
      name: 'Traditional Thai Healing & Herbs',
      location: 'Chiang Mai, Thailand',
      duration: '5 hours',
      priceFrom: 'USD 95',
      image: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=800',
      category: 'cultural',
      curatorName: 'Chad Cupido',
      curatorAvatar: curators[1].avatar,
      whyWeChoseIt: 'This experience goes beyond typical tourism—you learn from local healers who\'ve practiced for generations. The herbal medicine wisdom is practical and applicable to modern life.',
      whoShouldGo: ['Herbalism enthusiasts', 'Holistic health seekers', 'Cultural learners'],
      viatorProductCode: 'THAI-HEAL-001',
      consciousnessIntent: 'traditional_medicine',
    },
    {
      id: 'iceland-thermal',
      name: 'Geothermal Spa & Sound Healing',
      location: 'Reykjavik, Iceland',
      duration: '3 hours',
      priceFrom: 'USD 140',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800',
      category: 'spa',
      curatorName: 'Zenith Yassin',
      curatorAvatar: curators[0].avatar,
      whyWeChoseIt: 'Iceland\'s geothermal waters have healing minerals that you can\'t replicate anywhere else. Combined with traditional sound healing, it\'s a unique multi-sensory wellness experience.',
      whoShouldGo: ['Wellness travelers', 'Sound healing enthusiasts', 'Nature spa lovers'],
      viatorProductCode: 'ICELAND-SPA-001',
      consciousnessIntent: 'elemental_healing',
    },
    {
      id: 'peru-ayahuasca',
      name: 'Sacred Plant Ceremony (Legal & Guided)',
      location: 'Cusco, Peru',
      duration: '8 hours',
      priceFrom: 'USD 250',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      category: 'cultural',
      curatorName: 'Chad Cupido',
      curatorAvatar: curators[1].avatar,
      whyWeChoseIt: 'For those seeking deep spiritual work, this ceremony with licensed shamans offers authentic healing in its traditional context. Safety, legality, and cultural respect are paramount.',
      whoShouldGo: ['Experienced spiritual seekers', 'Those ready for deep healing', 'Respectful participants only'],
      viatorProductCode: 'PERU-PLANT-001',
      consciousnessIntent: 'spiritual_transformation',
    },
  ];

  const filteredExperiences = selectedCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory);

  const handleExperienceClick = async (experience: WellnessExperience) => {
    const affiliateUrl = generateAffiliateLink({
      productSlug: experience.viatorProductCode,
      channel: 'viator_wellness_experiences',
      wellnessCategory: experience.category,
      consciousnessIntent: experience.consciousnessIntent,
    });

    await trackAffiliateClick(
      experience.name,
      'viator_wellness_experiences',
      affiliateUrl,
      experience.consciousnessIntent,
      experience.category
    );

    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-base px-4 py-2" variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Curated by Omni Wellness Team
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Wellness Experiences Worldwide
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Handpicked transformative wellness journeys curated by our team of conscious travel experts. 
              Every experience is vetted for authenticity, safety, and genuine healing potential.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Explore Experiences
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Talk to Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Curators */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Meet Your Wellness Curators</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team personally vets every experience, ensuring they align with conscious travel principles 
                and deliver authentic transformation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {curators.map((curator, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                      <AvatarImage src={curator.avatar} alt={curator.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {curator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-1">{curator.name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{curator.title}</p>
                    <Badge variant="secondary" className="mb-4">
                      <Leaf className="w-3 h-3 mr-1" />
                      {curator.expertise}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {curator.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Viator Partnership */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why We Partner with Viator</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We've chosen Viator as our global wellness experience partner because they share our 
                commitment to authentic, safe, and transformative travel.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Safety & Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every experience on Viator undergoes rigorous safety and quality checks. They verify 
                    local operators, insurance coverage, and health protocols—so you can focus on healing, 
                    not logistics.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Global Reach, Local Authenticity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Viator connects you with local wellness practitioners and healers worldwide while 
                    providing the customer service and booking convenience of a trusted global platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Heart className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Flexible Cancellation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Life happens. Most Viator wellness experiences offer flexible cancellation policies, 
                    giving you peace of mind when booking transformative experiences in advance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Real Reviews from Real Travelers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Viator's transparent review system lets you see honest feedback from travelers who've 
                    actually experienced the wellness journeys—no marketing fluff, just real insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Categories & Experiences */}
      <section className="py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Curated Wellness Experiences</h2>

            <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-12">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="spa">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Spa
                </TabsTrigger>
                <TabsTrigger value="meditation">
                  <Heart className="w-4 h-4 mr-2" />
                  Meditation
                </TabsTrigger>
                <TabsTrigger value="nature">
                  <Mountain className="w-4 h-4 mr-2" />
                  Nature
                </TabsTrigger>
                <TabsTrigger value="cultural">
                  <Globe className="w-4 h-4 mr-2" />
                  Cultural
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredExperiences.map((experience) => (
                    <Card 
                      key={experience.id} 
                      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                    >
                      {/* Experience Image */}
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={experience.image}
                          alt={experience.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col gap-4">
                        {/* Location & Duration */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {experience.location}
                          </span>
                          <span>{experience.duration}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold leading-tight">
                          {experience.name}
                        </h3>

                        {/* Curator */}
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={experience.curatorAvatar} alt={experience.curatorName} />
                            <AvatarFallback className="text-xs">
                              {experience.curatorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            Curated by {experience.curatorName}
                          </span>
                        </div>

                        {/* Why We Chose It */}
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-1">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-primary mb-1">Why we chose it:</p>
                              <p className="text-xs leading-relaxed text-foreground/90">
                                {experience.whyWeChoseIt}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Who Should Go */}
                        <div className="flex flex-wrap gap-1.5">
                          {experience.whoShouldGo.map((who, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {who}
                            </Badge>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div className="mt-auto pt-4 border-t flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">From</p>
                            <p className="text-xl font-bold text-primary">{experience.priceFrom}</p>
                          </div>
                          <Button 
                            onClick={() => handleExperienceClick(experience)}
                            className="group/btn"
                          >
                            Book on Viator
                            <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Not Sure CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Not Sure Where to Start?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our wellness curators are here to help you find the perfect experience for your healing journey. 
              We'll ask about your intentions, preferences, and wellness goals to recommend the ideal match.
            </p>
            <Button size="lg" className="text-lg px-8">
              Talk to Our Wellness Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
