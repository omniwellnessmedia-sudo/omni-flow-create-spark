import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeaceOfMindScore } from "./PeaceOfMindScore";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

interface RoamBuddyProductCardProps {
  name: string;
  dataAmount?: string;
  validity?: string;
  coverage?: string;
  speed?: string;
  price?: number;
  peaceOfMindScore?: number;
  wellnessFeatures?: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
}

export const RoamBuddyProductCard = ({
  name,
  dataAmount,
  validity,
  coverage,
  speed = '5G',
  price = 0,
  peaceOfMindScore = 85,
  wellnessFeatures = [],
  isFeatured = false,
  isPopular = false,
  onSelect
}: RoamBuddyProductCardProps) => {
  const { formatZAR, formatUSD, convertZARToUSD } = useCurrencyConverter();

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {(isFeatured || isPopular) && (
        <div className="absolute top-4 right-4">
          <Badge variant={isFeatured ? "default" : "secondary"}>
            {isFeatured ? "Editor's Pick" : "Popular"}
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            📱 {name}
          </h3>
          <div className="border-t-2 border-primary/20 w-full"></div>
        </div>

        {peaceOfMindScore && (
          <PeaceOfMindScore score={peaceOfMindScore} />
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {dataAmount && (
            <div>
              <span className="text-muted-foreground">Data:</span>
              <p className="font-semibold text-foreground">{dataAmount}</p>
            </div>
          )}
          {validity && (
            <div>
              <span className="text-muted-foreground">Validity:</span>
              <p className="font-semibold text-foreground">{validity}</p>
            </div>
          )}
          {coverage && (
            <div>
              <span className="text-muted-foreground">Coverage:</span>
              <p className="font-semibold text-foreground">{coverage}</p>
            </div>
          )}
          {speed && (
            <div>
              <span className="text-muted-foreground">Speed:</span>
              <p className="font-semibold text-foreground">{speed}</p>
            </div>
          )}
        </div>

        {wellnessFeatures.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Wellness Features:</p>
            <div className="space-y-1">
              {wellnessFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600">✅</span>
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-primary/5 p-4 rounded-lg text-center space-y-1">
          <p className="text-2xl font-bold text-primary">
            {formatUSD(convertZARToUSD(price))} / {formatZAR(price)}
          </p>
        </div>

        <Button 
          onClick={onSelect}
          className="w-full"
          size="lg"
        >
          Get This Plan
        </Button>
      </div>
    </Card>
  );
};
