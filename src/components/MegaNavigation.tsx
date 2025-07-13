import { useState, useRef, useCallback } from "react";
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
  Activity,
  ArrowRight
} from "lucide-react";
import { CartIcon } from "@/components/cart/CartIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MegaNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const mainNavItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: Home,
      hasDropdown: false
    },
    { 
      name: "About", 
      path: "/about", 
      icon: Info,
      hasDropdown: false
    },
    { 
      name: "Services", 
      path: "/services", 
      icon: Briefcase,
      hasDropdown: true,
      megaContent: {
        title: "Our Services",
        description: "Comprehensive wellness and media solutions",
        sections: [
          {
            title: "Business Development",
            items: [
              { name: "Strategic Consulting", path: "/services/business-consulting", description: "Growth & sustainability guidance" },
              { name: "Brand Development", path: "/services/branding", description: "Build compelling brand identities" },
              { name: "Financial Strategy", path: "/services/financial", description: "Sustainable financial planning" }
            ]
          },
          {
            title: "Media & Content",
            items: [
              { name: "Video Production", path: "/services/media-production", description: "Professional video content" },
              { name: "Photography", path: "/services/photography", description: "Powerful visual storytelling" },
              { name: "Content Creation", path: "/services/content", description: "Engaging multimedia content" }
            ]
          },
          {
            title: "Digital Services",
            items: [
              { name: "Web Development", path: "/services/web-development", description: "Custom websites & e-commerce" },
              { name: "Social Media Strategy", path: "/services/social-media", description: "Build online communities" },
              { name: "SEO & Marketing", path: "/services/marketing", description: "Drive organic growth" }
            ]
          }
        ]
      }
    },
    { 
      name: "Platforms", 
      path: "/platforms", 
      icon: Activity,
      hasDropdown: true,
      megaContent: {
        title: "Wellness Platforms",
        description: "Discover our comprehensive wellness ecosystem",
        sections: [
          {
            title: "2BeWell Ecosystem",
            items: [
              { name: "2BeWell Platform", path: "/2bewell", description: "Wellness resources & community", icon: Heart },
              { name: "2BeWell Shop", path: "/2bewell-shop", description: "Wellness products & services", icon: ShoppingBag }
            ]
          },
          {
            title: "Wellness Exchange",
            items: [
              { name: "Marketplace", path: "/wellness-exchange/marketplace#hero", description: "Browse wellness services" },
              { name: "Post a Want", path: "/wellness-exchange/add-want#hero", description: "Request services from community" },
              { name: "Community", path: "/wellness-exchange/community#hero", description: "Connect with practitioners" },
              { name: "Provider Dashboard", path: "/wellness-exchange/provider-dashboard", description: "Manage your services" }
            ]
          }
        ]
      }
    },
    { 
      name: "Resources", 
      path: "/resources", 
      icon: BookOpen,
      hasDropdown: true,
      megaContent: {
        title: "Resources & Insights",
        description: "Educational content and community resources",
        sections: [
          {
            title: "Content & Media",
            items: [
              { name: "Blog", path: "/blog", description: "Insights on wellness & sustainability", icon: BookOpen },
              { name: "Podcast", path: "/podcast", description: "Conversations that inspire", icon: Podcast },
              { name: "Portfolio", path: "/portfolio", description: "Our featured work", icon: FolderOpen }
            ]
          },
          {
            title: "Community",
            items: [
              { name: "Partners", path: "/partners", description: "Our trusted network", icon: Users },
              { name: "AI Tools", path: "/ai-tools", description: "Wellness technology solutions", icon: Bot },
              { name: "Contact", path: "/contact", description: "Get in touch with us", icon: Mail }
            ]
          }
        ]
      }
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleMouseEnter = useCallback((name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small delay to prevent premature closing
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  return (
    <nav className="nav-sticky glass shadow-lg border-b border-white/20">
      <div className="container-width">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20 lg:h-24 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" 
              alt="Omni Wellness Media" 
              className="logo-header"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-rainbow-subtle group ${
                        activeDropdown === item.name || item.megaContent?.sections.some(section => 
                          section.items.some(subItem => isActive(subItem.path))
                        ) ? "bg-rainbow-subtle text-omni-indigo" : "text-gray-700 hover:text-omni-indigo"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-rainbow-subtle ${
                        isActive(item.path) ? "bg-rainbow-subtle text-omni-indigo" : "text-gray-700 hover:text-omni-indigo"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
            
            {/* Cart and Auth */}
            <div className="flex items-center space-x-4 ml-8">
              <CartIcon />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="lg" className="hover:bg-rainbow-subtle">
                      <User className="h-5 w-5 mr-2" />
                      <span className="max-w-32 truncate">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="nav-dropdown w-56">
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
                <Button asChild variant="wellness" size="lg">
                  <Link to="/auth">Get Started</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button and Cart */}
          <div className="lg:hidden flex items-center space-x-2">
            <CartIcon />
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

        {/* Mega Menu Dropdown */}
        {activeDropdown && (
          <div 
            ref={megaMenuRef}
            className="absolute left-0 right-0 bg-white shadow-2xl border-t border-gray-100 mega-menu-container"
            onMouseEnter={cancelClose}
            onMouseLeave={handleMouseLeave}
          >
            {mainNavItems.map((item) => {
              if (item.name === activeDropdown && item.megaContent) {
                return (
                  <div key={item.name} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.megaContent.title}</h3>
                      <p className="text-gray-600 text-lg">{item.megaContent.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {item.megaContent.sections.map((section) => (
                        <div key={section.title} className="space-y-4">
                          <h4 className="font-semibold text-lg text-omni-indigo border-b border-gray-200 pb-2">
                            {section.title}
                          </h4>
                          <div className="space-y-3">
                            {section.items.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group block p-3 rounded-lg hover:bg-rainbow-subtle transition-all duration-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    {SubIcon && <SubIcon className="h-5 w-5 text-omni-orange" />}
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900 group-hover:text-omni-indigo">
                                          {subItem.name}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-omni-indigo opacity-0 group-hover:opacity-100 transition-all" />
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{subItem.description}</p>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-4 pb-4 space-y-4">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 ${
                        isActive(item.path) ? "bg-rainbow-subtle text-omni-indigo font-semibold" : "text-gray-700 hover:text-omni-indigo hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="font-medium text-lg">{item.name}</span>
                    </Link>
                  </div>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-base font-medium text-gray-600">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link
                      to="/wellness-exchange/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-4 rounded-lg text-gray-700 hover:text-omni-indigo hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-6 w-6" />
                      <span className="font-medium text-lg">My Account</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-6 w-6" />
                      <span className="font-medium text-lg">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-6 py-4 rounded-lg text-center font-medium text-lg bg-rainbow-gradient text-white"
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

export default MegaNavigation;