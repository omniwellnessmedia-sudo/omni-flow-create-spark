import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Info } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  desc: string;
  cadence: 'monthly' | 'quarterly' | 'annual';
}

// Curated SA-specific accounting best-practice tasks. Drives the daily/monthly
// workflow Steven works through. Persists locally per-browser; not synced
// (intentional — operator scratchpad, not a system of record).
const TASKS: Task[] = [
  { id: 'recon-bank',       title: 'Reconcile bank statements',           desc: 'Match Xero transactions against Standard Bank statements for every entity.',                  cadence: 'monthly' },
  { id: 'recon-paypal',     title: 'Reconcile PayPal and Stripe',         desc: 'ROAM eSIM revenue flows via PayPal/Stripe — confirm processor fees match Xero entries.',     cadence: 'monthly' },
  { id: 'invoice-xero',     title: "Import month's sales into Xero",      desc: "Use Export for Xero above → import file in Xero → Sales Invoices. Tag tracking category 'Entity'.", cadence: 'monthly' },
  { id: 'vat-201',          title: 'Prepare VAT201 return',                desc: 'SARS monthly cycle. Cross-check OUTPUT2 (15%) against total taxable revenue per entity.',     cadence: 'monthly' },
  { id: 'provider-payouts', title: 'Process provider payouts',             desc: 'Calculate provider commission, issue payout statements, settle by EFT.',                     cadence: 'monthly' },
  { id: 's18a',             title: 'Issue Section 18A donation receipts',  desc: 'Dr. Phil-afel Foundation donors who claimed tax deduction. Use S18A template.',               cadence: 'monthly' },
  { id: 'review-deferred',  title: 'Review deferred revenue (tours)',      desc: 'Tour bookings paid in advance — only recognise revenue once the tour runs.',                  cadence: 'monthly' },

  { id: 'csr-impact',       title: 'Update CSR / B-BBEE ED tracker',       desc: 'Tag any corporate retreats with B-BBEE ED/CSI category for client SED scorecards.',           cadence: 'quarterly' },
  { id: 'inter-entity',     title: 'Settle inter-entity loan accounts',    desc: 'Cross-billing between Omni / Foundation / TNT — clear month-end balances.',                  cadence: 'quarterly' },
  { id: 'tax-prov',         title: 'Update tax provisional schedule',      desc: 'Adjust Omni + ROAM provisional tax (IRP6) based on YTD performance.',                         cadence: 'quarterly' },
  { id: 'affiliate-1099',   title: 'Affiliate income — withholding check', desc: 'CJ / Awin commissions in USD/EUR — verify SARS exchange rate used + any withholding tax.',   cadence: 'quarterly' },

  { id: 'ye-stocktake',     title: 'Stock take (2BeWell products)',        desc: 'Year-end physical count vs Xero inventory.',                                                  cadence: 'annual' },
  { id: 'ye-section18a',    title: 'Section 18A bulk certificates',        desc: 'Foundation annual recipients summary submitted to SARS.',                                     cadence: 'annual' },
];

const STORAGE_KEY = 'omni-accounting-checklist';

function loadChecks(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export function AccountingChecklist() {
  const [checks, setChecks] = useState<Record<string, string>>({});

  useEffect(() => { setChecks(loadChecks()); }, []);

  const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
  const quarterKey = `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`;
  const yearKey = String(new Date().getFullYear());

  function periodKey(cadence: Task['cadence']) {
    if (cadence === 'monthly') return monthKey;
    if (cadence === 'quarterly') return quarterKey;
    return yearKey;
  }

  function toggle(task: Task) {
    const k = `${task.id}:${periodKey(task.cadence)}`;
    const stamp = checks[k] ? '' : new Date().toISOString();
    const next = { ...checks, [k]: stamp };
    setChecks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const monthly = TASKS.filter(t => t.cadence === 'monthly');
  const quarterly = TASKS.filter(t => t.cadence === 'quarterly');
  const annual = TASKS.filter(t => t.cadence === 'annual');
  const monthlyDone = monthly.filter(t => checks[`${t.id}:${monthKey}`]).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Best-Practice Checklist</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              SA-specific monthly / quarterly accounting workflow. Persists per browser.
            </p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{monthlyDone} / {monthly.length} this month</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Section title="Monthly" tasks={monthly} checks={checks} periodKey={periodKey} onToggle={toggle} />
        <Section title="Quarterly" tasks={quarterly} checks={checks} periodKey={periodKey} onToggle={toggle} />
        <Section title="Annual" tasks={annual} checks={checks} periodKey={periodKey} onToggle={toggle} />
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            Items persist in this browser only. For multi-user coordination, mirror them in a shared task board.
            Account codes shown in Revenue Streams are suggested defaults — confirm against your chart of accounts in Xero.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, tasks, checks, periodKey, onToggle }: {
  title: string;
  tasks: Task[];
  checks: Record<string, string>;
  periodKey: (c: Task['cadence']) => string;
  onToggle: (t: Task) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
      <div className="space-y-2">
        {tasks.map(t => {
          const done = !!checks[`${t.id}:${periodKey(t.cadence)}`];
          return (
            <button
              type="button"
              onClick={() => onToggle(t)}
              key={t.id}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${done ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/40'}`}
            >
              <div className="flex items-start gap-3">
                {done
                  ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  : <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
