import React from 'react';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import { Badge } from '@/components/ui/badge';

interface PriceDisplayProps {
  price: number;
  showBothCurrencies?: boolean;
  primaryCurrency?: 'ZAR' | 'USD';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  showBothCurrencies = true,
  primaryCurrency = 'ZAR',
  className = '',
  size = 'md'
}) => {
  const { formatZAR, formatUSD, convertZARToUSD, isLoading } = useCurrencyConverter();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-muted rounded w-20"></div>
      </div>
    );
  }

  const zarPrice = price;
  const usdPrice = convertZARToUSD(price);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const primaryPrice = primaryCurrency === 'USD' ? usdPrice : zarPrice;
  const secondaryPrice = primaryCurrency === 'USD' ? zarPrice : usdPrice;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`font-bold text-primary ${sizeClasses[size]}`}>
        {primaryCurrency === 'USD' ? formatUSD(primaryPrice) : formatZAR(primaryPrice)}
      </div>
      
      {showBothCurrencies && (
        <Badge variant="secondary" className="text-xs">
          {primaryCurrency === 'USD' ? formatZAR(secondaryPrice) : formatUSD(secondaryPrice)}
        </Badge>
      )}
    </div>
  );
};