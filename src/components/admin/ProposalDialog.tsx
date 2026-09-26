import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ALL_OFFERS, SERVICE_BANDS } from '@/data/publicRateCard';
import { isFromPrice, parseRand, rand, slugFromService, type QuoteLine } from '@/lib/quotes';
import {
  PROPOSAL_ISSUED, THEMES, buildProposal, coverEmail, defaultTitle, themeById, themeForLead, validateProposal,
  type Proposal, type ThemeId,
} from '@/lib/proposals';
import type { PipelineLead } from '@/lib/pipeline';
import { cn } from '@/lib/utils';

/**
 * Build a proposal for one lead in about three minutes.
 *
 * The theme is guessed from what the lead already says and can be changed
 * with one click. Three findings boxes carry the theme's prompts as
 * placeholders, so the person filling them in is answering a question
 * rather than staring at a blank field. The offers are the rate card with
 * the theme's usual pair already ticked. The plan and the money write
 * themselves from the offers.
 *
 * Issuing writes the whole proposal to the lead's activity log, moves the
 * lead to Quoted when it carries a price, and opens the printable document
 * in a new tab. The cover email is one click and one paste.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

interface Draft extends QuoteLine {
  selected: boolean;
}

const linesFor = (lead: PipelineLead | null, theme: ThemeId): Draft[] => {
  const preselect = new Set<string>(themeById(theme).suggested);
  const named = slugFromService(lead?.service);
  if (named) preselect.add(named);
  return ALL_OFFERS.map((o) => ({
    slug: o.slug,
    name: o.name,
    unit: parseRand(o.price) ?? 0,
    qty: 1,
    fromPrice: isFromPrice(o.price),
    selected: preselect.has(o.slug),
  }));
};

const ProposalDialog = ({
  open, onOpenChange, lead, onIssued,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lead: PipelineLead | null;
  onIssued: (proposal: Proposal) => void;
}) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<ThemeId>(() => (lead ? themeForLead(lead) : 'local-business'));
  const [title, setTitle] = useState(() => (lead ? defaultTitle(lead) : ''));
  const [findings, setFindings] = useState<string[]>(['', '', '']);
  const [lines, setLines] = useState<Draft[]>(() => linesFor(lead, theme));
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // A different lead means a different guess at everything.
  useEffect(() => {
    if (!lead || !open) return;
    const t = themeForLead(lead);
    setTheme(t);
    setTitle(defaultTitle(lead));
    setFindings(['', '', '']);
    setLines(linesFor(lead, t));
    setNotes('');
  }, [lead, open]);

  const chooseTheme = (t: ThemeId) => {
    setTheme(t);
    // Re-tick the theme's usual offers, but keep anything the person added.
    const suggested = new Set(themeById(t).suggested);
    setLines((ls) => ls.map((l) => ({ ...l, selected: l.selected || suggested.has(l.slug ?? '') })));
  };

  const chosen = useMemo<QuoteLine[]>(
    () => lines.filter((l) => l.selected).map(({ selected: _s, ...l }) => l),
    [lines]
  );

  const preview = useMemo(
    () => (lead ? buildProposal({ lead, theme, title, findings, lines: chosen, notes }) : null),
    [lead, theme, title, findings, chosen, notes]
  );
  const problems = useMemo(() => (preview ? validateProposal(preview) : []), [preview]);

  if (!lead) return null;

  const current = themeById(theme);
  const update = (slug: string, patch: Partial<Draft>) =>
    setLines((ls) => ls.map((l) => (l.slug === slug ? { ...l, ...patch } : l)));

  const issue = async () => {
    if (!preview || problems.length) {
      toast({ title: problems[0] ?? 'Nothing to issue', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from('lead_activities').insert({
      lead_type: lead.source,
      lead_id: lead.id,
      actor_id: auth.user?.id ?? null,
      action: PROPOSAL_ISSUED,
      payload: JSON.parse(JSON.stringify({ proposal: preview })),
    });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not issue the proposal', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `${preview.number} issued`, description: `${rand(preview.quote.subtotal)}, ${rand(preview.quote.depositDue)} to start` });
    onIssued(preview);
    onOpenChange(false);
  };

  const copyEmail = async () => {
    if (!preview) return;
    const link = `${window.location.origin}/admin/proposal/${preview.leadType}/${preview.leadId}/${preview.number}`;
    const mail = coverEmail(preview, link);
    await navigator.clipboard.writeText(`Subject: ${mail.subject}\n\n${mail.body}`);
    toast({ title: 'Cover email copied', description: 'Paste it into a new message. The link works once the proposal is issued.' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposal for {lead.name}{lead.org && lead.org !== lead.name ? `, ${lead.org}` : ''}</DialogTitle>
          <DialogDescription>
            What we noticed, what we propose, how it runs, what it costs. Prices come from the rate card and cannot be typed in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <fieldset>
            <legend className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Theme</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => chooseTheme(t.id)}
                  aria-pressed={theme === t.id}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors',
                    theme === t.id ? 'border-foreground bg-foreground text-background' : 'border-border/70 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: t.hue }} />
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-2 rounded-[12px] border-l-[3px] bg-[#F4EFE5]/60 p-3 text-[12px] leading-relaxed text-muted-foreground" style={{ borderColor: current.hue }}>
              {current.opening}
            </p>
          </fieldset>

          <div className="space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <fieldset>
            <legend className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>What we noticed</legend>
            <p className="mt-1 text-[11px] text-muted-foreground">Three things, in plain words, that are costing them customers. Say what you saw, not what will happen. Blank ones are left out.</p>
            <div className="mt-2 space-y-2">
              {current.prompts.map((prompt, i) => (
                <Textarea
                  key={i}
                  rows={2}
                  value={findings[i] ?? ''}
                  onChange={(e) => setFindings((f) => f.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={prompt}
                  aria-label={`Finding ${i + 1}`}
                />
              ))}
            </div>
          </fieldset>

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
                          <Input
                            type="number" min={0} value={l.unit} readOnly={!l.fromPrice}
                            onChange={(e) => l.fromPrice && update(o.slug, { unit: Number(e.target.value) })}
                            className={cn('h-8 w-28 text-right text-xs', !l.fromPrice && 'bg-muted text-muted-foreground')}
                            aria-label={`Unit price for ${o.name}`}
                            title={l.fromPrice ? 'A from price. Confirm the figure.' : 'Fixed on the rate card.'}
                          />
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

          <div className="space-y-1.5">
            <Label className="text-xs">Anything agreed already (optional)</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Start date, who the contact is, what was said on the phone" />
          </div>

          {preview && (
            <div className="rounded-[14px] bg-[#F4EFE5]/70 p-4 text-sm">
              <div className="flex items-baseline justify-between"><span className="text-muted-foreground">Investment</span><span className="font-medium" style={MONO}>{rand(preview.quote.subtotal)}</span></div>
              <div className="mt-1 flex items-baseline justify-between"><span className="text-muted-foreground">To start ({preview.quote.depositPercent}%)</span><span style={MONO}>{rand(preview.quote.depositDue)}</span></div>
              {preview.plan.length > 0 && (
                <ol className="mt-3 space-y-1 border-t border-border/50 pt-3 text-[12px]">
                  {preview.plan.map((ph) => (
                    <li key={ph.title} className="flex gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: ph.hue }} />
                      <span><span style={MONO} className="text-[11px] uppercase tracking-[.12em] text-muted-foreground">{ph.when}</span> {ph.title}</span>
                    </li>
                  ))}
                </ol>
              )}
              {problems.length > 0 && (
                <ul className="mt-3 space-y-0.5 border-t border-border/50 pt-3 text-[12px] text-[#C0392B]">
                  {problems.map((p) => <li key={p}>{p}</li>)}
                </ul>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">{preview.number}. Valid fourteen days. The document carries the full inclusions and terms.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="ghost" onClick={copyEmail} disabled={!preview || problems.length > 0}>Copy cover email</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={issue} disabled={saving || !preview || problems.length > 0}>{saving ? 'Issuing' : 'Issue proposal'}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
