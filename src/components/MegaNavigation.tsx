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
  const {
    user,
    signOut
  } = useAuth();
  const mainNavItems = [{
    name: "Home",
    path: "/",
    icon: Home,
    hasDropdown: false
  }, {
    name: "About",
    path: "/about",
    icon: Info,
    hasDropdown: false
  }, {
    name: "Services",
    path: "/services",
    icon: Briefcase,
    hasDropdown: true,
    megaContent: {
      title: "Our Services",
      description: "Comprehensive wellness and media solutions",
      sections: [{
        title: "Business Development",
        items: [{
          name: "Strategic Consulting",
          path: "/services/business-consulting",
          description: "Growth & sustainability guidance"
        }, {
          name: "Brand Development",
          path: "/services/branding",
          description: "Build compelling brand identities"
        }, {
          name: "Financial Strategy",
          path: "/services/financial",
          description: "Sustainable financial planning"
        }]
      }, {
        title: "Media & Content",
        items: [{
          name: "Video Production",
          path: "/services/media-production",
          description: "Professional video content"
        }, {
          name: "Photography",
          path: "/services/photography",
          description: "Powerful visual storytelling"
        }, {
          name: "Content Creation",
          path: "/services/content",
          description: "Engaging multimedia content"
        }]
      }, {
        title: "Digital Services",
        items: [{
          name: "Web Development",
          path: "/services/web-development",
          description: "Custom websites & e-commerce"
        }, {
          name: "Social Media Strategy",
          path: "/services/social-media",
          description: "Build online communities"
        }, {
          name: "SEO & Marketing",
          path: "/services/marketing",
          description: "Drive organic growth"
        }]
      }]
    }
  }, {
    name: "Tours & Retreats",
    path: "/tours-retreats",
    icon: Activity,
    hasDropdown: true,
    megaContent: {
      title: "Transformative Journeys",
      description: "Conscious travel experiences for wellness and growth",
      sections: [{
        title: "Journey Categories",
        items: [{
          name: "Indigenous Wisdom & Healing",
          path: "/tours-retreats/indigenous-wisdom",
          description: "Connect with ancient healing traditions",
          icon: Heart
        }, {
          name: "Wellness & Mindfulness",
          path: "/tours-retreats/wellness-programs", 
          description: "Holistic wellness experiences",
          icon: Activity
        }, {
          name: "Educational Programs",
          path: "/tours-retreats/educational",
          description: "Study abroad and learning journeys",
          icon: BookOpen
        }, {
          name: "Winter Wellness",
          path: "/tours-retreats/winter-wellness",
          description: "Seasonal wellness experiences",
          icon: Activity
        }, {
          name: "Custom Retreats",
          path: "/tours-retreats/custom",
          description: "Tailored retreat experiences",
          icon: Heart
        }]
      }, {
        title: "Featured Experiences",
        items: [{
          name: "Browse All Tours",
          path: "/tours-retreats",
          description: "Explore all transformative journeys"
        }, {
          name: "Custom Planning",
          path: "/contact",
          description: "Design your perfect retreat"
        }]
      }]
    }
  }, {
    name: "Data Products",
    path: "/data-products",
    icon: Activity,
    hasDropdown: false
  }, {
    name: "RoamBuddy Store",
    path: "/roambuddy-store", 
    icon: Activity,
    hasDropdown: false
  }, {
    name: "Technical Overview",
    path: "/technical-overview", 
    icon: Activity,
    hasDropdown: false
  }, {
    name: "Platforms",
    path: "/platforms",
    icon: Activity,
    hasDropdown: true,
    megaContent: {
      title: "Wellness Platforms",
      description: "Discover our comprehensive wellness ecosystem",
      sections: [{
        title: "2BeWell Ecosystem",
        items: [{
          name: "2BeWell Platform",
          path: "/2bewell",
          description: "Wellness resources & community",
          icon: Heart
        }, {
          name: "2BeWell Shop",
          path: "/2bewell-shop",
          description: "Wellness products & services",
          icon: ShoppingBag
        }]
      }, {
        title: "Wellness Exchange",
        items: [{
          name: "Marketplace",
          path: "/wellness-exchange/marketplace#hero",
          description: "Browse wellness services"
        }, {
          name: "Post a Want",
          path: "/wellness-exchange/add-want#hero",
          description: "Request services from community"
        }, {
          name: "Community",
          path: "/wellness-exchange/community#hero",
          description: "Connect with practitioners"
        }, {
          name: "Provider Dashboard",
          path: "/wellness-exchange/provider-dashboard",
          description: "Manage your services"
        }]
      }]
    }
  }, {
    name: "Resources",
    path: "/resources",
    icon: BookOpen,
    hasDropdown: true,
    megaContent: {
      title: "Resources & Insights",
      description: "Educational content and community resources",
      sections: [{
        title: "Content & Media",
        items: [{
          name: "Blog",
          path: "/blog",
          description: "Insights on wellness & sustainability",
          icon: BookOpen
        }, {
          name: "Podcast",
          path: "/podcast",
          description: "Conversations that inspire",
          icon: Podcast
        }, {
          name: "Portfolio",
          path: "/portfolio",
          description: "Our featured work",
          icon: FolderOpen
        }]
      }, {
        title: "Community",
        items: [{
          name: "Partners",
          path: "/partners",
          description: "Our trusted network",
          icon: Users
        }, {
          name: "AI Tools",
          path: "/ai-tools",
          description: "Wellness technology solutions",
          icon: Bot
        }, {
          name: "Contact",
          path: "/contact",
          description: "Get in touch with us",
          icon: Mail
        }]
      }]
    }
  }];
  const isActive = (path: string) => location.pathname === path;
  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  return <header className="sticky top-0 z-40 bg-white border-b header-container">
      <div className="container-width">
          <div className="flex justify-between items-center h-12 sm:h-14 md:h-16 lg:h-18 min-w-0">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img alt="Omni Wellness Media" src="/lovable-uploads/a22bfb50-51c9-47fe-a2b2-9c961151f76f.png" className="h-1 w-auto sm:h-1 md:h-2 lg:h-3 xl:h-4 object-scale-down" />
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavItems.map(item => {
            const Icon = item.icon;
            return <div key={item.name} className="relative">
                  {item.hasDropdown ? <button onMouseEnter={() => handleMouseEnter(item.name)} onMouseLeave={handleMouseLeave} className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-rainbow-subtle group ${activeDropdown === item.name || item.megaContent?.sections.some(section => section.items.some(subItem => isActive(subItem.path))) ? "bg-rainbow-subtle text-omni-indigo" : "text-gray-700 hover:text-omni-indigo"}`}>
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button> : <Link to={item.path} className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-rainbow-subtle ${isActive(item.path) ? "bg-rainbow-subtle text-omni-indigo" : "text-gray-700 hover:text-omni-indigo"}`}>
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>}
                </div>;
          })}
            
            {/* Cart and Auth */}
            <div className="flex items-center space-x-4 ml-8">
              <CartIcon />
              
              {user ? <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="lg" className="transition-colors duration-200 hover:bg-rainbow-subtle">
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
                </DropdownMenu> : <Button asChild variant="wellness" size="lg">
                  <Link to="/auth">Get Started</Link>
                </Button>}
            </div>
          </div>

          {/* Mobile menu button and Cart */}
          <div className="lg:hidden flex items-center space-x-2">
            <CartIcon />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {activeDropdown && createPortal(<div className="fixed top-16 left-0 right-0 z-50 bg-white shadow-2xl border-t" style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 9999,
        maxHeight: '80vh',
        overflowY: 'auto'
      }} onMouseEnter={() => handleMouseEnter(activeDropdown)} onMouseLeave={handleMouseLeave}>
            <div className="container mx-auto px-4 py-8">
              {mainNavItems.map(item => {
            if (item.name === activeDropdown && item.megaContent) {
              return <div key={item.name}>
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.megaContent.title}</h3>
                        <p className="text-gray-600 text-lg">{item.megaContent.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {item.megaContent.sections.map(section => <div key={section.title} className="space-y-4">
                            <h4 className="font-semibold text-lg text-omni-indigo border-b border-gray-200 pb-2">
                              {section.title}
                            </h4>
                            <div className="space-y-3">
                              {section.items.map(subItem => {
                        const SubIcon = subItem.icon;
                        return <Link key={subItem.name} to={subItem.path} onClick={() => setActiveDropdown(null)} className="group block p-3 rounded-lg hover:bg-rainbow-subtle transition-colors duration-200">
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
                                  </Link>;
                      })}
                            </div>
                          </div>)}
                      </div>
                    </div>;
            }
            return null;
          })}
            </div>
          </div>, document.body)}

        {/* Mobile Navigation */}
        {isOpen && <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl">
              <div className="flex items-center justify-between h-12 px-4 border-b">
                <img className="h-2 w-auto" src="/lovable-uploads/9d9ecf28-f102-4674-949b-c09c14479f21.png" alt="Logo" />
                <button onClick={() => setIsOpen(false)} className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="p-4 space-y-4">
                {mainNavItems.map(item => {
              const Icon = item.icon;
              return <div key={item.name}>
                    <Link to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 ${isActive(item.path) ? "bg-rainbow-subtle text-omni-indigo font-semibold" : "text-gray-700 hover:text-omni-indigo hover:bg-gray-50"}`}>
                      <Icon className="h-6 w-6" />
                      <span className="font-medium text-lg">{item.name}</span>
                    </Link>
                  </div>;
            })}
              
              {/* Mobile Auth Section */}
              <div className="border-t pt-4 mt-4">
                {user ? <div className="space-y-2">
                    <div className="px-4 py-2 text-base font-medium text-gray-600">
                      {user.user_metadata?.full_name || user.email}
                    </div>
                    <Link to="/wellness-exchange/account" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-4 rounded-lg text-gray-700 hover:text-omni-indigo hover:bg-gray-50 transition-colors">
                      <User className="h-6 w-6" />
                      <span className="font-medium text-lg">My Account</span>
                    </Link>
                    <button onClick={() => {
                  signOut();
                  setIsOpen(false);
                }} className="flex items-center space-x-3 w-full px-4 py-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="h-6 w-6" />
                      <span className="font-medium text-lg">Sign Out</span>
                    </button>
                  </div> : <Link to="/auth" onClick={() => setIsOpen(false)} className="block w-full px-6 py-4 rounded-lg text-center font-medium text-lg bg-rainbow-gradient text-white">
                    Get Started
                  </Link>}
              </div>
              </nav>
            </div>
          </div>}
      </div>
    </header>;
};
export default MegaNavigation;