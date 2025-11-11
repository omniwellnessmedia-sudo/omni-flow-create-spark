import { Link } from 'react-router-dom';
import { Heart, Eye, Star, TrendingUp, Zap, Scale, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SmartProductImage } from './SmartProductImage';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWishlist } from '@/hooks/useWishlist';
import { useProductComparison } from '@/hooks/useProductComparison';
import { useUserRole } from '@/hooks/useUserRole';

interface TakealotProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    category: string;
    image_url: string;
    price_zar: number;
    price_usd?: number;
    commission_rate: number;
    is_featured?: boolean;
    is_trending?: boolean;
    rating?: number;
    review_count?: number;
    sale_price_zar?: number;
  };
  showQuickView?: boolean;
}

export const TakealotProductCard = ({ product, showQuickView = true }: TakealotProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToComparison, isInComparison } = useProductComparison();
  const { isAffiliate } = useUserRole();

  const discount = product.sale_price_zar 
    ? Math.round(((product.price_zar - product.sale_price_zar) / product.price_zar) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(product.id);
  };

  const handleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    addToComparison({
      id: product.id,
      name: product.name,
      category: product.category
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({ title: 'Quick view coming soon!' });
  };

  const displayPrice = product.sale_price_zar || product.price_zar;
  const commissionAmount = Math.round(displayPrice * product.commission_rate);

  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.is_featured && (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <Zap className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {product.is_trending && (
          <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="font-bold">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      {showQuickView && (
        <div className={`absolute top-2 right-2 z-10 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="secondary"
            size="icon"
            className={`bg-background/90 backdrop-blur-sm h-9 w-9 ${isInWishlist(product.id) ? 'text-primary' : ''}`}
            onClick={handleWishlist}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={`bg-background/90 backdrop-blur-sm h-9 w-9 ${isInComparison(product.id) ? 'text-primary' : ''}`}
            onClick={handleComparison}
            title="Add to comparison"
          >
            <Scale className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/90 backdrop-blur-sm h-9 w-9"
            onClick={handleQuickView}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Product Image */}
      <Link to={`/store/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-muted/30">
          <SmartProductImage
            src={product.image_url}
            alt={product.name}
            category={product.category}
            className={`w-full h-64 object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        </div>
      </Link>

      {/* Product Info */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link to={`/store/product/${product.id}`} className="flex-1">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium ml-1">{product.rating}</span>
              </div>
              {product.review_count && (
                <span className="text-xs text-muted-foreground">
                  ({product.review_count})
                </span>
              )}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors leading-snug mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {product.description}
            </p>
          )}
        </Link>

        {/* Pricing & Actions */}
        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-primary">
              R{displayPrice.toFixed(2)}
            </span>
            {product.sale_price_zar && (
              <span className="text-sm text-muted-foreground line-through">
                R{product.price_zar.toFixed(2)}
              </span>
            )}
            {product.price_usd && (
              <span className="text-xs text-muted-foreground ml-auto">
                ~${product.price_usd.toFixed(2)}
              </span>
            )}
          </div>

          {/* Commission Badge - Only for Affiliates */}
          {isAffiliate && (
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                Earn R{commissionAmount} ({(product.commission_rate * 100).toFixed(0)}%)
              </Badge>
            </div>
          )}

          {/* CTA Button */}
          <Link to={`/store/product/${product.id}`}>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {isAffiliate ? 'Get Affiliate Link' : 'View Product'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
