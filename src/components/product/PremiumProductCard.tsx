import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartProductImage } from './SmartProductImage';
import { Heart, Share2, Eye } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { useState } from 'react';

interface PremiumProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    image_url: string;
    price_zar: number;
    price_usd: number;
    price_eur: number;
    commission_rate?: number;
    affiliate_url: string;
    affiliate_program_id: string;
    advertiser_name?: string;
    brand_logo_url?: string;
  };
  onFavoriteToggle?: (productId: string) => void;
  isFavorite?: boolean;
}

export const PremiumProductCard = ({ 
  product, 
  onFavoriteToggle,
  isFavorite = false 
}: PremiumProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/cj-products/${product.id}`}>
          <SmartProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            className="w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        
        {/* Brand Badge */}
        {product.advertiser_name && (
          <Badge className="absolute top-2 left-2 bg-background/90 backdrop-blur z-10">
            {product.advertiser_name}
          </Badge>
        )}
        
        {/* Quick Actions Bar - appears on hover */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              asChild
            >
              <Link to={`/cj-products/${product.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                Quick View
              </Link>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle?.(product.id);
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            </Button>
            <Button size="sm" variant="secondary">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Category Badge */}
        <Badge variant="outline" className="text-xs">
          {product.category}
        </Badge>

        {/* Product Title */}
        <Link to={`/cj-products/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            R{product.price_zar.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">
            ${product.price_usd.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart */}
        <AddToCartButton
          item={{
            id: product.id,
            title: product.name,
            price_zar: product.price_zar,
            price_usd: product.price_usd,
            price_eur: product.price_eur,
            image: product.image_url,
            category: product.category,
            item_type: 'affiliate',
            affiliate_url: product.affiliate_url,
            affiliate_program_id: product.affiliate_program_id,
            commission_rate: product.commission_rate,
          }}
          className="w-full"
          size="sm"
        />
      </CardContent>
    </Card>
  );
};
