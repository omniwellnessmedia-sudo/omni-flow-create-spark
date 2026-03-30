import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { 
  Building2, GraduationCap, Globe, Users, ArrowLeft, 
  CheckCircle, Mail, FileText, Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_BASE = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images";

const partnerLogos = {
  uwc: `${STORAGE_BASE}/partner-logos%2A%2A%20(Brand%20Assets)/UWC-Crest.png`,
};

const UWCUniversityPartners: React.FC = () => {
  const benefits = [
    {
      icon: GraduationCap,
      title: "Credit Transfer",
      description: "10 SAQA credits aligned to NQF Level 7-8 for seamless academic integration"
    },
    {
      icon: Users,
      title: "Custom Cohorts",
      description: "Bring 10-20 students for a dedicated cohort experience with faculty support"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Join a growing consortium of international institutions committed to One Health"
    },
    {
      icon: FileText,
      title: "Research Collaboration",
      description: "Co-publish with UWC faculty and access unique fieldwork opportunities"
    }
  ];

  const partnerProcess = [
    { step: 1, title: "Initial Inquiry", desc: "Contact us to discuss partnership alignment" },
    { step: 2, title: "MOU Development", desc: "Formalize credit transfer and logistics" },
    { step: 3, title: "Cohort Planning", desc: "Schedule dates and customize curriculum" },
    { step: 4, title: "Student Recruitment", desc: "Promote to your student body" },
    { step: 5, title: "Programme Delivery", desc: "Your students join the immersive experience" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <Link 
            to="/programs/uwc-human-animal" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programme
          </Link>
          
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Building2 className="w-3.5 h-3.5 mr-2" />
              For Universities
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              University Partnership Programme
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Partner with the University of the Western Cape to offer your students 
              a transformative study abroad experience in Human-Animal Bond research.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                asChild
              >
                <a href="mailto:admin@omniwellnessmedia.co.za?subject=University Partnership Inquiry">
                  <Handshake className="mr-2 h-5 w-5" />
                  Request Partnership Info
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank')}
              >
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Partnership Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your institution's global footprint with a unique African study abroad programme.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A streamlined process to establish your university partnership.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4">
              {partnerProcess.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-primary">{item.step}</span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-xl shadow-md p-3">
              <img 
                src={partnerLogos.uwc} 
                alt="University of the Western Cape"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Accredited by University of the Western Cape
            </h2>
            <p className="text-muted-foreground mb-8">
              Our programme carries full UWC accreditation with 10 SAQA credits at NQF Level 7-8, 
              ensuring quality assurance and academic rigor for your students.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {["NQF Level 7-8", "10 SAQA Credits", "Short Course Certificate", "Co-Publication Opportunities"].map((item, idx) => (
                <Badge key={idx} variant="outline" className="px-4 py-2">
                  <CheckCircle className="w-3.5 h-3.5 mr-2 text-primary" />
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Partner?</h2>
          <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto mb-8">
            Join our growing consortium of international universities.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <a href="mailto:admin@omniwellnessmedia.co.za?subject=University Partnership Inquiry">
              <Mail className="mr-2 h-5 w-5" />
              Contact Partnership Team
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCUniversityPartners;
