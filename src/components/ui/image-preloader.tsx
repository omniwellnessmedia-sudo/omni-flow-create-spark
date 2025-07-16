import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
}

export const ImagePreloader = ({ images }: ImagePreloaderProps) => {
  useEffect(() => {
    // Preload critical images
    images.forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [images]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;