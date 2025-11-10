import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartProductImage } from './SmartProductImage';
import { Heart, Share2, Eye, Zap, GitCompare } from 'lucide-react';
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
  onAddToCompare?: (productId: string) => void;
}

export const PremiumProductCard = ({ 
  product, 
  onFavoriteToggle,
  isFavorite = false,
  onQuickView,
  onAddToCompare
}: PremiumProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="card-product group relative overflow-hidden hover-lift shadow-soft"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link to={`/cj-products/${product.id}`}>
          <SmartProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Top Badges - Modern Styling */}
        <div className="absolute top-3 left-3 space-y-2 z-10">
          {isNewProduct(product.created_at) && (
            <Badge className="badge-modern bg-omni-green text-white shadow-elegant border-0">
              ✨ New
            </Badge>
          )}
          {product.commission_rate && hasHighCommission(product.commission_rate) && (
            <Badge className="badge-modern bg-omni-orange text-white shadow-elegant border-0">
              <Zap className="w-3 h-3 mr-1" />
              High Commission
            </Badge>
          )}
        </div>
        
        {/* Brand Badge - Glassmorphism */}
        {product.advertiser_name && (
          <Badge className="badge-modern absolute top-3 right-3 glass-card text-foreground z-10">
            {product.advertiser_name}
          </Badge>
        )}
        
        {/* Quick Actions Bar - Glassmorphism on hover */}
        <div 
          className={`absolute bottom-0 left-0 right-0 glass-card border-t border-border/50 p-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
          }`}
        >
          <div className="flex gap-2 justify-center">
            {onQuickView && (
              <Button
                size="sm"
                variant="default"
                className="flex-1 shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product.id);
                }}
              >
                <Eye className="w-4 h-4 mr-1.5" />
                Quick View
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle?.(product.id);
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            {onAddToCompare && (
              <Button
                size="sm"
                variant="outline"
                className="shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCompare(product.id);
                }}
              >
                <GitCompare className="w-4 h-4" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              className="shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content - Improved Spacing & Typography */}
      <CardContent className="p-5 space-y-3">
        {/* Category Badge */}
        <Badge variant="outline" className="text-xs font-medium">
          {product.category}
        </Badge>

        {/* Product Title - Better Typography */}
        <Link to={`/cj-products/${product.id}`}>
          <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors min-h-[3rem] leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price - Enhanced Design */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-2xl font-bold text-foreground">
            R{product.price_zar.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            ${product.price_usd.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart - Modern Button */}
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
          className="w-full shadow-sm"
          size="default"
        />
      </CardContent>
    </Card>
  );
};
