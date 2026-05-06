import { getAdminOptionsSnapshot } from "@/services/options";
import { AdminOptionsView } from "@/view/admin-options";

export const dynamic = "force-dynamic";

export default async function AdminOptionsPage() {
  const snapshot = await getAdminOptionsSnapshot();

  return <AdminOptionsView snapshot={snapshot} />;
}
