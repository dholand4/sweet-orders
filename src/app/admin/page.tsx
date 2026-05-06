import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginView } from "@/view/admin-login";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin/pedidos");
  }

  return <AdminLoginView />;
}
