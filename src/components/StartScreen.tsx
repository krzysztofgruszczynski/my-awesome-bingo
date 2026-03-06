import { questions } from '../data/questions';

interface StartScreenProps {
  onStart: () => void;
}

// Diagonal indices for the highlighted bingo line (top-left → bottom-right)
const DIAGONAL = new Set([0, 6, 12, 18, 24]);

// Per-card fan configuration: CSS custom property values + stagger delay
const CARD_CONFIG = [
  { rotate: '-3deg', tx: '8px', delay: '0.2s', zIndex: 1 },
  { rotate: '1deg', tx: '-4px', delay: '0.3s', zIndex: 3 },
  { rotate: '4deg', tx: '12px', delay: '0.4s', zIndex: 2 },
];

/** Fisher-Yates shuffle — returns a new shuffled array. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Computed once at module load — stable display values, not reactive state
const SAMPLE_QUESTIONS = shuffle(questions).slice(0, 3);

const _markedPool = Array.from({ length: 25 }, (_, i) => i).filter(
  (i) => !DIAGONAL.has(i) && i !== 12,
);
const MARKED_SQUARES = new Set(shuffle(_markedPool).slice(0, 5));

export function StartScreen({ onStart }: StartScreenProps) {

  return (
    <div className="min-h-full bg-cream overflow-y-auto">
      <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-6 py-10">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <div
          className="text-center mb-12"
          style={{ animation: 'fadeUp 0.5s ease both' }}
        >
          {/* Coffee cup + steam */}
          <div className="inline-block relative text-5xl mb-4 leading-none">
            <span
              className="absolute -top-5 left-1/2 flex gap-1.5 -translate-x-1/2 pointer-events-none"
              aria-hidden="true"
            >
              <span
                className="text-mocha text-sm"
                style={{ animation: 'steam 2.2s ease-in-out infinite', animationDelay: '0s' }}
              >
                〜
              </span>
              <span
                className="text-latte text-xs"
                style={{ animation: 'steam 2.2s ease-in-out infinite', animationDelay: '0.55s' }}
              >
                〜
              </span>
              <span
                className="text-mocha text-sm"
                style={{ animation: 'steam 2.2s ease-in-out infinite', animationDelay: '1.1s' }}
              >
                〜
              </span>
            </span>
            ☕
          </div>

          <h1
            className="font-display font-bold text-5xl md:text-6xl text-espresso leading-tight mb-3"
            style={{ animation: 'fadeUp 0.5s ease both', animationDelay: '0s' }}
          >
            Soc Ops
          </h1>
          <p
            className="font-body text-lg italic text-mocha"
            style={{ animation: 'fadeUp 0.5s ease both', animationDelay: '0.1s' }}
          >
            The social mixer bingo — find your people, one square at a time
          </p>
        </div>

        {/* ── Split Showcase ──────────────────────────────────────── */}
        <div className="md:grid md:grid-cols-2 gap-8 md:gap-12 mb-12">

          {/* Left: Question Preview Cards */}
          <div className="mb-10 md:mb-0">
            <p className="font-display text-mocha/70 text-sm mb-5 text-center md:text-left tracking-wide">
              Sample questions
            </p>
            {/* Fan container — fixed height to contain overlapping cards */}
            <div className="relative h-52">
              {SAMPLE_QUESTIONS.map((question, idx) => (
                <div
                  key={question}
                  className="absolute w-full bg-parchment rounded-2xl border border-mocha/15 shadow-md p-5"
                  style={
                    {
                      '--card-rotate': CARD_CONFIG[idx].rotate,
                      '--card-tx': CARD_CONFIG[idx].tx,
                      top: `${idx * 10}px`,
                      zIndex: CARD_CONFIG[idx].zIndex,
                      animation: 'cardFan 0.55s cubic-bezier(0.22,1,0.36,1) both',
                      animationDelay: CARD_CONFIG[idx].delay,
                    } as React.CSSProperties
                  }
                >
                  <p className="font-body text-roast text-sm md:text-base leading-snug">
                    "{question}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mini Bingo Grid */}
          <div
            className="text-center md:text-left"
            style={{ animation: 'fadeUp 0.5s ease both', animationDelay: '0.25s' }}
          >
            <p className="font-display text-mocha/70 text-sm mb-5 tracking-wide">
              How bingo works
            </p>
            <div
              className="inline-grid grid-cols-5 gap-1.5"
              style={{ animation: 'float 3.5s ease-in-out infinite', animationDelay: '0.8s' }}
            >
              {Array.from({ length: 25 }, (_, i) => {
                const isCenter = i === 12;
                const isDiag = DIAGONAL.has(i);
                const isMarked = MARKED_SQUARES.has(i);

                let cellClass =
                  'w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs font-display transition-colors';

                if (isDiag) {
                  cellClass +=
                    ' bg-accent border border-accent-light text-espresso font-bold';
                } else if (isMarked) {
                  cellClass += ' bg-marked border border-marked-border';
                } else {
                  cellClass += ' bg-parchment border border-mocha/15';
                }

                return (
                  <div
                    key={i}
                    className={cellClass}
                    style={
                      isDiag && !isCenter
                        ? { boxShadow: '0 0 6px 2px var(--color-accent-glow)' }
                        : undefined
                    }
                    aria-hidden="true"
                  >
                    {isCenter ? (
                      <span className="text-mocha font-display">☕</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <p className="font-body text-mocha/50 text-xs mt-4 leading-relaxed">
              Mark squares when you find a match.
              <br />
              Complete a line to win!
            </p>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div
          className="text-center"
          style={{ animation: 'fadeUp 0.5s ease both', animationDelay: '0.5s' }}
        >
          <button
            onClick={onStart}
            className="bg-accent text-espresso font-display font-bold text-xl py-4 px-14 rounded-full shadow-md active:scale-95 transition-transform"
            style={{
              backgroundImage:
                'linear-gradient(90deg, var(--color-accent), var(--color-accent-glow), var(--color-accent))',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            Start Game
          </button>
          <p className="font-body text-mocha/60 text-sm mt-4">
            {questions.length} questions · 5×5 board · find someone for each square
          </p>
        </div>

      </div>
    </div>
  );
}
