import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SmartProductImage } from './SmartProductImage';
import { Eye, ShoppingCart } from 'lucide-react';
import { selectFeaturedProducts, formatCommission } from '@/lib/productUtils';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

interface FeaturedProduct {
  id: string;
  name: string;
  category: string;
  image_url: string;
  price_zar: number;
  price_usd: number;
  price_eur?: number;
  commission_rate: number;
  affiliate_url?: string;
  created_at?: string;
}

interface FeaturedProductsCarouselProps {
  products: FeaturedProduct[];
  onQuickView?: (productId: string) => void;
}

export const FeaturedProductsCarousel = ({ 
  products,
  onQuickView 
}: FeaturedProductsCarouselProps) => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const featured = selectFeaturedProducts(products, 8);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Featured Wellness Essentials
        </h2>
        <p className="text-muted-foreground text-lg">
          Hand-picked products for your wellness journey
        </p>
      </div>

      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="-ml-4">
          {featured.map((product) => (
            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="group relative overflow-hidden h-full hover:shadow-2xl transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <SmartProductImage
                    src={product.image_url}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Price Badge */}
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-lg px-3 py-1 shadow-lg">
                    R{product.price_zar.toFixed(0)}
                  </Badge>

                  {/* Commission Badge */}
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white text-sm px-2 py-1">
                    Earn {formatCommission(product.price_zar, product.commission_rate)}
                  </Badge>

                  {/* Hover Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => onQuickView?.(product.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Quick View
                      </Button>
                      {product.affiliate_url && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full"
                          asChild
                        >
                          <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-card">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                  <Link to={`/cj-products/${product.id}`}>
                    <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>
    </section>
  );
};
