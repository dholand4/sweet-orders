import { getOrders } from "@/services/orders";
import { AdminOrdersView } from "@/view/admin-orders";

export const dynamic = "force-dynamic";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const orders = await getOrders(status);

  return <AdminOrdersView orders={orders} selectedStatus={status ?? "todos"} />;
}
