import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartProductImage } from './SmartProductImage';
import { Heart, Share2, Eye, Zap } from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { useState } from 'react';
import { isNewProduct, hasHighCommission } from '@/lib/productUtils';

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
    created_at?: string;
  };
  onFavoriteToggle?: (productId: string) => void;
  isFavorite?: boolean;
  onQuickView?: (productId: string) => void;
}

export const PremiumProductCard = ({ 
  product, 
  onFavoriteToggle,
  isFavorite = false,
  onQuickView 
}: PremiumProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/cj-products/${product.id}`}>
          <SmartProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            className="w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 space-y-1 z-10">
          {isNewProduct(product.created_at) && (
            <Badge className="bg-green-600 text-white shadow-md">
              🆕 New
            </Badge>
          )}
          {product.commission_rate && hasHighCommission(product.commission_rate) && (
            <Badge className="bg-orange-600 text-white shadow-md">
              <Zap className="w-3 h-3 mr-1" />
              High Commission
            </Badge>
          )}
        </div>
        
        {/* Brand Badge */}
        {product.advertiser_name && (
          <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur z-10 shadow-md">
            {product.advertiser_name}
          </Badge>
        )}
        
        {/* Quick Actions Bar - appears on hover */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="flex gap-2 justify-center">
            {onQuickView && (
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 bg-white/90 hover:bg-white text-black"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product.id);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Quick View
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle?.(product.id);
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
            >
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
