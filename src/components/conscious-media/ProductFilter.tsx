import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { UseCase, Curator, SkillLevel } from "@/data/consciousMediaProducts";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";

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
  const { trackProductView } = useConsciousAffiliate();
  const hasActiveFilters = selectedCategory !== 'all' || selectedCurator !== 'all' || selectedSkillLevel !== 'all';

  const handleCategoryChange = async (category: UseCase | 'all') => {
    onCategoryChange(category);
    await trackProductView(
      `Filter: Category - ${category}`,
      'conscious_media_infrastructure_filter',
      'category_filter'
    );
  };

  const handleCuratorClick = async (curator: Curator | 'all') => {
    onCuratorChange(curator);
    if (curator !== 'all') {
      await trackProductView(
        `Filter: Curator - ${curator}`,
        'conscious_media_infrastructure_filter',
        'curator_filter'
      );
    }
  };

  const handleSkillLevelClick = async (level: SkillLevel | 'all') => {
    onSkillLevelChange(level);
    if (level !== 'all') {
      await trackProductView(
        `Filter: Skill Level - ${level}`,
        'conscious_media_infrastructure_filter',
        'skill_level_filter'
      );
    }
  };

  return (
    <div className="space-y-8 pb-8 border-b border-border">
      {/* Header with Result Count */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Filter Equipment</h3>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{resultCount}</span> {resultCount === 1 ? 'product' : 'products'}
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Reset All
          </Button>
        )}
      </div>

      {/* Use Case Tabs - Primary Filter */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground uppercase tracking-wider">
          What are you creating?
        </label>
        <Tabs value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as UseCase | 'all')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-muted p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Equipment
            </TabsTrigger>
            <TabsTrigger value="vlogging" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Vlogging
            </TabsTrigger>
            <TabsTrigger value="studio" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Studio
            </TabsTrigger>
            <TabsTrigger value="travel" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Travel
            </TabsTrigger>
            <TabsTrigger value="film-production" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Film Production
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Secondary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Curator Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground uppercase tracking-wider">
            Team Curator
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCurator === 'all' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleCuratorClick('all')}
            >
              All
            </Badge>
            <Badge
              variant={selectedCurator === 'ferozza' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleCuratorClick('ferozza')}
            >
              Feroza
            </Badge>
            <Badge
              variant={selectedCurator === 'chad' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleCuratorClick('chad')}
            >
              Chad
            </Badge>
            <Badge
              variant={selectedCurator === 'zenith' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleCuratorClick('zenith')}
            >
              Zenith
            </Badge>
          </div>
        </div>

        {/* Skill Level Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground uppercase tracking-wider">
            Experience Level
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedSkillLevel === 'all' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleSkillLevelClick('all')}
            >
              All
            </Badge>
            <Badge
              variant={selectedSkillLevel === 'beginner' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleSkillLevelClick('beginner')}
            >
              Beginner
            </Badge>
            <Badge
              variant={selectedSkillLevel === 'intermediate' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleSkillLevelClick('intermediate')}
            >
              Intermediate
            </Badge>
            <Badge
              variant={selectedSkillLevel === 'professional' ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
              onClick={() => handleSkillLevelClick('professional')}
            >
              Professional
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
