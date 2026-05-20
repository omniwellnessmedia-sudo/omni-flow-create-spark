import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock, Download, Link2, Copy, Check, FileText, Image, Mail, 
  Users, TrendingUp, Target, Calendar, ExternalLink, Building2,
  Briefcase, Globe, GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TEAM_ACCESS_CODE = 'TEAM2026';

interface RecruitmentOpsProps {
  onLeadAdded?: () => void;
}

// Marketing materials for download
const marketingMaterials = [
  { 
    name: 'Social Media Kit', 
    description: 'Instagram, LinkedIn, Facebook templates',
    format: 'ZIP',
    size: '45 MB',
    icon: Image,
    url: '#'
  },
  { 
    name: 'Email Template Pack', 
    description: '5 email sequences for each channel',
    format: 'PDF',
    size: '2.3 MB',
    icon: Mail,
    url: '#'
  },
  { 
    name: 'Programme Flyer', 
    description: 'A4 printable recruitment flyer',
    format: 'PDF',
    size: '1.8 MB',
    icon: FileText,
    url: '#'
  },
  { 
    name: 'Partner Presentation', 
    description: 'Slide deck for university meetings',
    format: 'PPTX',
    size: '12 MB',
    icon: Building2,
    url: '#'
  },
  { 
    name: 'Student Prospectus', 
    description: 'Complete programme overview',
    format: 'PDF',
    size: '5.4 MB',
    icon: GraduationCap,
    url: 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/UWC-Programme-Prospectus.pdf'
  }
];

// UTM link templates for each channel
const utmChannels = [
  {
    id: 'uwc_institutional',
    name: 'UWC Institutional',
    description: 'University partners & alumni networks',
    icon: Building2,
    target: '15-25 students',
    baseParams: 'utm_source=uwc&utm_medium=institutional&utm_campaign=cohort1-2026'
  },
  {
    id: 'professional',
    name: 'Professional Associations',
    description: 'PsySSA, SACSSP, veterinary bodies',
    icon: Briefcase,
    target: '8-15 students',
    baseParams: 'utm_source=professional&utm_medium=association&utm_campaign=cohort1-2026'
  },
  {
    id: 'digital',
    name: 'Digital Marketing',
    description: 'Social media, Google Ads, content',
    icon: Globe,
    target: '5-10 students',
    baseParams: 'utm_source=social&utm_medium=paid&utm_campaign=cohort1-2026'
  },
  {
    id: 'study_abroad',
    name: 'Study Abroad',
    description: 'International partners & agencies',
    icon: GraduationCap,
    target: '8-16 students',
    baseParams: 'utm_source=studyabroad&utm_medium=partner&utm_campaign=cohort1-2026'
  }
];

// Recruitment timeline phases
const timelinePhases = [
  { phase: 'Phase 1', title: 'Foundation', period: 'Jan-Feb 2026', status: 'current', tasks: ['Partner outreach', 'Material prep', 'Website live'] },
  { phase: 'Phase 2', title: 'Acceleration', period: 'Mar-Apr 2026', status: 'upcoming', tasks: ['Active recruitment', 'Digital campaigns', 'Webinars'] },
  { phase: 'Phase 3', title: 'Momentum', period: 'May-Jun 2026', status: 'upcoming', tasks: ['Final push', 'Early bird deadline', 'Interviews'] },
  { phase: 'Launch', title: 'Cohort 1', period: 'July 2026', status: 'upcoming', tasks: ['Orientation', 'Programme start', 'Welcome'] }
];

const RecruitmentOps: React.FC<RecruitmentOpsProps> = ({ onLeadAdded }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.toUpperCase() === TEAM_ACCESS_CODE) {
      setIsAuthenticated(true);
      setError('');
      toast({
        title: 'Access Granted',
        description: 'Welcome to the Recruitment Operations hub.',
      });
    } else {
      setError('Invalid access code. Please try again.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard.',
    });
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const generateUTMLink = (baseParams: string) => {
    const baseUrl = window.location.origin + '/programs/uwc-human-animal';
    return `${baseUrl}?${baseParams}`;
  };

  // Access Gate
  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Recruitment Team Access</CardTitle>
          <CardDescription>
            Enter your team access code to view recruitment materials and analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccessSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setError('');
                }}
                className="text-center text-lg tracking-widest"
              />
              {error && <p className="text-sm text-destructive mt-2 text-center">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Access Dashboard
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Contact admin if you need access credentials.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge className="mb-2 bg-green-500/10 text-green-600 border-green-500/20">
            <Users className="w-3 h-3 mr-1" />
            Team Access
          </Badge>
          <h2 className="text-2xl font-bold text-foreground">Recruitment Operations Hub</h2>
          <p className="text-muted-foreground">Materials, tracking links, and timeline</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)}>
          <Lock className="w-4 h-4 mr-2" />
          Lock
        </Button>
      </div>

      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="tracking">UTM Links</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Marketing Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {marketingMaterials.map((material, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <material.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{material.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{material.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-[10px]">{material.format}</Badge>
                          <Badge variant="outline" className="text-[10px]">{material.size}</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2"
                          onClick={() => material.url !== '#' && window.open(material.url, '_blank')}
                          disabled={material.url === '#'}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Additional materials will be uploaded as they become available. 
                Check back regularly or contact the marketing team for custom assets.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UTM Tracking Links Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Channel Attribution</h4>
                  <p className="text-sm text-muted-foreground">
                    Use these UTM-tagged links to track which channels drive applications. 
                    All links go to the UWC Programme page with tracking parameters.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {utmChannels.map((channel) => {
              const fullLink = generateUTMLink(channel.baseParams);
              return (
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <channel.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{channel.name}</h4>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        <Target className="w-3 h-3 mr-1" />
                        {channel.target}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <code className="text-xs text-muted-foreground truncate flex-1">
                        {fullLink}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 shrink-0"
                        onClick={() => copyToClipboard(fullLink, channel.id)}
                      >
                        {copiedLink === channel.id ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />

            {/* Timeline Items */}
            <div className="space-y-6">
              {timelinePhases.map((item, idx) => (
                <div key={idx} className={`relative flex items-start gap-4 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:text-center`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 md:-translate-x-1/2 ${
                    item.status === 'current' 
                      ? 'bg-primary border-primary animate-pulse' 
                      : 'bg-background border-border'
                  }`} />

                  {/* Content Card */}
                  <Card className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${item.status === 'current' ? 'border-primary/50 shadow-md' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2 md:justify-center">
                        <Badge variant={item.status === 'current' ? 'default' : 'secondary'}>
                          {item.phase}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.period}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 md:text-left">
                        {item.tasks.map((task, taskIdx) => (
                          <li key={taskIdx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">Quick Actions</h4>
              <p className="text-sm text-muted-foreground">Jump to common tasks</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => window.location.href = '/admin'}>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Pipeline
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.open('https://calendly.com/omniwellnessmedia', '_blank')}>
                <Calendar className="w-4 h-4 mr-2" />
                Calendly
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.open('mailto:omniwellnessmedia@gmail.com', '_blank')}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentOps;
