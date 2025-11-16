import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Sparkles } from "lucide-react";
import { wellnessImages } from "@/lib/wellnessImages";
import { Link } from "react-router-dom";

interface ImpactBadgesProps {
  variant?: 'compact' | 'full';
  showFoundation?: boolean;
  showBWC?: boolean;
  className?: string;
}

export const ImpactBadges = ({ 
  variant = 'compact',
  showFoundation = true,
  showBWC = true,
  className = ''
}: ImpactBadgesProps) => {
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {showFoundation && (
          <Link to="/wellness-exchange/community" className="group">
            <Badge 
              variant="secondary" 
              className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border-green-200 transition-all duration-200 group-hover:scale-105"
            >
              <Heart className="w-3 h-3 mr-1.5 fill-green-600 text-green-600" />
              <span className="text-xs font-medium text-green-900">Supporting Dr. Phil Foundation</span>
            </Badge>
          </Link>
        )}
        {showBWC && (
          <Badge 
            variant="secondary" 
            className="px-3 py-1.5 bg-purple-50 border-purple-200"
          >
            <Leaf className="w-3 h-3 mr-1.5 fill-purple-600 text-purple-600" />
            <span className="text-xs font-medium text-purple-900">BWC Certified</span>
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-purple-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <Heart className="w-12 h-12 text-green-600 fill-green-100" />
              <Sparkles className="w-5 h-5 text-purple-600 absolute -top-1 -right-1" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-2">Shopping with Purpose</h3>
              <p className="text-sm text-muted-foreground">
                Every purchase supports community wellness initiatives and sustainable practices
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showFoundation && (
                <Link 
                  to="/wellness-exchange/community"
                  className="group flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
                >
                  <img 
                    src={wellnessImages.logos.drPhilFoundation} 
                    alt="Dr. Phil Foundation" 
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-green-900 truncate">Dr. Phil Foundation</p>
                    <p className="text-xs text-muted-foreground">Community Projects</p>
                  </div>
                </Link>
              )}
              
              {showBWC && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                  <img 
                    src={wellnessImages.logos.beautyWithoutCruelty} 
                    alt="Beauty Without Cruelty" 
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-purple-900 truncate">BWC Certified</p>
                    <p className="text-xs text-muted-foreground">Cruelty Free</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
