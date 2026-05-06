"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { OrdersTable } from "@/components/OrdersTable";
import type { AdminOrder } from "@/@types/orders";
import { Heading, Text, Title, Wrapper } from "./style";

type AdminOrdersViewProps = {
  orders: AdminOrder[];
  selectedStatus: string;
};

export function AdminOrdersView({
  orders,
  selectedStatus,
}: AdminOrdersViewProps) {
  return (
    <AdminLayout
      title="Pedidos recentes"
      description="Acompanhe solicitações, confirme no WhatsApp e atualize o andamento com agilidade."
    >
      <Wrapper>
        <Heading>
          <Title>Central de pedidos</Title>
          <Text>
            Filtre por status, revise os detalhes e conduza a confirmação manual
            com mensagens prontas para o WhatsApp.
          </Text>
        </Heading>
        <OrdersTable orders={orders} selectedStatus={selectedStatus} />
      </Wrapper>
    </AdminLayout>
  );
}
