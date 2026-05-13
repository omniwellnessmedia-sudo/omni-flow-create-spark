import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, ChevronRight } from "lucide-react";
import LeadDrawer from "./LeadDrawer";

const CAMPAIGNS = [
  { key: "all", label: "All" },
  { key: "overall", label: "Overall" },
  { key: "zacri", label: "Zacri Campaign" },
  { key: "youth_sports", label: "Youth Sports" },
  { key: "women", label: "Women" },
  { key: "ecd", label: "ECD/Reading" },
  { key: "tech", label: "Tech" },
];

const PIPELINE = [
  { key: "active", label: "Active", match: ["no_response", "contacted", "positive", "awaiting"] },
  { key: "applied", label: "Applied", match: ["applied", "registered"] },
  { key: "declined", label: "Declined", match: ["declined"] },
  { key: "archived", label: "Archived", match: ["archived"] },
];

const OutreachPipeline = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [campaign, setCampaign] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("outreach_leads").select("*").order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (campaign !== "all" && r.campaign !== campaign) return false;
      if (search && !`${r.organisation} ${r.sector || ""} ${r.contact_email || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rows, campaign, search]);

  const exportCsv = () => {
    const headers = ["organisation", "sector", "contact_method", "contact_email", "status", "campaign", "last_contacted", "follow_up_due", "notes"];
    const csv = [headers.join(",")].concat(
      filtered.map((r) => headers.map((h) => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(","))
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `outreach-${campaign}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organisation, sector, email…" className="pl-8" />
        </div>
        <Select value={campaign} onValueChange={setCampaign}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{CAMPAIGNS.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" />Export</Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          {PIPELINE.map((p) => {
            const count = filtered.filter((r) => p.match.includes(r.status)).length;
            return <TabsTrigger key={p.key} value={p.key}>{p.label} ({count})</TabsTrigger>;
          })}
        </TabsList>

        {PIPELINE.map((p) => (
          <TabsContent key={p.key} value={p.key} className="space-y-2">
            {loading && <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>}
            {!loading && filtered.filter((r) => p.match.includes(r.status)).length === 0 && (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No leads in this stage.</CardContent></Card>
            )}
            {filtered.filter((r) => p.match.includes(r.status)).map((r) => (
              <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelected(r); setOpen(true); }}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{r.organisation}</p>
                      <Badge variant="outline" className="text-[9px]">{r.campaign}</Badge>
                      <Badge className="text-[9px]">{r.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {r.sector}{r.contact_email ? ` · ${r.contact_email}` : ""}{r.follow_up_due ? ` · follow-up ${r.follow_up_due}` : ""}
                    </p>
                    {r.notes && <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">{r.notes}</p>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <LeadDrawer open={open} onOpenChange={setOpen} leadType="outreach" lead={selected} onUpdated={load} />
    </div>
  );
};

export default OutreachPipeline;
