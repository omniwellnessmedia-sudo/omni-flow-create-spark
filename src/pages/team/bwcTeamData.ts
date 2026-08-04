/**
 * BWC "Meet the Team" — controlled staging data.
 *
 * SOURCE OF TRUTH: BWC_Meet_the_Team_Consolidated_Website_Pack_2026-08-02.md,
 * supplied by Chad Cupido (Executive Officer, BWC South Africa) on 2 Aug 2026.
 *
 * THE PACK'S OWN FIRST PAGE SAYS: "Review pack only. This document is not
 * permission to publish." Chad's covering email: "prepare only the cleared
 * material on staging. Nothing should be published until I have reviewed the
 * completed staging page and given final written approval."
 *
 * RULES ENCODED HERE — do not relax any of them without written approval:
 *
 *  1. PHOTOGRAPHS. Only the two files the register marks APPROVED appear. Both
 *     are scoped to controlled staging: Heather's entry reads "Approved source
 *     image for controlled staging"; Zaahira's reads "Approved image, subject
 *     to final governance title confirmation". The nine
 *     ORIGINAL_PROPOSAL_REVIEW_IMAGE fallbacks are not in this repo at all —
 *     the surest way never to publish a review image is for it never to exist
 *     in a deployable directory.
 *
 *  2. COPY IS VERBATIM. Every title, introduction, profile and statement below
 *     is transcribed exactly from the pack's "Approved" fields. Nothing is
 *     summarised, and nothing is inferred. Where the pack does not give a
 *     value, the field is absent and the page shows the person as pending —
 *     per Chad: "Please do not infer missing titles, qualifications, roles or
 *     biographical information."
 *
 *  3. GOVERNANCE. Tumelo Ncube, Zenith Yassin and Feroza Begg are EXTERNAL
 *     PARTNERS. The pack: "They must not be described as BWC committee
 *     members, directors, employees or members of BWC governance." They sit in
 *     their own section for that reason.
 *
 *  4. TITLES UNDER CHECK. Zaahira's approved title carries "subject to
 *     governance confirmation" in the pack, because older records call her a
 *     Nominated Board Member. That caveat is rendered on the page rather than
 *     hidden. Janneke's title has the same open question.
 *
 *  5. LAUREEN BERTIN. Register decision: "Do not publish." Answers, photograph
 *     and written permission all outstanding. Listed as pending only.
 *
 *  6. NO ORGANISATION LOGOS. Chad: "Please do not display the Omni Wellness
 *     Media or Dr Phil Afel Foundation logos until organisation level logo
 *     permission has been confirmed."
 */

export interface TeamMember {
  name: string;
  /** Verbatim from the pack's "Approved public title". Absent = not approved. */
  title?: string;
  /** Rendered next to the title when the pack flags an open governance check. */
  titleCaveat?: string;
  /** Verbatim "Approved short introduction", split into paragraphs. */
  intro?: string[];
  /** Verbatim "Approved Read More profile", split into paragraphs. */
  profile?: string[];
  /** Verbatim "Approved personal statement". */
  statement?: string;
  focus?: string;
  /** Optimised copy of the file the register marks APPROVED. */
  photo?: string;
  /** The exact source filename, so Chad can verify the mapping. */
  photoSource?: string;
  /** Register "Current decision" — shown on staging so review is possible. */
  status: string;
  /** What is still outstanding for this person, verbatim in substance. */
  outstanding?: string;
}

export const BWC_TEAM: TeamMember[] = [
  {
    name: "Chad Cupido",
    status: "Hold for Chad",
    outstanding:
      "Self-approval and final image choice. The attached image is the original proposal review image and is review-only until Chad approves the exact image.",
  },
  {
    name: "Janneke Blake",
    status: "Conditional",
    outstanding:
      "Governance title to be confirmed. Janneke approved the public title Chairperson, but the records do not contain one conclusive signed governance resolution. An unapproved measurable outcome must be added or omitted.",
  },
  {
    name: "Toni Brockhoven",
    status: "Conditional",
    outstanding:
      "A later website status records that public references to Toni were removed at her request. Reconfirm that she wants this profile restored, and that Senior Advisor remains her current approved public role.",
  },
  {
    name: "Beryl Scott",
    status: "Conditional",
    outstanding: "Final photograph not confirmed as seen or approved. Match and approve the exact final image.",
  },
  {
    name: "Carol Dillon",
    status: "Conditional",
    outstanding:
      "A replacement photograph was supplied through WhatsApp with writing to be removed. The edited replacement requires final approval.",
  },
  {
    name: "Heather Howe",
    title: "Co-ordinator of Troopers",
    intro: [
      "Heather Howe co-ordinates the BWC Troopers programme, using humane education, storytelling and experiential learning to help children understand that animals are sentient beings deserving respect, care and protection.",
      "Her work helps young people develop compassion and become ambassadors who encourage others to treat animals with empathy.",
    ],
    profile: [
      "Before working with the Troopers, Heather spent eight years, from 2011 to 2018, providing humane education through storytelling at the Kwafaku Reading Group, an affiliate of Nal'ibali in Philippi East.",
      "She wrote The Five Freedoms for Animals and the Magic Minibus, published by BWC and used in schools across the Cape Peninsula.",
      "Heather holds a Bachelor of Arts degree from the University of Cape Town, majoring in Political Science and English, a Higher Diploma in Education from the University of Cape Town and an Advanced Diploma in Adult Education from the University of Natal.",
      "She organised an Animal Rights Film Festival at the Labia Theatre, which ran for one week.",
      "Heather also co-edited the adult literacy reader Beer, Songs and Quarrels, published by Natal University Press, which includes many stories about animals.",
    ],
    statement:
      "I serve animals by challenging the normalisation of animal abuse in our society: refusing to accept animal pain, neglect and suffering as 'traditional' or 'it's always been this way'. Suffering and neglect are not inevitable, normal or acceptable. Until the interests of animals are given the same legal weight as human interests, I will speak out for animals.",
    focus: "BWC Troopers and humane education.",
    photo: "/team/bwc/heather-howe.webp",
    photoSource: "Heather_Howe_APPROVED_IMG_6786_WEB_READY.jpg",
    status: "Ready for staging after image match",
    outstanding:
      "Confirm that the file mapped to Heather is the approved IMG_6786.JPG before publication.",
  },
  {
    name: "Laureen Bertin",
    status: "Do not publish",
    outstanding:
      "Complete answers, photograph and written publication permission all remain outstanding. Listed here for completeness only.",
  },
  {
    name: "Zaahira Mahomed",
    title: "Committee Member: Animal and Environmental Advocate",
    titleCaveat: "subject to governance confirmation",
    intro: [
      "Zaahira Mahomed brings a compassionate, solutions focused approach to Beauty Without Cruelty South Africa, with a particular passion for equine welfare, wildlife advocacy and ethical, sustainable living.",
      "She is committed to promoting environmental consciousness, reducing plastic pollution, encouraging responsible resource use and advocating for clean, conscious and cruelty free practices across all industries. She also brings a creative communications perspective that can help BWC develop meaningful campaigns that educate, inspire and encourage positive action for animals and the environment.",
    ],
    profile: [
      "Zaahira's advocacy is driven by the belief that animal welfare, environmental sustainability and ethical consumer choices are interconnected.",
      "Alongside her interest in horses and wildlife, she promotes awareness of environmental conservation, plastic pollution, sustainable resource use and conscious cruelty free choices.",
      "She believes lasting change is built through education, thoughtful communication and informed decisions that benefit animals, people and the planet.",
      "Zaahira brings a creative communication perspective to BWC and supports engaging, evidence based and action oriented campaigns that can reach wider audiences and encourage practical action.",
    ],
    statement:
      "I believe every animal deserves to live free from cruelty, exploitation, and unnecessary suffering. If we deserve happiness, don't animals too? My passion for animal welfare extends beyond individual species and reflects a broader commitment to protecting the natural world through ethical, sustainable and compassionate living. I hope to contribute to a future where both animals and our planet are treated with the care they deserve.",
    focus:
      "Equine welfare and protection, wildlife advocacy, environmental consciousness, sustainability, plastic pollution, ethical resource use, cruelty free practices, creative campaigns and public engagement.",
    photo: "/team/bwc/zaahira-mahomed.webp",
    photoSource: "Zaahira_Mahomed_APPROVED_IMG_3333_WEB_READY.jpg",
    status: "Conditional",
    outstanding:
      "Chad must confirm whether her formal status is Committee Member or Nominated Board Member, and approve the corresponding public title. Zaahira stated she does not have formal animal welfare qualifications — no formal qualification should be implied.",
  },
];

/** External partners. Kept in a separate list so they can never be rendered
 *  inside the BWC governance section by accident. */
export const EXTERNAL_PARTNERS: TeamMember[] = [
  {
    name: "Tumelo Ncube",
    status: "Conditional",
    outstanding:
      "External partner placement only. The original high resolution image was still outstanding in the latest verified record; request it before publication.",
  },
  {
    name: "Zenith Yassin",
    status: "Ready for staging after image match and affiliation check",
    outstanding: "External partner placement and affiliation check required. Exact file matching required.",
  },
  {
    name: "Feroza Begg",
    status: "Ready for staging after image match and affiliation check",
    outstanding: "External partner placement and affiliation check required. Exact file matching required.",
  },
];
