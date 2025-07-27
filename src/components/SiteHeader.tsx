import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import MegaNavigation from '@/components/MegaNavigation';

const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="nav-sticky bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-width">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/src/assets/omni-logo.png" 
              alt="Omni Wellness Media" 
              className="logo-header"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href 
                      ? 'text-primary' 
                      : 'text-foreground/80'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mega Navigation for larger menus */}
            <MegaNavigation />
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link to="/wellness-exchange">Wellness Exchange</Link>
              </Button>
              <Button asChild>
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  <nav className="flex flex-col space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-base font-medium transition-colors hover:text-primary ${
                          location.pathname === item.href 
                            ? 'text-primary' 
                            : 'text-foreground'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="border-t pt-6 space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/wellness-exchange" onClick={() => setIsMenuOpen(false)}>
                        Wellness Exchange
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;