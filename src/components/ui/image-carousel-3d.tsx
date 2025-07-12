import React, { useState, useEffect } from 'react';
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
  autoPlayDelay = 4000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto h-96 md:h-[700px] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 perspective-1000">
      {/* 3D Carousel Container */}
      <div className="relative w-full h-full preserve-3d">
        {images.map((image, index) => {
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);
          
          let transform = '';
          let opacity = 1;
          let zIndex = 10;
          
          if (offset === 0) {
            // Center image
            transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
            opacity = 1;
            zIndex = 20;
          } else if (offset === 1 || (offset === -(images.length - 1))) {
            // Right image
            transform = 'translateX(60%) translateZ(-200px) rotateY(-25deg) scale(0.85)';
            opacity = 0.7;
            zIndex = 15;
          } else if (offset === -1 || (offset === images.length - 1)) {
            // Left image
            transform = 'translateX(-60%) translateZ(-200px) rotateY(25deg) scale(0.85)';
            opacity = 0.7;
            zIndex = 15;
          } else if (absOffset === 2 || absOffset === images.length - 2) {
            // Far side images
            transform = offset > 0 
              ? 'translateX(120%) translateZ(-400px) rotateY(-45deg) scale(0.7)'
              : 'translateX(-120%) translateZ(-400px) rotateY(45deg) scale(0.7)';
            opacity = 0.4;
            zIndex = 10;
          } else {
            // Hidden images
            transform = 'translateX(200%) translateZ(-600px) rotateY(-60deg) scale(0.5)';
            opacity = 0;
            zIndex = 5;
          }

          return (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-700 ease-out cursor-pointer"
              style={{
                transform,
                opacity,
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              onClick={() => goToSlide(index)}
            >
              <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white p-2">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel3D;