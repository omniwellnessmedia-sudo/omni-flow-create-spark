import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, CartItem } from "@/components/CartProvider";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton = ({
  item,
  variant = "default",
  size = "default",
  className = "",
  disabled = false
}: AddToCartButtonProps) => {
  const { addItem, items } = useCart();
  const { toast } = useToast();

  const isInCart = items.some((i) => i.id === item.id);

  const handleAddToCart = () => {
    if (isInCart) return;
    addItem(item);
    toast({
      title: "Added to cart!",
      description: `${item.title} has been added to your cart.`,
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      className={`${className} ${isInCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
      disabled={isInCart || disabled}
    >
      {isInCart ? (
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