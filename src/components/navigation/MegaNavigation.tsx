import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
 * WHAT THIS DOES INSTEAD. Services gets a real panel: a search across all
 * nineteen offers, the six categories down one side with their hues, and
 * the ways in ordered by how ready the visitor is. The scorecard leads
 * because it is the only one that costs the visitor nothing and still tells
 * us who they are.
 *
 * THE TYPE IS THE SITE'S. The public pages moved to one system: Cormorant
 * for display, Inter for reading, JetBrains Mono for eyebrows. The menu had
 * kept its own: a lucide icon beside every label and shadcn's default
 * uppercase for panel headings. Icons are gone (the labels are words, and
 * the hue dots do the colour work), panel headings are mono eyebrows, and
 * the titles inside a panel are set in the display face, so the menu reads
 * as the same product as the pages it opens.
 *
 * Everything reads from src/data/navigation.ts, which the mobile sheet also
 * reads, so the two menus cannot drift apart again.
 *
 * No em dashes in this file.
 */

const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as const;

const triggerClass =
  'group inline-flex h-10 w-max items-center justify-center rounded-full px-4 py-2 text-[14px] font-medium tracking-[.01em] transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none';

/** A panel heading, in the eyebrow style the pages use. */
const Eyebrow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={cn('px-3 pb-2 text-[10px] uppercase tracking-[.22em] text-muted-foreground', className)} style={MONO}>
    {children}
  </p>
);

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
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.hue }} />
        )}
        <span className="font-wwpl-display text-[18px] leading-tight text-foreground">{item.title}</span>
      </span>
      <span className="mt-1.5 block text-[12.5px] leading-snug text-muted-foreground">{item.description}</span>
    </Link>
  </NavigationMenuLink>
);

const Trigger = ({ children }: { children: React.ReactNode }) => (
  <NavigationMenuTrigger className="h-10 rounded-full bg-transparent px-4 text-[14px] font-medium tracking-[.01em]">
    {children}
  </NavigationMenuTrigger>
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
          <Trigger>Travel</Trigger>
          <NavigationMenuContent>
            <div className="w-[560px] p-5">
              <Eyebrow>{TRAVEL.title}</Eyebrow>
              <ul className="grid grid-cols-2 gap-1">
                {TRAVEL.links.map((item) => (
                  <li key={item.href}><PanelLink item={item} /></li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Store */}
        <NavigationMenuItem>
          <Trigger>Store</Trigger>
          <NavigationMenuContent>
            <div className="w-[340px] p-5">
              <Eyebrow>{STORE.title}</Eyebrow>
              <ul className="grid gap-1">
                {STORE.links.map((item) => (
                  <li key={item.href}><PanelLink item={item} /></li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Services. The one that actually needs the room. */}
        <NavigationMenuItem>
          <Trigger>Services</Trigger>
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
                  <Eyebrow>Browse by category</Eyebrow>
                  <ul className="grid gap-0.5">
                    {SERVICE_CATEGORIES.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary/40"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.hue }} />
                              <span className="truncate text-[14px] text-foreground">{item.title}</span>
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground" style={MONO}>
                              {item.description}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>

                  <Eyebrow className="pt-5">Service pages</Eyebrow>
                  <ul className="grid gap-0.5">
                    {SERVICE_PAGES.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block truncate rounded-xl px-3 py-2 text-[14px] text-foreground no-underline outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-primary/40"
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-muted/50 p-2">
                  <Eyebrow className="pt-2">Start here</Eyebrow>
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
                            <span className="flex items-center gap-2 font-wwpl-display text-[18px] leading-tight text-foreground">
                              {item.title}
                              {i === 0 && <ArrowRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
                            </span>
                            <span className="mt-1.5 block text-[12.5px] leading-snug text-muted-foreground">
                              {item.description}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                  <p className="px-3 pb-2 pt-2 text-[10.5px] text-muted-foreground" style={MONO}>
                    {OFFER_COUNT} services, priced in rand.
                  </p>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Community */}
        <NavigationMenuItem>
          <Trigger>Community</Trigger>
          <NavigationMenuContent>
            <div className="w-[340px] p-5">
              <Eyebrow>{COMMUNITY.title}</Eyebrow>
              <ul className="grid gap-1">
                {COMMUNITY.links.map((item) => (
                  <li key={item.href}><PanelLink item={item} /></li>
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
