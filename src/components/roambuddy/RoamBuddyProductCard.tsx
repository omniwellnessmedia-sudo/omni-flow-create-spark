import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeaceOfMindScore } from "./PeaceOfMindScore";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { Globe, Award, Shield } from "lucide-react";

interface RoamBuddyProductCardProps {
  planName: string;
  destination?: string;
  dataAmount?: string;
  validity?: string;
  coverage?: string[];
  primaryCountryCode?: string;
  speed?: string;
  price?: number;
  priceIsUSD?: boolean;
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
  primaryCountryCode,
  speed = '4G/5G',
  price = 0,
  priceIsUSD = false,
  peaceOfMindScore = 85,
  wellnessFeatures = [],
  isFeatured = false,
  isPopular = false,
  curatorNote,
  onSelect
}: RoamBuddyProductCardProps) => {
  const { formatZAR, formatUSD, convertZARToUSD, exchangeRates } = useCurrencyConverter();

  // Calculate display prices based on whether price is already in USD
  const displayPriceUSD = priceIsUSD ? price : convertZARToUSD(price);
  const displayPriceZAR = priceIsUSD ? price * (exchangeRates?.USD || 18.50) : price;

  // Get country flag emoji
  const getCountryFlag = (countryCode?: string): string => {
    if (!countryCode) return '🌍';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-background to-background/95">
      {/* Luxury Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="relative p-8 space-y-6">
        {(isFeatured || isPopular) && (
          <div className="flex gap-2">
            {isFeatured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold shadow-lg border-0 px-4 py-1.5">
                <Award className="w-3 h-3 mr-1" />
                Editor's Pick
              </Badge>
            )}
            {isPopular && (
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-lg border-0 px-4 py-1.5">
                Popular Choice
              </Badge>
            )}
          </div>
        )}
        
        {/* Product Image/Icon - Enhanced with Country Flag */}
        <div className="relative w-full h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 rounded-xl flex flex-col items-center justify-center mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.2),transparent_70%)]" />
          <div className="relative text-6xl mb-2 group-hover:scale-110 transition-all duration-500">
            {getCountryFlag(primaryCountryCode)}
          </div>
          <Globe className="relative h-8 w-8 text-primary/60 group-hover:text-primary transition-all duration-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{planName}</h3>
          {destination && (
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {destination}
            </p>
          )}
        </div>

        {peaceOfMindScore && (
          <div className="transform group-hover:scale-105 transition-transform duration-300">
            <PeaceOfMindScore score={peaceOfMindScore} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 rounded-lg p-4">
          {dataAmount && (
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Data</span>
              <p className="font-bold text-foreground text-base">{dataAmount}</p>
            </div>
          )}
          {validity && (
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Validity</span>
              <p className="font-semibold text-foreground">{validity}</p>
            </div>
          )}
          {coverage && coverage.length > 0 && (
            <div className="col-span-2 space-y-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Coverage</span>
              <p className="font-semibold text-foreground text-sm">{coverage.slice(0, 3).join(', ')}{coverage.length > 3 ? ` +${coverage.length - 3} more` : ''}</p>
            </div>
          )}
          {speed && (
            <div className="col-span-2 space-y-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Speed</span>
              <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                {speed}
              </p>
            </div>
          )}
        </div>

        {wellnessFeatures.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Wellness Benefits</p>
            <ul className="space-y-2">
              {wellnessFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 space-y-4">
          <div className="flex items-baseline justify-between bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">From</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formatUSD(displayPriceUSD)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">or</p>
              <p className="text-lg font-semibold text-foreground/70">{formatZAR(displayPriceZAR)}</p>
            </div>
          </div>

          {curatorNote && (
            <div className="bg-primary/5 border-l-4 border-primary rounded-r p-4">
              <p className="text-xs italic text-foreground/80 leading-relaxed">"{curatorNote}"</p>
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold py-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
            onClick={onSelect}
          >
            Get This Plan
            <Globe className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
