import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    link: string;
  };
}

interface TourConfig {
  [key: string]: TourStep[];
}

const tourSteps: TourConfig = {
  '/': [
    {
      id: 'welcome',
      title: 'Welcome to Omni Wellness Media!',
      content: 'Your gateway to conscious wellness experiences across South Africa. Let\'s explore how our platform can transform your wellness journey and connect you with our thriving community.',
      position: 'center'
    },
    {
      id: 'mission',
      title: 'Our Mission & Vision',
      content: 'We\'re bridging wellness, outreach, and media to empower South Africa\'s journey to health and consciousness. Discover our four content pillars: Inspiration, Education, Empowerment, and Wellness.',
      target: '[data-tour="mission"]',
      position: 'bottom'
    },
    {
      id: 'services',
      title: 'Wellness Services & Exchange',
      content: 'Discover our revolutionary wellness marketplace where you can find authentic practitioners, book services, and earn WellCoins. Connect with verified wellness professionals across South Africa.',
      target: '[data-tour="services"]',
      position: 'top',
      action: {
        label: 'Browse Services',
        link: '/wellness-exchange'
      }
    },
    {
      id: 'tours',
      title: 'Immersive Wellness Journeys',
      content: 'Join curated wellness retreats and adventures across Cape Town, wine country, and beyond. Each experience includes seamless eSIM connectivity for worry-free travel.',
      target: '[data-tour="tours"]',
      position: 'top',
      action: {
        label: 'Explore Tours',
        link: '/tours-retreats'
      }
    },
    {
      id: 'ai-tools',
      title: 'AI-Powered Wellness Tools',
      content: 'Access cutting-edge AI tools designed for wellness practitioners and conscious businesses. Create content, analyze impact, and optimize your wellness offerings.',
      target: '[data-tour="ai-tools"]',
      position: 'top',
      action: {
        label: 'Try AI Tools',
        link: '/ai-tools'
      }
    },
    {
      id: 'community',
      title: 'Join Our Conscious Community',
      content: 'Connect with like-minded individuals, share insights, and contribute to our growing wellness community. Explore our blog, participate in discussions, and build meaningful connections.',
      target: '[data-tour="community"]',
      position: 'top',
      action: {
        label: 'Join Community',
        link: '/wellness-community'
      }
    },
    {
      id: 'complete',
      title: 'Ready to Begin Your Journey?',
      content: 'You\'re all set to explore the Omni Wellness ecosystem! Start by browsing our wellness exchange, booking a transformative tour, or trying our AI tools. Your conscious wellness journey awaits.',
      position: 'center',
      action: {
        label: 'Get Started',
        link: '/wellness-exchange'
      }
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
    
    // Auto-start tour for new users on homepage with longer delay
    if (location.pathname === '/' && !seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // Start after 10 seconds to allow exploration
      
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