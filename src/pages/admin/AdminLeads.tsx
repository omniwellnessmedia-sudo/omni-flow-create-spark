import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Building, Clock, MessageSquare, FileText, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  organization: string | null;
  service: string | null;
  status: string | null;
  created_at: string;
}

interface ServiceQuote {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_type: string;
  project_details: string;
  budget_range: string | null;
  timeline: string | null;
  status: string | null;
  created_at: string;
}

const AdminLeads = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [quotes, setQuotes] = useState<ServiceQuote[]>([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalQuotes: 0,
    pendingContacts: 0,
    pendingQuotes: 0,
  });

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const fetchLeadsData = async () => {
    setLoading(true);
    try {
      // Fetch contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactError) throw contactError;

      // Fetch service quotes
      const { data: quoteData, error: quoteError } = await supabase
        .from('service_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (quoteError) throw quoteError;

      setContacts(contactData || []);
      setQuotes(quoteData || []);
      
      setStats({
        totalContacts: contactData?.length || 0,
        totalQuotes: quoteData?.length || 0,
        pendingContacts: contactData?.filter(c => c.status === 'pending' || !c.status).length || 0,
        pendingQuotes: quoteData?.filter(q => q.status === 'pending' || !q.status).length || 0,
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
      toast({
        title: "Status Updated",
        description: `Contact marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_quotes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
      toast({
        title: "Status Updated",
        description: `Quote marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'responded':
        return <Badge className="bg-green-500">Responded</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingContacts} pending response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingQuotes} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts + stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingContacts + stats.pendingQuotes}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={fetchLeadsData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Leads Tabs */}
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">
            Contact Submissions ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="quotes">
            Service Quotes ({quotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No contact submissions yet
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                        {contact.organization && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {contact.organization}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contact.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(contact.created_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {contact.service && (
                    <Badge variant="outline" className="mb-2">
                      {contact.service}
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">{contact.message}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateContactStatus(contact.id, 'in_progress')}
                    >
                      In Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600"
                      onClick={() => updateContactStatus(contact.id, 'responded')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Responded
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateContactStatus(contact.id, 'closed')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Close
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => window.location.href = `mailto:${contact.email}?subject=Re: Your inquiry to Omni Wellness Media`}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          {quotes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No service quote requests yet
              </CardContent>
            </Card>
          ) : (
            quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{quote.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {quote.email}
                        </span>
                        {quote.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {quote.phone}
                          </span>
                        )}
                        {quote.company && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {quote.company}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(quote.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(quote.created_at), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge>{quote.service_type}</Badge>
                    {quote.budget_range && (
                      <Badge variant="outline">Budget: {quote.budget_range}</Badge>
                    )}
                    {quote.timeline && (
                      <Badge variant="outline">Timeline: {quote.timeline}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{quote.project_details}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuoteStatus(quote.id, 'in_progress')}
                    >
                      In Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600"
                      onClick={() => updateQuoteStatus(quote.id, 'responded')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Quoted
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuoteStatus(quote.id, 'closed')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Close
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => window.location.href = `mailto:${quote.email}?subject=Your ${quote.service_type} Quote Request`}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Send Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLeads;
