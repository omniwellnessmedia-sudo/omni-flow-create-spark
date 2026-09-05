import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  MapPin,
  CalendarClock,
  Smartphone,
  Megaphone,
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
  Store,
  TrendingUp,
  HandCoins,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  alerts?: Record<string, number>;
  // Wrapper classes. Desktop usage keeps the default (hidden below lg); the mobile
  // Sheet passes "block w-full" so the nav is actually visible inside the drawer.
  className?: string;
}

/**
 * Spectrum-hued admin navigation. Each group carries one hue from the site's
 * category spectrum so the operator surface reads as part of the same design
 * system as the public pages. Items with an `href` are standalone admin
 * routes (the catalogue and marketplace tools live outside the dashboard's
 * section switcher and were previously unreachable from here at all).
 */
const NAV_GROUPS: {
  label: string;
  hue: string;
  items: { id: string; label: string; icon: typeof LayoutDashboard; href?: string }[];
}[] = [
  {
    label: "Core",
    hue: "#2BB9B9",
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
    hue: "#5C2A8A",
    items: [
      { id: "providers", label: "Providers", icon: UserCog },
      { id: "content", label: "Content", icon: FileText },
      { id: "newsletter", label: "Newsletter", icon: Mail },
      { id: "social", label: "Social", icon: Share2 },
    ],
  },
  {
    label: "Marketplace",
    hue: "#4FAE3F",
    // The two entries with real work behind them come first and say what the
    // work is. "Products" used to sit in Manage as a second screen over the
    // same table as Shop products, which is why nobody could tell which one to
    // use; it is now reached from the hub as "Import tools".
    items: [
      { id: "marketplace-hub", label: "Overview", icon: LayoutDashboard, href: "/admin/marketplace" },
      { id: "shop-products", label: "Approve shop products", icon: Package, href: "/admin/products" },
      { id: "catalogue", label: "Local businesses", icon: Store, href: "/admin/catalogue" },
      { id: "products", label: "Import tools", icon: Wrench },
      { id: "affiliate-performance", label: "Affiliate performance", icon: TrendingUp, href: "/admin/affiliate-performance" },
      { id: "affiliate-payouts", label: "Affiliate payouts", icon: HandCoins, href: "/admin/affiliate-payouts" },
    ],
  },
  {
    label: "Events",
    hue: "#2C6FB5",
    items: [
      { id: "events-admin", label: "Events calendar", icon: CalendarCheck, href: "/admin/events" },
    ],
  },
  {
    label: "System",
    hue: "#8A9A96",
    items: [
      { id: "accounting", label: "Accounting", icon: DollarSign },
      { id: "team", label: "Team", icon: UserPlus },
      { id: "tasks", label: "Tasks", icon: ListTodo },
      { id: "tours", label: "Viator", icon: Globe },
      // Reachable from 5 September 2026. All three screens were fully built
      // against live tables and wired to nothing: no route, no section, no
      // import. AdminSettings holds the feature flag switches that gate
      // public functionality and the Cal.com booking configuration;
      // AdminTours is the only editor for the local tours table, which is
      // not the same thing as the Viator screen above; AdminSchedule owns
      // service_time_slots. The local tours id cannot be "tours" because
      // Viator already holds it.
      { id: "local-tours", label: "Tours (local)", icon: MapPin },
      { id: "schedule", label: "Schedule", icon: CalendarClock },
      { id: "uwc", label: "UWC", icon: GraduationCap },
      { id: "roambuddy-sales", label: "RoamBuddy sales", icon: Smartphone, href: "/admin/roambuddy-sales" },
      { id: "roam-marketing", label: "Roam marketing", icon: Megaphone, href: "/admin/roam-marketing" },
      { id: "settings", label: "Settings", icon: Settings },
      { id: "tools", label: "Tools", icon: Wrench },
    ],
  },
];

const AdminSidebar = memo(({ activeSection, onSectionChange, alerts = {}, className = "w-52 shrink-0 hidden lg:block" }: AdminSidebarProps) => {
  return (
    <nav className={className}>
      <div className="sticky top-[72px] space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className="mb-1.5 flex items-center gap-2 px-3 text-[10px] uppercase tracking-[.18em] text-muted-foreground"
              style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
            >
              <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: group.hue }} />
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = activeSection === item.id;
              const alertCount = alerts[item.id] || 0;
              const inner = (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 left-0 w-[3px] rounded-full transition-opacity"
                    style={{ background: group.hue, opacity: isActive ? 1 : 0 }}
                  />
                  <item.icon className="h-3.5 w-3.5 shrink-0" style={isActive ? { color: group.hue } : undefined} />
                  <span className="truncate">{item.label}</span>
                  {alertCount > 0 && (
                    <span className="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      {alertCount}
                    </span>
                  )}
                </>
              );
              const itemClass = cn(
                "relative w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              );
              return item.href ? (
                <Link key={item.id} to={item.href} className={itemClass}>
                  {inner}
                </Link>
              ) : (
                <button key={item.id} onClick={() => onSectionChange(item.id)} className={itemClass}>
                  {inner}
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
