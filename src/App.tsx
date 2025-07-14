
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import CommunityBlog from "./pages/CommunityBlog";
import BlogEditor from "./pages/BlogEditor";
import BlogPost from "./pages/BlogPost";
import Podcast from "./pages/Podcast";
import Contact from "./pages/Contact";
import AITools from "./pages/AITools";
import BusinessConsulting from "./pages/BusinessConsulting";
import MediaProduction from "./pages/MediaProduction";
import SocialMediaStrategy from "./pages/SocialMediaStrategy";
import WebDevelopment from "./pages/WebDevelopment";
import Videography from "./pages/services/Videography";
import DocumentaryProduction from "./pages/services/DocumentaryProduction";
import CustomArt from "./pages/services/CustomArt";
import Consultation from "./pages/services/Consultation";
import TwoBeWell from "./pages/TwoBeWell";
import TwoBeWellShop from "./pages/TwoBeWellShop";
import PartnerPortal from "./pages/PartnerPortal";
import WellnessExchange from "./pages/WellnessExchange";
import WellnessMarketplace from "./pages/WellnessMarketplace";
import WellnessWants from "./pages/WellnessWants";
import WellnessCommunity from "./pages/WellnessCommunity";
import WellnessAccount from "./pages/WellnessAccount";
import WellnessUsers from "./pages/WellnessUsers";
import AddService from "./pages/AddService";
import SearchServices from "./pages/SearchServices";
import AddWant from "./pages/AddWant";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderWebsite from "./pages/ProviderWebsite";
import Auth from "./pages/Auth";
import TransactionPage from "./pages/TransactionPage";
import WellnessExchangeSignup from "./pages/WellnessExchangeSignup";
import PartnersDirectory from "./pages/PartnersDirectory";
import PartnerProfile from "./pages/PartnerProfile";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import ServiceDetail from "./pages/ServiceDetail";
import ToursRetreats from "./pages/ToursRetreats";
import TourDetail from "./pages/TourDetail";
import TourCategory from "./pages/TourCategory";
import WellnessRoamingPackages from "./pages/WellnessRoamingPackages";
import DataProducts from "./pages/DataProducts";
import RoamBuddyStore from "./pages/RoamBuddyStore";
import TechnicalOverview from "./pages/TechnicalOverview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
          <Route path="/services/business-consulting" element={<BusinessConsulting />} />
          <Route path="/services/media-production" element={<MediaProduction />} />
          <Route path="/services/social-media-strategy" element={<SocialMediaStrategy />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/services/videography" element={<Videography />} />
          <Route path="/services/documentary-production" element={<DocumentaryProduction />} />
          <Route path="/services/custom-art" element={<CustomArt />} />
          <Route path="/services/consultation" element={<Consultation />} />
          {/* Additional service route mappings */}
          <Route path="/services/social-media" element={<SocialMediaStrategy />} />
          <Route path="/services/marketing" element={<BusinessConsulting />} />
          <Route path="/services/content" element={<MediaProduction />} />
          <Route path="/services/photography" element={<Videography />} />
          <Route path="/services/financial" element={<BusinessConsulting />} />
          <Route path="/services/branding" element={<BusinessConsulting />} />
          {/* Dynamic service route for marketplace services - must come LAST */}
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/community" element={<CommunityBlog />} />
            <Route path="/blog/editor/:postId" element={<BlogEditor />} />
            <Route path="/blog/post/:slug" element={<BlogPost />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/2bewell" element={<TwoBeWell />} />
            <Route path="/2bewell-shop" element={<TwoBeWellShop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/wellness-exchange" element={<WellnessExchange />} />
            <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
            <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
            <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
            <Route path="/wellness-exchange/account" element={<WellnessAccount />} />
            <Route path="/wellness-exchange/users" element={<WellnessUsers />} />
            <Route path="/wellness-exchange/search" element={<SearchServices />} />
            <Route path="/wellness-exchange/add-service" element={<AddService />} />
            <Route path="/wellness-exchange/add-want" element={<AddWant />} />
            <Route path="/wellness-exchange/transactions" element={<TransactionPage />} />
            <Route path="/wellness-exchange/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/wellness-exchange/provider-signup" element={<WellnessExchangeSignup />} />
            <Route path="/wellness-exchange/consumer-signup" element={<WellnessExchangeSignup />} />
            <Route path="/wellness-exchange/service/:serviceId" element={<ServiceDetail />} />
            <Route path="/provider-website/:websiteId" element={<ProviderWebsite />} />
            <Route path="/partners" element={<PartnersDirectory />} />
            <Route path="/partners/:id" element={<PartnerProfile />} />
            <Route path="/platforms" element={<PartnersDirectory />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/tours-retreats" element={<ToursRetreats />} />
            <Route path="/tours-retreats/:category" element={<TourCategory />} />
            <Route path="/tours-retreats/:category/:slug" element={<TourDetail />} />
            <Route path="/wellness-roaming-packages" element={<WellnessRoamingPackages />} />
            <Route path="/data-products" element={<DataProducts />} />
            <Route path="/roambuddy-store" element={<RoamBuddyStore />} />
            <Route path="/technical-overview" element={<TechnicalOverview />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
