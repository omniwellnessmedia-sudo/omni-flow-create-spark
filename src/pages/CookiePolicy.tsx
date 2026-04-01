import React from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Cookie, ArrowLeft, Mail } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <>
      <UnifiedNavigation />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-width section-large">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Cookie className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: March 2026
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website. They are
                  widely used to make websites work efficiently, provide information to site owners, and enhance
                  your browsing experience. This Cookie Policy explains how Omni Wellness Media uses cookies and
                  similar tracking technologies on our platform.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These cookies are strictly necessary for the platform to function. They enable core features
                  such as authentication, session management, security, and accessibility. Without these cookies,
                  the platform cannot operate properly. Essential cookies do not require consent.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>User authentication and login sessions</li>
                  <li>Shopping cart and checkout functionality</li>
                  <li>Security tokens and CSRF protection</li>
                  <li>Cookie consent preferences</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These cookies help us understand how visitors interact with our platform by collecting and
                  reporting information anonymously. This data helps us improve the user experience and optimize
                  platform performance.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Page views, bounce rates, and session duration</li>
                  <li>Navigation paths and user flow patterns</li>
                  <li>Device and browser information</li>
                  <li>Geographic location (country/region level)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These cookies are used to track visitors across websites to display relevant advertisements
                  and measure the effectiveness of marketing campaigns. They help us deliver content that is
                  more relevant to your interests.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Ad targeting and retargeting</li>
                  <li>Campaign performance measurement</li>
                  <li>Social media sharing functionality</li>
                  <li>Personalized content recommendations</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the following third-party services that may set cookies on your device:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong>Google Analytics:</strong> Tracks website usage and provides aggregated analytics data.
                    Cookies include _ga, _gid, and _gat. Data is retained for up to 26 months.
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Google Privacy Policy</a>
                  </li>
                  <li>
                    <strong>Microsoft Clarity:</strong> Provides session recordings, heatmaps, and behavioral analytics
                    to help us improve user experience. Cookies include _clck and _clsk.
                    <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Microsoft Privacy Statement</a>
                  </li>
                  <li>
                    <strong>Facebook Pixel:</strong> Tracks conversions from Facebook ads, builds targeted audiences,
                    and provides remarketing capabilities. Cookies include _fbp and fr.
                    <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">Meta Privacy Policy</a>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">How to Manage Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have several options for managing cookies:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Browser Settings:</strong> Most browsers allow you to view, manage, and delete cookies through their settings. Refer to your browser's help documentation for instructions.</li>
                  <li><strong>Cookie Consent Banner:</strong> When you first visit our platform, you can choose which categories of cookies to accept or reject through our cookie consent mechanism.</li>
                  <li><strong>Opt-Out Links:</strong> You can opt out of specific third-party tracking:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-Out</a></li>
                      <li><a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Ad Preferences</a></li>
                    </ul>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Please note that disabling certain cookies may affect your experience on our platform. Essential
                  cookies cannot be disabled as they are required for the platform to function.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Cookie Consent</h2>
                <p className="text-gray-700 leading-relaxed">
                  In accordance with applicable laws, we obtain your consent before placing non-essential cookies
                  on your device. Our cookie consent banner is displayed when you first visit the platform and
                  allows you to accept or reject specific categories of cookies. You can update your preferences
                  at any time by clearing your browser cookies and revisiting the platform, which will re-display
                  the consent banner.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">POPIA Compliance</h2>
                <p className="text-gray-700 leading-relaxed">
                  In compliance with the Protection of Personal Information Act (POPIA) of South Africa, we ensure
                  that cookies are used in a manner that respects your privacy rights. Personal information collected
                  through cookies is processed lawfully and for a specific purpose. We do not use cookies to collect
                  more information than is necessary. You have the right to object to the use of non-essential cookies,
                  and we will honor your preferences without affecting your access to the core functionality of our
                  platform. For more information about how we protect your personal data, please see our{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Changes to This Cookie Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in technology, legislation,
                  or our data practices. We will notify you of significant changes by posting the updated policy on
                  this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl border border-primary/20 p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="flex flex-col space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href="mailto:omnimediawellness@gmail.com" className="text-primary hover:underline">
                      omnimediawellness@gmail.com
                    </a>
                  </div>
                  <p><strong>Omni Wellness Media</strong></p>
                  <p>Cape Town, South Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookiePolicy;
