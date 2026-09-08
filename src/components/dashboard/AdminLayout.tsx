import { useCallback, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Home, Menu, ArrowLeft, Plus, ChevronDown, FileText, Video, Mic } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import AdminSidebar, { NAV_GROUPS } from '@/components/dashboard/AdminSidebar';

/**
 * The one admin shell: header, spectrum rule, sidebar, cream ground.
 *
 * WHY THIS EXISTS. The dashboard rendered this chrome inline, so only the
 * screens reached through ?section= had navigation. Ten admin screens are
 * top level routes instead (/admin/events, /admin/products, /admin/catalogue,
 * /admin/marketplace, /admin/tools, the two affiliate screens, and the
 * RoamBuddy and monetisable URL screens). Those rendered bare: no sidebar, no
 * header, no way back except the browser button, and on a white ground rather
 * than the site's cream. Clicking "Events calendar" in the sidebar therefore
 * navigated the operator OUT of the product and stranded them there.
 *
 * Every admin route now renders inside this component, so navigation and
 * theme are the same everywhere and the sidebar stays visible with the
 * current screen highlighted.
 *
 * The active item is derived from the URL when the caller does not pass one,
 * which is what lets a standalone route highlight its own sidebar entry.
 *
 * No em dashes in this file.
 */

const SPECTRUM = ['#E63946', '#F38020', '#F5C518', '#4FAE3F', '#2BB9B9', '#2C6FB5', '#5C2A8A'];

/** Sidebar id for a pathname, by matching the hrefs the sidebar declares. */
export const sectionIdForPath = (pathname: string): string | undefined => {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href && item.href === pathname) return item.id;
    }
  }
  return undefined;
};

interface AdminLayoutProps {
  children: ReactNode;
  /** Dashboard sections pass their own; standalone routes let the URL decide. */
  activeSection?: string;
  /** Dashboard sections swap in place; standalone routes navigate. */
  onSectionChange?: (section: string) => void;
  alerts?: Record<string, number>;
}

const AdminLayout = ({ children, activeSection, onSectionChange, alerts = {} }: AdminLayoutProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const active = activeSection ?? sectionIdForPath(location.pathname) ?? '';
  const onDashboard = location.pathname.startsWith('/admin-dashboard') || location.pathname === '/admin';

  const changeSection = useCallback(
    (section: string) => {
      setMobileNavOpen(false);
      if (onSectionChange) {
        onSectionChange(section);
        return;
      }
      // From a standalone route, a section click has to go back to the
      // dashboard that owns that section rather than doing nothing.
      navigate(`/admin-dashboard?section=${section}`);
    },
    [navigate, onSectionChange]
  );

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header. The 3px seven hue rule beneath it is the site's signature,
          so the operator surface reads as the same product as the public
          pages rather than a bolted on admin template. */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div aria-hidden="true" className="flex h-[3px] w-full">
          {SPECTRUM.map((c) => (
            <span key={c} className="h-full flex-1" style={{ background: c }} />
          ))}
        </div>
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden" aria-label="Open admin menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 overflow-y-auto p-4">
                <div className="mt-4">
                  <AdminSidebar
                    activeSection={active}
                    onSectionChange={changeSection}
                    alerts={alerts}
                    className="block w-full"
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="shrink-0">
              <img src={IMAGES.logos.omniHorizontal} alt="Omni" className="h-7 w-auto object-contain md:h-8" />
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-border">/</span>
              <Link
                to="/admin-dashboard"
                className="text-[10px] font-medium uppercase tracking-[.2em] text-muted-foreground hover:text-foreground"
                style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {/* Create lived in the dashboard header, so it was unreachable
                from the standalone screens. Its items are routes, so it works
                from anywhere now. */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 rounded-full text-xs">
                  <Plus className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">Create</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/blog/editor/new')}>
                  <FileText className="mr-2 h-3.5 w-3.5" /> Blog Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin-dashboard?section=content')}>
                  <Video className="mr-2 h-3.5 w-3.5" /> Upload Video
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/events')}>
                  <Plus className="mr-2 h-3.5 w-3.5" /> Event
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Mic className="mr-2 h-3.5 w-3.5" /> Podcast
                  <Badge variant="outline" className="ml-2 text-[9px]">Planned</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* A way back to the dashboard from every standalone screen. */}
            {!onDashboard && (
              <Button variant="ghost" size="sm" asChild className="h-8 px-2.5">
                <Link to="/admin-dashboard">
                  <ArrowLeft className="h-3.5 w-3.5 md:mr-1.5" />
                  <span className="hidden text-xs md:inline">Dashboard</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild className="h-8 px-2.5">
              <Link to="/">
                <Home className="h-3.5 w-3.5 md:mr-1.5" />
                <span className="hidden text-xs md:inline">Site</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 px-2.5 text-muted-foreground">
              <LogOut className="h-3.5 w-3.5 md:mr-1.5" />
              <span className="hidden text-xs sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px]">
        <div className="hidden min-h-[calc(100vh-3.5rem)] border-r border-border/50 p-4 lg:block">
          <AdminSidebar activeSection={active} onSectionChange={changeSection} alerts={alerts} />
        </div>

        {/* Cream ground, matching the public site. White cards sit on it with
            visible edges on every screen, including those that have not had
            their own theme pass yet. */}
        <div className="min-w-0 flex-1 p-4 md:p-6" style={{ background: '#FAF8F2' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
