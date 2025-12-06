import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const RoamBuddyPrivacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
        <div className="container mx-auto px-4 relative">
          <Link 
            to="/roambuddy-store" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            How we collect, use, and protect your personal information when using RoamBuddy services
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          
          <section>
            <p className="text-muted-foreground">
              Welcome to Roam Buddy! Roam Buddy ("we", "us", "our") operates the website <strong>www.roambuddy.world</strong>. 
              This page informs you of our policies regarding the collection, use and disclosure of Personal Information we 
              receive from users of the Site and through the Omni Wellness Media platform.
            </p>
            <p className="text-muted-foreground">
              We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the 
              collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Information Collection and Use</h2>
            <p className="text-muted-foreground">
              While using our Site, we may ask you to provide us with certain personally identifiable information that can 
              be used to contact or identify you. Personally identifiable information may include, but is not limited to 
              your name ("Personal Information").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Log Data</h2>
            <p className="text-muted-foreground">
              Like many site operators, we collect information that your browser sends whenever you visit our Site ("Log Data"). 
              This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, 
              browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those 
              pages and other statistics.
            </p>
            <p className="text-muted-foreground mt-4">
              In addition, we may use third party services such as Google Analytics that collect, monitor and analyse user 
              behavior to better understand and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Communications</h2>
            <p className="text-muted-foreground">
              We may use your Personal Information to contact you with newsletters, marketing or promotional materials and 
              other information that relates to our services and products. You can opt out of receiving these communications 
              at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent 
              to your browser from a web site and stored on your computer's hard drive. Like many sites, we use "cookies" to 
              collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being 
              sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Security</h2>
            <p className="text-muted-foreground">
              The security of your Personal Information is important to us, but remember that no method of transmission over 
              the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable 
              means to protect your Personal Information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Third Party Services</h2>
            <p className="text-muted-foreground">We work with the following third-party services:</p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
              <li><strong>Payment Processing:</strong> Stripe, PayPal, Flutterwave</li>
              <li><strong>Analytics:</strong> Google Analytics</li>
              <li><strong>Email Services:</strong> For sending order confirmations and support</li>
              <li><strong>Omni Wellness Media:</strong> Our distribution partner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal data only for as long as necessary to provide the services you have requested and 
              thereafter for a variety of legitimate legal or business purposes. These might include retention periods:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
              <li>Mandated by law, contract or similar obligations applicable to our business operations</li>
              <li>For preserving, resolving, defending or enforcing our legal/contractual rights</li>
              <li>Needed to maintain adequate and accurate business and financial records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Your Rights (POPIA Compliance)</h2>
            <p className="text-muted-foreground">
              Under the Protection of Personal Information Act (POPIA) and similar data protection regulations, you have 
              the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
              <li>Access your personal information that we hold</li>
              <li>Request correction of inaccurate personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing your personal information</li>
              <li>Request transfer of your personal information</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:support@roambuddy.world" className="text-primary hover:underline">support@roambuddy.world</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Changes To This Privacy Policy</h2>
            <p className="text-muted-foreground">
              This Privacy Policy is effective as of December 2025 and will remain in effect except with respect to any 
              changes in its provisions in the future, which will be in effect immediately after being posted on this page.
            </p>
            <p className="text-muted-foreground mt-4">
              We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy 
              Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy 
              on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound 
              by the modified Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mt-4">
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:support@roambuddy.world" className="text-primary hover:underline">support@roambuddy.world</a>
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Partner Contact:</strong> <a href="mailto:info@omniwellnessmedia.com" className="text-primary hover:underline">info@omniwellnessmedia.com</a>
              </p>
            </div>
          </section>

          <div className="bg-muted/50 p-6 rounded-lg mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Your Privacy Matters</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We are committed to protecting your privacy and ensuring your personal information is handled responsibly. 
              If you have any concerns, please don't hesitate to reach out to our support team.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoamBuddyPrivacy;
