import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Smartphone, Check, X, AlertCircle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DeviceCompatibility = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [imeiNumber, setImeiNumber] = useState("");
  const [checkingResult, setCheckingResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const { toast } = useToast();

  const deviceBrands = [
    "Apple", "Samsung", "Google", "Huawei", "OnePlus", "Xiaomi", "Sony", "LG", "Motorola", "Nokia"
  ];

  const deviceModels: { [key: string]: string[] } = {
    Apple: ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone SE (3rd gen)", "iPad Pro", "iPad Air"],
    Samsung: ["Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22", "Galaxy Note 20 Ultra", "Galaxy Z Fold 4", "Galaxy Z Flip 4", "Galaxy A54", "Galaxy A34"],
    Google: ["Pixel 7 Pro", "Pixel 7", "Pixel 6 Pro", "Pixel 6", "Pixel 5", "Pixel 4 XL", "Pixel 4"],
    Huawei: ["P50 Pro", "P50", "Mate 40 Pro", "Mate 40", "P40 Pro", "P40"],
    OnePlus: ["OnePlus 11", "OnePlus 10 Pro", "OnePlus 9 Pro", "OnePlus 9", "OnePlus 8 Pro"],
    Xiaomi: ["Mi 13 Pro", "Mi 13", "Mi 12 Pro", "Mi 12", "Redmi Note 12 Pro", "Redmi Note 12"],
    Sony: ["Xperia 1 IV", "Xperia 5 IV", "Xperia 10 IV"],
    LG: ["Wing", "V60 ThinQ", "G8 ThinQ"],
    Motorola: ["Edge 30 Pro", "Edge 30", "Moto G52"],
    Nokia: ["X30", "G60", "G50"]
  };

  const handleCompatibilityCheck = async () => {
    if (!selectedBrand || !selectedModel) {
      toast({
        title: "Missing Information",
        description: "Please select both device brand and model.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      const isCompatible = Math.random() > 0.2; // 80% chance of compatibility
      const result = {
        compatible: isCompatible,
        device: `${selectedBrand} ${selectedModel}`,
        esimSupport: isCompatible,
        carrierLock: Math.random() > 0.8 ? "locked" : "unlocked",
        recommendations: isCompatible ? [
          "Your device fully supports eSIM technology",
          "All our wellness travel plans are compatible",
          "Instant activation available"
        ] : [
          "This device may have limited eSIM support",
          "Consider checking with manufacturer",
          "Physical SIM options available"
        ],
        networks: isCompatible ? ["4G LTE", "5G"] : ["4G LTE"],
        regions: isCompatible ? ["Global", "Africa", "Europe", "Asia"] : ["Limited regions"]
      };
      
      setCheckingResult(result);
      setIsChecking(false);
      
      toast({
        title: isCompatible ? "✅ Compatible!" : "⚠️ Limited Support",
        description: isCompatible ? "Your device supports eSIM" : "Check compatibility notes below"
      });
    }, 2000);
  };

  const CompatibilityResult = ({ result }: { result: any }) => (
    <Card className={`mt-6 ${result.compatible ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {result.compatible ? (
              <Check className="w-6 h-6 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-2" />
            )}
            {result.device}
          </CardTitle>
          <Badge variant={result.compatible ? "default" : "secondary"}>
            {result.compatible ? "Compatible" : "Limited Support"}
          </Badge>
        </div>
        <CardDescription>
          eSIM compatibility check results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">eSIM Support</span>
              {result.esimSupport ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Carrier Lock</span>
              <Badge variant={result.carrierLock === "unlocked" ? "default" : "secondary"}>
                {result.carrierLock}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Supported Networks</div>
            <div className="flex flex-wrap gap-1">
              {result.networks.map((network: string, index: number) => (
                <Badge key={index} variant="outline">{network}</Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Recommendations</div>
          <ul className="space-y-1">
            {result.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start text-sm">
                <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
        
        {result.compatible && (
          <div className="pt-4 border-t">
            <Link to="/roambuddy-store">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Browse Compatible eSIM Plans
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 lg:p-6 bg-white/80 backdrop-blur-sm border-b">
        <Link to="/data-products" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to eSIM Store
        </Link>
        <div className="text-sm text-gray-500">
          eSIM Compatibility Checker
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Device Compatibility</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Verify if your device supports eSIM technology and is compatible with our wellness travel plans.
          </p>
        </div>

        {/* Compatibility Check Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="w-6 h-6 mr-2" />
              Device Information
            </CardTitle>
            <CardDescription>
              Select your device details to check eSIM compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Device Brand</label>
                <Select value={selectedBrand} onValueChange={(value) => {
                  setSelectedBrand(value);
                  setSelectedModel(""); // Reset model when brand changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Device Model</label>
                <Select 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrand && deviceModels[selectedBrand]?.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">IMEI Number (Optional)</label>
              <Input
                placeholder="Enter your device IMEI for detailed compatibility check"
                value={imeiNumber}
                onChange={(e) => setImeiNumber(e.target.value)}
                maxLength={15}
              />
              <p className="text-xs text-gray-500">
                Find your IMEI by dialing *#06# or in device settings
              </p>
            </div>
            
            <Button 
              onClick={handleCompatibilityCheck}
              disabled={isChecking || !selectedBrand || !selectedModel}
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {isChecking ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Checking Compatibility...
                </div>
              ) : (
                "Check Compatibility"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {checkingResult && <CompatibilityResult result={checkingResult} />}

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is eSIM?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan without using a physical SIM card.
              </p>
              <ul className="space-y-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  No physical SIM card needed
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Instant activation via QR code
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Multiple plans on one device
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Perfect for travelers
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                To use eSIM, your device must meet certain requirements:
              </p>
              <ul className="space-y-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  eSIM-compatible hardware
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Carrier unlocked device
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Latest software version
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Strong internet connection for setup
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeviceCompatibility;