import { useState } from 'react';
import { Package } from 'lucide-react';

interface SmartProductImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  fallbackType?: 'icon' | 'gradient';
}

export const SmartProductImage = ({
  src,
  alt,
  category = 'General',
  className = '',
  fallbackType = 'gradient'
}: SmartProductImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getCategoryGradient = (cat: string) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('yoga') || lowerCat.includes('meditation')) {
      return 'from-purple-400 via-pink-400 to-rose-400';
    }
    if (lowerCat.includes('nutrition') || lowerCat.includes('health')) {
      return 'from-green-400 via-emerald-400 to-teal-400';
    }
    if (lowerCat.includes('fitness') || lowerCat.includes('exercise')) {
      return 'from-orange-400 via-red-400 to-pink-400';
    }
    return 'from-blue-400 via-indigo-400 to-purple-400';
  };

  // Check for broken image URLs
  const isBrokenImage = src && (
    src.toLowerCase().includes('no_imaged') ||
    src.toLowerCase().includes('unavailable') ||
    src.toLowerCase().includes('coming-soon')
  );

  if (imageError || !src || isBrokenImage) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(category)}`}>
        <div className="text-center text-white">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-medium opacity-80">{category}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-muted`}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(category)} animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
