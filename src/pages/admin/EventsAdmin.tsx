import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, AlertTriangle, Check, Eye, EyeOff, Inbox } from 'lucide-react';
import { LISTING_TIERS } from '@/config/eventPricing';
import { kindLabel, kindHue } from '@/lib/events';

/**
 * Where the team creates events and reviews what the public submitted.
 *
 * TWO RULES THIS SCREEN ENFORCES, BOTH DELIBERATE FRICTION.
 *
 * 1. Nothing publishes without a person ticking "I have checked this". The
 *    database refuses to publish an unverified row, so this is not a
 *    convention that can be forgotten. It exists because the calendar this
 *    replaces carried six invented events, one of which described an activity
 *    run with a real foundation that never happened.
 *
 * 2. A public submission is not a listing. Approving one creates an event
 *    that still has to be checked and published separately. Two steps, on
 *    purpose, because the person who submitted has an interest in it going
 *    live and we are the ones vouching for it.
 *
 * Every change here is appended to event_revisions by a database trigger. That
 * history cannot be edited or deleted by anyone, including whoever made the
 * change, so "who published this and when" always has an answer.
 *
 * No em dashes in this file.
 */

const HUE = '#2C6FB5';

const KINDS = [
  'screening', 'workshop', 'retreat', 'community',
  'tour', 'wellness', 'cleanup', 'drive', 'volunteer', 'other',
];

interface EventRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  kind: string;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  status: string;
  verified_at: string | null;
  is_free: boolean;
  price_from_zar: number | null;
  booking_mode: string;
  external_booking_url: string | null;
  listing_tier: string;
  featured_until: string | null;
  organiser_name: string | null;
  source: string;
}

interface SubmissionRow {
  id: string;
  title: string;
  summary: string | null;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  external_booking_url: string | null;
  price_from_zar: number | null;
  is_free: boolean;
  organiser_name: string;
  organiser_email: string;
  organiser_phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

const emptyDraft = {
  slug: '', title: '', summary: '', kind: 'workshop', venue: '', city: 'Cape Town',
  event_date: '', is_free: false, price_from_zar: '', booking_mode: 'none',
  external_booking_url: '', organiser_name: '', listing_tier: 'standard', featured_until: '',
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const EventsAdmin = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<string[]>([]);
  const [tab, setTab] = useState<'events' | 'submissions'>('events');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const failures: string[] = [];
    const db = supabase as any;

    const ev = await db
      .from('events')
      .select('id,slug,title,summary,kind,venue,city,event_date,status,verified_at,is_free,price_from_zar,booking_mode,external_booking_url,listing_tier,featured_until,organiser_name,source')
      .order('event_date', { ascending: false, nullsFirst: false })
      .limit(200);
    if (ev.error) failures.push(`Events: ${ev.error.message}`);
    else setEvents((ev.data ?? []) as EventRow[]);

    const sub = await db
      .from('event_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100);
    if (sub.error) failures.push(`Submissions: ${sub.error.message}`);
    else setSubmissions((sub.data ?? []) as SubmissionRow[]);

    setProblems(failures);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createEvent = async () => {
    if (!draft.title.trim()) {
      toast({ title: 'Give the event a name', variant: 'destructive' });
      return;
    }
    if (draft.booking_mode === 'external' && !draft.external_booking_url.trim()) {
      toast({
        title: 'A booking link is required',
        description: 'Events booked elsewhere need somewhere to send people.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    const price = draft.price_from_zar.trim() ? Number(draft.price_from_zar) : null;
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await (supabase as any).from('events').insert({
      slug: draft.slug.trim() || slugify(draft.title),
      title: draft.title.trim(),
      summary: draft.summary.trim() || null,
      kind: draft.kind,
      venue: draft.venue.trim() || null,
      city: draft.city.trim() || null,
      event_date: draft.event_date || null,
      is_free: draft.is_free,
      price_from_zar: price !== null && Number.isFinite(price) ? price : null,
      booking_mode: draft.booking_mode,
      external_booking_url: draft.external_booking_url.trim() || null,
      organiser_name: draft.organiser_name.trim() || null,
      listing_tier: draft.listing_tier,
      featured_until: draft.featured_until || null,
      // Saved as a draft. Publishing is a separate, deliberate act.
      status: 'draft',
      // The tick is recorded at the moment it is given, with who gave it.
      verified_at: checked ? new Date().toISOString() : null,
      verified_by: checked ? userData?.user?.id ?? null : null,
      source: 'own',
    });
    setSaving(false);

    if (error) {
      toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Saved as a draft' });
    setOpen(false);
    setDraft({ ...emptyDraft });
    setChecked(false);
    load();
  };

  const setStatus = async (row: EventRow, status: 'published' | 'draft' | 'archived') => {
    // The database refuses to publish an unverified event. Say why here rather
    // than letting the constraint surface as a raw error.
    if (status === 'published' && !row.verified_at) {
      toast({
        title: 'Check it first',
        description:
          'An event cannot be published until someone has confirmed the details are real and correct. Open it and tick the check.',
        variant: 'destructive',
      });
      return;
    }
    setBusyId(row.id);
    const { error } = await (supabase as any).from('events').update({ status }).eq('id', row.id);
    setBusyId(null);
    if (error) {
      toast({ title: 'Could not update', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: status === 'published' ? 'Now live on the calendar' : `Moved to ${status}` });
    load();
  };

  const verify = async (row: EventRow) => {
    setBusyId(row.id);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await (supabase as any)
      .from('events')
      .update({ verified_at: new Date().toISOString(), verified_by: userData?.user?.id ?? null })
      .eq('id', row.id);
    setBusyId(null);
    if (error) {
      toast({ title: 'Could not update', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Marked as checked' });
    load();
  };

  const reviewSubmission = async (s: SubmissionRow, approve: boolean) => {
    setBusyId(s.id);
    const db = supabase as any;
    const { data: userData } = await supabase.auth.getUser();

    if (!approve) {
      const { error } = await db
        .from('event_submissions')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: userData?.user?.id ?? null })
        .eq('id', s.id);
      setBusyId(null);
      if (error) toast({ title: 'Could not update', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Submission declined' }); load(); }
      return;
    }

    // Approving creates a DRAFT event, deliberately unverified. Someone still
    // has to check it and publish it. The submitter's word is not our word.
    const { data: created, error } = await db
      .from('events')
      .insert({
        slug: `${slugify(s.title)}-${s.id.slice(0, 6)}`,
        title: s.title,
        summary: s.summary,
        venue: s.venue,
        city: s.city,
        event_date: s.event_date,
        is_free: s.is_free,
        price_from_zar: s.price_from_zar,
        external_booking_url: s.external_booking_url,
        booking_mode: s.external_booking_url ? 'external' : 'enquiry',
        organiser_name: s.organiser_name,
        organiser_email: s.organiser_email,
        source: 'submitted',
        status: 'draft',
        kind: 'community',
      })
      .select('id')
      .single();

    if (error) {
      setBusyId(null);
      toast({ title: 'Could not create the event', description: error.message, variant: 'destructive' });
      return;
    }

    const { error: upErr } = await db
      .from('event_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: userData?.user?.id ?? null,
        promoted_event_id: created?.id ?? null,
      })
      .eq('id', s.id);
    setBusyId(null);

    if (upErr) toast({ title: 'Event created but the submission did not update', description: upErr.message, variant: 'destructive' });
    else toast({ title: 'Created as a draft', description: 'Check the details, then publish it.' });
    load();
  };

  const liveCount = events.filter((e) => e.status === 'published').length;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <p
        className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
        style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      >
        <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: HUE }} />
        Events
      </p>
      <h1 className="mt-1 font-wwpl-display text-3xl font-medium">The events calendar</h1>
      <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
        Nothing appears on the public calendar until someone here has confirmed it is real
        and published it. Every change is recorded permanently against your name.
      </p>

      {problems.length > 0 && (
        <Card className="mt-5 border-amber-200 bg-amber-50/60">
          <CardContent className="py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-900">
              <AlertTriangle className="h-4 w-4" /> Some of this page could not load
            </p>
            {problems.map((p) => (
              <p key={p} className="mt-1 text-xs text-amber-900" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                {p}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border p-1">
          <button
            onClick={() => setTab('events')}
            className={`rounded-full px-4 py-1.5 text-sm ${tab === 'events' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
          >
            Events ({liveCount} live)
          </button>
          <button
            onClick={() => setTab('submissions')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm ${tab === 'submissions' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
          >
            <Inbox className="h-3.5 w-3.5" />
            Submitted ({submissions.length})
          </button>
        </div>
        <Button onClick={() => setOpen(true)} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" /> Add an event
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : tab === 'events' ? (
        events.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            No events yet. Add the first one.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {events.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex flex-wrap items-start justify-between gap-4 py-5">
                  <div className="min-w-[260px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] uppercase tracking-[.12em]"
                        style={{ background: `${kindHue(e.kind)}1A`, color: kindHue(e.kind), fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                      >
                        {kindLabel(e.kind)}
                      </span>
                      <Badge variant={e.status === 'published' ? 'default' : 'secondary'}>{e.status}</Badge>
                      {e.verified_at ? (
                        <Badge variant="outline" className="gap-1">
                          <Check className="h-3 w-3" /> checked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-amber-300 text-amber-800">
                          <AlertTriangle className="h-3 w-3" /> not checked
                        </Badge>
                      )}
                      {e.source !== 'own' && <Badge variant="outline">{e.source}</Badge>}
                      {e.listing_tier !== 'standard' && <Badge variant="outline">{e.listing_tier}</Badge>}
                    </div>
                    <p className="mt-2 text-[15px] font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {[e.event_date, e.venue, e.city].filter(Boolean).join(' · ') || 'No date set'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!e.verified_at && (
                      <Button size="sm" variant="outline" disabled={busyId === e.id} onClick={() => verify(e)}>
                        <Check className="mr-1.5 h-3.5 w-3.5" /> I have checked this
                      </Button>
                    )}
                    {e.status === 'published' ? (
                      <Button size="sm" variant="outline" disabled={busyId === e.id} onClick={() => setStatus(e, 'draft')}>
                        <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Take down
                      </Button>
                    ) : (
                      <Button size="sm" disabled={busyId === e.id} onClick={() => setStatus(e, 'published')}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Publish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : submissions.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Nothing waiting for review.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {submissions.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-5">
                <p className="text-[15px] font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[s.event_date, s.venue, s.city].filter(Boolean).join(' · ') || 'No date given'}
                </p>
                {s.summary && <p className="mt-2 max-w-[70ch] text-sm">{s.summary}</p>}
                <p className="mt-3 text-sm text-muted-foreground">
                  From {s.organiser_name}, {s.organiser_email}
                  {s.organiser_phone ? `, ${s.organiser_phone}` : ''}
                </p>
                {s.notes && <p className="mt-2 text-sm text-muted-foreground">Note: {s.notes}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" disabled={busyId === s.id} onClick={() => reviewSubmission(s, true)}>
                    Accept as a draft
                  </Button>
                  <Button size="sm" variant="outline" disabled={busyId === s.id} onClick={() => reviewSubmission(s, false)}>
                    Decline
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Accepting creates a draft. It still has to be checked and published before
                  anyone sees it.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add an event</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input className="mt-1.5" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <Label>What is it</Label>
              <Textarea className="mt-1.5" rows={3} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kind</Label>
                <select
                  className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={draft.kind}
                  onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                >
                  {KINDS.map((k) => <option key={k} value={k}>{kindLabel(k)}</option>)}
                </select>
              </div>
              <div>
                <Label>Date</Label>
                <Input className="mt-1.5" type="date" value={draft.event_date} onChange={(e) => setDraft({ ...draft, event_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Venue</Label>
                <Input className="mt-1.5" value={draft.venue} onChange={(e) => setDraft({ ...draft, venue: e.target.value })} />
              </div>
              <div>
                <Label>Town or city</Label>
                <Input className="mt-1.5" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price from, in rand</Label>
                <Input
                  className="mt-1.5"
                  inputMode="decimal"
                  disabled={draft.is_free}
                  value={draft.price_from_zar}
                  onChange={(e) => setDraft({ ...draft, price_from_zar: e.target.value })}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={draft.is_free} onCheckedChange={(v) => setDraft({ ...draft, is_free: Boolean(v) })} />
                  Free event
                </label>
              </div>
            </div>
            <div>
              <Label>How people book</Label>
              <select
                className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={draft.booking_mode}
                onChange={(e) => setDraft({ ...draft, booking_mode: e.target.value })}
              >
                <option value="none">Information only</option>
                <option value="enquiry">They contact us</option>
                <option value="external">On the organiser's own site</option>
                <option value="internal">Through us</option>
              </select>
            </div>
            {draft.booking_mode === 'external' && (
              <div>
                <Label>Booking link</Label>
                <Input
                  className="mt-1.5"
                  type="url"
                  placeholder="https://"
                  value={draft.external_booking_url}
                  onChange={(e) => setDraft({ ...draft, external_booking_url: e.target.value })}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <Label>Listing</Label>
                <select
                  className="mt-1.5 h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={draft.listing_tier}
                  onChange={(e) => setDraft({ ...draft, listing_tier: e.target.value })}
                >
                  {LISTING_TIERS.map((t) => <option key={t.tier} value={t.tier}>{t.label}</option>)}
                </select>
              </div>
              {draft.listing_tier !== 'standard' && (
                <div>
                  <Label>Promoted until</Label>
                  <Input
                    className="mt-1.5"
                    type="date"
                    value={draft.featured_until}
                    onChange={(e) => setDraft({ ...draft, featured_until: e.target.value })}
                  />
                </div>
              )}
            </div>
            {draft.listing_tier !== 'standard' && !draft.featured_until && (
              <p className="text-xs text-muted-foreground">
                Without an end date the promotion never takes effect. That is deliberate, so
                a paid placement cannot run forever by accident.
              </p>
            )}

            <label className="flex items-start gap-3 rounded-xl border p-4 text-sm">
              <Checkbox className="mt-0.5" checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
              <span>
                I have checked this event is real and the details above are correct. It
                cannot be published without this.
              </span>
            </label>

            <Button className="w-full" disabled={saving} onClick={createEvent}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as a draft
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsAdmin;
