import { describe, it, expect } from 'vitest';
import { classifyWhatsapp, whatsappHref } from '../whatsapp';

/**
 * The label on a WhatsApp button is a claim about what happens when you
 * press it. These pin the one that was false: "WhatsApp us" over a
 * broadcast channel nobody can reply to.
 *
 * No em dashes in this file.
 */

describe('a WhatsApp link is described by what it does', () => {
  it('a channel is offered as something to follow, never as a way to message us', () => {
    // We have a channel and no number, so the channel is worth promoting.
    // What it must never do is invite a message nobody will receive.
    const link = classifyWhatsapp('https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y');
    expect(link.kind).toBe('channel');
    expect(link.canMessageUs).toBe(false);
    expect(link.purpose).toBe('follow');
    expect(link.label).toBe('Follow on WhatsApp');
    expect(link.label).not.toBe('WhatsApp us');
  });

  it('a wa.me number is a conversation', () => {
    const link = classifyWhatsapp('https://wa.me/27821234567');
    expect(link.kind).toBe('chat');
    expect(link.canMessageUs).toBe(true);
    expect(link.purpose).toBe('contact');
    expect(link.label).toBe('WhatsApp us');
  });

  it('the api.whatsapp.com send form is a conversation too', () => {
    const link = classifyWhatsapp('https://api.whatsapp.com/send?phone=27821234567');
    expect(link.canMessageUs).toBe(true);
  });

  it('a group invite is a room, not a message to us', () => {
    const link = classifyWhatsapp('https://chat.whatsapp.com/ABCdef123');
    expect(link.kind).toBe('group');
    expect(link.canMessageUs).toBe(false);
    expect(link.purpose).toBe('follow');
  });

  it.each([
    ['', 'empty'],
    ['not a url', 'unparseable'],
    ['https://example.com/whatsapp', 'a lookalike host'],
    ['https://wa.me/', 'wa.me with no number'],
  ])('%s is not allowed to claim it can carry a message (%s)', (url) => {
    const link = classifyWhatsapp(url);
    expect(link.canMessageUs).toBe(false);
    expect(link.label).not.toBe('WhatsApp us');
    // Nothing honest can be written on a button we cannot classify, so it
    // is not shown at all.
    expect(link.purpose).toBe('none');
  });

  it('handles a www prefix and a trailing path the same way', () => {
    expect(classifyWhatsapp('https://www.wa.me/27821234567').canMessageUs).toBe(true);
  });
});

describe('a prefilled message is only attached where it can be delivered', () => {
  it('is added to a chat link', () => {
    const link = classifyWhatsapp('https://wa.me/27821234567');
    const href = whatsappHref(link, 'Hi, I would like to ask about the Revenue Ready Sprint.');
    expect(href).toContain('text=');
    expect(decodeURIComponent(href)).toContain('Revenue Ready Sprint');
  });

  it('encodes spaces as %20, so no plus signs reach the message box', () => {
    const link = classifyWhatsapp('https://wa.me/27821234567');
    const href = whatsappHref(link, 'Hi there');
    expect(href).toContain('%20');
    expect(href).not.toContain('+');
  });

  it('is not added to a channel, where it would do nothing but look real', () => {
    const link = classifyWhatsapp('https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y');
    const href = whatsappHref(link, 'Hi, I would like to ask about something.');
    expect(href).not.toContain('text=');
    expect(href).toBe(link.url);
  });

  it('an empty link produces no href at all', () => {
    expect(whatsappHref(classifyWhatsapp(''), 'anything')).toBe('');
  });
});
