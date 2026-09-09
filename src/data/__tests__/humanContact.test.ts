import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { HUMAN_CONTACTS, publishedContacts, telHref, OFFICE_HOURS } from '../humanContact';

/**
 * The phone numbers the site offers, and how a WhatsApp link is labelled.
 *
 * No em dashes in this file.
 */

const codeOnly = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

describe('a published number is a number that works', () => {
  it('nobody is listed without a number', () => {
    // A name beside a blank space, or a dead tel: link, is a broken promise
    // to somebody holding a phone.
    for (const c of publishedContacts()) {
      expect(c.phone.trim().length, c.name).toBeGreaterThan(0);
    }
  });

  it('an entry with no number is carried but never rendered', () => {
    const waiting = HUMAN_CONTACTS.filter((c) => !c.phone.trim());
    const published = publishedContacts();
    for (const w of waiting) {
      expect(published.find((p) => p.name === w.name)).toBeUndefined();
    }
  });

  it('at least one person can actually be called', () => {
    expect(publishedContacts().length).toBeGreaterThan(0);
  });

  it('every published number is a real South African number', () => {
    for (const c of publishedContacts()) {
      expect(c.phone, c.name).toMatch(/^\+27 \d{2} \d{3} \d{4}$/);
    }
  });

  it('the dialable href strips the readable spacing', () => {
    expect(telHref('+27 74 831 5961')).toBe('tel:+27748315961');
    expect(telHref('074 831 5961')).toBe('tel:0748315961');
  });

  it('the hours are the ones already published on the contact page', () => {
    const contact = readFileSync(resolve(__dirname, '../../pages/Contact.tsx'), 'utf8');
    // Contact renders them as "Mon - Fri, 9AM - 5PM SAST". Same fact, and
    // this catches the two drifting apart.
    expect(contact).toMatch(/Mon\s*-\s*Fri/);
    expect(OFFICE_HOURS).toContain('Monday to Friday');
    expect(OFFICE_HOURS).toContain('SAST');
  });

  it('every published number already appears on the contact page', () => {
    // Nothing reaches a service page that has not been published as a
    // business contact already.
    const contact = readFileSync(resolve(__dirname, '../../pages/Contact.tsx'), 'utf8');
    for (const c of publishedContacts()) {
      expect(contact, `${c.name} is not on /contact`).toContain(c.phone);
    }
  });
});

describe('a WhatsApp button says what the link actually does', () => {
  const spectrum = readFileSync(
    resolve(__dirname, '../../components/services/spectrum.tsx'), 'utf8'
  );
  const dock = readFileSync(
    resolve(__dirname, '../../components/FloatingActionDock.tsx'), 'utf8'
  );
  const panel = readFileSync(
    resolve(__dirname, '../../components/services/TalkToAHuman.tsx'), 'utf8'
  );

  it('shows a link we can describe, and nothing we cannot', () => {
    // We have a channel and no number, so the channel is promoted as a
    // follow. An unclassifiable link is still hidden, because there is no
    // honest wording for a button whose destination we do not understand.
    expect(spectrum).toContain("if (!link.url || link.purpose === 'none') return null;");
  });

  it('the quick action dock uses the same test', () => {
    expect(dock).toContain("whatsapp.purpose !== 'none'");
  });

  it('this is not a hardcoded switch somebody has to remember to undo', () => {
    // Setting a wa.me number in Admin Settings must bring every button back
    // on its own, so no file may disable WhatsApp by a flag or a constant.
    const code = codeOnly(spectrum) + codeOnly(dock);
    expect(code).not.toMatch(/HIDE_WHATSAPP|WHATSAPP_ENABLED|SHOW_WHATSAPP|whatsappDisabled/);
  });

  it('the call panel disappears rather than showing an empty invitation', () => {
    expect(panel).toContain('if (contacts.length === 0) return null;');
  });

  it('the panel promises nothing that has not been agreed', () => {
    // A missed promise on a phone number is the kind people remember.
    //
    // Comments are stripped first: the header explains which promises are
    // deliberately absent, and naming them there must not fail the check
    // that they are absent from the rendered copy.
    const rendered = codeOnly(panel).toLowerCase();
    for (const claim of ['24/7', 'always available', 'instantly', 'immediately', 'call you back within']) {
      expect(rendered, claim).not.toContain(claim.toLowerCase());
    }
  });
});
