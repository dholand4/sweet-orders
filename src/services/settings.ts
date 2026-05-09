import { createSupabaseServerClient } from "@/lib/supabase";

export type StoreSettings = {
  id?: string;
  whatsapp:   string;
  store_name: string;
};

const FALLBACK: StoreSettings = {
  whatsapp:   process.env.NEXT_PUBLIC_STORE_WHATSAPP ?? "",
  store_name: "Dany Ruivo - Bolos e Tortas",
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("store_settings")
      .select("id, whatsapp, store_name")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data;
  } catch {}
  return FALLBACK;
}
