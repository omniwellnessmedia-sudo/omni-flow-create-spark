import { useEffect } from "react";
import { useSEO } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { BWC_TEAM, EXTERNAL_PARTNERS, type TeamMember } from "./bwcTeamData";

/**
 * BWC "Meet the Team" — CONTROLLED STAGING PAGE. NOT FOR PUBLICATION.
 *
 * Built to Chad Cupido's 2 Aug instruction: prepare only the cleared material
 * on staging, publish nothing until he has reviewed the completed page and
 * given final written approval.
 *
 * Deliberate properties, each one load-bearing:
 *  - noindex, nofollow, and no route in the nav or sitemap. It is reachable
 *    only by someone holding the link.
 *  - Only the two photographs the register marks APPROVED are rendered. The
 *    nine review-only fallbacks were never copied into the repo.
 *  - Everyone else appears as a name plus their outstanding items, with NO
 *    photograph and NO inferred title. Chad: "Please do not infer missing
 *    titles, qualifications, roles or biographical information."
 *  - Two separate sections, because Tumelo, Zenith and Feroza must not be
 *    presented as BWC committee members or part of BWC governance.
 *  - No Omni Wellness Media or Dr Phil Afel Foundation logos, pending
 *    organisation-level logo permission.
 *  - Each rendered photograph prints its exact source filename, because Chad
 *    asked to be sent "the exact photograph filename used for each person".
 */

const StatusPill = ({ status }: { status: string }) => {
  const tone =
    status.startsWith("Ready") ? "bg-emerald-50 text-emerald-800 border-emerald-200"
    : status === "Do not publish" ? "bg-red-50 text-red-800 border-red-200"
    : "bg-amber-50 text-amber-900 border-amber-200";
  return (
    <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium", tone)}>
      {status}
    </span>
  );
};

const MemberCard = ({ m }: { m: TeamMember }) => (
  <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-start gap-5">
      {m.photo ? (
        <img
          src={m.photo}
          alt={`${m.name}, ${m.title ?? "profile photograph"}`}
          width={128}
          height={128}
          loading="lazy"
          decoding="async"
          className="h-32 w-32 shrink-0 rounded-lg object-cover"
        />
      ) : (
        /* No placeholder face, no silhouette, no initial-avatar. An absent
           photograph is a fact the reviewer needs to see, not a gap to fill. */
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-2 text-center text-[11px] leading-tight text-gray-500">
          No approved photograph
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-semibold text-gray-900">{m.name}</h3>
        {m.title ? (
          <p className="mt-1 text-sm text-gray-700">
            {m.title}
            {m.titleCaveat && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] text-amber-900">
                {m.titleCaveat}
              </span>
            )}
          </p>
        ) : (
          <p className="mt-1 text-sm italic text-gray-500">Public title not yet approved</p>
        )}
        <div className="mt-2"><StatusPill status={m.status} /></div>
      </div>
    </div>

    {m.intro && (
      <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-gray-800">
        {m.intro.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    )}

    {m.profile && (
      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-primary">Read more</summary>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-gray-700">
          {m.profile.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </details>
    )}

    {m.statement && (
      <blockquote className="mt-4 border-l-2 border-gray-300 pl-4 text-[15px] italic leading-relaxed text-gray-700">
        {m.statement}
      </blockquote>
    )}

    {m.focus && (
      <p className="mt-4 text-sm text-gray-600">
        <span className="font-medium text-gray-800">Focus:</span> {m.focus}
      </p>
    )}

    {/* Staging-only metadata. Chad asked for the exact filename per person and
        a list of what is still missing; both are on the page so the review can
        happen without cross-referencing a spreadsheet. */}
    <div className="mt-5 space-y-1.5 rounded-lg bg-gray-50 p-3 text-[12.5px] text-gray-600">
      {m.photoSource && (
        <p><span className="font-medium text-gray-800">Photograph file:</span> <code className="break-all">{m.photoSource}</code></p>
      )}
      {m.outstanding && (
        <p><span className="font-medium text-gray-800">Outstanding:</span> {m.outstanding}</p>
      )}
      {!m.photoSource && !m.outstanding && <p>No outstanding items recorded.</p>}
    </div>
  </article>
);

const BwcTeamStaging = () => {
  useSEO({
    title: "BWC Meet the Team — controlled staging (not for publication)",
    description: "Controlled staging page for review. Not published.",
    canonical: "https://omniwellnessmedia.co.za/bwc-team-staging",
  });

  // Belt and braces: this page must never be indexed, and useSEO does not
  // manage the robots tag. Removed on unmount so it cannot leak to other routes.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, []);

  const approvedCount = BWC_TEAM.filter((m) => m.photo).length;
  const totalPeople = BWC_TEAM.length + EXTERNAL_PARTNERS.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unmissable staging banner. This page holds real people's photographs
          and biographies that are not cleared for publication. */}
      <div className="bg-amber-500 px-4 py-3 text-center text-[13.5px] font-medium text-amber-950">
        CONTROLLED STAGING — NOT FOR PUBLICATION. For Chad Cupido's review only.
        Nothing on this page may go live until written approval is given.
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Beauty Without Cruelty South Africa</h1>
          <p className="mt-2 text-lg text-gray-700">Meet the Team — staging review</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
            Prepared from the Consolidated Meet the Team Website Pack dated 2 August 2026. All
            copy is transcribed verbatim from the pack's approved fields. Nothing has been
            inferred, summarised or supplied from another source.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-5 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-gray-500">People in scope</dt>
              <dd className="mt-0.5 text-xl font-semibold text-gray-900">{totalPeople}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Approved photographs</dt>
              <dd className="mt-0.5 text-xl font-semibold text-gray-900">{approvedCount}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Awaiting items</dt>
              <dd className="mt-0.5 text-xl font-semibold text-gray-900">{totalPeople - approvedCount}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Published</dt>
              <dd className="mt-0.5 text-xl font-semibold text-gray-900">0</dd>
            </div>
          </dl>

          <p className="mt-4 rounded-lg border border-gray-200 bg-white p-4 text-[13px] leading-relaxed text-gray-600">
            Only the two photographs marked APPROVED in the pack's image register are shown —
            Heather Howe and Zaahira Mahomed, both supplied directly by the person. The nine
            <span className="mx-1 font-mono text-[12px]">ORIGINAL_PROPOSAL_REVIEW_IMAGE</span>
            fallbacks are review-only under the register and have deliberately not been added to
            the site at all. No organisation logos are displayed, pending organisation-level logo
            permission.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">Executive Officer and BWC Team</h2>
          <div className="mt-5 space-y-5">
            {BWC_TEAM.map((m) => <MemberCard key={m.name} m={m} />)}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">External Partner Team</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-600">
            Tumelo Ncube, Zenith Yassin and Feroza Begg are external partners. They are not BWC
            committee members, directors, employees, or part of BWC governance.
          </p>
          <div className="mt-5 space-y-5">
            {EXTERNAL_PARTNERS.map((m) => <MemberCard key={m.name} m={m} />)}
          </div>
        </section>

        <footer className="mt-12 rounded-xl border border-gray-200 bg-white p-6 text-[13.5px] leading-relaxed text-gray-600">
          <h2 className="text-base font-semibold text-gray-900">Still required before anything is published</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>Chad's written approval of this completed staging page.</li>
            <li>Chad's own profile copy, final image choice and self-approval.</li>
            <li>Governance confirmation of Janneke's and Zaahira's public titles.</li>
            <li>Reconfirmation from Toni that her profile should be restored, and her current approved role.</li>
            <li>Exact final images approved by Beryl and Carol.</li>
            <li>Laureen's answers, photograph and written publication permission.</li>
            <li>Tumelo's original high-resolution photograph.</li>
            <li>Affiliation checks and exact file matching for Zenith and Feroza.</li>
            <li>Organisation-level logo permission before any Omni or Dr Phil Afel Foundation logo appears.</li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default BwcTeamStaging;
