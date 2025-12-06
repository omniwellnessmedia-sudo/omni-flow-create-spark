import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeaceOfMindScore } from "./PeaceOfMindScore";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { Globe, Award, Shield, Wifi, Signal, DollarSign, RefreshCw } from "lucide-react";

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
  selectedCurrency?: 'USD' | 'ZAR';
  onCurrencyChange?: (currency: 'USD' | 'ZAR') => void;
  showCurrencyToggle?: boolean;
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
  selectedCurrency = 'USD',
  onCurrencyChange,
  showCurrencyToggle = true,
  onSelect
}: RoamBuddyProductCardProps) => {
  const { formatZAR, formatUSD, convertZARToUSD, exchangeRates } = useCurrencyConverter();
  
  // Local currency state for this card
  const [localCurrency, setLocalCurrency] = useState<'USD' | 'ZAR'>(selectedCurrency);
  
  const handleCurrencyToggle = () => {
    const newCurrency = localCurrency === 'USD' ? 'ZAR' : 'USD';
    setLocalCurrency(newCurrency);
    onCurrencyChange?.(newCurrency);
  };

  // Calculate display prices based on whether price is already in USD
  const displayPriceUSD = priceIsUSD ? price : convertZARToUSD(price);
  const displayPriceZAR = priceIsUSD ? price * (exchangeRates?.USD || 18.50) : price;

  // Get country code display
  const getCountryCodeDisplay = (countryCode?: string): string => {
    if (!countryCode) return 'GLOBAL';
    return countryCode.toUpperCase();
  };

  // Get region-based gradient for visual variety
  const getRegionGradient = (countryCode?: string): string => {
    if (!countryCode) return 'from-purple-600 via-violet-600 to-indigo-600'; // Global
    
    const code = countryCode.toUpperCase();
    
    // Africa - Warm earth tones
    if (['ZA', 'KE', 'NG', 'EG', 'MA', 'TZ', 'ET', 'GH'].includes(code)) {
      return 'from-amber-600 via-orange-600 to-red-600';
    }
    
    // Europe - Cool blues and purples
    if (['FR', 'DE', 'GB', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'PT'].includes(code)) {
      return 'from-blue-600 via-indigo-600 to-purple-600';
    }
    
    // Asia - Greens and teals
    if (['JP', 'CN', 'TH', 'IN', 'SG', 'KR', 'MY', 'ID', 'VN', 'PH'].includes(code)) {
      return 'from-emerald-600 via-teal-600 to-cyan-600';
    }
    
    // Americas - Vibrant mix
    if (['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE'].includes(code)) {
      return 'from-rose-600 via-pink-600 to-fuchsia-600';
    }
    
    // Middle East - Gold and amber
    if (['AE', 'SA', 'QA', 'IL', 'TR', 'JO', 'LB'].includes(code)) {
      return 'from-yellow-600 via-amber-600 to-orange-600';
    }
    
    // Oceania - Ocean blues
    if (['AU', 'NZ', 'FJ'].includes(code)) {
      return 'from-sky-600 via-blue-600 to-cyan-600';
    }
    
    // Default
    return 'from-primary via-accent to-primary';
  };

  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background to-background/95">
      {/* Luxury Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      
      <div className="relative">
        {(isFeatured || isPopular) && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
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
        
        {/* Premium Travel-Themed Visual Area */}
        <div className={`aspect-[4/3] relative overflow-hidden bg-gradient-to-br ${getRegionGradient(primaryCountryCode)}`}>
          {/* Animated signal waves background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-white animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full border-2 border-white animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full border border-white animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
          
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Central connectivity icon with pulsing effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-full bg-white/20 animate-pulse" />
              <Wifi className="w-12 h-12 text-white relative z-10" />
            </div>
          </div>
          
          {/* Country code badge - top left */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/20 backdrop-blur-md text-white text-xl px-5 py-2 font-bold border border-white/30 shadow-xl">
              {getCountryCodeDisplay(primaryCountryCode)}
            </Badge>
          </div>
          
          {/* Signal strength indicator - top right */}
          <div className="absolute top-4 right-4">
            <Signal className="w-6 h-6 text-white/80" />
          </div>
          
          {/* Data amount overlay - bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
            <div className="flex items-baseline gap-3">
              <p className="text-white text-3xl font-bold">{dataAmount}</p>
              <p className="text-white/90 text-base font-medium">{validity}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
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
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Price</p>
                {showCurrencyToggle && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCurrencyToggle();
                    }}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors bg-background/80 px-2 py-1 rounded-full border border-primary/20 hover:border-primary/40"
                  >
                    <RefreshCw className="h-3 w-3" />
                    {localCurrency === 'USD' ? 'Show ZAR' : 'Show USD'}
                  </button>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-primary">
                  {localCurrency === 'USD' ? formatUSD(displayPriceUSD) : formatZAR(displayPriceZAR)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ≈ {localCurrency === 'USD' ? formatZAR(displayPriceZAR) : formatUSD(displayPriceUSD)}
                </p>
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
      </div>
    </Card>
  );
};
