import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, Plane, Store, Briefcase
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface MegaNavItem {
  title: string;
  href: string;
  description: string;
  icon?: string;
  count?: number;
  featured?: boolean;
}

interface MegaNavSection {
  title: string;
  items: MegaNavItem[];
}

export const MegaNavigation = () => {
  const travelSections: MegaNavSection[] = [
    {
      title: 'Tours & Retreats',
      items: [
        { title: 'Annual Omni Wellness Retreat', href: '/tour-detail/winter-wine-country-wellness', description: 'Transformative 4-day retreat', icon: '🧘‍♀️', featured: true },
        { title: 'Great Mother Cave Tour', href: '/tours/great-mother-cave-tour', description: 'Sacred indigenous journey', icon: '⛰️' },
        { title: 'Muizenberg Cave Tour', href: '/tours/muizenberg-cave-tours', description: 'Wellness cave journey', icon: '🏔️' },
        { title: 'Kalk Bay Tour', href: '/tours/kalk-bay-tour', description: 'Coastal cultural experience', icon: '🌊' },
      ]
    }
  ];

  const storeSections: MegaNavSection[] = [
    {
      title: 'Shop',
      items: [
        { title: 'Travel Well Connected', href: '/travel-well-connected-store', description: 'eSIM & data packages', icon: '📱', featured: true },
        { title: 'RoamBuddy eSIM', href: '/roambuddy-store', description: 'Global eSIM solutions', icon: '🌐' },
      ]
    }
  ];

  const servicesSections: MegaNavSection[] = [
    {
      title: 'Business Services',
      items: [
        { title: 'Business Consulting', href: '/business-consulting', description: 'Strategic growth', icon: '📊' },
        { title: 'Media Production', href: '/media-production', description: 'Video & content', icon: '🎬' },
        { title: 'Web Development', href: '/web-development', description: 'Websites & apps', icon: '💻' },
      ]
    }
  ];

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* About */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Travel Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            <Plane className="mr-2 h-4 w-4" />
            Travel
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] bg-background">
              {travelSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h4 className="text-sm font-semibold leading-none text-foreground/80 uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="grid gap-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:shadow-sm",
                              item.featured && "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && <span className="text-lg">{item.icon}</span>}
                              <div className="text-sm font-medium leading-none text-foreground">
                                {item.title}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Store Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            <Store className="mr-2 h-4 w-4" />
            Store
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] bg-background">
              {storeSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h4 className="text-sm font-semibold leading-none text-foreground/80 uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:shadow-sm",
                              item.featured && "bg-gradient-to-r from-primary/10 to-transparent border border-primary/20"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && <span className="text-lg">{item.icon}</span>}
                              <div className="text-sm font-medium leading-none text-foreground">
                                {item.title}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Services Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            <Briefcase className="mr-2 h-4 w-4" />
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] bg-background">
              {servicesSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h4 className="text-sm font-semibold leading-none text-foreground/80 uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && <span className="text-lg">{item.icon}</span>}
                              <div className="text-sm font-medium leading-none text-foreground">{item.title}</div>
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>


        {/* Contact */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
