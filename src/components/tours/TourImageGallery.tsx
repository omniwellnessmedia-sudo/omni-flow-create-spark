import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface TourImageGalleryProps {
  images: GalleryImage[];
  title?: string;
}

const TourImageGallery = ({ images, title = "Journey Gallery" }: TourImageGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  if (images.length === 0) return null;

  return (
    <>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-medium tracking-widest uppercase text-primary text-center mb-3">Visual journey</p>
            <h2 className="font-heading text-3xl mb-10 text-center">{title}</h2>

            {/* Asymmetric grid — editorial magazine layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
              {images.map((image, index) => {
                // First image spans 2 cols + 2 rows for hero treatment
                const isHero = index === 0;
                const isTall = index === 3 || index === 5;
                const isWide = index === 2;

                return (
                  <button
                    key={index}
                    onClick={() => openLightbox(index)}
                    className={`relative overflow-hidden rounded-xl group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isHero ? 'col-span-2 row-span-2' :
                      isTall ? 'row-span-2' :
                      isWide ? 'col-span-2' : ''
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50"
            aria-label="Close gallery"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
            className="absolute left-4 text-white/50 hover:text-white p-3 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
            className="absolute right-4 text-white/50 hover:text-white p-3 z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
            {images[activeIndex].caption && (
              <p className="text-white/80 text-center mt-4 text-sm">{images[activeIndex].caption}</p>
            )}
            <p className="text-white/40 text-center mt-2 text-xs">
              {activeIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TourImageGallery;
