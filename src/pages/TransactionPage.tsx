import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MobileNavigation from "@/components/MobileNavigation";
import { 
  ArrowLeftRight, 
  Coins, 
  DollarSign, 
  User, 
  FileText,
  Check,
  ArrowLeft,
  Plus
} from "lucide-react";

interface Transaction {
  id: string;
  transaction_type: string;
  description: string;
  amount_wellcoins: number;
  amount_zar: number;
  status: string;
  created_at: string;
  related_user_id?: string;
}

const TransactionPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'buyer' | 'seller'>('buyer');
  
  // Form fields
  const [counterpartyAccount, setCounterpartyAccount] = useState("");
  const [description, setDescription] = useState("");
  const [amountZar, setAmountZar] = useState("");
  const [amountWellcoins, setAmountWellcoins] = useState("");
  const [wellCoinBalance, setWellCoinBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchWellCoinBalance();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchWellCoinBalance = async () => {
    try {
      // Try consumer profile first
      let { data, error } = await supabase
        .from('consumer_profiles')
        .select('wellcoin_balance')
        .eq('id', user?.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Try provider profile if consumer not found
        ({ data, error } = await supabase
          .from('provider_profiles')
          .select('wellcoin_balance')
          .eq('id', user?.id)
          .single());
      }

      if (error && error.code !== 'PGRST116') throw error;
      setWellCoinBalance(data?.wellcoin_balance || 0);
    } catch (error: any) {
      console.error("Failed to fetch WellCoin balance:", error);
    }
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || (!amountZar && !amountWellcoins)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        user_id: user?.id,
        transaction_type: formType === 'buyer' ? 'spending' : 'earning',
        description: description.trim(),
        amount_zar: amountZar ? parseFloat(amountZar) : 0,
        amount_wellcoins: amountWellcoins ? parseInt(amountWellcoins) : 0,
        related_user_id: counterpartyAccount || null,
        status: 'completed'
      };

      const { error } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (error) throw error;

      toast.success("Transaction recorded successfully!");
      
      // Reset form
      setCounterpartyAccount("");
      setDescription("");
      setAmountZar("");
      setAmountWellcoins("");
      setShowForm(false);
      
      // Refresh data
      fetchTransactions();
      fetchWellCoinBalance();
    } catch (error: any) {
      toast.error(error.message || "Failed to record transaction");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl">
                  <span className="bg-rainbow-gradient bg-clip-text text-transparent">Transactions</span>
                </h1>
                <p className="text-gray-600 mt-1">Manage your WellCoin transactions</p>
              </div>
              
              {!showForm && (
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-rainbow-gradient hover:opacity-90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Transaction
                </Button>
              )}
            </div>

            {/* Balance Card */}
            <Card className="bg-gradient-to-r from-omni-orange/10 to-omni-yellow/10 border-omni-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Your WellCoin Balance</h3>
                    <p className="text-3xl font-bold text-omni-orange flex items-center mt-2">
                      <Coins className="h-8 w-8 mr-2" />
                      {wellCoinBalance} WC
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Equivalent to</p>
                    <p className="text-xl font-semibold text-green-600">
                      R{wellCoinBalance}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ArrowLeftRight className="h-5 w-5 mr-2" />
                    Enter Transaction
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowForm(false)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
                <CardDescription>
                  Record a new transaction as either buyer or seller
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmitTransaction} className="space-y-6">
                  {/* Transaction Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={formType === 'buyer' ? 'default' : 'outline'}
                      onClick={() => setFormType('buyer')}
                      className="h-16 flex-col"
                    >
                      <User className="h-6 w-6 mb-2" />
                      I'm the Buyer
                    </Button>
                    <Button
                      type="button"
                      variant={formType === 'seller' ? 'default' : 'outline'}
                      onClick={() => setFormType('seller')}
                      className="h-16 flex-col"
                    >
                      <User className="h-6 w-6 mb-2" />
                      I'm the Seller
                    </Button>
                  </div>

                  {/* Counterparty Account */}
                  <div className="space-y-2">
                    <Label htmlFor="counterparty">
                      {formType === 'buyer' ? "Seller's Account" : "Buyer's Account"}
                    </Label>
                    <Input
                      id="counterparty"
                      value={counterpartyAccount}
                      onChange={(e) => setCounterpartyAccount(e.target.value)}
                      placeholder="Enter account number or email"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what was provided..."
                      required
                      rows={3}
                    />
                  </div>

                  {/* Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount-zar">ZAR Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="amount-zar"
                          type="number"
                          value={amountZar}
                          onChange={(e) => setAmountZar(e.target.value)}
                          placeholder="0.00"
                          className="pl-10"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount-wellcoins">WellCoins</Label>
                      <div className="relative">
                        <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-omni-orange" />
                        <Input
                          id="amount-wellcoins"
                          type="number"
                          value={amountWellcoins}
                          onChange={(e) => setAmountWellcoins(e.target.value)}
                          placeholder="0"
                          className="pl-10"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-rainbow-gradient hover:opacity-90 text-white"
                      disabled={loading}
                    >
                      {loading ? "Recording..." : "Record Transaction"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Your recent transactions and balance changes
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-48"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowLeftRight className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-lg mb-2">No transactions yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start by recording your first transaction
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    Record Transaction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`mr-2 ${getTransactionColor(transaction.transaction_type)}`}
                          >
                            {transaction.transaction_type}
                          </Badge>
                          <span>{formatDate(transaction.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {transaction.amount_zar > 0 && (
                          <p className={`font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                            {transaction.transaction_type === 'spending' ? '-' : '+'}R{transaction.amount_zar}
                          </p>
                        )}
                        {transaction.amount_wellcoins > 0 && (
                          <p className={`font-medium text-omni-orange`}>
                            {transaction.transaction_type === 'spending' ? '-' : '+'}
                            {transaction.amount_wellcoins} WC
                          </p>
                        )}
                        <Badge className="bg-green-100 text-green-800 text-xs mt-1">
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
    </div>
  );
};

export default TransactionPage;