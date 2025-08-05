import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DealGridProps {
  limit?: number;
}

export default function DealGrid({ limit }: DealGridProps) {
  const deals = [
    { 
      title: "Cape Town Wellness Experiences", 
      price: "R299", 
      originalPrice: "R599",
      off: "50%",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      category: "Spa & Beauty",
      location: "Cape Town"
    },
    { 
      title: "Johannesburg Fitness Experiences", 
      price: "R199", 
      originalPrice: "R399",
      off: "50%",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      category: "Fitness",
      location: "Johannesburg"
    },
    { 
      title: "Pretoria Wellness Experiences", 
      price: "R449", 
      originalPrice: "R699",
      off: "36%",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      category: "Retreats",
      location: "Pretoria"
    },
    { 
      title: "Durban Wellness Experiences", 
      price: "R359", 
      originalPrice: "R599",
      off: "40%",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      category: "Spa & Beauty",
      location: "Durban"
    },
    { 
      title: "Wellness Product Shopping", 
      price: "R150", 
      originalPrice: "R300",
      off: "50%",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      category: "Products",
      location: "National"
    },
  ];

  const displayDeals = limit ? deals.slice(0, limit) : deals;

  return (
    <section className="bg-gray-50 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            What are you Shopping for Today?
          </h2>
          <button className="text-cyan-500 hover:text-cyan-600 font-medium">
            VIEW ALL →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayDeals.map((deal, index) => (
            <Card key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border-0">
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-pink-500 text-white text-sm font-bold px-2 py-1 rounded">
                    Save {deal.off}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{deal.category}</p>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <span>📍</span>
                  <span>{deal.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">{deal.price}</span>
                  <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                </div>
                
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2">
                  View Deal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}