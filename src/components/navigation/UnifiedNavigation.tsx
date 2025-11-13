import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getOmniLogo } from '@/lib/images';

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
      title: 'Wellness',
      icon: Heart,
      children: [
        { title: 'Browse Deals', href: '/wellness-deals', description: 'Discover wellness deals and offers', icon: '💊' },
        { title: 'Spa & Beauty', href: '/wellness-deals?category=spa', description: 'Rejuvenating spa treatments', icon: '🧖‍♀️' },
        { title: 'Fitness & Movement', href: '/wellness-deals?category=fitness', description: 'Active wellness programs', icon: '🏃‍♀️' },
        { title: 'Mindfulness', href: '/wellness-deals?category=mindfulness', description: 'Meditation and mental wellness', icon: '🧘‍♀️' },
        { title: 'Nutrition', href: '/wellness-deals?category=nutrition', description: 'Healthy eating and lifestyle', icon: '🥗' },
      ]
    },
    {
      title: 'Travel',
      icon: Plane,
      children: [
        { title: 'All Retreats', href: '/tours-retreats', description: 'Wellness travel experiences', icon: '🏞️' },
        { title: 'Weekend Getaways', href: '/tour-category/weekend-retreats', description: 'Short wellness breaks', icon: '🌄' },
        { title: 'Wellness Retreats', href: '/tour-category/wellness-retreats', description: 'Transformative experiences', icon: '🧘‍♀️' },
        { title: 'Study Abroad', href: '/tour-category/study-abroad', description: 'Educational wellness programs', icon: '🎓' },
        { title: '2BeWell Community', href: '/two-be-well', description: 'Join our wellness community', icon: '💝' },
      ]
    },
    {
      title: 'Store',
      icon: Store,
      children: [
        { title: 'Browse Store', href: '/store', description: 'Browse all wellness products', icon: '🛒' },
        { title: 'Roaming Packages', href: '/wellness-roaming-packages', description: 'Travel connectivity & services', icon: '✈️' },
        { title: 'Travel Connected', href: '/travel-well-connected-store', description: 'Travel connectivity solutions', icon: '🌐' },
        { title: 'Wellness Products', href: '/two-be-well-shop', description: 'Curated wellness products', icon: '🛍️' },
        { title: 'Data & Services', href: '/data-products', description: 'Digital wellness tools', icon: '📊' },
      ]
    },
    {
      title: 'Services',
      icon: Briefcase,
      children: [
        { title: 'Business Consulting', href: '/business-consulting', description: 'Strategic business development', icon: '💼' },
        { title: 'Media Production', href: '/media-production', description: 'Content creation services', icon: '🎬' },
        { title: 'Web Development', href: '/web-development', description: 'Digital solutions', icon: '💻' },
        { title: 'Marketplace', href: '/wellness-exchange/marketplace', description: 'Find wellness providers', icon: '🛒' },
        { title: 'Provider Directory', href: '/provider-directory', description: 'Discover wellness providers', icon: '👥' },
      ]
    },
    {
      title: 'AI Tools',
      href: '/ai-tools',
      icon: Bot,
      badge: 'NEW',
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
      aria-label="Main navigation"
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
            <Link to="/" className="flex items-center space-x-3">
              <img 
                {...getOmniLogo()} 
                alt="Omni Wellness Media" 
                className="h-10 w-10 object-contain rounded-lg border border-primary/20 p-1 transition-all duration-300 hover:border-primary/40 hover:scale-105"
              />
              <div className="hidden sm:block">
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  Omni
                </span>
                <span className="text-xs text-muted-foreground ml-1 hidden lg:inline">
                  Wellness
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex lg:items-center lg:space-x-1"
            role="navigation"
            aria-label="Primary navigation"
          >
            {navigationItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-9 px-3 text-sm font-medium hover:bg-accent/80 transition-colors"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                        <ChevronDown className="w-3 h-3 ml-1" />
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2">
                      <div className="grid gap-1">
                        {item.children.map((child) => (
                          <Link key={child.href} to={child.href}>
                            <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-accent/80 transition-colors">
                              <span className="text-lg">{child.icon}</span>
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{child.title}</div>
                                <div className="text-xs text-muted-foreground">{child.description}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="ghost" className="h-9 px-3 text-sm font-medium">
                    <Link to={item.href!} className="flex items-center">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.title}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Search - Hidden on mobile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              aria-label="Search the website"
              title="Search"
            >
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>

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
                  <DropdownMenuContent className="w-56" align="end" forceMount>
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
                    <img {...getOmniLogo()} alt="Omni" className="h-8 w-8 mr-3" />
                    Omni Wellness
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
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