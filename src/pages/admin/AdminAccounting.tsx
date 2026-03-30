import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  Download,
  RefreshCw,
  TrendingUp,
  Receipt,
  CreditCard,
  Percent,
  Calendar,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Filter,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  product_name: string;
  product_type: string;
  amount: number;
  currency: string;
  subtotal_zar: number | null;
  tax_zar: number | null;
  total_zar: number | null;
  status: string;
  payment_method: string | null;
  affiliate_program_id: string | null;
  created_at: string;
}

interface Commission {
  id: string;
  product_name: string | null;
  affiliate_program_id: string;
  order_amount: number;
  commission_amount: number;
  commission_currency: string;
  commission_rate: number | null;
  status: string | null;
  created_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
}

interface Payout {
  id: string;
  payout_period_start: string;
  payout_period_end: string;
  total_amount_zar: number | null;
  total_amount_usd: number | null;
  total_amount_eur: number | null;
  commission_count: number | null;
  status: string | null;
  payment_gateway: string | null;
  payment_reference: string | null;
  processed_at: string | null;
  created_at: string | null;
}

interface Transaction {
  id: string;
  transaction_type: string;
  description: string;
  amount_zar: number | null;
  amount_wellcoins: number | null;
  status: string;
  created_at: string;
}

const AdminAccounting = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState("current_month");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "current_month":
        return { from: startOfMonth(now).toISOString(), to: endOfMonth(now).toISOString() };
      case "last_month":
        return { from: startOfMonth(subMonths(now, 1)).toISOString(), to: endOfMonth(subMonths(now, 1)).toISOString() };
      case "last_3_months":
        return { from: startOfMonth(subMonths(now, 2)).toISOString(), to: endOfMonth(now).toISOString() };
      case "last_6_months":
        return { from: startOfMonth(subMonths(now, 5)).toISOString(), to: endOfMonth(now).toISOString() };
      case "ytd":
        return { from: new Date(now.getFullYear(), 0, 1).toISOString(), to: now.toISOString() };
      case "last_year":
        return { from: new Date(now.getFullYear() - 1, 0, 1).toISOString(), to: new Date(now.getFullYear() - 1, 11, 31).toISOString() };
      case "custom":
        return {
          from: dateFrom ? new Date(dateFrom).toISOString() : subDays(now, 30).toISOString(),
          to: dateTo ? new Date(dateTo + "T23:59:59").toISOString() : now.toISOString(),
        };
      default:
        return { from: startOfMonth(now).toISOString(), to: now.toISOString() };
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, dateFrom, dateTo]);

  const fetchData = async () => {
    setLoading(true);
    const { from, to } = getDateRange();

    try {
      const [ordersRes, commissionsRes, payoutsRes, transactionsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .gte("created_at", from)
          .lte("created_at", to)
          .order("created_at", { ascending: false }),
        supabase
          .from("affiliate_commissions")
          .select("*")
          .gte("created_at", from)
          .lte("created_at", to)
          .order("created_at", { ascending: false }),
        supabase
          .from("affiliate_payouts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("transactions")
          .select("*")
          .gte("created_at", from)
          .lte("created_at", to)
          .order("created_at", { ascending: false }),
      ]);

      setOrders(ordersRes.data || []);
      setCommissions(commissionsRes.data || []);
      setPayouts(payoutsRes.data || []);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error("Error fetching accounting data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Calculations ---
  const grossRevenue = orders.reduce((s, o) => s + (o.total_zar || o.amount || 0), 0);
  const totalTax = orders.reduce((s, o) => s + (o.tax_zar || 0), 0);
  const netRevenue = grossRevenue - totalTax;
  const totalCommissionsEarned = commissions.reduce((s, c) => s + c.commission_amount, 0);
  const pendingCommissions = commissions.filter((c) => c.status === "pending" || !c.status).reduce((s, c) => s + c.commission_amount, 0);
  const approvedCommissions = commissions.filter((c) => c.status === "approved").reduce((s, c) => s + c.commission_amount, 0);
  const paidCommissions = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commission_amount, 0);
  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const refundedOrders = orders.filter((o) => o.status === "refunded" || o.status === "cancelled");

  // Revenue by product type
  const revenueByType: Record<string, number> = {};
  orders.forEach((o) => {
    const type = o.product_type || "Other";
    revenueByType[type] = (revenueByType[type] || 0) + (o.total_zar || o.amount || 0);
  });

  // Revenue by month chart
  const revenueByMonth: Record<string, { revenue: number; commissions: number; orders: number }> = {};
  orders.forEach((o) => {
    const m = format(parseISO(o.created_at), "MMM yyyy");
    if (!revenueByMonth[m]) revenueByMonth[m] = { revenue: 0, commissions: 0, orders: 0 };
    revenueByMonth[m].revenue += o.total_zar || o.amount || 0;
    revenueByMonth[m].orders += 1;
  });
  commissions.forEach((c) => {
    if (!c.created_at) return;
    const m = format(parseISO(c.created_at), "MMM yyyy");
    if (!revenueByMonth[m]) revenueByMonth[m] = { revenue: 0, commissions: 0, orders: 0 };
    revenueByMonth[m].commissions += c.commission_amount;
  });
  const monthlyChart = Object.entries(revenueByMonth).map(([month, v]) => ({ month, ...v }));

  // Commission by program
  const commsByProgram: Record<string, { amount: number; count: number }> = {};
  commissions.forEach((c) => {
    const prog = c.affiliate_program_id || "Unknown";
    if (!commsByProgram[prog]) commsByProgram[prog] = { amount: 0, count: 0 };
    commsByProgram[prog].amount += c.commission_amount;
    commsByProgram[prog].count += 1;
  });

  // --- CSV Export ---
  const exportCSV = (type: "orders" | "commissions" | "transactions" | "summary") => {
    let csvContent = "";
    const { from, to } = getDateRange();
    const period = `${format(parseISO(from), "yyyy-MM-dd")}_to_${format(parseISO(to), "yyyy-MM-dd")}`;

    if (type === "orders") {
      csvContent = "Date,Order Number,Customer,Email,Product,Type,Subtotal (ZAR),Tax (ZAR),Total (ZAR),Currency,Amount,Status,Payment Method,Affiliate Program\n";
      orders.forEach((o) => {
        csvContent += `${format(parseISO(o.created_at), "yyyy-MM-dd HH:mm")},"${o.order_number}","${o.customer_name}","${o.customer_email}","${o.product_name}","${o.product_type}",${o.subtotal_zar || ""},${o.tax_zar || ""},${o.total_zar || ""},${o.currency},${o.amount},${o.status},${o.payment_method || ""},${o.affiliate_program_id || ""}\n`;
      });
    } else if (type === "commissions") {
      csvContent = "Date,Product,Affiliate Program,Order Amount,Commission Amount,Currency,Rate (%),Status,Approved Date,Paid Date\n";
      commissions.forEach((c) => {
        csvContent += `${c.created_at ? format(parseISO(c.created_at), "yyyy-MM-dd HH:mm") : ""},"${c.product_name || ""}","${c.affiliate_program_id}",${c.order_amount},${c.commission_amount},${c.commission_currency},${c.commission_rate || ""},${c.status || "pending"},${c.approved_at ? format(parseISO(c.approved_at), "yyyy-MM-dd") : ""},${c.paid_at ? format(parseISO(c.paid_at), "yyyy-MM-dd") : ""}\n`;
      });
    } else if (type === "transactions") {
      csvContent = "Date,Type,Description,Amount (ZAR),WellCoins,Status\n";
      transactions.forEach((t) => {
        csvContent += `${format(parseISO(t.created_at), "yyyy-MM-dd HH:mm")},"${t.transaction_type}","${t.description}",${t.amount_zar || ""},${t.amount_wellcoins || ""},${t.status}\n`;
      });
    } else if (type === "summary") {
      csvContent = "Omni Wellness Media — Financial Summary\n";
      csvContent += `Period: ${format(parseISO(from), "dd MMM yyyy")} - ${format(parseISO(to), "dd MMM yyyy")}\n\n`;
      csvContent += "REVENUE\n";
      csvContent += `Gross Revenue (ZAR),${grossRevenue.toFixed(2)}\n`;
      csvContent += `VAT / Tax (ZAR),${totalTax.toFixed(2)}\n`;
      csvContent += `Net Revenue (ZAR),${netRevenue.toFixed(2)}\n`;
      csvContent += `Total Orders,${orders.length}\n`;
      csvContent += `Completed Orders,${completedOrders.length}\n`;
      csvContent += `Pending Orders,${pendingOrders.length}\n`;
      csvContent += `Refunded / Cancelled,${refundedOrders.length}\n\n`;
      csvContent += "REVENUE BY PRODUCT TYPE\n";
      Object.entries(revenueByType).forEach(([type, amount]) => {
        csvContent += `${type},${amount.toFixed(2)}\n`;
      });
      csvContent += "\nCOMMISSIONS\n";
      csvContent += `Total Commissions,${totalCommissionsEarned.toFixed(2)}\n`;
      csvContent += `Pending,${pendingCommissions.toFixed(2)}\n`;
      csvContent += `Approved,${approvedCommissions.toFixed(2)}\n`;
      csvContent += `Paid,${paidCommissions.toFixed(2)}\n\n`;
      csvContent += "COMMISSIONS BY PROGRAM\n";
      Object.entries(commsByProgram).forEach(([prog, data]) => {
        csvContent += `${prog},${data.amount.toFixed(2)},${data.count} transactions\n`;
      });
      csvContent += "\nPAYOUTS\n";
      payouts.forEach((p) => {
        csvContent += `${format(parseISO(p.payout_period_start), "dd MMM yyyy")} - ${format(parseISO(p.payout_period_end), "dd MMM yyyy")},ZAR ${(p.total_amount_zar || 0).toFixed(2)},USD ${(p.total_amount_usd || 0).toFixed(2)},EUR ${(p.total_amount_eur || 0).toFixed(2)},${p.status || "pending"},${p.payment_gateway || ""},${p.payment_reference || ""}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omni_${type}_${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading accounting data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Period Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg">Accounting & Bookkeeping</h3>
          <p className="text-xs text-muted-foreground">Financial records for accountant review</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {dateRange === "custom" && (
            <>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 w-[140px] text-xs" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 w-[140px] text-xs" />
            </>
          )}
          <Button variant="outline" size="sm" className="h-8" onClick={fetchData}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">Gross Revenue</span>
              <DollarSign className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div className="text-xl font-heading text-green-700">R{grossRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</div>
            <p className="text-[10px] text-muted-foreground">{orders.length} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">VAT / Tax</span>
              <Receipt className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading">R{totalTax.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</div>
            <p className="text-[10px] text-muted-foreground">Net: R{netRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">Commissions</span>
              <Percent className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-heading text-purple-700">R{totalCommissionsEarned.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</div>
            <p className="text-[10px] text-muted-foreground">{commissions.length} entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-muted-foreground font-medium">Pending Payouts</span>
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>
            <div className="text-xl font-heading text-yellow-600">R{pendingCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</div>
            <p className="text-[10px] text-muted-foreground">Approved: R{approvedCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Buttons */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export for Accountant
          </CardTitle>
          <CardDescription className="text-xs">Download CSV files for bookkeeping and tax filing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => exportCSV("summary")}>
              <Download className="h-3 w-3 mr-1" />
              Financial Summary
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportCSV("orders")}>
              <Download className="h-3 w-3 mr-1" />
              All Orders ({orders.length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportCSV("commissions")}>
              <Download className="h-3 w-3 mr-1" />
              Commissions ({commissions.length})
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportCSV("transactions")}>
              <Download className="h-3 w-3 mr-1" />
              Transactions ({transactions.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      {monthlyChart.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue vs Commissions</CardTitle>
            <CardDescription className="text-xs">Monthly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(value: number, name: string) => [`R${value.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`, name === "revenue" ? "Revenue" : "Commissions"]}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="commissions" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Commissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders" className="text-xs">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="commissions" className="text-xs">Commissions ({commissions.length})</TabsTrigger>
          <TabsTrigger value="payouts" className="text-xs">Payouts ({payouts.length})</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs">Transactions ({transactions.length})</TabsTrigger>
          <TabsTrigger value="breakdown" className="text-xs">Breakdown</TabsTrigger>
        </TabsList>

        {/* Orders Table */}
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Order #</TableHead>
                      <TableHead className="text-xs">Customer</TableHead>
                      <TableHead className="text-xs">Product</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs text-right">Subtotal</TableHead>
                      <TableHead className="text-xs text-right">Tax</TableHead>
                      <TableHead className="text-xs text-right">Total</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground text-sm">
                          No orders in this period
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="text-xs whitespace-nowrap">{format(parseISO(order.created_at), "dd MMM yyyy")}</TableCell>
                          <TableCell className="text-xs font-mono">{order.order_number}</TableCell>
                          <TableCell className="text-xs">
                            <div className="truncate max-w-[120px]">{order.customer_name}</div>
                            <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{order.customer_email}</div>
                          </TableCell>
                          <TableCell className="text-xs truncate max-w-[150px]">{order.product_name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{order.product_type}</Badge></TableCell>
                          <TableCell className="text-xs text-right">R{(order.subtotal_zar || order.amount || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-xs text-right">{order.tax_zar ? `R${order.tax_zar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}` : "—"}</TableCell>
                          <TableCell className="text-xs text-right font-medium">R{(order.total_zar || order.amount || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Badge
                              className={`text-[10px] ${
                                order.status === "completed" || order.status === "paid"
                                  ? "bg-green-500"
                                  : order.status === "pending"
                                  ? "bg-yellow-500"
                                  : order.status === "refunded" || order.status === "cancelled"
                                  ? "bg-red-500"
                                  : ""
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{order.payment_method || "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {orders.length > 0 && (
                <div className="border-t p-3 bg-muted/30">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Period Total ({orders.length} orders)</span>
                    <span>R{grossRevenue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Table */}
        <TabsContent value="commissions">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Product</TableHead>
                      <TableHead className="text-xs">Program</TableHead>
                      <TableHead className="text-xs text-right">Order Amount</TableHead>
                      <TableHead className="text-xs text-right">Commission</TableHead>
                      <TableHead className="text-xs text-right">Rate</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Approved</TableHead>
                      <TableHead className="text-xs">Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
                          No commissions in this period
                        </TableCell>
                      </TableRow>
                    ) : (
                      commissions.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-xs whitespace-nowrap">{c.created_at ? format(parseISO(c.created_at), "dd MMM yyyy") : "—"}</TableCell>
                          <TableCell className="text-xs truncate max-w-[150px]">{c.product_name || "—"}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{c.affiliate_program_id}</Badge></TableCell>
                          <TableCell className="text-xs text-right">R{c.order_amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-xs text-right font-medium">{c.commission_currency === "ZAR" ? "R" : c.commission_currency + " "}{c.commission_amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-xs text-right">{c.commission_rate ? `${c.commission_rate}%` : "—"}</TableCell>
                          <TableCell>
                            <Badge
                              className={`text-[10px] ${
                                c.status === "paid" ? "bg-green-500" : c.status === "approved" ? "bg-blue-500" : "bg-yellow-500"
                              }`}
                            >
                              {c.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{c.approved_at ? format(parseISO(c.approved_at), "dd MMM") : "—"}</TableCell>
                          <TableCell className="text-xs">{c.paid_at ? format(parseISO(c.paid_at), "dd MMM") : "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {commissions.length > 0 && (
                <div className="border-t p-3 bg-muted/30">
                  <div className="flex justify-between text-xs">
                    <div className="flex gap-4">
                      <span>Pending: <strong className="text-yellow-600">R{pendingCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</strong></span>
                      <span>Approved: <strong className="text-blue-600">R{approvedCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</strong></span>
                      <span>Paid: <strong className="text-green-600">R{paidCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</strong></span>
                    </div>
                    <span className="font-medium">Total: R{totalCommissionsEarned.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Table */}
        <TabsContent value="payouts">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Period</TableHead>
                      <TableHead className="text-xs text-right">Amount (ZAR)</TableHead>
                      <TableHead className="text-xs text-right">Amount (USD)</TableHead>
                      <TableHead className="text-xs text-right">Amount (EUR)</TableHead>
                      <TableHead className="text-xs text-right">Commissions</TableHead>
                      <TableHead className="text-xs">Gateway</TableHead>
                      <TableHead className="text-xs">Reference</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Processed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
                          No payouts recorded
                        </TableCell>
                      </TableRow>
                    ) : (
                      payouts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {format(parseISO(p.payout_period_start), "dd MMM")} – {format(parseISO(p.payout_period_end), "dd MMM yyyy")}
                          </TableCell>
                          <TableCell className="text-xs text-right font-medium">R{(p.total_amount_zar || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-xs text-right">${(p.total_amount_usd || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-xs text-right">€{(p.total_amount_eur || 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-xs text-right">{p.commission_count || 0}</TableCell>
                          <TableCell className="text-xs">{p.payment_gateway || "—"}</TableCell>
                          <TableCell className="text-xs font-mono truncate max-w-[100px]">{p.payment_reference || "—"}</TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${p.status === "paid" || p.status === "processed" ? "bg-green-500" : "bg-yellow-500"}`}>
                              {p.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{p.processed_at ? format(parseISO(p.processed_at), "dd MMM yyyy") : "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Table */}
        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs text-right">Amount (ZAR)</TableHead>
                      <TableHead className="text-xs text-right">WellCoins</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                          No transactions in this period
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="text-xs whitespace-nowrap">{format(parseISO(t.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{t.transaction_type}</Badge></TableCell>
                          <TableCell className="text-xs truncate max-w-[250px]">{t.description}</TableCell>
                          <TableCell className="text-xs text-right font-medium">
                            {t.amount_zar ? `R${t.amount_zar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}` : "—"}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {t.amount_wellcoins ? t.amount_wellcoins.toLocaleString() : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${t.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                              {t.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Breakdown */}
        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue by Product Type */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue by Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(revenueByType).length === 0 ? (
                  <p className="text-center text-muted-foreground py-6 text-sm">No data</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(revenueByType)
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, amount]) => (
                        <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {orders.filter((o) => (o.product_type || "Other") === type).length} orders
                            </span>
                          </div>
                          <span className="font-bold text-sm">R{amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Commissions by Affiliate Program */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Commissions by Program</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(commsByProgram).length === 0 ? (
                  <p className="text-center text-muted-foreground py-6 text-sm">No commission data</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(commsByProgram)
                      .sort(([, a], [, b]) => b.amount - a.amount)
                      .map(([prog, data]) => (
                        <div key={prog} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] capitalize">{prog}</Badge>
                            <span className="text-xs text-muted-foreground">{data.count} entries</span>
                          </div>
                          <span className="font-bold text-sm">R{data.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Status Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Order Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Completed / Paid</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm">{completedOrders.length}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        R{completedOrders.reduce((s, o) => s + (o.total_zar || o.amount || 0), 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm">{pendingOrders.length}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        R{pendingOrders.reduce((s, o) => s + (o.total_zar || o.amount || 0), 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Refunded / Cancelled</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm">{refundedOrders.length}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        R{refundedOrders.reduce((s, o) => s + (o.total_zar || o.amount || 0), 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Status Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Commission Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
                    <span className="text-sm">Pending</span>
                    <span className="font-bold text-sm text-yellow-600">R{pendingCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                    <span className="text-sm">Approved (awaiting payout)</span>
                    <span className="font-bold text-sm text-blue-600">R{approvedCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                    <span className="text-sm">Paid</span>
                    <span className="font-bold text-sm text-green-600">R{paidCommissions.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAccounting;
