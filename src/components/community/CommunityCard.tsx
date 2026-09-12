import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SmartImage from '@/components/ui/smart-image';

interface CommunityCardProps {
  item: {
    title: string;
    description: string;
    href: string;
    image: string;
    badge: string;
  };
  orientation: 'portrait' | 'landscape';
}

export const CommunityCard = ({ item, orientation }: CommunityCardProps) => {
  // Taller aspect ratio for more visual impact
  const aspectRatio = 'aspect-[3/4]';
  
  return (
    <Link to={item.href} className="group block">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
        <div className={`relative ${aspectRatio} w-full`}>
          {/* Was a bare img, and this component draws the eleven community
              cards on the home page: the single largest block of photographs
              on the site. A bare img asks storage for the camera original and
              has no fallback, so every one of them downloaded several
              megabytes to fill a card about 390px wide, and a single failed
              request left a broken glyph. SmartImage asks for a resized copy
              first and keeps the original behind it. */}
          <SmartImage
            src={item.image}
            alt={item.title}
            renderWidth={520}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <Badge className="mb-3 bg-white/20 backdrop-blur-sm border-white/30 text-white">
              {item.badge}
            </Badge>
            <h3 className="font-bold text-xl mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
