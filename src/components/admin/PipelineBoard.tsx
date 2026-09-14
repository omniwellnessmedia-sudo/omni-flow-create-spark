import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Printer, Search, Mail, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import LeadDrawer from '@/components/admin/LeadDrawer';
import { usePipelineLeads, type PipelineApi } from '@/hooks/usePipelineLeads';
import {
  BOARD_STAGES, STAGES, WALK_IN_CAMPAIGN, ageLabel, followUpDue, isMuizenberg, oldestFirst, stageDef,
  type LeadSource, type PipelineLead, type Stage,
} from '@/lib/pipeline';

/**
 * The sales pipeline: every lead from every table, in the stages Omni sells
 * through, on one board.
 *
 * A COLUMN PER STAGE, NOT A TAB PER TABLE. The old Leads screen split the
 * same conversations across Contacts, Quotes and Outreach tabs by where the
 * row happened to be stored. Nobody sells by storage table. Here a card is
 * a person, its colour is where they are, and moving it writes the right
 * status word back to whichever table owns it (src/lib/pipeline.ts).
 *
 * WALK-INS. The Muizenberg check sheet ends with a conversation on a
 * pavement. The walk-in dialog turns that into a lead in the time it takes
 * to type a name: it writes to outreach_leads with the muizenberg campaign
 * tag, stamps today as last contacted, and sets a follow-up three days out
 * unless told otherwise.
 *
 * No em dashes in this file.
 */

const SOURCE_LABEL: Record<LeadSource, string> = { contact: 'Contact form', quote: 'Enquiry', outreach: 'Walk-in / outreach' };

const SECTORS = [
  'Cafe, restaurant or bar',
  'Guesthouse or holiday let',
  'Surf school or outdoor operator',
  'Yoga, wellness or health practice',
  'Shop, market or maker',
  'Tradesperson or home services',
  'Other',
];

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

/** The dialog behind "Add walk-in", reused by the Today board. */
export const WalkInDialog = ({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    organisation: '',
    contact_person: '',
    phone: '',
    email: '',
    sector: SECTORS[0],
    said: '',
    findings: '',
    follow_up_due: plusDays(3),
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.organisation.trim()) {
      toast({ title: 'The business name is the one thing this needs', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const notes = [
      form.said.trim() && `What they said: ${form.said.trim()}`,
      form.findings.trim() && `Three findings: ${form.findings.trim()}`,
      form.phone.trim() && `Phone: ${form.phone.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    const { data, error } = await supabase
      .from('outreach_leads')
      .insert({
        organisation: form.organisation.trim(),
        contact_person: form.contact_person.trim() || null,
        contact_email: form.email.trim() || null,
        contact_method: form.phone.trim() ? `walk-in, ${form.phone.trim()}` : 'walk-in',
        sector: form.sector,
        campaign: WALK_IN_CAMPAIGN,
        status: 'contacted',
        last_contacted: today(),
        follow_up_due: form.follow_up_due || null,
        notes: notes || null,
        owner_id: auth.user?.id ?? null,
      })
      .select()
      .single();
    setSaving(false);
    if (error || !data) {
      toast({ title: 'Could not save the walk-in', description: error?.message, variant: 'destructive' });
      return;
    }
    await supabase.from('lead_activities').insert({
      lead_type: 'outreach', lead_id: data.id, actor_id: auth.user?.id ?? null, action: 'walk_in', payload: { sector: form.sector },
    });
    toast({ title: `${form.organisation.trim()} is on the board`, description: 'In conversation, follow-up set.' });
    setForm({ organisation: '', contact_person: '', phone: '', email: '', sector: SECTORS[0], said: '', findings: '', follow_up_due: plusDays(3) });
    onOpenChange(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a walk-in</DialogTitle>
          <DialogDescription>
            A conversation from the Muizenberg sheet. The business name is enough to save; the rest can be filled in later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-1 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Business</Label>
            <Input value={form.organisation} onChange={(e) => set('organisation', e.target.value)} placeholder="The name over the door" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Who you spoke to</Label>
            <Input value={form.contact_person} onChange={(e) => set('contact_person', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sector</Label>
            <select
              value={form.sector}
              onChange={(e) => set('sector', e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Phone or WhatsApp</Label>
            <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+27" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">What they said</Label>
            <Textarea rows={2} value={form.said} onChange={(e) => set('said', e.target.value)} placeholder="Yes, no, maybe, and why. The nos count too." />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">The three findings you left them</Label>
            <Textarea rows={3} value={form.findings} onChange={(e) => set('findings', e.target.value)} placeholder="One per line" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Follow up on</Label>
            <Input type="date" value={form.follow_up_due} onChange={(e) => set('follow_up_due', e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving' : 'Save walk-in'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** One lead on the board. */
export const LeadCard = ({
  lead,
  onOpen,
  onStage,
  compact = false,
}: {
  lead: PipelineLead;
  onOpen: (lead: PipelineLead) => void;
  onStage?: (lead: PipelineLead, stage: Stage) => void;
  compact?: boolean;
}) => {
  const due = followUpDue(lead);
  const def = stageDef(lead.stage);
  return (
    <div
      className="group rounded-[14px] border border-border/60 bg-card p-3 shadow-[0_1px_2px_rgba(21,32,31,.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(21,32,31,.10)]"
    >
      <button type="button" onClick={() => onOpen(lead)} className="block w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium leading-tight">{lead.name}</p>
            {lead.org && lead.org !== lead.name && (
              <p className="truncate text-[12px] text-muted-foreground">{lead.org}</p>
            )}
          </div>
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full"
            style={{ background: def.hue }}
            aria-label={def.label}
            title={def.label}
          />
        </div>
        {lead.service && (
          <p className="mt-1.5 truncate text-[12px]" style={{ color: '#2BB9B9' }}>{lead.service}</p>
        )}
        {!compact && lead.brief && (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">{lead.brief}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] uppercase tracking-[.12em] text-muted-foreground" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          <span>{ageLabel(lead.createdAt)}</span>
          <span aria-hidden="true">/</span>
          <span>{SOURCE_LABEL[lead.source]}</span>
          {isMuizenberg(lead) && <span className="rounded-full bg-[#F4EFE5] px-1.5 py-[1px] normal-case tracking-normal text-foreground">Muizenberg</span>}
          {lead.followUpDue && (
            <span className={cn('normal-case tracking-normal', due ? 'font-medium text-[#C0392B]' : '')}>
              {due ? 'Follow up now' : `Follow up ${lead.followUpDue}`}
            </span>
          )}
        </div>
      </button>
      {onStage && (
        <div className="mt-2 flex items-center gap-1.5 border-t border-border/50 pt-2">
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Email ${lead.name}`}>
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
          {lead.phone && (
            <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Call ${lead.name}`}>
              <Phone className="h-3.5 w-3.5" />
            </a>
          )}
          <label className="relative ml-auto">
            <span className="sr-only">Move {lead.name} to stage</span>
            <select
              value={lead.stage}
              onChange={(e) => onStage(lead, e.target.value as Stage)}
              className="h-7 appearance-none rounded-full border border-border/70 bg-background pl-2.5 pr-6 text-[11px] text-foreground"
            >
              {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          </label>
        </div>
      )}
    </div>
  );
};

const PipelineBoard = ({ api }: { api?: PipelineApi }) => {
  const own = usePipelineLeads();
  const { leads, loading, error, lastUpdated, reload, setStage } = api ?? own;
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<LeadSource | 'all'>('all');
  const [muizOnly, setMuizOnly] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [walkIn, setWalkIn] = useState(false);
  const [selected, setSelected] = useState<PipelineLead | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (source !== 'all' && l.source !== source) return false;
      if (muizOnly && !isMuizenberg(l)) return false;
      if (q && !`${l.name} ${l.org ?? ''} ${l.email ?? ''} ${l.service ?? ''} ${l.brief ?? ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [leads, search, source, muizOnly]);

  const move = async (lead: PipelineLead, stage: Stage) => {
    const problem = await setStage(lead, stage);
    if (problem) toast({ title: 'Could not move the lead', description: problem, variant: 'destructive' });
    else toast({ title: `${lead.name}: ${stageDef(stage).label}` });
  };

  const columns = showClosed ? STAGES : BOARD_STAGES;
  const closedCount = filtered.filter((l) => l.stage === 'lost' || l.stage === 'archived').length;

  return (
    <div className="space-y-5">
      <AdminScreenHeader
        eyebrow="Sales"
        title="Pipeline"
        description="Every lead from the forms, the enquiry page and the Muizenberg walk, in the stages we sell through. Move a card and the record moves with it."
        actions={
          <>
            <Button size="sm" variant="outline" asChild className="h-8 rounded-full text-xs">
              <Link to="/muizenberg/audit-sheet"><Printer className="mr-1.5 h-3.5 w-3.5" />Check sheet</Link>
            </Button>
            <Button size="sm" className="h-8 rounded-full text-xs" onClick={() => setWalkIn(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />Add walk-in
            </Button>
          </>
        }
        meta={lastUpdated ? `Live. Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading'}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, business, email, service" className="pl-8" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([
            ['all', 'All'],
            ['quote', 'Enquiries'],
            ['contact', 'Contact form'],
            ['outreach', 'Walk-ins'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSource(k)}
              className={cn(
                'h-8 rounded-full border px-3 text-xs transition-colors',
                source === k ? 'border-foreground bg-foreground text-background' : 'border-border/70 text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMuizOnly((v) => !v)}
            className={cn(
              'h-8 rounded-full border px-3 text-xs transition-colors',
              muizOnly ? 'border-foreground bg-foreground text-background' : 'border-border/70 text-muted-foreground hover:text-foreground'
            )}
          >
            Muizenberg
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          Some leads could not be read: {error}. <button className="underline" onClick={() => reload()}>Try again</button>
        </p>
      )}

      <div className="-mx-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
        <div className="flex min-w-max gap-3">
          {columns.map((col) => {
            const cards = filtered.filter((l) => l.stage === col.id).sort(oldestFirst);
            return (
              <section key={col.id} className="w-[272px] shrink-0" aria-labelledby={`stage-${col.id}`}>
                <header className="mb-2 flex items-center gap-2 px-1">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: col.hue }} />
                  <h2 id={`stage-${col.id}`} className="!text-[13px] !font-medium !leading-none" style={{ fontFamily: 'inherit' }}>
                    {col.label}
                  </h2>
                  <span className="ml-auto text-[11px] text-muted-foreground" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                    {cards.length}
                  </span>
                </header>
                <div className="min-h-[120px] space-y-2 rounded-[16px] bg-[#F4EFE5]/70 p-2">
                  {loading && cards.length === 0 && <p className="p-3 text-xs text-muted-foreground">Loading</p>}
                  {!loading && cards.length === 0 && (
                    <p className="p-3 text-[12px] leading-snug text-muted-foreground">{col.hint}. Nobody here right now.</p>
                  )}
                  {cards.map((lead) => (
                    <LeadCard key={lead.key} lead={lead} onOpen={setSelected} onStage={move} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowClosed((v) => !v)}
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        {showClosed ? 'Hide lost and archived' : `Show lost and archived (${closedCount})`}
      </button>

      <WalkInDialog open={walkIn} onOpenChange={setWalkIn} onSaved={() => reload(true)} />

      <LeadDrawer
        open={selected !== null}
        onOpenChange={(v) => { if (!v) setSelected(null); }}
        leadType={selected?.source ?? 'contact'}
        lead={selected?.raw ?? null}
        onUpdated={() => reload(true)}
      />
    </div>
  );
};

export default PipelineBoard;
