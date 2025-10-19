import React from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
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
                  <Shield className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  At Omni Wellness Media ("we," "our," or "us"), we are committed to protecting your privacy
                  and ensuring the security of your personal information. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when you visit our platform and use
                  our wellness services.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide when you:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Register for an account</li>
                  <li>Book wellness services or retreats</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for support or consultation</li>
                  <li>Participate in our community forums</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This may include: name, email address, phone number, billing information, and wellness preferences.
                </p>

                <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect certain information when you visit our platform, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Browser and device information</li>
                  <li>IP address and location data</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the collected information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide, maintain, and improve our wellness services</li>
                  <li>Process your bookings and transactions</li>
                  <li>Send you updates, newsletters, and promotional content</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Analyze platform usage and optimize user experience</li>
                  <li>Protect against fraudulent or illegal activity</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Service Providers:</strong> Wellness practitioners, retreat hosts, and booking partners</li>
                  <li><strong>Business Partners:</strong> Third-party service providers who assist in platform operations</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your
                  personal information. However, no method of transmission over the internet is 100% secure.
                  We use industry-standard encryption, secure servers, and regular security audits to
                  safeguard your data.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Disable cookies through your browser settings</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze
                  platform usage, and deliver personalized content. You can control cookie preferences
                  through your browser settings, though disabling cookies may limit platform functionality.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly
                  collect personal information from children. If you believe we have inadvertently collected
                  such information, please contact us immediately.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any significant
                  changes by posting the new policy on this page and updating the "Last updated" date. Your
                  continued use of our platform after changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl border border-primary/20 p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;
