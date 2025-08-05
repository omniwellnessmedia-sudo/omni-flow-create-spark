import DealsHero from '@/components/DealsHero';
import DealGrid from '@/components/DealGrid';
import LoyaltyStrip from '@/components/LoyaltyStrip';
import CSRImpact from '@/components/CSRImpact';

export default function WellnessDeals() {
  return (
    <div className="min-h-screen bg-white">
      <DealsHero />
      <DealGrid />
      <LoyaltyStrip />
      <CSRImpact />
    </div>
  );
}