import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

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

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none" />
      
      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={handleSkip}>
        <DialogContent className="sm:max-w-md z-[60] pointer-events-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-wellhub-accent" />
                <DialogTitle className="text-lg font-semibold">
                  {currentStepData.title}
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-wellhub-gradient h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Step counter */}
            <p className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </p>

            {/* Content */}
            <p className="text-gray-700 leading-relaxed">
              {currentStepData.content}
            </p>

            {/* Action buttons */}
            <div className="flex justify-between pt-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500"
                >
                  Skip Tour
                </Button>
              </div>

              <Button
                onClick={nextStep}
                size="sm"
                className="bg-wellhub-gradient hover:opacity-90 text-white flex items-center gap-1"
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4" />
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
      className="fixed bottom-6 right-6 z-40 shadow-lg bg-white border-wellhub-accent text-wellhub-accent hover:bg-wellhub-accent hover:text-white"
    >
      <Target className="w-4 h-4 mr-2" />
      Take Tour
    </Button>
  );
};

export default AppTour;