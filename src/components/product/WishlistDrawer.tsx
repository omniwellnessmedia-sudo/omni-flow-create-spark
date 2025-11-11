import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/useWishlist';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { X, Share2, ExternalLink, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SmartProductImage } from './SmartProductImage';

interface WishlistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WishlistProduct {
  id: string;
  name: string;
  price_zar: number;
  price_usd: number;
  commission_rate: number;
  image_url: string;
  category: string;
  affiliate_url: string;
}

export const WishlistDrawer = ({ open, onOpenChange }: WishlistDrawerProps) => {
  const { wishlistItems, toggleWishlist, loading } = useWishlist();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && wishlistItems.size > 0) {
      fetchWishlistProducts();
    }
  }, [open, wishlistItems]);

  const fetchWishlistProducts = async () => {
    setLoadingProducts(true);
    try {
      const productIds = Array.from(wishlistItems);
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .in('id', productIds);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
      toast({
        title: 'Error loading wishlist',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleShare = async () => {
    const productNames = products.map(p => p.name).join(', ');
    const shareText = `Check out my wellness wishlist: ${productNames}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wellness Wishlist',
          text: shareText,
          url: window.location.origin + '/wishlist',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied to clipboard',
        description: 'Wishlist copied to clipboard',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            My Wishlist
            <Badge variant="secondary" className="ml-auto">
              {wishlistItems.size}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading || loadingProducts ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading wishlist...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium mb-1">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mb-4">
                Save products you love to view later
              </p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share List
                </Button>
                <Link to="/wishlist" className="flex-1" onClick={() => onOpenChange(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <Link 
                      to={`/store/product/${product.id}`} 
                      className="flex-shrink-0"
                      onClick={() => onOpenChange(false)}
                    >
                      <SmartProductImage
                        src={product.image_url}
                        alt={product.name}
                        category={product.category}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/store/product/${product.id}`}
                        onClick={() => onOpenChange(false)}
                      >
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                      </Link>
                      
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-bold text-primary">
                          R{product.price_zar.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ${product.price_usd.toFixed(2)}
                        </span>
                      </div>

                      <Badge variant="secondary" className="mt-1 text-xs">
                        Earn R{Math.round(product.price_zar * product.commission_rate)}
                      </Badge>

                      <div className="flex gap-1 mt-2">
                        <Link to={`/store/product/${product.id}`} onClick={() => onOpenChange(false)}>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
