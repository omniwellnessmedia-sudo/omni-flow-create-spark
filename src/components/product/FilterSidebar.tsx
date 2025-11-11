import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  brands?: string[];
  categories?: string[];
  currentFilters: FilterState;
}

export interface FilterState {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedCategories: string[];
  minCommission: number;
  minRating: number;
  inStock: boolean;
  onSale: boolean;
}

export const FilterSidebar = ({ 
  onFilterChange, 
  brands = [], 
  categories = [],
  currentFilters 
}: FilterSidebarProps) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    updateFilters({ selectedBrands: newBrands });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    updateFilters({ selectedCategories: newCategories });
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 5000],
      selectedBrands: [],
      selectedCategories: [],
      minCommission: 0,
      minRating: 0,
      inStock: false,
      onSale: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = 
    filters.selectedBrands.length + 
    filters.selectedCategories.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.minCommission > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range (ZAR)</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            min={0}
            max={5000}
            step={50}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R{filters.priceRange[0]}</span>
            <span>R{filters.priceRange[1]}+</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      {categories.length > 0 && (
        <>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer capitalize"
                  >
                    {category.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Brands</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Commission Rate */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Commission</Label>
        <div className="space-y-2">
          {[0, 8, 10, 12, 15].map((rate) => (
            <div key={rate} className="flex items-center space-x-2">
              <Checkbox
                id={`commission-${rate}`}
                checked={filters.minCommission === rate}
                onCheckedChange={() => updateFilters({ minCommission: rate })}
              />
              <Label
                htmlFor={`commission-${rate}`}
                className="text-sm font-normal cursor-pointer"
              >
                {rate > 0 ? `${rate}%+` : 'Any'}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="space-y-2">
          {[0, 4.0, 4.5].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.minRating === rating}
                onCheckedChange={() => updateFilters({ minRating: rating })}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm font-normal cursor-pointer"
              >
                {rating > 0 ? `${rating}+ stars` : 'Any rating'}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Availability</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilters({ inStock: checked as boolean })}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={filters.onSale}
              onCheckedChange={(checked) => updateFilters({ onSale: checked as boolean })}
            />
            <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
              On Sale
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
