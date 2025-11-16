// Phase 9: Order Confirmation Page
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, ShoppingBag, Key, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
      } else {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const copyAccessToken = () => {
    if (order?.access_token) {
      navigator.clipboard.writeText(order.access_token);
      toast({
        title: "Access code copied!",
        description: "You can use this code to track your order later.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Order not found.</p>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link to="/wellness-exchange">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-3xl">
            Order Confirmed!
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Thank you for your purchase
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono font-semibold">{order.order_number}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{order.customer_email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-medium capitalize text-green-600">{order.status}</p>
            </div>
          </div>

          {/* Show access token for guest users */}
          {!user && order.access_token && (
            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-amber-800">
                <Key className="h-5 w-5" />
                <h3 className="font-semibold">Important: Save Your Access Code</h3>
              </div>
              <p className="text-sm text-amber-700">
                Since you checked out as a guest, you'll need this code to track your order:
              </p>
              <div className="bg-white border border-amber-300 p-3 rounded flex items-center justify-between">
                <code className="font-mono font-semibold text-sm break-all">
                  {order.access_token}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAccessToken}
                  className="ml-2 flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-amber-600">
                💡 Use this code at <Link to="/guest-order-lookup" className="underline font-medium">Guest Order Lookup</Link> to view your order status anytime.
              </p>
            </div>
          )}

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
              ) : order.items ? (
                JSON.parse(order.items).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">R {(item.price_zar * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No items found</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-primary">R {order.total_zar?.toFixed(2) || order.amount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              📧 A confirmation email has been sent to <strong>{order.customer_email}</strong>.
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-100 mt-2">
              If you have any questions, please contact us at <strong>support@omniwellnessmedia.co.za</strong>
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/wellness-exchange">Continue Shopping</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/wellness-account">View My Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
