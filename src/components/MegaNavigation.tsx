import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';

interface MegaMenuItem {
  title: string;
  items: { name: string; href: string; icon: string }[];
}

const MegaNavigation = () => {
  const location = useLocation();

  const megaMenuItems = [
    {
      title: 'Omni Wellness Media',
      items: [
        { name: 'Home', href: '/', icon: '🏠' },
        { name: 'About Us', href: '/about', icon: 'ℹ️' },
        { name: 'Contact', href: '/contact', icon: '📞' },
        { name: 'Blog & Insights', href: '/blog', icon: '📝' },
        { name: 'Podcast', href: '/podcast', icon: '🎙️' },
        { name: 'Portfolio', href: '/portfolio', icon: '📂' }
      ]
    },
    {
      title: 'Omni Wellness Travel',
      items: [
        { name: 'All Tours', href: '/tours', icon: '🗺️' },
        { name: 'Great Mother Cave Tour', href: '/tours/great-mother-cave-tour', icon: '⛰️' },
        { name: 'Annual Wellness Retreat', href: '/tour-category/weekend-retreats', icon: '🧘‍♀️' },
        { name: 'Muizenberg Cave Tour', href: '/tours/muizenberg-cave-tours', icon: '🏔️' },
        { name: 'Kalk Bay Tour', href: '/tours/kalk-bay-tour', icon: '🌊' },
      ]
    },
    {
      title: 'Omni Wellness Store',
      items: [
        { name: 'ROAM eSIM Store', href: '/roambuddy-store', icon: '📱' }
      ]
    },
    {
      title: 'Omni Wellness Services',
      items: [
        { name: 'Business Consulting', href: '/business-consulting', icon: '💼' },
        { name: 'Media Production', href: '/media-production', icon: '🎬' },
        { name: 'Social Media Strategy', href: '/social-media-strategy', icon: '📱' },
        { name: 'Web Development', href: '/web-development', icon: '💻' },
        { name: 'Wellness Exchange', href: '/wellness-exchange', icon: '🔄' }
      ]
    },
    {
      title: 'Omni Wellness AI',
      items: [
        { name: 'AI Travel Tools', href: '/ai-tools', icon: '🤖' },
        { name: 'Exercise Library', href: '/exercise-library', icon: '💪' },
        { name: 'Wellness Calculators', href: '/ai-tools', icon: '🧮' }
      ]
    },
    {
      title: 'Omni Wellness Impact',
      items: [
        { name: 'Community Blog', href: '/community-blog', icon: '✍️' },
        { name: 'CSR Stories', href: '/impact', icon: '🌍' },
        { name: 'Partners Directory', href: '/partners-directory', icon: '🤝' },
        { name: 'Resources', href: '/resources', icon: '📚' }
      ]
    }
  ];

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex-nowrap gap-1 justify-center">
        {megaMenuItems.map((menuItem, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuTrigger className="text-[10px] lg:text-xs px-1.5 lg:px-2 py-1 h-auto whitespace-nowrap">
              {menuItem.title.replace('Omni Wellness ', '').toUpperCase()}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <ul className="grid gap-2 p-4 w-[350px] md:w-[400px] md:grid-cols-2 lg:w-[500px] bg-background border shadow-lg">
                {menuItem.items.map((item, i) => (
                  <li key={i}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex h-10 items-center justify-start rounded-md bg-background px-3 font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm",
                          location.pathname === item.href ? "text-primary" : ""
                        )}
                      >
                        <span className="mr-2 text-sm">{item.icon}</span>
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MegaNavigation;
