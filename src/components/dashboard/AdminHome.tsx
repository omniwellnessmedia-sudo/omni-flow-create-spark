import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Plus, Printer, Mail, Eye, ArrowRight, AlertTriangle, Info, Activity } from "lucide-react";
import { usePipelineLeads } from "@/hooks/usePipelineLeads";
import { followUpDue, oldestFirst, summarise, type PipelineLead, type Stage } from "@/lib/pipeline";
import { WalkInDialog, LeadCard } from "@/components/admin/PipelineBoard";
import LeadDrawer from "@/components/admin/LeadDrawer";

/**
 * Today: the admin's front door, built around the day rather than the data.
 *
 * WHAT WAS HERE. Five stat tiles (revenue, orders, leads, providers, users),
 * a WellCoins figure, and a "platform health" card. True numbers, none of
 * them an answer to the question anyone opening the admin at eight in the
 * morning is asking, which is: who do I need to reply to, and who is close
 * to buying?
 *
 * WHAT IS HERE. Four counts that are each a job (needs a reply, follow-ups
 * due, quoted and waiting, won this week), the two lists behind the first
 * two, and the three things somebody starts from here: a walk-in, the check
 * sheet, the newsletter. The old alerts (bookings, orders, providers) stay
 * in a small "elsewhere" list so nothing that used to be visible vanishes.
 *
 * No em dashes in this file.
 */

interface AdminAlert {
  type: "warning" | "info";
  message: string;
}

interface AdminHomeProps {
  stats: Record<string, any>;
  recentActivity: any[];
  alerts: AdminAlert[];
  onNavigate: (section: string) => void;
  loading?: boolean;
}

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const Tile = ({
  label, value, hue, hint, onClick,
}: { label: string; value: number; hue: string; hint: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group rounded-[18px] border border-border/60 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(21,32,31,.08)]"
  >
    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
      <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: hue }} />
      {label}
    </p>
    <p className="mt-2 font-wwpl-display text-[38px] leading-none" style={{ color: value > 0 ? "#15201F" : "#8A9A96" }}>
      {value}
    </p>
    <p className="mt-2 text-[12px] leading-snug text-muted-foreground">{hint}</p>
  </button>
);

const ListCard = ({
  eyebrow, title, hue, leads, empty, onOpen, onStage, all,
}: {
  eyebrow: string; title: string; hue: string; leads: PipelineLead[]; empty: string;
  onOpen: (l: PipelineLead) => void; onStage: (l: PipelineLead, s: Stage) => void; all: () => void;
}) => (
  <section className="rounded-[18px] border border-border/60 bg-card p-4">
    <header className="mb-3 flex items-end justify-between gap-3">
      <div>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
          <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: hue }} />
          {eyebrow}
        </p>
        <h2 className="mt-1 !text-[20px]">{title}</h2>
      </div>
      <button type="button" onClick={all} className="inline-flex min-h-[24px] items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        Pipeline <ArrowRight className="h-3 w-3" />
      </button>
    </header>
    {leads.length === 0 ? (
      <p className="rounded-[14px] bg-[#F4EFE5]/70 p-4 text-[13px] leading-snug text-muted-foreground">{empty}</p>
    ) : (
      <div className="space-y-2">
        {leads.map((l) => <LeadCard key={l.key} lead={l} onOpen={onOpen} onStage={onStage} compact />)}
      </div>
    )}
  </section>
);

const AdminHome = memo(({ recentActivity, alerts, onNavigate, loading = false }: AdminHomeProps) => {
  const pipeline = usePipelineLeads();
  const [walkIn, setWalkIn] = useState(false);
  const [selected, setSelected] = useState<PipelineLead | null>(null);

  const summary = useMemo(() => summarise(pipeline.leads), [pipeline.leads]);
  const needsReply = useMemo(() => pipeline.leads.filter((l) => l.stage === "new").sort(oldestFirst).slice(0, 6), [pipeline.leads]);
  const followUps = useMemo(
    () => pipeline.leads.filter((l) => followUpDue(l)).sort((a, b) => (a.followUpDue ?? "").localeCompare(b.followUpDue ?? "")).slice(0, 6),
    [pipeline.leads]
  );

  if (loading || (pipeline.loading && pipeline.leads.length === 0)) {
    return (
      <div className="space-y-5" role="status" aria-busy="true" aria-label="Loading today">
        <Skeleton className="h-8 w-40 motion-reduce:animate-none" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-[18px] motion-reduce:animate-none" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-[18px] motion-reduce:animate-none" />
          <Skeleton className="h-64 rounded-[18px] motion-reduce:animate-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* The greeting above already carries the h1 and the date, so this
          row is the eyebrow and the actions only. */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-eyebrow">Sales / Today</p>
          <p className="mt-1.5 text-sm text-muted-foreground">Who needs a reply, who is close, and what to start.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="h-9 rounded-full" onClick={() => setWalkIn(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />Add walk-in
          </Button>
          <Button size="sm" variant="outline" className="h-9 rounded-full" asChild>
            <Link to="/muizenberg/audit-sheet"><Printer className="mr-1.5 h-3.5 w-3.5" />Check sheet</Link>
          </Button>
          <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => onNavigate("newsletter")}>
            <Mail className="mr-1.5 h-3.5 w-3.5" />Newsletter
          </Button>
          <Button size="sm" variant="ghost" className="h-9 rounded-full" onClick={() => window.open("/", "_blank")}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />Site
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Needs a reply" value={summary.needsReply} hue="#E63946" hint="New leads nobody has answered" onClick={() => onNavigate("pipeline")} />
        <Tile label="Follow-ups due" value={summary.followUps} hue="#F38020" hint="Promised a call or a visit by today" onClick={() => onNavigate("pipeline")} />
        <Tile label="Quoted, waiting" value={summary.byStage.quoted} hue="#2BB9B9" hint="A price is with them" onClick={() => onNavigate("pipeline")} />
        <Tile label="Won this week" value={summary.wonThisWeek} hue="#4FAE3F" hint={`${summary.muizenberg} from the Muizenberg walk so far`} onClick={() => onNavigate("pipeline")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListCard
          eyebrow="Reply first"
          title="Waiting on us"
          hue="#E63946"
          leads={needsReply}
          empty="Nobody is waiting on a reply. Every new lead has been answered."
          onOpen={setSelected}
          onStage={(l, s) => pipeline.setStage(l, s)}
          all={() => onNavigate("pipeline")}
        />
        <ListCard
          eyebrow="Keep the promise"
          title="Follow-ups due"
          hue="#F38020"
          leads={followUps}
          empty="No follow-ups due today. Add a date on any card and it shows up here."
          onOpen={setSelected}
          onStage={(l, s) => pipeline.setStage(l, s)}
          all={() => onNavigate("pipeline")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[18px] border border-border/60 bg-card p-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
            <Activity className="h-3 w-3" /> Lately
          </p>
          {recentActivity.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">Orders, bookings and leads show up here as they arrive.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border/50">
              {recentActivity.slice(0, 6).map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px]">{a.description}</p>
                    <p className="text-[10.5px] text-muted-foreground" style={MONO}>{a.time}</p>
                  </div>
                  {a.amount ? <span className="shrink-0 text-[12px]" style={MONO}>R{Number(a.amount).toLocaleString()}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[18px] border border-border/60 bg-card p-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
            <Info className="h-3 w-3" /> Elsewhere
          </p>
          {alerts.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">Bookings, orders and providers are all clear.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {alerts.map((a, i) => (
                <li key={i} className={cn("flex items-center gap-2 rounded-[12px] px-3 py-2 text-[13px]", a.type === "warning" ? "bg-amber-50 text-amber-900" : "bg-[#F4EFE5]/80")}>
                  {a.type === "warning" ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> : <Info className="h-3.5 w-3.5 shrink-0" />}
                  {a.message}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <WalkInDialog open={walkIn} onOpenChange={setWalkIn} onSaved={() => pipeline.reload(true)} />
      <LeadDrawer
        open={selected !== null}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        leadType={selected?.source ?? "contact"}
        lead={selected?.raw ?? null}
        onUpdated={() => pipeline.reload(true)}
      />
    </div>
  );
});

AdminHome.displayName = "AdminHome";

export default AdminHome;
