import { AdminLayout } from "@/components/AdminLayout";
import { ReportsView } from "@/view/admin-reports";

export const dynamic = "force-dynamic";

export default function RelatoriosPage() {
  return (
    <AdminLayout title="Relatório de Vendas">
      <ReportsView />
    </AdminLayout>
  );
}
