import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { 
  Heart, Sparkles, Users, ArrowLeft, Target, 
  TrendingUp, Globe, Award, Mail, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UWCSponsors: React.FC = () => {
  const impactMetrics = [
    { value: "20-25", label: "Students Per Cohort", icon: Users },
    { value: "5+", label: "Partner Organizations", icon: Heart },
    { value: "10", label: "Weeks of Immersion", icon: Target },
    { value: "100%", label: "Employment Alignment", icon: TrendingUp }
  ];

  const sponsorshipTiers = [
    {
      name: "Gold Partner",
      amount: "R250,000+",
      benefits: [
        "Named scholarship for 3+ students",
        "Logo on all programme materials",
        "Keynote speaking opportunity",
        "First access to graduate recruitment",
        "Impact report with your branding"
      ],
      highlight: true
    },
    {
      name: "Silver Partner",
      amount: "R100,000+",
      benefits: [
        "Named scholarship for 1 student",
        "Logo on programme materials",
        "Graduation ceremony recognition",
        "Graduate recruitment access"
      ],
      highlight: false
    },
    {
      name: "Community Partner",
      amount: "R25,000+",
      benefits: [
        "Partial scholarship contribution",
        "Website recognition",
        "Annual impact report",
        "CSR documentation"
      ],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-amber-500/10 via-background to-background">
        <div className="container mx-auto px-4">
          <Link 
            to="/programs/uwc-human-animal" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programme
          </Link>
          
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Corporate & Foundation Partners
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Invest in Transformation
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Partner with us to shape the next generation of Human-Animal Bond professionals 
              while achieving meaningful CSR impact in South Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=Sponsorship Inquiry', '_blank')}
              >
                <Heart className="mr-2 h-5 w-5" />
                Become a Sponsor
              </Button>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-5 w-5" />
                Download Prospectus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-12 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactMetrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <metric.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Sponsorship Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose a partnership level that aligns with your organization's impact goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sponsorshipTiers.map((tier, idx) => (
              <Card 
                key={idx} 
                className={`border-border relative overflow-hidden ${tier.highlight ? 'border-amber-500 shadow-lg' : ''}`}
              >
                {tier.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                )}
                <CardContent className="p-6">
                  {tier.highlight && (
                    <Badge className="bg-amber-500 text-white mb-4">Recommended</Badge>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-1">{tier.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{tier.amount}</p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Impact */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Globe className="w-3.5 h-3.5 mr-2" />
                CSR Impact
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Your Investment Creates Lasting Change
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-lg">For Your Organization</h3>
                <ul className="space-y-3">
                  {[
                    "B-BBEE points for skills development",
                    "Documented social impact for ESG reporting",
                    "Brand alignment with academic excellence",
                    "Access to emerging talent pipeline",
                    "Thought leadership positioning"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-lg">For Students</h3>
                <ul className="space-y-3">
                  {[
                    "Life-changing study abroad opportunity",
                    "University-accredited credentials",
                    "Career-launching field experience",
                    "Global professional network",
                    "Publication opportunities"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto mb-8">
            Let's discuss how your sponsorship can transform lives while achieving your CSR goals.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => window.open('mailto:omniwellnessmedia@gmail.com?subject=Sponsorship Inquiry', '_blank')}
          >
            <Mail className="mr-2 h-5 w-5" />
            Contact Our Team
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCSponsors;
