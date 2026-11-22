import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircleHeart, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { wishesQuery, type Wish } from "@/lib/wishes";
import { attendingCount, mergeWish } from "@/lib/wish-rules";
import { WEDDING } from "@/lib/wedding";
import { FiligreeDivider } from "./Ornaments";
import { PetalRain, Twinkles } from "./LiveOrnaments";

const EASE = [0.22, 1, 0.36, 1] as const;
const fmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" });

/** Keeps the shared wishes list live: new wishes from any guest appear without a reload. */
export function useLiveWishes() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel(`wishes-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "wishes" }, (payload) => {
        qc.setQueryData<Wish[]>(wishesQuery.queryKey, (old) => mergeWish(old, payload.new as Wish));
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
}

export function WishStats({ wishes }: { wishes: Wish[] }) {
  return (
    <div className="mx-auto grid max-w-sm grid-cols-2 gap-3">
      <div className="card-royal-wine px-3 py-3">
        <MessageCircleHeart className="mx-auto h-5 w-5 text-royal-gold" aria-hidden />
        <p className="mt-1 font-display text-2xl font-semibold text-royal-gold">{wishes.length}</p>
        <p className="font-caps text-[9px] tracking-widest text-cream/75">UCAPAN & DOA</p>
      </div>
      <div className="card-royal-navy px-3 py-3">
        <Users className="mx-auto h-5 w-5 text-royal-gold" aria-hidden />
        <p className="mt-1 font-display text-2xl font-semibold text-royal-gold">{attendingCount(wishes)}</p>
        <p className="font-caps text-[9px] tracking-widest text-cream/75">AKAN HADIR</p>
      </div>
    </div>
  );
}

export function WishCard({ w, i, highlight = false }: { w: Wish; i: number; highlight?: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.05, ease: EASE }}
      className={`${i % 3 === 1 ? "card-royal-navy" : "card-royal-wine"} relative min-w-0 p-4 text-left ${highlight ? "ring-2 ring-royal-gold" : ""}`}
    >
      {highlight && <span className="absolute -top-2.5 right-3 rounded-full bg-royal-gold px-2 py-0.5 font-caps text-[9px] font-semibold tracking-wider text-royal-navy">UCAPAN ANDA</span>}
      <div className="flex items-start justify-between gap-2">
        <p className="truncate font-display text-lg font-semibold text-royal-gold">{w.name}</p>
        <span className="shrink-0 rounded-full border border-royal-gold/40 px-2 py-0.5 font-caps text-[9px] tracking-widest text-cream/80">{w.attend.toUpperCase()}</span>
      </div>
      <p className="mt-2 whitespace-pre-line break-words font-display text-[0.98rem] italic leading-relaxed text-ivory/90">"{w.message}"</p>
      <p className="mt-2 text-[10px] text-cream/55">{fmt.format(new Date(w.created_at))}</p>
    </motion.article>
  );
}

export function WishList({ wishes, highlightId }: { wishes: Wish[]; highlightId?: string | null }) {
  if (!wishes.length) return <p className="font-display text-base italic text-cream/70">Belum ada ucapan. Jadilah yang pertama mengirim doa.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AnimatePresence initial={false}>
        {wishes.map((w, i) => (
          <WishCard key={w.id} w={w} i={i} highlight={w.id === highlightId} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function WishWallHeader() {
  return (
    <>
      <p className="font-caps text-[10px] uppercase tracking-[0.38em] text-royal-gold-light/75 sm:text-xs">Untuk {WEDDING.bride} & {WEDDING.groom}</p>
      <h1 className="mt-2 font-display text-[2.1rem] font-bold leading-tight text-royal-gold sm:text-5xl">Dinding Ucapan & Doa</h1>
      <FiligreeDivider className="glint mx-auto mt-2 opacity-90" style={{ height: 22, width: 190 }} />
    </>
  );
}

/** Full-screen page opened inside the invitation right after a guest sends a wish. */
export function WishWallOverlay({ highlightId, onClose }: { highlightId: string | null; onClose: () => void }) {
  const { data: wishes = [], isLoading } = useQuery(wishesQuery);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [onClose]);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Dinding ucapan dan doa"
      className="page-scroll fixed inset-0 z-50 overflow-y-auto bg-royal-navy"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <PetalRain count={10} seed={7} className="fixed" />
      <Twinkles count={10} seed={3} className="fixed" />
      <div className="sticky top-0 z-10 border-b border-royal-gold/30 bg-night/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-cream/90 hover:text-ivory">
            <ArrowLeft className="h-4 w-4" /> Kembali ke undangan
          </button>
          <Link to="/ucapan" target="_blank" className="font-caps text-[10px] tracking-widest text-royal-gold-light hover:text-royal-gold">BUKA HALAMAN</Link>
        </div>
      </div>
      <div className="relative mx-auto max-w-3xl px-5 py-12 text-center">
        <WishWallHeader />
        {highlightId && (
          <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-royal-gold/50 bg-royal-wine-deep/60 px-4 py-2 text-sm text-cream/90">
            <Heart className="h-4 w-4 fill-current text-royal-gold" aria-hidden /> Terima kasih! Ucapan Anda kini bisa dibaca semua tamu.
          </motion.p>
        )}
        <div className="mt-8">
          <WishStats wishes={wishes} />
        </div>
        <div className="mt-8">{isLoading ? <p className="text-sm text-cream/70">Memuat ucapan…</p> : <WishList wishes={wishes} highlightId={highlightId} />}</div>
        <button onClick={onClose} className="btn-gold mt-10 px-8 py-3 text-sm">Kembali ke Undangan</button>
      </div>
    </motion.div>
  );
}
