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
        { title: 'Social Media Strategy', href: '/social-media-strategy', description: 'Digital marketing', icon: '📱' },
        { title: 'Web Development', href: '/web-development', description: 'Websites & apps', icon: '💻' },
      ]
    }
  ];

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
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
          <NavigationMenuTrigger>
            <Heart className="mr-2 h-4 w-4" />
            Wellness
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-2 gap-6 p-6">
              {wellnessSections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            item.featured && "bg-primary/5 border border-primary/20"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <span className="text-lg">{item.icon}</span>}
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                              {item.featured && (
                                <Sparkles className="inline ml-1 h-3 w-3 text-primary" />
                              )}
                            </div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
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
          <NavigationMenuTrigger>
            <Plane className="mr-2 h-4 w-4" />
            Travel
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] p-6">
              {travelSections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="grid grid-cols-2 gap-3">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            item.featured && "bg-primary/5 border border-primary/20"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <span className="text-lg">{item.icon}</span>}
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
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
          <NavigationMenuTrigger>
            <Store className="mr-2 h-4 w-4" />
            Store
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[700px] grid-cols-2 gap-6 p-6">
              {storeSections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            item.featured && "bg-primary/5 border border-primary/20"
                          )}
                        >
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              {item.icon && <span className="text-lg">{item.icon}</span>}
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                            </div>
                            {item.count && (
                              <span className="text-xs text-muted-foreground">
                                {item.count}
                              </span>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
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
          <NavigationMenuTrigger>
            <Briefcase className="mr-2 h-4 w-4" />
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] p-6">
              {servicesSections.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </h3>
                  <ul className="grid grid-cols-2 gap-3">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <span className="text-lg">{item.icon}</span>}
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* AI Tools - Temporarily Hidden */}
        {/* <NavigationMenuItem>
          <Link to="/ai-tools">
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              <Bot className="mr-2 h-4 w-4" />
              AI Tools
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">NEW</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}

        {/* Community */}
        <NavigationMenuItem>
          <Link to="/wellness-community">
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
              <Users className="mr-2 h-4 w-4" />
              Community
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
