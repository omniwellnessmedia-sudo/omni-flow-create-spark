import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, RotateCcw, ExternalLink, Save, Check, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import { SERVICE_BANDS, ALL_OFFERS, getOffer, type RateCardOffer } from '@/data/publicRateCard';
import { useAdCampaigns } from '@/hooks/useAdCampaigns';
import {
  LIMITS, allPlans, draftCopy, landingUrl, normaliseCopy, planFromSaved, toCsv, uploadRows, uploadRowsAll, validatePlan,
  type AdCopy, type AdPlan, type Problem, type SavedCampaign,
} from '@/lib/ads';

/**
 * Google Ads, from the rate card, in a few clicks.
 *
 * Every offer has a campaign. It starts as a draft built from the offer's
 * own words, inside Google's limits. "Improve with AI" rewrites it, then
 * pulls it back inside the limits and the site's rules (no invented
 * prices, no guarantees). Save it and the whole team sees the same copy;
 * approve it and it is marked ready. "Download all campaigns" builds one
 * upload file for the entire rate card from whatever is saved, drafts
 * filling any gap, so the file is always current with the rate card.
 *
 * Why a file and not a button: creating a campaign inside Google Ads from
 * here needs the Google Ads API and a developer token Google grants per
 * manager account after an application. The file is what the account
 * accepts today, under Tools, Bulk actions, Uploads, or through Google Ads
 * Editor. When the token arrives, the same plans post straight in.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const Counter = ({ value, limit }: { value: string; limit: number }) => (
  <span className={cn('shrink-0 text-[10.5px]', value.length > limit ? 'text-[#C0392B]' : 'text-muted-foreground')} style={MONO}>
    {value.length}/{limit}
  </span>
);

const ListEditor = ({
  label, items, limit, max, onChange, problems,
}: { label: string; items: string[]; limit: number; max: number; onChange: (next: string[]) => void; problems: Problem[] }) => (
  <div>
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <span className="text-[10.5px] text-muted-foreground" style={MONO}>{items.length}/{max}</span>
    </div>
    <ul className="mt-1.5 space-y-1.5">
      {items.map((v, i) => {
        const bad = problems.find((p) => p.index === i);
        return (
          <li key={i} className="flex items-center gap-2">
            <Input value={v} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={cn('h-9 text-[13px]', bad && 'border-[#C0392B]')} aria-label={`${label} ${i + 1}`} />
            <Counter value={v} limit={limit} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="h-9 w-9 shrink-0 rounded-md text-muted-foreground hover:bg-muted" aria-label={`Remove ${label} ${i + 1}`}>x</button>
          </li>
        );
      })}
    </ul>
    {items.length < max && (
      <button type="button" onClick={() => onChange([...items, ''])} className="mt-1.5 text-xs text-muted-foreground underline-offset-4 hover:underline">Add one</button>
    )}
  </div>
);

const StatusDot = ({ status }: { status: SavedCampaign['status'] | 'none' }) => (
  <span
    aria-hidden="true"
    className="h-[7px] w-[7px] shrink-0 rounded-full"
    style={{ background: status === 'approved' ? '#4FAE3F' : status === 'draft' ? '#F38020' : '#D9D2C2' }}
  />
);

const statusWord = (status: SavedCampaign['status'] | 'none') =>
  status === 'approved' ? 'Approved' : status === 'draft' ? 'Saved' : 'Draft only';

/** The AI pass for one offer. Throws with a readable message. */
const improveCopy = async (offer: RateCardOffer, draft: AdCopy): Promise<AdCopy> => {
  const { data, error } = await supabase.functions.invoke('generate-ad-copy', {
    body: { offer: { slug: offer.slug, name: offer.name, price: offer.price, blurb: offer.blurb, bullets: offer.bullets }, draft },
  });
  if (error || !data || data.error) throw new Error(error?.message ?? data?.error ?? 'The AI pass did not come back.');
  const next = normaliseCopy(data, draftCopy(offer));
  return { ...next, path1: draft.path1, path2: draft.path2 };
};

const downloadCsv = (name: string, rows: Record<string, string | number>[]) => {
  const blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const AdsScreen = () => {
  const { toast } = useToast();
  const { saved, loading, missingTable, save } = useAdCampaigns();
  const [slug, setSlug] = useState<string>(ALL_OFFERS[0].slug);
  const [plan, setPlan] = useState<AdPlan>(() => planFromSaved(ALL_OFFERS[0], undefined));
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [batch, setBatch] = useState<{ done: number; total: number; current: string } | null>(null);
  const stopBatch = useRef(false);

  // When the saved rows arrive, the offer on screen picks up its saved copy
  // unless the person has already started editing.
  useEffect(() => {
    if (loading || dirty) return;
    const offer = getOffer(slug);
    if (offer) setPlan(planFromSaved(offer, saved[slug]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, saved, slug]);

  const problems = useMemo(() => validatePlan(plan), [plan]);
  const status = saved[slug]?.status ?? 'none';
  const counts = useMemo(() => {
    let approved = 0, drafts = 0;
    for (const o of ALL_OFFERS) {
      const s = saved[o.slug]?.status;
      if (s === 'approved') approved += 1; else if (s === 'draft') drafts += 1;
    }
    return { approved, drafts, untouched: ALL_OFFERS.length - approved - drafts };
  }, [saved]);

  const update = (next: AdPlan | ((p: AdPlan) => AdPlan)) => { setDirty(true); setPlan(next); };
  const setCopy = (patch: Partial<AdCopy>) => update((p) => ({ ...p, copy: { ...p.copy, ...patch } }));

  const pick = (s: string) => {
    const offer = getOffer(s);
    if (!offer) return;
    setSlug(s);
    setPlan(planFromSaved(offer, saved[s]));
    setDirty(false);
  };

  const improve = async () => {
    setBusy(true);
    try {
      const copy = await improveCopy(plan.offer, plan.copy);
      update((p) => ({ ...p, copy }));
      toast({ title: 'Copy rewritten', description: 'Every line checked against the limits and the terms. Edit anything, then save.' });
    } catch (e) {
      toast({ title: 'The AI pass did not come back', description: e instanceof Error ? e.message : 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const persist = async (as: SavedCampaign['status']) => {
    if (problems.length) { toast({ title: 'Fix the flagged lines first', variant: 'destructive' }); return; }
    const { error } = await save(plan, as);
    if (error) { toast({ title: 'Not saved', description: error, variant: 'destructive' }); return; }
    setDirty(false);
    toast({ title: as === 'approved' ? 'Approved' : 'Saved', description: as === 'approved' ? 'This campaign is in the next "Download all".' : 'The team sees this copy now.' });
  };

  const downloadOne = () => {
    if (problems.length) { toast({ title: 'Fix the flagged lines first', variant: 'destructive' }); return; }
    downloadCsv(`google-ads-${plan.offer.slug}.csv`, uploadRows(plan));
  };

  const downloadAll = () => {
    const plans = allPlans(saved).map((p) => (p.offer.slug === slug && dirty ? plan : p));
    const { rows, skipped } = uploadRowsAll(plans);
    if (!rows.length) { toast({ title: 'Nothing to download', variant: 'destructive' }); return; }
    downloadCsv('google-ads-all-campaigns.csv', rows);
    toast({
      title: `${plans.length - skipped.length} campaigns in one file`,
      description: skipped.length ? `Left out for problems: ${skipped.map((p) => p.offer.name).join(', ')}.` : 'Every campaign arrives paused. Upload it under Tools, Bulk actions, Uploads.',
    });
  };

  const writeAll = async () => {
    const todo = ALL_OFFERS.filter((o) => saved[o.slug]?.status !== 'approved');
    if (!todo.length) { toast({ title: 'Every campaign is already approved' }); return; }
    stopBatch.current = false;
    setBatch({ done: 0, total: todo.length, current: todo[0].name });
    let failed = 0;
    for (let i = 0; i < todo.length; i += 1) {
      if (stopBatch.current) break;
      const offer = todo[i];
      setBatch({ done: i, total: todo.length, current: offer.name });
      try {
        const base = planFromSaved(offer, saved[offer.slug]);
        const copy = await improveCopy(offer, base.copy);
        const next = { ...base, copy };
        if (!validatePlan(next).length) {
          const { error } = await save(next, 'draft');
          if (error) throw new Error(error);
          if (offer.slug === slug && !dirty) setPlan(next);
        } else {
          failed += 1;
        }
      } catch (e) {
        failed += 1;
        if (/table is not on the project/.test(e instanceof Error ? e.message : '')) { stopBatch.current = true; }
      }
    }
    setBatch(null);
    toast({
      title: stopBatch.current ? 'Stopped' : 'Done',
      description: failed ? `${todo.length - failed} written and saved as drafts, ${failed} did not come back. Run it again for the rest.` : `${todo.length} campaigns written and saved as drafts. Read them, then approve.`,
      variant: failed ? 'destructive' : undefined,
    });
  };

  const copyAll = async () => {
    const text = [
      `Campaign: ${plan.campaign}`, `Ad group: ${plan.adGroup}`, `Final URL: ${plan.finalUrl}`, '',
      'Headlines:', ...plan.copy.headlines.map((h) => `- ${h}`), '',
      'Descriptions:', ...plan.copy.descriptions.map((d) => `- ${d}`), '',
      'Keywords:', ...plan.copy.keywords.map((k) => `- ${k}`),
    ].join('\n');
    try { await navigator.clipboard.writeText(text); toast({ title: 'Copied' }); } catch { toast({ title: 'Could not copy', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-5">
      <AdminScreenHeader
        eyebrow="Marketing"
        title="Google Ads"
        description="Every offer on the rate card has a Search campaign. Improve the words with AI, save, approve, and download one file Google Ads accepts for all of them. Prices come from the rate card and nothing may promise results."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={writeAll} disabled={!!batch || missingTable}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />{batch ? `Writing ${batch.done + 1} of ${batch.total}` : 'Write all with AI'}
            </Button>
            {batch && (
              <Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" onClick={() => { stopBatch.current = true; }}>Stop</Button>
            )}
            <Button size="sm" className="h-8 rounded-full text-xs" onClick={downloadAll}>
              <Layers className="mr-1.5 h-3.5 w-3.5" />Download all campaigns
            </Button>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" asChild>
              <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-3.5 w-3.5" />Google Ads</a>
            </Button>
          </div>
        }
        meta={
          <span style={MONO} className="text-[11px] text-muted-foreground">
            {counts.approved} approved, {counts.drafts} saved, {counts.untouched} draft only
            {batch ? `. Writing: ${batch.current}` : ''}
          </span>
        }
      />

      {missingTable && (
        <p className="rounded-[12px] border border-[#F38020]/40 bg-[#F38020]/5 p-3 text-[12.5px]">
          Saving is off: the ad_campaigns table is not on the project yet. Run the migration in supabase/migrations/20260914130000_ad_campaigns.sql. Drafts and downloads still work.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-[18px] border border-border/60 bg-card p-3">
            <p className="px-1 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Offers</p>
            <div className="mt-2 max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {SERVICE_BANDS.map((b) => (
                <div key={b.id}>
                  <p className="px-1 text-[11px] text-muted-foreground">{b.heading}</p>
                  <ul className="mt-1">
                    {b.offers.map((o) => {
                      const s = saved[o.slug]?.status ?? 'none';
                      const active = o.slug === slug;
                      return (
                        <li key={o.slug}>
                          <button
                            type="button"
                            onClick={() => pick(o.slug)}
                            className={cn('flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors', active ? 'bg-muted font-medium' : 'hover:bg-muted/50')}
                            title={statusWord(s)}
                          >
                            <StatusDot status={s} />
                            <span className="truncate">{o.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-1 text-[10.5px] text-muted-foreground" style={MONO}>
              <span className="inline-flex items-center gap-1.5"><StatusDot status="approved" />approved</span>
              <span className="inline-flex items-center gap-1.5"><StatusDot status="draft" />saved</span>
              <span className="inline-flex items-center gap-1.5"><StatusDot status="none" />draft only</span>
            </p>
          </section>

          <section className="rounded-[18px] border border-border/60 bg-card p-4">
            <div className="space-y-2.5">
              <div><Label className="text-xs">Campaign name</Label><Input value={plan.campaign} onChange={(e) => update((p) => ({ ...p, campaign: e.target.value, finalUrl: landingUrl(p.offer, e.target.value) }))} className="mt-1 h-9 text-[13px]" /></div>
              <div><Label className="text-xs">Daily budget (R)</Label><Input type="number" min={1} value={plan.dailyBudget} onChange={(e) => update((p) => ({ ...p, dailyBudget: Number(e.target.value) }))} className="mt-1 h-9 text-[13px]" /></div>
              <div><Label className="text-xs">Location</Label><Input value={plan.location} onChange={(e) => update((p) => ({ ...p, location: e.target.value }))} className="mt-1 h-9 text-[13px]" /></div>
              <div><Label className="text-xs">Landing page</Label><Input value={plan.finalUrl} onChange={(e) => update((p) => ({ ...p, finalUrl: e.target.value }))} className="mt-1 h-9 text-[12px]" style={MONO} /></div>
            </div>
          </section>

          <section className="rounded-[18px] border border-border/60 bg-card p-4">
            <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Then, in Google Ads</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12.5px] leading-snug text-muted-foreground">
              <li>Tools, then Bulk actions, then Uploads. Choose the file.</li>
              <li>Preview, then Apply. Every campaign arrives paused.</li>
              <li>Check location and budget, add the Omni conversion goals, and enable the ones you want live.</li>
            </ol>
            <p className="mt-2 text-[11px] text-muted-foreground">Google Ads Editor imports the same file under Account, Import.</p>
          </section>
        </aside>

        <section className="space-y-4 rounded-[18px] border border-border/60 bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-2 flex items-center gap-2">
              <StatusDot status={status} />
              <span className="text-[12px] text-muted-foreground" style={MONO}>
                {statusWord(status)}{dirty ? ', unsaved changes' : ''}
                {saved[slug]?.updated_at ? `, ${new Date(saved[slug]!.updated_at!).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}` : ''}
              </span>
            </div>
            <Button size="sm" className="h-9 rounded-full" onClick={improve} disabled={busy || !!batch}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />{busy ? 'Writing' : 'Improve with AI'}
            </Button>
            <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => update((p) => ({ ...p, copy: draftCopy(p.offer) }))}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />Back to draft
            </Button>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => persist('draft')} disabled={missingTable || problems.length > 0}><Save className="mr-1.5 h-3.5 w-3.5" />Save</Button>
              <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => persist('approved')} disabled={missingTable || problems.length > 0}><Check className="mr-1.5 h-3.5 w-3.5" />Approve</Button>
              <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={copyAll}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy text</Button>
              <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={downloadOne} disabled={problems.length > 0}><Download className="mr-1.5 h-3.5 w-3.5" />This one only</Button>
            </div>
          </div>

          {problems.length > 0 && (
            <ul className="rounded-[12px] border border-[#C0392B]/30 bg-[#C0392B]/5 p-3 text-[12.5px]">
              {problems.map((p, i) => <li key={i}>{p.field}{p.index !== undefined ? ` ${p.index + 1}` : ''}: {p.message}</li>)}
            </ul>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <ListEditor label="Headlines" items={plan.copy.headlines} limit={LIMITS.headline} max={LIMITS.headlinesMax} onChange={(headlines) => setCopy({ headlines })} problems={problems.filter((p) => p.field === 'headlines')} />
            <div className="space-y-5">
              <ListEditor label="Descriptions" items={plan.copy.descriptions} limit={LIMITS.description} max={LIMITS.descriptionsMax} onChange={(descriptions) => setCopy({ descriptions })} problems={problems.filter((p) => p.field === 'descriptions')} />
              <div>
                <Label className="text-xs">Keywords (phrase match)</Label>
                <textarea
                  value={plan.copy.keywords.join('\n')}
                  onChange={(e) => setCopy({ keywords: e.target.value.split('\n').map((k) => k.trim().toLowerCase()).filter(Boolean) })}
                  rows={8}
                  className="mt-1.5 w-full rounded-md border border-input bg-background p-3 text-[13px]"
                  style={MONO}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Path 1</Label><div className="mt-1 flex items-center gap-2"><Input value={plan.copy.path1} onChange={(e) => setCopy({ path1: e.target.value })} className="h-9 text-[13px]" /><Counter value={plan.copy.path1} limit={LIMITS.path} /></div></div>
                <div><Label className="text-xs">Path 2</Label><div className="mt-1 flex items-center gap-2"><Input value={plan.copy.path2} onChange={(e) => setCopy({ path2: e.target.value })} className="h-9 text-[13px]" /><Counter value={plan.copy.path2} limit={LIMITS.path} /></div></div>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] bg-[#F4EFE5]/70 p-4">
            <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Preview</p>
            <p className="mt-2 text-[12px] text-[#1a6b3a]">omniwellnessmedia.co.za/{plan.copy.path1}/{plan.copy.path2}</p>
            <p className="mt-0.5 text-[17px] leading-snug text-[#1a0dab]">{plan.copy.headlines.slice(0, 3).join(' | ')}</p>
            <p className="mt-1 text-[13px] leading-snug text-[#4d5156]">{plan.copy.descriptions.slice(0, 2).join(' ')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdsScreen;
