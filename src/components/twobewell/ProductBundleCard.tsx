import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { ProductBundle } from "@/data/twoBeWellBundles";
import { getProductById } from "@/data/twoBeWellProducts";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { PriceDisplay } from "@/components/ui/price-display";

interface ProductBundleCardProps {
  bundle: ProductBundle;
}

export const ProductBundleCard = ({ bundle }: ProductBundleCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Add bundle as a single cart item
    addItem({
      id: bundle.id,
      title: bundle.name,
      price_zar: bundle.bundlePrice,
      price_usd: bundle.bundlePrice / 18,
      wellcoins: bundle.wellCoins,
      category: "bundle"
    });

    toast({
      title: "Bundle added to cart!",
      description: `${bundle.name} has been added to your cart.`
    });
  };

  const bundleProducts = bundle.products
    .map(id => getProductById(id))
    .filter(p => p !== undefined);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-br from-green-50 to-blue-50 pb-4">
        <div className="flex items-start justify-between mb-2">
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <Sparkles className="w-3 h-3 mr-1" />
            Save R{bundle.savings}!
          </Badge>
          <Badge variant="secondary">Bundle Deal</Badge>
        </div>
        <CardTitle className="text-2xl">{bundle.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{bundle.tagline}</p>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Bundle Products */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">This bundle includes:</h4>
          <div className="grid grid-cols-3 gap-2">
            {bundleProducts.map((product) => (
              <div key={product.id} className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden mb-2 border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {bundle.description}
        </p>

        {/* Benefits */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Why choose this bundle?</h4>
          <ul className="space-y-1">
            {bundle.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="border-t pt-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm text-muted-foreground line-through">
              R{bundle.originalPrice}
            </span>
            <PriceDisplay 
              price={bundle.bundlePrice} 
              showBothCurrencies={false}
              size="lg"
            />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Earn {bundle.wellCoins} WellCoins
          </p>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full" 
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add Bundle to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
