import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  Mail,
  TrendingUp,
  Users,
  ShoppingCart,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Target
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';

interface DashboardStats {
  totalConversations: number;
  leadsCapured: number;
  conversionRate: number;
  weeklyGrowth: number;
}

interface Conversation {
  id: string;
  session_id: string;
  user_email: string | null;
  messages: any[];
  lead_captured: boolean;
  created_at: string;
}

interface NewsletterLead {
  id: string;
  email: string;
  source: string;
  nurture_sequence_step: number;
  created_at: string;
}

const RoamBuddySalesDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    leadsCapured: 0,
    conversionRate: 0,
    weeklyGrowth: 0
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [leads, setLeads] = useState<NewsletterLead[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch chatbot conversations
      const { data: convData, error: convError } = await supabase
        .from('chatbot_conversations' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50) as { data: Conversation[] | null; error: any };

      if (convError) {
        console.error('Error fetching conversations:', convError);
      } else {
        setConversations(convData || []);
      }

      // Fetch newsletter leads from RoamBuddy bot
      const { data: leadData, error: leadError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('source', 'roambuddy-sales-bot')
        .order('created_at', { ascending: false })
        .limit(50) as { data: NewsletterLead[] | null; error: any };

      if (leadError) {
        console.error('Error fetching leads:', leadError);
      } else {
        setLeads(leadData || []);
      }

      // Calculate stats
      const totalConversations = convData?.length || 0;
      const leadsCapured = leadData?.length || 0;
      const conversionRate = totalConversations > 0 
        ? Math.round((leadsCapured / totalConversations) * 100) 
        : 0;

      // Calculate weekly growth (compare to previous week)
      const weekAgo = subDays(new Date(), 7);
      const thisWeekLeads = leadData?.filter((l: any) => 
        new Date(l.created_at) > weekAgo
      ).length || 0;
      const previousWeekLeads = leadData?.filter((l: any) => {
        const date = new Date(l.created_at);
        return date > subDays(weekAgo, 7) && date <= weekAgo;
      }).length || 0;
      
      const weeklyGrowth = previousWeekLeads > 0 
        ? Math.round(((thisWeekLeads - previousWeekLeads) / previousWeekLeads) * 100)
        : thisWeekLeads > 0 ? 100 : 0;

      setStats({
        totalConversations,
        leadsCapured,
        conversionRate,
        weeklyGrowth
      });

    } catch (error) {
      console.error('Dashboard error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast({ title: 'Refreshed', description: 'Dashboard data updated' });
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
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              RoamBuddy Sales Dashboard
            </h1>
            <p className="text-muted-foreground">Track AI chatbot performance and lead generation</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                Chatbot interactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Captured</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadsCapured}</div>
              <p className="text-xs text-muted-foreground">
                Email signups from bot
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Conversations to leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.weeklyGrowth >= 0 ? '+' : ''}{stats.weeklyGrowth}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs previous week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Data */}
        <Tabs defaultValue="conversations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="conversations">
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="funnel">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Funnel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  AI chatbot interactions with visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No conversations yet</p>
                      <p className="text-sm">The AI sales bot will track conversations here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversations.map((conv) => (
                        <div key={conv.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={conv.lead_captured ? 'default' : 'secondary'}>
                                {conv.lead_captured ? 'Lead Captured' : 'No Lead'}
                              </Badge>
                              {conv.user_email && (
                                <span className="text-sm text-muted-foreground">
                                  {conv.user_email}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(conv.created_at), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              {Array.isArray(conv.messages) ? conv.messages.length : 0} messages
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Captured Leads</CardTitle>
                <CardDescription>
                  Email signups from the RoamBuddy sales bot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {leads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No leads captured yet</p>
                      <p className="text-sm">Leads from the sales bot will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between border rounded-lg p-3">
                          <div>
                            <p className="font-medium">{lead.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Step {lead.nurture_sequence_step || 0}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(lead.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle>Sales Funnel Overview</CardTitle>
                <CardDescription>
                  Track the customer journey from first interaction to purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Funnel Stages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Page Visitors</p>
                          <p className="text-sm text-muted-foreground">RoamBuddy store visits</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">—</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Bot Conversations</p>
                          <p className="text-sm text-muted-foreground">Engaged with AI assistant</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">{stats.totalConversations}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Leads Captured</p>
                          <p className="text-sm text-muted-foreground">Email signups</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">{stats.leadsCapured}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                          4
                        </div>
                        <div>
                          <p className="font-medium">Conversions</p>
                          <p className="text-sm text-muted-foreground">eSIM purchases</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">—</span>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                    <p>📊 Full analytics coming soon — connect your RoamBuddy affiliate dashboard for purchase tracking</p>
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

export default RoamBuddySalesDashboard;
