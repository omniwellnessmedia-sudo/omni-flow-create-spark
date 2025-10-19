import React from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Mail } from 'lucide-react';

const TermsOfService = () => {
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
                  <FileText className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Omni Wellness Media's platform and services, you agree to be bound
                  by these Terms of Service and all applicable laws and regulations. If you do not agree with
                  any of these terms, you are prohibited from using or accessing this platform. The materials
                  contained in this platform are protected by applicable copyright and trademark law.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Permission is granted to temporarily access and use the materials on Omni Wellness Media's
                  platform for personal, non-commercial use only. This is the grant of a license, not a
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or public display</li>
                  <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                  <li>Remove any copyright or proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate, complete, and current
                  information. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Maintaining the confidentiality of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Ensuring your account information remains up-to-date</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Wellness Services and Bookings</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Omni Wellness Media acts as a platform connecting users with wellness service providers.
                  By booking services through our platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>You agree to the specific terms and policies of the service provider</li>
                  <li>You are responsible for reviewing cancellation and refund policies before booking</li>
                  <li>Payment is due at the time of booking unless otherwise specified</li>
                  <li>You agree to attend scheduled sessions or notify the provider of cancellations</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We are not liable for the quality, safety, or outcome of services provided by third-party
                  wellness practitioners.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">WellCoin Currency System</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our platform uses a dual-currency system (ZAR and WellCoins). By using WellCoins:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>You acknowledge WellCoins have no cash value outside our platform</li>
                  <li>WellCoins cannot be exchanged for fiat currency</li>
                  <li>WellCoin balances are subject to our exchange policies</li>
                  <li>We reserve the right to modify WellCoin exchange rates with notice</li>
                  <li>Unused WellCoins may expire according to our policies</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Content Standards</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Users who contribute content to our platform agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Not post content that is unlawful, harmful, or offensive</li>
                  <li>Respect intellectual property rights of others</li>
                  <li>Not impersonate any person or entity</li>
                  <li>Not post spam, advertising, or promotional materials without permission</li>
                  <li>Maintain a respectful and supportive community atmosphere</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The materials on Omni Wellness Media's platform are provided on an 'as is' basis. We make
                  no warranties, expressed or implied, and hereby disclaim all other warranties including,
                  without limitation, implied warranties of merchantability, fitness for a particular purpose,
                  or non-infringement of intellectual property.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Wellness services and advice provided through our platform are for informational purposes
                  and should not replace professional medical advice. Always consult with qualified healthcare
                  professionals for medical concerns.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Limitations of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Omni Wellness Media or its suppliers be liable for any damages (including,
                  without limitation, damages for loss of data or profit, or due to business interruption)
                  arising out of the use or inability to use the materials on our platform, even if we or an
                  authorized representative has been notified orally or in writing of the possibility of such
                  damage.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Accuracy of Materials</h2>
                <p className="text-gray-700 leading-relaxed">
                  The materials appearing on our platform could include technical, typographical, or
                  photographic errors. We do not warrant that any of the materials are accurate, complete,
                  or current. We may make changes to the materials at any time without notice.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Links to Third-Party Sites</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our platform may contain links to third-party websites or services that are not owned or
                  controlled by Omni Wellness Media. We have no control over, and assume no responsibility
                  for, the content, privacy policies, or practices of any third-party sites or services. You
                  acknowledge and agree that we shall not be responsible or liable for any damage or loss
                  caused by or in connection with the use of any such content, goods, or services available
                  on or through any such websites or services.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Modifications</h2>
                <p className="text-gray-700 leading-relaxed">
                  Omni Wellness Media may revise these terms of service at any time without notice. By using
                  this platform you are agreeing to be bound by the then current version of these terms of
                  service. We will notify users of significant changes through email or platform notifications.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of
                  South Africa and you irrevocably submit to the exclusive jurisdiction of the courts in
                  that location.
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl border border-primary/20 p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Questions about the Terms of Service should be sent to us:
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

export default TermsOfService;
