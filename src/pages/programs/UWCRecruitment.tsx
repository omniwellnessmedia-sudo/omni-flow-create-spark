import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { 
  Users, ArrowLeft, Download, Link as LinkIcon, Copy, 
  CheckCircle, Mail, FileText, Share2, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UWCRecruitment: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleAccess = () => {
    if (accessCode.toUpperCase() === 'TEAM2026') {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the Recruitment Operations Hub",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your access code and try again",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const utmLinks = [
    {
      name: "Facebook Ads",
      url: "https://omni-flow-create-spark.lovable.app/programs/uwc-human-animal?utm_source=facebook&utm_medium=paid&utm_campaign=uwc2026"
    },
    {
      name: "Instagram Bio",
      url: "https://omni-flow-create-spark.lovable.app/programs/uwc-human-animal?utm_source=instagram&utm_medium=organic&utm_campaign=uwc2026"
    },
    {
      name: "Email Newsletter",
      url: "https://omni-flow-create-spark.lovable.app/programs/uwc-human-animal?utm_source=email&utm_medium=newsletter&utm_campaign=uwc2026"
    },
    {
      name: "University Partners",
      url: "https://omni-flow-create-spark.lovable.app/programs/uwc-human-animal?utm_source=partner&utm_medium=referral&utm_campaign=uwc2026"
    }
  ];

  const resources = [
    { name: "Programme Brochure (PDF)", icon: FileText, type: "PDF" },
    { name: "Social Media Kit", icon: Share2, type: "ZIP" },
    { name: "Email Templates", icon: Mail, type: "DOC" },
    { name: "Partner Presentation", icon: FileText, type: "PPTX" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation />
        
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Recruitment Operations Hub
              </h1>
              <p className="text-muted-foreground mb-8">
                Enter your team access code to continue
              </p>
              
              <div className="flex gap-2">
                <Input 
                  type="text"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                  className="text-center uppercase tracking-widest"
                />
                <Button onClick={handleAccess}>
                  Access
                </Button>
              </div>
              
              <Link 
                to="/programs/uwc-human-animal" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mt-8 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Programme
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero */}
      <section className="relative py-12 bg-gradient-to-br from-green-500/10 via-background to-background border-b border-border">
        <div className="container mx-auto px-4">
          <Link 
            to="/programs/uwc-human-animal" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programme
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Badge className="mb-2 bg-green-500/10 text-green-600 border-green-500/20">
                <Users className="w-3.5 h-3.5 mr-2" />
                Team Access
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Recruitment Operations Hub
              </h1>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600">
              <CheckCircle className="w-3.5 h-3.5 mr-2" />
              Authenticated
            </Badge>
          </div>
        </div>
      </section>

      {/* UTM Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Trackable Links
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {utmLinks.map((link, idx) => (
              <Card key={idx} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm">{link.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(link.url, link.name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Marketing Resources
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            {resources.map((resource, idx) => (
              <Card key={idx} className="border-border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <resource.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-medium text-foreground text-sm mb-1">{resource.name}</p>
                  <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mt-6 max-w-4xl">
            Note: Resources are coming soon. Contact the team for interim materials.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          
          <div className="flex flex-wrap gap-4 max-w-4xl">
            <Button onClick={() => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank')}>
              Schedule Discovery Call
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:admin@omniwellnessmedia.co.za">
                <Mail className="mr-2 h-4 w-4" />
                Email Template
              </a>
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share to Social
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UWCRecruitment;
