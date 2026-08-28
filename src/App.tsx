import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/components/AuthProvider';
import { CartProvider } from '@/components/CartProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load components for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const WellnessExchange = React.lazy(() => import('@/pages/WellnessExchange'));
const WellnessMarketplace = React.lazy(() => import('@/pages/WellnessMarketplace'));
const UnifiedMarketplace = React.lazy(() => import('@/pages/UnifiedMarketplace'));
const WellnessAccount = React.lazy(() => import('@/pages/WellnessAccount'));
const WellnessWants = React.lazy(() => import('@/pages/WellnessWants'));
const WellnessCommunity = React.lazy(() => import('@/pages/WellnessCommunity'));
// Consolidated to use ServiceDetail.tsx for all service detail routes
const IndividualProviderProfile = React.lazy(() => import('@/pages/IndividualProviderProfile'));
const SandyMitchellProfile = React.lazy(() => import('@/pages/SandyMitchellProfile'));
const AddService = React.lazy(() => import('@/pages/AddService'));
const EditService = React.lazy(() => import('@/pages/EditService'));
const CommunityBlog = React.lazy(() => import('@/pages/CommunityBlog'));
const CommunityEvents = React.lazy(() => import('@/pages/CommunityEvents'));
const StunningPigs = React.lazy(() => import('@/pages/events/StunningPigs'));
// UNLISTED, NOINDEX: BWC Meet the Team controlled staging page. Holds real
// people's photographs and biographies that are NOT cleared for publication —
// see the header comment in src/pages/team/bwcTeamData.ts. Deliberately absent
// from nav and sitemap; reachable only by direct link, for Chad's review.
const BwcTeamStaging = React.lazy(() => import('@/pages/team/BwcTeamStaging'));

// Decorative / non-critical global overlays — lazy so they leave the initial
// bundle instead of loading on every page before first paint. They render at
// the end of the tree inside Suspense(fallback=null), so they simply appear a
// beat after hydration rather than blocking the page. The ROAM chatbot in
// particular is heavy and is never needed on first render.
const MagicCursor = React.lazy(() => import('@/components/MagicCursor'));
const FloatingActionDock = React.lazy(() => import('@/components/FloatingActionDock'));
const RoamBuddySalesBot = React.lazy(() =>
  import('@/components/roambuddy/RoamBuddySalesBot').then((m) => ({ default: m.RoamBuddySalesBot }))
);
const AccessibilitySettings = React.lazy(() => import('@/components/accessibility/AccessibilitySettings'));

// Provider-signup redirect that KEEPS incoming query params (gclid, utm_*) —
// a fixed-string <Navigate> discarded them, breaking Google Ads attribution
// for the provider_signup_start conversion.
/**
 * Global overlays, suppressed on routes that must not show Omni branding.
 *
 * The floating dock renders the Omni badge. Chad's 2 Aug instruction for the
 * BWC staging page is explicit: "do not display the Omni Wellness Media or
 * Dr Phil Afel Foundation logos until organisation level logo permission has
 * been confirmed." A global widget is still a display, so the whole overlay
 * set is withheld there rather than trying to restyle one button.
 */
import { isPaidTraffic } from '@/pages/events/wwpl/attribution';

const NO_OVERLAY_ROUTES = ['/bwc-team-staging'];

// A plain <Navigate to="/screenings"> would drop ?gclid/utm params — the exact
// attribution this codebase works to preserve. Carry search + hash through.
const ScreeningsRedirect = () => {
  const { search, hash } = useLocation();
  return <Navigate to={`/screenings${search}${hash}`} replace />;
};

const GlobalOverlays = () => {
  const { pathname } = useLocation();
  if (NO_OVERLAY_ROUTES.includes(pathname)) return null;
  // Paid ad clicks landing on an event page paid for that visit — nothing may
  // compete with the ticket CTA. The quick-actions dock and the eSIM chat
  // trigger sit in the same mobile thumb zone as the primary CTA, so both are
  // withheld for the session (attribution persists in sessionStorage).
  const suppressForPaid = pathname.startsWith('/events/') && isPaidTraffic();
  return (
    <Suspense fallback={null}>
      <MagicCursor />
      {!suppressForPaid && <FloatingActionDock />}
      {!suppressForPaid && <RoamBuddySalesBot />}
      <AccessibilitySettings />
    </Suspense>
  );
};

const ProviderSignupRedirect = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  params.set('tab', 'signup');
  params.set('role', 'provider');
  return <Navigate to={`/auth?${params.toString()}`} replace />;
};
const ProviderDashboard = React.lazy(() => import('@/pages/ProviderDashboard'));
const ModernProviderPortal = React.lazy(() => import('@/pages/ModernProviderPortal'));
const TransactionPage = React.lazy(() => import('@/pages/TransactionPage'));
// 2BeWell routes redirect to services (brand retired)

const WellnessDeals = React.lazy(() => import('@/pages/WellnessDeals'));
const AuthPage = React.lazy(() => import('@/pages/Auth'));
const TestPage = React.lazy(() => import('@/pages/TestPage'));
const TestSimple = React.lazy(() => import('@/pages/TestSimple'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Services = React.lazy(() => import('@/pages/Services'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('@/pages/CookiePolicy'));
const ESGPolicy = React.lazy(() => import('@/pages/ESGPolicy'));
const ServiceDetail = React.lazy(() => import('@/pages/ServiceDetail'));
const SearchServices = React.lazy(() => import('@/pages/SearchServices'));
const AddWant = React.lazy(() => import('@/pages/AddWant'));
// TwoBeWell retired — redirects in routes below
const TravelWellConnectedStore = React.lazy(() => import('@/pages/TravelWellConnectedStore'));
const WellnessRoamingPackages = React.lazy(() => import('@/pages/WellnessRoamingPackages'));
const DataProducts = React.lazy(() => import('@/pages/DataProducts'));
const ProductDetail = React.lazy(() => import('@/pages/ProductDetail'));
const DealDetail = React.lazy(() => import('@/pages/DealDetail'));
const Checkout = React.lazy(() => import('@/pages/Checkout'));
const OrderConfirmation = React.lazy(() => import('@/pages/OrderConfirmation'));
const GuestOrderLookup = React.lazy(() => import('@/pages/GuestOrderLookup'));
const PaymentSuccess = React.lazy(() => import('@/pages/PaymentSuccess'));
const PaymentCancelled = React.lazy(() => import('@/pages/PaymentCancelled'));
// Blog is unpublished for launch: public viewing routes redirect home below.
// The editor stays reachable so content can be prepared before re-launch.
const BlogEditor = React.lazy(() => import('@/pages/BlogEditor'));
const Podcast = React.lazy(() => import('@/pages/Podcast'));
const Portfolio = React.lazy(() => import('@/pages/Portfolio'));
const Resources = React.lazy(() => import('@/pages/Resources'));
const WellnessExchangeSignup = React.lazy(() => import('@/pages/WellnessExchangeSignup'));
const BusinessConsulting = React.lazy(() => import('@/pages/BusinessConsulting'));
const MediaProduction = React.lazy(() => import('@/pages/MediaProduction'));
const Screenings = React.lazy(() => import('@/pages/Screenings'));
const WebDevelopment = React.lazy(() => import('@/pages/WebDevelopment'));
const SocialMediaStrategy = React.lazy(() => import('@/pages/SocialMediaStrategy'));
const ConsciousMediaPartnershipPage = React.lazy(() => import('@/pages/ConsciousMediaPartnershipPage'));
const ConsciousMediaInfrastructurePage = React.lazy(() => import('@/pages/ConsciousMediaInfrastructurePage'));
// const AITools = React.lazy(() => import('@/pages/AITools')); // Temporarily hidden
const TourCategory = React.lazy(() => import('@/pages/TourCategory'));
const TourDetail = React.lazy(() => import('@/pages/TourDetail'));
const ToursRetreats = React.lazy(() => import('@/pages/ToursRetreats'));
const Tours = React.lazy(() => import('@/pages/Tours'));
const MuizenbergCaveTours = React.lazy(() => import('@/pages/tours/MuizenbergCaveTours'));
const OmniWellnessRetreat = React.lazy(() => import('@/pages/tours/OmniWellnessRetreat'));
const GreatMotherCaveTour = React.lazy(() => import('@/pages/tours/GreatMotherCaveTour'));
const KalkBayTour = React.lazy(() => import('@/pages/tours/KalkBayTour'));
const CartHorseUrbanWellness = React.lazy(() => import('@/pages/experiences/CartHorseUrbanWellness'));
const CorporateWellnessRetreat = React.lazy(() => import('@/pages/experiences/CorporateWellnessRetreat'));
const ViatorWellnessExperiences = React.lazy(() => import('@/pages/ViatorWellnessExperiences'));
const ESIMStore = React.lazy(() => import('@/pages/ESIMStore'));
// TravelWellConnectedESIM retired — redirects to ROAM store
const UWCHumanAnimalProgram = React.lazy(() => import('@/pages/programs/UWCHumanAnimalProgram'));
const UWCUniversityPartners = React.lazy(() => import('@/pages/programs/UWCUniversityPartners'));
const UWCSponsors = React.lazy(() => import('@/pages/programs/UWCSponsors'));
const UWCRecruitment = React.lazy(() => import('@/pages/programs/UWCRecruitment'));
const CSRImpact = React.lazy(() => import('@/pages/CSRImpact'));
const PartnersDirectory = React.lazy(() => import('@/pages/PartnersDirectory'));
const PartnerProfile = React.lazy(() => import('@/pages/PartnerProfile'));
const PartnerPortal = React.lazy(() => import('@/pages/PartnerPortal'));
const ExerciseLibrary = React.lazy(() => import('@/pages/ExerciseLibrary'));
const DeviceCompatibility = React.lazy(() => import('@/pages/DeviceCompatibility'));
const RoamBuddyOverview = React.lazy(() => import('@/pages/partner/RoamBuddyOverview'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const AccountantDashboard = React.lazy(() => import('@/pages/AccountantDashboard'));
const ProductManagement = React.lazy(() => import('@/pages/admin/ProductManagement'));
const LocalCatalogue = React.lazy(() => import('@/pages/admin/LocalCatalogue'));
// The curation screen decides what shoppers see (src/config/catalogueGate.ts).
// It existed but was never routed, so the control was unreachable.
const ProductCuration = React.lazy(() => import('@/pages/admin/ProductCuration'));
const TechnicalOverview = React.lazy(() => import('@/pages/TechnicalOverview'));
const RoamBuddyAPITest = React.lazy(() => import('@/pages/RoamBuddyAPITest'));
const RoamBuddyIntegrationTest = React.lazy(() => import('@/pages/RoamBuddyIntegrationTest'));
const RoamBuddyStore = React.lazy(() => import('@/pages/RoamBuddyStore'));
const RoamBuddyTerms = React.lazy(() => import('@/pages/roambuddy/RoamBuddyTerms'));
const RoamBuddyPrivacy = React.lazy(() => import('@/pages/roambuddy/RoamBuddyPrivacy'));
const AffiliateMarketplace = React.lazy(() => import('@/pages/AffiliateMarketplace'));
const AffiliatePerformance = React.lazy(() => import('@/pages/admin/AffiliatePerformance'));
const AffiliatePayouts = React.lazy(() => import('@/pages/admin/AffiliatePayouts'));
const CJAffiliateProducts = React.lazy(() => import('@/pages/CJAffiliateProducts'));
const AwinAffiliateProducts = React.lazy(() => import('@/pages/AwinAffiliateProducts'));
const CJProductDetail = React.lazy(() => import('@/pages/CJProductDetail'));
const StoreCollections = React.lazy(() => import('@/pages/StoreCollections'));
const AdminTools = React.lazy(() => import('@/pages/admin/AdminTools'));
const MonetizableURLsReference = React.lazy(() => import('@/pages/admin/MonetizableURLsReference'));
const RoamBuddySalesDashboard = React.lazy(() => import('@/pages/admin/RoamBuddySalesDashboard'));
const RoamMarketingHub = React.lazy(() => import('@/pages/admin/RoamMarketingHub'));
const Wishlist = React.lazy(() => import('@/pages/Wishlist'));
const StoreProductDetail = React.lazy(() => import('@/pages/StoreProductDetail'));
const UpdatePassword = React.lazy(() => import('@/pages/UpdatePassword'));
const UpgradePage = React.lazy(() => import('@/pages/UpgradePage'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading Omni Wellness...</h2>
      <p className="text-gray-500">Preparing your wellness experience</p>
    </div>
  </div>
);

// Import ScrollToHash component
import ScrollToHash from '@/components/navigation/ScrollToHash';
// MagicCursor, FloatingActionDock, RoamBuddySalesBot and AccessibilitySettings
// are lazy-loaded (declared with the route chunks near the top of this file).

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToHash />
            <div className="min-h-screen">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Main Platform Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/test-simple" element={<TestSimple />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/esg-policy" element={<ESGPolicy />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/update-password" element={<UpdatePassword />} />
                  <Route path="/upgrade" element={<UpgradePage />} />

                  {/* Wellness Exchange Routes */}
                  <Route path="/wellness-exchange" element={<WellnessExchange />} />
                  <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
                  <Route path="/wellness-exchange/service/:id" element={<ServiceDetail />} />
                  <Route path="/wellness-exchange/account" element={<WellnessAccount />} />
                  <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
                  <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
                  <Route path="/wellness-exchange/search" element={<SearchServices />} />
                  <Route path="/wellness-exchange/add-service" element={<AddService />} />
                  <Route path="/wellness-exchange/edit-service/:serviceId" element={<EditService />} />
                  <Route path="/wellness-exchange/add-want" element={<AddWant />} />
                  <Route path="/wellness-exchange/provider-dashboard" element={<ProviderDashboard />} />
                  <Route path="/wellness-exchange-signup" element={<WellnessExchangeSignup />} />
                  <Route path="/wellness-community" element={<Navigate to="/community" replace />} />

                  {/* Marketplace & Services */}
                  <Route path="/marketplace" element={<UnifiedMarketplace />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/service/:id" element={<ServiceDetail />} />
                  <Route path="/service-detail/:id" element={<ServiceDetail />} />
                  <Route path="/service-detail/:serviceId" element={<ServiceDetail />} />
                  <Route path="/search-services" element={<SearchServices />} />
                  <Route path="/add-want" element={<AddWant />} />

                  {/* E-commerce & Products */}
                  {/* 2BeWell brand retired — redirect all routes to services */}
                  <Route path="/two-be-well" element={<Navigate to="/services" replace />} />
                  <Route path="/twobewellshop" element={<Navigate to="/services" replace />} />
                  <Route path="/two-be-well-shop" element={<Navigate to="/services" replace />} />
                  <Route path="/2bewell" element={<Navigate to="/services" replace />} />
                  <Route path="/2bewell-shop" element={<Navigate to="/services" replace />} />
                  <Route path="/2bewell/shop" element={<Navigate to="/services" replace />} />
                  <Route path="/2bewell/product/:productId" element={<Navigate to="/services" replace />} />

                  {/* Legacy / convenience redirects — these paths are linked from various
                      surfaces but never had a route. Route audit (June 2026) added them so
                      no nav hits the SPA fallback or NotFound. */}
                  <Route path="/partners" element={<Navigate to="/partners-directory" replace />} />
                  <Route path="/impact" element={<Navigate to="/csr-impact" replace />} />
                  <Route path="/wellness-account" element={<Navigate to="/wellness-exchange/account" replace />} />
                  <Route path="/community/events" element={<CommunityEvents />} />
                  {/* Analytics shows real traffic on this URL, but no route ever
                      existed for it — so it fell through to NotFound and was served
                      at HTTP 200, i.e. an indexable soft-404 duplicate of the event
                      page. netlify.toml also 301s it server-side for crawlers. */}
                  <Route path="/community/events/stunning-pigs" element={<Navigate to="/events/stunning-pigs" replace />} />
                  {/* NO LONGER UNLISTED: the Quicket listing has been live since
                      13 Jul and this page is the destination of a paid campaign, so
                      it now appears in sitemap.xml. It remains out of the primary
                      nav by choice — do not add it to nav without approval. */}
                  <Route path="/events/stunning-pigs" element={<StunningPigs />} />
                  <Route path="/bwc-team-staging" element={<BwcTeamStaging />} />
                  <Route path="/ai-tools" element={<Navigate to="/services" replace />} />
                  <Route path="/wellness-exchange/provider-signup" element={<ProviderSignupRedirect />} />
                  <Route path="/provider-signup" element={<ProviderSignupRedirect />} />

                  <Route path="/cj-affiliate-products" element={<CJAffiliateProducts />} />
                  <Route path="/awin-affiliate-products" element={<AwinAffiliateProducts />} />
                  <Route path="/cj-products/:id" element={<CJProductDetail />} />
                  <Route path="/store" element={<StoreCollections />} />
                  <Route path="/store/collections/:handle" element={<StoreCollections />} />
                  <Route path="/store/product/:id" element={<StoreProductDetail />} />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/wellness-deals" element={<WellnessDeals />} />
                  <Route path="/travel-well-connected-store" element={<Navigate to="/roambuddy-store" replace />} />
                  <Route path="/wellness-roaming-packages" element={<WellnessRoamingPackages />} />
                  <Route path="/data-products" element={<DataProducts />} />
                  <Route path="/product-detail/:id" element={<ProductDetail />} />
                  <Route path="/deal/:id" element={<DealDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/guest-order-lookup" element={<GuestOrderLookup />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelled />} />

                  {/* Provider Routes */}
                  <Route path="/provider-directory" element={<IndividualProviderProfile />} />
                  <Route path="/provider/sandy-mitchell" element={<SandyMitchellProfile />} />
                  <Route path="/provider/:id" element={<IndividualProviderProfile />} />
                  
                  {/* Provider Dashboard & Management */}
                  <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                  <Route path="/provider-portal" element={<ModernProviderPortal />} />
                  <Route path="/add-service" element={<AddService />} />
                  <Route path="/edit-service/:serviceId" element={<EditService />} />
                  
                  {/* Community & Content */}
                  <Route path="/community" element={<CommunityBlog />} />
                  <Route path="/community-blog" element={<CommunityBlog />} />
                  {/* Blog unpublished: public viewing routes redirect home; editor kept for content prep */}
                  <Route path="/blog" element={<Navigate to="/" replace />} />
                  <Route path="/blog-editor" element={<BlogEditor />} />
                  <Route path="/blog/editor/new" element={<BlogEditor />} />
                  <Route path="/blog/editor/:postId" element={<BlogEditor />} />
                  <Route path="/blog/post/:slug" element={<Navigate to="/" replace />} />
                  <Route path="/blog/community" element={<Navigate to="/community" replace />} />
                  <Route path="/blog-post/:slug" element={<Navigate to="/" replace />} />
                  <Route path="/podcast" element={<Podcast />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/resources" element={<Resources />} />

                  {/* Travel & Tours */}
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours-retreats" element={<ToursRetreats />} />
            <Route path="/tour-category/:category" element={<TourCategory />} />
            <Route path="/tour-detail/winter-wine-country-wellness" element={<OmniWellnessRetreat />} />
            <Route path="/tour-detail/great-mother-cave-tour" element={<GreatMotherCaveTour />} />
            <Route path="/tour-detail/:id" element={<TourDetail />} />
            <Route path="/tours/muizenberg-cave-tours" element={<MuizenbergCaveTours />} />
            <Route path="/tours/great-mother-cave-tour" element={<GreatMotherCaveTour />} />
            <Route path="/tours/kalk-bay-tour" element={<KalkBayTour />} />
            <Route path="/experiences/cart-horse-urban-wellness" element={<CartHorseUrbanWellness />} />
            <Route path="/experiences/corporate-wellness-retreat" element={<CorporateWellnessRetreat />} />
            <Route path="/experience/:id" element={<TourDetail />} />
            <Route path="/programs/uwc-human-animal" element={<UWCHumanAnimalProgram />} />
            <Route path="/programs/uwc-human-animal/university-partners" element={<UWCUniversityPartners />} />
            <Route path="/programs/uwc-human-animal/sponsors" element={<UWCSponsors />} />
            <Route path="/programs/uwc-human-animal/recruitment" element={<UWCRecruitment />} />
            <Route path="/csr-impact" element={<CSRImpact />} />
            <Route path="/drphilafel" element={<Navigate to="/csr-impact" replace />} />
            <Route path="/viator-wellness-experiences" element={<ViatorWellnessExperiences />} />
            <Route path="/esim-store" element={<ESIMStore />} />
            {/* Travel Well Connected retired — redirect to ROAM store */}
            <Route path="/travel-well-connected" element={<Navigate to="/roambuddy-store" replace />} />
            <Route path="/travel-well-connected-esim" element={<Navigate to="/roambuddy-store" replace />} />


                  {/* Business Services */}
                  <Route path="/business-consulting" element={<BusinessConsulting />} />
                  <Route path="/media-production" element={<MediaProduction />} />
                  <Route path="/screenings" element={<Screenings />} />
                  <Route path="/impact-screenings" element={<ScreeningsRedirect />} />
                  <Route path="/web-development" element={<WebDevelopment />} />
                  <Route path="/social-media-strategy" element={<SocialMediaStrategy />} />
                  <Route path="/conscious-media-partnership" element={<ConsciousMediaPartnershipPage />} />
                  <Route path="/conscious-media-infrastructure" element={<ConsciousMediaInfrastructurePage />} />


                  {/* Affiliate Marketplace */}
                  <Route path="/affiliate-marketplace" element={<AffiliateMarketplace />} />

                  {/* Partners */}
                  <Route path="/partners-directory" element={<PartnersDirectory />} />
                  <Route path="/partner-profile/:id" element={<PartnerProfile />} />
                  <Route path="/partner-portal" element={<PartnerPortal />} />
                  <Route path="/partner/roambuddy-overview" element={<RoamBuddyOverview />} />

                  {/* Health & Fitness */}
                  <Route path="/exercise-library" element={<ExerciseLibrary />} />
                  <Route path="/device-compatibility" element={<DeviceCompatibility />} />

                  {/* Transaction & Payment */}
                  <Route path="/transaction" element={<TransactionPage />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/accountant" element={
                    <ProtectedRoute requireAccountant={true}>
                      <AccountantDashboard />
                    </ProtectedRoute>
                  } />
                  {/* Catalogue managers onboard local businesses and products.
                      Narrower than admin on purpose: this route does not reach
                      accounting, leads, team management or role assignment. */}
                  <Route path="/admin/catalogue" element={
                    <ProtectedRoute requireCatalogueManager={true}>
                      <LocalCatalogue />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute requireCatalogueManager={true}>
                      <ProductCuration />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/technical-overview" element={
                    <ProtectedRoute requireAdmin={true}>
                      <TechnicalOverview />
                    </ProtectedRoute>
                  } />
                  <Route path="/api-test/roambuddy" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamBuddyAPITest />
                    </ProtectedRoute>
                  } />
                  <Route path="/integration-test" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamBuddyIntegrationTest />
                    </ProtectedRoute>
                  } />
                  <Route path="/roambuddy-store" element={<RoamBuddyStore />} />
                  <Route path="/roambuddy/terms" element={<RoamBuddyTerms />} />
                  <Route path="/roambuddy/privacy" element={<RoamBuddyPrivacy />} />
                  <Route path="/admin/affiliate-performance" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AffiliatePerformance />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/affiliate-payouts" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AffiliatePayouts />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/tools" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminTools />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/monetizable-urls" element={
                    <ProtectedRoute requireAdmin={true}>
                      <MonetizableURLsReference />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/roambuddy-sales" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamBuddySalesDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/roam-marketing" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamMarketingHub />
                    </ProtectedRoute>
                  } />
                  {/* Blog unpublished: legacy slug URLs also redirect home */}
                  <Route path="/blog/:slug" element={<Navigate to="/" replace />} />

                  {/* Error Handling */}
                  <Route path="/404" element={<NotFound />} />

                  {/* Catch-all - show 404 instead of silently redirecting */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              
              {/* Global Toast Notifications */}
              <Toaster />
              <SonnerToaster position="top-right" richColors closeButton />

              {/* Non-critical global overlays, lazy + deferred so they never
                  block first paint. fallback=null: they just pop in when ready.
                  - MagicCursor: sparkle trail (auto-disables on touch/reduced-motion)
                  - FloatingActionDock: expanding CTA (eSIM chat, WhatsApp, tour, a11y)
                  - RoamBuddySalesBot: ROAM chatbot window (opened via dock event)
                  - AccessibilitySettings: a11y panel (toggled via dock event) */}
              <GlobalOverlays />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;