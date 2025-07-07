import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const AddToCartButton = ({ 
  item, 
  variant = "default", 
  size = "default", 
  className = "" 
}: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(item);
    setIsAdded(true);
    
    toast({
      title: "Added to cart!",
      description: `${item.title} has been added to your cart.`,
    });

    // Reset the added state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      className={`${className} ${isAdded ? 'bg-green-600 hover:bg-green-700' : ''}`}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  );
};