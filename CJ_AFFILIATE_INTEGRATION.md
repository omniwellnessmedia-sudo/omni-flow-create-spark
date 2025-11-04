# CJ Affiliate Integration Guide

## 🎉 Your CJ Affiliate Integration is Ready!

You now have a complete CJ Affiliate integration that allows you to:
- **Automatically fetch** thousands of wellness products
- **Track clicks** and conversions for commission reporting
- **Sync commission data** from CJ's API
- **Display products** beautifully on your website

---

## 📚 What's Been Implemented

### 1. **Edge Functions** (Automatically Deployed)
Located in `supabase/functions/`:

#### `cj-fetch-products`
- Searches CJ's product catalog by category/keywords
- Returns formatted product data with images, prices, and affiliate links
- Handles currency conversions (USD → ZAR, EUR)

#### `cj-sync-products`
- Syncs products to your database
- Can process multiple categories simultaneously
- Stores products in the `affiliate_products` table

#### `cj-track-commission`
- Fetches commission reports from CJ API
- Tracks pending and approved commissions
- Stores data in the `affiliate_commissions` table

### 2. **React Interface**
- **Page:** `/cj-affiliate-products`
- **File:** `src/pages/CJAffiliateProducts.tsx`
- Features:
  - Product grid with search and filters
  - Real-time commission calculations
  - Click tracking for attribution
  - One-click product sync

### 3. **Image Optimization**
- Lazy loading for faster page load
- Priority loading for above-the-fold images
- Intersection Observer for efficient loading

---

## 🚀 How to Use

### Initial Setup (Complete! ✅)
Your API credentials are securely stored:
- `CJ_AFFILIATE_API_KEY` ✓
- `CJ_AFFILIATE_CID` ✓

### Sync Your First Products

1. **Navigate to** `/cj-affiliate-products`
2. **Click "Sync Products"** button
3. Products will automatically:
   - Fetch from CJ's catalog
   - Store in your database
   - Display in the product grid

### Customize Product Categories

Edit the sync function to target specific niches:

```typescript
// In your code, call the sync function with custom categories:
await supabase.functions.invoke('cj-sync-products', {
  body: {
    categories: [
      'yoga mats',
      'essential oils',
      'organic skincare',
      'meditation cushions',
      'supplements',
    ],
  },
});
```

---

## 💰 Maximizing Your Earnings

### 1. **Product Selection Strategy**
- Focus on high-commission products (8-15%+)
- Choose products aligned with your audience
- Mix high-ticket items with affordable products

### 2. **Automated Sync Schedule**
Set up a cron job to sync products daily:
```typescript
// Example: Daily sync at midnight
// Use Supabase Database Webhooks or external scheduler
```

### 3. **Track Performance**
Monitor your commissions:
```typescript
// Call the commission tracker
const { data } = await supabase.functions.invoke('cj-track-commission');
console.log('Total Earnings:', data.totalEarnings);
```

### 4. **Content Integration Ideas**
- **Blog posts** featuring products
- **Product roundups** (e.g., "Top 10 Yoga Mats")
- **Email newsletters** with curated products
- **Social media** posts with affiliate links

---

## 📊 Understanding CJ Affiliate

### Commission Structure
- **Sale Amount × Commission Rate = Your Earning**
- Example: R1,000 product × 10% = R100 commission
- Average commission rate: 5-15% (varies by advertiser)

### Payment Timeline
1. **Action Date**: Customer makes purchase
2. **Pending Period**: 30-90 days (advertiser validation)
3. **Locked Status**: Commission approved
4. **Payment**: Sent on NET-20 or NET-60 terms

### Key Metrics to Track
- **EPC** (Earnings Per Click): Average earning per click
- **Conversion Rate**: % of clicks that result in sales
- **Average Order Value**: Average sale amount
- **Commission Per Sale**: Average commission earned

---

## 🔧 API Reference

### Fetch Products
```typescript
const { data } = await supabase.functions.invoke('cj-fetch-products', {
  body: {
    keywords: 'yoga',
    category: 'Sports & Fitness',
    limit: 100,
  },
});
```

### Sync to Database
```typescript
const { data } = await supabase.functions.invoke('cj-sync-products', {
  body: {
    categories: ['wellness', 'fitness', 'nutrition'],
  },
});
```

### Track Commissions
```typescript
const { data } = await supabase.functions.invoke('cj-track-commission');
// Returns: { commissionsProcessed, totalEarnings, currency }
```

---

## 📈 Growth Strategies

### 1. **SEO Optimization**
- Create product comparison pages
- Write detailed product reviews
- Use long-tail keywords

### 2. **Content Marketing**
- Educational blog posts linking to products
- Video tutorials featuring products
- Email sequences with product recommendations

### 3. **Social Proof**
- Display commission earnings publicly (if comfortable)
- Show "trending products"
- Feature customer testimonials

### 4. **Conversion Optimization**
- A/B test product layouts
- Optimize call-to-action buttons
- Create urgency (limited time offers)

---

## 🎯 Next Steps

1. **Sync Products**: Visit `/cj-affiliate-products` and click "Sync Products"
2. **Customize Categories**: Edit the categories in the sync function
3. **Create Content**: Write blog posts featuring products
4. **Track Performance**: Monitor clicks and commissions
5. **Scale Up**: Add more products and optimize conversions

---

## 📞 Support Resources

- **CJ Affiliate Support**: https://www.cj.com/support
- **Product Catalog API Docs**: https://developers.cj.com/
- **Your Dashboard**: https://members.cj.com/member/publisher/

---

## 🔒 Security Notes

- API keys stored as Supabase secrets (encrypted)
- All API calls go through edge functions (backend-only)
- Click tracking respects user privacy
- Commission data only accessible to admins

---

## 🎊 You're All Set!

Your CJ Affiliate integration is fully functional. Start syncing products and earning commissions today!

**Quick Start:** Navigate to `/cj-affiliate-products` and click "Sync Products" 🚀
