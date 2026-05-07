import type { AdminOrder } from "@/@types/orders";
import { createSupabaseServerClient } from "@/lib/supabase";

function unwrap<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getOrders(status?: string): Promise<AdminOrder[]> {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("orders")
    .select(`
      id, customer_name, whatsapp, theme, notes,
      delivery_date, delivery_time, cep,
      street, number, district, city, reference,
      dough_type, status, total_price, created_at,
      product:products(id, name, type),
      product_size:product_sizes(id, name, servings, price),
      flavor_1:flavor_options!orders_flavor_1_id_fkey(id, name),
      flavor_2:flavor_options!orders_flavor_2_id_fkey(id, name),
      topping_1:flavor_options!orders_topping_1_id_fkey(id, name),
      topping_2:flavor_options!orders_topping_2_id_fkey(id, name)
    `)
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
    total_price: Number(item.total_price),
    product:      unwrap(item.product),
    product_size: unwrap(item.product_size),
    flavor_1:     unwrap(item.flavor_1),
    flavor_2:     unwrap(item.flavor_2),
    topping_1:    unwrap(item.topping_1),
    topping_2:    unwrap(item.topping_2),
  })) as AdminOrder[];
}

export async function getOrderStats() {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { count: total },
    { count: novo },
    { count: confirmado },
    { data: revenue },
    { count: today_count },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "novo"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "confirmado"),
    supabase.from("orders").select("total_price").in("status", ["confirmado", "finalizado"]),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("delivery_date", today),
  ]);

  const totalRevenue = (revenue ?? []).reduce((sum, o) => sum + Number(o.total_price), 0);

  return {
    total:       total ?? 0,
    novo:        novo ?? 0,
    confirmado:  confirmado ?? 0,
    totalRevenue,
    todayOrders: today_count ?? 0,
  };
}
