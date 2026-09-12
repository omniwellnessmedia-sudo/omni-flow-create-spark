import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft } from 'lucide-react';
import { searchOffers, OFFER_COUNT } from '@/data/navigation';

/**
 * Find a service by typing, from inside the menu.
 *
 * WHY IT IS WORTH THE CODE. There are nineteen priced offers across six
 * categories. A visitor who knows they want a podcast, or an audit, or
 * something about their website should not have to work out which of six
 * headings the seller filed it under. Browsing is the seller's index;
 * searching is the buyer's.
 *
 * IT NEVER TOUCHES THE NETWORK. The rate card is already in the bundle, so
 * this filters an array in memory. It returns on the keystroke, it cannot
 * fail, it cannot be slow, and it works the instant the page has loaded.
 *
 * Combobox semantics per WAI-ARIA: the input owns the listbox, aria-expanded
 * says whether it is showing, aria-activedescendant points at the highlighted
 * row, and the arrow keys move that highlight without moving focus off the
 * input. Enter opens the highlighted row, or the first one when nothing is
 * highlighted, so the common case is type and press Enter.
 */

interface ServiceMenuSearchProps {
  /** Called once the visitor has navigated, so the menu can close itself. */
  onNavigate?: () => void;
  autoFocus?: boolean;
}

const ServiceMenuSearch = ({ onNavigate, autoFocus }: ServiceMenuSearchProps) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => searchOffers(query), [query]);
  const open = results.length > 0;

  const go = (index: number) => {
    const row = results[index];
    if (!row) return;
    setQuery('');
    setActive(-1);
    onNavigate?.();
    navigate(row.href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1));
    } else if (e.key === 'Enter') {
      // Nothing highlighted means take the best match, which is what
      // somebody who typed three letters and pressed Enter is asking for.
      e.preventDefault();
      go(active >= 0 ? active : 0);
    } else if (e.key === 'Escape') {
      setQuery('');
      setActive(-1);
    }
  };

  return (
    <div className="relative">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search services
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={`${listId}-input`}
          ref={inputRef}
          type="search"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={active >= 0 && open ? `${listId}-${active}` : undefined}
          aria-describedby={`${listId}-hint`}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          placeholder={`Search ${OFFER_COUNT} services`}
          className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </div>

      <p id={`${listId}-hint`} className="sr-only">
        Type to filter services. Use the arrow keys to move through results and Enter to open one.
      </p>

      {/* Announced to a screen reader without being drawn twice. */}
      <span aria-live="polite" className="sr-only">
        {query.trim().length >= 2
          ? `${results.length} ${results.length === 1 ? 'service' : 'services'} found`
          : ''}
      </span>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Matching services"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lg"
        >
          {results.map((row, i) => (
            <li key={row.slug}>
              <button
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                type="button"
                // onMouseDown rather than onClick: a click fires after blur,
                // and blur can close the menu out from under the row.
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(i);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                  i === active ? 'bg-accent' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: row.hue }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{row.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{row.band}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{row.price}</span>
              </button>
            </li>
          ))}
          <li className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[11px] text-muted-foreground">
            <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
            Enter opens the first result
          </li>
        </ul>
      )}
    </div>
  );
};

export default ServiceMenuSearch;
