import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FiltersSidebarProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const FiltersSidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
  minPrice,
  maxPrice,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  activeFiltersCount
}: FiltersSidebarProps) => {
  return (
    <Card className="sticky top-24 h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 px-2 text-xs"
            >
              Clear All
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible defaultValue="categories">
          {/* Categories Filter */}
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-semibold">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {categories.filter(cat => cat !== 'all').map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => onCategoryChange(category)}
                    />
                    <Label
                      htmlFor={`cat-${category}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range Filter */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-semibold">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  step={50}
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>R{priceRange[0]}</span>
                  <span>R{priceRange[1]}</span>
                </div>
                
                {/* Preset Ranges */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => onPriceRangeChange([minPrice, 500])}
                  >
                    Under R500
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => onPriceRangeChange([500, 1000])}
                  >
                    R500 - R1,000
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => onPriceRangeChange([1000, 2000])}
                  >
                    R1,000 - R2,000
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => onPriceRangeChange([2000, maxPrice])}
                  >
                    Over R2,000
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sort Options */}
          <AccordionItem value="sort">
            <AccordionTrigger className="text-sm font-semibold">
              Sort By
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={sortBy} onValueChange={onSortChange} className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="featured" id="sort-featured" />
                  <Label htmlFor="sort-featured" className="text-sm font-normal cursor-pointer">
                    Featured
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price_low" id="sort-price-low" />
                  <Label htmlFor="sort-price-low" className="text-sm font-normal cursor-pointer">
                    Price: Low to High
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price_high" id="sort-price-high" />
                  <Label htmlFor="sort-price-high" className="text-sm font-normal cursor-pointer">
                    Price: High to Low
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="sort-newest" />
                  <Label htmlFor="sort-newest" className="text-sm font-normal cursor-pointer">
                    Newest First
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="commission_high" id="sort-commission" />
                  <Label htmlFor="sort-commission" className="text-sm font-normal cursor-pointer">
                    Best Commission
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
