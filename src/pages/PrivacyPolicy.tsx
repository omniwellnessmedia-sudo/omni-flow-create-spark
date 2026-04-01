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
                Last updated: March 2026
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
                <h2 className="text-2xl font-bold mb-4">Third-Party Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We share data with the following third-party services to operate and improve our platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Supabase:</strong> Database hosting, authentication, and backend services</li>
                  <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior insights</li>
                  <li><strong>Microsoft Clarity:</strong> Session recordings and heatmaps for user experience optimization</li>
                  <li><strong>PayPal:</strong> Payment processing for transactions</li>
                  <li><strong>Stripe:</strong> Secure payment processing and subscription management</li>
                  <li><strong>Cal.com:</strong> Appointment scheduling and booking management</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Each third-party provider has its own privacy policy governing their use of your data. We encourage
                  you to review their respective policies.
                </p>
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
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Under applicable data protection laws, including POPIA, you have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Right of Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Right to Correction:</strong> Request that we correct any inaccurate or incomplete personal information</li>
                  <li><strong>Right to Deletion:</strong> Request the deletion of your personal information, subject to legal retention requirements</li>
                  <li><strong>Right to Object:</strong> Object to the processing of your personal information for direct marketing or other purposes</li>
                  <li><strong>Right to Data Portability:</strong> Request a machine-readable copy of your data to transfer to another service provider</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent where processing is based on consent, without affecting the lawfulness of prior processing</li>
                  <li><strong>Opt-out of Marketing:</strong> Unsubscribe from marketing communications at any time</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise any of these rights, please contact us at omnimediawellness@gmail.com. We will respond to your request within 30 days.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Cookie Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience, analyze
                  platform usage, and deliver personalized content. The types of cookies we use include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality such as authentication and session management</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the platform (e.g., Google Analytics, Microsoft Clarity)</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertising and track campaign effectiveness</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can manage your cookie preferences through your browser settings or our cookie consent mechanism.
                  Disabling non-essential cookies will not affect core platform functionality. For more detailed information,
                  please see our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly
                  collect personal information from children or minors under 18. If you are a parent or guardian
                  and believe your child has provided us with personal information, please contact us immediately
                  at omnimediawellness@gmail.com and we will take steps to delete such information from our systems.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">POPIA Compliance</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a South African entity, Omni Wellness Media complies with the Protection of Personal Information
                  Act (POPIA). Under POPIA, we are committed to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Processing personal information lawfully and in a reasonable manner that does not infringe your privacy</li>
                  <li>Collecting personal information only for a specific, explicitly defined, and lawful purpose</li>
                  <li>Not retaining personal information longer than is necessary for the purpose it was collected</li>
                  <li>Taking appropriate technical and organizational measures to prevent loss, damage, or unauthorized access to personal information</li>
                  <li>Ensuring that third parties who process personal information on our behalf adhere to POPIA requirements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Our Information Officer can be contacted at omnimediawellness@gmail.com for any POPIA-related inquiries
                  or to lodge a complaint with the Information Regulator of South Africa.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes for which
                  it was collected, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Account Data:</strong> Retained for the duration of your account and up to 12 months after account deletion</li>
                  <li><strong>Transaction Records:</strong> Retained for 5 years to comply with financial and tax regulations</li>
                  <li><strong>Marketing Preferences:</strong> Retained until you withdraw consent or unsubscribe</li>
                  <li><strong>Analytics Data:</strong> Anonymized data may be retained indefinitely for statistical purposes</li>
                  <li><strong>Support Communications:</strong> Retained for up to 3 years for quality assurance and dispute resolution</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  When personal information is no longer needed, we securely delete or anonymize it in accordance with
                  our data retention schedule.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your personal information may be transferred to and processed in countries other than South Africa,
                  including where our third-party service providers operate (such as the United States and the European Union).
                  When we transfer data internationally, we ensure that:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>The recipient country has adequate data protection laws, or</li>
                  <li>Appropriate safeguards are in place (such as standard contractual clauses), or</li>
                  <li>The transfer is necessary for the performance of a contract between you and us</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We take reasonable steps to ensure your data receives the same level of protection as it would
                  under South African law and POPIA.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Data Breach Notification</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In the event of a data breach that compromises your personal information, we will:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Notify the Information Regulator of South Africa as soon as reasonably possible</li>
                  <li>Notify affected individuals without unreasonable delay, providing details of the breach and its potential impact</li>
                  <li>Describe the measures taken or proposed to address the breach and mitigate its effects</li>
                  <li>Provide recommendations for steps you can take to protect yourself</li>
                  <li>Document all breaches, including facts, effects, and remedial actions taken</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We maintain incident response procedures to detect, investigate, and respond to data breaches promptly.
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
