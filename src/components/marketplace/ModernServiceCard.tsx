import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, Star, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getServiceImage } from "@/lib/wellnessImages";
import { useState } from "react";

interface ModernServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    price_zar: number;
    price_wellcoins: number;
    duration_minutes: number;
    location: string;
    is_online: boolean;
    images?: string[] | null;
    provider_profiles: {
      business_name: string;
      specialties?: string[];
    };
  };
}

export const ModernServiceCard = ({ service }: ModernServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const serviceImage = service.images && service.images.length > 0 && !imageError
    ? service.images[0]
    : getServiceImage(service.category);

  return (
    <Link to={`/service/${service.id}`}>
      <Card 
        className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={serviceImage}
            alt={service.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
          
          {/* Category Badge */}
          <Badge 
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-foreground border-0 shadow-lg"
          >
            {service.category}
          </Badge>
          
          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              // Wishlist functionality
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>

          {/* Online Badge */}
          {service.is_online && (
            <Badge className="absolute bottom-3 right-3 bg-green-500 text-white border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Online Available
            </Badge>
          )}
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Provider & Rating */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                {service.provider_profiles.business_name}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">4.8</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{service.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{service.duration_minutes} min</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-end justify-between pt-3 border-t border-border">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">From</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-foreground">
                  R{service.price_zar}
                </p>
                <p className="text-sm text-muted-foreground">
                  or {service.price_wellcoins} WC
                </p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
