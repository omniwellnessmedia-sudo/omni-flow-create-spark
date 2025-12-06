import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Smartphone, Loader2, Globe, Map, ChevronRight, Wifi, Calendar, Database } from "lucide-react";
import { useRoamBuddyAPI } from "@/hooks/useRoamBuddyAPI";
import { CurrencyToggle } from "./CurrencyToggle";
import { Badge } from "@/components/ui/badge";

interface CountrySearchProps {
  onCountrySelect: (country: string) => void;
  onCheckCompatibility?: () => void;
  selectedCurrency?: 'USD' | 'ZAR';
  onCurrencyChange?: (currency: 'USD' | 'ZAR') => void;
}

interface RegionCategory {
  id: string;
  name: string;
  plans: RegionalPlan[];
}

interface RegionalPlan {
  id: string;
  name: string;
  countries: number;
  price: number;
  data: string;
  validity: string;
  speed?: string;
}

interface GlobalPlan {
  id: string;
  name: string;
  countries: number;
  price: number;
  data: string;
  validity: string;
  speed?: string;
}

// Regional eSIM categories with expandable accordion
const regionalCategories: RegionCategory[] = [
  {
    id: "africa",
    name: "Africa",
    plans: [
      { id: "africa-1gb", name: "Africa 1GB", countries: 35, price: 9, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "africa-2gb", name: "Africa 2GB", countries: 35, price: 16.50, data: "2 GB", validity: "15 Days", speed: "4G/LTE" },
      { id: "africa-3gb", name: "Africa 3GB", countries: 35, price: 24, data: "3 GB", validity: "30 Days", speed: "4G/LTE" },
      { id: "africa-5gb", name: "Africa 5GB", countries: 35, price: 35, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
      { id: "africa-10gb", name: "Africa 10GB", countries: 35, price: 55, data: "10 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "asia",
    name: "Asia",
    plans: [
      { id: "asia-1gb", name: "CloudFlex 1GB", countries: 14, price: 9, data: "1 GB", validity: "7 Days", speed: "4G/5G" },
      { id: "asia-3gb", name: "CloudFlex 3GB", countries: 14, price: 24, data: "3 GB", validity: "30 Days", speed: "4G/5G" },
      { id: "asia-5gb", name: "CloudFlex 5GB", countries: 14, price: 32, data: "5 GB", validity: "30 Days", speed: "4G/5G" },
      { id: "asia-20gb", name: "CloudFlex 20GB", countries: 14, price: 85, data: "20 GB", validity: "365 Days", speed: "4G/5G" },
    ]
  },
  {
    id: "europe",
    name: "Europe",
    plans: [
      { id: "eu-1gb", name: "Globe Plan 1GB", countries: 35, price: 5, data: "1 GB", validity: "7 Days", speed: "4G/5G" },
      { id: "eu-2gb", name: "Globe 2GB", countries: 35, price: 12, data: "2 GB", validity: "15 Days", speed: "4G/5G" },
      { id: "eu-5gb", name: "Globe Plan 5GB", countries: 35, price: 20, data: "5 GB", validity: "30 Days", speed: "4G/5G" },
      { id: "eu-10gb", name: "Globe Plan 10GB", countries: 35, price: 33, data: "10 GB", validity: "30 Days", speed: "4G/5G" },
      { id: "eu-50gb", name: "Globe 50GB", countries: 35, price: 120, data: "50 GB", validity: "365 Days", speed: "4G/5G" },
      { id: "eu-100gb", name: "Cloud 100GB 365D", countries: 35, price: 200, data: "100 GB", validity: "365 Days", speed: "4G/5G" },
    ]
  },
  {
    id: "latam",
    name: "LATAM",
    plans: [
      { id: "latam-1gb", name: "LATAM 1GB", countries: 20, price: 12, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "latam-3gb", name: "LATAM 3GB", countries: 20, price: 28, data: "3 GB", validity: "30 Days", speed: "4G/LTE" },
      { id: "latam-5gb", name: "LATAM 5GB", countries: 20, price: 40, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "north-america",
    name: "North America",
    plans: [
      { id: "na-1gb", name: "North America 1GB", countries: 3, price: 8, data: "1 GB", validity: "7 Days", speed: "4G/5G" },
      { id: "na-5gb", name: "North America 5GB", countries: 3, price: 25, data: "5 GB", validity: "30 Days", speed: "4G/5G" },
      { id: "na-10gb", name: "North America 10GB", countries: 3, price: 45, data: "10 GB", validity: "30 Days", speed: "4G/5G" },
    ]
  },
  {
    id: "oceania",
    name: "Oceania",
    plans: [
      { id: "oceania-1gb", name: "Oceania 1GB", countries: 5, price: 10, data: "1 GB", validity: "7 Days", speed: "4G/5G" },
      { id: "oceania-5gb", name: "Oceania 5GB", countries: 5, price: 35, data: "5 GB", validity: "30 Days", speed: "4G/5G" },
    ]
  },
  {
    id: "middle-east",
    name: "Middle East",
    plans: [
      { id: "me-1gb", name: "Middle East 1GB", countries: 12, price: 11, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "me-5gb", name: "Middle East 5GB", countries: 12, price: 38, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "caribbean",
    name: "Caribbean",
    plans: [
      { id: "carib-1gb", name: "Caribbean 1GB", countries: 15, price: 12, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "carib-5gb", name: "Caribbean 5GB", countries: 15, price: 42, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "cis",
    name: "CIS",
    plans: [
      { id: "cis-1gb", name: "CIS 1GB", countries: 8, price: 10, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "cis-5gb", name: "CIS 5GB", countries: 8, price: 35, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "central-asia",
    name: "Central Asia",
    plans: [
      { id: "ca-1gb", name: "Central Asia 1GB", countries: 6, price: 12, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "ca-5gb", name: "Central Asia 5GB", countries: 6, price: 40, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "east-africa",
    name: "East Africa",
    plans: [
      { id: "ea-1gb", name: "East Africa 1GB", countries: 10, price: 11, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "ea-5gb", name: "East Africa 5GB", countries: 10, price: 38, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "mena",
    name: "Middle East and North Africa",
    plans: [
      { id: "mena-1gb", name: "MENA 1GB", countries: 18, price: 13, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "mena-5gb", name: "MENA 5GB", countries: 18, price: 45, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
  {
    id: "cenam",
    name: "CENAM",
    plans: [
      { id: "cenam-1gb", name: "CENAM 1GB", countries: 12, price: 14, data: "1 GB", validity: "7 Days", speed: "4G/LTE" },
      { id: "cenam-5gb", name: "CENAM 5GB", countries: 12, price: 48, data: "5 GB", validity: "30 Days", speed: "4G/LTE" },
    ]
  },
];

// Global eSIM plans
const globalPlans: GlobalPlan[] = [
  { id: "global-1gb", name: "Global Plan 1GB", countries: 135, price: 5, data: "1 GB", validity: "7 Days", speed: "4G/5G" },
  { id: "global-2gb", name: "Global 2GB", countries: 135, price: 10, data: "2 GB", validity: "15 Days", speed: "4G/5G" },
  { id: "global-3gb", name: "Global 3GB", countries: 135, price: 22, data: "3 GB", validity: "30 Days", speed: "4G/5G" },
  { id: "global-5gb", name: "Global 5GB", countries: 135, price: 35, data: "5 GB", validity: "60 Days", speed: "4G/5G" },
  { id: "global-10gb", name: "Global Pay 10GB", countries: 135, price: 60, data: "10 GB", validity: "180 Days", speed: "4G/5G" },
  { id: "global-20gb", name: "StradaFlex 20GB", countries: 135, price: 100, data: "20 GB", validity: "30 Days", speed: "4G/5G" },
  { id: "global-unl-1d", name: "Global UNL 1D", countries: 30, price: 15, data: "Unlimited GB", validity: "1 Days", speed: "4G/5G" },
  { id: "global-unl-3d", name: "Globe UNL S2", countries: 135, price: 40, data: "Unlimited GB", validity: "3 Days", speed: "4G/5G" },
  { id: "global-unl-5d", name: "CloudFlex UNL 5D", countries: 100, price: 60, data: "Unlimited GB", validity: "5 Days", speed: "4G/5G" },
  { id: "global-unl-7d", name: "United UNL 7D", countries: 70, price: 75, data: "Unlimited GB", validity: "7 Days", speed: "4G/5G" },
  { id: "global-unl-10d", name: "Gotta UNL 100", countries: 35, price: 100, data: "Unlimited GB", validity: "10 Days", speed: "4G/5G" },
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

            <TabsContent value="regional" className="space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {regionalCategories.map((category) => (
                  <AccordionItem 
                    key={category.id} 
                    value={category.id}
                    className="bg-background rounded-xl border border-border overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-semibold text-foreground text-left">{category.name}</span>
                        <Badge variant="secondary" className="ml-auto mr-4">
                          {category.plans.length} plans
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30">
                        {category.plans.map((plan) => (
                          <div 
                            key={plan.id}
                            className="bg-background rounded-lg border border-border p-4 hover:border-primary hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-sm text-foreground">{plan.name}</h4>
                                <p className="text-xs text-muted-foreground">{plan.countries} Countries</p>
                              </div>
                              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-200">
                                {formatPrice(plan.price)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Database className="h-3 w-3" />
                                <span>{plan.data}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Wifi className="h-3 w-3" />
                                <span>{plan.speed || '4G/LTE'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                                <Calendar className="h-3 w-3" />
                                <span>{plan.validity}</span>
                              </div>
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="w-full bg-green-500 hover:bg-green-600 text-white text-xs"
                              onClick={() => onCountrySelect(plan.name)}
                            >
                              View Offer
                            </Button>
                            <p className="text-center text-xs text-muted-foreground mt-2">
                              Get for {formatPrice(plan.price)} 🛒
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="global" className="space-y-4">
              <p className="text-center text-muted-foreground mb-6">
                One plan, worldwide coverage - perfect for multi-destination trips
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {globalPlans.map((plan, index) => (
                  <div 
                    key={plan.id}
                    className={`bg-background rounded-lg border p-4 hover:shadow-lg transition-all duration-200 ${
                      index === 2 ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{plan.name}</h4>
                        <p className="text-xs text-muted-foreground">{plan.countries} Countries</p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-200">
                        {formatPrice(plan.price)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Database className="h-3 w-3" />
                        <span>{plan.data}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Wifi className="h-3 w-3" />
                        <span>{plan.speed || '4G/5G'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                        <Calendar className="h-3 w-3" />
                        <span>{plan.validity}</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className={`w-full text-xs ${index === 2 ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                      variant={index === 2 ? 'default' : 'outline'}
                      onClick={() => onCountrySelect(plan.name)}
                    >
                      View Offer
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      Get for {formatPrice(plan.price)} 🛒
                    </p>
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
