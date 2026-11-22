import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import { wishesQuery, type Wish } from "@/lib/wishes";
import { ringOffset } from "@/lib/wish-rules";
import { WishStats } from "./WishWall";

const EASE = [0.22, 1, 0.36, 1] as const;
const TONES = ["card-royal-sage", "card-royal-wine", "card-royal-navy"] as const;
/** cards rendered on each side of the active one; the rest of the ring is off-stage */
const SIDE = 3;
const fmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

function Card3D({ w, i, d, onPick }: { w: Wish; i: number; d: number; onPick: () => void }) {
  const a = Math.abs(d);
  const front = d === 0;
  return (
    <motion.article
      aria-hidden={!front}
      onClick={front ? undefined : onPick}
      initial={false}
      animate={{
        x: `${d * 64}%`,
        z: -a * 170,
        rotateY: -d * 34,
        scale: 1 - a * 0.05,
        opacity: a >= SIDE ? 0 : 1 - a * 0.22,
      }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ zIndex: 20 - a }}
      className={`${TONES[i % TONES.length]} wish-card-3d absolute left-1/2 top-0 -ml-[8rem] flex h-[22rem] w-[16rem] flex-col p-5 text-left sm:-ml-[9.5rem] sm:h-[24rem] sm:w-[19rem] ${front ? "" : "cursor-pointer"}`}
    >
      <div className="pointer-events-none absolute inset-2 rounded-[0.8rem] border border-royal-gold/30" />
      <Quote className="h-6 w-6 shrink-0 text-royal-gold" aria-hidden />
      <p className={`page-scroll mt-2 min-h-0 flex-1 whitespace-pre-line break-words pr-1 font-display text-[1.02rem] italic leading-relaxed text-ivory/95 sm:text-lg ${front ? "overflow-y-auto" : "overflow-hidden"}`}>
        {w.message}
      </p>
      <div className="mt-3 shrink-0 border-t border-royal-gold/30 pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-display text-lg font-semibold text-royal-gold">{w.name}</p>
          <span className="shrink-0 rounded-full border border-royal-gold/40 px-2 py-0.5 font-caps text-[9px] tracking-widest text-cream/80">{w.attend.toUpperCase()}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-cream/60">{fmt.format(new Date(w.created_at))}</p>
      </div>
    </motion.article>
  );
}

/** "Untaian Ucapan & Doa": every guest wish on a looping 3D card ring — swipe, tap a side card, or use the controls. */
export function WishCarousel3D() {
  const { data: wishes = [], isLoading, isError } = useQuery(wishesQuery);
  const n = wishes.length;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (active >= n && n > 0) setActive(0);
  }, [active, n]);

  const go = useCallback((step: number) => {
    if (n > 0) setActive((a) => (a + step + n) % n);
  }, [n]);

  useEffect(() => {
    if (paused || hover || reduce || n < 2) return;
    const t = setInterval(() => {
      if (!document.hidden) go(1);
    }, 5200);
    return () => clearInterval(t);
  }, [paused, hover, reduce, n, go]);

  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40) go(1);
    else if (info.offset.x > 40) go(-1);
  };

  if (isLoading) return <p className="text-sm text-cream/70">Memuat ucapan…</p>;
  if (isError) return <p className="font-display text-base italic text-cream/75">Ucapan belum bisa dimuat.</p>;
  if (!n)
    return (
      <div className="glass-garden mx-auto max-w-xs rounded-2xl border border-royal-gold/40 px-6 py-10">
        <Quote className="mx-auto h-7 w-7 text-royal-gold" aria-hidden />
        <p className="mt-3 font-display text-lg italic text-ivory/90">Belum ada ucapan. Jadilah yang pertama mengirim doa untuk kedua mempelai.</p>
      </div>
    );

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <WishStats wishes={wishes} />

      <motion.div
        className="stage-3d relative mx-auto mt-10 h-[23.5rem] w-full select-none sm:h-[25.5rem]"
        style={{ touchAction: "pan-y" }}
        onPanEnd={onPanEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Kartu ucapan dan doa dari para tamu"
      >
        <div className="preserve-3d absolute inset-0">
          {wishes.map((w, i) => {
            const d = ringOffset(i, active, n);
            if (Math.abs(d) > SIDE) return null;
            return <Card3D key={w.id} w={w} i={i} d={d} onPick={() => setActive(i)} />;
          })}
        </div>
        {/* soft floor reflection under the ring */}
        <div className="pointer-events-none absolute -bottom-1 left-1/2 h-6 w-64 -translate-x-1/2 rounded-[50%] bg-royal-sage-deep/70 blur-md" aria-hidden />
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={() => go(-1)} disabled={n < 2} className="btn-outline-gold h-10 w-10 disabled:opacity-40" aria-label="Ucapan sebelumnya">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-[5.5rem] font-caps text-sm tracking-[0.2em] text-royal-gold-light" aria-live="polite">
          {active + 1} / {n}
        </p>
        <button type="button" onClick={() => go(1)} disabled={n < 2} className="btn-outline-gold h-10 w-10 disabled:opacity-40" aria-label="Ucapan berikutnya">
          <ChevronRight className="h-5 w-5" />
        </button>
        {n > 1 && (
          <button type="button" onClick={() => setPaused((p) => !p)} className="btn-outline-gold h-10 w-10" aria-label={paused ? "Putar otomatis" : "Jeda putar otomatis"}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        )}
      </div>
      {n > 6 && (
        <input
          type="range"
          min={1}
          max={n}
          value={active + 1}
          onChange={(e) => setActive(Number(e.target.value) - 1)}
          className="range-gold mx-auto mt-4 block w-full max-w-xs"
          aria-label="Pilih nomor ucapan"
        />
      )}
      <p className="mt-3 text-[11px] text-cream/65">Geser kartu atau ketuk kartu di samping untuk membaca ucapan lainnya.</p>
    </div>
  );
}
