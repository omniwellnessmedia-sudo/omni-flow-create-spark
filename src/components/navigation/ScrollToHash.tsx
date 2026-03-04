import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToHash - Global component for handling hash-based navigation
 * Automatically scrolls to the target element when navigating to a URL with a hash
 */
export const ScrollToHash = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      // Small delay to ensure the DOM has rendered
      const timeoutId = setTimeout(() => {
        // Retry mechanism for lazy-loaded content
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      // If no hash, scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToHash;
