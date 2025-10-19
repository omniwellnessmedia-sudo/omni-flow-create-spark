import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen, 
  Calendar,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Edit,
  ArrowLeft
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  read_time_minutes: number;
  published_at: string;
  user_id: string;
  slug: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

const BlogPost = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post && user) {
      checkIfLiked();
    }
  }, [post, user]);

  const loadPost = async () => {
    try {
      // Load post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (postError) throw postError;

      // Load author profile
      const { data: authorProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', postData.user_id)
        .single();

      if (profileError) throw profileError;

      setPost({ ...postData, profiles: authorProfile });

      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ views_count: postData.views_count + 1 })
        .eq('id', postData.id);

      // Load comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_post_id', postData.id)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Load comment authors
      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = profiles?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        const commentsWithProfiles = commentsData.map(comment => ({
          ...comment,
          profiles: profilesMap[comment.user_id] || { full_name: 'Unknown', avatar_url: null }
        }));

        setComments(commentsWithProfiles);
      } else {
        setComments([]);
      }
    } catch (error: any) {
      toast.error("Failed to load post: " + error.message);
      navigate("/blog/community");
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfLiked = async () => {
    if (!post || !user) return;

    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_post_id', post.id)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      // User hasn't liked the post
      setIsLiked(false);
    }
  };

  const toggleLike = async () => {
    if (!user || !post) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_post_id', post.id)
          .eq('user_id', user.id);

        setPost(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : null);
        setIsLiked(false);
      } else {
        await supabase
          .from('blog_likes')
          .insert([{
            blog_post_id: post.id,
            user_id: user.id
          }]);

        setPost(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null);
        setIsLiked(true);
      }
    } catch (error: any) {
      toast.error("Failed to update like: " + error.message);
    }
  };

  const submitComment = async () => {
    if (!user || !post || !newComment.trim()) {
      toast.error("Please sign in and add a comment");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([{
          blog_post_id: post.id,
          user_id: user.id,
          content: newComment.trim()
        }])
        .select('*')
        .single();

      if (error) throw error;

      // Get user profile for the comment
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const commentWithProfile = { ...data, profiles: userProfile };
      setComments(prev => [commentWithProfile, ...prev]);
      setPost(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error: any) {
      toast.error("Failed to add comment: " + error.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const sharePost = async (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt || post.content.substring(0, 200) + "...";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
          return;
        } catch (error) {
          toast.error("Failed to copy link");
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedNavigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Button onClick={() => navigate("/blog/community")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      <main className="pt-16">
        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
            {/* Back Navigation */}
            <Button 
              variant="ghost" 
              onClick={() => navigate("/blog/community")}
              className="mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community Blog
            </Button>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="text-xl text-gray-600">
                  {post.subtitle}
                </p>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.profiles.avatar_url} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.profiles.full_name}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {post.read_time_minutes} min read
                    </span>
                  </div>
                </div>
              </div>

              {user && user.id === post.user_id && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/blog/editor/${post.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="my-8">
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-6 text-gray-800 leading-relaxed">
                    {paragraph}
                  </p>
                ) : (
                  <br key={index} />
                )
              ))}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-8" />

            {/* Engagement */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {post.likes_count}
                </Button>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments_count}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => sharePost("facebook")}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => sharePost("twitter")}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => sharePost("linkedin")}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => sharePost("copy")}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Comments Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Comments ({post.comments_count})</h3>
              
              {/* Add Comment */}
              {user ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Add a comment</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={submitComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                      >
                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="mb-4">Please sign in to leave a comment</p>
                    <Button onClick={() => navigate("/auth")}>
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.profiles.avatar_url} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.profiles.full_name}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                              <Heart className="h-3 w-3" />
                              {comment.likes_count}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;