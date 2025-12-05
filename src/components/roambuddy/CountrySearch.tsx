import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Smartphone, Loader2 } from "lucide-react";
import { useRoamBuddyAPI } from "@/hooks/useRoamBuddyAPI";

interface CountrySearchProps {
  onCountrySelect: (country: string) => void;
  onCheckCompatibility?: () => void;
}

export const CountrySearch = ({ onCountrySelect, onCheckCompatibility }: CountrySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [countries, setCountries] = useState<Array<{ name: string; code: string; flag: string }>>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const { getCountries } = useRoamBuddyAPI();

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setCountriesLoading(true);
    try {
      const result = await getCountries();
      console.log('Countries API result:', result);
      
      if (result?.data && Array.isArray(result.data)) {
        // API now returns complete country objects with flags
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Search Data Plans For Your Destination
          </h2>
          
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
              <TabsTrigger value="country">Country eSIM</TabsTrigger>
              <TabsTrigger value="regional">Regional eSIM</TabsTrigger>
              <TabsTrigger value="global">Global eSIM</TabsTrigger>
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
                </>
              )}
            </TabsContent>

            <TabsContent value="regional" className="text-center py-12">
              <p className="text-muted-foreground">
                Regional eSIM plans coming soon. Stay tuned for multi-country packages!
              </p>
            </TabsContent>

            <TabsContent value="global" className="text-center py-12">
              <p className="text-muted-foreground">
                Global eSIM plans coming soon. One plan, worldwide coverage!
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};
