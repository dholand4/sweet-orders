import { FlavorsView } from "@/view/admin-flavors";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SaboresPage() {
  const supabase = createSupabaseServerClient();
  const { data: flavors } = await supabase
    .from("flavor_options")
    .select("*")
    .order("sort_order");

  return <FlavorsView flavors={flavors ?? []} />;
}
