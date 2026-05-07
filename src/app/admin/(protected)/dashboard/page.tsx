import { AdminLayout } from "@/components/AdminLayout";
import { DashboardView } from "@/view/admin-dashboard";
import { getOrderStats, getOrders } from "@/services/orders";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getOrderStats(),
    getOrders(),
  ]);

  const recent = recentOrders.slice(0, 8);

  return (
    <AdminLayout title="Dashboard">
      <DashboardView stats={stats} recentOrders={recent} />
    </AdminLayout>
  );
}
