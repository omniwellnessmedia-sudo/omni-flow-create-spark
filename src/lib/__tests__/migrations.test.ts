import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * The team runs migrations by pasting them into the Supabase dashboard SQL
 * editor, not through the CLI. That editor cannot parse a dollar quote
 * inside another dollar quote: it loses track of where the inner one ends
 * and reports "unterminated dollar-quoted string" at some later block, so
 * the error points at innocent lines and the real cause is invisible.
 *
 * Postgres itself is fine with it. This only bites in the editor, which is
 * why it survived review twice and cost a working afternoon. The rule is
 * therefore about the tool the team actually uses, not about valid SQL.
 *
 * Keep every dollar quote at the top level. A function that wants the
 * safety of a DO block does not need it: a plpgsql body is not checked when
 * the function is created, so there is no missing dependency to guard.
 *
 * SCOPE. Twenty older migrations nest, and every one of them is already
 * applied to the project. They went in through the CLI, which copes fine,
 * and rewriting applied history to satisfy a rule about a different tool
 * would be churn with a migration-ordering risk attached and no benefit.
 * The rule starts at the point the team began running migrations by hand in
 * the dashboard, and covers everything added from here on.
 *
 * No em dashes in this file.
 */

const DIR = resolve(__dirname, '../../../supabase/migrations');

/** The first migration the team ran by pasting it into the dashboard. */
const HAND_RUN_FROM = '20260914';

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.sql') && f >= HAND_RUN_FROM)
  .sort();

/** Every dollar quote in the file, in order, with its line number. */
const tags = (sql: string) => {
  const out: Array<{ tag: string; line: number }> = [];
  const re = /\$[A-Za-z_][A-Za-z0-9_]*\$|\$\$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql))) {
    out.push({ tag: m[0], line: sql.slice(0, m.index).split('\n').length });
  }
  return out;
};

describe('migrations survive the Supabase dashboard SQL editor', () => {
  it('there are migrations to check', () => {
    // If a rename ever makes this filter match nothing, the suite would go
    // green while checking zero files. Fail loudly instead.
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain('20260924120000_service_content.sql');
  });

  it.each(files)('%s never nests one dollar quote inside another', (file) => {
    const found = tags(readFileSync(resolve(DIR, file), 'utf8'));
    let open: { tag: string; line: number } | null = null;

    for (const t of found) {
      if (!open) {
        open = t;
        continue;
      }
      if (t.tag === open.tag) {
        open = null;
        continue;
      }
      // A different tag while one is still open. Postgres reads it as text;
      // the dashboard editor loses the plot here.
      expect.fail(
        `${file}: ${t.tag} on line ${t.line} opens inside ${open.tag} from line ${open.line}. ` +
          `Lift it to the top level with its own unique tag.`
      );
    }

    expect(open, `${file}: ${open?.tag} on line ${open?.line} is never closed`).toBeNull();
  });

  it.each(files)('%s has no em dashes', (file) => {
    expect(readFileSync(resolve(DIR, file), 'utf8')).not.toMatch(/\u2014/);
  });
});
