import React from 'react';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import { Loader2 } from 'lucide-react';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'USD',
  className = '',
  showOriginal = false,
  size = 'md'
}) => {
  const { convertToZAR, formatZAR, isLoading } = useCurrencyConverter();

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin mr-1" />
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const zarAmount = currency === 'ZAR' || currency === 'R' ? amount : convertToZAR(amount, currency);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <span className="font-semibold text-green-600">
        {formatZAR(zarAmount)}
      </span>
      {showOriginal && currency !== 'ZAR' && currency !== 'R' && (
        <span className="text-xs text-muted-foreground ml-1">
          ({currency} {amount})
        </span>
      )}
    </div>
  );
};

// Utility component for inline pricing
export const InlinePrice: React.FC<{ amount: number; currency?: string; className?: string }> = ({
  amount,
  currency = 'USD',
  className = ''
}) => {
  const { convertToZAR, formatZAR, isLoading } = useCurrencyConverter();

  if (isLoading) return <span className={className}>R...</span>;

  const zarAmount = currency === 'ZAR' || currency === 'R' ? amount : convertToZAR(amount, currency);
  return <span className={className}>{formatZAR(zarAmount)}</span>;
};