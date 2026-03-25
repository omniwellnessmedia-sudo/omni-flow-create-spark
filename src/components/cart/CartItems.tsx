import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

export const CartItems = () => {
  const { items, removeItem, updateQuantity, clearCart, totalZAR, totalWellCoins } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button asChild>
          <Link to="/services">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {items.map((item) => (
          <Card key={item.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  {item.category && (
                    <p className="text-xs text-gray-500">{item.category}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-sm">R{(item.price_zar * item.quantity).toFixed(2)}</p>
                  {item.price_wellcoins && (
                    <p className="text-xs text-green-600">{item.price_wellcoins * item.quantity} WellCoins</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>R{totalZAR.toFixed(2)}</span>
          </div>
          {totalWellCoins > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>WellCoins</span>
              <span>{totalWellCoins}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>R{totalZAR.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="w-full"
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};