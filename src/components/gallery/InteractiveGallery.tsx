import React, { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Expand, ZoomIn } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface InteractiveGalleryProps {
  images: GalleryImage[];
  className?: string;
  columns?: 3 | 4 | 5;
}

const InteractiveGallery: React.FC<InteractiveGalleryProps> = ({ 
  images, 
  className = '',
  columns = 4
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  const displayedImages = isExpanded ? images : images.slice(0, 8);
  
  const gridCols = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  };

  return (
    <div className={className}>
      {/* Gallery Grid */}
      <div className={`grid ${gridCols[columns]} gap-3 md:gap-4`}>
        {displayedImages.map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Tufcat%20and%20Carthorse/Sans%20titre-24.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                <ZoomIn className="w-5 h-5 text-primary" />
              </div>
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium truncate">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Show More / Less Button */}
      {images.length > 8 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full px-8 group hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Expand className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
            {isExpanded ? `Show Less` : `View All ${images.length} Photos`}
          </Button>
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-0 overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <DialogClose className="absolute top-4 right-4 z-50">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </DialogClose>

          {selectedIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 md:left-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-lg"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </Button>

              {/* Main Image */}
              <div className="relative max-w-full max-h-full">
                <img
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Tufcat%20and%20Carthorse/Sans%20titre-24.jpg';
                  }}
                />
                
                {/* Caption */}
                {images[selectedIndex].caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <p className="text-white text-center font-medium">{images[selectedIndex].caption}</p>
                  </div>
                )}
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-white font-medium">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden md:flex gap-2 max-w-[80vw] overflow-x-auto p-2 bg-black/50 backdrop-blur rounded-xl">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      idx === selectedIndex 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InteractiveGallery;
