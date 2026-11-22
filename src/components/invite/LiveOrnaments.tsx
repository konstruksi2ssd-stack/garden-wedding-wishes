/**
 * Self-moving 2D ornaments for the halaman inti: falling gold petals that flip in 3D space
 * and twinkling gold stars. Pure CSS loops (transform/opacity only) so they stay light on phones.
 * Positions come from a fixed pseudo-random sequence, so server and browser render the same markup.
 */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const r1 = (n: number) => Math.round(n * 10) / 10;
const FILLS = ["var(--royal-gold-light)", "var(--royal-gold)", "var(--cream)", "var(--royal-gold-deep)"];

export function PetalRain({ count = 8, seed = 0, className = "" }: { count?: number; seed?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, k) => {
        const i = k + seed * 31 + 1;
        const size = r1(9 + rnd(i) * 11);
        return (
          <div key={k} className="petal-lane" style={{ left: `${r1(rnd(i + 1) * 96)}%`, animationDuration: `${r1(12 + rnd(i + 2) * 10)}s`, animationDelay: `${r1(-rnd(i + 3) * 22)}s` }}>
            <div className="petal-sway" style={{ animationDuration: `${r1(3 + rnd(i + 4) * 3)}s`, ["--sway" as string]: `${Math.round(16 + rnd(i + 5) * 30)}px` }}>
              <svg viewBox="0 0 20 28" width={size} height={r1(size * 1.4)} className="petal-flip" style={{ animationDuration: `${r1(4 + rnd(i + 6) * 5)}s`, opacity: r1(0.5 + rnd(i + 7) * 0.45) }}>
                <path d="M10 0C17 7 19 16 10 28C1 16 3 7 10 0Z" fill={FILLS[i % FILLS.length]} />
                <path d="M10 4V24" stroke="var(--royal-wine)" strokeOpacity="0.35" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Twinkles({ count = 8, seed = 0, className = "" }: { count?: number; seed?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, k) => {
        const i = k + seed * 17 + 101;
        const s = Math.round(6 + rnd(i) * 9);
        return (
          <svg key={k} viewBox="0 0 20 20" width={s} height={s} className="twinkle absolute"
            style={{ left: `${r1(rnd(i + 1) * 94 + 2)}%`, top: `${r1(rnd(i + 2) * 90 + 4)}%`, animationDelay: `${r1(-rnd(i + 3) * 4)}s`, animationDuration: `${r1(2.6 + rnd(i + 4) * 2.4)}s` }}>
            <path d="M10 0L11.8 8.2L20 10L11.8 11.8L10 20L8.2 11.8L0 10L8.2 8.2Z" fill="var(--royal-gold-light)" />
          </svg>
        );
      })}
    </div>
  );
}
