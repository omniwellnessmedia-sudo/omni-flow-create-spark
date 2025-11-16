import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag, Search, Package } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
  total_zar?: number;
  product_name?: string;
  amount?: number;
  currency?: string;
  order_items?: Array<{
    product_name: string;
    quantity: number;
    price_zar: number;
  }>;
}

export default function GuestOrderLookup() {
  const [orderNumber, setOrderNumber] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookupOrder = async () => {
    setError('');
    setLoading(true);
    
    try {
      // @ts-ignore - Complex type inference
      const { data, error: lookupError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', orderNumber)
        .eq('access_token', accessToken)
        .single();

      if (lookupError || !data) {
        setError('Order not found or invalid access code. Please check your order number and access code.');
        setOrder(null);
      } else {
        setOrder(data as Order);
      }
    } catch (err) {
      setError('An error occurred while looking up your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-center text-3xl">Track Your Order</CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Enter your order details to view your order status
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Number</label>
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="OMW-20241116-1234"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Access Code</label>
                <Input
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Enter your access code from order confirmation"
                  type="password"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The access code was provided in your order confirmation email
                </p>
              </div>

              <Button 
                onClick={lookupOrder} 
                className="w-full"
                disabled={!orderNumber || !accessToken || loading}
              >
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Looking up...' : 'View Order'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {order && (
              <div className="mt-8 space-y-6 border-t pt-6">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-mono font-semibold">{order.order_number}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize text-green-600">{order.status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Order Items</h3>
                  </div>
                  <div className="space-y-2">
                    {order.order_items?.length > 0 ? (
                      order.order_items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between py-3 border-b last:border-0">
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">R {(item.price_zar * item.quantity).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-3">
                        <p className="font-medium">{order.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.currency} {order.amount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {order.total_zar && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>R {order.total_zar.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
