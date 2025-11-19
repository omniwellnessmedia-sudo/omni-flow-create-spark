import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, Heart, Users, Plane, Store, Briefcase, Bot, 
  ChevronDown, Sparkles, TrendingUp 
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
  const wellnessSections: MegaNavSection[] = [
    {
      title: 'Wellness Marketplace',
      items: [
        { title: 'Wellness Exchange', href: '/wellness-exchange', description: 'Community marketplace', icon: '🔄', featured: true },
        { title: 'Provider Directory', href: '/provider-directory', description: 'Verified providers', icon: '👨‍⚕️' },
      ]
    }
  ];

  const travelSections: MegaNavSection[] = [
    {
      title: 'Tours & Retreats',
      items: [
        { title: 'All Retreats', href: '/tours-retreats', description: 'Wellness travel experiences', icon: '🏞️', featured: true },
        { title: 'Weekend Getaways', href: '/tour-category/weekend-retreats', description: 'Short wellness breaks', icon: '🌄' },
        { title: 'Wellness Retreats', href: '/tour-category/wellness-retreats', description: 'Transformative experiences', icon: '🧘' },
        { title: 'Indigenous Wisdom', href: '/tour-category/indigenous-wisdom', description: 'Cultural healing tours', icon: '🪶' },
        { title: 'Study Abroad', href: '/tour-category/study-abroad', description: 'Educational programs', icon: '🎓' },
      ]
    }
  ];

  const storeSections: MegaNavSection[] = [
    {
      title: 'Shop',
      items: [
        { title: '2BeWell Shop', href: '/twobewellshop', description: 'Natural wellness products', icon: '🌿', featured: true },
        { title: 'Travel Connectivity', href: '/travel-well-connected-store', description: 'eSIM & data packages', icon: '📱' },
        { title: 'CJ Affiliate Products', href: '/cj-affiliate-products', description: 'Curated wellness', icon: '⭐' },
      ]
    },
    {
      title: 'Top Categories',
      items: [
        { title: 'General Wellness', href: '/cj-affiliate-products?category=General+Wellness', description: 'Holistic health', count: 359 },
        { title: 'Fitness Equipment', href: '/cj-affiliate-products?category=Fitness+Equipment', description: 'Home gym gear', count: 69 },
        { title: 'Yoga Equipment', href: '/cj-affiliate-products?category=Yoga+Equipment', description: 'Mats & props', count: 65 },
        { title: 'Nutrition', href: '/cj-affiliate-products?category=Nutrition+and+Supplements', description: 'Supplements', count: 60 },
      ]
    }
  ];

  const servicesSections: MegaNavSection[] = [
    {
      title: 'Business Services',
      items: [
        { title: 'Business Consulting', href: '/business-consulting', description: 'Strategic growth', icon: '📊' },
        { title: 'Media Production', href: '/media-production', description: 'Video & content', icon: '🎬' },
        { title: 'Conscious Media Infrastructure', href: '/conscious-media-infrastructure', description: 'Handpicked media equipment', icon: '📷' },
        { title: 'Social Media Strategy', href: '/social-media-strategy', description: 'Digital marketing', icon: '📱' },
        { title: 'Web Development', href: '/web-development', description: 'Websites & apps', icon: '💻' },
      ]
    }
  ];

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="flex-wrap">
        {/* Home */}
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
              <Home className="mr-2 h-4 w-4" />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Wellness Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            <Heart className="mr-2 h-4 w-4" />
            Wellness
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[600px] lg:grid-cols-2 bg-background">
              {wellnessSections.map((section) => (
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
                                {item.featured && (
                                  <span className="ml-2 text-xs text-primary">★</span>
                                )}
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
                                {item.featured && (
                                  <span className="ml-2 text-xs text-primary">★</span>
                                )}
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
            <div className="grid gap-3 p-6 w-[400px] lg:w-[700px] lg:grid-cols-2 bg-background">
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
                            <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-2">
                                {item.icon && <span className="text-lg">{item.icon}</span>}
                                <div className="text-sm font-medium leading-none text-foreground">
                                  {item.title}
                                  {item.featured && (
                                    <span className="ml-2 text-xs text-primary">★</span>
                                  )}
                                </div>
                              </div>
                              {item.count && (
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">{item.count}</span>
                              )}
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};
