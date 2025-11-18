import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lightbulb } from "lucide-react";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { useEffect } from "react";

interface CameraStuffProductCardProps {
  productName: string;
  productSlug: string;
  productImage: string;
  headline: string;
  subheading: string;
  description: string;
  consciousnessNarrative: string;
  useCases: string[];
  channel: string;
  ctaText: string;
  wellnessCategory?: string;
  consciousnessIntent?: string;
}

export const CameraStuffProductCard = ({
  productName,
  productSlug,
  productImage,
  headline,
  subheading,
  description,
  consciousnessNarrative,
  useCases,
  channel,
  ctaText,
  wellnessCategory,
  consciousnessIntent,
}: CameraStuffProductCardProps) => {
  const { generateAffiliateLink, trackProductView, trackAffiliateClick } = useConsciousAffiliate();

  useEffect(() => {
    trackProductView(productName, channel, consciousnessIntent);
  }, [productName, channel, consciousnessIntent]);

  const handleClick = async () => {
    const affiliateUrl = generateAffiliateLink({
      productSlug,
      channel,
      wellnessCategory,
      consciousnessIntent,
    });

    await trackAffiliateClick(
      productName,
      channel,
      affiliateUrl,
      consciousnessIntent,
      wellnessCategory
    );

    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
      {/* Product Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Card Content */}
      <div className="p-8 flex-1 flex flex-col gap-6">
        {/* Channel Badge */}
        <Badge variant="secondary" className="w-fit text-xs">
          {channel.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>

        {/* Headlines */}
        <div className="space-y-2">
          <h3 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            {headline}
          </h3>
          <p className="text-lg text-muted-foreground font-medium">{subheading}</p>
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed text-foreground/80">{description}</p>

        {/* Use Cases */}
        {useCases.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {useCases.map((useCase, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {useCase}
              </Badge>
            ))}
          </div>
        )}

        {/* Consciousness Narrative */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary mb-1">Why this matters:</p>
              <p className="text-sm leading-relaxed text-foreground/90">
                {consciousnessNarrative}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleClick}
          size="lg"
          className="w-full mt-auto group/btn"
        >
          {ctaText}
          <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
};
