import { useMemo } from "react";
import { format, subDays, eachDayOfInterval, subMonths } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, BarChart2, Calendar } from "lucide-react";
import ProUpgradeCard from "./ProUpgradeCard";

interface AnalyticsDashboardProps {
  transactions: any[];
  bookings: any[];
  services: any[];
  isPro: boolean;
}

const TEASER_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "dd MMM"),
  revenue: Math.round(800 + Math.sin(i / 4) * 400 + Math.random() * 300),
}));

const TEASER_SERVICES = [
  { title: "Sound Healing Session", bookings: 12 },
  { title: "Reiki Treatment", bookings: 9 },
  { title: "Meditation Class", bookings: 7 },
];

const AnalyticsDashboard = ({ transactions, bookings, services, isPro }: AnalyticsDashboardProps) => {
  const revenueLast30 = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const earned = transactions
        .filter(
          (t) =>
            t.transaction_type === "earning" &&
            t.amount_zar > 0 &&
            t.created_at?.startsWith(dayStr)
        )
        .reduce((sum: number, t: any) => sum + (t.amount_zar || 0), 0);
      return { date: format(day, "dd MMM"), revenue: earned };
    });
  }, [transactions]);

  const topServices = useMemo(() => {
    const counts: Record<string, { title: string; bookings: number; revenue: number }> = {};
    bookings.forEach((b) => {
      const title = b.services?.title || "Session";
      const id = b.service_id;
      if (!counts[id]) counts[id] = { title, bookings: 0, revenue: 0 };
      counts[id].bookings++;
      counts[id].revenue += b.amount_zar || 0;
    });
    return Object.values(counts)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, [bookings]);

  const totalRevenue = useMemo(
    () => revenueLast30.reduce((s, d) => s + d.revenue, 0),
    [revenueLast30]
  );

  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.status === "confirmed").length,
    [bookings]
  );
  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "pending").length,
    [bookings]
  );
  const cancelledBookings = useMemo(
    () => bookings.filter((b) => b.status === "cancelled").length,
    [bookings]
  );
  const avgBookingValue = confirmedBookings > 0 ? Math.round(totalRevenue / confirmedBookings) : 0;

  const now = new Date();
  const prevMonthEarnings = useMemo(() => {
    const start = subMonths(now, 1);
    return transactions
      .filter((t) => {
        const d = new Date(t.created_at);
        return (
          d.getMonth() === start.getMonth() &&
          d.getFullYear() === start.getFullYear() &&
          t.transaction_type === "earning"
        );
      })
      .reduce((s: number, t: any) => s + (t.amount_zar || 0), 0);
  }, [transactions]);

  const growth =
    prevMonthEarnings > 0
      ? ((totalRevenue - prevMonthEarnings) / prevMonthEarnings) * 100
      : 0;

  if (!isPro) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Blurred teaser */}
          <div className="blur-sm pointer-events-none select-none opacity-60 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["R12,450", "47", "R265", "+23%"].map((v, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {["Revenue (30d)", "Total Bookings", "Avg Value", "Growth"][i]}
                    </p>
                    <p className="font-heading text-2xl">{v}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Revenue — last 30 days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TEASER_DATA}>
                      <defs>
                        <linearGradient id="teaserGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(180,50%,40%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(180,50%,40%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(180,50%,40%)"
                        fill="url(#teaserGrad)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={TEASER_SERVICES} layout="vertical">
                      <Bar dataKey="bookings" fill="hsl(180,50%,40%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-4">
            <div className="w-full max-w-sm">
              <ProUpgradeCard featureName="Business Analytics" compact />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Revenue (30d)",
            value: `R${totalRevenue.toLocaleString()}`,
            delta:
              growth !== 0
                ? `${growth > 0 ? "+" : ""}${growth.toFixed(1)}% vs last month`
                : null,
            up: growth >= 0,
          },
          {
            label: "Total Bookings",
            value: bookings.length,
            delta: pendingBookings > 0 ? `${pendingBookings} pending` : "All actioned",
            up: pendingBookings === 0,
          },
          {
            label: "Confirmed",
            value: confirmedBookings,
            delta: null,
            up: null,
          },
          {
            label: "Avg Booking Value",
            value: `R${avgBookingValue}`,
            delta: null,
            up: null,
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <p className="font-heading text-2xl">{kpi.value}</p>
              {kpi.delta && (
                <p
                  className={`text-xs mt-1.5 flex items-center gap-1 ${
                    kpi.up ? "text-green-600" : "text-muted-foreground"
                  }`}
                >
                  {kpi.up ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {kpi.delta}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Revenue — last 30 days
          </CardTitle>
          <CardDescription className="text-xs">
            Daily ZAR earnings from completed bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueLast30}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(180,50%,40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(180,50%,40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R${v}`}
                />
                <Tooltip
                  formatter={(v: number) => [`R${v}`, "Revenue"]}
                  labelStyle={{ fontSize: 11 }}
                  contentStyle={{ fontSize: 11 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(180,50%,40%)"
                  fill="url(#revenueGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Booking status */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Booking Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Pending", count: pendingBookings, cls: "bg-amber-50 text-amber-700 border-amber-100" },
                { label: "Confirmed", count: confirmedBookings, cls: "bg-green-50 text-green-700 border-green-100" },
                { label: "Cancelled", count: cancelledBookings, cls: "bg-red-50 text-red-600 border-red-100" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border p-3 ${s.cls}`}>
                  <div className="font-heading text-2xl">{s.count}</div>
                  <div className="text-xs">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Conversion rate:{" "}
              {bookings.length > 0
                ? `${Math.round((confirmedBookings / bookings.length) * 100)}%`
                : "—"}
            </p>
          </CardContent>
        </Card>

        {/* Top services */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Services</CardTitle>
            <CardDescription className="text-xs">By number of bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {topServices.length > 0 ? (
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topServices}
                    layout="vertical"
                    margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      tick={{ fontSize: 9 }}
                      width={110}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar
                      dataKey="bookings"
                      fill="hsl(180,50%,40%)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                Service data will appear after your first bookings.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
