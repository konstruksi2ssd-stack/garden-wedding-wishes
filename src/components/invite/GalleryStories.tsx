import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Pointer, X } from "lucide-react";
import { GALLERY_STORIES, type GalleryStory } from "@/lib/gallery";
import { FiligreeDivider } from "./Ornaments";

const EASE = [0.22, 1, 0.36, 1] as const;
const N = GALLERY_STORIES.length;
const num = (i: number) => String(i + 1).padStart(2, "0");

/** Galeri berkisah: 8 photo tiles; tapping one opens its photo with the story behind it. */
export function GalleryStories() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + N) % N)), []);
  return (
    <>
      <motion.p
        className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-royal-gold/50 bg-night/40 px-4 py-2 text-xs text-cream/90 sm:text-sm"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Pointer className="tap-wiggle h-4 w-4 text-royal-gold-light" aria-hidden />
        Sentuh setiap foto untuk membaca kisahnya
      </motion.p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {GALLERY_STORIES.map((p, i) => (
          <Tile key={p.id} p={p} i={i} onOpen={() => setOpen(i)} />
        ))}
      </div>

      <AnimatePresence>{open !== null && <StoryViewer key="viewer" index={open} onClose={close} onGo={go} onPick={setOpen} />}</AnimatePresence>
    </>
  );
}

function Tile({ p, i, onOpen }: { p: GalleryStory; i: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Baca kisah foto ${i + 1}: ${p.title}`}
      initial={{ opacity: 0, y: 26, rotate: i % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, delay: (i % 4) * 0.08, ease: EASE }}
      whileHover={{ y: -5, rotate: 0, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="group relative rounded-xl border border-royal-gold/60 bg-night/60 p-1 text-left shadow-[0_14px_28px_-14px_oklch(0.1_0.03_260/0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-gold"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/95 via-night/25 to-transparent" />
        <span className="absolute left-2 top-2 rounded-full border border-royal-gold/60 bg-night/60 px-2 py-0.5 font-caps text-[9px] tracking-widest text-royal-gold-light">{num(i)}</span>
        {i === 0 && <span className="tap-ring absolute right-3 top-3 h-3 w-3 rounded-full bg-royal-gold" aria-hidden />}
        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
          <p className="font-display text-[0.95rem] font-semibold leading-tight text-ivory sm:text-base">{p.title}</p>
          <span className="chip-glow mt-1.5 inline-flex items-center gap-1 rounded-full bg-royal-gold px-2.5 py-0.5 font-caps text-[9px] font-semibold tracking-wider text-royal-navy" style={{ animationDelay: `${-i * 0.35}s` }}>
            <BookOpen className="h-3 w-3" aria-hidden /> BACA KISAH
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function StoryViewer({ index, onClose, onGo, onPick }: { index: number; onClose: () => void; onGo: (d: number) => void; onPick: (i: number) => void }) {
  const p = GALLERY_STORIES[index];
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onGo(1);
      if (e.key === "ArrowLeft") onGo(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [onClose, onGo]);
  if (!p) return null;
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Kisah foto: ${p.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 30, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.97 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative flex max-h-[94svh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-royal-gold/50 bg-royal-wine shadow-[0_30px_60px_-20px_oklch(0.08_0.03_260/0.95)] md:max-w-4xl md:flex-row"
      >
        <button onClick={onClose} aria-label="Tutup cerita" className="absolute right-3 top-3 z-20 rounded-full border border-royal-gold/60 bg-night/70 p-1.5 text-ivory transition-colors hover:bg-night">
          <X className="h-4 w-4" />
        </button>

        <div className="relative h-[46svh] shrink-0 overflow-hidden bg-night md:h-[80vh] md:w-[55%]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={p.id}
              src={p.src}
              alt={p.alt}
              draggable={false}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) onGo(1);
                else if (info.offset.x > 60) onGo(-1);
              }}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-royal-wine to-transparent md:hidden" />
          <button onClick={() => onGo(-1)} aria-label="Foto sebelumnya" className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-royal-gold/50 bg-night/60 p-2 text-ivory hover:bg-night">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => onGo(1)} aria-label="Foto berikutnya" className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-royal-gold/50 bg-night/60 p-2 text-ivory hover:bg-night">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="page-scroll flex flex-1 flex-col overflow-y-auto p-5 text-center md:justify-center md:p-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <p className="font-caps text-[10px] uppercase tracking-[0.32em] text-royal-gold-light/80">
                Kisah {index + 1} dari {N} · {p.date}
              </p>
              <h3 className="mt-2 font-script text-[2.4rem] leading-tight text-royal-gold md:text-5xl">{p.title}</h3>
              <FiligreeDivider className="glint mx-auto mt-1 opacity-90" style={{ height: 20, width: 170 }} />
              <p className="mt-4 font-display text-[1.05rem] leading-relaxed text-cream/90 md:text-lg">{p.story}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex justify-center gap-1.5" role="tablist" aria-label="Pilih kisah">
            {GALLERY_STORIES.map((s, i) => (
              <button key={s.id} role="tab" aria-selected={i === index} aria-label={`Kisah ${i + 1}: ${s.title}`} onClick={() => onPick(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-royal-gold" : "w-1.5 bg-cream/35 hover:bg-cream/60"}`} />
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => onGo(-1)} className="btn-outline-gold flex-1 py-2.5 text-xs">Sebelumnya</button>
            <button onClick={() => onGo(1)} className="btn-gold flex-1 py-2.5 text-xs">Kisah Berikutnya</button>
          </div>
          <p className="mt-3 text-[11px] italic text-cream/55">Geser foto ke kiri atau kanan untuk berpindah kisah</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
