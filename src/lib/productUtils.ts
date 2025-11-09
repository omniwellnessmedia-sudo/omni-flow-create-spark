interface Product {
  id: string;
  name: string;
  price_zar: number;
  commission_rate: number;
  category: string;
  image_url: string;
  created_at?: string;
  affiliate_url?: string;
}

export const selectFeaturedProducts = (products: Product[], count: number = 8): Product[] => {
  // Filter products with valid images and minimum price
  const eligibleProducts = products.filter(p => 
    p.image_url && 
    p.price_zar >= 200 &&
    p.commission_rate > 0
  );

  // Sort by commission rate (high to low)
  const sortedByCommission = [...eligibleProducts].sort(
    (a, b) => b.commission_rate - a.commission_rate
  );

  // Get diverse categories
  const categoryMap = new Map<string, Product[]>();
  sortedByCommission.forEach(product => {
    const category = product.category || 'Other';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(product);
  });

  // Select products ensuring category diversity
  const featured: Product[] = [];
  const categories = Array.from(categoryMap.keys());
  let categoryIndex = 0;

  while (featured.length < count && featured.length < eligibleProducts.length) {
    const category = categories[categoryIndex % categories.length];
    const categoryProducts = categoryMap.get(category) || [];
    
    if (categoryProducts.length > 0) {
      const product = categoryProducts.shift()!;
      featured.push(product);
    }
    
    categoryIndex++;
    
    // Break if we've cycled through all categories and found nothing
    if (categoryIndex > categories.length * 2) break;
  }

  return featured.slice(0, count);
};

export const isNewProduct = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(createdAt) > sevenDaysAgo;
};

export const hasHighCommission = (commissionRate: number): boolean => {
  return commissionRate >= 0.15; // 15% or higher
};

export const formatCommission = (price: number, rate: number): string => {
  const commission = price * rate;
  return `R${commission.toFixed(0)}`;
};
