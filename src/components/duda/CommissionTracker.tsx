import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteStats } from '@/hooks/useSiteStats';
import { Coins, DollarSign, TrendingUp } from 'lucide-react';

interface CommissionTrackerProps {
  siteName: string;
}

const CommissionTracker = ({ siteName }: CommissionTrackerProps) => {
  const { 
    stats,
    getTotalCommission,
    getTotalCommissionWellCoins,
    getPendingCommission,
  } = useSiteStats(siteName);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Coins className="w-4 h-4 text-purple-600" />
            Commission Earned (WellCoins)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            {getTotalCommissionWellCoins()} WC
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(getTotalCommission())} ZAR
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Pending Commission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(getPendingCommission())}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Awaiting approval
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            This Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {stats?.commission_earned_wellcoins || 0} WC
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(stats?.commission_earned_zar || 0)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionTracker;
