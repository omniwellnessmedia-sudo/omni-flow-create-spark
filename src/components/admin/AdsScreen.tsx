import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, RotateCcw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import { SERVICE_BANDS, getOffer } from '@/data/publicRateCard';
import {
  LIMITS, defaultPlan, draftCopy, landingUrl, normaliseCopy, toCsv, uploadRows, validatePlan,
  type AdPlan, type Problem,
} from '@/lib/ads';

/**
 * Google Ads, from the rate card, in three clicks.
 *
 * Pick an offer. The draft campaign appears at once, built from the
 * offer's own words and inside Google's limits. Press "Improve with AI"
 * and the copy is rewritten for punch, then pulled back inside the limits
 * and the site's rules (no invented prices, no guarantees). Edit anything.
 * Download the upload file and hand it to Google Ads.
 *
 * Why a file and not a button: creating a campaign inside Google Ads from
 * here needs the Google Ads API and a developer token Google grants per
 * manager account after an application. The file is what the account
 * accepts today, under Tools, Bulk actions, Uploads, or through Google Ads
 * Editor. When the token arrives, the same plan posts straight in.
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

const AdsScreen = () => {
  const { toast } = useToast();
  const [slug, setSlug] = useState<string>(SERVICE_BANDS[0].offers[0].slug);
  const [plan, setPlan] = useState<AdPlan>(() => defaultPlan(SERVICE_BANDS[0].offers[0]));
  const [busy, setBusy] = useState(false);
  const [improved, setImproved] = useState(false);

  const problems = useMemo(() => validatePlan(plan), [plan]);
  const setCopy = (patch: Partial<AdPlan['copy']>) => setPlan((p) => ({ ...p, copy: { ...p.copy, ...patch } }));

  const pick = (s: string) => {
    const offer = getOffer(s);
    if (!offer) return;
    setSlug(s);
    setPlan(defaultPlan(offer));
    setImproved(false);
  };

  const improve = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('generate-ad-copy', {
      body: { offer: { slug: plan.offer.slug, name: plan.offer.name, price: plan.offer.price, blurb: plan.offer.blurb, bullets: plan.offer.bullets }, draft: plan.copy },
    });
    setBusy(false);
    if (error || !data || data.error) {
      toast({ title: 'The AI pass did not come back', description: error?.message ?? data?.error ?? 'Try again in a moment.', variant: 'destructive' });
      return;
    }
    const next = normaliseCopy(data, draftCopy(plan.offer));
    setPlan((p) => ({ ...p, copy: { ...next, path1: p.copy.path1, path2: p.copy.path2 } }));
    setImproved(true);
    toast({ title: 'Copy rewritten', description: 'Every line checked against the limits and the terms. Edit anything before you download.' });
  };

  const download = () => {
    if (problems.length) { toast({ title: 'Fix the flagged lines first', variant: 'destructive' }); return; }
    const csv = toCsv(uploadRows(plan));
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-ads-${plan.offer.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        description="Pick an offer, get a Search campaign inside Google's limits, improve the words with AI, download the file Google Ads accepts. Prices come from the rate card and nothing may promise results."
        actions={
          <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" asChild>
            <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-3.5 w-3.5" />Google Ads</a>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-[18px] border border-border/60 bg-card p-4">
            <Label className="text-xs">Offer</Label>
            <select value={slug} onChange={(e) => pick(e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              {SERVICE_BANDS.map((b) => (
                <optgroup key={b.id} label={b.heading}>
                  {b.offers.map((o) => <option key={o.slug} value={o.slug}>{o.name}, {o.price}</option>)}
                </optgroup>
              ))}
            </select>
            <div className="mt-3 space-y-2.5">
              <div><Label className="text-xs">Campaign name</Label><Input value={plan.campaign} onChange={(e) => setPlan((p) => ({ ...p, campaign: e.target.value, finalUrl: landingUrl(p.offer, e.target.value) }))} className="mt-1 h-9 text-[13px]" /></div>
              <div><Label className="text-xs">Daily budget (R)</Label><Input type="number" min={1} value={plan.dailyBudget} onChange={(e) => setPlan((p) => ({ ...p, dailyBudget: Number(e.target.value) }))} className="mt-1 h-9 text-[13px]" /></div>
              <div><Label className="text-xs">Location</Label><Input value={plan.location} onChange={(e) => setPlan((p) => ({ ...p, location: e.target.value }))} className="mt-1 h-9 text-[13px]" /></div>
              <div><Label className="text-xs">Landing page</Label><Input value={plan.finalUrl} onChange={(e) => setPlan((p) => ({ ...p, finalUrl: e.target.value }))} className="mt-1 h-9 text-[12px]" style={MONO} /></div>
            </div>
          </section>

          <section className="rounded-[18px] border border-border/60 bg-card p-4">
            <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Then, in Google Ads</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-[12.5px] leading-snug text-muted-foreground">
              <li>Tools, then Bulk actions, then Uploads. Choose the file.</li>
              <li>Preview, then Apply. The campaign arrives paused.</li>
              <li>Check the location and budget, add the Omni conversion goals, and enable it.</li>
            </ol>
            <p className="mt-2 text-[11px] text-muted-foreground">Google Ads Editor imports the same file under Account, Import.</p>
          </section>
        </aside>

        <section className="space-y-4 rounded-[18px] border border-border/60 bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-9 rounded-full" onClick={improve} disabled={busy}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />{busy ? 'Writing' : improved ? 'Improve again' : 'Improve with AI'}
            </Button>
            <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => { setPlan((p) => ({ ...p, copy: draftCopy(p.offer) })); setImproved(false); }}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />Back to draft
            </Button>
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={copyAll}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy text</Button>
              <Button size="sm" className="h-9 rounded-full" onClick={download} disabled={problems.length > 0}><Download className="mr-1.5 h-3.5 w-3.5" />Download upload file</Button>
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
