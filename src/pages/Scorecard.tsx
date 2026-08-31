import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, ArrowLeft, Check, Loader2, RotateCcw } from 'lucide-react';
import {
  QUESTIONS, DIMENSIONS, scoreAnswers, MAX_SCORE, type Dimension,
} from '@/data/scorecard';
import { getOffer } from '@/data/publicRateCard';
import { useSEO } from '@/lib/seo';

/**
 * The free Revenue Readiness Scorecard.
 *
 * THE RESULT IS NOT GATED. The full score, the breakdown and the
 * recommendations appear the moment the last question is answered. The email
 * form sits underneath, offering to send it and to have someone read it back.
 *
 * That is a deliberate conversion decision, not generosity. Gating a result
 * someone has just earned is the move that makes people distrust these tools,
 * and it converts worse: a person looking at a useful answer has a reason to
 * give an address, and a person looking at a wall does not. It also means the
 * page is worth linking to and worth ranking for, which a gated page is not.
 *
 * Every recommendation points at a real offer on the rate card by slug, and
 * carries no price of its own. Prices are read from publicRateCard.ts.
 *
 * No em dashes in this file.
 */

const Scorecard = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useSEO({
    title: 'Free Revenue Readiness Scorecard | Omni Wellness Media',
    description:
      'Ten questions on your offer, website, content, route to payment and measurement. See your score and what to fix first. No email needed to see the result.',
    canonical: 'https://omniwellnessmedia.co.za/scorecard',
  });

  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const answered = Object.keys(answers).length;
  const q = QUESTIONS[step];

  const choose = (idx: number) => {
    const next = { ...answers, [q.id]: idx };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else setShowResult(true);
  };

  const sendResult = async () => {
    if (!email.trim()) return;
    setSending(true);
    setSendError(null);

    const lines = result.byDimension
      .map((d) => `${DIMENSIONS[d.dimension].label}: ${d.score} of ${d.max}`)
      .join('\n');
    const recs = result.recommendedSlugs
      .map((s) => getOffer(s)?.name)
      .filter(Boolean)
      .join(', ');

    const { error } = await supabase.functions.invoke('submit-contact', {
      body: {
        name: name.trim() || 'Scorecard result',
        email: email.trim(),
        service: 'revenue-readiness-scorecard',
        message:
          `Revenue Readiness Scorecard result\n\n` +
          `Score: ${result.total} of ${result.max} (${result.percent}%)\n` +
          `Band: ${result.band.label}\n\n${lines}\n\n` +
          `Suggested next steps: ${recs || 'none'}`,
      },
    });

    setSending(false);
    // A failure here is reported. A lead magnet that silently drops the
    // address is worse than one that never asked.
    if (error) setSendError('We could not send it just now. Please try again.');
    else setSent(true);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setShowResult(false);
    setSent(false);
    setSendError(null);
  };

  return (
    <>
      <UnifiedNavigation />

      <main style={{ background: '#FAF8F2' }}>
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p
            className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
            style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
          >
            <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-[#4FAE3F]" />
            Free tool
          </p>
          <h1 className="mt-3 font-wwpl-display text-4xl font-medium md:text-5xl">
            Revenue Readiness Scorecard
          </h1>

          {!showResult ? (
            <>
              <p className="mt-4 max-w-[60ch] text-lg text-muted-foreground">
                Ten questions on your offer, your website, your content, your route to
                payment and your measurement. Two minutes, and you see the result straight
                away. No email needed.
              </p>

              <div className="mt-8">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Question {step + 1} of {QUESTIONS.length}
                  </span>
                  <span>{DIMENSIONS[q.dimension].label}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((step + (answers[q.id] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100}%`,
                      background: DIMENSIONS[q.dimension].hue,
                    }}
                  />
                </div>
              </div>

              <Card className="mt-6">
                <CardContent className="py-7">
                  <h2 className="font-wwpl-display text-2xl font-medium leading-snug">
                    {q.question}
                  </h2>
                  {q.help && (
                    <p className="mt-2 text-sm text-muted-foreground">{q.help}</p>
                  )}
                  <div className="mt-6 space-y-2.5">
                    {q.options.map((o, i) => (
                      <button
                        key={o.label}
                        onClick={() => choose(i)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-[15px] transition-colors hover:border-foreground/30 ${
                          answers[q.id] === i ? 'bg-muted font-medium' : ''
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-[10px] w-[10px] shrink-0 rounded-full border"
                          style={
                            answers[q.id] === i
                              ? { background: DIMENSIONS[q.dimension].hue, borderColor: DIMENSIONS[q.dimension].hue }
                              : undefined
                          }
                        />
                        {o.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                    >
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
                    </Button>
                    {answered === QUESTIONS.length && (
                      <Button size="sm" onClick={() => setShowResult(true)}>
                        See my result <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="mt-8 rounded-2xl p-8" style={{ background: '#15201F' }}>
                <p
                  className="text-[10px] uppercase tracking-[.2em]"
                  style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', color: '#8A9A96' }}
                >
                  Your score
                </p>
                <p className="mt-2 font-wwpl-display text-6xl font-medium" style={{ color: result.band.hue }}>
                  {result.total}
                  <span className="text-3xl" style={{ color: '#8A9A96' }}> of {MAX_SCORE}</span>
                </p>
                <p className="mt-3 font-wwpl-display text-2xl" style={{ color: '#FAF8F2' }}>
                  {result.band.label}
                </p>
                <p className="mt-3 max-w-[58ch] text-sm" style={{ color: '#B9C6C2' }}>
                  {result.band.verdict}
                </p>
              </div>

              <section className="mt-10">
                <h2 className="font-wwpl-display text-2xl font-medium">Where you stand</h2>
                <div className="mt-4 space-y-3">
                  {result.byDimension.map((d) => {
                    const meta = DIMENSIONS[d.dimension as Dimension];
                    const pct = d.max ? (d.score / d.max) * 100 : 0;
                    return (
                      <div key={d.dimension}>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-medium">{meta.label}</span>
                          <span className="text-muted-foreground">
                            {d.score} of {d.max}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: meta.hue }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{meta.blurb}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {result.recommendedSlugs.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-wwpl-display text-2xl font-medium">What to fix first</h2>
                  <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
                    In order, weakest first. These are the things on our rate card that
                    address what you answered, not everything we sell.
                  </p>
                  <div className="mt-5 space-y-3">
                    {result.recommendedSlugs.map((slug, i) => {
                      const offer = getOffer(slug);
                      if (!offer) return null;
                      return (
                        <Link key={slug} to={`/services/${slug}`}>
                          <Card className="transition-colors hover:border-foreground/20">
                            <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
                              <div className="min-w-[220px] flex-1">
                                <p
                                  className="text-[10px] uppercase tracking-[.18em] text-muted-foreground"
                                  style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                                >
                                  Step {i + 1}
                                </p>
                                <p className="mt-1 text-[16px] font-medium">{offer.name}</p>
                                <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
                                  {offer.blurb}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium" style={{ color: offer.hue }}>
                                  {offer.price}
                                </p>
                                <span className="mt-1 inline-flex items-center gap-1.5 text-sm">
                                  See details <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="mt-12 rounded-2xl border p-7">
                {sent ? (
                  <div className="text-center">
                    <Check className="mx-auto h-7 w-7 text-[#4FAE3F]" />
                    <p className="mt-3 font-wwpl-display text-xl">On its way</p>
                    <p className="mx-auto mt-1 max-w-[46ch] text-sm text-muted-foreground">
                      We will send the result through and someone will read it back to you
                      if you would like.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-wwpl-display text-2xl font-medium">
                      Want this emailed, with a read back?
                    </h2>
                    <p className="mt-2 max-w-[58ch] text-sm text-muted-foreground">
                      You already have the result. If it is useful, we will send you a copy
                      and one of us will go through it with you at no charge.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm">Your name</Label>
                        <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-sm">Your email</Label>
                        <Input
                          className="mt-1.5"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    {sendError && <p className="mt-3 text-sm text-amber-800">{sendError}</p>}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button onClick={sendResult} disabled={sending || !email.trim()}>
                        {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send it to me
                      </Button>
                      <Button variant="outline" onClick={reset}>
                        <RotateCcw className="mr-2 h-4 w-4" /> Start again
                      </Button>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      We use your address for this result and nothing else.
                    </p>
                  </>
                )}
              </section>

              <div className="mt-10 text-center">
                <Link to="/services" className="text-sm underline-offset-4 hover:underline">
                  See everything on the rate card
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Scorecard;
