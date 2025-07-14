import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Menu, X, User, LogOut, ChevronDown, Home, Info, Briefcase, FolderOpen, BookOpen, Podcast, Heart, ShoppingBag, Users, Bot, Mail, Activity, ArrowRight } from "lucide-react";
import { CartIcon } from "@/components/cart/CartIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MegaNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const mainNavItems = [
    {
      name: "Services",
      path: "/services",
      icon: Briefcase,
      hasDropdown: true,
      megaContent: {
        title: "Our Services",
        description: "Comprehensive wellness and media solutions for conscious businesses",
        sections: [
          {
            title: "Business Development",
            items: [
              {
                name: "Strategic Consulting",
                path: "/services/business-consulting",
                description: "Growth & sustainability guidance",
                icon: Briefcase
              },
              {
                name: "Brand Development", 
                path: "/services/branding",
                description: "Build compelling brand identities",
                icon: Heart
              },
              {
                name: "Financial Strategy",
                path: "/services/financial", 
                description: "Sustainable financial planning",
                icon: Activity
              }
            ]
          },
          {
            title: "Media & Content",
            items: [
              {
                name: "Video Production",
                path: "/services/media-production",
                description: "Professional video content creation",
                icon: Activity
              },
              {
                name: "Photography",
                path: "/services/photography",
                description: "Powerful visual storytelling",
                icon: Activity
              },
              {
                name: "Content Creation",
                path: "/services/content",
                description: "Engaging multimedia content",
                icon: BookOpen
              }
            ]
          },
          {
            title: "Digital Services", 
            items: [
              {
                name: "Web Development",
                path: "/services/web-development",
                description: "Custom websites & e-commerce solutions",
                icon: Activity
              },
              {
                name: "Social Media Strategy",
                path: "/services/social-media",
                description: "Build engaging online communities",
                icon: Users
              },
              {
                name: "AI Tools",
                path: "/ai-tools",
                description: "Wellness technology solutions",
                icon: Bot
              }
            ]
          }
        ]
      }
    },
    {
      name: "Wellness Exchange",
      path: "/wellness-exchange",
      icon: Heart,
      hasDropdown: true,
      megaContent: {
        title: "Wellness Exchange Platform",
        description: "Connect with wellness practitioners and discover transformative services",
        sections: [
          {
            title: "Marketplace",
            items: [
              {
                name: "Browse Services",
                path: "/wellness-exchange/marketplace",
                description: "Discover wellness services near you",
                icon: Activity
              },
              {
                name: "Post a Want",
                path: "/wellness-exchange/add-want",
                description: "Request specific services from community",
                icon: Heart
              },
              {
                name: "Provider Directory",
                path: "/wellness-exchange/partners",
                description: "Find verified wellness practitioners",
                icon: Users
              }
            ]
          },
          {
            title: "Community",
            items: [
              {
                name: "Community Hub",
                path: "/wellness-exchange/community",
                description: "Connect with like-minded individuals",
                icon: Users
              },
              {
                name: "2BeWell Platform",
                path: "/2bewell",
                description: "Wellness resources & community",
                icon: Heart
              },
              {
                name: "2BeWell Shop",
                path: "/2bewell-shop",
                description: "Wellness products & services",
                icon: ShoppingBag
              }
            ]
          },
          {
            title: "For Providers",
            items: [
              {
                name: "Provider Dashboard",
                path: "/wellness-exchange/provider-dashboard",
                description: "Manage your wellness practice",
                icon: Activity
              },
              {
                name: "Add Service",
                path: "/wellness-exchange/add-service",
                description: "List your services in marketplace",
                icon: Heart
              },
              {
                name: "My Account",
                path: "/wellness-exchange/account",
                description: "Account settings and profile",
                icon: User
              }
            ]
          }
        ]
      }
    },
    {
      name: "Tours & Retreats",
      path: "/tours-retreats",
      icon: Activity,
      hasDropdown: true,
      megaContent: {
        title: "Transformative Journeys",
        description: "Conscious travel experiences for wellness, healing and personal growth",
        sections: [
          {
            title: "Featured Experiences",
            items: [
              {
                name: "Indigenous Wisdom & Healing",
                path: "/tours-retreats/category/indigenous-wisdom",
                description: "Connect with ancient healing traditions",
                icon: Heart
              },
              {
                name: "Wellness & Mindfulness",
                path: "/tours-retreats/category/wellness-programs",
                description: "Holistic wellness experiences",
                icon: Activity
              },
              {
                name: "Educational Programs", 
                path: "/tours-retreats/category/educational",
                description: "Study abroad and learning journeys",
                icon: BookOpen
              }
            ]
          },
          {
            title: "Seasonal Journeys",
            items: [
              {
                name: "Winter Wellness",
                path: "/tours-retreats/category/winter-wellness",
                description: "Seasonal wellness experiences",
                icon: Activity
              },
              {
                name: "Custom Retreats",
                path: "/tours-retreats/category/custom",
                description: "Tailored retreat experiences",
                icon: Heart
              },
              {
                name: "Browse All Tours",
                path: "/tours-retreats",
                description: "Explore all transformative journeys",
                icon: Activity
              }
            ]
          }
        ]
      }
    },
    {
      name: "Digital Products",
      path: "/data-products",
      icon: Bot,
      hasDropdown: true,
      megaContent: {
        title: "Digital Solutions",
        description: "eSIM data packages and innovative digital wellness products",
        sections: [
          {
            title: "Travel & Connectivity",
            items: [
              {
                name: "eSIM Data Plans",
                path: "/data-products",
                description: "Global eSIM data packages for travelers",
                icon: Activity
              },
              {
                name: "RoamBuddy Store",
                path: "/roambuddy-store",
                description: "Browse all eSIM plans and packages",
                icon: ShoppingBag
              },
              {
                name: "Device Compatibility",
                path: "/device-compatibility",
                description: "Check if your device supports eSIM",
                icon: Activity
              }
            ]
          },
          {
            title: "Technical Solutions",
            items: [
              {
                name: "Technical Overview",
                path: "/technical-overview",
                description: "Learn about our technology stack",
                icon: Activity
              },
              {
                name: "API Documentation",
                path: "/technical-overview#api",
                description: "Developer resources and API docs",
                icon: BookOpen
              },
              {
                name: "Integration Support",
                path: "/contact",
                description: "Get help with technical integration",
                icon: Mail
              }
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
        description: "Educational content, community resources and inspiring stories",
        sections: [
          {
            title: "Content & Media",
            items: [
              {
                name: "Blog",
                path: "/blog",
                description: "Insights on wellness & sustainability",
                icon: BookOpen
              },
              {
                name: "Podcast",
                path: "/podcast",
                description: "Conversations that inspire change",
                icon: Podcast
              },
              {
                name: "Portfolio",
                path: "/portfolio",
                description: "Our featured work and case studies",
                icon: FolderOpen
              }
            ]
          },
          {
            title: "Community & Support",
            items: [
              {
                name: "About Us",
                path: "/about",
                description: "Our story and mission",
                icon: Info
              },
              {
                name: "Partners Directory",
                path: "/partners",
                description: "Our trusted network of practitioners",
                icon: Users
              },
              {
                name: "Contact Us",
                path: "/contact",
                description: "Get in touch with our team",
                icon: Mail
              }
            ]
          }
        ]
      }
    }
  ];

  const isActive = (path: string) => location.pathname === path;
  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                alt="Omni Wellness Media" 
                src="/lovable-uploads/a22bfb50-51c9-47fe-a2b2-9c961151f76f.png" 
                className="h-10 w-auto object-contain" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <button 
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 group ${
                          activeDropdown === item.name || 
                          item.megaContent?.sections.some(section => 
                            section.items.some(subItem => isActive(subItem.path))
                          ) 
                            ? "bg-gray-100 text-blue-600" 
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>
                    ) : (
                      <Link 
                        to={item.path}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 ${
                          isActive(item.path) 
                            ? "bg-gray-100 text-blue-600" 
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
            
            {/* Right side - Cart and Auth */}
            <div className="flex items-center space-x-4">
              <CartIcon />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="transition-colors duration-200">
                      <User className="h-4 w-4 mr-2" />
                      <span className="max-w-32 truncate text-sm">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                      <ChevronDown className="h-3 w-3 ml-2" />
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
                <Button asChild variant="default" size="sm">
                  <Link to="/auth">Get Started</Link>
                </Button>
              )}
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
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Mega Menu Dropdown */}
      {activeDropdown && createPortal(
        <div 
          className="fixed inset-x-0 top-16 z-50 bg-white shadow-xl border-t-2 border-gray-100"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 9999,
            maxHeight: '80vh',
            overflowY: 'auto'
          }} 
          onMouseEnter={() => handleMouseEnter(activeDropdown)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {mainNavItems.map(item => {
              if (item.name === activeDropdown && item.megaContent) {
                return (
                  <div key={item.name} className="animate-fade-in">
                    {/* Header */}
                    <div className="mb-10 text-center">
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        {item.megaContent.title}
                      </h3>
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        {item.megaContent.description}
                      </p>
                    </div>
                    
                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                      {item.megaContent.sections.map(section => (
                        <div key={section.title} className="space-y-6">
                          <h4 className="font-bold text-lg text-gray-900 border-b-2 border-blue-100 pb-3">
                            {section.title}
                          </h4>
                          <div className="space-y-4">
                            {section.items.map(subItem => {
                              const SubIcon = subItem.icon;
                              return (
                                <Link 
                                  key={subItem.name} 
                                  to={subItem.path}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group block p-4 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-100"
                                >
                                  <div className="flex items-start space-x-4">
                                    {SubIcon && (
                                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <SubIcon className="h-5 w-5 text-blue-600" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                          {subItem.name}
                                        </h5>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                        {subItem.description}
                                      </p>
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
        </div>, 
        document.body
      )}

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <img 
                className="h-6 w-auto" 
                src="/lovable-uploads/a22bfb50-51c9-47fe-a2b2-9c961151f76f.png" 
                alt="Logo" 
              />
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-4">
              {mainNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.name}>
                    <Link 
                      to={item.path} 
                      onClick={() => setIsOpen(false)} 
                      className={`flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 ${
                        isActive(item.path) 
                          ? "bg-blue-50 text-blue-600 font-semibold" 
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
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
                      className="flex items-center space-x-3 px-4 py-4 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
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
                    className="block w-full px-6 py-4 rounded-lg text-center font-medium text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default MegaNavigation;