import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User,
  BookOpen,
  TrendingUp,
  Filter,
  Edit
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  featured_image_url: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  views_count: number;
  read_time_minutes: number;
  published_at: string;
  slug: string;
  status: string;
  user_id: string;
  updated_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

const CommunityBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadPosts();
    if (user) {
      loadMyPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(data.map(post => post.user_id))];
        
        // Fetch profiles for all users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Create a map of user profiles
        const profilesMap = profiles?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        // Combine posts with profiles
        const postsWithProfiles = data.map(post => ({
          ...post,
          profiles: profilesMap[post.user_id] || { full_name: 'Unknown', avatar_url: null }
        }));

        setPosts(postsWithProfiles);
      } else {
        setPosts([]);
      }
      
      // Extract all unique tags
      const tags = new Set<string>();
      data?.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error: any) {
      toast.error("Failed to load posts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMyPosts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Get user profile
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Add profile to all posts
        const postsWithProfile = data.map(post => ({
          ...post,
          profiles: userProfile
        }));

        setMyPosts(postsWithProfile);
      } else {
        setMyPosts([]);
      }
    } catch (error: any) {
      toast.error("Failed to load your posts: " + error.message);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const PostCard = ({ post }: { post: BlogPost }) => (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/blog/post/${post.slug}`)}
    >
      {post.featured_image_url && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.profiles.avatar_url} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{post.profiles.full_name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {new Date(post.published_at).toLocaleDateString()}
              <BookOpen className="h-3 w-3" />
              {post.read_time_minutes} min read
            </div>
          </div>
        </div>
        
        <CardTitle className="text-xl line-clamp-2 hover:text-omni-indigo transition-colors">
          {post.title}
        </CardTitle>
        
        {post.subtitle && (
          <CardDescription className="text-gray-600 line-clamp-2">
            {post.subtitle}
          </CardDescription>
        )}
        
        <CardDescription className="text-gray-600 line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comments_count}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views_count}
            </span>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MyPostCard = ({ post }: { post: BlogPost }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
            <CardDescription className="text-sm">
              {post.status === 'published' ? 'Published' : 'Draft'} • 
              Updated {new Date(post.updated_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blog/editor/${post.id}`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {post.status === 'published' && (
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comments_count}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views_count}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MegaNavigation />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading community blog...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MegaNavigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="heading-secondary no-faded-text">
              Community <span className="bg-rainbow-gradient bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Share your wellness journey, insights, and stories with our community. 
              Connect, inspire, and learn from fellow wellness practitioners and enthusiasts.
            </p>
            
            {user ? (
              <Button 
                size="lg"
                onClick={() => navigate("/blog/editor/new")}
                className="bg-rainbow-gradient hover:opacity-90 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Write Your Story
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-rainbow-gradient hover:opacity-90 text-white"
              >
                Join the Community
              </Button>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="discover" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="discover">Discover Stories</TabsTrigger>
                {user && <TabsTrigger value="my-posts">My Posts</TabsTrigger>}
              </TabsList>

              <TabsContent value="discover" className="space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search stories, authors, or topics..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={selectedTag === "" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTag("")}
                        >
                          All Topics
                        </Button>
                        {allTags.slice(0, 8).map((tag) => (
                          <Button
                            key={tag}
                            variant={selectedTag === tag ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-8 w-8 text-omni-green mx-auto mb-2" />
                      <div className="text-2xl font-bold text-omni-green">{posts.length}</div>
                      <div className="text-sm text-gray-600">Published Stories</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Heart className="h-8 w-8 text-omni-red mx-auto mb-2" />
                      <div className="text-2xl font-bold text-omni-red">
                        {posts.reduce((sum, post) => sum + post.likes_count, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Likes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageCircle className="h-8 w-8 text-omni-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold text-omni-blue">
                        {posts.reduce((sum, post) => sum + post.comments_count, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Community Comments</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No stories found</h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm || selectedTag 
                          ? "Try adjusting your search or filters"
                          : "Be the first to share your wellness story with the community!"
                        }
                      </p>
                      {user && (
                        <Button 
                          onClick={() => navigate("/blog/editor/new")}
                          className="bg-rainbow-gradient hover:opacity-90 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Write Your Story
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {user && (
                <TabsContent value="my-posts" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Your Stories</h2>
                      <p className="text-gray-600">Manage your published and draft content</p>
                    </div>
                    <Button 
                      onClick={() => navigate("/blog/editor/new")}
                      className="bg-rainbow-gradient hover:opacity-90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Story
                    </Button>
                  </div>

                  {myPosts.length > 0 ? (
                    <div className="space-y-4">
                      {myPosts.map((post) => (
                        <MyPostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No stories yet</h3>
                        <p className="text-gray-600 mb-6">
                          Start sharing your wellness journey with the community
                        </p>
                        <Button 
                          onClick={() => navigate("/blog/editor/new")}
                          className="bg-rainbow-gradient hover:opacity-90 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Write Your First Story
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityBlog;