
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Podcast", path: "/podcast" },
    { name: "2BeWell", path: "/2bewell" },
    { name: "2BeWell Shop", path: "/2bewell-shop" },
    { name: "Partners", path: "/partners" },
    { name: "AI Tools", path: "/ai-tools" },
    { name: "Contact", path: "/contact" },
  ];

  const wellnessExchangeItems = [
    { name: "Overview", path: "/wellness-exchange" },
    { name: "Marketplace", path: "/wellness-exchange/marketplace" },
    { name: "Post a Want", path: "/wellness-exchange/add-want" },
    { name: "Community", path: "/wellness-exchange/community" },
    { name: "Search Services", path: "/wellness-exchange/search" },
    { name: "My Account", path: "/wellness-exchange/account" },
    { name: "My Dashboard", path: "/wellness-exchange/provider-dashboard" },
    { name: "Join Exchange", path: "/wellness-exchange/provider-signup" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
              alt="Omni Wellness Media" 
              className="h-10 w-10"
            />
            <span className="font-heading font-bold text-xl bg-rainbow-gradient bg-clip-text text-transparent">
              Omni Wellness Media
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.slice(0, 6).map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
                        isActive(item.path)
                          ? "bg-gray-100 text-omni-indigo font-semibold"
                          : "text-gray-700 hover:text-omni-indigo"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
                
                {/* Wellness Exchange Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-omni-indigo">
                    Wellness Exchange
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <div className="grid gap-1">
                        <h4 className="font-medium text-sm text-gray-900">Wellness Exchange</h4>
                        <p className="text-xs text-gray-600">
                          Trade services, earn WellCoins, and build community connections
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {wellnessExchangeItems.map((item) => (
                          <NavigationMenuLink key={item.name} asChild>
                            <Link
                              to={item.path}
                              className={`block px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100 ${
                                isActive(item.path)
                                  ? "bg-gray-100 text-omni-indigo font-semibold"
                                  : "text-gray-700 hover:text-omni-indigo"
                              }`}
                            >
                              {item.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {navItems.slice(7).map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
                        isActive(item.path)
                          ? "bg-gray-100 text-omni-indigo font-semibold"
                          : "text-gray-700 hover:text-omni-indigo"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-4">
                    <User className="h-4 w-4 mr-2" />
                    {user.user_metadata?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/wellness-exchange/provider-dashboard">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="ml-4 bg-rainbow-gradient text-white">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-rainbow-subtle text-omni-indigo font-semibold"
                      : "text-gray-700 hover:text-omni-indigo hover:bg-rainbow-subtle"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              {user ? (
                <div className="border-t pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <Link
                    to="/wellness-exchange/provider-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-omni-indigo hover:bg-rainbow-subtle"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-omni-indigo hover:bg-rainbow-subtle"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t pt-2 mt-2">
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-rainbow-gradient text-white text-center"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
