import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/components/AuthProvider';
import { CartProvider } from '@/components/CartProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import { lazyWithRetry } from '@/lib/lazyWithRetry';

// Lazy load components for better performance
const Index = lazyWithRetry(() => import('@/pages/Index'));
const WellnessExchange = lazyWithRetry(() => import('@/pages/WellnessExchange'));
const WellnessMarketplace = lazyWithRetry(() => import('@/pages/WellnessMarketplace'));
const UnifiedMarketplace = lazyWithRetry(() => import('@/pages/UnifiedMarketplace'));
const WellnessAccount = lazyWithRetry(() => import('@/pages/WellnessAccount'));
const WellnessWants = lazyWithRetry(() => import('@/pages/WellnessWants'));
const WellnessCommunity = lazyWithRetry(() => import('@/pages/WellnessCommunity'));
// Consolidated to use ServiceDetail.tsx for all service detail routes
const IndividualProviderProfile = lazyWithRetry(() => import('@/pages/IndividualProviderProfile'));
const SandyMitchellProfile = lazyWithRetry(() => import('@/pages/SandyMitchellProfile'));
const AddService = lazyWithRetry(() => import('@/pages/AddService'));
const EditService = lazyWithRetry(() => import('@/pages/EditService'));
const StunningPigs = lazyWithRetry(() => import('@/pages/events/StunningPigs'));
// UNLISTED, NOINDEX: BWC Meet the Team controlled staging page. Holds real
// people's photographs and biographies that are NOT cleared for publication —
// see the header comment in src/pages/team/bwcTeamData.ts. Deliberately absent
// from nav and sitemap; reachable only by direct link, for Chad's review.
const BwcTeamStaging = lazyWithRetry(() => import('@/pages/team/BwcTeamStaging'));

// Decorative / non-critical global overlays — lazy so they leave the initial
// bundle instead of loading on every page before first paint. They render at
// the end of the tree inside Suspense(fallback=null), so they simply appear a
// beat after hydration rather than blocking the page. The ROAM chatbot in
// particular is heavy and is never needed on first render.
const MagicCursor = lazyWithRetry(() => import('@/components/MagicCursor'));
const FloatingActionDock = lazyWithRetry(() => import('@/components/FloatingActionDock'));
const RoamBuddySalesBot = lazyWithRetry(() =>
  import('@/components/roambuddy/RoamBuddySalesBot').then((m) => ({ default: m.RoamBuddySalesBot }))
);
const AccessibilitySettings = lazyWithRetry(() => import('@/components/accessibility/AccessibilitySettings'));

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
const ProviderDashboard = lazyWithRetry(() => import('@/pages/ProviderDashboard'));
const ModernProviderPortal = lazyWithRetry(() => import('@/pages/ModernProviderPortal'));
const TransactionPage = lazyWithRetry(() => import('@/pages/TransactionPage'));
// 2BeWell routes redirect to services (brand retired)

const WellnessDeals = lazyWithRetry(() => import('@/pages/WellnessDeals'));
const AuthPage = lazyWithRetry(() => import('@/pages/Auth'));
const TestPage = lazyWithRetry(() => import('@/pages/TestPage'));
const TestSimple = lazyWithRetry(() => import('@/pages/TestSimple'));
const About = lazyWithRetry(() => import('@/pages/About'));
const Contact = lazyWithRetry(() => import('@/pages/Contact'));
const Services = lazyWithRetry(() => import('@/pages/Services'));
const PrivacyPolicy = lazyWithRetry(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('@/pages/TermsOfService'));
const CookiePolicy = lazyWithRetry(() => import('@/pages/CookiePolicy'));
const ESGPolicy = lazyWithRetry(() => import('@/pages/ESGPolicy'));
const Unsubscribe = lazyWithRetry(() => import('@/pages/Unsubscribe'));
const Enquire = lazyWithRetry(() => import('@/pages/Enquire'));
const Muizenberg = lazyWithRetry(() => import('@/pages/Muizenberg'));
const MuizenbergAuditSheet = lazyWithRetry(() => import('@/pages/MuizenbergAuditSheet'));
const Talks = lazyWithRetry(() => import('@/pages/Talks'));
const QuotePrint = lazyWithRetry(() => import('@/pages/admin/QuotePrint'));
const ProposalPrint = lazyWithRetry(() => import('@/pages/admin/ProposalPrint'));
const ServiceDetail = lazyWithRetry(() => import('@/pages/ServiceDetail'));
const SearchServices = lazyWithRetry(() => import('@/pages/SearchServices'));
const AddWant = lazyWithRetry(() => import('@/pages/AddWant'));
// TwoBeWell retired — redirects in routes below
const TravelWellConnectedStore = lazyWithRetry(() => import('@/pages/TravelWellConnectedStore'));
const WellnessRoamingPackages = lazyWithRetry(() => import('@/pages/WellnessRoamingPackages'));
const DataProducts = lazyWithRetry(() => import('@/pages/DataProducts'));
const ProductDetail = lazyWithRetry(() => import('@/pages/ProductDetail'));
const DealDetail = lazyWithRetry(() => import('@/pages/DealDetail'));
const Checkout = lazyWithRetry(() => import('@/pages/Checkout'));
const OrderConfirmation = lazyWithRetry(() => import('@/pages/OrderConfirmation'));
const GuestOrderLookup = lazyWithRetry(() => import('@/pages/GuestOrderLookup'));
const PaymentSuccess = lazyWithRetry(() => import('@/pages/PaymentSuccess'));
const PaymentCancelled = lazyWithRetry(() => import('@/pages/PaymentCancelled'));
const Podcast = lazyWithRetry(() => import('@/pages/Podcast'));
const Portfolio = lazyWithRetry(() => import('@/pages/Portfolio'));
const Resources = lazyWithRetry(() => import('@/pages/Resources'));
const WellnessExchangeSignup = lazyWithRetry(() => import('@/pages/WellnessExchangeSignup'));
const BusinessConsulting = lazyWithRetry(() => import('@/pages/BusinessConsulting'));
const MediaProduction = lazyWithRetry(() => import('@/pages/MediaProduction'));
const Screenings = lazyWithRetry(() => import('@/pages/Screenings'));
const WebDevelopment = lazyWithRetry(() => import('@/pages/WebDevelopment'));
const SocialMediaStrategy = lazyWithRetry(() => import('@/pages/SocialMediaStrategy'));
const ConsciousMediaPartnershipPage = lazyWithRetry(() => import('@/pages/ConsciousMediaPartnershipPage'));
const ConsciousMediaInfrastructurePage = lazyWithRetry(() => import('@/pages/ConsciousMediaInfrastructurePage'));
// const AITools = lazyWithRetry(() => import('@/pages/AITools')); // Temporarily hidden
const TourCategory = lazyWithRetry(() => import('@/pages/TourCategory'));
const TourDetail = lazyWithRetry(() => import('@/pages/TourDetail'));
const ToursRetreats = lazyWithRetry(() => import('@/pages/ToursRetreats'));
const Tours = lazyWithRetry(() => import('@/pages/Tours'));
const MuizenbergCaveTours = lazyWithRetry(() => import('@/pages/tours/MuizenbergCaveTours'));
const OmniWellnessRetreat = lazyWithRetry(() => import('@/pages/tours/OmniWellnessRetreat'));
const GreatMotherCaveTour = lazyWithRetry(() => import('@/pages/tours/GreatMotherCaveTour'));
const KalkBayTour = lazyWithRetry(() => import('@/pages/tours/KalkBayTour'));
const CartHorseUrbanWellness = lazyWithRetry(() => import('@/pages/experiences/CartHorseUrbanWellness'));
const CorporateWellnessRetreat = lazyWithRetry(() => import('@/pages/experiences/CorporateWellnessRetreat'));
const ViatorWellnessExperiences = lazyWithRetry(() => import('@/pages/ViatorWellnessExperiences'));
const ESIMStore = lazyWithRetry(() => import('@/pages/ESIMStore'));
// TravelWellConnectedESIM retired — redirects to ROAM store
const UWCHumanAnimalProgram = lazyWithRetry(() => import('@/pages/programs/UWCHumanAnimalProgram'));
const UWCUniversityPartners = lazyWithRetry(() => import('@/pages/programs/UWCUniversityPartners'));
const UWCSponsors = lazyWithRetry(() => import('@/pages/programs/UWCSponsors'));
const UWCRecruitment = lazyWithRetry(() => import('@/pages/programs/UWCRecruitment'));
const CSRImpact = lazyWithRetry(() => import('@/pages/CSRImpact'));
const PartnersDirectory = lazyWithRetry(() => import('@/pages/PartnersDirectory'));
const PartnerProfile = lazyWithRetry(() => import('@/pages/PartnerProfile'));
const PartnerPortal = lazyWithRetry(() => import('@/pages/PartnerPortal'));
const ExerciseLibrary = lazyWithRetry(() => import('@/pages/ExerciseLibrary'));
const DeviceCompatibility = lazyWithRetry(() => import('@/pages/DeviceCompatibility'));
const RoamBuddyOverview = lazyWithRetry(() => import('@/pages/partner/RoamBuddyOverview'));
const NotFound = lazyWithRetry(() => import('@/pages/NotFound'));
const AdminDashboard = lazyWithRetry(() => import('@/pages/AdminDashboard'));
const AccountantDashboard = lazyWithRetry(() => import('@/pages/AccountantDashboard'));
const ProductManagement = lazyWithRetry(() => import('@/pages/admin/ProductManagement'));
const LocalCatalogue = lazyWithRetry(() => import('@/pages/admin/LocalCatalogue'));
// The curation screen decides what shoppers see (src/config/catalogueGate.ts).
// It existed but was never routed, so the control was unreachable.
const ProductCuration = lazyWithRetry(() => import('@/pages/admin/ProductCuration'));
const MarketplaceHub = lazyWithRetry(() => import('@/pages/admin/MarketplaceHub'));
const ServiceOfferDetail = lazyWithRetry(() => import('@/pages/ServiceOfferDetail'));
const Pricing = lazyWithRetry(() => import('@/pages/Pricing'));
const AdminLayout = lazyWithRetry(() => import('@/components/dashboard/AdminLayout'));
const EventsIndex = lazyWithRetry(() => import('@/pages/EventsIndex'));
const EventDetailPage = lazyWithRetry(() => import('@/pages/EventDetail'));
const EventSubmit = lazyWithRetry(() => import('@/pages/EventSubmit'));
const EventsAdmin = lazyWithRetry(() => import('@/pages/admin/EventsAdmin'));
const Scorecard = lazyWithRetry(() => import('@/pages/Scorecard'));
const TechnicalOverview = lazyWithRetry(() => import('@/pages/TechnicalOverview'));
const RoamBuddyAPITest = lazyWithRetry(() => import('@/pages/RoamBuddyAPITest'));
const RoamBuddyIntegrationTest = lazyWithRetry(() => import('@/pages/RoamBuddyIntegrationTest'));
const RoamBuddyStore = lazyWithRetry(() => import('@/pages/RoamBuddyStore'));
const RoamBuddyTerms = lazyWithRetry(() => import('@/pages/roambuddy/RoamBuddyTerms'));
const RoamBuddyPrivacy = lazyWithRetry(() => import('@/pages/roambuddy/RoamBuddyPrivacy'));
const AffiliateMarketplace = lazyWithRetry(() => import('@/pages/AffiliateMarketplace'));
const AffiliatePerformance = lazyWithRetry(() => import('@/pages/admin/AffiliatePerformance'));
const AffiliatePayouts = lazyWithRetry(() => import('@/pages/admin/AffiliatePayouts'));
const CJAffiliateProducts = lazyWithRetry(() => import('@/pages/CJAffiliateProducts'));
const AwinAffiliateProducts = lazyWithRetry(() => import('@/pages/AwinAffiliateProducts'));
const CJProductDetail = lazyWithRetry(() => import('@/pages/CJProductDetail'));
const StoreCollections = lazyWithRetry(() => import('@/pages/StoreCollections'));
const AdminTools = lazyWithRetry(() => import('@/pages/admin/AdminTools'));
const MonetizableURLsReference = lazyWithRetry(() => import('@/pages/admin/MonetizableURLsReference'));
const RoamBuddySalesDashboard = lazyWithRetry(() => import('@/pages/admin/RoamBuddySalesDashboard'));
const RoamMarketingHub = lazyWithRetry(() => import('@/pages/admin/RoamMarketingHub'));
const Wishlist = lazyWithRetry(() => import('@/pages/Wishlist'));
const StoreProductDetail = lazyWithRetry(() => import('@/pages/StoreProductDetail'));
const UpdatePassword = lazyWithRetry(() => import('@/pages/UpdatePassword'));
const UpgradePage = lazyWithRetry(() => import('@/pages/UpgradePage'));

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
                  <Route path="/unsubscribe" element={<Unsubscribe />} />
                  <Route path="/enquire" element={<Enquire />} />
                  <Route path="/muizenberg" element={<Muizenberg />} />
                  <Route path="/muizenberg/audit-sheet" element={<MuizenbergAuditSheet />} />
                  <Route path="/watch" element={<Talks />} />
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
                  <Route path="/wellness-community" element={<Navigate to="/" replace />} />

                  {/* Marketplace & Services */}
                  <Route path="/marketplace" element={<UnifiedMarketplace />} />
                  <Route path="/services" element={<Services />} />
                  {/* One page per rate card offer. The slug is the offer's
                      stable id, which is also the ?service= value the contact
                      form reads, so an enquiry traces back to its page. */}
                  <Route path="/services/:slug" element={<ServiceOfferDetail />} />
                  <Route path="/pricing" element={<Pricing />} />
                  {/* Free diagnostic, the top of the funnel for every service page. */}
                  <Route path="/scorecard" element={<Scorecard />} />
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
                  {/* One events calendar, not two. /community/events was a
                      second calendar over the same content; it now redirects
                      so existing links and the sitemap keep working. */}
                  <Route path="/community/events" element={<Navigate to="/events" replace />} />
                  <Route path="/events" element={<EventsIndex />} />
                  <Route path="/events/submit" element={<EventSubmit />} />
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
                  {/* Static segments outrank dynamic ones in the router, so the
                      bespoke Stunning Pigs page above still wins its own slug. */}
                  <Route path="/events/:slug" element={<EventDetailPage />} />
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
                  
                  {/* The blog is gone. Every URL it ever had redirects home
                      rather than 404ing, because links live on in inboxes,
                      bookmarks and search results long after a page does.
                      The blog_posts table is deliberately left in the
                      database: nothing written is destroyed by this, it just
                      stops being reachable from the site. */}
                  <Route path="/community" element={<Navigate to="/" replace />} />
                  <Route path="/community-blog" element={<Navigate to="/" replace />} />
                  <Route path="/blog" element={<Navigate to="/" replace />} />
                  <Route path="/blog-editor" element={<Navigate to="/" replace />} />
                  <Route path="/blog/editor/new" element={<Navigate to="/" replace />} />
                  <Route path="/blog/editor/:postId" element={<Navigate to="/" replace />} />
                  <Route path="/blog/post/:slug" element={<Navigate to="/" replace />} />
                  <Route path="/blog/community" element={<Navigate to="/" replace />} />
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
                  {/* A quotation as a printable document. No admin shell: it is
                      a page to print or save as a PDF and send to a client. */}
                  <Route path="/admin/quote/:leadType/:leadId/:number" element={
                    <ProtectedRoute requireAdmin={true}>
                      <QuotePrint />
                    </ProtectedRoute>
                  } />
                  {/* A proposal as a branded document: findings, offers, plan,
                      investment. Same shell as the quotation. */}
                  <Route path="/admin/proposal/:leadType/:leadId/:number" element={
                    <ProtectedRoute requireAdmin={true}>
                      <ProposalPrint />
                    </ProtectedRoute>
                  } />
                  {/* Catalogue managers onboard local businesses and products.
                      Narrower than admin on purpose: this route does not reach
                      accounting, leads, team management or role assignment. */}
                  <Route path="/admin/catalogue" element={
                    <ProtectedRoute requireCatalogueManager={true}>
                      <AdminLayout><LocalCatalogue /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute requireCatalogueManager={true}>
                      <AdminLayout><ProductCuration /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  {/* One front door for the marketplace. The screens below it
                      overlapped and used different words for the same job, so
                      this page says what needs a person and sends them there. */}
                  <Route path="/admin/marketplace" element={
                    <ProtectedRoute requireCatalogueManager={true}>
                      <AdminLayout><MarketplaceHub /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/events" element={
                    <ProtectedRoute requireCatalogueManager={true}>
                      <AdminLayout><EventsAdmin /></AdminLayout>
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
                      <AdminLayout><AffiliatePerformance /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/affiliate-payouts" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout><AffiliatePayouts /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/tools" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout><AdminTools /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/monetizable-urls" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout><MonetizableURLsReference /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/roambuddy-sales" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout><RoamBuddySalesDashboard /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/roam-marketing" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout><RoamMarketingHub /></AdminLayout>
                    </ProtectedRoute>
                  } />
                  {/* Legacy blog slug URLs also redirect home */}
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