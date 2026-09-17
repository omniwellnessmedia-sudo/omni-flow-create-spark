import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { announceLeadsChanged } from '@/lib/leadEvents';
import { planImport, plusDays, toOutreachRow, type CheckedRow } from '@/lib/leadImport';
import type { PipelineLead } from '@/lib/pipeline';

/**
 * Paste a list of businesses, get leads on the board.
 *
 * The preview is the point. It shows every row with what will happen to
 * it before anything is written, because an import that silently drops
 * half a list is worse than one that refuses.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const EXAMPLE = `Business\tContact\tEmail\tPhone\tSector\tNotes
Olympia Cafe & Bakery\t\tinfo@olympiacafe.co.za\t\tCafe\tNo booking link on the site`;

const VerdictDot = ({ row }: { row: CheckedRow }) => (
  <span
    aria-hidden="true"
    className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full"
    style={{ background: row.verdict === 'ok' ? '#4FAE3F' : row.verdict === 'duplicate' ? '#F38020' : '#C0392B' }}
  />
);

const ImportLeadsDialog = ({
  open,
  onOpenChange,
  existing,
  onImported,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing: PipelineLead[];
  onImported?: () => void;
}) => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [campaign, setCampaign] = useState('');
  const [followUp, setFollowUp] = useState(plusDays(3));
  const [saving, setSaving] = useState(false);

  const plan = useMemo(() => (text.trim() ? planImport(text, existing) : null), [text, existing]);

  const save = async () => {
    if (!plan || plan.ok.length === 0) return;
    if (!campaign.trim()) {
      toast({ title: 'Name the list first', description: 'The campaign tag is how you find these again.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const rows = plan.ok.map((r) =>
      toOutreachRow(r, { campaign: campaign.trim(), followUpDue: followUp, ownerId: auth.user?.id ?? null })
    );
    const { data, error } = await supabase.from('outreach_leads').insert(rows).select('id');
    setSaving(false);
    if (error) {
      toast({ title: 'Nothing was imported', description: error.message, variant: 'destructive' });
      return;
    }
    const n = data?.length ?? 0;
    toast({
      title: `${n} ${n === 1 ? 'lead' : 'leads'} on the board`,
      description: plan.duplicates.length
        ? `${plan.duplicates.length} already there, skipped.`
        : 'They are in New, with a follow-up set.',
    });
    setText('');
    setCampaign('');
    onOpenChange(false);
    onImported?.();
    announceLeadsChanged();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import a lead list</DialogTitle>
          <DialogDescription>
            Paste straight from a spreadsheet, or a CSV. A business name is the only thing a row needs.
            Anything already on the board is skipped.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">The list</Label>
              <button
                type="button"
                className="text-[11px] text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => setText(EXAMPLE)}
              >
                Show me the shape
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder={'Business, Contact, Email, Phone, Sector, Notes\nA heading row is optional.'}
              className="mt-1.5 w-full rounded-md border border-input bg-background p-3 text-[12.5px]"
              style={MONO}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Name this list</Label>
              <Input
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="muizenberg-cafes-sep"
                className="mt-1 h-9 text-[13px]"
              />
            </div>
            <div>
              <Label className="text-xs">Follow up on</Label>
              <Input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="mt-1 h-9 text-[13px]" />
            </div>
          </div>

          {plan && (
            <section className="rounded-[12px] border border-border/60">
              <p className="border-b border-border/60 px-3 py-2 text-[12px]" style={MONO}>
                {plan.ok.length} to import, {plan.duplicates.length} already on the board, {plan.problems.length} that cannot be read
              </p>
              <ul className="max-h-[220px] divide-y divide-border/50 overflow-y-auto">
                {plan.rows.map((r) => (
                  <li key={r.line} className="flex items-start gap-2 px-3 py-1.5 text-[12.5px]">
                    <VerdictDot row={r} />
                    <span className={cn('min-w-0 flex-1', r.verdict !== 'ok' && 'text-muted-foreground')}>
                      <span className="font-medium">{r.organisation || `Line ${r.line}`}</span>
                      {r.email && <span className="text-muted-foreground">, {r.email}</span>}
                      {r.reason && <span className="text-muted-foreground"> ({r.reason})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving || !plan || plan.ok.length === 0}>
            {saving ? 'Importing' : plan ? `Import ${plan.ok.length}` : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportLeadsDialog;
