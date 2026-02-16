import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  User, 
  Settings, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  Home,
  Heart,
  Store,
  Plane,
  Briefcase,
  Bot,
  Globe,
  Search,
  ChevronDown,
  Users
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { handleKeyboardNavigation, announceToScreenReader } from '@/lib/accessibility';
import { CartIcon } from '@/components/cart/CartIcon';

import { SearchAutocomplete } from '@/components/product/SearchAutocomplete';
import { MegaNavigation } from './MegaNavigation';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: {
    title: string;
    href: string;
    description: string;
    icon: string;
  }[];
}

const UnifiedNavigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems: NavItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      title: 'About',
      href: '/about',
      icon: Users,
    },
    {
      title: 'Travel',
      icon: Plane,
      children: [
        { title: 'Annual Omni Wellness Retreat', href: '/tour-detail/winter-wine-country-wellness', description: 'Transformative 4-day retreat', icon: '🧘‍♀️' },
        { title: 'Great Mother Cave Tour', href: '/tours/great-mother-cave-tour', description: 'Sacred indigenous journey with Chief Kingsley', icon: '⛰️' },
        { title: 'Muizenberg Cave Tour', href: '/tours/muizenberg-cave-tours', description: 'Wellness cave journey', icon: '🏔️' },
        { title: 'Kalk Bay Tour', href: '/tours/kalk-bay-tour', description: 'Coastal cultural experience', icon: '🌊' },
      ]
    },
    {
      title: 'Store',
      icon: Store,
      children: [
        { title: 'Travel Well Connected', href: '/travel-well-connected-store', description: 'eSIM & travel data', icon: '📱' },
        { title: 'RoamBuddy eSIM', href: '/roambuddy-store', description: 'Global eSIM solutions', icon: '🌐' },
      ]
    },
    {
      title: 'Services',
      icon: Briefcase,
      children: [
        { title: 'Business Consulting', href: '/business-consulting', description: 'Strategic business development', icon: '💼' },
        { title: 'Media Production', href: '/media-production', description: 'Content creation services', icon: '🎬' },
        { title: 'Web Development', href: '/web-development', description: 'Digital solutions', icon: '💻' },
      ]
    },
    {
      title: 'Blog',
      href: '/blog',
      icon: Globe,
    },
    {
      title: 'Contact',
      href: '/contact',
      icon: Heart,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      announceToScreenReader('Successfully signed out', 'polite');
    } catch (error) {
      console.error('Error signing out:', error);
      announceToScreenReader('Error signing out, please try again', 'assertive');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    announceToScreenReader('Navigation menu closed', 'polite');
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    announceToScreenReader('Navigation menu opened', 'polite');
  };

  return (
    <header 
      role="banner"
      aria-label="Site header"
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/85 shadow-sm' 
          : 'bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/Omni%20Horizontal%20Logo-07.png" 
                alt="Omni Wellness Media" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop - Compact */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <SearchAutocomplete />
          </div>

          {/* Desktop Mega Navigation */}
          <MegaNavigation />

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <CartIcon />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background border-border z-[100]" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || 'Wellness Member'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/wellness-exchange/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user && user.email === 'sandy@omniwellness.co.za' && (
                      <DropdownMenuItem asChild>
                        <Link to="/provider-dashboard" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Provider Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <CartIcon />
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link to="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={isMobileMenuOpen}
                  onClick={openMobileMenu}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center">
                    <img src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/partner-logos%2A%2A%20(Brand%20Assets)/Omni%20Horizontal%20Logo-07.png" alt="Omni" className="h-8 w-auto" />
                  </SheetTitle>
                </SheetHeader>
                
                {/* Mobile Search */}
                <div className="mt-4 mb-2">
                  <SearchAutocomplete />
                </div>
                
                <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {navigationItems.map((item) => (
                    <div key={item.title}>
                      {item.children ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm font-medium text-muted-foreground px-2">
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.title}
                          </div>
                          <div className="ml-6 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center p-2 rounded-md text-sm hover:bg-accent transition-colors ${
                                  location.pathname === child.href ? 'bg-accent text-accent-foreground' : ''
                                }`}
                              >
                                <span className="mr-3">{child.icon}</span>
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.href!}
                          onClick={closeMobileMenu}
                          className={`flex items-center p-3 rounded-md text-sm hover:bg-accent transition-colors ${
                            location.pathname === item.href ? 'bg-accent text-accent-foreground' : ''
                          }`}
                        >
                          <item.icon className="w-4 h-4 mr-3" />
                          {item.title}
                          {item.badge && (
                            <span className="ml-auto px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  ))}

                  {!user && (
                    <div className="pt-4 border-t space-y-2">
                      <Button asChild className="w-full justify-start">
                        <Link to="/auth" onClick={closeMobileMenu}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnifiedNavigation;