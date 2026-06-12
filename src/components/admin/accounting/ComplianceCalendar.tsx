import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, AlertCircle, CheckCircle2 } from "lucide-react";
import { addDays, addMonths, differenceInCalendarDays, endOfMonth, format, isAfter, isBefore, setDate, setMonth, startOfMonth } from "date-fns";

/**
 * ComplianceCalendar — at-a-glance SA-specific upcoming deadlines for Steve.
 *
 * This is intentionally derived from the current date (no DB write yet) so it's
 * always live. Each rule below has a `nextDue(today)` that returns the next
 * occurrence. Once Steve has used it for a month and tells us which dates need
 * tweaking per-entity, we promote this to a `compliance_events` table with
 * per-entity overrides and a "mark filed" workflow.
 */

type Cadence = "monthly" | "bi-monthly" | "annual" | "every-4-months";
type Scope = "all" | "commercial" | "npc" | "tourism";

interface Rule {
  id: string;
  title: string;
  authority: string;          // SARS / CIPC / DSD / etc.
  cadence: Cadence;
  scope: Scope;
  // Returns the next due date on or after `today`.
  nextDue: (today: Date) => Date;
  note?: string;
}

// SA rules. Dates follow SARS published cycles. Tighten with Steve's input.
const RULES: Rule[] = [
  {
    id: "vat201",
    title: "VAT201 return",
    authority: "SARS",
    cadence: "bi-monthly",
    scope: "commercial",
    // VAT201 is due on the last business day of the month following the VAT period.
    // Approximation: end of next month if we're past mid-month, else end of this month.
    nextDue: (today) => {
      const eom = endOfMonth(today);
      // If less than 7 days to month-end, roll to next month-end
      return differenceInCalendarDays(eom, today) < 7 ? endOfMonth(addMonths(today, 1)) : eom;
    },
    note: "Cross-check OUTPUT2 (15%) against taxable revenue per entity.",
  },
  {
    id: "paye",
    title: "EMP201 (PAYE/UIF/SDL)",
    authority: "SARS",
    cadence: "monthly",
    scope: "commercial",
    // EMP201 due 7th of the following month.
    nextDue: (today) => {
      const seventh = setDate(today, 7);
      return isAfter(today, seventh) ? setDate(addMonths(today, 1), 7) : seventh;
    },
  },
  {
    id: "irp6",
    title: "IRP6 provisional tax",
    authority: "SARS",
    cadence: "every-4-months",
    scope: "commercial",
    // Two IRP6 periods/year: end of Aug, end of Feb. Plus optional 3rd in Sep.
    nextDue: (today) => {
      const candidates = [
        endOfMonth(setMonth(today, 7)),  // Aug
        endOfMonth(setMonth(today, 1)),  // Feb
        endOfMonth(setMonth(today, 8)),  // Sep (3rd top-up)
      ].map((d) => (isBefore(d, today) ? endOfMonth(setMonth(addMonths(d, 12), d.getMonth())) : d));
      return candidates.sort((a, b) => a.getTime() - b.getTime())[0];
    },
  },
  {
    id: "npc-ar",
    title: "NPO Annual Return",
    authority: "DSD",
    cadence: "annual",
    scope: "npc",
    // Due 9 months after financial year-end. Assume Feb FYE (common) → Nov 30.
    nextDue: (today) => {
      const candidate = new Date(today.getFullYear(), 10, 30); // 30 Nov
      return isBefore(candidate, today) ? new Date(today.getFullYear() + 1, 10, 30) : candidate;
    },
    note: "Foundation. Pair with S18A bulk certificate summary.",
  },
  {
    id: "s18a-bulk",
    title: "Section 18A bulk certificates",
    authority: "SARS",
    cadence: "annual",
    scope: "npc",
    nextDue: (today) => {
      // Annual S18A summary to SARS — typical deadline 31 May (tax year end Feb).
      const candidate = new Date(today.getFullYear(), 4, 31);
      return isBefore(candidate, today) ? new Date(today.getFullYear() + 1, 4, 31) : candidate;
    },
    note: "Foundation donors who claimed tax deduction.",
  },
  {
    id: "bbbee",
    title: "B-BBEE certificate renewal",
    authority: "verification agency",
    cadence: "annual",
    scope: "commercial",
    // Renew on each company's anniversary; placeholder: 1 yr from "today" for first run.
    nextDue: (today) => addMonths(startOfMonth(today), 12),
    note: "Anchor to certificate issue date once captured.",
  },
  {
    id: "cipc-ar",
    title: "CIPC annual return",
    authority: "CIPC",
    cadence: "annual",
    scope: "commercial",
    nextDue: (today) => addMonths(today, 11), // anniversary of incorporation; tune per entity
    note: "Per company anniversary date; tune per entity once captured.",
  },
];

const SCOPE_LABEL: Record<Scope, string> = {
  all: "All",
  commercial: "Commercial",
  npc: "Foundation",
  tourism: "Tourism",
};

function statusFor(daysOut: number): { tone: "danger" | "warn" | "ok"; label: string; icon: typeof AlertCircle } {
  if (daysOut < 0) return { tone: "danger", label: "Overdue", icon: AlertCircle };
  if (daysOut <= 7) return { tone: "danger", label: `${daysOut}d`, icon: AlertCircle };
  if (daysOut <= 30) return { tone: "warn", label: `${daysOut}d`, icon: CalendarClock };
  return { tone: "ok", label: `${daysOut}d`, icon: CheckCircle2 };
}

export function ComplianceCalendar({ entityType }: { entityType?: Scope }) {
  const today = useMemo(() => new Date(), []);
  const rows = useMemo(() => {
    const filtered = entityType
      ? RULES.filter((r) => r.scope === "all" || r.scope === entityType)
      : RULES;
    return filtered
      .map((r) => {
        const due = r.nextDue(today);
        return { ...r, due, daysOut: differenceInCalendarDays(due, today) };
      })
      .sort((a, b) => a.daysOut - b.daysOut);
  }, [today, entityType]);

  const next30 = rows.filter((r) => r.daysOut <= 30 && r.daysOut >= 0).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Compliance Calendar
            </CardTitle>
            <CardDescription className="text-xs">
              SA filings &amp; renewals across SARS / CIPC / DSD. Static rules for v1 — Steve's overrides land in a per-entity table next.
            </CardDescription>
          </div>
          <Badge variant={next30 > 0 ? "destructive" : "secondary"} className="shrink-0">
            {next30} due in 30d
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => {
          const s = statusFor(r.daysOut);
          const Icon = s.icon;
          return (
            <div key={r.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{r.title}</p>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    {r.authority}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {SCOPE_LABEL[r.scope]}
                  </Badge>
                </div>
                {r.note && <p className="text-xs text-muted-foreground mt-1">{r.note}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{format(r.due, "d MMM yyyy")}</p>
                <span
                  className={
                    "inline-flex items-center gap-1 text-xs font-medium mt-1 " +
                    (s.tone === "danger" ? "text-destructive" : s.tone === "warn" ? "text-amber-600" : "text-muted-foreground")
                  }
                >
                  <Icon className="h-3 w-3" />
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default ComplianceCalendar;
