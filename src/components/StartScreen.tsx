import { useMemo } from 'react';
import { questions } from '../data/questions';

interface StartScreenProps {
  onStart: () => void;
}

/** Pick n random items from an array (computed once per mount). */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let currentIndex = copy.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
  }
  return copy.slice(0, n);
}

/** Configuration for the 5×5 background mini grid. */
const GRID_CELLS = Array.from({ length: 25 }, (_, i) => {
  const row = Math.floor(i / 5);
  const col = i % 5;
  return {
    i,
    isCenter: row === 2 && col === 2,
    isDiagonal: row === col, // top-left → bottom-right
    isMarked: [1, 7, 16, 23].includes(i),
  };
});

const CARD_ROTATIONS = ['-8deg', '0deg', '8deg'] as const;
const CARD_TRANSLATE_X = ['-4.5rem', '0', '4.5rem'] as const;
const CARD_Z = [1, 3, 2] as const;

/** Returns the Tailwind class string for a mini-grid cell. */
function getGridCellClassName(isCenter: boolean, isMarked: boolean, isDiagonal: boolean): string {
  const base = 'w-6 h-6 md:w-8 md:h-8 rounded-sm border flex items-center justify-center text-xs';
  if (isCenter) return `${base} bg-latte/70 border-mocha/40`;
  if (isMarked) return `${base} bg-marked border-marked-border/50`;
  if (isDiagonal) return `${base} bg-accent/30 border-accent/20`;
  return `${base} bg-parchment border-mocha/20`;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const previewCards = useMemo(() => pickRandom(questions, 3), []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-full p-6 overflow-hidden bg-cream">
      {/* Warm gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-latte/8 via-cream to-cream pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-14 w-full max-w-md md:max-w-2xl mx-auto">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div
          className="text-center animate-fadeUp"
        >
          {/* Steam wisps */}
          <div className="flex justify-center gap-2.5 h-7 mb-0.5" aria-hidden="true">
            {[0, 0.35, 0.7].map((delay, i) => (
              <div
                key={i}
                className="w-0.5 h-5 rounded-full bg-latte/60 animate-steam"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>

          {/* Coffee cup */}
          <div className="text-5xl md:text-6xl leading-none mb-4" role="img" aria-label="Coffee cup">
            ☕
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-espresso tracking-tight leading-none mb-3">
            Soc Ops
          </h1>
          <p className="font-body text-lg italic text-mocha max-w-xs md:max-w-sm mx-auto leading-snug">
            The social mixer bingo — find your people, one square at a time
          </p>
        </div>

        {/* ── Card Stack + Mini Grid ───────────────────────────────── */}
        <div className="relative w-full animate-float">
          {/* Background mini bingo grid */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-15 md:opacity-20 pointer-events-none animate-fadeUp [animation-delay:0.4s]"
            aria-hidden="true"
          >
            <div className="grid grid-cols-5 gap-1.5 md:gap-2">
              {GRID_CELLS.map(({ i, isCenter, isDiagonal, isMarked }) => (
                <div
                  key={i}
                  className={getGridCellClassName(isCenter, isMarked, isDiagonal)}
                >
                  {isCenter && <span>☕</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Fanned card stack */}
          <div className="relative z-10 flex items-center justify-center py-10 md:py-14">
            {previewCards.map((question, idx) => (
              /* Wrapper handles horizontal offset; inner card handles the cardFan
                 animation so that translateX is not overridden by fill-mode: both. */
              <div
                key={idx}
                className="absolute"
                style={{
                  transform: `translateX(${CARD_TRANSLATE_X[idx]})`,
                  zIndex: CARD_Z[idx],
                }}
              >
                <div
                  className="bg-parchment rounded-2xl border border-mocha/15 shadow-md p-5 md:p-6 w-44 md:w-60 animate-cardFan"
                  style={
                    {
                      '--card-rotate': CARD_ROTATIONS[idx],
                      animationDelay: `${0.15 + idx * 0.1}s`,
                    } as React.CSSProperties
                  }
                >
                  <p className="font-body text-roast text-sm md:text-base leading-snug">
                    {question}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-sm border border-mocha/25 bg-latte/25 shrink-0" />
                    <span className="font-body text-xs text-mocha/55 italic">find someone who…</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Spacer so the container has height */}
            <div className="invisible w-44 md:w-60 h-28 md:h-36" aria-hidden="true" />
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div
          className="flex flex-col items-center gap-3 w-full animate-fadeUp [animation-delay:0.5s]"
        >
          <button
            onClick={onStart}
            className="btn-shimmer relative w-full max-w-xs text-espresso font-display font-bold py-4 px-8 rounded-full text-2xl shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            Start Game
          </button>
          <p className="font-body text-mocha/60 text-sm text-center">
            24 questions · 5×5 board · find someone for each square
          </p>
        </div>
      </div>
    </div>
  );
}
