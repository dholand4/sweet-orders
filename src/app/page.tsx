import { HomeView } from "@/view/home";
import { getPublicCatalog } from "@/services/options";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getPublicCatalog();
  return <HomeView catalog={catalog} />;
}
