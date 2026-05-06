import type { AdminOrder } from "@/@types/orders";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function getOrders(status?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("orders")
    .select(
      `
        id,
        customer_name,
        whatsapp,
        theme,
        notes,
        delivery_date,
        delivery_time,
        street,
        number,
        district,
        city,
        reference,
        status,
        total_price,
        created_at,
        product_type:product_types(id, name),
        product_size:product_sizes(id, name, servings, price),
        flavor:flavors(id, name),
        filling:fillings(id, name),
        topping:toppings(id, name)
      `,
    )
    .order("created_at", { ascending: false });

  if (status && status !== "todos") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Falha ao carregar pedidos.");
  }

  return (data ?? []).map((item) => ({
    ...item,
    product_type: Array.isArray(item.product_type)
      ? item.product_type[0] ?? null
      : item.product_type,
    product_size: Array.isArray(item.product_size)
      ? item.product_size[0] ?? null
      : item.product_size,
    flavor: Array.isArray(item.flavor) ? item.flavor[0] ?? null : item.flavor,
    filling: Array.isArray(item.filling) ? item.filling[0] ?? null : item.filling,
    topping: Array.isArray(item.topping) ? item.topping[0] ?? null : item.topping,
  })) as AdminOrder[];
}
