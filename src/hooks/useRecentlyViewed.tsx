import { useState, useEffect } from 'react';

interface RecentlyViewedProduct {
  id: string;
  viewedAt: number;
  category: string;
}

const MAX_ITEMS = 20;
const STORAGE_KEY = 'omni-recently-viewed';

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      }
    } catch (err) {
      console.error('Error loading recently viewed:', err);
    }
  };

  const addToRecentlyViewed = (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    const newItem = { ...product, viewedAt: Date.now() };
    
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== product.id);
      // Add to beginning
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getRecentlyViewed = (excludeId?: string, limit: number = 6) => {
    return recentlyViewed
      .filter(item => item.id !== excludeId)
      .slice(0, limit);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewed
  };
};
