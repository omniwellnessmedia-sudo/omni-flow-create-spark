import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { curatedOnly, CURATED_ONLY } from '@/config/catalogueGate';

/**
 * The curation gate is the thing standing between an unvetted third party
 * product feed and a shopper, so it has to actually run.
 *
 * It did not. Every one of the thirteen call sites passed the table
 * builder from .from() instead of the filter builder from .select(), and
 * .eq() only exists on the second, so every shopper facing product read
 * threw before reaching the database. Found in a browser on 15 September
 * 2026 on /store, then in ten more files.
 *
 * No em dashes in this file.
 */

/** The smallest thing that behaves like a Supabase filter builder. */
const fakeFilterBuilder = () => {
  const calls: [string, unknown][] = [];
  const b: Record<string, unknown> = { calls };
  b.eq = (col: string, val: unknown) => { calls.push([col, val]); return b; };
  return b;
};

/** What .from() gives you: no .eq on it. */
const fakeTableBuilder = () => ({ select: () => fakeFilterBuilder() });

describe('the gate itself', () => {
  it('is on unless deliberately disabled', () => {
    expect(CURATED_ONLY).toBe(true);
  });

  it('adds the is_featured filter to a filter builder', () => {
    const b = fakeFilterBuilder();
    const out = curatedOnly(b) as ReturnType<typeof fakeFilterBuilder>;
    expect(b.calls).toEqual([['is_featured', true]]);
    expect(out).toBe(b);
  });

  it('stays chainable', () => {
    const b = fakeTableBuilder().select();
    const out = curatedOnly(b) as ReturnType<typeof fakeFilterBuilder>;
    expect(typeof out.eq).toBe('function');
  });

  it('refuses a table builder loudly, and says which way round it goes', () => {
    expect(() => curatedOnly(fakeTableBuilder())).toThrow(/select\(\) before it/);
  });

  it('refuses rather than passing an ungated query through', () => {
    // The dangerous failure is a read that reaches shoppers without the
    // filter, so anything without .eq has to stop, not continue.
    for (const bad of [null, undefined, {}, [], 'query', 42]) {
      expect(() => curatedOnly(bad)).toThrow(TypeError);
    }
  });
});

describe('every call site passes a select', () => {
  const root = resolve(__dirname, '../..');
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) return walk(p);
      return /\.tsx?$/.test(name) ? [p] : [];
    });

  const callSites = walk(root)
    .filter((f) => !f.includes('catalogueGate'))
    .map((f) => [f, readFileSync(f, 'utf8')] as const)
    .filter(([, s]) => s.includes('curatedOnly('));

  it('finds the call sites it is meant to be checking', () => {
    expect(callSites.length).toBeGreaterThanOrEqual(11);
  });

  it.each(callSites.map(([f]) => f))('%s selects inside the gate, not after it', (file) => {
    const s = readFileSync(file, 'utf8');
    // The broken shape: the gate closes before .select is reached.
    expect(s).not.toMatch(/curatedOnly\(\(?supabase\.from\([^)]*\)\)?\)\s*\n?\s*\.select\(/);
    for (const call of s.match(/curatedOnly\([^\n]*/g) ?? []) {
      if (call.includes('supabase.from(')) expect(call).toContain('.select(');
    }
  });
});
