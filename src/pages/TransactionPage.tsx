import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import WellnessExchangeNavigation from "@/components/WellnessExchangeNavigation";
import { Coins, DollarSign, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  transaction_type: string;
  description: string;
  amount_wellcoins: number;
  amount_zar: number;
  status: string;
  created_at: string;
}

const TransactionPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWellCoins, setTotalWellCoins] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setTransactions(transactionData || []);

      const total = transactionData?.reduce((sum, transaction) => {
        if (transaction.transaction_type === 'earning' || transaction.transaction_type === 'bonus' || transaction.transaction_type === 'referral') {
          return sum + (transaction.amount_wellcoins || 0);
        }
        return sum;
      }, 0) || 0;
      
      setTotalWellCoins(total);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earning':
      case 'bonus':
      case 'referral':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'spending':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Coins className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earning':
      case 'bonus':
      case 'referral':
        return 'text-green-600';
      case 'spending':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-blue mx-auto mb-4"></div>
          <p>Loading your transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      <WellnessExchangeNavigation />
      
      <main className="pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">
              Transaction <span className="text-gradient-rainbow">History</span>
            </h1>
            <p className="text-gray-600 mt-1">Your WellCoin and payment history</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total WellCoins Earned</CardTitle>
                <Coins className="h-4 w-4 text-omni-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-omni-orange">{totalWellCoins} WC</div>
                <p className="text-xs text-gray-600">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
                <p className="text-xs text-gray-600">Total transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardHeader>
              <CardContent>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info("Top-up feature coming soon!")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add WellCoins
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your complete transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-600 mb-4">Your transaction history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{transaction.description}</h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.created_at)} • {transaction.transaction_type}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {transaction.amount_wellcoins > 0 && (
                          <p className={`text-sm font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                            {transaction.transaction_type === 'spending' ? '-' : '+'}
                            {transaction.amount_wellcoins} WC
                          </p>
                        )}
                        {transaction.amount_zar > 0 && (
                          <p className={`text-sm font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                            {transaction.transaction_type === 'spending' ? '-' : '+'}
                            R{transaction.amount_zar}
                          </p>
                        )}
                        <Badge
                          className={`text-xs mt-1 ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TransactionPage;