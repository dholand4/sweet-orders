import { HomeView } from "@/view/home";
import { getPublicCatalog } from "@/services/options";
import { getStoreSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [catalog, settings] = await Promise.all([
    getPublicCatalog(),
    getStoreSettings(),
  ]);
  return <HomeView catalog={catalog} storeWhatsapp={settings.whatsapp} />;
}
