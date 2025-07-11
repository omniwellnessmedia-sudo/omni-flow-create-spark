import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import { Section } from "@/components/ui/section";
import WellnessExchangeNavigation from "@/components/WellnessExchangeNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Heart, 
  MessageCircle,
  User,
  Calendar,
  Trophy,
  Lightbulb,
  Star,
  Calendar as CalendarIcon,
  Megaphone
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { format } from "date-fns";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  post_type: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const WellnessCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState("all");
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("discussion");
  const [tags, setTags] = useState("");

  const postTypes = [
    { value: "discussion", label: "Discussion", icon: MessageCircle, color: "bg-blue-100 text-blue-800" },
    { value: "tip", label: "Wellness Tip", icon: Lightbulb, color: "bg-yellow-100 text-yellow-800" },
    { value: "success_story", label: "Success Story", icon: Trophy, color: "bg-green-100 text-green-800" },
    { value: "event", label: "Event", icon: CalendarIcon, color: "bg-purple-100 text-purple-800" },
    { value: "announcement", label: "Announcement", icon: Megaphone, color: "bg-red-100 text-red-800" },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to create a post");
      return;
    }

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title,
          content,
          post_type: postType,
          tags: tagsArray,
        });

      if (error) throw error;

      toast.success("Post created successfully!");
      setShowCreateDialog(false);
      resetForm();
      fetchPosts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPostType("discussion");
    setTags("");
  };

  const getPostTypeConfig = (type: string) => {
    return postTypes.find(pt => pt.value === type) || postTypes[0];
  };

  const filteredPosts = selectedPostType === "all" 
    ? posts 
    : posts.filter(post => post.post_type === selectedPostType);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MegaNavigation />
        <main className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-violet mx-auto mb-4"></div>
              <p className="text-gray-600">Loading community posts...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MegaNavigation />
      <WellnessExchangeNavigation />
      <main className="pt-0">
        {/* Header */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                  Wellness <span className="text-omni-violet">Community</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Connect, share wisdom, and grow together with fellow wellness enthusiasts
                </p>
              </div>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-omni-violet hover:bg-omni-indigo text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Community Post</DialogTitle>
                    <DialogDescription>
                      Share your insights, questions, or announcements with the community
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="post-type">Post Type</Label>
                      <Select value={postType} onValueChange={setPostType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {postTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-title">Title *</Label>
                      <Input
                        id="post-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's your post about?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-content">Content *</Label>
                      <Textarea
                        id="post-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-tags">Tags (comma-separated)</Label>
                      <Input
                        id="post-tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="yoga, meditation, nutrition"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-omni-violet hover:bg-omni-indigo text-white">
                      Create Post
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Post Type Filter */}
            <div className="mt-8 flex flex-wrap gap-2">
              <Button
                variant={selectedPostType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPostType("all")}
                className={selectedPostType === "all" ? "bg-omni-violet hover:bg-omni-indigo text-white" : ""}
              >
                All Posts
              </Button>
              {postTypes.map(type => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={selectedPostType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPostType(type.value)}
                    className={selectedPostType === type.value ? "bg-omni-violet hover:bg-omni-indigo text-white" : ""}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Posts Feed */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">Be the first to start a conversation!</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-omni-violet hover:bg-omni-indigo text-white"
                >
                  Create Post
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => {
                  const postTypeConfig = getPostTypeConfig(post.post_type);
                  const Icon = postTypeConfig.icon;
                  
                  return (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={postTypeConfig.color}>
                                <Icon className="h-3 w-3 mr-1" />
                                {postTypeConfig.label}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {post.profiles.full_name}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(new Date(post.created_at), 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <CardDescription className="text-gray-700 mb-4 whitespace-pre-line">
                          {post.content}
                        </CardDescription>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes_count}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {post.comments_count}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessCommunity;