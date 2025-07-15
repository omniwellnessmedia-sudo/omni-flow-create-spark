import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Phone, 
  QrCode, 
  Smartphone, 
  Globe,
  Clock,
  ArrowLeft,
  Copy,
  ExternalLink
} from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const { toast } = useToast();

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        setLoading(false);
        setVerifying(false);
        return;
      }

      try {
        console.log('Verifying payment:', { sessionId, orderId });
        
        // Verify payment with our backend
        const result = await supabase.functions.invoke('verify-payment', {
          body: { sessionId, orderId }
        });

        console.log('Payment verification result:', result);

        if (result.data?.success) {
          setOrder(result.data.order);
          toast({
            title: "🎉 Payment Successful!",
            description: "Your eSIM is being prepared for delivery.",
          });
        } else {
          throw new Error(result.data?.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Verification Error",
          description: "Unable to verify payment. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            {verifying ? 'Verifying Payment...' : 'Loading...'}
          </h2>
        </div>
      </div>
    );
  }

  if (!sessionId || !orderId || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Payment Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your payment details. Please check your email or contact support.</p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-4 lg:p-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Your eSIM is ready for activation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Number</label>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-lg">{order.order_number}</p>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(order.order_number, 'Order number')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status === 'completed' ? '✅ Completed' : '⏳ Processing'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Product Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-lg">{order.product_name}</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.amount}</p>
                      <p className="text-sm text-gray-500">{order.currency}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">{order.data_amount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Validity:</span>
                      <p className="font-medium">{order.validity_days} days</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Coverage:</span>
                      <p className="font-medium">{order.coverage?.join(', ') || order.destination}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium capitalize">{order.product_type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* eSIM Activation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                eSIM Activation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.status === 'completed' && order.esim_qr_code ? (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 text-center">
                    <QrCode className="w-16 h-16 mx-auto mb-3 text-blue-600" />
                    <p className="font-medium mb-2">QR Code Ready!</p>
                    <p className="text-sm text-gray-600">Code: {order.esim_qr_code}</p>
                  </div>
                  
                  {order.esim_activation_code && (
                    <div className="border rounded-lg p-3">
                      <label className="text-sm font-medium text-gray-500">Activation Code</label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {order.esim_activation_code}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(order.esim_activation_code, 'Activation code')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                  <p className="font-medium">eSIM Preparing...</p>
                  <p className="text-sm text-gray-600">Your eSIM will be ready within 5-10 minutes</p>
                </div>
              )}

              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email QR Code
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Instructions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-medium mb-2">Download eSIM</h4>
                <p className="text-sm text-gray-600">Scan the QR code or enter the activation code in your device settings</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-medium mb-2">Activate on Arrival</h4>
                <p className="text-sm text-gray-600">Turn on data roaming and connect instantly when you reach your destination</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-medium mb-2">Enjoy Your Trip</h4>
                <p className="text-sm text-gray-600">Stay connected with high-speed data and 24/7 support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Need help? Our wellness travel support team is here 24/7</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Help Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;