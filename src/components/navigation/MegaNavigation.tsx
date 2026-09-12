import { Link, useLocation } from 'react-router-dom';
import { Home, Plane, Store, Briefcase, Users, ArrowRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  TRAVEL,
  STORE,
  COMMUNITY,
  SERVICE_ENTRY_POINTS,
  SERVICE_PAGES,
  SERVICE_CATEGORIES,
  OFFER_COUNT,
  type NavLink as NavLinkData,
} from '@/data/navigation';
import ServiceMenuSearch from './ServiceMenuSearch';

/**
 * The desktop menu.
 *
 * WHAT WAS WRONG WITH THE OLD ONE, beyond looks:
 *
 * Its Services panel listed three pages and did not link to /services at
 * all. The catalogue of nineteen priced offers, the pricing page and the
 * scorecard could not be reached by browsing on a laptop. The mobile menu
 * had them, so anyone checking the menu on a phone saw a complete one.
 *
 * It was four copies of one 400px dropdown, so nothing was a mega menu and
 * the widest category got the same room as the one with a single link.
 *
 * Every item was labelled with an emoji, which draws differently on every
 * operating system and cannot take a brand colour. The spectrum hue each
 * category already owns does that job and does it consistently.
 *
 * Its descriptions carried em dashes, against the house rule.
 *
 * WHAT THIS DOES INSTEAD. Services gets a real panel: a search across all
 * nineteen offers, the six categories down one side with their hues, and
 * the four ways in ordered by how ready the visitor is. The scorecard leads
 * because it is the only one that costs the visitor nothing and still tells
 * us who they are.
 *
 * Everything reads from src/data/navigation.ts, which the mobile sheet also
 * reads, so the two menus cannot drift apart again.
 *
 * No em dashes in this file.
 */

const triggerClass =
  'group inline-flex h-10 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none';

/** One link in a panel. The hue dot replaces the emoji the old menu used. */
const PanelLink = ({ item, onNavigate }: { item: NavLinkData; onNavigate?: () => void }) => (
  <NavigationMenuLink asChild>
    <Link
      to={item.href}
      onClick={onNavigate}
      className="group/link block rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="flex items-center gap-2.5">
        {item.hue && (
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: item.hue }}
          />
        )}
        <span className="text-sm font-medium text-foreground">{item.title}</span>
      </span>
      <span className="mt-1.5 block text-xs leading-snug text-muted-foreground">
        {item.description}
      </span>
    </Link>
  </NavigationMenuLink>
);

export const MegaNavigation = () => {
  const { pathname } = useLocation();

  const isOn = (href: string) => pathname === href;

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="gap-0.5">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" aria-current={isOn('/') ? 'page' : undefined} className={triggerClass}>
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/about" aria-current={isOn('/about') ? 'page' : undefined} className={triggerClass}>
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Travel */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 rounded-full bg-transparent px-4 text-sm font-medium">
            <Plane className="mr-2 h-4 w-4" aria-hidden="true" />
            Travel
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[560px] p-5">
              <p className="px-3 pb-2 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                {TRAVEL.title}
              </p>
              <ul className="grid grid-cols-2 gap-1">
                {TRAVEL.links.map((item) => (
                  <li key={item.href}>
                    <PanelLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Store */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 rounded-full bg-transparent px-4 text-sm font-medium">
            <Store className="mr-2 h-4 w-4" aria-hidden="true" />
            Store
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[340px] p-5">
              <p className="px-3 pb-2 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                {STORE.title}
              </p>
              <ul className="grid gap-1">
                {STORE.links.map((item) => (
                  <li key={item.href}>
                    <PanelLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Services. The one that actually needs the room. */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 rounded-full bg-transparent px-4 text-sm font-medium">
            <Briefcase className="mr-2 h-4 w-4" aria-hidden="true" />
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[720px]">
              {/* The search sits above everything, because somebody who
                  knows what they want should not have to guess which of six
                  headings we filed it under. */}
              <div className="border-b border-border p-5 pb-4">
                <ServiceMenuSearch />
              </div>

              <div className="grid grid-cols-[1fr_1.15fr] gap-5 p-5">
                <div>
                  <p className="px-3 pb-2 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                    Browse by category
                  </p>
                  <ul className="grid gap-0.5">
                    {SERVICE_CATEGORIES.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary/40"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <span
                                aria-hidden="true"
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ background: item.hue }}
                              />
                              <span className="truncate text-sm text-foreground">{item.title}</span>
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>

                  <p className="px-3 pb-2 pt-5 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                    Service pages
                  </p>
                  <ul className="grid gap-0.5">
                    {SERVICE_PAGES.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block truncate rounded-xl px-3 py-2 text-sm text-foreground no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary/40"
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-muted/50 p-2">
                  <p className="px-3 pb-2 pt-2 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                    Start here
                  </p>
                  <ul className="grid gap-1">
                    {SERVICE_ENTRY_POINTS.map((item, i) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              'block rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-background focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/40',
                              // The scorecard leads, so it is the one drawn
                              // as the recommendation rather than a list item.
                              i === 0 && 'bg-background shadow-sm'
                            )}
                          >
                            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                              {item.title}
                              {i === 0 && (
                                <ArrowRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                              )}
                            </span>
                            <span className="mt-1.5 block text-xs leading-snug text-muted-foreground">
                              {item.description}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                  <p className="px-3 pb-2 pt-2 text-[11px] text-muted-foreground">
                    {OFFER_COUNT} services, priced in rand.
                  </p>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Community */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 rounded-full bg-transparent px-4 text-sm font-medium">
            <Users className="mr-2 h-4 w-4" aria-hidden="true" />
            Community
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[340px] p-5">
              <p className="px-3 pb-2 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                {COMMUNITY.title}
              </p>
              <ul className="grid gap-1">
                {COMMUNITY.links.map((item) => (
                  <li key={item.href}>
                    <PanelLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/contact" aria-current={isOn('/contact') ? 'page' : undefined} className={triggerClass}>
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
