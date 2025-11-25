// Phase 8: Updated Checkout with PayPal Integration
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import { ArrowLeft, CreditCard, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PayPalCheckout } from "@/components/PayPalCheckout";

const Checkout = () => {
  const { items, clearCart, totalZAR, totalWellCoins } = useCart();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateBillingInfo = () => {
    const { firstName, lastName, email, phone, address, city, postalCode, province } = billingInfo;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode || !province) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required billing fields.",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    // Phone validation (basic South African format)
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleWellCoinsPayment = async () => {
    if (!validateBillingInfo()) return;

    // Handle WellCoins payment
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
    });
    
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <UnifiedNavigation />
        <main className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
            <Button asChild>
              <Link to="/2bewell-shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/2bewell-shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Billing Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Enter your billing details below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={billingInfo.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={billingInfo.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={billingInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={billingInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={billingInfo.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select onValueChange={(value) => handleInputChange("province", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GP">Gauteng</SelectItem>
                          <SelectItem value="WC">Western Cape</SelectItem>
                          <SelectItem value="KZN">KwaZulu-Natal</SelectItem>
                          <SelectItem value="EC">Eastern Cape</SelectItem>
                          <SelectItem value="FS">Free State</SelectItem>
                          <SelectItem value="LP">Limpopo</SelectItem>
                          <SelectItem value="MP">Mpumalanga</SelectItem>
                          <SelectItem value="NC">Northern Cape</SelectItem>
                          <SelectItem value="NW">North West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={billingInfo.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                        <CreditCard className="w-4 h-4 mr-2" />
                        PayPal
                      </Label>
                    </div>
                    {totalWellCoins > 0 && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wellcoins" id="wellcoins" />
                        <Label htmlFor="wellcoins" className="flex items-center cursor-pointer">
                          <Coins className="w-4 h-4 mr-2 text-green-600" />
                          WellCoins ({totalWellCoins} available)
                        </Label>
                      </div>
                    )}
                  </RadioGroup>
                  
                  {paymentMethod === "paypal" && (
                    <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                      {!validateBillingInfo() ? (
                        <p className="text-sm text-amber-700">
                          Please complete all billing information above before proceeding to payment.
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-blue-700 mb-4">
                            Complete your secure payment with PayPal below.
                          </p>
                          <PayPalCheckout />
                        </>
                      )}
                    </div>
                  )}
                  
                  {paymentMethod === "wellcoins" && (
                    <div className="mt-4">
                      <Button 
                        onClick={handleWellCoinsPayment}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                      >
                        Pay with WellCoins
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.item_type === 'affiliate' && (
                              <span className="ml-2 text-blue-600">• Partner Product</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">R{(item.price_zar * item.quantity).toFixed(2)}</p>
                          {item.price_wellcoins && (
                            <p className="text-xs text-green-600">{item.price_wellcoins * item.quantity} WellCoins</p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>R{totalZAR.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>R{(totalZAR * 0.15).toFixed(2)}</span>
                      </div>
                      {totalWellCoins > 0 && paymentMethod === "wellcoins" && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>WellCoins Discount</span>
                          <span>-R{(totalWellCoins * 0.1).toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>
                          R{paymentMethod === "wellcoins" 
                            ? ((totalZAR * 1.15) - (totalWellCoins * 0.1)).toFixed(2)
                            : (totalZAR * 1.15).toFixed(2)
                          }
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;