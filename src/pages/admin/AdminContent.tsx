import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink,
  Mic,
  Image,
  Video
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  created_at: string;
  views_count: number;
  likes_count: number;
  slug: string;
}

const AdminContent = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, status, created_at, views_count, likes_count, slug')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== id));
      toast({ title: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'Failed to delete post', variant: 'destructive' });
    }
  };

  const quickActions = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'New Blog Post',
      description: 'Create a new blog article',
      onClick: () => navigate('/blog-editor'),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      icon: <Mic className="h-5 w-5" />,
      title: 'New Podcast Episode',
      description: 'Add a podcast episode',
      onClick: () => toast({ title: 'Coming Soon', description: 'Podcast management will be available soon' }),
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: 'Upload Video',
      description: 'Add video content',
      onClick: () => toast({ title: 'Coming Soon', description: 'Video uploads will be available soon' }),
      color: 'bg-red-50 hover:bg-red-100 border-red-200'
    },
    {
      icon: <Image className="h-5 w-5" />,
      title: 'Manage Gallery',
      description: 'Organize images',
      onClick: () => toast({ title: 'Coming Soon', description: 'Gallery management will be available soon' }),
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    }
  ];

  const contentStats = {
    totalPosts: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + (p.views_count || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg border text-left transition-all ${action.color}`}
          >
            <div className="flex items-center gap-3 mb-2">
              {action.icon}
              <span className="font-medium text-sm">{action.title}</span>
            </div>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{contentStats.totalPosts}</div>
          <div className="text-xs text-muted-foreground">Total Posts</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{contentStats.published}</div>
          <div className="text-xs text-muted-foreground">Published</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{contentStats.draft}</div>
          <div className="text-xs text-muted-foreground">Drafts</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{contentStats.totalViews.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </Card>
      </div>

      {/* Blog Posts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Blog Posts</CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </div>
            <Button size="sm" onClick={() => navigate('/blog-editor')} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button onClick={() => navigate('/blog-editor')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{post.title}</h3>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="text-[10px] shrink-0"
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.views_count || 0}
                      </span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={() => navigate(`/blog-editor?edit=${post.id}`)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{post.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContent;
