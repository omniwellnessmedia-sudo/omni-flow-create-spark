import { useState } from 'react';
import { SmartProductImage } from './SmartProductImage';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, X } from 'lucide-react';

interface ProductImageGalleryProps {
  imageUrl: string;
  productName: string;
  category: string;
  additionalImages?: string[];
}

export const ProductImageGallery = ({ imageUrl, productName, category, additionalImages = [] }: ProductImageGalleryProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(imageUrl);
  
  const allImages = [imageUrl, ...additionalImages].filter(Boolean);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image with Zoom */}
        <div className="relative aspect-square rounded-2xl overflow-hidden glass-card group">
          <SmartProductImage
            src={selectedImage}
            alt={productName}
            category={category}
            className="w-full h-full"
          />
          <Button
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 glass-button opacity-0 group-hover:opacity-100 transition-opacity"
            size="icon"
            variant="secondary"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === img 
                    ? 'border-primary shadow-lg' 
                    : 'border-transparent hover:border-muted'
                }`}
              >
                <SmartProductImage
                  src={img}
                  alt={`${productName} view ${index + 1}`}
                  category={category}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-5xl p-0 bg-black/95">
          <Button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 z-50"
            size="icon"
            variant="ghost"
          >
            <X className="w-4 h-4 text-white" />
          </Button>
          <div className="relative w-full h-[80vh]">
            <img
              src={selectedImage}
              alt={productName}
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
