import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateWish, type Wish, type WishInput } from "./wish-rules";

export type { Wish, WishInput } from "./wish-rules";

export const wishesQuery = queryOptions({
  queryKey: ["wishes"],
  queryFn: async (): Promise<Wish[]> => {
    const { data, error } = await supabase.from("wishes").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error("Ucapan belum bisa dimuat.");
    return data;
  },
  staleTime: 15_000,
});

export async function sendWish(input: WishInput): Promise<Wish> {
  const v = validateWish(input);
  if (!v.ok) throw new Error(v.error);
  const { data, error } = await supabase.from("wishes").insert(v.value).select().single();
  if (error) throw new Error("Ucapan belum terkirim. Coba lagi sebentar.");
  return data;
}
