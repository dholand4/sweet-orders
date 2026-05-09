import { AdminLayout } from "@/components/AdminLayout";
import { TemasView } from "@/view/admin-temas";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TemasPage() {
  const supabase = createSupabaseServerClient();
  const { data: decoStyles } = await supabase
    .from("decoration_styles")
    .select("*")
    .order("sort_order");

  return (
    <AdminLayout title="Estilos de Tema">
      <TemasView decoStyles={decoStyles ?? []} />
    </AdminLayout>
  );
}
