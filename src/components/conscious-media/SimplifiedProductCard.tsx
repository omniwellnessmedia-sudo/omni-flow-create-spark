import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { EnhancedProduct, curatorProfiles } from "@/data/consciousMediaProducts";

interface SimplifiedProductCardProps {
  product: EnhancedProduct;
  imagePosition?: 'left' | 'right';
}

export const SimplifiedProductCard = ({ product, imagePosition = 'left' }: SimplifiedProductCardProps) => {
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();
  const curator = curatorProfiles[product.curator];

  const handleViewProduct = async () => {
    const affiliateUrl = generateAffiliateLink({
      productSlug: product.productUrl.split('/products/')[1],
      channel: product.channel,
      wellnessCategory: "media equipment",
      consciousnessIntent: "conscious media infrastructure",
    });

    await trackAffiliateClick(
      product.name,
      product.channel,
      affiliateUrl,
      "conscious media infrastructure",
      "media equipment"
    );

    window.open(affiliateUrl, '_blank');
  };

  const containerClass = imagePosition === 'right' 
    ? "flex flex-col lg:flex-row-reverse gap-8 items-start"
    : "flex flex-col lg:flex-row gap-8 items-start";

  return (
    <div className="py-10 border-b border-border last:border-b-0">
      <div className={containerClass}>
        {/* Image */}
        <div className="w-full lg:w-[40%] flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[350px] object-contain rounded-lg bg-muted/30 p-6"
          />
        </div>

        {/* Content */}
        <div className="w-full lg:w-[60%] space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {curator.name}'s Pick
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {product.category.replace(/-/g, ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {product.skillLevel}
            </Badge>
          </div>

          {/* Product Name */}
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            {product.name}
          </h3>

          {/* Curator Quote */}
          <div className="bg-primary/5 border-l-4 border-primary p-4">
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
              {curator.name} recommends:
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {product.curatorQuote}
            </p>
          </div>

          {/* Why You Need This */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Why we chose this for you:
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.whyYouNeedThis}
            </p>
          </div>

          {/* Perfect For */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Perfect for:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.perfectFor.slice(0, 4).map((use, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {use}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={handleViewProduct}
              className="flex-1 min-w-[200px]"
            >
              View on CameraStuff
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[200px]"
              onClick={() => window.location.href = '/contact'}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Need Help Choosing?
            </Button>
          </div>

          {/* Sales Funnel CTA */}
          {product.salesFunnelCTA && (
            <p className="text-sm text-muted-foreground italic pt-2">
              💡 {product.salesFunnelCTA}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
