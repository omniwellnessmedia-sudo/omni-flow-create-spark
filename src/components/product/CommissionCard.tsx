import { TrendingUp, Calculator } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CommissionCardProps {
  price: number;
  commissionRate: number;
  currency?: 'ZAR' | 'USD' | 'EUR';
}

export const CommissionCard = ({ 
  price, 
  commissionRate,
  currency = 'ZAR' 
}: CommissionCardProps) => {
  const commissionAmount = price * commissionRate;
  const currencySymbol = currency === 'ZAR' ? 'R' : currency === 'USD' ? '$' : '€';

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Your Commission</h3>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {currencySymbol}{commissionAmount.toFixed(2)}
              </p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-help">
                  <Calculator className="w-3 h-3 mr-1" />
                  {(commissionRate * 100).toFixed(0)}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Commission Breakdown</p>
                  <p>Product Price: {currencySymbol}{price.toFixed(2)}</p>
                  <p>Commission Rate: {(commissionRate * 100).toFixed(1)}%</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    You Earn: {currencySymbol}{commissionAmount.toFixed(2)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Per sale</span>
            <span className="font-medium">{currencySymbol}{commissionAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>10 sales</span>
            <span className="font-medium text-foreground">{currencySymbol}{(commissionAmount * 10).toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>50 sales</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {currencySymbol}{(commissionAmount * 50).toFixed(0)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-emerald-500/20">
          <p className="text-xs text-muted-foreground text-center">
            💰 High commission rate • 🚀 Fast approval • 💯 Reliable tracking
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
