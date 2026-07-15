import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  FileText,
  Users,
  TrendingUp,
  Mail,
  Eye,
  Zap,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

interface AdminAlert {
  type: "warning" | "info";
  message: string;
}

interface AdminHomeProps {
  stats: Record<string, any>;
  recentActivity: any[];
  alerts: AdminAlert[];
  onNavigate: (section: string) => void;
  /** When true, renders skeleton placeholders matching the final layout. */
  loading?: boolean;
}

const Sk = ({ className }: { className?: string }) => (
  <Skeleton className={cn("motion-reduce:animate-none", className)} />
);

const AdminHomeSkeleton = () => (
  <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading dashboard overview">
    {/* Quick actions */}
    <div>
      <Sk className="h-4 w-28 mb-3" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Sk className="h-4 w-4 rounded-full shrink-0" />
              <Sk className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    {/* Stat tiles */}
    <div>
      <Sk className="h-4 w-24 mb-3" />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-muted/30 flex flex-col items-center gap-2">
            <Sk className="h-5 w-14" />
            <Sk className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
    {/* Needs attention */}
    <Card className="rounded-2xl border-border/60">
      <CardHeader className="pb-3 space-y-2">
        <Sk className="h-4 w-32" />
        <Sk className="h-3 w-40" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Sk className="h-9 w-full rounded-lg" />
        <Sk className="h-9 w-full rounded-lg" />
      </CardContent>
    </Card>
    {/* Activity + health */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardHeader className="pb-3 space-y-2">
            <Sk className="h-4 w-32" />
            <Sk className="h-3 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Sk className="h-4 w-40 max-w-[60%]" />
                <Sk className="h-4 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
    <span className="sr-only">Loading dashboard overview…</span>
  </div>
);

const AdminHome = memo(({ stats, recentActivity, alerts, onNavigate, loading = false }: AdminHomeProps) => {
  const navigate = useNavigate();

  if (loading) return <AdminHomeSkeleton />;

  const shortcuts = [
    { label: "New Blog Post", icon: FileText, onClick: () => navigate("/blog/editor/new"), accent: true },
    { label: "View Leads", icon: Users, onClick: () => onNavigate("leads"), count: stats.totalServiceBookings },
    { label: "Send Newsletter", icon: Mail, onClick: () => onNavigate("newsletter") },
    { label: "View Site", icon: Eye, onClick: () => window.open("/", "_blank") },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shortcuts.map((s) => (
            <Card
              key={s.label}
              className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group ${
                s.accent ? "border-primary/30 bg-primary/5" : "border-border/50"
              }`}
              onClick={s.onClick}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className={`h-4 w-4 shrink-0 ${s.accent ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium">{s.label}</span>
                  {s.count != null && s.count > 0 && (
                    <p className="text-[10px] text-muted-foreground">{s.count} total</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" /> At a Glance
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "Revenue", value: `R${stats.totalRevenue?.toLocaleString() || 0}` },
            { label: "Orders", value: stats.totalOrders || 0 },
            { label: "Leads", value: stats.totalServiceBookings || 0 },
            { label: "Providers", value: stats.totalProviders || 0 },
            { label: "Users", value: stats.totalUsers || 0 },
            { label: "Content", value: stats.totalBlogPosts || 0 },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-lg font-heading">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Attention */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Needs Attention</CardTitle>
          <CardDescription className="text-xs">Pending items waiting on you</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center text-center py-6 gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                All clear — no pending bookings, leads, orders, or provider verifications right now.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/40">
                  {alert.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" aria-hidden="true" />
                  ) : (
                    <Info className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  )}
                  <span className="text-sm min-w-0 flex-1">{alert.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Latest orders, bookings, and leads</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center text-center py-6 gap-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No recent activity yet — new orders, bookings, and leads will show up here as they come in.
                </p>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => onNavigate("leads")}>
                  <Users className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Go to Leads
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.slice(0, 6).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{activity.description}</p>
                      <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <Badge variant="secondary" className="shrink-0 ml-2 text-[10px]">
                        R{activity.amount.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Platform Health</CardTitle>
            <CardDescription className="text-xs">Key metrics and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "WellCoins in circulation", value: stats.wellcoinCirculation?.toLocaleString() || 0, color: "text-primary" },
                { label: "Active services", value: stats.activeServices || 0 },
                { label: "Active tours", value: stats.activeTours || 0 },
                { label: "Published blog posts", value: `${stats.publishedBlogPosts || 0} / ${stats.totalBlogPosts || 0}` },
                { label: "Verified providers", value: `${stats.activeProviders || 0} / ${stats.totalProviders || 0}` },
                { label: "Pending orders", value: stats.pendingOrders || 0, color: stats.pendingOrders > 0 ? "text-amber-600" : undefined },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-medium ${item.color || ""}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

AdminHome.displayName = "AdminHome";

export default AdminHome;
