import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowUpRight, ArrowDownRight, Coins, DollarSign } from "lucide-react";
import ProUpgradeCard from "./ProUpgradeCard";

interface FinancialDashboardProps {
  transactions: any[];
  isPro: boolean;
}

const FinancialDashboard = ({ transactions, isPro }: FinancialDashboardProps) => {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTxns = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.created_at);
        return d >= thisMonthStart && t.transaction_type === "earning";
      }),
    [transactions]
  );

  const lastMonthTxns = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.created_at);
        return d >= lastMonthStart && d <= lastMonthEnd && t.transaction_type === "earning";
      }),
    [transactions]
  );

  const thisMonthZar = useMemo(
    () => thisMonthTxns.reduce((s, t) => s + (t.amount_zar || 0), 0),
    [thisMonthTxns]
  );
  const lastMonthZar = useMemo(
    () => lastMonthTxns.reduce((s, t) => s + (t.amount_zar || 0), 0),
    [lastMonthTxns]
  );
  const thisMonthWC = useMemo(
    () => thisMonthTxns.reduce((s, t) => s + (t.amount_wellcoins || 0), 0),
    [thisMonthTxns]
  );

  const growth =
    lastMonthZar > 0
      ? ((thisMonthZar - lastMonthZar) / lastMonthZar) * 100
      : 0;
  const isGrowth = growth >= 0;

  const allTimeZar = useMemo(
    () =>
      transactions
        .filter((t) => t.transaction_type === "earning" && (t.amount_zar || 0) > 0)
        .reduce((s, t) => s + t.amount_zar, 0),
    [transactions]
  );
  const allTimeWC = useMemo(
    () =>
      transactions
        .filter((t) => t.transaction_type === "earning" && (t.amount_wellcoins || 0) > 0)
        .reduce((s, t) => s + t.amount_wellcoins, 0),
    [transactions]
  );

  const pieData = useMemo(() => {
    const result = [];
    if (allTimeZar > 0) result.push({ name: "ZAR", value: allTimeZar, fill: "hsl(180,50%,40%)" });
    if (allTimeWC > 0) result.push({ name: "WellCoins", value: allTimeWC, fill: "hsl(25,95%,53%)" });
    return result;
  }, [allTimeZar, allTimeWC]);

  const handleExport = () => {
    const rows = [
      "Date,Description,ZAR,WellCoins,Type,Status",
      ...transactions.map(
        (t) =>
          `${new Date(t.created_at).toLocaleDateString("en-ZA")},` +
          `"${(t.description || t.transaction_type).replace(/"/g, '""')}",` +
          `${t.amount_zar || 0},${t.amount_wellcoins || 0},` +
          `${t.transaction_type},${t.status}`
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omni-financials-${format(now, "yyyy-MM")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isPro) {
    return (
      <div className="relative rounded-2xl overflow-hidden min-h-[560px]">
        <div className="blur-sm pointer-events-none select-none opacity-60 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="font-heading text-3xl">R4,250</p>
                <p className="text-xs text-green-600 mt-1.5">+23% vs last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">Last Month</p>
                <p className="font-heading text-3xl text-muted-foreground">R3,450</p>
                <p className="text-xs text-muted-foreground mt-1.5">14 transactions</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-28 w-28 rounded-full bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-sm">
            <ProUpgradeCard featureName="Financial Suite" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Monthly comparison */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">{format(now, "MMMM yyyy")}</p>
            </div>
            <p className="font-heading text-3xl">R{thisMonthZar.toLocaleString()}</p>
            {lastMonthZar > 0 && (
              <p
                className={`text-xs mt-2 flex items-center gap-1 font-medium ${
                  isGrowth ? "text-green-600" : "text-red-500"
                }`}
              >
                {isGrowth ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(growth).toFixed(1)}% vs last month
              </p>
            )}
            {thisMonthWC > 0 && (
              <p className="text-xs text-primary mt-1 flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {thisMonthWC} WellCoins earned
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {format(subMonths(now, 1), "MMMM yyyy")}
              </p>
            </div>
            <p className="font-heading text-3xl text-muted-foreground">
              R{lastMonthZar.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {lastMonthTxns.length} transaction
              {lastMonthTxns.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue mix */}
      {pieData.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Mix</CardTitle>
            <CardDescription className="text-xs">
              ZAR vs WellCoin earnings (all time)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="h-32 w-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [v.toLocaleString(), ""]}
                    contentStyle={{ fontSize: 11 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ background: d.fill }}
                  />
                  <span className="text-sm flex-1">{d.name}</span>
                  <span className="font-medium text-sm">{d.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                All-time total: R{allTimeZar.toLocaleString()} + {allTimeWC} WC
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction history with export */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Transaction History</CardTitle>
              <CardDescription className="text-xs">All earnings and payments</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleExport}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">
                      {t.description || t.transaction_type}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(t.created_at), "dd MMM yyyy")} ·{" "}
                      {t.transaction_type}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3 space-y-0.5">
                    {(t.amount_zar || 0) > 0 && (
                      <p className="text-sm font-medium text-green-600">
                        +R{t.amount_zar.toLocaleString()}
                      </p>
                    )}
                    {(t.amount_wellcoins || 0) > 0 && (
                      <p className="text-xs text-primary">
                        +{t.amount_wellcoins} WC
                      </p>
                    )}
                    <Badge variant="outline" className="text-[9px]">
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10 text-sm">
              No transactions yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
