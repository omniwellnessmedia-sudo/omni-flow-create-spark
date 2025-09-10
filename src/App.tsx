import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/components/AuthProvider';
import { CartProvider } from '@/contexts/CartContext';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Index from '@/pages/Index';
// Lazy load heavy components for better performance
const Home = lazy(() => import('@/pages/Home'));
const WellnessDeals = lazy(() => import('@/pages/WellnessDeals'));
const DealDetail = lazy(() => import('@/pages/DealDetail'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const BusinessConsulting = lazy(() => import('@/pages/BusinessConsulting'));
const MediaProduction = lazy(() => import('@/pages/MediaProduction'));
const SocialMediaStrategy = lazy(() => import('@/pages/SocialMediaStrategy'));
const WebDevelopment = lazy(() => import('@/pages/WebDevelopment'));
const Contact = lazy(() => import('@/pages/Contact'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const BlogEditor = lazy(() => import('@/pages/BlogEditor'));
const Podcast = lazy(() => import('@/pages/Podcast'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const Auth = lazy(() => import('@/pages/Auth'));
import WellnessExchange from '@/pages/WellnessExchange';
import WellnessExchangeSignup from '@/pages/WellnessExchangeSignup';
import WellnessCommunity from '@/pages/WellnessCommunity';
import WellnessMarketplace from '@/pages/WellnessMarketplace';
import WellnessAccount from '@/pages/WellnessAccount';
import WellnessUsers from '@/pages/WellnessUsers';
import WellnessWants from '@/pages/WellnessWants';
import SearchServices from '@/pages/SearchServices';
import ServiceDetail from '@/pages/ServiceDetail';
import AddService from '@/pages/AddService';
import AddWant from '@/pages/AddWant';
import CommunityBlog from '@/pages/CommunityBlog';

import ProviderDashboard from '@/pages/ProviderDashboard';
import ProviderWebsite from '@/pages/ProviderWebsite';
import ProviderLandingPage from '@/pages/ProviderLandingPage';
import PartnerProfile from '@/pages/PartnerProfile';
import PartnerPortal from '@/pages/PartnerPortal';
import PartnersDirectory from '@/pages/PartnersDirectory';
import ToursRetreats from '@/pages/ToursRetreats';
import TourDetail from '@/pages/TourDetail';
import TourCategory from '@/pages/TourCategory';
import TwoBeWell from '@/pages/TwoBeWell';
import TwoBeWellShop from '@/pages/TwoBeWellShop';
// Deprecated: RoamBuddy has been rebranded to Travel Well Connected
// import RoamBuddyStore from '@/pages/RoamBuddyStore';
import WellnessRoamingPackages from '@/pages/WellnessRoamingPackages';
import AITools from '@/pages/AITools';
import RoamBuddyAPITest from '@/pages/RoamBuddyAPITest';
import RoamBuddyIntegrationTest from '@/pages/RoamBuddyIntegrationTest';
import DataProducts from '@/pages/DataProducts';
import DeviceCompatibility from '@/pages/DeviceCompatibility';
import TechnicalOverview from '@/pages/TechnicalOverview';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCancelled from '@/pages/PaymentCancelled';
import TransactionPage from '@/pages/TransactionPage';
import Resources from '@/pages/Resources';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import TravelWellConnectedStore from '@/pages/TravelWellConnectedStore';
import ExerciseLibrary from '@/pages/ExerciseLibrary';

// Service Pages
import Consultation from '@/pages/services/Consultation';
import CustomArt from '@/pages/services/CustomArt';
import DocumentaryProduction from '@/pages/services/DocumentaryProduction';
import Videography from '@/pages/services/Videography';
import MobileEnhancements from '@/components/mobile/MobileEnhancements';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <UnifiedNavigation />
            <main className="flex-grow">
              <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/wellness-deals" element={<WellnessDeals />} />
            <Route path="/wellness-deals/:id" element={<DealDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/business-consulting" element={<BusinessConsulting />} />
            <Route path="/media-production" element={<MediaProduction />} />
            <Route path="/social-media-strategy" element={<SocialMediaStrategy />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog-editor" element={<BlogEditor />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/auth" element={<Auth />} />
            {/* Wellness Exchange Routes */}
            <Route path="/wellness-exchange" element={<WellnessExchange />} />
            <Route path="/wellness-exchange-signup" element={<WellnessExchangeSignup />} />
            <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
            <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
            <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
            <Route path="/wellness-exchange/search" element={<SearchServices />} />
            <Route path="/wellness-exchange/add-service" element={<AddService />} />
            <Route path="/wellness-exchange/add-want" element={<AddWant />} />
            <Route path="/wellness-exchange/account" element={<WellnessAccount />} />
            <Route path="/wellness-exchange/provider-signup" element={<WellnessExchangeSignup />} />
            <Route path="/wellness-exchange/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/wellness-exchange/service/:id" element={<ServiceDetail />} />
            
            {/* Legacy Routes (backward compatibility) */}
            <Route path="/wellness-community" element={<WellnessCommunity />} />
            <Route path="/wellness-marketplace" element={<WellnessMarketplace />} />
            <Route path="/wellness-account" element={<WellnessAccount />} />
            <Route path="/wellness-users" element={<WellnessUsers />} />
            <Route path="/wellness-wants" element={<WellnessWants />} />
            <Route path="/search-services" element={<SearchServices />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="/add-want" element={<AddWant />} />
            <Route path="/community-blog" element={<CommunityBlog />} />
            
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/provider-portal" element={<PartnerPortal />} />
            <Route path="/provider-website/:providerId" element={<ProviderWebsite />} />
            <Route path="/provider-landing/:providerId" element={<ProviderLandingPage />} />
            <Route path="/partner-profile/:id" element={<PartnerProfile />} />
            <Route path="/partners-directory" element={<PartnersDirectory />} />
            
            {/* Service Detail Pages */}
            <Route path="/services/consultation" element={<Consultation />} />
            <Route path="/services/custom-art" element={<CustomArt />} />
            <Route path="/services/documentary-production" element={<DocumentaryProduction />} />
            <Route path="/services/videography" element={<Videography />} />
            <Route path="/tours-retreats" element={<ToursRetreats />} />
            <Route path="/tour-category/:category" element={<TourCategory />} />
            <Route path="/tour-category/:category/:slug" element={<TourDetail />} />
            <Route path="/two-be-well" element={<TwoBeWell />} />
            <Route path="/two-be-well-shop" element={<TwoBeWellShop />} />
            <Route path="/travel-well-connected-store" element={<TravelWellConnectedStore />} />
            <Route path="/wellness-roaming-packages" element={<WellnessRoamingPackages />} />
            <Route path="/exercise-library" element={<ExerciseLibrary />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/roambuddy-api-test" element={<RoamBuddyAPITest />} />
            <Route path="/roambuddy-integration-test" element={<RoamBuddyIntegrationTest />} />
            <Route path="/data-products" element={<DataProducts />} />
            <Route path="/device-compatibility" element={<DeviceCompatibility />} />
            <Route path="/technical-overview" element={<TechnicalOverview />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <MobileEnhancements />
          </div>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
