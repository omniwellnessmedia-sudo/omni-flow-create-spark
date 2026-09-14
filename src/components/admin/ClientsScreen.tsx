import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Search, Mail, Phone, ArrowRight, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import LeadDrawer from '@/components/admin/LeadDrawer';
import { useClients } from '@/hooks/useClients';
import { searchClients, type Client, type TimelineKind } from '@/lib/clients';
import { ageLabel, stageDef, type PipelineLead } from '@/lib/pipeline';

/**
 * Clients: one card per person or business, with everything the site knows.
 *
 * The list answers "who have we dealt with, and where did it get to". The
 * card answers "what happened, in order": every enquiry, walk-in, note,
 * stage change, email, order and booking on one timeline, newest first,
 * with the person's contact details at the top and the latest lead one
 * click away for editing.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const KIND_HUE: Record<TimelineKind, string> = {
  lead: '#2BB9B9', walk_in: '#F38020', note: '#5A6A68', status: '#5C2A8A', email: '#2C6FB5',
  edit: '#8A9A96', order: '#4FAE3F', booking: '#4FAE3F', subscribed: '#F5C518',
};

const rand = (n: number) => `R${Math.round(n).toLocaleString('en-ZA')}`;

const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ClientCard = ({
  client, open, onOpenChange, onEditLead, onChanged,
}: {
  client: Client | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEditLead: (lead: PipelineLead) => void;
  onChanged: () => void;
}) => {
  const { toast } = useToast();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  if (!client) return null;

  const latest = client.leads[0] ?? null;
  const stage = stageDef(client.stage);

  const addNote = async () => {
    if (!note.trim()) return;
    if (!latest) { toast({ title: 'No lead to attach the note to', variant: 'destructive' }); return; }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('lead_activities').insert({
      lead_type: latest.source, lead_id: latest.id, actor_id: auth.user?.id ?? null, action: 'note', payload: { text: note.trim() },
    });
    setSaving(false);
    if (error) { toast({ title: 'Could not save the note', description: error.message, variant: 'destructive' }); return; }
    setNote('');
    toast({ title: 'Note added' });
    onChanged();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="text-left">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
            <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: stage.hue }} />
            {stage.label}
            {client.value > 0 && <span className="ml-2 normal-case tracking-normal">{rand(client.value)} to date</span>}
          </p>
          <SheetTitle className="font-wwpl-display !text-[28px] leading-tight">{client.name}</SheetTitle>
          <SheetDescription>
            {client.org && client.org !== client.name ? `${client.org}. ` : ''}
            First seen {when(client.firstSeen)}, last touched {when(client.lastTouch)}.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-wrap gap-2">
          {client.emails.map((e) => (
            <a key={e} href={`mailto:${e}`} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border/70 px-3 text-xs hover:bg-muted">
              <Mail className="h-3.5 w-3.5" />{e}
            </a>
          ))}
          {client.phones.map((p) => (
            <a key={p} href={`tel:${p.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border/70 px-3 text-xs hover:bg-muted">
              <Phone className="h-3.5 w-3.5" />{p}
            </a>
          ))}
          {client.subscribed && (
            <span className="inline-flex min-h-[36px] items-center rounded-full bg-[#F4EFE5] px-3 text-xs">Newsletter</span>
          )}
        </div>

        {latest && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-[14px] border border-border/60 bg-[#F4EFE5]/60 p-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground" style={MONO}>Latest lead</p>
              <p className="truncate text-sm">{latest.service ?? 'No service named'}</p>
              <p className="text-[11px] text-muted-foreground">{ageLabel(latest.createdAt)} ago, {stageDef(latest.stage).label.toLowerCase()}</p>
            </div>
            <Button size="sm" variant="outline" className="h-8 shrink-0 rounded-full text-xs" onClick={() => onEditLead(latest)}>
              Open <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}

        <div className="mt-5">
          <div className="flex gap-2">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note to their timeline" onKeyDown={(e) => { if (e.key === 'Enter') addNote(); }} />
            <Button size="sm" className="h-10 rounded-full px-4" onClick={addNote} disabled={saving || !latest}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <ol className="mt-5 space-y-3">
          {client.timeline.map((ev, i) => (
            <li key={`${ev.at}-${i}`} className="flex gap-3">
              <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 rounded-full" style={{ background: KIND_HUE[ev.kind] }} />
              <div className="min-w-0 flex-1 border-b border-border/40 pb-3">
                <p className="text-[13px] leading-snug">{ev.text}</p>
                <p className="mt-0.5 text-[10.5px] text-muted-foreground" style={MONO}>
                  {when(ev.at)}{ev.amount ? ` / ${rand(ev.amount)}` : ''}
                </p>
              </div>
            </li>
          ))}
          {client.timeline.length === 0 && <li className="text-sm text-muted-foreground">Nothing on the timeline yet.</li>}
        </ol>
      </SheetContent>
    </Sheet>
  );
};

type SortKey = 'recent' | 'value' | 'stage';

const ClientsScreen = () => {
  const { clients, loading, error, reload } = useClients();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editLead, setEditLead] = useState<PipelineLead | null>(null);

  const rows = useMemo(() => {
    const found = searchClients(clients, search);
    const rank: Record<string, number> = { won: 6, quoted: 5, findings: 4, talking: 3, new: 2, lost: 1, archived: 0 };
    if (sort === 'value') return [...found].sort((a, b) => b.value - a.value);
    if (sort === 'stage') return [...found].sort((a, b) => rank[b.stage] - rank[a.stage]);
    return found;
  }, [clients, search, sort]);

  const selected = clients.find((c) => c.key === selectedKey) ?? null;

  return (
    <div className="space-y-5">
      <AdminScreenHeader
        eyebrow="Clients and partners"
        title="Clients"
        description="One card per person or business: every enquiry, walk-in, note, quote, order and booking on a single timeline."
        meta={loading ? 'Loading' : `${clients.length} on record`}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, business, email, phone, service" className="pl-8" />
        </div>
        <div className="flex gap-1.5">
          {([['recent', 'Recent'], ['stage', 'Closest to buying'], ['value', 'Value']] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSort(k)}
              className={cn('h-8 rounded-full border px-3 text-xs transition-colors', sort === k ? 'border-foreground bg-foreground text-background' : 'border-border/70 text-muted-foreground hover:text-foreground')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          Some records could not be read: {error}. <button className="underline" onClick={() => reload()}>Try again</button>
        </p>
      )}

      <ul className="overflow-hidden rounded-[18px] border border-border/60 bg-card">
        {!loading && rows.length === 0 && (
          <li className="p-6 text-sm text-muted-foreground">Nobody matches. Clients appear here from the first enquiry, walk-in or order.</li>
        )}
        {rows.map((c) => {
          const s = stageDef(c.stage);
          return (
            <li key={c.key} className="border-b border-border/40 last:border-b-0">
              <button
                type="button"
                onClick={() => setSelectedKey(c.key)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F4EFE5]/60"
              >
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.hue }} title={s.label} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium leading-tight">{c.name}{c.org && c.org !== c.name ? <span className="font-normal text-muted-foreground"> / {c.org}</span> : null}</p>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                    {c.leads.length} lead{c.leads.length === 1 ? '' : 's'}
                    {c.orders.length ? `, ${c.orders.length} order${c.orders.length === 1 ? '' : 's'}` : ''}
                    {c.bookings.length ? `, ${c.bookings.length} booking${c.bookings.length === 1 ? '' : 's'}` : ''}
                    {c.leads[0]?.service ? ` / ${c.leads[0].service}` : ''}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px]" style={MONO}>{s.label}</p>
                  <p className="text-[10.5px] text-muted-foreground" style={MONO}>
                    {c.value > 0 ? rand(c.value) : when(c.lastTouch)}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          );
        })}
      </ul>

      <ClientCard
        client={selected}
        open={selected !== null}
        onOpenChange={(v) => { if (!v) setSelectedKey(null); }}
        onEditLead={setEditLead}
        onChanged={reload}
      />
      <LeadDrawer
        open={editLead !== null}
        onOpenChange={(v) => { if (!v) setEditLead(null); }}
        leadType={editLead?.source ?? 'contact'}
        lead={editLead?.raw ?? null}
        onUpdated={reload}
      />
    </div>
  );
};

export default ClientsScreen;
