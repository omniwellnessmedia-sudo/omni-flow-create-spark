import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, Check, Minus, TrendingUp } from 'lucide-react';
import { PriceDisplay } from '@/components/ui/price-display';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  price_zar: number;
  price_usd: number;
  price_eur: number;
  commission_rate?: number;
  affiliate_url: string;
  affiliate_program_id: string;
  advertiser_name?: string;
}

interface ProductComparisonProps {
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveProduct: (productId: string) => void;
}

export const ProductComparison = ({ 
  products, 
  open, 
  onOpenChange,
  onRemoveProduct 
}: ProductComparisonProps) => {
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      setComparisonData(products);
    }
  }, [products]);

  const comparisonRows = [
    {
      label: 'Product',
      render: (product: Product) => (
        <div className="space-y-2">
          <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded-lg" />
          <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
        </div>
      ),
    },
    {
      label: 'Category',
      render: (product: Product) => <Badge variant="outline">{product.category}</Badge>,
    },
    {
      label: 'Price (ZAR)',
      render: (product: Product) => (
        <div className="font-bold text-lg">R{product.price_zar.toFixed(2)}</div>
      ),
    },
    {
      label: 'Price (USD)',
      render: (product: Product) => (
        <div className="text-muted-foreground">${product.price_usd.toFixed(2)}</div>
      ),
    },
    {
      label: 'Commission Rate',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="font-semibold">{((product.commission_rate || 0) * 100).toFixed(1)}%</span>
        </div>
      ),
    },
    {
      label: 'Your Earning',
      render: (product: Product) => (
        <div className="text-green-600 font-semibold">
          R{(product.price_zar * (product.commission_rate || 0)).toFixed(2)}
        </div>
      ),
    },
    {
      label: 'Brand',
      render: (product: Product) => (
        <span className="text-sm">{product.advertiser_name || 'N/A'}</span>
      ),
    },
    {
      label: 'Action',
      render: (product: Product) => (
        <AddToCartButton
          item={{
            id: product.id,
            title: product.name,
            price_zar: product.price_zar,
            price_usd: product.price_usd,
            price_eur: product.price_eur,
            image: product.image_url,
            category: product.category,
            item_type: 'affiliate',
            affiliate_url: product.affiliate_url,
            affiliate_program_id: product.affiliate_program_id,
            commission_rate: product.commission_rate,
          }}
          className="w-full"
          size="sm"
        />
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Compare Products</DialogTitle>
        </DialogHeader>

        {comparisonData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No products to compare</p>
            <p className="text-sm mt-2">Add products by clicking the compare icon</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b w-32">Feature</th>
                  {comparisonData.map((product) => (
                    <th key={product.id} className="p-3 border-b min-w-[200px] relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3 font-medium text-sm text-muted-foreground bg-muted/30">
                      {row.label}
                    </td>
                    {comparisonData.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        {row.render(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Comparing {comparisonData.length} product{comparisonData.length !== 1 ? 's' : ''}
          </p>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
