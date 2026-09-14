import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ALL_OFFERS, SERVICE_BANDS } from '@/data/publicRateCard';
import { buildQuote, isFromPrice, parseRand, rand, slugFromService, QUOTE_ISSUED, type Quote, type QuoteLine } from '@/lib/quotes';
import type { PipelineLead } from '@/lib/pipeline';

/**
 * Build a quotation from the rate card, for one lead.
 *
 * Every offer on the card is a tick box with its published price filled
 * in; a "from" price is flagged so nobody sends a floor as a fixed number
 * without meaning to. A custom line covers anything the card does not
 * name. The deposit is fifty percent because the published terms say so.
 *
 * Issuing writes the whole quote to the lead's activity log and hands it
 * back to the caller, which moves the lead to Quoted and opens the print
 * view.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

interface Draft extends QuoteLine {
  selected: boolean;
}

const QuoteDialog = ({
  open, onOpenChange, lead, onIssued,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lead: PipelineLead | null;
  onIssued: (quote: Quote) => void;
}) => {
  const { toast } = useToast();
  const preselect = slugFromService(lead?.service);
  const [lines, setLines] = useState<Draft[]>(() =>
    ALL_OFFERS.map((o) => ({
      slug: o.slug,
      name: o.name,
      unit: parseRand(o.price) ?? 0,
      qty: 1,
      fromPrice: isFromPrice(o.price),
      selected: o.slug === preselect,
    }))
  );
  const [custom, setCustom] = useState<{ name: string; unit: string }>({ name: '', unit: '' });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const chosen = useMemo<QuoteLine[]>(() => {
    const picked = lines.filter((l) => l.selected).map(({ selected: _s, ...l }) => l);
    const c = custom.name.trim() && Number(custom.unit) > 0
      ? [{ slug: null, name: custom.name.trim(), unit: Number(custom.unit), qty: 1 }]
      : [];
    return [...picked, ...c];
  }, [lines, custom]);

  const preview = useMemo(() => (lead ? buildQuote({ lead, lines: chosen, notes }) : null), [lead, chosen, notes]);

  if (!lead) return null;

  const update = (slug: string, patch: Partial<Draft>) =>
    setLines((ls) => ls.map((l) => (l.slug === slug ? { ...l, ...patch } : l)));

  const issue = async () => {
    if (!preview || preview.lines.length === 0) {
      toast({ title: 'Pick at least one line', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('lead_activities').insert({
      lead_type: lead.source,
      lead_id: lead.id,
      actor_id: auth.user?.id ?? null,
      action: QUOTE_ISSUED,
      payload: JSON.parse(JSON.stringify({ quote: preview })),
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not issue the quote', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `${preview.number} issued`, description: `${rand(preview.subtotal)}, deposit ${rand(preview.depositDue)}` });
    onIssued(preview);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quote for {lead.name}{lead.org && lead.org !== lead.name ? `, ${lead.org}` : ''}</DialogTitle>
          <DialogDescription>
            Published rates, a fifty percent deposit, valid fourteen days. Untick what does not apply; edit a unit price only where the card says "from".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {SERVICE_BANDS.map((band) => (
            <fieldset key={band.id}>
              <legend className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: band.hue }} />
                {band.heading}
              </legend>
              <ul className="mt-1.5 divide-y divide-border/40 rounded-[12px] border border-border/60">
                {band.offers.map((o) => {
                  const l = lines.find((x) => x.slug === o.slug)!;
                  return (
                    <li key={o.slug} className="flex flex-wrap items-center gap-2 px-3 py-2">
                      <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5">
                        <input type="checkbox" checked={l.selected} onChange={(e) => update(o.slug, { selected: e.target.checked })} className="h-4 w-4 accent-[#15201F]" />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px]">{o.name}</span>
                          <span className="block text-[11px] text-muted-foreground">{o.price}{l.fromPrice ? ' (a from price: confirm the figure)' : ''}</span>
                        </span>
                      </label>
                      {l.selected && (
                        <div className="flex items-center gap-1.5">
                          <Input type="number" min={0} value={l.unit} onChange={(e) => update(o.slug, { unit: Number(e.target.value) })} className="h-8 w-28 text-right text-xs" aria-label={`Unit price for ${o.name}`} />
                          <span className="text-[11px] text-muted-foreground">x</span>
                          <Input type="number" min={1} value={l.qty} onChange={(e) => update(o.slug, { qty: Math.max(1, Number(e.target.value)) })} className="h-8 w-14 text-right text-xs" aria-label={`Quantity for ${o.name}`} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}

          <div className="grid gap-2 sm:grid-cols-[1fr_140px]">
            <div className="space-y-1.5">
              <Label className="text-xs">Custom line (optional)</Label>
              <Input value={custom.name} onChange={(e) => setCustom((c) => ({ ...c, name: e.target.value }))} placeholder="Anything the card does not name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rand</Label>
              <Input type="number" min={0} value={custom.unit} onChange={(e) => setCustom((c) => ({ ...c, unit: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Notes on the quote (optional)</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Scope in a sentence, start date, anything agreed on the phone" />
          </div>

          {preview && (
            <div className="rounded-[14px] bg-[#F4EFE5]/70 p-4 text-sm">
              <div className="flex items-baseline justify-between"><span className="text-muted-foreground">Total</span><span className="font-medium" style={MONO}>{rand(preview.subtotal)}</span></div>
              <div className="mt-1 flex items-baseline justify-between"><span className="text-muted-foreground">Deposit due now ({preview.depositPercent}%)</span><span style={MONO}>{rand(preview.depositDue)}</span></div>
              <div className="mt-1 flex items-baseline justify-between"><span className="text-muted-foreground">Balance before handover</span><span style={MONO}>{rand(preview.balanceDue)}</span></div>
              <p className="mt-2 text-[11px] text-muted-foreground">{preview.number}. Valid fourteen days. VAT treatment confirmed on quotation, as the terms say.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={issue} disabled={saving || !preview || preview.lines.length === 0}>{saving ? 'Issuing' : 'Issue quote'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
