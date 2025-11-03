import { useState, useEffect } from "react";
import { affiliateManager } from "@/services/AffiliateManager";
import { getActivePrograms } from "@/config/affiliates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, TrendingUp, MousePointerClick, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { PerformanceMetrics } from "@/services/AffiliateManager";

const AffiliatePerformance = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  
  const activePrograms = getActivePrograms();

  useEffect(() => {
    if (selectedProgram && selectedProgram !== "all") {
      loadMetrics(selectedProgram);
    }
  }, [selectedProgram]);

  const loadMetrics = async (programId: string) => {
    setLoading(true);
    try {
      const data = await affiliateManager.getPerformanceMetrics(programId);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    toast.info('Export functionality coming soon');
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Affiliate Performance</h1>
            <p className="text-muted-foreground">
              Monitor clicks, conversions, and commissions across all programs
            </p>
          </div>
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Program Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Program</CardTitle>
            <CardDescription>Choose an affiliate program to view detailed metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {activePrograms.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Metrics */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : metrics ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Clicks"
                value={metrics.total_clicks.toLocaleString()}
                icon={MousePointerClick}
                description="All-time affiliate clicks"
              />
              <MetricCard
                title="Conversions"
                value={metrics.total_conversions.toLocaleString()}
                icon={CheckCircle}
                description={`${metrics.conversion_rate.toFixed(2)}% conversion rate`}
              />
              <MetricCard
                title="Total Commissions (ZAR)"
                value={`R${metrics.total_commission_zar.toFixed(2)}`}
                icon={DollarSign}
                description="ZAR commissions"
              />
              <MetricCard
                title="Total Commissions (USD)"
                value={`$${metrics.total_commission_usd.toFixed(2)}`}
                icon={TrendingUp}
                description="USD commissions"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {metrics.pending_commissions}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Approved Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {metrics.approved_commissions}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Paid Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {metrics.paid_commissions}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex min-h-[200px] items-center justify-center">
              <p className="text-muted-foreground">
                Select a program to view performance metrics
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AffiliatePerformance;
