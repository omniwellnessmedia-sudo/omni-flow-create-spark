import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type QueryTargetTable =
  | "orders" | "transactions" | "affiliate_commissions" | "affiliate_payouts" | "tour_bookings";

interface Query {
  id: string;
  target_table: QueryTargetTable;
  target_id: string;
  author_id: string;
  body: string;
  status: "open" | "resolved";
  resolved_at: string | null;
  created_at: string;
}

/**
 * TransactionQueryDialog — a single inline button (with unread/open badge) that
 * opens a thread of notes against one transaction-like record. Steve flags
 * questions, admins reply, anyone with role can mark resolved. Visibility is
 * gated by the is_accountant_or_admin() RLS on transaction_queries.
 */
export function TransactionQueryDialog({
  targetTable,
  targetId,
  entityId,
  label = "Note",
}: {
  targetTable: QueryTargetTable;
  targetId: string;
  entityId?: string;
  label?: string;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  // Count badge on the trigger — refresh whenever the user opens the dialog
  // (and on first mount). Cheap query, no realtime subscription needed for v1.
  const refresh = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("transaction_queries")
      .select("*")
      .eq("target_table", targetTable)
      .eq("target_id", targetId)
      .order("created_at", { ascending: true });
    if (!error) setQueries((data as Query[]) || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); /* on mount for the badge count */ }, [targetTable, targetId]);
  useEffect(() => { if (open) refresh(); }, [open]);

  const openCount = queries.filter((q) => q.status === "open").length;

  const submit = async () => {
    if (!user?.id || !draft.trim()) return;
    setPosting(true);
    const { error } = await (supabase as any).from("transaction_queries").insert({
      target_table: targetTable,
      target_id: targetId,
      entity_id: entityId ?? null,
      author_id: user.id,
      body: draft.trim(),
    });
    setPosting(false);
    if (error) {
      toast.error("Couldn't post note: " + error.message);
      return;
    }
    setDraft("");
    refresh();
  };

  const resolve = async (id: string) => {
    if (!user?.id) return;
    const { error } = await (supabase as any)
      .from("transaction_queries")
      .update({ status: "resolved", resolved_by: user.id, resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { toast.error("Couldn't resolve: " + error.message); return; }
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          {label}
          {openCount > 0 && (
            <Badge variant="destructive" className="ml-1.5 h-4 px-1 text-[10px]">{openCount}</Badge>
          )}
          {openCount === 0 && queries.length > 0 && (
            <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{queries.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Notes &amp; queries</DialogTitle>
          <DialogDescription className="text-xs">
            Flag this entry for the team. Visible to admins and the accountant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
          {loading && queries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Loading…</p>
          ) : queries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No notes yet. Start the thread below.</p>
          ) : (
            queries.map((q) => (
              <div key={q.id} className="text-sm rounded-lg border p-3 bg-card space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                  </span>
                  {q.status === "open" ? (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => resolve(q.id)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Mark resolved
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">Resolved</Badge>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{q.body}</p>
              </div>
            ))
          )}
        </div>

        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a note or question for the team…"
          rows={3}
          className="text-sm"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={submit} disabled={!draft.trim() || posting}>
            {posting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            Post note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionQueryDialog;
