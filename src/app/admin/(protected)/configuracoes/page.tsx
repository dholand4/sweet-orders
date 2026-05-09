import { SettingsView } from "@/view/admin-settings";
import { getStoreSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const settings = await getStoreSettings();
  return <SettingsView settings={settings} />;
}
