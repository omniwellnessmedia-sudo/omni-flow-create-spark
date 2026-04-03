import { memo } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  CalendarCheck,
  ShoppingCart,
  UserCog,
  Package,
  FileText,
  Mail,
  Share2,
  DollarSign,
  UserPlus,
  ListTodo,
  Globe,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  alerts?: Record<string, number>;
}

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { id: "home", label: "Home", icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "leads", label: "Leads", icon: Users },
      { id: "bookings", label: "Bookings", icon: CalendarCheck },
      { id: "orders", label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    label: "Manage",
    items: [
      { id: "providers", label: "Providers", icon: UserCog },
      { id: "products", label: "Products", icon: Package },
      { id: "content", label: "Content", icon: FileText },
      { id: "newsletter", label: "Newsletter", icon: Mail },
      { id: "social", label: "Social", icon: Share2 },
    ],
  },
  {
    label: "System",
    items: [
      { id: "accounting", label: "Accounting", icon: DollarSign },
      { id: "team", label: "Team", icon: UserPlus },
      { id: "tasks", label: "Tasks", icon: ListTodo },
      { id: "tours", label: "Viator", icon: Globe },
      { id: "uwc", label: "UWC", icon: GraduationCap },
      { id: "tools", label: "Tools", icon: Wrench },
    ],
  },
];

const AdminSidebar = memo(({ activeSection, onSectionChange, alerts = {} }: AdminSidebarProps) => {
  return (
    <nav className="w-48 shrink-0 hidden lg:block">
      <div className="sticky top-[72px] space-y-1">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 && <Separator className="my-2" />}
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = activeSection === item.id;
              const alertCount = alerts[item.id] || 0;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {alertCount > 0 && (
                    <span className="ml-auto text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
                      {alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
});

AdminSidebar.displayName = "AdminSidebar";

export { NAV_GROUPS };
export default AdminSidebar;
