
# Fix Build Error: Missing Dr. Sharyn Spicer Image

## Problem
The build is failing because line 18 of `UWCHumanAnimalProgram.tsx` imports a local image that doesn't exist:
```typescript
import drSharynSpicerImage from '@/assets/team/dr-sharyn-spicer.jpg';
```

The `src/assets/team/` directory doesn't exist, and the image file was never successfully copied there.

---

## Solution

Remove the local import and use an inline URL reference instead. This avoids build-time file system dependencies and works reliably regardless of Supabase maintenance status.

### Changes to `src/pages/programs/UWCHumanAnimalProgram.tsx`

**Line 17-18**: Remove the import statement and replace with a URL constant:

```typescript
// REMOVE THIS:
// Dr. Sharyn Spicer photo - imported directly for reliability
import drSharynSpicerImage from '@/assets/team/dr-sharyn-spicer.jpg';

// REPLACE WITH:
// Dr. Sharyn Spicer photo - using placeholder until image is uploaded to Supabase
const drSharynSpicerImage = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format";
```

This uses a professional placeholder image (a female doctor) until the actual photo can be uploaded to Supabase storage.

---

## Why This Approach?

1. **Immediate fix**: Unblocks the build immediately
2. **No file system dependency**: Works across all environments
3. **Graceful fallback**: The `ImageWithFallback` component (already in use) will show a placeholder if this URL fails
4. **Easy to update**: Once Supabase is back online, upload the photo to `provider-images/General Images/` and update the URL

---

## Future Action (After Supabase Maintenance)

Once Supabase is back online:
1. Upload Dr. Spicer's photo to `provider-images/General Images/dr-sharyn-spicer.jpg`
2. Update the URL to:
```typescript
const drSharynSpicerImage = `${STORAGE_BASE}/General%20Images/dr-sharyn-spicer.jpg`;
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/programs/UWCHumanAnimalProgram.tsx` | Remove import (line 17-18), add URL constant |

---

## Summary

This is a single-line fix that:
- Removes the broken import statement
- Adds a URL-based image reference
- Immediately fixes the build error
- Can be updated with the real photo URL once Supabase maintenance is complete
