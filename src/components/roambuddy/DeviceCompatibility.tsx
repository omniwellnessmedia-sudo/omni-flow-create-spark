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
  { value: "oneplus", label: "OnePlus" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "oppo", label: "Oppo" },
  { value: "huawei", label: "Huawei" },
  { value: "motorola", label: "Motorola" },
  { value: "sony", label: "Sony" },
  { value: "nothing", label: "Nothing" },
  { value: "honor", label: "Honor" },
  { value: "vivo", label: "Vivo" },
  { value: "asus", label: "ASUS" },
  { value: "nokia", label: "Nokia" },
];

// Comprehensive eSIM compatible devices list as of December 2025
const compatibleDevices: Record<string, string[]> = {
  apple: [
    // iPhone 16 Series (2024)
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
    // iPhone 15 Series (2023)
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    // iPhone 14 Series (2022)
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    // iPhone 13 Series (2021)
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    // iPhone 12 Series (2020)
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    // iPhone SE
    "iPhone SE (3rd generation)", "iPhone SE (2nd generation)",
    // iPhone 11 Series
    "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
    // iPhone XS/XR Series
    "iPhone XS Max", "iPhone XS", "iPhone XR",
    // iPad Pro
    "iPad Pro 12.9-inch (5th gen or later)", "iPad Pro 11-inch (3rd gen or later)",
    // iPad Air
    "iPad Air (4th generation)", "iPad Air (5th generation)",
    // iPad
    "iPad (9th generation)", "iPad (10th generation)",
    // iPad mini
    "iPad mini (6th generation)",
    // Apple Watch
    "Apple Watch Series 9 (GPS + Cellular)", "Apple Watch Ultra 2",
    "Apple Watch Series 8 (GPS + Cellular)", "Apple Watch Ultra",
    "Apple Watch SE (2nd gen, GPS + Cellular)",
  ],
  samsung: [
    // Galaxy S24 Series (2024)
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
    // Galaxy S23 Series (2023)
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE",
    // Galaxy S22 Series (2022)
    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
    // Galaxy S21 Series (2021)
    "Galaxy S21 Ultra 5G", "Galaxy S21+ 5G", "Galaxy S21 5G", "Galaxy S21 FE 5G",
    // Galaxy S20 Series (2020)
    "Galaxy S20 Ultra 5G", "Galaxy S20+ 5G", "Galaxy S20 5G", "Galaxy S20",
    // Galaxy Z Fold Series
    "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4", "Galaxy Z Fold 3 5G",
    // Galaxy Z Flip Series
    "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4", "Galaxy Z Flip 3 5G",
    // Galaxy A Series (select models)
    "Galaxy A55 5G", "Galaxy A54 5G", "Galaxy A35 5G", "Galaxy A34 5G",
    // Galaxy Note Series
    "Galaxy Note 20 Ultra 5G", "Galaxy Note 20 5G",
    // Galaxy Tab
    "Galaxy Tab S9 Ultra 5G", "Galaxy Tab S9+ 5G", "Galaxy Tab S9 5G",
    // Galaxy Watch
    "Galaxy Watch 6 Classic LTE", "Galaxy Watch 6 LTE",
    "Galaxy Watch 5 Pro LTE", "Galaxy Watch 5 LTE",
  ],
  google: [
    // Pixel 9 Series (2024)
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 9 Pro Fold",
    // Pixel 8 Series (2023)
    "Pixel 8 Pro", "Pixel 8", "Pixel 8a",
    // Pixel 7 Series (2022)
    "Pixel 7 Pro", "Pixel 7", "Pixel 7a",
    // Pixel 6 Series (2021)
    "Pixel 6 Pro", "Pixel 6", "Pixel 6a",
    // Pixel Fold
    "Pixel Fold",
    // Pixel 5 Series
    "Pixel 5", "Pixel 5a 5G",
    // Pixel 4 Series
    "Pixel 4 XL", "Pixel 4", "Pixel 4a 5G", "Pixel 4a",
    // Pixel 3 Series
    "Pixel 3 XL", "Pixel 3", "Pixel 3a XL", "Pixel 3a",
    // Pixel Watch
    "Pixel Watch 2 LTE", "Pixel Watch LTE",
  ],
  oneplus: [
    // OnePlus 12 Series (2024)
    "OnePlus 12", "OnePlus 12R",
    // OnePlus 11 Series (2023)
    "OnePlus 11", "OnePlus 11R",
    // OnePlus 10 Series
    "OnePlus 10 Pro", "OnePlus 10T",
    // OnePlus Open (Foldable)
    "OnePlus Open",
    // OnePlus Nord Series
    "OnePlus Nord 3", "OnePlus Nord CE 3",
  ],
  xiaomi: [
    // Xiaomi 14 Series (2024)
    "Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14",
    // Xiaomi 13 Series (2023)
    "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 13T Pro", "Xiaomi 13T",
    // Xiaomi 12 Series
    "Xiaomi 12 Pro", "Xiaomi 12", "Xiaomi 12T Pro", "Xiaomi 12T",
    // Xiaomi Mix Fold Series
    "Xiaomi Mix Fold 3", "Xiaomi Mix Fold 2",
    // Xiaomi Mix Series
    "Xiaomi Mix 4",
    // Redmi Note Series (select models)
    "Redmi Note 13 Pro+ 5G", "Redmi Note 12 Pro+ 5G",
    // POCO Series
    "POCO F5 Pro", "POCO F5",
  ],
  oppo: [
    // Find X7 Series (2024)
    "OPPO Find X7 Ultra", "OPPO Find X7",
    // Find X6 Series (2023)
    "OPPO Find X6 Pro", "OPPO Find X6",
    // Find N Series (Foldables)
    "OPPO Find N3 Flip", "OPPO Find N3", "OPPO Find N2 Flip", "OPPO Find N2",
    // Reno Series
    "OPPO Reno 11 Pro", "OPPO Reno 11", "OPPO Reno 10 Pro+", "OPPO Reno 10 Pro",
    // A Series (select models)
    "OPPO A79 5G", "OPPO A78 5G",
  ],
  huawei: [
    // Note: Huawei devices don't have Google Mobile Services
    // P60 Series (2023)
    "Huawei P60 Pro", "Huawei P60 Art", "Huawei P60",
    // Mate 60 Series (2023)
    "Huawei Mate 60 Pro+", "Huawei Mate 60 Pro", "Huawei Mate 60",
    // Mate X Series (Foldables)
    "Huawei Mate X5", "Huawei Mate X3",
    // P50 Series
    "Huawei P50 Pro", "Huawei P50 Pocket",
    // Mate 50 Series
    "Huawei Mate 50 Pro", "Huawei Mate 50",
    // Nova Series
    "Huawei nova 11 Pro", "Huawei nova 11",
  ],
  motorola: [
    // Razr Series (Foldables)
    "Motorola Razr+ (2024)", "Motorola Razr (2024)",
    "Motorola Razr+ (2023)", "Motorola Razr (2023)",
    "Motorola Razr 5G", "Motorola Razr (2022)",
    // Edge Series
    "Motorola Edge 50 Ultra", "Motorola Edge 50 Pro", "Motorola Edge 50",
    "Motorola Edge 40 Pro", "Motorola Edge 40", "Motorola Edge 40 Neo",
    "Motorola Edge 30 Ultra", "Motorola Edge 30 Pro", "Motorola Edge 30",
    // Moto G Series (select models)
    "Moto G84 5G", "Moto G73 5G", "Moto G54 5G",
    // ThinkPhone
    "ThinkPhone by Motorola",
  ],
  sony: [
    // Xperia 1 Series
    "Sony Xperia 1 VI", "Sony Xperia 1 V", "Sony Xperia 1 IV", "Sony Xperia 1 III",
    // Xperia 5 Series
    "Sony Xperia 5 V", "Sony Xperia 5 IV", "Sony Xperia 5 III",
    // Xperia 10 Series
    "Sony Xperia 10 VI", "Sony Xperia 10 V", "Sony Xperia 10 IV",
    // Xperia Pro Series
    "Sony Xperia Pro-I",
  ],
  nothing: [
    // Phone Series
    "Nothing Phone (2a) Plus", "Nothing Phone (2a)",
    "Nothing Phone (2)", "Nothing Phone (1)",
  ],
  honor: [
    // Magic Series
    "Honor Magic6 Pro", "Honor Magic6", "Honor Magic5 Pro", "Honor Magic5",
    // Magic V Series (Foldables)
    "Honor Magic V2", "Honor Magic Vs",
    // 90 Series
    "Honor 90 Pro", "Honor 90",
    // X Series
    "Honor X9b", "Honor X8a",
  ],
  vivo: [
    // X Series
    "Vivo X100 Pro", "Vivo X100", "Vivo X90 Pro+", "Vivo X90 Pro", "Vivo X90",
    // X Fold Series
    "Vivo X Fold 3 Pro", "Vivo X Fold 3", "Vivo X Fold 2",
    // V Series
    "Vivo V30 Pro", "Vivo V30", "Vivo V29 Pro", "Vivo V29",
    // iQOO Series
    "iQOO 12 Pro", "iQOO 12", "iQOO 11",
  ],
  asus: [
    // ROG Phone Series
    "ROG Phone 8 Pro", "ROG Phone 8", "ROG Phone 7 Ultimate", "ROG Phone 7",
    // Zenfone Series
    "Zenfone 11 Ultra", "Zenfone 10", "Zenfone 9",
  ],
  nokia: [
    "Nokia X30 5G", "Nokia XR21", "Nokia G60 5G",
  ],
};

export const DeviceCompatibility = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setShowResult(false);
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
                <Select value={selectedBrand} onValueChange={handleBrandChange}>
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
                    <SelectContent className="max-h-[300px]">
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
              <Card className={isCompatible ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {isCompatible ? (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-2">
                            ✓ Your Device is Compatible!
                          </h3>
                          <p className="text-green-800 dark:text-green-200">
                            Great news! Your {selectedModel} supports eSIM technology. 
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
                          <h3 className="font-bold text-lg text-red-900 dark:text-red-100 mb-2">
                            Device Not in Our List
                          </h3>
                          <p className="text-red-800 dark:text-red-200">
                            We couldn't find this device in our compatibility list. 
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
                <li><strong>iPhone:</strong> Settings → Cellular → Add eSIM</li>
                <li><strong>Android:</strong> Settings → Network & Internet → SIMs → Add eSIM</li>
                <li>Look for "Add eSIM" or "Add Mobile Plan" option</li>
                <li>Check manufacturer's website for specifications</li>
                <li>Ensure your device is carrier unlocked</li>
              </ul>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <p>List updated December 2025. Device availability and eSIM support may vary by region and carrier.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
