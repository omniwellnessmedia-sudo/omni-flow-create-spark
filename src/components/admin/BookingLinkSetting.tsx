import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureUserRole } from '@/hooks/useSecureUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Save, AlertTriangle } from 'lucide-react';
import ReadFailureNotice from '@/components/admin/ReadFailureNotice';

/**
 * The switch that makes a service sellable.
 *
 * Paste a Cal.com link with payment enabled and a "Book and pay" button
 * appears on that service page. Clear it and the button disappears again.
 *
 * THIS ONE TAKES MONEY, so the screen says so rather than treating it as
 * another text field. Everything else in Admin Settings changes how the
 * site looks. This changes whether a stranger can be charged.
 *
 * It refuses anything that is not an https cal.com URL, matching the
 * button's own rule, so a mistyped value cannot become a live payment
 * link pointing somewhere unexpected.
 *
 * No em dashes in this file.
 */

const SETTING_KEY = 'booking_url_clarity_session';
const OFFER_LABEL = 'AI & Business Clarity Session';

const isCalLink = (raw: string): boolean => {
  try {
    const u = new URL(raw.trim());
    return u.protocol === 'https:' && /(^|\.)cal\.com$/.test(u.hostname);
  } catch {
    return false;
  }
};

const BookingLinkSetting = () => {
  const { roles, loading: rolesLoading } = useSecureUserRole();
  const { toast } = useToast();
  const isSuperAdmin = roles.includes('super_admin');

  const [stored, setStored] = useState('');
  const [draft, setDraft] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoadError(null);
    const { data, error } = await (supabase
      .from('site_settings' as any)
      .select('value')
      .eq('key', SETTING_KEY)
      .maybeSingle() as any);

    if (error) {
      setLoadError(error.message);
    } else if (data) {
      const v = (data as { value?: string }).value ?? '';
      setStored(v);
      setDraft(v);
    } else {
      // The row is seeded by migration. Absent means it has not run, and
      // saving would silently update nothing.
      setLoadError(
        'No booking link row exists yet. Run the site_settings and booking link migrations.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const changed = draft.trim() !== stored.trim();
  const live = stored.trim().length > 0;

  const save = async () => {
    if (saving) return;
    const next = draft.trim();

    if (next && !isCalLink(next)) {
      toast({
        title: 'That is not a Cal.com booking link',
        description: 'It must be an https link on cal.com, for example https://cal.com/your-name/your-session.',
        variant: 'destructive',
      });
      return;
    }

    if (next && !window.confirm(
      `This puts a "Book and pay" button on the ${OFFER_LABEL} page. Anyone can be charged from the moment you save.\n\nOnly continue if the payment provider can already pay out to your bank account.\n\nGo live?`
    )) {
      return;
    }

    setSaving(true);
    const { error } = await (supabase
      .from('site_settings' as any)
      .update({ value: next })
      .eq('key', SETTING_KEY) as any);
    setSaving(false);

    if (error) {
      toast({ title: 'Not saved', description: error.message, variant: 'destructive' });
      return;
    }

    setStored(next);
    toast({
      title: next ? 'Booking is live' : 'Booking switched off',
      description: next
        ? `The ${OFFER_LABEL} page now offers Book and pay.`
        : 'The button has been removed from the page.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5" />
          Paid booking: {OFFER_LABEL}
        </CardTitle>
        <CardDescription>
          A Cal.com link with payment enabled. Set it and the service page offers
          Book and pay. Leave it empty and no button appears.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loadError && (
          <ReadFailureNotice what="the booking link" reason={loadError} onRetry={load} />
        )}

        {!loading && !loadError && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {live ? (
                <Badge className="bg-green-100 text-green-800">Live, and taking payment</Badge>
              ) : (
                <Badge variant="secondary">Off, no button on the page</Badge>
              )}
            </div>

            {!live && (
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                Before filling this in, confirm your payment provider has passed
                identity verification and can actually pay out to a South African
                bank account. A link that collects money nobody can withdraw is
                worse than no link.
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="booking-url">Cal.com booking link</Label>
              <Input
                id="booking-url"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={!isSuperAdmin || rolesLoading}
                placeholder="https://cal.com/your-name/your-session"
              />
              {draft.trim() && !isCalLink(draft) && (
                <p className="text-xs text-red-700">
                  That is not an https cal.com link, so it will not be accepted.
                </p>
              )}
            </div>

            {isSuperAdmin ? (
              <div className="flex flex-wrap gap-2">
                <Button onClick={save} disabled={!changed || saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : draft.trim() ? 'Save and go live' : 'Save'}
                </Button>
                {live && (
                  <Button variant="outline" onClick={() => setDraft('')} disabled={saving}>
                    Clear, and remove the button
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You can see this, but not change it. Switching on a payment link is
                held to super admin.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingLinkSetting;
