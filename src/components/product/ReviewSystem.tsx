import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Star, ThumbsUp, ImagePlus, Check } from 'lucide-react';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_title: string;
  review_text: string;
  verified_purchase: boolean;
  helpful_count: number;
  photos: string[];
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ReviewSystemProps {
  productId: string;
}

export const ReviewSystem = ({ productId }: ReviewSystemProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('helpful');
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Form state
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    fetchReviews();
  }, [productId, sortBy]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId);

      if (sortBy === 'helpful') {
        query = query.order('helpful_count', { ascending: false });
      } else if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'rating_high') {
        query = query.order('rating', { ascending: false });
      } else if (sortBy === 'rating_low') {
        query = query.order('rating', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch user profiles separately
      const userIds = [...new Set((data || []).map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      // Transform data with profiles
      const transformedData = (data || []).map(review => ({
        ...review,
        photos: Array.isArray(review.photos) ? review.photos : [],
        profiles: profileMap.get(review.user_id)
      }));
      
      setReviews(transformedData as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }

    if (!title || !reviewText || rating < 1) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title, review, and rating',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('product_reviews').insert({
        product_id: productId,
        user_id: user.id,
        rating,
        review_title: title,
        review_text: reviewText,
        photos: [],
      });

      if (error) throw error;

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });

      setShowForm(false);
      setTitle('');
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to mark reviews as helpful',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('review_helpfulness').upsert({
        review_id: reviewId,
        user_id: user.id,
        is_helpful: true,
      });

      if (error) throw error;
      fetchReviews();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= parseFloat(avgRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{avgRating}</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="rating_high">Highest Rating</SelectItem>
              <SelectItem value="rating_low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setShowForm(!showForm)}>
            Write Review
          </Button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Review Title</label>
              <Input
                placeholder="Summarize your experience"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                placeholder="Share your experience with this product..."
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={review.profiles?.avatar_url} />
                    <AvatarFallback>
                      {review.profiles?.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.profiles?.full_name || 'Anonymous'}</span>
                      {review.verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-semibold mb-2">{review.review_title}</h4>
                    <p className="text-muted-foreground mb-4">{review.review_text}</p>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Helpful ({review.helpful_count})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
