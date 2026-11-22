/** Pure rules for guest wishes (Kartu Ucapan & Doa) — no network, so they can be unit-tested. */
export type Wish = { id: string; name: string; attend: string; guests: number; message: string; created_at: string };
export type WishInput = { name: string; attend: string; guests: number; message: string };

export const ATTEND_OPTIONS = ["Hadir", "Tidak Hadir", "Masih Ragu"] as const;
export const NAME_MAX = 60;
export const MESSAGE_MAX = 500;
export const GUESTS_MAX = 10;

export function validateWish(i: WishInput): { ok: true; value: WishInput } | { ok: false; error: string } {
  const name = i.name.trim();
  const message = i.message.trim();
  if (!name) return { ok: false, error: "Mohon isi nama Anda." };
  if (name.length > NAME_MAX) return { ok: false, error: `Nama maksimal ${NAME_MAX} karakter.` };
  if (!message) return { ok: false, error: "Mohon tulis ucapan & doa Anda." };
  if (message.length > MESSAGE_MAX) return { ok: false, error: `Ucapan maksimal ${MESSAGE_MAX} karakter.` };
  if (!(ATTEND_OPTIONS as readonly string[]).includes(i.attend)) return { ok: false, error: "Pilih status kehadiran." };
  if (!Number.isInteger(i.guests) || i.guests < 1 || i.guests > GUESTS_MAX) return { ok: false, error: "Jumlah tamu tidak valid." };
  return { ok: true, value: { name, attend: i.attend, guests: i.guests, message } };
}

/** Adds a wish to a list without duplicates (realtime + own insert can both deliver it), newest first. */
export function mergeWish(list: Wish[] | undefined, w: Wish): Wish[] {
  const rest = (list ?? []).filter((x) => x.id !== w.id);
  return [w, ...rest].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/** Number of people confirmed as attending (sum of guests on "Hadir" wishes). */
export function attendingCount(list: Wish[]): number {
  return list.reduce((n, w) => (w.attend === "Hadir" ? n + w.guests : n), 0);
}

/**
 * Signed distance of card `i` from the active card on a looping ring of `n` cards,
 * taking the shorter way round (e.g. with 10 cards, card 9 sits just left of card 0: -1).
 */
export function ringOffset(i: number, active: number, n: number): number {
  if (n <= 0) return 0;
  let d = (((i - active) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}
