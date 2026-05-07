"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrdersTable } from "@/components/OrdersTable";
import type { AdminOrder } from "@/@types/orders";

type AdminOrdersViewProps = {
  orders: AdminOrder[];
  selectedStatus: string;
};

export function AdminOrdersView({ orders, selectedStatus }: AdminOrdersViewProps) {
  const router = useRouter();

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 15000);
    return () => window.clearInterval(id);
  }, [router]);

  return <OrdersTable orders={orders} selectedStatus={selectedStatus} />;
}
