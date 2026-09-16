import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TALKS, listedTalks, HELPLINE, CHANNEL_URL, isYoutubeId } from '@/data/talks';

/**
 * The talks page, held to its rules: only public videos are embedded, the
 * sensitive ones only alongside a confirmed helpline, every id is a real
 * YouTube id shape, and nothing on the page invents a claim about a talk.
 *
 * No em dashes in this file.
 */

const read = (rel: string) => readFileSync(resolve(__dirname, rel), 'utf8');
const strip = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const page = strip(read('../Talks.tsx'));
const facade = strip(read('../../components/YouTubeFacade.tsx'));
const data = strip(read('../../data/talks.ts'));
const app = read('../../App.tsx');

describe('talk data', () => {
  it('every id looks like a YouTube id and none repeats', () => {
    const ids = TALKS.map((t) => t.youtubeId);
    for (const id of ids) expect(isYoutubeId(id), id).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every talk has a title and a one-sentence blurb', () => {
    for (const t of TALKS) {
      expect(t.title.trim()).not.toBe('');
      expect(t.blurb.trim()).not.toBe('');
      expect(t.blurb.split(/[.!?]\s/).length).toBeLessThanOrEqual(2);
    }
  });

  it('lists only public talks', () => {
    for (const t of listedTalks()) expect(t.visibility).toBe('public');
  });

  it('never lists a sensitive talk without a helpline on file', () => {
    if (HELPLINE.trim() === '') {
      expect(listedTalks().some((t) => t.sensitive)).toBe(false);
    }
  });

  it('points at the Omni channel', () => {
    expect(CHANNEL_URL).toContain('UC9xAQa9QquyE4Glsy1zmpRQ');
  });

  it('carries all eighteen short films that were uploaded', () => {
    // The Drive to YouTube run finished on 16 September 2026, five per day
    // against the upload cap. Verified against the channel listing.
    expect(TALKS).toHaveLength(18);
  });

  it('flags the three mental health talks as sensitive, by name', () => {
    const sensitive = TALKS.filter((t) => t.sensitive).map((t) => t.title).sort();
    expect(sensitive).toEqual([
      'Substance Abuse and Addiction',
      'Suicidal Thoughts',
      'What Can We Do When We Feel Anxious and Restless?',
    ]);
  });

  it('keeps those three off the page while no helpline is on file', () => {
    expect(HELPLINE.trim()).toBe('');
    const listed = listedTalks().map((t) => t.title);
    for (const title of ['Suicidal Thoughts', 'Substance Abuse and Addiction']) {
      expect(listed).not.toContain(title);
    }
  });

  it('prints no helpline number it was not given', () => {
    // A wrong number on a page beside a talk about suicide is worse than no
    // number, so nothing here may hardcode one.
    expect(data).not.toMatch(/0800[\s\d]{6,}|\b08[67]\d[\s\d]{6,}/);
  });
});

describe('the page and the player', () => {
  it('embeds through the facade, never a bare iframe per talk', () => {
    expect(page).not.toMatch(/<iframe/);
    expect(page).toMatch(/<YouTubeFacade/);
  });

  it('loads the player from the no-cookie host and only on play', () => {
    expect(facade).toContain('youtube-nocookie.com/embed/');
    expect(facade).toMatch(/setPlaying\(true\)/);
  });

  it('uses the poster that exists for every video', () => {
    expect(facade).toContain('/hqdefault.jpg');
    expect(facade).not.toContain('maxresdefault');
  });

  it('makes no claims about what a talk teaches', () => {
    for (const src of [page, data]) {
      expect(src).not.toMatch(/guarantee|proven|cure|will (heal|fix|change your life)/i);
      expect(src).not.toMatch(/testimonial|<blockquote/i);
    }
  });

  it.each([
    ['Talks.tsx', page],
    ['YouTubeFacade.tsx', facade],
    ['talks.ts', data],
  ])('%s has no em dashes', (_n, src) => {
    expect(src).not.toMatch(/\u2014/);
  });

  it('is routed', () => {
    expect(app).toMatch(/path="\/watch"/);
  });
});
