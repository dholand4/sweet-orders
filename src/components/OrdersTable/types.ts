import type { AdminOrder } from "@/@types/orders";

export type OrdersTableProps = {
  orders: AdminOrder[];
  selectedStatus: string;
};
