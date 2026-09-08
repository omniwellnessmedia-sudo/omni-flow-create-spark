/**
 * What a WhatsApp link actually does, and what a button for it may say.
 *
 * The site shipped buttons labelled "WhatsApp us" pointing at
 * whatsapp.com/channel/..., which is a WhatsApp Channel: broadcast only.
 * A reader can follow it. A reader cannot reply to it. So the button
 * offered a way to reach us and opened something nobody can reach us
 * through, and every person who tried was a lead we never saw.
 *
 * The link is now a setting a super admin edits, which means the label
 * cannot be written once and trusted. It is derived from the URL instead,
 * so whichever link is set, the button describes it correctly.
 *
 * No em dashes in this file.
 */

export type WhatsappKind = 'chat' | 'channel' | 'group' | 'unknown';

export interface WhatsappLink {
  url: string;
  kind: WhatsappKind;
  /** What a button opening this link may honestly say. */
  label: string;
  /** True only when a person can send us a message through it. */
  canMessageUs: boolean;
}

/**
 * Classify a WhatsApp URL.
 *
 * Deliberately conservative: anything not recognised as a direct chat is
 * not allowed to claim it can carry a message.
 */
export const classifyWhatsapp = (raw: string | null | undefined): WhatsappLink => {
  const url = (raw ?? '').trim();

  if (!url) {
    return { url: '', kind: 'unknown', label: 'WhatsApp', canMessageUs: false };
  }

  let host = '';
  let path = '';
  try {
    const parsed = new URL(url);
    host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    path = parsed.pathname;
  } catch {
    return { url, kind: 'unknown', label: 'WhatsApp', canMessageUs: false };
  }

  // wa.me/27821234567 and api.whatsapp.com/send?phone=... both open a
  // conversation with us. These are the only two that can carry a message.
  const isChat =
    (host === 'wa.me' && /^\/\+?\d{6,}/.test(path)) ||
    (host === 'api.whatsapp.com' && path === '/send') ||
    (host === 'whatsapp.com' && path === '/send');

  if (isChat) {
    return { url, kind: 'chat', label: 'WhatsApp us', canMessageUs: true };
  }

  if (/^\/channel\//.test(path)) {
    return { url, kind: 'channel', label: 'WhatsApp channel', canMessageUs: false };
  }

  // chat.whatsapp.com/<code> is a group invite. A person can post in the
  // group, but that is joining a room, not messaging us, and the button
  // should not pretend otherwise.
  if (host === 'chat.whatsapp.com') {
    return { url, kind: 'group', label: 'WhatsApp group', canMessageUs: false };
  }

  return { url, kind: 'unknown', label: 'WhatsApp', canMessageUs: false };
};

/**
 * Add a prefilled message to a chat link.
 *
 * Only ever applied to a real chat link. Appending text to a channel URL
 * does nothing except make the link look like it carries a message.
 */
export const whatsappHref = (link: WhatsappLink, prefill?: string): string => {
  if (!link.url) return '';
  if (!prefill || !link.canMessageUs) return link.url;

  try {
    const parsed = new URL(link.url);
    // Built by hand rather than with searchParams, which encodes a space as
    // "+". That is correct for a form post and wrong in a message box: a
    // client that does not form decode shows the plus signs to the person
    // about to send it. %20 cannot be read two ways.
    parsed.search = `text=${encodeURIComponent(prefill)}`;
    return parsed.toString();
  } catch {
    return link.url;
  }
};
