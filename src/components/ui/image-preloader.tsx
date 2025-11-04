import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

export const ImagePreloader = ({ images, priority = false }: ImagePreloaderProps) => {
  useEffect(() => {
    // Use Intersection Observer for lazy loading non-priority images
    if (!priority && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              imageObserver.unobserve(img);
            }
          }
        });
      });

      return () => imageObserver.disconnect();
    }

    // Preload priority images immediately
    if (priority) {
      images.forEach((src) => {
        if (src) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
        }
      });
    }
  }, [images, priority]);

  return null;
};

export default ImagePreloader;