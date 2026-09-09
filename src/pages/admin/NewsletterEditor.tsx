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
  FileText,
  Monitor,
  Smartphone
} from 'lucide-react';
import { format } from 'date-fns';

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

/**
 * The campaign shell.
 *
 * WHY IT IS TYPOGRAPHIC RATHER THAN LOGO LED. Most clients block remote
 * images until the reader allows them, so a header built on a logo file
 * opens as a broken picture for a large share of the list. A wordmark set
 * in type always renders, and the spectrum bar carries the brand without
 * loading anything.
 *
 * Every colour is the real palette from the site, not the generic rainbow
 * this template shipped with. Fonts name the brand faces first and fall
 * back to faces that exist on every machine, because email clients rarely
 * load webfonts.
 *
 * The social links are the three accounts the site actually links to.
 * There are no Facebook or TikTok links, which the old template carried
 * and which appear nowhere else on the site.
 *
 * {{unsubscribe_url}} is left as a placeholder on purpose. The sender
 * fills it per recipient so each person gets a link to their own row.
 *
 * No em dashes in this file.
 */
const NEWSLETTER_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF8F2; font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">{{preview_text}}</div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FAF8F2; padding:28px 12px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%; background-color:#FFFFFF; border:1px solid #E1DDD1; border-radius:16px; overflow:hidden;">

          <tr>
            <td style="padding:0; font-size:0; line-height:0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="14.28%" height="6" style="background-color:#E63946; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="14.28%" height="6" style="background-color:#F38020; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="14.28%" height="6" style="background-color:#F5C518; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="14.28%" height="6" style="background-color:#4FAE3F; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="14.28%" height="6" style="background-color:#2BB9B9; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="14.28%" height="6" style="background-color:#2C6FB5; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="14.32%" height="6" style="background-color:#5C2A8A; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#15201F; padding:34px 34px 30px 34px;">
              <p style="margin:0 0 18px 0; font-family:'JetBrains Mono',Consolas,monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#C9B68E;">
                Omni Wellness Media
              </p>
              <h1 style="margin:0; font-family:'Cormorant Garamond',Georgia,'Times New Roman',serif; font-size:34px; line-height:1.15; font-weight:500; color:#FAF8F2;">
                {{headline}}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:34px; font-size:16px; line-height:1.75; color:#33403E;">
              {{content}}
            </td>
          </tr>

          <tr>
            <td style="padding:0 34px 36px 34px;">
              <a href="{{cta_url}}" style="display:inline-block; background-color:#15201F; color:#FAF8F2; padding:14px 30px; text-decoration:none; border-radius:999px; font-weight:600; font-size:15px;">{{cta_text}}</a>
            </td>
          </tr>

          <tr>
            <td style="background-color:#15201F; padding:30px 34px;">
              <p style="margin:0 0 14px 0; font-family:'JetBrains Mono',Consolas,monospace; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:#C9B68E;">
                Find us
              </p>
              <p style="margin:0 0 20px 0; font-size:14px; line-height:1.9;">
                <a href="https://www.instagram.com/omniwellnessmedia/" style="color:#FAF8F2; text-decoration:none; border-bottom:1px solid rgba(250,248,242,.3);">Instagram</a>
                <span style="color:#5A6A68;">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                <a href="https://www.youtube.com/@omniwellnessmedia" style="color:#FAF8F2; text-decoration:none; border-bottom:1px solid rgba(250,248,242,.3);">YouTube</a>
                <span style="color:#5A6A68;">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
                <a href="https://x.com/Omniwellmedia" style="color:#FAF8F2; text-decoration:none; border-bottom:1px solid rgba(250,248,242,.3);">X</a>
              </p>
              <p style="margin:0; font-size:12px; line-height:1.8; color:#8A9794;">
                You are receiving this because you asked us to keep you posted.<br>
                <a href="{{unsubscribe_url}}" style="color:#C9B68E;">Unsubscribe</a>
                <span style="color:#5A6A68;">&nbsp;·&nbsp;</span>
                <a href="https://omniwellnessmedia.co.za/privacy-policy" style="color:#C9B68E;">Privacy policy</a>
              </p>
            </td>
          </tr>

        </table>
        <p style="margin:18px 0 0 0; font-size:11px; color:#5A6A68; font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
          Omni Wellness Media, Cape Town
        </p>
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
  /** True when formData.content holds the body that will be published. False
   *  while editing a saved campaign, because the body is not parsed back out
   *  of the stored HTML. See openEditDialog. */
  const [bodyHydrated, setBodyHydrated] = useState(true);
  /** Guards against a double click inserting the campaign twice. */
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'phone'>('desktop');

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

  /**
   * The stored body of a campaign.
   *
   * {{unsubscribe_url}} is deliberately left in place. Each recipient needs
   * their own link, so the sender fills it in per address at send time. The
   * old code substituted a single fixed URL here, which both flattened the
   * link for everyone and pointed it at a route that did not exist.
   */
  const generateHtml = () => {
    let html = NEWSLETTER_TEMPLATE;
    html = html.replace(/{{subject}}/g, formData.subject);
    html = html.replace(/{{headline}}/g, formData.headline);
    html = html.replace(/{{content}}/g, formData.content.replace(/\n/g, '<br>'));
    html = html.replace(/{{cta_text}}/g, formData.cta_text);
    html = html.replace(/{{cta_url}}/g, formData.cta_url);
    // The hidden preheader: the line most clients show beside the subject in
    // the inbox list. Left empty rather than filled with the subject again,
    // because a preheader that repeats the subject wastes the one line of
    // persuasion you get before somebody decides whether to open.
    html = html.replace(/{{preview_text}}/g, formData.preview_text || '');
    return html;
  };

  // Preview and test sends have no recipient row to address, so the footer
  // link points at the page without an id, which explains itself.
  const withPlaceholdersFilled = (html: string) =>
    html
      .replace(/{{unsubscribe_url}}/g, `${window.location.origin}/unsubscribe`)
      .replace(/{{name}}/g, 'there');

  const handlePreview = () => {
    setPreviewHtml(withPlaceholdersFilled(generateHtml()));
    setIsPreviewOpen(true);
  };

  const handleSaveCampaign = async (status: 'draft' | 'scheduled' = 'draft') => {
    if (saving) return;
    if (!formData.name.trim() || !formData.subject.trim()) {
      toast({
        title: 'A campaign needs a name and a subject',
        description: 'The name is internal; the subject is what recipients see.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    try {
      const campaignData: Record<string, unknown> = {
        name: formData.name,
        subject: formData.subject,
        preview_text: formData.preview_text,
        from_name: formData.from_name,
        from_email: formData.from_email,
        status,
        scheduled_send_time: status === 'scheduled' && formData.scheduled_send_time
          ? new Date(formData.scheduled_send_time).toISOString()
          : null,
      };

      // Only write the body when the form actually holds one. Editing an
      // existing campaign seeds an empty body (see openEditDialog), so
      // regenerating the HTML from it would wipe what is stored.
      if (!editingCampaign || bodyHydrated) {
        campaignData.html_content = generateHtml();
      }

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
        description: error instanceof Error ? error.message : 'Failed to save campaign',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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
    if (sendingTest) return;
    setSendingTest(true);
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
          html: withPlaceholdersFilled(generateHtml()),
          from_name: formData.from_name,
        },
      });

      if (error) throw error;
      toast({ title: 'Sent', description: `Test email sent to ${user.email}` });
    } catch (error) {
      console.error('Error sending test:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive',
      });
    } finally {
      setSendingTest(false);
    }
  };

  const resetForm = () => {
    // A new campaign is authored here in full, so the form owns its body.
    setBodyHydrated(true);
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
    // THE BODY IS NOT PARSED BACK OUT OF THE SAVED HTML. The form below is
    // therefore seeded with placeholder headline and CTA text and an EMPTY
    // body. Saving used to regenerate html_content from that empty form,
    // which silently destroyed the body, headline and call to action of any
    // campaign whose name or subject someone edited. bodyHydrated records
    // that the form does not hold this campaign's body, and the save path
    // leaves html_content untouched while it is false.
    setBodyHydrated(false);
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
    // A dashboard section, not a page. It used to render the public site
    // header and footer inside the admin shell, which stacked two sticky
    // headers at the same z-index and put a marketing footer halfway down
    // the dashboard.
    <div className="space-y-6">
      <div>
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
                  {/* Editing a saved campaign cannot yet show its body back,
                      so say so rather than presenting an empty box that looks
                      like the campaign is empty. Saving leaves the stored
                      body untouched while this notice is showing. */}
                  {editingCampaign && !bodyHydrated && (
                    <div className="mb-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
                      <p className="text-xs font-medium text-amber-900">
                        The saved body is not shown here
                      </p>
                      <p className="mt-1 text-xs text-amber-900">
                        This campaign already has content. It is kept exactly as it is
                        unless you type below, so you can safely change the name, subject
                        or schedule. Typing here replaces the whole body.
                      </p>
                    </div>
                  )}
                  <Textarea
                    value={formData.content}
                    onChange={(e) => {
                      // The moment the operator types, the form owns the body
                      // and the save path writes it.
                      setBodyHydrated(true);
                      setFormData({ ...formData, content: e.target.value });
                    }}
                    placeholder={editingCampaign && !bodyHydrated
                      ? 'Type here only if you want to replace the saved body'
                      : 'Write your newsletter content here...'}
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
                <Button variant="outline" onClick={handleSendTestEmail} disabled={saving || sendingTest}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
                <Button variant="secondary" onClick={() => handleSaveCampaign('draft')} disabled={saving || sendingTest}>
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button onClick={() => handleSaveCampaign(formData.scheduled_send_time ? 'scheduled' : 'draft')} disabled={saving || sendingTest}>
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
      </div>

      {/* Preview.
          Two widths, because most newsletters are read on a phone and a
          layout that only ever gets checked at desktop width is a layout
          nobody has actually checked. The iframe is sandboxed: campaign
          bodies are edited by hand and there is no reason for one to run
          script inside the admin. */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh]">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>
              This is the campaign as it will arrive. The unsubscribe link is
              filled in per recipient when it sends.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={previewWidth === 'desktop' ? 'default' : 'outline'}
              onClick={() => setPreviewWidth('desktop')}
              className="h-8 text-xs"
            >
              <Monitor className="mr-1.5 h-3.5 w-3.5" />
              Desktop
            </Button>
            <Button
              size="sm"
              variant={previewWidth === 'phone' ? 'default' : 'outline'}
              onClick={() => setPreviewWidth('phone')}
              className="h-8 text-xs"
            >
              <Smartphone className="mr-1.5 h-3.5 w-3.5" />
              Phone
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              {previewWidth === 'phone' ? '390px wide' : 'Full width'}
            </span>
          </div>

          <div className="flex justify-center overflow-auto rounded-lg border bg-[#EFEAE0] p-3">
            <iframe
              srcDoc={previewHtml}
              sandbox=""
              title="Campaign preview"
              className="h-[62vh] border-0 bg-white transition-all"
              style={{ width: previewWidth === 'phone' ? 390 : '100%' }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterEditor;
