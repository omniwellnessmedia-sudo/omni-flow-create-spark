import { CalendarCheck } from 'lucide-react';
import { useSiteSetting } from '@/hooks/useSiteSetting';
import { trackAdsConversion } from '@/lib/googleAds';

/**
 * Book and pay in one step, for the offers that need no scoping call.
 *
 * IT RENDERS NOTHING UNTIL A LINK IS SET, and that is the whole safety
 * mechanism rather than an afterthought. This button charges a real
 * person real money the moment it appears. It must not be possible for it
 * to go live before the money can actually reach the account.
 *
 * The setting is seeded empty. Somebody pastes a URL in only once the
 * payment processor has passed identity verification and can pay out to a
 * South African bank. Until then there is no button, no matter what else
 * ships.
 *
 * WHY A HOSTED LINK RATHER THAN OUR OWN CHECKOUT. The booking provider
 * takes the card, holds the calendar slot and sends its own confirmation.
 * We never touch card details, and the confirmation does not depend on
 * our own mail sending, which matters while our sender domain is still
 * unverified.
 *
 * WE DO NOT PRINT THE PRICE HERE. The offer's price comes from the rate
 * card and is already on the page. Writing it a second time creates a
 * place for it to drift.
 *
 * No em dashes in this file.
 */

const BookAndPayButton = ({
  settingKey,
  source,
  className = '',
  style,
}: {
  /** Which site_settings row holds this offer's link. */
  settingKey: string;
  source: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const url = useSiteSetting(settingKey, '').trim();
  if (!url) return null;

  // Only a real booking host. A mistyped or internal value must not become
  // a button that takes somebody off to nowhere with their card out.
  let safe = false;
  try {
    const parsed = new URL(url);
    safe = parsed.protocol === 'https:' && /(^|\.)cal\.com$/.test(parsed.hostname);
  } catch {
    safe = false;
  }
  if (!safe) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAdsConversion('booking_inquiry')}
      className={className}
      style={style}
    >
      <CalendarCheck className="h-4 w-4" />
      Book and pay
    </a>
  );
};

export default BookAndPayButton;
