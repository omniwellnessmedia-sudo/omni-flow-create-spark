import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Share2, BarChart3, PlayCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminScreenHeader from '@/components/admin/AdminScreenHeader';
import { useMarketing } from '@/hooks/useMarketing';

/**
 * Marketing: what each channel produced, on one screen.
 *
 * The newsletter editor, the social scheduler and the analytics charts all
 * exist and stay where they are. What was missing was the screen that
 * answers the question before any of them: which of the things we do
 * brings in people, and do those people buy. So the top of this page is
 * the channel table, leads and won side by side over a window the reader
 * picks, and the rest is the state of each asset with one click through
 * to work on it.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const WINDOWS = [7, 30, 90] as const;

const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
};

const Panel = ({
  eyebrow, hue, title, children, action,
}: { eyebrow: string; hue: string; title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <section className="flex flex-col rounded-[18px] border border-border/60 bg-card p-4">
    <header className="flex items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" style={MONO}>
          <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full" style={{ background: hue }} />
          {eyebrow}
        </p>
        <h2 className="mt-1 !text-[20px]">{title}</h2>
      </div>
      {action}
    </header>
    <div className="mt-3 flex-1">{children}</div>
  </section>
);

const Big = ({ n, label }: { n: number | string; label: string }) => (
  <div>
    <p className="font-wwpl-display text-[34px] leading-none">{n}</p>
    <p className="mt-1 text-[12px] text-muted-foreground">{label}</p>
  </div>
);

const MarketingScreen = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState<(typeof WINDOWS)[number]>(30);
  const m = useMarketing(days);
  const maxLeads = Math.max(1, ...m.channels.map((c) => c.leads));
  const go = (section: string) => () => navigate(`/admin-dashboard?section=${section}`);

  return (
    <div className="space-y-5">
      <AdminScreenHeader
        eyebrow="Marketing"
        title="Marketing"
        description="Which of the things we do brings people in, and whether they buy. The tools to do more of it are one click away."
        actions={
          <>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={go('newsletter')}><Mail className="mr-1.5 h-3.5 w-3.5" />Newsletter</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={go('social')}><Share2 className="mr-1.5 h-3.5 w-3.5" />Social</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={go('analytics')}><BarChart3 className="mr-1.5 h-3.5 w-3.5" />Analytics</Button>
          </>
        }
        meta={m.loading ? 'Loading' : `Last ${days} days`}
      />

      {m.error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          Some records could not be read: {m.error}. <button className="underline" onClick={() => m.reload()}>Try again</button>
        </p>
      )}

      <Panel
        eyebrow="Where leads came from"
        hue="#E63946"
        title="Channels"
        action={
          <div className="flex gap-1">
            {WINDOWS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setDays(w)}
                className={cn('h-7 rounded-full border px-2.5 text-[11px]', days === w ? 'border-foreground bg-foreground text-background' : 'border-border/70 text-muted-foreground hover:text-foreground')}
              >
                {w}d
              </button>
            ))}
          </div>
        }
      >
        <ul className="space-y-2.5">
          {m.channels.map((c) => (
            <li key={c.id} className="grid grid-cols-[150px_1fr_auto] items-center gap-3 sm:grid-cols-[190px_1fr_auto]">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{c.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">{c.what}</p>
              </div>
              <div className="h-[10px] overflow-hidden rounded-full bg-[#F4EFE5]">
                <div className="h-full rounded-full transition-[width]" style={{ width: `${(c.leads / maxLeads) * 100}%`, background: c.hue }} />
              </div>
              <p className="w-[120px] text-right text-[11px] text-muted-foreground" style={MONO}>
                <span className="text-foreground">{c.leads}</span> lead{c.leads === 1 ? '' : 's'}
                {c.won > 0 ? `, ${c.won} won` : c.quoted > 0 ? `, ${c.quoted} quoted` : ''}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          A lead counts for the channel its record names. A visitor who watched a film and then used the contact form is a contact-form lead, because that is what we can show.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel eyebrow="Lead magnet" hue="#2BB9B9" title="Scorecard" action={<Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" asChild><Link to="/scorecard" target="_blank">Open <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>}>
          <div className="flex flex-wrap gap-8">
            <Big n={m.scorecard.submissions} label={`results sent in ${days} days`} />
            <Big n={m.scorecard.last7} label="in the last 7" />
            <Big n={m.scorecard.averagePercent === null ? '..' : `${m.scorecard.averagePercent}%`} label="average score" />
          </div>
          {Object.keys(m.scorecard.bands).length > 0 && (
            <p className="mt-3 text-[12px] text-muted-foreground">
              {Object.entries(m.scorecard.bands).map(([b, n]) => `${b}: ${n}`).join(', ')}
            </p>
          )}
        </Panel>

        <Panel eyebrow="Owned audience" hue="#5C2A8A" title="Newsletter" action={<Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" onClick={go('newsletter')}>Write one <ArrowRight className="ml-1 h-3 w-3" /></Button>}>
          <div className="flex flex-wrap gap-8">
            <Big n={m.newsletter.subscribers} label="subscribers" />
            <Big n={m.newsletter.newInWindow} label={`new in ${days} days`} />
            <Big n={m.newsletter.scheduled} label="scheduled" />
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            {m.newsletter.lastSend
              ? `Last sent: ${m.newsletter.lastSend.name}, ${when(m.newsletter.lastSend.at)}, to ${m.newsletter.lastSend.sent}${m.newsletter.lastSend.openRate !== null ? `, ${m.newsletter.lastSend.openRate}% opened` : ''}.`
              : 'Nothing sent yet.'}
          </p>
        </Panel>

        <Panel eyebrow="Reach" hue="#F38020" title="Social" action={<Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" onClick={go('social')}>Schedule <ArrowRight className="ml-1 h-3 w-3" /></Button>}>
          <div className="flex flex-wrap gap-8">
            <Big n={m.social.queued} label="queued" />
            <Big n={m.social.postedInWindow} label={`posted in ${days} days`} />
            {m.social.failed > 0 && <Big n={m.social.failed} label="failed" />}
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            {m.social.next ? `Next: ${m.social.next.at}${m.social.next.platforms.length ? ` on ${m.social.next.platforms.join(', ')}` : ''}.` : 'Nothing queued.'}
          </p>
        </Panel>

        <Panel eyebrow="Films" hue="#4FAE3F" title="Watch" action={<Button size="sm" variant="ghost" className="h-8 rounded-full text-xs" asChild><Link to="/watch" target="_blank"><PlayCircle className="mr-1 h-3.5 w-3.5" />Page</Link></Button>}>
          <div className="flex flex-wrap gap-8">
            <Big n={m.watch.publicCount} label="public on the site" />
            <Big n={m.watch.waiting} label="uploaded, waiting to be checked" />
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground">
            {m.watch.publicTitles.length ? m.watch.publicTitles.join(', ') : 'None public yet.'}
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default MarketingScreen;
