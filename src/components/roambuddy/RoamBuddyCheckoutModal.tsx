import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PriceDisplay } from '@/components/ui/price-display';
import { useRoamBuddyAPI, RoamBuddyProduct } from '@/hooks/useRoamBuddyAPI';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { PAYPAL_OPTIONS } from '@/config/paypal';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Copy, Smartphone, Calendar, Globe } from 'lucide-react';

interface RoamBuddyCheckoutModalProps {
  product: RoamBuddyProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RoamBuddyCheckoutModal = ({ product, isOpen, onClose }: RoamBuddyCheckoutModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [esimDetails, setEsimDetails] = useState<{
    iccid?: string;
    qrCode?: string;
    activationCode?: string;
    instructions?: string;
  } | null>(null);

  const { createOrder } = useRoamBuddyAPI();

  if (!product) return null;

  const handlePayPalApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      const orderData = {
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
        product_name: product.name,
        amount: product.price,
        currency: product.priceIsUSD ? 'USD' : 'ZAR',
        destination: product.destination,
      };

      const result = await createOrder(orderData);
      
      if (result?.success) {
        setEsimDetails({
          iccid: result.iccid,
          qrCode: result.qrCode,
          activationCode: result.activationCode,
          instructions: result.instructions,
        });
        setOrderComplete(true);
        toast.success('eSIM order successful! Check your email for details.');
      } else {
        throw new Error(result?.message || 'Order failed');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleClose = () => {
    setCustomerName('');
    setCustomerEmail('');
    setOrderComplete(false);
    setEsimDetails(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!orderComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Complete Your Order</DialogTitle>
              <DialogDescription>
                You're one step away from staying connected on your wellness journey
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* Product Summary */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Destination:</span>
                    <span className="font-medium">{product.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">{product.dataAmount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Validity:</span>
                    <span className="font-medium">{product.validity}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Price:</span>
                    <PriceDisplay 
                      price={product.price} 
                      size="lg" 
                      priceIsUSD={product.priceIsUSD}
                      primaryCurrency={product.priceIsUSD ? 'USD' : 'ZAR'}
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your eSIM details will be sent to this email
                    </p>
                  </div>
                </div>
              </div>

              {/* PayPal Payment */}
              {customerName && customerEmail ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Payment</h3>
                  <PayPalScriptProvider options={PAYPAL_OPTIONS}>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        const priceValue = product.priceIsUSD 
                          ? product.price.toFixed(2) 
                          : (product.price / 100).toFixed(2);
                        const currencyCode = product.priceIsUSD ? 'USD' : 'ZAR';
                        
                        return actions.order.create({
                          intent: 'CAPTURE',
                          purchase_units: [{
                            amount: {
                              value: priceValue,
                              currency_code: currencyCode,
                            },
                            description: `${product.name} - ${product.destination}`,
                          }],
                        });
                      }}
                      onApprove={handlePayPalApprove}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        toast.error('Payment failed. Please try again.');
                      }}
                      disabled={isProcessing}
                    />
                  </PayPalScriptProvider>
                  {isProcessing && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing your order...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please fill in your information to continue with payment
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-center">
                Order Complete!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your eSIM is ready to activate
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* eSIM Details */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Your eSIM Details</h3>
                
                {esimDetails?.qrCode && (
                  <div className="flex flex-col items-center gap-4 p-6 bg-background rounded-lg border-2 border-primary/20">
                    <img 
                      src={esimDetails.qrCode} 
                      alt="eSIM QR Code"
                      className="w-64 h-64"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Scan this QR code with your device to install the eSIM
                    </p>
                  </div>
                )}

                {esimDetails?.iccid && (
                  <div className="space-y-2">
                    <Label>ICCID</Label>
                    <div className="flex items-center gap-2">
                      <Input value={esimDetails.iccid} readOnly />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(esimDetails.iccid!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {esimDetails?.activationCode && (
                  <div className="space-y-2">
                    <Label>Activation Code</Label>
                    <div className="flex items-center gap-2">
                      <Input value={esimDetails.activationCode} readOnly />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(esimDetails.activationCode!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {esimDetails?.instructions && (
                  <div className="space-y-2">
                    <Label>Activation Instructions</Label>
                    <div className="bg-background rounded-lg p-4 text-sm text-muted-foreground">
                      {esimDetails.instructions}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📧 A copy of these details has been sent to <strong>{customerEmail}</strong>
                </p>
              </div>

              <Button onClick={handleClose} className="w-full" size="lg">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
