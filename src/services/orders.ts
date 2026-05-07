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
      product_id, product_size_id,
      flavor_1_id, flavor_2_id, topping_1_id, topping_2_id,
      decoration_style_id
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "todos") {
    query = query.eq("status", status);
  }

  const { data: rows, error } = await query;

  if (error) {
    throw new Error(`Falha ao carregar pedidos: ${error.message}`);
  }

  if (!rows || rows.length === 0) return [];

  const productIds  = [...new Set(rows.map((r) => r.product_id).filter(Boolean))];
  const sizeIds     = [...new Set(rows.map((r) => r.product_size_id).filter(Boolean))];
  const decoIds     = [...new Set(rows.map((r) => r.decoration_style_id).filter(Boolean))];
  const flavorIds   = [...new Set([
    ...rows.map((r) => r.flavor_1_id),
    ...rows.map((r) => r.flavor_2_id),
    ...rows.map((r) => r.topping_1_id),
    ...rows.map((r) => r.topping_2_id),
  ].filter(Boolean))];

  const [products, sizes, flavors, decoStyles] = await Promise.all([
    productIds.length
      ? supabase.from("products").select("id, name, type").in("id", productIds)
      : { data: [] },
    sizeIds.length
      ? supabase.from("product_sizes").select("id, name, servings, price").in("id", sizeIds)
      : { data: [] },
    flavorIds.length
      ? supabase.from("flavor_options").select("id, name").in("id", flavorIds)
      : { data: [] },
    decoIds.length
      ? supabase.from("decoration_styles").select("id, name, price_type, price_extra").in("id", decoIds)
      : { data: [] },
  ]);

  const pMap = Object.fromEntries((products.data ?? []).map((p) => [p.id, p]));
  const sMap = Object.fromEntries((sizes.data ?? []).map((s) => [s.id, s]));
  const fMap = Object.fromEntries((flavors.data ?? []).map((f) => [f.id, f]));
  const dMap = Object.fromEntries((decoStyles.data ?? []).map((d) => [d.id, d]));

  return rows.map((item) => ({
    ...item,
    total_price:      Number(item.total_price),
    product:          item.product_id          ? pMap[item.product_id]          ?? null : null,
    product_size:     item.product_size_id     ? sMap[item.product_size_id]     ?? null : null,
    flavor_1:         item.flavor_1_id         ? fMap[item.flavor_1_id]         ?? null : null,
    flavor_2:         item.flavor_2_id         ? fMap[item.flavor_2_id]         ?? null : null,
    topping_1:        item.topping_1_id        ? fMap[item.topping_1_id]        ?? null : null,
    topping_2:        item.topping_2_id        ? fMap[item.topping_2_id]        ?? null : null,
    decoration_style: item.decoration_style_id ? dMap[item.decoration_style_id] ?? null : null,
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
