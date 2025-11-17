import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp } from "lucide-react";
import { affiliateManager } from "@/services/AffiliateManager";
import { toast } from "sonner";

interface AffiliateProduct {
  id: string;
  affiliate_program_id: string;
  external_product_id: string;
  name: string;
  description: string | null;
  price_usd: number | null;
  price_zar: number | null;
  price_eur: number | null;
  commission_rate: number | null;
  category: string | null;
  image_url: string | null;
  affiliate_url: string;
  is_active: boolean;
}

interface AffiliateProductCardProps {
  product: AffiliateProduct;
  currency?: 'USD' | 'ZAR' | 'EUR';
}

export const AffiliateProductCard = ({ product, currency = 'ZAR' }: AffiliateProductCardProps) => {
  const getPrice = () => {
    if (currency === 'USD' && product.price_usd) return `$${product.price_usd.toFixed(2)}`;
    if (currency === 'EUR' && product.price_eur) return `€${product.price_eur.toFixed(2)}`;
    if (currency === 'ZAR' && product.price_zar) return `R${product.price_zar.toFixed(2)}`;
    return 'Price varies';
  };

  const getCommissionBadge = () => {
    if (!product.commission_rate) return null;
    const percentage = (product.commission_rate * 100).toFixed(0);
    return (
      <Badge variant="secondary" className="gap-1">
        <TrendingUp className="h-3 w-3" />
        Earn {percentage}%
      </Badge>
    );
  };

  const handleShopNow = async () => {
    try {
      // Track the click
      await affiliateManager.trackClick(
        product.affiliate_program_id,
        product.affiliate_url,
        window.location.href
      );

      // Open affiliate link in new tab
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
      
      toast.success('Redirecting to partner site...', {
        description: 'Your commission will be tracked automatically!'
      });
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
      // Still open the link even if tracking fails
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="space-y-2">
        <div className="aspect-video w-full overflow-hidden rounded-md bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🎁</div>
              <p className="text-sm text-muted-foreground font-medium">
                {product.category || 'Product'}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
          {getCommissionBadge()}
        </div>
        {product.category && (
          <Badge variant="outline" className="w-fit">
            {product.category}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        {product.description && (
          <CardDescription className="line-clamp-3">
            {product.description}
          </CardDescription>
        )}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between gap-4">
        <div className="text-2xl font-bold">{getPrice()}</div>
        <Button onClick={handleShopNow} className="gap-2">
          Shop & Earn
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
