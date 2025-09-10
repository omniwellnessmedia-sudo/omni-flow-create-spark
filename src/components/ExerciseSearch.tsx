import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Dumbbell, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface ExerciseSearchFilters {
  name?: string;
  type?: string;
  muscle?: string;
  difficulty?: string;
}

const ExerciseSearch = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ExerciseSearchFilters>({});
  const { toast } = useToast();

  const exerciseTypes = [
    'cardio',
    'olympic_weightlifting', 
    'plyometrics',
    'powerlifting',
    'strength',
    'stretching'
  ];

  const difficulties = ['beginner', 'intermediate', 'expert'];

  const searchExercises = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('exercises-api', {
        body: {
          filters: filters
        },
      });

      if (error) {
        throw error;
      }

      if (data?.exercises) {
        setExercises(data.exercises);
        toast({
          title: "Exercises Found",
          description: `Found ${data.exercises.length} exercises matching your criteria.`,
        });
      } else {
        setExercises([]);
        toast({
          title: "No Exercises Found",
          description: "Try adjusting your search criteria.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching exercises:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to search exercises. Please try again.";
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive",
      });
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ExerciseSearchFilters, value: string) => {
    // Don't include "all" values in the filters
    if (value === 'all-types' || value === 'all-levels') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({});
    setExercises([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength':
      case 'powerlifting':
        return <Dumbbell className="h-4 w-4" />;
      case 'cardio':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold mb-2">
          Exercise <span className="text-gradient-rainbow">Discovery</span>
        </h2>
        <p className="text-muted-foreground">
          Find the perfect exercises for your fitness goals with detailed instructions
        </p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
          <CardDescription>
            Filter exercises by name, type, muscle group, or difficulty level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                placeholder="e.g., push up, squat"
                value={filters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="type">Exercise Type</Label>
              <Select value={filters.type || 'all-types'} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  {exerciseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="muscle">Muscle Group</Label>
              <Input
                id="muscle"
                placeholder="e.g., chest, legs"
                value={filters.muscle || ''}
                onChange={(e) => handleFilterChange('muscle', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={filters.difficulty || 'all-levels'} onValueChange={(value) => handleFilterChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-levels">All Levels</SelectItem>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={searchExercises} 
              disabled={loading}
              className="bg-gradient-rainbow hover:opacity-90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Exercises
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Results */}
      {exercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Found {exercises.length} Exercise{exercises.length !== 1 ? 's' : ''}
          </h3>
          
          <div className="grid gap-4">
            {exercises.map((exercise, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {getTypeIcon(exercise.type)}
                        {exercise.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {exercise.type.replace('_', ' ')}
                        </Badge>
                        {exercise.muscle && (
                          <Badge variant="outline">
                            {exercise.muscle}
                          </Badge>
                        )}
                        {exercise.equipment && exercise.equipment !== 'body_only' && (
                          <Badge variant="outline">
                            {exercise.equipment.replace('_', ' ')}
                          </Badge>
                        )}
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {exercise.instructions}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && exercises.length === 0 && Object.keys(filters).some(key => filters[key as keyof ExerciseSearchFilters]) && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or clearing the filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseSearch;