

# Fix 2BeWell Product Images & Dr. Sharyn Spicer Photo

## Issue Analysis

### Problem 1: 2BeWell Section Shows Omni Logo Instead of Products

The 2BeWell section on the homepage is showing the Omni logo fallback instead of actual product images because the **folder path encoding is incorrect**.

**Current code in `src/lib/images.ts`:**
```typescript
productImages: 'product-images%2A%2A%20(2BeWell)',
```

**User confirmed the actual folder path is:**
```
product-images** (2BeWell)
```

Which should be encoded as:
```
product-images%2A%2A%20(2BeWell)
```

This looks correct, but images are still failing to load. The issue may be that the actual file names in the storage don't match what's mapped in the code.

### Problem 2: Dr. Sharyn Spicer Image

The user has provided the **correct permanent URL** for Dr. Sharyn Spicer's photo:
```
https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Tufcat%20and%20Carthorse/Dr.%20Sharron%20Spicer.jpg
```

Currently the code uses an Unsplash placeholder:
```typescript
const drSharynSpicerImage = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format";
```

---

## Implementation Plan

### File 1: `src/lib/images.ts`

Update the `FOLDERS.productImages` constant to ensure correct encoding, and verify all product image file names in the `CORE.products` object match actual files in Supabase storage.

**Changes:**
- Verify folder path encoding matches: `product-images%2A%2A%20(2BeWell)`
- Ensure product image file names match actual Supabase files

### File 2: `src/lib/imageHelpers.ts`

Ensure the `FOLDERS.products` constant matches the correct folder path.

**Changes:**
- Verify folder path: `product-images%2A%2A%20(2BeWell)`

### File 3: `src/pages/programs/UWCHumanAnimalProgram.tsx`

Update Dr. Sharyn Spicer's image from placeholder to the permanent Supabase URL.

**Change line 18 from:**
```typescript
const drSharynSpicerImage = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format";
```

**To:**
```typescript
const drSharynSpicerImage = "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Tufcat%20and%20Carthorse/Dr.%20Sharron%20Spicer.jpg";
```

---

## Technical Details

### Supabase Storage Path Encoding

The folder `product-images** (2BeWell)` must be URL-encoded as:
- `**` becomes `%2A%2A`
- Space becomes `%20`
- Result: `product-images%2A%2A%20(2BeWell)`

### Files Affected

| File | Change |
|------|--------|
| `src/lib/images.ts` | Verify 2BeWell product paths are correct |
| `src/lib/imageHelpers.ts` | Verify folder path encoding |
| `src/pages/programs/UWCHumanAnimalProgram.tsx` | Update Dr. Spicer image to permanent URL |

### After Implementation

1. **2BeWell section** on homepage will display actual product images instead of Omni logo fallback
2. **Dr. Sharyn Spicer** will display her actual photo on the UWC Programme page

