import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const aspectRatio = orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[16/9]';
  
  return (
    <Link to={item.href} className="group block h-full">
      <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-border/50">
        <div className={`relative ${aspectRatio} w-full`}>
          <img 
            src={item.image} 
            alt={item.title}
            loading="lazy"
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
