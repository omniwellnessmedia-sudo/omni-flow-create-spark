import { Button } from "@/components/ui/button";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";

interface FeaturedProductCardProps {
  audienceBadge: string;
  productName: string;
  priceRange: string;
  whatItIncludes: string;
  whyWeChose: string;
  whoShouldGet: string[];
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
  imageOnRight?: boolean;
}

export const FeaturedProductCard = ({
  audienceBadge,
  productName,
  priceRange,
  whatItIncludes,
  whyWeChose,
  whoShouldGet,
  ctaText,
  ctaLink,
  imageUrl,
  imageAlt,
  imageOnRight = false,
}: FeaturedProductCardProps) => {
  const { trackAffiliateClick } = useConsciousAffiliate();

  const handleClick = async () => {
    await trackAffiliateClick(
      productName,
      "conscious_media_infrastructure",
      ctaLink,
      "professional_equipment_recommendation"
    );
    window.open(ctaLink, "_blank");
  };

  const containerClass = imageOnRight
    ? "flex flex-col lg:flex-row-reverse gap-12 items-stretch"
    : "flex flex-col lg:flex-row gap-12 items-stretch";

  return (
    <div className="py-16 lg:py-20 px-10 lg:px-20 border-b border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className={containerClass}>
          {/* Product Image */}
          <div className="lg:w-[45%]">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-[600px] lg:h-[700px] object-contain bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-8"
            />
          </div>

          {/* Product Information */}
          <div className="lg:w-[55%] flex flex-col justify-center">
            <div className="inline-block mb-4">
              <span className="font-bold text-xs text-primary uppercase bg-purple-50 px-3 py-2 rounded-md">
                {audienceBadge}
              </span>
            </div>

            <h3 className="font-bold text-3xl lg:text-4xl text-foreground mb-4 leading-tight">
              {productName}
            </h3>

            <p className="font-bold text-xl lg:text-2xl text-primary mb-5">
              {priceRange}
            </p>

            <div className="mb-5">
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {whatItIncludes}
              </p>
            </div>

            <div className="mb-5">
              <p className="italic text-[15px] text-muted-foreground/80 leading-relaxed">
                {whyWeChose}
              </p>
            </div>

            <div className="mb-7">
              <ul className="space-y-2">
                {whoShouldGet.map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Button
                onClick={handleClick}
                className="bg-primary hover:bg-primary/90 text-white px-7 py-3 text-base font-bold rounded-md transition-colors"
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
