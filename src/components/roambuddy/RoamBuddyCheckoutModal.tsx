import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceDisplay } from '@/components/ui/price-display';
import { CurrencyToggle } from './CurrencyToggle';
import { useRoamBuddyAPI, RoamBuddyProduct } from '@/hooks/useRoamBuddyAPI';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { PAYPAL_OPTIONS } from '@/config/paypal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Copy, Smartphone, Calendar, Globe, Check, AlertCircle, Shield, FileText, Info, DollarSign, Coins, Tag, X, CreditCard, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoamBuddyCheckoutModalProps {
  product: RoamBuddyProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'details' | 'verification' | 'payment' | 'complete';

interface DiscountState {
  code: string;
  isValidating: boolean;
  isApplied: boolean;
  discountAmount: number;
  wellcoinsBonus: number;
  message: string;
  error: string;
}

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
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'ZAR'>('USD');
  const [couponInput, setCouponInput] = useState('');
  const [discount, setDiscount] = useState<DiscountState>({
    code: '',
    isValidating: false,
    isApplied: false,
    discountAmount: 0,
    wellcoinsBonus: 0,
    message: '',
    error: ''
  });
  const [wellcoinsEarned, setWellcoinsEarned] = useState(0);
  const [esimDetails, setEsimDetails] = useState<{
    iccid?: string;
    qrCode?: string;
    activationCode?: string;
    instructions?: string;
  } | null>(null);

  const { createGuestOrder } = useRoamBuddyAPI();
  const { formatZAR, formatUSD, exchangeRates } = useCurrencyConverter();

  if (!product) return null;

  const customerName = `${firstName} ${lastName}`.trim();
  const canProceedToPayment = firstName && lastName && customerEmail && acceptPrivacy && acceptTerms && confirmDevice;

  // Calculate prices based on selected currency
  const displayPriceUSD = product.priceIsUSD ? product.price : product.price / (exchangeRates?.USD || 18.50);
  const displayPriceZAR = product.priceIsUSD ? product.price * (exchangeRates?.USD || 18.50) : product.price;
  const displayPrice = selectedCurrency === 'USD' ? displayPriceUSD : displayPriceZAR;
  
  // Apply discount to get final price
  const finalPriceUSD = discount.isApplied ? (displayPriceUSD - discount.discountAmount) : displayPriceUSD;
  const finalPriceZAR = discount.isApplied ? (displayPriceZAR - (discount.discountAmount * (exchangeRates?.USD || 18.50))) : displayPriceZAR;
  const finalPrice = selectedCurrency === 'USD' ? finalPriceUSD : finalPriceZAR;
  
  const formattedPrice = selectedCurrency === 'USD' ? formatUSD(displayPriceUSD) : formatZAR(displayPriceZAR);
  const formattedFinalPrice = selectedCurrency === 'USD' ? formatUSD(finalPriceUSD) : formatZAR(finalPriceZAR);
  const formattedDiscount = selectedCurrency === 'USD' 
    ? formatUSD(discount.discountAmount) 
    : formatZAR(discount.discountAmount * (exchangeRates?.USD || 18.50));

  const handlePayPalApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    try {
      // Capture the payment first
      const captureResult = await actions.order.capture();
      console.log('PayPal capture result:', captureResult);

      if (captureResult.status !== 'COMPLETED') {
        throw new Error('Payment was not completed');
      }

      // Calculate WellCoins earned (1 per $1 spent + discount bonus)
      const baseWellcoins = Math.floor(finalPriceUSD);
      const totalWellcoins = baseWellcoins + discount.wellcoinsBonus;
      
      const orderData = {
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
        product_name: product.name,
        amount: finalPriceUSD, // Use discounted price
        original_amount: displayPriceUSD,
        currency: 'USD',
        destination: product.destination,
        discount_code: discount.isApplied ? discount.code : null,
        discount_amount: discount.discountAmount,
        wellcoins_earned: totalWellcoins,
      };

      // Use guest checkout - no authentication required
      const result = await createGuestOrder(orderData);
      
      if (result?.success) {
        setWellcoinsEarned(totalWellcoins);
        setEsimDetails({
          iccid: result.data?.roambuddy_data?.iccid || result.iccid,
          qrCode: result.data?.roambuddy_data?.qr_code || result.qrCode,
          activationCode: result.data?.roambuddy_data?.activation_code || result.activationCode,
          instructions: result.data?.roambuddy_data?.instructions || result.instructions,
        });
        setCurrentStep('complete');
        toast.success('eSIM order successful! Check your email for details.');
      } else {
        throw new Error(result?.message || result?.error || 'Order failed');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setDiscount(prev => ({ ...prev, isValidating: true, error: '' }));

    try {
      const { data, error } = await supabase.functions.invoke('validate-discount-code', {
        body: {
          code: couponInput.trim(),
          orderAmount: displayPriceUSD,
          productId: product.id
        }
      });

      if (error) throw error;

      if (data?.success) {
        setDiscount({
          code: data.data.code,
          isValidating: false,
          isApplied: true,
          discountAmount: data.data.discountAmount,
          wellcoinsBonus: data.data.wellcoinsBonus,
          message: data.data.message,
          error: ''
        });
        toast.success(data.data.message);
      } else {
        setDiscount(prev => ({
          ...prev,
          isValidating: false,
          error: data?.error || 'Invalid code'
        }));
        toast.error(data?.message || 'Invalid discount code');
      }
    } catch (error: any) {
      console.error('Coupon validation error:', error);
      setDiscount(prev => ({
        ...prev,
        isValidating: false,
        error: 'Failed to validate code'
      }));
      toast.error('Failed to validate discount code');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount({
      code: '',
      isValidating: false,
      isApplied: false,
      discountAmount: 0,
      wellcoinsBonus: 0,
      message: '',
      error: ''
    });
    setCouponInput('');
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
    setSelectedCurrency('USD');
    setCouponInput('');
    setDiscount({
      code: '',
      isValidating: false,
      isApplied: false,
      discountAmount: 0,
      wellcoinsBonus: 0,
      message: '',
      error: ''
    });
    setWellcoinsEarned(0);
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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        <div className="p-6 pb-4">
          <StepIndicator />
        </div>

        <div className="px-6 pb-6">
          {showCompatibilityCheck ? (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Check if your device is eSIM compatible
                </DialogTitle>
              </DialogHeader>
              <CompatibilityCheckContent />
            </>
          ) : currentStep === 'details' ? (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold">Billing Address</DialogTitle>
                <DialogDescription className="mt-2">
                  Enter your details to complete your eSIM purchase
                </DialogDescription>
              </DialogHeader>

              <div className="grid lg:grid-cols-5 gap-8">
                {/* Form Section - Takes more space */}
                <div className="lg:col-span-3 space-y-5">
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

              {/* Order Summary Sidebar - Takes less space */}
              <div className="lg:col-span-2">
                <div className="bg-muted/50 rounded-xl p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Order Review</h3>
                    <CurrencyToggle 
                      currency={selectedCurrency}
                      onCurrencyChange={setSelectedCurrency}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">1 item in cart</p>
                  
                  <div className="space-y-3 pb-4 border-b border-border">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.dataAmount} • {product.validity}</p>
                      </div>
                      <span className="font-semibold text-primary">{formattedPrice}</span>
                    </div>
                  </div>

                  <div className="py-4 border-b border-border">
                    <Label htmlFor="coupon" className="text-sm text-muted-foreground mb-2 block">Coupon Code</Label>
                    {discount.isApplied ? (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">{discount.code}</span>
                          <span className="text-xs text-green-600">(-{formattedDiscount})</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleRemoveCoupon}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input 
                            id="coupon"
                            placeholder="Enter code" 
                            className="h-9 text-sm uppercase"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9"
                            onClick={handleApplyCoupon}
                            disabled={discount.isValidating || !couponInput.trim()}
                          >
                            {discount.isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                          </Button>
                        </div>
                        {discount.error && (
                          <p className="text-xs text-destructive">{discount.error}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formattedPrice}</span>
                    </div>
                    {discount.isApplied && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Discount ({discount.code})</span>
                        <span>-{formattedDiscount}</span>
                      </div>
                    )}
                    {discount.wellcoinsBonus > 0 && (
                      <div className="flex justify-between items-center text-sm text-amber-600">
                        <span className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          Bonus WellCoins
                        </span>
                        <span>+{discount.wellcoinsBonus}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-border">
                      <span>Grand Total</span>
                      <span className="text-primary text-xl">{formattedFinalPrice}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {selectedCurrency === 'USD' 
                        ? `≈ ${formatZAR(finalPriceZAR)}` 
                        : `≈ ${formatUSD(finalPriceUSD)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentStep === 'payment' ? (
          <>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">Complete Payment</DialogTitle>
              <DialogDescription className="mt-2">
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

                {/* Payment Options */}
                <Tabs defaultValue="paypal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="paypal" className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      PayPal
                    </TabsTrigger>
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="paypal" className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center mb-2">
                      Pay securely with your PayPal account
                    </p>
                    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          const priceValue = finalPriceUSD.toFixed(2);
                          return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                              amount: {
                                value: priceValue,
                                currency_code: 'USD',
                              },
                              description: discount.isApplied 
                                ? `${product.name} - ${product.destination} (${discount.code} applied)`
                                : `${product.name} - ${product.destination}`,
                            }],
                          });
                        }}
                        onApprove={(data, actions) => handlePayPalApprove(data, actions)}
                        onError={(err) => {
                          console.error('PayPal error:', err);
                          toast.error('Payment failed. Please try again.');
                        }}
                        disabled={isProcessing}
                      />
                    </PayPalScriptProvider>
                  </TabsContent>
                  
                  <TabsContent value="card" className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center mb-2">
                      Pay with credit or debit card via PayPal
                    </p>
                    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
                      <PayPalButtons
                        fundingSource="card"
                        createOrder={(data, actions) => {
                          const priceValue = finalPriceUSD.toFixed(2);
                          return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                              amount: {
                                value: priceValue,
                                currency_code: 'USD',
                              },
                              description: discount.isApplied 
                                ? `${product.name} - ${product.destination} (${discount.code} applied)`
                                : `${product.name} - ${product.destination}`,
                            }],
                          });
                        }}
                        onApprove={(data, actions) => handlePayPalApprove(data, actions)}
                        onError={(err) => {
                          console.error('Card payment error:', err);
                          toast.error('Card payment failed. Please try again.');
                        }}
                        disabled={isProcessing}
                        style={{
                          layout: 'vertical',
                          color: 'black',
                          shape: 'rect',
                          label: 'pay',
                        }}
                      />
                    </PayPalScriptProvider>
                    <p className="text-xs text-muted-foreground text-center">
                      Card payments are processed securely by PayPal. No PayPal account required.
                    </p>
                  </TabsContent>
                </Tabs>
                
                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing your order...</span>
                  </div>
                )}

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
                      <span className="font-medium">{formatUSD(displayPriceUSD)}</span>
                    </div>
                    {discount.isApplied && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {discount.code}
                        </span>
                        <span>-{formatUSD(discount.discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Grand Total</span>
                      <span className="text-primary text-xl">{formatUSD(finalPriceUSD)}</span>
                    </div>
                    {(discount.wellcoinsBonus > 0 || Math.floor(finalPriceUSD) > 0) && (
                      <div className="flex justify-between items-center text-sm text-amber-600">
                        <span className="flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          WellCoins you'll earn
                        </span>
                        <span>+{Math.floor(finalPriceUSD) + discount.wellcoinsBonus}</span>
                      </div>
                    )}
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

              {wellcoinsEarned > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <Coins className="h-5 w-5" />
                    <p className="text-sm font-medium">
                      You earned <strong>{wellcoinsEarned} WellCoins</strong> with this purchase!
                    </p>
                  </div>
                </div>
              )}

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
        </div>
      </DialogContent>
    </Dialog>
  );
};
