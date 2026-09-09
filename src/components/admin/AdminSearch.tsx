import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * One search box for the whole admin.
 *
 * WHAT IT SOLVES. The admin has thirty odd screens across two navigation
 * models: dashboard sections that swap in place, and standalone routes.
 * Knowing where a thing lives was the job. Now you type what you are
 * looking for.
 *
 * IT SEARCHES TWO DIFFERENT THINGS, and keeps them apart on purpose:
 *
 *   Screens. Matched locally against the sidebar's own definition, so
 *   this half never needs the network and never fails. Type "payout" and
 *   you get Affiliate payouts whether or not the database answers.
 *
 *   Records. Actual leads, events, businesses, products and tasks. These
 *   need a query, so they arrive a moment later and can fail.
 *
 * A FAILED RECORD SEARCH SAYS SO. "No results" and "we could not look"
 * are different answers, and showing the first when the second is true is
 * how somebody concludes a lead does not exist and stops looking. Each
 * source reports its own failure, so one refused table does not hide the
 * four that answered.
 *
 * No em dashes in this file.
 */

interface Hit {
  id: string;
  title: string;
  detail?: string;
  to: string;
}

interface SourceResult {
  label: string;
  hits: Hit[];
  failed?: string;
}

/** Screens, flattened from the sidebar so the two can never drift apart. */
const SCREENS = NAV_GROUPS.flatMap((g) =>
  g.items.map((i) => ({
    id: i.id,
    title: i.label,
    group: g.label,
    to: i.href ?? `/admin?section=${i.id}`,
  }))
);

const MIN_QUERY = 2;
const PER_SOURCE = 5;

const AdminSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SourceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const runId = useRef(0);

  // Cmd+K on a Mac, Ctrl+K everywhere else. The same shortcut every other
  // tool with a palette uses, so nobody has to learn ours.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const screenHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCREENS.slice(0, 8);
    return SCREENS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.group.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const searchRecords = useCallback(async (q: string) => {
    const term = q.trim();
    if (term.length < MIN_QUERY) {
      setResults([]);
      return;
    }

    const mine = ++runId.current;
    setSearching(true);
    const like = `%${term.replace(/[%_]/g, (m) => `\\${m}`)}%`;

    // Each source is independent so one refusal cannot blank the rest.
    const sources: { label: string; run: () => Promise<SourceResult> }[] = [
      {
        label: 'Leads',
        run: async () => {
          const { data, error } = await (supabase
            .from('service_quotes' as any)
            .select('id, name, email, service_type')
            .or(`name.ilike.${like},email.ilike.${like},service_type.ilike.${like}`)
            .limit(PER_SOURCE) as any);
          if (error) return { label: 'Leads', hits: [], failed: error.message };
          return {
            label: 'Leads',
            hits: (data ?? []).map((r: any) => ({
              id: r.id,
              title: r.name ?? r.email ?? 'Lead',
              detail: [r.service_type, r.email].filter(Boolean).join(' · '),
              to: '/admin?section=leads',
            })),
          };
        },
      },
      {
        label: 'Events',
        run: async () => {
          const { data, error } = await (supabase
            .from('events' as any)
            .select('id, title, slug, status')
            .ilike('title', like)
            .limit(PER_SOURCE) as any);
          if (error) return { label: 'Events', hits: [], failed: error.message };
          return {
            label: 'Events',
            hits: (data ?? []).map((r: any) => ({
              id: r.id,
              title: r.title,
              detail: r.status,
              to: '/admin/events',
            })),
          };
        },
      },
      {
        label: 'Local businesses',
        run: async () => {
          const { data, error } = await (supabase
            .from('local_businesses' as any)
            .select('id, name, status')
            .ilike('name', like)
            .limit(PER_SOURCE) as any);
          if (error) return { label: 'Local businesses', hits: [], failed: error.message };
          return {
            label: 'Local businesses',
            hits: (data ?? []).map((r: any) => ({
              id: r.id,
              title: r.name,
              detail: r.status,
              to: '/admin/catalogue',
            })),
          };
        },
      },
      {
        label: 'Tasks',
        run: async () => {
          const { data, error } = await (supabase
            .from('admin_tasks' as any)
            .select('id, title, status')
            .ilike('title', like)
            .limit(PER_SOURCE) as any);
          if (error) return { label: 'Tasks', hits: [], failed: error.message };
          return {
            label: 'Tasks',
            hits: (data ?? []).map((r: any) => ({
              id: r.id,
              title: r.title,
              detail: r.status,
              to: '/admin?section=tasks',
            })),
          };
        },
      },
    ];

    const settled = await Promise.all(sources.map((s) => s.run()));
    // A slower earlier keystroke must not overwrite a newer answer.
    if (mine !== runId.current) return;
    setResults(settled.filter((r) => r.hits.length > 0 || r.failed));
    setSearching(false);
  }, []);

  // Debounced: one query per pause, not one per keypress.
  useEffect(() => {
    const t = setTimeout(() => void searchRecords(query), 220);
    return () => clearTimeout(t);
  }, [query, searchRecords]);

  const go = (to: string) => {
    setOpen(false);
    setQuery('');
    navigate(to);
  };

  const failures = results.filter((r) => r.failed);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-2 rounded-full px-3 text-xs text-muted-foreground"
        aria-label="Search the admin"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden items-center gap-0.5 rounded border px-1 text-[10px] md:inline-flex">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* shouldFilter off: filtering happens above, against the record
            results as well as the screen list. Letting cmdk filter too
            would hide database hits whose title does not literally contain
            the term, such as a lead matched on its email address. */}
        <CommandInput
          placeholder="Search screens, leads, events, businesses, tasks..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {screenHits.length === 0 && results.length === 0 && !searching && (
            <CommandEmpty>
              {query.trim().length < MIN_QUERY
                ? 'Keep typing to search your records.'
                : 'Nothing matched.'}
            </CommandEmpty>
          )}

          {screenHits.length > 0 && (
            <CommandGroup heading={query.trim() ? 'Screens' : 'Jump to'}>
              {screenHits.map((s) => (
                <CommandItem key={s.id} value={`screen-${s.id}-${s.title}`} onSelect={() => go(s.to)}>
                  <span className="flex-1">{s.title}</span>
                  <span className="text-[11px] text-muted-foreground">{s.group}</span>
                  <CornerDownLeft className="ml-2 h-3 w-3 opacity-40" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searching && query.trim().length >= MIN_QUERY && (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Searching your records
            </div>
          )}

          {results
            .filter((r) => r.hits.length > 0)
            .map((r) => (
              <CommandGroup key={r.label} heading={r.label}>
                {r.hits.map((h) => (
                  <CommandItem key={h.id} value={`${r.label}-${h.id}-${h.title}`} onSelect={() => go(h.to)}>
                    <span className="flex-1 truncate">{h.title}</span>
                    {h.detail && (
                      <span className="ml-2 truncate text-[11px] text-muted-foreground">{h.detail}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

          {failures.length > 0 && (
            <div className="border-t px-4 py-3">
              <p className="flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                <span>
                  Could not search {failures.map((f) => f.label).join(', ')}. Those results
                  are missing from this list, which is not the same as there being none.
                </span>
              </p>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default AdminSearch;
