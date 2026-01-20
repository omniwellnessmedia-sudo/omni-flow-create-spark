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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Mail,
  Plus,
  Send,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  Calendar as CalendarIcon,
  Sparkles,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  preview_text?: string;
  html_content: string;
  from_name: string;
  from_email: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduled_send_time?: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  full_name?: string;
  confirmed: boolean;
  interests: string[];
  source: string;
  subscribed_at: string;
  unsubscribed: boolean;
}

const NEWSLETTER_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with Rainbow Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #96CEB4, #9B59B6); padding: 30px; text-align: center;">
              <img src="https://omniwellnessmedia.com/omni-logo-white.png" alt="Omni Wellness Media" style="max-width: 180px; height: auto;">
              <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">{{headline}}</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              {{content}}
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="{{cta_url}}" style="display: inline-block; background: linear-gradient(135deg, #9B59B6, #45B7D1); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">{{cta_text}}</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 30px; text-align: center;">
              <p style="color: #ffffff; margin: 0 0 15px 0; font-size: 14px;">Follow us on social media</p>
              <div style="margin-bottom: 20px;">
                <a href="https://facebook.com/omniwellnessmedia" style="display: inline-block; margin: 0 8px;"><img src="https://img.icons8.com/ios-filled/30/ffffff/facebook-new.png" alt="Facebook"></a>
                <a href="https://instagram.com/omniwellnessmedia" style="display: inline-block; margin: 0 8px;"><img src="https://img.icons8.com/ios-filled/30/ffffff/instagram-new.png" alt="Instagram"></a>
                <a href="https://tiktok.com/@omniwellnessmedia" style="display: inline-block; margin: 0 8px;"><img src="https://img.icons8.com/ios-filled/30/ffffff/tiktok.png" alt="TikTok"></a>
              </div>
              <p style="color: #888888; font-size: 12px; margin: 0;">
                © 2025 Omni Wellness Media. All rights reserved.<br>
                <a href="{{unsubscribe_url}}" style="color: #888888;">Unsubscribe</a> | <a href="https://omniwellnessmedia.com/privacy-policy" style="color: #888888;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const NewsletterEditor = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<NewsletterCampaign | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preview_text: '',
    headline: 'Your Wellness Update',
    content: '',
    cta_text: 'Explore Now',
    cta_url: 'https://omniwellnessmedia.com',
    from_name: 'Omni Wellness Media',
    from_email: 'hello@omniwellnessmedia.com',
    scheduled_send_time: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsResult, subscribersResult] = await Promise.all([
        (supabase
          .from('newsletter_campaigns' as any)
          .select('*')
          .order('created_at', { ascending: false }) as any),
        (supabase
          .from('newsletter_subscribers' as any)
          .select('*')
          .eq('unsubscribed', false)
          .order('subscribed_at', { ascending: false }) as any),
      ]);

      if (campaignsResult.error) throw campaignsResult.error;
      if (subscribersResult.error) throw subscribersResult.error;

      setCampaigns((campaignsResult.data || []) as NewsletterCampaign[]);
      setSubscribers((subscribersResult.data || []) as Subscriber[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load newsletter data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHtml = () => {
    let html = NEWSLETTER_TEMPLATE;
    html = html.replace(/{{subject}}/g, formData.subject);
    html = html.replace(/{{headline}}/g, formData.headline);
    html = html.replace(/{{content}}/g, formData.content.replace(/\n/g, '<br>'));
    html = html.replace(/{{cta_text}}/g, formData.cta_text);
    html = html.replace(/{{cta_url}}/g, formData.cta_url);
    html = html.replace(/{{unsubscribe_url}}/g, 'https://omniwellnessmedia.com/unsubscribe');
    return html;
  };

  const handlePreview = () => {
    setPreviewHtml(generateHtml());
    setIsPreviewOpen(true);
  };

  const handleSaveCampaign = async (status: 'draft' | 'scheduled' = 'draft') => {
    try {
      const html = generateHtml();
      
      const campaignData = {
        name: formData.name,
        subject: formData.subject,
        preview_text: formData.preview_text,
        html_content: html,
        from_name: formData.from_name,
        from_email: formData.from_email,
        status,
        scheduled_send_time: status === 'scheduled' && formData.scheduled_send_time
          ? new Date(formData.scheduled_send_time).toISOString()
          : null,
      };

      if (editingCampaign) {
        const { error } = await (supabase
          .from('newsletter_campaigns' as any)
          .update(campaignData)
          .eq('id', editingCampaign.id) as any);
        
        if (error) throw error;
        toast({ title: 'Updated', description: 'Campaign updated successfully' });
      } else {
        const { error } = await (supabase
          .from('newsletter_campaigns' as any)
          .insert(campaignData) as any);
        
        if (error) throw error;
        toast({ title: 'Created', description: `Campaign ${status === 'scheduled' ? 'scheduled' : 'saved as draft'}` });
      }

      setIsCreateDialogOpen(false);
      setEditingCampaign(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to save campaign',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    
    try {
      const { error } = await (supabase
        .from('newsletter_campaigns' as any)
        .delete()
        .eq('id', id) as any);
      
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Campaign removed' });
      fetchData();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete campaign',
        variant: 'destructive',
      });
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast({ title: 'Error', description: 'No email found for current user', variant: 'destructive' });
        return;
      }

      const { error } = await supabase.functions.invoke('send-scheduled-newsletter', {
        body: {
          test: true,
          email: user.email,
          subject: formData.subject,
          html: generateHtml(),
          from_name: formData.from_name,
        },
      });

      if (error) throw error;
      toast({ title: 'Sent', description: `Test email sent to ${user.email}` });
    } catch (error) {
      console.error('Error sending test:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      preview_text: '',
      headline: 'Your Wellness Update',
      content: '',
      cta_text: 'Explore Now',
      cta_url: 'https://omniwellnessmedia.com',
      from_name: 'Omni Wellness Media',
      from_email: 'hello@omniwellnessmedia.com',
      scheduled_send_time: '',
    });
  };

  const openEditDialog = (campaign: NewsletterCampaign) => {
    setEditingCampaign(campaign);
    // Parse HTML to extract values (simplified - in production use proper HTML parsing)
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      preview_text: campaign.preview_text || '',
      headline: 'Your Wellness Update',
      content: '', // Would need to parse from HTML
      cta_text: 'Explore Now',
      cta_url: 'https://omniwellnessmedia.com',
      from_name: campaign.from_name,
      from_email: campaign.from_email,
      scheduled_send_time: campaign.scheduled_send_time 
        ? format(new Date(campaign.scheduled_send_time), "yyyy-MM-dd'T'HH:mm")
        : '',
    });
    setIsCreateDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500">Sent</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'sending':
        return <Badge className="bg-yellow-500">Sending</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const confirmedSubscribers = subscribers.filter(s => s.confirmed);

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
            <h1 className="text-2xl md:text-3xl font-bold">Newsletter Campaigns</h1>
            <p className="text-muted-foreground">Create and schedule email newsletters</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              setEditingCampaign(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create Newsletter Campaign'}</DialogTitle>
                <DialogDescription>
                  Design your email newsletter with our branded template
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Campaign Name (internal)</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., January Wellness Newsletter"
                    />
                  </div>
                  <div>
                    <Label>Subject Line</Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Your subject line"
                    />
                  </div>
                </div>

                <div>
                  <Label>Preview Text</Label>
                  <Input
                    value={formData.preview_text}
                    onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                    placeholder="Brief text shown in inbox preview"
                  />
                </div>

                <div>
                  <Label>Headline (shown in email header)</Label>
                  <Input
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="Your Wellness Update"
                  />
                </div>

                <div>
                  <Label>Email Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your newsletter content here..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Line breaks will be preserved. Keep it concise and engaging.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>CTA Button Text</Label>
                    <Input
                      value={formData.cta_text}
                      onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                      placeholder="Explore Now"
                    />
                  </div>
                  <div>
                    <Label>CTA Button URL</Label>
                    <Input
                      value={formData.cta_url}
                      onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                      placeholder="https://omniwellnessmedia.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Name</Label>
                    <Input
                      value={formData.from_name}
                      onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>From Email</Label>
                    <Input
                      value={formData.from_email}
                      onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Schedule Send Time (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_send_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_send_time: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to save as draft. Set a time to schedule.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={handleSendTestEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
                <Button variant="secondary" onClick={() => handleSaveCampaign('draft')}>
                  Save Draft
                </Button>
                <Button onClick={() => handleSaveCampaign(formData.scheduled_send_time ? 'scheduled' : 'draft')}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formData.scheduled_send_time ? 'Schedule' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{confirmedSubscribers.length}</p>
                  <p className="text-xs text-muted-foreground">Active Subscribers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'sent').length}</p>
                  <p className="text-xs text-muted-foreground">Campaigns Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'scheduled').length}</p>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {campaigns.reduce((sum, c) => sum + (c.open_count || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Opens</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">
              <Mail className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="subscribers">
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
                <CardDescription>{campaigns.length} campaigns total</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {campaigns.map(campaign => (
                      <div
                        key={campaign.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{campaign.name}</span>
                            {getStatusBadge(campaign.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Subject: {campaign.subject}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            {campaign.scheduled_send_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(campaign.scheduled_send_time), 'MMM d, yyyy h:mm a')}
                              </span>
                            )}
                            {campaign.status === 'sent' && (
                              <>
                                <span>Sent: {campaign.sent_count}</span>
                                <span>Opens: {campaign.open_count}</span>
                                <span>Clicks: {campaign.click_count}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(campaign)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            disabled={campaign.status === 'sending'}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {campaigns.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No campaigns yet. Click "New Campaign" to get started.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>
                  {confirmedSubscribers.length} confirmed, {subscribers.length - confirmedSubscribers.length} pending confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {subscribers.map(subscriber => (
                      <div
                        key={subscriber.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          {subscriber.full_name && (
                            <p className="text-sm text-muted-foreground">{subscriber.full_name}</p>
                          )}
                          <div className="flex gap-2 mt-1">
                            {subscriber.confirmed ? (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Pending</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              via {subscriber.source}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(subscriber.subscribed_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    ))}
                    {subscribers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No subscribers yet. Subscribers from the website will appear here.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden bg-gray-100">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[500px] border-0"
              title="Email Preview"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default NewsletterEditor;
