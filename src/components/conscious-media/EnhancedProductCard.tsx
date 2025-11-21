import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Quote, CheckCircle2 } from "lucide-react";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { EnhancedProduct, curatorProfiles } from "@/data/consciousMediaProducts";

interface EnhancedProductCardProps {
  product: EnhancedProduct;
}

export const EnhancedProductCard = ({ product }: EnhancedProductCardProps) => {
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();
  const curator = curatorProfiles[product.curator];

  const handleClick = async () => {
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

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {curator.name}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {product.skillLevel}
          </Badge>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-foreground line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Curator Quote */}
        <div className="bg-primary/5 border-l-4 border-primary p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary mb-1">
                {curator.name} says:
              </p>
              <p className="text-sm text-foreground/90 italic line-clamp-3">
                {product.curatorQuote}
              </p>
            </div>
          </div>
        </div>

        {/* Why You Need This */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Why You Need This
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {product.whyYouNeedThis}
          </p>
        </div>

        {/* Perfect For */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Perfect For
          </p>
          <div className="space-y-1">
            {product.perfectFor.slice(0, 3).map((use, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground/70">{use}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleClick}
          className="w-full mt-auto"
          size="lg"
        >
          View on CameraStuff
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>

        {/* Sales Funnel CTA */}
        {product.salesFunnelCTA && (
          <p className="text-xs text-center text-muted-foreground italic">
            {product.salesFunnelCTA}
          </p>
        )}
      </div>
    </Card>
  );
};
