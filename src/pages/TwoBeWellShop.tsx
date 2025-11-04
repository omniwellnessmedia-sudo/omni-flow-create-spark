import React, { useState, useEffect, useMemo } from 'react';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Star, 
  Eye, 
  Share2, 
  Gift, 
  Truck, 
  Shield, 
  Leaf, 
  Award, 
  Zap, 
  Users, 
  Coins, 
  Package, 
  ArrowRight, 
  Sparkles,
  Check,
  X,
  Plus,
  Minus,
  RotateCcw,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { useCart } from '@/components/CartProvider';
import { WellnessProduct, WellnessProvider } from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';
import { IMAGES, getImageWithFallback } from '@/lib/images';

// Comprehensive 2BeWell Product Catalog
const twoBeWellProvider: WellnessProvider = {
  id: '2bewell-provider',
  user_id: '2bewell-user',
  business_name: '2BeWell Natural Products',
  business_type: 'business',
  description: 'Premium natural wellness products handcrafted with love in South Africa. We specialize in 100% natural, vegan, and eco-friendly beauty and wellness products that nurture your body and soul.',
  location: 'Cape Town, South Africa',
  contact: {
    phone: '+27 21 123 4567',
    email: 'hello@2bewell.co.za',
    website: 'https://2bewell.co.za',
    social_media: {
      instagram: '@2bewellnatural',
      facebook: '2BeWellNatural',
      twitter: '@2bewell'
    }
  },
  profile_image_url: IMAGES.omni.logo,
  cover_image_url: IMAGES.wellness.marketplace,
  specialties: ['Natural Skincare', 'Organic Beauty', 'Wellness Products', 'Sustainable Living'],
  certifications: ['Organic Certified', 'Cruelty-Free', 'Vegan Society', 'Fair Trade'],
  years_experience: 8,
  is_verified: true,
  rating: 4.9,
  review_count: 2847,
  wellcoin_balance: 15420,
  capabilities: {
    can_sell_services: false,
    can_sell_products: true,
    can_create_experiences: true,
    can_offer_deals: true,
    can_accept_wellcoins: true,
    has_ecommerce_enabled: true,
    has_booking_system: false
  },
  settings: {
    auto_approve_bookings: true,
    requires_deposit: false,
    deposit_percentage: 0,
    cancellation_window_hours: 24,
    timezone: 'Africa/Johannesburg',
    business_hours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '14:00' },
      sunday: { open: 'closed', close: 'closed' }
    }
  }
};

const wellnessProducts: WellnessProduct[] = [
  // SKINCARE CATEGORY
  {
    id: 'lip-balm-mint',
    title: '2BeKissed - Mint Natural Lip Balm',
    description: 'Refreshing mint-infused natural lip balm with organic Shea Butter, Coconut Oil, and Vitamin E for lasting moisture and protection.',
    longDescription: 'Our signature lip balm combines the cooling sensation of peppermint essential oil with deeply nourishing organic ingredients. Handcrafted in small batches using traditional methods, this lip balm provides long-lasting protection against harsh weather while keeping your lips soft and kissable. Free from harsh chemicals, petroleum, and artificial fragrances.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Skincare',
    subcategory: 'Lip Care',
    images: [
      IMAGES.twoBeWell.lipBalm
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-03-01T10:30:00Z',
    rating: 4.8,
    review_count: 324,
    tags: ['Natural', 'Vegan', 'Organic', 'Handcrafted', 'Mint', 'Moisturizing'],
    price_zar: 85,
    price_wellcoins: 42,
    product_type: 'physical',
    stock_quantity: 150,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      size: '4.5ml',
      weight: '8g',
      ingredients: 'Organic Shea Butter, Virgin Coconut Oil, Candelilla Wax, Peppermint Essential Oil, Vitamin E',
      shelf_life: '24 months',
      packaging: 'Recyclable aluminum tube',
      certifications: ['Vegan', 'Cruelty-Free', 'Organic']
    },
    variants: [
      {
        id: 'lip-balm-mint-single',
        name: 'Single Tube',
        price_zar: 85,
        price_wellcoins: 42,
        stock_quantity: 150,
        attributes: { quantity: '1', size: '4.5ml' }
      },
      {
        id: 'lip-balm-mint-triple',
        name: '3-Pack Bundle',
        price_zar: 220,
        price_wellcoins: 110,
        stock_quantity: 50,
        attributes: { quantity: '3', size: '4.5ml each', discount: '13%' }
      }
    ]
  },
  {
    id: 'face-serum-glow',
    title: '2BeGlow - Radiance Face Serum',
    description: 'Luxurious anti-aging face serum with Macadamia Nut Oil, Rose Hip Oil, and carefully selected essential oils for radiant, youthful skin.',
    longDescription: 'This premium face serum is our most beloved product, featuring a potent blend of African botanicals and cold-pressed oils. Macadamia nut oil deeply penetrates to restore elasticity, while rose hip oil provides essential fatty acids and vitamins. The addition of frankincense and geranium essential oils helps to reduce fine lines and promote cellular regeneration for a natural glow.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Skincare',
    subcategory: 'Face Serums',
    images: [
      IMAGES.twoBeWell.faceSerum
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-03-05T14:20:00Z',
    rating: 4.9,
    review_count: 567,
    tags: ['Anti-Aging', 'Natural', 'Organic', 'Radiance', 'Premium', 'Macadamia Oil'],
    price_zar: 165,
    price_wellcoins: 82,
    product_type: 'physical',
    stock_quantity: 89,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      size: '30ml',
      weight: '45g',
      ingredients: 'Cold-pressed Macadamia Nut Oil, Rose Hip Seed Oil, Jojoba Oil, Frankincense Essential Oil, Geranium Essential Oil, Vitamin E',
      shelf_life: '18 months',
      packaging: 'Dark glass bottle with dropper',
      skin_type: 'All skin types, especially mature skin',
      usage: 'Morning and evening on clean skin'
    },
    variants: [
      {
        id: 'face-serum-30ml',
        name: '30ml Standard',
        price_zar: 165,
        price_wellcoins: 82,
        stock_quantity: 89,
        attributes: { size: '30ml', type: 'Standard' }
      },
      {
        id: 'face-serum-60ml',
        name: '60ml Value Size',
        price_zar: 290,
        price_wellcoins: 145,
        stock_quantity: 34,
        attributes: { size: '60ml', type: 'Value', savings: '12%' }
      }
    ]
  },
  {
    id: 'body-butter-vanilla',
    title: '2BeSmooth - Vanilla Dreams Body Butter',
    description: 'Luxuriously whipped body butter infused with natural vanilla, Shea Butter, Cocoa Butter, and nourishing oils for silky-smooth skin.',
    longDescription: 'Indulge in our richest body butter, lovingly whipped to perfection with premium African Shea Butter and Cocoa Butter. The warm, comforting scent of Madagascar vanilla creates a spa-like experience while deeply moisturizing oils penetrate to soften even the driest skin. Perfect for daily use or as a special treatment.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Skincare',
    subcategory: 'Body Care',
    images: [
      IMAGES.twoBeWell.bodyButter,
      IMAGES.twoBeWell.bodyButterLavender
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-02-28T16:45:00Z',
    rating: 4.7,
    review_count: 412,
    tags: ['Moisturizing', 'Vanilla', 'Whipped', 'Natural', 'Body Butter', 'Dry Skin'],
    price_zar: 125,
    price_wellcoins: 62,
    product_type: 'physical',
    stock_quantity: 73,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      size: '200ml',
      weight: '180g',
      ingredients: 'Organic Shea Butter, Raw Cocoa Butter, Coconut Oil, Sweet Almond Oil, Arrowroot Powder, Natural Vanilla Extract, Vitamin E',
      shelf_life: '12 months',
      packaging: 'Glass jar with wooden lid',
      texture: 'Whipped, light and airy',
      scent: 'Natural vanilla'
    },
    variants: [
      {
        id: 'body-butter-vanilla-200ml',
        name: '200ml Standard',
        price_zar: 125,
        price_wellcoins: 62,
        stock_quantity: 73,
        attributes: { size: '200ml', scent: 'Vanilla' }
      },
      {
        id: 'body-butter-lavender-200ml',
        name: '200ml Lavender Dreams',
        price_zar: 125,
        price_wellcoins: 62,
        stock_quantity: 56,
        attributes: { size: '200ml', scent: 'Lavender' }
      },
      {
        id: 'body-butter-unscented-200ml',
        name: '200ml Unscented',
        price_zar: 115,
        price_wellcoins: 57,
        stock_quantity: 42,
        attributes: { size: '200ml', scent: 'Unscented' }
      }
    ]
  },

  // WELLNESS SUPPLEMENTS
  {
    id: 'ashwagandha-capsules',
    title: '2BeCalm - Premium Ashwagandha Capsules',
    description: 'Organic KSM-66 Ashwagandha extract capsules for stress relief, better sleep, and enhanced mental clarity. 60 vegan capsules.',
    longDescription: 'Our premium Ashwagandha capsules feature the clinically studied KSM-66 extract, the most bioavailable form of this ancient adaptogen. Each capsule contains 600mg of pure Ashwagandha root extract, standardized to 5% withanolides. Perfect for managing modern stress, supporting healthy cortisol levels, and promoting restful sleep.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Supplements',
    subcategory: 'Adaptogens',
    images: [
      IMAGES.twoBeWell.ashwagandha
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-03-10T11:15:00Z',
    rating: 4.8,
    review_count: 289,
    tags: ['Stress Relief', 'Sleep Support', 'Adaptogen', 'Organic', 'KSM-66', 'Vegan Capsules'],
    price_zar: 320,
    price_wellcoins: 160,
    product_type: 'physical',
    stock_quantity: 120,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      serving_size: '2 capsules',
      servings_per_container: '30',
      active_ingredient: '600mg KSM-66 Ashwagandha Extract per capsule',
      other_ingredients: 'Vegan capsule (HPMC), Rice flour',
      certifications: ['Organic', 'Vegan', 'Non-GMO', 'Third-party tested'],
      directions: 'Take 1-2 capsules daily with food or as directed by healthcare practitioner'
    },
    variants: [
      {
        id: 'ashwagandha-60caps',
        name: '60 Capsules (1 Month)',
        price_zar: 320,
        price_wellcoins: 160,
        stock_quantity: 120,
        attributes: { quantity: '60', duration: '1 month' }
      },
      {
        id: 'ashwagandha-180caps',
        name: '180 Capsules (3 Month)',
        price_zar: 850,
        price_wellcoins: 425,
        stock_quantity: 45,
        attributes: { quantity: '180', duration: '3 months', savings: '11%' }
      }
    ]
  },

  // HOME & CLEANING
  {
    id: 'all-purpose-cleaner-citrus',
    title: '2BeFresh - Citrus All-Purpose Cleaner',
    description: 'Plant-based, eco-friendly all-purpose cleaning spray with organic citrus essential oils. Safe for family and pets.',
    longDescription: 'Our signature all-purpose cleaner harnesses the natural cleaning power of citrus essential oils and plant-based surfactants. Effectively cuts through grease and grime while leaving a fresh, uplifting scent. Completely biodegradable and safe for use around children and pets.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Home & Cleaning',
    subcategory: 'Multi-Purpose Cleaners',
    images: [
      IMAGES.twoBeWell.cleaner,
      IMAGES.twoBeWell.spray
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-01-25T08:00:00Z',
    updated_at: '2024-03-08T13:20:00Z',
    rating: 4.6,
    review_count: 178,
    tags: ['Eco-Friendly', 'Plant-Based', 'Citrus', 'Non-Toxic', 'Family Safe', 'Biodegradable'],
    price_zar: 95,
    price_wellcoins: 47,
    product_type: 'physical',
    stock_quantity: 95,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      size: '500ml',
      ph_level: '7.0-8.0',
      ingredients: 'Purified water, Plant-based surfactants, Organic lemon essential oil, Organic sweet orange essential oil, Natural preservatives',
      surfaces: 'Glass, wood, tile, stainless steel, painted surfaces',
      certifications: ['Eco-Cert', 'Biodegradable', 'Cruelty-Free']
    },
    variants: [
      {
        id: 'cleaner-citrus-500ml',
        name: '500ml Citrus',
        price_zar: 95,
        price_wellcoins: 47,
        stock_quantity: 95,
        attributes: { size: '500ml', scent: 'Citrus' }
      },
      {
        id: 'cleaner-lavender-500ml',
        name: '500ml Lavender',
        price_zar: 98,
        price_wellcoins: 49,
        stock_quantity: 67,
        attributes: { size: '500ml', scent: 'Lavender' }
      },
      {
        id: 'cleaner-unscented-500ml',
        name: '500ml Unscented',
        price_zar: 89,
        price_wellcoins: 44,
        stock_quantity: 83,
        attributes: { size: '500ml', scent: 'Unscented' }
      }
    ]
  },

  // WELLNESS TOOLS
  {
    id: 'jade-roller-set',
    title: '2BeRadiant - Jade Roller & Gua Sha Set',
    description: 'Authentic jade facial roller and gua sha stone set for lymphatic drainage, reduced puffiness, and glowing skin.',
    longDescription: 'This premium facial massage set features genuine jade stones carefully selected for their smooth texture and cooling properties. The jade roller helps stimulate circulation and reduce morning puffiness, while the gua sha stone provides deeper facial massage to sculpt and tone. Includes a beautiful silk pouch and instruction guide.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Wellness Tools',
    subcategory: 'Facial Tools',
    images: [
      IMAGES.twoBeWell.jadeRoller
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-02-10T08:00:00Z',
    updated_at: '2024-03-12T09:30:00Z',
    rating: 4.7,
    review_count: 234,
    tags: ['Jade', 'Facial Massage', 'Gua Sha', 'Lymphatic Drainage', 'Natural Stone', 'Self-Care'],
    price_zar: 185,
    price_wellcoins: 92,
    product_type: 'physical',
    stock_quantity: 67,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      materials: 'Genuine jade stone, stainless steel',
      roller_size: '15cm length',
      gua_sha_size: '8cm x 5cm',
      care_instructions: 'Clean with gentle soap and water, dry thoroughly',
      includes: 'Jade roller, gua sha stone, silk storage pouch, instruction guide'
    },
    variants: [
      {
        id: 'jade-roller-set-standard',
        name: 'Jade Set',
        price_zar: 185,
        price_wellcoins: 92,
        stock_quantity: 67,
        attributes: { stone: 'Jade', color: 'Green' }
      },
      {
        id: 'rose-quartz-set-standard',
        name: 'Rose Quartz Set',
        price_zar: 195,
        price_wellcoins: 97,
        stock_quantity: 34,
        attributes: { stone: 'Rose Quartz', color: 'Pink' }
      }
    ]
  },

  // DIGITAL PRODUCTS
  {
    id: 'wellness-ebook-bundle',
    title: '2BeWise - Complete Wellness E-Book Bundle',
    description: 'Comprehensive digital wellness guide collection including nutrition, skincare recipes, meditation practices, and sustainable living tips.',
    longDescription: 'Our complete digital wellness library featuring 5 comprehensive e-books: "Natural Skincare Recipes", "Mindful Nutrition Guide", "Meditation for Beginners", "Sustainable Living Made Simple", and "Stress-Free Living Blueprint". Over 300 pages of expert content, recipes, and practical tips for holistic wellness.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Digital Products',
    subcategory: 'E-Books',
    images: [
      IMAGES.twoBeWell.ebook
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-03-15T14:00:00Z',
    rating: 4.9,
    review_count: 156,
    tags: ['E-Book', 'Digital', 'Wellness Guide', 'Recipes', 'Meditation', 'Sustainable Living'],
    price_zar: 149,
    price_wellcoins: 74,
    product_type: 'digital',
    is_unlimited_stock: true,
    shipping_required: false,
    digital_delivery_url: 'https://2bewell.co.za/digital-downloads',
    product_specifications: {
      format: 'PDF',
      total_pages: '300+',
      language: 'English',
      compatibility: 'All devices',
      bonus_content: 'Video tutorials, printable guides, recipe cards',
      access: 'Instant download after purchase'
    },
    variants: [
      {
        id: 'ebook-bundle-complete',
        name: 'Complete Bundle (5 Books)',
        price_zar: 149,
        price_wellcoins: 74,
        attributes: { books: '5', type: 'Complete Bundle' }
      },
      {
        id: 'ebook-skincare-single',
        name: 'Natural Skincare Recipes',
        price_zar: 45,
        price_wellcoins: 22,
        attributes: { books: '1', type: 'Single Book', topic: 'Skincare' }
      }
    ]
  },

  // GIFT SETS
  {
    id: 'starter-gift-set',
    title: '2BeWell Starter Gift Set',
    description: 'Perfect introduction to natural wellness with our best-selling lip balm, face serum, and body butter in a beautiful eco-friendly gift box.',
    longDescription: 'Give the gift of natural wellness with our carefully curated starter set. This beautiful collection includes our three most beloved products: 2BeKissed Mint Lip Balm, 2BeGlow Face Serum (15ml travel size), and 2BeSmooth Body Butter (100ml). Presented in our signature recyclable gift box with organic cotton ribbon.',
    provider_id: '2bewell-provider',
    provider_name: '2BeWell Natural Products',
    content_type: 'product',
    category: 'Gift Sets',
    subcategory: 'Starter Sets',
    images: [
      IMAGES.twoBeWell.giftSet
    ],
    location: 'Cape Town, South Africa',
    is_online: true,
    is_active: true,
    created_at: '2024-01-30T08:00:00Z',
    updated_at: '2024-03-20T10:45:00Z',
    rating: 4.8,
    review_count: 445,
    tags: ['Gift Set', 'Starter Kit', 'Natural', 'Gift Box', 'Sample Sizes', 'Perfect Gift'],
    price_zar: 199,
    price_wellcoins: 99,
    product_type: 'physical',
    stock_quantity: 87,
    is_unlimited_stock: false,
    shipping_required: true,
    product_specifications: {
      includes: 'Lip balm (4.5ml), Face serum (15ml), Body butter (100ml)',
      gift_packaging: 'Recyclable gift box, organic cotton ribbon, product information cards',
      savings: '25% off individual prices',
      perfect_for: 'Birthdays, holidays, wellness enthusiasts, beginners'
    },
    variants: [
      {
        id: 'gift-set-starter',
        name: 'Starter Set',
        price_zar: 199,
        price_wellcoins: 99,
        stock_quantity: 87,
        attributes: { type: 'Starter', products: '3', size: 'Travel/Sample' }
      },
      {
        id: 'gift-set-deluxe',
        name: 'Deluxe Gift Set',
        price_zar: 350,
        price_wellcoins: 175,
        stock_quantity: 23,
        attributes: { type: 'Deluxe', products: '5', size: 'Full Size' }
      }
    ]
  }
];

// Product categories for filtering
const categories = [
  'All Categories',
  'Skincare',
  'Supplements', 
  'Home & Cleaning',
  'Wellness Tools',
  'Digital Products',
  'Gift Sets'
];

const subcategories: Record<string, string[]> = {
  'Skincare': ['Lip Care', 'Face Serums', 'Body Care', 'Cleansers'],
  'Supplements': ['Adaptogens', 'Vitamins', 'Minerals', 'Herbal'],
  'Home & Cleaning': ['Multi-Purpose Cleaners', 'Kitchen', 'Bathroom', 'Laundry'],
  'Wellness Tools': ['Facial Tools', 'Massage', 'Aromatherapy', 'Self-Care'],
  'Digital Products': ['E-Books', 'Courses', 'Guides', 'Audio'],
  'Gift Sets': ['Starter Sets', 'Seasonal', 'Themed', 'Custom']
};

const TwoBeWellShop = () => {
  const { items, addItem } = useCart();
  const { toast } = useToast();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WellnessProduct | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = wellnessProducts.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
      const matchesPrice = product.price_zar >= priceRange[0] && product.price_zar <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price_zar - b.price_zar);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price_zar - a.price_zar);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.review_count - a.review_count);
        break;
      default:
        // Featured products first, then by rating
        filtered.sort((a, b) => {
          const aFeatured = a.tags.includes('Featured') ? 1 : 0;
          const bFeatured = b.tags.includes('Featured') ? 1 : 0;
          if (aFeatured !== bFeatured) return bFeatured - aFeatured;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy]);

  // Wishlist functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Quick view modal
  const openQuickView = (product: WellnessProduct) => {
    setSelectedProduct(product);
  };

  // Image carousel for product cards
  const nextImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Image error handling
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Simulate loading for filtering/sorting
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setError(null);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy]);

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('2bewell-wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('2bewell-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // SEO metadata
  useEffect(() => {
    document.title = '2BeWell Natural Products - Premium Wellness Marketplace | Omni Wellness';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover premium natural wellness products from 2BeWell. Shop organic skincare, supplements, wellness tools and more. Handcrafted in South Africa with love. Earn WellCoins with every purchase.');
    }
    
    // Add Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', '2BeWell Natural Products - Premium Wellness Marketplace');
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Discover premium natural wellness products handcrafted in South Africa. Shop organic skincare, supplements, and wellness tools.');
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }
    
    return () => {
      document.title = 'Omni Wellness Platform';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <UnifiedNavigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-blue-50/80 to-purple-50/80 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30px 30px, rgba(0,0,0,0.02) 2px, transparent 2px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Verified Premium Provider</span>
                <Badge className="bg-emerald-600 text-white">4.9★</Badge>
              </div>

              <div>
                <h1 className="font-heading font-bold text-6xl sm:text-7xl leading-tight mb-6">
                  <span className="block text-foreground">2BeWell</span>
                  <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Natural Marketplace
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                  Premium wellness products handcrafted with love in South Africa. From natural skincare to wellness supplements, 
                  discover products that nurture your body, mind, and soul while supporting sustainable living.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl rounded-full px-8 py-4 font-semibold text-lg transition-all duration-300"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Shop Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-full px-8 py-4 font-semibold text-lg backdrop-blur-sm bg-white/80"
                >
                  <Heart className="mr-2 w-5 h-5" />
                  View Wishlist ({wishlist.length})
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">100% Natural</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">Cruelty-Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">Free Shipping R200+</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium">Earn WellCoins</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white/50 backdrop-blur-sm border-y border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-full border-2 border-emerald-100 focus:border-emerald-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 rounded-full border-2 border-emerald-100 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Options */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 rounded-full border-2 border-emerald-100 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border-2 border-emerald-100 rounded-full bg-white/80 backdrop-blur-sm">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-full ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-full ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded-full border-2 border-emerald-100 bg-white/80 backdrop-blur-sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Subcategory Filter */}
                  {selectedCategory !== 'All Categories' && subcategories[selectedCategory] && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategory</label>
                      <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                        <SelectTrigger className="rounded-full">
                          <SelectValue placeholder="All Subcategories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Subcategories</SelectItem>
                          {subcategories[selectedCategory].map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Range: R{priceRange[0]} - R{priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quick Filters</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-emerald-100">
                        ⭐ 4.5+ Rating
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-emerald-100">
                        🚛 Free Shipping
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-emerald-100">
                        🌱 Organic
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-emerald-100">
                        📦 In Stock
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-muted-foreground">
                  {selectedCategory !== 'All Categories' ? `in ${selectedCategory}` : 'in all categories'}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <X className="w-16 h-16 mx-auto text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button onClick={() => setError(null)} className="rounded-full">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && !error && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="group overflow-hidden border-none shadow-elegant hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                        <div className="relative overflow-hidden">
                          {/* Product Images */}
                          <div className="relative h-64">
                            {imageErrors[product.id] ? (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                <div className="text-center text-emerald-600">
                                  <Package className="w-12 h-12 mx-auto mb-2" />
                                  <p className="text-sm font-medium">Image not available</p>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={product.images[currentImageIndex[product.id] || 0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={() => handleImageError(product.id)}
                                loading="lazy"
                              />
                            )}
                            
                            {/* Image Navigation */}
                            {product.images.length > 1 && (
                              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-full bg-white/80 backdrop-blur-sm"
                                  onClick={() => prevImage(product.id, product.images.length)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-full bg-white/80 backdrop-blur-sm"
                                  onClick={() => nextImage(product.id, product.images.length)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}

                            {/* Overlay Actions */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full bg-white/90 backdrop-blur-sm"
                                onClick={() => toggleWishlist(product.id)}
                              >
                                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full bg-white/90 backdrop-blur-sm"
                                onClick={() => openQuickView(product)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {product.stock_quantity && product.stock_quantity < 10 && (
                                <Badge className="bg-red-600 text-white">
                                  Only {product.stock_quantity} left
                                </Badge>
                              )}
                              {product.tags.includes('Organic') && (
                                <Badge className="bg-emerald-600 text-white">
                                  Organic
                                </Badge>
                              )}
                              {product.product_type === 'digital' && (
                                <Badge className="bg-purple-600 text-white">
                                  Digital
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-xs font-medium text-muted-foreground">
                                  {product.rating} ({product.review_count})
                                </span>
                              </div>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                              {product.title}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {product.description}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-emerald-600">R{product.price_zar}</span>
                                  {product.price_wellcoins && (
                                    <Badge variant="secondary" className="text-xs">
                                      🪙 {product.price_wellcoins}
                                    </Badge>
                                  )}
                                </div>
                                {product.variants.length > 1 && (
                                  <span className="text-xs text-muted-foreground">
                                    {product.variants.length} variants available
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <AddToCartButton
                                item={{
                                  id: product.id,
                                  title: product.title,
                                  price_zar: product.price_zar,
                                  price_wellcoins: product.price_wellcoins,
                                  image: product.images[0],
                                  category: product.category
                                }}
                                className="flex-1 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                              />
                            </div>

                            {/* Product Tags */}
                            <div className="flex flex-wrap gap-1 mt-3">
                              {product.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="group overflow-hidden border-none shadow-elegant hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                        <div className="flex">
                          {/* Product Image */}
                          <div className="relative w-64 h-48 flex-shrink-0">
                            {imageErrors[product.id] ? (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                <div className="text-center text-emerald-600">
                                  <Package className="w-12 h-12 mx-auto mb-2" />
                                  <p className="text-sm font-medium">Image not available</p>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={() => handleImageError(product.id)}
                                loading="lazy"
                              />
                            )}
                            
                            {/* Wishlist Button */}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => toggleWishlist(product.id)}
                            >
                              <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{product.category}</Badge>
                                  <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {product.rating} ({product.review_count})
                                    </span>
                                  </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                                  {product.title}
                                </h3>

                                <p className="text-muted-foreground mb-4 line-clamp-2">
                                  {product.description}
                                </p>

                                {/* Product Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {product.tags.slice(0, 5).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="text-right ml-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-3xl font-bold text-emerald-600">R{product.price_zar}</span>
                                  {product.price_wellcoins && (
                                    <Badge variant="secondary">
                                      🪙 {product.price_wellcoins}
                                    </Badge>
                                  )}
                                </div>
                                
                                {product.variants.length > 1 && (
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {product.variants.length} variants available
                                  </p>
                                )}

                                <div className="flex flex-col gap-2">
                                  <AddToCartButton
                                    item={{
                                      id: product.id,
                                      title: product.title,
                                      price_zar: product.price_zar,
                                      price_wellcoins: product.price_wellcoins,
                                      image: product.images[0],
                                      category: product.category
                                    }}
                                    className="rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openQuickView(product)}
                                    className="rounded-full"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Quick View
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* No Products Found */}
                {filteredProducts.length === 0 && !isLoading && !error && (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search criteria or browse our full catalog.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All Categories');
                          setSelectedSubcategory('');
                          setPriceRange([0, 500]);
                        }}
                        className="rounded-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Related Products / You May Also Like Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-50/30 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl mb-4">
                You May Also <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Like</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover more amazing products from our curated collection of natural wellness essentials
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wellnessProducts.slice(0, 4).map((product) => (
                <Card key={product.id} className="group overflow-hidden border-none shadow-elegant hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <div className="relative overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-full bg-white/90 backdrop-blur-sm"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-emerald-600/90 text-white backdrop-blur-sm">
                          {product.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {product.rating} ({product.review_count})
                        </span>
                      </div>

                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {product.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-emerald-600">R{product.price_zar}</span>
                          {product.price_wellcoins && (
                            <Badge variant="secondary" className="text-xs">
                              🪙 {product.price_wellcoins}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <AddToCartButton
                        item={{
                          id: product.id,
                          title: product.title,
                          price_zar: product.price_zar,
                          price_wellcoins: product.price_wellcoins,
                          image: product.images[0],
                          category: product.category
                        }}
                        size="sm"
                        className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                      />
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* View All Products Button */}
            <div className="text-center mt-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-full px-8"
              >
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bulk Ordering */}
              <Card className="border-none shadow-elegant bg-gradient-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-600 rounded-full">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Bulk Ordering</h3>
                      <p className="text-sm text-muted-foreground">Save more with quantity discounts</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>5+ items:</span>
                      <span className="font-medium text-emerald-600">5% off</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>10+ items:</span>
                      <span className="font-medium text-emerald-600">10% off</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>20+ items:</span>
                      <span className="font-medium text-emerald-600">15% off</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 rounded-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Subscription Service */}
              <Card className="border-none shadow-elegant bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-600 rounded-full">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Subscribe & Save</h3>
                      <p className="text-sm text-muted-foreground">Never run out of essentials</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Monthly delivery:</span>
                      <span className="font-medium text-blue-600">10% off</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Free shipping:</span>
                      <span className="font-medium text-blue-600">Always</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cancel anytime:</span>
                      <span className="font-medium text-blue-600">No fees</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 rounded-full">
                    Start Subscription
                  </Button>
                </CardContent>
              </Card>

              {/* Gift Cards */}
              <Card className="border-none shadow-elegant bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-600 rounded-full">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Gift Cards</h3>
                      <p className="text-sm text-muted-foreground">Perfect for wellness lovers</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Digital delivery:</span>
                      <span className="font-medium text-purple-600">Instant</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valid for:</span>
                      <span className="font-medium text-purple-600">2 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Amounts:</span>
                      <span className="font-medium text-purple-600">R50-R1000</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 rounded-full">
                    Buy Gift Card
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Provider Info Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Provider Profile */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
                        2BW
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold">{twoBeWellProvider.business_name}</h2>
                          {twoBeWellProvider.is_verified && (
                            <Badge className="bg-emerald-600 text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-semibold">{twoBeWellProvider.rating}</span>
                            <span className="text-muted-foreground">({twoBeWellProvider.review_count} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{twoBeWellProvider.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{twoBeWellProvider.years_experience} years</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-6">
                          {twoBeWellProvider.description}
                        </p>
                        
                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {twoBeWellProvider.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-wrap gap-2">
                          {twoBeWellProvider.certifications.map((cert) => (
                            <Badge key={cert} className="bg-emerald-100 text-emerald-800">
                              <Award className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Social */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Get in Touch</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{twoBeWellProvider.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{twoBeWellProvider.contact.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{twoBeWellProvider.contact.website}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Follow Us</h3>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Instagram className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">WellCoin Balance</h3>
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-emerald-600" />
                        <span className="text-lg font-bold text-emerald-600">
                          {twoBeWellProvider.wellcoin_balance.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned through community engagement
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <div>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.images.slice(1, 4).map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${selectedProduct.title} ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{selectedProduct.category}</Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{selectedProduct.rating}</span>
                        <span className="text-muted-foreground">({selectedProduct.review_count})</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {selectedProduct.longDescription || selectedProduct.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-emerald-600">R{selectedProduct.price_zar}</span>
                        {selectedProduct.price_wellcoins && (
                          <Badge variant="secondary">
                            🪙 {selectedProduct.price_wellcoins}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Variants */}
                    {selectedProduct.variants.length > 1 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Available Options</h4>
                        <div className="space-y-2">
                          {selectedProduct.variants.map((variant) => (
                            <div key={variant.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <span className="font-medium">{variant.name}</span>
                                <p className="text-sm text-muted-foreground">
                                  {Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold">R{variant.price_zar}</span>
                                {variant.stock_quantity && (
                                  <p className="text-xs text-muted-foreground">
                                    {variant.stock_quantity} left
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedProduct.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <AddToCartButton
                        item={{
                          id: selectedProduct.id,
                          title: selectedProduct.title,
                          price_zar: selectedProduct.price_zar,
                          price_wellcoins: selectedProduct.price_wellcoins,
                          image: selectedProduct.images[0],
                          category: selectedProduct.category
                        }}
                        className="flex-1 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                      />
                      <Button
                        variant="outline"
                        onClick={() => toggleWishlist(selectedProduct.id)}
                        className="rounded-full"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" className="rounded-full">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default TwoBeWellShop;