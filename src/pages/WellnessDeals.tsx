import DealsHero from '@/components/DealsHero';
import DealGrid from '@/components/DealGrid';
import LoyaltyStrip from '@/components/LoyaltyStrip';
import CSRImpact from '@/components/CSRImpact';

export default function WellnessDeals() {
  return (
    <div className="bg-gradient-to-br from-wellness-light to-accent-light">
      <DealsHero />
      <DealGrid />
      <LoyaltyStrip />
      <CSRImpact />
    </div>
  );
}