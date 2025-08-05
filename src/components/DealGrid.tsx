import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DealGridProps {
  limit?: number;
}

export default function DealGrid({ limit }: DealGridProps) {
  const deals = [
    { 
      title: "Muizenberg Sunrise Yoga", 
      price: "R99", 
      originalPrice: "R198",
      off: "50%",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      category: "Yoga & Movement"
    },
    { 
      title: "Stellenbosch Wine & Wellness Weekend", 
      price: "R1,999", 
      originalPrice: "R2,856",
      off: "30%",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      category: "Retreats"
    },
    { 
      title: "Kloof Spa Detox Day", 
      price: "R450", 
      originalPrice: "R750",
      off: "40%",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      category: "Spa & Beauty"
    },
    { 
      title: "Mindfulness Meditation Workshop", 
      price: "R150", 
      originalPrice: "R300",
      off: "50%",
      image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=300&fit=crop",
      category: "Mindfulness"
    },
    { 
      title: "Organic Cooking Class", 
      price: "R299", 
      originalPrice: "R499",
      off: "40%",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      category: "Nutrition"
    },
    { 
      title: "Table Mountain Wellness Hike", 
      price: "R89", 
      originalPrice: "R149",
      off: "40%",
      image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop",
      category: "Outdoor Wellness"
    },
  ];

  const displayDeals = limit ? deals.slice(0, limit) : deals;

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-wellness-primary">
          Featured Wellness Deals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDeals.map((deal, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                  Save {deal.off}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg text-wellness-primary">
                  {deal.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{deal.category}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-accent">{deal.price}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      {deal.originalPrice}
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-wellness-primary hover:bg-wellness-primary/90 text-white">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}