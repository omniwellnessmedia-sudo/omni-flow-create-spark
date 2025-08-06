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
        { name: 'Home & Stories', href: '/', icon: '🏠' },
        { name: 'Blog & Insights', href: '/blog', icon: '📝' },
        { name: 'Podcast', href: '/podcast', icon: '🎙️' },
        { name: 'Portfolio', href: '/portfolio', icon: '📂' },
        { name: 'About Us', href: '/about', icon: 'ℹ️' },
        { name: 'Contact', href: '/contact', icon: '📞' }
      ]
    },
    {
      title: 'Omni Wellness Deals',
      items: [
        { name: 'Browse All Deals', href: '/wellness-deals', icon: '💊' },
        { name: 'Spa & Beauty', href: '/wellness-deals?category=spa', icon: '🧖‍♀️' },
        { name: 'Fitness & Movement', href: '/wellness-deals?category=fitness', icon: '🏃‍♀️' },
        { name: 'Retreats & Getaways', href: '/wellness-deals?category=retreats', icon: '🏞️' },
        { name: 'Mindfulness & Meditation', href: '/wellness-deals?category=mindfulness', icon: '🧘‍♀️' },
        { name: 'Nutrition & Cooking', href: '/wellness-deals?category=nutrition', icon: '🥗' },
        { name: 'Digital Courses', href: '/wellness-deals?category=digital', icon: '💻' }
      ]
    },
    {
      title: 'Omni Wellness Travel',
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
      title: 'Omni Wellness Store',
      items: [
        { name: 'Travel Well Connected', href: '/travel-well-connected-store', icon: '🌐' },
        { name: 'Travel Services', href: '/wellness-roaming-packages', icon: '📱' },
        { name: 'Data Products', href: '/data-products', icon: '📊' },
        { name: 'Device Compatibility', href: '/device-compatibility', icon: '📱' },
        { name: 'Technical Overview', href: '/technical-overview', icon: '⚙️' },
        { name: '2BeWell Shop', href: '/two-be-well-shop', icon: '🛍️' }
      ]
    },
    {
      title: 'Omni Wellness Services',
      items: [
        { name: 'Business Development', href: '/business-consulting', icon: '💼' },
        { name: 'Media Production', href: '/media-production', icon: '🎬' },
        { name: 'Social Media Strategy', href: '/social-media-strategy', icon: '📱' },
        { name: 'Web Development', href: '/web-development', icon: '💻' },
        { name: 'Documentary Production', href: '/services/documentary-production', icon: '🎥' },
        { name: 'Videography Services', href: '/services/videography', icon: '📹' },
        { name: 'Custom Art & Design', href: '/services/custom-art', icon: '🎨' },
        { name: 'Consultation Services', href: '/services/consultation', icon: '🤝' },
        { name: 'Community Hub', href: '/wellness-community', icon: '🌱' },
        { name: 'Marketplace', href: '/wellness-marketplace', icon: '🛒' },
        { name: 'Service Exchange', href: '/wellness-exchange', icon: '🔄' },
        { name: 'Find Services', href: '/search-services', icon: '🔍' },
        { name: 'My Account', href: '/wellness-account', icon: '👤' },
        { name: 'Add Service', href: '/add-service', icon: '➕' },
        { name: 'Provider Portal', href: '/provider-portal', icon: '🏢' }
      ]
    },
    {
      title: 'Omni Wellness AI',
      items: [
        { name: 'AI Travel Tools', href: '/ai-tools', icon: '🤖' },
        { name: 'Exercise Library', href: '/exercise-library', icon: '💪' },
        { name: 'Wellness Calculators', href: '/ai-tools', icon: '🧮' },
        { name: 'Smart Recommendations', href: '/ai-tools', icon: '💡' }
      ]
    },
    {
      title: 'Omni Wellness Impact',
      items: [
        { name: 'Community Blog', href: '/community-blog', icon: '✍️' },
        { name: 'CSR Stories', href: '/impact', icon: '🌍' },
        { name: 'Partners Directory', href: '/partners-directory', icon: '🤝' },
        { name: 'Resources', href: '/resources', icon: '📚' },
        { name: 'Donation Tracker', href: '/impact', icon: '💝' }
      ]
    }
  ];

  return (
    <NavigationMenu className="max-w-full">
      <NavigationMenuList className="flex-wrap gap-1">
        {megaMenuItems.map((menuItem, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuTrigger className="text-xs xl:text-sm px-2 py-1 h-auto whitespace-nowrap">
              OMNI {menuItem.title.replace('Omni Wellness ', '')}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 p-4 w-[350px] md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                {menuItem.items.map((item, i) => (
                  <li key={i}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "group flex h-10 items-center justify-start rounded-md bg-transparent px-3 font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm",
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
