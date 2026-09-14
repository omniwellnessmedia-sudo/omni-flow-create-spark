import { differenceInCalendarDays, formatDistanceToNowStrict, isBefore, startOfDay } from 'date-fns';

/**
 * One sales pipeline over three tables.
 *
 * WHY. A lead reaches Omni three ways: the contact form (contact_submissions),
 * the enquiry form addressed to an offer (service_quotes), and a conversation
 * on the pavement or by email that somebody typed in afterwards
 * (outreach_leads). Each table grew its own status vocabulary, and the admin
 * showed them on separate tabs, so the question the team actually asks,
 * "who needs a reply and who is close to buying", had no single answer.
 *
 * This file gives every lead one shape and one set of stages, whatever
 * table it lives in, and translates a stage back into the status word that
 * table already understands. Nothing is migrated: the old words stay valid,
 * they are just read through this map.
 *
 * THE STAGES ARE HOW OMNI SELLS. New, In conversation, Findings sent (the
 * three findings promise on the Muizenberg page is a real step and gets a
 * real column), Quoted, Won, Lost. Archived is off the board.
 *
 * No em dashes in this file.
 */

export type LeadSource = 'contact' | 'quote' | 'outreach';

export type Stage = 'new' | 'talking' | 'findings' | 'quoted' | 'won' | 'lost' | 'archived';

export interface StageDef {
  id: Stage;
  label: string;
  /** Spectrum hue, so the board reads as part of the site. */
  hue: string;
  hint: string;
  /** Shown as a column on the board. Lost and archived are behind a toggle. */
  board: boolean;
}

export const STAGES: StageDef[] = [
  { id: 'new', label: 'New', hue: '#E63946', hint: 'Nobody has replied yet', board: true },
  { id: 'talking', label: 'In conversation', hue: '#F38020', hint: 'Replied, findings not yet sent', board: true },
  { id: 'findings', label: 'Findings sent', hue: '#F5C518', hint: 'The three findings are with them', board: true },
  { id: 'quoted', label: 'Quoted', hue: '#2BB9B9', hint: 'A price is on the table', board: true },
  { id: 'won', label: 'Won', hue: '#4FAE3F', hint: 'They said yes', board: true },
  { id: 'lost', label: 'Lost', hue: '#5A6A68', hint: 'They said no, or went quiet for good', board: false },
  { id: 'archived', label: 'Archived', hue: '#8A9A96', hint: 'Out of the pipeline', board: false },
];

export const BOARD_STAGES = STAGES.filter((s) => s.board);

export const stageDef = (id: Stage): StageDef => STAGES.find((s) => s.id === id) ?? STAGES[0];

/**
 * Every status word any of the three tables has ever used, read as a stage.
 *
 * "closed" is the old dashboard's Close button, which meant "dealt with"
 * without saying whether it was won or lost, so it reads as archived rather
 * than guessing either. The outreach words applied and registered come from
 * the foundation's programme outreach, where they meant a step forward and
 * a yes; they read as quoted and won so nothing already on file disappears.
 */
const RAW_TO_STAGE: Record<string, Stage> = {
  pending: 'new',
  new: 'new',
  no_response: 'new',
  in_progress: 'talking',
  responded: 'talking',
  contacted: 'talking',
  awaiting: 'talking',
  positive: 'talking',
  findings_sent: 'findings',
  quoted: 'quoted',
  applied: 'quoted',
  won: 'won',
  registered: 'won',
  lost: 'lost',
  declined: 'lost',
  closed: 'archived',
  archived: 'archived',
};

export const KNOWN_STATUSES = Object.keys(RAW_TO_STAGE);

/** A stage for any status word, including none. Unknown words count as new, so they get looked at. */
export const stageForStatus = (status: string | null | undefined): Stage =>
  RAW_TO_STAGE[(status ?? 'pending').trim().toLowerCase()] ?? 'new';

const FORM_WORDS: Record<Stage, string> = {
  new: 'pending',
  talking: 'in_progress',
  findings: 'findings_sent',
  quoted: 'quoted',
  won: 'won',
  lost: 'lost',
  archived: 'archived',
};

const OUTREACH_WORDS: Record<Stage, string> = {
  new: 'no_response',
  talking: 'contacted',
  findings: 'findings_sent',
  quoted: 'quoted',
  won: 'won',
  lost: 'declined',
  archived: 'archived',
};

/** The status word to write when a lead in `source` moves to `stage`. */
export const statusForStage = (stage: Stage, source: LeadSource): string =>
  source === 'outreach' ? OUTREACH_WORDS[stage] : FORM_WORDS[stage];

/** The campaign tag a walk-in from the Muizenberg sheet carries. */
export const WALK_IN_CAMPAIGN = 'muizenberg';

/** The context string the Muizenberg page puts into an enquiry. */
export const MUIZENBERG_CONTEXT_MARK = 'Muizenberg local business';

export interface PipelineLead {
  /** `${source}:${id}`, unique across the three tables. */
  key: string;
  id: string;
  source: LeadSource;
  name: string;
  org: string | null;
  email: string | null;
  phone: string | null;
  /** The offer or service they asked about, as written. */
  service: string | null;
  /** What they said: the message, the project details, or the notes. */
  brief: string | null;
  status: string;
  stage: Stage;
  createdAt: string;
  lastContacted: string | null;
  followUpDue: string | null;
  campaign: string | null;
  assignedTo: string | null;
  /** The row as it came from the table, for the drawer. */
  raw: Record<string, unknown>;
}

type Row = Record<string, unknown>;

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null);

/** One shape for a row from any of the three tables. */
export const toPipelineLead = (source: LeadSource, row: Row): PipelineLead => {
  const id = String(row.id);
  const status = str(row.status) ?? (source === 'outreach' ? 'no_response' : 'pending');
  const brief =
    source === 'contact' ? str(row.message) : source === 'quote' ? str(row.project_details) : str(row.notes);
  const explicitCampaign = str(row.campaign);
  const campaign =
    explicitCampaign ?? (brief && brief.includes(MUIZENBERG_CONTEXT_MARK) ? WALK_IN_CAMPAIGN : null);

  return {
    key: `${source}:${id}`,
    id,
    source,
    name: source === 'outreach' ? str(row.contact_person) ?? str(row.organisation) ?? 'Unknown' : str(row.name) ?? 'Unknown',
    org:
      source === 'outreach'
        ? str(row.organisation)
        : source === 'contact'
          ? str(row.organization)
          : str(row.company),
    email: source === 'outreach' ? str(row.contact_email) : str(row.email),
    phone: str(row.phone),
    service: source === 'contact' ? str(row.service) : source === 'quote' ? str(row.service_type) : str(row.programme),
    brief,
    status,
    stage: stageForStatus(status),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    lastContacted: str(row.last_contacted),
    followUpDue: str(row.follow_up_due),
    campaign,
    assignedTo: str(row.assigned_to) ?? str(row.owner_id),
    raw: row,
  };
};

/** "3 hours", "2 days", for the age of a lead. */
export const ageLabel = (iso: string): string =>
  formatDistanceToNowStrict(new Date(iso), { addSuffix: false });

export const daysSince = (iso: string | null, now = new Date()): number | null =>
  iso ? differenceInCalendarDays(now, new Date(iso)) : null;

/** A follow-up is due when its date is today or has passed. */
export const followUpDue = (lead: PipelineLead, now = new Date()): boolean => {
  if (!lead.followUpDue) return false;
  if (lead.stage === 'won' || lead.stage === 'lost' || lead.stage === 'archived') return false;
  return !isBefore(startOfDay(now), startOfDay(new Date(lead.followUpDue)));
};

export const isMuizenberg = (lead: PipelineLead): boolean => lead.campaign === WALK_IN_CAMPAIGN;

export interface PipelineSummary {
  byStage: Record<Stage, number>;
  needsReply: number;
  followUps: number;
  muizenberg: number;
  wonThisWeek: number;
}

export const summarise = (leads: PipelineLead[], now = new Date()): PipelineSummary => {
  const byStage = Object.fromEntries(STAGES.map((s) => [s.id, 0])) as Record<Stage, number>;
  let followUps = 0;
  let muizenberg = 0;
  let wonThisWeek = 0;
  for (const lead of leads) {
    byStage[lead.stage] += 1;
    if (followUpDue(lead, now)) followUps += 1;
    if (isMuizenberg(lead)) muizenberg += 1;
    if (lead.stage === 'won') {
      const d = daysSince(String(lead.raw.updated_at ?? lead.createdAt), now);
      if (d !== null && d <= 7) wonThisWeek += 1;
    }
  }
  return { byStage, needsReply: byStage.new, followUps, muizenberg, wonThisWeek };
};

/** Oldest first: the lead that has waited longest is the one to answer first. */
export const oldestFirst = (a: PipelineLead, b: PipelineLead): number =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

export const newestFirst = (a: PipelineLead, b: PipelineLead): number => -oldestFirst(a, b);
