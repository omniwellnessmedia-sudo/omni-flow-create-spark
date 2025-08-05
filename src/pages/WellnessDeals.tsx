import DealsHero from '@/components/DealsHero';
import DealGrid from '@/components/DealGrid';
import LoyaltyStrip from '@/components/LoyaltyStrip';
import CSRImpact from '@/components/CSRImpact';

export default function WellnessDeals() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-light via-white to-accent-light">
      <DealsHero />
      <DealGrid />
      <LoyaltyStrip />
      <CSRImpact />
      
      {/* Call to action footer */}
      <section className="py-16 px-4 text-center bg-wellness-primary text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of South Africans transforming their lives through conscious wellness experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-wellness-primary rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Join Our Community
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-wellness-primary transition-colors">
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}