import type { ReactNode } from 'react';

/**
 * The title block every admin screen should open with.
 *
 * Most of them open with none. Leads goes straight into four stat cards, so
 * an operator arriving from search, a bookmark or the sidebar sees numbers
 * before they see what the numbers are about. On a phone, where the sidebar
 * is behind a hamburger, there is then nothing on screen naming the page at
 * all.
 *
 * This gives a screen one h1, in the display face, with a mono eyebrow above
 * it and room for the actions that belong to the whole screen rather than to
 * one card inside it.
 *
 * WHY THE EYEBROW REPEATS THE SIDEBAR GROUP. It is the "you are here" that
 * the sidebar gives a desktop user and withholds from everyone else. It is
 * two words, and it costs nothing to the person who does not need it.
 *
 * The heading is an h1 on purpose. The admin shell has no h1 of its own, so
 * without one here a screen full of h3 card titles starts at level three and
 * a screen reader user gets no top level landmark to jump to.
 */

interface AdminScreenHeaderProps {
  /** Sidebar group this screen sits under, for example "Core" or "System". */
  eyebrow?: string;
  title: string;
  /** One line on what this screen is for. Skip it when the title says it. */
  description?: string;
  /** Actions for the whole screen. Actions for one card belong on that card. */
  actions?: ReactNode;
  /** Live status, for example a last updated time. Sits under the actions. */
  meta?: ReactNode;
}

const AdminScreenHeader = ({ eyebrow, title, description, actions, meta }: AdminScreenHeaderProps) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
      <h1 className={eyebrow ? 'mt-1.5' : undefined}>{title}</h1>
      {description && (
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
    {(actions || meta) && (
      <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      </div>
    )}
  </header>
);

export default AdminScreenHeader;
