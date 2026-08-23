import { getActiveOffer } from '@/config/offers';
import { trackDepositClick } from '@/lib/analytics';
import { Button } from '@/components/ui/button';

/**
 * "Pay deposit" buttons for one offer. Renders NOTHING unless the offer is
 * active with at least one payment link (see src/config/offers.ts), so this
 * can be mounted ahead of the links existing without showing a dead button.
 *
 * EFT is deliberately the primary action and card the secondary: EFT rails
 * cost about 1.5% against about 3.2% plus R2 on card, and at deposit sizes
 * of R500 to R7,500 that difference is worth steering.
 */
const DepositButtons = ({ slug }: { slug: string }) => {
  const offer = getActiveOffer(slug);
  if (!offer) return null;

  const amount = `R${offer.deposit_zar.toLocaleString('en-ZA')}`;

  return (
    <div className="space-y-2" data-testid={`deposit-${offer.slug}`}>
      {offer.eft_link && (
        <Button
          asChild
          className="w-full"
          onClick={() => trackDepositClick(offer.slug, 'eft')}
        >
          <a href={offer.eft_link} rel="noopener">
            Pay {amount} deposit by EFT
          </a>
        </Button>
      )}
      {offer.card_link && (
        <Button
          asChild
          variant={offer.eft_link ? 'outline' : 'default'}
          className="w-full"
          onClick={() => trackDepositClick(offer.slug, 'card')}
        >
          <a href={offer.card_link} rel="noopener">
            Pay {amount} deposit by card
          </a>
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        Your deposit secures the date. The balance is invoiced before the day.
      </p>
    </div>
  );
};

export default DepositButtons;
