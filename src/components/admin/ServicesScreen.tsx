import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Check, RotateCcw, ExternalLink, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import { SERVICE_BANDS, getOffer } from '@/data/publicRateCard';
import { useServiceContentAdmin } from '@/hooks/useServiceContent';
import {
  BLURB_MAX, BULLETS_MAX, BULLET_MAX, merge, offersMissingInclusions, validate,
} from '@/lib/serviceContent';

/**
 * What each service says it includes, editable by the team.
 *
 * Five offers carry a price and no inclusions, so a buyer sees a number
 * and cannot tell what arrives for it. This screen opens on exactly those
 * and lets the person who knows the answer write it, which until now
 * meant a code change and a deploy.
 *
 * PRICE IS READ ONLY HERE, on purpose. It is the most consequential
 * string on the site and the repository keeps it in one file. The field
 * is shown so an editor can see what they are describing, with a line
 * saying a change to it needs a developer.
 *
 * DRAFT UNTIL PUBLISHED. Saving keeps a draft the site never renders.
 * Publish puts it live. Back to the rate card unpublishes, so the code
 * copy returns, which is the undo for anything that reads badly.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const Counter = ({ value, limit }: { value: string; limit: number }) => (
  <span className={cn('shrink-0 text-[10.5px]', value.length > limit ? 'text-[#C0392B]' : 'text-muted-foreground')} style={MONO}>
    {value.length}/{limit}
  </span>
);

const StatusDot = ({ status }: { status: 'published' | 'draft' | 'code' }) => (
  <span
    aria-hidden="true"
    className="h-[7px] w-[7px] shrink-0 rounded-full"
    style={{ background: status === 'published' ? '#4FAE3F' : status === 'draft' ? '#F38020' : '#D9D2C2' }}
  />
);

const ServicesScreen = () => {
  const { toast } = useToast();
  const { rows, loading, missingTable, save } = useServiceContentAdmin();

  const missing = useMemo(() => offersMissingInclusions(rows), [rows]);
  const [slug, setSlug] = useState<string>(SERVICE_BANDS[0].offers[0].slug);
  const [blurb, setBlurb] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const offer = getOffer(slug);
  const row = rows[slug];
  const effective = offer ? merge(offer, row) : undefined;

  // Open on the first offer that a buyer cannot evaluate, once the rows
  // have loaded. That is the work this screen exists for.
  useEffect(() => {
    if (loading || dirty) return;
    if (missing.length && !missing.some((m) => m.slug === slug) && !row) setSlug(missing[0].slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Load the editor from whatever exists: the draft if there is one, the
  // rate card otherwise.
  useEffect(() => {
    if (dirty) return;
    setBlurb(row?.blurb ?? offer?.blurb ?? '');
    setBullets(row?.bullets ?? offer?.bullets ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, loading, rows]);

  const problems = useMemo(() => validate({ blurb, bullets }), [blurb, bullets]);
  const status: 'published' | 'draft' | 'code' = row?.status === 'published' ? 'published' : row ? 'draft' : 'code';

  const pick = (s: string) => {
    setSlug(s);
    setDirty(false);
  };

  const persist = async (as: 'draft' | 'published') => {
    if (problems.length) {
      toast({ title: 'Fix the flagged lines first', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await save(slug, { blurb, bullets }, as);
    setSaving(false);
    if (error) {
      toast({ title: 'Not saved', description: error, variant: 'destructive' });
      return;
    }
    setDirty(false);
    toast({
      title: as === 'published' ? 'Live on the site' : 'Saved as a draft',
      description: as === 'published' ? 'The offer page shows this now.' : 'The site still shows the rate card copy.',
    });
  };

  const backToCode = async () => {
    if (!offer) return;
    setSaving(true);
    const { error } = await save(slug, { blurb: offer.blurb, bullets: [...offer.bullets] }, 'draft');
    setSaving(false);
    if (error) {
      toast({ title: 'Not changed', description: error, variant: 'destructive' });
      return;
    }
    setBlurb(offer.blurb);
    setBullets([...offer.bullets]);
    setDirty(false);
    toast({ title: 'Back to the rate card', description: 'The site shows the original copy again.' });
  };

  return (
    <div className="space-y-5">
      <AdminScreenHeader
        eyebrow="Clients and partners"
        title="Services"
        description="What each service says it includes. Write it here and it reaches the offer page without a deploy. Prices are not editable here and stay in the rate card."
        actions={
          offer && (
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" asChild>
              <a href={`/services/${offer.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />View the page
              </a>
            </Button>
          )
        }
        meta={
          <span style={MONO} className="text-[11px] text-muted-foreground">
            {missing.length
              ? `${missing.length} ${missing.length === 1 ? 'offer has' : 'offers have'} a price and no inclusions`
              : 'Every offer lists what it includes'}
          </span>
        }
      />

      {missingTable && (
        <p className="rounded-[12px] border border-[#F38020]/40 bg-[#F38020]/5 p-3 text-[12.5px]">
          Saving is off: the service_content table is not on the project yet. Run the migration in
          supabase/migrations/20260924120000_service_content.sql. The site keeps showing the rate card copy.
        </p>
      )}

      {missing.length > 0 && (
        <section className="rounded-[14px] border border-border/60 bg-card p-4">
          <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Start here</p>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            A buyer reading these sees a price and no list of what arrives for it.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {missing.map((o) => (
              <button
                key={o.slug}
                type="button"
                onClick={() => pick(o.slug)}
                className={cn(
                  'h-8 rounded-full border px-3 text-xs transition-colors',
                  o.slug === slug ? 'border-foreground bg-foreground text-background' : 'border-border/70 hover:text-foreground'
                )}
              >
                {o.name}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[18px] border border-border/60 bg-card p-3">
          <p className="px-1 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>Offers</p>
          <div className="mt-2 max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {SERVICE_BANDS.map((b) => (
              <div key={b.id}>
                <p className="px-1 text-[11px] text-muted-foreground">{b.heading}</p>
                <ul className="mt-1">
                  {b.offers.map((o) => {
                    const r = rows[o.slug];
                    const s = r?.status === 'published' ? 'published' : r ? 'draft' : 'code';
                    const merged = merge(o, r);
                    const bare = !merged.bullets || merged.bullets.length === 0;
                    return (
                      <li key={o.slug}>
                        <button
                          type="button"
                          onClick={() => pick(o.slug)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors',
                            o.slug === slug ? 'bg-muted font-medium' : 'hover:bg-muted/50'
                          )}
                        >
                          <StatusDot status={s} />
                          <span className="truncate">{o.name}</span>
                          {bare && <span className="ml-auto shrink-0 text-[10px] text-[#C0392B]" style={MONO}>no list</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-1 text-[10.5px] text-muted-foreground" style={MONO}>
            <span className="inline-flex items-center gap-1.5"><StatusDot status="published" />live</span>
            <span className="inline-flex items-center gap-1.5"><StatusDot status="draft" />draft</span>
            <span className="inline-flex items-center gap-1.5"><StatusDot status="code" />rate card</span>
          </p>
        </aside>

        {offer && (
          <section className="space-y-4 rounded-[18px] border border-border/60 bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-2 flex items-center gap-2">
                <StatusDot status={status} />
                <span className="text-[12px] text-muted-foreground" style={MONO}>
                  {status === 'published' ? 'Live' : status === 'draft' ? 'Draft, not on the site' : 'Showing the rate card'}
                  {dirty ? ', unsaved' : ''}
                </span>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={backToCode} disabled={saving || missingTable}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />Back to the rate card
                </Button>
                <Button size="sm" variant="outline" className="h-9 rounded-full" onClick={() => persist('draft')} disabled={saving || missingTable || problems.length > 0}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />Save draft
                </Button>
                <Button size="sm" className="h-9 rounded-full" onClick={() => persist('published')} disabled={saving || missingTable || problems.length > 0}>
                  <Check className="mr-1.5 h-3.5 w-3.5" />Publish
                </Button>
              </div>
            </div>

            <div className="rounded-[12px] bg-muted/50 p-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-wwpl-display text-[20px]">{offer.name}</h2>
                <span className="text-[13px]" style={MONO}>{offer.price}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Price is set in the rate card and needs a developer to change
                </span>
              </div>
            </div>

            {problems.length > 0 && (
              <ul className="rounded-[12px] border border-[#C0392B]/30 bg-[#C0392B]/5 p-3 text-[12.5px]">
                {problems.map((p, i) => (
                  <li key={i}>{p.field}{p.index !== undefined ? ` ${p.index + 1}` : ''}: {p.message}</li>
                ))}
              </ul>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">What it is, in a sentence or two</Label>
                <Counter value={blurb} limit={BLURB_MAX} />
              </div>
              <textarea
                value={blurb}
                onChange={(e) => { setDirty(true); setBlurb(e.target.value); }}
                rows={3}
                className="mt-1.5 w-full rounded-md border border-input bg-background p-3 text-[13px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">What is included</Label>
                <span className="text-[10.5px] text-muted-foreground" style={MONO}>{bullets.length}/{BULLETS_MAX}</span>
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground">
                One line each, in the words a buyer would use. Only what Omni actually delivers for this price.
              </p>
              <ul className="mt-1.5 space-y-1.5">
                {bullets.map((v, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Input
                      value={v}
                      onChange={(e) => { setDirty(true); setBullets(bullets.map((x, j) => (j === i ? e.target.value : x))); }}
                      className={cn('h-9 text-[13px]', problems.some((p) => p.index === i) && 'border-[#C0392B]')}
                      aria-label={`Inclusion ${i + 1}`}
                    />
                    <Counter value={v} limit={BULLET_MAX} />
                    <button
                      type="button"
                      onClick={() => { setDirty(true); setBullets(bullets.filter((_, j) => j !== i)); }}
                      className="h-9 w-9 shrink-0 rounded-md text-muted-foreground hover:bg-muted"
                      aria-label={`Remove inclusion ${i + 1}`}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
              {bullets.length < BULLETS_MAX && (
                <button
                  type="button"
                  onClick={() => { setDirty(true); setBullets([...bullets, '']); }}
                  className="mt-1.5 text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Add an inclusion
                </button>
              )}
            </div>

            <div className="rounded-[14px] bg-[#F4EFE5]/70 p-4">
              <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
                How the offer page will read
              </p>
              <h3 className="mt-2 font-wwpl-display text-[19px]">{offer.name}</h3>
              <p className="text-[13px]" style={MONO}>{offer.price}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed">{blurb || effective?.blurb}</p>
              <ul className="mt-2 space-y-1 text-[13px]">
                {(bullets.filter(Boolean).length ? bullets.filter(Boolean) : effective?.bullets ?? []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ServicesScreen;
