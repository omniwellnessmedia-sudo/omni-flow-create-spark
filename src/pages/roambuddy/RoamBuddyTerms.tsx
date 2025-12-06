import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const RoamBuddyTerms = () => {
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
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            General terms and conditions for using RoamBuddy eSIM services through Omni Wellness Media
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-foreground border-b pb-2">GENERAL TERMS AND CONDITIONS</h2>
            
            <h3 className="text-xl font-semibold mt-6">1. VALIDITY OF GENERAL TERMS AND CONDITIONS</h3>
            <p className="text-muted-foreground">
              The following terms and conditions shall apply to all services rendered by RoamBuddy, hereafter referred to as RoamBuddy, 
              in connection with the prepaid data roaming products/services. The following terms and conditions are provided on this 
              website and through the Omni Wellness Media platform. RoamBuddy may accept variant clauses only in the case of an 
              explicit written agreement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">2. DESCRIPTION OF SERVICES</h3>
            
            <h4 className="font-semibold mt-4">2.1 Data Bundles</h4>
            <p className="text-muted-foreground">
              RoamBuddy resells prepaid eSIMs, Physical Multi-IMSI SIMS and Preconfigured Mobile Wi-Fi devices. The customer 
              registers and buys these products on this website and/or through RoamBuddy Apps. Our payments are operated by 
              Flutterwave and Stripe.
            </p>

            <h4 className="font-semibold mt-4">2.2 REGISTRATION FOR USING RoamBuddy SERVICES</h4>
            <p className="text-muted-foreground">
              The customer must accept the general terms and conditions to use RoamBuddy services. The client gives directly, 
              or by the intermediary of the service provider (Hotel, Travel Agency...), the following information:
            </p>
            <ul className="list-decimal list-inside text-muted-foreground ml-4">
              <li>First Name</li>
              <li>Last Name</li>
              <li>Address (billing address)</li>
              <li>Email address</li>
            </ul>

            <h4 className="font-semibold mt-4">2.3 RoamBuddy ENGAGEMENTS</h4>
            <p className="text-muted-foreground">
              RoamBuddy shall use reasonable endeavors to provide Customer a quality of service. However, RoamBuddy does not 
              guarantee that the service won't be interrupted, furnished on due time, safe or fault-free. Risks with respect 
              to regular wear and tear will be assumed by RoamBuddy, which will promptly repair the damages which materially 
              impairs the function of the Equipment and/or replace the Equipment.
            </p>

            <h4 className="font-semibold mt-4">2.4 CUSTOMER ENGAGEMENTS</h4>
            <p className="text-muted-foreground">
              In using the Equipment or Services provided by RoamBuddy, the Customer must not engage in any action:
            </p>
            <ul className="list-decimal list-inside text-muted-foreground ml-4">
              <li>that is abusive, illegal, or fraudulent;</li>
              <li>that causes the Network to be impaired or damaged.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              When the Customer is in breach of its obligations, RoamBuddy may suspend the Customer's use of the Service. 
              RoamBuddy will notify the Customer as soon as reasonably practicable of the suspension. During any period of 
              suspension, the Customer shall continue to pay all charges under this Agreement in respect of the suspended Services.
            </p>

            <h4 className="font-semibold mt-4">2.5 DEVICE COMPATIBILITY</h4>
            <p className="text-muted-foreground">
              It is the customer's responsibility to ensure that the device is compatible and not locked by any carrier, as 
              this is a prerequisite to complete the purchase. As device compatibility may depend on the carrier and country 
              of origin, the list of compatible devices is provided at the checkout and can also be found on our Help Center.
            </p>
            <p className="text-muted-foreground mt-2">
              However, the eSIM compatibility list is not exhaustive meaning that there might be newly announced eSIM compatible 
              devices that have not yet been added.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">3. START, DURATION AND TERMINATION OF THE CONTRACT</h3>
            <p className="text-muted-foreground">
              The service contract between RoamBuddy and the customer starts upon order at this website. The contract ends as 
              soon as the customer receives the data bundle and activates the product. Activation of the data bundle is under 
              the responsibility of the Customer.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">4. CHARGES AND PAYMENT</h3>
            
            <h4 className="font-semibold mt-4">4.1 PAYMENT CONDITIONS</h4>
            <p className="text-muted-foreground">
              The payment of RoamBuddy services is made by credit card and/or Mobile Money. The currency of payment varies 
              based on the customer's preferences. The credit card transaction will be processed and secured by RoamBuddy 
              providers Stripe (https://stripe.com).
            </p>

            <h4 className="font-semibold mt-4">4.2 CHARGES FOR USE</h4>
            <ul className="list-decimal list-inside text-muted-foreground ml-4">
              <li>RoamBuddy states all Charges inclusive of VAT, unless specified otherwise.</li>
              <li>If the customer reasonably and in good faith disputes an invoice or part of it, Customer shall notify RoamBuddy of such dispute within 12 days of receipt of the invoice, providing details of why the invoiced amount is incorrect and, if possible, how much the customer considers is due.</li>
              <li>The customer shall not be entitled to set off any of its claims against claims of RoamBuddy, except where the customer's claims are undisputed or have been confirmed by final court judgment.</li>
            </ul>

            <h4 className="font-semibold mt-4">DELIVERY</h4>
            <p className="text-muted-foreground">
              The customer will immediately see the purchased products under their account on the website and/or the apps.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">5. REFUND / CANCELLATION / MODIFICATION POLICY</h3>
            <p className="text-muted-foreground">
              Customer has the right to ask for a refund or a change if the data bundle or SIM/eSIM can not be activated 
              due to a technical problem originating from RoamBuddy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">6. PRIVACY</h3>
            <p className="text-muted-foreground">
              All data provided by customers during the usage of RoamBuddy equipment will be protected corresponding to 
              the relevant terms of privacy regarding customer data. All customer provided data saved by RoamBuddy, will 
              be explicitly used for purposes of contractual fulfillment and to inform the customer about products related 
              to their contractual agreement. In this regard, the customer agrees explicitly, that they approve and agree 
              to the mailing of such information, also for marketing purposes and in electronic form, e.g. via email. A 
              revocation of consent may be served at any time but must be made in writing to RoamBuddy, stating the 
              affected email addresses.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold">7. LIABILITY AND WARRANTY</h3>
            <p className="text-muted-foreground">
              RoamBuddy is not responsible for detriments arising as a result, that the proposed service is not or not 
              constantly available. RoamBuddy provides no guarantee of constant availability of the network service.
            </p>
            <p className="text-muted-foreground mt-2">
              For any requests, please drop a note to <a href="mailto:support@roambuddy.world" className="text-primary hover:underline">support@roambuddy.world</a>
            </p>
          </section>

          <div className="bg-muted/50 p-6 rounded-lg mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Warranty & Satisfaction Guaranteed</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              RoamBuddy is committed to providing quality service and customer satisfaction. If you have any questions 
              or concerns about these terms, please contact our support team.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoamBuddyTerms;
