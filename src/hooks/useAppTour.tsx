import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

interface TourConfig {
  [key: string]: TourStep[];
}

const tourSteps: TourConfig = {
  '/': [
    {
      id: 'welcome',
      title: 'Welcome to Omni Wellness Media',
      content: 'Let us show you around! This tour will help you discover all the amazing features we have to offer.',
      position: 'center'
    },
    {
      id: 'logo',
      title: 'Our Brand',
      content: 'This is our logo and brand identity. We\'re all about conscious content creation and positive change.',
      target: 'nav img',
      position: 'bottom'
    },
    {
      id: 'navigation',
      title: 'Main Navigation',
      content: 'Use these links to explore our services, read our blog, listen to our podcast, and more.',
      target: 'nav [role="navigation"]',
      position: 'bottom'
    },
    {
      id: 'platforms',
      title: 'Wellness Platforms',
      content: 'Click on "Platforms" to discover our wellness ecosystem including 2BeWell and Wellness Exchange.',
      target: '[data-tour="platforms"]',
      position: 'bottom'
    },
    {
      id: 'cta',
      title: 'Get Started',
      content: 'Ready to begin your wellness journey? Click here to explore our services or try our AI tools.',
      target: '[data-tour="hero-cta"]',
      position: 'top'
    }
  ],
  '/services': [
    {
      id: 'services-overview',
      title: 'Our Services',
      content: 'Here you can explore all our professional services from content creation to business consulting.',
      position: 'center'
    },
    {
      id: 'service-cards',
      title: 'Service Categories',
      content: 'Each card represents a different service category. Click on any card to learn more details.',
      target: '.grid .group:first-child',
      position: 'right'
    }
  ],
  '/wellness-exchange': [
    {
      id: 'wellness-exchange-intro',
      title: 'Wellness Exchange',
      content: 'Welcome to our revolutionary wellness marketplace where you can trade services using WellCoins!',
      position: 'center'
    },
    {
      id: 'marketplace',
      title: 'Browse Services',
      content: 'Browse wellness services offered by verified practitioners in our community.',
      target: '[data-tour="marketplace-link"]',
      position: 'bottom'
    },
    {
      id: 'post-want',
      title: 'Post Your Needs',
      content: 'Need something specific? Post a "want" and let practitioners come to you with proposals.',
      target: '[data-tour="post-want"]',
      position: 'bottom'
    }
  ]
};

export const useAppTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user has seen the tour for this page
    const tourKey = `tour-seen-${location.pathname}`;
    const seen = localStorage.getItem(tourKey);
    setHasSeenTour(!!seen);
    
    // Auto-start tour for new users on homepage
    if (location.pathname === '/' && !seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // Start after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const startTour = () => {
    setIsOpen(true);
  };

  const completeTour = () => {
    const tourKey = `tour-seen-${location.pathname}`;
    localStorage.setItem(tourKey, 'true');
    setHasSeenTour(true);
    setIsOpen(false);
  };

  const skipTour = () => {
    const tourKey = `tour-seen-${location.pathname}`;
    localStorage.setItem(tourKey, 'true');
    setHasSeenTour(true);
    setIsOpen(false);
  };

  const getCurrentSteps = () => {
    return tourSteps[location.pathname] || [];
  };

  const resetTour = () => {
    const tourKey = `tour-seen-${location.pathname}`;
    localStorage.removeItem(tourKey);
    setHasSeenTour(false);
  };

  return {
    isOpen,
    hasSeenTour,
    steps: getCurrentSteps(),
    startTour,
    completeTour,
    skipTour,
    resetTour
  };
};