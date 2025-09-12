import React from 'react';
import { useEffect } from 'react';

// Mobile-specific optimizations and responsive enhancements
const MobileOptimizations: React.FC = () => {
  useEffect(() => {
    // Add responsive meta tags dynamically if not present
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }

    // Add mobile-specific CSS for better touch interactions
    const mobileStyles = document.createElement('style');
    mobileStyles.innerHTML = `
      /* Enhanced mobile responsiveness */
      @media (max-width: 768px) {
        /* Improve touch targets */
        button, .btn, .card, a[role="button"] {
          min-height: 44px !important;
          min-width: 44px !important;
          touch-action: manipulation;
        }

        /* Better spacing on mobile */
        .container {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }

        /* Improved grid layouts */
        .grid {
          gap: 1rem !important;
        }

        /* Better navigation on mobile */
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e2e8f0;
          z-index: 50;
          padding: 0.5rem;
        }

        /* Optimized forms */
        input, textarea, select {
          font-size: 16px !important; /* Prevents zoom on iOS */
          padding: 0.75rem !important;
        }

        /* Better modals on mobile */
        .modal-content {
          margin: 1rem !important;
          max-height: calc(100vh - 2rem) !important;
          overflow-y: auto;
        }

        /* Improved card layouts */
        .card-grid {
          grid-template-columns: 1fr !important;
        }

        .card-grid.two-cols {
          grid-template-columns: 1fr 1fr !important;
        }

        /* Better image handling */
        img {
          max-width: 100% !important;
          height: auto !important;
        }

        /* Improved typography */
        h1 {
          font-size: 2rem !important;
          line-height: 1.2 !important;
        }

        h2 {
          font-size: 1.5rem !important;
        }

        h3 {
          font-size: 1.25rem !important;
        }

        /* Better table handling */
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        table {
          min-width: 300px;
        }
      }

      /* Small mobile devices */
      @media (max-width: 480px) {
        .container {
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }

        .card-grid {
          gap: 0.5rem !important;
        }

        /* Stack hero content */
        .hero-content {
          text-align: center !important;
          padding: 2rem 1rem !important;
        }

        .hero-title {
          font-size: 1.75rem !important;
        }
      }

      /* Tablet responsive */
      @media (min-width: 769px) and (max-width: 1024px) {
        .tablet-two-cols {
          grid-template-columns: 1fr 1fr !important;
        }

        .tablet-three-cols {
          grid-template-columns: repeat(3, 1fr) !important;
        }
      }

      /* Enhanced accessibility on mobile */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .mobile-nav {
          background: #1a1a1a;
          border-color: #374151;
          color: white;
        }
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        button, .btn {
          border: 2px solid currentColor !important;
        }
      }
    `;
    document.head.appendChild(mobileStyles);

    // Add mobile-specific JavaScript optimizations
    const handleResize = () => {
      // Update CSS custom properties for viewport dimensions
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Handle orientation change
    const handleOrientationChange = () => {
      setTimeout(handleResize, 100); // Delay to get correct dimensions
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    handleResize(); // Initial call

    // Improve scroll performance
    const improveScrolling = () => {
      document.documentElement.style.webkitOverflowScrolling = 'touch';
    };
    improveScrolling();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.head.removeChild(mobileStyles);
    };
  }, []);

  return null; // This component only adds mobile optimizations, no UI
};

export default MobileOptimizations;