import { questions } from "../data/questions";

interface StartScreenProps {
  onStart: () => void;
}

// Fixed indices for the decorative backdrop grid
const MARKED_INDICES = [1, 6, 13, 17, 21, 23];
const DIAGONAL_INDICES = [4, 8, 12, 16, 20]; // anti-diagonal highlight
const CENTER_INDEX = 12;

const CARD_CONFIGS = [
  { rotate: "-6deg", offsetX: "-90px", z: 10, floatDuration: "2.5s", fanDelay: "0.4s" },
  { rotate: "2deg",  offsetX: "0px",   z: 20, floatDuration: "3s",   fanDelay: "0.55s" },
  { rotate: "5deg",  offsetX: "90px",  z: 10, floatDuration: "3.5s", fanDelay: "0.7s" },
] as const;

// Computed once at module load — stable across re-renders (Fisher-Yates shuffle)
function pickRandom(arr: string[], n: number): string[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
const previewQuestions = pickRandom(questions, 3);

export function StartScreen({ onStart }: StartScreenProps) {

  return (
    <div className="relative min-h-dvh bg-cream overflow-hidden flex flex-col items-center justify-center">

      {/* ── Layer 1: atmospheric backdrop grid ──────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ animation: "gridReveal 0.8s ease-out both" }}
      >
        <div
          className="grid grid-cols-5 gap-2 md:gap-3 opacity-[0.08] md:opacity-[0.12]"
          style={{ animation: "float 6s ease-in-out 0.8s infinite" }}
        >
          {Array.from({ length: 25 }, (_, i) => {
            const isMarked   = MARKED_INDICES.includes(i);
            const isDiagonal = DIAGONAL_INDICES.includes(i);
            const isCenter   = i === CENTER_INDEX;

            const squareCls = isMarked
              ? "bg-marked/40 border border-marked-border/30"
              : isDiagonal
                ? "bg-accent/20 border border-accent/10"
                : "bg-mocha/20 border border-mocha/10";

            return (
              <div
                key={i}
                className={`w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl flex items-center justify-center ${squareCls}`}
              >
                {isCenter && (
                  <span className="text-2xl md:text-3xl lg:text-4xl select-none">☕</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Layer 2: content overlay ─────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full gap-10 md:gap-14 px-6 py-12">

        {/* Hero ──────────────────────────────────────────────────── */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: "fadeUp 0.5s ease-out 0.1s both" }}
        >
          {/* Coffee cup + steam wisps */}
          <div className="relative inline-block mb-1">
            <span
              className="steam-wisp steam-wisp-1 absolute text-mocha/50 text-base select-none"
              style={{ left: "14px", top: "-18px" }}
            >〜</span>
            <span
              className="steam-wisp steam-wisp-2 absolute text-mocha/40 text-lg select-none"
              style={{ left: "50%", top: "-22px", transform: "translateX(-50%)" }}
            >〜</span>
            <span
              className="steam-wisp steam-wisp-3 absolute text-mocha/50 text-base select-none"
              style={{ right: "14px", top: "-18px" }}
            >〜</span>
            <span className="text-7xl md:text-8xl" role="img" aria-label="coffee cup">☕</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold text-espresso leading-none tracking-tight">
            Soc Ops
          </h1>
          <p className="font-body text-xl md:text-2xl italic text-mocha">
            The social mixer bingo
          </p>
          <p className="font-body text-base text-mocha/70">
            Find your people, one square at a time
          </p>
        </div>

        {/* Floating question cards ───────────────────────────────── */}
        <div className="relative w-full h-52 md:h-64 flex items-center justify-center">
          {previewQuestions.map((question, i) => {
            const cfg = CARD_CONFIGS[i];
            const floatStart = `${parseFloat(cfg.fanDelay) + 0.6}s`;

            return (
              <div
                key={i}
                className="absolute bg-parchment/95 backdrop-blur-sm rounded-2xl border border-mocha/20 shadow-lg p-4 md:p-6 w-40 md:w-52"
                style={{
                  rotate: cfg.rotate,
                  transform: `translateX(${cfg.offsetX})`,
                  zIndex: cfg.z,
                  animation: `cardFan 0.6s ease-out ${cfg.fanDelay} both, float ${cfg.floatDuration} ease-in-out ${floatStart} infinite`,
                } as React.CSSProperties}
              >
                <p className="font-body text-roast text-sm md:text-base leading-snug">
                  {question}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA ───────────────────────────────────────────────────── */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: "fadeUp 0.5s ease-out 0.8s both" }}
        >
          <span className="text-mocha/30 text-xs select-none tracking-widest">▲</span>
          <button
            onClick={onStart}
            className="font-display font-bold rounded-full text-xl md:text-2xl px-10 py-4 shadow-lg text-espresso cursor-pointer"
            style={{
              background: `linear-gradient(90deg, var(--color-accent), var(--color-accent-light), var(--color-accent-glow), var(--color-accent-light), var(--color-accent))`,
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Start Game
          </button>
          <p className="font-body text-mocha/50 text-sm">
            {questions.length} questions · 5×5 board · mingle &amp; match
          </p>
        </div>

      </div>
    </div>
  );
}

