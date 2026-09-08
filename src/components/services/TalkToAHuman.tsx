import { Phone } from 'lucide-react';
import { INK, SLATE, LINE, mono } from '@/components/services/spectrum';
import { publishedContacts, telHref, OFFICE_HOURS } from '@/data/humanContact';

/**
 * The offer to speak to somebody, instead of filling in a form.
 *
 * This replaces the WhatsApp button that used to sit here. That button
 * pointed at a broadcast channel, so it invited people to reach us through
 * something nobody can reach us through. A phone number is the version of
 * that offer that actually works.
 *
 * IT RENDERS NOTHING WHEN THERE IS NO NUMBER TO CALL. An empty "talk to a
 * human" panel would be worse than the button it replaced.
 *
 * The claims are deliberately small. It says you will get a person rather
 * than a phone menu, which is true of a mobile number, and it states the
 * hours already published on the contact page. It does not promise a
 * callback, a response time, or that somebody is always available, because
 * none of that has been agreed and a missed promise on a phone number is
 * the kind people remember.
 *
 * No em dashes in this file.
 */

const TalkToAHuman = ({
  variant = 'light',
  compact = false,
  className = '',
}: {
  variant?: 'light' | 'dark';
  compact?: boolean;
  className?: string;
}) => {
  const contacts = publishedContacts();
  if (contacts.length === 0) return null;

  const dark = variant === 'dark';
  const ink = dark ? '#FAF8F2' : INK;
  const soft = dark ? 'rgba(250,248,242,.72)' : SLATE;
  const border = dark ? 'rgba(250,248,242,.22)' : LINE;

  return (
    <section
      aria-labelledby="talk-to-a-human"
      className={`rounded-2xl p-6 ${className}`}
      style={{
        border: `1px solid ${border}`,
        background: dark ? 'transparent' : '#FFFFFF',
      }}
    >
      <p
        className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em]"
        style={{ ...mono, color: soft }}
      >
        <Phone className="h-3 w-3" aria-hidden="true" />
        Talk to us
      </p>

      <h2
        id="talk-to-a-human"
        className="mt-3 font-wwpl-display text-[24px] leading-tight"
        style={{ color: ink }}
      >
        Rather speak to a person?
      </h2>

      {!compact && (
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: soft }}>
          We would rather have a conversation than collect a form. Call one of us
          directly and you will get a person, not a phone menu.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {contacts.map((c) => (
          <li key={c.name} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <a
              href={telHref(c.phone)}
              className="text-[17px] font-medium underline-offset-4 hover:underline"
              style={{ color: ink }}
            >
              {c.phone}
            </a>
            <span className="text-[14px]" style={{ color: soft }}>
              {c.name}, {c.role}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[12.5px] leading-relaxed" style={{ color: soft }}>
        {OFFICE_HOURS}. Outside those hours the enquiry form reaches us just as
        well, and we answer it ourselves.
      </p>
    </section>
  );
};

export default TalkToAHuman;
