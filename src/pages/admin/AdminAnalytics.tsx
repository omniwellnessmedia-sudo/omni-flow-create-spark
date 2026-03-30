import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfDay, parseISO } from "date-fns";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [data, setData] = useState({
    revenueByDay: [] as { date: string; revenue: number; orders: number }[],
    leadsByDay: [] as { date: string; contacts: number; quotes: number }[],
    ordersByStatus: [] as { name: string; value: number }[],
    leadsByService: [] as { name: string; value: number }[],
    topProducts: [] as { name: string; revenue: number; count: number }[],
    summary: {
      totalRevenue: 0,
      prevRevenue: 0,
      totalOrders: 0,
      prevOrders: 0,
      totalLeads: 0,
      prevLeads: 0,
      totalSubscribers: 0,
      prevSubscribers: 0,
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const days = parseInt(period);
    const since = subDays(new Date(), days).toISOString();
    const prevSince = subDays(new Date(), days * 2).toISOString();

    try {
      const [
        ordersResult,
        prevOrdersResult,
        contactsResult,
        prevContactsResult,
        quotesResult,
        prevQuotesResult,
        subscribersResult,
        prevSubscribersResult,
      ] = await Promise.all([
        supabase.from("orders").select("*").gte("created_at", since),
        supabase.from("orders").select("amount").gte("created_at", prevSince).lt("created_at", since),
        supabase.from("contact_submissions").select("*").gte("created_at", since),
        supabase.from("contact_submissions").select("id").gte("created_at", prevSince).lt("created_at", since),
        supabase.from("service_quotes").select("*").gte("created_at", since),
        supabase.from("service_quotes").select("id").gte("created_at", prevSince).lt("created_at", since),
        supabase.from("newsletter_subscribers").select("id").gte("created_at", since).eq("confirmed", true),
        supabase.from("newsletter_subscribers").select("id").gte("created_at", prevSince).lt("created_at", since).eq("confirmed", true),
      ]);

      const orders = ordersResult.data || [];
      const contacts = contactsResult.data || [];
      const quotes = quotesResult.data || [];

      // Revenue & orders by day
      const revenueMap: Record<string, { revenue: number; orders: number }> = {};
      for (let i = 0; i < days; i++) {
        const d = format(subDays(new Date(), days - 1 - i), "MMM dd");
        revenueMap[d] = { revenue: 0, orders: 0 };
      }
      orders.forEach((o) => {
        const d = format(parseISO(o.created_at), "MMM dd");
        if (revenueMap[d]) {
          revenueMap[d].revenue += o.amount || 0;
          revenueMap[d].orders += 1;
        }
      });
      const revenueByDay = Object.entries(revenueMap).map(([date, v]) => ({ date, ...v }));

      // Leads by day
      const leadsMap: Record<string, { contacts: number; quotes: number }> = {};
      for (let i = 0; i < days; i++) {
        const d = format(subDays(new Date(), days - 1 - i), "MMM dd");
        leadsMap[d] = { contacts: 0, quotes: 0 };
      }
      contacts.forEach((c) => {
        const d = format(parseISO(c.created_at), "MMM dd");
        if (leadsMap[d]) leadsMap[d].contacts += 1;
      });
      quotes.forEach((q) => {
        const d = format(parseISO(q.created_at), "MMM dd");
        if (leadsMap[d]) leadsMap[d].quotes += 1;
      });
      const leadsByDay = Object.entries(leadsMap).map(([date, v]) => ({ date, ...v }));

      // Orders by status
      const statusCounts: Record<string, number> = {};
      orders.forEach((o) => {
        const s = o.status || "unknown";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      });
      const ordersByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

      // Leads by service
      const serviceCounts: Record<string, number> = {};
      [...contacts.map((c) => c.service), ...quotes.map((q) => q.service_type)].forEach((s) => {
        if (s) serviceCounts[s] = (serviceCounts[s] || 0) + 1;
      });
      const leadsByService = Object.entries(serviceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      // Top products
      const productMap: Record<string, { revenue: number; count: number }> = {};
      orders.forEach((o) => {
        const name = o.product_name || "Unknown";
        if (!productMap[name]) productMap[name] = { revenue: 0, count: 0 };
        productMap[name].revenue += o.amount || 0;
        productMap[name].count += 1;
      });
      const topProducts = Object.entries(productMap)
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Summary with comparison
      const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
      const prevRevenue = (prevOrdersResult.data || []).reduce((s: number, o: any) => s + (o.amount || 0), 0);

      setData({
        revenueByDay,
        leadsByDay,
        ordersByStatus,
        leadsByService,
        topProducts,
        summary: {
          totalRevenue,
          prevRevenue,
          totalOrders: orders.length,
          prevOrders: (prevOrdersResult.data || []).length,
          totalLeads: contacts.length + quotes.length,
          prevLeads: (prevContactsResult.data || []).length + (prevQuotesResult.data || []).length,
          totalSubscribers: (subscribersResult.data || []).length,
          prevSubscribers: (prevSubscribersResult.data || []).length,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const pctChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const TrendBadge = ({ current, previous }: { current: number; previous: number }) => {
    const pct = pctChange(current, previous);
    if (pct === 0) return <span className="text-[10px] text-muted-foreground">No change</span>;
    const up = pct > 0;
    return (
      <span className={`flex items-center gap-0.5 text-[10px] font-medium ${up ? "text-green-600" : "text-red-500"}`}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {up ? "+" : ""}{pct}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg">Analytics Overview</h3>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8" onClick={fetchAnalytics}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">Revenue</span>
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">R{data.summary.totalRevenue.toLocaleString()}</div>
            <TrendBadge current={data.summary.totalRevenue} previous={data.summary.prevRevenue} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">Orders</span>
              <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{data.summary.totalOrders}</div>
            <TrendBadge current={data.summary.totalOrders} previous={data.summary.prevOrders} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">Leads</span>
              <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{data.summary.totalLeads}</div>
            <TrendBadge current={data.summary.totalLeads} previous={data.summary.prevLeads} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">New Subscribers</span>
              <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">{data.summary.totalSubscribers}</div>
            <TrendBadge current={data.summary.totalSubscribers} previous={data.summary.prevSubscribers} />
          </CardContent>
        </Card>
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue & Orders</CardTitle>
          <CardDescription className="text-xs">Daily breakdown for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value: number, name: string) =>
                    name === "revenue" ? [`R${value.toLocaleString()}`, "Revenue"] : [value, "Orders"]
                  }
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Leads chart + breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lead Activity</CardTitle>
            <CardDescription className="text-xs">Contact submissions & quote requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.leadsByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="contacts" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Contacts" />
                  <Line type="monotone" dataKey="quotes" stroke="#f59e0b" strokeWidth={2} dot={false} name="Quotes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Leads by Service</CardTitle>
            <CardDescription className="text-xs">Which services generate the most inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            {data.leadsByService.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No service data yet</p>
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.leadsByService}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.leadsByService.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top products + order status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Products</CardTitle>
            <CardDescription className="text-xs">By revenue in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.count} orders</p>
                    </div>
                    <span className="font-bold text-sm shrink-0">R{product.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Status</CardTitle>
            <CardDescription className="text-xs">Breakdown of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {data.ordersByStatus.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No orders yet</p>
            ) : (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {data.ordersByStatus.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
