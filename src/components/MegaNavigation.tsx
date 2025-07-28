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
      title: 'Services',
      items: [
        { name: 'Business Development', href: '/business-consulting', icon: '💼' },
        { name: 'Media Production', href: '/media-production', icon: '🎬' },
        { name: 'Social Media Strategy', href: '/social-media-strategy', icon: '📱' },
        { name: 'Web Development', href: '/web-development', icon: '💻' },
        { name: 'Documentary Production', href: '/services/documentary-production', icon: '🎥' },
        { name: 'Videography Services', href: '/services/videography', icon: '📹' },
        { name: 'Custom Art & Design', href: '/services/custom-art', icon: '🎨' },
        { name: 'Consultation Services', href: '/services/consultation', icon: '🤝' }
      ]
    },
    {
      title: 'Wellness Exchange',
      items: [
        { name: 'Community Hub', href: '/wellness-community', icon: '🌱' },
        { name: 'Marketplace', href: '/wellness-marketplace', icon: '🛒' },
        { name: 'Service Providers', href: '/wellness-exchange', icon: '🔄' },
        { name: 'Find Services', href: '/search-services', icon: '🔍' },
        { name: 'Community Blog', href: '/community-blog', icon: '✍️' },
        { name: 'My Account', href: '/wellness-account', icon: '👤' },
        { name: 'Add Service', href: '/add-service', icon: '➕' },
        { name: 'Provider Portal', href: '/provider-portal', icon: '🏢' }
      ]
    },
    {
      title: 'Tours & Retreats',
      items: [
        { name: 'All Tours & Retreats', href: '/tours-retreats', icon: '🏞️' },
        { name: 'Wellness Retreats', href: '/tour-category/wellness-retreats', icon: '🧘‍♀️' },
        { name: 'Weekend Getaways', href: '/tour-category/weekend-retreats', icon: '🌄' },
        { name: 'Conscious Living', href: '/tour-category/conscious-living', icon: '🌿' },
        { name: 'Winter Wellness', href: '/tour-category/winter-wellness', icon: '❄️' },
        { name: 'Indigenous Wisdom', href: '/tour-category/indigenous-wisdom', icon: '🏺' },
        { name: 'Study Abroad Programs', href: '/tour-category/study-abroad', icon: '🎓' },
        { name: '2BeWell Community', href: '/two-be-well', icon: '💝' }
      ]
    },
    {
      title: 'Travel & Connect',
      items: [
        { name: 'Travel Well Connected', href: '/travel-well-connected-store', icon: '🌐' },
        { name: 'Wellness Travel Services', href: '/wellness-roaming-packages', icon: '📱' },
        { name: 'AI Travel Tools', href: '/ai-tools', icon: '🤖' },
        { name: 'Data Products', href: '/data-products', icon: '📊' },
        { name: 'Device Compatibility', href: '/device-compatibility', icon: '📱' },
        { name: 'Technical Overview', href: '/technical-overview', icon: '⚙️' },
        { name: '2BeWell Shop', href: '/two-be-well-shop', icon: '🛍️' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { name: 'Blog & Insights', href: '/blog', icon: '📝' },
        { name: 'Podcast', href: '/podcast', icon: '🎙️' },
        { name: 'Portfolio', href: '/portfolio', icon: '📂' },
        { name: 'About Us', href: '/about', icon: 'ℹ️' },
        { name: 'Contact', href: '/contact', icon: '📞' },
        { name: 'Resources', href: '/resources', icon: '📚' },
        { name: 'Partners Directory', href: '/partners-directory', icon: '🤝' },
        { name: 'Payment Success', href: '/payment-success', icon: '✅' }
      ]
    }
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {megaMenuItems.map((menuItem, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuTrigger className="capitalize">{menuItem.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                {menuItem.items.map((item, i) => (
                  <li key={i}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex h-12 items-center justify-start rounded-md bg-transparent px-3 font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground sm:text-sm",
                          location.pathname === item.href ? "text-primary" : ""
                        )}
                      >
                        <span className="mr-2">{item.icon}</span>
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
