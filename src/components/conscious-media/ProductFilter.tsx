import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { UseCase, Curator, SkillLevel } from "@/data/consciousMediaProducts";

interface ProductFilterProps {
  selectedCategory: UseCase | 'all';
  selectedCurator: Curator | 'all';
  selectedSkillLevel: SkillLevel | 'all';
  onCategoryChange: (category: UseCase | 'all') => void;
  onCuratorChange: (curator: Curator | 'all') => void;
  onSkillLevelChange: (skillLevel: SkillLevel | 'all') => void;
  onResetFilters: () => void;
  resultCount: number;
}

export const ProductFilter = ({
  selectedCategory,
  selectedCurator,
  selectedSkillLevel,
  onCategoryChange,
  onCuratorChange,
  onSkillLevelChange,
  onResetFilters,
  resultCount,
}: ProductFilterProps) => {
  const categories = [
    { value: 'all' as const, label: 'All Equipment' },
    { value: 'vlogging' as UseCase, label: 'For Vlogging' },
    { value: 'studio' as UseCase, label: 'For Studios' },
    { value: 'travel' as UseCase, label: 'For Travel' },
    { value: 'film-production' as UseCase, label: 'For Film Production' },
  ];

  const curators = [
    { value: 'all' as const, label: 'All Curators' },
    { value: 'ferozza' as Curator, label: "Ferozza's Picks" },
    { value: 'chad' as Curator, label: "Chad's Picks" },
    { value: 'zenith' as Curator, label: "Zenith's Picks" },
  ];

  const skillLevels = [
    { value: 'all' as const, label: 'All Levels' },
    { value: 'beginner' as SkillLevel, label: 'Beginner' },
    { value: 'intermediate' as SkillLevel, label: 'Intermediate' },
    { value: 'professional' as SkillLevel, label: 'Professional' },
  ];

  const hasActiveFilters = selectedCategory !== 'all' || selectedCurator !== 'all' || selectedSkillLevel !== 'all';

  return (
    <div className="space-y-6 pb-8 border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filter Equipment</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* Use Case Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Use Case</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Curator Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Team Curator</label>
        <div className="flex flex-wrap gap-2">
          {curators.map((curator) => (
            <Badge
              key={curator.value}
              variant={selectedCurator === curator.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => onCuratorChange(curator.value)}
            >
              {curator.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Skill Level Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Skill Level</label>
        <div className="flex flex-wrap gap-2">
          {skillLevels.map((level) => (
            <Badge
              key={level.value}
              variant={selectedSkillLevel === level.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => onSkillLevelChange(level.value)}
            >
              {level.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Result Count */}
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{resultCount}</span> products
        </p>
      </div>
    </div>
  );
};
