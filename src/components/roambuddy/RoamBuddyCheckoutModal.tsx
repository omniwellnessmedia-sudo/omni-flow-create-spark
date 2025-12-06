import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PriceDisplay } from '@/components/ui/price-display';
import { useRoamBuddyAPI, RoamBuddyProduct } from '@/hooks/useRoamBuddyAPI';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { PAYPAL_OPTIONS } from '@/config/paypal';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Copy, Smartphone, Calendar, Globe, Check, AlertCircle, Shield, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoamBuddyCheckoutModalProps {
  product: RoamBuddyProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'details' | 'verification' | 'payment' | 'complete';

export const RoamBuddyCheckoutModal = ({ product, isOpen, onClose }: RoamBuddyCheckoutModalProps) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmDevice, setConfirmDevice] = useState(false);
  const [showCompatibilityCheck, setShowCompatibilityCheck] = useState(false);
  const [esimDetails, setEsimDetails] = useState<{
    iccid?: string;
    qrCode?: string;
    activationCode?: string;
    instructions?: string;
  } | null>(null);

  const { createOrder } = useRoamBuddyAPI();

  if (!product) return null;

  const customerName = `${firstName} ${lastName}`.trim();
  const canProceedToPayment = firstName && lastName && customerEmail && acceptPrivacy && acceptTerms && confirmDevice;

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
        setCurrentStep('complete');
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
    setFirstName('');
    setLastName('');
    setCustomerEmail('');
    setAcceptPrivacy(false);
    setAcceptTerms(false);
    setConfirmDevice(false);
    setCurrentStep('details');
    setEsimDetails(null);
    setShowCompatibilityCheck(false);
    onClose();
  };

  const handleProceedToPayment = () => {
    if (canProceedToPayment) {
      setCurrentStep('payment');
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {/* Step 1 */}
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 'details' ? 'bg-green-500 text-white' : 
          ['payment', 'complete'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
        }`}>
          {['payment', 'complete'].includes(currentStep) ? <Check className="h-4 w-4" /> : '1'}
        </div>
        <span className="ml-2 text-xs font-medium uppercase tracking-wide hidden sm:inline">Enter Details</span>
      </div>
      
      {/* Connector */}
      <div className={`w-16 h-0.5 mx-2 ${['payment', 'complete'].includes(currentStep) ? 'bg-green-500' : 'bg-muted'}`} />
      
      {/* Step 2 */}
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 'payment' ? 'bg-green-500 text-white' : 
          currentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
        }`}>
          {currentStep === 'complete' ? <Check className="h-4 w-4" /> : '2'}
        </div>
        <span className="ml-2 text-xs font-medium uppercase tracking-wide hidden sm:inline">Payment</span>
      </div>
      
      {/* Connector */}
      <div className={`w-16 h-0.5 mx-2 ${currentStep === 'complete' ? 'bg-green-500' : 'bg-muted'}`} />
      
      {/* Step 3 */}
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
        }`}>
          {currentStep === 'complete' ? <Check className="h-4 w-4" /> : '3'}
        </div>
        <span className="ml-2 text-xs font-medium uppercase tracking-wide hidden sm:inline">Activation</span>
      </div>
    </div>
  );

  // Compatibility check modal content
  const CompatibilityCheckContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
        <h3 className="font-semibold text-lg mb-4">How to check if a phone is eSIM Compatible?</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <h4 className="font-medium mb-2">Apple iOS</h4>
            <p className="text-sm text-muted-foreground mb-3">Dial *#06# on your Phone</p>
            <p className="text-sm text-muted-foreground">Look for "EID" with a 32 digit number</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium mb-2">Android</h4>
            <p className="text-sm text-muted-foreground mb-3">Go to Settings → About Phone → Status</p>
            <p className="text-sm text-muted-foreground">Look for "EID" with a 32 digit number</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={() => setShowCompatibilityCheck(false)}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          No, I don't see the EID number
        </Button>
        <Button 
          onClick={() => {
            setConfirmDevice(true);
            setShowCompatibilityCheck(false);
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          Yes, I see an EID number
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <StepIndicator />

        {showCompatibilityCheck ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Check if your device is eSIM compatible
              </DialogTitle>
            </DialogHeader>
            <CompatibilityCheckContent />
          </>
        ) : currentStep === 'details' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Billing Address</DialogTitle>
              <DialogDescription>
                Enter your details to complete your eSIM purchase
              </DialogDescription>
            </DialogHeader>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center gap-1">
                      First Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="flex items-center gap-1">
                      Last Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-1">
                    Email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-sm flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-amber-800 dark:text-amber-200">
                      <strong>*IMPORTANT:</strong> We will send the QR code to this email address
                    </span>
                  </p>
                </div>

                {/* Agreement Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="privacy" 
                      checked={acceptPrivacy}
                      onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                    />
                    <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                      Acknowledge our{' '}
                      <Link to="/roambuddy/privacy" target="_blank" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree with the{' '}
                      <Link to="/roambuddy/terms" target="_blank" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="device" 
                      checked={confirmDevice}
                      onCheckedChange={(checked) => setConfirmDevice(checked as boolean)}
                    />
                    <Label htmlFor="device" className="text-sm leading-relaxed cursor-pointer">
                      I confirm my device is{' '}
                      <button 
                        type="button"
                        onClick={() => setShowCompatibilityCheck(true)}
                        className="text-primary hover:underline"
                      >
                        eSIM enabled
                      </button>
                    </Label>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setShowCompatibilityCheck(true)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Smartphone className="h-4 w-4" />
                  Click here to check your phone is eSIM compatible
                </button>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={!canProceedToPayment}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-muted/50 rounded-xl p-5 sticky top-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    Order Review
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">1 item in cart</p>
                  
                  <div className="space-y-3 pb-4 border-b border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.dataAmount} • {product.validity}</p>
                      </div>
                      <PriceDisplay 
                        price={product.price} 
                        size="sm" 
                        priceIsUSD={product.priceIsUSD}
                        primaryCurrency={product.priceIsUSD ? 'USD' : 'ZAR'}
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Coupon Code:</span>
                      <Input 
                        placeholder="Enter coupon code" 
                        className="w-32 h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Grand Total</span>
                      <PriceDisplay 
                        price={product.price} 
                        size="lg" 
                        priceIsUSD={product.priceIsUSD}
                        primaryCurrency={product.priceIsUSD ? 'USD' : 'ZAR'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentStep === 'payment' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Complete Payment</DialogTitle>
              <DialogDescription>
                Secure payment powered by PayPal
              </DialogDescription>
            </DialogHeader>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Product Summary */}
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground">Destination</p>
                        <p className="font-medium">{product.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground">Data</p>
                        <p className="font-medium">{product.dataAmount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground">Validity</p>
                        <p className="font-medium">{product.validity}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal Payment */}
                <div className="space-y-4">
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

                <Button variant="outline" onClick={() => setCurrentStep('details')} className="w-full">
                  Back to Details
                </Button>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-muted/50 rounded-xl p-5 sticky top-4">
                  <h3 className="font-semibold text-lg mb-4">Order Review</h3>
                  
                  <div className="space-y-3 pb-4 border-b border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.dataAmount} • {product.validity}</p>
                      </div>
                      <PriceDisplay 
                        price={product.price} 
                        size="sm" 
                        priceIsUSD={product.priceIsUSD}
                        primaryCurrency={product.priceIsUSD ? 'USD' : 'ZAR'}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Grand Total</span>
                      <PriceDisplay 
                        price={product.price} 
                        size="lg" 
                        priceIsUSD={product.priceIsUSD}
                        primaryCurrency={product.priceIsUSD ? 'USD' : 'ZAR'}
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs font-medium">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
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
