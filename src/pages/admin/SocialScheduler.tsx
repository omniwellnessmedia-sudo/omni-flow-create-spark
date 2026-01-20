import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon,
  Plus,
  Facebook,
  Instagram,
  Music2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Trash2,
  Edit,
  Image as ImageIcon,
  FileText,
  Settings,
  Sparkles,
  Upload
} from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

interface ScheduledPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok';
  content_text: string;
  image_url?: string;
  hashtags?: string[];
  scheduled_date: string;
  scheduled_time: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  campaign_name?: string;
  content_pillar?: 'inspiration' | 'education' | 'empowerment' | 'wellness';
  created_at: string;
}

const CONTENT_PILLARS = [
  { value: 'inspiration', label: 'Inspiration', color: 'bg-yellow-500' },
  { value: 'education', label: 'Education', color: 'bg-blue-500' },
  { value: 'empowerment', label: 'Empowerment', color: 'bg-purple-500' },
  { value: 'wellness', label: 'Wellness', color: 'bg-green-500' },
];

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { value: 'tiktok', label: 'TikTok', icon: Music2, color: 'text-black' },
];

const SocialScheduler = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    platform: 'facebook' as 'facebook' | 'instagram' | 'tiktok',
    content_text: '',
    image_url: '',
    hashtags: '',
    scheduled_date: format(new Date(), 'yyyy-MM-dd'),
    scheduled_time: '09:00',
    campaign_name: '',
    content_pillar: 'wellness' as 'inspiration' | 'education' | 'empowerment' | 'wellness',
  });

  // Bulk import state
  const [bulkContent, setBulkContent] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchSettings();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await (supabase
        .from('scheduled_social_posts' as any)
        .select('*')
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true }) as any);
      
      if (error) throw error;
      setPosts((data || []) as ScheduledPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load scheduled posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await (supabase
        .from('social_automation_settings' as any)
        .select('setting_value')
        .eq('setting_key', 'zapier_webhook_url')
        .single() as any);
      
      if (data) {
        setZapierWebhookUrl(data.setting_value || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveWebhook = async () => {
    try {
      const { error } = await (supabase
        .from('social_automation_settings' as any)
        .upsert({
          setting_key: 'zapier_webhook_url',
          setting_value: zapierWebhookUrl,
        }, { onConflict: 'setting_key' }) as any);
      
      if (error) throw error;
      toast({
        title: 'Saved',
        description: 'Zapier webhook URL updated',
      });
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast({
        title: 'Error',
        description: 'Failed to save webhook URL',
        variant: 'destructive',
      });
    }
  };

  const handleCreatePost = async () => {
    try {
      const hashtagsArray = formData.hashtags
        .split(/[,\s]+/)
        .filter(tag => tag.trim())
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

      const postData = {
        platform: formData.platform,
        content_text: formData.content_text,
        image_url: formData.image_url || null,
        hashtags: hashtagsArray,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        campaign_name: formData.campaign_name || null,
        content_pillar: formData.content_pillar,
        status: 'scheduled' as const,
      };

      if (editingPost) {
        const { error } = await (supabase
          .from('scheduled_social_posts' as any)
          .update(postData)
          .eq('id', editingPost.id) as any);
        
        if (error) throw error;
        toast({ title: 'Updated', description: 'Post updated successfully' });
      } else {
        const { error } = await (supabase
          .from('scheduled_social_posts' as any)
          .insert(postData) as any);
        
        if (error) throw error;
        toast({ title: 'Created', description: 'Post scheduled successfully' });
      }

      setIsCreateDialogOpen(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this scheduled post?')) return;
    
    try {
      const { error } = await (supabase
        .from('scheduled_social_posts' as any)
        .delete()
        .eq('id', id) as any);
      
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Post removed' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const handleBulkImport = async () => {
    try {
      const lines = bulkContent.split('\n').filter(line => line.trim());
      const postsToCreate: any[] = [];
      let currentDate = new Date();
      let postIndex = 0;
      const times = ['09:00', '13:00', '18:00']; // 3 posts per day

      for (const line of lines) {
        const timeIndex = postIndex % 3;
        const dayOffset = Math.floor(postIndex / 3);
        const postDate = addDays(currentDate, dayOffset);

        // Parse line format: [Platform] Content #hashtags
        let platform: 'facebook' | 'instagram' | 'tiktok' = 'facebook';
        let content = line.trim();
        
        if (content.toLowerCase().startsWith('[facebook]')) {
          platform = 'facebook';
          content = content.substring(10).trim();
        } else if (content.toLowerCase().startsWith('[instagram]')) {
          platform = 'instagram';
          content = content.substring(11).trim();
        } else if (content.toLowerCase().startsWith('[tiktok]')) {
          platform = 'tiktok';
          content = content.substring(8).trim();
        }

        // Extract hashtags
        const hashtagMatches = content.match(/#\w+/g) || [];
        
        postsToCreate.push({
          platform,
          content_text: content,
          hashtags: hashtagMatches,
          scheduled_date: format(postDate, 'yyyy-MM-dd'),
          scheduled_time: times[timeIndex],
          campaign_name: '31-Day Campaign',
          content_pillar: 'wellness',
          status: 'scheduled',
        });

        postIndex++;
      }

      if (postsToCreate.length > 0) {
        const { error } = await (supabase
          .from('scheduled_social_posts' as any)
          .insert(postsToCreate) as any);
        
        if (error) throw error;
        
        toast({
          title: 'Imported',
          description: `${postsToCreate.length} posts scheduled successfully`,
        });
        
        setIsBulkImportOpen(false);
        setBulkContent('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error bulk importing:', error);
      toast({
        title: 'Error',
        description: 'Failed to import posts',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      platform: 'facebook',
      content_text: '',
      image_url: '',
      hashtags: '',
      scheduled_date: format(new Date(), 'yyyy-MM-dd'),
      scheduled_time: '09:00',
      campaign_name: '',
      content_pillar: 'wellness',
    });
  };

  const openEditDialog = (post: ScheduledPost) => {
    setEditingPost(post);
    setFormData({
      platform: post.platform,
      content_text: post.content_text,
      image_url: post.image_url || '',
      hashtags: post.hashtags?.join(' ') || '',
      scheduled_date: post.scheduled_date,
      scheduled_time: post.scheduled_time,
      campaign_name: post.campaign_name || '',
      content_pillar: post.content_pillar || 'wellness',
    });
    setIsCreateDialogOpen(true);
  };

  // Calendar view
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDay = (date: Date) => {
    return posts.filter(post => isSameDay(new Date(post.scheduled_date), date));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'posted':
        return <Badge className="bg-green-500 text-xs">Posted</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 text-xs">Scheduled</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Draft</Badge>;
    }
  };

  const getPillarColor = (pillar?: string) => {
    const found = CONTENT_PILLARS.find(p => p.value === pillar);
    return found?.color || 'bg-gray-500';
  };

  const getPlatformIcon = (platform: string) => {
    const found = PLATFORMS.find(p => p.value === platform);
    if (!found) return null;
    const Icon = found.icon;
    return <Icon className={`h-4 w-4 ${found.color}`} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Social Media Scheduler</h1>
            <p className="text-muted-foreground">Schedule posts for Facebook, Instagram, and TikTok</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isBulkImportOpen} onOpenChange={setIsBulkImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Import Posts</DialogTitle>
                  <DialogDescription>
                    Paste your posts, one per line. Format: [Platform] Content #hashtags
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder={`[Facebook] Start your wellness journey today! 🌿 #wellness #health
[Instagram] Discover the power of mindful living ✨ #mindfulness #omni
[TikTok] Quick wellness tip for busy days 💪 #wellnesstips`}
                    value={bulkContent}
                    onChange={(e) => setBulkContent(e.target.value)}
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Posts will be scheduled at 9am, 1pm, and 6pm (3 per day) starting from today.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkImportOpen(false)}>Cancel</Button>
                  <Button onClick={handleBulkImport}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Import {bulkContent.split('\n').filter(l => l.trim()).length} Posts
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) {
                setEditingPost(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingPost ? 'Edit Post' : 'Schedule New Post'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Platform</Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(v) => setFormData({ ...formData, platform: v as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLATFORMS.map(p => (
                            <SelectItem key={p.value} value={p.value}>
                              <div className="flex items-center gap-2">
                                <p.icon className={`h-4 w-4 ${p.color}`} />
                                {p.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Content Pillar</Label>
                      <Select
                        value={formData.content_pillar}
                        onValueChange={(v) => setFormData({ ...formData, content_pillar: v as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTENT_PILLARS.map(p => (
                            <SelectItem key={p.value} value={p.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${p.color}`} />
                                {p.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Post Content</Label>
                    <Textarea
                      value={formData.content_text}
                      onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                      placeholder="Write your post content..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.content_text.length} characters
                    </p>
                  </div>

                  <div>
                    <Label>Hashtags (space or comma separated)</Label>
                    <Input
                      value={formData.hashtags}
                      onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                      placeholder="#wellness #health #mindfulness"
                    />
                  </div>

                  <div>
                    <Label>Image URL (optional)</Label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData.scheduled_date}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Time (SAST)</Label>
                      <Input
                        type="time"
                        value={formData.scheduled_time}
                        onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Campaign Name (optional)</Label>
                    <Input
                      value={formData.campaign_name}
                      onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                      placeholder="e.g., New Year Wellness Campaign"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePost}>
                    <Send className="h-4 w-4 mr-2" />
                    {editingPost ? 'Update' : 'Schedule'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list">
              <FileText className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{format(selectedDate, 'MMMM yyyy')}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDate(addDays(startOfMonth(selectedDate), -1))}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDate(addDays(endOfMonth(selectedDate), 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                  ))}
                  {daysInMonth.map(day => {
                    const dayPosts = getPostsForDay(day);
                    const isToday = isSameDay(day, new Date());
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[80px] md:min-h-[100px] border rounded-lg p-1 md:p-2 ${
                          isToday ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className={`text-xs md:text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayPosts.slice(0, 3).map(post => (
                            <div
                              key={post.id}
                              className={`text-[10px] md:text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getPillarColor(post.content_pillar)} text-white truncate`}
                              onClick={() => openEditDialog(post)}
                              title={post.content_text}
                            >
                              <div className="flex items-center gap-1">
                                {getPlatformIcon(post.platform)}
                                <span className="truncate hidden md:inline">{post.scheduled_time}</span>
                              </div>
                            </div>
                          ))}
                          {dayPosts.length > 3 && (
                            <div className="text-[10px] text-muted-foreground text-center">
                              +{dayPosts.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>All Scheduled Posts</CardTitle>
                <CardDescription>{posts.length} posts total</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {posts.map(post => (
                      <div
                        key={post.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-1 h-full min-h-[60px] rounded ${getPillarColor(post.content_pillar)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getPlatformIcon(post.platform)}
                            <span className="text-sm font-medium">
                              {format(new Date(post.scheduled_date), 'MMM d, yyyy')} at {post.scheduled_time}
                            </span>
                            {getStatusBadge(post.status)}
                            {post.campaign_name && (
                              <Badge variant="outline" className="text-xs">
                                {post.campaign_name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content_text}
                          </p>
                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.hashtags.slice(0, 5).map((tag, i) => (
                                <span key={i} className="text-xs text-primary">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No posts scheduled yet. Click "New Post" to get started.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
                <CardDescription>Configure Zapier webhook for automated posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Zapier Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={zapierWebhookUrl}
                      onChange={(e) => setZapierWebhookUrl(e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      className="flex-1"
                    />
                    <Button onClick={handleSaveWebhook}>Save</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connect to Zapier to automatically push scheduled posts to Buffer or directly to social platforms.
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">How it works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Create a Zapier account and set up a "Webhooks by Zapier" trigger</li>
                    <li>Copy your webhook URL and paste it above</li>
                    <li>Connect Zapier to Buffer or your social media accounts</li>
                    <li>Our system will send posts to Zapier at their scheduled times</li>
                    <li>Zapier will forward them to your connected platforms</li>
                  </ol>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Content Pillars Legend:</h3>
                  <div className="flex flex-wrap gap-4">
                    {CONTENT_PILLARS.map(pillar => (
                      <div key={pillar.value} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${pillar.color}`} />
                        <span className="text-sm">{pillar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default SocialScheduler;
