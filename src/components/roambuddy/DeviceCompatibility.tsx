import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Smartphone } from "lucide-react";

const deviceBrands = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "google", label: "Google" },
  { value: "huawei", label: "Huawei" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "oppo", label: "Oppo" },
];

const compatibleDevices: Record<string, string[]> = {
  apple: [
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    "iPhone SE (3rd generation)", "iPhone 11", "iPhone XS", "iPhone XR"
  ],
  samsung: [
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
    "Galaxy Z Fold 5", "Galaxy Z Flip 5",
    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22"
  ],
  google: [
    "Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7",
    "Pixel 6 Pro", "Pixel 6", "Pixel 5"
  ],
};

export const DeviceCompatibility = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const handleCheck = () => {
    setShowResult(true);
  };

  const isCompatible = selectedBrand && selectedModel && 
    compatibleDevices[selectedBrand]?.includes(selectedModel);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl md:text-3xl">
              Check if Your Device Supports eSIM
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Not all devices support eSIM technology. Check compatibility before purchasing.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Device Brand
                </label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your device brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceBrands.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBrand && compatibleDevices[selectedBrand] && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Device Model
                  </label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your device model" />
                    </SelectTrigger>
                    <SelectContent>
                      {compatibleDevices[selectedBrand].map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={handleCheck}
                disabled={!selectedBrand || !selectedModel}
                className="w-full py-6 text-lg"
              >
                Check Compatibility
              </Button>
            </div>

            {showResult && (
              <Card className={isCompatible ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {isCompatible ? (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-green-900 mb-2">
                            ✓ Your Device is Compatible!
                          </h3>
                          <p className="text-green-800">
                            Great news! Your {selectedBrand} {selectedModel} supports eSIM technology. 
                            You can purchase and activate a RoamBuddy eSIM right away.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                          <X className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-red-900 mb-2">
                            Device Not Compatible
                          </h3>
                          <p className="text-red-800">
                            Unfortunately, we couldn't confirm eSIM support for this device. 
                            Please check your device specifications or contact support for assistance.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">How to check eSIM support manually:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Go to Settings → Mobile/Cellular</li>
                <li>Look for "Add eSIM" or "Add Mobile Plan" option</li>
                <li>If available, your device supports eSIM</li>
                <li>Check manufacturer's website for specifications</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
