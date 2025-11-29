import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeaceOfMindScore } from "./PeaceOfMindScore";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { Globe } from "lucide-react";

interface RoamBuddyProductCardProps {
  planName: string;
  destination?: string;
  dataAmount?: string;
  validity?: string;
  coverage?: string[];
  speed?: string;
  price?: number;
  peaceOfMindScore?: number;
  wellnessFeatures?: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  curatorNote?: string;
  onSelect?: () => void;
}

export const RoamBuddyProductCard = ({
  planName,
  destination,
  dataAmount,
  validity,
  coverage,
  speed = '4G/5G',
  price = 0,
  peaceOfMindScore = 85,
  wellnessFeatures = [],
  isFeatured = false,
  isPopular = false,
  curatorNote,
  onSelect
}: RoamBuddyProductCardProps) => {
  const { formatZAR, formatUSD, convertZARToUSD } = useCurrencyConverter();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group overflow-hidden">
      <div className="p-6 space-y-4">
        {(isFeatured || isPopular) && (
          <div className="flex gap-2">
            {isFeatured && (
              <Badge className="bg-yellow-500 text-black font-semibold">Editor's Pick</Badge>
            )}
            {isPopular && (
              <Badge className="bg-primary font-semibold">Popular</Badge>
            )}
          </div>
        )}
        
        {/* Product Image/Icon */}
        <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
          <Globe className="h-16 w-16 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground mb-1">{planName}</h3>
          {destination && (
            <p className="text-sm text-muted-foreground">{destination}</p>
          )}
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
          {coverage && coverage.length > 0 && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Coverage:</span>
              <p className="font-semibold text-foreground">{coverage.join(', ')}</p>
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

        {curatorNote && (
          <div className="bg-muted/50 p-3 rounded-lg text-xs italic text-muted-foreground">
            {curatorNote}
          </div>
        )}

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
