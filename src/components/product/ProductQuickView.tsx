import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SmartProductImage } from './SmartProductImage';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { ExternalLink, Share2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatCommission, hasHighCommission, isNewProduct } from '@/lib/productUtils';

interface ProductQuickViewProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  price_zar: number;
  price_usd: number;
  price_eur: number;
  commission_rate: number;
  affiliate_url: string;
  affiliate_program_id: string;
  advertiser_name?: string;
  brand_logo_url?: string;
  created_at?: string;
}

export const ProductQuickView = ({ productId, isOpen, onClose }: ProductQuickViewProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (productId && isOpen) {
      fetchProduct();
    }
  }, [productId, isOpen]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/cj-products/${productId}`;
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Product link copied to clipboard',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-0">
            <Skeleton className="aspect-square w-full" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
              <SmartProductImage
                src={product.image_url}
                alt={product.name}
                category={product.category}
                className="w-full h-full"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {isNewProduct(product.created_at) && (
                  <Badge className="bg-green-600 text-white">New</Badge>
                )}
                {hasHighCommission(product.commission_rate) && (
                  <Badge className="bg-orange-600 text-white">High Commission</Badge>
                )}
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold leading-tight">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>

                {product.advertiser_name && (
                  <p className="text-sm text-muted-foreground mt-2">
                    by {product.advertiser_name}
                  </p>
                )}
              </div>

              {/* Price & Commission */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    R{product.price_zar.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground">
                    ${product.price_usd.toFixed(2)}
                  </span>
                </div>
                
                <Badge variant="secondary" className="text-sm">
                  💰 Earn {formatCommission(product.price_zar, product.commission_rate)} commission
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About this product</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Quality wellness product</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Supports community programs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>Secure payment processing</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
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
                  size="lg"
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Store
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  asChild
                >
                  <a href={`/cj-products/${product.id}`}>
                    View Full Details →
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
