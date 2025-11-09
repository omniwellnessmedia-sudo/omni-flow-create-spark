import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton = ({ count = 1 }: ProductSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          {/* Image Skeleton */}
          <Skeleton className="aspect-[3/4] w-full" />
          
          {/* Content Skeleton */}
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-20" /> {/* Category */}
            <Skeleton className="h-5 w-full" /> {/* Title line 1 */}
            <Skeleton className="h-5 w-3/4" /> {/* Title line 2 */}
            <Skeleton className="h-6 w-24 mt-2" /> {/* Price */}
            <Skeleton className="h-10 w-full mt-4" /> {/* Button */}
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export const FeaturedProductSkeleton = ({ count = 3 }: ProductSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden min-w-[300px]">
          <Skeleton className="aspect-[3/4] w-full" />
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-28" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};
