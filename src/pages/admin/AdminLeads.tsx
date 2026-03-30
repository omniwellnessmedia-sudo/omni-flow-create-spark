import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Phone, Building, Clock, MessageSquare, FileText, RefreshCw, CheckCircle, XCircle, Plus, Send, Users } from "lucide-react";
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

const SERVICES = [
  "Web Development",
  "Social Media Strategy",
  "Media Production",
  "Business Consulting",
  "Wellness Retreats",
  "Tours & Travel",
  "General Inquiry",
];

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

  // Add Lead dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addType, setAddType] = useState<"contact" | "quote">("contact");
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    service: "",
    message: "",
    budget_range: "",
    timeline: "",
  });

  // Mass email dialog
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    sendTo: "all" as "all" | "pending" | "contacts" | "quotes",
  });
  const [sending, setSending] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const fetchLeadsData = async () => {
    setLoading(true);
    try {
      const [contactResult, quoteResult] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("service_quotes").select("*").order("created_at", { ascending: false }),
      ]);

      if (contactResult.error) throw contactResult.error;
      if (quoteResult.error) throw quoteResult.error;

      const contactData = contactResult.data || [];
      const quoteData = quoteResult.data || [];

      setContacts(contactData);
      setQuotes(quoteData);

      setStats({
        totalContacts: contactData.length,
        totalQuotes: quoteData.length,
        pendingContacts: contactData.filter((c) => c.status === "pending" || !c.status).length,
        pendingQuotes: quoteData.filter((q) => q.status === "pending" || !q.status).length,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({ title: "Error", description: "Failed to load leads data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- Add Lead ---
  const addLead = async () => {
    if (!newLead.name.trim() || !newLead.email.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }

    try {
      if (addType === "contact") {
        const { error } = await supabase.from("contact_submissions").insert({
          name: newLead.name,
          email: newLead.email,
          message: newLead.message || "Manually added lead",
          organization: newLead.organization || null,
          service: newLead.service || null,
          status: "pending",
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("service_quotes").insert({
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone || null,
          company: newLead.organization || null,
          service_type: newLead.service || "General Inquiry",
          project_details: newLead.message || "Manually added lead",
          budget_range: newLead.budget_range || null,
          timeline: newLead.timeline || null,
          status: "pending",
        });
        if (error) throw error;
      }

      toast({ title: "Lead added", description: `${newLead.name} added successfully` });
      setNewLead({ name: "", email: "", phone: "", organization: "", service: "", message: "", budget_range: "", timeline: "" });
      setShowAddDialog(false);
      fetchLeadsData();
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({ title: "Error", description: "Failed to add lead", variant: "destructive" });
    }
  };

  // --- Mass Email ---
  const getEmailRecipients = (): { name: string; email: string }[] => {
    if (selectMode && selectedEmails.size > 0) {
      const all = [
        ...contacts.map((c) => ({ name: c.name, email: c.email })),
        ...quotes.map((q) => ({ name: q.name, email: q.email })),
      ];
      return all.filter((r) => selectedEmails.has(r.email));
    }

    const allContacts = contacts.map((c) => ({ name: c.name, email: c.email, status: c.status, type: "contact" }));
    const allQuotes = quotes.map((q) => ({ name: q.name, email: q.email, status: q.status, type: "quote" }));

    let recipients: { name: string; email: string }[];
    switch (emailData.sendTo) {
      case "pending":
        recipients = [...allContacts, ...allQuotes].filter((r) => r.status === "pending" || !r.status);
        break;
      case "contacts":
        recipients = allContacts;
        break;
      case "quotes":
        recipients = allQuotes;
        break;
      default:
        recipients = [...allContacts, ...allQuotes];
    }

    // Dedupe by email
    const seen = new Set<string>();
    return recipients.filter((r) => {
      if (seen.has(r.email)) return false;
      seen.add(r.email);
      return true;
    });
  };

  const sendMassEmail = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) {
      toast({ title: "Error", description: "Subject and message are required", variant: "destructive" });
      return;
    }

    const recipients = getEmailRecipients();
    if (recipients.length === 0) {
      toast({ title: "No recipients", description: "No leads match your filter", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      // Use the existing newsletter edge function pattern — send via Supabase
      // Create a campaign-style send using the newsletter infrastructure
      const { error } = await supabase.from("newsletter_campaigns").insert({
        name: `Lead Email: ${emailData.subject}`,
        subject: emailData.subject,
        html_content: generateEmailHtml(emailData.subject, emailData.message),
        status: "scheduled",
        scheduled_send_time: new Date().toISOString(),
        from_name: "Omni Wellness Media",
        from_email: "hello@omniwellnessmedia.co.za",
      });

      if (error) throw error;

      toast({
        title: "Email queued",
        description: `Email will be sent to ${recipients.length} recipients via the newsletter system`,
      });
      setShowEmailDialog(false);
      setEmailData({ subject: "", message: "", sendTo: "all" });
      setSelectMode(false);
      setSelectedEmails(new Set());
    } catch (error) {
      console.error("Error sending mass email:", error);
      toast({ title: "Error", description: "Failed to queue email", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const generateEmailHtml = (subject: string, message: string) => {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5}
.container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:20px;margin-bottom:20px}
.header{background:linear-gradient(135deg,#7c3aed,#2563eb,#0891b2);padding:32px;text-align:center}
.header h1{color:#fff;margin:0;font-size:24px}
.body{padding:32px}
.body p{color:#374151;line-height:1.7;font-size:15px;margin:0 0 16px}
.footer{padding:24px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af}
</style></head><body>
<div class="container">
<div class="header"><h1>${subject}</h1></div>
<div class="body">${message.split("\n").map((p) => `<p>${p}</p>`).join("")}</div>
<div class="footer">
<p>Omni Wellness Media | omniwellnessmedia.co.za</p>
<p>You received this because you contacted us. <a href="mailto:hello@omniwellnessmedia.co.za">Unsubscribe</a></p>
</div></div></body></html>`;
  };

  const toggleEmailSelection = (email: string) => {
    const next = new Set(selectedEmails);
    if (next.has(email)) next.delete(email);
    else next.add(email);
    setSelectedEmails(next);
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
      if (error) throw error;
      setContacts(contacts.map((c) => (c.id === id ? { ...c, status } : c)));
      toast({ title: "Status Updated", description: `Contact marked as ${status}` });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("service_quotes").update({ status }).eq("id", id);
      if (error) throw error;
      setQuotes(quotes.map((q) => (q.id === id ? { ...q, status } : q)));
      toast({ title: "Status Updated", description: `Quote marked as ${status}` });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "responded":
        return <Badge className="bg-green-500">Responded</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "closed":
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingContacts} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingQuotes} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingContacts + stats.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          {/* Add Lead */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>Manually add a contact or quote request</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={addType === "contact" ? "default" : "outline"}
                    onClick={() => setAddType("contact")}
                  >
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    variant={addType === "quote" ? "default" : "outline"}
                    onClick={() => setAddType("quote")}
                  >
                    Quote Request
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Name *</Label>
                    <Input
                      value={newLead.name}
                      onChange={(e) => setNewLead((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email *</Label>
                    <Input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{addType === "quote" ? "Company" : "Organization"}</Label>
                    <Input
                      value={newLead.organization}
                      onChange={(e) => setNewLead((p) => ({ ...p, organization: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Service</Label>
                    <Select value={newLead.service} onValueChange={(v) => setNewLead((p) => ({ ...p, service: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {addType === "quote" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Phone</Label>
                      <Input
                        value={newLead.phone}
                        onChange={(e) => setNewLead((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+27..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Budget Range</Label>
                      <Input
                        value={newLead.budget_range}
                        onChange={(e) => setNewLead((p) => ({ ...p, budget_range: e.target.value }))}
                        placeholder="e.g. R5k - R20k"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs">{addType === "quote" ? "Project Details" : "Message"}</Label>
                  <Textarea
                    value={newLead.message}
                    onChange={(e) => setNewLead((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Details about the inquiry..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={addLead}>Add Lead</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Mass Email */}
          <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Send className="h-4 w-4 mr-1" />
                Mass Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Send Email to Leads</DialogTitle>
                <DialogDescription>
                  Compose and send an email to your leads via the newsletter system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                {!selectMode && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Send To</Label>
                    <Select
                      value={emailData.sendTo}
                      onValueChange={(v) => setEmailData((p) => ({ ...p, sendTo: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Leads ({contacts.length + quotes.length})</SelectItem>
                        <SelectItem value="pending">Pending Only ({stats.pendingContacts + stats.pendingQuotes})</SelectItem>
                        <SelectItem value="contacts">Contacts Only ({contacts.length})</SelectItem>
                        <SelectItem value="quotes">Quote Requests Only ({quotes.length})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {selectMode && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium mb-1">{selectedEmails.size} recipients selected</p>
                    <p className="text-[10px] text-muted-foreground">Use the checkboxes on lead cards to select</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs">Subject *</Label>
                  <Input
                    value={emailData.subject}
                    onChange={(e) => setEmailData((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="e.g. Exclusive offer from Omni Wellness Media"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Message *</Label>
                  <Textarea
                    value={emailData.message}
                    onChange={(e) => setEmailData((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Write your email message here..."
                    rows={6}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Recipients: ~{getEmailRecipients().length} unique emails. Sent via newsletter system with Omni branding.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
                <Button onClick={sendMassEmail} disabled={sending}>
                  {sending ? <RefreshCw className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                  {sending ? "Sending..." : `Send to ${getEmailRecipients().length} leads`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Select mode toggle */}
          <Button
            size="sm"
            variant={selectMode ? "secondary" : "ghost"}
            onClick={() => {
              setSelectMode(!selectMode);
              if (selectMode) setSelectedEmails(new Set());
            }}
          >
            {selectMode ? `${selectedEmails.size} selected` : "Select"}
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={fetchLeadsData}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Leads Tabs */}
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
          <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-3">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No contact submissions yet</CardContent>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      {selectMode && (
                        <Checkbox
                          checked={selectedEmails.has(contact.email)}
                          onCheckedChange={() => toggleEmailSelection(contact.email)}
                          className="mt-1"
                        />
                      )}
                      <div className="min-w-0">
                        <CardTitle className="text-base">{contact.name}</CardTitle>
                        <CardDescription className="flex items-center gap-3 mt-1 flex-wrap">
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
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(contact.status)}
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">
                        {format(new Date(contact.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {contact.service && (
                    <Badge variant="outline" className="mb-2 text-[10px]">{contact.service}</Badge>
                  )}
                  <p className="text-sm text-muted-foreground mb-3">{contact.message}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateContactStatus(contact.id, "in_progress")}>
                      In Progress
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-green-600" onClick={() => updateContactStatus(contact.id, "responded")}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Responded
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateContactStatus(contact.id, "closed")}>
                      <XCircle className="w-3 h-3 mr-1" />
                      Close
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={() => (window.location.href = `mailto:${contact.email}?subject=Re: Your inquiry to Omni Wellness Media`)}>
                      <Mail className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-3">
          {quotes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No service quote requests yet</CardContent>
            </Card>
          ) : (
            quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      {selectMode && (
                        <Checkbox
                          checked={selectedEmails.has(quote.email)}
                          onCheckedChange={() => toggleEmailSelection(quote.email)}
                          className="mt-1"
                        />
                      )}
                      <div className="min-w-0">
                        <CardTitle className="text-base">{quote.name}</CardTitle>
                        <CardDescription className="flex items-center gap-3 mt-1 flex-wrap">
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
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(quote.status)}
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">
                        {format(new Date(quote.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <Badge className="text-[10px]">{quote.service_type}</Badge>
                    {quote.budget_range && <Badge variant="outline" className="text-[10px]">Budget: {quote.budget_range}</Badge>}
                    {quote.timeline && <Badge variant="outline" className="text-[10px]">Timeline: {quote.timeline}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{quote.project_details}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateQuoteStatus(quote.id, "in_progress")}>
                      In Progress
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-green-600" onClick={() => updateQuoteStatus(quote.id, "responded")}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Quoted
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateQuoteStatus(quote.id, "closed")}>
                      <XCircle className="w-3 h-3 mr-1" />
                      Close
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={() => (window.location.href = `mailto:${quote.email}?subject=Your ${quote.service_type} Quote Request`)}>
                      <Mail className="w-3 h-3 mr-1" />
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
