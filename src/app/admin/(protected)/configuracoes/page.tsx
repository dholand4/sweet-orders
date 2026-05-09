import { AdminLayout } from "@/components/AdminLayout";
import { SettingsView } from "@/view/admin-settings";
import { getStoreSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const settings = await getStoreSettings();
  return (
    <AdminLayout title="Configurações da Loja">
      <SettingsView settings={settings} />
    </AdminLayout>
  );
}
