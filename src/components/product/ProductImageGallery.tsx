import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartProductImage } from './SmartProductImage';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  category: string;
}

export const ProductImageGallery = ({ images, productName, category }: ProductImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images.filter(img => img && img.length > 0);
  const displayImages = validImages.length > 0 ? validImages : [images[0]];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden group">
        <SmartProductImage
          src={displayImages[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          category={category}
          className="w-full h-full object-cover"
        />
        {displayImages.length > 1 && (
          <>
            <Button variant="secondary" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="secondary" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayImages.map((image, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 ${currentIndex === index ? 'border-primary' : 'border-transparent'}`}>
              <SmartProductImage src={image} alt={`${productName} thumbnail ${index + 1}`} category={category} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
