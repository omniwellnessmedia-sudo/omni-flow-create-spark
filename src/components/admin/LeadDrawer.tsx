import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Copy, Archive, Trash2, Send, Sparkles, ExternalLink, FileText, Calendar } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export type LeadType = "contact" | "quote" | "outreach";

interface LeadDrawerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  leadType: LeadType;
  lead: any | null;
  onUpdated: () => void;
}

const TABLE_MAP: Record<LeadType, string> = {
  contact: "contact_submissions",
  quote: "service_quotes",
  outreach: "outreach_leads",
};

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  first_contact: {
    subject: "Hello from Omni Wellness Media",
    body: "Hi {{name}},\n\nThank you for reaching out to Omni Wellness Media. We're a conscious media company bridging wellness, outreach and storytelling across South Africa.\n\nI'd love to set up a 20-minute discovery call to learn more about {{org}} and how we can support you. You can grab a slot here: https://cal.com/omni-wellness-media-gqj9mj\n\nWarmly,\nThe Omni Team",
  },
  follow_up: {
    subject: "Following up — Omni Wellness Media",
    body: "Hi {{name}},\n\nJust circling back on my note from a couple of weeks ago. Happy to share more about how we're working with partners like yours, or jump on a quick call.\n\nCal link: https://cal.com/omni-wellness-media-gqj9mj\n\nThanks,\nThe Omni Team",
  },
  send_quote: {
    subject: "Your quote from Omni Wellness Media",
    body: "Hi {{name}},\n\nThank you for the brief on {{org}}. Please find our proposal attached / linked below.\n\nHappy to walk through it on a call: https://cal.com/omni-wellness-media-gqj9mj\n\nKind regards,\nThe Omni Team",
  },
  decline_thanks: {
    subject: "Thank you for considering Omni Wellness Media",
    body: "Hi {{name}},\n\nThank you for taking the time to engage with us. We understand this isn't the right fit at the moment and wish {{org}} continued success.\n\nWe'd love to stay in touch.\n\nBest,\nThe Omni Team",
  },
  partner_onboarding: {
    subject: "Welcome to the Omni partner network",
    body: "Hi {{name}},\n\nDelighted to bring {{org}} into our partner network. Here are your onboarding resources:\n\n• Partner deck: https://omniwellnessmedia.co.za/roambuddy-overview\n• Brand assets: provider-images bucket\n• Booking link: https://cal.com/omni-wellness-media-gqj9mj\n\nLet's set up a kickoff call.\n\nWarmly,\nThe Omni Team",
  },
};

const STATUS_OPTIONS_DEFAULT = ["pending", "in_progress", "responded", "quoted", "closed", "archived"];
const STATUS_OPTIONS_OUTREACH = ["no_response", "contacted", "positive", "awaiting", "applied", "registered", "declined", "archived"];

const LeadDrawer = ({ open, onOpenChange, leadType, lead, onUpdated }: LeadDrawerProps) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(lead || {});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEdit(lead || {});
    if (lead?.id) loadActivities(lead.id);
  }, [lead?.id, leadType]);

  const loadActivities = async (id: string) => {
    const { data } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_type", leadType)
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .limit(50);
    setActivities(data || []);
  };

  const logActivity = async (action: string, payload: Record<string, any> = {}) => {
    if (!lead?.id) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("lead_activities").insert({
      lead_type: leadType, lead_id: lead.id, actor_id: user?.id, action, payload,
    });
    loadActivities(lead.id);
  };

  if (!lead) return null;

  const name = leadType === "outreach" ? lead.organisation : lead.name;
  const email = leadType === "outreach" ? lead.contact_email : lead.email;
  const org = leadType === "outreach" ? lead.organisation : (lead.organization || lead.company);
  const statusOptions = leadType === "outreach" ? STATUS_OPTIONS_OUTREACH : STATUS_OPTIONS_DEFAULT;

  const save = async () => {
    setSaving(true);
    const table = TABLE_MAP[leadType];
    const updates: any = {};
    const allowed = leadType === "outreach"
      ? ["organisation", "sector", "contact_email", "contact_person", "status", "notes", "follow_up_due", "internal_notes"]
      : ["name", "email", "phone", "organization", "company", "status", "internal_notes", "assigned_to"];
    allowed.forEach((k) => { if (k in edit) updates[k] = edit[k]; });
    const { error } = await supabase.from(table as any).update(updates).eq("id", lead.id);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Saved" });
    logActivity("edit", { fields: Object.keys(updates) });
    onUpdated();
  };

  const setStatus = async (status: string) => {
    const table = TABLE_MAP[leadType];
    const updates: any = { status };
    if (status === "archived") updates.archived_at = new Date().toISOString();
    const { error } = await supabase.from(table as any).update(updates).eq("id", lead.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Marked ${status}` });
    logActivity("status_change", { to: status });
    setEdit({ ...edit, status });
    onUpdated();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await logActivity("note", { text: note });
    setNote("");
    toast({ title: "Note added" });
  };

  const sendTemplate = (key: keyof typeof TEMPLATES) => {
    if (!email) { toast({ title: "No email on record", variant: "destructive" }); return; }
    const t = TEMPLATES[key];
    const sub = t.subject;
    const body = t.body.split("{{name}}").join((name || "there").split(" ")[0]).split("{{org}}").join(org || "your organisation");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
    logActivity("email_sent", { template: key });
  };

  const remove = async () => {
    if (!confirm("Delete this lead? This can't be undone.")) return;
    const { error } = await supabase.from(TABLE_MAP[leadType] as any).delete().eq("id", lead.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted" });
    onOpenChange(false); onUpdated();
  };

  // Suggested next action
  const daysSince = lead.last_contacted ? Math.floor((Date.now() - new Date(lead.last_contacted).getTime()) / 86400000) : null;
  const suggest = (() => {
    if (!lead.status || lead.status === "pending" || lead.status === "no_response") return { label: "Send first contact", key: "first_contact" };
    if (lead.status === "contacted" && daysSince && daysSince > 14) return { label: "Follow up overdue — send follow-up", key: "follow_up" };
    if (lead.status === "positive" || lead.status === "in_progress") return { label: "Send quote", key: "send_quote" };
    if (lead.status === "declined") return { label: "Send polite decline thanks", key: "decline_thanks" };
    return { label: "Add a note", key: null as any };
  })();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {name}
            <Badge variant="outline" className="text-[10px]">{leadType}</Badge>
            {lead.status && <Badge className="text-[10px]">{lead.status}</Badge>}
          </SheetTitle>
          <SheetDescription>
            Created {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : "—"}
          </SheetDescription>
        </SheetHeader>

        {/* Copilot suggestion */}
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-medium">Suggested next action</p>
            <p className="text-sm text-muted-foreground">{suggest.label}</p>
            {suggest.key && (
              <Button size="sm" className="mt-2 h-7 text-xs" onClick={() => sendTemplate(suggest.key)}>
                <Send className="h-3 w-3 mr-1" />Apply template
              </Button>
            )}
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 p-2 rounded border hover:bg-muted min-h-[44px]">
              <Mail className="h-3.5 w-3.5" /><span className="truncate">{email}</span>
            </a>
          )}
          {(lead.phone || lead.contact_person) && (
            <a href={lead.phone ? `tel:${lead.phone}` : "#"} className="flex items-center gap-1.5 p-2 rounded border hover:bg-muted min-h-[44px]">
              <Phone className="h-3.5 w-3.5" /><span className="truncate">{lead.phone || lead.contact_person}</span>
            </a>
          )}
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noopener" className="flex items-center gap-1.5 p-2 rounded border hover:bg-muted min-h-[44px] col-span-2">
              <ExternalLink className="h-3.5 w-3.5" /><span className="truncate">{lead.website}</span>
            </a>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { navigator.clipboard.writeText(email || ""); toast({ title: "Email copied" }); }}>
            <Copy className="h-3 w-3 mr-1" />Copy email
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendTemplate("first_contact")}>First contact</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendTemplate("follow_up")}>Follow-up</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendTemplate("send_quote")}>Quote</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendTemplate("partner_onboarding")}>Partner onboard</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setStatus("archived")}>
            <Archive className="h-3 w-3 mr-1" />Archive
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs text-destructive" onClick={remove}>
            <Trash2 className="h-3 w-3 mr-1" />Delete
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Status pipeline */}
        <div>
          <Label className="text-xs">Move to status</Label>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {statusOptions.map((s) => (
              <Button key={s} size="sm" variant={lead.status === s ? "default" : "outline"} className="h-7 text-[11px]" onClick={() => setStatus(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Edit fields */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">Edit</p>
          {leadType === "outreach" ? (
            <>
              <div><Label className="text-xs">Organisation</Label><Input value={edit.organisation || ""} onChange={(e) => setEdit({ ...edit, organisation: e.target.value })} /></div>
              <div><Label className="text-xs">Sector</Label><Input value={edit.sector || ""} onChange={(e) => setEdit({ ...edit, sector: e.target.value })} /></div>
              <div><Label className="text-xs">Contact email</Label><Input value={edit.contact_email || ""} onChange={(e) => setEdit({ ...edit, contact_email: e.target.value })} /></div>
              <div><Label className="text-xs">Contact person</Label><Input value={edit.contact_person || ""} onChange={(e) => setEdit({ ...edit, contact_person: e.target.value })} /></div>
              <div><Label className="text-xs">Follow-up due</Label><Input type="date" value={edit.follow_up_due || ""} onChange={(e) => setEdit({ ...edit, follow_up_due: e.target.value })} /></div>
              <div><Label className="text-xs">Notes</Label><Textarea value={edit.notes || ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} /></div>
            </>
          ) : (
            <>
              <div><Label className="text-xs">Name</Label><Input value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div><Label className="text-xs">Email</Label><Input value={edit.email || ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></div>
              <div><Label className="text-xs">Phone</Label><Input value={edit.phone || ""} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></div>
              <div><Label className="text-xs">Organisation</Label><Input value={edit.organization || edit.company || ""} onChange={(e) => setEdit({ ...edit, [leadType === "contact" ? "organization" : "company"]: e.target.value })} /></div>
            </>
          )}
          <div><Label className="text-xs">Internal notes (admin-only)</Label><Textarea value={edit.internal_notes || ""} onChange={(e) => setEdit({ ...edit, internal_notes: e.target.value })} placeholder="Private context, owner, next steps…" /></div>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>

        <Separator className="my-4" />

        {/* Original message */}
        {(lead.message || lead.project_details || lead.notes) && (
          <div className="mb-4">
            <p className="text-xs font-medium uppercase text-muted-foreground mb-1.5 flex items-center gap-1"><FileText className="h-3 w-3" />Brief</p>
            <p className="text-sm bg-muted/40 rounded-md p-3 whitespace-pre-wrap">{lead.message || lead.project_details || lead.notes}</p>
          </div>
        )}

        {/* Activity timeline */}
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground mb-2 flex items-center gap-1"><Calendar className="h-3 w-3" />Activity</p>
          <div className="flex gap-2 mb-2">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a quick note…" />
            <Button size="sm" onClick={addNote}>Add</Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activities.length === 0 && <p className="text-xs text-muted-foreground">No activity yet.</p>}
            {activities.map((a) => (
              <div key={a.id} className="text-xs border-l-2 border-primary/30 pl-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[9px] px-1.5">{a.action}</Badge>
                  <span className="text-muted-foreground">{format(new Date(a.created_at), "MMM d, HH:mm")}</span>
                </div>
                {a.payload?.text && <p className="mt-1">{a.payload.text}</p>}
                {a.payload?.template && <p className="mt-1 text-muted-foreground">Template: {a.payload.template}</p>}
                {a.payload?.to && <p className="mt-1 text-muted-foreground">→ {a.payload.to}</p>}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDrawer;
