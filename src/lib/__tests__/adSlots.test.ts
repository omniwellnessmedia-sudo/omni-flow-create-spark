import { describe, it, expect } from 'vitest';
import { pickSlot, adPathFrom, type AdSlot } from '../adSlotSelection';

/**
 * Slot selection, and the path the counter is allowed to record.
 *
 * No em dashes in this file.
 */

const slot = (id: string, weight: number): AdSlot => ({
  id,
  slot_key: 'sidebar',
  title: id,
  body: '',
  cta_label: '',
  cta_href: '',
  image_url: null,
  hue: null,
  weight,
});

describe('choosing a slot', () => {
  it('returns nothing when there is nothing to show', () => {
    expect(pickSlot([], 0.5)).toBeNull();
  });

  it('ignores a slot weighted to zero, which is how one is paused', () => {
    expect(pickSlot([slot('paused', 0)], 0.5)).toBeNull();
    expect(pickSlot([slot('paused', 0), slot('live', 1)], 0.99)?.id).toBe('live');
  });

  it('respects weight', () => {
    const slots = [slot('a', 1), slot('b', 3)];
    // a occupies the first quarter of the range, b the rest.
    expect(pickSlot(slots, 0.0)?.id).toBe('a');
    expect(pickSlot(slots, 0.24)?.id).toBe('a');
    expect(pickSlot(slots, 0.26)?.id).toBe('b');
    expect(pickSlot(slots, 0.99)?.id).toBe('b');
  });

  it('always returns something when a weighted slot exists, even at the edges', () => {
    const slots = [slot('a', 1), slot('b', 1)];
    // A roll of exactly 1 used to fall off the end of the loop.
    for (const roll of [0, 0.5, 0.999999, 1, 1.5, -1]) {
      expect(pickSlot(slots, roll), `roll ${roll}`).not.toBeNull();
    }
  });

  it('a single slot is always chosen', () => {
    expect(pickSlot([slot('only', 1)], 0)?.id).toBe('only');
    expect(pickSlot([slot('only', 1)], 1)?.id).toBe('only');
  });
});

describe('the recorded path carries nothing about the person', () => {
  it('records an ordinary path', () => {
    expect(adPathFrom('/services')).toBe('/services');
    expect(adPathFrom('/services/revenue-sprint')).toBe('/services/revenue-sprint');
    expect(adPathFrom('/')).toBe('/');
  });

  it('records nothing rather than a path carrying an address', () => {
    // The caller never passes a query string, but a path with an @ in it
    // would still be a way to carry one, so the shape is checked.
    expect(adPathFrom('/u/someone@example.com')).toBe('');
    expect(adPathFrom('/services?email=someone@example.com')).toBe('');
  });

  it('refuses an over long path instead of truncating it into something valid looking', () => {
    expect(adPathFrom('/' + 'a'.repeat(300))).toBe('');
  });

  it.each(['', 'services', 'https://example.com/x', '//evil.example.com'])(
    'refuses %s, which is not a path this site serves',
    (bad) => {
      expect(adPathFrom(bad)).toBe('');
    }
  );
});
