
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown,
  Home,
  Info,
  Briefcase,
  FolderOpen,
  BookOpen,
  Podcast,
  Heart,
  ShoppingBag,
  Users,
  Bot,
  Mail,
  Activity
} from "lucide-react";
import { CartIcon } from "@/components/cart/CartIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

  const mainNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Services", path: "/services", icon: Briefcase },
    { name: "Portfolio", path: "/portfolio", icon: FolderOpen },
    { name: "Blog", path: "/blog", icon: BookOpen },
    { name: "Podcast", path: "/podcast", icon: Podcast },
  ];

  const platformItems = [
    { name: "2BeWell Platform", path: "/2bewell", icon: Heart },
    { name: "2BeWell Shop", path: "/2bewell-shop", icon: ShoppingBag },
    { name: "Wellness Exchange", path: "/wellness-exchange", icon: Activity },
  ];

  const resourceItems = [
    { name: "Partners", path: "/partners", icon: Users },
    { name: "AI Tools", path: "/ai-tools", icon: Bot },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const wellnessExchangeItems = [
    { name: "Marketplace", path: "/wellness-exchange/marketplace", description: "Browse wellness services" },
    { name: "Post a Want", path: "/wellness-exchange/add-want", description: "Request services from community" },
    { name: "Community", path: "/wellness-exchange/community", description: "Connect with wellness practitioners" },
    { name: "Provider Dashboard", path: "/wellness-exchange/provider-dashboard", description: "Manage your services" },
    { name: "My Account", path: "/wellness-exchange/account", description: "View your profile and bookings" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isWellnessActive = () => location.pathname.startsWith('/wellness-exchange');

  return (
    <nav className="fixed top-0 w-full glass shadow-lg z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
                alt="Omni Wellness Media" 
                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute inset-0 bg-rainbow-enhanced rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-rainbow-enhanced">
                Omni Wellness
              </span>
              <div className="text-xs text-gray-600 -mt-1 font-medium">Conscious Media</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Main Navigation */}
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive(item.path)
                            ? "bg-wellhub-gradient text-white shadow-md"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
                
                {/* Platforms Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`text-gray-700 hover:text-omni-indigo data-[state=open]:bg-rainbow-subtle ${
                    platformItems.some(item => isActive(item.path)) || isWellnessActive() ? 'bg-rainbow-subtle text-omni-indigo font-semibold' : ''
                  }`}>
                    <Activity className="h-4 w-4 mr-1" />
                    Platforms
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[450px]">
                      <div className="grid gap-1">
                        <h4 className="font-semibold text-lg text-gray-900">Wellness Platforms</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Discover our comprehensive wellness ecosystem
                        </p>
                      </div>
                      <div className="grid gap-3">
                        {platformItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavigationMenuLink key={item.name} asChild>
                              <Link
                                to={item.path}
                                className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-rainbow-subtle ${
                                  isActive(item.path) ? "bg-rainbow-subtle text-omni-indigo" : "hover:text-omni-indigo"
                                }`}
                              >
                                <Icon className="h-5 w-5 text-omni-orange group-hover:scale-110 transition-transform" />
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.name === "2BeWell Platform" && "Wellness resources & community"}
                                    {item.name === "2BeWell Shop" && "Wellness products & services"}
                                    {item.name === "Wellness Exchange" && "Trade services with WellCoins"}
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          );
                        })}
                      </div>
                      
                      {/* Wellness Exchange Details */}
                      <div className="border-t pt-3 mt-3">
                        <h5 className="font-medium text-sm text-gray-600 mb-2">Wellness Exchange</h5>
                        <div className="grid gap-1">
                          {wellnessExchangeItems.slice(0, 3).map((item) => (
                            <NavigationMenuLink key={item.name} asChild>
                              <Link
                                to={item.path}
                                className={`block px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-50 ${
                                  isActive(item.path)
                                    ? "bg-gray-50 text-omni-indigo font-medium"
                                    : "text-gray-600 hover:text-omni-indigo"
                                }`}
                              >
                                {item.name}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources */}
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${
                          isActive(item.path)
                            ? "bg-rainbow-subtle text-omni-indigo font-semibold"
                            : "text-gray-700 hover:text-omni-indigo"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-4 hover:bg-rainbow-subtle">
                    <User className="h-4 w-4 mr-2" />
                    <span className="max-w-32 truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/wellness-exchange/account" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wellness-exchange/provider-dashboard" className="flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Provider Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="wellness" size="lg" className="ml-4">
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-4 pb-4 space-y-2">
              {/* Main Navigation */}
              <div className="space-y-1">
                <h4 className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Main</h4>
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-rainbow-subtle text-omni-indigo font-semibold"
                          : "text-gray-700 hover:text-omni-indigo hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Platforms */}
              <div className="space-y-1 pt-4">
                <h4 className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</h4>
                {platformItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-rainbow-subtle text-omni-indigo font-semibold"
                          : "text-gray-700 hover:text-omni-indigo hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Wellness Exchange Submenu */}
              <div className="space-y-1 pt-2">
                <h5 className="px-6 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Wellness Exchange</h5>
                {wellnessExchangeItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-6 py-2 text-sm rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-rainbow-subtle text-omni-indigo font-medium"
                        : "text-gray-600 hover:text-omni-indigo hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Resources */}
              <div className="space-y-1 pt-4">
                <h4 className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</h4>
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-rainbow-subtle text-omni-indigo font-semibold"
                          : "text-gray-700 hover:text-omni-indigo hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile Auth Section */}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-600">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link
                      to="/wellness-exchange/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-omni-indigo hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">My Account</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg text-center font-medium bg-rainbow-gradient text-white"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
