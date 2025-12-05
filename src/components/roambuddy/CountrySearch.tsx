import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Smartphone, Loader2, Globe, Map } from "lucide-react";
import { useRoamBuddyAPI } from "@/hooks/useRoamBuddyAPI";
import { CurrencyToggle } from "./CurrencyToggle";

interface CountrySearchProps {
  onCountrySelect: (country: string) => void;
  onCheckCompatibility?: () => void;
  selectedCurrency?: 'USD' | 'ZAR';
  onCurrencyChange?: (currency: 'USD' | 'ZAR') => void;
}

interface RegionalPlan {
  id: string;
  name: string;
  description: string;
  countries: string[];
  price: number;
  data: string;
  validity: string;
}

interface GlobalPlan {
  id: string;
  name: string;
  description: string;
  coverage: string;
  price: number;
  data: string;
  validity: string;
}

// Regional eSIM plans
const regionalPlans: RegionalPlan[] = [
  {
    id: "europe",
    name: "Europe eSIM",
    description: "Coverage across 40+ European countries",
    countries: ["France", "Germany", "Italy", "Spain", "UK", "Netherlands", "Belgium", "Switzerland", "Austria", "Portugal", "Greece", "Ireland", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Czech Republic", "Hungary", "Croatia"],
    price: 19.99,
    data: "5GB",
    validity: "30 days"
  },
  {
    id: "asia",
    name: "Asia Pacific eSIM",
    description: "Coverage across 20+ Asian countries",
    countries: ["Japan", "South Korea", "Thailand", "Vietnam", "Singapore", "Malaysia", "Indonesia", "Philippines", "Hong Kong", "Taiwan", "India", "Sri Lanka", "Cambodia", "Laos", "Myanmar"],
    price: 24.99,
    data: "5GB",
    validity: "30 days"
  },
  {
    id: "africa",
    name: "Africa eSIM",
    description: "Coverage across 15+ African countries",
    countries: ["South Africa", "Kenya", "Tanzania", "Morocco", "Egypt", "Nigeria", "Ghana", "Ethiopia", "Rwanda", "Uganda", "Senegal", "Ivory Coast", "Cameroon", "Botswana", "Namibia"],
    price: 29.99,
    data: "3GB",
    validity: "30 days"
  },
  {
    id: "americas",
    name: "Americas eSIM",
    description: "Coverage across North & South America",
    countries: ["USA", "Canada", "Mexico", "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Costa Rica", "Panama", "Puerto Rico", "Dominican Republic"],
    price: 24.99,
    data: "5GB",
    validity: "30 days"
  },
  {
    id: "middle-east",
    name: "Middle East eSIM",
    description: "Coverage across Middle Eastern countries",
    countries: ["UAE", "Saudi Arabia", "Qatar", "Bahrain", "Kuwait", "Oman", "Jordan", "Israel", "Turkey", "Lebanon"],
    price: 22.99,
    data: "3GB",
    validity: "30 days"
  },
  {
    id: "oceania",
    name: "Oceania eSIM",
    description: "Coverage across Australia & Pacific Islands",
    countries: ["Australia", "New Zealand", "Fiji", "Papua New Guinea", "Guam"],
    price: 19.99,
    data: "5GB",
    validity: "30 days"
  }
];

// Global eSIM plans
const globalPlans: GlobalPlan[] = [
  {
    id: "global-lite",
    name: "Global Lite",
    description: "Perfect for light travelers",
    coverage: "100+ countries worldwide",
    price: 29.99,
    data: "1GB",
    validity: "30 days"
  },
  {
    id: "global-standard",
    name: "Global Standard",
    description: "Most popular for international travelers",
    coverage: "120+ countries worldwide",
    price: 49.99,
    data: "3GB",
    validity: "30 days"
  },
  {
    id: "global-pro",
    name: "Global Pro",
    description: "For heavy data users & digital nomads",
    coverage: "140+ countries worldwide",
    price: 79.99,
    data: "5GB",
    validity: "30 days"
  },
  {
    id: "global-unlimited",
    name: "Global Unlimited",
    description: "Unlimited data worldwide",
    coverage: "150+ countries worldwide",
    price: 129.99,
    data: "Unlimited",
    validity: "30 days"
  }
];

export const CountrySearch = ({ 
  onCountrySelect, 
  onCheckCompatibility,
  selectedCurrency = 'USD',
  onCurrencyChange
}: CountrySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [countries, setCountries] = useState<Array<{ name: string; code: string; flag: string }>>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>(selectedCurrency);
  const { getCountries } = useRoamBuddyAPI();

  // USD to ZAR conversion rate
  const ZAR_RATE = 18.5;

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    setCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const handleCurrencyChange = (newCurrency: 'USD' | 'ZAR') => {
    setCurrency(newCurrency);
    onCurrencyChange?.(newCurrency);
  };

  const formatPrice = (usdPrice: number): string => {
    if (currency === 'USD') {
      return `$${usdPrice.toFixed(2)}`;
    }
    return `R${(usdPrice * ZAR_RATE).toFixed(0)}`;
  };

  const loadCountries = async () => {
    setCountriesLoading(true);
    try {
      const result = await getCountries();
      console.log('Countries API result:', result);
      
      if (result?.data && Array.isArray(result.data)) {
        const countriesWithFlags = result.data.map((country: any) => ({
          name: country.name || country.country_name,
          code: country.code || country.country_code,
          flag: country.flag || "🌍",
        }));
        console.log('Processed countries:', countriesWithFlags.length);
        setCountries(countriesWithFlags);
      } else {
        console.error('Invalid countries response:', result);
      }
    } catch (err) {
      console.error('Error loading countries:', err);
    } finally {
      setCountriesLoading(false);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCountries = showAll ? filteredCountries : filteredCountries.slice(0, 12);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Search Data Plans For Your Destination
            </h2>
            <CurrencyToggle 
              currency={currency} 
              onCurrencyChange={handleCurrencyChange} 
            />
          </div>
          
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Start searching by country (180+ countries included)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-base bg-background"
              />
            </div>
            
            <div className="text-center mt-3 text-sm text-muted-foreground">
              for unlocked{" "}
              <button 
                onClick={onCheckCompatibility}
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <Smartphone className="h-3 w-3" />
                eSIM-enabled devices
              </button>
            </div>
          </div>

          <Tabs defaultValue="country" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="country" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Country eSIM
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Regional eSIM
              </TabsTrigger>
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Global eSIM
              </TabsTrigger>
            </TabsList>

            <TabsContent value="country" className="space-y-6">
              {countriesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Loading countries...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {displayedCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => onCountrySelect(country.name)}
                        className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <span className="text-3xl">{country.flag}</span>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {country.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {!showAll && filteredCountries.length > 12 && (
                    <div className="text-center mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowAll(true)}
                        className="px-8"
                      >
                        Show All Countries ({filteredCountries.length})
                      </Button>
                    </div>
                  )}
                  
                  {filteredCountries.length === 0 && !countriesLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      No countries found matching "{searchQuery}"
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="regional" className="space-y-6">
              <p className="text-center text-muted-foreground mb-6">
                Save more with regional plans covering multiple countries
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regionalPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-background rounded-xl border border-border p-6 hover:border-primary hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Map className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium text-foreground">{plan.data}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Validity:</span>
                        <span className="font-medium text-foreground">{plan.validity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Countries:</span>
                        <span className="font-medium text-foreground">{plan.countries.length}+</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      Includes: {plan.countries.slice(0, 5).join(", ")}...
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{formatPrice(plan.price)}</span>
                      <Button size="sm" onClick={() => onCountrySelect(plan.name)}>
                        Select Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="global" className="space-y-6">
              <p className="text-center text-muted-foreground mb-6">
                One plan, worldwide coverage - perfect for multi-destination trips
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {globalPlans.map((plan, index) => (
                  <div 
                    key={plan.id}
                    className={`bg-background rounded-xl border p-6 hover:shadow-lg transition-all duration-200 ${
                      index === 1 ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary'
                    }`}
                  >
                    {index === 1 && (
                      <div className="text-xs font-semibold text-primary mb-2">
                        ★ MOST POPULAR
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium text-foreground">{plan.data}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Validity:</span>
                        <span className="font-medium text-foreground">{plan.validity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Coverage:</span>
                        <span className="font-medium text-foreground">{plan.coverage}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{formatPrice(plan.price)}</span>
                      <Button 
                        size="sm" 
                        variant={index === 1 ? "default" : "outline"}
                        onClick={() => onCountrySelect(plan.name)}
                      >
                        Select Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};
