/**
 * Editorial content for events we hold rich, verified copy for.
 *
 * The events table stores what every listing needs. Some events deserve more
 * than a summary: a programme, facilitators, what to bring. That detail lives
 * here, keyed by slug, so the page stays data driven and an event without an
 * entry renders exactly as before.
 *
 * SOURCE RULE. Everything in this file mirrors a source the team controls or
 * published. Nothing here may be invented: no session a listing does not
 * name, no time a listing does not give, no price that is not published on
 * the ticketing page. Each entry says where its facts come from.
 *
 * WELLNESS DAY SOURCE. The live Quicket listing (event 389529), pasted in
 * full by Tumelo on 4 September 2026, plus the venue confirmation in the
 * team's Wellness Day Outreach Tracker. Where the two disagree the published
 * listing wins, because it is what ticket buyers are shown.
 *
 * ENTITY NOTE. This is the commercial site. The host is named factually via
 * the events row (host_name), and the ticket link goes to the host's own
 * listing. The listing's giving asks and tax certificate language stay off
 * this page deliberately; they live with the host, where such claims belong.
 *
 * No em dashes in this file.
 */

export interface EventProgrammeSession {
  /** Clock times as published, 24h HH:MM. */
  starts: string;
  ends: string;
  title: string;
  facilitator: string;
  /** One professional line about the facilitator, from the listing. */
  facilitatorNote?: string;
  /** What the session is, in the listing's own words. */
  body: string;
  /** Spectrum hue for the card. */
  hue: string;
  /** Set when the listing says children may attend this session. */
  familyNote?: string;
}

export interface EventTicketTier {
  label: string;
  priceZar: number;
  /** Published saving against single-session pricing, when the listing states one. */
  savingZar?: number;
  note?: string;
  /** How many programme sessions this tier admits. 'all' means every session. */
  covers: number | 'all';
}

export interface EventExtraContent {
  /** Short strap under the title, from the listing. */
  tagline?: string;
  /** Opening paragraphs, in the listing's wording. */
  intro?: string[];
  /** Clock label like '10:30 to 15:30'. */
  timeLabel?: string;
  doorsNote?: string;
  /** For the countdown and calendar file. 24h HH:MM, venue local time. */
  startClock?: string;
  endClock?: string;
  programme?: EventProgrammeSession[];
  programmeNote?: string;
  tickets?: EventTicketTier[];
  ticketNote?: string;
  bring?: string[];
  goodToKnow?: string[];
  /** Street address and a directions link, when published. */
  address?: string;
  directionsUrl?: string;
  /** Where these facts come from, shown nowhere but kept for review. */
  source: string;
}

export const EVENT_CONTENT: Record<string, EventExtraContent> = {
  'wellness-day-fundraiser-2026': {
    tagline: 'A day of movement, breath, connection and community.',
    intro: [
      'Across five 45 minute sessions, facilitators guide you through Pilates, Hatha Yoga, Qi cultivation and breathwork, movement and play, and Yin Yoga with a restorative sound journey. Come for one session, choose a few, or spend the full day.',
      'Whether you are completely new to wellness practices or already have an established practice, you are welcome. Every ticket helps raise funds for the host’s ongoing community programmes.',
    ],
    timeLabel: '10:30 to 15:30',
    doorsNote: 'Doors open at 10:15. Short breaks between sessions give you time to rest, enjoy refreshments and connect.',
    startClock: '10:30',
    endClock: '15:30',
    programme: [
      {
        starts: '10:30',
        ends: '11:15',
        title: 'Pilates',
        facilitator: 'Hayley Stoffberg',
        facilitatorNote:
          'Certified Pilates, Yoga and Dance instructor, teaching movement since 2013.',
        body:
          'A beginner friendly Pilates mat class focused on core stability, mindful movement and strengthening the connection between mind and body.',
        hue: '#4FAE3F',
      },
      {
        starts: '11:30',
        ends: '12:15',
        title: 'Hatha Yoga',
        facilitator: 'Chad Cupido',
        facilitatorNote:
          'Certified yoga teacher since 2016, trained through Rishikesh Yog Peeth in India.',
        body:
          'A traditional, slower paced Hatha Yoga practice combining physical postures, conscious breathing and meditation. Gentle and accessible for different experience levels, including those new to yoga.',
        hue: '#2BB9B9',
      },
      {
        starts: '12:30',
        ends: '13:15',
        title: 'Qi Cultivation, Breathwork & Imaginative Experience',
        facilitator: 'Rome Naidoo',
        facilitatorNote: 'Founder of Rome Naidoo Coaching.',
        body:
          'Reconnect with your body, breath and inner energy through simple Qi cultivation exercises, conscious breathing and a guided imaginative experience designed to cultivate presence, vitality and inner connection.',
        hue: '#2C6FB5',
      },
      {
        starts: '13:30',
        ends: '14:15',
        title: 'Move, Play & Groove',
        facilitator: 'Kirsten Adams & Chazz Jurd',
        facilitatorNote: 'Of The Butterfly Effect.',
        body:
          'A joyful guided headset movement experience using music, play and expression. Move freely, have fun and reconnect with your body. No dance or movement experience needed.',
        hue: '#F38020',
        familyNote:
          'Children are welcome with a parent or guardian. Especially suitable for families wanting to participate together.',
      },
      {
        starts: '14:30',
        ends: '15:15',
        title: 'Yin Yoga & Sound Journey',
        facilitator: 'Hayley Stoffberg',
        body:
          'A slow, gentle Yin Yoga flow, holding postures for longer to encourage release and stillness, followed by a restorative sound journey designed to leave you feeling grounded and deeply relaxed.',
        hue: '#5C2A8A',
        familyNote:
          'Children who are comfortable with a quiet, slower experience and longer stillness are welcome with a parent or guardian.',
      },
    ],
    programmeNote:
      'The programme, running order or facilitators may be amended should circumstances require.',
    tickets: [
      { label: 'Single session', priceZar: 125, covers: 1 },
      { label: '2 sessions', priceZar: 200, savingZar: 50, covers: 2 },
      { label: '3 sessions', priceZar: 270, savingZar: 105, covers: 3 },
      {
        label: 'Full day pass',
        priceZar: 375,
        savingZar: 250,
        covers: 'all',
        note: 'All five sessions.',
      },
    ],
    ticketNote:
      'Multi session discounts are applied automatically at the ticket checkout. Full day passes and individual session spaces are limited, so advance booking is essential. No tickets will be available at the door.',
    bring: [
      'Your own water bottle.',
      'Comfortable clothing suitable for movement.',
      'Your own yoga or exercise mat for Pilates, Hatha Yoga, Qi Cultivation and Yin Yoga.',
      'A blanket and a firm pillow for the Yin Yoga and Sound Journey.',
    ],
    goodToKnow: [
      'Attendees under 18 must be accompanied by a parent or guardian.',
      'Wellness sessions involve physical activity and participation is voluntary and at your own risk. If you have an injury, medical condition or health concern, please seek medical guidance before participating and inform your facilitator where relevant.',
      'Photography and video may be taken during the day for the host’s marketing and reporting. If you do not wish to appear, please inform a member of the team on arrival.',
      'Right of admission is reserved.',
    ],
    address: '57 Promenade Rd, Muizenberg, Cape Town, 7950',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=-34.0999195,18.4692251',
    source:
      'Quicket listing 389529, pasted in full by Tumelo on 4 September 2026; venue confirmation in the Wellness Day Outreach Tracker.',
  },
};

export const getEventContent = (slug: string | undefined): EventExtraContent | null =>
  slug ? EVENT_CONTENT[slug] ?? null : null;
