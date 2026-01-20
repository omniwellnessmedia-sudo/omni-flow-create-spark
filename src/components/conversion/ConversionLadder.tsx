import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronDown, GraduationCap, Calendar, Sun, ShoppingBag, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConversionTier {
  id: string;
  title: string;
  price?: string;
  priceNote?: string;
  description: string;
  icon: React.ElementType;
  cta: {
    label: string;
    action: string | (() => void);
  };
  isHighlight?: boolean;
}

interface ConversionLadderProps {
  currentTier?: string;
  compact?: boolean;
  showAll?: boolean;
}

const defaultTiers: ConversionTier[] = [
  {
    id: 'uwc-programme',
    title: 'UWC Programme',
    price: 'R70,000',
    priceNote: 'All-inclusive 10 weeks',
    description: 'Full immersive experience in Cape Town',
    icon: GraduationCap,
    cta: { label: 'Learn More', action: '/programs/uwc-human-animal' },
    isHighlight: true
  },
  {
    id: 'retreat',
    title: 'Wellness Retreat',
    price: 'R3,999+',
    priceNote: '3-7 day experiences',
    description: 'Guided retreats in nature',
    icon: Sun,
    cta: { label: 'Explore Retreats', action: '/tours/omni-wellness-retreat' }
  },
  {
    id: 'day-tour',
    title: 'Day Experiences',
    price: 'R1,500+',
    priceNote: 'Half or full day',
    description: 'Cave tours & cultural experiences',
    icon: Calendar,
    cta: { label: 'View Tours', action: '/tours/great-mother-cave-tour' }
  },
  {
    id: 'shop',
    title: 'Wellness Products',
    price: 'R50-500',
    priceNote: 'Curated collection',
    description: 'Shop from home, support impact',
    icon: ShoppingBag,
    cta: { label: 'Shop Now', action: '/2bewellshop' }
  },
  {
    id: 'newsletter',
    title: 'Free Newsletter',
    price: 'Free',
    description: 'Weekly wellness insights & updates',
    icon: Mail,
    cta: { label: 'Subscribe', action: () => document.getElementById('newsletter-signup')?.scrollIntoView({ behavior: 'smooth' }) }
  }
];

const ConversionLadder: React.FC<ConversionLadderProps> = ({
  currentTier,
  compact = false,
  showAll = true
}) => {
  const handleCTA = (action: string | (() => void)) => {
    if (typeof action === 'function') {
      action();
    }
  };

  // If currentTier is set, show next tier down as primary suggestion
  const getRelevantTiers = () => {
    if (showAll) return defaultTiers;
    
    const currentIndex = defaultTiers.findIndex(t => t.id === currentTier);
    if (currentIndex === -1) return defaultTiers.slice(0, 3);
    
    // Show current tier and next 2 lower tiers
    return defaultTiers.slice(currentIndex, currentIndex + 3);
  };

  const tiers = getRelevantTiers();

  if (compact) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground font-medium">Not ready? Try:</p>
        <div className="flex flex-wrap gap-2">
          {tiers.slice(1, 4).map((tier) => (
            typeof tier.cta.action === 'string' ? (
              <Link key={tier.id} to={tier.cta.action}>
                <Button variant="outline" size="sm" className="text-xs min-h-[44px]">
                  <tier.icon className="w-3 h-3 mr-1" />
                  {tier.title}
                  {tier.price && <Badge variant="secondary" className="ml-2 text-[10px]">{tier.price}</Badge>}
                </Button>
              </Link>
            ) : (
              <Button 
                key={tier.id}
                variant="outline" 
                size="sm" 
                className="text-xs min-h-[44px]"
                onClick={() => handleCTA(tier.cta.action)}
              >
                <tier.icon className="w-3 h-3 mr-1" />
                {tier.title}
                {tier.price && <Badge variant="secondary" className="ml-2 text-[10px]">{tier.price}</Badge>}
              </Button>
            )
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
          Multiple Ways to Connect
        </Badge>
        <h3 className="text-xl font-bold text-foreground">
          Find Your Perfect Entry Point
        </h3>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, idx) => (
          <React.Fragment key={tier.id}>
            <Card className={`transition-all hover:shadow-md ${tier.isHighlight ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tier.isHighlight ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <tier.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{tier.title}</h4>
                        {tier.isHighlight && <Badge className="bg-primary text-primary-foreground text-[10px]">Featured</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tier.price && (
                      <div className="text-right hidden sm:block">
                        <div className="font-bold text-foreground">{tier.price}</div>
                        {tier.priceNote && <div className="text-xs text-muted-foreground">{tier.priceNote}</div>}
                      </div>
                    )}
                    {typeof tier.cta.action === 'string' ? (
                      <Link to={tier.cta.action}>
                        <Button size="sm" variant={tier.isHighlight ? 'default' : 'outline'} className="min-h-[44px]">
                          {tier.cta.label}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        size="sm" 
                        variant={tier.isHighlight ? 'default' : 'outline'} 
                        className="min-h-[44px]"
                        onClick={() => handleCTA(tier.cta.action)}
                      >
                        {tier.cta.label}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {idx < tiers.length - 1 && (
              <div className="flex justify-center">
                <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ConversionLadder;
