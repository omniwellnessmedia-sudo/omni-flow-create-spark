import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

export const ImagePreloader = ({ images, priority = false }: ImagePreloaderProps) => {
  useEffect(() => {
    const preloadImages = async () => {
      // Preload images in batches to avoid overwhelming the browser
      const batchSize = priority ? 3 : 1;
      
      for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(src => {
            if (!src) return Promise.resolve();
            
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve; // Still resolve on error to continue with other images
              img.src = src;
              
              // Set loading priority
              if (priority) {
                img.loading = 'eager';
              }
            });
          })
        );
        
        // Small delay between batches for non-priority images
        if (!priority && i + batchSize < images.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };

    if (images.length > 0) {
      preloadImages();
    }
  }, [images, priority]);

  return null;
};

export default ImagePreloader;