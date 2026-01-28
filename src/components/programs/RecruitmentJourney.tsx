import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, Phone, FileText, ShoppingBag, Plane, ChevronRight, 
  Download, Calendar, Mail, ExternalLink, CheckCircle2
} from 'lucide-react';

interface RecruitmentJourneyProps {
  onPhaseClick?: (phase: string) => void;
}

const phases = [
  {
    id: 'discover',
    num: 1,
    title: 'Discover',
    subtitle: 'Explore the Programme',
    description: 'Learn about our unique 10-week immersive experience combining academic rigour with hands-on animal welfare work.',
    icon: Globe,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    ctas: [
      { label: 'Download Prospectus', action: 'prospectus', icon: Download, primary: true },
      { label: 'Watch Overview Video', action: 'video', icon: ExternalLink }
    ],
    metrics: { label: 'Avg. Time', value: '15 mins' }
  },
  {
    id: 'connect',
    num: 2,
    title: 'Connect',
    subtitle: 'Talk to Our Team',
    description: 'Book a free discovery call to discuss your goals, ask questions, and see if this programme is right for you.',
    icon: Phone,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    ctas: [
      { label: 'Book Discovery Call', action: 'calendly', icon: Calendar, primary: true },
      { label: 'Email Questions', action: 'email', icon: Mail }
    ],
    metrics: { label: 'Call Duration', value: '20 mins' }
  },
  {
    id: 'apply',
    num: 3,
    title: 'Apply',
    subtitle: 'Submit Your Interest',
    description: 'Complete your application with a personal statement, CV, and references. Our team reviews within 5 business days.',
    icon: FileText,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    ctas: [
      { label: 'Express Interest', action: 'apply', icon: Mail, primary: true },
      { label: 'View Requirements', action: 'requirements', icon: FileText }
    ],
    metrics: { label: 'Review Time', value: '5 days' }
  },
  {
    id: 'prepare',
    num: 4,
    title: 'Prepare',
    subtitle: 'Get Ready to Travel',
    description: 'Access our Getting Ready Guide, browse travel essentials, and prepare for your South African adventure.',
    icon: ShoppingBag,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    ctas: [
      { label: 'Browse Travel Gear', action: 'travelstore', icon: ShoppingBag, primary: true },
      { label: 'Getting Ready Guide', action: 'guide', icon: FileText }
    ],
    metrics: { label: 'Prep Time', value: '2-4 weeks' }
  },
  {
    id: 'arrive',
    num: 5,
    title: 'Arrive',
    subtitle: 'Begin Your Journey',
    description: 'Touch down in Cape Town with your eSIM ready. Your transformation begins at TUFCAT sanctuary.',
    icon: Plane,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-pink-200 dark:border-pink-800',
    ctas: [
      { label: 'Get eSIM for Africa', action: 'esim', icon: Plane, primary: true },
      { label: 'Arrival Checklist', action: 'checklist', icon: CheckCircle2 }
    ],
    metrics: { label: 'Programme', value: '10 weeks' }
  }
];

const handleAction = (action: string) => {
  const actions: Record<string, () => void> = {
    prospectus: () => window.open('https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/UWC-Programme-Prospectus.pdf', '_blank'),
    video: () => document.getElementById('programme-video')?.scrollIntoView({ behavior: 'smooth' }),
    calendly: () => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank'),
    email: () => window.open('mailto:omniwellnessmedia@gmail.com?subject=UWC Programme Inquiry', '_blank'),
    apply: () => window.open('mailto:omniwellnessmedia@gmail.com?subject=UWC Programme Application&body=I would like to express my interest in the UWC Human-Animal Interaction Programme.%0A%0AName:%0AEmail:%0ACountry:%0AInstitution (if applicable):%0A%0AWhy I am interested:', '_blank'),
    requirements: () => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }),
    travelstore: () => window.location.href = '/travel-well-connected-store',
    guide: () => document.getElementById('getting-ready')?.scrollIntoView({ behavior: 'smooth' }),
    esim: () => window.location.href = '/roambuddy-store',
    checklist: () => document.getElementById('getting-ready')?.scrollIntoView({ behavior: 'smooth' })
  };
  
  actions[action]?.();
};

const RecruitmentJourney: React.FC<RecruitmentJourneyProps> = ({ onPhaseClick }) => {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
          <Globe className="w-3.5 h-3.5 mr-2" />
          Your Journey to South Africa
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          5 Steps to Transformation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          From discovery to arrival, we guide you through every step of joining our programme.
        </p>
      </div>

      {/* Desktop Timeline - Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-green-500 via-orange-500 via-purple-500 to-pink-500 rounded-full" />
          
          {/* Phase Cards */}
          <div className="grid grid-cols-5 gap-4">
            {phases.map((phase, idx) => (
              <div 
                key={phase.id}
                className="relative pt-4"
                onMouseEnter={() => setActivePhase(phase.id)}
                onMouseLeave={() => setActivePhase(null)}
              >
                {/* Phase Number Circle */}
                <div className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-br ${phase.color} text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg transition-transform ${activePhase === phase.id ? 'scale-110' : ''}`}>
                  {phase.num}
                </div>

                {/* Phase Card */}
                <Card className={`${phase.bgColor} border-2 ${phase.borderColor} transition-all duration-300 ${activePhase === phase.id ? 'shadow-xl scale-[1.02]' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4 text-center">
                    <phase.icon className={`w-8 h-8 mx-auto mb-2 bg-gradient-to-br ${phase.color} text-transparent bg-clip-text`} style={{ color: 'transparent', backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                    <h3 className="font-bold text-foreground mb-1">{phase.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{phase.subtitle}</p>
                    
                    {/* Primary CTA Always Visible */}
                    {(() => {
                      const PrimaryIcon = phase.ctas[0].icon;
                      return (
                        <Button
                          size="sm"
                          variant="default"
                          className="w-full text-xs min-h-[44px] mb-2"
                          onClick={() => handleAction(phase.ctas[0].action)}
                        >
                          <PrimaryIcon className="w-3 h-3 mr-1" />
                          {phase.ctas[0].label}
                        </Button>
                      );
                    })()}
                    
                    {/* Secondary CTA on Hover */}
                    <div className={`overflow-hidden transition-all duration-300 ${activePhase === phase.id ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {phase.ctas.slice(1).map((cta, ctaIdx) => (
                        <Button
                          key={ctaIdx}
                          size="sm"
                          variant="outline"
                          className="w-full text-xs min-h-[44px]"
                          onClick={() => handleAction(cta.action)}
                        >
                          <cta.icon className="w-3 h-3 mr-1" />
                          {cta.label}
                        </Button>
                      ))}
                    </div>

                    {/* Metric Badge */}
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {phase.metrics.label}: {phase.metrics.value}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Timeline - Vertical */}
      <div className="lg:hidden space-y-4">
        {phases.map((phase, idx) => (
          <Card 
            key={phase.id}
            className={`${phase.bgColor} border-2 ${phase.borderColor} overflow-hidden`}
            onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Phase Number */}
                <div className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${phase.color} text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                  {phase.num}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-foreground">{phase.title}</h3>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${activePhase === phase.id ? 'rotate-90' : ''}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{phase.subtitle}</p>
                  
                  {/* Expanded Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${activePhase === phase.id ? 'max-h-64' : 'max-h-0'}`}>
                    <p className="text-sm text-muted-foreground mb-4 pt-2 border-t border-border/50">{phase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.ctas.map((cta, ctaIdx) => (
                        <Button
                          key={ctaIdx}
                          size="sm"
                          variant={cta.primary ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(cta.action);
                          }}
                        >
                          <cta.icon className="w-4 h-4 mr-1" />
                          {cta.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Metric Badge - Always Visible */}
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {phase.metrics.label}: {phase.metrics.value}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border">
        {[
          { label: 'Total Journey', value: '8-12 weeks', desc: 'Application to arrival' },
          { label: 'Response Time', value: '48 hours', desc: 'Average inquiry response' },
          { label: 'Acceptance Rate', value: '65%', desc: 'Of qualified applicants' },
          { label: 'Cohort Size', value: '20-25', desc: 'Students per cohort' }
        ].map((stat, idx) => (
          <div key={idx} className="text-center p-4 rounded-xl bg-muted/50">
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm font-medium text-foreground">{stat.label}</div>
            <div className="text-xs text-muted-foreground">{stat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentJourney;
