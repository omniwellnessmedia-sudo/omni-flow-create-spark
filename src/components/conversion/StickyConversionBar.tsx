import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Phone, ArrowRight, Sparkles } from 'lucide-react';

interface StickyConversionBarProps {
  primaryCTA?: {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  };
  secondaryCTA?: {
    label: string;
    action: () => void;
  };
  message?: string;
  showAfterScroll?: number;
  hideOnMobile?: boolean;
}

const StickyConversionBar: React.FC<StickyConversionBarProps> = ({
  primaryCTA = {
    label: 'Book Discovery Call',
    action: () => window.open('https://calendly.com/omniwellnessmedia/discovery-call', '_blank'),
    icon: <Phone className="w-4 h-4" />
  },
  secondaryCTA,
  message = 'Ready to transform your career?',
  showAfterScroll = 300,
  hideOnMobile = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } ${hideOnMobile ? 'hidden md:block' : ''}`}
    >
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-2xl border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary-foreground/80" />
              <span className="font-medium text-sm md:text-base">{message}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-none justify-center sm:justify-end">
              {secondaryCTA && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
                  onClick={secondaryCTA.action}
                >
                  {secondaryCTA.label}
                </Button>
              )}
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 min-h-[44px]"
                onClick={primaryCTA.action}
              >
                {primaryCTA.icon}
                <span className="ml-2">{primaryCTA.label}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 p-2 min-h-[44px] min-w-[44px]"
              onClick={() => setIsDismissed(true)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyConversionBar;
