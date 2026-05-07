import { AdminLayout } from "@/components/AdminLayout";
import { FlavorsView } from "@/view/admin-flavors";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SaboresPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("flavor_options")
    .select("*")
    .order("sort_order");

  return (
    <AdminLayout title="Sabores & Coberturas">
      <FlavorsView flavors={data ?? []} />
    </AdminLayout>
  );
}
