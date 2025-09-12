interface WellnessDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  category: 'spa' | 'fitness' | 'nutrition' | 'meditation' | 'retreats' | 'beauty';
  location: 'cape-town' | 'johannesburg' | 'durban' | 'pretoria';
  provider: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  availableUntil: string;
  features: string[];
  terms: string;
}

interface WellnessDealsAPIResponse {
  deals: WellnessDeal[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface FetchDealsParams {
  location?: string;
  category?: string;
  priceRange?: [number, number];
  page?: number;
  limit?: number;
}

class SouthAfricanWellnessDealsAPI {
  private baseUrl = 'https://api.wellnessdeals.co.za'; // Mock API endpoint
  
  // Mock data for development - represents real South African wellness deals
  private mockDeals: WellnessDeal[] = [
    {
      id: '1',
      title: 'Full Body Swedish Massage at Arabella Spa',
      description: 'Indulge in a 60-minute full body Swedish massage at the award-winning Arabella Hotel & Spa in the heart of the Overberg.',
      originalPrice: 850,
      discountedPrice: 425,
      discountPercentage: 50,
      category: 'spa',
      location: 'cape-town',
      provider: 'Arabella Hotel & Spa',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.8,
      reviewCount: 156,
      availableUntil: '2024-12-31',
      features: ['60-minute treatment', 'Luxury spa facilities', 'Complimentary refreshments'],
      terms: 'Valid Monday to Thursday. Booking required 48 hours in advance.'
    },
    {
      id: '2',
      title: '10-Class Yoga Package at YogaLife Studios',
      description: 'Transform your wellness journey with 10 yoga classes at YogaLife Studios in Cape Town. Choose from Hatha, Vinyasa, or Restorative yoga.',
      originalPrice: 1200,
      discountedPrice: 600,
      discountPercentage: 50,
      category: 'fitness',
      location: 'cape-town',
      provider: 'YogaLife Studios',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.9,
      reviewCount: 89,
      availableUntil: '2024-11-30',
      features: ['10 yoga classes', 'Multiple styles available', '3-month validity'],
      terms: 'Classes must be used within 3 months of purchase.'
    },
    {
      id: '3',
      title: 'Nutritional Consultation & Meal Plan',
      description: 'Get a comprehensive nutritional assessment and personalized 4-week meal plan from a registered dietitian.',
      originalPrice: 650,
      discountedPrice: 325,
      discountPercentage: 50,
      category: 'nutrition',
      location: 'johannesburg',
      provider: 'Wellness Nutrition Clinic',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.7,
      reviewCount: 34,
      availableUntil: '2024-12-15',
      features: ['1-hour consultation', '4-week meal plan', 'Follow-up session'],
      terms: 'Initial consultation must be booked within 30 days.'
    },
    {
      id: '4',
      title: 'Drakensberg Wellness Retreat Weekend',
      description: '2-night wellness retreat in the Drakensberg mountains including yoga, meditation, hiking, and organic meals.',
      originalPrice: 2800,
      discountedPrice: 1680,
      discountPercentage: 40,
      category: 'retreats',
      location: 'durban',
      provider: 'Mountain Bliss Retreat',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.9,
      reviewCount: 67,
      availableUntil: '2024-10-31',
      features: ['2 nights accommodation', 'All meals included', 'Yoga & meditation sessions', 'Guided nature walks'],
      terms: 'Subject to availability. Non-refundable after booking confirmation.'
    },
    {
      id: '5',
      title: 'Mindfulness Meditation Course (8 weeks)',
      description: 'Learn evidence-based mindfulness techniques in this comprehensive 8-week course led by certified instructors.',
      originalPrice: 950,
      discountedPrice: 475,
      discountPercentage: 50,
      category: 'meditation',
      location: 'cape-town',
      provider: 'Mindful Living Center',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.8,
      reviewCount: 112,
      availableUntil: '2024-11-15',
      features: ['8 weekly sessions', 'Take-home materials', 'Guided meditation recordings'],
      terms: 'Course starts first Monday of each month.'
    },
    {
      id: '6',
      title: 'Luxury Facial & Manicure Package',
      description: 'Pamper yourself with a 90-minute luxury facial and gel manicure at an award-winning beauty salon.',
      originalPrice: 720,
      discountedPrice: 360,
      discountPercentage: 50,
      category: 'beauty',
      location: 'johannesburg',
      provider: 'Elegance Beauty Salon',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.6,
      reviewCount: 78,
      availableUntil: '2024-12-20',
      features: ['90-minute facial', 'Gel manicure', 'Complimentary consultation'],
      terms: 'Valid Tuesday to Friday. Advanced booking required.'
    },
    {
      id: '7',
      title: 'Personal Training Package (8 sessions)',
      description: 'Transform your fitness with 8 one-on-one personal training sessions with a certified fitness professional.',
      originalPrice: 1600,
      discountedPrice: 960,
      discountPercentage: 40,
      category: 'fitness',
      location: 'pretoria',
      provider: 'FitLife Personal Training',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.9,
      reviewCount: 45,
      availableUntil: '2024-11-30',
      features: ['8 personal training sessions', 'Customized workout plan', 'Nutritional guidance'],
      terms: 'Sessions must be completed within 3 months.'
    },
    {
      id: '8',
      title: 'Couples Spa Day at Fancourt',
      description: 'Romantic spa day for two at the prestigious Fancourt Resort including massage, facilities access, and refreshments.',
      originalPrice: 1800,
      discountedPrice: 1080,
      discountPercentage: 40,
      category: 'spa',
      location: 'cape-town',
      provider: 'Fancourt Resort & Spa',
      imageUrl: '/api/placeholder/400/250',
      rating: 4.9,
      reviewCount: 234,
      availableUntil: '2024-12-31',
      features: ['Couples massage (60 min)', 'Spa facilities access', 'Light refreshments', 'Romantic setting'],
      terms: 'Valid Monday to Thursday. Advance booking essential.'
    }
  ];

  private categories = ['spa', 'fitness', 'nutrition', 'meditation', 'retreats', 'beauty'] as const;
  private locations = ['cape-town', 'johannesburg', 'durban', 'pretoria'] as const;

  /**
   * Fetch wellness deals based on filters
   */
  async fetchDeals(params: FetchDealsParams = {}): Promise<WellnessDealsAPIResponse> {
    try {
      // In production, this would make a real API call
      // For now, we'll simulate API behavior with mock data
      
      const {
        location,
        category,
        priceRange,
        page = 1,
        limit = 12
      } = params;

      // Filter mock data based on parameters
      let filteredDeals = [...this.mockDeals];

      if (location && location !== 'all') {
        filteredDeals = filteredDeals.filter(deal => deal.location === location);
      }

      if (category && category !== 'all') {
        filteredDeals = filteredDeals.filter(deal => deal.category === category);
      }

      if (priceRange) {
        const [minPrice, maxPrice] = priceRange;
        filteredDeals = filteredDeals.filter(deal => 
          deal.discountedPrice >= minPrice && deal.discountedPrice <= maxPrice
        );
      }

      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        deals: paginatedDeals,
        totalCount: filteredDeals.length,
        page,
        totalPages: Math.ceil(filteredDeals.length / limit)
      };

    } catch (error) {
      console.error('Failed to fetch wellness deals:', error);
      throw new Error('Failed to fetch wellness deals');
    }
  }

  /**
   * Get a specific deal by ID
   */
  async getDealById(id: string): Promise<WellnessDeal | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const deal = this.mockDeals.find(deal => deal.id === id);
      return deal || null;
    } catch (error) {
      console.error('Failed to fetch deal:', error);
      throw new Error('Failed to fetch deal');
    }
  }

  /**
   * Get featured deals (top-rated or newest)
   */
  async getFeaturedDeals(limit: number = 6): Promise<WellnessDeal[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Return top-rated deals
      const featured = [...this.mockDeals]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      
      return featured;
    } catch (error) {
      console.error('Failed to fetch featured deals:', error);
      throw new Error('Failed to fetch featured deals');
    }
  }

  /**
   * Search deals by keyword
   */
  async searchDeals(query: string, params: FetchDealsParams = {}): Promise<WellnessDealsAPIResponse> {
    try {
      // Filter deals by search query
      const searchResults = this.mockDeals.filter(deal =>
        deal.title.toLowerCase().includes(query.toLowerCase()) ||
        deal.description.toLowerCase().includes(query.toLowerCase()) ||
        deal.provider.toLowerCase().includes(query.toLowerCase())
      );

      // Apply additional filters
      let filteredDeals = searchResults;
      
      if (params.location && params.location !== 'all') {
        filteredDeals = filteredDeals.filter(deal => deal.location === params.location);
      }

      if (params.category && params.category !== 'all') {
        filteredDeals = filteredDeals.filter(deal => deal.category === params.category);
      }

      const page = params.page || 1;
      const limit = params.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        deals: paginatedDeals,
        totalCount: filteredDeals.length,
        page,
        totalPages: Math.ceil(filteredDeals.length / limit)
      };
    } catch (error) {
      console.error('Failed to search deals:', error);
      throw new Error('Failed to search deals');
    }
  }

  /**
   * Get available categories
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get available locations
   */
  getLocations() {
    return this.locations;
  }
}

// Export singleton instance
export const wellnessDealsAPI = new SouthAfricanWellnessDealsAPI();
export type { WellnessDeal, WellnessDealsAPIResponse, FetchDealsParams };