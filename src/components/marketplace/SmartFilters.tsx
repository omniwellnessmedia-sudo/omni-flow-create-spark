import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  DollarSign, 
  Star, 
  Filter, 
  X,
  Globe,
  MapPinned
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SmartFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onLocationFilter: (location: string) => void;
  onOnlineFilter: (online: boolean | null) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const SmartFilters = ({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onLocationFilter,
  onOnlineFilter,
  onSortChange,
  onClearFilters,
  activeFilterCount
}: SmartFiltersProps) => {
  const [locationSearch, setLocationSearch] = useState("");
  const [showOnline, setShowOnline] = useState<boolean | null>(null);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleOnlineToggle = (value: 'online' | 'in-person' | 'all') => {
    if (value === 'all') {
      setShowOnline(null);
      onOnlineFilter(null);
    } else if (value === 'online') {
      setShowOnline(true);
      onOnlineFilter(true);
    } else {
      setShowOnline(false);
      onOnlineFilter(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Location Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search location..."
            value={locationSearch}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              onLocationFilter(e.target.value);
            }}
            className="h-9"
          />
          <div className="flex flex-col gap-2">
            <Button
              variant={showOnline === null ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleOnlineToggle('all')}
            >
              All Services
            </Button>
            <Button
              variant={showOnline === true ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleOnlineToggle('online')}
            >
              <Globe className="w-4 h-4 mr-2" />
              Online
            </Button>
            <Button
              variant={showOnline === false ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleOnlineToggle('in-person')}
            >
              <MapPinned className="w-4 h-4 mr-2" />
              In-Person
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Price Range (ZAR)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R{priceRange[0]}</span>
            <span>R{priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label
                htmlFor={category}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sort By */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Star className="w-4 h-4" />
            Sort By
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={onSortChange} defaultValue="relevance">
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
