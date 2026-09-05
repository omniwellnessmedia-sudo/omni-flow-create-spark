import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Check, Mail, AlertCircle, Loader2 } from 'lucide-react';

/**
 * The page the unsubscribe link in every campaign footer points at.
 *
 * It did not exist. The footer link resolved to the not found page, so the
 * only working way off the list was to reply and ask. The link carries the
 * subscriber's id, which the sender writes into that recipient's copy of
 * the email, and that id is the whole authorisation: nobody is asked to
 * sign in, and no address is typed in here.
 *
 * The site footer is deliberately left off. It carries a Stay Connected
 * signup box, and offering that directly under "you are unsubscribed" is
 * not a thing to do to someone who just asked to be left alone.
 */

type State =
  | { kind: 'working' }
  | { kind: 'done' }
  | { kind: 'no_link' }
  | { kind: 'not_found' }
  | { kind: 'failed'; reason: string };

const Unsubscribe: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get('id');
  const [state, setState] = useState<State>({ kind: 'working' });

  useEffect(() => {
    if (!id) {
      setState({ kind: 'no_link' });
      return;
    }

    let cancelled = false;

    const run = async () => {
      const { data, error } = await supabase.rpc('unsubscribe_newsletter' as never, {
        subscriber_id: id,
      } as never);

      if (cancelled) return;

      if (error) {
        // Saying "you are unsubscribed" over a failed write would be the
        // worst outcome here: the person stops watching and the mail keeps
        // arriving.
        setState({ kind: 'failed', reason: error.message });
        return;
      }

      const status = (data as { status?: string } | null)?.status;
      setState(status === 'unsubscribed' ? { kind: 'done' } : { kind: 'not_found' });
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <UnifiedNavigation />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container-width section-large">
          <div className="max-w-xl mx-auto">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              {state.kind === 'working' && (
                <>
                  <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
                  <h1 className="text-2xl font-bold">Removing you from the list</h1>
                  <p className="mt-2 text-muted-foreground">One moment.</p>
                </>
              )}

              {state.kind === 'done' && (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-7 w-7 text-green-700" />
                  </div>
                  <h1 className="text-2xl font-bold">You are unsubscribed</h1>
                  <p className="mt-3 text-muted-foreground">
                    You will not receive further newsletters from us. A campaign already
                    in the middle of sending may still reach you once.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    This does not cancel bookings, orders or account email, which are
                    sent because of something you asked us to do.
                  </p>
                </>
              )}

              {state.kind === 'not_found' && (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <Mail className="h-7 w-7 text-amber-700" />
                  </div>
                  <h1 className="text-2xl font-bold">Nothing to remove</h1>
                  <p className="mt-3 text-muted-foreground">
                    This link does not match a current subscription. If you are still
                    receiving newsletters, forward one to{' '}
                    <a className="underline" href="mailto:hello@omniwellnessmedia.com">
                      hello@omniwellnessmedia.com
                    </a>{' '}
                    and we will take the address off by hand.
                  </p>
                </>
              )}

              {state.kind === 'no_link' && (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <Mail className="h-7 w-7 text-amber-700" />
                  </div>
                  <h1 className="text-2xl font-bold">This link is incomplete</h1>
                  <p className="mt-3 text-muted-foreground">
                    Unsubscribe links are personal to one address, so this page needs the
                    full link from the footer of the email. Open the newsletter again and
                    use the Unsubscribe link there, or email{' '}
                    <a className="underline" href="mailto:hello@omniwellnessmedia.com">
                      hello@omniwellnessmedia.com
                    </a>
                    .
                  </p>
                </>
              )}

              {state.kind === 'failed' && (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-7 w-7 text-red-700" />
                  </div>
                  <h1 className="text-2xl font-bold">We could not complete that</h1>
                  <p className="mt-3 text-muted-foreground">
                    You are still subscribed. Please try the link again, or email{' '}
                    <a className="underline" href="mailto:hello@omniwellnessmedia.com">
                      hello@omniwellnessmedia.com
                    </a>{' '}
                    and we will remove you.
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">{state.reason}</p>
                  <Button className="mt-5" onClick={() => window.location.reload()}>
                    Try again
                  </Button>
                </>
              )}

              <p className="mt-6 text-sm text-muted-foreground">
                How we handle your data is set out in our{' '}
                <Link to="/privacy-policy" className="underline">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
