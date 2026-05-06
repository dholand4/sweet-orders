import { HomeView } from "@/view/home";
import { getPublicOptionsSnapshot } from "@/services/options";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const options = await getPublicOptionsSnapshot();

  return <HomeView options={options} />;
}
