import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image3D {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarousel3DProps {
  images: Image3D[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

const ImageCarousel3D: React.FC<ImageCarousel3DProps> = ({
  images,
  autoPlay = true,
  autoPlayDelay = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const interval = setInterval(goToNext, autoPlayDelay);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, goToNext, images.length]);

  return (
    <div className="relative w-full max-w-7xl mx-auto aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-muted">
      {/* Images — only render current and adjacent for performance */}
      {images.map((image, index) => {
        const isCurrent = index === currentIndex;
        const isAdjacent = Math.abs(index - currentIndex) === 1
          || (currentIndex === 0 && index === images.length - 1)
          || (currentIndex === images.length - 1 && index === 0);

        if (!isCurrent && !isAdjacent) return null;

        return (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              opacity: isCurrent ? 1 : 0,
              zIndex: isCurrent ? 10 : 5,
              transition: 'opacity 0.6s ease-in-out',
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={isCurrent ? "eager" : "lazy"}
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
                <p className="text-white text-sm sm:text-base font-medium">{image.caption}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2.5 rounded-full transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2.5 rounded-full transition-colors"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel3D;
