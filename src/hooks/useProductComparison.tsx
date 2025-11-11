import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ComparisonProduct {
  id: string;
  name: string;
  category: string;
}

const MAX_COMPARISON = 3;
const STORAGE_KEY = 'omni-product-comparison';

export const useProductComparison = () => {
  const [comparisonProducts, setComparisonProducts] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setComparisonProducts(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading comparison products:', error);
      }
    }
  }, []);

  const addToComparison = (product: ComparisonProduct) => {
    if (comparisonProducts.includes(product.id)) {
      toast({
        title: 'Already in comparison',
        description: `${product.name} is already in your comparison list`,
      });
      return false;
    }

    if (comparisonProducts.length >= MAX_COMPARISON) {
      toast({
        title: 'Comparison limit reached',
        description: `You can only compare up to ${MAX_COMPARISON} products at once`,
        variant: 'destructive',
      });
      return false;
    }

    const updated = [...comparisonProducts, product.id];
    setComparisonProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    toast({
      title: 'Added to comparison',
      description: `${product.name} added to comparison (${updated.length}/${MAX_COMPARISON})`,
    });
    return true;
  };

  const removeFromComparison = (productId: string) => {
    const updated = comparisonProducts.filter(id => id !== productId);
    setComparisonProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    toast({
      title: 'Removed from comparison',
      description: 'Product removed from comparison list',
    });
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: 'Comparison cleared',
      description: 'All products removed from comparison',
    });
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.includes(productId);
  };

  return {
    comparisonProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddMore: comparisonProducts.length < MAX_COMPARISON,
    count: comparisonProducts.length,
  };
};
