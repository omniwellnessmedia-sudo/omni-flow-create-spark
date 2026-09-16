/**
 * The Omni talks: produced video pieces on the Omni Wellness Media YouTube
 * channel, listed here so the site can show them.
 *
 * HOW A TALK GETS ON THE PAGE. It is uploaded to the channel (from Drive,
 * through Zapier, one per upload window), lands here with its YouTube id and
 * `visibility: 'private'`, and appears on /watch only once someone has
 * watched it through in YouTube Studio, made it public there, and flipped
 * this flag. A private video embedded on a page shows "Video unavailable",
 * which is worse than not being listed, so the page filters on the flag.
 *
 * WHAT THE BLURB MAY SAY. The title, restated as a sentence. Nobody here has
 * watched every talk end to end, so the blurbs make no claims about what a
 * talk teaches or promises. The user can replace any blurb with a real one.
 *
 * HELPLINE. The three talks flagged `sensitive` cover suicidal thoughts,
 * addiction and anxiety. They stay private until a South African helpline
 * number has been confirmed by a person and added to HELPLINE below; the
 * page prints it beside those talks. Nothing here invents a number.
 *
 * No em dashes in this file.
 */

export type TalkVisibility = 'private' | 'public';

export interface Talk {
  /** The YouTube video id, eleven characters. */
  youtubeId: string;
  title: string;
  /** One sentence, the title restated. */
  blurb: string;
  visibility: TalkVisibility;
  /** Mental health topic: shows the helpline line beside the video. */
  sensitive?: boolean;
}

/**
 * Set once a person has confirmed the number. Empty means the helpline line
 * is not rendered and sensitive talks stay off the page.
 */
export const HELPLINE = '';

export const CHANNEL_URL = 'https://www.youtube.com/channel/UC9xAQa9QquyE4Glsy1zmpRQ';

export const TALKS: Talk[] = [
  {
    youtubeId: 'hgV0pzsDvZk',
    title: 'Feeling Stuck',
    blurb: 'On feeling stuck.',
    visibility: 'public',
  },
  {
    youtubeId: 'grJBftG7Wy8',
    title: 'Small Daily Improvements',
    blurb: 'On small daily improvements.',
    visibility: 'private',
  },
  {
    youtubeId: '5p-pAw70OUU',
    title: 'Healing Emotional Pain',
    blurb: 'On healing emotional pain.',
    visibility: 'public',
  },
  {
    youtubeId: 'zKZ4xgqLtXU',
    title: 'Recognising Our Purpose After a Difficult Season',
    blurb: 'On recognising our purpose after a difficult season.',
    visibility: 'private',
  },
  {
    youtubeId: 'A2JknZS8-Ng',
    title: 'New Season of Life',
    blurb: 'On a new season of life.',
    visibility: 'private',
  },
  {
    youtubeId: 'nYWEJnXaWig',
    title: 'I Am Possible',
    blurb: 'I am possible.',
    visibility: 'private',
  },
  {
    youtubeId: 'pXPZRF5ugeQ',
    title: 'Emotional Heaviness Clearance',
    blurb: 'On clearing emotional heaviness.',
    visibility: 'private',
  },
  {
    youtubeId: 'T2CzabSM1pg',
    title: 'Fear and Protection',
    blurb: 'On fear and protection.',
    visibility: 'private',
  },
  {
    youtubeId: 'ik7LNG9Zx2g',
    title: 'Self-Awareness and Transformation',
    blurb: 'On self-awareness and transformation.',
    visibility: 'private',
  },
  {
    youtubeId: '4X5_B0s-4rQ',
    title: 'What Does Forgiveness Really Mean?',
    blurb: 'What does forgiveness really mean?',
    visibility: 'private',
  },
  {
    youtubeId: 'KzR0fo1HbgM',
    title: 'Unresolved Emotions Affect the Way We Think',
    blurb: 'On how unresolved emotions affect the way we think.',
    visibility: 'private',
  },
  {
    youtubeId: '1IE1ZQJzvqo',
    title: 'Renewal of the Mind',
    blurb: 'On renewal of the mind.',
    visibility: 'private',
  },
  {
    youtubeId: 'MN34yGe6PRs',
    title: 'Repeating Painful Patterns',
    blurb: 'On repeating painful patterns.',
    visibility: 'private',
  },
  {
    youtubeId: 'TKzEM6mPfcA',
    title: 'The Difference Between Managing a Symptom and Healing the Root',
    blurb: 'On the difference between managing a symptom and healing the root.',
    visibility: 'private',
  },
  {
    youtubeId: 'zOGfZ0W4Nug',
    title: 'Move Beyond the Programming That Has Shaped Us',
    blurb: 'On moving beyond the programming that has shaped us.',
    visibility: 'private',
  },
  // The last three carry `sensitive`, so listedTalks keeps them off the page
  // until HELPLINE above holds a number a person has confirmed, whatever
  // anyone sets visibility to. They are private on the channel as well.
  {
    youtubeId: 'g0YlyCV159s',
    title: 'What Can We Do When We Feel Anxious and Restless?',
    blurb: 'What can we do when we feel anxious and restless?',
    visibility: 'private',
    sensitive: true,
  },
  {
    youtubeId: 'XnJ85Yi7mug',
    title: 'Suicidal Thoughts',
    blurb: 'On suicidal thoughts.',
    visibility: 'private',
    sensitive: true,
  },
  {
    youtubeId: 'gbNAdCSYksk',
    title: 'Substance Abuse and Addiction',
    blurb: 'On substance abuse and addiction.',
    visibility: 'private',
    sensitive: true,
  },
];

/** Talks the page may show: public, and if sensitive, only with a helpline to print. */
export const listedTalks = (): Talk[] =>
  TALKS.filter((t) => t.visibility === 'public' && (!t.sensitive || HELPLINE.trim().length > 0));

/** True for a plausible YouTube video id. */
export const isYoutubeId = (id: string): boolean => /^[A-Za-z0-9_-]{11}$/.test(id);
