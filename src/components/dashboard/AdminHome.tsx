import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  Mail,
  Eye,
  Megaphone,
  Zap,
} from "lucide-react";

interface AdminHomeProps {
  stats: Record<string, any>;
  recentActivity: any[];
  alerts: any[];
  onNavigate: (section: string) => void;
}

const AdminHome = memo(({ stats, recentActivity, alerts, onNavigate }: AdminHomeProps) => {
  const navigate = useNavigate();

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
              <p className="text-center text-muted-foreground py-6 text-sm">No recent activity</p>
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
