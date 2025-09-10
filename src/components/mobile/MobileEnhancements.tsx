import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, Smartphone, Zap, Eye } from 'lucide-react';

// 2025 Mobile UX Enhancement Component
const MobileEnhancements: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Enhanced scroll behavior for mobile
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Add mobile-optimized CSS variables
    document.documentElement.style.setProperty('--mobile-safe-area-top', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--mobile-safe-area-bottom', 'env(safe-area-inset-bottom)');
    
    // Add touch-action optimization
    document.body.style.touchAction = 'manipulation';
    
    // Improve scroll performance on mobile
    if (isMobile) {
      document.body.style.webkitOverflowScrolling = 'touch';
      document.body.style.overscrollBehavior = 'contain';
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add haptic feedback for supported devices
  const addHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile-optimized floating scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={() => {
            scrollToTop();
            addHapticFeedback();
          }}
          size="lg"
          className="fixed bottom-20 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-omni-blue to-omni-purple hover:shadow-xl transition-all duration-300 border-2 border-white/20"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}

      {/* Mobile UX indicator for demo purposes */}
      <div className="fixed top-2 left-2 z-50 opacity-80">
        <Card className="p-2 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center space-x-1 text-xs">
            <Smartphone className="h-3 w-3 text-green-600" />
            <span className="text-green-800 font-medium">2025 Mobile UX</span>
          </div>
        </Card>
      </div>

      {/* Enhanced mobile styles injection */}
      <style jsx global>{`
        /* 2025 Mobile UX Enhancements */
        @media (max-width: 768px) {
          /* Better touch targets - minimum 44px */
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }

          /* Improved card hover states for touch */
          .hover\\:shadow-lg {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .hover\\:shadow-lg:active {
            transform: scale(0.98);
            transition-duration: 0.1s;
          }

          /* Better focus states for keyboard navigation */
          button:focus-visible,
          a:focus-visible,
          input:focus-visible {
            outline: 3px solid rgb(59, 130, 246);
            outline-offset: 2px;
          }

          /* Improved text readability */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-size-adjust: 100%;
          }

          /* Better spacing for mobile content */
          .container {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }

          /* Improved form inputs for mobile */
          input, textarea, select {
            font-size: 16px; /* Prevents zoom on iOS */
            border-radius: 8px;
          }

          /* Better mobile grid spacing */
          .grid {
            gap: 1rem;
          }

          /* Improved mobile navigation */
          nav {
            padding-top: env(safe-area-inset-top);
            backdrop-filter: blur(10px);
          }

          /* Enhanced mobile cards */
          .card {
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          /* Better mobile typography */
          h1 { font-size: clamp(1.75rem, 5vw, 2.5rem); }
          h2 { font-size: clamp(1.5rem, 4vw, 2rem); }
          h3 { font-size: clamp(1.25rem, 3vw, 1.5rem); }

          /* Improved mobile scrolling */
          * {
            scroll-behavior: smooth;
          }

          /* Enhanced mobile animation performance */
          * {
            will-change: auto;
          }

          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }

        /* Dark mode support for mobile */
        @media (prefers-color-scheme: dark) and (max-width: 768px) {
          .card {
            background-color: rgba(31, 41, 55, 0.8);
            border-color: rgba(75, 85, 99, 0.5);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          button, .card {
            border: 2px solid currentColor;
          }
        }
      `}</style>
    </>
  );
};

export default MobileEnhancements;