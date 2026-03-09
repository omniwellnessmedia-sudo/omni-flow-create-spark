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
      content: 'Your gateway to conscious wellness experiences across South Africa. We bridge wellness, outreach, and media to empower your journey to health and consciousness.',
      position: 'center'
    },
    {
      id: 'services',
      title: 'Our Professional Services',
      content: 'From media production and content creation to business consulting and web development - we help conscious brands tell their stories and grow sustainably.',
      position: 'center',
      action: {
        label: 'View Services',
        link: '/services'
      }
    },
    {
      id: 'partners',
      title: 'Our Partner Network',
      content: 'We collaborate with incredible organizations including 2BeWell, APEX Advocacy, Cart Horse Protection, UWC, Valley of Plenty, and many more conscious businesses across South Africa.',
      position: 'center',
      action: {
        label: 'Meet Our Partners',
        link: '/about'
      }
    },
    {
      id: 'retreat',
      title: '4th Annual Omni Wellness Retreat',
      content: 'Join our flagship wellness retreat featuring wine country exploration, nature immersion, and transformative wellness experiences at the beautiful Greyton Eco Lodge.',
      position: 'center',
      action: {
        label: 'Explore Retreat',
        link: '/tour-detail/winter-wine-country-wellness'
      }
    },
    {
      id: 'cave-tour',
      title: 'Great Mother Cave Tour',
      content: 'Experience a sacred indigenous journey with Chief Kingsley exploring ancient rock art, medicinal plants, and the spiritual heritage of the First People of the Cape.',
      position: 'center',
      action: {
        label: 'Discover the Cave',
        link: '/tours/great-mother-cave-tour'
      }
    },
    {
      id: 'programs',
      title: 'UWC Human-Animal Program',
      content: 'A pioneering academic programme combining animal-assisted therapy research, indigenous knowledge, and community wellness with partners like Cart Horse Protection and TUFCAT.',
      position: 'center',
      action: {
        label: 'Learn More',
        link: '/programs/uwc-human-animal'
      }
    },
    {
      id: 'shop',
      title: 'ROAM eSIM Store',
      content: 'Stay connected on your wellness journeys with curated eSIM plans and explore our wellness-centered product recommendations from trusted partners.',
      position: 'center',
      action: {
        label: 'Browse Store',
        link: '/roambuddy-store'
      }
    },
    {
      id: 'complete',
      title: 'Ready to Begin Your Journey?',
      content: 'Explore our services, book a retreat, or connect with us to start your conscious wellness journey. We\'re here to help you transform and thrive.',
      position: 'center',
      action: {
        label: 'Get in Touch',
        link: '/contact'
      }
    }
  ],
  '/services': [
    {
      id: 'services-overview',
      title: 'Our Services',
      content: 'Explore our comprehensive suite of services from content creation and media production to business consulting and web development.',
      position: 'center'
    }
  ],
  '/travel-well-connected-store': [
    {
      id: 'store-intro',
      title: 'Travel Well Connected',
      content: 'Browse curated wellness experiences and stay connected with eSIM plans designed for conscious travelers.',
      position: 'center'
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