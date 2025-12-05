import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface CurrencyToggleProps {
  currency: 'USD' | 'ZAR';
  onCurrencyChange: (currency: 'USD' | 'ZAR') => void;
}

export const CurrencyToggle = ({ currency, onCurrencyChange }: CurrencyToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={currency === 'USD' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCurrencyChange('USD')}
        className="h-8 px-3 text-xs font-medium"
      >
        <DollarSign className="h-3 w-3 mr-1" />
        USD
      </Button>
      <Button
        variant={currency === 'ZAR' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCurrencyChange('ZAR')}
        className="h-8 px-3 text-xs font-medium"
      >
        R ZAR
      </Button>
    </div>
  );
};
