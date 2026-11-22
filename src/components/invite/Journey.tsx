import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import film from "@/assets/garden-transition.mp4.asset.json";
import poster from "@/assets/garden-transition-poster.webp.asset.json";

/**
 * The cinematic transition between the cover door and the main page: one film, played full-bleed.
 *   0–2s   the couple walks hand in hand down the sunlit garden path toward the rose arch
 *   2–4s   they sit together on the bench beneath the arch
 *   4–7s   rabbits, fawns, squirrels and a hedgehog gather around them
 *   7–9s   butterflies flutter in; the couple looks up
 *   9–10s  a great butterfly flies at the lens until its wings fill the screen
 * The main page mounts underneath just before the last frame, then the film dissolves into it.
 * The film is mounted (and buffering) while the guest is still on the cover, so it starts instantly.
 */

/** Seconds after the tap — the moment the doorway light in the cover begins to open. */
const PLAY_AT = 0.9;
/** Film time at which the great butterfly starts flying at the lens — the frame grows to fill tall screens. */
const ZOOM_AT = 8.6;
/** Mount the main page this many seconds before the film ends, so it is painted when revealed. */
const MAIN_LEAD = 0.8;
/** Dissolve from the butterfly's wings into the main page. */
const FADE = 1.2;
/** Never keep a guest waiting on a stalled network. */
const SAFETY = 30;

export function Journey({ playing, onCovered, onDone }: { playing: boolean; onCovered: () => void; onDone: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const ambient = useRef<HTMLCanvasElement>(null);
  const [ending, setEnding] = useState(false);
  const [zoom, setZoom] = useState(1);
  const cb = useRef({ onCovered, onDone });
  cb.current = { onCovered, onDone };
  const covered = useRef(false);

  const cover = useCallback(() => {
    if (covered.current) return;
    covered.current = true;
    cb.current.onCovered();
  }, []);

  const finish = useCallback(() => {
    cover();
    setEnding(true);
  }, [cover]);

  useEffect(() => {
    const v = video.current;
    if (v) { v.muted = true; v.defaultMuted = true; }
  }, []);

  /** Mirror the film into a tiny canvas that, blurred, fills the space around the band on tall phones. */
  useEffect(() => {
    const v = video.current;
    const ctx = ambient.current?.getContext("2d");
    if (!v || !ctx) return;
    let raf = 0;
    const draw = () => { if (v.readyState >= 2) ctx.drawImage(v, 0, 0, 32, 18); };
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    const start = () => { cancelAnimationFrame(raf); loop(); };
    const stop = () => { cancelAnimationFrame(raf); draw(); };
    v.addEventListener("loadeddata", draw);
    v.addEventListener("play", start);
    v.addEventListener("pause", stop);
    v.addEventListener("ended", stop);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadeddata", draw);
      v.removeEventListener("play", start);
      v.removeEventListener("pause", stop);
      v.removeEventListener("ended", stop);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      const v = video.current;
      if (!v) return finish();
      v.muted = true;
      v.currentTime = 0;
      v.play().catch(() => timers.push(window.setTimeout(finish, 1500)));
    }, PLAY_AT * 1000));
    timers.push(window.setTimeout(finish, SAFETY * 1000));
    return () => timers.forEach(clearTimeout);
  }, [playing, finish]);

  const onTime = () => {
    const v = video.current;
    if (!v) return;
    if (zoom === 1 && v.currentTime >= ZOOM_AT && v.offsetWidth && v.offsetHeight) {
      const fill = Math.max(window.innerWidth / v.offsetWidth, window.innerHeight / v.offsetHeight);
      if (fill > 1.01) setZoom(fill);
    }
    if (v.duration && v.currentTime >= v.duration - MAIN_LEAD) cover();
  };

  const skip = () => {
    video.current?.pause();
    cover();
    cb.current.onDone();
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden bg-night"
      initial={false}
      animate={ending ? { opacity: 0, scale: 1.06, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: FADE, ease: [0.45, 0, 0.25, 1] }}
      onAnimationComplete={() => { if (ending) cb.current.onDone(); }}
      aria-hidden={!playing}
    >
      <canvas ref={ambient} width={32} height={18} aria-hidden className="film-ambient" />
      <video
        ref={video}
        src={film.url}
        poster={poster.url}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        onTimeUpdate={onTime}
        onEnded={finish}
        className={`film-frame${zoom > 1 ? " film-zoom" : ""}`}
        style={{ scale: zoom }}
        aria-label="Kedua mempelai berjalan di taman, duduk di bangku di bawah lengkung bunga, dikelilingi hewan dan kupu-kupu"
      />

      {playing && !ending && (
        <button onClick={skip} className="btn-ghost-gold absolute bottom-6 right-6 z-30 px-4 py-1.5 text-[11px] uppercase tracking-widest backdrop-blur">
          Lewati
        </button>
      )}
    </motion.div>
  );
}
