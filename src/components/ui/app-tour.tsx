import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Heart, Users, MapPin, Zap, Sparkles, Target } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    link: string;
  };
}

const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case 'welcome':
      return <Heart className="w-5 h-5 text-primary" />;
    case 'mission':
      return <Target className="w-5 h-5 text-primary" />;
    case 'services':
      return <Users className="w-5 h-5 text-primary" />;
    case 'tours':
      return <MapPin className="w-5 h-5 text-primary" />;
    case 'ai-tools':
      return <Zap className="w-5 h-5 text-primary" />;
    case 'community':
      return <Users className="w-5 h-5 text-primary" />;
    case 'complete':
      return <Sparkles className="w-5 h-5 text-primary" />;
    default:
      return <Sparkles className="w-5 h-5 text-primary" />;
  }
};

interface AppTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  autoStart?: boolean;
}

const AppTour = ({ 
  steps, 
  isOpen, 
  onComplete, 
  onSkip, 
  autoStart = false 
}: AppTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (isOpen && steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target!) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        element.classList.add('tour-highlight');
        
        return () => {
          element.classList.remove('tour-highlight');
        };
      }
    }
  }, [isOpen, currentStep, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
    }
    onComplete();
  };

  const handleSkip = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
    }
    onSkip();
  };

  if (!isOpen || steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Enhanced Overlay with subtle backdrop blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-none animate-fade-in" />
      
      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={handleSkip}>
        <DialogContent className="sm:max-w-lg z-[60] pointer-events-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-scale-in">
          <DialogDescription className="sr-only">
            Interactive tour to help you navigate and discover the features of this application
          </DialogDescription>
          <DialogHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getStepIcon(currentStepData.id)}
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-900 mb-1">
                    {currentStepData.title}
                  </DialogTitle>
                  <Badge variant="secondary" className="text-xs">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Content with better typography */}
            <p className="text-gray-700 leading-relaxed text-base">
              {currentStepData.content}
            </p>

            {/* Call-to-Action for specific steps */}
            {currentStepData.action && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
                <Link 
                  to={currentStepData.action.link}
                  onClick={() => {
                    handleComplete();
                    // Ensure page scrolls to top
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium shadow-lg"
                  >
                    {currentStepData.action.label}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Navigation */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={isFirstStep}
                className="px-6 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isFirstStep ? 'Start' : 'Previous'}
              </Button>
              
              {/* Visual step indicators */}
              <div className="flex gap-1">
                {Array.from({ length: steps.length }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      i === currentStep ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={isLastStep ? handleComplete : nextStep}
                className="px-6 bg-primary hover:bg-primary/90"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Tour trigger button component
export const TourTrigger = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="fixed bottom-6 right-6 z-40 shadow-lg bg-white border-omni-orange text-omni-orange hover:bg-omni-orange hover:text-white"
    >
      <Target className="w-4 h-4 mr-2" />
      Take Tour
    </Button>
  );
};

export default AppTour;