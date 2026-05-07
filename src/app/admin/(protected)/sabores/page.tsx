import { AdminLayout } from "@/components/AdminLayout";
import { FlavorsView } from "@/view/admin-flavors";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SaboresPage() {
  const supabase = createSupabaseServerClient();
  const [{ data: flavors }, { data: decoStyles }] = await Promise.all([
    supabase.from("flavor_options").select("*").order("sort_order"),
    supabase.from("decoration_styles").select("*").order("sort_order"),
  ]);

  return (
    <AdminLayout title="Sabores & Estilos">
      <FlavorsView
        flavors={flavors ?? []}
        decoStyles={decoStyles ?? []}
        flavorsOnly={flavors ?? []}
      />
    </AdminLayout>
  );
}
