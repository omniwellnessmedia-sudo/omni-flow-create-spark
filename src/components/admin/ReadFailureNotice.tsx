import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * "We could not read this", said where the data would have been.
 *
 * WHY THIS EXISTS. The admin audit of 5 September 2026 found the same defect
 * on nine screens: a failed Supabase read left the state array at [] and the
 * screen rendered its empty state, so "the database refused us" and "you have
 * nothing here" were indistinguishable. On the product curation screen that
 * reads as "nothing to approve", on the payouts queue as "nobody is owed
 * money", and on the events desk as "no events". Each of those is a decision
 * an operator might act on.
 *
 * The Supabase client reports query errors in `error` and does NOT throw, so
 * a try/catch around a query does not see an RLS denial. Every caller must
 * inspect the error field and pass its message here.
 *
 * The message is shown verbatim, because the operator's job is to send it to
 * whoever can act on it, and a paraphrase loses the part that identifies the
 * cause.
 *
 * No em dashes in this file.
 */

interface ReadFailureNoticeProps {
  /** What could not be read, in the operator's words. */
  what: string;
  /** The database's own message. */
  reason: string;
  /** Optional retry, when the caller has a reload to offer. */
  onRetry?: () => void;
}

const ReadFailureNotice = ({ what, reason, onRetry }: ReadFailureNoticeProps) => (
  <Card className="border-amber-300 bg-amber-50">
    <CardContent className="py-4">
      <p className="flex items-center gap-2 text-sm font-medium text-amber-900">
        <AlertTriangle className="h-4 w-4" />
        Could not load {what}
      </p>
      <p className="mt-1 text-sm text-amber-900">
        This is not the same as having none. Nothing below is a complete picture.
        Usually the database refused the request for the account you are signed in
        with. Send this to Tumelo as it is written:
      </p>
      <p
        className="mt-2 text-xs text-amber-900"
        style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
      >
        {reason}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-amber-400 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
        >
          Try again
        </button>
      )}
    </CardContent>
  </Card>
);

export default ReadFailureNotice;
