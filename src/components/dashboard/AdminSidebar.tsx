import { memo, useEffect, useMemo, useRef, useState } from "react";
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
  KanbanSquare,
  Contact,
  Receipt,
  Target,
  Search,
  ChevronRight,
  X,
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
/**
 * Grouped by the job, not by the table. The old groups were Core, Manage,
 * Marketplace, Events, System: a developer's map of the codebase. These are
 * the five things the team does in a week, in the order they do them.
 *
 * `keywords` exist because people do not search for the label we chose. Three
 * of these screens are the only place to do a job whose common name appears
 * nowhere in its title: invoices live under Quotes and payments, VAT under
 * Accounting, refunds under Orders. Typing the word you have in your head
 * should find the screen.
 */
const NAV_GROUPS: {
  label: string;
  hue: string;
  items: { id: string; label: string; icon: typeof LayoutDashboard; href?: string; keywords?: string }[];
}[] = [
  {
    label: "Sales",
    hue: "#2BB9B9",
    items: [
      { id: "home", label: "Today", icon: LayoutDashboard, keywords: "dashboard overview home start" },
      { id: "pipeline", label: "Pipeline", icon: KanbanSquare, keywords: "board kanban stages deals prospects walk-in" },
      { id: "leads", label: "All leads", icon: Users, keywords: "enquiries enquiry contacts list" },
      { id: "bookings", label: "Bookings", icon: CalendarCheck, keywords: "reservations appointments calendar" },
      { id: "orders", label: "Orders", icon: ShoppingCart, keywords: "sales refunds shop purchases" },
    ],
  },
  {
    label: "Marketing",
    hue: "#5C2A8A",
    items: [
      { id: "marketing", label: "Channels", icon: Megaphone, keywords: "attribution sources campaigns where leads come from" },
      { id: "ads", label: "Google Ads", icon: Target, keywords: "adwords ppc campaigns keywords paid search" },
      { id: "analytics", label: "Analytics", icon: BarChart3, keywords: "traffic visitors stats reports numbers" },
      { id: "newsletter", label: "Newsletter", icon: Mail, keywords: "email subscribers mailing list broadcast" },
      { id: "social", label: "Social", icon: Share2, keywords: "instagram facebook posts scheduling" },
      { id: "content", label: "Media", icon: FileText, keywords: "video watch films uploads library blog" },
    ],
  },
  {
    label: "Clients and partners",
    hue: "#4FAE3F",
    // The two entries with real work behind them come first and say what the
    // work is. "Products" used to sit in Manage as a second screen over the
    // same table as Shop products, which is why nobody could tell which one to
    // use; it is now reached from the hub as "Import tools".
    items: [
      { id: "clients", label: "Clients", icon: Contact, keywords: "accounts customers history card" },
      { id: "services", label: "Services", icon: FileText, keywords: "offers rate card inclusions pricing descriptions" },
      { id: "catalogue", label: "Local businesses", icon: Store, href: "/admin/catalogue", keywords: "directory listings muizenberg partners" },
      { id: "providers", label: "Providers", icon: UserCog, keywords: "suppliers vendors practitioners" },
      { id: "marketplace-hub", label: "Marketplace", icon: LayoutDashboard, href: "/admin/marketplace", keywords: "affiliate hub" },
      // The storefront shows a product only once it is featured here, and on
      // 25 September none of the 665 active products were, so every shop page
      // was empty. Anyone looking for that will search "featured" or
      // "curation", neither of which is in the label.
      { id: "shop-products", label: "Approve shop products", icon: Package, href: "/admin/products", keywords: "moderation approvals queue featured curate curation publish storefront empty shop" },
      { id: "products", label: "Import tools", icon: Wrench, keywords: "feed csv bulk upload catalogue import" },
      { id: "affiliate-performance", label: "Affiliate performance", icon: TrendingUp, href: "/admin/affiliate-performance", keywords: "commission clicks conversions" },
    ],
  },
  {
    label: "Money",
    hue: "#F38020",
    items: [
      { id: "money", label: "Quotes and payments", icon: Receipt, keywords: "invoice invoices deposits quotations billing paid" },
      { id: "accounting", label: "Accounting", icon: DollarSign, keywords: "vat tax ledger expenses entities books reconciliation" },
      { id: "affiliate-payouts", label: "Affiliate payouts", icon: HandCoins, href: "/admin/affiliate-payouts", keywords: "commission owed pay partners" },
    ],
  },
  {
    label: "Events and tours",
    hue: "#2C6FB5",
    items: [
      { id: "events-admin", label: "Events calendar", icon: CalendarCheck, href: "/admin/events", keywords: "tickets registrations wellness day screenings" },
      // AdminTours is the only editor for the local tours table, which is
      // not the same thing as the Viator screen; the local tours id cannot
      // be "tours" because Viator already holds it.
      { id: "local-tours", label: "Tours (local)", icon: MapPin, keywords: "excursions trips guides itineraries" },
      { id: "tours", label: "Viator", icon: Globe, keywords: "tours distribution channel partner" },
      { id: "schedule", label: "Schedule", icon: CalendarClock, keywords: "availability slots roster timetable" },
    ],
  },
  {
    label: "System",
    hue: "#8A9A96",
    items: [
      { id: "team", label: "Team", icon: UserPlus, keywords: "users roles permissions staff access" },
      { id: "tasks", label: "Tasks", icon: ListTodo, keywords: "todo jobs checklist" },
      { id: "uwc", label: "UWC", icon: GraduationCap, keywords: "university students programme" },
      { id: "roambuddy-sales", label: "RoamBuddy sales", icon: Smartphone, href: "/admin/roambuddy-sales", keywords: "esim data" },
      { id: "roam-marketing", label: "Roam marketing", icon: Megaphone, href: "/admin/roam-marketing", keywords: "esim campaigns" },
      { id: "settings", label: "Settings", icon: Settings, keywords: "configuration site options preferences" },
      { id: "tools", label: "Tools", icon: Wrench, keywords: "utilities maintenance admin scripts" },
    ],
  },
];

type NavItem = (typeof NAV_GROUPS)[number]["items"][number];
type Hit = { item: NavItem; group: (typeof NAV_GROUPS)[number] };

const ALL_ITEMS: Hit[] = NAV_GROUPS.flatMap((group) => group.items.map((item) => ({ item, group })));

const OPEN_GROUPS_KEY = "omni.admin.nav.openGroups";

/**
 * Ranked so the thing you typed the start of comes first. A label that starts
 * with the query beats one that merely contains it, which beats a keyword
 * match. Without this, typing "ac" offers Accounting somewhere below
 * "Approve shop products", because that contains an "ac" in the middle.
 */
const score = (hit: Hit, q: string): number => {
  const label = hit.item.label.toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.split(/\s+/).some((w) => w.startsWith(q))) return 2;
  if (label.includes(q)) return 3;
  if (hit.group.label.toLowerCase().includes(q)) return 4;
  if ((hit.item.keywords ?? "").split(/\s+/).some((w) => w.startsWith(q))) return 5;
  if ((hit.item.keywords ?? "").includes(q)) return 6;
  return Infinity;
};

export const searchNav = (query: string): Hit[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_ITEMS.map((hit) => ({ hit, s: score(hit, q) }))
    .filter((r) => r.s !== Infinity)
    .sort((a, b) => a.s - b.s)
    .map((r) => r.hit);
};

const readOpenGroups = (activeSection: string): string[] => {
  // The group holding the screen you are on is always open, whatever was
  // stored. Otherwise a restored state can hide the highlighted item.
  const active = NAV_GROUPS.find((g) => g.items.some((i) => i.id === activeSection))?.label;
  let stored: string[] = [];
  try {
    const raw = localStorage.getItem(OPEN_GROUPS_KEY);
    if (raw) stored = JSON.parse(raw) as string[];
  } catch {
    // A private window, or cleared site data. Defaults are fine.
  }
  if (!stored.length && active) return [active];
  return active && !stored.includes(active) ? [...stored, active] : stored;
};

const AdminSidebar = memo(({ activeSection, onSectionChange, alerts = {}, className = "w-52 shrink-0 hidden lg:block" }: AdminSidebarProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string[]>(() => readOpenGroups(activeSection));
  const inputRef = useRef<HTMLInputElement>(null);

  // Following a link from search to another screen should not leave the box
  // full of a query for a screen you already left.
  useEffect(() => {
    setOpen((prev) => {
      const active = NAV_GROUPS.find((g) => g.items.some((i) => i.id === activeSection))?.label;
      return active && !prev.includes(active) ? [...prev, active] : prev;
    });
  }, [activeSection]);

  useEffect(() => {
    try {
      localStorage.setItem(OPEN_GROUPS_KEY, JSON.stringify(open));
    } catch {
      // Not worth failing a render over.
    }
  }, [open]);

  // Cmd K, Ctrl K, or "/" from anywhere that is not already a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      const palette = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (palette || (e.key === "/" && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits = useMemo(() => searchNav(query), [query]);
  const searching = query.trim().length > 0;

  const go = (item: NavItem) => {
    setQuery("");
    if (!item.href) onSectionChange(item.id);
  };

  const rowClass = (isActive: boolean) =>
    cn(
      "relative w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors text-left",
      isActive
        ? "bg-muted font-medium text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    );

  const Row = ({ item, group }: Hit) => {
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
    return item.href ? (
      <Link to={item.href} className={rowClass(isActive)} onClick={() => go(item)}>
        {inner}
      </Link>
    ) : (
      <button type="button" onClick={() => go(item)} className={rowClass(isActive)}>
        {inner}
      </button>
    );
  };

  return (
    <nav className={className}>
      <div className="sticky top-[72px] space-y-3">
        <div className="relative px-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                inputRef.current?.blur();
              }
              if (e.key === "Enter" && hits[0]) {
                e.preventDefault();
                const first = hits[0].item;
                if (first.href) window.location.assign(first.href);
                else go(first);
              }
            }}
            placeholder="Search screens"
            aria-label="Search admin screens"
            className="h-8 w-full rounded-md border border-border/70 bg-background pl-8 pr-7 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring [&::-webkit-search-cancel-button]:appearance-none"
          />
          {searching && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {searching ? (
          <div>
            {hits.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No screen matches "{query.trim()}".
              </p>
            ) : (
              hits.map((hit) => (
                <div key={hit.item.id}>
                  <Row {...hit} />
                  <p
                    className="-mt-0.5 mb-0.5 pl-[38px] text-[10px] uppercase tracking-[.14em] text-muted-foreground/70"
                    style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                  >
                    {hit.group.label}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          NAV_GROUPS.map((group) => {
            const isOpen = open.includes(group.label);
            // A collapsed group must still show that something inside it wants
            // attention, or folding the nav quietly hides the count.
            const groupAlerts = group.items.reduce((n, i) => n + (alerts[i.id] || 0), 0);
            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() =>
                    setOpen((prev) =>
                      prev.includes(group.label) ? prev.filter((l) => l !== group.label) : [...prev, group.label]
                    )
                  }
                  aria-expanded={isOpen}
                  className="mb-1.5 flex w-full items-center gap-2 rounded-md px-3 py-1 text-[10px] uppercase tracking-[.18em] text-muted-foreground transition-colors hover:text-foreground"
                  style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                >
                  <span aria-hidden="true" className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: group.hue }} />
                  <span className="truncate">{group.label}</span>
                  {!isOpen && groupAlerts > 0 && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      {groupAlerts}
                    </span>
                  )}
                  <ChevronRight
                    aria-hidden="true"
                    className={cn("ml-auto h-3 w-3 shrink-0 transition-transform", isOpen && "rotate-90")}
                  />
                </button>
                {isOpen && group.items.map((item) => <Row key={item.id} item={item} group={group} />)}
              </div>
            );
          })
        )}
      </div>
    </nav>
  );
});

AdminSidebar.displayName = "AdminSidebar";

export { NAV_GROUPS };
export default AdminSidebar;
